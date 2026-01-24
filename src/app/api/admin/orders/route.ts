import { NextRequest, NextResponse } from 'next/server';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { getConfig } from '@/lib/config';

export const runtime = 'edge';

async function checkAdminAuth(request: NextRequest): Promise<boolean> {
    const authInfo = getAuthInfoFromCookie(request);
    if (!authInfo || !authInfo.username) {
        return false;
    }
    const username = authInfo.username;
    if (username === process.env.USERNAME) return true;

    const config = await getConfig();
    const user = config.UserConfig.Users.find((u) => u.username === username);
    return user?.role === 'admin' && !user.banned;
}

// 获取所有订单（分页）
export async function GET(request: NextRequest) {
    if (!(await checkAdminAuth(request))) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

    try {
        const result = await db.getAllOrders(page, limit);
        return NextResponse.json(result);
    } catch (error) {
        console.error('获取订单列表失败:', error);
        return NextResponse.json(
            { error: '获取订单列表失败' },
            { status: 500 }
        );
    }
}

// 更新订单状态（审核通过/拒绝）
export async function POST(request: NextRequest) {
    if (!(await checkAdminAuth(request))) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { orderNo, status, reason } = body;

        if (!orderNo || !status) {
            return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: '无效的状态' }, { status: 400 });
        }

        // 获取管理员ID (暂时没有简单的获取管理员ID的方法，除非查表。这里暂时传null或修改db接口支持只传username)
        // 更新 updateOrderStatus 接口，传入 adminId 目前是 number。
        // 我们目前拿不到 adminId，只能拿到 username。
        // 方案：先通过 username 获取 user，或者 modifying db interface.
        // D1Storage.updateOrderStatus accepts adminId?: number.

        // 为了简化，我们先不传 adminId，或者后续通过 username 查。
        // 实际上 d1.db.ts 实现中，adminId 只是存入 verify_by 字段。

        const authInfo = getAuthInfoFromCookie(request);
        // 这里我们做一个临时查询来获取 userId，或者 db 增加 getUserByName helper
        // 实际上 d1.db.ts 有 getUserId(private)。 
        // 我们简单点，先不传 verified_by，或者后续改进。

        await db.updateOrderStatus(orderNo, status, undefined, reason);

        // 如果通过审核，需要激活用户订阅
        if (status === 'approved') {
            const order = await db.getOrder(orderNo);
            if (order && order.order_type === 'subscription' && order.related_id) {
                // 获取套餐信息
                const plan = await db.getPlanById(order.related_id);
                if (plan) {
                    // 计算开始和结束时间
                    const now = new Date();
                    const startDate = now.toISOString();
                    const endDate = new Date(now.getTime() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString();

                    await db.createUserSubscription({
                        user_id: order.user_id,
                        plan_id: plan.id!,
                        status: 'active',
                        start_date: startDate,
                        end_date: endDate,
                        auto_renew: false
                    });
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('更新订单状态失败:', error);
        return NextResponse.json(
            { error: '更新订单状态失败' },
            { status: 500 }
        );
    }
}
