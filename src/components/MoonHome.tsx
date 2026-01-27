'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/PageLayout';
import CapsuleSwitch from '@/components/CapsuleSwitch';
import ScrollableRow from '@/components/ScrollableRow';
import { Clock } from 'lucide-react';
import VideoCard from '@/components/VideoCard';

// Dynamically import heavy components
const ContinueWatching = dynamic(() => import('@/components/ContinueWatching'), {
    ssr: false,
    loading: () => <div className="h-48 bg-gray-900/50 rounded-xl animate-pulse" />
});

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
        console.log('MoonTV MoonHome v1.0.13-RESTORE-ALL LOADED');
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

                {/* Continue Watching Section - RESTORED v1.0.12 */}
                <ScrollableRow>
                    <ContinueWatching />
                </ScrollableRow>

                {/* Video Cards Section - RESTORED v1.0.13 */}
                <div className="px-4">
                    <div className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        最近更新
                    </div>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-14 sm:gap-y-20 px-0 sm:px-2 sm:grid-cols-[repeat(auto-fill,_minmax(11rem,_1fr))] sm:gap-x-8">
                        {/* Placeholder VideoCards to verify component stability */}
                        <VideoCard
                            title="Test Movie 1"
                            poster="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg"
                            year="2024"
                            from="search"
                        />
                        <VideoCard
                            title="Test Movie 2"
                            poster="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg"
                            year="2024"
                            from="search"
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
