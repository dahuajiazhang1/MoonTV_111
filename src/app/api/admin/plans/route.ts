import { NextRequest, NextResponse } from 'next/server';

import { getAuthInfoFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubscriptionPlan } from '@/lib/types';

export const runtime = 'edge';

// 验证管理员权限
async function checkAdminAuth(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return false;
  }

  // 1. 优先检查数据库中的角色
  try {
    const user = await db.getUser(authInfo.username);
    if (user && (user.role === 'admin' || user.role === 'owner')) {
      return true;
    }
  } catch (e) {
    console.error('Check admin auth failed:', e);
  }

  // 2. 只有在数据库查询失败或未找到用户时（理论上不应发生），才回退到环境变量检查作为兜底
  //    虽然不建议，但为了防止管理员被锁在外面，保留 process.env.USERNAME 检查
  return authInfo.username === process.env.USERNAME;
}

// 获取所有套餐（包括未激活的）
export async function GET(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
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
  if (!(await checkAdminAuth(request))) {
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
