(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [930],
  {
    7809: function (e, r, t) {
      Promise.resolve().then(t.bind(t, 3016));
    },
    9818: function (e, r, t) {
      'use strict';
      t.d(r, {
        Z: function () {
          return d;
        },
      });
      var s = t(5663);
      let a = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
        l = function () {
          for (var e = arguments.length, r = Array(e), t = 0; t < e; t++)
            r[t] = arguments[t];
          return r.filter((e, r, t) => !!e && t.indexOf(e) === r).join(' ');
        };
      var n = {
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
      let i = (0, s.forwardRef)((e, r) => {
          let {
            color: t = 'currentColor',
            size: a = 24,
            strokeWidth: i = 2,
            absoluteStrokeWidth: d,
            className: c = '',
            children: o,
            iconNode: m,
            ...u
          } = e;
          return (0, s.createElement)(
            'svg',
            {
              ref: r,
              ...n,
              width: a,
              height: a,
              stroke: t,
              strokeWidth: d ? (24 * Number(i)) / Number(a) : i,
              className: l('lucide', c),
              ...u,
            },
            [
              ...m.map((e) => {
                let [r, t] = e;
                return (0, s.createElement)(r, t);
              }),
              ...(Array.isArray(o) ? o : [o]),
            ]
          );
        }),
        d = (e, r) => {
          let t = (0, s.forwardRef)((t, n) => {
            let { className: d, ...c } = t;
            return (0, s.createElement)(i, {
              ref: n,
              iconNode: r,
              className: l('lucide-'.concat(a(e)), d),
              ...c,
            });
          });
          return (t.displayName = ''.concat(e)), t;
        };
    },
    2280: function (e, r, t) {
      'use strict';
      t.d(r, {
        Z: function () {
          return s;
        },
      });
      let s = (0, t(9818).Z)('Crown', [
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
    1383: function (e, r, t) {
      'use strict';
      var s = t(3423);
      t.o(s, 'useParams') &&
        t.d(r, {
          useParams: function () {
            return s.useParams;
          },
        }),
        t.o(s, 'usePathname') &&
          t.d(r, {
            usePathname: function () {
              return s.usePathname;
            },
          }),
        t.o(s, 'useRouter') &&
          t.d(r, {
            useRouter: function () {
              return s.useRouter;
            },
          }),
        t.o(s, 'useSearchParams') &&
          t.d(r, {
            useSearchParams: function () {
              return s.useSearchParams;
            },
          });
    },
    3016: function (e, r, t) {
      'use strict';
      t.r(r),
        t.d(r, {
          default: function () {
            return m;
          },
        });
      var s = t(7569),
        a = t(5663),
        l = t(1383),
        n = t(2280),
        i = t(9818);
      let d = (0, i.Z)('Calendar', [
          ['path', { d: 'M8 2v4', key: '1cmpym' }],
          ['path', { d: 'M16 2v4', key: '4m81vk' }],
          [
            'rect',
            {
              width: '18',
              height: '18',
              x: '3',
              y: '4',
              rx: '2',
              key: '1hopcy',
            },
          ],
          ['path', { d: 'M3 10h18', key: '8toen8' }],
        ]),
        c = (0, i.Z)('Gift', [
          [
            'rect',
            { x: '3', y: '8', width: '18', height: '4', rx: '1', key: 'bkv52' },
          ],
          ['path', { d: 'M12 8v13', key: '1c76mn' }],
          [
            'path',
            { d: 'M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7', key: '6wjy6b' },
          ],
          [
            'path',
            {
              d: 'M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5',
              key: '1ihvrl',
            },
          ],
        ]),
        o = (0, i.Z)('ArrowRight', [
          ['path', { d: 'M5 12h14', key: '1ays0h' }],
          ['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }],
        ]);
      function m() {
        let e = (0, l.useRouter)(),
          [r, t] = (0, a.useState)(null),
          [i, m] = (0, a.useState)(!0),
          [u, x] = (0, a.useState)(!1);
        (0, a.useEffect)(() => {
          h();
        }, []);
        let h = async () => {
          try {
            let e = await fetch('/api/user/subscription'),
              r = await e.json();
            r.success && (x(r.subscribed), t(r.subscription));
          } catch (e) {
            console.error('获取订阅信息失败:', e);
          } finally {
            m(!1);
          }
        };
        if (i)
          return (0, s.jsx)('div', {
            className:
              'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800',
            children: (0, s.jsxs)('div', {
              className: 'text-center',
              children: [
                (0, s.jsx)('div', {
                  className:
                    'animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto',
                }),
                (0, s.jsx)('p', {
                  className: 'mt-4 text-gray-600 dark:text-gray-400',
                  children: '加载中...',
                }),
              ],
            }),
          });
        if (!u || !r)
          return (0, s.jsx)('div', {
            className:
              'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4',
            children: (0, s.jsx)('div', {
              className: 'max-w-md w-full text-center',
              children: (0, s.jsxs)('div', {
                className:
                  'bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8',
                children: [
                  (0, s.jsx)('div', {
                    className:
                      'w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4',
                    children: (0, s.jsx)(n.Z, {
                      className:
                        'w-10 h-10 text-purple-600 dark:text-purple-400',
                    }),
                  }),
                  (0, s.jsx)('h2', {
                    className:
                      'text-2xl font-bold text-gray-900 dark:text-white mb-2',
                    children: '开通会员享特权',
                  }),
                  (0, s.jsx)('p', {
                    className: 'text-gray-600 dark:text-gray-400 mb-6',
                    children: '您还不是会员，开通会员即可享受专属特权',
                  }),
                  (0, s.jsx)('button', {
                    onClick: () => e.push('/vip'),
                    className:
                      'w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition',
                    children: '查看套餐',
                  }),
                  (0, s.jsx)('button', {
                    onClick: () => e.push('/orders'),
                    className:
                      'w-full mt-3 py-3 px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition',
                    children: '查看订单',
                  }),
                ],
              }),
            }),
          });
        let p = r.days_remaining <= 7 && r.days_remaining > 0,
          g = 'expired' === r.status,
          f = [];
        if (r.plan_features) {
          if ('string' == typeof r.plan_features)
            try {
              f = JSON.parse(r.plan_features);
            } catch (e) {
              f = [r.plan_features];
            }
          else Array.isArray(r.plan_features) && (f = r.plan_features);
        }
        return (0, s.jsx)('div', {
          className:
            'min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8',
          children: (0, s.jsxs)('div', {
            className: 'max-w-3xl mx-auto',
            children: [
              (0, s.jsxs)('div', {
                className:
                  'bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-6',
                children: [
                  (0, s.jsx)('div', {
                    className: 'flex items-center justify-between mb-6',
                    children: (0, s.jsxs)('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        (0, s.jsx)('div', {
                          className:
                            'w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center',
                          children: (0, s.jsx)(n.Z, { className: 'w-8 h-8' }),
                        }),
                        (0, s.jsxs)('div', {
                          children: [
                            (0, s.jsx)('h1', {
                              className: 'text-2xl font-bold',
                              children: r.plan_name || 'VIP 会员',
                            }),
                            (0, s.jsx)('p', {
                              className: 'text-purple-100',
                              children: g ? '已过期' : '会员有效期内',
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  (0, s.jsxs)('div', {
                    className: 'grid grid-cols-2 gap-4',
                    children: [
                      (0, s.jsxs)('div', {
                        className:
                          'bg-white/10 backdrop-blur-sm rounded-lg p-4',
                        children: [
                          (0, s.jsxs)('div', {
                            className: 'flex items-center gap-2 mb-1',
                            children: [
                              (0, s.jsx)(d, { className: 'w-4 h-4' }),
                              (0, s.jsx)('span', {
                                className: 'text-sm text-purple-100',
                                children: '开通日期',
                              }),
                            ],
                          }),
                          (0, s.jsx)('p', {
                            className: 'text-lg font-semibold',
                            children: new Date(r.start_date).toLocaleDateString(
                              'zh-CN'
                            ),
                          }),
                        ],
                      }),
                      (0, s.jsxs)('div', {
                        className:
                          'bg-white/10 backdrop-blur-sm rounded-lg p-4',
                        children: [
                          (0, s.jsxs)('div', {
                            className: 'flex items-center gap-2 mb-1',
                            children: [
                              (0, s.jsx)(d, { className: 'w-4 h-4' }),
                              (0, s.jsx)('span', {
                                className: 'text-sm text-purple-100',
                                children: '到期日期',
                              }),
                            ],
                          }),
                          (0, s.jsx)('p', {
                            className: 'text-lg font-semibold',
                            children: new Date(r.end_date).toLocaleDateString(
                              'zh-CN'
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  !g &&
                    (0, s.jsxs)('div', {
                      className:
                        'mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center',
                      children: [
                        (0, s.jsx)('p', {
                          className: 'text-sm text-purple-100',
                          children: '剩余天数',
                        }),
                        (0, s.jsxs)('p', {
                          className: 'text-4xl font-bold mt-1',
                          children: [
                            r.days_remaining,
                            (0, s.jsx)('span', {
                              className: 'text-lg ml-1',
                              children: '天',
                            }),
                          ],
                        }),
                      ],
                    }),
                  p &&
                    (0, s.jsx)('div', {
                      className:
                        'mt-4 bg-yellow-500/20 border border-yellow-400/30 backdrop-blur-sm rounded-lg p-3 text-center',
                      children: (0, s.jsx)('p', {
                        className: 'text-sm font-medium',
                        children: '⚠️ 会员即将到期，请及时续费以继续享受特权',
                      }),
                    }),
                  g &&
                    (0, s.jsx)('div', {
                      className:
                        'mt-4 bg-red-500/20 border border-red-400/30 backdrop-blur-sm rounded-lg p-3 text-center',
                      children: (0, s.jsx)('p', {
                        className: 'text-sm font-medium',
                        children: '❌ 会员已过期，请续费以继续使用',
                      }),
                    }),
                ],
              }),
              (0, s.jsxs)('div', {
                className:
                  'bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6',
                children: [
                  (0, s.jsxs)('div', {
                    className: 'flex items-center gap-2 mb-6',
                    children: [
                      (0, s.jsx)(c, { className: 'w-6 h-6 text-purple-600' }),
                      (0, s.jsx)('h2', {
                        className:
                          'text-xl font-bold text-gray-900 dark:text-white',
                        children: '会员特权',
                      }),
                    ],
                  }),
                  f.length > 0
                    ? (0, s.jsx)('div', {
                        className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                        children: f.map((e, r) =>
                          (0, s.jsxs)(
                            'div',
                            {
                              className:
                                'flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg',
                              children: [
                                (0, s.jsx)('div', {
                                  className:
                                    'w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0',
                                  children: (0, s.jsx)('span', {
                                    className: 'text-white text-sm',
                                    children: '✓',
                                  }),
                                }),
                                (0, s.jsx)('span', {
                                  className:
                                    'text-gray-900 dark:text-white font-medium',
                                  children: e,
                                }),
                              ],
                            },
                            r
                          )
                        ),
                      })
                    : (0, s.jsx)('p', {
                        className:
                          'text-gray-600 dark:text-gray-400 text-center py-4',
                        children: '暂无特权信息',
                      }),
                ],
              }),
              (0, s.jsxs)('div', {
                className: 'grid grid-cols-2 gap-4',
                children: [
                  (0, s.jsxs)('button', {
                    onClick: () => e.push('/vip'),
                    className:
                      'py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2',
                    children: [
                      g ? '重新开通' : '续费会员',
                      (0, s.jsx)(o, { className: 'w-4 h-4' }),
                    ],
                  }),
                  (0, s.jsx)('button', {
                    onClick: () => e.push('/orders'),
                    className:
                      'py-3 px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition',
                    children: '订单记录',
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
      return e((e.s = 7809));
    }),
      (_N_E = e.O());
  },
]);
