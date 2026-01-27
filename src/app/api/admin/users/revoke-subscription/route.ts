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

export async function POST(request: NextRequest) {
    if (!(await checkAdminAuth(request))) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { userId, username } = body;

        if (!userId && !username) {
            return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
        }

        // 查找用户ID
        let targetUserId = userId;
        if (!targetUserId && username) {
            // 暂时没有直接通过 username 获取 ID 的公开接口，但 d1.db.ts 内部有。
            // 我们可以通过 search/get all users 变通，或者假设前端传来 userId。
            // 由于 OrderManager 中 payment_orders 表包含 user_id，前端应该能传 userId。
            // 这里为了健壮性，如果没传 userId，暂时报错，要求前端传 userId。
            // Reviewing OrderManager, `PaymentOrder` has `user_id`.
        }

        if (!targetUserId) {
            return NextResponse.json({ error: '必须提供用户ID' }, { status: 400 });
        }

        // 执行取消订阅操作
        // 直接操作数据库更新状态
        // 由于 db.ts 接口限制，我们需要一个取消订阅的方法。
        // 查看 db.ts，发现 createUserSubscription 会把旧的 active 改为 cancelled。
        // 但我们需要显式取消。
        // 我们可以复用 updateUserSubscription，但它需要 id。
        // 或者我们添加一个 revokeUserSubscription 方法到 db.ts / d1.db.ts?
        // 为了避免修改 db interface (User request limit), 我们可以使用 `updateUserSubscription` if we can get the subscription id.
        // 但是 getUserSubscription 只返回 active 的。

        // 让我们看看 getUserSubscription 返回什么: `id` is in `UserSubscription`.
        // 所以逻辑是:
        // 1. Get user name (if we only have ID, we might need to find name, but getUserSubscription takes name).
        // Wait, `getUserSubscription` takes `username`. `PaymentOrder` has `username`.

        let targetUsername = username;
        if (!targetUsername) {
            // force frontend to send username
            return NextResponse.json({ error: '必须提供用户名' }, { status: 400 });
        }

        const sub = await db.getUserSubscription(targetUsername);
        if (!sub) {
            return NextResponse.json({ error: '该用户当前无有效订阅' }, { status: 404 });
        }

        // Update status to cancelled
        await db.updateUserSubscription({
            id: sub.id,
            plan_id: sub.plan_id, // required by type but not used in update SQL
            status: 'cancelled',
            start_date: sub.start_date,
            end_date: new Date().toISOString(), // 立即结束
            auto_renew: false
        });

        return NextResponse.json({ success: true, message: '已停止用户观看权限' });

    } catch (error) {
        console.error('停止观看失败:', error);
        return NextResponse.json(
            { error: '操作失败' },
            { status: 500 }
        );
    }
}
