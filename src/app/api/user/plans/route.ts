import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'edge';

/**
 * 获取可用的订阅套餐（用户端）
 * GET /api/user/plans
 */
export async function GET(request: NextRequest) {
  try {
    // 只返回激活的套餐，按排序字段排序
    const plans = await db.getSubscriptionPlans(false); // false = 只获取激活的

    // 按 sort_order 排序
    const sortedPlans = plans.sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );

    return NextResponse.json({
      success: true,
      plans: sortedPlans,
    });
  } catch (error) {
    console.error('获取套餐列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取套餐列表失败',
      },
      { status: 500 }
    );
  }
}
