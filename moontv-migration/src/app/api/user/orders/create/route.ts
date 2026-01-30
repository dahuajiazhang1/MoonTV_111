import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthInfoFromCookie } from '@/lib/auth';
import type { PaymentOrder } from '@/lib/types';

export const runtime = 'edge';

/**
 * 创建订单（用户端）
 * POST /api/user/orders/create
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const authInfo = getAuthInfoFromCookie(request);
    if (!authInfo || !authInfo.username) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, paymentProof } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: '缺少套餐ID' },
        { status: 400 }
      );
    }

    if (!paymentProof) {
      return NextResponse.json(
        { success: false, error: '请上传支付凭证' },
        { status: 400 }
      );
    }

    // 获取套餐信息
    const plan = await db.getPlanById(Number(planId));
    if (!plan) {
      return NextResponse.json(
        { success: false, error: '套餐不存在' },
        { status: 404 }
      );
    }

    if (!plan.is_active) {
      return NextResponse.json(
        { success: false, error: '该套餐已下架' },
        { status: 400 }
      );
    }

    // 生成订单号
    const orderNo = `ORD${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // 获取支付设置（用于订单过期时间）
    const paymentSettings = await db.getPaymentSettings();
    const expireHours = paymentSettings?.order_expire_hours || 24;
    const expiresAt = new Date(
      Date.now() + expireHours * 60 * 60 * 1000
    ).toISOString();

    // 创建订单
    const order: PaymentOrder = {
      order_no: orderNo,
      username: authInfo.username,
      order_type: 'subscription',
      related_id: plan.id,
      amount: plan.price,
      payment_method: 'alipay',
      payment_status: 'pending',
      payment_proof: paymentProof, // Base64 图片
      paid_at: new Date().toISOString(),
      expires_at: expiresAt,
    };

    await db.createOrder(order);

    return NextResponse.json({
      success: true,
      orderNo,
      message: '订单创建成功，请等待管理员审核',
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建订单失败',
      },
      { status: 500 }
    );
  }
}
