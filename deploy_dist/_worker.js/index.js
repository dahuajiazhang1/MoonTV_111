import('node:buffer')
  .then(({ Buffer }) => {
    globalThis.Buffer = Buffer;
  })
  .catch(() => null);

const __ALSes_PROMISE__ = import('node:async_hooks')
  .then(({ AsyncLocalStorage }) => {
    globalThis.AsyncLocalStorage = AsyncLocalStorage;

    const envAsyncLocalStorage = new AsyncLocalStorage();
    const requestContextAsyncLocalStorage = new AsyncLocalStorage();

    globalThis.process = {
      env: new Proxy(
        {},
        {
          ownKeys: () => Reflect.ownKeys(envAsyncLocalStorage.getStore()),
          getOwnPropertyDescriptor: (_, ...args) =>
            Reflect.getOwnPropertyDescriptor(
              envAsyncLocalStorage.getStore(),
              ...args
            ),
          get: (_, property) =>
            Reflect.get(envAsyncLocalStorage.getStore(), property),
          set: (_, property, value) =>
            Reflect.set(envAsyncLocalStorage.getStore(), property, value),
        }
      ),
    };

    globalThis[Symbol.for('__cloudflare-request-context__')] = new Proxy(
      {},
      {
        ownKeys: () =>
          Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()),
        getOwnPropertyDescriptor: (_, ...args) =>
          Reflect.getOwnPropertyDescriptor(
            requestContextAsyncLocalStorage.getStore(),
            ...args
          ),
        get: (_, property) =>
          Reflect.get(requestContextAsyncLocalStorage.getStore(), property),
        set: (_, property, value) =>
          Reflect.set(
            requestContextAsyncLocalStorage.getStore(),
            property,
            value
          ),
      }
    );

    return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
  })
  .catch(() => null);

var st = Object.create;
var U = Object.defineProperty;
var it = Object.getOwnPropertyDescriptor;
var at = Object.getOwnPropertyNames;
var rt = Object.getPrototypeOf,
  ot = Object.prototype.hasOwnProperty;
var T = (t, e) => () => (t && (e = t((t = 0))), e);
var V = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
var ct = (t, e, s, n) => {
  if ((e && typeof e == 'object') || typeof e == 'function')
    for (let a of at(e))
      !ot.call(t, a) &&
        a !== s &&
        U(t, a, {
          get: () => e[a],
          enumerable: !(n = it(e, a)) || n.enumerable,
        });
  return t;
};
var F = (t, e, s) => (
  (s = t != null ? st(rt(t)) : {}),
  ct(
    e || !t || !t.__esModule
      ? U(s, 'default', { value: t, enumerable: !0 })
      : s,
    t
  )
);
var y,
  p = T(() => {
    y = { collectedLocales: [] };
  });
var h,
  u = T(() => {
    h = {
      version: 3,
      routes: {
        none: [
          {
            src: '^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$',
            headers: { Location: '/$1' },
            status: 308,
            continue: !0,
          },
          {
            src: '^/_next/__private/trace$',
            dest: '/404',
            status: 404,
            continue: !0,
          },
          {
            src: '^/_next/data/(.*)$',
            missing: [{ type: 'header', key: 'x-nextjs-data' }],
            transforms: [
              {
                type: 'request.headers',
                op: 'append',
                target: { key: 'x-nextjs-data' },
                args: '1',
              },
            ],
            continue: !0,
          },
          {
            src: '^/404/?$',
            status: 404,
            continue: !0,
            missing: [{ type: 'header', key: 'x-prerender-revalidate' }],
          },
          { src: '^/500$', status: 500, continue: !0 },
          {
            src: '^/fonts/inter-var-latin\\.woff2$',
            headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
            continue: !0,
          },
          {
            src: '^/_next/data/Cv6kxAupJcIFx7uwNyZaB/(.*).json$',
            dest: '/$1',
            override: !0,
            continue: !0,
            has: [{ type: 'header', key: 'x-nextjs-data' }],
          },
          {
            src: '^/index(?:/)?$',
            has: [{ type: 'header', key: 'x-nextjs-data' }],
            dest: '/',
            override: !0,
            continue: !0,
          },
          {
            continue: !0,
            src: '^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|login|warning|api\\/login|api\\/register|api\\/logout|api\\/cron|api\\/server-config|api\\/tvbox\\/config|api\\/tvbox\\/categories|api\\/douban\\/recommends|api\\/admin\\/tvbox).*))(.json)?[\\/#\\?]?$',
            missing: [
              {
                type: 'header',
                key: 'x-prerender-revalidate',
                value: 'd9fdeee92ec7edc2f1498693d65bbcf3',
              },
            ],
            middlewarePath: 'src/middleware',
            middlewareRawSrc: [
              '/((?!_next/static|_next/image|favicon.ico|login|warning|api/login|api/register|api/logout|api/cron|api/server-config|api/tvbox/config|api/tvbox/categories|api/douban/recommends|api/admin/tvbox).*)',
            ],
            override: !0,
          },
          {
            src: '^/$',
            has: [{ type: 'header', key: 'x-nextjs-data' }],
            dest: '/_next/data/Cv6kxAupJcIFx7uwNyZaB/index.json',
            continue: !0,
            override: !0,
          },
          {
            src: '^/((?!_next/)(?:.*[^/]|.*))/?$',
            has: [{ type: 'header', key: 'x-nextjs-data' }],
            dest: '/_next/data/Cv6kxAupJcIFx7uwNyZaB/$1.json',
            continue: !0,
            override: !0,
          },
          {
            src: '^/?$',
            has: [{ type: 'header', key: 'rsc', value: '1' }],
            dest: '/index.rsc',
            headers: {
              vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch',
            },
            continue: !0,
            override: !0,
          },
          {
            src: '^/((?!.+\\.rsc).+?)(?:/)?$',
            has: [{ type: 'header', key: 'rsc', value: '1' }],
            dest: '/$1.rsc',
            headers: {
              vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch',
            },
            continue: !0,
            override: !0,
          },
        ],
        filesystem: [
          {
            src: '^/_next/data/Cv6kxAupJcIFx7uwNyZaB/(.*).json$',
            dest: '/$1',
            continue: !0,
            has: [{ type: 'header', key: 'x-nextjs-data' }],
          },
          {
            src: '^/index(?:/)?$',
            has: [{ type: 'header', key: 'x-nextjs-data' }],
            dest: '/',
            continue: !0,
          },
          { src: '^/index(\\.action|\\.rsc)$', dest: '/', continue: !0 },
          {
            src: '^/\\.prefetch\\.rsc$',
            dest: '/__index.prefetch.rsc',
            check: !0,
          },
          {
            src: '^/(.+)/\\.prefetch\\.rsc$',
            dest: '/$1.prefetch.rsc',
            check: !0,
          },
          { src: '^/\\.rsc$', dest: '/index.rsc', check: !0 },
          { src: '^/(.+)/\\.rsc$', dest: '/$1.rsc', check: !0 },
        ],
        miss: [
          {
            src: '^/_next/static/.+$',
            status: 404,
            check: !0,
            dest: '/_next/static/not-found.txt',
            headers: { 'content-type': 'text/plain; charset=utf-8' },
          },
        ],
        rewrite: [
          {
            src: '^/$',
            has: [{ type: 'header', key: 'x-nextjs-data' }],
            dest: '/_next/data/Cv6kxAupJcIFx7uwNyZaB/index.json',
            continue: !0,
          },
          {
            src: '^/((?!_next/)(?:.*[^/]|.*))/?$',
            has: [{ type: 'header', key: 'x-nextjs-data' }],
            dest: '/_next/data/Cv6kxAupJcIFx7uwNyZaB/$1.json',
            continue: !0,
          },
          {
            src: '^/_next/data/Cv6kxAupJcIFx7uwNyZaB/vip/buy/(?<nxtPplanId>[^/]+?)(?:/)?.json$',
            dest: '/vip/buy/[planId]?nxtPplanId=$nxtPplanId',
          },
          {
            src: '^/vip/buy/(?<nxtPplanId>[^/]+?)(?:\\.rsc)(?:/)?$',
            dest: '/vip/buy/[planId].rsc?nxtPplanId=$nxtPplanId',
          },
          {
            src: '^/vip/buy/(?<nxtPplanId>[^/]+?)(?:/)?$',
            dest: '/vip/buy/[planId]?nxtPplanId=$nxtPplanId',
          },
          {
            src: '^/_next/data/Cv6kxAupJcIFx7uwNyZaB/(.*).json$',
            headers: { 'x-nextjs-matched-path': '/$1' },
            continue: !0,
            override: !0,
          },
          {
            src: '^/_next/data/Cv6kxAupJcIFx7uwNyZaB/(.*).json$',
            dest: '__next_data_catchall',
          },
        ],
        resource: [{ src: '^/.*$', status: 404 }],
        hit: [
          {
            src: '^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|Cv6kxAupJcIFx7uwNyZaB)/.+$',
            headers: { 'cache-control': 'public,max-age=31536000,immutable' },
            continue: !0,
            important: !0,
          },
          {
            src: '^/index(?:/)?$',
            headers: { 'x-matched-path': '/' },
            continue: !0,
            important: !0,
          },
          {
            src: '^/((?!index$).*?)(?:/)?$',
            headers: { 'x-matched-path': '/$1' },
            continue: !0,
            important: !0,
          },
        ],
        error: [
          {
            src: '^/.*$',
            dest: '/_not-found',
            status: 404,
            headers: { 'x-next-error-status': '404' },
          },
          {
            src: '^/.*$',
            dest: '/500',
            status: 500,
            headers: { 'x-next-error-status': '500' },
          },
        ],
      },
      overrides: {
        '500.html': { path: '500', contentType: 'text/html; charset=utf-8' },
        '_error.rsc.json': {
          path: '_error.rsc',
          contentType: 'application/json',
        },
        '_app.rsc.json': { path: '_app.rsc', contentType: 'application/json' },
        '_document.rsc.json': {
          path: '_document.rsc',
          contentType: 'application/json',
        },
        '__next_data_catchall.json': {
          path: '__next_data_catchall',
          contentType: 'application/json',
        },
        '_next/static/not-found.txt': { contentType: 'text/plain' },
      },
      framework: { version: '14.2.30' },
      crons: [{ path: '/api/cron', schedule: '0 1 * * *' }],
    };
  });
