import { NextRequest, NextResponse } from 'next/server';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubscriptionPlan } from '@/lib/types';

export const runtime = 'edge';

// 验证管理员权限
function checkAdminAuth(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return false;
  }
  // TODO: 这里应该查数据库确认是否是admin，或者authInfo中应该包含role
  // 目前简单校验用户名是否为 admin 或者环境变量中的 USERNAME
  return (
    authInfo.username === process.env.USERNAME || authInfo.username === 'admin'
  );
}

// 获取所有套餐（包括未激活的）
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const plans = await db.getSubscriptionPlans(true);
    return NextResponse.json(plans);
  } catch (error) {
    console.error('获取套餐列表失败:', error);
    return NextResponse.json({ error: '获取套餐列表失败' }, { status: 500 });
  }
}

// 创建或更新套餐
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 兼容处理 is_active 字段
    let isActive = true; // 默认为 true
    if (body.is_active !== undefined) {
      if (typeof body.is_active === 'boolean') {
        isActive = body.is_active;
      } else if (typeof body.is_active === 'string') {
        isActive = body.is_active === 'true' || body.is_active === '1';
      } else if (typeof body.is_active === 'number') {
        isActive = body.is_active === 1;
      }
    }

    const plan: SubscriptionPlan = {
      id: body.id,
      name: body.name,
      description: body.description,
      duration_days: Number(body.duration_days),
      price: Number(body.price),
      original_price: body.original_price
        ? Number(body.original_price)
        : undefined,
      features:
        typeof body.features === 'object'
          ? JSON.stringify(body.features)
          : body.features,
      is_active: isActive,
      sort_order: Number(body.sort_order || 0),
    };

    if (!plan.name || !plan.duration_days || plan.price === undefined) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    await db.saveSubscriptionPlan(plan);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存套餐失败:', error);
    return NextResponse.json({ error: '保存套餐失败' }, { status: 500 });
  }
}

// 删除套餐（目前未在 interface 中定义 delete 方法，暂时只支持下架）
// 如果需要删除，可以后续添加
