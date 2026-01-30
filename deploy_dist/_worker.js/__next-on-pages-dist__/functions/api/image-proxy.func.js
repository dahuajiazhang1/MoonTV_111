var W = Object.defineProperty;
var z = Object.getOwnPropertyDescriptor;
var J = Object.getOwnPropertyNames;
var Q = Object.prototype.hasOwnProperty;
var Y = (s, p) => () => (s && (p = s((s = 0))), p);
var B = (s, p, I, d) => {
    if ((p && typeof p == 'object') || typeof p == 'function')
      for (let l of J(p))
        !Q.call(s, l) &&
          l !== I &&
          W(s, l, {
            get: () => p[l],
            enumerable: !(d = z(p, l)) || d.enumerable,
          });
    return s;
  },
  q = (s, p, I) => (B(s, p, 'default'), I && B(I, p, 'default'));
var Z = (s) => B(W({}, '__esModule', { value: !0 }), s);
var $ = {};
import * as st from 'async_hooks';
var X = Y(() => {
  q($, st);
});
import { __getNamedExports as ee } from '../../../__next-on-pages-dist__/webpack/77222a2020375d69873f009e58318c81.js';
import { __getNamedExports as te } from '../../../__next-on-pages-dist__/webpack/ebc604065f6a8ec62851df4fddcdc308.js';
import { __getNamedExports as ne } from '../../../__next-on-pages-dist__/webpack/ee17105fe15c406e80ed8b3c18458774.js';
import { __getNamedExports as _e } from '../../../__next-on-pages-dist__/webpack/968f8afe81bb4dec73e182f12e51b747.js';
import { __getNamedExports as re } from '../../../__next-on-pages-dist__/manifest/537259e2ed205f5a7994cb4f05664668.js';
var k = globalThis.__nextOnPagesRoutesIsolation.getProxyFor('/api/image-proxy'),
  G = ee(k, k, k),
  ae = G.__chunk_67550,
  oe = G.__chunk_21892,
  M = te(k, k, k),
  ce = M.__chunk_26195,
  se = M.__chunk_2067,
  ue = M.__chunk_27145,
  ie = M.__chunk_992,
  pe = M.__chunk_72472,
  u = ne(k, k, k),
  he = u.__chunk_99361,
  ke = u.__chunk_63397,
  ge = u.__chunk_37608,
  de = u.__chunk_72290,
  le = u.__chunk_57269,
  me = u.__chunk_67759,
  fe = u.__chunk_47733,
  xe = u.__chunk_81366,
  ye = u.__chunk_2449,
  be = u.__chunk_9519,
  Ee = u.__chunk_57533,
  ve = u.__chunk_21465,
  Ne = u.__chunk_19878,
  we = u.__chunk_56584,
  Re = u.__chunk_6773,
  Oe = u.__chunk_14455,
  Ce = u.__chunk_75621,
  Ae = u.__chunk_25440,
  Te = u.__chunk_82822,
  je = u.__chunk_31980,
  Se = u.__chunk_70429,
  Ie = u.__chunk_80524,
  Pe = u.__chunk_68410,
  $e = u.__chunk_42097,
  i = _e(k, k, k),
  Me = i.__chunk_81778,
  Fe = i.__chunk_24173,
  Ue = i.__chunk_25715,
  Le = i.__chunk_59760,
  De = i.__chunk_37724,
  Ke = i.__chunk_32321,
  Be = i.__chunk_32981,
  qe = i.__chunk_11147,
  He = i.__chunk_15449,
  We = i.__chunk_5163,
  Xe = i.__chunk_29726,
  Ge = i.__chunk_14896,
  Ve = i.__chunk_23460,
  ze = i.__chunk_95701,
  Je = i.__chunk_58010,
  Qe = i.__chunk_77524,
  Ye = i.__chunk_4962,
  Ze = i.__chunk_2980,
  et = i.__chunk_39520,
  tt = i.__chunk_56441,
  nt = i.__chunk_78616,
  _t = i.__chunk_17235,
  rt = i.__chunk_80666,
  V = re(k, k, k),
  at = V.__NEXT_FONT_MANIFEST,
  ot = V.__REACT_LOADABLE_MANIFEST,
  gt = ((s, p, I) => (
    (p._ENTRIES = {}),
    (s.__BUILD_MANIFEST = {
      polyfillFiles: ['static/chunks/polyfills-42372ed130431b0a.js'],
      devFiles: [],
      ampDevFiles: [],
      lowPriorityFiles: [],
      rootMainFiles: [
        'static/chunks/webpack-631aaf736d699b4e.js',
        'static/chunks/da18b9b8-7d8998e19c30d30d.js',
        'static/chunks/133-714a737122c140b2.js',
        'static/chunks/main-app-a356cec7a89d71f4.js',
      ],
      pages: {
        '/_app': [
          'static/chunks/webpack-631aaf736d699b4e.js',
          'static/chunks/framework-6e06c675866dc992.js',
          'static/chunks/main-96292bcb1a8137c2.js',
          'static/chunks/pages/_app-e20a1802c8ee7f75.js',
        ],
        '/_error': [
          'static/chunks/webpack-631aaf736d699b4e.js',
          'static/chunks/framework-6e06c675866dc992.js',
          'static/chunks/main-96292bcb1a8137c2.js',
          'static/chunks/pages/_error-fd6114dbdc76b395.js',
        ],
      },
      ampFirstPages: [],
    }),
    (s.__BUILD_MANIFEST.lowPriorityFiles = [
      '/static/Cv6kxAupJcIFx7uwNyZaB/_buildManifest.js',
      ,
      '/static/Cv6kxAupJcIFx7uwNyZaB/_ssgManifest.js',
    ]),
    (s.__REACT_LOADABLE_MANIFEST = ot),
    (s.__NEXT_FONT_MANIFEST = at),
    (s.__INTERCEPTION_ROUTE_REWRITE_MANIFEST = '[]'),
    (() => {
      'use strict';
      var d = {},
        l = {};
      function n(t) {
        var o = l[t];
        if (o !== void 0) return o.exports;
        var c = (l[t] = { id: t, loaded: !1, exports: {} }),
          m = !0;
        try {
          d[t].call(c.exports, c, c.exports, n), (m = !1);
        } finally {
          m && delete l[t];
        }
        return (c.loaded = !0), c.exports;
      }
      (n.m = d),
        (n.amdO = {}),
        (() => {
          var t = [];
          n.O = (o, c, m, f) => {
            if (c) {
              f = f || 0;
              for (var h = t.length; h > 0 && t[h - 1][2] > f; h--)
                t[h] = t[h - 1];
              t[h] = [c, m, f];
              return;
            }
            for (var g = 1 / 0, h = 0; h < t.length; h++) {
              for (var [c, m, f] = t[h], v = !0, y = 0; y < c.length; y++)
                g >= f && Object.keys(n.O).every((P) => n.O[P](c[y]))
                  ? c.splice(y--, 1)
                  : ((v = !1), f < g && (g = f));
              if (v) {
                t.splice(h--, 1);
                var E = m();
                E !== void 0 && (o = E);
              }
            }
            return o;
          };
        })(),
        (n.n = (t) => {
          var o = t && t.__esModule ? () => t.default : () => t;
          return n.d(o, { a: o }), o;
        }),
        (n.d = (t, o) => {
          for (var c in o)
            n.o(o, c) &&
              !n.o(t, c) &&
              Object.defineProperty(t, c, { enumerable: !0, get: o[c] });
        }),
        (n.e = () => Promise.resolve()),
        (n.g = (function () {
          if (typeof p == 'object') return p;
          try {
            return this || Function('return this')();
          } catch {
            if (typeof window == 'object') return window;
          }
        })()),
        (n.o = (t, o) => Object.prototype.hasOwnProperty.call(t, o)),
        (n.r = (t) => {
          typeof Symbol < 'u' &&
            Symbol.toStringTag &&
            Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(t, '__esModule', { value: !0 });
        }),
        (n.nmd = (t) => ((t.paths = []), t.children || (t.children = []), t)),
        (() => {
          var t = { 5993: 0 };
          n.O.j = (m) => t[m] === 0;
          var o = (m, f) => {
              var h,
                g,
                [v, y, E] = f,
                A = 0;
              if (v.some((T) => t[T] !== 0)) {
                for (h in y) n.o(y, h) && (n.m[h] = y[h]);
                if (E) var O = E(n);
              }
              for (m && m(f); A < v.length; A++)
                (g = v[A]), n.o(t, g) && t[g] && t[g][0](), (t[g] = 0);
              return n.O(O);
            },
            c = (s.webpackChunk_N_E = s.webpackChunk_N_E || []);
          c.forEach(o.bind(null, 0)), (c.push = o.bind(null, c.push.bind(c)));
        })();
    })(),
    (s.webpackChunk_N_E = s.webpackChunk_N_E || []).push([
      [5300],
      {
        80666: rt,
        17235: _t,
        78616: nt,
        56441: tt,
        39520: et,
        2980: Ze,
        4962: Ye,
        77524: Qe,
        58010: Je,
        95701: ze,
        23460: Ve,
        14896: Ge,
        29726: Xe,
        5163: We,
        15449: He,
        11147: qe,
        32981: Be,
        32321: Ke,
        37724: De,
        59760: Le,
        25715: Ue,
        72472: pe,
        992: ie,
        24173: Fe,
        27145: ue,
        81778: Me,
      },
    ]),
    (s.webpackChunk_N_E = s.webpackChunk_N_E || []).push([
      [366],
      {
        42097: $e,
        68410: Pe,
        80524: Ie,
        70429: Se,
        31980: je,
        82822: Te,
        25440: Ae,
        75621: Ce,
        14455: Oe,
        6773: Re,
        56584: we,
        19878: Ne,
        21465: ve,
        57533: Ee,
        9519: be,
        2449: ye,
        81366: xe,
        47733: fe,
        67759: me,
        57269: le,
        72290: de,
        37608: ge,
        63397: ke,
        99361: he,
      },
    ]),
    (s.webpackChunk_N_E = s.webpackChunk_N_E || []).push([
      [8538],
      {
        2067: se,
        26195: ce,
        33476: (d, l, n) => {
          'use strict';
          n.r(l), n.d(l, { ComponentMod: () => U, default: () => L });
          var t = {};
          n.r(t), n.d(t, { GET: () => y, runtime: () => v });
          var o = {};
          n.r(o),
            n.d(o, {
              originalPathname: () => F,
              patchFetch: () => P,
              requestAsyncStorage: () => A,
              routeModule: () => E,
              serverHooks: () => T,
              staticGenerationAsyncStorage: () => O,
            });
          var c = n(6773),
            m = n(75621),
            f = n(11147),
            h = n(32981),
            g = n(67550);
          let v = 'edge';
          async function y(D) {
            let { searchParams: K } = new URL(D.url),
              w = K.get('url');
            if (!w)
              return g.xk.json({ error: 'Missing image URL' }, { status: 400 });
            try {
              let N = await fetch(w, {
                headers: {
                  Referer: 'https://movie.douban.com/',
                  'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                },
              });
              if (!N.ok)
                return g.xk.json({ error: N.statusText }, { status: N.status });
              let e = N.headers.get('content-type');
              if (!N.body)
                return g.xk.json(
                  { error: 'Image response has no body' },
                  { status: 500 }
                );
              let r = new Headers();
              return (
                e && r.set('Content-Type', e),
                r.set(
                  'Cache-Control',
                  'public, max-age=15720000, s-maxage=15720000'
                ),
                r.set('CDN-Cache-Control', 'public, s-maxage=15720000'),
                r.set('Vercel-CDN-Cache-Control', 'public, s-maxage=15720000'),
                r.set('Netlify-Vary', 'query'),
                new Response(N.body, { status: 200, headers: r })
              );
            } catch {
              return g.xk.json(
                { error: 'Error fetching image' },
                { status: 500 }
              );
            }
          }
          let E = new m.AppRouteRouteModule({
              definition: {
                kind: f.x.APP_ROUTE,
                page: '/api/image-proxy/route',
                pathname: '/api/image-proxy',
                filename: 'route',
                bundlePath: 'app/api/image-proxy/route',
              },
              resolvedPagePath:
                '/Volumes/OS/Users/wangbengang/Documents/moontv/MoonTV/src/app/api/image-proxy/route.ts',
              nextConfigOutput: 'standalone',
              userland: t,
            }),
            {
              requestAsyncStorage: A,
              staticGenerationAsyncStorage: O,
              serverHooks: T,
            } = E,
            F = '/api/image-proxy/route';
          function P() {
            return (0, h.XH)({
              serverHooks: T,
              staticGenerationAsyncStorage: O,
            });
          }
          let U = o,
            L = c.a.wrap(E);
        },
        21892: oe,
        67550: ae,
      },
      (d) => {
        var l = (t) => d((d.s = t));
        d.O(0, [5300, 366], () => l(33476));
        var n = d.O();
        (p._ENTRIES = typeof p._ENTRIES > 'u' ? {} : p._ENTRIES)[
          'middleware_app/api/image-proxy/route'
        ] = n;
      },
    ]),
    function () {
      let d = { exports: {}, loaded: !1 };
      return (
        (function (n, t) {
          'use strict';
          var o = Object.defineProperty,
            c = Object.getOwnPropertyDescriptor,
            m = Object.getOwnPropertyNames,
            f = Object.prototype.hasOwnProperty,
            h = (e, r) => {
              for (var _ in r) o(e, _, { get: r[_], enumerable: !0 });
            },
            g = (e, r, _, a) => {
              if ((r && typeof r == 'object') || typeof r == 'function')
                for (let x of m(r))
                  !f.call(e, x) &&
                    x !== _ &&
                    o(e, x, {
                      get: () => r[x],
                      enumerable: !(a = c(r, x)) || a.enumerable,
                    });
              return e;
            },
            v = (e) => g(o({}, '__esModule', { value: !0 }), e),
            y = {};
          h(y, { default: () => K }), (n.exports = v(y));
          var E = (X(), Z($)),
            A = '@next/request-context',
            O = Symbol.for(A),
            T = Symbol.for('internal.storage');
          function F() {
            let e = p;
            if (!e[O]) {
              let r = new E.AsyncLocalStorage(),
                _ = { get: () => r.getStore(), [T]: r };
              e[O] = _;
            }
            return e[O];
          }
          var P = F();
          function U(e, r) {
            return P[T].run(e, r);
          }
          function L(e) {
            let r = {};
            return (
              e &&
                e.forEach((_, a) => {
                  (r[a] = _), a.toLowerCase() === 'set-cookie' && (r[a] = D(_));
                }),
              r
            );
          }
          function D(e) {
            let r = [],
              _ = 0,
              a,
              x,
              b,
              j,
              S;
            function R() {
              for (; _ < e.length && /\s/.test(e.charAt(_)); ) _ += 1;
              return _ < e.length;
            }
            function C() {
              return (x = e.charAt(_)), x !== '=' && x !== ';' && x !== ',';
            }
            for (; _ < e.length; ) {
              for (a = _, S = !1; R(); )
                if (((x = e.charAt(_)), x === ',')) {
                  for (b = _, _ += 1, R(), j = _; _ < e.length && C(); ) _ += 1;
                  _ < e.length && e.charAt(_) === '='
                    ? ((S = !0), (_ = j), r.push(e.substring(a, b)), (a = _))
                    : (_ = b + 1);
                } else _ += 1;
              (!S || _ >= e.length) && r.push(e.substring(a, e.length));
            }
            return r;
          }
          function K(e) {
            let r = e.staticRoutes.map((a) => ({
                regexp: new RegExp(a.namedRegex),
                page: a.page,
              })),
              _ =
                e.dynamicRoutes?.map((a) => ({
                  regexp: new RegExp(a.namedRegex),
                  page: a.page,
                })) || [];
            return async function (a, x) {
              let b = new URL(a.url).pathname,
                j = {};
              if (
                (e.nextConfig?.basePath &&
                  b.startsWith(e.nextConfig.basePath) &&
                  (b = b.replace(e.nextConfig.basePath, '') || '/'),
                e.nextConfig?.i18n)
              )
                for (let R of e.nextConfig.i18n.locales) {
                  let C = new RegExp(`^/${R}($|/)`, 'i');
                  if (b.match(C)) {
                    b = b.replace(C, '/') || '/';
                    break;
                  }
                }
              for (let R of r)
                if (R.regexp.exec(b)) {
                  j.name = R.page;
                  break;
                }
              if (!j.name) {
                let R = N(b);
                for (let C of _ || []) {
                  if (R && !N(C.page)) continue;
                  let H = C.regexp.exec(b);
                  if (H) {
                    j = { name: C.page, params: H.groups };
                    break;
                  }
                }
              }
              let S = await U({ waitUntil: x.waitUntil }, () =>
                p._ENTRIES[`middleware_${e.name}`].default.call(
                  {},
                  {
                    request: {
                      url: a.url,
                      method: a.method,
                      headers: L(a.headers),
                      ip: w(a.headers, 'x-real-ip'),
                      geo: {
                        city: w(a.headers, 'x-vercel-ip-city', !0),
                        country: w(a.headers, 'x-vercel-ip-country', !0),
                        latitude: w(a.headers, 'x-vercel-ip-latitude'),
                        longitude: w(a.headers, 'x-vercel-ip-longitude'),
                        region: w(a.headers, 'x-vercel-ip-country-region', !0),
                      },
                      nextConfig: e.nextConfig,
                      page: j,
                      body: a.body,
                    },
                  }
                )
              );
              return S.waitUntil && x.waitUntil(S.waitUntil), S.response;
            };
          }
          function w(e, r, _ = !1) {
            let a = e.get(r) || void 0;
            return _ && a ? decodeURIComponent(a) : a;
          }
          function N(e) {
            return e === '/api' || e.startsWith('/api/');
          }
        })(d, d.exports),
        d.exports
      );
    }
      .call({})
      .default({
        name: 'app/api/image-proxy/route',
        staticRoutes: [
          {
            page: '/',
            regex: '^/(?:/)?$',
            routeKeys: {},
            namedRegex: '^/(?:/)?$',
          },
          {
            page: '/_not-found',
            regex: '^/_not\\-found(?:/)?$',
            routeKeys: {},
            namedRegex: '^/_not\\-found(?:/)?$',
          },
          {
            page: '/admin',
            regex: '^/admin(?:/)?$',
            routeKeys: {},
            namedRegex: '^/admin(?:/)?$',
          },
          {
            page: '/douban',
            regex: '^/douban(?:/)?$',
            routeKeys: {},
            namedRegex: '^/douban(?:/)?$',
          },
          {
            page: '/login',
            regex: '^/login(?:/)?$',
            routeKeys: {},
            namedRegex: '^/login(?:/)?$',
          },
          {
            page: '/orders',
            regex: '^/orders(?:/)?$',
            routeKeys: {},
            namedRegex: '^/orders(?:/)?$',
          },
          {
            page: '/play',
            regex: '^/play(?:/)?$',
            routeKeys: {},
            namedRegex: '^/play(?:/)?$',
          },
          {
            page: '/search',
            regex: '^/search(?:/)?$',
            routeKeys: {},
            namedRegex: '^/search(?:/)?$',
          },
          {
            page: '/subscription',
            regex: '^/subscription(?:/)?$',
            routeKeys: {},
            namedRegex: '^/subscription(?:/)?$',
          },
          {
            page: '/vip',
            regex: '^/vip(?:/)?$',
            routeKeys: {},
            namedRegex: '^/vip(?:/)?$',
          },
          {
            page: '/warning',
            regex: '^/warning(?:/)?$',
            routeKeys: {},
            namedRegex: '^/warning(?:/)?$',
          },
        ],
        dynamicRoutes: [
          {
            page: '/vip/buy/[planId]',
            regex: '^/vip/buy/([^/]+?)(?:/)?$',
            routeKeys: { nxtPplanId: 'nxtPplanId' },
            namedRegex: '^/vip/buy/(?<nxtPplanId>[^/]+?)(?:/)?$',
          },
        ],
        nextConfig: { basePath: '' },
      })
  ))(k, k, k);
export { gt as default };
