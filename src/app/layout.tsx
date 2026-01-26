/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { getConfig } from '@/lib/config';

import ConditionalNav from '../components/ConditionalNav';
import GlobalDownloadManager from '../components/GlobalDownloadManager';
import { GlobalErrorIndicator } from '../components/GlobalErrorIndicator';
import { NavigationLoadingIndicator } from '../components/NavigationLoadingIndicator';
import { NavigationLoadingProvider } from '../components/NavigationLoadingProvider';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
import { SiteProvider } from '../components/SiteProvider';
import SubscriptionAutoUpdate from '../components/SubscriptionAutoUpdate';
import { ThemeProvider } from '../components/ThemeProvider';
import UserOnlineUpdate from '../components/UserOnlineUpdate';

export const runtime = 'edge';

const inter = Inter({ subsets: ['latin'] });

// 动态生成 metadata，支持配置更新后的标题变化
export async function generateMetadata(): Promise<Metadata> {
  let siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MoonTV';
  if (process.env.NEXT_PUBLIC_STORAGE_TYPE !== 'localstorage') {
    const config = await getConfig();
    siteName = config.SiteConfig.SiteName;
  }

  return {
    title: siteName,
    description: '影视聚合',
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';

  let siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MoonTV';
  let announcement =
    process.env.ANNOUNCEMENT ||
    '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。';
  let enableRegister = process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true';
  let doubanProxyType = process.env.NEXT_PUBLIC_DOUBAN_PROXY_TYPE || 'direct';
  let doubanProxy = process.env.NEXT_PUBLIC_DOUBAN_PROXY || '';
  let doubanImageProxyType =
    process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE || 'direct';
  let doubanImageProxy = process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY || '';
  let disableYellowFilter =
    process.env.NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true';
  let danmakuApiBaseUrl =
    process.env.NEXT_PUBLIC_DANMU_API_BASE_URL ||
    '';
  let autoUpdateEnabled = false;
  if (storageType !== 'localstorage') {
    const config = await getConfig();
    siteName = config.SiteConfig.SiteName;
    announcement = config.SiteConfig.Announcement;
    enableRegister = config.UserConfig.AllowRegister;
    doubanProxyType = config.SiteConfig.DoubanProxyType;
    doubanProxy = config.SiteConfig.DoubanProxy;
    doubanImageProxyType = config.SiteConfig.DoubanImageProxyType;
    doubanImageProxy = config.SiteConfig.DoubanImageProxy;
    disableYellowFilter = config.SiteConfig.DisableYellowFilter;
    danmakuApiBaseUrl =
      config.SiteConfig.DanmakuApiBaseUrl || danmakuApiBaseUrl;
    autoUpdateEnabled = config.SubscriptionConfig?.autoUpdate === true;
  }

  // 将运行时配置注入到全局 window 对象，供客户端在运行时读取
  const runtimeConfig = {
    STORAGE_TYPE: process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage',
    ENABLE_REGISTER: enableRegister,
    DOUBAN_PROXY_TYPE: doubanProxyType,
    DOUBAN_PROXY: doubanProxy,
    DOUBAN_IMAGE_PROXY_TYPE: doubanImageProxyType,
    DOUBAN_IMAGE_PROXY: doubanImageProxy,
    DISABLE_YELLOW_FILTER: disableYellowFilter,
    DANMU_API_BASE_URL: danmakuApiBaseUrl,
  };

  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, viewport-fit=cover'
        />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
        {/* 将配置序列化后直接写入脚本，浏览器端可通过 window.RUNTIME_CONFIG 获取 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.RUNTIME_CONFIG = ${JSON.stringify(runtimeConfig)};`,
          }}
        />
        {/* 🛑 强制注销 SW 的内联脚本 - 防止 React 崩溃导致组件无法执行清理 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const FORCE_VERSION = 'v1.0.7-TRUE-VERSION';
                if (localStorage.getItem('vigo_version') !== FORCE_VERSION) {
                  console.log('🚀 正在执行深度缓存清理...', FORCE_VERSION);
                  
                  // 1. 注销 Service Worker
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                      for(let registration of registrations) {
                        registration.unregister();
                        console.log('✅ Service Worker 已注销');
                      }
                    });
                  }

                  // 2. 清除 Cache Storage (最关键)
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (let name of names) {
                        caches.delete(name);
                        console.log('✅ Cache Storage 已清除: ' + name);
                      }
                    });
                  }

                  // 3. 标记并强制刷新
                  localStorage.setItem('vigo_version', FORCE_VERSION);
                  console.log('🔄 即将执行强制刷新...');
                  setTimeout(() => {
                    window.location.reload(true);
                  }, 100);
                } else {
                  console.log('✅ 客户端已是最新版本:', FORCE_VERSION);
                }
              } catch(e) {
                console.error('缓存清理失败', e);
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-200`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ServiceWorkerRegistration />
          <NavigationLoadingProvider>
            <SiteProvider siteName={siteName} announcement={announcement}>
              <NavigationLoadingIndicator />
              <UserOnlineUpdate />

              {/* 条件导航栏 - 根据路径自动判断是否显示 */}
              <ConditionalNav />

              {/* 全局下载管理器 - 只渲染一次，被所有导航栏共享 */}
              <GlobalDownloadManager />

              {/* 页面内容 */}
              <div className='relative w-full'>
                <main
                  className='flex-1 mb-14 md:mb-0'
                  style={{
                    paddingBottom: 'calc(3.5rem + env(safe-area-inset-bottom))',
                  }}
                >
                  {children}
                </main>
              </div>

              <GlobalErrorIndicator />
              {autoUpdateEnabled && <SubscriptionAutoUpdate />}
            </SiteProvider>
          </NavigationLoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
