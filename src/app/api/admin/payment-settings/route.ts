import { NextRequest, NextResponse } from 'next/server';

import { getAuthInfoFromCookie } from '@/lib/auth';
import { getConfig } from '@/lib/config';
import { db } from '@/lib/db';
import { PaymentSettings } from '@/lib/types';

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

export async function GET(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const settings = await db.getPaymentSettings();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('获取支付设置失败:', error);
    return NextResponse.json({ error: '获取支付设置失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings: PaymentSettings = {
      id: 1, // 总是使用 ID 1
      alipay_qr_code: body.alipay_qr_code,
      alipay_account_name: body.alipay_account_name,
      payment_notice: body.payment_notice,
      auto_approval: Boolean(body.auto_approval),
      order_expire_hours: Number(body.order_expire_hours || 24),
    };

    await db.savePaymentSettings(settings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存支付设置失败:', error);
    return NextResponse.json({ error: '保存支付设置失败' }, { status: 500 });
  }
}
