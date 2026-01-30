'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [846],
  {
    2846: function (e, t, r) {
      function o() {
        return (
          'showSaveFilePicker' in window &&
          'function' == typeof window.showSaveFilePicker
        );
      }
      async function n(e, t) {
        if (!o()) return null;
        try {
          let t = '.ts';
          e.toLowerCase().endsWith('.mp4')
            ? (t = '.mp4')
            : e.toLowerCase().endsWith('.ts') && (t = '.ts');
          let r = {
              suggestedName: e,
              types: [
                { description: 'Video files', accept: { 'video/*': [t] } },
              ],
            },
            o = await window.showSaveFilePicker(r),
            n = await o.createWritable();
          return new WritableStream({
            async write(e) {
              await n.write(e);
            },
            async close() {
              await n.close();
            },
            async abort(e) {
              await n.abort(e);
            },
          });
        } catch (e) {
          if ('AbortError' === e.name)
            return console.log('用户取消了文件保存'), null;
          return console.error('File System Access API 错误:', e), null;
        }
      }
      function i(e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : 524288e3,
          r = [],
          o = 0;
        return new WritableStream({
          write(e) {
            if ((o += e.length) > t)
              throw Error(
                '文件大小超过限制 ('.concat(
                  Math.round(t / 1024 / 1024),
                  'MB)，'
                ) +
                  '请使用支持 Service Worker 或 File System Access API 的浏览器'
              );
            r.push(e);
          },
          close() {
            let t = new Blob(r, { type: 'application/octet-stream' }),
              o = URL.createObjectURL(t),
              n = document.createElement('a');
            (n.href = o),
              (n.download = e),
              (n.style.display = 'none'),
              document.body.appendChild(n),
              n.click(),
              setTimeout(() => {
                document.body.removeChild(n), URL.revokeObjectURL(o);
              }, 100),
              (r.length = 0);
          },
          abort(e) {
            console.error('下载被中止:', e), (r.length = 0);
          },
        });
      }
      async function c(e, t) {
        if (o()) {
          console.log('使用 File System Access API');
          let r = await n(e, t);
          if (r) return r;
        }
        if (
          'serviceWorker' in navigator &&
          navigator.serviceWorker.controller &&
          window.isSecureContext
        )
          throw (
            (console.log('Service Worker 可用，尝试使用流式下载'),
            Error('USE_SERVICE_WORKER'))
          );
        if (
          (console.warn(
            '当前环境不支持流式下载，使用 Blob 降级方案（可能有内存限制）'
          ),
          t &&
            t > 524288e3 &&
            !confirm(
              '文件较大，可能导致内存不足。建议使用 Chrome/Edge 浏览器或本地部署版本。\n\n是否继续下载？'
            ))
        )
          throw Error('用户取消下载');
        return i(e);
      }
      function a() {
        let e =
          window.location.hostname.includes('pages.dev') ||
          window.location.hostname.includes('.workers.dev') ||
          window.location.hostname.includes('.vercel.app') ||
          window.location.hostname.includes('.netlify.app');
        return o()
          ? { supported: !0, method: 'file-system-access' }
          : 'serviceWorker' in navigator && window.isSecureContext && !e
          ? { supported: !0, method: 'service-worker' }
          : {
              supported: !0,
              method: 'blob',
              limitation: '文件大小限制约 500MB，不支持超大文件',
            };
      }
      r.r(t),
        r.d(t, {
          createAdaptiveWriteStream: function () {
            return c;
          },
          createBlobWriteStream: function () {
            return i;
          },
          createFileSystemWriteStream: function () {
            return n;
          },
          detectStreamingCapability: function () {
            return a;
          },
          supportsFileSystemAccess: function () {
            return o;
          },
        });
    },
  },
]);
