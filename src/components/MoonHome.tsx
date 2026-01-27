'use client';

import { Suspense, useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import ScrollableRow from '@/components/ScrollableRow';
import { Clock } from 'lucide-react';

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
        console.log('MoonTV MoonHome v1.0.10-RESTORE-SCROLL LOADED');
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

                {/* Continue Watching Section - RESTORED SCROLL v1.0.10 */}
                <ScrollableRow>
                     <div className="w-[300px] flex-shrink-0 snap-start">
                         <div className="h-48 bg-gray-800 rounded-xl flex items-center justify-center border border-green-500 text-green-500">
                            Debug: Real ScrollableRow Element
                         </div>
                     </div>
                     <div className="w-[300px] flex-shrink-0 snap-start">
                         <div className="h-48 bg-gray-800 rounded-xl flex items-center justify-center border border-green-500 text-green-500">
                            Debug: Real ScrollableRow Element 2
                         </div>
                     </div>
                </ScrollableRow>

                {/* Video Cards Section - DISABLED */}
                 <div className="px-4 text-center text-gray-500 mt-10">
                    <div>Debugging Mode: ScrollableRow Active. VideoCard disabled.</div>
                 </div>
            </div>
        </PageLayout>
    );
}
