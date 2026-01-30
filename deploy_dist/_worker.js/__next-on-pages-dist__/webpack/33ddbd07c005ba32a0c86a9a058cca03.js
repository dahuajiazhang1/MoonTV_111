var le = {},
  at = (ot, Qe, st) => (
    (le.__chunk_12230 = (fe, Z, i) => {
      i.d(Z, { Z: () => _e });
      var e = i(20519),
        oe = i(97606),
        X = i(89985),
        P = i(4710),
        f = i(94570),
        Se = i(3084),
        xe = i(2820),
        Le = i(47264),
        k = i(24528),
        Q = i(17242),
        ye = i(82720),
        qe = i(14079),
        ze = i(89090),
        De = i(73464),
        Te = i(85192);
      let Ze = ({
        isOpen: de,
        onClose: W,
        title: se,
        actions: ce,
        poster: ue,
        sources: K,
        isAggregate: t,
        sourceName: l,
        currentEpisode: r,
        totalEpisodes: o,
        origin: h = 'vod',
      }) => {
        let [p, u] = (0, k.useState)(!1),
          [c, d] = (0, k.useState)(!1);
        if (
          ((0, k.useEffect)(() => {
            let s, g;
            return (
              de
                ? (u(!0),
                  (s = requestAnimationFrame(() => {
                    s = requestAnimationFrame(() => {
                      d(!0);
                    });
                  })))
                : (d(!1),
                  (g = window.setTimeout(() => {
                    u(!1);
                  }, 200))),
              () => {
                s && cancelAnimationFrame(s), g && window.clearTimeout(g);
              }
            );
          }, [de]),
          (0, k.useEffect)(() => {
            if (p) {
              let s = window.scrollY,
                g = window.scrollX,
                n = document.body,
                C = document.documentElement,
                L = window.innerWidth - C.clientWidth,
                y = {
                  position: n.style.position,
                  top: n.style.top,
                  left: n.style.left,
                  right: n.style.right,
                  width: n.style.width,
                  paddingRight: n.style.paddingRight,
                  overflow: n.style.overflow,
                };
              return (
                (n.style.position = 'fixed'),
                (n.style.top = `-${s}px`),
                (n.style.left = `-${g}px`),
                (n.style.right = '0'),
                (n.style.width = '100%'),
                (n.style.overflow = 'hidden'),
                (n.style.paddingRight = `${L}px`),
                () => {
                  (n.style.position = y.position),
                    (n.style.top = y.top),
                    (n.style.left = y.left),
                    (n.style.right = y.right),
                    (n.style.width = y.width),
                    (n.style.paddingRight = y.paddingRight),
                    (n.style.overflow = y.overflow),
                    requestAnimationFrame(() => {
                      window.scrollTo(g, s);
                    });
                }
              );
            }
          }, [p]),
          (0, k.useEffect)(() => {
            let s = (g) => {
              g.key === 'Escape' && W();
            };
            if (p)
              return (
                document.addEventListener('keydown', s),
                () => document.removeEventListener('keydown', s)
              );
          }, [p, W]),
          !p)
        )
          return null;
        let A = (s) => {
            switch (s) {
              case 'danger':
                return 'text-red-600 dark:text-red-400';
              case 'primary':
                return 'text-green-600 dark:text-green-400';
              default:
                return 'text-gray-700 dark:text-gray-300';
            }
          },
          b = (s) => {
            switch (s) {
              case 'danger':
                return 'hover:bg-red-50/50 dark:hover:bg-red-900/10';
              case 'primary':
                return 'hover:bg-green-50/50 dark:hover:bg-green-900/10';
              default:
                return 'hover:bg-gray-50/50 dark:hover:bg-gray-800/20';
            }
          };
        return (0, Te.createPortal)(
          (0, e.jsxs)('div', {
            className: 'fixed inset-0 z-[9999] flex items-end justify-center',
            onTouchMove: (s) => {
              s.preventDefault(), s.stopPropagation();
            },
            style: { touchAction: 'none' },
            children: [
              (0, e.jsx)('div', {
                className: `absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out ${
                  c ? 'opacity-100' : 'opacity-0'
                }`,
                onClick: W,
                onTouchMove: (s) => {
                  s.preventDefault();
                },
                onWheel: (s) => {
                  s.preventDefault();
                },
                style: {
                  backdropFilter: 'blur(4px)',
                  willChange: 'opacity',
                  touchAction: 'none',
                },
              }),
              (0, e.jsxs)('div', {
                className:
                  'relative w-full max-w-lg mx-4 mb-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-200 ease-out',
                onTouchMove: (s) => {
                  s.stopPropagation();
                },
                style: {
                  marginBottom: 'calc(1rem + env(safe-area-inset-bottom))',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  transform: c
                    ? 'translateY(0) translateZ(0)'
                    : 'translateY(100%) translateZ(0)',
                  opacity: c ? 1 : 0,
                  touchAction: 'auto',
                },
                children: [
                  (0, e.jsxs)('div', {
                    className:
                      'flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800',
                    children: [
                      (0, e.jsxs)('div', {
                        className: 'flex items-center gap-3 flex-1 min-w-0',
                        children: [
                          ue &&
                            (0, e.jsx)('div', {
                              className:
                                'relative w-12 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0',
                              children: (0, e.jsx)(xe.Z, {
                                src: ue,
                                alt: se,
                                fill: !0,
                                className:
                                  h === 'live'
                                    ? 'object-contain'
                                    : 'object-cover',
                                loading: 'lazy',
                              }),
                            }),
                          (0, e.jsxs)('div', {
                            className: 'min-w-0 flex-1',
                            children: [
                              (0, e.jsxs)('div', {
                                className: 'flex items-center gap-2 mb-1',
                                children: [
                                  (0, e.jsx)('h3', {
                                    className:
                                      'text-lg font-semibold text-gray-900 dark:text-gray-100 truncate',
                                    children: se,
                                  }),
                                  l &&
                                    (0, e.jsxs)('span', {
                                      className:
                                        'flex-shrink-0 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800',
                                      children: [
                                        h === 'live' &&
                                          (0, e.jsx)(ze.Z, {
                                            size: 12,
                                            className:
                                              'inline-block text-gray-500 dark:text-gray-400 mr-1.5',
                                          }),
                                        l,
                                      ],
                                    }),
                                ],
                              }),
                              (0, e.jsx)('p', {
                                className:
                                  'text-sm text-gray-500 dark:text-gray-400',
                                children: '\u9009\u62E9\u64CD\u4F5C',
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, e.jsx)('button', {
                        onClick: W,
                        className:
                          'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150',
                        children: (0, e.jsx)(De.Z, {
                          size: 20,
                          className: 'text-gray-500 dark:text-gray-400',
                        }),
                      }),
                    ],
                  }),
                  (0, e.jsx)('div', {
                    className: 'px-4 py-2',
                    children: ce.map((s, g) =>
                      (0, e.jsxs)(
                        'div',
                        {
                          children: [
                            (0, e.jsxs)('button', {
                              onClick: () => {
                                s.onClick(), W();
                              },
                              disabled: s.disabled,
                              className: `
                  w-full flex items-center gap-4 py-4 px-2 transition-all duration-150 ease-out
                  ${
                    s.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : `${b(s.color)} active:scale-[0.98]`
                  }
                `,
                              style: {
                                willChange: 'transform, background-color',
                              },
                              children: [
                                (0, e.jsx)('div', {
                                  className:
                                    'w-6 h-6 flex items-center justify-center flex-shrink-0',
                                  children: (0, e.jsx)('span', {
                                    className: `transition-colors duration-150 ${
                                      s.disabled
                                        ? 'text-gray-400 dark:text-gray-600'
                                        : A(s.color)
                                    }`,
                                    children: s.icon,
                                  }),
                                }),
                                (0, e.jsx)('span', {
                                  className: `
                  text-left font-medium text-base flex-1
                  ${
                    s.disabled
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-gray-900 dark:text-gray-100'
                  }
                `,
                                  children: s.label,
                                }),
                                s.id === 'play' &&
                                  r &&
                                  o &&
                                  (0, e.jsxs)('span', {
                                    className:
                                      'text-sm text-gray-500 dark:text-gray-400 font-medium',
                                    children: [r, '/', o],
                                  }),
                              ],
                            }),
                            g < ce.length - 1 &&
                              (0, e.jsx)('div', {
                                className:
                                  'border-b border-gray-100 dark:border-gray-800 ml-10',
                              }),
                          ],
                        },
                        s.id
                      )
                    ),
                  }),
                  t &&
                    K &&
                    K.length > 0 &&
                    (0, e.jsxs)('div', {
                      className:
                        'px-4 py-3 border-t border-gray-100 dark:border-gray-800',
                      children: [
                        (0, e.jsxs)('div', {
                          className: 'mb-3',
                          children: [
                            (0, e.jsx)('h4', {
                              className:
                                'text-sm font-medium text-gray-900 dark:text-gray-100 mb-1',
                              children: '\u53EF\u7528\u64AD\u653E\u6E90',
                            }),
                            (0, e.jsxs)('p', {
                              className:
                                'text-xs text-gray-500 dark:text-gray-400',
                              children: [
                                '\u5171 ',
                                K.length,
                                ' \u4E2A\u64AD\u653E\u6E90',
                              ],
                            }),
                          ],
                        }),
                        (0, e.jsx)('div', {
                          className: 'max-h-32 overflow-y-auto',
                          children: (0, e.jsx)('div', {
                            className: 'grid grid-cols-2 gap-2',
                            children: K.map((s, g) =>
                              (0, e.jsxs)(
                                'div',
                                {
                                  className:
                                    'flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30',
                                  children: [
                                    (0, e.jsx)('div', {
                                      className:
                                        'w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full flex-shrink-0',
                                    }),
                                    (0, e.jsx)('span', {
                                      className:
                                        'text-xs text-gray-600 dark:text-gray-400 truncate',
                                      children: s,
                                    }),
                                  ],
                                },
                                g
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
      };
      var Fe = i(53223);
      function _e({
        id: de,
        title: W = '',
        query: se = '',
        poster: ce = '',
        episodes: ue,
        source: K,
        source_name: t,
        progress: l = 0,
        year: r,
        from: o,
        currentEpisode: h,
        douban_id: p,
        onDelete: u,
        rate: c,
        items: d,
        type: A = '',
        isBangumi: b = !1,
      }) {
        let s = (0, Le.tv)(),
          { startLoading: g } = (0, Fe.w)(),
          [n, C] = (0, k.useState)(!1),
          [L, y] = (0, k.useState)(!1),
          [F, Y] = (0, k.useState)(!1),
          [M, q] = (0, k.useState)(!1),
          [E, N] = (0, k.useState)(!1),
          [x, J] = (0, k.useState)(null),
          S = o === 'search' && !!d?.length,
          D = (0, k.useMemo)(() => {
            if (!S || !d) return null;
            let a = new Map(),
              j = new Map();
            d.forEach((H) => {
              H.douban_id &&
                H.douban_id !== 0 &&
                a.set(H.douban_id, (a.get(H.douban_id) || 0) + 1);
              let B = H.episodes?.length || 0;
              B > 0 && j.set(B, (j.get(B) || 0) + 1);
            });
            let we = (H) => {
              let B,
                Ee = 0;
              return (
                H.forEach((Re, Ue) => {
                  Re > Ee && ((Ee = Re), (B = Ue));
                }),
                B
              );
            };
            return {
              first: d[0],
              mostFrequentDoubanId: we(a),
              mostFrequentEpisodes: we(j) || 0,
            };
          }, [S, d]),
          I = D?.first.title ?? W,
          ae = D?.first.poster ?? ce,
          w = D?.first.source ?? K,
          v = D?.first.id ?? de,
          z = D?.mostFrequentDoubanId ?? p,
          U = D?.mostFrequentEpisodes ?? ue,
          _ = D?.first.year ?? r,
          ee = se || '',
          O = S ? (D?.first.episodes?.length === 1 ? 'movie' : 'tv') : A,
          he = (0, k.useCallback)(async () => {
            if (o !== 'douban' && w && v)
              try {
                let a = await (0, Q.at)(w, v);
                C(a), q(!0);
                let j = (0, Q.sO)(w, v);
                (0, Q.rq)('favoritesUpdated', (we) => {
                  let H = !!we[j];
                  C(H);
                });
              } catch (a) {
                console.error(
                  '\u68C0\u67E5\u6536\u85CF\u72B6\u6001\u5931\u8D25',
                  a
                );
              }
          }, [o, w, v]),
          ie = (0, k.useCallback)(
            async (a) => {
              if (
                (a?.preventDefault(),
                a?.stopPropagation(),
                o !== 'douban' && w && v)
              )
                try {
                  n
                    ? (await (0, Q.r7)(w, v), C(!1))
                    : (await (0, Q.qn)(w, v, {
                        title: I,
                        source_name: t || '',
                        year: _ || '',
                        cover: ae,
                        total_episodes: U ?? 1,
                        save_time: Date.now(),
                        search_title: ee || '',
                      }),
                      C(!0));
                } catch (j) {
                  console.error(
                    '\u5207\u6362\u6536\u85CF\u72B6\u6001\u5931\u8D25',
                    j
                  );
                }
            },
            [o, w, v, I, t, _, ae, U, ee, n]
          ),
          be = (0, k.useCallback)(
            async (a) => {
              if (
                (a.preventDefault(),
                a.stopPropagation(),
                o === 'playrecord' && w && v)
              )
                try {
                  await (0, Q.Ji)(w, v), u?.();
                } catch (j) {
                  console.error(
                    '\u5220\u9664\u64AD\u653E\u8BB0\u5F55\u5931\u8D25',
                    j
                  );
                }
            },
            [o, w, v, u]
          ),
          $e = (0, k.useCallback)(() => {
            g(),
              o === 'douban'
                ? s.push(
                    `/play?title=${encodeURIComponent(I.trim())}${
                      _ ? `&year=${_}` : ''
                    }${O ? `&stype=${O}` : ''}`
                  )
                : w &&
                  v &&
                  s.push(
                    `/play?source=${w}&id=${v}&title=${encodeURIComponent(I)}${
                      _ ? `&year=${_}` : ''
                    }${S ? '&prefer=true' : ''}${
                      ee ? `&stitle=${encodeURIComponent(ee.trim())}` : ''
                    }${O ? `&stype=${O}` : ''}`
                  );
          }, [o, w, v, s, I, _, S, ee, O, g]),
          R = (0, k.useMemo)(() => {
            let a = {
              playrecord: {
                showSourceName: !0,
                showProgress: !0,
                showPlayButton: !0,
                showHeart: !0,
                showCheckCircle: !0,
                showDoubanLink: !!z,
                showRating: !1,
              },
              favorite: {
                showSourceName: !0,
                showProgress: !1,
                showPlayButton: !0,
                showHeart: !0,
                showCheckCircle: !1,
                showDoubanLink: !!z,
                showRating: !1,
              },
              search: {
                showSourceName: !0,
                showProgress: !1,
                showPlayButton: !0,
                showHeart: !S,
                showCheckCircle: !1,
                showDoubanLink: !!z,
                showRating: !1,
              },
              douban: {
                showSourceName: !1,
                showProgress: !1,
                showPlayButton: !0,
                showHeart: !1,
                showCheckCircle: !1,
                showDoubanLink: !0,
                showRating: !!c,
              },
            };
            return a[o] || a.search;
          }, [o, S, z, c]);
        return (0, e.jsxs)('div', {
          className:
            'group relative w-full rounded-lg bg-transparent cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.05] hover:z-[500]',
          style: {
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          },
          onContextMenu: (a) => {
            a.preventDefault(), a.stopPropagation(), N(!0);
          },
          onTouchStart: (a) => {
            a.stopPropagation(),
              x && window.clearTimeout(x),
              J(
                window.setTimeout(() => {
                  N(!0);
                }, 500)
              );
          },
          onTouchEnd: () => {
            x && (window.clearTimeout(x), J(null));
          },
          onTouchCancel: () => {
            x && (window.clearTimeout(x), J(null));
          },
          onMouseEnter: () => {
            if (o === 'favorite' && !n) {
              C(!0), q(!0);
              return;
            }
            R.showHeart && !M && he();
          },
          children: [
            (0, e.jsxs)('div', {
              className: 'relative aspect-[2/3] overflow-hidden rounded-lg',
              children: [
                !L && (0, e.jsx)(qe.Z, { aspectRatio: 'aspect-[2/3]' }),
                (0, e.jsx)(xe.Z, {
                  src: (0, ye.a8)(ae),
                  alt: I,
                  fill: !0,
                  className: 'object-cover',
                  referrerPolicy: 'no-referrer',
                  loading: 'lazy',
                  onLoad: () => y(!0),
                  onError: (a) => {
                    let j = a.target;
                    j.dataset.retried ||
                      ((j.dataset.retried = 'true'),
                      setTimeout(() => {
                        j.src = (0, ye.a8)(ae);
                      }, 2e3));
                  },
                }),
                (0, e.jsx)('div', {
                  className:
                    'absolute inset-0 bg-gradient-to-t from-black/80 via-black-20 to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100',
                }),
                R.showPlayButton &&
                  (0, e.jsx)('div', {
                    className:
                      'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition',
                    children: (0, e.jsx)(oe.Z, {
                      size: 50,
                      strokeWidth: 0.8,
                      className:
                        'text-white fill-transparent hover:fill-green-500 hover:scale-[1.1] transition',
                      onClick: (a) => {
                        a.stopPropagation(), $e();
                      },
                    }),
                  }),
                (R.showHeart || R.showCheckCircle) &&
                  (0, e.jsxs)('div', {
                    className:
                      'absolute bottom-3 right-3 flex gap-3 opacity-0 translate-y-2 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0',
                    children: [
                      R.showCheckCircle &&
                        (0, e.jsx)(X.Z, {
                          onClick: be,
                          size: 20,
                          className:
                            'text-white transition-all duration-300 ease-out hover:stroke-red-500 hover:scale-[1.1]',
                        }),
                      R.showHeart &&
                        (0, e.jsx)(P.Z, {
                          onClick: ie,
                          size: 20,
                          className: `transition-all duration-300 ease-out ${
                            n
                              ? 'fill-red-600 stroke-red-600'
                              : 'fill-transparent stroke-white hover:stroke-red-400'
                          } hover:scale-[1.1]`,
                        }),
                    ],
                  }),
                R.showRating &&
                  c &&
                  z &&
                  (0, e.jsx)('div', {
                    className:
                      'absolute top-2 left-2 bg-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-md cursor-pointer hover:bg-pink-600 transition',
                    children: c,
                  }),
                o === 'search' &&
                  _ &&
                  _.toLowerCase() !== 'unknown' &&
                  (0, e.jsx)('div', {
                    className:
                      'absolute top-2 left-2 bg-black/60 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-md',
                    children: _,
                  }),
                R.showDoubanLink &&
                  z &&
                  (0, e.jsx)('div', {
                    onClick: (a) => {
                      a.stopPropagation(),
                        b
                          ? window.open(
                              `https://bangumi.tv/subject/${z}`,
                              '_blank'
                            )
                          : window.open(
                              `https://movie.douban.com/subject/${z}`,
                              '_blank'
                            );
                    },
                    className:
                      'absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-green-600 hover:scale-[1.1] transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 cursor-pointer',
                    title: b
                      ? '\u8DF3\u8F6C\u5230 Bangumi'
                      : '\u8DF3\u8F6C\u5230\u8C46\u74E3',
                    children: (0, e.jsxs)('svg', {
                      width: '16',
                      height: '16',
                      viewBox: '0 0 24 24',
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeWidth: '2',
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      children: [
                        (0, e.jsx)('path', {
                          d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
                        }),
                        (0, e.jsx)('path', {
                          d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
                        }),
                      ],
                    }),
                  }),
                U &&
                  U > 1 &&
                  (0, e.jsx)('div', {
                    className:
                      'absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md transition-all duration-300 ease-out group-hover:scale-110',
                    children: h ? `${h}/${U}` : U,
                  }),
                S &&
                  d &&
                  d.length > 0 &&
                  (0, e.jsx)('div', {
                    className:
                      'absolute bottom-2 right-2 flex flex-col items-end',
                    children: (0, e.jsxs)('div', {
                      className: 'relative group/sources',
                      children: [
                        (0, e.jsx)('div', {
                          className:
                            'bg-gray-700 text-white text-xs sm:text-xs w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-md hover:bg-gray-600 hover:scale-[1.1] transition-all duration-300 ease-out cursor-pointer',
                          onClick: (a) => {
                            a.stopPropagation(), Y((j) => !j);
                          },
                          children: d.length,
                        }),
                        F &&
                          (0, e.jsx)('div', {
                            className:
                              'absolute bottom-full mb-2 right-0 sm:right-0 z-50',
                            children: (0, e.jsxs)('div', {
                              className:
                                'bg-gray-800/90 backdrop-blur-sm text-white text-xs sm:text-xs rounded-lg shadow-xl border border-white/10 p-1 sm:p-1.5 min-w-[70px] sm:min-w-[90px] max-w-[120px] sm:max-w-[160px] max-h-20 sm:max-h-40 overflow-auto',
                              children: [
                                (0, e.jsx)('div', {
                                  className: 'space-y-0.5 sm:space-y-1',
                                  children: d.map((a, j) =>
                                    (0, e.jsxs)(
                                      'div',
                                      {
                                        className:
                                          'flex items-center gap-1 sm:gap-1.5',
                                        children: [
                                          (0, e.jsx)('div', {
                                            className:
                                              'w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-400 rounded-full flex-shrink-0',
                                          }),
                                          (0, e.jsx)('span', {
                                            className:
                                              'truncate text-[10px] sm:text-xs leading-tight',
                                            title: a.source_name,
                                            children: a.source_name,
                                          }),
                                        ],
                                      },
                                      j
                                    )
                                  ),
                                }),
                                (0, e.jsx)('div', {
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
            R.showProgress &&
              l !== void 0 &&
              (0, e.jsx)('div', {
                className:
                  'mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden',
                children: (0, e.jsx)('div', {
                  className:
                    'h-full bg-green-500 transition-all duration-500 ease-out',
                  style: { width: `${l}%` },
                }),
              }),
            (0, e.jsxs)('div', {
              className: 'mt-2 text-center',
              children: [
                (0, e.jsxs)('div', {
                  className: 'relative',
                  children: [
                    (0, e.jsx)('span', {
                      className:
                        'block text-sm font-semibold truncate text-gray-900 dark:text-gray-100 transition-colors duration-300 ease-in-out group-hover:text-green-600 dark:group-hover:text-green-400 peer',
                      children: I,
                    }),
                    (0, e.jsxs)('div', {
                      className:
                        'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 invisible peer-hover:opacity-100 peer-hover:visible transition-all duration-200 ease-out delay-100 whitespace-nowrap pointer-events-none',
                      children: [
                        I,
                        (0, e.jsx)('div', {
                          className:
                            'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800',
                        }),
                      ],
                    }),
                  ],
                }),
                R.showSourceName &&
                  t &&
                  (0, e.jsx)('span', {
                    className:
                      'block text-xs text-gray-500 dark:text-gray-400 mt-1',
                    children: (0, e.jsx)('span', {
                      className:
                        'inline-block border rounded px-2 py-0.5 border-gray-500/60 dark:border-gray-400/60 transition-all duration-300 ease-in-out group-hover:border-green-500/60 group-hover:text-green-600 dark:group-hover:text-green-400',
                      children: t,
                    }),
                  }),
              ],
            }),
            (0, e.jsx)(Ze, {
              isOpen: E,
              onClose: () => N(!1),
              title: I,
              poster: (0, ye.a8)(ae),
              sourceName: t,
              isAggregate: S,
              sources:
                S && d ? d.map((a) => a.source_name || '').filter(Boolean) : [],
              currentEpisode: h,
              totalEpisodes: U || void 0,
              origin: 'vod',
              actions: [
                {
                  id: 'play',
                  label: '\u64AD\u653E',
                  icon: (0, e.jsx)(oe.Z, { size: 20 }),
                  color: 'primary',
                  onClick: () => $e(),
                },
                {
                  id: 'play-new-tab',
                  label: '\u5728\u65B0\u6807\u7B7E\u9875\u64AD\u653E',
                  icon: (0, e.jsx)(f.Z, { size: 20 }),
                  color: 'default',
                  onClick: () => {
                    o === 'douban'
                      ? window.open(
                          `/play?title=${encodeURIComponent(I.trim())}${
                            _ ? `&year=${_}` : ''
                          }${O ? `&stype=${O}` : ''}`,
                          '_blank'
                        )
                      : w &&
                        v &&
                        window.open(
                          `/play?source=${w}&id=${v}&title=${encodeURIComponent(
                            I
                          )}${_ ? `&year=${_}` : ''}${S ? '&prefer=true' : ''}${
                            ee ? `&stitle=${encodeURIComponent(ee.trim())}` : ''
                          }${O ? `&stype=${O}` : ''}`,
                          '_blank'
                        );
                  },
                },
                ...(o !== 'douban' && !(o === 'search' && S) && w && v
                  ? [
                      n
                        ? {
                            id: 'unfavorite',
                            label: '\u53D6\u6D88\u6536\u85CF',
                            icon: (0, e.jsx)(P.Z, {
                              size: 18,
                              className: 'fill-red-600 stroke-red-600',
                            }),
                            color: 'danger',
                            onClick: (a) => ie(a),
                          }
                        : {
                            id: 'favorite',
                            label: '\u52A0\u5165\u6536\u85CF',
                            icon: (0, e.jsx)(P.Z, {
                              size: 18,
                              className: 'fill-transparent stroke-gray-600',
                            }),
                            color: 'primary',
                            onClick: (a) => ie(a),
                          },
                    ]
                  : []),
                ...(o === 'playrecord' && w && v
                  ? [
                      {
                        id: 'delete-record',
                        label: '\u5220\u9664\u64AD\u653E\u8BB0\u5F55',
                        icon: (0, e.jsx)(X.Z, { size: 18 }),
                        color: 'danger',
                        onClick: (a) => be(a),
                      },
                    ]
                  : []),
                ...(z
                  ? [
                      {
                        id: 'open-link',
                        label: b
                          ? '\u6253\u5F00 Bangumi \u9875\u9762'
                          : '\u6253\u5F00\u8C46\u74E3\u9875\u9762',
                        icon: (0, e.jsx)(Se.Z, { size: 18 }),
                        onClick: () => {
                          b
                            ? window.open(
                                `https://bangumi.tv/subject/${z}`,
                                '_blank'
                              )
                            : window.open(
                                `https://movie.douban.com/subject/${z}`,
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
    }),
    (le.__chunk_14079 = (fe, Z, i) => {
      i.d(Z, { Z: () => oe });
      var e = i(20519);
      let oe = ({ aspectRatio: X }) =>
        (0, e.jsx)('div', {
          className: `w-full ${X} rounded-lg`,
          style: {
            background:
              'linear-gradient(90deg, var(--skeleton-color) 25%, var(--skeleton-highlight) 50%, var(--skeleton-color) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shine 1.5s infinite',
          },
          children: (0, e.jsx)('style', {
            children: `
      @keyframes shine {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      /* \u4EAE\u8272\u6A21\u5F0F\u53D8\u91CF */
      :root {
        --skeleton-color: #f0f0f0;
        --skeleton-highlight: #e0e0e0;
      }
      
      /* \u6697\u8272\u6A21\u5F0F\u53D8\u91CF */
      @media (prefers-color-scheme: dark) {
        :root {
          --skeleton-color: #2d2d2d;
          --skeleton-highlight: #3d3d3d;
        }
      }
      
      .dark {
        --skeleton-color: #2d2d2d;
        --skeleton-highlight: #3d3d3d;
      }
    `,
          }),
        });
    }),
    (le.__chunk_2820 = (fe, Z, i) => {
      i.d(Z, { Z: () => K });
      var e = i(84667);
      function oe(t) {
        return t.default !== void 0;
      }
      function X(t) {
        return t === void 0
          ? t
          : typeof t == 'number'
          ? Number.isFinite(t)
            ? t
            : NaN
          : typeof t == 'string' && /^[0-9]+$/.test(t)
          ? parseInt(t, 10)
          : NaN;
      }
      var P = i(20519),
        f = i(24528),
        Se = i(85192);
      let xe = () => {},
        Le = () => {};
      function k(t) {
        var l;
        let { headManager: r, reduceComponentsToState: o } = t;
        function h() {
          if (r && r.mountedInstances) {
            let p = f.Children.toArray(
              Array.from(r.mountedInstances).filter(Boolean)
            );
            r.updateHead(o(p, t));
          }
        }
        return (
          r == null || (l = r.mountedInstances) == null || l.add(t.children),
          h(),
          xe(() => {
            var p;
            return (
              r == null ||
                (p = r.mountedInstances) == null ||
                p.add(t.children),
              () => {
                var u;
                r == null ||
                  (u = r.mountedInstances) == null ||
                  u.delete(t.children);
              }
            );
          }),
          xe(
            () => (
              r && (r._pendingUpdate = h),
              () => {
                r && (r._pendingUpdate = h);
              }
            )
          ),
          Le(
            () => (
              r &&
                r._pendingUpdate &&
                (r._pendingUpdate(), (r._pendingUpdate = null)),
              () => {
                r &&
                  r._pendingUpdate &&
                  (r._pendingUpdate(), (r._pendingUpdate = null));
              }
            )
          ),
          null
        );
      }
      var Q = i(440),
        ye = i(8429);
      function qe(t, l) {
        return typeof l == 'string' || typeof l == 'number'
          ? t
          : l.type === f.Fragment
          ? t.concat(
              f.Children.toArray(l.props.children).reduce(
                (r, o) =>
                  typeof o == 'string' || typeof o == 'number'
                    ? r
                    : r.concat(o),
                []
              )
            )
          : t.concat(l);
      }
      let ze = ['name', 'httpEquiv', 'charSet', 'itemProp'];
      function De(t, l) {
        let { inAmpMode: r } = l;
        return t
          .reduce(qe, [])
          .reverse()
          .concat(
            (function (o) {
              o === void 0 && (o = !1);
              let h = [(0, P.jsx)('meta', { charSet: 'utf-8' })];
              return (
                o ||
                  h.push(
                    (0, P.jsx)('meta', {
                      name: 'viewport',
                      content: 'width=device-width',
                    })
                  ),
                h
              );
            })(r).reverse()
          )
          .filter(
            (function () {
              let o = new Set(),
                h = new Set(),
                p = new Set(),
                u = {};
              return (c) => {
                let d = !0,
                  A = !1;
                if (
                  c.key &&
                  typeof c.key != 'number' &&
                  c.key.indexOf('$') > 0
                ) {
                  A = !0;
                  let b = c.key.slice(c.key.indexOf('$') + 1);
                  o.has(b) ? (d = !1) : o.add(b);
                }
                switch (c.type) {
                  case 'title':
                  case 'base':
                    h.has(c.type) ? (d = !1) : h.add(c.type);
                    break;
                  case 'meta':
                    for (let b = 0, s = ze.length; b < s; b++) {
                      let g = ze[b];
                      if (c.props.hasOwnProperty(g))
                        if (g === 'charSet') p.has(g) ? (d = !1) : p.add(g);
                        else {
                          let n = c.props[g],
                            C = u[g] || new Set();
                          (g !== 'name' || !A) && C.has(n)
                            ? (d = !1)
                            : (C.add(n), (u[g] = C));
                        }
                    }
                }
                return d;
              };
            })()
          )
          .reverse()
          .map((o, h) => {
            let p = o.key || h;
            if (
              !r &&
              o.type === 'link' &&
              o.props.href &&
              [
                'https://fonts.googleapis.com/css',
                'https://use.typekit.net/',
              ].some((u) => o.props.href.startsWith(u))
            ) {
              let u = { ...(o.props || {}) };
              return (
                (u['data-href'] = u.href),
                (u.href = void 0),
                (u['data-optimized-fonts'] = !0),
                f.cloneElement(o, u)
              );
            }
            return f.cloneElement(o, { key: p });
          });
      }
      let Te = function (t) {
        let { children: l } = t,
          r = (0, f.useContext)(Q.AmpStateContext),
          o = (0, f.useContext)(ye.HeadManagerContext);
        return (0, P.jsx)(k, {
          reduceComponentsToState: De,
          headManager: o,
          inAmpMode: (function (h) {
            let {
              ampFirst: p = !1,
              hybrid: u = !1,
              hasQuery: c = !1,
            } = h === void 0 ? {} : h;
            return p || (u && c);
          })(r),
          children: l,
        });
      };
      var Ze = i(58350),
        Fe = i(99189);
      function _e(t) {
        var l;
        let { config: r, src: o, width: h, quality: p } = t,
          u =
            p ||
            ((l = r.qualities) == null
              ? void 0
              : l.reduce((c, d) =>
                  Math.abs(d - 75) < Math.abs(c - 75) ? d : c
                )) ||
            75;
        return r.path + '?url=' + encodeURIComponent(o) + '&w=' + h + '&q=' + u;
      }
      _e.__next_img_default = !0;
      let de = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        path: '/_next/image',
        loader: 'default',
        dangerouslyAllowSVG: !1,
        unoptimized: !0,
      };
      function W(t, l, r, o, h, p, u) {
        let c = t?.src;
        t &&
          t['data-loaded-src'] !== c &&
          ((t['data-loaded-src'] = c),
          ('decode' in t ? t.decode() : Promise.resolve())
            .catch(() => {})
            .then(() => {
              if (t.parentElement && t.isConnected) {
                if ((l !== 'empty' && h(!0), r?.current)) {
                  let d = new Event('load');
                  Object.defineProperty(d, 'target', {
                    writable: !1,
                    value: t,
                  });
                  let A = !1,
                    b = !1;
                  r.current({
                    ...d,
                    nativeEvent: d,
                    currentTarget: t,
                    target: t,
                    isDefaultPrevented: () => A,
                    isPropagationStopped: () => b,
                    persist: () => {},
                    preventDefault: () => {
                      (A = !0), d.preventDefault();
                    },
                    stopPropagation: () => {
                      (b = !0), d.stopPropagation();
                    },
                  });
                }
                o?.current && o.current(t);
              }
            }));
      }
      function se(t) {
        return f.use ? { fetchPriority: t } : { fetchpriority: t };
      }
      Qe.__NEXT_IMAGE_IMPORTED = !0;
      let ce = (0, f.forwardRef)((t, l) => {
        let {
          src: r,
          srcSet: o,
          sizes: h,
          height: p,
          width: u,
          decoding: c,
          className: d,
          style: A,
          fetchPriority: b,
          placeholder: s,
          loading: g,
          unoptimized: n,
          fill: C,
          onLoadRef: L,
          onLoadingCompleteRef: y,
          setBlurComplete: F,
          setShowAltText: Y,
          sizesInput: M,
          onLoad: q,
          onError: E,
          ...N
        } = t;
        return (0, P.jsx)('img', {
          ...N,
          ...se(b),
          loading: g,
          width: u,
          height: p,
          decoding: c,
          'data-nimg': C ? 'fill' : '1',
          className: d,
          style: A,
          sizes: h,
          srcSet: o,
          src: r,
          ref: (0, f.useCallback)(
            (x) => {
              l &&
                (typeof l == 'function'
                  ? l(x)
                  : typeof l == 'object' && (l.current = x)),
                x &&
                  (E && (x.src = x.src), x.complete && W(x, s, L, y, F, n, M));
            },
            [r, s, L, y, F, E, n, M, l]
          ),
          onLoad: (x) => {
            W(x.currentTarget, s, L, y, F, n, M);
          },
          onError: (x) => {
            Y(!0), s !== 'empty' && F(!0), E && E(x);
          },
        });
      });
      function ue(t) {
        let { isAppRouter: l, imgAttributes: r } = t,
          o = {
            as: 'image',
            imageSrcSet: r.srcSet,
            imageSizes: r.sizes,
            crossOrigin: r.crossOrigin,
            referrerPolicy: r.referrerPolicy,
            ...se(r.fetchPriority),
          };
        return l && Se.preload
          ? (Se.preload(r.src, o), null)
          : (0, P.jsx)(Te, {
              children: (0, P.jsx)(
                'link',
                { rel: 'preload', href: r.srcSet ? void 0 : r.src, ...o },
                '__nimg-' + r.src + r.srcSet + r.sizes
              ),
            });
      }
      let K = (0, f.forwardRef)((t, l) => {
        let r = (0, f.useContext)(Fe.RouterContext),
          o = (0, f.useContext)(Ze.ImageConfigContext),
          h = (0, f.useMemo)(() => {
            var L;
            let y = de || o || e.z,
              F = [...y.deviceSizes, ...y.imageSizes].sort((q, E) => q - E),
              Y = y.deviceSizes.sort((q, E) => q - E),
              M = (L = y.qualities) == null ? void 0 : L.sort((q, E) => q - E);
            return { ...y, allSizes: F, deviceSizes: Y, qualities: M };
          }, [o]),
          { onLoad: p, onLoadingComplete: u } = t,
          c = (0, f.useRef)(p);
        (0, f.useEffect)(() => {
          c.current = p;
        }, [p]);
        let d = (0, f.useRef)(u);
        (0, f.useEffect)(() => {
          d.current = u;
        }, [u]);
        let [A, b] = (0, f.useState)(!1),
          [s, g] = (0, f.useState)(!1),
          { props: n, meta: C } = (function (L, y) {
            var F, Y;
            let M,
              q,
              E,
              {
                src: N,
                sizes: x,
                unoptimized: J = !1,
                priority: S = !1,
                loading: D,
                className: I,
                quality: ae,
                width: w,
                height: v,
                fill: z = !1,
                style: U,
                overrideSrc: _,
                onLoad: ee,
                onLoadingComplete: O,
                placeholder: he = 'empty',
                blurDataURL: ie,
                fetchPriority: be,
                decoding: $e = 'async',
                layout: R,
                objectFit: a,
                objectPosition: j,
                lazyBoundary: we,
                lazyRoot: H,
                ...B
              } = L,
              {
                imgConf: Ee,
                showAltText: Re,
                blurComplete: Ue,
                defaultLoader: Oe,
              } = y,
              ne = Ee || e.z;
            if ('allSizes' in ne) M = ne;
            else {
              let m = [...ne.deviceSizes, ...ne.imageSizes].sort(
                  (T, G) => T - G
                ),
                $ = ne.deviceSizes.sort((T, G) => T - G),
                re =
                  (F = ne.qualities) == null ? void 0 : F.sort((T, G) => T - G);
              M = { ...ne, allSizes: m, deviceSizes: $, qualities: re };
            }
            if (Oe === void 0)
              throw Error(`images.loaderFile detected but the file is missing default export.
Read more: https://nextjs.org/docs/messages/invalid-images-config`);
            let Pe = B.loader || Oe;
            delete B.loader, delete B.srcSet;
            let He = '__next_img_default' in Pe;
            if (He) {
              if (M.loader === 'custom')
                throw Error(
                  'Image with src "' +
                    N +
                    `" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`
                );
            } else {
              let m = Pe;
              Pe = ($) => {
                let { config: re, ...T } = $;
                return m(T);
              };
            }
            if (R) {
              R === 'fill' && (z = !0);
              let m = {
                intrinsic: { maxWidth: '100%', height: 'auto' },
                responsive: { width: '100%', height: 'auto' },
              }[R];
              m && (U = { ...U, ...m });
              let $ = { responsive: '100vw', fill: '100vw' }[R];
              $ && !x && (x = $);
            }
            let Ge = '',
              V = X(w),
              te = X(v);
            if (typeof (Y = N) == 'object' && (oe(Y) || Y.src !== void 0)) {
              let m = oe(N) ? N.default : N;
              if (!m.src)
                throw Error(
                  'An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ' +
                    JSON.stringify(m)
                );
              if (!m.height || !m.width)
                throw Error(
                  'An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ' +
                    JSON.stringify(m)
                );
              if (
                ((q = m.blurWidth),
                (E = m.blurHeight),
                (ie = ie || m.blurDataURL),
                (Ge = m.src),
                !z)
              )
                if (V || te) {
                  if (V && !te) {
                    let $ = V / m.width;
                    te = Math.round(m.height * $);
                  } else if (!V && te) {
                    let $ = te / m.height;
                    V = Math.round(m.width * $);
                  }
                } else (V = m.width), (te = m.height);
            }
            let Ye = !S && (D === 'lazy' || D === void 0);
            (!(N = typeof N == 'string' ? N : Ge) ||
              N.startsWith('data:') ||
              N.startsWith('blob:')) &&
              ((J = !0), (Ye = !1)),
              M.unoptimized && (J = !0),
              He && N.endsWith('.svg') && !M.dangerouslyAllowSVG && (J = !0),
              S && (be = 'high');
            let Ke = X(ae),
              Me = Object.assign(
                z
                  ? {
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      objectFit: a,
                      objectPosition: j,
                    }
                  : {},
                Re ? {} : { color: 'transparent' },
                U
              ),
              Je =
                Ue || he === 'empty'
                  ? null
                  : he === 'blur'
                  ? 'url("data:image/svg+xml;charset=utf-8,' +
                    (function (m) {
                      let {
                          widthInt: $,
                          heightInt: re,
                          blurWidth: T,
                          blurHeight: G,
                          blurDataURL: Ae,
                          objectFit: pe,
                        } = m,
                        ve = T ? 40 * T : $,
                        ge = G ? 40 * G : re,
                        me =
                          ve && ge ? "viewBox='0 0 " + ve + ' ' + ge + "'" : '';
                      return (
                        "%3Csvg xmlns='http://www.w3.org/2000/svg' " +
                        me +
                        "%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='" +
                        (me
                          ? 'none'
                          : pe === 'contain'
                          ? 'xMidYMid'
                          : pe === 'cover'
                          ? 'xMidYMid slice'
                          : 'none') +
                        "' style='filter: url(%23b);' href='" +
                        Ae +
                        "'/%3E%3C/svg%3E"
                      );
                    })({
                      widthInt: V,
                      heightInt: te,
                      blurWidth: q,
                      blurHeight: E,
                      blurDataURL: ie || '',
                      objectFit: Me.objectFit,
                    }) +
                    '")'
                  : 'url("' + he + '")',
              et = Je
                ? {
                    backgroundSize: Me.objectFit || 'cover',
                    backgroundPosition: Me.objectPosition || '50% 50%',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: Je,
                  }
                : {},
              Be = (function (m) {
                let {
                  config: $,
                  src: re,
                  unoptimized: T,
                  width: G,
                  quality: Ae,
                  sizes: pe,
                  loader: ve,
                } = m;
                if (T) return { src: re, srcSet: void 0, sizes: void 0 };
                let { widths: ge, kind: me } = (function (Ie, ke, Ve) {
                    let { deviceSizes: Xe, allSizes: je } = Ie;
                    if (Ve) {
                      let We = /(^|\s)(1?\d?\d)vw/g,
                        Ce = [];
                      for (let Ne; (Ne = We.exec(Ve)); Ne)
                        Ce.push(parseInt(Ne[2]));
                      if (Ce.length) {
                        let Ne = 0.01 * Math.min(...Ce);
                        return {
                          widths: je.filter((rt) => rt >= Xe[0] * Ne),
                          kind: 'w',
                        };
                      }
                      return { widths: je, kind: 'w' };
                    }
                    return typeof ke != 'number'
                      ? { widths: Xe, kind: 'w' }
                      : {
                          widths: [
                            ...new Set(
                              [ke, 2 * ke].map(
                                (We) =>
                                  je.find((Ce) => Ce >= We) || je[je.length - 1]
                              )
                            ),
                          ],
                          kind: 'x',
                        };
                  })($, G, pe),
                  tt = ge.length - 1;
                return {
                  sizes: pe || me !== 'w' ? pe : '100vw',
                  srcSet: ge
                    .map(
                      (Ie, ke) =>
                        ve({ config: $, src: re, quality: Ae, width: Ie }) +
                        ' ' +
                        (me === 'w' ? Ie : ke + 1) +
                        me
                    )
                    .join(', '),
                  src: ve({ config: $, src: re, quality: Ae, width: ge[tt] }),
                };
              })({
                config: M,
                src: N,
                unoptimized: J,
                width: V,
                quality: Ke,
                sizes: x,
                loader: Pe,
              });
            return {
              props: {
                ...B,
                loading: Ye ? 'lazy' : D,
                fetchPriority: be,
                width: V,
                height: te,
                decoding: $e,
                className: I,
                style: { ...Me, ...et },
                sizes: Be.sizes,
                srcSet: Be.srcSet,
                src: _ || Be.src,
              },
              meta: { unoptimized: J, priority: S, placeholder: he, fill: z },
            };
          })(t, {
            defaultLoader: _e,
            imgConf: h,
            blurComplete: A,
            showAltText: s,
          });
        return (0, P.jsxs)(P.Fragment, {
          children: [
            (0, P.jsx)(ce, {
              ...n,
              unoptimized: C.unoptimized,
              placeholder: C.placeholder,
              fill: C.fill,
              onLoadRef: c,
              onLoadingCompleteRef: d,
              setBlurComplete: b,
              setShowAltText: g,
              sizesInput: t.sizes,
              ref: l,
            }),
            C.priority
              ? (0, P.jsx)(ue, { isAppRouter: !r, imgAttributes: n })
              : null,
          ],
        });
      });
    }),
    (le.__chunk_89090 = (fe, Z, i) => {
      i.d(Z, { Z: () => e });
      let e = (0, i(49263).Z)('Radio', [
        ['path', { d: 'M4.9 19.1C1 15.2 1 8.8 4.9 4.9', key: '1vaf9d' }],
        ['path', { d: 'M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5', key: 'u1ii0m' }],
        ['circle', { cx: '12', cy: '12', r: '2', key: '1c9p78' }],
        ['path', { d: 'M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5', key: '1j5fej' }],
        ['path', { d: 'M19.1 4.9C23 8.8 23 15.1 19.1 19', key: '10b0cb' }],
      ]);
    }),
    (le.__chunk_3084 = (fe, Z, i) => {
      i.d(Z, { Z: () => e });
      let e = (0, i(49263).Z)('Link', [
        [
          'path',
          {
            d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
            key: '1cjeqo',
          },
        ],
        [
          'path',
          {
            d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
            key: '19qd67',
          },
        ],
      ]);
    }),
    (le.__chunk_97606 = (fe, Z, i) => {
      i.d(Z, { Z: () => e });
      let e = (0, i(49263).Z)('CirclePlay', [
        ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
        ['polygon', { points: '10 8 16 12 10 16 10 8', key: '1cimsy' }],
      ]);
    }),
    le
  );
export { at as __getNamedExports };