var _,
  d = T(() => {
    _ = {
      '/500.html': {
        type: 'override',
        path: '/500.html',
        headers: { 'content-type': 'text/html; charset=utf-8' },
      },
      '/__next_data_catchall.json': {
        type: 'override',
        path: '/__next_data_catchall.json',
        headers: { 'content-type': 'application/json' },
      },
      '/_app.rsc.json': {
        type: 'override',
        path: '/_app.rsc.json',
        headers: { 'content-type': 'application/json' },
      },
      '/_document.rsc.json': {
        type: 'override',
        path: '/_document.rsc.json',
        headers: { 'content-type': 'application/json' },
      },
      '/_error.rsc.json': {
        type: 'override',
        path: '/_error.rsc.json',
        headers: { 'content-type': 'application/json' },
      },
      '/_next/static/Cv6kxAupJcIFx7uwNyZaB/_buildManifest.js': {
        type: 'static',
      },
      '/_next/static/Cv6kxAupJcIFx7uwNyZaB/_ssgManifest.js': { type: 'static' },
      '/_next/static/chunks/108-3be10f6bde6a4868.js': { type: 'static' },
      '/_next/static/chunks/133-714a737122c140b2.js': { type: 'static' },
      '/_next/static/chunks/201.e0d1afbd267e7618.js': { type: 'static' },
      '/_next/static/chunks/280.31d8213986939676.js': { type: 'static' },
      '/_next/static/chunks/325-4bdc0bbc79574fdf.js': { type: 'static' },
      '/_next/static/chunks/333-80a8e38033bcf415.js': { type: 'static' },
      '/_next/static/chunks/429-d579eb6e9a7d9695.js': { type: 'static' },
      '/_next/static/chunks/455-bd46d3dd290015d4.js': { type: 'static' },
      '/_next/static/chunks/623.2666fd8940d2f3f7.js': { type: 'static' },
      '/_next/static/chunks/669-ec1c5eadec87a2eb.js': { type: 'static' },
      '/_next/static/chunks/728-0115b56a90d8285c.js': { type: 'static' },
      '/_next/static/chunks/7b40a773-f9d570e4bfbfcb63.js': { type: 'static' },
      '/_next/static/chunks/846.eec5e05c46a8d142.js': { type: 'static' },
      '/_next/static/chunks/861b9fbb-0db16275e0b8d304.js': { type: 'static' },
      '/_next/static/chunks/878-cfe5185bf6218e13.js': { type: 'static' },
      '/_next/static/chunks/914-6fb843545597f8ec.js': { type: 'static' },
      '/_next/static/chunks/969-40d7677cf3302975.js': { type: 'static' },
      '/_next/static/chunks/app/_not-found/page-85b7eae7ba90bf59.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/admin/page-9a2268cfa5543b36.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/douban/page-480b2aed04bb4569.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/layout-12090c2108ca2fc6.js': { type: 'static' },
      '/_next/static/chunks/app/login/page-aced1a3c33be5a3f.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/not-found-6fa96e27a7af1ef4.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/orders/page-094b065a831aa24f.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/page-a71e8f111109031f.js': { type: 'static' },
      '/_next/static/chunks/app/play/page-03bfa7012ae35200.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/search/page-2a1bee083e111491.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/subscription/page-a18a4f58746d0ebc.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/vip/buy/[planId]/page-f6ad25b9a630afac.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/vip/page-178783993c8d848e.js': {
        type: 'static',
      },
      '/_next/static/chunks/app/warning/page-b84ac05ac20f0d41.js': {
        type: 'static',
      },
      '/_next/static/chunks/da18b9b8-7d8998e19c30d30d.js': { type: 'static' },
      '/_next/static/chunks/framework-6e06c675866dc992.js': { type: 'static' },
      '/_next/static/chunks/main-96292bcb1a8137c2.js': { type: 'static' },
      '/_next/static/chunks/main-app-a356cec7a89d71f4.js': { type: 'static' },
      '/_next/static/chunks/pages/_app-e20a1802c8ee7f75.js': { type: 'static' },
      '/_next/static/chunks/pages/_error-fd6114dbdc76b395.js': {
        type: 'static',
      },
      '/_next/static/chunks/polyfills-42372ed130431b0a.js': { type: 'static' },
      '/_next/static/chunks/webpack-631aaf736d699b4e.js': { type: 'static' },
      '/_next/static/css/7a618acd9b165d37.css': { type: 'static' },
      '/_next/static/css/7cca8e2c5137bd71.css': { type: 'static' },
      '/_next/static/css/bf805ca69a59069e.css': { type: 'static' },
      '/_next/static/media/19cfc7226ec3afaa-s.woff2': { type: 'static' },
      '/_next/static/media/21350d82a1f187e9-s.woff2': { type: 'static' },
      '/_next/static/media/8e9860b6e62d6359-s.woff2': { type: 'static' },
      '/_next/static/media/ba9851c3c22cd980-s.woff2': { type: 'static' },
      '/_next/static/media/c5fe6dc8356a8c31-s.woff2': { type: 'static' },
      '/_next/static/media/df0a9ae256c0569c-s.woff2': { type: 'static' },
      '/_next/static/media/e4af272ccee01ff0-s.p.woff2': { type: 'static' },
      '/_next/static/not-found.txt': { type: 'static' },
      '/favicon.ico': { type: 'static' },
      '/icons/icon-192x192.png': { type: 'static' },
      '/icons/icon-256x256.png': { type: 'static' },
      '/icons/icon-384x384.png': { type: 'static' },
      '/icons/icon-512x512.png': { type: 'static' },
      '/logo.png': { type: 'static' },
      '/manifest.json': { type: 'static' },
      '/mitm.html': { type: 'static' },
      '/robots.txt': { type: 'static' },
      '/screenshot1.png': { type: 'static' },
      '/sw.js': { type: 'static' },
      '/workbox-e9849328.js': { type: 'static' },
      '/_not-found': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/_not-found.func.js',
      },
      '/_not-found.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/_not-found.func.js',
      },
      '/admin': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/admin.func.js',
      },
      '/admin.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/admin.func.js',
      },
      '/api/admin/category': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/category.func.js',
      },
      '/api/admin/category.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/category.func.js',
      },
      '/api/admin/config': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/config.func.js',
      },
      '/api/admin/config.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/config.func.js',
      },
      '/api/admin/config_file': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/config_file.func.js',
      },
      '/api/admin/config_file.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/config_file.func.js',
      },
      '/api/admin/data_migration/export': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/data_migration/export.func.js',
      },
      '/api/admin/data_migration/export.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/data_migration/export.func.js',
      },
      '/api/admin/data_migration/import': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/data_migration/import.func.js',
      },
      '/api/admin/data_migration/import.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/data_migration/import.func.js',
      },
      '/api/admin/group': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/group.func.js',
      },
      '/api/admin/group.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/group.func.js',
      },
      '/api/admin/orders': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/orders.func.js',
      },
      '/api/admin/orders.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/orders.func.js',
      },
      '/api/admin/payment-settings': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/payment-settings.func.js',
      },
      '/api/admin/payment-settings.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/payment-settings.func.js',
      },
      '/api/admin/plans': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/plans.func.js',
      },
      '/api/admin/plans.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/plans.func.js',
      },
      '/api/admin/reset': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/reset.func.js',
      },
      '/api/admin/reset.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/reset.func.js',
      },
      '/api/admin/site': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/site.func.js',
      },
      '/api/admin/site.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/site.func.js',
      },
      '/api/admin/source': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/source.func.js',
      },
      '/api/admin/source.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/source.func.js',
      },
      '/api/admin/subscription': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/subscription.func.js',
      },
      '/api/admin/subscription.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/admin/subscription.func.js',
      },
      '/api/admin/tvbox': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/tvbox.func.js',
      },
      '/api/admin/tvbox.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/tvbox.func.js',
      },
      '/api/admin/user': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/user.func.js',
      },
      '/api/admin/user.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/admin/user.func.js',
      },
      '/api/change-password': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/change-password.func.js',
      },
      '/api/change-password.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/change-password.func.js',
      },
      '/api/config/custom_category': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/config/custom_category.func.js',
      },
      '/api/config/custom_category.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/config/custom_category.func.js',
      },
      '/api/config/sources': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/config/sources.func.js',
      },
      '/api/config/sources.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/config/sources.func.js',
      },
      '/api/cron': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/cron.func.js',
      },
      '/api/cron.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/cron.func.js',
      },
      '/api/detail': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/detail.func.js',
      },
      '/api/detail.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/detail.func.js',
      },
      '/api/douban/categories': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/douban/categories.func.js',
      },
      '/api/douban/categories.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/douban/categories.func.js',
      },
      '/api/douban/recommends': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/douban/recommends.func.js',
      },
      '/api/douban/recommends.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/douban/recommends.func.js',
      },
      '/api/douban': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/douban.func.js',
      },
      '/api/douban.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/douban.func.js',
      },
      '/api/favorites': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/favorites.func.js',
      },
      '/api/favorites.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/favorites.func.js',
      },
      '/api/image-proxy': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/image-proxy.func.js',
      },
      '/api/image-proxy.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/image-proxy.func.js',
      },
      '/api/login': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/login.func.js',
      },
      '/api/login.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/login.func.js',
      },
      '/api/logout': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/logout.func.js',
      },
      '/api/logout.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/logout.func.js',
      },
      '/api/m3u8': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/m3u8.func.js',
      },
      '/api/m3u8.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/m3u8.func.js',
      },
      '/api/plans': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/plans.func.js',
      },
      '/api/plans.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/plans.func.js',
      },
      '/api/playrecords': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/playrecords.func.js',
      },
      '/api/playrecords.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/playrecords.func.js',
      },
      '/api/register': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/register.func.js',
      },
      '/api/register.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/register.func.js',
      },
      '/api/search/one': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/search/one.func.js',
      },
      '/api/search/one.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/search/one.func.js',
      },
      '/api/search/resources': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/search/resources.func.js',
      },
      '/api/search/resources.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/search/resources.func.js',
      },
      '/api/search/suggestions': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/search/suggestions.func.js',
      },
      '/api/search/suggestions.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/search/suggestions.func.js',
      },
      '/api/search/ws': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/search/ws.func.js',
      },
      '/api/search/ws.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/search/ws.func.js',
      },
      '/api/search': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/search.func.js',
      },
      '/api/search.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/search.func.js',
      },
      '/api/searchhistory': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/searchhistory.func.js',
      },
      '/api/searchhistory.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/searchhistory.func.js',
      },
      '/api/server-config': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/server-config.func.js',
      },
      '/api/server-config.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/server-config.func.js',
      },
      '/api/skipconfigs': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/skipconfigs.func.js',
      },
      '/api/skipconfigs.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/skipconfigs.func.js',
      },
      '/api/tvbox/categories': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/tvbox/categories.func.js',
      },
      '/api/tvbox/categories.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/tvbox/categories.func.js',
      },
      '/api/tvbox/config': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/tvbox/config.func.js',
      },
      '/api/tvbox/config.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/tvbox/config.func.js',
      },
      '/api/user/online': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/user/online.func.js',
      },
      '/api/user/online.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/user/online.func.js',
      },
      '/api/user/orders/create': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/user/orders/create.func.js',
      },
      '/api/user/orders/create.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/user/orders/create.func.js',
      },
      '/api/user/orders': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/user/orders.func.js',
      },
      '/api/user/orders.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/user/orders.func.js',
      },
      '/api/user/payment-settings': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/user/payment-settings.func.js',
      },
      '/api/user/payment-settings.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/user/payment-settings.func.js',
      },
      '/api/user/plans': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/user/plans.func.js',
      },
      '/api/user/plans.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/api/user/plans.func.js',
      },
      '/api/user/subscription': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/user/subscription.func.js',
      },
      '/api/user/subscription.rsc': {
        type: 'function',
        entrypoint:
          '__next-on-pages-dist__/functions/api/user/subscription.func.js',
      },
      '/douban': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/douban.func.js',
      },
      '/douban.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/douban.func.js',
      },
      '/index': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/index.func.js',
      },
      '/': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/index.func.js',
      },
      '/index.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/index.func.js',
      },
      '/login': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/login.func.js',
      },
      '/login.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/login.func.js',
      },
      '/orders': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/orders.func.js',
      },
      '/orders.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/orders.func.js',
      },
      '/play': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/play.func.js',
      },
      '/play.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/play.func.js',
      },
      '/search': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/search.func.js',
      },
      '/search.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/search.func.js',
      },
      '/subscription': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/subscription.func.js',
      },
      '/subscription.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/subscription.func.js',
      },
      '/vip/buy/[planId]': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/vip/buy/[planId].func.js',
      },
      '/vip/buy/[planId].rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/vip/buy/[planId].func.js',
      },
      '/vip': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/vip.func.js',
      },
      '/vip.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/vip.func.js',
      },
      '/warning': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/warning.func.js',
      },
      '/warning.rsc': {
        type: 'function',
        entrypoint: '__next-on-pages-dist__/functions/warning.func.js',
      },
      '/500': {
        type: 'override',
        path: '/500.html',
        headers: { 'content-type': 'text/html; charset=utf-8' },
      },
      '/_error.rsc': {
        type: 'override',
        path: '/_error.rsc.json',
        headers: { 'content-type': 'application/json' },
      },
      '/_app.rsc': {
        type: 'override',
        path: '/_app.rsc.json',
        headers: { 'content-type': 'application/json' },
      },
      '/_document.rsc': {
        type: 'override',
        path: '/_document.rsc.json',
        headers: { 'content-type': 'application/json' },
      },
      '/__next_data_catchall': {
        type: 'override',
        path: '/__next_data_catchall.json',
        headers: { 'content-type': 'application/json' },
      },
      'src/middleware': {
        type: 'middleware',
        entrypoint: '__next-on-pages-dist__/functions/src/middleware.func.js',
      },
    };
  });
