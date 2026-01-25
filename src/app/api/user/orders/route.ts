import { NextRequest, NextResponse } from 'next/server';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { PaymentOrder } from '@/lib/types';

export const runtime = 'edge';

// 获取用户订单列表
export async function GET(request: NextRequest) {
    const authInfo = getAuthInfoFromCookie(request);
    if (!authInfo || !authInfo.username) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const orders = await db.getOrdersByUser(authInfo.username);
        return NextResponse.json(orders);
    } catch (error) {
        console.error('获取订单列表失败:', error);
        return NextResponse.json(
            { error: '获取订单列表失败' },
            { status: 500 }
        );
    }
}

// 创建新订单
export async function POST(request: NextRequest) {
    const authInfo = getAuthInfoFromCookie(request);
    if (!authInfo || !authInfo.username) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { planId, paymentMethod, paymentProof } = body;

        if (!planId) {
            return NextResponse.json({ error: '缺少套餐ID' }, { status: 400 });
        }

        // 获取套餐信息
        const plan = await db.getPlanById(planId);
        if (!plan) {
            return NextResponse.json({ error: '套餐不存在' }, { status: 404 });
        }

        if (!plan.is_active) {
            return NextResponse.json({ error: '套餐已下架' }, { status: 400 });
        }

        // 创建订单对象
        // 修改：直接设置为 approved (模拟自动支付)
        const order: PaymentOrder = {
            order_no: '', // 由数据库层生成
            username: authInfo.username,
            order_type: 'subscription',
            related_id: planId,
            amount: plan.price,
            payment_method: paymentMethod || 'alipay_qr',
            payment_status: 'approved', // 直接通过
            payment_proof: paymentProof || '',
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        };

        const orderNo = await db.createOrder(order);

        // 自动激活会员
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);

        await db.createUserSubscription({
            username: authInfo.username,
            plan_id: plan.id!,
            plan_name: plan.name,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            auto_renew: false,
        });

        return NextResponse.json({
            success: true,
            orderNo: orderNo,
            amount: plan.price,
            message: '会员开通成功！'
        });

    } catch (error) {
        console.error('创建订单失败:', error);
        return NextResponse.json(
            { error: '创建订单失败' },
            { status: 500 }
        );
    }
}
