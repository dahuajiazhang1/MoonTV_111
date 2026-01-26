'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/PageLayout';
import CapsuleSwitch from '@/components/CapsuleSwitch';
import { Clock } from 'lucide-react';

// Dynamically import heavy components
// const ContinueWatching = dynamic(() => import('@/components/ContinueWatching'), {
//     ssr: false,
//     loading: () => <div className="h-48 bg-gray-900/50 rounded-xl animate-pulse" />
// });

// Mock ScrollableRow to avoid complex dependencies for now
const ScrollableRow = ({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) => (
    <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-4">
            {icon}
            <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4">
            {children}
        </div>
    </div>
);

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
        console.log('MoonTV MoonHome v1.0.6-FIX-CAPSULE LOADED');
    }, []);

    return (
        <PageLayout>
            <div className="relative min-h-screen pb-20">
                {/* Capsule Switch - RESTORED */}
                <div className="mt-8 mb-4">
                    <CapsuleSwitch
                        options={TABS}
                        active={activeTab}
                        onChange={setActiveTab}
                    />
                </div>

                {/* Continue Watching Section - DISABLED */}
                {/* <ScrollableRow title="继续观看" icon={<Clock className="w-5 h-5 text-purple-400" />}>
                     <div className="w-[300px] flex-shrink-0 snap-start">
                         <div className="border border-red-500 p-4 text-white">
                            Debug: ContinueWatching Placeholder
                         </div>
                     </div>
                </ScrollableRow> */}

                {/* Video Cards Section - DISABLED */}
                <div className="px-4 text-center text-gray-500 mt-10">
                    <div>Debugging Mode: Only CapsuleSwitch is active.</div>
                </div>
            </div>
        </PageLayout>
    );
}
