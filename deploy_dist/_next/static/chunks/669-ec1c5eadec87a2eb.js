'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [669],
  {
    4507: function (e, t, a) {
      a.d(t, {
        v: function () {
          return r;
        },
      });
      function r() {
        try {
          let e = document.cookie.split(';').reduce((e, t) => {
            let a = t.trim(),
              r = a.indexOf('=');
            if (r > 0) {
              let t = a.substring(0, r),
                o = a.substring(r + 1);
              t && o && (e[t] = o);
            }
            return e;
          }, {}).auth;
          if (!e) return null;
          let t = decodeURIComponent(e);
          return t.includes('%') && (t = decodeURIComponent(t)), JSON.parse(t);
        } catch (e) {
          return null;
        }
      }
    },
    4090: function (e, t, a) {
      a.d(t, {
        C2: function () {
          return P;
        },
        EE: function () {
          return I;
        },
        Ev: function () {
          return O;
        },
        F0: function () {
          return U;
        },
        Ji: function () {
          return E;
        },
        Lj: function () {
          return F;
        },
        Rr: function () {
          return v;
        },
        Rw: function () {
          return R;
        },
        at: function () {
          return T;
        },
        bP: function () {
          return b;
        },
        c1: function () {
          return C;
        },
        j5: function () {
          return _;
        },
        jz: function () {
          return J;
        },
        nO: function () {
          return S;
        },
        qn: function () {
          return N;
        },
        r7: function () {
          return k;
        },
        rq: function () {
          return H;
        },
        sO: function () {
          return m;
        },
      });
      var r,
        o = a(4507),
        n = a(1816);
      function i(e) {
        window.dispatchEvent(
          new CustomEvent('globalError', { detail: { message: e } })
        );
      }
      let c = 'moontv_play_records',
        s = 'moontv_favorites',
        l = 'moontv_search_history',
        d = 'moontv_cache_',
        h = '1.0.0',
        u =
          (null === (r = window.RUNTIME_CONFIG) || void 0 === r
            ? void 0
            : r.STORAGE_TYPE) ||
          n.env.STORAGE_TYPE ||
          'localstorage';
      class p {
        static getInstance() {
          return p.instance || (p.instance = new p()), p.instance;
        }
        getCurrentUsername() {
          let e = (0, o.v)();
          return (null == e ? void 0 : e.username) || null;
        }
        getUserCacheKey(e) {
          return ''.concat(d).concat(e);
        }
        getUserCache(e) {
          try {
            let t = this.getUserCacheKey(e),
              a = localStorage.getItem(t);
            return a ? JSON.parse(a) : {};
          } catch (e) {
            return console.warn('获取用户缓存失败:', e), {};
          }
        }
        saveUserCache(e, t) {
          try {
            JSON.stringify(t).length > 15728640 &&
              (console.warn('缓存过大，清理旧数据'), this.cleanOldCache(t));
            let a = this.getUserCacheKey(e);
            localStorage.setItem(a, JSON.stringify(t));
          } catch (a) {
            if (
              (console.warn('保存用户缓存失败:', a),
              a instanceof DOMException && 'QuotaExceededError' === a.name)
            ) {
              this.clearAllCache();
              try {
                let a = this.getUserCacheKey(e);
                localStorage.setItem(a, JSON.stringify(t));
              } catch (e) {
                console.error('重试保存缓存仍然失败:', e);
              }
            }
          }
        }
        cleanOldCache(e) {
          let t = Date.now();
          e.playRecords &&
            t - e.playRecords.timestamp > 5184e6 &&
            delete e.playRecords,
            e.favorites &&
              t - e.favorites.timestamp > 5184e6 &&
              delete e.favorites;
        }
        clearAllCache() {
          Object.keys(localStorage).forEach((e) => {
            e.startsWith('moontv_cache_') && localStorage.removeItem(e);
          });
        }
        isCacheValid(e) {
          let t = Date.now();
          return e.version === h && t - e.timestamp < 36e5;
        }
        createCacheData(e) {
          return { data: e, timestamp: Date.now(), version: h };
        }
        getCachedPlayRecords() {
          let e = this.getCurrentUsername();
          if (!e) return null;
          let t = this.getUserCache(e).playRecords;
          return t && this.isCacheValid(t) ? t.data : null;
        }
        cachePlayRecords(e) {
          let t = this.getCurrentUsername();
          if (!t) return;
          let a = this.getUserCache(t);
          (a.playRecords = this.createCacheData(e)), this.saveUserCache(t, a);
        }
        getCachedFavorites() {
          let e = this.getCurrentUsername();
          if (!e) return null;
          let t = this.getUserCache(e).favorites;
          return t && this.isCacheValid(t) ? t.data : null;
        }
        cacheFavorites(e) {
          let t = this.getCurrentUsername();
          if (!t) return;
          let a = this.getUserCache(t);
          (a.favorites = this.createCacheData(e)), this.saveUserCache(t, a);
        }
        getCachedSearchHistory() {
          let e = this.getCurrentUsername();
          if (!e) return null;
          let t = this.getUserCache(e).searchHistory;
          return t && this.isCacheValid(t) ? t.data : null;
        }
        cacheSearchHistory(e) {
          let t = this.getCurrentUsername();
          if (!t) return;
          let a = this.getUserCache(t);
          (a.searchHistory = this.createCacheData(e)), this.saveUserCache(t, a);
        }
        getCachedSkipConfigs() {
          let e = this.getCurrentUsername();
          if (!e) return null;
          let t = this.getUserCache(e).skipConfigs;
          return t && this.isCacheValid(t) ? t.data : null;
        }
        cacheSkipConfigs(e) {
          let t = this.getCurrentUsername();
          if (!t) return;
          let a = this.getUserCache(t);
          (a.skipConfigs = this.createCacheData(e)), this.saveUserCache(t, a);
        }
        clearUserCache(e) {
          let t = e || this.getCurrentUsername();
          if (t)
            try {
              let e = this.getUserCacheKey(t);
              localStorage.removeItem(e);
            } catch (e) {
              console.warn('清除用户缓存失败:', e);
            }
        }
        clearExpiredCaches() {
          try {
            let e = [];
            for (let t = 0; t < localStorage.length; t++) {
              let a = localStorage.key(t);
              if (null == a ? void 0 : a.startsWith(d))
                try {
                  let t = JSON.parse(localStorage.getItem(a) || '{}'),
                    r = !1;
                  for (let [, e] of Object.entries(t))
                    if (e && this.isCacheValid(e)) {
                      r = !0;
                      break;
                    }
                  r || e.push(a);
                } catch (t) {
                  e.push(a);
                }
            }
            e.forEach((e) => localStorage.removeItem(e));
          } catch (e) {
            console.warn('清除过期缓存失败:', e);
          }
        }
      }
      let f = p.getInstance();
      async function y(e, t) {
        console.error('数据库操作失败 ('.concat(e, '):'), t),
          i('数据库操作失败');
        try {
          let t, a;
          switch (e) {
            case 'playRecords':
              (t = await g('/api/playrecords')),
                f.cachePlayRecords(t),
                (a = 'playRecordsUpdated');
              break;
            case 'favorites':
              (t = await g('/api/favorites')),
                f.cacheFavorites(t),
                (a = 'favoritesUpdated');
              break;
            case 'searchHistory':
              (t = await g('/api/searchhistory')),
                f.cacheSearchHistory(t),
                (a = 'searchHistoryUpdated');
          }
          window.dispatchEvent(new CustomEvent(a, { detail: t }));
        } catch (t) {
          console.error('刷新'.concat(e, '缓存失败:'), t),
            i('刷新'.concat(e, '缓存失败'));
        }
      }
      async function w(e, t) {
        let a = await fetch(e, t);
        if (!a.ok) {
          if (401 === a.status) {
            try {
              await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
            } catch (e) {
              console.error('注销请求失败:', e);
            }
            let e = window.location.pathname + window.location.search,
              t = new URL('/login', window.location.origin);
            throw (
              (t.searchParams.set('redirect', e),
              (window.location.href = t.toString()),
              Error('用户未授权，已跳转到登录页面'))
            );
          }
          throw Error('请求 '.concat(e, ' 失败: ').concat(a.status));
        }
        return a;
      }
      async function g(e) {
        let t = await w(e);
        return await t.json();
      }
      function m(e, t) {
        return ''.concat(e, '+').concat(t);
      }
      async function v() {
        if ('localstorage' !== u) {
          let e = f.getCachedPlayRecords();
          if (e)
            return (
              g('/api/playrecords')
                .then((t) => {
                  JSON.stringify(e) !== JSON.stringify(t) &&
                    (f.cachePlayRecords(t),
                    window.dispatchEvent(
                      new CustomEvent('playRecordsUpdated', { detail: t })
                    ));
                })
                .catch((e) => {
                  console.warn('后台同步播放记录失败:', e),
                    i('后台同步播放记录失败');
                }),
              e
            );
          try {
            let e = await g('/api/playrecords');
            return f.cachePlayRecords(e), e;
          } catch (e) {
            return (
              console.error('获取播放记录失败:', e), i('获取播放记录失败'), {}
            );
          }
        }
        try {
          let e = localStorage.getItem(c);
          if (!e) return {};
          return JSON.parse(e);
        } catch (e) {
          return (
            console.error('读取播放记录失败:', e), i('读取播放记录失败'), {}
          );
        }
      }
      async function C(e, t, a) {
        let r = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedPlayRecords() || {};
          a.title &&
            Object.keys(e).forEach((t) => {
              t !== r && e[t].title === a.title && delete e[t];
            }),
            (e[r] = a),
            f.cachePlayRecords(e),
            window.dispatchEvent(
              new CustomEvent('playRecordsUpdated', { detail: e })
            );
          try {
            await w('/api/playrecords', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key: r, record: a }),
            });
          } catch (e) {
            throw (await y('playRecords', e), i('保存播放记录失败'), e);
          }
          return;
        }
        try {
          let e = await v();
          a.title &&
            Object.keys(e).forEach((t) => {
              t !== r && e[t].title === a.title && delete e[t];
            }),
            (e[r] = a),
            localStorage.setItem(c, JSON.stringify(e)),
            window.dispatchEvent(
              new CustomEvent('playRecordsUpdated', { detail: e })
            );
        } catch (e) {
          throw (
            (console.error('保存播放记录失败:', e), i('保存播放记录失败'), e)
          );
        }
      }
      async function E(e, t) {
        let a = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedPlayRecords() || {};
          delete e[a],
            f.cachePlayRecords(e),
            window.dispatchEvent(
              new CustomEvent('playRecordsUpdated', { detail: e })
            );
          try {
            await w('/api/playrecords?key='.concat(encodeURIComponent(a)), {
              method: 'DELETE',
            });
          } catch (e) {
            throw (await y('playRecords', e), i('删除播放记录失败'), e);
          }
          return;
        }
        try {
          let e = await v();
          delete e[a],
            localStorage.setItem(c, JSON.stringify(e)),
            window.dispatchEvent(
              new CustomEvent('playRecordsUpdated', { detail: e })
            );
        } catch (e) {
          throw (
            (console.error('删除播放记录失败:', e), i('删除播放记录失败'), e)
          );
        }
      }
      async function S() {
        if ('localstorage' !== u) {
          let e = f.getCachedSearchHistory();
          if (e)
            return (
              g('/api/searchhistory')
                .then((t) => {
                  JSON.stringify(e) !== JSON.stringify(t) &&
                    (f.cacheSearchHistory(t),
                    window.dispatchEvent(
                      new CustomEvent('searchHistoryUpdated', { detail: t })
                    ));
                })
                .catch((e) => {
                  console.warn('后台同步搜索历史失败:', e),
                    i('后台同步搜索历史失败');
                }),
              e
            );
          try {
            let e = await g('/api/searchhistory');
            return f.cacheSearchHistory(e), e;
          } catch (e) {
            return (
              console.error('获取搜索历史失败:', e), i('获取搜索历史失败'), []
            );
          }
        }
        try {
          let e = localStorage.getItem(l);
          if (!e) return [];
          let t = JSON.parse(e);
          return Array.isArray(t) ? t : [];
        } catch (e) {
          return (
            console.error('读取搜索历史失败:', e), i('读取搜索历史失败'), []
          );
        }
      }
      async function U(e) {
        let t = e.trim();
        if (t) {
          if ('localstorage' !== u) {
            let e = [
              t,
              ...(f.getCachedSearchHistory() || []).filter((e) => e !== t),
            ];
            e.length > 20 && (e.length = 20),
              f.cacheSearchHistory(e),
              window.dispatchEvent(
                new CustomEvent('searchHistoryUpdated', { detail: e })
              );
            try {
              await w('/api/searchhistory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword: t }),
              });
            } catch (e) {
              await y('searchHistory', e);
            }
            return;
          }
          try {
            let e = await S(),
              a = [t, ...e.filter((e) => e !== t)];
            a.length > 20 && (a.length = 20),
              localStorage.setItem(l, JSON.stringify(a)),
              window.dispatchEvent(
                new CustomEvent('searchHistoryUpdated', { detail: a })
              );
          } catch (e) {
            console.error('保存搜索历史失败:', e), i('保存搜索历史失败');
          }
        }
      }
      async function O() {
        if ('localstorage' !== u) {
          f.cacheSearchHistory([]),
            window.dispatchEvent(
              new CustomEvent('searchHistoryUpdated', { detail: [] })
            );
          try {
            await w('/api/searchhistory', { method: 'DELETE' });
          } catch (e) {
            await y('searchHistory', e);
          }
          return;
        }
        localStorage.removeItem(l),
          window.dispatchEvent(
            new CustomEvent('searchHistoryUpdated', { detail: [] })
          );
      }
      async function R(e) {
        let t = e.trim();
        if (t) {
          if ('localstorage' !== u) {
            let e = (f.getCachedSearchHistory() || []).filter((e) => e !== t);
            f.cacheSearchHistory(e),
              window.dispatchEvent(
                new CustomEvent('searchHistoryUpdated', { detail: e })
              );
            try {
              await w(
                '/api/searchhistory?keyword='.concat(encodeURIComponent(t)),
                { method: 'DELETE' }
              );
            } catch (e) {
              await y('searchHistory', e);
            }
            return;
          }
          try {
            let e = (await S()).filter((e) => e !== t);
            localStorage.setItem(l, JSON.stringify(e)),
              window.dispatchEvent(
                new CustomEvent('searchHistoryUpdated', { detail: e })
              );
          } catch (e) {
            console.error('删除搜索历史失败:', e), i('删除搜索历史失败');
          }
        }
      }
      async function I() {
        if ('localstorage' !== u) {
          let e = f.getCachedFavorites();
          if (e)
            return (
              g('/api/favorites')
                .then((t) => {
                  JSON.stringify(e) !== JSON.stringify(t) &&
                    (f.cacheFavorites(t),
                    window.dispatchEvent(
                      new CustomEvent('favoritesUpdated', { detail: t })
                    ));
                })
                .catch((e) => {
                  console.warn('后台同步收藏失败:', e), i('后台同步收藏失败');
                }),
              e
            );
          try {
            let e = await g('/api/favorites');
            return f.cacheFavorites(e), e;
          } catch (e) {
            return console.error('获取收藏失败:', e), i('获取收藏失败'), {};
          }
        }
        try {
          let e = localStorage.getItem(s);
          if (!e) return {};
          return JSON.parse(e);
        } catch (e) {
          return console.error('读取收藏失败:', e), i('读取收藏失败'), {};
        }
      }
      async function N(e, t, a) {
        let r = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedFavorites() || {};
          (e[r] = a),
            f.cacheFavorites(e),
            window.dispatchEvent(
              new CustomEvent('favoritesUpdated', { detail: e })
            );
          try {
            await w('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key: r, favorite: a }),
            });
          } catch (e) {
            throw (await y('favorites', e), i('保存收藏失败'), e);
          }
          return;
        }
        try {
          let e = await I();
          (e[r] = a),
            localStorage.setItem(s, JSON.stringify(e)),
            window.dispatchEvent(
              new CustomEvent('favoritesUpdated', { detail: e })
            );
        } catch (e) {
          throw (console.error('保存收藏失败:', e), i('保存收藏失败'), e);
        }
      }
      async function k(e, t) {
        let a = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedFavorites() || {};
          delete e[a],
            f.cacheFavorites(e),
            window.dispatchEvent(
              new CustomEvent('favoritesUpdated', { detail: e })
            );
          try {
            await w('/api/favorites?key='.concat(encodeURIComponent(a)), {
              method: 'DELETE',
            });
          } catch (e) {
            throw (await y('favorites', e), i('删除收藏失败'), e);
          }
          return;
        }
        try {
          let e = await I();
          delete e[a],
            localStorage.setItem(s, JSON.stringify(e)),
            window.dispatchEvent(
              new CustomEvent('favoritesUpdated', { detail: e })
            );
        } catch (e) {
          throw (console.error('删除收藏失败:', e), i('删除收藏失败'), e);
        }
      }
      async function T(e, t) {
        let a = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedFavorites();
          if (e)
            return (
              g('/api/favorites')
                .then((t) => {
                  JSON.stringify(e) !== JSON.stringify(t) &&
                    (f.cacheFavorites(t),
                    window.dispatchEvent(
                      new CustomEvent('favoritesUpdated', { detail: t })
                    ));
                })
                .catch((e) => {
                  console.warn('后台同步收藏失败:', e), i('后台同步收藏失败');
                }),
              !!e[a]
            );
          try {
            let e = await g('/api/favorites');
            return f.cacheFavorites(e), !!e[a];
          } catch (e) {
            return (
              console.error('检查收藏状态失败:', e), i('检查收藏状态失败'), !1
            );
          }
        }
        return !!(await I())[a];
      }
      async function J() {
        if ('localstorage' !== u) {
          f.cachePlayRecords({}),
            window.dispatchEvent(
              new CustomEvent('playRecordsUpdated', { detail: {} })
            );
          try {
            await w('/api/playrecords', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            });
          } catch (e) {
            throw (await y('playRecords', e), i('清空播放记录失败'), e);
          }
          return;
        }
        localStorage.removeItem(c),
          window.dispatchEvent(
            new CustomEvent('playRecordsUpdated', { detail: {} })
          );
      }
      async function _() {
        if ('localstorage' !== u) {
          f.cacheFavorites({}),
            window.dispatchEvent(
              new CustomEvent('favoritesUpdated', { detail: {} })
            );
          try {
            await w('/api/favorites', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            });
          } catch (e) {
            throw (await y('favorites', e), i('清空收藏失败'), e);
          }
          return;
        }
        localStorage.removeItem(s),
          window.dispatchEvent(
            new CustomEvent('favoritesUpdated', { detail: {} })
          );
      }
      function H(e, t) {
        let a = (e) => {
          t(e.detail);
        };
        return (
          window.addEventListener(e, a),
          () => {
            window.removeEventListener(e, a);
          }
        );
      }
      async function b(e, t) {
        let a = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedSkipConfigs();
          if (e)
            return (
              g('/api/skipconfigs')
                .then((t) => {
                  JSON.stringify(e) !== JSON.stringify(t) &&
                    (f.cacheSkipConfigs(t),
                    window.dispatchEvent(
                      new CustomEvent('skipConfigsUpdated', { detail: t })
                    ));
                })
                .catch((e) => {
                  console.warn('后台同步跳过片头片尾配置失败:', e);
                }),
              e[a] || null
            );
          try {
            let e = await g('/api/skipconfigs');
            return f.cacheSkipConfigs(e), e[a] || null;
          } catch (e) {
            return (
              console.error('获取跳过片头片尾配置失败:', e),
              i('获取跳过片头片尾配置失败'),
              null
            );
          }
        }
        try {
          let e = localStorage.getItem('moontv_skip_configs');
          if (!e) return null;
          return JSON.parse(e)[a] || null;
        } catch (e) {
          return (
            console.error('读取跳过片头片尾配置失败:', e),
            i('读取跳过片头片尾配置失败'),
            null
          );
        }
      }
      async function P(e, t, a) {
        let r = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedSkipConfigs() || {};
          (e[r] = a),
            f.cacheSkipConfigs(e),
            window.dispatchEvent(
              new CustomEvent('skipConfigsUpdated', { detail: e })
            );
          try {
            await w('/api/skipconfigs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key: r, config: a }),
            });
          } catch (e) {
            console.error('保存跳过片头片尾配置失败:', e),
              i('保存跳过片头片尾配置失败');
          }
          return;
        }
        try {
          let e = localStorage.getItem('moontv_skip_configs'),
            t = e ? JSON.parse(e) : {};
          (t[r] = a),
            localStorage.setItem('moontv_skip_configs', JSON.stringify(t)),
            window.dispatchEvent(
              new CustomEvent('skipConfigsUpdated', { detail: t })
            );
        } catch (e) {
          throw (
            (console.error('保存跳过片头片尾配置失败:', e),
            i('保存跳过片头片尾配置失败'),
            e)
          );
        }
      }
      async function F(e, t) {
        let a = m(e, t);
        if ('localstorage' !== u) {
          let e = f.getCachedSkipConfigs() || {};
          delete e[a],
            f.cacheSkipConfigs(e),
            window.dispatchEvent(
              new CustomEvent('skipConfigsUpdated', { detail: e })
            );
          try {
            await w('/api/skipconfigs?key='.concat(encodeURIComponent(a)), {
              method: 'DELETE',
            });
          } catch (e) {
            console.error('删除跳过片头片尾配置失败:', e),
              i('删除跳过片头片尾配置失败');
          }
          return;
        }
        try {
          let e = localStorage.getItem('moontv_skip_configs');
          if (e) {
            let t = JSON.parse(e);
            delete t[a],
              localStorage.setItem('moontv_skip_configs', JSON.stringify(t)),
              window.dispatchEvent(
                new CustomEvent('skipConfigsUpdated', { detail: t })
              );
          }
        } catch (e) {
          throw (
            (console.error('删除跳过片头片尾配置失败:', e),
            i('删除跳过片头片尾配置失败'),
            e)
          );
        }
      }
      setTimeout(() => f.clearExpiredCaches(), 1e3);
    },
    5941: function (e, t, a) {
      a.d(t, {
        Jy: function () {
          return i;
        },
        a8: function () {
          return o;
        },
        e9: function () {
          return n;
        },
      }),
        a(9571);
      var r = a(3226);
      function o(e) {
        var t, a;
        if (!e || !e.includes('doubanio.com')) return e;
        let { proxyType: r, proxyUrl: o } = {
          proxyType:
            localStorage.getItem('doubanImageProxyType') ||
            (null === (t = window.RUNTIME_CONFIG) || void 0 === t
              ? void 0
              : t.DOUBAN_IMAGE_PROXY_TYPE) ||
            'direct',
          proxyUrl:
            localStorage.getItem('doubanImageProxyUrl') ||
            (null === (a = window.RUNTIME_CONFIG) || void 0 === a
              ? void 0
              : a.DOUBAN_IMAGE_PROXY) ||
            '',
        };
        switch (r) {
          case 'server':
            return '/api/image-proxy?url='.concat(encodeURIComponent(e));
          case 'img3':
            return e.replace(/img\d+\.doubanio\.com/g, 'img3.doubanio.com');
          case 'cmliussss-cdn-tencent':
            return e.replace(
              /img\d+\.doubanio\.com/g,
              'img.doubanio.cmliussss.net'
            );
          case 'cmliussss-cdn-ali':
            return e.replace(
              /img\d+\.doubanio\.com/g,
              'img.doubanio.cmliussss.com'
            );
          case 'custom':
            return ''.concat(o).concat(encodeURIComponent(e));
          default:
            return e;
        }
      }
      async function n(e) {
        try {
          return new Promise((t, a) => {
            let o = document.createElement('video');
            (o.muted = !0), (o.preload = 'metadata');
            let n = performance.now(),
              i = 0;
            fetch(e, { method: 'HEAD', mode: 'no-cors' })
              .then(() => {
                i = performance.now() - n;
              })
              .catch(() => {
                i = performance.now() - n;
              });
            let c = new r.default(),
              s = setTimeout(() => {
                c.destroy(),
                  o.remove(),
                  a(Error('Timeout loading video metadata'));
              }, 4e3);
            o.onerror = () => {
              clearTimeout(s),
                c.destroy(),
                o.remove(),
                a(Error('Failed to load video metadata'));
            };
            let l = '未知',
              d = !1,
              h = !1,
              u = 0,
              p = () => {
                if (h && (d || '未知' !== l)) {
                  clearTimeout(s);
                  let e = o.videoWidth;
                  e && e > 0
                    ? (c.destroy(),
                      o.remove(),
                      t({
                        quality:
                          e >= 3840
                            ? '4K'
                            : e >= 2560
                            ? '2K'
                            : e >= 1920
                            ? '1080p'
                            : e >= 1280
                            ? '720p'
                            : e >= 854
                            ? '480p'
                            : 'SD',
                        loadSpeed: l,
                        pingTime: Math.round(i),
                      }))
                    : t({
                        quality: '未知',
                        loadSpeed: l,
                        pingTime: Math.round(i),
                      });
                }
              };
            c.on(r.default.Events.FRAG_LOADING, () => {
              u = performance.now();
            }),
              c.on(r.default.Events.FRAG_LOADED, (e, t) => {
                if (u > 0 && t && t.payload && !d) {
                  let e = performance.now() - u,
                    a = t.payload.byteLength || 0;
                  if (e > 0 && a > 0) {
                    let t = a / 1024 / (e / 1e3);
                    (l =
                      t >= 1024
                        ? ''.concat((t / 1024).toFixed(1), ' MB/s')
                        : ''.concat(t.toFixed(1), ' KB/s')),
                      (d = !0),
                      p();
                  }
                }
              }),
              c.loadSource(e),
              c.attachMedia(o),
              c.on(r.default.Events.ERROR, (e, t) => {
                console.error('HLS错误:', t),
                  t.fatal &&
                    (clearTimeout(s),
                    c.destroy(),
                    o.remove(),
                    a(Error('HLS播放失败: '.concat(t.type))));
              }),
              (o.onloadedmetadata = () => {
                (h = !0), p();
              });
          });
        } catch (e) {
          throw Error(
            'Error getting video resolution: '.concat(
              e instanceof Error ? e.message : String(e)
            )
          );
        }
      }
      function i() {
        try {
          let e = localStorage.getItem('requestTimeout');
          if (e) {
            let t = parseInt(e, 10);
            if (!isNaN(t) && t >= 1 && t <= 60) return t;
          }
        } catch (e) {
          console.warn('Failed to read timeout from localStorage:', e);
        }
        return 30;
      }
    },
  },
]);
