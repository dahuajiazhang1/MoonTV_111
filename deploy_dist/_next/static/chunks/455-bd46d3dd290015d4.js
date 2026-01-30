'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [455],
  {
    2819: function (e, t, a) {
      a.d(t, {
        Z: function () {
          return o;
        },
      });
      var r = a(7569);
      let o = (e) => {
        let { aspectRatio: t } = e;
        return (0, r.jsx)('div', {
          className: 'w-full '.concat(t, ' rounded-lg'),
          style: {
            background:
              'linear-gradient(90deg, var(--skeleton-color) 25%, var(--skeleton-highlight) 50%, var(--skeleton-color) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shine 1.5s infinite',
          },
          children: (0, r.jsx)('style', {
            children:
              '\n      @keyframes shine {\n        0% { background-position: -200% 0; }\n        100% { background-position: 200% 0; }\n      }\n      \n      /* 亮色模式变量 */\n      :root {\n        --skeleton-color: #f0f0f0;\n        --skeleton-highlight: #e0e0e0;\n      }\n      \n      /* 暗色模式变量 */\n      @media (prefers-color-scheme: dark) {\n        :root {\n          --skeleton-color: #2d2d2d;\n          --skeleton-highlight: #3d3d3d;\n        }\n      }\n      \n      .dark {\n        --skeleton-color: #2d2d2d;\n        --skeleton-highlight: #3d3d3d;\n      }\n    ',
          }),
        });
      };
    },
    7703: function (e, t, a) {
      a.d(t, {
        NavigationLoadingProvider: function () {
          return i;
        },
        w: function () {
          return l;
        },
      });
      var r = a(7569),
        o = a(1383),
        s = a(5663);
      let n = (0, s.createContext)({
          isLoading: !1,
          startLoading: () => {},
          stopLoading: () => {},
        }),
        l = () => (0, s.useContext)(n);
      function i(e) {
        let { children: t } = e,
          [a, l] = (0, s.useState)(!1),
          i = (0, o.usePathname)(),
          c = (0, o.useSearchParams)(),
          d = (0, s.useCallback)(() => {
            l(!0);
          }, []),
          u = (0, s.useCallback)(() => {
            l(!1);
          }, []);
        return (
          (0, s.useEffect)(() => {
            let e = setTimeout(() => {
              l(!1);
            }, 300);
            return () => clearTimeout(e);
          }, [i, c]),
          (0, r.jsx)(n.Provider, {
            value: { isLoading: a, startLoading: d, stopLoading: u },
            children: t,
          })
        );
      }
    },
    5036: function (e, t, a) {
      var r = a(7569);
      t.Z = (e) => {
        let { children: t } = e;
        return (0, r.jsx)(r.Fragment, { children: t });
      };
    },
    4801: function (e, t, a) {
      a.d(t, {
        Z: function () {
          return f;
        },
      });
      var r = a(7569),
        o = a(6774),
        s = a(7407),
        n = a(2956),
        l = a(898),
        i = a(1290),
        c = a(7484),
        d = a(1383),
        u = a(5663),
        h = a(4090),
        g = a(5941),
        m = a(2819),
        x = a(1692),
        p = a(4819),
        b = a(8091),
        y = (e) => {
          let {
              isOpen: t,
              onClose: a,
              title: o,
              actions: s,
              poster: n,
              sources: l,
              isAggregate: i,
              sourceName: d,
              currentEpisode: h,
              totalEpisodes: g,
              origin: m = 'vod',
            } = e,
            [y, v] = (0, u.useState)(!1),
            [f, w] = (0, u.useState)(!1);
          if (
            ((0, u.useEffect)(() => {
              let e, a;
              return (
                t
                  ? (v(!0),
                    (e = requestAnimationFrame(() => {
                      e = requestAnimationFrame(() => {
                        w(!0);
                      });
                    })))
                  : (w(!1),
                    (a = window.setTimeout(() => {
                      v(!1);
                    }, 200))),
                () => {
                  e && cancelAnimationFrame(e), a && window.clearTimeout(a);
                }
              );
            }, [t]),
            (0, u.useEffect)(() => {
              if (y) {
                let e = window.scrollY,
                  t = window.scrollX,
                  a = document.body,
                  r = document.documentElement,
                  o = window.innerWidth - r.clientWidth,
                  s = {
                    position: a.style.position,
                    top: a.style.top,
                    left: a.style.left,
                    right: a.style.right,
                    width: a.style.width,
                    paddingRight: a.style.paddingRight,
                    overflow: a.style.overflow,
                  };
                return (
                  (a.style.position = 'fixed'),
                  (a.style.top = '-'.concat(e, 'px')),
                  (a.style.left = '-'.concat(t, 'px')),
                  (a.style.right = '0'),
                  (a.style.width = '100%'),
                  (a.style.overflow = 'hidden'),
                  (a.style.paddingRight = ''.concat(o, 'px')),
                  () => {
                    (a.style.position = s.position),
                      (a.style.top = s.top),
                      (a.style.left = s.left),
                      (a.style.right = s.right),
                      (a.style.width = s.width),
                      (a.style.paddingRight = s.paddingRight),
                      (a.style.overflow = s.overflow),
                      requestAnimationFrame(() => {
                        window.scrollTo(t, e);
                      });
                  }
                );
              }
            }, [y]),
            (0, u.useEffect)(() => {
              let e = (e) => {
                'Escape' === e.key && a();
              };
              if (y)
                return (
                  document.addEventListener('keydown', e),
                  () => document.removeEventListener('keydown', e)
                );
            }, [y, a]),
            !y)
          )
            return null;
          let k = (e) => {
              switch (e) {
                case 'danger':
                  return 'text-red-600 dark:text-red-400';
                case 'primary':
                  return 'text-green-600 dark:text-green-400';
                default:
                  return 'text-gray-700 dark:text-gray-300';
              }
            },
            j = (e) => {
              switch (e) {
                case 'danger':
                  return 'hover:bg-red-50/50 dark:hover:bg-red-900/10';
                case 'primary':
                  return 'hover:bg-green-50/50 dark:hover:bg-green-900/10';
                default:
                  return 'hover:bg-gray-50/50 dark:hover:bg-gray-800/20';
              }
            };
          return (0, b.createPortal)(
            (0, r.jsxs)('div', {
              className: 'fixed inset-0 z-[9999] flex items-end justify-center',
              onTouchMove: (e) => {
                e.preventDefault(), e.stopPropagation();
              },
              style: { touchAction: 'none' },
              children: [
                (0, r.jsx)('div', {
                  className:
                    'absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out '.concat(
                      f ? 'opacity-100' : 'opacity-0'
                    ),
                  onClick: a,
                  onTouchMove: (e) => {
                    e.preventDefault();
                  },
                  onWheel: (e) => {
                    e.preventDefault();
                  },
                  style: {
                    backdropFilter: 'blur(4px)',
                    willChange: 'opacity',
                    touchAction: 'none',
                  },
                }),
                (0, r.jsxs)('div', {
                  className:
                    'relative w-full max-w-lg mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-200 ease-out',
                  onTouchMove: (e) => {
                    e.stopPropagation();
                  },
                  style: {
                    marginBottom: 'calc(1rem + env(safe-area-inset-bottom))',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transform: f
                      ? 'translateY(0) translateZ(0)'
                      : 'translateY(100%) translateZ(0)',
                    opacity: f ? 1 : 0,
                    touchAction: 'auto',
                  },
                  children: [
                    (0, r.jsxs)('div', {
                      className:
                        'flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800',
                      children: [
                        (0, r.jsxs)('div', {
                          className: 'flex items-center gap-3 flex-1 min-w-0',
                          children: [
                            n &&
                              (0, r.jsx)('div', {
                                className:
                                  'relative w-12 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0',
                                children: (0, r.jsx)(c.default, {
                                  src: n,
                                  alt: o,
                                  fill: !0,
                                  className:
                                    'live' === m
                                      ? 'object-contain'
                                      : 'object-cover',
                                  loading: 'lazy',
                                }),
                              }),
                            (0, r.jsxs)('div', {
                              className: 'min-w-0 flex-1',
                              children: [
                                (0, r.jsxs)('div', {
                                  className: 'flex items-center gap-2 mb-1',
                                  children: [
                                    (0, r.jsx)('h3', {
                                      className:
                                        'text-lg font-semibold text-gray-900 dark:text-gray-100 truncate',
                                      children: o,
                                    }),
                                    d &&
                                      (0, r.jsxs)('span', {
                                        className:
                                          'flex-shrink-0 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800',
                                        children: [
                                          'live' === m &&
                                            (0, r.jsx)(x.Z, {
                                              size: 12,
                                              className:
                                                'inline-block text-gray-500 dark:text-gray-400 mr-1.5',
                                            }),
                                          d,
                                        ],
                                      }),
                                  ],
                                }),
                                (0, r.jsx)('p', {
                                  className:
                                    'text-sm text-gray-500 dark:text-gray-400',
                                  children: '选择操作',
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsx)('button', {
                          onClick: a,
                          className:
                            'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150',
                          children: (0, r.jsx)(p.Z, {
                            size: 20,
                            className: 'text-gray-500 dark:text-gray-400',
                          }),
                        }),
                      ],
                    }),
                    (0, r.jsx)('div', {
                      className: 'px-4 py-2',
                      children: s.map((e, t) =>
                        (0, r.jsxs)(
                          'div',
                          {
                            children: [
                              (0, r.jsxs)('button', {
                                onClick: () => {
                                  e.onClick(), a();
                                },
                                disabled: e.disabled,
                                className:
                                  '\n                  w-full flex items-center gap-4 py-4 px-2 transition-all duration-150 ease-out\n                  '.concat(
                                    e.disabled
                                      ? 'opacity-50 cursor-not-allowed'
                                      : ''.concat(
                                          j(e.color),
                                          ' active:scale-[0.98]'
                                        ),
                                    '\n                '
                                  ),
                                style: {
                                  willChange: 'transform, background-color',
                                },
                                children: [
                                  (0, r.jsx)('div', {
                                    className:
                                      'w-6 h-6 flex items-center justify-center flex-shrink-0',
                                    children: (0, r.jsx)('span', {
                                      className:
                                        'transition-colors duration-150 '.concat(
                                          e.disabled
                                            ? 'text-gray-400 dark:text-gray-600'
                                            : k(e.color)
                                        ),
                                      children: e.icon,
                                    }),
                                  }),
                                  (0, r.jsx)('span', {
                                    className:
                                      '\n                  text-left font-medium text-base flex-1\n                  '.concat(
                                        e.disabled
                                          ? 'text-gray-400 dark:text-gray-600'
                                          : 'text-gray-900 dark:text-gray-100',
                                        '\n                '
                                      ),
                                    children: e.label,
                                  }),
                                  'play' === e.id &&
                                    h &&
                                    g &&
                                    (0, r.jsxs)('span', {
                                      className:
                                        'text-sm text-gray-500 dark:text-gray-400 font-medium',
                                      children: [h, '/', g],
                                    }),
                                ],
                              }),
                              t < s.length - 1 &&
                                (0, r.jsx)('div', {
                                  className:
                                    'border-b border-gray-100 dark:border-gray-800 ml-10',
                                }),
                            ],
                          },
                          e.id
                        )
                      ),
                    }),
                    i &&
                      l &&
                      l.length > 0 &&
                      (0, r.jsxs)('div', {
                        className:
                          'px-4 py-3 border-t border-gray-100 dark:border-gray-800',
                        children: [
                          (0, r.jsxs)('div', {
                            className: 'mb-3',
                            children: [
                              (0, r.jsx)('h4', {
                                className:
                                  'text-sm font-medium text-gray-900 dark:text-gray-100 mb-1',
                                children: '可用播放源',
                              }),
                              (0, r.jsxs)('p', {
                                className:
                                  'text-xs text-gray-500 dark:text-gray-400',
                                children: ['共 ', l.length, ' 个播放源'],
                              }),
                            ],
                          }),
                          (0, r.jsx)('div', {
                            className: 'max-h-32 overflow-y-auto',
                            children: (0, r.jsx)('div', {
                              className: 'grid grid-cols-2 gap-2',
                              children: l.map((e, t) =>
                                (0, r.jsxs)(
                                  'div',
                                  {
                                    className:
                                      'flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30',
                                    children: [
                                      (0, r.jsx)('div', {
                                        className:
                                          'w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full flex-shrink-0',
                                      }),
                                      (0, r.jsx)('span', {
                                        className:
                                          'text-xs text-gray-600 dark:text-gray-400 truncate',
                                        children: e,
                                      }),
                                    ],
                                  },
                                  t
                                )
                              ),
                            }),
                          }),
                        ],
                      }),
                  ],
                }),
              ],
            }),
            document.body
          );
        },
        v = a(7703);
      function f(e) {
        var t, a, x, p, b, f, w, k;
        let {
            id: j,
            title: N = '',
            query: C = '',
            poster: P = '',
            episodes: _,
            source: E,
            source_name: S,
            progress: R = 0,
            year: z,
            from: T,
            currentEpisode: Z,
            douban_id: L,
            onDelete: D,
            rate: M,
            items: B,
            type: F = '',
            isBangumi: q = !1,
          } = e,
          A = (0, d.useRouter)(),
          { startLoading: I } = (0, v.w)(),
          [U, H] = (0, u.useState)(!1),
          [W, Y] = (0, u.useState)(!1),
          [O, J] = (0, u.useState)(!1),
          [V, X] = (0, u.useState)(!1),
          [G, K] = (0, u.useState)(!1),
          [Q, $] = (0, u.useState)(null),
          ee = 'search' === T && !!(null == B ? void 0 : B.length),
          et = (0, u.useMemo)(() => {
            if (!ee || !B) return null;
            let e = new Map(),
              t = new Map();
            B.forEach((a) => {
              var r;
              a.douban_id &&
                0 !== a.douban_id &&
                e.set(a.douban_id, (e.get(a.douban_id) || 0) + 1);
              let o =
                (null === (r = a.episodes) || void 0 === r
                  ? void 0
                  : r.length) || 0;
              o > 0 && t.set(o, (t.get(o) || 0) + 1);
            });
            let a = (e) => {
              let t,
                a = 0;
              return (
                e.forEach((e, r) => {
                  e > a && ((a = e), (t = r));
                }),
                t
              );
            };
            return {
              first: B[0],
              mostFrequentDoubanId: a(e),
              mostFrequentEpisodes: a(t) || 0,
            };
          }, [ee, B]),
          ea =
            null !== (a = null == et ? void 0 : et.first.title) && void 0 !== a
              ? a
              : N,
          er =
            null !== (x = null == et ? void 0 : et.first.poster) && void 0 !== x
              ? x
              : P,
          eo =
            null !== (p = null == et ? void 0 : et.first.source) && void 0 !== p
              ? p
              : E,
          es =
            null !== (b = null == et ? void 0 : et.first.id) && void 0 !== b
              ? b
              : j,
          en =
            null !== (f = null == et ? void 0 : et.mostFrequentDoubanId) &&
            void 0 !== f
              ? f
              : L,
          el =
            null !== (w = null == et ? void 0 : et.mostFrequentEpisodes) &&
            void 0 !== w
              ? w
              : _,
          ei =
            null !== (k = null == et ? void 0 : et.first.year) && void 0 !== k
              ? k
              : z,
          ec = C || '',
          ed = ee
            ? (null == et
                ? void 0
                : null === (t = et.first.episodes) || void 0 === t
                ? void 0
                : t.length) === 1
              ? 'movie'
              : 'tv'
            : F,
          eu = (0, u.useCallback)(async () => {
            if ('douban' !== T && eo && es)
              try {
                let e = await (0, h.at)(eo, es);
                H(e), X(!0);
                let t = (0, h.sO)(eo, es);
                (0, h.rq)('favoritesUpdated', (e) => {
                  let a = !!e[t];
                  H(a);
                });
              } catch (e) {
                console.error('检查收藏状态失败', e);
              }
          }, [T, eo, es]),
          eh = (0, u.useCallback)(
            async (e) => {
              if (
                (null == e || e.preventDefault(),
                null == e || e.stopPropagation(),
                'douban' !== T && eo && es)
              )
                try {
                  U
                    ? (await (0, h.r7)(eo, es), H(!1))
                    : (await (0, h.qn)(eo, es, {
                        title: ea,
                        source_name: S || '',
                        year: ei || '',
                        cover: er,
                        total_episodes: null != el ? el : 1,
                        save_time: Date.now(),
                        search_title: ec || '',
                      }),
                      H(!0));
                } catch (e) {
                  console.error('切换收藏状态失败', e);
                }
            },
            [T, eo, es, ea, S, ei, er, el, ec, U]
          ),
          eg = (0, u.useCallback)(
            async (e) => {
              if (
                (e.preventDefault(),
                e.stopPropagation(),
                'playrecord' === T && eo && es)
              )
                try {
                  await (0, h.Ji)(eo, es), null == D || D();
                } catch (e) {
                  console.error('删除播放记录失败', e);
                }
            },
            [T, eo, es, D]
          ),
          em = (0, u.useCallback)(() => {
            I(),
              'douban' === T
                ? A.push(
                    '/play?title='
                      .concat(encodeURIComponent(ea.trim()))
                      .concat(ei ? '&year='.concat(ei) : '')
                      .concat(ed ? '&stype='.concat(ed) : '')
                  )
                : eo &&
                  es &&
                  A.push(
                    '/play?source='
                      .concat(eo, '&id=')
                      .concat(es, '&title=')
                      .concat(encodeURIComponent(ea))
                      .concat(ei ? '&year='.concat(ei) : '')
                      .concat(ee ? '&prefer=true' : '')
                      .concat(
                        ec
                          ? '&stitle='.concat(encodeURIComponent(ec.trim()))
                          : ''
                      )
                      .concat(ed ? '&stype='.concat(ed) : '')
                  );
          }, [T, eo, es, A, ea, ei, ee, ec, ed, I]),
          ex = (0, u.useMemo)(() => {
            let e = {
              playrecord: {
                showSourceName: !0,
                showProgress: !0,
                showPlayButton: !0,
                showHeart: !0,
                showCheckCircle: !0,
                showDoubanLink: !!en,
                showRating: !1,
              },
              favorite: {
                showSourceName: !0,
                showProgress: !1,
                showPlayButton: !0,
                showHeart: !0,
                showCheckCircle: !1,
                showDoubanLink: !!en,
                showRating: !1,
              },
              search: {
                showSourceName: !0,
                showProgress: !1,
                showPlayButton: !0,
                showHeart: !ee,
                showCheckCircle: !1,
                showDoubanLink: !!en,
                showRating: !1,
              },
              douban: {
                showSourceName: !1,
                showProgress: !1,
                showPlayButton: !0,
                showHeart: !1,
                showCheckCircle: !1,
                showDoubanLink: !0,
                showRating: !!M,
              },
            };
            return e[T] || e.search;
          }, [T, ee, en, M]);
        return (0, r.jsxs)('div', {
          className:
            'group relative w-full rounded-lg bg-transparent cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.05] hover:z-[500]',
          style: {
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          },
          onContextMenu: (e) => {
            e.preventDefault(), e.stopPropagation(), K(!0);
          },
          onTouchStart: (e) => {
            e.stopPropagation(),
              Q && window.clearTimeout(Q),
              $(
                window.setTimeout(() => {
                  K(!0);
                }, 500)
              );
          },
          onTouchEnd: () => {
            Q && (window.clearTimeout(Q), $(null));
          },
          onTouchCancel: () => {
            Q && (window.clearTimeout(Q), $(null));
          },
          onMouseEnter: () => {
            if ('favorite' === T && !U) {
              H(!0), X(!0);
              return;
            }
            ex.showHeart && !V && eu();
          },
          children: [
            (0, r.jsxs)('div', {
              className: 'relative aspect-[2/3] overflow-hidden rounded-lg',
              children: [
                !W && (0, r.jsx)(m.Z, { aspectRatio: 'aspect-[2/3]' }),
                (0, r.jsx)(c.default, {
                  src: (0, g.a8)(er),
                  alt: ea,
                  fill: !0,
                  className: 'object-cover',
                  referrerPolicy: 'no-referrer',
                  loading: 'lazy',
                  onLoad: () => Y(!0),
                  onError: (e) => {
                    let t = e.target;
                    t.dataset.retried ||
                      ((t.dataset.retried = 'true'),
                      setTimeout(() => {
                        t.src = (0, g.a8)(er);
                      }, 2e3));
                  },
                }),
                (0, r.jsx)('div', {
                  className:
                    'absolute inset-0 bg-gradient-to-t from-black/80 via-black-20 to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100',
                }),
                ex.showPlayButton &&
                  (0, r.jsx)('div', {
                    className:
                      'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition',
                    children: (0, r.jsx)(o.Z, {
                      size: 50,
                      strokeWidth: 0.8,
                      className:
                        'text-white fill-transparent hover:fill-green-500 hover:scale-[1.1] transition',
                      onClick: (e) => {
                        e.stopPropagation(), em();
                      },
                    }),
                  }),
                (ex.showHeart || ex.showCheckCircle) &&
                  (0, r.jsxs)('div', {
                    className:
                      'absolute bottom-3 right-3 flex gap-3 opacity-0 translate-y-2 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0',
                    children: [
                      ex.showCheckCircle &&
                        (0, r.jsx)(s.Z, {
                          onClick: eg,
                          size: 20,
                          className:
                            'text-white transition-all duration-300 ease-out hover:stroke-red-500 hover:scale-[1.1]',
                        }),
                      ex.showHeart &&
                        (0, r.jsx)(n.Z, {
                          onClick: eh,
                          size: 20,
                          className:
                            'transition-all duration-300 ease-out '.concat(
                              U
                                ? 'fill-red-600 stroke-red-600'
                                : 'fill-transparent stroke-white hover:stroke-red-400',
                              ' hover:scale-[1.1]'
                            ),
                        }),
                    ],
                  }),
                ex.showRating &&
                  M &&
                  en &&
                  (0, r.jsx)('div', {
                    className:
                      'absolute top-2 left-2 bg-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-md cursor-pointer hover:bg-pink-600 transition',
                    children: M,
                  }),
                'search' === T &&
                  ei &&
                  'unknown' !== ei.toLowerCase() &&
                  (0, r.jsx)('div', {
                    className:
                      'absolute top-2 left-2 bg-black/60 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-md',
                    children: ei,
                  }),
                ex.showDoubanLink &&
                  en &&
                  (0, r.jsx)('div', {
                    onClick: (e) => {
                      e.stopPropagation(),
                        q
                          ? window.open(
                              'https://bangumi.tv/subject/'.concat(en),
                              '_blank'
                            )
                          : window.open(
                              'https://movie.douban.com/subject/'.concat(en),
                              '_blank'
                            );
                    },
                    className:
                      'absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-green-600 hover:scale-[1.1] transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 cursor-pointer',
                    title: q ? '跳转到 Bangumi' : '跳转到豆瓣',
                    children: (0, r.jsxs)('svg', {
                      width: '16',
                      height: '16',
                      viewBox: '0 0 24 24',
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeWidth: '2',
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      children: [
                        (0, r.jsx)('path', {
                          d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
                        }),
                        (0, r.jsx)('path', {
                          d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
                        }),
                      ],
                    }),
                  }),
                el &&
                  el > 1 &&
                  (0, r.jsx)('div', {
                    className:
                      'absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md transition-all duration-300 ease-out group-hover:scale-110',
                    children: Z ? ''.concat(Z, '/').concat(el) : el,
                  }),
                ee &&
                  B &&
                  B.length > 0 &&
                  (0, r.jsx)('div', {
                    className:
                      'absolute bottom-2 right-2 flex flex-col items-end',
                    children: (0, r.jsxs)('div', {
                      className: 'relative group/sources',
                      children: [
                        (0, r.jsx)('div', {
                          className:
                            'bg-gray-700 text-white text-xs sm:text-xs w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-md hover:bg-gray-600 hover:scale-[1.1] transition-all duration-300 ease-out cursor-pointer',
                          onClick: (e) => {
                            e.stopPropagation(), J((e) => !e);
                          },
                          children: B.length,
                        }),
                        O &&
                          (0, r.jsx)('div', {
                            className:
                              'absolute bottom-full mb-2 right-0 sm:right-0 z-50',
                            children: (0, r.jsxs)('div', {
                              className:
                                'bg-gray-800/90 backdrop-blur-sm text-white text-xs sm:text-xs rounded-lg shadow-xl border border-white/10 p-1 sm:p-1.5 min-w-[70px] sm:min-w-[90px] max-w-[120px] sm:max-w-[160px] max-h-20 sm:max-h-40 overflow-auto',
                              children: [
                                (0, r.jsx)('div', {
                                  className: 'space-y-0.5 sm:space-y-1',
                                  children: B.map((e, t) =>
                                    (0, r.jsxs)(
                                      'div',
                                      {
                                        className:
                                          'flex items-center gap-1 sm:gap-1.5',
                                        children: [
                                          (0, r.jsx)('div', {
                                            className:
                                              'w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-400 rounded-full flex-shrink-0',
                                          }),
                                          (0, r.jsx)('span', {
                                            className:
                                              'truncate text-[10px] sm:text-xs leading-tight',
                                            title: e.source_name,
                                            children: e.source_name,
                                          }),
                                        ],
                                      },
                                      t
                                    )
                                  ),
                                }),
                                (0, r.jsx)('div', {
                                  className:
                                    'absolute top-full right-2 sm:right-3 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] sm:border-l-[6px] sm:border-r-[6px] sm:border-t-[6px] border-transparent border-t-gray-800/90',
                                }),
                              ],
                            }),
                          }),
                      ],
                    }),
                  }),
              ],
            }),
            ex.showProgress &&
              void 0 !== R &&
              (0, r.jsx)('div', {
                className:
                  'mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden',
                children: (0, r.jsx)('div', {
                  className:
                    'h-full bg-green-500 transition-all duration-500 ease-out',
                  style: { width: ''.concat(R, '%') },
                }),
              }),
            (0, r.jsxs)('div', {
              className: 'mt-2 text-center',
              children: [
                (0, r.jsxs)('div', {
                  className: 'relative',
                  children: [
                    (0, r.jsx)('span', {
                      className:
                        'block text-sm font-semibold truncate text-gray-900 dark:text-gray-100 transition-colors duration-300 ease-in-out group-hover:text-green-600 dark:group-hover:text-green-400 peer',
                      children: ea,
                    }),
                    (0, r.jsxs)('div', {
                      className:
                        'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 invisible peer-hover:opacity-100 peer-hover:visible transition-all duration-200 ease-out delay-100 whitespace-nowrap pointer-events-none',
                      children: [
                        ea,
                        (0, r.jsx)('div', {
                          className:
                            'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800',
                        }),
                      ],
                    }),
                  ],
                }),
                ex.showSourceName &&
                  S &&
                  (0, r.jsx)('span', {
                    className:
                      'block text-xs text-gray-500 dark:text-gray-400 mt-1',
                    children: (0, r.jsx)('span', {
                      className:
                        'inline-block border rounded px-2 py-0.5 border-gray-500/60 dark:border-gray-400/60 transition-all duration-300 ease-in-out group-hover:border-green-500/60 group-hover:text-green-600 dark:group-hover:text-green-400',
                      children: S,
                    }),
                  }),
              ],
            }),
            (0, r.jsx)(y, {
              isOpen: G,
              onClose: () => K(!1),
              title: ea,
              poster: (0, g.a8)(er),
              sourceName: S,
              isAggregate: ee,
              sources:
                ee && B
                  ? B.map((e) => e.source_name || '').filter(Boolean)
                  : [],
              currentEpisode: Z,
              totalEpisodes: el || void 0,
              origin: 'vod',
              actions: [
                {
                  id: 'play',
                  label: '播放',
                  icon: (0, r.jsx)(o.Z, { size: 20 }),
                  color: 'primary',
                  onClick: () => em(),
                },
                {
                  id: 'play-new-tab',
                  label: '在新标签页播放',
                  icon: (0, r.jsx)(l.Z, { size: 20 }),
                  color: 'default',
                  onClick: () => {
                    'douban' === T
                      ? window.open(
                          '/play?title='
                            .concat(encodeURIComponent(ea.trim()))
                            .concat(ei ? '&year='.concat(ei) : '')
                            .concat(ed ? '&stype='.concat(ed) : ''),
                          '_blank'
                        )
                      : eo &&
                        es &&
                        window.open(
                          '/play?source='
                            .concat(eo, '&id=')
                            .concat(es, '&title=')
                            .concat(encodeURIComponent(ea))
                            .concat(ei ? '&year='.concat(ei) : '')
                            .concat(ee ? '&prefer=true' : '')
                            .concat(
                              ec
                                ? '&stitle='.concat(
                                    encodeURIComponent(ec.trim())
                                  )
                                : ''
                            )
                            .concat(ed ? '&stype='.concat(ed) : ''),
                          '_blank'
                        );
                  },
                },
                ...('douban' !== T && !('search' === T && ee) && eo && es
                  ? [
                      U
                        ? {
                            id: 'unfavorite',
                            label: '取消收藏',
                            icon: (0, r.jsx)(n.Z, {
                              size: 18,
                              className: 'fill-red-600 stroke-red-600',
                            }),
                            color: 'danger',
                            onClick: (e) => eh(e),
                          }
                        : {
                            id: 'favorite',
                            label: '加入收藏',
                            icon: (0, r.jsx)(n.Z, {
                              size: 18,
                              className: 'fill-transparent stroke-gray-600',
                            }),
                            color: 'primary',
                            onClick: (e) => eh(e),
                          },
                    ]
                  : []),
                ...('playrecord' === T && eo && es
                  ? [
                      {
                        id: 'delete-record',
                        label: '删除播放记录',
                        icon: (0, r.jsx)(s.Z, { size: 18 }),
                        color: 'danger',
                        onClick: (e) => eg(e),
                      },
                    ]
                  : []),
                ...(en
                  ? [
                      {
                        id: 'open-link',
                        label: q ? '打开 Bangumi 页面' : '打开豆瓣页面',
                        icon: (0, r.jsx)(i.Z, { size: 18 }),
                        onClick: () => {
                          q
                            ? window.open(
                                'https://bangumi.tv/subject/'.concat(en),
                                '_blank'
                              )
                            : window.open(
                                'https://movie.douban.com/subject/'.concat(en),
                                '_blank'
                              );
                        },
                      },
                    ]
                  : []),
              ],
            }),
          ],
        });
      }
    },
  },
]);
