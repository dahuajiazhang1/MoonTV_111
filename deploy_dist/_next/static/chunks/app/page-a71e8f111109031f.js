(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [931],
  {
    8939: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 7455));
    },
    5524: function (e, t, a) {
      'use strict';
      a.d(t, {
        default: function () {
          return s.a;
        },
      });
      var r = a(7728),
        s = a.n(r);
    },
    7455: function (e, t, a) {
      'use strict';
      a.r(t),
        a.d(t, {
          default: function () {
            return j;
          },
        });
      var r = a(7569),
        s = a(9818);
      let n = (0, s.Z)('ChevronRight', [
        ['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }],
      ]);
      var i = a(5524),
        o = a(5663),
        l = a(4989),
        c = a.n(l),
        d = a(7946),
        m = a(4090),
        u = a(5241),
        g = (e) => {
          let { options: t, active: a, onChange: s, className: n } = e,
            i = (0, o.useRef)(null),
            l = (0, o.useRef)([]),
            [c, d] = (0, o.useState)({ left: 0, width: 0 }),
            m = t.findIndex((e) => e.value === a),
            u = () => {
              if (m >= 0 && l.current[m] && i.current) {
                let e = l.current[m],
                  t = i.current;
                if (e && t) {
                  let a = e.getBoundingClientRect(),
                    r = t.getBoundingClientRect();
                  a.width > 0 && d({ left: a.left - r.left, width: a.width });
                }
              }
            };
          return (
            (0, o.useEffect)(() => {
              let e = setTimeout(u, 0);
              return () => clearTimeout(e);
            }, []),
            (0, o.useEffect)(() => {
              let e = setTimeout(u, 0);
              return () => clearTimeout(e);
            }, [m]),
            (0, r.jsxs)('div', {
              ref: i,
              className:
                'relative inline-flex bg-gray-300/80 rounded-full p-1 dark:bg-gray-700 '.concat(
                  n || ''
                ),
              children: [
                c.width > 0 &&
                  (0, r.jsx)('div', {
                    className:
                      'absolute top-1 bottom-1 bg-white dark:bg-gray-500 rounded-full shadow-sm transition-all duration-300 ease-out',
                    style: {
                      left: ''.concat(c.left, 'px'),
                      width: ''.concat(c.width, 'px'),
                    },
                  }),
                t.map((e, t) => {
                  let n = a === e.value;
                  return (0, r.jsx)(
                    'button',
                    {
                      ref: (e) => {
                        l.current[t] = e;
                      },
                      onClick: () => s(e.value),
                      className:
                        'relative z-10 w-16 px-3 py-1 text-xs sm:w-20 sm:py-2 sm:text-sm rounded-full font-medium transition-all duration-200 cursor-pointer '.concat(
                          n
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                        ),
                      children: e.label,
                    },
                    e.value
                  );
                }),
              ],
            })
          );
        };
      let x = (0, s.Z)('ChevronLeft', [
        ['path', { d: 'm15 18-6-6 6-6', key: '1wnfg3' }],
      ]);
      function h(e) {
        let { children: t, scrollDistance: a = 1e3 } = e,
          s = (0, o.useRef)(null),
          [i, l] = (0, o.useState)(!1),
          [c, d] = (0, o.useState)(!1),
          [m, u] = (0, o.useState)(!1),
          g = () => {
            if (s.current) {
              let { scrollWidth: e, clientWidth: t, scrollLeft: a } = s.current;
              d(e - (a + t) > 1), l(a > 1);
            }
          };
        return (
          (0, o.useEffect)(() => {
            g(), window.addEventListener('resize', g);
            let e = new ResizeObserver(() => {
              g();
            });
            return (
              s.current && e.observe(s.current),
              () => {
                window.removeEventListener('resize', g), e.disconnect();
              }
            );
          }, [t]),
          (0, o.useEffect)(() => {
            if (s.current) {
              let e = new MutationObserver(() => {
                setTimeout(g, 100);
              });
              return (
                e.observe(s.current, {
                  childList: !0,
                  subtree: !0,
                  attributes: !0,
                  attributeFilter: ['style', 'class'],
                }),
                () => e.disconnect()
              );
            }
          }, []),
          (0, r.jsxs)('div', {
            className: 'relative',
            onMouseEnter: () => {
              u(!0), g();
            },
            onMouseLeave: () => u(!1),
            children: [
              (0, r.jsx)('div', {
                ref: s,
                className:
                  'flex space-x-6 overflow-x-auto scrollbar-hide py-1 sm:py-2 pb-12 sm:pb-14 px-4 sm:px-6',
                onScroll: g,
                children: t,
              }),
              i &&
                (0, r.jsx)('div', {
                  className:
                    'hidden sm:flex absolute left-0 top-0 bottom-0 w-16 items-center justify-center z-[600] transition-opacity duration-200 '.concat(
                      m ? 'opacity-100' : 'opacity-0'
                    ),
                  style: { background: 'transparent', pointerEvents: 'none' },
                  children: (0, r.jsx)('div', {
                    className:
                      'absolute inset-0 flex items-center justify-center',
                    style: {
                      top: '40%',
                      bottom: '60%',
                      left: '-4.5rem',
                      pointerEvents: 'auto',
                    },
                    children: (0, r.jsx)('button', {
                      onClick: () => {
                        s.current &&
                          s.current.scrollBy({ left: -a, behavior: 'smooth' });
                      },
                      className:
                        'w-12 h-12 bg-white/95 rounded-full shadow-lg flex items-center justify-center hover:bg-white border border-gray-200 transition-transform hover:scale-105 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-600',
                      children: (0, r.jsx)(x, {
                        className: 'w-6 h-6 text-gray-600 dark:text-gray-300',
                      }),
                    }),
                  }),
                }),
              c &&
                (0, r.jsx)('div', {
                  className:
                    'hidden sm:flex absolute right-0 top-0 bottom-0 w-16 items-center justify-center z-[600] transition-opacity duration-200 '.concat(
                      m ? 'opacity-100' : 'opacity-0'
                    ),
                  style: { background: 'transparent', pointerEvents: 'none' },
                  children: (0, r.jsx)('div', {
                    className:
                      'absolute inset-0 flex items-center justify-center',
                    style: {
                      top: '40%',
                      bottom: '60%',
                      right: '-4.5rem',
                      pointerEvents: 'auto',
                    },
                    children: (0, r.jsx)('button', {
                      onClick: () => {
                        s.current &&
                          s.current.scrollBy({ left: a, behavior: 'smooth' });
                      },
                      className:
                        'w-12 h-12 bg-white/95 rounded-full shadow-lg flex items-center justify-center hover:bg-white border border-gray-200 transition-transform hover:scale-105 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-600',
                      children: (0, r.jsx)(n, {
                        className: 'w-6 h-6 text-gray-600 dark:text-gray-300',
                      }),
                    }),
                  }),
                }),
            ],
          })
        );
      }
      var p = a(4801);
      function y(e) {
        let { className: t, showAll: a = !1, hideHeader: s = !1 } = e,
          [n, i] = (0, o.useState)([]),
          [l, d] = (0, o.useState)(!0),
          [u, g] = (0, o.useState)(!1),
          [x, y] = (0, o.useState)(!1);
        (0, o.useEffect)(() => {
          y(!0);
          {
            let e = localStorage.getItem('simpleMode');
            null !== e && g(JSON.parse(e));
          }
        }, []);
        let v = (e) => {
          i(
            Object.entries(e)
              .map((e) => {
                let [t, a] = e;
                return { ...a, key: t };
              })
              .sort((e, t) => t.save_time - e.save_time)
          );
        };
        if (
          ((0, o.useEffect)(
            () => (
              (async () => {
                try {
                  d(!0);
                  let e = await (0, m.Rr)();
                  v(e);
                } catch (e) {
                  console.error('获取播放记录失败:', e), i([]);
                } finally {
                  d(!1);
                }
              })(),
              (0, m.rq)('playRecordsUpdated', (e) => {
                v(e);
              })
            ),
            []
          ),
          !l && 0 === n.length)
        )
          return null;
        let f = (e) =>
            0 === e.total_time ? 0 : (e.play_time / e.total_time) * 100,
          b = (e) => {
            let [t, a] = e.split('+');
            return { source: t, id: a };
          };
        return (0, r.jsxs)('section', {
          className: 'mb-8 '.concat(t || ''),
          children: [
            !s &&
              (0, r.jsxs)('div', {
                className: 'mb-4 flex items-center justify-between',
                children: [
                  (0, r.jsx)('h2', {
                    className:
                      'text-xl font-bold text-gray-800 dark:text-gray-200',
                    children: '继续观看',
                  }),
                  !l &&
                    n.length > 0 &&
                    (0, r.jsx)('button', {
                      className:
                        'text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                      onClick: async () => {
                        let { isConfirmed: e } = await c().fire({
                          title: '确认清空',
                          text: '确定要清空所有播放记录吗？',
                          icon: 'warning',
                          showCancelButton: !0,
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                        });
                        e &&
                          (await (0, m.jz)(),
                          i([]),
                          c().fire({
                            icon: 'success',
                            title: '已清空',
                            text: '所有播放记录已清空',
                            timer: 2e3,
                            showConfirmButton: !1,
                          }));
                      },
                      children: '清空',
                    }),
                ],
              }),
            x && (u || a)
              ? (0, r.jsx)('div', {
                  className:
                    'justify-start grid grid-cols-3 gap-x-2 gap-y-14 sm:gap-y-20 px-0 sm:px-2 sm:grid-cols-[repeat(auto-fill,_minmax(11rem,_1fr))] sm:gap-x-8',
                  children: l
                    ? Array.from({ length: 6 }).map((e, t) =>
                        (0, r.jsxs)(
                          'div',
                          {
                            className: 'w-full',
                            children: [
                              (0, r.jsx)('div', {
                                className:
                                  'relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800',
                                children: (0, r.jsx)('div', {
                                  className:
                                    'absolute inset-0 bg-gray-300 dark:bg-gray-700',
                                }),
                              }),
                              (0, r.jsx)('div', {
                                className:
                                  'mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800',
                              }),
                            ],
                          },
                          t
                        )
                      )
                    : n.map((e) => {
                        let { source: t, id: a } = b(e.key);
                        return (0, r.jsx)(
                          'div',
                          {
                            className: 'w-full',
                            children: (0, r.jsx)(p.Z, {
                              id: a,
                              title: e.title,
                              poster: e.cover,
                              year: e.year,
                              source: t,
                              source_name: e.source_name,
                              progress: f(e),
                              episodes: e.total_episodes,
                              currentEpisode: e.index,
                              query: e.search_title,
                              from: 'playrecord',
                              onDelete: () =>
                                i((t) => t.filter((t) => t.key !== e.key)),
                              type: e.total_episodes > 1 ? 'tv' : '',
                            }),
                          },
                          e.key
                        );
                      }),
                })
              : (0, r.jsx)(h, {
                  children: l
                    ? Array.from({ length: 6 }).map((e, t) =>
                        (0, r.jsxs)(
                          'div',
                          {
                            className:
                              'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                            children: [
                              (0, r.jsx)('div', {
                                className:
                                  'relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800',
                                children: (0, r.jsx)('div', {
                                  className:
                                    'absolute inset-0 bg-gray-300 dark:bg-gray-700',
                                }),
                              }),
                              (0, r.jsx)('div', {
                                className:
                                  'mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800',
                              }),
                              (0, r.jsx)('div', {
                                className:
                                  'mt-1 h-3 bg-gray-200 rounded animate-pulse dark:bg-gray-800',
                              }),
                            ],
                          },
                          t
                        )
                      )
                    : n.map((e) => {
                        let { source: t, id: a } = b(e.key);
                        return (0, r.jsx)(
                          'div',
                          {
                            className:
                              'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                            children: (0, r.jsx)(p.Z, {
                              id: a,
                              title: e.title,
                              poster: e.cover,
                              year: e.year,
                              source: t,
                              source_name: e.source_name,
                              progress: f(e),
                              episodes: e.total_episodes,
                              currentEpisode: e.index,
                              query: e.search_title,
                              from: 'playrecord',
                              onDelete: () =>
                                i((t) => t.filter((t) => t.key !== e.key)),
                              type: e.total_episodes > 1 ? 'tv' : '',
                            }),
                          },
                          e.key
                        );
                      }),
                }),
          ],
        });
      }
      var v = a(5036),
        f = a(7703),
        b = a(8959);
      function w() {
        let [e, t] = (0, o.useState)('home'),
          [a, s] = (0, o.useState)([]),
          [l, x] = (0, o.useState)([]),
          [w, j] = (0, o.useState)([]),
          [N, k] = (0, o.useState)([]),
          [_, S] = (0, o.useState)(!0),
          { announcement: E } = (0, b.W)(),
          { startLoading: C } = (0, f.w)(),
          [T, O] = (0, o.useState)(!1),
          [R, A] = (0, o.useState)(!1),
          [B, Z] = (0, o.useState)(!1);
        (0, o.useEffect)(() => {
          Z(!0);
          {
            let e = localStorage.getItem('simpleMode');
            null !== e && A(JSON.parse(e));
          }
        }, []),
          (0, o.useEffect)(() => {
            if (E) {
              let e = localStorage.getItem('hasSeenAnnouncement');
              e !== E ? O(!0) : O(!!(!e && E));
            }
          }, [E]);
        let [z, I] = (0, o.useState)([]);
        (0, o.useEffect)(() => {
          (async () => {
            try {
              S(!0);
              let e = localStorage.getItem('simpleMode');
              if (e && JSON.parse(e)) {
                S(!1);
                return;
              }
              let [t, a, r, n] = await Promise.all([
                (0, u.Z_)({ kind: 'movie', category: '热门', type: '全部' }),
                (0, u.Z_)({ kind: 'tv', category: 'tv', type: 'tv' }),
                (0, u.Z_)({ kind: 'tv', category: 'show', type: 'show' }),
                (0, d.W)(),
              ]);
              200 === t.code && s(t.list),
                200 === a.code && x(a.list),
                200 === r.code && j(r.list),
                k(n);
            } catch (e) {
              console.error('获取推荐数据失败:', e);
            } finally {
              S(!1);
            }
          })();
        }, []);
        let M = async (e) => {
          let t = await (0, m.Rr)();
          I(
            Object.entries(e)
              .sort((e, t) => {
                let [, a] = e,
                  [, r] = t;
                return r.save_time - a.save_time;
              })
              .map((e) => {
                let [a, r] = e,
                  s = a.indexOf('+'),
                  n = a.slice(0, s),
                  i = a.slice(s + 1),
                  o = t[a],
                  l = null == o ? void 0 : o.index;
                return {
                  id: i,
                  source: n,
                  title: r.title,
                  year: r.year,
                  poster: r.cover,
                  episodes: r.total_episodes,
                  source_name: r.source_name,
                  currentEpisode: l,
                  search_title: null == r ? void 0 : r.search_title,
                };
              })
          );
        };
        (0, o.useEffect)(() => {
          if ('favorites' === e)
            return (
              (async () => {
                let e = await (0, m.EE)();
                await M(e);
              })(),
              (0, m.rq)('favoritesUpdated', (e) => {
                M(e);
              })
            );
        }, [e]);
        let P = (e) => {
          O(!1), localStorage.setItem('hasSeenAnnouncement', e);
        };
        return (0, r.jsxs)(v.Z, {
          children: [
            (0, r.jsxs)('div', {
              className: 'px-2 sm:px-10 py-4 sm:py-8 overflow-visible',
              children: [
                (0, r.jsx)('div', {
                  className: 'mb-8 flex justify-center',
                  children: (0, r.jsx)(g, {
                    options: R
                      ? [
                          { label: '历史', value: 'history' },
                          { label: '收藏夹', value: 'favorites' },
                        ]
                      : [
                          { label: '首页', value: 'home' },
                          { label: '历史', value: 'history' },
                          { label: '收藏夹', value: 'favorites' },
                        ],
                    active: R && 'home' === e ? 'history' : e,
                    onChange: (e) => t(e),
                  }),
                }),
                (0, r.jsx)('div', {
                  className: 'max-w-[95%] mx-auto',
                  children:
                    'history' === e
                      ? (0, r.jsx)(y, { showAll: !0 })
                      : 'favorites' === e
                      ? (0, r.jsxs)('section', {
                          className: 'mb-8',
                          children: [
                            (0, r.jsxs)('div', {
                              className:
                                'mb-4 flex items-center justify-between',
                              children: [
                                (0, r.jsx)('h2', {
                                  className:
                                    'text-xl font-bold text-gray-800 dark:text-gray-200',
                                  children: '我的收藏',
                                }),
                                z.length > 0 &&
                                  (0, r.jsx)('button', {
                                    className:
                                      'text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                    onClick: async () => {
                                      let { isConfirmed: e } = await c().fire({
                                        title: '确认清空',
                                        text: '确定要清空所有收藏吗？',
                                        icon: 'warning',
                                        showCancelButton: !0,
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                      });
                                      e &&
                                        (await (0, m.j5)(),
                                        I([]),
                                        c().fire({
                                          icon: 'success',
                                          title: '已清空',
                                          text: '所有收藏已清空',
                                          timer: 2e3,
                                          showConfirmButton: !1,
                                        }));
                                    },
                                    children: '清空',
                                  }),
                              ],
                            }),
                            (0, r.jsxs)('div', {
                              className:
                                'justify-start grid grid-cols-3 gap-x-2 gap-y-14 sm:gap-y-20 px-0 sm:px-2 sm:grid-cols-[repeat(auto-fill,_minmax(11rem,_1fr))] sm:gap-x-8',
                              children: [
                                z.map((e) =>
                                  (0, r.jsx)(
                                    'div',
                                    {
                                      className: 'w-full',
                                      children: (0, r.jsx)(p.Z, {
                                        query: e.search_title,
                                        ...e,
                                        from: 'favorite',
                                        type: e.episodes > 1 ? 'tv' : '',
                                      }),
                                    },
                                    e.id + e.source
                                  )
                                ),
                                0 === z.length &&
                                  (0, r.jsx)('div', {
                                    className:
                                      'col-span-full text-center text-gray-500 py-8 dark:text-gray-400',
                                    children: '暂无收藏内容',
                                  }),
                              ],
                            }),
                          ],
                        })
                      : (0, r.jsxs)(r.Fragment, {
                          children: [
                            (0, r.jsx)(y, {}),
                            B &&
                              !R &&
                              (0, r.jsxs)(r.Fragment, {
                                children: [
                                  (0, r.jsxs)('section', {
                                    className: 'mb-8',
                                    children: [
                                      (0, r.jsxs)('div', {
                                        className:
                                          'mb-4 flex items-center justify-between',
                                        children: [
                                          (0, r.jsx)('h2', {
                                            className:
                                              'text-xl font-bold text-gray-800 dark:text-gray-200',
                                            children: '热门电影',
                                          }),
                                          (0, r.jsxs)(i.default, {
                                            href: '/douban?type=movie',
                                            onClick: C,
                                            className:
                                              'flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                            children: [
                                              '查看更多',
                                              (0, r.jsx)(n, {
                                                className: 'w-4 h-4 ml-1',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, r.jsx)(h, {
                                        children: _
                                          ? Array.from({ length: 8 }).map(
                                              (e, t) =>
                                                (0, r.jsxs)(
                                                  'div',
                                                  {
                                                    className:
                                                      'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                    children: [
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800',
                                                        children: (0, r.jsx)(
                                                          'div',
                                                          {
                                                            className:
                                                              'absolute inset-0 bg-gray-300 dark:bg-gray-700',
                                                          }
                                                        ),
                                                      }),
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800',
                                                      }),
                                                    ],
                                                  },
                                                  t
                                                )
                                            )
                                          : a.map((e, t) =>
                                              (0, r.jsx)(
                                                'div',
                                                {
                                                  className:
                                                    'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                  children: (0, r.jsx)(p.Z, {
                                                    from: 'douban',
                                                    title: e.title,
                                                    poster: e.poster,
                                                    douban_id: Number(e.id),
                                                    rate: e.rate,
                                                    year: e.year,
                                                    type: 'movie',
                                                  }),
                                                },
                                                t
                                              )
                                            ),
                                      }),
                                    ],
                                  }),
                                  (0, r.jsxs)('section', {
                                    className: 'mb-8',
                                    children: [
                                      (0, r.jsxs)('div', {
                                        className:
                                          'mb-4 flex items-center justify-between',
                                        children: [
                                          (0, r.jsx)('h2', {
                                            className:
                                              'text-xl font-bold text-gray-800 dark:text-gray-200',
                                            children: '热门剧集',
                                          }),
                                          (0, r.jsxs)(i.default, {
                                            href: '/douban?type=tv',
                                            onClick: C,
                                            className:
                                              'flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                            children: [
                                              '查看更多',
                                              (0, r.jsx)(n, {
                                                className: 'w-4 h-4 ml-1',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, r.jsx)(h, {
                                        children: _
                                          ? Array.from({ length: 8 }).map(
                                              (e, t) =>
                                                (0, r.jsxs)(
                                                  'div',
                                                  {
                                                    className:
                                                      'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                    children: [
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800',
                                                        children: (0, r.jsx)(
                                                          'div',
                                                          {
                                                            className:
                                                              'absolute inset-0 bg-gray-300 dark:bg-gray-700',
                                                          }
                                                        ),
                                                      }),
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800',
                                                      }),
                                                    ],
                                                  },
                                                  t
                                                )
                                            )
                                          : l.map((e, t) =>
                                              (0, r.jsx)(
                                                'div',
                                                {
                                                  className:
                                                    'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                  children: (0, r.jsx)(p.Z, {
                                                    from: 'douban',
                                                    title: e.title,
                                                    poster: e.poster,
                                                    douban_id: Number(e.id),
                                                    rate: e.rate,
                                                    year: e.year,
                                                  }),
                                                },
                                                t
                                              )
                                            ),
                                      }),
                                    ],
                                  }),
                                  (0, r.jsxs)('section', {
                                    className: 'mb-8',
                                    children: [
                                      (0, r.jsxs)('div', {
                                        className:
                                          'mb-4 flex items-center justify-between',
                                        children: [
                                          (0, r.jsx)('h2', {
                                            className:
                                              'text-xl font-bold text-gray-800 dark:text-gray-200',
                                            children: '新番放送',
                                          }),
                                          (0, r.jsxs)(i.default, {
                                            href: '/douban?type=anime',
                                            onClick: C,
                                            className:
                                              'flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                            children: [
                                              '查看更多',
                                              (0, r.jsx)(n, {
                                                className: 'w-4 h-4 ml-1',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, r.jsx)(h, {
                                        children: _
                                          ? Array.from({ length: 8 }).map(
                                              (e, t) =>
                                                (0, r.jsxs)(
                                                  'div',
                                                  {
                                                    className:
                                                      'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                    children: [
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800',
                                                        children: (0, r.jsx)(
                                                          'div',
                                                          {
                                                            className:
                                                              'absolute inset-0 bg-gray-300 dark:bg-gray-700',
                                                          }
                                                        ),
                                                      }),
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800',
                                                      }),
                                                    ],
                                                  },
                                                  t
                                                )
                                            )
                                          : (() => {
                                              var e;
                                              let t = [
                                                'Sun',
                                                'Mon',
                                                'Tue',
                                                'Wed',
                                                'Thu',
                                                'Fri',
                                                'Sat',
                                              ][new Date().getDay()];
                                              return (
                                                (null ===
                                                  (e = N.find(
                                                    (e) => e.weekday.en === t
                                                  )) || void 0 === e
                                                  ? void 0
                                                  : e.items) || []
                                              ).map((e, t) => {
                                                var a, s, n, i;
                                                return (0, r.jsx)(
                                                  'div',
                                                  {
                                                    className:
                                                      'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                    children: (0, r.jsx)(p.Z, {
                                                      from: 'douban',
                                                      title:
                                                        e.name_cn || e.name,
                                                      poster:
                                                        e.images.large ||
                                                        e.images.common ||
                                                        e.images.medium ||
                                                        e.images.small ||
                                                        e.images.grid,
                                                      douban_id: e.id,
                                                      rate:
                                                        (null ===
                                                          (s = e.rating) ||
                                                        void 0 === s
                                                          ? void 0
                                                          : null ===
                                                              (a = s.score) ||
                                                            void 0 === a
                                                          ? void 0
                                                          : a.toString()) || '',
                                                      year:
                                                        (null ===
                                                          (i = e.air_date) ||
                                                        void 0 === i
                                                          ? void 0
                                                          : null ===
                                                              (n =
                                                                i.split('-')) ||
                                                            void 0 === n
                                                          ? void 0
                                                          : n[0]) || '',
                                                      isBangumi: !0,
                                                    }),
                                                  },
                                                  ''.concat(e.id, '-').concat(t)
                                                );
                                              });
                                            })(),
                                      }),
                                    ],
                                  }),
                                  (0, r.jsxs)('section', {
                                    className: 'mb-8',
                                    children: [
                                      (0, r.jsxs)('div', {
                                        className:
                                          'mb-4 flex items-center justify-between',
                                        children: [
                                          (0, r.jsx)('h2', {
                                            className:
                                              'text-xl font-bold text-gray-800 dark:text-gray-200',
                                            children: '热门综艺',
                                          }),
                                          (0, r.jsxs)(i.default, {
                                            href: '/douban?type=show',
                                            onClick: C,
                                            className:
                                              'flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                            children: [
                                              '查看更多',
                                              (0, r.jsx)(n, {
                                                className: 'w-4 h-4 ml-1',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, r.jsx)(h, {
                                        children: _
                                          ? Array.from({ length: 8 }).map(
                                              (e, t) =>
                                                (0, r.jsxs)(
                                                  'div',
                                                  {
                                                    className:
                                                      'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                    children: [
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800',
                                                        children: (0, r.jsx)(
                                                          'div',
                                                          {
                                                            className:
                                                              'absolute inset-0 bg-gray-300 dark:bg-gray-700',
                                                          }
                                                        ),
                                                      }),
                                                      (0, r.jsx)('div', {
                                                        className:
                                                          'mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800',
                                                      }),
                                                    ],
                                                  },
                                                  t
                                                )
                                            )
                                          : w.map((e, t) =>
                                              (0, r.jsx)(
                                                'div',
                                                {
                                                  className:
                                                    'min-w-[96px] w-24 sm:min-w-[180px] sm:w-44',
                                                  children: (0, r.jsx)(p.Z, {
                                                    from: 'douban',
                                                    title: e.title,
                                                    poster: e.poster,
                                                    douban_id: Number(e.id),
                                                    rate: e.rate,
                                                    year: e.year,
                                                  }),
                                                },
                                                t
                                              )
                                            ),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                          ],
                        }),
                }),
              ],
            }),
            E &&
              T &&
              (0, r.jsx)('div', {
                className:
                  'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/70 p-4 transition-opacity duration-300 '.concat(
                    T ? '' : 'opacity-0 pointer-events-none'
                  ),
                children: (0, r.jsxs)('div', {
                  className:
                    'w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 transform transition-all duration-300 hover:shadow-2xl',
                  children: [
                    (0, r.jsxs)('div', {
                      className: 'flex justify-between items-start mb-4',
                      children: [
                        (0, r.jsx)('h3', {
                          className:
                            'text-2xl font-bold tracking-tight text-gray-800 dark:text-white border-b border-green-500 pb-1',
                          children: '提示',
                        }),
                        (0, r.jsx)('button', {
                          onClick: () => P(E),
                          className:
                            'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-white transition-colors',
                          'aria-label': '关闭',
                        }),
                      ],
                    }),
                    (0, r.jsx)('div', {
                      className: 'mb-6',
                      children: (0, r.jsxs)('div', {
                        className:
                          'relative overflow-hidden rounded-lg mb-4 bg-green-50 dark:bg-green-900/20',
                        children: [
                          (0, r.jsx)('div', {
                            className:
                              'absolute inset-y-0 left-0 w-1.5 bg-green-500 dark:bg-green-400',
                          }),
                          (0, r.jsx)('p', {
                            className:
                              'ml-4 text-gray-600 dark:text-gray-300 leading-relaxed',
                            children: E,
                          }),
                        ],
                      }),
                    }),
                    (0, r.jsx)('button', {
                      onClick: () => P(E),
                      className:
                        'w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-white font-medium shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5',
                      children: '我知道了',
                    }),
                  ],
                }),
              }),
          ],
        });
      }
      function j() {
        return (0, r.jsx)(o.Suspense, { children: (0, r.jsx)(w, {}) });
      }
    },
    8959: function (e, t, a) {
      'use strict';
      a.d(t, {
        SiteProvider: function () {
          return o;
        },
        W: function () {
          return i;
        },
      });
      var r = a(7569),
        s = a(5663);
      let n = (0, s.createContext)({
          siteName: 'MoonTV',
          announcement:
            '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。',
        }),
        i = () => (0, s.useContext)(n);
      function o(e) {
        let { children: t, siteName: a, announcement: s } = e;
        return (0, r.jsx)(n.Provider, {
          value: { siteName: a, announcement: s },
          children: t,
        });
      }
    },
    7946: function (e, t, a) {
      'use strict';
      async function r() {
        let e = await fetch('https://api.bgm.tv/calendar');
        return (await e.json()).map((e) => ({
          ...e,
          items: e.items.filter((e) => e.images),
        }));
      }
      a.d(t, {
        W: function () {
          return r;
        },
      });
    },
    5241: function (e, t, a) {
      'use strict';
      async function r(e, t) {
        let a = new AbortController(),
          r = setTimeout(() => a.abort(), 1e4),
          s = t ? ''.concat(t).concat(encodeURIComponent(e)) : e,
          n = {
            signal: a.signal,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              Referer: 'https://movie.douban.com/',
              Accept: 'application/json, text/plain, */*',
            },
          };
        try {
          let e = await fetch(s, n);
          return clearTimeout(r), e;
        } catch (e) {
          throw (clearTimeout(r), e);
        }
      }
      function s() {
        var e, t;
        return {
          proxyType:
            localStorage.getItem('doubanDataSource') ||
            (null === (e = window.RUNTIME_CONFIG) || void 0 === e
              ? void 0
              : e.DOUBAN_PROXY_TYPE) ||
            'direct',
          proxyUrl:
            localStorage.getItem('doubanProxyUrl') ||
            (null === (t = window.RUNTIME_CONFIG) || void 0 === t
              ? void 0
              : t.DOUBAN_PROXY) ||
            '',
        };
      }
      async function n(e, t) {
        let a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          s = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
          {
            kind: n,
            category: i,
            type: o,
            pageLimit: l = 20,
            pageStart: c = 0,
          } = e;
        if (!['tv', 'movie'].includes(n))
          throw Error('kind 参数必须是 tv 或 movie');
        if (!i || !o) throw Error('category 和 type 参数不能为空');
        if (l < 1 || l > 100) throw Error('pageLimit 必须在 1-100 之间');
        if (c < 0) throw Error('pageStart 不能小于 0');
        let d = a
          ? 'https://m.douban.cmliussss.net/rexxar/api/v2/subject/recent_hot/'
              .concat(n, '?start=')
              .concat(c, '&limit=')
              .concat(l, '&category=')
              .concat(i, '&type=')
              .concat(o)
          : s
          ? 'https://m.douban.cmliussss.com/rexxar/api/v2/subject/recent_hot/'
              .concat(n, '?start=')
              .concat(c, '&limit=')
              .concat(l, '&category=')
              .concat(i, '&type=')
              .concat(o)
          : 'https://m.douban.com/rexxar/api/v2/subject/recent_hot/'
              .concat(n, '?start=')
              .concat(c, '&limit=')
              .concat(l, '&category=')
              .concat(i, '&type=')
              .concat(o);
        try {
          let e = await r(d, a || s ? '' : t);
          if (!e.ok) throw Error('HTTP error! Status: '.concat(e.status));
          let n = (await e.json()).items.map((e) => {
            var t, a, r, s, n;
            return {
              id: e.id,
              title: e.title,
              poster:
                (null === (t = e.pic) || void 0 === t ? void 0 : t.normal) ||
                (null === (a = e.pic) || void 0 === a ? void 0 : a.large) ||
                '',
              rate: (null === (r = e.rating) || void 0 === r ? void 0 : r.value)
                ? e.rating.value.toFixed(1)
                : '',
              year:
                (null === (n = e.card_subtitle) || void 0 === n
                  ? void 0
                  : null === (s = n.match(/(\d{4})/)) || void 0 === s
                  ? void 0
                  : s[1]) || '',
            };
          });
          return { code: 200, message: '获取成功', list: n };
        } catch (e) {
          throw (
            (window.dispatchEvent(
              new CustomEvent('globalError', {
                detail: { message: '获取豆瓣分类数据失败' },
              })
            ),
            Error('获取豆瓣分类数据失败: '.concat(e.message)))
          );
        }
      }
      async function i(e) {
        let {
            kind: t,
            category: a,
            type: r,
            pageLimit: i = 20,
            pageStart: o = 0,
          } = e,
          { proxyType: l, proxyUrl: c } = s();
        switch (l) {
          case 'cors-proxy-zwei':
            return n(e, 'https://ciao-cors.is-an.org/');
          case 'cmliussss-cdn-tencent':
            return n(e, '', !0, !1);
          case 'cmliussss-cdn-ali':
            return n(e, '', !1, !0);
          case 'custom':
            return n(e, c);
          default:
            return (
              await fetch(
                '/api/douban/categories?kind='
                  .concat(t, '&category=')
                  .concat(a, '&type=')
                  .concat(r, '&limit=')
                  .concat(i, '&start=')
                  .concat(o)
              )
            ).json();
        }
      }
      async function o(e) {
        let { tag: t, type: a, pageLimit: r = 20, pageStart: n = 0 } = e,
          { proxyType: i, proxyUrl: o } = s();
        switch (i) {
          case 'cors-proxy-zwei':
            return l(e, 'https://ciao-cors.is-an.org/');
          case 'cmliussss-cdn-tencent':
            return l(e, '', !0, !1);
          case 'cmliussss-cdn-ali':
            return l(e, '', !1, !0);
          case 'custom':
            return l(e, o);
          default:
            return (
              await fetch(
                '/api/douban?tag='
                  .concat(t, '&type=')
                  .concat(a, '&pageSize=')
                  .concat(r, '&pageStart=')
                  .concat(n)
              )
            ).json();
        }
      }
      async function l(e, t) {
        let a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          s = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
          { tag: n, type: i, pageLimit: o = 20, pageStart: l = 0 } = e;
        if (!n || !i) throw Error('tag 和 type 参数不能为空');
        if (!['tv', 'movie'].includes(i))
          throw Error('type 参数必须是 tv 或 movie');
        if (o < 1 || o > 100) throw Error('pageLimit 必须在 1-100 之间');
        if (l < 0) throw Error('pageStart 不能小于 0');
        let c = a
          ? 'https://movie.douban.cmliussss.net/j/search_subjects?type='
              .concat(i, '&tag=')
              .concat(n, '&sort=recommend&page_limit=')
              .concat(o, '&page_start=')
              .concat(l)
          : s
          ? 'https://movie.douban.cmliussss.com/j/search_subjects?type='
              .concat(i, '&tag=')
              .concat(n, '&sort=recommend&page_limit=')
              .concat(o, '&page_start=')
              .concat(l)
          : 'https://movie.douban.com/j/search_subjects?type='
              .concat(i, '&tag=')
              .concat(n, '&sort=recommend&page_limit=')
              .concat(o, '&page_start=')
              .concat(l);
        try {
          let e = await r(c, a || s ? '' : t);
          if (!e.ok) throw Error('HTTP error! Status: '.concat(e.status));
          let n = (await e.json()).subjects.map((e) => {
            var t, a;
            return {
              id: e.id,
              title: e.title,
              poster: e.cover,
              rate: e.rate,
              year:
                (null === (a = e.card_subtitle) || void 0 === a
                  ? void 0
                  : null === (t = a.match(/(\d{4})/)) || void 0 === t
                  ? void 0
                  : t[1]) || '',
            };
          });
          return { code: 200, message: '获取成功', list: n };
        } catch (e) {
          throw (
            (window.dispatchEvent(
              new CustomEvent('globalError', {
                detail: { message: '获取豆瓣列表数据失败' },
              })
            ),
            Error('获取豆瓣分类数据失败: '.concat(e.message)))
          );
        }
      }
      async function c(e) {
        let {
            kind: t,
            pageLimit: a = 20,
            pageStart: r = 0,
            category: n,
            format: i,
            label: o,
            region: l,
            year: c,
            platform: m,
            sort: u,
          } = e,
          { proxyType: g, proxyUrl: x } = s();
        switch (g) {
          case 'cors-proxy-zwei':
            return d(e, 'https://ciao-cors.is-an.org/');
          case 'cmliussss-cdn-tencent':
            return d(e, '', !0, !1);
          case 'cmliussss-cdn-ali':
            return d(e, '', !1, !0);
          case 'custom':
            return d(e, x);
          default:
            return (
              await fetch(
                '/api/douban/recommends?kind='
                  .concat(t, '&limit=')
                  .concat(a, '&start=')
                  .concat(r, '&category=')
                  .concat(n, '&format=')
                  .concat(i, '&region=')
                  .concat(l, '&year=')
                  .concat(c, '&platform=')
                  .concat(m, '&sort=')
                  .concat(u, '&label=')
                  .concat(o)
              )
            ).json();
        }
      }
      async function d(e, t) {
        let a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          s = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
          { kind: n, pageLimit: i = 20, pageStart: o = 0 } = e,
          {
            category: l,
            format: c,
            region: d,
            year: m,
            platform: u,
            sort: g,
            label: x,
          } = e;
        'all' === l && (l = ''),
          'all' === c && (c = ''),
          'all' === x && (x = ''),
          'all' === d && (d = ''),
          'all' === m && (m = ''),
          'all' === u && (u = ''),
          'T' === g && (g = '');
        let h = { 类型: l };
        c && (h['形式'] = c), d && (h['地区'] = d);
        let p = [];
        l && p.push(l),
          !l && c && p.push(c),
          x && p.push(x),
          d && p.push(d),
          m && p.push(m),
          u && p.push(u);
        let y = new URLSearchParams();
        y.append('refresh', '0'),
          y.append('start', o.toString()),
          y.append('count', i.toString()),
          y.append('selected_categories', JSON.stringify(h)),
          y.append('uncollect', 'false'),
          y.append('score_range', '0,10'),
          y.append('tags', p.join(',')),
          g && y.append('sort', g);
        let v = ''
          .concat(
            a
              ? 'https://m.douban.cmliussss.net/rexxar/api/v2/'.concat(
                  n,
                  '/recommend'
                )
              : s
              ? 'https://m.douban.cmliussss.com/rexxar/api/v2/'.concat(
                  n,
                  '/recommend'
                )
              : 'https://m.douban.com/rexxar/api/v2/'.concat(n, '/recommend'),
            '?'
          )
          .concat(y.toString());
        console.log(v);
        try {
          let e = await r(v, a || s ? '' : t);
          if (!e.ok) throw Error('HTTP error! Status: '.concat(e.status));
          let n = (await e.json()).items
            .filter((e) => 'movie' == e.type || 'tv' == e.type)
            .map((e) => {
              var t, a, r;
              return {
                id: e.id,
                title: e.title,
                poster:
                  (null === (t = e.pic) || void 0 === t ? void 0 : t.normal) ||
                  (null === (a = e.pic) || void 0 === a ? void 0 : a.large) ||
                  '',
                rate: (
                  null === (r = e.rating) || void 0 === r ? void 0 : r.value
                )
                  ? e.rating.value.toFixed(1)
                  : '',
                year: e.year,
              };
            });
          return { code: 200, message: '获取成功', list: n };
        } catch (e) {
          throw Error('获取豆瓣推荐数据失败: '.concat(e.message));
        }
      }
      a.d(t, {
        $E: function () {
          return o;
        },
        Z_: function () {
          return i;
        },
        tv: function () {
          return c;
        },
      });
    },
  },
  function (e) {
    e.O(0, [11, 886, 108, 728, 914, 669, 455, 314, 133, 744], function () {
      return e((e.s = 8939));
    }),
      (_N_E = e.O());
  },
]);
