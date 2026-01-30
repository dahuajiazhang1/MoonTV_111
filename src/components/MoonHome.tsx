'use client';

import { Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { SearchResult } from '@/lib/types';

import PageLayout from '@/components/PageLayout';
// CapsuleSwitch removed as requested
import ScrollableRow from '@/components/ScrollableRow';
import VideoCard from '@/components/VideoCard';

// Dynamically import heavy components
const ContinueWatching = dynamic(
  () => import('@/components/ContinueWatching'),
  {
    ssr: false,
    loading: () => (
      <div className='h-48 bg-gray-900/50 rounded-xl animate-pulse' />
    ),
  }
);

export default function MoonHome() {
  const [videos, setVideos] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('MoonTV MoonHome v1.1.4-REMOVE-CAPSULE LOADED');
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Homepage now only shows latest updates
        const url = '/api/search?stream=0';

        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
          setVideos(data.results);
        } else {
          setVideos([]);
        }
      } catch (e) {
        console.error('Fetch failed', e);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <PageLayout>
      <div className='relative min-h-screen pb-20'>
        <div className='mt-8 mb-4'>{/* Removed CapsuleSwitch */}</div>

        {/* Continue Watching Section - RESTORED v1.0.12 */}
        <ScrollableRow>
          <ContinueWatching />
        </ScrollableRow>

        {/* Video Cards Section - REAL DATA v1.1.0 */}
        <div className='px-4'>
          <div className='text-xl font-bold mb-4 flex items-center gap-2'>
            <Clock className='w-5 h-5' />
            最近更新
          </div>

          {loading ? (
            <div className='flex justify-center py-20'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500'></div>
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-x-2 gap-y-14 sm:gap-y-20 px-0 sm:px-2 sm:grid-cols-[repeat(auto-fill,_minmax(11rem,_1fr))] sm:gap-x-8'>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <VideoCard
                    key={video.id + video.source}
                    id={video.id}
                    title={video.title}
                    poster={video.poster}
                    year={video.year}
                    source={video.source}
                    source_name={video.source_name}
                    episodes={video.episodes?.length}
                    type={video.episodes?.length > 1 ? 'tv' : 'movie'}
                    from='search'
                  />
                ))
              ) : (
                <div className='col-span-full text-center text-gray-500 py-10'>
                  暂无数据
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
