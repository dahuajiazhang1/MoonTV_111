import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const plans = await db.getSubscriptionPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Failed to fetch subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}
