(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [872],
  {
    7099: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 9710));
    },
    9818: function (e, t, r) {
      'use strict';
      r.d(t, {
        Z: function () {
          return c;
        },
      });
      var a = r(5663);
      let s = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
        n = function () {
          for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
            t[r] = arguments[r];
          return t.filter((e, t, r) => !!e && r.indexOf(e) === t).join(' ');
        };
      var l = {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      };
      let i = (0, a.forwardRef)((e, t) => {
          let {
            color: r = 'currentColor',
            size: s = 24,
            strokeWidth: i = 2,
            absoluteStrokeWidth: c,
            className: d = '',
            children: o,
            iconNode: u,
            ...x
          } = e;
          return (0, a.createElement)(
            'svg',
            {
              ref: t,
              ...l,
              width: s,
              height: s,
              stroke: r,
              strokeWidth: c ? (24 * Number(i)) / Number(s) : i,
              className: n('lucide', d),
              ...x,
            },
            [
              ...u.map((e) => {
                let [t, r] = e;
                return (0, a.createElement)(t, r);
              }),
              ...(Array.isArray(o) ? o : [o]),
            ]
          );
        }),
        c = (e, t) => {
          let r = (0, a.forwardRef)((r, l) => {
            let { className: c, ...d } = r;
            return (0, a.createElement)(i, {
              ref: l,
              iconNode: t,
              className: n('lucide-'.concat(s(e)), c),
              ...d,
            });
          });
          return (r.displayName = ''.concat(e)), r;
        };
    },
    1210: function (e, t, r) {
      'use strict';
      r.d(t, {
        Z: function () {
          return a;
        },
      });
      let a = (0, r(9818).Z)('Check', [
        ['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }],
      ]);
    },
    2280: function (e, t, r) {
      'use strict';
      r.d(t, {
        Z: function () {
          return a;
        },
      });
      let a = (0, r(9818).Z)('Crown', [
        [
          'path',
          {
            d: 'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z',
            key: '1vdc57',
          },
        ],
        ['path', { d: 'M5 21h14', key: '11awu3' }],
      ]);
    },
    1383: function (e, t, r) {
      'use strict';
      var a = r(3423);
      r.o(a, 'useParams') &&
        r.d(t, {
          useParams: function () {
            return a.useParams;
          },
        }),
        r.o(a, 'usePathname') &&
          r.d(t, {
            usePathname: function () {
              return a.usePathname;
            },
          }),
        r.o(a, 'useRouter') &&
          r.d(t, {
            useRouter: function () {
              return a.useRouter;
            },
          }),
        r.o(a, 'useSearchParams') &&
          r.d(t, {
            useSearchParams: function () {
              return a.useSearchParams;
            },
          });
    },
    9710: function (e, t, r) {
      'use strict';
      r.r(t),
        r.d(t, {
          default: function () {
            return d;
          },
        });
      var a = r(7569),
        s = r(5663),
        n = r(1383),
        l = r(2280);
      let i = (0, r(9818).Z)('Sparkles', [
        [
          'path',
          {
            d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
            key: '4pj2yx',
          },
        ],
        ['path', { d: 'M20 3v4', key: '1olli1' }],
        ['path', { d: 'M22 5h-4', key: '1gvqau' }],
        ['path', { d: 'M4 17v2', key: 'vumght' }],
        ['path', { d: 'M5 18H3', key: 'zchphs' }],
      ]);
      var c = r(1210);
      function d() {
        let e = (0, n.useRouter)(),
          [t, r] = (0, s.useState)([]),
          [d, o] = (0, s.useState)(!0);
        (0, s.useEffect)(() => {
          u();
        }, []);
        let u = async () => {
            try {
              let e = await fetch('/api/user/plans'),
                t = await e.json();
              t.success && r(t.plans);
            } catch (e) {
              console.error('获取套餐失败:', e);
            } finally {
              o(!1);
            }
          },
          x = (t) => {
            e.push('/vip/buy/'.concat(t));
          };
        return d
          ? (0, a.jsx)('div', {
              className:
                'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800',
              children: (0, a.jsxs)('div', {
                className: 'text-center',
                children: [
                  (0, a.jsx)('div', {
                    className:
                      'animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto',
                  }),
                  (0, a.jsx)('p', {
                    className: 'mt-4 text-gray-600 dark:text-gray-400',
                    children: '加载中...',
                  }),
                ],
              }),
            })
          : (0, a.jsx)('div', {
              className:
                'min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8',
              children: (0, a.jsxs)('div', {
                className: 'max-w-7xl mx-auto',
                children: [
                  (0, a.jsxs)('div', {
                    className: 'text-center mb-12',
                    children: [
                      (0, a.jsx)('div', {
                        className: 'flex items-center justify-center mb-4',
                        children: (0, a.jsx)(l.Z, {
                          className: 'w-12 h-12 text-yellow-500',
                        }),
                      }),
                      (0, a.jsx)('h1', {
                        className:
                          'text-4xl font-bold text-gray-900 dark:text-white mb-4',
                        children: '开通 MoonTV 会员',
                      }),
                      (0, a.jsx)('p', {
                        className: 'text-xl text-gray-600 dark:text-gray-300',
                        children: '享受无广告、高清播放等专属特权',
                      }),
                    ],
                  }),
                  0 === t.length
                    ? (0, a.jsx)('div', {
                        className: 'text-center py-12',
                        children: (0, a.jsx)('p', {
                          className: 'text-gray-500 dark:text-gray-400',
                          children: '暂无可用套餐，请联系管理员',
                        }),
                      })
                    : (0, a.jsx)('div', {
                        className:
                          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
                        children: t.map((e) => {
                          let t = 2 === e.sort_order;
                          return (0, a.jsxs)(
                            'div',
                            {
                              className:
                                'relative rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 '.concat(
                                  t
                                    ? 'ring-4 ring-purple-500 ring-opacity-50'
                                    : ''
                                ),
                              children: [
                                t &&
                                  (0, a.jsxs)('div', {
                                    className:
                                      'absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg flex items-center gap-1',
                                    children: [
                                      (0, a.jsx)(i, { className: 'w-4 h-4' }),
                                      (0, a.jsx)('span', {
                                        className: 'text-sm font-semibold',
                                        children: '推荐',
                                      }),
                                    ],
                                  }),
                                (0, a.jsxs)('div', {
                                  className: 'bg-white dark:bg-gray-800 p-8',
                                  children: [
                                    (0, a.jsx)('h2', {
                                      className:
                                        'text-2xl font-bold text-gray-900 dark:text-white mb-2',
                                      children: e.name,
                                    }),
                                    (0, a.jsx)('p', {
                                      className:
                                        'text-gray-600 dark:text-gray-400 mb-6 h-12',
                                      children: e.description,
                                    }),
                                    (0, a.jsxs)('div', {
                                      className: 'mb-6',
                                      children: [
                                        (0, a.jsxs)('div', {
                                          className:
                                            'flex items-baseline gap-2',
                                          children: [
                                            (0, a.jsxs)('span', {
                                              className:
                                                'text-4xl font-bold text-purple-600 dark:text-purple-400',
                                              children: ['\xa5', e.price],
                                            }),
                                            e.original_price &&
                                              e.original_price > e.price &&
                                              (0, a.jsxs)('span', {
                                                className:
                                                  'text-lg text-gray-400 line-through',
                                                children: [
                                                  '\xa5',
                                                  e.original_price,
                                                ],
                                              }),
                                          ],
                                        }),
                                        (0, a.jsxs)('p', {
                                          className:
                                            'text-sm text-gray-500 dark:text-gray-400 mt-1',
                                          children: [e.duration_days, ' 天'],
                                        }),
                                      ],
                                    }),
                                    (0, a.jsx)('div', {
                                      className: 'space-y-3 mb-8',
                                      children:
                                        e.features &&
                                        Array.isArray(e.features) &&
                                        e.features.length > 0
                                          ? e.features.map((e, t) =>
                                              (0, a.jsxs)(
                                                'div',
                                                {
                                                  className:
                                                    'flex items-center gap-2 text-gray-700 dark:text-gray-300',
                                                  children: [
                                                    (0, a.jsx)(c.Z, {
                                                      className:
                                                        'w-5 h-5 text-green-500 flex-shrink-0',
                                                    }),
                                                    (0, a.jsx)('span', {
                                                      children: e,
                                                    }),
                                                  ],
                                                },
                                                t
                                              )
                                            )
                                          : (0, a.jsxs)('div', {
                                              className:
                                                'flex items-center gap-2 text-gray-700 dark:text-gray-300',
                                              children: [
                                                (0, a.jsx)(c.Z, {
                                                  className:
                                                    'w-5 h-5 text-green-500 flex-shrink-0',
                                                }),
                                                (0, a.jsx)('span', {
                                                  children: 'VIP 特权',
                                                }),
                                              ],
                                            }),
                                    }),
                                    (0, a.jsx)('button', {
                                      onClick: () => x(e.id),
                                      className:
                                        'w-full py-3 px-6 rounded-lg font-semibold transition-colors '.concat(
                                          t
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                                        ),
                                      children: '立即购买',
                                    }),
                                  ],
                                }),
                              ],
                            },
                            e.id
                          );
                        }),
                      }),
                  (0, a.jsxs)('div', {
                    className:
                      'mt-12 text-center text-sm text-gray-500 dark:text-gray-400',
                    children: [
                      (0, a.jsx)('p', {
                        children:
                          '\xb7 购买后请上传支付凭证，管理员将在 24 小时内审核开通',
                      }),
                      (0, a.jsx)('p', {
                        className: 'mt-2',
                        children: '\xb7 如有问题请联系客服',
                      }),
                    ],
                  }),
                ],
              }),
            });
      }
    },
  },
  function (e) {
    e.O(0, [314, 133, 744], function () {
      return e((e.s = 7099));
    }),
      (_N_E = e.O());
  },
]);
