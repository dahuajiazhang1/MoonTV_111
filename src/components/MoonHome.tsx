'use client';

import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';

export default function MoonHome() {
    useEffect(() => {
        console.log('MoonTV MoonHome v1.0.8-BASELINE LOADED');
    }, []);

    return (
        <PageLayout>
            <div className="flex flex-col items-center justify-center min-h-screen pb-20 text-center px-4">
                <div className="text-2xl font-bold mb-4">MoonTV Baseline Check</div>
                <div className="text-gray-500">
                    <p>Current Version: v1.0.8-BASELINE</p>
                    <p className="mt-2 text-sm text-red-500">
                        If you see this, the layout and page wrapper are working correctly.
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                        (CapsuleSwitch is DISABLED)
                    </p>
                </div>
            </div>
        </PageLayout>
    );
}
