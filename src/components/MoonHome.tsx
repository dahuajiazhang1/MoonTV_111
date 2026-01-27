'use client';

import { Suspense, useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import CapsuleSwitch from '@/components/CapsuleSwitch';

const TABS = [
    { label: '最新', value: 'latest' },
    { label: '电影', value: 'movie' },
    { label: '剧集', value: 'tv' },
    { label: '动漫', value: 'comic' },
    { label: '综艺', value: 'variety' },
    { label: '直播', value: 'live' }
];

export default function MoonHome() {
    const [activeTab, setActiveTab] = useState('latest');

    useEffect(() => {
        console.log('MoonTV MoonHome v1.0.9-RESTORE-CAPSULE LOADED');
    }, []);

    return (
        <PageLayout>
            <div className="relative min-h-screen pb-20">
                {/* Capsule Switch - RESTORED v1.0.9 */}
                <div className="mt-8 mb-4">
                    <CapsuleSwitch
                        options={TABS}
                        active={activeTab}
                        onChange={setActiveTab}
                    />
                </div>

                {/* Video Cards Section - DISABLED */}
                <div className="px-4 text-center text-gray-500 mt-10">
                    <div>Debugging Mode: CapsuleSwitch Active. Other components disabled.</div>
                </div>
            </div>
        </PageLayout>
    );
}
