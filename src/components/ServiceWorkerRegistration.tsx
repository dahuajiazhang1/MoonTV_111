'use client';

import { useEffect } from 'react';

import { detectStreamingCapability } from '@/lib/stream-saver-fallback';

/**
 * Service Worker 注册组件
 * 用于支持边下边存功能的流式下载
 * 
 * 注意：在 Cloudflare Pages/Vercel/Netlify 等平台上，
 * Service Worker 可能因为构建输出方式不同而无法正常工作。
 * 会自动降级到 File System Access API 或 Blob 方案。
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 🛑 紧急修复：强制注销所有 Service Worker 以清除旧缓存
    // 原有的 SW 可能导致用户一直停留在旧版本代码 (Error 310)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((boolean) => {
            if (boolean) {
              console.log('✅ 已强制注销旧版 Service Worker，清除缓存');
              // 注销后强制刷新一次（可选，防止无限刷新，这里仅打印）
            }
          });
        }
      });
    }
  }, []);

  return null;
}
