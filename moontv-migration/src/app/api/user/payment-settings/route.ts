import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

/**
 * 获取支付设置（用户端）
 * GET /api/user/payment-settings
 */
export async function GET(request: NextRequest) {
  try {
    const settings = await db.getPaymentSettings();

    // 返回用户需要的支付信息
    return NextResponse.json({
      success: true,
      settings: {
        alipay_qr_code: settings?.alipay_qr_code || null,
        alipay_account_name: settings?.alipay_account_name || null,
        payment_notice:
          settings?.payment_notice ||
          '请完成支付后上传支付凭证，管理员将在24小时内审核。',
      },
    });
  } catch (error) {
    console.error('获取支付设置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取支付设置失败',
      },
      { status: 500 }
    );
  }
}
