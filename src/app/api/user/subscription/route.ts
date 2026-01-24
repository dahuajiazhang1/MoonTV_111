import { NextRequest, NextResponse } from 'next/server';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const authInfo = getAuthInfoFromCookie(request);
    if (!authInfo || !authInfo.username) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const subscription = await db.getUserSubscription(authInfo.username);
        return NextResponse.json(subscription || { status: 'none' });
    } catch (error) {
        console.error('Failed to fetch user subscription:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user subscription' },
            { status: 500 }
        );
    }
}
