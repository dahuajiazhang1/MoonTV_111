var l = {},
  m = (self, globalThis, global) => (
    (l.__chunk_21396 = (e, i, s) => {
      s.d(i, { Z: () => f });
      let f = {
        cache_time: 7200,
        api_site: {
          dyttzy: {
            api: 'http://caiji.dyttzyapi.com/api.php/provide/vod',
            name: '\u7535\u5F71\u5929\u5802\u8D44\u6E90',
            detail: 'http://caiji.dyttzyapi.com',
          },
          heimuer: {
            api: 'https://json.heimuer.xyz/api.php/provide/vod',
            name: '\u9ED1\u6728\u8033',
            detail: 'https://heimuer.tv',
          },
          ruyi: {
            api: 'http://cj.rycjapi.com/api.php/provide/vod',
            name: '\u5982\u610F\u8D44\u6E90',
          },
          bfzy: {
            api: 'https://bfzyapi.com/api.php/provide/vod',
            name: '\u66B4\u98CE\u8D44\u6E90',
          },
          tyyszy: {
            api: 'https://tyyszy.com/api.php/provide/vod',
            name: '\u5929\u6DAF\u8D44\u6E90',
          },
          ffzy: {
            api: 'http://ffzy5.tv/api.php/provide/vod',
            name: '\u975E\u51E1\u5F71\u89C6',
            detail: 'http://ffzy5.tv',
          },
          zy360: {
            api: 'https://360zy.com/api.php/provide/vod',
            name: '360\u8D44\u6E90',
          },
          maotaizy: {
            api: 'https://caiji.maotaizy.cc/api.php/provide/vod',
            name: '\u8305\u53F0\u8D44\u6E90',
          },
          wolong: {
            api: 'https://wolongzyw.com/api.php/provide/vod',
            name: '\u5367\u9F99\u8D44\u6E90',
          },
          jisu: {
            api: 'https://jszyapi.com/api.php/provide/vod',
            name: '\u6781\u901F\u8D44\u6E90',
            detail: 'https://jszyapi.com',
          },
          dbzy: {
            api: 'https://dbzy.tv/api.php/provide/vod',
            name: '\u8C46\u74E3\u8D44\u6E90',
          },
          mozhua: {
            api: 'https://mozhuazy.com/api.php/provide/vod',
            name: '\u9B54\u722A\u8D44\u6E90',
          },
          mdzy: {
            api: 'https://www.mdzyapi.com/api.php/provide/vod',
            name: '\u9B54\u90FD\u8D44\u6E90',
          },
          zuid: {
            api: 'https://api.zuidapi.com/api.php/provide/vod',
            name: '\u6700\u5927\u8D44\u6E90',
          },
          yinghua: {
            api: 'https://m3u8.apiyhzy.com/api.php/provide/vod',
            name: '\u6A31\u82B1\u8D44\u6E90',
          },
          wujin: {
            api: 'https://api.wujinapi.me/api.php/provide/vod',
            name: '\u65E0\u5C3D\u8D44\u6E90',
          },
          wwzy: {
            api: 'https://wwzy.tv/api.php/provide/vod',
            name: '\u65FA\u65FA\u77ED\u5267',
          },
          ikun: {
            api: 'https://ikunzyapi.com/api.php/provide/vod',
            name: 'iKun\u8D44\u6E90',
          },
          lzi: {
            api: 'https://cj.lziapi.com/api.php/provide/vod',
            name: '\u91CF\u5B50\u8D44\u6E90\u7AD9',
          },
          xiaomaomi: {
            api: 'https://zy.xmm.hk/api.php/provide/vod',
            name: '\u5C0F\u732B\u54AA\u8D44\u6E90',
          },
        },
      };
    }),
    (l.__chunk_93664 = (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      let fileConfig, cachedConfig;
      __webpack_require__.d(__webpack_exports__, {
        Hz: () => API_CONFIG,
        Ih: () => resetConfig,
        iE: () => getConfig,
        jT: () => getCacheTime,
        ll: () => getAvailableApiSites,
        xg: () => configSelfCheck,
        yT: () => setCachedConfig,
      });
      var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10611),
        _runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21396);
      let API_CONFIG = {
        search: {
          path: '?ac=videolist&wd=',
          pagePath: '?ac=videolist&wd={query}&pg={page}',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'application/json',
          },
        },
        detail: {
          path: '?ac=videolist&ids=',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'application/json',
          },
        },
      };
      function refineConfig(e) {
        try {
          fileConfig = JSON.parse(e.ConfigFile);
        } catch {
          fileConfig = {};
        }
        let i = Object.entries(fileConfig.api_site || []),
          s = new Map((e.SourceConfig || []).map((o) => [o.key, o]));
        i.forEach(([o, n]) => {
          let t = s.get(o);
          t
            ? ((t.name = n.name),
              (t.api = n.api),
              (t.detail = n.detail),
              (t.from = 'config'))
            : s.set(o, {
                key: o,
                name: n.name,
                api: n.api,
                detail: n.detail,
                from: 'config',
                disabled: !1,
              });
        });
        let f = new Set(i.map(([o]) => o));
        s.forEach((o) => {
          f.has(o.key) || (o.from = 'custom');
        }),
          (e.SourceConfig = Array.from(s.values()));
        let g = fileConfig.custom_category || [],
          p = new Map(
            (e.CustomCategories || []).map((o) => [o.query + o.type, o])
          );
        g.forEach((o) => {
          let n = o.query + o.type,
            t = p.get(n);
          t
            ? ((t.name = o.name),
              (t.query = o.query),
              (t.type = o.type),
              (t.from = 'config'))
            : p.set(n, {
                name: o.name,
                type: o.type,
                query: o.query,
                from: 'config',
                disabled: !1,
              });
        });
        let r = new Set(g.map((o) => o.query + o.type));
        return (
          p.forEach((o) => {
            r.has(o.query + o.type) || (o.from = 'custom');
          }),
          (e.CustomCategories = Array.from(p.values())),
          fileConfig.cache_time !== void 0 &&
            (e.SiteConfig.SiteInterfaceCacheTime = fileConfig.cache_time),
          e
        );
      }
      async function initConfig() {
        if (cachedConfig) return;
        if (process.env.DOCKER_ENV === 'true') {
          let _require = eval('require'),
            fs = _require('fs'),
            path = _require('path'),
            configPath = path.join(process.cwd(), 'config.json'),
            raw = fs.readFileSync(configPath, 'utf-8');
          (fileConfig = JSON.parse(raw)),
            console.log('load dynamic config success');
        } else fileConfig = _runtime__WEBPACK_IMPORTED_MODULE_1__.Z;
        let storageType =
          process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';
        if (storageType !== 'localstorage') {
          if (cachedConfig) {
            cachedConfig = refineConfig(cachedConfig);
            return;
          }
          let storage = (0, _lib_db__WEBPACK_IMPORTED_MODULE_0__.cF)();
          try {
            let adminConfig = null;
            storage &&
              typeof storage.getAdminConfig == 'function' &&
              (adminConfig = await storage.getAdminConfig());
            let userNames = [];
            if (storage && typeof storage.getAllUsers == 'function')
              try {
                userNames = await storage.getAllUsers();
              } catch (e) {
                console.error(
                  '\u83B7\u53D6\u7528\u6237\u5217\u8868\u5931\u8D25:',
                  e
                );
              }
            if (adminConfig) {
              try {
                fileConfig = JSON.parse(adminConfig.ConfigFile);
              } catch (n) {
                console.error(
                  '\u89E3\u6790\u914D\u7F6E\u6587\u4EF6\u5931\u8D25:',
                  n
                ),
                  (fileConfig = {});
              }
              let e = Object.entries(fileConfig.api_site || []),
                i = fileConfig.custom_category || [],
                s = new Map(
                  (adminConfig.SourceConfig || []).map((n) => [n.key, n])
                );
              e.forEach(([n, t]) => {
                s.set(n, {
                  key: n,
                  name: t.name,
                  api: t.api,
                  detail: t.detail,
                  from: 'config',
                  disabled: !1,
                });
              }),
                (adminConfig.SourceConfig = Array.from(s.values()));
              let f = new Set(e.map(([n]) => n));
              adminConfig.SourceConfig.forEach((n) => {
                f.has(n.key) || (n.from = 'custom');
              }),
                adminConfig.CustomCategories ||
                  (adminConfig.CustomCategories = []);
              let g = new Map(
                adminConfig.CustomCategories.map((n) => [n.query + n.type, n])
              );
              i.forEach((n) => {
                g.set(n.query + n.type, {
                  name: n.name,
                  type: n.type,
                  query: n.query,
                  from: 'config',
                  disabled: !1,
                });
              });
              let p = new Set(i.map((n) => n.query + n.type));
              g.forEach((n) => {
                p.has(n.query + n.type) || (n.from = 'custom');
              }),
                (adminConfig.CustomCategories = Array.from(g.values()));
              let r = new Set(
                (adminConfig.UserConfig.Users || []).map((n) => n.username)
              );
              userNames.forEach((n) => {
                r.has(n) ||
                  adminConfig.UserConfig.Users.push({
                    username: n,
                    role: 'user',
                  });
              });
              let o = process.env.USERNAME;
              o &&
                ((adminConfig.UserConfig.Users =
                  adminConfig.UserConfig.Users.filter((n) => n.username !== o)),
                adminConfig.UserConfig.Users.unshift({
                  username: o,
                  role: 'owner',
                })),
                adminConfig.UserConfig ||
                  (adminConfig.UserConfig = {
                    AllowRegister: !1,
                    Users: [],
                    Groups: [],
                  }),
                ('Groups' in adminConfig.UserConfig &&
                  adminConfig.UserConfig.Groups) ||
                  (adminConfig.UserConfig.Groups = []);
            } else {
              if (process.env.DOCKER_ENV === 'true') {
                let _require = eval('require'),
                  fs = _require('fs'),
                  path = _require('path'),
                  configPath = path.join(process.cwd(), 'config.json'),
                  raw = fs.readFileSync(configPath, 'utf-8');
                fileConfig = JSON.parse(raw);
              } else fileConfig = _runtime__WEBPACK_IMPORTED_MODULE_1__.Z;
              let allUsers = userNames.map((e) => ({
                  username: e,
                  role: 'user',
                })),
                ownerUser = process.env.USERNAME;
              ownerUser &&
                (allUsers = allUsers.filter(
                  (e) => e.username !== ownerUser
                )).unshift({ username: ownerUser, role: 'owner' }),
                (adminConfig = {
                  ConfigFile: JSON.stringify(fileConfig),
                  SiteConfig: {
                    SiteName: process.env.NEXT_PUBLIC_SITE_NAME || 'MoonTV',
                    Announcement:
                      process.env.ANNOUNCEMENT ||
                      '\u672C\u7F51\u7AD9\u4EC5\u63D0\u4F9B\u5F71\u89C6\u4FE1\u606F\u641C\u7D22\u670D\u52A1\uFF0C\u6240\u6709\u5185\u5BB9\u5747\u6765\u81EA\u7B2C\u4E09\u65B9\u7F51\u7AD9\u3002\u672C\u7AD9\u4E0D\u5B58\u50A8\u4EFB\u4F55\u89C6\u9891\u8D44\u6E90\uFF0C\u4E0D\u5BF9\u4EFB\u4F55\u5185\u5BB9\u7684\u51C6\u786E\u6027\u3001\u5408\u6CD5\u6027\u3001\u5B8C\u6574\u6027\u8D1F\u8D23\u3002',
                    SearchDownstreamMaxPage:
                      Number(process.env.NEXT_PUBLIC_SEARCH_MAX_PAGE) || 5,
                    SiteInterfaceCacheTime: fileConfig.cache_time || 7200,
                    DoubanProxyType:
                      process.env.NEXT_PUBLIC_DOUBAN_PROXY_TYPE || 'direct',
                    DoubanProxy: process.env.NEXT_PUBLIC_DOUBAN_PROXY || '',
                    DoubanImageProxyType:
                      process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE ||
                      'direct',
                    DoubanImageProxy:
                      process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY || '',
                    DisableYellowFilter:
                      process.env.NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true',
                    DanmakuApiBaseUrl:
                      process.env.NEXT_PUBLIC_DANMU_API_BASE_URL || '',
                    TVBoxEnabled: !1,
                    TVBoxPassword: '',
                  },
                  UserConfig: {
                    AllowRegister:
                      process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true',
                    Users: allUsers,
                    Groups: [],
                  },
                  SourceConfig: Object.entries(fileConfig.api_site || {}).map(
                    ([e, i]) => ({
                      key: e,
                      name: i.name,
                      api: i.api,
                      detail: i.detail,
                      from: 'config',
                      disabled: !1,
                    })
                  ),
                  CustomCategories: (fileConfig.custom_category || []).map(
                    (e) => ({
                      name: e.name,
                      type: e.type,
                      query: e.query,
                      from: 'config',
                      disabled: !1,
                    })
                  ),
                  SubscriptionConfig: {},
                });
            }
            storage &&
              typeof storage.setAdminConfig == 'function' &&
              (await storage.setAdminConfig(adminConfig)),
              (cachedConfig = adminConfig);
          } catch (e) {
            console.error(
              '\u52A0\u8F7D\u7BA1\u7406\u5458\u914D\u7F6E\u5931\u8D25:',
              e
            );
          }
        } else
          cachedConfig = {
            ConfigFile: JSON.stringify(fileConfig),
            SiteConfig: {
              SiteName: process.env.SITE_NAME || 'MoonTV',
              Announcement:
                process.env.ANNOUNCEMENT ||
                '\u672C\u7F51\u7AD9\u4EC5\u63D0\u4F9B\u5F71\u89C6\u4FE1\u606F\u641C\u7D22\u670D\u52A1\uFF0C\u6240\u6709\u5185\u5BB9\u5747\u6765\u81EA\u7B2C\u4E09\u65B9\u7F51\u7AD9\u3002\u672C\u7AD9\u4E0D\u5B58\u50A8\u4EFB\u4F55\u89C6\u9891\u8D44\u6E90\uFF0C\u4E0D\u5BF9\u4EFB\u4F55\u5185\u5BB9\u7684\u51C6\u786E\u6027\u3001\u5408\u6CD5\u6027\u3001\u5B8C\u6574\u6027\u8D1F\u8D23\u3002',
              SearchDownstreamMaxPage:
                Number(process.env.NEXT_PUBLIC_SEARCH_MAX_PAGE) || 5,
              SiteInterfaceCacheTime: fileConfig.cache_time || 7200,
              DoubanProxyType:
                process.env.NEXT_PUBLIC_DOUBAN_PROXY_TYPE || 'direct',
              DoubanProxy: process.env.NEXT_PUBLIC_DOUBAN_PROXY || '',
              DoubanImageProxyType:
                process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE || 'direct',
              DoubanImageProxy:
                process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY || '',
              DisableYellowFilter:
                process.env.NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true',
              DanmakuApiBaseUrl:
                process.env.NEXT_PUBLIC_DANMU_API_BASE_URL || '',
              TVBoxEnabled: !1,
              TVBoxPassword: '',
            },
            UserConfig: {
              AllowRegister: process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true',
              Users: [],
              Groups: [],
            },
            SourceConfig: Object.entries(fileConfig.api_site).map(([e, i]) => ({
              key: e,
              name: i.name,
              api: i.api,
              detail: i.detail,
              from: 'config',
              disabled: !1,
            })),
            CustomCategories:
              fileConfig.custom_category?.map((e) => ({
                name: e.name,
                type: e.type,
                query: e.query,
                from: 'config',
                disabled: !1,
              })) || [],
            SubscriptionConfig: {},
          };
      }
      async function getConfig() {
        if (
          (process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage') ===
          'localstorage'
        )
          return await initConfig(), cachedConfig;
        let e = (0, _lib_db__WEBPACK_IMPORTED_MODULE_0__.cF)(),
          i = null;
        if (
          (e &&
            typeof e.getAdminConfig == 'function' &&
            (i = await e.getAdminConfig()),
          i)
        ) {
          if (
            (i.CustomCategories || (i.CustomCategories = []),
            (i.SiteConfig.SiteName =
              i.SiteConfig.SiteName ||
              process.env.NEXT_PUBLIC_SITE_NAME ||
              'MoonTV'),
            (i.SiteConfig.Announcement =
              i.SiteConfig.Announcement ||
              process.env.ANNOUNCEMENT ||
              '\u672C\u7F51\u7AD9\u4EC5\u63D0\u4F9B\u5F71\u89C6\u4FE1\u606F\u641C\u7D22\u670D\u52A1\uFF0C\u6240\u6709\u5185\u5BB9\u5747\u6765\u81EA\u7B2C\u4E09\u65B9\u7F51\u7AD9\u3002\u672C\u7AD9\u4E0D\u5B58\u50A8\u4EFB\u4F55\u89C6\u9891\u8D44\u6E90\uFF0C\u4E0D\u5BF9\u4EFB\u4F55\u5185\u5BB9\u7684\u51C6\u786E\u6027\u3001\u5408\u6CD5\u6027\u3001\u5B8C\u6574\u6027\u8D1F\u8D23\u3002'),
            (i.UserConfig.AllowRegister =
              typeof i.UserConfig.AllowRegister == 'boolean'
                ? i.UserConfig.AllowRegister
                : process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true'),
            (i.SiteConfig.DoubanProxyType =
              i.SiteConfig.DoubanProxyType ||
              process.env.NEXT_PUBLIC_DOUBAN_PROXY_TYPE ||
              'direct'),
            (i.SiteConfig.DoubanProxy =
              i.SiteConfig.DoubanProxy ||
              process.env.NEXT_PUBLIC_DOUBAN_PROXY ||
              ''),
            (i.SiteConfig.DoubanImageProxyType =
              i.SiteConfig.DoubanImageProxyType ||
              process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE ||
              'direct'),
            (i.SiteConfig.DoubanImageProxy =
              i.SiteConfig.DoubanImageProxy ||
              process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY ||
              ''),
            (i.SiteConfig.DisableYellowFilter =
              typeof i.SiteConfig.DisableYellowFilter == 'boolean'
                ? i.SiteConfig.DisableYellowFilter
                : process.env.NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true'),
            (i.SiteConfig.DanmakuApiBaseUrl =
              i.SiteConfig.DanmakuApiBaseUrl ||
              process.env.NEXT_PUBLIC_DANMU_API_BASE_URL ||
              ''),
            (process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage') ===
              'localstorage')
          ) {
            let a = process.env.TVBOX_ENABLED;
            (i.SiteConfig.TVBoxEnabled =
              a == null || String(a).toLowerCase() === 'true'),
              (i.SiteConfig.TVBoxPassword = process.env.PASSWORD || '');
          } else
            (i.SiteConfig.TVBoxEnabled =
              typeof i.SiteConfig.TVBoxEnabled == 'boolean' &&
              i.SiteConfig.TVBoxEnabled),
              (i.SiteConfig.TVBoxPassword =
                typeof i.SiteConfig.TVBoxPassword == 'string'
                  ? i.SiteConfig.TVBoxPassword
                  : '');
          try {
            fileConfig = JSON.parse(i.ConfigFile);
          } catch (a) {
            console.error(
              '\u89E3\u6790\u914D\u7F6E\u6587\u4EF6\u5931\u8D25:',
              a
            ),
              (fileConfig = {});
          }
          let s = Object.entries(fileConfig.api_site || []),
            f = new Map((i.SourceConfig || []).map((a) => [a.key, a]));
          s.forEach(([a, C]) => {
            let c = f.get(a);
            c
              ? ((c.name = C.name),
                (c.api = C.api),
                (c.detail = C.detail),
                (c.from = 'config'))
              : f.set(a, {
                  key: a,
                  name: C.name,
                  api: C.api,
                  detail: C.detail,
                  from: 'config',
                  disabled: !1,
                });
          });
          let g = new Set(s.map(([a]) => a));
          f.forEach((a) => {
            g.has(a.key) || (a.from = 'custom');
          }),
            (i.SourceConfig = Array.from(f.values()));
          let p = fileConfig.custom_category || [],
            r = new Map(
              (i.CustomCategories || []).map((a) => [a.query + a.type, a])
            );
          p.forEach((a) => {
            let C = a.query + a.type,
              c = r.get(C);
            c
              ? c.from === 'config' &&
                ((c.name = a.name),
                (c.type = a.type),
                (c.query = a.query),
                (c.from = 'config'),
                (c.disabled = !1))
              : r.set(C, {
                  name: a.name,
                  type: a.type,
                  query: a.query,
                  from: 'config',
                  disabled: !1,
                });
          });
          let o = new Set(p.map((a) => a.query + a.type));
          r.forEach((a) => {
            o.has(a.query + a.type) || (a.from = 'custom');
          }),
            (i.CustomCategories = Array.from(r.values())),
            fileConfig.cache_time !== void 0 &&
              (i.SiteConfig.SiteInterfaceCacheTime = fileConfig.cache_time),
            i.UserConfig ||
              (i.UserConfig = { AllowRegister: !1, Users: [], Groups: [] }),
            ('Groups' in i.UserConfig && i.UserConfig.Groups) ||
              (i.UserConfig.Groups = []);
          let n = process.env.USERNAME || '',
            t = !1;
          i.UserConfig.Users.forEach((a) => {
            a.username !== n && a.role === 'owner' && (a.role = 'user'),
              a.username === n && ((t = !0), (a.role = 'owner'));
          }),
            t || i.UserConfig.Users.unshift({ username: n, role: 'owner' }),
            (cachedConfig = i);
        } else await initConfig();
        return cachedConfig;
      }
      function configSelfCheck(e) {
        e.UserConfig || (e.UserConfig = { AllowRegister: !1, Users: [] }),
          (e.UserConfig.Users && Array.isArray(e.UserConfig.Users)) ||
            (e.UserConfig.Users = []),
          (e.SourceConfig && Array.isArray(e.SourceConfig)) ||
            (e.SourceConfig = []),
          (e.CustomCategories && Array.isArray(e.CustomCategories)) ||
            (e.CustomCategories = []),
          e.SubscriptionConfig || (e.SubscriptionConfig = {});
        let i = process.env.USERNAME,
          s = e.UserConfig.Users.find((r) => r.username === i),
          f = new Set();
        (e.UserConfig.Users = e.UserConfig.Users.filter(
          (r) => !f.has(r.username) && (f.add(r.username), !0)
        )),
          (e.UserConfig.Users = e.UserConfig.Users.filter(
            (r) => r.username !== i
          )),
          e.UserConfig.Users.forEach((r) => {
            r.role === 'owner' && (r.role = 'user');
          }),
          e.UserConfig.Users.unshift({
            username: i,
            role: 'owner',
            banned: s?.banned ?? !1,
            group: s?.group,
            lastOnline: s?.lastOnline,
          });
        let g = new Set();
        e.SourceConfig = e.SourceConfig.filter(
          (r) => !g.has(r.key) && (g.add(r.key), !0)
        );
        let p = new Set();
        return (
          (e.CustomCategories = e.CustomCategories.filter(
            (r) => !p.has(r.query + r.type) && (p.add(r.query + r.type), !0)
          )),
          e
        );
      }
      async function resetConfig() {
        let storageType =
            process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage',
          storage = (0, _lib_db__WEBPACK_IMPORTED_MODULE_0__.cF)(),
          userNames = [];
        if (storage && typeof storage.getAllUsers == 'function')
          try {
            userNames = await storage.getAllUsers();
          } catch (e) {
            console.error(
              '\u83B7\u53D6\u7528\u6237\u5217\u8868\u5931\u8D25:',
              e
            );
          }
        if (process.env.DOCKER_ENV === 'true') {
          let _require = eval('require'),
            fs = _require('fs'),
            path = _require('path'),
            configPath = path.join(process.cwd(), 'config.json'),
            raw = fs.readFileSync(configPath, 'utf-8');
          (fileConfig = JSON.parse(raw)),
            console.log('load dynamic config success');
        } else fileConfig = _runtime__WEBPACK_IMPORTED_MODULE_1__.Z;
        let apiSiteEntries = Object.entries(fileConfig.api_site),
          customCategories = fileConfig.custom_category || [],
          allUsers = userNames.map((e) => ({ username: e, role: 'user' })),
          ownerUser = process.env.USERNAME;
        ownerUser &&
          (allUsers = allUsers.filter((e) => e.username !== ownerUser)).unshift(
            { username: ownerUser, role: 'owner' }
          );
        let adminConfig = {
          ConfigFile: JSON.stringify(fileConfig),
          SiteConfig: {
            SiteName: process.env.SITE_NAME || 'MoonTV',
            Announcement:
              process.env.ANNOUNCEMENT ||
              '\u672C\u7F51\u7AD9\u4EC5\u63D0\u4F9B\u5F71\u89C6\u4FE1\u606F\u641C\u7D22\u670D\u52A1\uFF0C\u6240\u6709\u5185\u5BB9\u5747\u6765\u81EA\u7B2C\u4E09\u65B9\u7F51\u7AD9\u3002\u672C\u7AD9\u4E0D\u5B58\u50A8\u4EFB\u4F55\u89C6\u9891\u8D44\u6E90\uFF0C\u4E0D\u5BF9\u4EFB\u4F55\u5185\u5BB9\u7684\u51C6\u786E\u6027\u3001\u5408\u6CD5\u6027\u3001\u5B8C\u6574\u6027\u8D1F\u8D23\u3002',
            SearchDownstreamMaxPage:
              Number(process.env.NEXT_PUBLIC_SEARCH_MAX_PAGE) || 5,
            SiteInterfaceCacheTime: fileConfig.cache_time || 7200,
            DoubanProxyType:
              process.env.NEXT_PUBLIC_DOUBAN_PROXY_TYPE || 'direct',
            DoubanProxy: process.env.NEXT_PUBLIC_DOUBAN_PROXY || '',
            DoubanImageProxyType:
              process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE || 'direct',
            DoubanImageProxy: process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY || '',
            DisableYellowFilter:
              process.env.NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true',
            DanmakuApiBaseUrl: process.env.NEXT_PUBLIC_DANMU_API_BASE_URL || '',
            TVBoxEnabled: !1,
            TVBoxPassword: '',
          },
          UserConfig: {
            AllowRegister: process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true',
            Users: allUsers,
          },
          SourceConfig: apiSiteEntries.map(([e, i]) => ({
            key: e,
            name: i.name,
            api: i.api,
            detail: i.detail,
            from: 'config',
            disabled: !1,
          })),
          CustomCategories:
            (storageType === 'redis' &&
              customCategories?.map((e) => ({
                name: e.name,
                type: e.type,
                query: e.query,
                from: 'config',
                disabled: !1,
              }))) ||
            [],
          SubscriptionConfig: {},
        };
        storage &&
          typeof storage.setAdminConfig == 'function' &&
          (await storage.setAdminConfig(adminConfig)),
          cachedConfig == null && (cachedConfig = adminConfig),
          (cachedConfig.ConfigFile = adminConfig.ConfigFile),
          (cachedConfig.SiteConfig = adminConfig.SiteConfig),
          (cachedConfig.UserConfig = adminConfig.UserConfig),
          (cachedConfig.SourceConfig = adminConfig.SourceConfig),
          (cachedConfig.CustomCategories = adminConfig.CustomCategories || []),
          (cachedConfig.SubscriptionConfig = adminConfig.SubscriptionConfig);
      }
      async function getCacheTime() {
        return (await getConfig()).SiteConfig.SiteInterfaceCacheTime || 7200;
      }
      async function getAvailableApiSites(e) {
        let i = await getConfig(),
          s = i.SourceConfig.filter((o) => !o.disabled);
        if (!e || !i.UserConfig?.Groups || i.UserConfig.Groups.length === 0)
          return s.map((o) => ({
            key: o.key,
            name: o.name,
            api: o.api,
            detail: o.detail,
          }));
        let f = i.UserConfig.Users.find((o) => o.username === e),
          g = f?.group;
        if (!g)
          return s.map((o) => ({
            key: o.key,
            name: o.name,
            api: o.api,
            detail: o.detail,
          }));
        let p = i.UserConfig.Groups.find((o) => o.name === g);
        if (!p)
          return s.map((o) => ({
            key: o.key,
            name: o.name,
            api: o.api,
            detail: o.detail,
          }));
        let r = new Set(p.sourceKeys);
        return s
          .filter((o) => r.has(o.key))
          .map((o) => ({
            key: o.key,
            name: o.name,
            api: o.api,
            detail: o.detail,
          }));
      }
      async function setCachedConfig(e) {
        cachedConfig = e;
      }
    }),
    l
  );
export { m as __getNamedExports };