var q = V((zt, $) => {
  'use strict';
  p();
  u();
  d();
  function b(t, e) {
    t = String(t || '').trim();
    let s = t,
      n,
      a = '';
    if (/^[^a-zA-Z\\\s]/.test(t)) {
      n = t[0];
      let o = t.lastIndexOf(n);
      (a += t.substring(o + 1)), (t = t.substring(1, o));
    }
    let i = 0;
    return (
      (t = dt(t, (o) => {
        if (/^\(\?[P<']/.test(o)) {
          let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
          if (!c)
            throw new Error(
              `Failed to extract named captures from ${JSON.stringify(o)}`
            );
          let f = o.substring(c[0].length, o.length - 1);
          return e && (e[i] = c[1]), i++, `(${f})`;
        }
        return o.substring(0, 3) === '(?:' || i++, o;
      })),
      (t = t.replace(/\[:([^:]+):\]/g, (o, c) => b.characterClasses[c] || o)),
      new b.PCRE(t, a, s, a, n)
    );
  }
  function dt(t, e) {
    let s = 0,
      n = 0,
      a = !1;
    for (let r = 0; r < t.length; r++) {
      let i = t[r];
      if (a) {
        a = !1;
        continue;
      }
      switch (i) {
        case '(':
          n === 0 && (s = r), n++;
          break;
        case ')':
          if (n > 0 && (n--, n === 0)) {
            let o = r + 1,
              c = s === 0 ? '' : t.substring(0, s),
              f = t.substring(o),
              l = String(e(t.substring(s, o)));
            (t = c + l + f), (r = s);
          }
          break;
        case '\\':
          a = !0;
          break;
        default:
          break;
      }
    }
    return t;
  }
  (function (t) {
    class e extends RegExp {
      constructor(n, a, r, i, o) {
        super(n, a),
          (this.pcrePattern = r),
          (this.pcreFlags = i),
          (this.delimiter = o);
      }
    }
    (t.PCRE = e),
      (t.characterClasses = {
        alnum: '[A-Za-z0-9]',
        word: '[A-Za-z0-9_]',
        alpha: '[A-Za-z]',
        blank: '[ \\t]',
        cntrl: '[\\x00-\\x1F\\x7F]',
        digit: '\\d',
        graph: '[\\x21-\\x7E]',
        lower: '[a-z]',
        print: '[\\x20-\\x7E]',
        punct: '[\\]\\[!"#$%&\'()*+,./:;<=>?@\\\\^_`{|}~-]',
        space: '\\s',
        upper: '[A-Z]',
        xdigit: '[A-Fa-f0-9]',
      });
  })(b || (b = {}));
  b.prototype = b.PCRE.prototype;
  $.exports = b;
});
var Q = V((H) => {
  'use strict';
  p();
  u();
  d();
  H.parse = jt;
  H.serialize = vt;
  var Rt = Object.prototype.toString,
    E = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function jt(t, e) {
    if (typeof t != 'string')
      throw new TypeError('argument str must be a string');
    for (var s = {}, n = e || {}, a = n.decode || Pt, r = 0; r < t.length; ) {
      var i = t.indexOf('=', r);
      if (i === -1) break;
      var o = t.indexOf(';', r);
      if (o === -1) o = t.length;
      else if (o < i) {
        r = t.lastIndexOf(';', i - 1) + 1;
        continue;
      }
      var c = t.slice(r, i).trim();
      if (s[c] === void 0) {
        var f = t.slice(i + 1, o).trim();
        f.charCodeAt(0) === 34 && (f = f.slice(1, -1)), (s[c] = Ct(f, a));
      }
      r = o + 1;
    }
    return s;
  }
  function vt(t, e, s) {
    var n = s || {},
      a = n.encode || kt;
    if (typeof a != 'function') throw new TypeError('option encode is invalid');
    if (!E.test(t)) throw new TypeError('argument name is invalid');
    var r = a(e);
    if (r && !E.test(r)) throw new TypeError('argument val is invalid');
    var i = t + '=' + r;
    if (n.maxAge != null) {
      var o = n.maxAge - 0;
      if (isNaN(o) || !isFinite(o))
        throw new TypeError('option maxAge is invalid');
      i += '; Max-Age=' + Math.floor(o);
    }
    if (n.domain) {
      if (!E.test(n.domain)) throw new TypeError('option domain is invalid');
      i += '; Domain=' + n.domain;
    }
    if (n.path) {
      if (!E.test(n.path)) throw new TypeError('option path is invalid');
      i += '; Path=' + n.path;
    }
    if (n.expires) {
      var c = n.expires;
      if (!St(c) || isNaN(c.valueOf()))
        throw new TypeError('option expires is invalid');
      i += '; Expires=' + c.toUTCString();
    }
    if (
      (n.httpOnly && (i += '; HttpOnly'),
      n.secure && (i += '; Secure'),
      n.priority)
    ) {
      var f =
        typeof n.priority == 'string' ? n.priority.toLowerCase() : n.priority;
      switch (f) {
        case 'low':
          i += '; Priority=Low';
          break;
        case 'medium':
          i += '; Priority=Medium';
          break;
        case 'high':
          i += '; Priority=High';
          break;
        default:
          throw new TypeError('option priority is invalid');
      }
    }
    if (n.sameSite) {
      var l =
        typeof n.sameSite == 'string' ? n.sameSite.toLowerCase() : n.sameSite;
      switch (l) {
        case !0:
          i += '; SameSite=Strict';
          break;
        case 'lax':
          i += '; SameSite=Lax';
          break;
        case 'strict':
          i += '; SameSite=Strict';
          break;
        case 'none':
          i += '; SameSite=None';
          break;
        default:
          throw new TypeError('option sameSite is invalid');
      }
    }
    return i;
  }
  function Pt(t) {
    return t.indexOf('%') !== -1 ? decodeURIComponent(t) : t;
  }
  function kt(t) {
    return encodeURIComponent(t);
  }
  function St(t) {
    return Rt.call(t) === '[object Date]' || t instanceof Date;
  }
  function Ct(t, e) {
    try {
      return e(t);
    } catch {
      return t;
    }
  }
});
p();
u();
d();
p();
u();
d();
p();
u();
d();
var R = 'INTERNAL_SUSPENSE_CACHE_HOSTNAME.local';
p();
u();
d();
p();
u();
d();
p();
u();
d();
p();
u();
d();
var D = F(q());
function k(t, e, s) {
  if (e == null) return { match: null, captureGroupKeys: [] };
  let n = s ? '' : 'i',
    a = [];
  return {
    match: (0, D.default)(`%${t}%${n}`, a).exec(e),
    captureGroupKeys: a,
  };
}
function j(t, e, s, { namedOnly: n } = {}) {
  return t.replace(/\$([a-zA-Z0-9_]+)/g, (a, r) => {
    let i = s.indexOf(r);
    return n && i === -1 ? a : (i === -1 ? e[parseInt(r, 10)] : e[i + 1]) || '';
  });
}
function A(t, { url: e, cookies: s, headers: n, routeDest: a }) {
  switch (t.type) {
    case 'host':
      return { valid: e.hostname === t.value };
    case 'header':
      return t.value !== void 0
        ? I(t.value, n.get(t.key), a)
        : { valid: n.has(t.key) };
    case 'cookie': {
      let r = s[t.key];
      return r && t.value !== void 0
        ? I(t.value, r, a)
        : { valid: r !== void 0 };
    }
    case 'query':
      return t.value !== void 0
        ? I(t.value, e.searchParams.get(t.key), a)
        : { valid: e.searchParams.has(t.key) };
  }
}
function I(t, e, s) {
  let { match: n, captureGroupKeys: a } = k(t, e);
  return s && n && a.length
    ? { valid: !!n, newRouteDest: j(s, n, a, { namedOnly: !0 }) }
    : { valid: !!n };
}
p();
u();
d();
function B(t) {
  let e = new Headers(t.headers);
  return (
    t.cf &&
      (e.set('x-vercel-ip-city', encodeURIComponent(t.cf.city)),
      e.set('x-vercel-ip-country', t.cf.country),
      e.set('x-vercel-ip-country-region', t.cf.regionCode),
      e.set('x-vercel-ip-latitude', t.cf.latitude),
      e.set('x-vercel-ip-longitude', t.cf.longitude)),
    e.set('x-vercel-sc-host', R),
    new Request(t, { headers: e })
  );
}
p();
u();
d();
function m(t, e, s) {
  let n = e instanceof Headers ? e.entries() : Object.entries(e);
  for (let [a, r] of n) {
    let i = a.toLowerCase(),
      o = s?.match ? j(r, s.match, s.captureGroupKeys) : r;
    i === 'set-cookie' ? t.append(i, o) : t.set(i, o);
  }
}
function v(t) {
  return /^https?:\/\//.test(t);
}
function x(t, e) {
  for (let [s, n] of e.entries()) {
    let a = /^nxtP(.+)$/.exec(s),
      r = /^nxtI(.+)$/.exec(s);
    a?.[1]
      ? (t.set(s, n), t.set(a[1], n))
      : r?.[1]
      ? t.set(r[1], n.replace(/(\(\.+\))+/, ''))
      : (!t.has(s) || (!!n && !t.getAll(s).includes(n))) && t.append(s, n);
  }
}
function L(t, e) {
  let s = new URL(e, t.url);
  return (
    x(s.searchParams, new URL(t.url).searchParams),
    (s.pathname = s.pathname
      .replace(/\/index.html$/, '/')
      .replace(/\.html$/, '')),
    new Request(s, t)
  );
}
function P(t) {
  return new Response(t.body, t);
}
function O(t) {
  return t
    .split(',')
    .map((e) => {
      let [s, n] = e.split(';'),
        a = parseFloat((n ?? 'q=1').replace(/q *= */gi, ''));
      return [s.trim(), isNaN(a) ? 1 : a];
    })
    .sort((e, s) => s[1] - e[1])
    .map(([e]) => (e === '*' || e === '' ? [] : e))
    .flat();
}
p();
u();
d();
function N(t) {
  switch (t) {
    case 'none':
      return 'filesystem';
    case 'filesystem':
      return 'rewrite';
    case 'rewrite':
      return 'resource';
    case 'resource':
      return 'miss';
    default:
      return 'miss';
  }
}
async function S(
  t,
  { request: e, assetsFetcher: s, ctx: n },
  { path: a, searchParams: r }
) {
  let i,
    o = new URL(e.url);
  x(o.searchParams, r);
  let c = new Request(o, e);
  try {
    switch (t?.type) {
      case 'function':
      case 'middleware': {
        let f = await import(t.entrypoint);
        try {
          i = await f.default(c, n);
        } catch (l) {
          let g = l;
          throw g.name === 'TypeError' &&
            g.message.endsWith('default is not a function')
            ? new Error(
                `An error occurred while evaluating the target edge function (${t.entrypoint})`
              )
            : l;
        }
        break;
      }
      case 'override': {
        (i = P(await s.fetch(L(c, t.path ?? a)))),
          t.headers && m(i.headers, t.headers);
        break;
      }
      case 'static': {
        i = await s.fetch(L(c, a));
        break;
      }
      default:
        i = new Response('Not Found', { status: 404 });
    }
  } catch (f) {
    return (
      console.error(f), new Response('Internal Server Error', { status: 500 })
    );
  }
  return P(i);
}
function G(t, e) {
  let s = '^//?(?:',
    n = ')/(.*)$';
  return !t.startsWith(s) || !t.endsWith(n)
    ? !1
    : t
        .slice(s.length, -n.length)
        .split('|')
        .every((r) => e.has(r));
}
p();
u();
d();
function ft(t, { protocol: e, hostname: s, port: n, pathname: a }) {
  return !(
    (e && t.protocol.replace(/:$/, '') !== e) ||
    !new RegExp(s).test(t.hostname) ||
    (n && !new RegExp(n).test(t.port)) ||
    (a && !new RegExp(a).test(t.pathname))
  );
}
function lt(t, e) {
  if (t.method !== 'GET') return;
  let { origin: s, searchParams: n } = new URL(t.url),
    a = n.get('url'),
    r = Number.parseInt(n.get('w') ?? '', 10),
    i = Number.parseInt(n.get('q') ?? '75', 10);
  if (
    !a ||
    Number.isNaN(r) ||
    Number.isNaN(i) ||
    !e?.sizes?.includes(r) ||
    i < 0 ||
    i > 100
  )
    return;
  let o = new URL(a, s);
  if (o.pathname.endsWith('.svg') && !e?.dangerouslyAllowSVG) return;
  let c = a.startsWith('//'),
    f = a.startsWith('/') && !c;
  if (
    !f &&
    !e?.domains?.includes(o.hostname) &&
    !e?.remotePatterns?.find((w) => ft(o, w))
  )
    return;
  let l = t.headers.get('Accept') ?? '',
    g = e?.formats?.find((w) => l.includes(w))?.replace('image/', '');
  return {
    isRelative: f,
    imageUrl: o,
    options: { width: r, quality: i, format: g },
  };
}
function ht(t, e, s) {
  let n = new Headers();
  if (
    (s?.contentSecurityPolicy &&
      n.set('Content-Security-Policy', s.contentSecurityPolicy),
    s?.contentDispositionType)
  ) {
    let r = e.pathname.split('/').pop(),
      i = r
        ? `${s.contentDispositionType}; filename="${r}"`
        : s.contentDispositionType;
    n.set('Content-Disposition', i);
  }
  t.headers.has('Cache-Control') ||
    n.set('Cache-Control', `public, max-age=${s?.minimumCacheTTL ?? 60}`);
  let a = P(t);
  return m(a.headers, n), a;
}
async function K(t, { buildOutput: e, assetsFetcher: s, imagesConfig: n }) {
  let a = lt(t, n);
  if (!a)
    return new Response('Invalid image resizing request', { status: 400 });
  let { isRelative: r, imageUrl: i } = a,
    c = await (r && i.pathname in e ? s.fetch.bind(s) : fetch)(i);
  return ht(c, i, n);
}
p();
u();
d();
p();
u();
d();
p();
u();
d();
async function C(t) {
  return import(t);
}
var _t = 'x-vercel-cache-tags',
  yt = 'x-next-cache-soft-tags',
  gt = Symbol.for('__cloudflare-request-context__');
async function J(t) {
  let e = `https://${R}/v1/suspense-cache/`;
  if (!t.url.startsWith(e)) return null;
  try {
    let s = new URL(t.url),
      n = await mt();
    if (s.pathname === '/v1/suspense-cache/revalidate') {
      let r = s.searchParams.get('tags')?.split(',') ?? [];
      for (let i of r) await n.revalidateTag(i);
      return new Response(null, { status: 200 });
    }
    let a = s.pathname.replace('/v1/suspense-cache/', '');
    if (!a.length) return new Response('Invalid cache key', { status: 400 });
    switch (t.method) {
      case 'GET': {
        let r = z(t, yt),
          i = await n.get(a, { softTags: r });
        return i
          ? new Response(JSON.stringify(i.value), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'x-vercel-cache-state': 'fresh',
                age: `${(Date.now() - (i.lastModified ?? Date.now())) / 1e3}`,
              },
            })
          : new Response(null, { status: 404 });
      }
      case 'POST': {
        let r = globalThis[gt],
          i = async () => {
            let o = await t.json();
            o.data.tags === void 0 && (o.tags ??= z(t, _t) ?? []),
              await n.set(a, o);
          };
        return (
          r ? r.ctx.waitUntil(i()) : await i(),
          new Response(null, { status: 200 })
        );
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (s) {
    return (
      console.error(s),
      new Response('Error handling cache request', { status: 500 })
    );
  }
}
async function mt() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE
    ? W('kv')
    : W('cache-api');
}
async function W(t) {
  let e = `./__next-on-pages-dist__/cache/${t}.js`,
    s = await C(e);
  return new s.default();
}
function z(t, e) {
  return t.headers.get(e)?.split(',')?.filter(Boolean);
}
function X() {
  globalThis[Z] || (xt(), (globalThis[Z] = !0));
}
function xt() {
  let t = globalThis.fetch;
  globalThis.fetch = async (...e) => {
    let s = new Request(...e),
      n = await bt(s);
    return n || ((n = await J(s)), n) ? n : (wt(s), t(s));
  };
}
async function bt(t) {
  if (t.url.startsWith('blob:'))
    try {
      let s = `./__next-on-pages-dist__/assets/${new URL(t.url).pathname}.bin`,
        n = (await C(s)).default,
        a = {
          async arrayBuffer() {
            return n;
          },
          get body() {
            return new ReadableStream({
              start(r) {
                let i = Buffer.from(n);
                r.enqueue(i), r.close();
              },
            });
          },
          async text() {
            return Buffer.from(n).toString();
          },
          async json() {
            let r = Buffer.from(n);
            return JSON.stringify(r.toString());
          },
          async blob() {
            return new Blob(n);
          },
        };
      return (a.clone = () => ({ ...a })), a;
    } catch {}
  return null;
}
function wt(t) {
  t.headers.has('user-agent') ||
    t.headers.set('user-agent', 'Next.js Middleware');
}
var Z = Symbol.for('next-on-pages fetch patch');
p();
u();
d();
var Y = F(Q());
var M = class {
  constructor(e, s, n, a, r) {
    this.routes = e;
    this.output = s;
    this.reqCtx = n;
    (this.url = new URL(n.request.url)),
      (this.cookies = (0, Y.parse)(n.request.headers.get('cookie') || '')),
      (this.path = this.url.pathname || '/'),
      (this.headers = { normal: new Headers(), important: new Headers() }),
      (this.searchParams = new URLSearchParams()),
      x(this.searchParams, this.url.searchParams),
      (this.checkPhaseCounter = 0),
      (this.middlewareInvoked = []),
      (this.wildcardMatch = r?.find((i) => i.domain === this.url.hostname)),
      (this.locales = new Set(a.collectedLocales));
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(e, { checkStatus: s, checkIntercept: n }) {
    let a = k(e.src, this.path, e.caseSensitive);
    if (
      !a.match ||
      (e.methods &&
        !e.methods
          .map((i) => i.toUpperCase())
          .includes(this.reqCtx.request.method.toUpperCase()))
    )
      return;
    let r = {
      url: this.url,
      cookies: this.cookies,
      headers: this.reqCtx.request.headers,
      routeDest: e.dest,
    };
    if (
      !e.has?.find((i) => {
        let o = A(i, r);
        return o.newRouteDest && (r.routeDest = o.newRouteDest), !o.valid;
      }) &&
      !e.missing?.find((i) => A(i, r).valid) &&
      !(s && e.status !== this.status)
    ) {
      if (n && e.dest) {
        let i = /\/(\(\.+\))+/,
          o = i.test(e.dest),
          c = i.test(this.path);
        if (o && !c) return;
      }
      return { routeMatch: a, routeDest: r.routeDest };
    }
  }
  processMiddlewareResp(e) {
    let s = 'x-middleware-override-headers',
      n = e.headers.get(s);
    if (n) {
      let c = new Set(n.split(',').map((f) => f.trim()));
      for (let f of c.keys()) {
        let l = `x-middleware-request-${f}`,
          g = e.headers.get(l);
        this.reqCtx.request.headers.get(f) !== g &&
          (g
            ? this.reqCtx.request.headers.set(f, g)
            : this.reqCtx.request.headers.delete(f)),
          e.headers.delete(l);
      }
      e.headers.delete(s);
    }
    let a = 'x-middleware-rewrite',
      r = e.headers.get(a);
    if (r) {
      let c = new URL(r, this.url),
        f = this.url.hostname !== c.hostname;
      (this.path = f ? `${c}` : c.pathname),
        x(this.searchParams, c.searchParams),
        e.headers.delete(a);
    }
    let i = 'x-middleware-next';
    e.headers.get(i)
      ? e.headers.delete(i)
      : !r && !e.headers.has('location')
      ? ((this.body = e.body), (this.status = e.status))
      : e.headers.has('location') &&
        e.status >= 300 &&
        e.status < 400 &&
        (this.status = e.status),
      m(this.reqCtx.request.headers, e.headers),
      m(this.headers.normal, e.headers),
      (this.headers.middlewareLocation = e.headers.get('location'));
  }
  async runRouteMiddleware(e) {
    if (!e) return !0;
    let s = e && this.output[e];
    if (!s || s.type !== 'middleware') return (this.status = 500), !1;
    let n = await S(s, this.reqCtx, {
      path: this.path,
      searchParams: this.searchParams,
      headers: this.headers,
      status: this.status,
    });
    return (
      this.middlewareInvoked.push(e),
      n.status === 500
        ? ((this.status = n.status), !1)
        : (this.processMiddlewareResp(n), !0)
    );
  }
  applyRouteOverrides(e) {
    !e.override ||
      ((this.status = void 0),
      (this.headers.normal = new Headers()),
      (this.headers.important = new Headers()));
  }
  applyRouteHeaders(e, s, n) {
    !e.headers ||
      (m(this.headers.normal, e.headers, { match: s, captureGroupKeys: n }),
      e.important &&
        m(this.headers.important, e.headers, {
          match: s,
          captureGroupKeys: n,
        }));
  }
  applyRouteStatus(e) {
    !e.status || (this.status = e.status);
  }
  applyRouteDest(e, s, n) {
    if (!e.dest) return this.path;
    let a = this.path,
      r = e.dest;
    this.wildcardMatch &&
      /\$wildcard/.test(r) &&
      (r = r.replace(/\$wildcard/g, this.wildcardMatch.value)),
      (this.path = j(r, s, n));
    let i = /\/index\.rsc$/i.test(this.path),
      o = /^\/(?:index)?$/i.test(a),
      c = /^\/__index\.prefetch\.rsc$/i.test(a);
    i && !o && !c && (this.path = a);
    let f = /\.rsc$/i.test(this.path),
      l = /\.prefetch\.rsc$/i.test(this.path),
      g = this.path in this.output;
    f && !l && !g && (this.path = this.path.replace(/\.rsc/i, ''));
    let w = new URL(this.path, this.url);
    return (
      x(this.searchParams, w.searchParams),
      v(this.path) || (this.path = w.pathname),
      a
    );
  }
  applyLocaleRedirects(e) {
    if (
      !e.locale?.redirect ||
      (!/^\^(.)*$/.test(e.src) && e.src !== this.path) ||
      this.headers.normal.has('location')
    )
      return;
    let {
        locale: { redirect: n, cookie: a },
      } = e,
      r = a && this.cookies[a],
      i = O(r ?? ''),
      o = O(this.reqCtx.request.headers.get('accept-language') ?? ''),
      l = [...i, ...o].map((g) => n[g]).filter(Boolean)[0];
    if (l) {
      !this.path.startsWith(l) &&
        (this.headers.normal.set('location', l), (this.status = 307));
      return;
    }
  }
  getLocaleFriendlyRoute(e, s) {
    return !this.locales || s !== 'miss'
      ? e
      : G(e.src, this.locales)
      ? { ...e, src: e.src.replace(/\/\(\.\*\)\$$/, '(?:/(.*))?$') }
      : e;
  }
  async checkRoute(e, s) {
    let n = this.getLocaleFriendlyRoute(s, e),
      { routeMatch: a, routeDest: r } =
        this.checkRouteMatch(n, {
          checkStatus: e === 'error',
          checkIntercept: e === 'rewrite',
        }) ?? {},
      i = { ...n, dest: r };
    if (
      !a?.match ||
      (i.middlewarePath && this.middlewareInvoked.includes(i.middlewarePath))
    )
      return 'skip';
    let { match: o, captureGroupKeys: c } = a;
    if (
      (this.applyRouteOverrides(i),
      this.applyLocaleRedirects(i),
      !(await this.runRouteMiddleware(i.middlewarePath)))
    )
      return 'error';
    if (this.body !== void 0 || this.headers.middlewareLocation) return 'done';
    this.applyRouteHeaders(i, o, c), this.applyRouteStatus(i);
    let l = this.applyRouteDest(i, o, c);
    if (i.check && !v(this.path))
      if (l === this.path) {
        if (e !== 'miss') return this.checkPhase(N(e));
        this.status = 404;
      } else if (e === 'miss') {
        if (
          !(this.path in this.output) &&
          !(this.path.replace(/\/$/, '') in this.output)
        )
          return this.checkPhase('filesystem');
        this.status === 404 && (this.status = void 0);
      } else return this.checkPhase('none');
    return !i.continue || (i.status && i.status >= 300 && i.status <= 399)
      ? 'done'
      : 'next';
  }
  async checkPhase(e) {
    if (this.checkPhaseCounter++ >= 50)
      return (
        console.error(
          `Routing encountered an infinite loop while checking ${this.url.pathname}`
        ),
        (this.status = 500),
        'error'
      );
    this.middlewareInvoked = [];
    let s = !0;
    for (let r of this.routes[e]) {
      let i = await this.checkRoute(e, r);
      if (i === 'error') return 'error';
      if (i === 'done') {
        s = !1;
        break;
      }
    }
    if (
      e === 'hit' ||
      v(this.path) ||
      this.headers.normal.has('location') ||
      !!this.body
    )
      return 'done';
    if (e === 'none')
      for (let r of this.locales) {
        let i = new RegExp(`/${r}(/.*)`),
          c = this.path.match(i)?.[1];
        if (c && c in this.output) {
          this.path = c;
          break;
        }
      }
    let n = this.path in this.output;
    if (!n && this.path.endsWith('/')) {
      let r = this.path.replace(/\/$/, '');
      (n = r in this.output), n && (this.path = r);
    }
    if (e === 'miss' && !n) {
      let r = !this.status || this.status < 400;
      this.status = r ? 404 : this.status;
    }
    let a = 'miss';
    return (
      n || e === 'miss' || e === 'error' ? (a = 'hit') : s && (a = N(e)),
      this.checkPhase(a)
    );
  }
  async run(e = 'none') {
    this.checkPhaseCounter = 0;
    let s = await this.checkPhase(e);
    return (
      this.headers.normal.has('location') &&
        (!this.status || this.status < 300 || this.status >= 400) &&
        (this.status = 307),
      s
    );
  }
};
async function tt(t, e, s, n) {
  let a = new M(e.routes, s, t, n, e.wildcard),
    r = await et(a);
  return Et(t, r, s);
}
async function et(t, e = 'none', s = !1) {
  return (await t.run(e)) === 'error' || (!s && t.status && t.status >= 400)
    ? et(t, 'error', !0)
    : {
        path: t.path,
        status: t.status,
        headers: t.headers,
        searchParams: t.searchParams,
        body: t.body,
      };
}
async function Et(
  t,
  { path: e = '/404', status: s, headers: n, searchParams: a, body: r },
  i
) {
  let o = n.normal.get('location');
  if (o) {
    if (o !== n.middlewareLocation) {
      let l = [...a.keys()].length ? `?${a.toString()}` : '';
      n.normal.set('location', `${o ?? '/'}${l}`);
    }
    return new Response(null, { status: s, headers: n.normal });
  }
  let c;
  if (r !== void 0) c = new Response(r, { status: s });
  else if (v(e)) {
    let l = new URL(e);
    x(l.searchParams, a), (c = await fetch(l, t.request));
  } else
    c = await S(i[e], t, { path: e, status: s, headers: n, searchParams: a });
  let f = n.normal;
  return (
    m(f, c.headers),
    m(f, n.important),
    (c = new Response(c.body, { ...c, status: s || c.status, headers: f })),
    c
  );
}
p();
u();
d();
function nt() {
  globalThis.__nextOnPagesRoutesIsolation ??= {
    _map: new Map(),
    getProxyFor: Mt,
  };
}
function Mt(t) {
  let e = globalThis.__nextOnPagesRoutesIsolation._map.get(t);
  if (e) return e;
  let s = Tt();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(t, s), s;
}
function Tt() {
  let t = new Map();
  return new Proxy(globalThis, {
    get: (e, s) => (t.has(s) ? t.get(s) : Reflect.get(globalThis, s)),
    set: (e, s, n) =>
      It.has(s) ? Reflect.set(globalThis, s, n) : (t.set(s, n), !0),
  });
}
var It = new Set(['_nextOriginalFetch', 'fetch', '__incrementalCache']);
var At = Object.defineProperty,
  Lt = (...t) => {
    let e = t[0],
      s = t[1],
      n = '__import_unsupported';
    if (!(s === n && typeof e == 'object' && e !== null && n in e))
      return At(...t);
  };
globalThis.Object.defineProperty = Lt;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes('Disallowed operation called within global scope')
      )
        return {
          signal: {
            aborted: !1,
            reason: null,
            onabort: () => {},
            throwIfAborted: () => {},
          },
          abort() {},
        };
      throw e;
    }
  }
};
var kn = {
  async fetch(t, e, s) {
    nt(), X();
    let n = await __ALSes_PROMISE__;
    if (!n) {
      let i = new URL(t.url),
        o = await e.ASSETS.fetch(
          `${i.protocol}//${i.host}/cdn-cgi/errors/no-nodejs_compat.html`
        ),
        c = o.ok
          ? o.body
          : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
      return new Response(c, { status: 503 });
    }
    let { envAsyncLocalStorage: a, requestContextAsyncLocalStorage: r } = n;
    return a.run(
      { ...e, NODE_ENV: 'production', SUSPENSE_CACHE_URL: R },
      async () =>
        r.run({ env: e, ctx: s, cf: t.cf }, async () => {
          if (new URL(t.url).pathname.startsWith('/_next/image'))
            return K(t, {
              buildOutput: _,
              assetsFetcher: e.ASSETS,
              imagesConfig: h.images,
            });
          let o = B(t);
          return tt({ request: o, ctx: s, assetsFetcher: e.ASSETS }, h, _, y);
        })
    );
  },
};
export { kn as default };
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
