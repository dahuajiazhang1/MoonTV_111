var Kr = {},
  so = (F, io, ro) => (
    (Kr.__chunk_60396 = (pn, Vr, Te) => {
      'use strict';
      Te.d(Vr, { J: () => lt, i: () => je });
      var Pt = Te(93664),
        Y = Te(51859),
        Ci = Te.n(Y);
      function Oe(st) {
        if (!st) return '';
        let Tt = st
          .replace(
            /<[^>]+>/g,
            `
`
          )
          .replace(
            /\n+/g,
            `
`
          )
          .replace(/[ \t]+/g, ' ')
          .replace(/^\n+|\n+$/g, '')
          .trim();
        return Ci().decode(Tt);
      }
      Te(96529);
      let Q = /(https?:\/\/[^"'\s]+?\.m3u8)/g;
      async function b(st, Tt, at = 3e4) {
        let St = new AbortController(),
          J = setTimeout(() => St.abort(), at);
        try {
          return await fetch(st, { ...Tt, signal: St.signal });
        } catch (it) {
          throw it.name === 'AbortError'
            ? Error('\u8BF7\u6C42\u8D85\u65F6')
            : it.message?.includes('Failed to fetch') ||
              it.message?.includes('fetch failed') ||
              it.message?.includes('NetworkError')
            ? Error('\u8BF7\u6C42\u5931\u8D25')
            : Error(
                `\u7F51\u7EDC\u9519\u8BEF: ${
                  it.message || '\u672A\u77E5\u9519\u8BEF'
                }`
              );
        } finally {
          clearTimeout(J);
        }
      }
      function p(st, Tt) {
        let at = [],
          St = [];
        return (
          st &&
            st.split('$$$').forEach((J) => {
              let it = [],
                Ct = [];
              J.split('#').forEach((ae) => {
                let [ne, qt] = ae.split('$');
                qt?.endsWith('.m3u8') && (Ct.push(ne), it.push(qt));
              }),
                it.length > at.length && ((at = it), (St = Ct));
            }),
          at.length === 0 &&
            Tt &&
            (St = (at = (Tt.match(Q) ?? []).map((J) =>
              J.replace(/^\$/, '')
            )).map((J, it) => (it + 1).toString())),
          { episodes: at, titles: St }
        );
      }
      function Se(st, Tt, at) {
        let { episodes: St, titles: J } = p(st.vod_play_url, st.vod_content);
        return {
          id: st.vod_id.toString(),
          title: st.vod_name.trim().replace(/\s+/g, ' '),
          poster: st.vod_pic,
          episodes: St,
          episodes_titles: J,
          source: Tt.key,
          source_name: at,
          class: st.vod_class,
          year: st.vod_year?.match(/\d{4}/)?.[0] || 'unknown',
          desc: Oe(st.vod_content || ''),
          type_name: st.type_name,
          douban_id: st.vod_douban_id,
        };
      }
      async function* je(st, Tt, at = !0, St) {
        let J = st.api + Pt.Hz.search.path + encodeURIComponent(Tt),
          it = await b(J, { headers: Pt.Hz.search.headers }, St);
        if (!it.ok) return;
        let Ct = await it.json();
        if (!Array.isArray(Ct?.list)) return;
        yield Ct.list.map((nt) => Se(nt, st, st.name));
        let { SiteConfig: ae } = await (0, Pt.iE)(),
          ne = ae.SearchDownstreamMaxPage,
          qt = Math.min(Ct.pagecount || 1, ne);
        if (qt > 1)
          if (at) {
            let nt = [];
            for (let bt = 2; bt <= qt; bt++) {
              let Mt =
                  st.api +
                  Pt.Hz.search.pagePath
                    .replace('{query}', encodeURIComponent(Tt))
                    .replace('{page}', bt.toString()),
                At = (async () => {
                  let Ot = await b(Mt, { headers: Pt.Hz.search.headers }, St);
                  if (!Ot.ok) return null;
                  let fe = await Ot.json();
                  if (!Array.isArray(fe?.list)) return null;
                  let qe = fe.list.map((we) => Se(we, st, st.name));
                  return { page: bt, results: qe };
                })();
              nt.push(At);
            }
            for (let bt of (await Promise.all(nt))
              .filter((Mt) => !!Mt && Mt.results.length > 0)
              .sort((Mt, At) => Mt.page - At.page))
              yield bt.results;
          } else
            for (let nt = 2; nt <= qt; nt++) {
              let bt =
                  st.api +
                  Pt.Hz.search.pagePath
                    .replace('{query}', encodeURIComponent(Tt))
                    .replace('{page}', nt.toString()),
                Mt = await b(bt, { headers: Pt.Hz.search.headers }, St);
              if (!Mt.ok) continue;
              let At = await Mt.json();
              if (Array.isArray(At?.list)) {
                let Ot = At.list.map((fe) => Se(fe, st, st.name));
                Ot.length > 0 && (yield Ot);
              }
            }
      }
      async function lt(st, Tt) {
        if (st.detail) return j(Tt, st);
        let at = `${st.api}${Pt.Hz.detail.path}${Tt}`,
          St = await b(at, { headers: Pt.Hz.detail.headers });
        if (!St.ok)
          throw Error(`\u8BE6\u60C5\u8BF7\u6C42\u5931\u8D25: ${St.status}`);
        let J = await St.json();
        if (!Array.isArray(J?.list) || J.list.length === 0)
          throw Error(
            '\u83B7\u53D6\u5230\u7684\u8BE6\u60C5\u5185\u5BB9\u65E0\u6548'
          );
        let it = J.list[0],
          { episodes: Ct, titles: ae } = p(it.vod_play_url, it.vod_content);
        return {
          id: Tt.toString(),
          title: it.vod_name,
          poster: it.vod_pic,
          episodes: Ct,
          episodes_titles: ae,
          source: st.key,
          source_name: st.name,
          class: it.vod_class,
          year: it.vod_year?.match(/\d{4}/)?.[0] || 'unknown',
          desc: Oe(it.vod_content),
          type_name: it.type_name,
          douban_id: it.vod_douban_id,
        };
      }
      async function j(st, Tt) {
        let at = `${Tt.detail}/index.php/vod/detail/id/${st}.html`,
          St = await b(at, { headers: Pt.Hz.detail.headers });
        if (!St.ok)
          throw Error(
            `\u8BE6\u60C5\u9875\u8BF7\u6C42\u5931\u8D25: ${St.status}`
          );
        let J = await St.text(),
          it = [];
        if (
          (Tt.key === 'ffzy' &&
            (it =
              J.match(
                /\$(https?:\/\/[^"'\s]+?\/\d{8}\/\d+_[a-f0-9]+\/index\.m3u8)/g
              ) || []),
          it.length === 0 &&
            (it = J.match(/\$(https?:\/\/[^"'\s]+?\.m3u8)/g) || []),
          (it = Array.from(new Set(it)).map((bt) => {
            let Mt = bt.substring(1),
              At = Mt.indexOf('(');
            return At > 0 ? Mt.substring(0, At) : Mt;
          })).length === 0)
        ) {
          let { episodes: bt } = p(void 0, J);
          it = bt;
        }
        let Ct = it.map((bt, Mt) => (Mt + 1).toString()),
          ae = J.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]?.trim() || '',
          ne = Oe(
            J.match(
              /<div[^>]*class=["']sketch["'][^>]*>([\s\S]*?)<\/div>/
            )?.[1] || ''
          ),
          qt = J.match(/(https?:\/\/[^"'\s]+?\.jpg)/)?.[0]?.trim() || '',
          nt = J.match(/>(\d{4})</)?.[1] || 'unknown';
        return {
          id: st,
          title: ae,
          poster: qt,
          episodes: it,
          episodes_titles: Ct,
          source: Tt.key,
          source_name: Tt.name,
          class: '',
          year: nt,
          desc: ne,
          type_name: '',
          douban_id: 0,
        };
      }
    }),
    (Kr.__chunk_96529 = (pn, Vr, Te) => {
      'use strict';
      let Pt,
        Y =
          Number.isFinite ||
          function (h) {
            return typeof h == 'number' && isFinite(h);
          },
        Ci =
          Number.isSafeInteger ||
          function (h) {
            return typeof h == 'number' && Math.abs(h) <= Oe;
          },
        Oe = Number.MAX_SAFE_INTEGER || 9007199254740991,
        Q = (function (h) {
          return (
            (h.NETWORK_ERROR = 'networkError'),
            (h.MEDIA_ERROR = 'mediaError'),
            (h.KEY_SYSTEM_ERROR = 'keySystemError'),
            (h.MUX_ERROR = 'muxError'),
            (h.OTHER_ERROR = 'otherError'),
            h
          );
        })({}),
        b = (function (h) {
          return (
            (h.KEY_SYSTEM_NO_KEYS = 'keySystemNoKeys'),
            (h.KEY_SYSTEM_NO_ACCESS = 'keySystemNoAccess'),
            (h.KEY_SYSTEM_NO_SESSION = 'keySystemNoSession'),
            (h.KEY_SYSTEM_NO_CONFIGURED_LICENSE =
              'keySystemNoConfiguredLicense'),
            (h.KEY_SYSTEM_LICENSE_REQUEST_FAILED =
              'keySystemLicenseRequestFailed'),
            (h.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED =
              'keySystemServerCertificateRequestFailed'),
            (h.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED =
              'keySystemServerCertificateUpdateFailed'),
            (h.KEY_SYSTEM_SESSION_UPDATE_FAILED =
              'keySystemSessionUpdateFailed'),
            (h.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED =
              'keySystemStatusOutputRestricted'),
            (h.KEY_SYSTEM_STATUS_INTERNAL_ERROR =
              'keySystemStatusInternalError'),
            (h.KEY_SYSTEM_DESTROY_MEDIA_KEYS_ERROR =
              'keySystemDestroyMediaKeysError'),
            (h.KEY_SYSTEM_DESTROY_CLOSE_SESSION_ERROR =
              'keySystemDestroyCloseSessionError'),
            (h.KEY_SYSTEM_DESTROY_REMOVE_SESSION_ERROR =
              'keySystemDestroyRemoveSessionError'),
            (h.MANIFEST_LOAD_ERROR = 'manifestLoadError'),
            (h.MANIFEST_LOAD_TIMEOUT = 'manifestLoadTimeOut'),
            (h.MANIFEST_PARSING_ERROR = 'manifestParsingError'),
            (h.MANIFEST_INCOMPATIBLE_CODECS_ERROR =
              'manifestIncompatibleCodecsError'),
            (h.LEVEL_EMPTY_ERROR = 'levelEmptyError'),
            (h.LEVEL_LOAD_ERROR = 'levelLoadError'),
            (h.LEVEL_LOAD_TIMEOUT = 'levelLoadTimeOut'),
            (h.LEVEL_PARSING_ERROR = 'levelParsingError'),
            (h.LEVEL_SWITCH_ERROR = 'levelSwitchError'),
            (h.AUDIO_TRACK_LOAD_ERROR = 'audioTrackLoadError'),
            (h.AUDIO_TRACK_LOAD_TIMEOUT = 'audioTrackLoadTimeOut'),
            (h.SUBTITLE_LOAD_ERROR = 'subtitleTrackLoadError'),
            (h.SUBTITLE_TRACK_LOAD_TIMEOUT = 'subtitleTrackLoadTimeOut'),
            (h.FRAG_LOAD_ERROR = 'fragLoadError'),
            (h.FRAG_LOAD_TIMEOUT = 'fragLoadTimeOut'),
            (h.FRAG_DECRYPT_ERROR = 'fragDecryptError'),
            (h.FRAG_PARSING_ERROR = 'fragParsingError'),
            (h.FRAG_GAP = 'fragGap'),
            (h.REMUX_ALLOC_ERROR = 'remuxAllocError'),
            (h.KEY_LOAD_ERROR = 'keyLoadError'),
            (h.KEY_LOAD_TIMEOUT = 'keyLoadTimeOut'),
            (h.BUFFER_ADD_CODEC_ERROR = 'bufferAddCodecError'),
            (h.BUFFER_INCOMPATIBLE_CODECS_ERROR =
              'bufferIncompatibleCodecsError'),
            (h.BUFFER_APPEND_ERROR = 'bufferAppendError'),
            (h.BUFFER_APPENDING_ERROR = 'bufferAppendingError'),
            (h.BUFFER_STALLED_ERROR = 'bufferStalledError'),
            (h.BUFFER_FULL_ERROR = 'bufferFullError'),
            (h.BUFFER_SEEK_OVER_HOLE = 'bufferSeekOverHole'),
            (h.BUFFER_NUDGE_ON_STALL = 'bufferNudgeOnStall'),
            (h.ASSET_LIST_LOAD_ERROR = 'assetListLoadError'),
            (h.ASSET_LIST_LOAD_TIMEOUT = 'assetListLoadTimeout'),
            (h.ASSET_LIST_PARSING_ERROR = 'assetListParsingError'),
            (h.INTERSTITIAL_ASSET_ITEM_ERROR = 'interstitialAssetItemError'),
            (h.INTERNAL_EXCEPTION = 'internalException'),
            (h.INTERNAL_ABORTED = 'aborted'),
            (h.ATTACH_MEDIA_ERROR = 'attachMediaError'),
            (h.UNKNOWN = 'unknown'),
            h
          );
        })({}),
        p = (function (h) {
          return (
            (h.MEDIA_ATTACHING = 'hlsMediaAttaching'),
            (h.MEDIA_ATTACHED = 'hlsMediaAttached'),
            (h.MEDIA_DETACHING = 'hlsMediaDetaching'),
            (h.MEDIA_DETACHED = 'hlsMediaDetached'),
            (h.MEDIA_ENDED = 'hlsMediaEnded'),
            (h.STALL_RESOLVED = 'hlsStallResolved'),
            (h.BUFFER_RESET = 'hlsBufferReset'),
            (h.BUFFER_CODECS = 'hlsBufferCodecs'),
            (h.BUFFER_CREATED = 'hlsBufferCreated'),
            (h.BUFFER_APPENDING = 'hlsBufferAppending'),
            (h.BUFFER_APPENDED = 'hlsBufferAppended'),
            (h.BUFFER_EOS = 'hlsBufferEos'),
            (h.BUFFERED_TO_END = 'hlsBufferedToEnd'),
            (h.BUFFER_FLUSHING = 'hlsBufferFlushing'),
            (h.BUFFER_FLUSHED = 'hlsBufferFlushed'),
            (h.MANIFEST_LOADING = 'hlsManifestLoading'),
            (h.MANIFEST_LOADED = 'hlsManifestLoaded'),
            (h.MANIFEST_PARSED = 'hlsManifestParsed'),
            (h.LEVEL_SWITCHING = 'hlsLevelSwitching'),
            (h.LEVEL_SWITCHED = 'hlsLevelSwitched'),
            (h.LEVEL_LOADING = 'hlsLevelLoading'),
            (h.LEVEL_LOADED = 'hlsLevelLoaded'),
            (h.LEVEL_UPDATED = 'hlsLevelUpdated'),
            (h.LEVEL_PTS_UPDATED = 'hlsLevelPtsUpdated'),
            (h.LEVELS_UPDATED = 'hlsLevelsUpdated'),
            (h.AUDIO_TRACKS_UPDATED = 'hlsAudioTracksUpdated'),
            (h.AUDIO_TRACK_SWITCHING = 'hlsAudioTrackSwitching'),
            (h.AUDIO_TRACK_SWITCHED = 'hlsAudioTrackSwitched'),
            (h.AUDIO_TRACK_LOADING = 'hlsAudioTrackLoading'),
            (h.AUDIO_TRACK_LOADED = 'hlsAudioTrackLoaded'),
            (h.AUDIO_TRACK_UPDATED = 'hlsAudioTrackUpdated'),
            (h.SUBTITLE_TRACKS_UPDATED = 'hlsSubtitleTracksUpdated'),
            (h.SUBTITLE_TRACKS_CLEARED = 'hlsSubtitleTracksCleared'),
            (h.SUBTITLE_TRACK_SWITCH = 'hlsSubtitleTrackSwitch'),
            (h.SUBTITLE_TRACK_LOADING = 'hlsSubtitleTrackLoading'),
            (h.SUBTITLE_TRACK_LOADED = 'hlsSubtitleTrackLoaded'),
            (h.SUBTITLE_TRACK_UPDATED = 'hlsSubtitleTrackUpdated'),
            (h.SUBTITLE_FRAG_PROCESSED = 'hlsSubtitleFragProcessed'),
            (h.CUES_PARSED = 'hlsCuesParsed'),
            (h.NON_NATIVE_TEXT_TRACKS_FOUND = 'hlsNonNativeTextTracksFound'),
            (h.INIT_PTS_FOUND = 'hlsInitPtsFound'),
            (h.FRAG_LOADING = 'hlsFragLoading'),
            (h.FRAG_LOAD_EMERGENCY_ABORTED = 'hlsFragLoadEmergencyAborted'),
            (h.FRAG_LOADED = 'hlsFragLoaded'),
            (h.FRAG_DECRYPTED = 'hlsFragDecrypted'),
            (h.FRAG_PARSING_INIT_SEGMENT = 'hlsFragParsingInitSegment'),
            (h.FRAG_PARSING_USERDATA = 'hlsFragParsingUserdata'),
            (h.FRAG_PARSING_METADATA = 'hlsFragParsingMetadata'),
            (h.FRAG_PARSED = 'hlsFragParsed'),
            (h.FRAG_BUFFERED = 'hlsFragBuffered'),
            (h.FRAG_CHANGED = 'hlsFragChanged'),
            (h.FPS_DROP = 'hlsFpsDrop'),
            (h.FPS_DROP_LEVEL_CAPPING = 'hlsFpsDropLevelCapping'),
            (h.MAX_AUTO_LEVEL_UPDATED = 'hlsMaxAutoLevelUpdated'),
            (h.ERROR = 'hlsError'),
            (h.DESTROYING = 'hlsDestroying'),
            (h.KEY_LOADING = 'hlsKeyLoading'),
            (h.KEY_LOADED = 'hlsKeyLoaded'),
            (h.LIVE_BACK_BUFFER_REACHED = 'hlsLiveBackBufferReached'),
            (h.BACK_BUFFER_REACHED = 'hlsBackBufferReached'),
            (h.STEERING_MANIFEST_LOADED = 'hlsSteeringManifestLoaded'),
            (h.ASSET_LIST_LOADING = 'hlsAssetListLoading'),
            (h.ASSET_LIST_LOADED = 'hlsAssetListLoaded'),
            (h.INTERSTITIALS_UPDATED = 'hlsInterstitialsUpdated'),
            (h.INTERSTITIALS_BUFFERED_TO_BOUNDARY =
              'hlsInterstitialsBufferedToBoundary'),
            (h.INTERSTITIAL_ASSET_PLAYER_CREATED =
              'hlsInterstitialAssetPlayerCreated'),
            (h.INTERSTITIAL_STARTED = 'hlsInterstitialStarted'),
            (h.INTERSTITIAL_ASSET_STARTED = 'hlsInterstitialAssetStarted'),
            (h.INTERSTITIAL_ASSET_ENDED = 'hlsInterstitialAssetEnded'),
            (h.INTERSTITIAL_ASSET_ERROR = 'hlsInterstitialAssetError'),
            (h.INTERSTITIAL_ENDED = 'hlsInterstitialEnded'),
            (h.INTERSTITIALS_PRIMARY_RESUMED =
              'hlsInterstitialsPrimaryResumed'),
            (h.PLAYOUT_LIMIT_REACHED = 'hlsPlayoutLimitReached'),
            (h.EVENT_CUE_ENTER = 'hlsEventCueEnter'),
            h
          );
        })({});
      var Se,
        je,
        lt = {
          MANIFEST: 'manifest',
          LEVEL: 'level',
          AUDIO_TRACK: 'audioTrack',
          SUBTITLE_TRACK: 'subtitleTrack',
        },
        j = { MAIN: 'main', AUDIO: 'audio', SUBTITLE: 'subtitle' };
      class st {
        constructor(t, e = 0, i = 0) {
          (this.halfLife = void 0),
            (this.alpha_ = void 0),
            (this.estimate_ = void 0),
            (this.totalWeight_ = void 0),
            (this.halfLife = t),
            (this.alpha_ = t ? Math.exp(Math.log(0.5) / t) : 0),
            (this.estimate_ = e),
            (this.totalWeight_ = i);
        }
        sample(t, e) {
          let i = Math.pow(this.alpha_, t);
          (this.estimate_ = e * (1 - i) + i * this.estimate_),
            (this.totalWeight_ += t);
        }
        getTotalWeight() {
          return this.totalWeight_;
        }
        getEstimate() {
          if (this.alpha_) {
            let t = 1 - Math.pow(this.alpha_, this.totalWeight_);
            if (t) return this.estimate_ / t;
          }
          return this.estimate_;
        }
      }
      class Tt {
        constructor(t, e, i, r = 100) {
          (this.defaultEstimate_ = void 0),
            (this.minWeight_ = void 0),
            (this.minDelayMs_ = void 0),
            (this.slow_ = void 0),
            (this.fast_ = void 0),
            (this.defaultTTFB_ = void 0),
            (this.ttfb_ = void 0),
            (this.defaultEstimate_ = i),
            (this.minWeight_ = 0.001),
            (this.minDelayMs_ = 50),
            (this.slow_ = new st(t)),
            (this.fast_ = new st(e)),
            (this.defaultTTFB_ = r),
            (this.ttfb_ = new st(t));
        }
        update(t, e) {
          let { slow_: i, fast_: r, ttfb_: s } = this;
          i.halfLife !== t &&
            (this.slow_ = new st(t, i.getEstimate(), i.getTotalWeight())),
            r.halfLife !== e &&
              (this.fast_ = new st(e, r.getEstimate(), r.getTotalWeight())),
            s.halfLife !== t &&
              (this.ttfb_ = new st(t, s.getEstimate(), s.getTotalWeight()));
        }
        sample(t, e) {
          let i = (t = Math.max(t, this.minDelayMs_)) / 1e3,
            r = (8 * e) / i;
          this.fast_.sample(i, r), this.slow_.sample(i, r);
        }
        sampleTTFB(t) {
          this.ttfb_.sample(
            Math.sqrt(2) * Math.exp(-Math.pow(t / 1e3, 2) / 2),
            Math.max(t, 5)
          );
        }
        canEstimate() {
          return this.fast_.getTotalWeight() >= this.minWeight_;
        }
        getEstimate() {
          return this.canEstimate()
            ? Math.min(this.fast_.getEstimate(), this.slow_.getEstimate())
            : this.defaultEstimate_;
        }
        getEstimateTTFB() {
          return this.ttfb_.getTotalWeight() >= this.minWeight_
            ? this.ttfb_.getEstimate()
            : this.defaultTTFB_;
        }
        get defaultEstimate() {
          return this.defaultEstimate_;
        }
        destroy() {}
      }
      function at() {
        return (at = Object.assign
          ? Object.assign.bind()
          : function (h) {
              for (var t = 1; t < arguments.length; t++) {
                var e = arguments[t];
                for (var i in e)
                  ({}).hasOwnProperty.call(e, i) && (h[i] = e[i]);
              }
              return h;
            }).apply(null, arguments);
      }
      function St(h, t) {
        var e = Object.keys(h);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(h);
          t &&
            (i = i.filter(function (r) {
              return Object.getOwnPropertyDescriptor(h, r).enumerable;
            })),
            e.push.apply(e, i);
        }
        return e;
      }
      function J(h) {
        for (var t = 1; t < arguments.length; t++) {
          var e = arguments[t] != null ? arguments[t] : {};
          t % 2
            ? St(Object(e), !0).forEach(function (i) {
                var r, s;
                (r = i),
                  (s = e[i]),
                  (r = (function (a) {
                    var n = (function (l, o) {
                      if (typeof l != 'object' || !l) return l;
                      var d = l[Symbol.toPrimitive];
                      if (d !== void 0) {
                        var u = d.call(l, o);
                        if (typeof u != 'object') return u;
                        throw TypeError(
                          '@@toPrimitive must return a primitive value.'
                        );
                      }
                      return (o === 'string' ? String : Number)(l);
                    })(a, 'string');
                    return typeof n == 'symbol' ? n : n + '';
                  })(r)) in h
                    ? Object.defineProperty(h, r, {
                        value: s,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (h[r] = s);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(h, Object.getOwnPropertyDescriptors(e))
            : St(Object(e)).forEach(function (i) {
                Object.defineProperty(
                  h,
                  i,
                  Object.getOwnPropertyDescriptor(e, i)
                );
              });
        }
        return h;
      }
      class it {
        constructor(t, e) {
          (this.trace = void 0),
            (this.debug = void 0),
            (this.log = void 0),
            (this.warn = void 0),
            (this.info = void 0),
            (this.error = void 0);
          let i = `[${t}]:`;
          (this.trace = Ct),
            (this.debug = e.debug.bind(null, i)),
            (this.log = e.log.bind(null, i)),
            (this.warn = e.warn.bind(null, i)),
            (this.info = e.info.bind(null, i)),
            (this.error = e.error.bind(null, i));
        }
      }
      let Ct = function () {},
        ae = { trace: Ct, debug: Ct, log: Ct, warn: Ct, info: Ct, error: Ct };
      function ne() {
        return at({}, ae);
      }
      function qt(h, t, e) {
        return t[h]
          ? t[h].bind(t)
          : (function (i, r) {
              let s = F.console[i];
              return s
                ? s.bind(F.console, `${r ? '[' + r + '] ' : ''}[${i}] >`)
                : Ct;
            })(h, e);
      }
      let nt = ne();
      function bt(h = !0) {
        if (typeof F < 'u')
          return (
            ((h || !F.MediaSource) && F.ManagedMediaSource) ||
            F.MediaSource ||
            F.WebKitMediaSource
          );
      }
      function Mt(h, t) {
        let e = Object.keys(h),
          i = Object.keys(t),
          r = e.length,
          s = i.length;
        return !r || !s || (r === s && !e.some((a) => i.indexOf(a) === -1));
      }
      function At(h, t = !1) {
        let e, i;
        if (typeof TextDecoder < 'u') {
          let n = new TextDecoder('utf-8').decode(h);
          if (t) {
            let l = n.indexOf('\0');
            return l !== -1 ? n.substring(0, l) : n;
          }
          return n.replace(/\0/g, '');
        }
        let r = h.length,
          s = '',
          a = 0;
        for (; a < r && ((e = h[a++]) !== 0 || !t); )
          if (e !== 0 && e !== 3)
            switch (e >> 4) {
              case 0:
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
                s += String.fromCharCode(e);
                break;
              case 12:
              case 13:
                s += String.fromCharCode(((31 & e) << 6) | (63 & h[a++]));
                break;
              case 14:
                s += String.fromCharCode(
                  ((15 & e) << 12) | ((63 & h[a++]) << 6) | ((63 & h[a++]) << 0)
                );
            }
        return s;
      }
      function Ot(h) {
        let t = '';
        for (let e = 0; e < h.length; e++) {
          let i = h[e].toString(16);
          i.length < 2 && (i = '0' + i), (t += i);
        }
        return t;
      }
      function fe(h) {
        return Uint8Array.from(
          h
            .replace(/^0x/, '')
            .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
            .replace(/ +$/, '')
            .split(' ')
        ).buffer;
      }
      var qe = { exports: {} },
        we = (function () {
          var h, t, e, i, r;
          return (
            Se ||
              ((Se = 1),
              (h =
                /^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/),
              (t = /^(?=([^\/?#]*))\1([^]*)$/),
              (e = /(?:\/|^)\.(?=\/)/g),
              (i = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g),
              (r = {
                buildAbsoluteURL: function (s, a, n) {
                  if (((n = n || {}), (s = s.trim()), !(a = a.trim()))) {
                    if (!n.alwaysNormalize) return s;
                    var l = r.parseURL(s);
                    if (!l) throw Error('Error trying to parse base URL.');
                    return (
                      (l.path = r.normalizePath(l.path)), r.buildURLFromParts(l)
                    );
                  }
                  var o = r.parseURL(a);
                  if (!o) throw Error('Error trying to parse relative URL.');
                  if (o.scheme)
                    return n.alwaysNormalize
                      ? ((o.path = r.normalizePath(o.path)),
                        r.buildURLFromParts(o))
                      : a;
                  var d = r.parseURL(s);
                  if (!d) throw Error('Error trying to parse base URL.');
                  if (!d.netLoc && d.path && d.path[0] !== '/') {
                    var u = t.exec(d.path);
                    (d.netLoc = u[1]), (d.path = u[2]);
                  }
                  d.netLoc && !d.path && (d.path = '/');
                  var c = {
                    scheme: d.scheme,
                    netLoc: o.netLoc,
                    path: null,
                    params: o.params,
                    query: o.query,
                    fragment: o.fragment,
                  };
                  if (!o.netLoc && ((c.netLoc = d.netLoc), o.path[0] !== '/'))
                    if (o.path) {
                      var f = d.path,
                        g = f.substring(0, f.lastIndexOf('/') + 1) + o.path;
                      c.path = r.normalizePath(g);
                    } else
                      (c.path = d.path),
                        o.params ||
                          ((c.params = d.params),
                          o.query || (c.query = d.query));
                  return (
                    c.path === null &&
                      (c.path = n.alwaysNormalize
                        ? r.normalizePath(o.path)
                        : o.path),
                    r.buildURLFromParts(c)
                  );
                },
                parseURL: function (s) {
                  var a = h.exec(s);
                  return a
                    ? {
                        scheme: a[1] || '',
                        netLoc: a[2] || '',
                        path: a[3] || '',
                        params: a[4] || '',
                        query: a[5] || '',
                        fragment: a[6] || '',
                      }
                    : null;
                },
                normalizePath: function (s) {
                  for (
                    s = s.split('').reverse().join('').replace(e, '');
                    s.length !== (s = s.replace(i, '')).length;

                  );
                  return s.split('').reverse().join('');
                },
                buildURLFromParts: function (s) {
                  return (
                    s.scheme +
                    s.netLoc +
                    s.path +
                    s.params +
                    s.query +
                    s.fragment
                  );
                },
              }),
              (qe.exports = r)),
            qe.exports
          );
        })();
      class Oi {
        constructor() {
          (this.aborted = !1),
            (this.loaded = 0),
            (this.retry = 0),
            (this.total = 0),
            (this.chunkCount = 0),
            (this.bwEstimate = 0),
            (this.loading = { start: 0, first: 0, end: 0 }),
            (this.parsing = { start: 0, end: 0 }),
            (this.buffering = { start: 0, first: 0, end: 0 });
        }
      }
      var mt = { AUDIO: 'audio', VIDEO: 'video', AUDIOVIDEO: 'audiovideo' };
      class Hr {
        constructor(t) {
          (this._byteRange = null),
            (this._url = null),
            (this._stats = null),
            (this._streams = null),
            (this.base = void 0),
            (this.relurl = void 0),
            typeof t == 'string' && (t = { url: t }),
            (this.base = t),
            (function (e, i) {
              let r = (function s(a, n) {
                let l = Object.getPrototypeOf(a);
                if (l) return Object.getOwnPropertyDescriptor(l, n) || s(l, n);
              })(e, i);
              r && ((r.enumerable = !0), Object.defineProperty(e, i, r));
            })(this, 'stats');
        }
        setByteRange(t, e) {
          let i,
            r = t.split('@', 2);
          (i = r.length === 1 ? e?.byteRangeEndOffset || 0 : parseInt(r[1])),
            (this._byteRange = [i, parseInt(r[0]) + i]);
        }
        get baseurl() {
          return this.base.url;
        }
        get byteRange() {
          return this._byteRange === null ? [] : this._byteRange;
        }
        get byteRangeStartOffset() {
          return this.byteRange[0];
        }
        get byteRangeEndOffset() {
          return this.byteRange[1];
        }
        get elementaryStreams() {
          return (
            this._streams === null &&
              (this._streams = {
                [mt.AUDIO]: null,
                [mt.VIDEO]: null,
                [mt.AUDIOVIDEO]: null,
              }),
            this._streams
          );
        }
        set elementaryStreams(t) {
          this._streams = t;
        }
        get hasStats() {
          return this._stats !== null;
        }
        get hasStreams() {
          return this._streams !== null;
        }
        get stats() {
          return this._stats === null && (this._stats = new Oi()), this._stats;
        }
        set stats(t) {
          this._stats = t;
        }
        get url() {
          return (
            !this._url &&
              this.baseurl &&
              this.relurl &&
              (this._url = we.buildAbsoluteURL(this.baseurl, this.relurl, {
                alwaysNormalize: !0,
              })),
            this._url || ''
          );
        }
        set url(t) {
          this._url = t;
        }
        clearElementaryStreamInfo() {
          let { elementaryStreams: t } = this;
          (t[mt.AUDIO] = null), (t[mt.VIDEO] = null), (t[mt.AUDIOVIDEO] = null);
        }
      }
      function _t(h) {
        return h.sn !== 'initSegment';
      }
      class wi extends Hr {
        constructor(t, e) {
          super(e),
            (this._decryptdata = null),
            (this._programDateTime = null),
            (this._ref = null),
            (this._bitrate = void 0),
            (this.rawProgramDateTime = null),
            (this.tagList = []),
            (this.duration = 0),
            (this.sn = 0),
            (this.levelkeys = void 0),
            (this.type = void 0),
            (this.loader = null),
            (this.keyLoader = null),
            (this.level = -1),
            (this.cc = 0),
            (this.startPTS = void 0),
            (this.endPTS = void 0),
            (this.startDTS = void 0),
            (this.endDTS = void 0),
            (this.start = 0),
            (this.playlistOffset = 0),
            (this.deltaPTS = void 0),
            (this.maxStartPTS = void 0),
            (this.minEndPTS = void 0),
            (this.data = void 0),
            (this.bitrateTest = !1),
            (this.title = null),
            (this.initSegment = null),
            (this.endList = void 0),
            (this.gap = void 0),
            (this.urlId = 0),
            (this.type = t);
        }
        get byteLength() {
          if (this.hasStats) {
            let t = this.stats.total;
            if (t) return t;
          }
          if (this.byteRange.length) {
            let t = this.byteRange[0],
              e = this.byteRange[1];
            if (Y(t) && Y(e)) return e - t;
          }
          return null;
        }
        get bitrate() {
          return this.byteLength
            ? (8 * this.byteLength) / this.duration
            : this._bitrate
            ? this._bitrate
            : null;
        }
        set bitrate(t) {
          this._bitrate = t;
        }
        get decryptdata() {
          let { levelkeys: t } = this;
          if (!t && !this._decryptdata) return null;
          if (!this._decryptdata && this.levelkeys && !this.levelkeys.NONE) {
            let e = this.levelkeys.identity;
            if (e) this._decryptdata = e.getDecryptData(this.sn);
            else {
              let i = Object.keys(this.levelkeys);
              if (i.length === 1) {
                let r = (this._decryptdata = this.levelkeys[i[0]] || null);
                if (r) return r.getDecryptData(this.sn);
              }
            }
          }
          return this._decryptdata;
        }
        get end() {
          return this.start + this.duration;
        }
        get endProgramDateTime() {
          if (this.programDateTime === null) return null;
          let t = Y(this.duration) ? this.duration : 0;
          return this.programDateTime + 1e3 * t;
        }
        get encrypted() {
          var t, e;
          if ((t = this._decryptdata) != null && t.encrypted) return !0;
          if (this.levelkeys) {
            let i = Object.keys(this.levelkeys),
              r = i.length;
            if (
              r > 1 ||
              (r === 1 && (e = this.levelkeys[i[0]]) != null && e.encrypted)
            )
              return !0;
          }
          return !1;
        }
        get programDateTime() {
          return (
            this._programDateTime === null &&
              this.rawProgramDateTime &&
              (this.programDateTime = Date.parse(this.rawProgramDateTime)),
            this._programDateTime
          );
        }
        set programDateTime(t) {
          if (!Y(t)) {
            this._programDateTime = this.rawProgramDateTime = null;
            return;
          }
          this._programDateTime = t;
        }
        get ref() {
          return _t(this)
            ? (this._ref ||
                (this._ref = {
                  base: this.base,
                  start: this.start,
                  duration: this.duration,
                  sn: this.sn,
                  programDateTime: this.programDateTime,
                }),
              this._ref)
            : null;
        }
        addStart(t) {
          this.setStart(this.start + t);
        }
        setStart(t) {
          (this.start = t), this._ref && (this._ref.start = t);
        }
        setDuration(t) {
          (this.duration = t), this._ref && (this._ref.duration = t);
        }
        setKeyFormat(t) {
          if (this.levelkeys) {
            let e = this.levelkeys[t];
            e &&
              !this._decryptdata &&
              (this._decryptdata = e.getDecryptData(this.sn));
          }
        }
        abortRequests() {
          var t, e;
          (t = this.loader) == null || t.abort(),
            (e = this.keyLoader) == null || e.abort();
        }
        setElementaryStreamInfo(t, e, i, r, s, a = !1) {
          let { elementaryStreams: n } = this,
            l = n[t];
          if (!l) {
            n[t] = {
              startPTS: e,
              endPTS: i,
              startDTS: r,
              endDTS: s,
              partial: a,
            };
            return;
          }
          (l.startPTS = Math.min(l.startPTS, e)),
            (l.endPTS = Math.max(l.endPTS, i)),
            (l.startDTS = Math.min(l.startDTS, r)),
            (l.endDTS = Math.max(l.endDTS, s));
        }
      }
      class En extends Hr {
        constructor(t, e, i, r, s) {
          super(i),
            (this.fragOffset = 0),
            (this.duration = 0),
            (this.gap = !1),
            (this.independent = !1),
            (this.relurl = void 0),
            (this.fragment = void 0),
            (this.index = void 0),
            (this.duration = t.decimalFloatingPoint('DURATION')),
            (this.gap = t.bool('GAP')),
            (this.independent = t.bool('INDEPENDENT')),
            (this.relurl = t.enumeratedString('URI')),
            (this.fragment = e),
            (this.index = r);
          let a = t.enumeratedString('BYTERANGE');
          a && this.setByteRange(a, s),
            s && (this.fragOffset = s.fragOffset + s.duration);
        }
        get start() {
          return this.fragment.start + this.fragOffset;
        }
        get end() {
          return this.start + this.duration;
        }
        get loaded() {
          let { elementaryStreams: t } = this;
          return !!(t.audio || t.video || t.audiovideo);
        }
      }
      let yn = [].push,
        Yr = { video: 1, audio: 2, id3: 3, text: 4 };
      function wt(h) {
        return String.fromCharCode.apply(null, h);
      }
      function Wr(h, t) {
        let e = (h[t] << 8) | h[t + 1];
        return e < 0 ? 65536 + e : e;
      }
      function tt(h, t) {
        let e = qr(h, t);
        return e < 0 ? 4294967296 + e : e;
      }
      function jr(h, t) {
        let e = tt(h, t);
        return (e *= 4294967296), (e += tt(h, t + 4));
      }
      function qr(h, t) {
        return (h[t] << 24) | (h[t + 1] << 16) | (h[t + 2] << 8) | h[t + 3];
      }
      function ot(h, t) {
        let e = [];
        if (!t.length) return e;
        let i = h.byteLength;
        for (let r = 0; r < i; ) {
          let s = tt(h, r),
            a = wt(h.subarray(r + 4, r + 8)),
            n = s > 1 ? r + s : i;
          if (a === t[0])
            if (t.length === 1) e.push(h.subarray(r + 8, n));
            else {
              let l = ot(h.subarray(r + 8, n), t.slice(1));
              l.length && yn.apply(e, l);
            }
          r = n;
        }
        return e;
      }
      function Xr(h) {
        let t = [],
          e = ot(h, ['moov', 'trak']);
        for (let i = 0; i < e.length; i++) {
          let r = e[i],
            s = ot(r, ['tkhd'])[0];
          if (s) {
            let a = s[0],
              n = tt(s, a === 0 ? 12 : 20),
              l = ot(r, ['mdia', 'mdhd'])[0];
            if (l) {
              a = l[0];
              let o = tt(l, a === 0 ? 12 : 20),
                d = ot(r, ['mdia', 'hdlr'])[0];
              if (d) {
                let u = wt(d.subarray(8, 12)),
                  c = { soun: mt.AUDIO, vide: mt.VIDEO }[u],
                  f = (function (g) {
                    let E,
                      m = g.subarray(8),
                      y = m.subarray(86),
                      S = wt(m.subarray(4, 8)),
                      T = S,
                      A = S === 'enca' || S === 'encv';
                    if (A) {
                      let I = ot(m, [S])[0].subarray(S === 'enca' ? 28 : 78);
                      ot(I, ['sinf']).forEach((v) => {
                        let _ = ot(v, ['schm'])[0];
                        if (_) {
                          let L = wt(_.subarray(4, 8));
                          if (L === 'cbcs' || L === 'cenc') {
                            let C = ot(v, ['frma'])[0];
                            C && (T = wt(C));
                          }
                        }
                      });
                    }
                    let R = T;
                    switch (T) {
                      case 'avc1':
                      case 'avc2':
                      case 'avc3':
                      case 'avc4': {
                        let I = ot(y, ['avcC'])[0];
                        I &&
                          I.length > 3 &&
                          ((T += '.' + ze(I[1]) + ze(I[2]) + ze(I[3])),
                          (E = Xe(R === 'avc1' ? 'dva1' : 'dvav', y)));
                        break;
                      }
                      case 'mp4a': {
                        let I = ot(m, [S])[0],
                          v = ot(I.subarray(28), ['esds'])[0];
                        if (v && v.length > 7) {
                          let _ = 4;
                          if (v[_++] !== 3) break;
                          _ = xi(v, _) + 2;
                          let L = v[_++];
                          if (
                            (128 & L && (_ += 2),
                            64 & L && (_ += v[_++]),
                            v[_++] !== 4)
                          )
                            break;
                          _ = xi(v, _);
                          let C = v[_++];
                          if (C === 64) T += '.' + ze(C);
                          else break;
                          if (((_ += 12), v[_++] !== 5)) break;
                          _ = xi(v, _);
                          let M = v[_++],
                            G = (248 & M) >> 3;
                          G === 31 &&
                            (G += 1 + ((7 & M) << 3) + ((224 & v[_]) >> 5)),
                            (T += '.' + G);
                        }
                        break;
                      }
                      case 'hvc1':
                      case 'hev1': {
                        let I = ot(y, ['hvcC'])[0];
                        if (I && I.length > 12) {
                          let v = I[1],
                            _ = ['', 'A', 'B', 'C'][v >> 6],
                            L = tt(I, 2),
                            C = I[12],
                            M = I.subarray(6, 12);
                          T +=
                            '.' +
                            _ +
                            (31 & v) +
                            '.' +
                            (function (k) {
                              let P = 0;
                              for (let x = 0; x < 32; x++)
                                P |= ((k >> x) & 1) << (31 - x);
                              return P >>> 0;
                            })(L)
                              .toString(16)
                              .toUpperCase() +
                            '.' +
                            ((32 & v) >> 5 ? 'H' : 'L') +
                            C;
                          let G = '';
                          for (let k = M.length; k--; ) {
                            let P = M[k];
                            (P || G) &&
                              (G = '.' + P.toString(16).toUpperCase() + G);
                          }
                          T += G;
                        }
                        E = Xe(R == 'hev1' ? 'dvhe' : 'dvh1', y);
                        break;
                      }
                      case 'dvh1':
                      case 'dvhe':
                      case 'dvav':
                      case 'dva1':
                      case 'dav1':
                        T = Xe(T, y) || T;
                        break;
                      case 'vp09': {
                        let I = ot(y, ['vpcC'])[0];
                        if (I && I.length > 6) {
                          let v = I[4],
                            _ = I[5],
                            L = (I[6] >> 4) & 15;
                          T += '.' + Qt(v) + '.' + Qt(_) + '.' + Qt(L);
                        }
                        break;
                      }
                      case 'av01': {
                        let I = ot(y, ['av1C'])[0];
                        if (I && I.length > 2) {
                          let v = I[1] >>> 5,
                            _ = 31 & I[1],
                            L = I[2] >>> 7 ? 'H' : 'M',
                            C = (64 & I[2]) >> 6,
                            M = (32 & I[2]) >> 5,
                            G = (16 & I[2]) >> 4,
                            k = (8 & I[2]) >> 3,
                            P = (4 & I[2]) >> 2,
                            x = 3 & I[2];
                          (T +=
                            '.' +
                            v +
                            '.' +
                            Qt(_) +
                            L +
                            '.' +
                            Qt(v === 2 && C ? (M ? 12 : 10) : C ? 10 : 8) +
                            '.' +
                            G +
                            '.' +
                            k +
                            P +
                            x +
                            '.' +
                            Qt(1) +
                            '.' +
                            Qt(1) +
                            '.' +
                            Qt(1) +
                            '.0'),
                            (E = Xe('dav1', y));
                        }
                      }
                    }
                    return { codec: T, encrypted: A, supplemental: E };
                  })(ot(r, ['mdia', 'minf', 'stbl', 'stsd'])[0]);
                c
                  ? ((t[n] = { timescale: o, type: c, stsd: f }),
                    (t[c] = J({ timescale: o, id: n }, f)))
                  : (t[n] = { timescale: o, type: u, stsd: f });
              }
            }
          }
        }
        return (
          ot(h, ['moov', 'mvex', 'trex']).forEach((i) => {
            let r = t[tt(i, 4)];
            r && (r.default = { duration: tt(i, 12), flags: tt(i, 20) });
          }),
          t
        );
      }
      function Xe(h, t) {
        let e = ot(t, ['dvvC']),
          i = e.length ? e[0] : ot(t, ['dvcC'])[0];
        if (i) {
          let r = (i[2] >> 1) & 127,
            s = ((i[2] << 5) & 32) | ((i[3] >> 3) & 31);
          return h + '.' + Qt(r) + '.' + Qt(s);
        }
      }
      function xi(h, t) {
        let e = t + 5;
        for (; 128 & h[t++] && t < e; );
        return t;
      }
      function ze(h) {
        return ('0' + h.toString(16).toUpperCase()).slice(-2);
      }
      function Qt(h) {
        return (h < 10 ? '0' : '') + h;
      }
      function zr(h) {
        let t = ot(h, ['schm'])[0];
        if (t) {
          let e = wt(t.subarray(4, 8));
          if (e === 'cbcs' || e === 'cenc') return ot(h, ['schi', 'tenc'])[0];
        }
        return null;
      }
      function Wt(h, t) {
        let e = new Uint8Array(h.length + t.length);
        return e.set(h), e.set(t, h.length), e;
      }
      function Qr(h, t) {
        let e = [],
          i = t.samples,
          r = t.timescale,
          s = t.id,
          a = !1;
        return (
          ot(i, ['moof']).map((n) => {
            let l = n.byteOffset - 8;
            ot(n, ['traf']).map((o) => {
              let d = ot(o, ['tfdt']).map((u) => {
                let c = u[0],
                  f = tt(u, 4);
                return c === 1 && ((f *= 4294967296), (f += tt(u, 8))), f / r;
              })[0];
              return (
                d !== void 0 && (h = d),
                ot(o, ['tfhd']).map((u) => {
                  let c = tt(u, 4),
                    f = 16777215 & tt(u, 0),
                    g = 0,
                    E = 0,
                    m = 8;
                  c === s &&
                    ((1 & f) != 0 && (m += 8),
                    (2 & f) != 0 && (m += 4),
                    (8 & f) != 0 && ((g = tt(u, m)), (m += 4)),
                    (16 & f) != 0 && ((E = tt(u, m)), (m += 4)),
                    (32 & f) != 0 && (m += 4),
                    t.type === 'video' && (a = Qe(t.codec)),
                    ot(o, ['trun']).map((y) => {
                      let S = y[0],
                        T = 16777215 & tt(y, 0),
                        A = 0,
                        R = (256 & T) != 0,
                        I = 0,
                        v = (512 & T) != 0,
                        _ = 0,
                        L = (1024 & T) != 0,
                        C = (2048 & T) != 0,
                        M = 0,
                        G = tt(y, 4),
                        k = 8;
                      (1 & T) != 0 && ((A = tt(y, k)), (k += 4)),
                        (4 & T) != 0 && (k += 4);
                      let P = A + l;
                      for (let x = 0; x < G; x++) {
                        if (
                          (R ? ((I = tt(y, k)), (k += 4)) : (I = g),
                          v ? ((_ = tt(y, k)), (k += 4)) : (_ = E),
                          L && (k += 4),
                          C && ((M = S === 0 ? tt(y, k) : qr(y, k)), (k += 4)),
                          t.type === mt.VIDEO)
                        ) {
                          let U = 0;
                          for (; U < _; ) {
                            let $ = tt(i, P);
                            (P += 4),
                              (function (B, O) {
                                if (!B) return (31 & O) == 6;
                                {
                                  let w = (O >> 1) & 63;
                                  return w === 39 || w === 40;
                                }
                              })(a, i[P]) &&
                                Mi(
                                  i.subarray(P, P + $),
                                  a ? 2 : 1,
                                  h + M / r,
                                  e
                                ),
                              (P += $),
                              (U += $ + 4);
                          }
                        }
                        h += I / r;
                      }
                    }));
                })
              );
            });
          }),
          e
        );
      }
      function Qe(h) {
        if (!h) return !1;
        let t = h.substring(0, 4);
        return t === 'hvc1' || t === 'hev1' || t === 'dvh1' || t === 'dvhe';
      }
      function Mi(h, t, e, i) {
        let r,
          s = Zr(h);
        r = 0 + t;
        let a = 0,
          n = 0,
          l = 0;
        for (; r < s.length; ) {
          a = 0;
          do {
            if (r >= s.length) break;
            a += l = s[r++];
          } while (l === 255);
          n = 0;
          do {
            if (r >= s.length) break;
            n += l = s[r++];
          } while (l === 255);
          let o = s.length - r,
            d = r;
          if (n < o) r += n;
          else if (n > o) {
            nt.error(
              `Malformed SEI payload. ${n} is too small, only ${o} bytes left to parse.`
            );
            break;
          }
          if (a === 4) {
            if (s[d++] === 181) {
              let u = Wr(s, d);
              if (((d += 2), u === 49)) {
                let c = tt(s, d);
                if (((d += 4), c === 1195456820)) {
                  let f = s[d++];
                  if (f === 3) {
                    let g = s[d++],
                      E = 31 & g,
                      m = 64 & g,
                      y = m ? 2 + 3 * E : 0,
                      S = new Uint8Array(y);
                    if (m) {
                      S[0] = g;
                      for (let T = 1; T < y; T++) S[T] = s[d++];
                    }
                    i.push({ type: f, payloadType: a, pts: e, bytes: S });
                  }
                }
              }
            }
          } else if (a === 5 && n > 16) {
            let u = [];
            for (let g = 0; g < 16; g++) {
              let E = s[d++].toString(16);
              u.push(E.length == 1 ? '0' + E : E),
                (g === 3 || g === 5 || g === 7 || g === 9) && u.push('-');
            }
            let c = n - 16,
              f = new Uint8Array(c);
            for (let g = 0; g < c; g++) f[g] = s[d++];
            i.push({
              payloadType: a,
              pts: e,
              uuid: u.join(''),
              userData: At(f),
              userDataBytes: f,
            });
          }
        }
      }
      function Zr(h) {
        let t = h.byteLength,
          e = [],
          i = 1;
        for (; i < t - 2; )
          h[i] === 0 && h[i + 1] === 0 && h[i + 2] === 3
            ? (e.push(i + 2), (i += 2))
            : i++;
        if (e.length === 0) return h;
        let r = t - e.length,
          s = new Uint8Array(r),
          a = 0;
        for (i = 0; i < r; a++, i++)
          a === e[0] && (a++, e.shift()), (s[i] = h[a]);
        return s;
      }
      let Jr = () => /\(Windows.+Firefox\//i.test(navigator.userAgent),
        Ae = {
          audio: {
            a3ds: 1,
            'ac-3': 0.95,
            'ac-4': 1,
            alac: 0.9,
            alaw: 1,
            dra1: 1,
            'dts+': 1,
            'dts-': 1,
            dtsc: 1,
            dtse: 1,
            dtsh: 1,
            'ec-3': 0.9,
            enca: 1,
            fLaC: 0.9,
            flac: 0.9,
            FLAC: 0.9,
            g719: 1,
            g726: 1,
            m4ae: 1,
            mha1: 1,
            mha2: 1,
            mhm1: 1,
            mhm2: 1,
            mlpa: 1,
            mp4a: 1,
            'raw ': 1,
            Opus: 1,
            opus: 1,
            samr: 1,
            sawb: 1,
            sawp: 1,
            sevc: 1,
            sqcp: 1,
            ssmv: 1,
            twos: 1,
            ulaw: 1,
          },
          video: {
            avc1: 1,
            avc2: 1,
            avc3: 1,
            avc4: 1,
            avcp: 1,
            av01: 0.8,
            dav1: 0.8,
            drac: 1,
            dva1: 1,
            dvav: 1,
            dvh1: 0.7,
            dvhe: 0.7,
            encv: 1,
            hev1: 0.75,
            hvc1: 0.75,
            mjp2: 1,
            mp4v: 1,
            mvc1: 1,
            mvc2: 1,
            mvc3: 1,
            mvc4: 1,
            resv: 1,
            rv60: 1,
            s263: 1,
            svc1: 1,
            svc2: 1,
            'vc-1': 1,
            vp08: 1,
            vp09: 0.9,
          },
          text: { stpp: 1, wvtt: 1 },
        };
      function Fi(h, t) {
        let e = Ae[t];
        return !!e && !!e[h.slice(0, 4)];
      }
      function Ni(h, t, e = !0) {
        return !h.split(',').some((i) => !Ui(i, t, e));
      }
      function Ui(h, t, e = !0) {
        var i;
        let r = bt(e);
        return (i = r?.isTypeSupported(xe(h, t))) != null && i;
      }
      function xe(h, t) {
        return `${t}/mp4;codecs=${h}`;
      }
      function ts(h) {
        if (h) {
          let t = h.substring(0, 4);
          return Ae.video[t];
        }
        return 2;
      }
      function Ze(h) {
        let t = Jr();
        return h.split(',').reduce((e, i) => {
          let r = t && Qe(i) ? 9 : Ae.video[i];
          return r
            ? (2 * r + e) / (e ? 3 : 2)
            : (Ae.audio[i] + e) / (e ? 2 : 1);
        }, 0);
      }
      let Bi = {},
        vn = /flac|opus|mp4a\.40\.34/i;
      function Je(h, t = !0) {
        return h.replace(vn, (e) =>
          (function (i, r = !0) {
            if (Bi[i]) return Bi[i];
            let s = {
              flac: ['flac', 'fLaC', 'FLAC'],
              opus: ['opus', 'Opus'],
              'mp4a.40.34': ['mp3'],
            }[i];
            for (let n = 0; n < s.length; n++) {
              var a;
              if (Ui(s[n], 'audio', r)) return (Bi[i] = s[n]), s[n];
              if (
                s[n] === 'mp3' &&
                (a = bt(r)) != null &&
                a.isTypeSupported('audio/mpeg')
              )
                return '';
            }
            return i;
          })(e.toLowerCase(), t)
        );
      }
      function ti(h, t) {
        if (
          h &&
          (h.length > 4 ||
            ['ac-3', 'ec-3', 'alac', 'fLaC', 'Opus'].indexOf(h) !== -1) &&
          (es(h, 'audio') || es(h, 'video'))
        )
          return h;
        if (t) {
          let e = t.split(',');
          if (e.length > 1) {
            if (h) {
              for (let i = e.length; i--; )
                if (e[i].substring(0, 4) === h.substring(0, 4)) return e[i];
            }
            return e[0];
          }
        }
        return t || h;
      }
      function es(h, t) {
        return Fi(h, t) && Ui(h, t);
      }
      function is(h) {
        let t = bt(h) || { isTypeSupported: () => !1 };
        return {
          mpeg: t.isTypeSupported('audio/mpeg'),
          mp3: t.isTypeSupported('audio/mp4; codecs="mp3"'),
          ac3: t.isTypeSupported('audio/mp4; codecs="ac-3"'),
        };
      }
      function $i(h) {
        return h.replace(/^.+codecs=["']?([^"']+).*$/, '$1');
      }
      let Tn = { supported: !1, smooth: !1, powerEfficient: !1 },
        rs = {
          supported: !0,
          configurations: [],
          decodingInfoResults: [
            { supported: !0, powerEfficient: !0, smooth: !0 },
          ],
        };
      function ss(h, t) {
        return {
          supported: !1,
          configurations: t,
          decodingInfoResults: [Tn],
          error: h,
        };
      }
      function as(h, t, e, i = {}) {
        let r = h.videoCodec;
        if ((!r && !h.audioCodec) || !e) return Promise.resolve(rs);
        let s = [],
          a = (function (d) {
            var u;
            let c = (u = d.videoCodec) == null ? void 0 : u.split(','),
              f = ns(d),
              g = d.width || 640,
              E = d.height || 480,
              m = d.frameRate || 30,
              y = d.videoRange.toLowerCase();
            return c
              ? c.map((S) => {
                  let T = {
                    contentType: xe(
                      (function (A) {
                        if (A.startsWith('av01.')) {
                          let R = A.split('.'),
                            I = ['0', '111', '01', '01', '01', '0'];
                          for (let v = R.length; v > 4 && v < 10; v++)
                            R[v] = I[v - 4];
                          return R.join('.');
                        }
                        return A;
                      })(S),
                      'video'
                    ),
                    width: g,
                    height: E,
                    bitrate: f,
                    framerate: m,
                  };
                  return y !== 'sdr' && (T.transferFunction = y), T;
                })
              : [];
          })(h),
          n = a.length,
          l = (function (d, u, c) {
            var f;
            let g = (f = d.audioCodec) == null ? void 0 : f.split(','),
              E = ns(d);
            return g && d.audioGroups
              ? d.audioGroups.reduce((m, y) => {
                  var S;
                  let T = y
                    ? (S = u.groups[y]) == null
                      ? void 0
                      : S.tracks
                    : null;
                  return T
                    ? T.reduce((A, R) => {
                        if (R.groupId === y) {
                          let I = parseFloat(R.channels || '');
                          g.forEach((v) => {
                            let _ = {
                              contentType: xe(v, 'audio'),
                              bitrate: c
                                ? (function (L, C) {
                                    if (C <= 1) return 1;
                                    let M = 128e3;
                                    return (
                                      L === 'ec-3'
                                        ? (M = 768e3)
                                        : L === 'ac-3' && (M = 64e4),
                                      Math.min(C / 2, M)
                                    );
                                  })(v, E)
                                : E,
                            };
                            I && (_.channels = '' + I), A.push(_);
                          });
                        }
                        return A;
                      }, m)
                    : m;
                }, [])
              : [];
          })(h, t, n > 0),
          o = l.length;
        for (let d = n || 1 * o || 1; d--; ) {
          let u = { type: 'media-source' };
          if ((n && (u.video = a[d % n]), o)) {
            u.audio = l[d % o];
            let c = u.audio.bitrate;
            u.video && c && (u.video.bitrate -= c);
          }
          s.push(u);
        }
        if (r) {
          let d = navigator.userAgent;
          if (r.split(',').some((u) => Qe(u)) && Jr())
            return Promise.resolve(
              ss(
                Error(
                  `Overriding Windows Firefox HEVC MediaCapabilities result based on user-agent string: (${d})`
                ),
                s
              )
            );
        }
        return Promise.all(
          s.map((d) => {
            let u = (function (c) {
              let f = '',
                { audio: g, video: E } = c;
              if (E) {
                let m = $i(E.contentType);
                f += `${m}_r${E.height}x${E.width}f${Math.ceil(E.framerate)}${
                  E.transferFunction || 'sd'
                }_${Math.ceil(E.bitrate / 1e5)}`;
              }
              if (g) {
                let m = $i(g.contentType);
                f += `${E ? '_' : ''}${m}_c${g.channels}`;
              }
              return f;
            })(d);
            return i[u] || (i[u] = e.decodingInfo(d));
          })
        )
          .then((d) => ({
            supported: !d.some((u) => !u.supported),
            configurations: s,
            decodingInfoResults: d,
          }))
          .catch((d) => ({
            supported: !1,
            configurations: s,
            decodingInfoResults: [],
            error: d,
          }));
      }
      function ns(h) {
        return (
          1e3 * Math.ceil(Math.max(0.9 * h.bitrate, h.averageBitrate) / 1e3) ||
          1
        );
      }
      let Gi = ['NONE', 'TYPE-0', 'TYPE-1', null],
        ei = ['SDR', 'PQ', 'HLG'];
      var ii = { No: '', Yes: 'YES', v2: 'v2' };
      function ls(h) {
        let { canSkipUntil: t, canSkipDateRanges: e, age: i } = h;
        return t && i < t / 2 ? (e ? ii.v2 : ii.Yes) : ii.No;
      }
      class os {
        constructor(t, e, i) {
          (this.msn = void 0),
            (this.part = void 0),
            (this.skip = void 0),
            (this.msn = t),
            (this.part = e),
            (this.skip = i);
        }
        addDirectives(t) {
          let e = new F.URL(t);
          return (
            this.msn !== void 0 &&
              e.searchParams.set('_HLS_msn', this.msn.toString()),
            this.part !== void 0 &&
              e.searchParams.set('_HLS_part', this.part.toString()),
            this.skip && e.searchParams.set('_HLS_skip', this.skip),
            e.href
          );
        }
      }
      class Me {
        constructor(t) {
          if (
            ((this._attrs = void 0),
            (this.audioCodec = void 0),
            (this.bitrate = void 0),
            (this.codecSet = void 0),
            (this.url = void 0),
            (this.frameRate = void 0),
            (this.height = void 0),
            (this.id = void 0),
            (this.name = void 0),
            (this.supplemental = void 0),
            (this.videoCodec = void 0),
            (this.width = void 0),
            (this.details = void 0),
            (this.fragmentError = 0),
            (this.loadError = 0),
            (this.loaded = void 0),
            (this.realBitrate = 0),
            (this.supportedPromise = void 0),
            (this.supportedResult = void 0),
            (this._avgBitrate = 0),
            (this._audioGroups = void 0),
            (this._subtitleGroups = void 0),
            (this._urlId = 0),
            (this.url = [t.url]),
            (this._attrs = [t.attrs]),
            (this.bitrate = t.bitrate),
            t.details && (this.details = t.details),
            (this.id = t.id || 0),
            (this.name = t.name),
            (this.width = t.width || 0),
            (this.height = t.height || 0),
            (this.frameRate = t.attrs.optionalFloat('FRAME-RATE', 0)),
            (this._avgBitrate = t.attrs.decimalInteger('AVERAGE-BANDWIDTH')),
            (this.audioCodec = t.audioCodec),
            (this.videoCodec = t.videoCodec),
            (this.codecSet = [t.videoCodec, t.audioCodec]
              .filter((i) => !!i)
              .map((i) => i.substring(0, 4))
              .join(',')),
            'supplemental' in t)
          ) {
            var e;
            this.supplemental = t.supplemental;
            let i = (e = t.supplemental) == null ? void 0 : e.videoCodec;
            i &&
              i !== t.videoCodec &&
              (this.codecSet += `,${i.substring(0, 4)}`);
          }
          this.addGroupId('audio', t.attrs.AUDIO),
            this.addGroupId('text', t.attrs.SUBTITLES);
        }
        get maxBitrate() {
          return Math.max(this.realBitrate, this.bitrate);
        }
        get averageBitrate() {
          return this._avgBitrate || this.realBitrate || this.bitrate;
        }
        get attrs() {
          return this._attrs[0];
        }
        get codecs() {
          return this.attrs.CODECS || '';
        }
        get pathwayId() {
          return this.attrs['PATHWAY-ID'] || '.';
        }
        get videoRange() {
          return this.attrs['VIDEO-RANGE'] || 'SDR';
        }
        get score() {
          return this.attrs.optionalFloat('SCORE', 0);
        }
        get uri() {
          return this.url[0] || '';
        }
        hasAudioGroup(t) {
          return hs(this._audioGroups, t);
        }
        hasSubtitleGroup(t) {
          return hs(this._subtitleGroups, t);
        }
        get audioGroups() {
          return this._audioGroups;
        }
        get subtitleGroups() {
          return this._subtitleGroups;
        }
        addGroupId(t, e) {
          if (e) {
            if (t === 'audio') {
              let i = this._audioGroups;
              i || (i = this._audioGroups = []),
                i.indexOf(e) === -1 && i.push(e);
            } else if (t === 'text') {
              let i = this._subtitleGroups;
              i || (i = this._subtitleGroups = []),
                i.indexOf(e) === -1 && i.push(e);
            }
          }
        }
        get urlId() {
          return 0;
        }
        set urlId(t) {}
        get audioGroupIds() {
          return this.audioGroups ? [this.audioGroupId] : void 0;
        }
        get textGroupIds() {
          return this.subtitleGroups ? [this.textGroupId] : void 0;
        }
        get audioGroupId() {
          var t;
          return (t = this.audioGroups) == null ? void 0 : t[0];
        }
        get textGroupId() {
          var t;
          return (t = this.subtitleGroups) == null ? void 0 : t[0];
        }
        addFallback() {}
      }
      function hs(h, t) {
        return !!t && !!h && h.indexOf(t) !== -1;
      }
      let Sn = (h) => {
          let t = new WeakSet();
          return (e, i) => {
            if ((h && (i = h(e, i)), typeof i == 'object' && i !== null)) {
              if (t.has(i)) return;
              t.add(i);
            }
            return i;
          };
        },
        yt = (h, t) => JSON.stringify(h, Sn(t));
      function Zt(h, t) {
        nt.log(`[abr] start candidates with "${h}" ignored because ${t}`);
      }
      function ds(h) {
        return h.reduce(
          (t, e) => {
            let i = t.groups[e.groupId];
            i ||
              (i = t.groups[e.groupId] =
                {
                  tracks: [],
                  channels: { 2: 0 },
                  hasDefault: !1,
                  hasAutoSelect: !1,
                }),
              i.tracks.push(e);
            let r = e.channels || '2';
            return (
              (i.channels[r] = (i.channels[r] || 0) + 1),
              (i.hasDefault = i.hasDefault || e.default),
              (i.hasAutoSelect = i.hasAutoSelect || e.autoselect),
              i.hasDefault && (t.hasDefaultAudio = !0),
              i.hasAutoSelect && (t.hasAutoSelectAudio = !0),
              t
            );
          },
          { hasDefaultAudio: !1, hasAutoSelectAudio: !1, groups: {} }
        );
      }
      function us(h) {
        if (!h) return h;
        let {
          lang: t,
          assocLang: e,
          characteristics: i,
          channels: r,
          audioCodec: s,
        } = h;
        return {
          lang: t,
          assocLang: e,
          characteristics: i,
          channels: r,
          audioCodec: s,
        };
      }
      function Jt(h, t, e) {
        if ('attrs' in h) {
          let i = t.indexOf(h);
          if (i !== -1) return i;
        }
        for (let i = 0; i < t.length; i++) if (ge(h, t[i], e)) return i;
        return -1;
      }
      function ge(h, t, e) {
        let { groupId: i, name: r, lang: s, assocLang: a, default: n } = h,
          l = h.forced;
        return (
          (i === void 0 || t.groupId === i) &&
          (r === void 0 || t.name === r) &&
          (s === void 0 ||
            (function (o, d = '--') {
              return o.length === d.length
                ? o === d
                : o.startsWith(d) || d.startsWith(o);
            })(s, t.lang)) &&
          (s === void 0 || t.assocLang === a) &&
          (n === void 0 || t.default === n) &&
          (l === void 0 || t.forced === l) &&
          (!('characteristics' in h) ||
            (function (o, d = '') {
              let u = o.split(','),
                c = d.split(',');
              return (
                u.length === c.length && !u.some((f) => c.indexOf(f) === -1)
              );
            })(h.characteristics || '', t.characteristics)) &&
          (e === void 0 || e(h, t))
        );
      }
      function me(h, t) {
        let { audioCodec: e, channels: i } = h;
        return (
          (e === void 0 ||
            (t.audioCodec || '').substring(0, 4) === e.substring(0, 4)) &&
          (i === void 0 || i === (t.channels || '2'))
        );
      }
      function cs(h, t, e) {
        for (let i = t; i > -1; i--) if (e(h[i])) return i;
        for (let i = t + 1; i < h.length; i++) if (e(h[i])) return i;
        return -1;
      }
      function ri(h, t) {
        var e;
        return !!h && h !== ((e = t.loadLevelObj) == null ? void 0 : e.uri);
      }
      class An extends it {
        constructor(t) {
          super('abr', t.logger),
            (this.hls = void 0),
            (this.lastLevelLoadSec = 0),
            (this.lastLoadedFragLevel = -1),
            (this.firstSelection = -1),
            (this._nextAutoLevel = -1),
            (this.nextAutoLevelKey = ''),
            (this.audioTracksByGroup = null),
            (this.codecTiers = null),
            (this.timer = -1),
            (this.fragCurrent = null),
            (this.partCurrent = null),
            (this.bitrateTestDelay = 0),
            (this.rebufferNotice = -1),
            (this.supportedCache = {}),
            (this.bwEstimator = void 0),
            (this._abandonRulesCheck = (e) => {
              var i;
              let r,
                { fragCurrent: s, partCurrent: a, hls: n } = this,
                { autoLevelEnabled: l, media: o } = n;
              if (!s || !o) return;
              let d = performance.now(),
                u = a ? a.stats : s.stats,
                c = a ? a.duration : s.duration,
                f = d - u.loading.start,
                g = n.minAutoLevel,
                E = s.level,
                m = this._nextAutoLevel;
              if (u.aborted || (u.loaded && u.loaded === u.total) || E <= g) {
                this.clearTimer(), (this._nextAutoLevel = -1);
                return;
              }
              if (!l) return;
              let y = m > -1 && m !== E,
                S = !!e || y;
              if (!S && (o.paused || !o.playbackRate || !o.readyState)) return;
              let T = n.mainForwardBufferInfo;
              if (!S && T === null) return;
              let A = this.bwEstimator.getEstimateTTFB(),
                R = Math.abs(o.playbackRate);
              if (f <= Math.max(A, (c / (2 * R)) * 1e3)) return;
              let I = T ? T.len / R : 0,
                v = u.loading.first ? u.loading.first - u.loading.start : -1,
                _ = u.loaded && v > -1,
                L = this.getBwEstimate(),
                C = n.levels,
                M = C[E],
                G = Math.max(
                  u.loaded,
                  Math.round((c * (s.bitrate || M.averageBitrate)) / 8)
                ),
                k = _ ? f - v : f;
              k < 1 && _ && (k = Math.min(f, (8 * u.loaded) / L));
              let P = _ ? (1e3 * u.loaded) / k : 0,
                x = A / 1e3,
                U = P ? (G - u.loaded) / P : (8 * G) / L + x;
              if (U <= I) return;
              let $ = P ? 8 * P : L,
                B =
                  ((i = e?.details || this.hls.latestLevelDetails) == null
                    ? void 0
                    : i.live) === !0,
                O = this.hls.config.abrBandWidthUpFactor,
                w = Number.POSITIVE_INFINITY;
              for (r = E - 1; r > g; r--) {
                let V = C[r].maxBitrate,
                  K = !C[r].details || B;
                if (
                  (w = this.getTimeToLoadFrag(x, $, c * V, K)) <
                  Math.min(I, c + x)
                )
                  break;
              }
              if (w >= U || w > 10 * c) return;
              _
                ? this.bwEstimator.sample(f - Math.min(A, v), u.loaded)
                : this.bwEstimator.sampleTTFB(f);
              let q = C[r].maxBitrate;
              this.getBwEstimate() * O > q && this.resetEstimator(q);
              let Z = this.findBestLevel(q, g, r, 0, I, 1, 1);
              Z > -1 && (r = Z),
                this.warn(`Fragment ${s.sn}${
                  a ? ' part ' + a.index : ''
                } of level ${E} is loading too slowly;
      Fragment duration: ${s.duration.toFixed(3)}
      Time to underbuffer: ${I.toFixed(3)} s
      Estimated load time for current fragment: ${U.toFixed(3)} s
      Estimated load time for down switch fragment: ${w.toFixed(3)} s
      TTFB estimate: ${0 | v} ms
      Current BW estimate: ${Y(L) ? 0 | L : 'Unknown'} bps
      New BW estimate: ${0 | this.getBwEstimate()} bps
      Switching to level ${r} @ ${0 | q} bps`),
                (n.nextLoadLevel = n.nextAutoLevel = r),
                this.clearTimer();
              let X = () => {
                if (
                  (this.clearTimer(),
                  this.fragCurrent === s && this.hls.loadLevel === r && r > 0)
                ) {
                  let V = this.getStarvationDelay();
                  if (
                    (this.warn(`Aborting inflight request ${
                      r > 0 ? 'and switching down' : ''
                    }
      Fragment duration: ${s.duration.toFixed(3)} s
      Time to underbuffer: ${V.toFixed(3)} s`),
                    s.abortRequests(),
                    (this.fragCurrent = this.partCurrent = null),
                    r > g)
                  ) {
                    let K = this.findBestLevel(
                      this.hls.levels[g].bitrate,
                      g,
                      r,
                      0,
                      V,
                      1,
                      1
                    );
                    K === -1 && (K = g),
                      (this.hls.nextLoadLevel = this.hls.nextAutoLevel = K),
                      this.resetEstimator(this.hls.levels[K].bitrate);
                  }
                }
              };
              y || U > 2 * w ? X() : (this.timer = F.setInterval(X, 1e3 * w)),
                n.trigger(p.FRAG_LOAD_EMERGENCY_ABORTED, {
                  frag: s,
                  part: a,
                  stats: u,
                });
            }),
            (this.hls = t),
            (this.bwEstimator = this.initEstimator()),
            this.registerListeners();
        }
        resetEstimator(t) {
          t &&
            (this.log(`setting initial bwe to ${t}`),
            (this.hls.config.abrEwmaDefaultEstimate = t)),
            (this.firstSelection = -1),
            (this.bwEstimator = this.initEstimator());
        }
        initEstimator() {
          let t = this.hls.config;
          return new Tt(
            t.abrEwmaSlowVoD,
            t.abrEwmaFastVoD,
            t.abrEwmaDefaultEstimate
          );
        }
        registerListeners() {
          let { hls: t } = this;
          t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.FRAG_LOADING, this.onFragLoading, this),
            t.on(p.FRAG_LOADED, this.onFragLoaded, this),
            t.on(p.FRAG_BUFFERED, this.onFragBuffered, this),
            t.on(p.LEVEL_SWITCHING, this.onLevelSwitching, this),
            t.on(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.on(p.MAX_AUTO_LEVEL_UPDATED, this.onMaxAutoLevelUpdated, this),
            t.on(p.ERROR, this.onError, this);
        }
        unregisterListeners() {
          let { hls: t } = this;
          t &&
            (t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.FRAG_LOADING, this.onFragLoading, this),
            t.off(p.FRAG_LOADED, this.onFragLoaded, this),
            t.off(p.FRAG_BUFFERED, this.onFragBuffered, this),
            t.off(p.LEVEL_SWITCHING, this.onLevelSwitching, this),
            t.off(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.off(p.MAX_AUTO_LEVEL_UPDATED, this.onMaxAutoLevelUpdated, this),
            t.off(p.ERROR, this.onError, this));
        }
        destroy() {
          this.unregisterListeners(),
            this.clearTimer(),
            (this.hls = this._abandonRulesCheck = this.supportedCache = null),
            (this.fragCurrent = this.partCurrent = null);
        }
        onManifestLoading(t, e) {
          (this.lastLoadedFragLevel = -1),
            (this.firstSelection = -1),
            (this.lastLevelLoadSec = 0),
            (this.supportedCache = {}),
            (this.fragCurrent = this.partCurrent = null),
            this.onLevelsUpdated(),
            this.clearTimer();
        }
        onLevelsUpdated() {
          this.lastLoadedFragLevel > -1 &&
            this.fragCurrent &&
            (this.lastLoadedFragLevel = this.fragCurrent.level),
            (this._nextAutoLevel = -1),
            this.onMaxAutoLevelUpdated(),
            (this.codecTiers = null),
            (this.audioTracksByGroup = null);
        }
        onMaxAutoLevelUpdated() {
          (this.firstSelection = -1), (this.nextAutoLevelKey = '');
        }
        onFragLoading(t, e) {
          let i = e.frag;
          if (!this.ignoreFragment(i)) {
            if (!i.bitrateTest) {
              var r;
              (this.fragCurrent = i),
                (this.partCurrent = (r = e.part) != null ? r : null);
            }
            this.clearTimer(),
              (this.timer = F.setInterval(this._abandonRulesCheck, 100));
          }
        }
        onLevelSwitching(t, e) {
          this.clearTimer();
        }
        onError(t, e) {
          if (!e.fatal)
            switch (e.details) {
              case b.BUFFER_ADD_CODEC_ERROR:
              case b.BUFFER_APPEND_ERROR:
                (this.lastLoadedFragLevel = -1), (this.firstSelection = -1);
                break;
              case b.FRAG_LOAD_TIMEOUT: {
                let i = e.frag,
                  { fragCurrent: r, partCurrent: s } = this;
                if (i && r && i.sn === r.sn && i.level === r.level) {
                  let a = performance.now(),
                    n = s ? s.stats : i.stats,
                    l = a - n.loading.start,
                    o = n.loading.first
                      ? n.loading.first - n.loading.start
                      : -1;
                  if (n.loaded && o > -1) {
                    let d = this.bwEstimator.getEstimateTTFB();
                    this.bwEstimator.sample(l - Math.min(d, o), n.loaded);
                  } else this.bwEstimator.sampleTTFB(l);
                }
              }
            }
        }
        getTimeToLoadFrag(t, e, i, r) {
          let s = r ? t + this.lastLevelLoadSec : 0;
          return t + i / e + s;
        }
        onLevelLoaded(t, e) {
          let i = this.hls.config,
            { loading: r } = e.stats,
            s = r.end - r.first;
          Y(s) && (this.lastLevelLoadSec = s / 1e3),
            e.details.live
              ? this.bwEstimator.update(i.abrEwmaSlowLive, i.abrEwmaFastLive)
              : this.bwEstimator.update(i.abrEwmaSlowVoD, i.abrEwmaFastVoD),
            this.timer > -1 && this._abandonRulesCheck(e.levelInfo);
        }
        onFragLoaded(t, { frag: e, part: i }) {
          let r = i ? i.stats : e.stats;
          if (
            (e.type === j.MAIN &&
              this.bwEstimator.sampleTTFB(r.loading.first - r.loading.start),
            !this.ignoreFragment(e))
          ) {
            if (
              (this.clearTimer(),
              e.level === this._nextAutoLevel && (this._nextAutoLevel = -1),
              (this.firstSelection = -1),
              this.hls.config.abrMaxWithRealBitrate)
            ) {
              let s = i ? i.duration : e.duration,
                a = this.hls.levels[e.level],
                n = (a.loaded ? a.loaded.bytes : 0) + r.loaded,
                l = (a.loaded ? a.loaded.duration : 0) + s;
              (a.loaded = { bytes: n, duration: l }),
                (a.realBitrate = Math.round((8 * n) / l));
            }
            if (e.bitrateTest) {
              let s = { stats: r, frag: e, part: i, id: e.type };
              this.onFragBuffered(p.FRAG_BUFFERED, s), (e.bitrateTest = !1);
            } else this.lastLoadedFragLevel = e.level;
          }
        }
        onFragBuffered(t, e) {
          let { frag: i, part: r } = e,
            s = r != null && r.stats.loaded ? r.stats : i.stats;
          if (s.aborted || this.ignoreFragment(i)) return;
          let a =
            s.parsing.end -
            s.loading.start -
            Math.min(
              s.loading.first - s.loading.start,
              this.bwEstimator.getEstimateTTFB()
            );
          this.bwEstimator.sample(a, s.loaded),
            (s.bwEstimate = this.getBwEstimate()),
            i.bitrateTest
              ? (this.bitrateTestDelay = a / 1e3)
              : (this.bitrateTestDelay = 0);
        }
        ignoreFragment(t) {
          return t.type !== j.MAIN || t.sn === 'initSegment';
        }
        clearTimer() {
          this.timer > -1 && (F.clearInterval(this.timer), (this.timer = -1));
        }
        get firstAutoLevel() {
          let { maxAutoLevel: t, minAutoLevel: e } = this.hls,
            i = this.getBwEstimate(),
            r = this.hls.config.maxStarvationDelay,
            s = this.findBestLevel(i, e, t, 0, r, 1, 1);
          if (s > -1) return s;
          let a = this.hls.firstLevel,
            n = Math.min(Math.max(a, e), t);
          return (
            this.warn(
              `Could not find best starting auto level. Defaulting to first in playlist ${a} clamped to ${n}`
            ),
            n
          );
        }
        get forcedAutoLevel() {
          return this.nextAutoLevelKey ? -1 : this._nextAutoLevel;
        }
        get nextAutoLevel() {
          let t = this.forcedAutoLevel,
            e = this.bwEstimator.canEstimate(),
            i = this.lastLoadedFragLevel > -1;
          if (
            t !== -1 &&
            (!e || !i || this.nextAutoLevelKey === this.getAutoLevelKey())
          )
            return t;
          let r = e && i ? this.getNextABRAutoLevel() : this.firstAutoLevel;
          if (t !== -1) {
            let s = this.hls.levels;
            if (s.length > Math.max(t, r) && s[t].loadError <= s[r].loadError)
              return t;
          }
          return (
            (this._nextAutoLevel = r),
            (this.nextAutoLevelKey = this.getAutoLevelKey()),
            r
          );
        }
        getAutoLevelKey() {
          return `${this.getBwEstimate()}_${this.getStarvationDelay().toFixed(
            2
          )}`;
        }
        getNextABRAutoLevel() {
          let { fragCurrent: t, partCurrent: e, hls: i } = this;
          if (i.levels.length <= 1) return i.loadLevel;
          let { maxAutoLevel: r, config: s, minAutoLevel: a } = i,
            n = e ? e.duration : t ? t.duration : 0,
            l = this.getBwEstimate(),
            o = this.getStarvationDelay(),
            d = s.abrBandWidthFactor,
            u = s.abrBandWidthUpFactor;
          if (o) {
            let m = this.findBestLevel(l, a, r, o, 0, d, u);
            if (m >= 0) return (this.rebufferNotice = -1), m;
          }
          let c = n ? Math.min(n, s.maxStarvationDelay) : s.maxStarvationDelay;
          if (!o) {
            let m = this.bitrateTestDelay;
            m &&
              ((c =
                (n ? Math.min(n, s.maxLoadingDelay) : s.maxLoadingDelay) - m),
              this.info(
                `bitrate test took ${Math.round(
                  1e3 * m
                )}ms, set first fragment max fetchDuration to ${Math.round(
                  1e3 * c
                )} ms`
              ),
              (d = u = 1));
          }
          let f = this.findBestLevel(l, a, r, o, c, d, u);
          if (
            (this.rebufferNotice !== f &&
              ((this.rebufferNotice = f),
              this.info(
                `${
                  o ? 'rebuffering expected' : 'buffer is empty'
                }, optimal quality level ${f}`
              )),
            f > -1)
          )
            return f;
          let g = i.levels[a],
            E = i.loadLevelObj;
          return E && g?.bitrate < E.bitrate ? a : i.loadLevel;
        }
        getStarvationDelay() {
          let t = this.hls,
            e = t.media;
          if (!e) return 1 / 0;
          let i = e && e.playbackRate !== 0 ? Math.abs(e.playbackRate) : 1,
            r = t.mainForwardBufferInfo;
          return (r ? r.len : 0) / i;
        }
        getBwEstimate() {
          return this.bwEstimator.canEstimate()
            ? this.bwEstimator.getEstimate()
            : this.hls.config.abrEwmaDefaultEstimate;
        }
        findBestLevel(t, e, i, r, s, a, n) {
          var l, o;
          let d,
            u = r + s,
            c = this.lastLoadedFragLevel,
            f = c === -1 ? this.hls.firstLevel : c,
            { fragCurrent: g, partCurrent: E } = this,
            {
              levels: m,
              allAudioTracks: y,
              loadLevel: S,
              config: T,
            } = this.hls;
          if (m.length === 1) return 0;
          let A = m[f],
            R = !!((l = this.hls.latestLevelDetails) != null && l.live),
            I = S === -1 || c === -1,
            v = 'SDR',
            _ = A?.frameRate || 0,
            { audioPreference: L, videoPreference: C } = T,
            M = this.audioTracksByGroup || (this.audioTracksByGroup = ds(y)),
            G = -1;
          if (I) {
            if (this.firstSelection !== -1) return this.firstSelection;
            let U = (function (X, V, K, z, W) {
                let dt = Object.keys(X),
                  gt = z?.channels,
                  H = z?.audioCodec,
                  ut = W?.videoCodec,
                  ct = gt && parseInt(gt) === 2,
                  vt = !1,
                  pt = !1,
                  Et = 1 / 0,
                  It = 1 / 0,
                  et = 1 / 0,
                  Gt = 1 / 0,
                  Ht = 0,
                  Yt = [],
                  { preferHDR: Gr, allowedVideoRanges: Ye } = (function (
                    ht,
                    ft
                  ) {
                    let Rt = !1,
                      ce = [];
                    if ((ht && ((Rt = ht !== 'SDR'), (ce = [ht])), ft)) {
                      let to =
                        (ce = ft.allowedVideoRanges || ei.slice(0)).join('') !==
                          'SDR' && !ft.videoCodec;
                      (Rt =
                        ft.preferHDR !== void 0
                          ? ft.preferHDR
                          : to &&
                            (function () {
                              if (typeof matchMedia == 'function') {
                                let mn = matchMedia('(dynamic-range: high)'),
                                  eo = matchMedia('bad query');
                                if (mn.media !== eo.media)
                                  return mn.matches === !0;
                              }
                              return !1;
                            })()) || (ce = ['SDR']);
                    }
                    return { preferHDR: Rt, allowedVideoRanges: ce };
                  })(V, W);
                for (let ht = dt.length; ht--; ) {
                  let ft = X[dt[ht]];
                  vt || (vt = ft.channels[2] > 0),
                    (Et = Math.min(Et, ft.minHeight)),
                    (It = Math.min(It, ft.minFramerate)),
                    (et = Math.min(et, ft.minBitrate)),
                    Ye.filter((Rt) => ft.videoRanges[Rt] > 0).length > 0 &&
                      (pt = !0);
                }
                (Et = Y(Et) ? Et : 0), (It = Y(It) ? It : 0);
                let We = Math.max(1080, Et),
                  Pi = Math.max(30, It);
                (K = Math.max((et = Y(et) ? et : K), K)), pt || (V = void 0);
                let _i = dt.length > 1;
                return {
                  codecSet: dt.reduce((ht, ft) => {
                    let Rt = X[ft];
                    if (ft === ht) return ht;
                    if (
                      ((Yt = pt
                        ? Ye.filter((ce) => Rt.videoRanges[ce] > 0)
                        : []),
                      _i)
                    ) {
                      if (Rt.minBitrate > K)
                        return (
                          Zt(
                            ft,
                            `min bitrate of ${Rt.minBitrate} > current estimate of ${K}`
                          ),
                          ht
                        );
                      if (!Rt.hasDefaultAudio)
                        return (
                          Zt(
                            ft,
                            'no renditions with default or auto-select sound found'
                          ),
                          ht
                        );
                      if (H && ft.indexOf(H.substring(0, 4)) % 5 != 0)
                        return (
                          Zt(ft, `audio codec preference "${H}" not found`), ht
                        );
                      if (gt && !ct) {
                        if (!Rt.channels[gt])
                          return (
                            Zt(
                              ft,
                              `no renditions with ${gt} channel sound found (channels options: ${Object.keys(
                                Rt.channels
                              )})`
                            ),
                            ht
                          );
                      } else if ((!H || ct) && vt && Rt.channels[2] === 0)
                        return (
                          Zt(ft, 'no renditions with stereo sound found'), ht
                        );
                      if (Rt.minHeight > We)
                        return (
                          Zt(
                            ft,
                            `min resolution of ${Rt.minHeight} > maximum of ${We}`
                          ),
                          ht
                        );
                      if (Rt.minFramerate > Pi)
                        return (
                          Zt(
                            ft,
                            `min framerate of ${Rt.minFramerate} > maximum of ${Pi}`
                          ),
                          ht
                        );
                      if (!Yt.some((ce) => Rt.videoRanges[ce] > 0))
                        return (
                          Zt(
                            ft,
                            `no variants with VIDEO-RANGE of ${yt(Yt)} found`
                          ),
                          ht
                        );
                      if (ut && ft.indexOf(ut.substring(0, 4)) % 5 != 0)
                        return (
                          Zt(ft, `video codec preference "${ut}" not found`), ht
                        );
                      if (Rt.maxScore < Ht)
                        return (
                          Zt(
                            ft,
                            `max score of ${Rt.maxScore} < selected max of ${Ht}`
                          ),
                          ht
                        );
                    }
                    return ht &&
                      (Ze(ft) >= Ze(ht) ||
                        Rt.fragmentError > X[ht].fragmentError)
                      ? ht
                      : ((Gt = Rt.minIndex), (Ht = Rt.maxScore), ft);
                  }, void 0),
                  videoRanges: Yt,
                  preferHDR: Gr,
                  minFramerate: It,
                  minBitrate: et,
                  minIndex: Gt,
                };
              })(
                this.codecTiers ||
                  (this.codecTiers = m.slice(e, i + 1).reduce((X, V, K) => {
                    if (!V.codecSet) return X;
                    let z = V.audioGroups,
                      W = X[V.codecSet];
                    W ||
                      (X[V.codecSet] = W =
                        {
                          minBitrate: 1 / 0,
                          minHeight: 1 / 0,
                          minFramerate: 1 / 0,
                          minIndex: K,
                          maxScore: 0,
                          videoRanges: { SDR: 0 },
                          channels: { 2: 0 },
                          hasDefaultAudio: !z,
                          fragmentError: 0,
                        }),
                      (W.minBitrate = Math.min(W.minBitrate, V.bitrate));
                    let dt = Math.min(V.height, V.width);
                    return (
                      (W.minHeight = Math.min(W.minHeight, dt)),
                      (W.minFramerate = Math.min(W.minFramerate, V.frameRate)),
                      (W.minIndex = Math.min(W.minIndex, K)),
                      (W.maxScore = Math.max(W.maxScore, V.score)),
                      (W.fragmentError += V.fragmentError),
                      (W.videoRanges[V.videoRange] =
                        (W.videoRanges[V.videoRange] || 0) + 1),
                      z &&
                        z.forEach((gt) => {
                          if (!gt) return;
                          let H = M.groups[gt];
                          H &&
                            ((W.hasDefaultAudio =
                              W.hasDefaultAudio || M.hasDefaultAudio
                                ? H.hasDefault
                                : H.hasAutoSelect ||
                                  (!M.hasDefaultAudio &&
                                    !M.hasAutoSelectAudio)),
                            Object.keys(H.channels).forEach((ut) => {
                              W.channels[ut] =
                                (W.channels[ut] || 0) + H.channels[ut];
                            }));
                        }),
                      X
                    );
                  }, {})),
                v,
                t,
                L,
                C
              ),
              {
                codecSet: $,
                videoRanges: B,
                minFramerate: O,
                minBitrate: w,
                minIndex: q,
                preferHDR: Z,
              } = U;
            (G = q),
              (d = $),
              (v = Z ? B[B.length - 1] : B[0]),
              (_ = O),
              (t = Math.max(t, w)),
              this.log(`picked start tier ${yt(U)}`);
          } else (d = A?.codecSet), (v = A?.videoRange);
          let k = E ? E.duration : g ? g.duration : 0,
            P = this.bwEstimator.getEstimateTTFB() / 1e3,
            x = [];
          for (let U = i; U >= e; U--) {
            let $,
              B = m[U],
              O = U > f;
            if (!B) continue;
            if (
              T.useMediaCapabilities &&
              !B.supportedResult &&
              !B.supportedPromise
            ) {
              let V = navigator.mediaCapabilities;
              typeof V?.decodingInfo == 'function' &&
              (function (K, z, W, dt, gt, H) {
                let ut = K.videoCodec,
                  ct = K.audioCodec ? K.audioGroups : null,
                  vt = H?.audioCodec,
                  pt = H?.channels,
                  Et = pt ? parseInt(pt) : vt ? 1 / 0 : 2,
                  It = null;
                if (ct != null && ct.length)
                  try {
                    It =
                      ct.length === 1 && ct[0]
                        ? z.groups[ct[0]].channels
                        : ct.reduce(
                            (et, Gt) => {
                              if (Gt) {
                                let Ht = z.groups[Gt];
                                if (!Ht)
                                  throw Error(
                                    `Audio track group ${Gt} not found`
                                  );
                                Object.keys(Ht.channels).forEach((Yt) => {
                                  et[Yt] = (et[Yt] || 0) + Ht.channels[Yt];
                                });
                              }
                              return et;
                            },
                            { 2: 0 }
                          );
                  } catch {
                    return !0;
                  }
                return (
                  (ut !== void 0 &&
                    (ut.split(',').some((et) => Qe(et)) ||
                      (K.width > 1920 && K.height > 1088) ||
                      (K.height > 1920 && K.width > 1088) ||
                      K.frameRate > Math.max(dt, 30) ||
                      (K.videoRange !== 'SDR' && K.videoRange !== W) ||
                      K.bitrate > Math.max(gt, 8e6))) ||
                  (!!It &&
                    Y(Et) &&
                    Object.keys(It).some((et) => parseInt(et) > Et))
                );
              })(B, M, v, _, t, L)
                ? ((B.supportedPromise = as(B, M, V, this.supportedCache)),
                  B.supportedPromise
                    .then((K) => {
                      if (!this.hls) return;
                      B.supportedResult = K;
                      let z = this.hls.levels,
                        W = z.indexOf(B);
                      K.error
                        ? this.warn(
                            `MediaCapabilities decodingInfo error: "${
                              K.error
                            }" for level ${W} ${yt(K)}`
                          )
                        : K.supported
                        ? K.decodingInfoResults.some(
                            (dt) => dt.smooth === !1 || dt.powerEfficient === !1
                          ) &&
                          this.log(
                            `MediaCapabilities decodingInfo for level ${W} not smooth or powerEfficient: ${yt(
                              K
                            )}`
                          )
                        : (this.warn(
                            `Unsupported MediaCapabilities decodingInfo result for level ${W} ${yt(
                              K
                            )}`
                          ),
                          W > -1 &&
                            z.length > 1 &&
                            (this.log(`Removing unsupported level ${W}`),
                            this.hls.removeLevel(W),
                            this.hls.loadLevel === -1 &&
                              (this.hls.nextLoadLevel = 0)));
                    })
                    .catch((K) => {
                      this.warn(
                        `Error handling MediaCapabilities decodingInfo: ${K}`
                      );
                    }))
                : (B.supportedResult = rs);
            }
            if (
              ((d && B.codecSet !== d) ||
                (v && B.videoRange !== v) ||
                (O && _ > B.frameRate) ||
                (!O && _ > 0 && _ < B.frameRate) ||
                ((o = B.supportedResult) != null &&
                  (o = o.decodingInfoResults) != null &&
                  o.some((V) => V.smooth === !1))) &&
              (!I || U !== G)
            ) {
              x.push(U);
              continue;
            }
            let w = B.details,
              q = (E ? w?.partTarget : w?.averagetargetduration) || k;
            $ = O ? n * t : a * t;
            let Z =
                k && r >= 2 * k && s === 0 ? B.averageBitrate : B.maxBitrate,
              X = this.getTimeToLoadFrag(P, $, Z * q, w === void 0);
            if (
              $ >= Z &&
              (U === c || (B.loadError === 0 && B.fragmentError === 0)) &&
              (X <= P || !Y(X) || (R && !this.bitrateTestDelay) || X < u)
            ) {
              let V = this.forcedAutoLevel;
              return (
                U !== S &&
                  (V === -1 || V !== S) &&
                  (x.length &&
                    this.trace(
                      `Skipped level(s) ${x.join(
                        ','
                      )} of ${i} max with CODECS and VIDEO-RANGE:"${
                        m[x[0]].codecs
                      }" ${m[x[0]].videoRange}; not compatible with "${d}" ${v}`
                    ),
                  this.info(
                    `switch candidate:${f}->${U} adjustedbw(${Math.round(
                      $
                    )})-bitrate=${Math.round($ - Z)} ttfb:${P.toFixed(
                      1
                    )} avgDuration:${q.toFixed(1)} maxFetchDuration:${u.toFixed(
                      1
                    )} fetchDuration:${X.toFixed(
                      1
                    )} firstSelection:${I} codecSet:${B.codecSet} videoRange:${
                      B.videoRange
                    } hls.loadLevel:${S}`
                  )),
                I && (this.firstSelection = U),
                U
              );
            }
          }
          return -1;
        }
        set nextAutoLevel(t) {
          let e = this.deriveNextAutoLevel(t);
          this._nextAutoLevel !== e &&
            ((this.nextAutoLevelKey = ''), (this._nextAutoLevel = e));
        }
        deriveNextAutoLevel(t) {
          let { maxAutoLevel: e, minAutoLevel: i } = this.hls;
          return Math.min(Math.max(t, i), e);
        }
      }
      let fs = {
        search: function (h, t) {
          let e = 0,
            i = h.length - 1,
            r = null,
            s = null;
          for (; e <= i; ) {
            let a = t((s = h[(r = ((e + i) / 2) | 0)]));
            if (a > 0) e = r + 1;
            else {
              if (!(a < 0)) return s;
              i = r - 1;
            }
          }
          return null;
        },
      };
      function pe(h, t, e = 0, i = 0, r = 0.005) {
        let s = null;
        if (h) {
          s = t[1 + h.sn - t[0].sn] || null;
          let n = h.endDTS - e;
          n > 0 && n < 15e-7 && (e += 15e-7),
            s &&
              h.level !== s.level &&
              s.end <= h.end &&
              (s = t[2 + h.sn - t[0].sn] || null);
        } else e === 0 && t[0].start === 0 && (s = t[0]);
        if (
          s &&
          (((!h || h.level === s.level) && gs(e, i, s) === 0) ||
            (function (n, l, o) {
              if (
                l &&
                l.start === 0 &&
                l.level < n.level &&
                (l.endPTS || 0) > 0
              ) {
                let d = l.tagList.reduce(
                  (u, c) => (c[0] === 'INF' && (u += parseFloat(c[1])), u),
                  o
                );
                return n.start <= d;
              }
              return !1;
            })(s, h, Math.min(r, i)))
        )
          return s;
        let a = fs.search(t, gs.bind(null, e, i));
        return a && (a !== h || !s) ? a : s;
      }
      function gs(h = 0, t = 0, e) {
        if (e.start <= h && e.start + e.duration > h) return 0;
        let i = Math.min(t, e.duration + (e.deltaPTS ? e.deltaPTS : 0));
        return e.start + e.duration - i <= h
          ? 1
          : e.start - i > h && e.start
          ? -1
          : 0;
      }
      function ms(h, t, e) {
        if (h && h.startCC <= t && h.endCC >= t) {
          let i,
            r = h.fragments,
            { fragmentHint: s } = h;
          return (
            s && (r = r.concat(s)),
            fs.search(r, (a) =>
              a.cc < t
                ? 1
                : a.cc > t
                ? -1
                : ((i = a), a.end <= e ? 1 : a.start > e ? -1 : 0)
            ),
            i || null
          );
        }
        return null;
      }
      function si(h) {
        switch (h.details) {
          case b.FRAG_LOAD_TIMEOUT:
          case b.KEY_LOAD_TIMEOUT:
          case b.LEVEL_LOAD_TIMEOUT:
          case b.MANIFEST_LOAD_TIMEOUT:
            return !0;
        }
        return !1;
      }
      function ps(h, t) {
        let e = si(t);
        return h.default[`${e ? 'timeout' : 'error'}Retry`];
      }
      function Ki(h, t) {
        return Math.min(
          (h.backoff === 'linear' ? 1 : Math.pow(2, t)) * h.retryDelayMs,
          h.maxRetryDelayMs
        );
      }
      function Es(h) {
        return J(J({}, h), { errorRetry: null, timeoutRetry: null });
      }
      function ai(h, t, e, i) {
        if (!h) return !1;
        let r = i?.code,
          s =
            t < h.maxNumRetry &&
            (Vi(r) || (!!r && (r < 400 || r > 499)) || !!e);
        return h.shouldRetry ? h.shouldRetry(h, t, e, i, s) : s;
      }
      function Vi(h) {
        return h === 0 && navigator.onLine === !1;
      }
      var Ft = {
          DoNothing: 0,
          SendAlternateToPenaltyBox: 2,
          RemoveAlternatePermanently: 3,
          RetryRequest: 5,
        },
        Kt = {
          None: 0,
          MoveAllAlternatesMatchingHost: 1,
          MoveAllAlternatesMatchingHDCP: 2,
          MoveAllAlternatesMatchingKey: 4,
        };
      class Ln extends it {
        constructor(t) {
          super('error-controller', t.logger),
            (this.hls = void 0),
            (this.playlistError = 0),
            (this.hls = t),
            this.registerListeners();
        }
        registerListeners() {
          let t = this.hls;
          t.on(p.ERROR, this.onError, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.LEVEL_UPDATED, this.onLevelUpdated, this);
        }
        unregisterListeners() {
          let t = this.hls;
          t &&
            (t.off(p.ERROR, this.onError, this),
            t.off(p.ERROR, this.onErrorOut, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.LEVEL_UPDATED, this.onLevelUpdated, this));
        }
        destroy() {
          this.unregisterListeners(), (this.hls = null);
        }
        startLoad(t) {}
        stopLoad() {
          this.playlistError = 0;
        }
        getVariantLevelIndex(t) {
          return t?.type === j.MAIN ? t.level : this.getVariantIndex();
        }
        getVariantIndex() {
          var t;
          let e = this.hls,
            i = e.currentLevel;
          return ((t = e.loadLevelObj) != null && t.details) || i === -1
            ? e.loadLevel
            : i;
        }
        variantHasKey(t, e) {
          if (t) {
            var i;
            if ((i = t.details) != null && i.hasKey(e)) return !0;
            let r = t.audioGroups;
            if (r)
              return this.hls.allAudioTracks
                .filter((s) => r.indexOf(s.groupId) >= 0)
                .some((s) => {
                  var a;
                  return (a = s.details) == null ? void 0 : a.hasKey(e);
                });
          }
          return !1;
        }
        onManifestLoading() {
          this.playlistError = 0;
        }
        onLevelUpdated() {
          this.playlistError = 0;
        }
        onError(t, e) {
          var i, r, s;
          if (e.fatal) return;
          let a = this.hls,
            n = e.context;
          switch (e.details) {
            case b.FRAG_LOAD_ERROR:
            case b.FRAG_LOAD_TIMEOUT:
            case b.KEY_LOAD_ERROR:
            case b.KEY_LOAD_TIMEOUT:
              e.errorAction = this.getFragRetryOrSwitchAction(e);
              return;
            case b.FRAG_PARSING_ERROR:
              if ((i = e.frag) != null && i.gap) {
                e.errorAction = Le();
                return;
              }
            case b.FRAG_GAP:
            case b.FRAG_DECRYPT_ERROR:
              (e.errorAction = this.getFragRetryOrSwitchAction(e)),
                (e.errorAction.action = Ft.SendAlternateToPenaltyBox);
              return;
            case b.LEVEL_EMPTY_ERROR:
            case b.LEVEL_PARSING_ERROR:
              {
                let l = e.parent === j.MAIN ? e.level : a.loadLevel;
                e.details === b.LEVEL_EMPTY_ERROR &&
                (r = e.context) != null &&
                (r = r.levelDetails) != null &&
                r.live
                  ? (e.errorAction = this.getPlaylistRetryOrSwitchAction(e, l))
                  : ((e.levelRetry = !1),
                    (e.errorAction = this.getLevelSwitchAction(e, l)));
              }
              return;
            case b.LEVEL_LOAD_ERROR:
            case b.LEVEL_LOAD_TIMEOUT:
              typeof n?.level == 'number' &&
                (e.errorAction = this.getPlaylistRetryOrSwitchAction(
                  e,
                  n.level
                ));
              return;
            case b.AUDIO_TRACK_LOAD_ERROR:
            case b.AUDIO_TRACK_LOAD_TIMEOUT:
            case b.SUBTITLE_LOAD_ERROR:
            case b.SUBTITLE_TRACK_LOAD_TIMEOUT:
              if (n) {
                let l = a.loadLevelObj;
                l &&
                  ((n.type === lt.AUDIO_TRACK && l.hasAudioGroup(n.groupId)) ||
                    (n.type === lt.SUBTITLE_TRACK &&
                      l.hasSubtitleGroup(n.groupId))) &&
                  ((e.errorAction = this.getPlaylistRetryOrSwitchAction(
                    e,
                    a.loadLevel
                  )),
                  (e.errorAction.action = Ft.SendAlternateToPenaltyBox),
                  (e.errorAction.flags = Kt.MoveAllAlternatesMatchingHost));
              }
              return;
            case b.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED:
              e.errorAction = {
                action: Ft.SendAlternateToPenaltyBox,
                flags: Kt.MoveAllAlternatesMatchingHDCP,
              };
              return;
            case b.KEY_SYSTEM_SESSION_UPDATE_FAILED:
            case b.KEY_SYSTEM_STATUS_INTERNAL_ERROR:
            case b.KEY_SYSTEM_NO_SESSION:
              e.errorAction = {
                action: Ft.SendAlternateToPenaltyBox,
                flags: Kt.MoveAllAlternatesMatchingKey,
              };
              return;
            case b.BUFFER_ADD_CODEC_ERROR:
            case b.REMUX_ALLOC_ERROR:
            case b.BUFFER_APPEND_ERROR:
              e.errorAction ||
                (e.errorAction = this.getLevelSwitchAction(
                  e,
                  (s = e.level) != null ? s : a.loadLevel
                ));
              return;
            case b.INTERNAL_EXCEPTION:
            case b.BUFFER_APPENDING_ERROR:
            case b.BUFFER_FULL_ERROR:
            case b.LEVEL_SWITCH_ERROR:
            case b.BUFFER_STALLED_ERROR:
            case b.BUFFER_SEEK_OVER_HOLE:
            case b.BUFFER_NUDGE_ON_STALL:
              e.errorAction = Le();
              return;
          }
          e.type === Q.KEY_SYSTEM_ERROR &&
            ((e.levelRetry = !1), (e.errorAction = Le()));
        }
        getPlaylistRetryOrSwitchAction(t, e) {
          let i = ps(this.hls.config.playlistLoadPolicy, t),
            r = this.playlistError++;
          if (ai(i, r, si(t), t.response))
            return {
              action: Ft.RetryRequest,
              flags: Kt.None,
              retryConfig: i,
              retryCount: r,
            };
          let s = this.getLevelSwitchAction(t, e);
          return i && ((s.retryConfig = i), (s.retryCount = r)), s;
        }
        getFragRetryOrSwitchAction(t) {
          let e = this.hls,
            i = this.getVariantLevelIndex(t.frag),
            r = e.levels[i],
            { fragLoadPolicy: s, keyLoadPolicy: a } = e.config,
            n = ps(t.details.startsWith('key') ? a : s, t),
            l = e.levels.reduce((d, u) => d + u.fragmentError, 0);
          if (
            r &&
            (t.details !== b.FRAG_GAP && r.fragmentError++,
            ai(n, l, si(t), t.response))
          )
            return {
              action: Ft.RetryRequest,
              flags: Kt.None,
              retryConfig: n,
              retryCount: l,
            };
          let o = this.getLevelSwitchAction(t, i);
          return n && ((o.retryConfig = n), (o.retryCount = l)), o;
        }
        getLevelSwitchAction(t, e) {
          let i = this.hls;
          e == null && (e = i.loadLevel);
          let r = this.hls.levels[e];
          if (r) {
            var s, a, n, l;
            let o = t.details;
            r.loadError++, o === b.BUFFER_APPEND_ERROR && r.fragmentError++;
            let d = -1,
              { levels: u, loadLevel: c, minAutoLevel: f, maxAutoLevel: g } = i;
            i.autoLevelEnabled ||
              i.config.preserveManualLevelOnError ||
              (i.loadLevel = -1);
            let E = (s = t.frag) == null ? void 0 : s.type,
              m =
                ((E === j.AUDIO && o === b.FRAG_PARSING_ERROR) ||
                  (t.sourceBufferName === 'audio' &&
                    (o === b.BUFFER_ADD_CODEC_ERROR ||
                      o === b.BUFFER_APPEND_ERROR))) &&
                u.some(({ audioCodec: A }) => r.audioCodec !== A),
              y =
                t.sourceBufferName === 'video' &&
                (o === b.BUFFER_ADD_CODEC_ERROR ||
                  o === b.BUFFER_APPEND_ERROR) &&
                u.some(
                  ({ codecSet: A, audioCodec: R }) =>
                    r.codecSet !== A && r.audioCodec === R
                ),
              { type: S, groupId: T } = (a = t.context) != null ? a : {};
            for (let A = u.length; A--; ) {
              let R = (A + c) % u.length;
              if (R !== c && R >= f && R <= g && u[R].loadError === 0) {
                let I = u[R];
                if (o === b.FRAG_GAP && E === j.MAIN && t.frag) {
                  let v = u[R].details;
                  if (v) {
                    let _ = pe(t.frag, v.fragments, t.frag.start);
                    if (_ != null && _.gap) continue;
                  }
                } else {
                  if (
                    (S === lt.AUDIO_TRACK && I.hasAudioGroup(T)) ||
                    (S === lt.SUBTITLE_TRACK && I.hasSubtitleGroup(T))
                  )
                    continue;
                  if (
                    (E === j.AUDIO &&
                      (n = r.audioGroups) != null &&
                      n.some((v) => I.hasAudioGroup(v))) ||
                    (E === j.SUBTITLE &&
                      (l = r.subtitleGroups) != null &&
                      l.some((v) => I.hasSubtitleGroup(v))) ||
                    (m && r.audioCodec === I.audioCodec) ||
                    (y && r.codecSet === I.codecSet) ||
                    (!m && r.codecSet !== I.codecSet)
                  )
                    continue;
                }
                d = R;
                break;
              }
            }
            if (d > -1 && i.loadLevel !== d)
              return (
                (t.levelRetry = !0),
                (this.playlistError = 0),
                {
                  action: Ft.SendAlternateToPenaltyBox,
                  flags: Kt.None,
                  nextAutoLevel: d,
                }
              );
          }
          return {
            action: Ft.SendAlternateToPenaltyBox,
            flags: Kt.MoveAllAlternatesMatchingHost,
          };
        }
        onErrorOut(t, e) {
          var i;
          switch ((i = e.errorAction) == null ? void 0 : i.action) {
            case Ft.DoNothing:
              break;
            case Ft.SendAlternateToPenaltyBox:
              this.sendAlternateToPenaltyBox(e),
                e.errorAction.resolved || e.details === b.FRAG_GAP
                  ? /MediaSource readyState: ended/.test(e.error.message) &&
                    (this.warn(
                      `MediaSource ended after "${e.sourceBufferName}" sourceBuffer append error. Attempting to recover from media error.`
                    ),
                    this.hls.recoverMediaError())
                  : (e.fatal = !0);
            case Ft.RetryRequest:
          }
          if (e.fatal) {
            this.hls.stopLoad();
            return;
          }
        }
        sendAlternateToPenaltyBox(t) {
          let e = this.hls,
            i = t.errorAction;
          if (!i) return;
          let { flags: r } = i,
            s = i.nextAutoLevel;
          switch (r) {
            case Kt.None:
              this.switchLevel(t, s);
              break;
            case Kt.MoveAllAlternatesMatchingHDCP: {
              let l = this.getVariantLevelIndex(t.frag),
                o = e.levels[l],
                d = o?.attrs['HDCP-LEVEL'];
              if (((i.hdcpLevel = d), d)) {
                (e.maxHdcpLevel = Gi[Gi.indexOf(d) - 1]),
                  (i.resolved = !0),
                  this.warn(
                    `Restricting playback to HDCP-LEVEL of "${e.maxHdcpLevel}" or lower`
                  );
                break;
              }
            }
            case Kt.MoveAllAlternatesMatchingKey: {
              let l = t.decryptdata;
              if (l) {
                let o = this.hls.levels;
                for (let d = o.length; d--; )
                  if (this.variantHasKey(o[d], l)) {
                    var a, n;
                    this.log(
                      `Banned key found in level ${d} (${
                        o[d].bitrate
                      }bps) or audio group "${
                        (a = o[d].audioGroups) == null ? void 0 : a.join(',')
                      }" (${
                        (n = t.frag) == null ? void 0 : n.type
                      } fragment) ${Ot(l.keyId || [])}`
                    ),
                      o[d].fragmentError++,
                      o[d].loadError++,
                      this.log(
                        `Removing level ${d} with key error (${t.error})`
                      ),
                      this.hls.removeLevel(d);
                  }
                o.length && (i.resolved = !0);
              }
            }
          }
          i.resolved || this.switchLevel(t, s);
        }
        switchLevel(t, e) {
          if (
            e !== void 0 &&
            t.errorAction &&
            (this.warn(`switching to level ${e} after ${t.details}`),
            (this.hls.nextAutoLevel = e),
            (t.errorAction.resolved = !0),
            (this.hls.nextLoadLevel = this.hls.nextAutoLevel),
            t.details === b.BUFFER_ADD_CODEC_ERROR &&
              t.mimeType &&
              t.sourceBufferName !== 'audiovideo')
          ) {
            let i = $i(t.mimeType),
              r = this.hls.levels;
            for (let s = r.length; s--; )
              r[s][`${t.sourceBufferName}Codec`] === i &&
                (this.log(
                  `Removing level ${s} for ${t.details} ("${i}" not supported)`
                ),
                this.hls.removeLevel(s));
          }
        }
      }
      function Le(h) {
        let t = { action: Ft.DoNothing, flags: Kt.None };
        return h && (t.resolved = !0), t;
      }
      var xt = {
        NOT_LOADED: 'NOT_LOADED',
        APPENDING: 'APPENDING',
        PARTIAL: 'PARTIAL',
        OK: 'OK',
      };
      class In {
        constructor(t) {
          (this.activePartLists = Object.create(null)),
            (this.endListFragments = Object.create(null)),
            (this.fragments = Object.create(null)),
            (this.timeRanges = Object.create(null)),
            (this.bufferPadding = 0.2),
            (this.hls = void 0),
            (this.hasGaps = !1),
            (this.hls = t),
            this._registerListeners();
        }
        _registerListeners() {
          let { hls: t } = this;
          t &&
            (t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.BUFFER_APPENDED, this.onBufferAppended, this),
            t.on(p.FRAG_BUFFERED, this.onFragBuffered, this),
            t.on(p.FRAG_LOADED, this.onFragLoaded, this));
        }
        _unregisterListeners() {
          let { hls: t } = this;
          t &&
            (t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.BUFFER_APPENDED, this.onBufferAppended, this),
            t.off(p.FRAG_BUFFERED, this.onFragBuffered, this),
            t.off(p.FRAG_LOADED, this.onFragLoaded, this));
        }
        destroy() {
          this._unregisterListeners(),
            (this.hls =
              this.fragments =
              this.activePartLists =
              this.endListFragments =
              this.timeRanges =
                null);
        }
        getAppendedFrag(t, e) {
          let i = this.activePartLists[e];
          if (i)
            for (let r = i.length; r--; ) {
              let s = i[r];
              if (!s) break;
              if (s.start <= t && t <= s.end && s.loaded) return s;
            }
          return this.getBufferedFrag(t, e);
        }
        getBufferedFrag(t, e) {
          return this.getFragAtPos(t, e, !0);
        }
        getFragAtPos(t, e, i) {
          let { fragments: r } = this,
            s = Object.keys(r);
          for (let a = s.length; a--; ) {
            let n = r[s[a]];
            if (n?.body.type === e && (!i || n.buffered)) {
              let l = n.body;
              if (l.start <= t && t <= l.end) return l;
            }
          }
          return null;
        }
        detectEvictedFragments(t, e, i, r, s) {
          this.timeRanges && (this.timeRanges[t] = e);
          let a = r?.fragment.sn || -1;
          Object.keys(this.fragments).forEach((n) => {
            let l = this.fragments[n];
            if (!l || a >= l.body.sn) return;
            if (!l.buffered && (!l.loaded || s)) {
              l.body.type === i && this.removeFragment(l.body);
              return;
            }
            let o = l.range[t];
            if (o) {
              if (o.time.length === 0) {
                this.removeFragment(l.body);
                return;
              }
              o.time.some((d) => {
                let u = !this.isTimeBuffered(d.startPTS, d.endPTS, e);
                return u && this.removeFragment(l.body), u;
              });
            }
          });
        }
        detectPartialFragments(t) {
          let e = this.timeRanges;
          if (!e || t.frag.sn === 'initSegment') return;
          let i = t.frag,
            r = Ie(i),
            s = this.fragments[r];
          if (!s || (s.buffered && i.gap)) return;
          let a = !i.relurl;
          Object.keys(e).forEach((n) => {
            let l = i.elementaryStreams[n];
            if (!l) return;
            let o = e[n],
              d = a || l.partial === !0;
            s.range[n] = this.getBufferedTimes(i, t.part, d, o);
          }),
            (s.loaded = null),
            Object.keys(s.range).length
              ? ((s.buffered = !0),
                (s.body.endList = i.endList || s.body.endList) &&
                  (this.endListFragments[s.body.type] = s),
                ni(s) || this.removeParts(i.sn - 1, i.type))
              : this.removeFragment(s.body);
        }
        removeParts(t, e) {
          let i = this.activePartLists[e];
          i && (this.activePartLists[e] = ys(i, (r) => r.fragment.sn >= t));
        }
        fragBuffered(t, e) {
          let i = Ie(t),
            r = this.fragments[i];
          !r &&
            e &&
            ((r = this.fragments[i] =
              {
                body: t,
                appendedPTS: null,
                loaded: null,
                buffered: !1,
                range: Object.create(null),
              }),
            t.gap && (this.hasGaps = !0)),
            r && ((r.loaded = null), (r.buffered = !0));
        }
        getBufferedTimes(t, e, i, r) {
          let s = { time: [], partial: i },
            a = t.start,
            n = t.end,
            l = t.minEndPTS || n,
            o = t.maxStartPTS || a;
          for (let d = 0; d < r.length; d++) {
            let u = r.start(d) - this.bufferPadding,
              c = r.end(d) + this.bufferPadding;
            if (o >= u && l <= c) {
              s.time.push({
                startPTS: Math.max(a, r.start(d)),
                endPTS: Math.min(n, r.end(d)),
              });
              break;
            }
            if (a < c && n > u) {
              let f = Math.max(a, r.start(d)),
                g = Math.min(n, r.end(d));
              g > f &&
                ((s.partial = !0), s.time.push({ startPTS: f, endPTS: g }));
            } else if (n <= u) break;
          }
          return s;
        }
        getPartialFragment(t) {
          let e,
            i,
            r,
            s = null,
            a = 0,
            { bufferPadding: n, fragments: l } = this;
          return (
            Object.keys(l).forEach((o) => {
              let d = l[o];
              d &&
                ni(d) &&
                ((i = d.body.start - n),
                (r = d.body.end + n),
                t >= i &&
                  t <= r &&
                  a <= (e = Math.min(t - i, r - t)) &&
                  ((s = d.body), (a = e)));
            }),
            s
          );
        }
        isEndListAppended(t) {
          let e = this.endListFragments[t];
          return e !== void 0 && (e.buffered || ni(e));
        }
        getState(t) {
          let e = Ie(t),
            i = this.fragments[e];
          return i
            ? i.buffered
              ? ni(i)
                ? xt.PARTIAL
                : xt.OK
              : xt.APPENDING
            : xt.NOT_LOADED;
        }
        isTimeBuffered(t, e, i) {
          let r, s;
          for (let a = 0; a < i.length; a++) {
            if (
              ((r = i.start(a) - this.bufferPadding),
              (s = i.end(a) + this.bufferPadding),
              t >= r && e <= s)
            )
              return !0;
            if (e <= r) break;
          }
          return !1;
        }
        onManifestLoading() {
          this.removeAllFragments();
        }
        onFragLoaded(t, e) {
          if (e.frag.sn === 'initSegment' || e.frag.bitrateTest) return;
          let i = e.frag,
            r = e.part ? null : e,
            s = Ie(i);
          this.fragments[s] = {
            body: i,
            appendedPTS: null,
            loaded: r,
            buffered: !1,
            range: Object.create(null),
          };
        }
        onBufferAppended(t, e) {
          let { frag: i, part: r, timeRanges: s, type: a } = e;
          if (i.sn === 'initSegment') return;
          let n = i.type;
          if (r) {
            let o = this.activePartLists[n];
            o || (this.activePartLists[n] = o = []), o.push(r);
          }
          this.timeRanges = s;
          let l = s[a];
          this.detectEvictedFragments(a, l, n, r);
        }
        onFragBuffered(t, e) {
          this.detectPartialFragments(e);
        }
        hasFragment(t) {
          let e = Ie(t);
          return !!this.fragments[e];
        }
        hasFragments(t) {
          let { fragments: e } = this,
            i = Object.keys(e);
          if (!t) return i.length > 0;
          for (let r = i.length; r--; ) {
            let s = e[i[r]];
            if (s?.body.type === t) return !0;
          }
          return !1;
        }
        hasParts(t) {
          var e;
          return !!((e = this.activePartLists[t]) != null && e.length);
        }
        removeFragmentsInRange(t, e, i, r, s) {
          (!r || this.hasGaps) &&
            Object.keys(this.fragments).forEach((a) => {
              let n = this.fragments[a];
              if (!n) return;
              let l = n.body;
              l.type === i &&
                (!r || l.gap) &&
                l.start < e &&
                l.end > t &&
                (n.buffered || s) &&
                this.removeFragment(l);
            });
        }
        removeFragment(t) {
          let e = Ie(t);
          t.clearElementaryStreamInfo();
          let i = this.activePartLists[t.type];
          if (i) {
            let r = t.sn;
            this.activePartLists[t.type] = ys(i, (s) => s.fragment.sn !== r);
          }
          delete this.fragments[e],
            t.endList && delete this.endListFragments[t.type];
        }
        removeAllFragments() {
          var t;
          (this.fragments = Object.create(null)),
            (this.endListFragments = Object.create(null)),
            (this.activePartLists = Object.create(null)),
            (this.hasGaps = !1);
          let e =
            (t = this.hls) == null || (t = t.latestLevelDetails) == null
              ? void 0
              : t.partList;
          e && e.forEach((i) => i.clearElementaryStreamInfo());
        }
      }
      function ni(h) {
        var t, e, i;
        return (
          h.buffered &&
          !!(
            h.body.gap ||
            ((t = h.range.video) != null && t.partial) ||
            ((e = h.range.audio) != null && e.partial) ||
            ((i = h.range.audiovideo) != null && i.partial)
          )
        );
      }
      function Ie(h) {
        return `${h.type}_${h.level}_${h.sn}`;
      }
      function ys(h, t) {
        return h.filter((e) => {
          let i = t(e);
          return i || e.clearElementaryStreamInfo(), i;
        });
      }
      var he = { cbc: 0, ctr: 1 };
      class Rn {
        constructor(t, e, i) {
          (this.subtle = void 0),
            (this.aesIV = void 0),
            (this.aesMode = void 0),
            (this.subtle = t),
            (this.aesIV = e),
            (this.aesMode = i);
        }
        decrypt(t, e) {
          switch (this.aesMode) {
            case he.cbc:
              return this.subtle.decrypt(
                { name: 'AES-CBC', iv: this.aesIV },
                e,
                t
              );
            case he.ctr:
              return this.subtle.decrypt(
                { name: 'AES-CTR', counter: this.aesIV, length: 64 },
                e,
                t
              );
            default:
              throw Error(`[AESCrypto] invalid aes mode ${this.aesMode}`);
          }
        }
      }
      class bn {
        constructor() {
          (this.rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]),
            (this.subMix = [
              new Uint32Array(256),
              new Uint32Array(256),
              new Uint32Array(256),
              new Uint32Array(256),
            ]),
            (this.invSubMix = [
              new Uint32Array(256),
              new Uint32Array(256),
              new Uint32Array(256),
              new Uint32Array(256),
            ]),
            (this.sBox = new Uint32Array(256)),
            (this.invSBox = new Uint32Array(256)),
            (this.key = new Uint32Array(0)),
            (this.ksRows = 0),
            (this.keySize = 0),
            (this.keySchedule = void 0),
            (this.invKeySchedule = void 0),
            this.initTable();
        }
        uint8ArrayToUint32Array_(t) {
          let e = new DataView(t),
            i = new Uint32Array(4);
          for (let r = 0; r < 4; r++) i[r] = e.getUint32(4 * r);
          return i;
        }
        initTable() {
          let t = this.sBox,
            e = this.invSBox,
            i = this.subMix,
            r = i[0],
            s = i[1],
            a = i[2],
            n = i[3],
            l = this.invSubMix,
            o = l[0],
            d = l[1],
            u = l[2],
            c = l[3],
            f = new Uint32Array(256),
            g = 0,
            E = 0,
            m = 0;
          for (m = 0; m < 256; m++)
            m < 128 ? (f[m] = m << 1) : (f[m] = (m << 1) ^ 283);
          for (m = 0; m < 256; m++) {
            let y = E ^ (E << 1) ^ (E << 2) ^ (E << 3) ^ (E << 4);
            (y = (y >>> 8) ^ (255 & y) ^ 99), (t[g] = y), (e[y] = g);
            let S = f[g],
              T = f[S],
              A = f[T],
              R = (257 * f[y]) ^ (16843008 * y);
            (r[g] = (R << 24) | (R >>> 8)),
              (s[g] = (R << 16) | (R >>> 16)),
              (a[g] = (R << 8) | (R >>> 24)),
              (n[g] = R),
              (R = (16843009 * A) ^ (65537 * T) ^ (257 * S) ^ (16843008 * g)),
              (o[y] = (R << 24) | (R >>> 8)),
              (d[y] = (R << 16) | (R >>> 16)),
              (u[y] = (R << 8) | (R >>> 24)),
              (c[y] = R),
              g ? ((g = S ^ f[f[f[A ^ S]]]), (E ^= f[f[E]])) : (g = E = 1);
          }
        }
        expandKey(t) {
          let e,
            i,
            r,
            s,
            a = this.uint8ArrayToUint32Array_(t),
            n = !0,
            l = 0;
          for (; l < a.length && n; ) (n = a[l] === this.key[l]), l++;
          if (n) return;
          this.key = a;
          let o = (this.keySize = a.length);
          if (o !== 4 && o !== 6 && o !== 8)
            throw Error('Invalid aes key size=' + o);
          let d = (this.ksRows = (o + 6 + 1) * 4),
            u = (this.keySchedule = new Uint32Array(d)),
            c = (this.invKeySchedule = new Uint32Array(d)),
            f = this.sBox,
            g = this.rcon,
            E = this.invSubMix,
            m = E[0],
            y = E[1],
            S = E[2],
            T = E[3];
          for (e = 0; e < d; e++) {
            if (e < o) {
              r = u[e] = a[e];
              continue;
            }
            (s = r),
              e % o == 0
                ? (s =
                    ((f[(s = (s << 8) | (s >>> 24)) >>> 24] << 24) |
                      (f[(s >>> 16) & 255] << 16) |
                      (f[(s >>> 8) & 255] << 8) |
                      f[255 & s]) ^
                    (g[(e / o) | 0] << 24))
                : o > 6 &&
                  e % o == 4 &&
                  (s =
                    (f[s >>> 24] << 24) |
                    (f[(s >>> 16) & 255] << 16) |
                    (f[(s >>> 8) & 255] << 8) |
                    f[255 & s]),
              (u[e] = r = (u[e - o] ^ s) >>> 0);
          }
          for (i = 0; i < d; i++)
            (e = d - i),
              (s = 3 & i ? u[e] : u[e - 4]),
              i < 4 || e <= 4
                ? (c[i] = s)
                : (c[i] =
                    m[f[s >>> 24]] ^
                    y[f[(s >>> 16) & 255]] ^
                    S[f[(s >>> 8) & 255]] ^
                    T[f[255 & s]]),
              (c[i] = c[i] >>> 0);
        }
        networkToHostOrderSwap(t) {
          return (
            (t << 24) | ((65280 & t) << 8) | ((16711680 & t) >> 8) | (t >>> 24)
          );
        }
        decrypt(t, e, i) {
          let r,
            s,
            a,
            n,
            l,
            o,
            d,
            u,
            c,
            f,
            g,
            E,
            m,
            y,
            S = this.keySize + 6,
            T = this.invKeySchedule,
            A = this.invSBox,
            R = this.invSubMix,
            I = R[0],
            v = R[1],
            _ = R[2],
            L = R[3],
            C = this.uint8ArrayToUint32Array_(i),
            M = C[0],
            G = C[1],
            k = C[2],
            P = C[3],
            x = new Int32Array(t),
            U = new Int32Array(x.length),
            $ = this.networkToHostOrderSwap;
          for (; e < x.length; ) {
            for (
              y = 1,
                c = $(x[e]),
                f = $(x[e + 1]),
                g = $(x[e + 2]),
                E = $(x[e + 3]),
                l = c ^ T[0],
                o = E ^ T[1],
                d = g ^ T[2],
                u = f ^ T[3],
                m = 4;
              y < S;
              y++
            )
              (r =
                I[l >>> 24] ^
                v[(o >> 16) & 255] ^
                _[(d >> 8) & 255] ^
                L[255 & u] ^
                T[m]),
                (s =
                  I[o >>> 24] ^
                  v[(d >> 16) & 255] ^
                  _[(u >> 8) & 255] ^
                  L[255 & l] ^
                  T[m + 1]),
                (a =
                  I[d >>> 24] ^
                  v[(u >> 16) & 255] ^
                  _[(l >> 8) & 255] ^
                  L[255 & o] ^
                  T[m + 2]),
                (n =
                  I[u >>> 24] ^
                  v[(l >> 16) & 255] ^
                  _[(o >> 8) & 255] ^
                  L[255 & d] ^
                  T[m + 3]),
                (l = r),
                (o = s),
                (d = a),
                (u = n),
                (m += 4);
            (r =
              (A[l >>> 24] << 24) ^
              (A[(o >> 16) & 255] << 16) ^
              (A[(d >> 8) & 255] << 8) ^
              A[255 & u] ^
              T[m]),
              (s =
                (A[o >>> 24] << 24) ^
                (A[(d >> 16) & 255] << 16) ^
                (A[(u >> 8) & 255] << 8) ^
                A[255 & l] ^
                T[m + 1]),
              (a =
                (A[d >>> 24] << 24) ^
                (A[(u >> 16) & 255] << 16) ^
                (A[(l >> 8) & 255] << 8) ^
                A[255 & o] ^
                T[m + 2]),
              (n =
                (A[u >>> 24] << 24) ^
                (A[(l >> 16) & 255] << 16) ^
                (A[(o >> 8) & 255] << 8) ^
                A[255 & d] ^
                T[m + 3]),
              (U[e] = $(r ^ M)),
              (U[e + 1] = $(n ^ G)),
              (U[e + 2] = $(a ^ k)),
              (U[e + 3] = $(s ^ P)),
              (M = c),
              (G = f),
              (k = g),
              (P = E),
              (e += 4);
          }
          return U.buffer;
        }
      }
      class Dn {
        constructor(t, e, i) {
          (this.subtle = void 0),
            (this.key = void 0),
            (this.aesMode = void 0),
            (this.subtle = t),
            (this.key = e),
            (this.aesMode = i);
        }
        expandKey() {
          let t = (function (e) {
            switch (e) {
              case he.cbc:
                return 'AES-CBC';
              case he.ctr:
                return 'AES-CTR';
              default:
                throw Error(`[FastAESKey] invalid aes mode ${e}`);
            }
          })(this.aesMode);
          return this.subtle.importKey('raw', this.key, { name: t }, !1, [
            'encrypt',
            'decrypt',
          ]);
        }
      }
      class Hi {
        constructor(t, { removePKCS7Padding: e = !0 } = {}) {
          if (
            ((this.logEnabled = !0),
            (this.removePKCS7Padding = void 0),
            (this.subtle = null),
            (this.softwareDecrypter = null),
            (this.key = null),
            (this.fastAesKey = null),
            (this.remainderData = null),
            (this.currentIV = null),
            (this.currentResult = null),
            (this.useSoftware = void 0),
            (this.enableSoftwareAES = void 0),
            (this.enableSoftwareAES = t.enableSoftwareAES),
            (this.removePKCS7Padding = e),
            e)
          )
            try {
              let i = F.crypto;
              i && (this.subtle = i.subtle || i.webkitSubtle);
            } catch {}
          this.useSoftware = !this.subtle;
        }
        destroy() {
          (this.subtle = null),
            (this.softwareDecrypter = null),
            (this.key = null),
            (this.fastAesKey = null),
            (this.remainderData = null),
            (this.currentIV = null),
            (this.currentResult = null);
        }
        isSync() {
          return this.useSoftware;
        }
        flush() {
          let { currentResult: t, remainderData: e } = this;
          if (!t || e) return this.reset(), null;
          let i = new Uint8Array(t);
          return (
            this.reset(),
            this.removePKCS7Padding
              ? (function (r) {
                  let s = r.byteLength,
                    a = s && new DataView(r.buffer).getUint8(s - 1);
                  return a ? r.slice(0, s - a) : r;
                })(i)
              : i
          );
        }
        reset() {
          (this.currentResult = null),
            (this.currentIV = null),
            (this.remainderData = null),
            this.softwareDecrypter && (this.softwareDecrypter = null);
        }
        decrypt(t, e, i, r) {
          return this.useSoftware
            ? new Promise((s, a) => {
                let n = ArrayBuffer.isView(t) ? t : new Uint8Array(t);
                this.softwareDecrypt(n, e, i, r);
                let l = this.flush();
                l
                  ? s(l.buffer)
                  : a(Error('[softwareDecrypt] Failed to decrypt data'));
              })
            : this.webCryptoDecrypt(new Uint8Array(t), e, i, r);
        }
        softwareDecrypt(t, e, i, r) {
          let { currentIV: s, currentResult: a, remainderData: n } = this;
          if (r !== he.cbc || e.byteLength !== 16)
            return (
              nt.warn('SoftwareDecrypt: can only handle AES-128-CBC'), null
            );
          this.logOnce('JS AES decrypt'),
            n && ((t = Wt(n, t)), (this.remainderData = null));
          let l = this.getValidChunk(t);
          if (!l.length) return null;
          s && (i = s);
          let o = this.softwareDecrypter;
          return (
            o || (o = this.softwareDecrypter = new bn()),
            o.expandKey(e),
            (this.currentResult = o.decrypt(l.buffer, 0, i)),
            (this.currentIV = l.slice(-16).buffer),
            a || null
          );
        }
        webCryptoDecrypt(t, e, i, r) {
          if (this.key !== e || !this.fastAesKey) {
            if (!this.subtle)
              return Promise.resolve(this.onWebCryptoError(t, e, i, r));
            (this.key = e), (this.fastAesKey = new Dn(this.subtle, e, r));
          }
          return this.fastAesKey
            .expandKey()
            .then((s) =>
              this.subtle
                ? (this.logOnce('WebCrypto AES decrypt'),
                  new Rn(this.subtle, new Uint8Array(i), r).decrypt(
                    t.buffer,
                    s
                  ))
                : Promise.reject(Error('web crypto not initialized'))
            )
            .catch(
              (s) => (
                nt.warn(
                  `[decrypter]: WebCrypto Error, disable WebCrypto API, ${s.name}: ${s.message}`
                ),
                this.onWebCryptoError(t, e, i, r)
              )
            );
        }
        onWebCryptoError(t, e, i, r) {
          let s = this.enableSoftwareAES;
          if (s) {
            (this.useSoftware = !0),
              (this.logEnabled = !0),
              this.softwareDecrypt(t, e, i, r);
            let a = this.flush();
            if (a) return a.buffer;
          }
          throw Error(
            'WebCrypto' +
              (s ? ' and softwareDecrypt' : '') +
              ': failed to decrypt data'
          );
        }
        getValidChunk(t) {
          let e = t,
            i = t.length - (t.length % 16);
          return (
            i !== t.length &&
              ((e = t.slice(0, i)), (this.remainderData = t.slice(i))),
            e
          );
        }
        logOnce(t) {
          this.logEnabled &&
            (nt.log(`[decrypter]: ${t}`), (this.logEnabled = !1));
        }
      }
      class kn {
        constructor(t) {
          (this.config = void 0),
            (this.loader = null),
            (this.partLoadTimeout = -1),
            (this.config = t);
        }
        destroy() {
          this.loader && (this.loader.destroy(), (this.loader = null));
        }
        abort() {
          this.loader && this.loader.abort();
        }
        load(t, e) {
          let i = t.url;
          if (!i)
            return Promise.reject(
              new le({
                type: Q.NETWORK_ERROR,
                details: b.FRAG_LOAD_ERROR,
                fatal: !1,
                frag: t,
                error: Error(
                  `Fragment does not have a ${i ? 'part list' : 'url'}`
                ),
                networkDetails: null,
              })
            );
          this.abort();
          let r = this.config,
            s = r.fLoader,
            a = r.loader;
          return new Promise((n, l) => {
            if ((this.loader && this.loader.destroy(), t.gap)) {
              if (t.tagList.some((g) => g[0] === 'GAP')) {
                l(Ts(t));
                return;
              }
              t.gap = !1;
            }
            let o = (this.loader = s ? new s(r) : new a(r)),
              d = vs(t);
            t.loader = o;
            let u = Es(r.fragLoadPolicy.default),
              c = {
                loadPolicy: u,
                timeout: u.maxLoadTimeMs,
                maxRetry: 0,
                retryDelay: 0,
                maxRetryDelay: 0,
                highWaterMark: t.sn === 'initSegment' ? 1 / 0 : 131072,
              };
            t.stats = o.stats;
            let f = {
              onSuccess: (g, E, m, y) => {
                this.resetLoader(t, o);
                let S = g.data;
                m.resetIV &&
                  t.decryptdata &&
                  ((t.decryptdata.iv = new Uint8Array(S.slice(0, 16))),
                  (S = S.slice(16))),
                  n({ frag: t, part: null, payload: S, networkDetails: y });
              },
              onError: (g, E, m, y) => {
                this.resetLoader(t, o),
                  l(
                    new le({
                      type: Q.NETWORK_ERROR,
                      details: b.FRAG_LOAD_ERROR,
                      fatal: !1,
                      frag: t,
                      response: J({ url: i, data: void 0 }, g),
                      error: Error(`HTTP Error ${g.code} ${g.text}`),
                      networkDetails: m,
                      stats: y,
                    })
                  );
              },
              onAbort: (g, E, m) => {
                this.resetLoader(t, o),
                  l(
                    new le({
                      type: Q.NETWORK_ERROR,
                      details: b.INTERNAL_ABORTED,
                      fatal: !1,
                      frag: t,
                      error: Error('Aborted'),
                      networkDetails: m,
                      stats: g,
                    })
                  );
              },
              onTimeout: (g, E, m) => {
                this.resetLoader(t, o),
                  l(
                    new le({
                      type: Q.NETWORK_ERROR,
                      details: b.FRAG_LOAD_TIMEOUT,
                      fatal: !1,
                      frag: t,
                      error: Error(`Timeout after ${c.timeout}ms`),
                      networkDetails: m,
                      stats: g,
                    })
                  );
              },
            };
            e &&
              (f.onProgress = (g, E, m, y) =>
                e({ frag: t, part: null, payload: m, networkDetails: y })),
              o.load(d, c, f);
          });
        }
        loadPart(t, e, i) {
          this.abort();
          let r = this.config,
            s = r.fLoader,
            a = r.loader;
          return new Promise((n, l) => {
            if ((this.loader && this.loader.destroy(), t.gap || e.gap)) {
              l(Ts(t, e));
              return;
            }
            let o = (this.loader = s ? new s(r) : new a(r)),
              d = vs(t, e);
            t.loader = o;
            let u = Es(r.fragLoadPolicy.default),
              c = {
                loadPolicy: u,
                timeout: u.maxLoadTimeMs,
                maxRetry: 0,
                retryDelay: 0,
                maxRetryDelay: 0,
                highWaterMark: 131072,
              };
            (e.stats = o.stats),
              o.load(d, c, {
                onSuccess: (f, g, E, m) => {
                  this.resetLoader(t, o), this.updateStatsFromPart(t, e);
                  let y = {
                    frag: t,
                    part: e,
                    payload: f.data,
                    networkDetails: m,
                  };
                  i(y), n(y);
                },
                onError: (f, g, E, m) => {
                  this.resetLoader(t, o),
                    l(
                      new le({
                        type: Q.NETWORK_ERROR,
                        details: b.FRAG_LOAD_ERROR,
                        fatal: !1,
                        frag: t,
                        part: e,
                        response: J({ url: d.url, data: void 0 }, f),
                        error: Error(`HTTP Error ${f.code} ${f.text}`),
                        networkDetails: E,
                        stats: m,
                      })
                    );
                },
                onAbort: (f, g, E) => {
                  (t.stats.aborted = e.stats.aborted),
                    this.resetLoader(t, o),
                    l(
                      new le({
                        type: Q.NETWORK_ERROR,
                        details: b.INTERNAL_ABORTED,
                        fatal: !1,
                        frag: t,
                        part: e,
                        error: Error('Aborted'),
                        networkDetails: E,
                        stats: f,
                      })
                    );
                },
                onTimeout: (f, g, E) => {
                  this.resetLoader(t, o),
                    l(
                      new le({
                        type: Q.NETWORK_ERROR,
                        details: b.FRAG_LOAD_TIMEOUT,
                        fatal: !1,
                        frag: t,
                        part: e,
                        error: Error(`Timeout after ${c.timeout}ms`),
                        networkDetails: E,
                        stats: f,
                      })
                    );
                },
              });
          });
        }
        updateStatsFromPart(t, e) {
          let i = t.stats,
            r = e.stats,
            s = r.total;
          if (((i.loaded += r.loaded), s)) {
            let l = Math.round(t.duration / e.duration),
              o = Math.min(Math.round(i.loaded / s), l),
              d = (l - o) * Math.round(i.loaded / o);
            i.total = i.loaded + d;
          } else i.total = Math.max(i.loaded, i.total);
          let a = i.loading,
            n = r.loading;
          a.start
            ? (a.first += n.first - n.start)
            : ((a.start = n.start), (a.first = n.first)),
            (a.end = n.end);
        }
        resetLoader(t, e) {
          (t.loader = null),
            this.loader === e &&
              (F.clearTimeout(this.partLoadTimeout), (this.loader = null)),
            e.destroy();
        }
      }
      function vs(h, t = null) {
        let e = t || h,
          i = {
            frag: h,
            part: t,
            responseType: 'arraybuffer',
            url: e.url,
            headers: {},
            rangeStart: 0,
            rangeEnd: 0,
          },
          r = e.byteRangeStartOffset,
          s = e.byteRangeEndOffset;
        if (Y(r) && Y(s)) {
          var a, n;
          let l = r,
            o = s;
          if (
            h.sn === 'initSegment' &&
            ((n = (a = h.decryptdata) == null ? void 0 : a.method) ===
              'AES-128' ||
              n === 'AES-256')
          ) {
            let d = s - r;
            d % 16 && (o = s + (16 - (d % 16))),
              r !== 0 && ((i.resetIV = !0), (l = r - 16));
          }
          (i.rangeStart = l), (i.rangeEnd = o);
        }
        return i;
      }
      function Ts(h, t) {
        let e = Error(`GAP ${h.gap ? 'tag' : 'attribute'} found`),
          i = {
            type: Q.MEDIA_ERROR,
            details: b.FRAG_GAP,
            fatal: !1,
            frag: h,
            error: e,
            networkDetails: null,
          };
        return t && (i.part = t), ((t || h).stats.aborted = !0), new le(i);
      }
      class le extends Error {
        constructor(t) {
          super(t.error.message), (this.data = void 0), (this.data = t);
        }
      }
      class Ss extends it {
        constructor(t, e) {
          super(t, e),
            (this._boundTick = void 0),
            (this._tickTimer = null),
            (this._tickInterval = null),
            (this._tickCallCount = 0),
            (this._boundTick = this.tick.bind(this));
        }
        destroy() {
          this.onHandlerDestroying(), this.onHandlerDestroyed();
        }
        onHandlerDestroying() {
          this.clearNextTick(), this.clearInterval();
        }
        onHandlerDestroyed() {}
        hasInterval() {
          return !!this._tickInterval;
        }
        hasNextTick() {
          return !!this._tickTimer;
        }
        setInterval(t) {
          return (
            !this._tickInterval &&
            ((this._tickCallCount = 0),
            (this._tickInterval = F.setInterval(this._boundTick, t)),
            !0)
          );
        }
        clearInterval() {
          return (
            !!this._tickInterval &&
            (F.clearInterval(this._tickInterval),
            (this._tickInterval = null),
            !0)
          );
        }
        clearNextTick() {
          return (
            !!this._tickTimer &&
            (F.clearTimeout(this._tickTimer), (this._tickTimer = null), !0)
          );
        }
        tick() {
          this._tickCallCount++,
            this._tickCallCount === 1 &&
              (this.doTick(),
              this._tickCallCount > 1 && this.tickImmediate(),
              (this._tickCallCount = 0));
        }
        tickImmediate() {
          this.clearNextTick(),
            (this._tickTimer = F.setTimeout(this._boundTick, 0));
        }
        doTick() {}
      }
      class Yi {
        constructor(t, e, i, r = 0, s = -1, a = !1) {
          (this.level = void 0),
            (this.sn = void 0),
            (this.part = void 0),
            (this.id = void 0),
            (this.size = void 0),
            (this.partial = void 0),
            (this.transmuxing = li()),
            (this.buffering = { audio: li(), video: li(), audiovideo: li() }),
            (this.level = t),
            (this.sn = e),
            (this.id = i),
            (this.size = r),
            (this.part = s),
            (this.partial = a);
        }
      }
      function li() {
        return { start: 0, executeStart: 0, executeEnd: 0, end: 0 };
      }
      let As = { length: 0, start: () => 0, end: () => 0 };
      class rt {
        static isBuffered(t, e) {
          if (t) {
            let i = rt.getBuffered(t);
            for (let r = i.length; r--; )
              if (e >= i.start(r) && e <= i.end(r)) return !0;
          }
          return !1;
        }
        static bufferedRanges(t) {
          if (t) {
            let e = rt.getBuffered(t);
            return rt.timeRangesToArray(e);
          }
          return [];
        }
        static timeRangesToArray(t) {
          let e = [];
          for (let i = 0; i < t.length; i++)
            e.push({ start: t.start(i), end: t.end(i) });
          return e;
        }
        static bufferInfo(t, e, i) {
          if (t) {
            let r = rt.bufferedRanges(t);
            if (r.length) return rt.bufferedInfo(r, e, i);
          }
          return { len: 0, start: e, end: e, bufferedIndex: -1 };
        }
        static bufferedInfo(t, e, i) {
          let r;
          (e = Math.max(0, e)),
            t.length > 1 &&
              t.sort((d, u) => d.start - u.start || u.end - d.end);
          let s = -1,
            a = [];
          if (i)
            for (let d = 0; d < t.length; d++) {
              e >= t[d].start && e <= t[d].end && (s = d);
              let u = a.length;
              if (u) {
                let c = a[u - 1].end;
                t[d].start - c < i
                  ? t[d].end > c && (a[u - 1].end = t[d].end)
                  : a.push(t[d]);
              } else a.push(t[d]);
            }
          else a = t;
          let n = 0,
            l = e,
            o = e;
          for (let d = 0; d < a.length; d++) {
            let u = a[d].start,
              c = a[d].end;
            if ((s === -1 && e >= u && e <= c && (s = d), e + i >= u && e < c))
              (l = u), (n = (o = c) - e);
            else if (e + i < u) {
              r = u;
              break;
            }
          }
          return {
            len: n,
            start: l || 0,
            end: o || 0,
            nextStart: r,
            buffered: t,
            bufferedIndex: s,
          };
        }
        static getBuffered(t) {
          try {
            return t.buffered || As;
          } catch (e) {
            return nt.log('failed to get media.buffered', e), As;
          }
        }
      }
      let Wi = /\{\$([a-zA-Z0-9-_]+)\}/g;
      function ji(h, t) {
        if (h.variableList !== null || h.hasVariableRefs) {
          let e = h.variableList;
          return t.replace(Wi, (i) => {
            let r = i.substring(2, i.length - 1),
              s = e?.[r];
            return s === void 0
              ? (h.playlistParsingError ||
                  (h.playlistParsingError = Error(
                    `Missing preceding EXT-X-DEFINE tag for Variable Reference: "${r}"`
                  )),
                i)
              : s;
          });
        }
        return t;
      }
      function Ls(h, t, e) {
        let i,
          r,
          s = h.variableList;
        if ((s || (h.variableList = s = {}), 'QUERYPARAM' in t)) {
          i = t.QUERYPARAM;
          try {
            let a = new F.URL(e).searchParams;
            if (a.has(i)) r = a.get(i);
            else
              throw Error(
                `"${i}" does not match any query parameter in URI: "${e}"`
              );
          } catch (a) {
            h.playlistParsingError ||
              (h.playlistParsingError = Error(
                `EXT-X-DEFINE QUERYPARAM: ${a.message}`
              ));
          }
        } else (i = t.NAME), (r = t.VALUE);
        i in s
          ? h.playlistParsingError ||
            (h.playlistParsingError = Error(
              `EXT-X-DEFINE duplicate Variable Name declarations: "${i}"`
            ))
          : (s[i] = r || '');
      }
      let Pn = /^(\d+)x(\d+)$/,
        Is = /(.+?)=(".*?"|.*?)(?:,|$)/g;
      class Lt {
        constructor(t, e) {
          typeof t == 'string' && (t = Lt.parseAttrList(t, e)), at(this, t);
        }
        get clientAttrs() {
          return Object.keys(this).filter((t) => t.substring(0, 2) === 'X-');
        }
        decimalInteger(t) {
          let e = parseInt(this[t], 10);
          return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e;
        }
        hexadecimalInteger(t) {
          if (this[t]) {
            let e = (this[t] || '0x').slice(2),
              i = new Uint8Array(
                (e = (1 & e.length ? '0' : '') + e).length / 2
              );
            for (let r = 0; r < e.length / 2; r++)
              i[r] = parseInt(e.slice(2 * r, 2 * r + 2), 16);
            return i;
          }
          return null;
        }
        hexadecimalIntegerAsNumber(t) {
          let e = parseInt(this[t], 16);
          return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e;
        }
        decimalFloatingPoint(t) {
          return parseFloat(this[t]);
        }
        optionalFloat(t, e) {
          let i = this[t];
          return i ? parseFloat(i) : e;
        }
        enumeratedString(t) {
          return this[t];
        }
        enumeratedStringList(t, e) {
          let i = this[t];
          return (i ? i.split(/[ ,]+/) : []).reduce(
            (r, s) => ((r[s.toLowerCase()] = !0), r),
            e
          );
        }
        bool(t) {
          return this[t] === 'YES';
        }
        decimalResolution(t) {
          let e = Pn.exec(this[t]);
          if (e !== null)
            return { width: parseInt(e[1], 10), height: parseInt(e[2], 10) };
        }
        static parseAttrList(t, e) {
          let i,
            r = {};
          for (Is.lastIndex = 0; (i = Is.exec(t)) !== null; ) {
            let s = i[1].trim(),
              a = i[2],
              n = a.indexOf('"') === 0 && a.lastIndexOf('"') === a.length - 1,
              l = !1;
            if (n) a = a.slice(1, -1);
            else
              switch (s) {
                case 'IV':
                case 'SCTE35-CMD':
                case 'SCTE35-IN':
                case 'SCTE35-OUT':
                  l = !0;
              }
            if (e && (n || l)) a = ji(e, a);
            else if (!l && !n)
              switch (s) {
                case 'CLOSED-CAPTIONS':
                  if (a === 'NONE') break;
                case 'ALLOWED-CPC':
                case 'CLASS':
                case 'ASSOC-LANGUAGE':
                case 'AUDIO':
                case 'BYTERANGE':
                case 'CHANNELS':
                case 'CHARACTERISTICS':
                case 'CODECS':
                case 'DATA-ID':
                case 'END-DATE':
                case 'GROUP-ID':
                case 'ID':
                case 'IMPORT':
                case 'INSTREAM-ID':
                case 'KEYFORMAT':
                case 'KEYFORMATVERSIONS':
                case 'LANGUAGE':
                case 'NAME':
                case 'PATHWAY-ID':
                case 'QUERYPARAM':
                case 'RECENTLY-REMOVED-DATERANGES':
                case 'SERVER-URI':
                case 'STABLE-RENDITION-ID':
                case 'STABLE-VARIANT-ID':
                case 'START-DATE':
                case 'SUBTITLES':
                case 'SUPPLEMENTAL-CODECS':
                case 'URI':
                case 'VALUE':
                case 'VIDEO':
                case 'X-ASSET-LIST':
                case 'X-ASSET-URI':
                  nt.warn(`${t}: attribute ${s} is missing quotes`);
              }
            r[s] = a;
          }
          return r;
        }
      }
      class Rs {
        constructor(t, e, i = 0) {
          var r;
          if (
            ((this.attr = void 0),
            (this.tagAnchor = void 0),
            (this.tagOrder = void 0),
            (this._startDate = void 0),
            (this._endDate = void 0),
            (this._dateAtEnd = void 0),
            (this._cue = void 0),
            (this._badValueForSameId = void 0),
            (this.tagAnchor = e?.tagAnchor || null),
            (this.tagOrder = (r = e?.tagOrder) != null ? r : i),
            e)
          ) {
            let s = e.attr;
            for (let a in s)
              if (Object.prototype.hasOwnProperty.call(t, a) && t[a] !== s[a]) {
                nt.warn(
                  `DATERANGE tag attribute: "${a}" does not match for tags with ID: "${t.ID}"`
                ),
                  (this._badValueForSameId = a);
                break;
              }
            t = at(new Lt({}), s, t);
          }
          if (
            ((this.attr = t),
            e
              ? ((this._startDate = e._startDate),
                (this._cue = e._cue),
                (this._endDate = e._endDate),
                (this._dateAtEnd = e._dateAtEnd))
              : (this._startDate = new Date(t['START-DATE'])),
            'END-DATE' in this.attr)
          ) {
            let s = e?.endDate || new Date(this.attr['END-DATE']);
            Y(s.getTime()) && (this._endDate = s);
          }
        }
        get id() {
          return this.attr.ID;
        }
        get class() {
          return this.attr.CLASS;
        }
        get cue() {
          let t = this._cue;
          return t === void 0
            ? (this._cue = this.attr.enumeratedStringList(
                this.attr.CUE ? 'CUE' : 'X-CUE',
                { pre: !1, post: !1, once: !1 }
              ))
            : t;
        }
        get startTime() {
          let { tagAnchor: t } = this;
          return t === null || t.programDateTime === null
            ? (nt.warn(
                `Expected tagAnchor Fragment with PDT set for DateRange "${this.id}": ${t}`
              ),
              NaN)
            : t.start + (this.startDate.getTime() - t.programDateTime) / 1e3;
        }
        get startDate() {
          return this._startDate;
        }
        get endDate() {
          let t = this._endDate || this._dateAtEnd;
          if (t) return t;
          let e = this.duration;
          return e !== null
            ? (this._dateAtEnd = new Date(this._startDate.getTime() + 1e3 * e))
            : null;
        }
        get duration() {
          if ('DURATION' in this.attr) {
            let t = this.attr.decimalFloatingPoint('DURATION');
            if (Y(t)) return t;
          } else if (this._endDate)
            return (this._endDate.getTime() - this._startDate.getTime()) / 1e3;
          return null;
        }
        get plannedDuration() {
          return 'PLANNED-DURATION' in this.attr
            ? this.attr.decimalFloatingPoint('PLANNED-DURATION')
            : null;
        }
        get endOnNext() {
          return this.attr.bool('END-ON-NEXT');
        }
        get isInterstitial() {
          return this.class === 'com.apple.hls.interstitial';
        }
        get isValid() {
          return (
            !!this.id &&
            !this._badValueForSameId &&
            Y(this.startDate.getTime()) &&
            (this.duration === null || this.duration >= 0) &&
            (!this.endOnNext || !!this.class) &&
            (!this.attr.CUE ||
              (!this.cue.pre && !this.cue.post) ||
              this.cue.pre !== this.cue.post) &&
            (!this.isInterstitial ||
              'X-ASSET-URI' in this.attr ||
              'X-ASSET-LIST' in this.attr)
          );
        }
      }
      class _n {
        constructor(t) {
          (this.PTSKnown = !1),
            (this.alignedSliding = !1),
            (this.averagetargetduration = void 0),
            (this.endCC = 0),
            (this.endSN = 0),
            (this.fragments = void 0),
            (this.fragmentHint = void 0),
            (this.partList = null),
            (this.dateRanges = void 0),
            (this.dateRangeTagCount = 0),
            (this.live = !0),
            (this.requestScheduled = -1),
            (this.ageHeader = 0),
            (this.advancedDateTime = void 0),
            (this.updated = !0),
            (this.advanced = !0),
            (this.misses = 0),
            (this.startCC = 0),
            (this.startSN = 0),
            (this.startTimeOffset = null),
            (this.targetduration = 0),
            (this.totalduration = 0),
            (this.type = null),
            (this.url = void 0),
            (this.m3u8 = ''),
            (this.version = null),
            (this.canBlockReload = !1),
            (this.canSkipUntil = 0),
            (this.canSkipDateRanges = !1),
            (this.skippedSegments = 0),
            (this.recentlyRemovedDateranges = void 0),
            (this.partHoldBack = 0),
            (this.holdBack = 0),
            (this.partTarget = 0),
            (this.preloadHint = void 0),
            (this.renditionReports = void 0),
            (this.tuneInGoal = 0),
            (this.deltaUpdateFailed = void 0),
            (this.driftStartTime = 0),
            (this.driftEndTime = 0),
            (this.driftStart = 0),
            (this.driftEnd = 0),
            (this.encryptedFragments = void 0),
            (this.playlistParsingError = null),
            (this.variableList = null),
            (this.hasVariableRefs = !1),
            (this.appliedTimelineOffset = void 0),
            (this.fragments = []),
            (this.encryptedFragments = []),
            (this.dateRanges = {}),
            (this.url = t);
        }
        reloaded(t) {
          if (!t) {
            (this.advanced = !0), (this.updated = !0);
            return;
          }
          let e = this.lastPartSn - t.lastPartSn,
            i = this.lastPartIndex - t.lastPartIndex;
          (this.updated = this.endSN !== t.endSN || !!i || !!e || !this.live),
            (this.advanced =
              this.endSN > t.endSN || e > 0 || (e === 0 && i > 0)),
            this.updated || this.advanced
              ? (this.misses = Math.floor(0.6 * t.misses))
              : (this.misses = t.misses + 1);
        }
        hasKey(t) {
          return this.encryptedFragments.some((e) => {
            let i = e.decryptdata;
            return (
              i || (e.setKeyFormat(t.keyFormat), (i = e.decryptdata)),
              !!i && t.matches(i)
            );
          });
        }
        get hasProgramDateTime() {
          return (
            !!this.fragments.length &&
            Y(this.fragments[this.fragments.length - 1].programDateTime)
          );
        }
        get levelTargetDuration() {
          return this.averagetargetduration || this.targetduration || 10;
        }
        get drift() {
          let t = this.driftEndTime - this.driftStartTime;
          return t > 0 ? (1e3 * (this.driftEnd - this.driftStart)) / t : 1;
        }
        get edge() {
          return this.partEnd || this.fragmentEnd;
        }
        get partEnd() {
          var t;
          return (t = this.partList) != null && t.length
            ? this.partList[this.partList.length - 1].end
            : this.fragmentEnd;
        }
        get fragmentEnd() {
          return this.fragments.length
            ? this.fragments[this.fragments.length - 1].end
            : 0;
        }
        get fragmentStart() {
          return this.fragments.length ? this.fragments[0].start : 0;
        }
        get age() {
          return this.advancedDateTime
            ? Math.max(Date.now() - this.advancedDateTime, 0) / 1e3
            : 0;
        }
        get lastPartIndex() {
          var t;
          return (t = this.partList) != null && t.length
            ? this.partList[this.partList.length - 1].index
            : -1;
        }
        get maxPartIndex() {
          let t = this.partList;
          if (t) {
            let e = this.lastPartIndex;
            if (e !== -1) {
              for (let i = t.length; i--; )
                if (t[i].index > e) return t[i].index;
              return e;
            }
          }
          return 0;
        }
        get lastPartSn() {
          var t;
          return (t = this.partList) != null && t.length
            ? this.partList[this.partList.length - 1].fragment.sn
            : this.endSN;
        }
        get expired() {
          if (this.live && this.age && this.misses < 3) {
            let t = this.partEnd - this.fragmentStart;
            return (
              this.age >
              Math.max(t, this.totalduration) + this.levelTargetDuration
            );
          }
          return !1;
        }
      }
      function bs(h, t) {
        return h.length === t.length && !h.some((e, i) => e !== t[i]);
      }
      function Ds(h, t) {
        return (!h && !t) || (!!h && !!t && bs(h, t));
      }
      function Re(h) {
        return h === 'AES-128' || h === 'AES-256' || h === 'AES-256-CTR';
      }
      function qi(h) {
        switch (h) {
          case 'AES-128':
          case 'AES-256':
            return he.cbc;
          case 'AES-256-CTR':
            return he.ctr;
          default:
            throw Error(`invalid full segment method ${h}`);
        }
      }
      function Xi(h) {
        return Uint8Array.from(atob(h), (t) => t.charCodeAt(0));
      }
      function zi(h) {
        return Uint8Array.from(unescape(encodeURIComponent(h)), (t) =>
          t.charCodeAt(0)
        );
      }
      let oi = typeof F < 'u' ? F : void 0;
      var Dt = {
          CLEARKEY: 'org.w3.clearkey',
          FAIRPLAY: 'com.apple.fps',
          PLAYREADY: 'com.microsoft.playready',
          WIDEVINE: 'com.widevine.alpha',
        },
        Ut = {
          CLEARKEY: 'org.w3.clearkey',
          FAIRPLAY: 'com.apple.streamingkeydelivery',
          PLAYREADY: 'com.microsoft.playready',
          WIDEVINE: 'urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed',
        };
      function hi(h) {
        switch (h) {
          case Ut.FAIRPLAY:
            return Dt.FAIRPLAY;
          case Ut.PLAYREADY:
            return Dt.PLAYREADY;
          case Ut.WIDEVINE:
            return Dt.WIDEVINE;
          case Ut.CLEARKEY:
            return Dt.CLEARKEY;
        }
      }
      function Qi(h) {
        switch (h) {
          case Dt.FAIRPLAY:
            return Ut.FAIRPLAY;
          case Dt.PLAYREADY:
            return Ut.PLAYREADY;
          case Dt.WIDEVINE:
            return Ut.WIDEVINE;
          case Dt.CLEARKEY:
            return Ut.CLEARKEY;
        }
      }
      function Fe(h) {
        let { drmSystems: t, widevineLicenseUrl: e } = h,
          i = t
            ? [Dt.FAIRPLAY, Dt.WIDEVINE, Dt.PLAYREADY, Dt.CLEARKEY].filter(
                (r) => !!t[r]
              )
            : [];
        return !i[Dt.WIDEVINE] && e && i.push(Dt.WIDEVINE), i;
      }
      let ks = (function (h) {
          return oi != null &&
            (h = oi.navigator) != null &&
            h.requestMediaKeySystemAccess
            ? F.navigator.requestMediaKeySystemAccess.bind(F.navigator)
            : null;
        })(),
        di = {};
      class ui {
        static clearKeyUriToKeyIdMap() {
          di = {};
        }
        constructor(t, e, i, r = [1], s = null, a) {
          (this.uri = void 0),
            (this.method = void 0),
            (this.keyFormat = void 0),
            (this.keyFormatVersions = void 0),
            (this.encrypted = void 0),
            (this.isCommonEncryption = void 0),
            (this.iv = null),
            (this.key = null),
            (this.keyId = null),
            (this.pssh = null),
            (this.method = t),
            (this.uri = e),
            (this.keyFormat = i),
            (this.keyFormatVersions = r),
            (this.iv = s),
            (this.encrypted = !!t && t !== 'NONE'),
            (this.isCommonEncryption = this.encrypted && !Re(t)),
            a != null &&
              a.startsWith('0x') &&
              (this.keyId = new Uint8Array(fe(a)));
        }
        matches(t) {
          return (
            t.uri === this.uri &&
            t.method === this.method &&
            t.encrypted === this.encrypted &&
            t.keyFormat === this.keyFormat &&
            bs(t.keyFormatVersions, this.keyFormatVersions) &&
            Ds(t.iv, this.iv) &&
            Ds(t.keyId, this.keyId)
          );
        }
        isSupported() {
          if (this.method) {
            if (Re(this.method) || this.method === 'NONE') return !0;
            if (this.keyFormat === 'identity')
              return this.method === 'SAMPLE-AES';
            switch (this.keyFormat) {
              case Ut.FAIRPLAY:
              case Ut.WIDEVINE:
              case Ut.PLAYREADY:
              case Ut.CLEARKEY:
                return (
                  ['SAMPLE-AES', 'SAMPLE-AES-CENC', 'SAMPLE-AES-CTR'].indexOf(
                    this.method
                  ) !== -1
                );
            }
          }
          return !1;
        }
        getDecryptData(t) {
          if (!this.encrypted || !this.uri) return null;
          if (Re(this.method) && this.uri && !this.iv) {
            typeof t != 'number' &&
              (nt.warn(
                `missing IV for initialization segment with method="${this.method}" - compliance issue`
              ),
              (t = 0));
            let i = (function (r) {
              let s = new Uint8Array(16);
              for (let a = 12; a < 16; a++) s[a] = (r >> (8 * (15 - a))) & 255;
              return s;
            })(t);
            return new ui(
              this.method,
              this.uri,
              'identity',
              this.keyFormatVersions,
              i
            );
          }
          if (this.pssh && this.keyId) return this;
          let e = (function (i) {
            let r = i.split(':'),
              s = null;
            if (r[0] === 'data' && r.length === 2) {
              let a = r[1].split(';'),
                n = a[a.length - 1].split(',');
              if (n.length === 2) {
                let l = n[0] === 'base64',
                  o = n[1];
                l
                  ? (a.splice(-1, 1), (s = Xi(o)))
                  : (s = (function (d) {
                      let u = zi(d).subarray(0, 16),
                        c = new Uint8Array(16);
                      return c.set(u, 16 - u.length), c;
                    })(o));
              }
            }
            return s;
          })(this.uri);
          if (e)
            switch (this.keyFormat) {
              case Ut.WIDEVINE:
                if (((this.pssh = e), !this.keyId && e.length >= 22)) {
                  let i = e.length - 22;
                  this.keyId = e.subarray(i, i + 16);
                }
                break;
              case Ut.PLAYREADY: {
                let i = new Uint8Array([
                  154, 4, 240, 121, 152, 64, 66, 134, 171, 146, 230, 91, 224,
                  136, 95, 149,
                ]);
                (this.pssh = (function (r, s, a) {
                  let n, l;
                  if (r.byteLength !== 16)
                    throw RangeError('Invalid system id');
                  (n = new Uint8Array()), (l = new Uint8Array());
                  let o = new Uint8Array(4);
                  return (
                    a.byteLength > 0 &&
                      new DataView(o.buffer).setUint32(0, a.byteLength, !1),
                    (function (d, ...u) {
                      let c = u.length,
                        f = 8,
                        g = c;
                      for (; g--; ) f += u[g].byteLength;
                      let E = new Uint8Array(f);
                      for (
                        E[0] = (f >> 24) & 255,
                          E[1] = (f >> 16) & 255,
                          E[2] = (f >> 8) & 255,
                          E[3] = 255 & f,
                          E.set(d, 4),
                          g = 0,
                          f = 8;
                        g < c;
                        g++
                      )
                        E.set(u[g], f), (f += u[g].byteLength);
                      return E;
                    })(
                      [112, 115, 115, 104],
                      new Uint8Array([0, 0, 0, 0]),
                      r,
                      l,
                      n,
                      o,
                      a
                    )
                  );
                })(i, 0, e)),
                  (this.keyId = (function (r) {
                    let s = new Uint16Array(
                        r.buffer,
                        r.byteOffset,
                        r.byteLength / 2
                      ),
                      a = String.fromCharCode.apply(null, Array.from(s)),
                      n = a.substring(a.indexOf('<'), a.length),
                      l = new DOMParser()
                        .parseFromString(n, 'text/xml')
                        .getElementsByTagName('KID')[0];
                    if (l) {
                      let o = l.childNodes[0]
                        ? l.childNodes[0].nodeValue
                        : l.getAttribute('VALUE');
                      if (o) {
                        let d = Xi(o).subarray(0, 16);
                        return (
                          (function (u) {
                            let c = function (f, g, E) {
                              let m = f[g];
                              (f[g] = f[E]), (f[E] = m);
                            };
                            c(u, 0, 3), c(u, 1, 2), c(u, 4, 5), c(u, 6, 7);
                          })(d),
                          d
                        );
                      }
                    }
                    return null;
                  })(e));
                break;
              }
              default: {
                let i = e.subarray(0, 16);
                if (i.length !== 16) {
                  let r = new Uint8Array(16);
                  r.set(i, 16 - i.length), (i = r);
                }
                this.keyId = i;
              }
            }
          if (!this.keyId || this.keyId.byteLength !== 16) {
            let i = di[this.uri];
            if (!i) {
              let r = Object.keys(di).length % Number.MAX_SAFE_INTEGER;
              new DataView((i = new Uint8Array(16)).buffer, 12, 4).setUint32(
                0,
                r
              ),
                (di[this.uri] = i);
            }
            this.keyId = i;
          }
          return this;
        }
      }
      let Ps =
          /#EXT-X-STREAM-INF:([^\r\n]*)(?:[\r\n](?:#[^\r\n]*)?)*([^\r\n]+)|#EXT-X-(SESSION-DATA|SESSION-KEY|DEFINE|CONTENT-STEERING|START):([^\r\n]*)[\r\n]+/g,
        _s = /#EXT-X-MEDIA:(.*)/g,
        Cn = /^#EXT(?:INF|-X-TARGETDURATION):/m,
        Zi = RegExp(
          [
            /#EXTINF:\s*(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source,
            /(?!#) *(\S[^\r\n]*)/.source,
            /#.*/.source,
          ].join('|'),
          'g'
        ),
        On = new RegExp(
          [
            /#EXT-X-(PROGRAM-DATE-TIME|BYTERANGE|DATERANGE|DEFINE|KEY|MAP|PART|PART-INF|PLAYLIST-TYPE|PRELOAD-HINT|RENDITION-REPORT|SERVER-CONTROL|SKIP|START):(.+)/
              .source,
            /#EXT-X-(BITRATE|DISCONTINUITY-SEQUENCE|MEDIA-SEQUENCE|TARGETDURATION|VERSION): *(\d+)/
              .source,
            /#EXT-X-(DISCONTINUITY|ENDLIST|GAP|INDEPENDENT-SEGMENTS)/.source,
            /(#)([^:]*):(.*)/.source,
            /(#)(.*)(?:.*)\r?\n?/.source,
          ].join('|')
        );
      class te {
        static findGroup(t, e) {
          for (let i = 0; i < t.length; i++) {
            let r = t[i];
            if (r.id === e) return r;
          }
        }
        static resolve(t, e) {
          return we.buildAbsoluteURL(e, t, { alwaysNormalize: !0 });
        }
        static isMediaPlaylist(t) {
          return Cn.test(t);
        }
        static parseMasterPlaylist(t, e) {
          var i;
          let r,
            s = {
              contentSteering: null,
              levels: [],
              playlistParsingError: null,
              sessionData: null,
              sessionKeys: null,
              startTimeOffset: null,
              variableList: null,
              hasVariableRefs: Wi.test(t),
            },
            a = [];
          for (Ps.lastIndex = 0; (r = Ps.exec(t)) != null; )
            if (r[1]) {
              let l = new Lt(r[1], s),
                o = ji(s, r[2]),
                d = {
                  attrs: l,
                  bitrate:
                    l.decimalInteger('BANDWIDTH') ||
                    l.decimalInteger('AVERAGE-BANDWIDTH'),
                  name: l.NAME,
                  url: te.resolve(o, e),
                },
                u = l.decimalResolution('RESOLUTION');
              u && ((d.width = u.width), (d.height = u.height)),
                xs(l.CODECS, d);
              let c = l['SUPPLEMENTAL-CODECS'];
              c && ((d.supplemental = {}), xs(c, d.supplemental)),
                ((i = d.unknownCodecs) != null && i.length) || a.push(d),
                s.levels.push(d);
            } else if (r[3]) {
              let l = r[3],
                o = r[4];
              switch (l) {
                case 'SESSION-DATA': {
                  let d = new Lt(o, s),
                    u = d['DATA-ID'];
                  u &&
                    (s.sessionData === null && (s.sessionData = {}),
                    (s.sessionData[u] = d));
                  break;
                }
                case 'SESSION-KEY': {
                  let d = Os(o, e, s);
                  d.encrypted && d.isSupported()
                    ? (s.sessionKeys === null && (s.sessionKeys = []),
                      s.sessionKeys.push(d))
                    : nt.warn(
                        `[Keys] Ignoring invalid EXT-X-SESSION-KEY tag: "${o}"`
                      );
                  break;
                }
                case 'DEFINE':
                  {
                    let d = new Lt(o, s);
                    Ls(s, d, e);
                  }
                  break;
                case 'CONTENT-STEERING': {
                  let d = new Lt(o, s);
                  s.contentSteering = {
                    uri: te.resolve(d['SERVER-URI'], e),
                    pathwayId: d['PATHWAY-ID'] || '.',
                  };
                  break;
                }
                case 'START':
                  s.startTimeOffset = ws(o);
              }
            }
          let n = a.length > 0 && a.length < s.levels.length;
          return (
            (s.levels = n ? a : s.levels),
            s.levels.length === 0 &&
              (s.playlistParsingError = Error('no levels found in manifest')),
            s
          );
        }
        static parseMasterPlaylistMedia(t, e, i) {
          let r,
            s = {},
            a = i.levels,
            n = {
              AUDIO: a.map((o) => ({
                id: o.attrs.AUDIO,
                audioCodec: o.audioCodec,
              })),
              SUBTITLES: a.map((o) => ({
                id: o.attrs.SUBTITLES,
                textCodec: o.textCodec,
              })),
              'CLOSED-CAPTIONS': [],
            },
            l = 0;
          for (_s.lastIndex = 0; (r = _s.exec(t)) !== null; ) {
            let o = new Lt(r[1], i),
              d = o.TYPE;
            if (d) {
              let u = n[d],
                c = s[d] || [];
              s[d] = c;
              let f = o.LANGUAGE,
                g = o['ASSOC-LANGUAGE'],
                E = o.CHANNELS,
                m = o.CHARACTERISTICS,
                y = o['INSTREAM-ID'],
                S = {
                  attrs: o,
                  bitrate: 0,
                  id: l++,
                  groupId: o['GROUP-ID'] || '',
                  name: o.NAME || f || '',
                  type: d,
                  default: o.bool('DEFAULT'),
                  autoselect: o.bool('AUTOSELECT'),
                  forced: o.bool('FORCED'),
                  lang: f,
                  url: o.URI ? te.resolve(o.URI, e) : '',
                };
              if (
                (g && (S.assocLang = g),
                E && (S.channels = E),
                m && (S.characteristics = m),
                y && (S.instreamId = y),
                u != null && u.length)
              ) {
                let T = te.findGroup(u, S.groupId) || u[0];
                Ms(S, T, 'audioCodec'), Ms(S, T, 'textCodec');
              }
              c.push(S);
            }
          }
          return s;
        }
        static parseLevelPlaylist(t, e, i, r, s, a) {
          var n;
          let l,
            o,
            d,
            u,
            c = { url: e },
            f = new _n(e),
            g = f.fragments,
            E = [],
            m = null,
            y = 0,
            S = 0,
            T = 0,
            A = 0,
            R = 0,
            I = null,
            v = new wi(r, c),
            _ = -1,
            L = !1,
            C = null;
          if (
            ((Zi.lastIndex = 0),
            (f.m3u8 = t),
            (f.hasVariableRefs = Wi.test(t)),
            ((n = Zi.exec(t)) == null ? void 0 : n[0]) !== '#EXTM3U')
          )
            return (
              (f.playlistParsingError = Error(
                'Missing format identifier #EXTM3U'
              )),
              f
            );
          for (; (l = Zi.exec(t)) !== null; ) {
            L &&
              ((L = !1),
              ((v = new wi(r, c)).playlistOffset = T),
              v.setStart(T),
              (v.sn = y),
              (v.cc = A),
              R && (v.bitrate = R),
              (v.level = i),
              m &&
                ((v.initSegment = m),
                m.rawProgramDateTime &&
                  ((v.rawProgramDateTime = m.rawProgramDateTime),
                  (m.rawProgramDateTime = null)),
                C && (v.setByteRange(C), (C = null))));
            let P = l[1];
            if (P) {
              v.duration = parseFloat(P);
              let x = (' ' + l[2]).slice(1);
              (v.title = x || null),
                v.tagList.push(x ? ['INF', P, x] : ['INF', P]);
            } else if (l[3]) {
              if (Y(v.duration)) {
                (v.playlistOffset = T),
                  v.setStart(T),
                  d && Ns(v, d, f),
                  (v.sn = y),
                  (v.level = i),
                  (v.cc = A),
                  g.push(v);
                let x = (' ' + l[3]).slice(1);
                (v.relurl = ji(f, x)),
                  Ji(v, I, E),
                  (I = v),
                  (T += v.duration),
                  y++,
                  (S = 0),
                  (L = !0);
              }
            } else {
              if (!(l = l[0].match(On))) {
                nt.warn('No matches on slow regex match for level playlist!');
                continue;
              }
              for (o = 1; o < l.length && l[o] === void 0; o++);
              let x = (' ' + l[o]).slice(1),
                U = (' ' + l[o + 1]).slice(1),
                $ = l[o + 2] ? (' ' + l[o + 2]).slice(1) : null;
              switch (x) {
                case 'BYTERANGE':
                  I ? v.setByteRange(U, I) : v.setByteRange(U);
                  break;
                case 'PROGRAM-DATE-TIME':
                  (v.rawProgramDateTime = U),
                    v.tagList.push(['PROGRAM-DATE-TIME', U]),
                    _ === -1 && (_ = g.length);
                  break;
                case 'PLAYLIST-TYPE':
                  f.type && oe(f, x, l), (f.type = U.toUpperCase());
                  break;
                case 'MEDIA-SEQUENCE':
                  f.startSN !== 0 ? oe(f, x, l) : g.length > 0 && Us(f, x, l),
                    (y = f.startSN = parseInt(U));
                  break;
                case 'SKIP': {
                  f.skippedSegments && oe(f, x, l);
                  let B = new Lt(U, f),
                    O = B.decimalInteger('SKIPPED-SEGMENTS');
                  if (Y(O)) {
                    f.skippedSegments += O;
                    for (let q = O; q--; ) g.push(null);
                    y += O;
                  }
                  let w = B.enumeratedString('RECENTLY-REMOVED-DATERANGES');
                  w &&
                    (f.recentlyRemovedDateranges = (
                      f.recentlyRemovedDateranges || []
                    ).concat(w.split('	')));
                  break;
                }
                case 'TARGETDURATION':
                  f.targetduration !== 0 && oe(f, x, l),
                    (f.targetduration = Math.max(parseInt(U), 1));
                  break;
                case 'VERSION':
                  f.version !== null && oe(f, x, l), (f.version = parseInt(U));
                  break;
                case 'INDEPENDENT-SEGMENTS':
                  break;
                case 'ENDLIST':
                  f.live || oe(f, x, l), (f.live = !1);
                  break;
                case '#':
                  (U || $) && v.tagList.push($ ? [U, $] : [U]);
                  break;
                case 'DISCONTINUITY':
                  A++, v.tagList.push(['DIS']);
                  break;
                case 'GAP':
                  (v.gap = !0), v.tagList.push([x]);
                  break;
                case 'BITRATE':
                  v.tagList.push([x, U]),
                    Y((R = 1e3 * parseInt(U))) ? (v.bitrate = R) : (R = 0);
                  break;
                case 'DATERANGE': {
                  let B = new Lt(U, f),
                    O = new Rs(B, f.dateRanges[B.ID], f.dateRangeTagCount);
                  f.dateRangeTagCount++,
                    O.isValid || f.skippedSegments
                      ? (f.dateRanges[O.id] = O)
                      : nt.warn(`Ignoring invalid DATERANGE tag: "${U}"`),
                    v.tagList.push(['EXT-X-DATERANGE', U]);
                  break;
                }
                case 'DEFINE':
                  {
                    let B = new Lt(U, f);
                    'IMPORT' in B
                      ? (function (O, w, q) {
                          let Z = w.IMPORT;
                          if (q && Z in q) {
                            let X = O.variableList;
                            X || (O.variableList = X = {}), (X[Z] = q[Z]);
                          } else
                            O.playlistParsingError ||
                              (O.playlistParsingError = Error(
                                `EXT-X-DEFINE IMPORT attribute not found in Multivariant Playlist: "${Z}"`
                              ));
                        })(f, B, a)
                      : Ls(f, B, e);
                  }
                  break;
                case 'DISCONTINUITY-SEQUENCE':
                  f.startCC !== 0 ? oe(f, x, l) : g.length > 0 && Us(f, x, l),
                    (f.startCC = A = parseInt(U));
                  break;
                case 'KEY': {
                  let B = Os(U, e, f);
                  if (B.isSupported()) {
                    if (B.method === 'NONE') {
                      d = void 0;
                      break;
                    }
                    d || (d = {});
                    let O = d[B.keyFormat];
                    (O != null && O.matches(B)) ||
                      (O && (d = at({}, d)), (d[B.keyFormat] = B));
                  } else
                    nt.warn(`[Keys] Ignoring invalid EXT-X-KEY tag: "${U}"`);
                  break;
                }
                case 'START':
                  f.startTimeOffset = ws(U);
                  break;
                case 'MAP': {
                  let B = new Lt(U, f);
                  if (v.duration) {
                    let O = new wi(r, c);
                    Fs(O, B, i, d),
                      (m = O),
                      (v.initSegment = m),
                      m.rawProgramDateTime &&
                        !v.rawProgramDateTime &&
                        (v.rawProgramDateTime = m.rawProgramDateTime);
                  } else {
                    let O = v.byteRangeEndOffset;
                    if (O) {
                      let w = v.byteRangeStartOffset;
                      C = `${O - w}@${w}`;
                    } else C = null;
                    Fs(v, B, i, d), (m = v), (L = !0);
                  }
                  m.cc = A;
                  break;
                }
                case 'SERVER-CONTROL':
                  u && oe(f, x, l),
                    (u = new Lt(U)),
                    (f.canBlockReload = u.bool('CAN-BLOCK-RELOAD')),
                    (f.canSkipUntil = u.optionalFloat('CAN-SKIP-UNTIL', 0)),
                    (f.canSkipDateRanges =
                      f.canSkipUntil > 0 && u.bool('CAN-SKIP-DATERANGES')),
                    (f.partHoldBack = u.optionalFloat('PART-HOLD-BACK', 0)),
                    (f.holdBack = u.optionalFloat('HOLD-BACK', 0));
                  break;
                case 'PART-INF': {
                  f.partTarget && oe(f, x, l);
                  let B = new Lt(U);
                  f.partTarget = B.decimalFloatingPoint('PART-TARGET');
                  break;
                }
                case 'PART': {
                  let B = f.partList;
                  B || (B = f.partList = []);
                  let O = S > 0 ? B[B.length - 1] : void 0,
                    w = S++,
                    q = new En(new Lt(U, f), v, c, w, O);
                  B.push(q), (v.duration += q.duration);
                  break;
                }
                case 'PRELOAD-HINT': {
                  let B = new Lt(U, f);
                  f.preloadHint = B;
                  break;
                }
                case 'RENDITION-REPORT': {
                  let B = new Lt(U, f);
                  (f.renditionReports = f.renditionReports || []),
                    f.renditionReports.push(B);
                  break;
                }
                default:
                  nt.warn(`line parsed but not handled: ${l}`);
              }
            }
          }
          I && !I.relurl
            ? (g.pop(), (T -= I.duration), f.partList && (f.fragmentHint = I))
            : f.partList &&
              (Ji(v, I, E), (v.cc = A), (f.fragmentHint = v), d && Ns(v, d, f)),
            f.targetduration ||
              (f.playlistParsingError = Error(
                '#EXT-X-TARGETDURATION is required'
              ));
          let M = g.length,
            G = g[0],
            k = g[M - 1];
          if ((T += f.skippedSegments * f.targetduration) > 0 && M && k) {
            f.averagetargetduration = T / M;
            let P = k.sn;
            (f.endSN = P !== 'initSegment' ? P : 0),
              f.live || (k.endList = !0),
              _ > 0 &&
                ((function (x, U) {
                  let $ = x[U];
                  for (let B = U; B--; ) {
                    let O = x[B];
                    if (!O) return;
                    (O.programDateTime = $.programDateTime - 1e3 * O.duration),
                      ($ = O);
                  }
                })(g, _),
                G && E.unshift(G));
          }
          return (
            f.fragmentHint && (T += f.fragmentHint.duration),
            (f.totalduration = T),
            E.length && f.dateRangeTagCount && G && Cs(E, f),
            (f.endCC = A),
            f
          );
        }
      }
      function Cs(h, t) {
        let e = h.length;
        if (!e) {
          if (!t.hasProgramDateTime) return;
          {
            let n = t.fragments[t.fragments.length - 1];
            h.push(n), e++;
          }
        }
        let i = h[e - 1],
          r = t.live ? 1 / 0 : t.totalduration,
          s = Object.keys(t.dateRanges);
        for (let n = s.length; n--; ) {
          let l = t.dateRanges[s[n]],
            o = l.startDate.getTime();
          l.tagAnchor = i.ref;
          for (let d = e; d--; ) {
            var a;
            if (((a = h[d]) == null ? void 0 : a.sn) < t.startSN) break;
            let u = (function (c, f, g, E, m) {
              let y = g[E];
              if (y) {
                let T = y.programDateTime;
                if (f >= T || E === 0) {
                  var S;
                  if (
                    f <=
                    T +
                      1e3 *
                        ((((S = g[E + 1]) == null ? void 0 : S.start) || m) -
                          y.start)
                  ) {
                    let A = g[E].sn - c.startSN;
                    if (A < 0) return -1;
                    let R = c.fragments;
                    if (R.length > g.length) {
                      let I = (g[E + 1] || R[R.length - 1]).sn - c.startSN;
                      for (let v = I; v > A; v--) {
                        let _ = R[v].programDateTime;
                        if (f >= _ && f < _ + 1e3 * R[v].duration) return v;
                      }
                    }
                    return A;
                  }
                }
              }
              return -1;
            })(t, o, h, d, r);
            if (u !== -1) {
              l.tagAnchor = t.fragments[u].ref;
              break;
            }
          }
        }
      }
      function Os(h, t, e) {
        var i, r;
        let s = new Lt(h, e),
          a = (i = s.METHOD) != null ? i : '',
          n = s.URI,
          l = s.hexadecimalInteger('IV'),
          o = s.KEYFORMATVERSIONS,
          d = (r = s.KEYFORMAT) != null ? r : 'identity';
        return (
          n && s.IV && !l && nt.error(`Invalid IV: ${s.IV}`),
          new ui(
            a,
            n ? te.resolve(n, t) : '',
            d,
            (o || '1').split('/').map(Number).filter(Number.isFinite),
            l,
            s.KEYID
          )
        );
      }
      function ws(h) {
        let t = new Lt(h).decimalFloatingPoint('TIME-OFFSET');
        return Y(t) ? t : null;
      }
      function xs(h, t) {
        let e = (h || '').split(/[ ,]+/).filter((i) => i);
        ['video', 'audio', 'text'].forEach((i) => {
          let r = e.filter((s) => Fi(s, i));
          r.length &&
            ((t[`${i}Codec`] = r.map((s) => s.split('/')[0]).join(',')),
            (e = e.filter((s) => r.indexOf(s) === -1)));
        }),
          (t.unknownCodecs = e);
      }
      function Ms(h, t, e) {
        let i = t[e];
        i && (h[e] = i);
      }
      function Ji(h, t, e) {
        h.rawProgramDateTime
          ? e.push(h)
          : t != null &&
            t.programDateTime &&
            (h.programDateTime = t.endProgramDateTime);
      }
      function Fs(h, t, e, i) {
        (h.relurl = t.URI),
          t.BYTERANGE && h.setByteRange(t.BYTERANGE),
          (h.level = e),
          (h.sn = 'initSegment'),
          i && (h.levelkeys = i),
          (h.initSegment = null);
      }
      function Ns(h, t, e) {
        h.levelkeys = t;
        let { encryptedFragments: i } = e;
        (!i.length || i[i.length - 1].levelkeys !== t) &&
          Object.keys(t).some((r) => t[r].isCommonEncryption) &&
          i.push(h);
      }
      function oe(h, t, e) {
        h.playlistParsingError = Error(
          `#EXT-X-${t} must not appear more than once (${e[0]})`
        );
      }
      function Us(h, t, e) {
        h.playlistParsingError = Error(
          `#EXT-X-${t} must appear before the first Media Segment (${e[0]})`
        );
      }
      function tr(h, t) {
        let e = t.startPTS;
        if (Y(e)) {
          let i,
            r = 0;
          t.sn > h.sn
            ? ((r = e - h.start), (i = h))
            : ((r = h.start - e), (i = t)),
            i.duration !== r && i.setDuration(r);
        } else
          t.sn > h.sn
            ? h.cc === t.cc && h.minEndPTS
              ? t.setStart(h.start + (h.minEndPTS - h.start))
              : t.setStart(h.start + h.duration)
            : t.setStart(Math.max(h.start - t.duration, 0));
      }
      function Bs(h, t, e, i, r, s, a) {
        let n;
        i - e <= 0 &&
          (a.warn('Fragment should have a positive duration', t),
          (i = e + t.duration),
          (s = r + t.duration));
        let l = e,
          o = i,
          d = t.startPTS,
          u = t.endPTS;
        if (Y(d)) {
          let m = Math.abs(d - e);
          h && m > h.totalduration
            ? a.warn(
                `media timestamps and playlist times differ by ${m}s for level ${t.level} ${h.url}`
              )
            : Y(t.deltaPTS)
            ? (t.deltaPTS = Math.max(m, t.deltaPTS))
            : (t.deltaPTS = m),
            (l = Math.max(e, d)),
            (e = Math.min(e, d)),
            (r = t.startDTS !== void 0 ? Math.min(r, t.startDTS) : r),
            (o = Math.min(i, u)),
            (i = Math.max(i, u)),
            (s = t.endDTS !== void 0 ? Math.max(s, t.endDTS) : s);
        }
        let c = e - t.start;
        t.start !== 0 && t.setStart(e),
          t.setDuration(i - t.start),
          (t.startPTS = e),
          (t.maxStartPTS = l),
          (t.startDTS = r),
          (t.endPTS = i),
          (t.minEndPTS = o),
          (t.endDTS = s);
        let f = t.sn;
        if (!h || f < h.startSN || f > h.endSN) return 0;
        let g = f - h.startSN,
          E = h.fragments;
        for (E[g] = t, n = g; n > 0; n--) tr(E[n], E[n - 1]);
        for (n = g; n < E.length - 1; n++) tr(E[n], E[n + 1]);
        return (
          h.fragmentHint && tr(E[E.length - 1], h.fragmentHint),
          (h.PTSKnown = h.alignedSliding = !0),
          c
        );
      }
      function $s(h, t, e, i, r) {
        return Error(`${h} ${r.url}
Playlist starting @${t.startSN}
${t.m3u8}

Playlist starting @${e.startSN}
${e.m3u8}`);
      }
      function Gs(h, t, e = !0) {
        let i = t.startSN + t.skippedSegments - h.startSN,
          r = h.fragments,
          s = i >= 0,
          a = 0;
        if (s && i < r.length) a = r[i].start;
        else if (s && t.startSN === h.endSN + 1) a = h.fragmentEnd;
        else if (s && e) a = h.fragmentStart + i * t.levelTargetDuration;
        else {
          if (t.skippedSegments || t.fragmentStart !== 0) return;
          a = h.fragmentStart;
        }
        er(t, a);
      }
      function er(h, t) {
        if (t) {
          let e = h.fragments;
          for (let i = h.skippedSegments; i < e.length; i++) e[i].addStart(t);
          h.fragmentHint && h.fragmentHint.addStart(t);
        }
      }
      function Ks(h, t = 1 / 0) {
        let e = 1e3 * h.targetduration;
        if (h.updated) {
          let i = h.fragments;
          if (i.length && 4 * e > t) {
            let r = 1e3 * i[i.length - 1].duration;
            r < e && (e = r);
          }
        } else e /= 2;
        return Math.round(e);
      }
      function Vs(h, t, e) {
        if (!h) return null;
        let i = h.fragments[t - h.startSN];
        return i || ((i = h.fragmentHint) && i.sn === t)
          ? i
          : t < h.startSN && e && e.sn === t
          ? e
          : null;
      }
      function Hs(h, t, e) {
        return h ? Ys(h.partList, t, e) : null;
      }
      function Ys(h, t, e) {
        if (h)
          for (let i = h.length; i--; ) {
            let r = h[i];
            if (r.index === e && r.fragment.sn === t) return r;
          }
        return null;
      }
      function Ws(h) {
        h.forEach((t, e) => {
          var i;
          (i = t.details) == null ||
            i.fragments.forEach((r) => {
              (r.level = e), r.initSegment && (r.initSegment.level = e);
            });
        });
      }
      function js(h) {
        return h.replace(/\?[^?]*$/, '');
      }
      function Ne(h, t) {
        for (let i = 0, r = h.length; i < r; i++) {
          var e;
          if (((e = h[i]) == null ? void 0 : e.cc) === t) return h[i];
        }
        return null;
      }
      function qs(h, t) {
        let e = h.start + t;
        (h.startPTS = e), h.setStart(e), (h.endPTS = e + h.duration);
      }
      function Xs(h, t) {
        let e = t.fragments;
        for (let i = 0, r = e.length; i < r; i++) qs(e[i], h);
        t.fragmentHint && qs(t.fragmentHint, h), (t.alignedSliding = !0);
      }
      function zs(h, t) {
        if (!t || !(h.startCC < t.endCC) || !(h.endCC > t.startCC)) return;
        let e = Math.min(t.endCC, h.endCC),
          i = Ne(t.fragments, e),
          r = Ne(h.fragments, e);
        i &&
          r &&
          (nt.log(`Aligning playlist at start of dicontinuity sequence ${e}`),
          Xs(i.start - r.start, h));
      }
      function ci(h, t) {
        let e, i;
        if (!h.hasProgramDateTime || !t.hasProgramDateTime) return;
        let r = h.fragments,
          s = t.fragments;
        if (!r.length || !s.length) return;
        let a = Math.min(t.endCC, h.endCC);
        t.startCC < a && h.startCC < a && ((e = Ne(s, a)), (i = Ne(r, a))),
          (e && i) ||
            (i =
              Ne(r, (e = s[Math.floor(s.length / 2)]).cc) ||
              r[Math.floor(r.length / 2)]);
        let n = e.programDateTime,
          l = i.programDateTime;
        n && l && Xs((l - n) / 1e3 - (i.start - e.start), h);
      }
      function Nt(h, t, e) {
        Bt(h, t, e), h.addEventListener(t, e);
      }
      function Bt(h, t, e) {
        h.removeEventListener(t, e);
      }
      let wn = {},
        N = {
          STOPPED: 'STOPPED',
          IDLE: 'IDLE',
          KEY_LOADING: 'KEY_LOADING',
          FRAG_LOADING: 'FRAG_LOADING',
          FRAG_LOADING_WAITING_RETRY: 'FRAG_LOADING_WAITING_RETRY',
          WAITING_TRACK: 'WAITING_TRACK',
          PARSING: 'PARSING',
          PARSED: 'PARSED',
          ENDED: 'ENDED',
          ERROR: 'ERROR',
          WAITING_INIT_PTS: 'WAITING_INIT_PTS',
          WAITING_LEVEL: 'WAITING_LEVEL',
        };
      class ir extends Ss {
        constructor(t, e, i, r, s) {
          super(r, t.logger),
            (this.hls = void 0),
            (this.fragPrevious = null),
            (this.fragCurrent = null),
            (this.fragmentTracker = void 0),
            (this.transmuxer = null),
            (this._state = N.STOPPED),
            (this.playlistType = void 0),
            (this.media = null),
            (this.mediaBuffer = null),
            (this.config = void 0),
            (this.bitrateTest = !1),
            (this.lastCurrentTime = 0),
            (this.nextLoadPosition = 0),
            (this.startPosition = 0),
            (this.startTimeOffset = null),
            (this.retryDate = 0),
            (this.levels = null),
            (this.fragmentLoader = void 0),
            (this.keyLoader = void 0),
            (this.levelLastLoaded = null),
            (this.startFragRequested = !1),
            (this.decrypter = void 0),
            (this.initPTS = []),
            (this.buffering = !0),
            (this.loadingParts = !1),
            (this.loopSn = void 0),
            (this.onMediaSeeking = () => {
              let {
                  config: a,
                  fragCurrent: n,
                  media: l,
                  mediaBuffer: o,
                  state: d,
                } = this,
                u = l ? l.currentTime : 0,
                c = rt.bufferInfo(o || l, u, a.maxBufferHole),
                f = !c.len;
              if (
                (this.log(
                  `Media seeking to ${Y(u) ? u.toFixed(3) : u}, state: ${d}, ${
                    f ? 'out of' : 'in'
                  } buffer`
                ),
                this.state === N.ENDED)
              )
                this.resetLoadingState();
              else if (n) {
                let g = a.maxFragLookUpTolerance,
                  E = n.start - g,
                  m = n.start + n.duration + g;
                if (f || m < c.start || E > c.end) {
                  let y = u > m;
                  (u < E || y) &&
                    (y &&
                      n.loader &&
                      (this.log(
                        `Cancelling fragment load for seek (sn: ${n.sn})`
                      ),
                      n.abortRequests(),
                      this.resetLoadingState()),
                    (this.fragPrevious = null));
                }
              }
              if (
                l &&
                (this.fragmentTracker.removeFragmentsInRange(
                  u,
                  1 / 0,
                  this.playlistType,
                  !0
                ),
                u > this.lastCurrentTime && (this.lastCurrentTime = u),
                !this.loadingParts)
              ) {
                let g = Math.max(c.end, u),
                  E = this.shouldLoadParts(this.getLevelDetails(), g);
                E &&
                  (this.log(
                    `LL-Part loading ON after seeking to ${u.toFixed(
                      2
                    )} with buffer @${g.toFixed(2)}`
                  ),
                  (this.loadingParts = E));
              }
              !this.hls.hasEnoughToStart &&
                (this.log(
                  `Setting ${
                    f ? 'startPosition' : 'nextLoadPosition'
                  } to ${u} for seek without enough to start`
                ),
                (this.nextLoadPosition = u),
                f && (this.startPosition = u)),
                f && this.state === N.IDLE && this.tickImmediate();
            }),
            (this.onMediaEnded = () => {
              this.log('setting startPosition to 0 because media ended'),
                (this.startPosition = this.lastCurrentTime = 0);
            }),
            (this.playlistType = s),
            (this.hls = t),
            (this.fragmentLoader = new kn(t.config)),
            (this.keyLoader = i),
            (this.fragmentTracker = e),
            (this.config = t.config),
            (this.decrypter = new Hi(t.config));
        }
        registerListeners() {
          let { hls: t } = this;
          t.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.on(p.ERROR, this.onError, this);
        }
        unregisterListeners() {
          let { hls: t } = this;
          t.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.off(p.ERROR, this.onError, this);
        }
        doTick() {
          this.onTickEnd();
        }
        onTickEnd() {}
        startLoad(t) {}
        stopLoad() {
          if (this.state === N.STOPPED) return;
          this.fragmentLoader.abort(), this.keyLoader.abort(this.playlistType);
          let t = this.fragCurrent;
          t != null &&
            t.loader &&
            (t.abortRequests(), this.fragmentTracker.removeFragment(t)),
            this.resetTransmuxer(),
            (this.fragCurrent = null),
            (this.fragPrevious = null),
            this.clearInterval(),
            this.clearNextTick(),
            (this.state = N.STOPPED);
        }
        get startPositionValue() {
          let { nextLoadPosition: t, startPosition: e } = this;
          return e === -1 && t ? t : e;
        }
        get bufferingEnabled() {
          return this.buffering;
        }
        pauseBuffering() {
          this.buffering = !1;
        }
        resumeBuffering() {
          this.buffering = !0;
        }
        get inFlightFrag() {
          return { frag: this.fragCurrent, state: this.state };
        }
        _streamEnded(t, e) {
          if (e.live || !this.media) return !1;
          let i = t.end || 0,
            r = this.config.timelineOffset || 0;
          if (i <= r) return !1;
          let s = t.buffered;
          this.config.maxBufferHole &&
            s &&
            s.length > 1 &&
            (t = rt.bufferedInfo(s, t.start, 0));
          let a = t.nextStart;
          if ((a && a > r && a < e.edge) || this.media.currentTime < t.start)
            return !1;
          let n = e.partList;
          if (n != null && n.length) {
            let o = n[n.length - 1];
            return rt.isBuffered(this.media, o.start + o.duration / 2);
          }
          let l = e.fragments[e.fragments.length - 1].type;
          return this.fragmentTracker.isEndListAppended(l);
        }
        getLevelDetails() {
          if (this.levels && this.levelLastLoaded !== null)
            return this.levelLastLoaded.details;
        }
        get timelineOffset() {
          let t = this.config.timelineOffset;
          if (t) {
            var e;
            return (
              ((e = this.getLevelDetails()) == null
                ? void 0
                : e.appliedTimelineOffset) || t
            );
          }
          return 0;
        }
        onMediaAttached(t, e) {
          let i = (this.media = this.mediaBuffer = e.media);
          Nt(i, 'seeking', this.onMediaSeeking),
            Nt(i, 'ended', this.onMediaEnded);
          let r = this.config;
          this.levels &&
            r.autoStartLoad &&
            this.state === N.STOPPED &&
            this.startLoad(r.startPosition);
        }
        onMediaDetaching(t, e) {
          let i = !!e.transferMedia,
            r = this.media;
          if (r !== null) {
            if (
              (r.ended &&
                (this.log('MSE detaching and video ended, reset startPosition'),
                (this.startPosition = this.lastCurrentTime = 0)),
              Bt(r, 'seeking', this.onMediaSeeking),
              Bt(r, 'ended', this.onMediaEnded),
              this.keyLoader && !i && this.keyLoader.detach(),
              (this.media = this.mediaBuffer = null),
              (this.loopSn = void 0),
              i)
            ) {
              this.resetLoadingState(), this.resetTransmuxer();
              return;
            }
            (this.loadingParts = !1),
              this.fragmentTracker.removeAllFragments(),
              this.stopLoad();
          }
        }
        onManifestLoading() {
          (this.initPTS = []),
            (this.levels = this.levelLastLoaded = this.fragCurrent = null),
            (this.lastCurrentTime = this.startPosition = 0),
            (this.startFragRequested = !1);
        }
        onError(t, e) {}
        onManifestLoaded(t, e) {
          this.startTimeOffset = e.startTimeOffset;
        }
        onHandlerDestroying() {
          this.stopLoad(),
            this.transmuxer &&
              (this.transmuxer.destroy(), (this.transmuxer = null)),
            super.onHandlerDestroying(),
            (this.hls = this.onMediaSeeking = this.onMediaEnded = null);
        }
        onHandlerDestroyed() {
          (this.state = N.STOPPED),
            this.fragmentLoader && this.fragmentLoader.destroy(),
            this.keyLoader && this.keyLoader.destroy(),
            this.decrypter && this.decrypter.destroy(),
            (this.hls =
              this.log =
              this.warn =
              this.decrypter =
              this.keyLoader =
              this.fragmentLoader =
              this.fragmentTracker =
                null),
            super.onHandlerDestroyed();
        }
        loadFragment(t, e, i) {
          (this.startFragRequested = !0), this._loadFragForPlayback(t, e, i);
        }
        _loadFragForPlayback(t, e, i) {
          this._doFragLoad(t, e, i, (r) => {
            let s = r.frag;
            if (this.fragContextChanged(s)) {
              this.warn(
                `${s.type} sn: ${s.sn}${
                  r.part ? ' part: ' + r.part.index : ''
                } of ${this.fragInfo(
                  s,
                  !1,
                  r.part
                )}) was dropped during download.`
              ),
                this.fragmentTracker.removeFragment(s);
              return;
            }
            s.stats.chunkCount++, this._handleFragmentLoadProgress(r);
          })
            .then((r) => {
              if (!r) return;
              let s = this.state,
                a = r.frag;
              if (this.fragContextChanged(a)) {
                (s !== N.FRAG_LOADING &&
                  (this.fragCurrent || s !== N.PARSING)) ||
                  (this.fragmentTracker.removeFragment(a),
                  (this.state = N.IDLE));
                return;
              }
              'payload' in r &&
                (this.log(
                  `Loaded ${a.type} sn: ${a.sn} of ${this.playlistLabel()} ${
                    a.level
                  }`
                ),
                this.hls.trigger(p.FRAG_LOADED, r)),
                this._handleFragmentLoadComplete(r);
            })
            .catch((r) => {
              this.state !== N.STOPPED &&
                this.state !== N.ERROR &&
                (this.warn(`Frag error: ${r?.message || r}`),
                this.resetFragmentLoading(t));
            });
        }
        clearTrackerIfNeeded(t) {
          var e;
          let { fragmentTracker: i } = this;
          if (i.getState(t) === xt.APPENDING) {
            let r = t.type,
              s = this.getFwdBufferInfo(this.mediaBuffer, r),
              a = Math.max(t.duration, s ? s.len : this.config.maxBufferLength),
              n = this.backtrackFragment;
            ((n ? t.sn - n.sn : 0) == 1 ||
              this.reduceMaxBufferLength(a, t.duration)) &&
              i.removeFragment(t);
          } else
            ((e = this.mediaBuffer) == null ? void 0 : e.buffered.length) === 0
              ? i.removeAllFragments()
              : i.hasParts(t.type) &&
                (i.detectPartialFragments({
                  frag: t,
                  part: null,
                  stats: t.stats,
                  id: t.type,
                }),
                i.getState(t) === xt.PARTIAL && i.removeFragment(t));
        }
        checkLiveUpdate(t) {
          if (t.updated && !t.live) {
            let e = t.fragments[t.fragments.length - 1];
            this.fragmentTracker.detectPartialFragments({
              frag: e,
              part: null,
              stats: e.stats,
              id: e.type,
            });
          }
          t.fragments[0] || (t.deltaUpdateFailed = !0);
        }
        waitForLive(t) {
          let e = t.details;
          return (
            e?.live &&
            e.type !== 'EVENT' &&
            (this.levelLastLoaded !== t || e.expired)
          );
        }
        flushMainBuffer(t, e, i = null) {
          t - e &&
            this.hls.trigger(p.BUFFER_FLUSHING, {
              startOffset: t,
              endOffset: e,
              type: i,
            });
        }
        _loadInitSegment(t, e) {
          this._doFragLoad(t, e)
            .then((i) => {
              let r = i?.frag;
              if (!r || this.fragContextChanged(r) || !this.levels)
                throw Error('init load aborted');
              return i;
            })
            .then((i) => {
              let { hls: r } = this,
                { frag: s, payload: a } = i,
                n = s.decryptdata;
              if (
                a &&
                a.byteLength > 0 &&
                n != null &&
                n.key &&
                n.iv &&
                Re(n.method)
              ) {
                let l = F.performance.now();
                return this.decrypter
                  .decrypt(
                    new Uint8Array(a),
                    n.key.buffer,
                    n.iv.buffer,
                    qi(n.method)
                  )
                  .catch((o) => {
                    throw (
                      (r.trigger(p.ERROR, {
                        type: Q.MEDIA_ERROR,
                        details: b.FRAG_DECRYPT_ERROR,
                        fatal: !1,
                        error: o,
                        reason: o.message,
                        frag: s,
                      }),
                      o)
                    );
                  })
                  .then((o) => {
                    let d = F.performance.now();
                    return (
                      r.trigger(p.FRAG_DECRYPTED, {
                        frag: s,
                        payload: o,
                        stats: { tstart: l, tdecrypt: d },
                      }),
                      (i.payload = o),
                      this.completeInitSegmentLoad(i)
                    );
                  });
              }
              return this.completeInitSegmentLoad(i);
            })
            .catch((i) => {
              this.state !== N.STOPPED &&
                this.state !== N.ERROR &&
                (this.warn(i), this.resetFragmentLoading(t));
            });
        }
        completeInitSegmentLoad(t) {
          let { levels: e } = this;
          if (!e) throw Error('init load aborted, missing levels');
          let i = t.frag.stats;
          this.state !== N.STOPPED && (this.state = N.IDLE),
            (t.frag.data = new Uint8Array(t.payload)),
            (i.parsing.start = i.buffering.start = F.performance.now()),
            (i.parsing.end = i.buffering.end = F.performance.now()),
            this.tick();
        }
        unhandledEncryptionError(t, e) {
          var i, r;
          let s = t.tracks;
          if (
            s &&
            !e.encrypted &&
            (((i = s.audio) != null && i.encrypted) ||
              ((r = s.video) != null && r.encrypted)) &&
            (!this.config.emeEnabled || !this.keyLoader.emeController)
          ) {
            let a = this.media,
              n = Error(
                `Encrypted track with no key in ${this.fragInfo(e)} (media ${
                  a ? 'attached mediaKeys: ' + a.mediaKeys : 'detached'
                })`
              );
            return (
              this.warn(n.message),
              !!a &&
                !a.mediaKeys &&
                (this.hls.trigger(p.ERROR, {
                  type: Q.KEY_SYSTEM_ERROR,
                  details: b.KEY_SYSTEM_NO_KEYS,
                  fatal: !1,
                  error: n,
                  frag: e,
                }),
                this.resetTransmuxer(),
                !0)
            );
          }
          return !1;
        }
        fragContextChanged(t) {
          let { fragCurrent: e } = this;
          return !t || !e || t.sn !== e.sn || t.level !== e.level;
        }
        fragBufferedComplete(t, e) {
          let i = this.mediaBuffer ? this.mediaBuffer : this.media;
          if (
            (this.log(
              `Buffered ${t.type} sn: ${t.sn}${
                e ? ' part: ' + e.index : ''
              } of ${this.fragInfo(t, !1, e)} > buffer:${
                i ? wn.toString(rt.getBuffered(i)) : '(detached)'
              })`
            ),
            _t(t))
          ) {
            var r;
            if (t.type !== j.SUBTITLE) {
              let a = t.elementaryStreams;
              if (!Object.keys(a).some((n) => !!a[n])) {
                this.state = N.IDLE;
                return;
              }
            }
            let s = (r = this.levels) == null ? void 0 : r[t.level];
            s != null &&
              s.fragmentError &&
              (this.log(
                `Resetting level fragment error count of ${s.fragmentError} on frag buffered`
              ),
              (s.fragmentError = 0));
          }
          this.state = N.IDLE;
        }
        _handleFragmentLoadComplete(t) {
          let { transmuxer: e } = this;
          if (!e) return;
          let { frag: i, part: r, partsLoaded: s } = t,
            a = !s || s.length === 0 || s.some((l) => !l),
            n = new Yi(
              i.level,
              i.sn,
              i.stats.chunkCount + 1,
              0,
              r ? r.index : -1,
              !a
            );
          e.flush(n);
        }
        _handleFragmentLoadProgress(t) {}
        _doFragLoad(t, e, i = null, r) {
          var s, a;
          let n;
          this.fragCurrent = t;
          let l = e.details;
          if (!this.levels || !l)
            throw Error(
              `frag load aborted, missing level${l ? '' : ' detail'}s`
            );
          let o = null;
          if (t.encrypted && !((s = t.decryptdata) != null && s.key)) {
            if (
              (this.log(
                `Loading key for ${t.sn} of [${l.startSN}-${
                  l.endSN
                }], ${this.playlistLabel()} ${t.level}`
              ),
              (this.state = N.KEY_LOADING),
              (this.fragCurrent = t),
              (o = this.keyLoader.load(t).then((c) => {
                if (!this.fragContextChanged(c.frag))
                  return (
                    this.hls.trigger(p.KEY_LOADED, c),
                    this.state === N.KEY_LOADING && (this.state = N.IDLE),
                    c
                  );
              })),
              this.hls.trigger(p.KEY_LOADING, { frag: t }),
              this.fragCurrent === null)
            )
              return (
                this.log('context changed in KEY_LOADING'),
                Promise.resolve(null)
              );
          } else
            !t.encrypted &&
              (o = this.keyLoader.loadClear(
                t,
                l.encryptedFragments,
                this.startFragRequested
              )) &&
              this.log('[eme] blocking frag load until media-keys acquired');
          let d = this.fragPrevious;
          if (_t(t) && (!d || t.sn !== d.sn)) {
            let c = this.shouldLoadParts(e.details, t.end);
            c !== this.loadingParts &&
              (this.log(
                `LL-Part loading ${c ? 'ON' : 'OFF'} loading sn ${d?.sn}->${
                  t.sn
                }`
              ),
              (this.loadingParts = c));
          }
          if (((i = Math.max(t.start, i || 0)), this.loadingParts && _t(t))) {
            let c = l.partList;
            if (c && r) {
              i > l.fragmentEnd && l.fragmentHint && (t = l.fragmentHint);
              let f = this.getNextPart(c, t, i);
              if (f > -1) {
                let g,
                  E = c[f];
                return (
                  (t = this.fragCurrent = E.fragment),
                  this.log(
                    `Loading ${t.type} sn: ${t.sn} part: ${E.index} (${f}/${
                      c.length - 1
                    }) of ${this.fragInfo(t, !1, E)}) cc: ${t.cc} [${
                      l.startSN
                    }-${l.endSN}], target: ${parseFloat(i.toFixed(3))}`
                  ),
                  (this.nextLoadPosition = E.start + E.duration),
                  (this.state = N.FRAG_LOADING),
                  (g = o
                    ? o
                        .then((m) =>
                          !m || this.fragContextChanged(m.frag)
                            ? null
                            : this.doFragPartsLoad(t, E, e, r)
                        )
                        .catch((m) => this.handleFragLoadError(m))
                    : this.doFragPartsLoad(t, E, e, r).catch((m) =>
                        this.handleFragLoadError(m)
                      )),
                  this.hls.trigger(p.FRAG_LOADING, {
                    frag: t,
                    part: E,
                    targetBufferTime: i,
                  }),
                  this.fragCurrent === null
                    ? Promise.reject(
                        Error(
                          'frag load aborted, context changed in FRAG_LOADING parts'
                        )
                      )
                    : g
                );
              }
              if (!t.url || this.loadedEndOfParts(c, i))
                return Promise.resolve(null);
            }
          }
          if (_t(t) && this.loadingParts)
            this.log(
              `LL-Part loading OFF after next part miss @${i.toFixed(
                2
              )} Check buffer at sn: ${t.sn} loaded parts: ${
                (a = l.partList) == null
                  ? void 0
                  : a
                      .filter((c) => c.loaded)
                      .map((c) => `[${c.start}-${c.end}]`)
              }`
            ),
              (this.loadingParts = !1);
          else if (!t.url) return Promise.resolve(null);
          this.log(
            `Loading ${t.type} sn: ${t.sn} of ${this.fragInfo(t, !1)}) cc: ${
              t.cc
            } ${'[' + l.startSN + '-' + l.endSN + ']'}, target: ${parseFloat(
              i.toFixed(3)
            )}`
          ),
            Y(t.sn) &&
              !this.bitrateTest &&
              (this.nextLoadPosition = t.start + t.duration),
            (this.state = N.FRAG_LOADING);
          let u = this.config.progressive;
          return (
            (n =
              u && o
                ? o
                    .then((c) =>
                      !c || this.fragContextChanged(c.frag)
                        ? null
                        : this.fragmentLoader.load(t, r)
                    )
                    .catch((c) => this.handleFragLoadError(c))
                : Promise.all([this.fragmentLoader.load(t, u ? r : void 0), o])
                    .then(([c]) => (!u && r && r(c), c))
                    .catch((c) => this.handleFragLoadError(c))),
            this.hls.trigger(p.FRAG_LOADING, { frag: t, targetBufferTime: i }),
            this.fragCurrent === null
              ? Promise.reject(
                  Error('frag load aborted, context changed in FRAG_LOADING')
                )
              : n
          );
        }
        doFragPartsLoad(t, e, i, r) {
          return new Promise((s, a) => {
            var n;
            let l = [],
              o = (n = i.details) == null ? void 0 : n.partList,
              d = (u) => {
                this.fragmentLoader
                  .loadPart(t, u, r)
                  .then((c) => {
                    l[u.index] = c;
                    let f = c.part;
                    this.hls.trigger(p.FRAG_LOADED, c);
                    let g =
                      Hs(i.details, t.sn, u.index + 1) ||
                      Ys(o, t.sn, u.index + 1);
                    if (!g) return s({ frag: t, part: f, partsLoaded: l });
                    d(g);
                  })
                  .catch(a);
              };
            d(e);
          });
        }
        handleFragLoadError(t) {
          if ('data' in t) {
            let e = t.data;
            e.frag && e.details === b.INTERNAL_ABORTED
              ? this.handleFragLoadAborted(e.frag, e.part)
              : e.frag && e.type === Q.KEY_SYSTEM_ERROR
              ? (e.frag.abortRequests(), this.resetFragmentLoading(e.frag))
              : this.hls.trigger(p.ERROR, e);
          } else
            this.hls.trigger(p.ERROR, {
              type: Q.OTHER_ERROR,
              details: b.INTERNAL_EXCEPTION,
              err: t,
              error: t,
              fatal: !0,
            });
          return null;
        }
        _handleTransmuxerFlush(t) {
          let e = this.getCurrentContext(t);
          if (!e || this.state !== N.PARSING) {
            this.fragCurrent ||
              this.state === N.STOPPED ||
              this.state === N.ERROR ||
              (this.state = N.IDLE);
            return;
          }
          let { frag: i, part: r, level: s } = e,
            a = F.performance.now();
          (i.stats.parsing.end = a), r && (r.stats.parsing.end = a);
          let n = this.getLevelDetails(),
            l = (n && i.sn > n.endSN) || this.shouldLoadParts(n, i.end);
          l !== this.loadingParts &&
            (this.log(
              `LL-Part loading ${
                l ? 'ON' : 'OFF'
              } after parsing segment ending @${i.end.toFixed(2)}`
            ),
            (this.loadingParts = l)),
            this.updateLevelTiming(i, r, s, t.partial);
        }
        shouldLoadParts(t, e) {
          if (this.config.lowLatencyMode) {
            if (!t) return this.loadingParts;
            if (t.partList) {
              var i, r;
              let s = t.partList[0];
              if (s.fragment.type === j.SUBTITLE) return !1;
              if (
                e >=
                  s.end +
                    (((i = t.fragmentHint) == null ? void 0 : i.duration) ||
                      0) &&
                (this.hls.hasEnoughToStart
                  ? ((r = this.media) == null ? void 0 : r.currentTime) ||
                    this.lastCurrentTime
                  : this.getLoadPosition()) >
                  s.start - s.fragment.duration
              )
                return !0;
            }
          }
          return !1;
        }
        getCurrentContext(t) {
          let { levels: e, fragCurrent: i } = this,
            { level: r, sn: s, part: a } = t;
          if (!(e != null && e[r]))
            return (
              this.warn(
                `Levels object was unset while buffering fragment ${s} of ${this.playlistLabel()} ${r}. The current chunk will not be buffered.`
              ),
              null
            );
          let n = e[r],
            l = n.details,
            o = a > -1 ? Hs(l, s, a) : null,
            d = o ? o.fragment : Vs(l, s, i);
          return d
            ? (i && i !== d && (d.stats = i.stats),
              { frag: d, part: o, level: n })
            : null;
        }
        bufferFragmentData(t, e, i, r, s) {
          if (this.state !== N.PARSING) return;
          let { data1: a, data2: n } = t,
            l = a;
          if ((n && (l = Wt(a, n)), !l.length)) return;
          let o = this.initPTS[e.cc],
            d = o ? -o.baseTime / o.timescale : void 0,
            u = {
              type: t.type,
              frag: e,
              part: i,
              chunkMeta: r,
              offset: d,
              parent: e.type,
              data: l,
            };
          if (
            (this.hls.trigger(p.BUFFER_APPENDING, u),
            t.dropped && t.independent && !i)
          ) {
            if (s) return;
            this.flushBufferGap(e);
          }
        }
        flushBufferGap(t) {
          let e = this.media;
          if (!e) return;
          if (!rt.isBuffered(e, e.currentTime)) {
            this.flushMainBuffer(0, t.start);
            return;
          }
          let i = e.currentTime,
            r = rt.bufferInfo(e, i, 0),
            s = t.duration,
            a = Math.min(2 * this.config.maxFragLookUpTolerance, 0.25 * s),
            n = Math.max(Math.min(t.start - a, r.end - a), i + a);
          t.start - n > a && this.flushMainBuffer(n, t.start);
        }
        getFwdBufferInfo(t, e) {
          var i;
          let r = this.getLoadPosition();
          if (!Y(r)) return null;
          let s =
            this.lastCurrentTime > r || ((i = this.media) != null && i.paused)
              ? 0
              : this.config.maxBufferHole;
          return this.getFwdBufferInfoAtPos(t, r, e, s);
        }
        getFwdBufferInfoAtPos(t, e, i, r) {
          let s = rt.bufferInfo(t, e, r);
          if (s.len === 0 && s.nextStart !== void 0) {
            let a = this.fragmentTracker.getBufferedFrag(e, i);
            if (a && (s.nextStart <= a.end || a.gap)) {
              let n = Math.max(Math.min(s.nextStart, a.end) - e, r);
              return rt.bufferInfo(t, e, n);
            }
          }
          return s;
        }
        getMaxBufferLength(t) {
          let { config: e } = this;
          return Math.min(
            t
              ? Math.max((8 * e.maxBufferSize) / t, e.maxBufferLength)
              : e.maxBufferLength,
            e.maxMaxBufferLength
          );
        }
        reduceMaxBufferLength(t, e) {
          let i = this.config,
            r = Math.max(Math.min(t - e, i.maxBufferLength), e),
            s = Math.max(t - 3 * e, i.maxMaxBufferLength / 2, r);
          return (
            s >= r &&
            ((i.maxMaxBufferLength = s),
            this.warn(`Reduce max buffer length to ${s}s`),
            !0)
          );
        }
        getAppendedFrag(t, e = j.MAIN) {
          let i = this.fragmentTracker
            ? this.fragmentTracker.getAppendedFrag(t, e)
            : null;
          return i && 'fragment' in i ? i.fragment : i;
        }
        getNextFragment(t, e) {
          let i = e.fragments,
            r = i.length;
          if (!r) return null;
          let { config: s } = this,
            a = i[0].start,
            n = s.lowLatencyMode && !!e.partList,
            l = null;
          if (e.live) {
            let u = s.initialLiveManifestSize;
            if (r < u)
              return (
                this.warn(
                  `Not enough fragments to start playback (have: ${r}, need: ${u})`
                ),
                null
              );
            if (
              (!e.PTSKnown &&
                !this.startFragRequested &&
                this.startPosition === -1) ||
              t < a
            ) {
              var o;
              n &&
                !this.loadingParts &&
                (this.log('LL-Part loading ON for initial live fragment'),
                (this.loadingParts = !0)),
                (l = this.getInitialLiveFragment(e));
              let c = this.hls.startPosition,
                f = this.hls.liveSyncPosition,
                g = l ? (c !== -1 && c >= a ? c : f) || l.start : t;
              this.log(
                `Setting startPosition to ${g} to match start frag at live edge. mainStart: ${c} liveSyncPosition: ${f} frag.start: ${
                  (o = l) == null ? void 0 : o.start
                }`
              ),
                (this.startPosition = this.nextLoadPosition = g);
            }
          } else t <= a && (l = i[0]);
          if (!l) {
            let u = this.loadingParts ? e.partEnd : e.fragmentEnd;
            l = this.getFragmentAtPosition(t, u, e);
          }
          let d = this.filterReplacedPrimary(l, e);
          if (!d && l) {
            let u = l.sn - e.startSN;
            d = this.filterReplacedPrimary(i[u + 1] || null, e);
          }
          return this.mapToInitFragWhenRequired(d);
        }
        isLoopLoading(t, e) {
          let i = this.fragmentTracker.getState(t);
          return (
            (i === xt.OK || (i === xt.PARTIAL && !!t.gap)) &&
            this.nextLoadPosition > e
          );
        }
        getNextFragmentLoopLoading(t, e, i, r, s) {
          let a = null;
          if (
            t.gap &&
            (a = this.getNextFragment(this.nextLoadPosition, e)) &&
            !a.gap &&
            i.nextStart
          ) {
            let n = this.getFwdBufferInfoAtPos(
              this.mediaBuffer ? this.mediaBuffer : this.media,
              i.nextStart,
              r,
              0
            );
            if (n !== null && i.len + n.len >= s) {
              let l = a.sn;
              return (
                this.loopSn !== l &&
                  (this.log(
                    `buffer full after gaps in "${r}" playlist starting at sn: ${l}`
                  ),
                  (this.loopSn = l)),
                null
              );
            }
          }
          return (this.loopSn = void 0), a;
        }
        get primaryPrefetch() {
          if (Qs(this.config)) {
            var t;
            if (
              !(
                (t = this.hls.interstitialsManager) == null ||
                (t = t.playingItem) == null
              ) &&
              t.event
            )
              return !0;
          }
          return !1;
        }
        filterReplacedPrimary(t, e) {
          if (!t) return t;
          if (Qs(this.config) && t.type !== j.SUBTITLE) {
            let i = this.hls.interstitialsManager,
              r = i?.bufferingItem;
            if (r) {
              let a = r.event;
              if (a) {
                if (
                  a.appendInPlace ||
                  Math.abs(t.start - r.start) > 1 ||
                  r.start === 0
                )
                  return null;
              } else if (
                (t.end <= r.start && e?.live === !1) ||
                (t.start > r.end &&
                  r.nextEvent &&
                  (r.nextEvent.appendInPlace || t.start - r.end > 1))
              )
                return null;
            }
            let s = i?.playerQueue;
            if (s)
              for (let a = s.length; a--; ) {
                let n = s[a].interstitial;
                if (
                  n.appendInPlace &&
                  t.start >= n.startTime &&
                  t.end <= n.resumeTime
                )
                  return null;
              }
          }
          return t;
        }
        mapToInitFragWhenRequired(t) {
          return t == null ||
            !t.initSegment ||
            t.initSegment.data ||
            this.bitrateTest
            ? t
            : t.initSegment;
        }
        getNextPart(t, e, i) {
          let r = -1,
            s = !1,
            a = !0;
          for (let n = 0, l = t.length; n < l; n++) {
            let o = t[n];
            if (((a = a && !o.independent), r > -1 && i < o.start)) break;
            let d = o.loaded;
            d
              ? (r = -1)
              : (s || ((o.independent || a) && o.fragment === e)) &&
                (o.fragment !== e &&
                  this.warn(
                    `Need buffer at ${i} but next unloaded part starts at ${o.start}`
                  ),
                (r = n)),
              (s = d);
          }
          return r;
        }
        loadedEndOfParts(t, e) {
          let i;
          for (let r = t.length; r-- && (i = t[r]).loaded; )
            if (e > i.start) return !0;
          return !1;
        }
        getInitialLiveFragment(t) {
          let e = t.fragments,
            i = this.fragPrevious,
            r = null;
          if (i) {
            if (
              (t.hasProgramDateTime &&
                (this.log(
                  `Live playlist, switching playlist, load frag with same PDT: ${i.programDateTime}`
                ),
                (r = (function (s, a, n) {
                  if (
                    a === null ||
                    !Array.isArray(s) ||
                    !s.length ||
                    !Y(a) ||
                    a < (s[0].programDateTime || 0) ||
                    a >= (s[s.length - 1].endProgramDateTime || 0)
                  )
                    return null;
                  for (let l = 0; l < s.length; ++l) {
                    let o = s[l];
                    if (
                      (function (d, u, c) {
                        let f =
                          1e3 *
                          Math.min(
                            u,
                            c.duration + (c.deltaPTS ? c.deltaPTS : 0)
                          );
                        return (c.endProgramDateTime || 0) - f > d;
                      })(a, n, o)
                    )
                      return o;
                  }
                  return null;
                })(
                  e,
                  i.endProgramDateTime,
                  this.config.maxFragLookUpTolerance
                ))),
              !r)
            ) {
              let s = i.sn + 1;
              if (s >= t.startSN && s <= t.endSN) {
                let a = e[s - t.startSN];
                i.cc === a.cc &&
                  ((r = a),
                  this.log(
                    `Live playlist, switching playlist, load frag with next SN: ${r.sn}`
                  ));
              }
              !r &&
                (r = ms(t, i.cc, i.end)) &&
                this.log(
                  `Live playlist, switching playlist, load frag with same CC: ${r.sn}`
                );
            }
          } else {
            let s = this.hls.liveSyncPosition;
            s !== null &&
              (r = this.getFragmentAtPosition(
                s,
                this.bitrateTest ? t.fragmentEnd : t.edge,
                t
              ));
          }
          return r;
        }
        getFragmentAtPosition(t, e, i) {
          let r,
            { config: s } = this,
            { fragPrevious: a } = this,
            { fragments: n, endSN: l } = i,
            { fragmentHint: o } = i,
            { maxFragLookUpTolerance: d } = s,
            u = i.partList,
            c = !!(this.loadingParts && u != null && u.length && o);
          if (
            (c &&
              !this.bitrateTest &&
              u[u.length - 1].fragment.sn === o.sn &&
              ((n = n.concat(o)), (l = o.sn)),
            t < e)
          ) {
            var f;
            let g =
              t < this.lastCurrentTime ||
              t > e - d ||
              ((f = this.media) != null && f.paused) ||
              !this.startFragRequested
                ? 0
                : d;
            r = pe(a, n, t, g);
          } else r = n[n.length - 1];
          if (r) {
            let g = r.sn - i.startSN,
              E = this.fragmentTracker.getState(r);
            if (
              ((E === xt.OK || (E === xt.PARTIAL && r.gap)) && (a = r),
              a &&
                r.sn === a.sn &&
                (!c || u[0].fragment.sn > r.sn || !i.live) &&
                r.level === a.level)
            ) {
              let m = n[g + 1];
              r =
                r.sn < l && this.fragmentTracker.getState(m) !== xt.OK
                  ? m
                  : null;
            }
          }
          return r;
        }
        alignPlaylists(t, e, i) {
          let r = t.fragments.length;
          if (!r) return this.warn('No fragments in live playlist'), 0;
          let s = t.fragmentStart,
            a = t.alignedSliding && Y(s);
          if (!e || (!a && !s)) {
            i &&
              (zs(t, i),
              t.alignedSliding || ci(t, i),
              t.alignedSliding || t.skippedSegments || Gs(i, t, !1));
            let n = t.fragmentStart;
            return (
              this.log(
                `Live playlist sliding: ${n.toFixed(2)} start-sn: ${
                  e ? e.startSN : 'na'
                }->${t.startSN} fragments: ${r}`
              ),
              n
            );
          }
          return s;
        }
        waitForCdnTuneIn(t) {
          return (
            t.live &&
            t.canBlockReload &&
            t.partTarget &&
            t.tuneInGoal > Math.max(t.partHoldBack, 3 * t.partTarget)
          );
        }
        setStartPosition(t, e) {
          let i = this.startPosition;
          i < e && (i = -1);
          let r = this.timelineOffset;
          if (i === -1) {
            let s = this.startTimeOffset !== null,
              a = s ? this.startTimeOffset : t.startTimeOffset;
            a !== null && Y(a)
              ? ((i = e + a),
                a < 0 && (i += t.edge),
                (i = Math.min(Math.max(e, i), e + t.totalduration)),
                this.log(
                  `Setting startPosition to ${i} for start time offset ${a} found in ${
                    s ? 'multivariant' : 'media'
                  } playlist`
                ),
                (this.startPosition = i))
              : t.live
              ? ((i = this.hls.liveSyncPosition || e),
                this.log(
                  `Setting startPosition to -1 to start at live edge ${i}`
                ),
                (this.startPosition = -1))
              : (this.log('setting startPosition to 0 by default'),
                (this.startPosition = i = 0)),
              (this.lastCurrentTime = i + r);
          }
          this.nextLoadPosition = i + r;
        }
        getLoadPosition() {
          var t;
          let { media: e } = this,
            i = 0;
          return (
            (t = this.hls) != null && t.hasEnoughToStart && e
              ? (i = e.currentTime)
              : this.nextLoadPosition >= 0 && (i = this.nextLoadPosition),
            i
          );
        }
        handleFragLoadAborted(t, e) {
          this.transmuxer &&
            t.type === this.playlistType &&
            _t(t) &&
            t.stats.aborted &&
            (this.log(
              `Fragment ${t.sn}${
                e ? ' part ' + e.index : ''
              } of ${this.playlistLabel()} ${t.level} was aborted`
            ),
            this.resetFragmentLoading(t));
        }
        resetFragmentLoading(t) {
          (this.fragCurrent &&
            (this.fragContextChanged(t) ||
              this.state === N.FRAG_LOADING_WAITING_RETRY)) ||
            (this.state = N.IDLE);
        }
        onFragmentOrKeyLoadError(t, e) {
          var i, r, s;
          if (e.chunkMeta && !e.frag) {
            let y = this.getCurrentContext(e.chunkMeta);
            y && (e.frag = y.frag);
          }
          let a = e.frag;
          if (!a || a.type !== t || !this.levels) return;
          if (this.fragContextChanged(a)) {
            this.warn(
              `Frag load error must match current frag to retry ${a.url} > ${
                (r = this.fragCurrent) == null ? void 0 : r.url
              }`
            );
            return;
          }
          let n = e.details === b.FRAG_GAP;
          n && this.fragmentTracker.fragBuffered(a, !0);
          let l = e.errorAction;
          if (!l) {
            this.state = N.ERROR;
            return;
          }
          let { action: o, flags: d, retryCount: u = 0, retryConfig: c } = l,
            f = !!c,
            g = f && o === Ft.RetryRequest,
            E = f && !l.resolved && d === Kt.MoveAllAlternatesMatchingHost,
            m = (i = this.hls.latestLevelDetails) == null ? void 0 : i.live;
          if (!g && E && _t(a) && !a.endList && m)
            this.resetFragmentErrors(t), this.treatAsGap(a), (l.resolved = !0);
          else if ((g || E) && u < c.maxNumRetry) {
            let y = Vi((s = e.response) == null ? void 0 : s.code),
              S = Ki(c, u);
            if (
              (this.resetStartWhenNotLoaded(),
              (this.retryDate = F.performance.now() + S),
              (this.state = N.FRAG_LOADING_WAITING_RETRY),
              (l.resolved = !0),
              y)
            ) {
              this.log('Waiting for connection (offline)'),
                (this.retryDate = 1 / 0),
                (e.reason = 'offline');
              return;
            }
            this.warn(
              `Fragment ${a.sn} of ${t} ${a.level} errored with ${
                e.details
              }, retrying loading ${u + 1}/${c.maxNumRetry} in ${S}ms`
            );
          } else if (c)
            if ((this.resetFragmentErrors(t), u < c.maxNumRetry))
              n || o === Ft.RemoveAlternatePermanently || (l.resolved = !0);
            else {
              this.warn(`${e.details} reached or exceeded max retry (${u})`);
              return;
            }
          else
            o === Ft.SendAlternateToPenaltyBox
              ? (this.state = N.WAITING_LEVEL)
              : (this.state = N.ERROR);
          this.tickImmediate();
        }
        checkRetryDate() {
          let t = F.performance.now(),
            e = this.retryDate,
            i = e === 1 / 0;
          (!e || t >= e || (i && !Vi(0))) &&
            (i && this.log('Connection restored (online)'),
            this.resetStartWhenNotLoaded(),
            (this.state = N.IDLE));
        }
        reduceLengthAndFlushBuffer(t) {
          if (this.state === N.PARSING || this.state === N.PARSED) {
            let e = t.frag,
              i = t.parent,
              r = this.getFwdBufferInfo(this.mediaBuffer, i),
              s = r && r.len > 0.5;
            s && this.reduceMaxBufferLength(r.len, e?.duration || 10);
            let a = !s;
            return (
              a &&
                this.warn(
                  `Buffer full error while media.currentTime (${this.getLoadPosition()}) is not buffered, flush ${i} buffer`
                ),
              e &&
                (this.fragmentTracker.removeFragment(e),
                (this.nextLoadPosition = e.start)),
              this.resetLoadingState(),
              a
            );
          }
          return !1;
        }
        resetFragmentErrors(t) {
          t === j.AUDIO && (this.fragCurrent = null),
            this.hls.hasEnoughToStart || (this.startFragRequested = !1),
            this.state !== N.STOPPED && (this.state = N.IDLE);
        }
        afterBufferFlushed(t, e, i) {
          if (!t) return;
          let r = rt.getBuffered(t);
          this.fragmentTracker.detectEvictedFragments(e, r, i),
            this.state === N.ENDED && this.resetLoadingState();
        }
        resetLoadingState() {
          this.log('Reset loading state'),
            (this.fragCurrent = null),
            (this.fragPrevious = null),
            this.state !== N.STOPPED && (this.state = N.IDLE);
        }
        resetStartWhenNotLoaded() {
          if (!this.hls.hasEnoughToStart) {
            this.startFragRequested = !1;
            let t = this.levelLastLoaded,
              e = t ? t.details : null;
            e != null && e.live
              ? (this.log('resetting startPosition for live start'),
                (this.startPosition = -1),
                this.setStartPosition(e, e.fragmentStart),
                this.resetLoadingState())
              : (this.nextLoadPosition = this.startPosition);
          }
        }
        resetWhenMissingContext(t) {
          this.log(
            `Loading context changed while buffering sn ${
              t.sn
            } of ${this.playlistLabel()} ${
              t.level === -1 ? '<removed>' : t.level
            }. This chunk will not be buffered.`
          ),
            this.removeUnbufferedFrags(),
            this.resetStartWhenNotLoaded(),
            this.resetLoadingState();
        }
        removeUnbufferedFrags(t = 0) {
          this.fragmentTracker.removeFragmentsInRange(
            t,
            1 / 0,
            this.playlistType,
            !1,
            !0
          );
        }
        updateLevelTiming(t, e, i, r) {
          let s = i.details;
          if (!s) {
            this.warn('level.details undefined');
            return;
          }
          if (
            !Object.keys(t.elementaryStreams).reduce((n, l) => {
              let o = t.elementaryStreams[l];
              if (o) {
                let d = o.endPTS - o.startPTS;
                if (d <= 0)
                  return (
                    this.warn(
                      `Could not parse fragment ${t.sn} ${l} duration reliably (${d})`
                    ),
                    n || !1
                  );
                let u = r
                  ? 0
                  : Bs(s, t, o.startPTS, o.endPTS, o.startDTS, o.endDTS, this);
                return (
                  this.hls.trigger(p.LEVEL_PTS_UPDATED, {
                    details: s,
                    level: i,
                    drift: u,
                    type: l,
                    frag: t,
                    start: o.startPTS,
                    end: o.endPTS,
                  }),
                  !0
                );
              }
              return n;
            }, !1)
          ) {
            var a;
            if (
              (i.fragmentError === 0 && this.treatAsGap(t, i),
              ((a = this.transmuxer) == null ? void 0 : a.error) === null)
            ) {
              let n = Error(
                `Found no media in fragment ${
                  t.sn
                } of ${this.playlistLabel()} ${
                  t.level
                } resetting transmuxer to fallback to playlist timing`
              );
              if (
                (this.warn(n.message),
                this.hls.trigger(p.ERROR, {
                  type: Q.MEDIA_ERROR,
                  details: b.FRAG_PARSING_ERROR,
                  fatal: !1,
                  error: n,
                  frag: t,
                  reason: `Found no media in msn ${
                    t.sn
                  } of ${this.playlistLabel()} "${i.url}"`,
                }),
                !this.hls)
              )
                return;
              this.resetTransmuxer();
            }
          }
          (this.state = N.PARSED),
            this.log(
              `Parsed ${t.type} sn: ${t.sn}${
                e ? ' part: ' + e.index : ''
              } of ${this.fragInfo(t, !1, e)})`
            ),
            this.hls.trigger(p.FRAG_PARSED, { frag: t, part: e });
        }
        playlistLabel() {
          return this.playlistType === j.MAIN ? 'level' : 'track';
        }
        fragInfo(t, e = !0, i) {
          var r, s;
          return `${this.playlistLabel()} ${t.level} (${
            i ? 'part' : 'frag'
          }:[${((r = e && !i ? t.startPTS : (i || t).start) != null
            ? r
            : NaN
          ).toFixed(3)}-${((s = e && !i ? t.endPTS : (i || t).end) != null
            ? s
            : NaN
          ).toFixed(3)}]${
            i && t.type === 'main'
              ? 'INDEPENDENT=' + (i.independent ? 'YES' : 'NO')
              : ''
          }`;
        }
        treatAsGap(t, e) {
          e && e.fragmentError++,
            (t.gap = !0),
            this.fragmentTracker.removeFragment(t),
            this.fragmentTracker.fragBuffered(t, !0);
        }
        resetTransmuxer() {
          var t;
          (t = this.transmuxer) == null || t.reset();
        }
        recoverWorkerError(t) {
          t.event === 'demuxerWorker' &&
            (this.fragmentTracker.removeAllFragments(),
            this.transmuxer &&
              (this.transmuxer.destroy(), (this.transmuxer = null)),
            this.resetStartWhenNotLoaded(),
            this.resetLoadingState());
        }
        set state(t) {
          let e = this._state;
          e !== t && ((this._state = t), this.log(`${e}->${t}`));
        }
        get state() {
          return this._state;
        }
      }
      function Qs(h) {
        return (
          !!h.interstitialsController && h.enableInterstitialPlayback !== !1
        );
      }
      class Zs {
        constructor() {
          (this.chunks = []), (this.dataLength = 0);
        }
        push(t) {
          this.chunks.push(t), (this.dataLength += t.length);
        }
        flush() {
          let t,
            { chunks: e, dataLength: i } = this;
          return e.length
            ? ((t =
                e.length === 1
                  ? e[0]
                  : (function (r, s) {
                      let a = new Uint8Array(s),
                        n = 0;
                      for (let l = 0; l < r.length; l++) {
                        let o = r[l];
                        a.set(o, n), (n += o.length);
                      }
                      return a;
                    })(e, i)),
              this.reset(),
              t)
            : new Uint8Array(0);
        }
        reset() {
          (this.chunks.length = 0), (this.dataLength = 0);
        }
      }
      var Js = { exports: {} },
        rr = (function (h) {
          return h &&
            h.__esModule &&
            Object.prototype.hasOwnProperty.call(h, 'default')
            ? h.default
            : h;
        })(
          (je ||
            ((je = 1),
            (function (h) {
              var t = Object.prototype.hasOwnProperty,
                e = '~';
              function i() {}
              function r(l, o, d) {
                (this.fn = l), (this.context = o), (this.once = d || !1);
              }
              function s(l, o, d, u, c) {
                if (typeof d != 'function')
                  throw TypeError('The listener must be a function');
                var f = new r(d, u || l, c),
                  g = e ? e + o : o;
                return (
                  l._events[g]
                    ? l._events[g].fn
                      ? (l._events[g] = [l._events[g], f])
                      : l._events[g].push(f)
                    : ((l._events[g] = f), l._eventsCount++),
                  l
                );
              }
              function a(l, o) {
                --l._eventsCount == 0
                  ? (l._events = new i())
                  : delete l._events[o];
              }
              function n() {
                (this._events = new i()), (this._eventsCount = 0);
              }
              Object.create &&
                ((i.prototype = Object.create(null)),
                new i().__proto__ || (e = !1)),
                (n.prototype.eventNames = function () {
                  var l,
                    o,
                    d = [];
                  if (this._eventsCount === 0) return d;
                  for (o in (l = this._events))
                    t.call(l, o) && d.push(e ? o.slice(1) : o);
                  return Object.getOwnPropertySymbols
                    ? d.concat(Object.getOwnPropertySymbols(l))
                    : d;
                }),
                (n.prototype.listeners = function (l) {
                  var o = e ? e + l : l,
                    d = this._events[o];
                  if (!d) return [];
                  if (d.fn) return [d.fn];
                  for (var u = 0, c = d.length, f = Array(c); u < c; u++)
                    f[u] = d[u].fn;
                  return f;
                }),
                (n.prototype.listenerCount = function (l) {
                  var o = e ? e + l : l,
                    d = this._events[o];
                  return d ? (d.fn ? 1 : d.length) : 0;
                }),
                (n.prototype.emit = function (l, o, d, u, c, f) {
                  var g = e ? e + l : l;
                  if (!this._events[g]) return !1;
                  var E,
                    m,
                    y = this._events[g],
                    S = arguments.length;
                  if (y.fn) {
                    switch (
                      (y.once && this.removeListener(l, y.fn, void 0, !0), S)
                    ) {
                      case 1:
                        return y.fn.call(y.context), !0;
                      case 2:
                        return y.fn.call(y.context, o), !0;
                      case 3:
                        return y.fn.call(y.context, o, d), !0;
                      case 4:
                        return y.fn.call(y.context, o, d, u), !0;
                      case 5:
                        return y.fn.call(y.context, o, d, u, c), !0;
                      case 6:
                        return y.fn.call(y.context, o, d, u, c, f), !0;
                    }
                    for (m = 1, E = Array(S - 1); m < S; m++)
                      E[m - 1] = arguments[m];
                    y.fn.apply(y.context, E);
                  } else {
                    var T,
                      A = y.length;
                    for (m = 0; m < A; m++)
                      switch (
                        (y[m].once &&
                          this.removeListener(l, y[m].fn, void 0, !0),
                        S)
                      ) {
                        case 1:
                          y[m].fn.call(y[m].context);
                          break;
                        case 2:
                          y[m].fn.call(y[m].context, o);
                          break;
                        case 3:
                          y[m].fn.call(y[m].context, o, d);
                          break;
                        case 4:
                          y[m].fn.call(y[m].context, o, d, u);
                          break;
                        default:
                          if (!E)
                            for (T = 1, E = Array(S - 1); T < S; T++)
                              E[T - 1] = arguments[T];
                          y[m].fn.apply(y[m].context, E);
                      }
                  }
                  return !0;
                }),
                (n.prototype.on = function (l, o, d) {
                  return s(this, l, o, d, !1);
                }),
                (n.prototype.once = function (l, o, d) {
                  return s(this, l, o, d, !0);
                }),
                (n.prototype.removeListener = function (l, o, d, u) {
                  var c = e ? e + l : l;
                  if (!this._events[c]) return this;
                  if (!o) return a(this, c), this;
                  var f = this._events[c];
                  if (f.fn)
                    f.fn !== o ||
                      (u && !f.once) ||
                      (d && f.context !== d) ||
                      a(this, c);
                  else {
                    for (var g = 0, E = [], m = f.length; g < m; g++)
                      (f[g].fn !== o ||
                        (u && !f[g].once) ||
                        (d && f[g].context !== d)) &&
                        E.push(f[g]);
                    E.length
                      ? (this._events[c] = E.length === 1 ? E[0] : E)
                      : a(this, c);
                  }
                  return this;
                }),
                (n.prototype.removeAllListeners = function (l) {
                  var o;
                  return (
                    l
                      ? ((o = e ? e + l : l), this._events[o] && a(this, o))
                      : ((this._events = new i()), (this._eventsCount = 0)),
                    this
                  );
                }),
                (n.prototype.off = n.prototype.removeListener),
                (n.prototype.addListener = n.prototype.on),
                (n.prefixed = e),
                (n.EventEmitter = n),
                (h.exports = n);
            })(Js)),
          Js.exports)
        );
      let Ue = '1.6.11',
        be = {};
      function ta(h, t) {
        return (
          t + 10 <= h.length &&
          h[t] === 51 &&
          h[t + 1] === 68 &&
          h[t + 2] === 73 &&
          h[t + 3] < 255 &&
          h[t + 4] < 255 &&
          h[t + 6] < 128 &&
          h[t + 7] < 128 &&
          h[t + 8] < 128 &&
          h[t + 9] < 128
        );
      }
      function sr(h, t) {
        return (
          t + 10 <= h.length &&
          h[t] === 73 &&
          h[t + 1] === 68 &&
          h[t + 2] === 51 &&
          h[t + 3] < 255 &&
          h[t + 4] < 255 &&
          h[t + 6] < 128 &&
          h[t + 7] < 128 &&
          h[t + 8] < 128 &&
          h[t + 9] < 128
        );
      }
      function fi(h, t) {
        return (
          ((127 & h[t]) << 21) |
          ((127 & h[t + 1]) << 14) |
          ((127 & h[t + 2]) << 7) |
          (127 & h[t + 3])
        );
      }
      function Be(h, t) {
        let e = t,
          i = 0;
        for (; sr(h, t); )
          (i += 10 + fi(h, t + 6)), ta(h, t + 10) && (i += 10), (t += i);
        if (i > 0) return h.subarray(e, e + i);
      }
      function ea(h, t) {
        return h[t] === 255 && (246 & h[t + 1]) == 240;
      }
      function ia(h, t) {
        return 1 & h[t + 1] ? 7 : 9;
      }
      function ar(h, t) {
        return (
          ((3 & h[t + 3]) << 11) | (h[t + 4] << 3) | ((224 & h[t + 5]) >>> 5)
        );
      }
      function gi(h, t) {
        return t + 1 < h.length && ea(h, t);
      }
      function ra(h, t, e, i, r) {
        if (!h.samplerate) {
          let s = (function (a, n, l, o) {
            let d = n[l + 2],
              u = (d >> 2) & 15;
            if (u > 12) {
              let S = Error(`invalid ADTS sampling index:${u}`);
              a.emit(p.ERROR, p.ERROR, {
                type: Q.MEDIA_ERROR,
                details: b.FRAG_PARSING_ERROR,
                fatal: !0,
                error: S,
                reason: S.message,
              });
              return;
            }
            let c = ((d >> 6) & 3) + 1,
              f = ((n[l + 3] >> 6) & 3) | ((1 & d) << 2),
              g = 'mp4a.40.' + c,
              E = [
                96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3,
                11025, 8e3, 7350,
              ][u],
              m = u;
            (c === 5 || c === 29) && (m -= 3);
            let y = [(c << 3) | ((14 & m) >> 1), ((1 & m) << 7) | (f << 3)];
            return (
              nt.log(
                `manifest codec:${o}, parsed codec:${g}, channels:${f}, rate:${E} (ADTS object type:${c} sampling index:${u})`
              ),
              {
                config: y,
                samplerate: E,
                channelCount: f,
                codec: g,
                parsedCodec: g,
                manifestCodec: o,
              }
            );
          })(t, e, i, r);
          s && at(h, s);
        }
      }
      function sa(h, t, e, i, r) {
        let s,
          a = i + (9216e4 / h.samplerate) * r,
          n = (function (o, d) {
            let u = ia(o, d);
            if (d + u <= o.length) {
              let c = ar(o, d) - u;
              if (c > 0) return { headerLength: u, frameLength: c };
            }
          })(t, e);
        if (n) {
          let { frameLength: o, headerLength: d } = n,
            u = d + o,
            c = Math.max(0, e + u - t.length);
          c
            ? (s = new Uint8Array(u - d)).set(t.subarray(e + d, t.length), 0)
            : (s = t.subarray(e + d, e + u));
          let f = { unit: s, pts: a };
          return c || h.samples.push(f), { sample: f, length: u, missing: c };
        }
        let l = t.length - e;
        return (
          (s = new Uint8Array(l)).set(t.subarray(e, t.length), 0),
          { sample: { unit: s, pts: a }, length: l, missing: -1 }
        );
      }
      function nr(h, t = 0, e = 1 / 0) {
        return (function (i, r, s, a) {
          let n = i instanceof ArrayBuffer ? i : i.buffer,
            l = 1;
          'BYTES_PER_ELEMENT' in a && (l = a.BYTES_PER_ELEMENT);
          let o =
              i &&
              i.buffer instanceof ArrayBuffer &&
              i.byteLength !== void 0 &&
              i.byteOffset !== void 0
                ? i.byteOffset
                : 0,
            d = (o + i.byteLength) / l,
            u = Math.floor(Math.max(0, Math.min((o + r) / l, d))),
            c = Math.floor(Math.min(u + Math.max(s, 0), d));
          return new a(n, u, c - u);
        })(h, t, e, Uint8Array);
      }
      function aa(h) {
        let t = 0,
          e = [];
        for (; sr(h, t); ) {
          let i = fi(h, t + 6);
          (h[t + 5] >> 6) & 1 && (t += 10);
          let r = (t += 10) + i;
          for (; t + 10 < r; ) {
            let s = (function (n) {
                let l = String.fromCharCode(n[0], n[1], n[2], n[3]),
                  o = fi(n, 4);
                return { type: l, size: o, data: n.subarray(10, 10 + o) };
              })(h.subarray(t)),
              a =
                s.type === 'PRIV'
                  ? (function (n) {
                      if (n.size < 2) return;
                      let l = At(n.data, !0),
                        o = new Uint8Array(n.data.subarray(l.length + 1));
                      return { key: n.type, info: l, data: o.buffer };
                    })(s)
                  : s.type[0] === 'W'
                  ? (function (n) {
                      if (n.type === 'WXXX') {
                        if (n.size < 2) return;
                        let o = 1,
                          d = At(n.data.subarray(o), !0);
                        o += d.length + 1;
                        let u = At(n.data.subarray(o));
                        return { key: n.type, info: d, data: u };
                      }
                      let l = At(n.data);
                      return { key: n.type, info: '', data: l };
                    })(s)
                  : s.type === 'APIC'
                  ? (function (n) {
                      let l,
                        o = {
                          key: n.type,
                          description: '',
                          data: '',
                          mimeType: null,
                          pictureType: null,
                        };
                      if (n.size < 2) return;
                      if (n.data[0] !== 3) {
                        console.log(
                          'Ignore frame with unrecognized character encoding'
                        );
                        return;
                      }
                      let d = n.data.subarray(1).indexOf(0);
                      if (d === -1) return;
                      let u = At(nr(n.data, 1, d)),
                        c = n.data[2 + d],
                        f = n.data.subarray(3 + d).indexOf(0);
                      if (f === -1) return;
                      let g = At(nr(n.data, 3 + d, f));
                      if (u === '-->') l = At(nr(n.data, 4 + d + f));
                      else {
                        var E;
                        l =
                          (E = n.data.subarray(4 + d + f)) instanceof
                          ArrayBuffer
                            ? E
                            : E.byteOffset == 0 &&
                              E.byteLength == E.buffer.byteLength
                            ? E.buffer
                            : new Uint8Array(E).buffer;
                      }
                      return (
                        (o.mimeType = u),
                        (o.pictureType = c),
                        (o.description = g),
                        (o.data = l),
                        o
                      );
                    })(s)
                  : (function (n) {
                      if (n.size < 2) return;
                      if (n.type === 'TXXX') {
                        let o = 1,
                          d = At(n.data.subarray(o), !0);
                        o += d.length + 1;
                        let u = At(n.data.subarray(o));
                        return { key: n.type, info: d, data: u };
                      }
                      let l = At(n.data.subarray(1));
                      return { key: n.type, info: '', data: l };
                    })(s);
            a && e.push(a), (t += s.size + 10);
          }
          ta(h, t) && (t += 10);
        }
        return e;
      }
      function na(h) {
        return (
          h &&
          h.key === 'PRIV' &&
          h.info === 'com.apple.streaming.transportStreamTimestamp'
        );
      }
      function lr(h) {
        let t = aa(h);
        for (let e = 0; e < t.length; e++) {
          let i = t[e];
          if (na(i))
            return (function (r) {
              if (r.data.byteLength === 8) {
                let s = new Uint8Array(r.data),
                  a = 1 & s[3],
                  n = (s[4] << 23) + (s[5] << 15) + (s[6] << 7) + s[7];
                return (n /= 45), a && (n += 4772185884e-2), Math.round(n);
              }
            })(i);
        }
      }
      let Vt = (function (h) {
        return (
          (h.audioId3 = 'org.id3'),
          (h.dateRange = 'com.apple.quicktime.HLS'),
          (h.emsg = 'https://aomedia.org/emsg/ID3'),
          (h.misbklv = 'urn:misb:KLV:bin:1910.1'),
          h
        );
      })({});
      function ee(h = '', t = 9e4) {
        return {
          type: h,
          id: -1,
          pid: -1,
          inputTimeScale: t,
          sequenceNumber: -1,
          samples: [],
          dropped: 0,
        };
      }
      class or {
        constructor() {
          (this._audioTrack = void 0),
            (this._id3Track = void 0),
            (this.frameIndex = 0),
            (this.cachedData = null),
            (this.basePTS = null),
            (this.initPTS = null),
            (this.lastPTS = null);
        }
        resetInitSegment(t, e, i, r) {
          this._id3Track = {
            type: 'id3',
            id: 3,
            pid: -1,
            inputTimeScale: 9e4,
            sequenceNumber: 0,
            samples: [],
            dropped: 0,
          };
        }
        resetTimeStamp(t) {
          (this.initPTS = t), this.resetContiguity();
        }
        resetContiguity() {
          (this.basePTS = null), (this.lastPTS = null), (this.frameIndex = 0);
        }
        canParse(t, e) {
          return !1;
        }
        appendFrame(t, e, i) {}
        demux(t, e) {
          let i;
          this.cachedData &&
            ((t = Wt(this.cachedData, t)), (this.cachedData = null));
          let r = Be(t, 0),
            s = r ? r.length : 0,
            a = this._audioTrack,
            n = this._id3Track,
            l = r ? lr(r) : void 0,
            o = t.length;
          for (
            (this.basePTS === null || (this.frameIndex === 0 && Y(l))) &&
              ((this.basePTS = xn(l, e, this.initPTS)),
              (this.lastPTS = this.basePTS)),
              this.lastPTS === null && (this.lastPTS = this.basePTS),
              r &&
                r.length > 0 &&
                n.samples.push({
                  pts: this.lastPTS,
                  dts: this.lastPTS,
                  data: r,
                  type: Vt.audioId3,
                  duration: Number.POSITIVE_INFINITY,
                });
            s < o;

          ) {
            if (this.canParse(t, s)) {
              let c = this.appendFrame(a, t, s);
              c
                ? (this.frameIndex++,
                  (this.lastPTS = c.sample.pts),
                  (s += c.length),
                  (i = s))
                : (s = o);
            } else {
              var d, u;
              sr((d = t), (u = s)) && fi(d, u + 6) + 10 <= d.length - u
                ? ((r = Be(t, s)),
                  n.samples.push({
                    pts: this.lastPTS,
                    dts: this.lastPTS,
                    data: r,
                    type: Vt.audioId3,
                    duration: Number.POSITIVE_INFINITY,
                  }),
                  (s += r.length),
                  (i = s))
                : s++;
            }
            if (s === o && i !== o) {
              let c = t.slice(i);
              this.cachedData
                ? (this.cachedData = Wt(this.cachedData, c))
                : (this.cachedData = c);
            }
          }
          return {
            audioTrack: a,
            videoTrack: ee(),
            id3Track: n,
            textTrack: ee(),
          };
        }
        demuxSampleAes(t, e, i) {
          return Promise.reject(
            Error(
              `[${this}] This demuxer does not support Sample-AES decryption`
            )
          );
        }
        flush(t) {
          let e = this.cachedData;
          return (
            e && ((this.cachedData = null), this.demux(e, 0)),
            {
              audioTrack: this._audioTrack,
              videoTrack: ee(),
              id3Track: this._id3Track,
              textTrack: ee(),
            }
          );
        }
        destroy() {
          (this.cachedData = null),
            (this._audioTrack = this._id3Track = void 0);
        }
      }
      let xn = (h, t, e) =>
          Y(h) ? 90 * h : 9e4 * t + (e ? (9e4 * e.baseTime) / e.timescale : 0),
        mi = null,
        Mn = [
          32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 32,
          48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 32, 40,
          48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 32, 48, 56, 64,
          80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 8, 16, 24, 32, 40, 48,
          56, 64, 80, 96, 112, 128, 144, 160,
        ],
        Fn = [44100, 48e3, 32e3, 22050, 24e3, 16e3, 11025, 12e3, 8e3],
        Nn = [
          [0, 72, 144, 12],
          [0, 0, 0, 0],
          [0, 72, 144, 12],
          [0, 144, 144, 12],
        ],
        Un = [0, 1, 1, 4];
      function la(h, t, e, i, r) {
        if (e + 24 > t.length) return;
        let s = oa(t, e);
        if (s && e + s.frameLength <= t.length) {
          let a = i + ((9e4 * s.samplesPerFrame) / s.sampleRate) * r,
            n = { unit: t.subarray(e, e + s.frameLength), pts: a, dts: a };
          return (
            (h.config = []),
            (h.channelCount = s.channelCount),
            (h.samplerate = s.sampleRate),
            h.samples.push(n),
            { sample: n, length: s.frameLength, missing: 0 }
          );
        }
      }
      function oa(h, t) {
        let e = (h[t + 1] >> 3) & 3,
          i = (h[t + 1] >> 1) & 3,
          r = (h[t + 2] >> 4) & 15,
          s = (h[t + 2] >> 2) & 3;
        if (e !== 1 && r !== 0 && r !== 15 && s !== 3) {
          let a = (h[t + 2] >> 1) & 1,
            n = h[t + 3] >> 6,
            l = 1e3 * Mn[14 * (e === 3 ? 3 - i : i === 3 ? 3 : 4) + r - 1],
            o = Fn[3 * (e === 3 ? 0 : e === 2 ? 1 : 2) + s],
            d = Nn[e][i],
            u = Un[i],
            c = Math.floor((d * l) / o + a) * u;
          if (mi === null) {
            let f = (navigator.userAgent || '').match(/Chrome\/(\d+)/i);
            mi = f ? parseInt(f[1]) : 0;
          }
          return (
            mi &&
              mi <= 87 &&
              i === 2 &&
              l >= 224e3 &&
              n === 0 &&
              (h[t + 3] = 128 | h[t + 3]),
            {
              sampleRate: o,
              channelCount: n === 3 ? 1 : 2,
              frameLength: c,
              samplesPerFrame: 8 * d * u,
            }
          );
        }
      }
      function hr(h, t) {
        return h[t] === 255 && (224 & h[t + 1]) == 224 && (6 & h[t + 1]) != 0;
      }
      function ha(h, t) {
        return t + 1 < h.length && hr(h, t);
      }
      function da(h, t) {
        if (t + 1 < h.length && hr(h, t)) {
          let e = oa(h, t),
            i = 4;
          e != null && e.frameLength && (i = e.frameLength);
          let r = t + i;
          return r === h.length || ha(h, r);
        }
        return !1;
      }
      class Bn extends or {
        constructor(t, e) {
          super(),
            (this.observer = void 0),
            (this.config = void 0),
            (this.observer = t),
            (this.config = e);
        }
        resetInitSegment(t, e, i, r) {
          super.resetInitSegment(t, e, i, r),
            (this._audioTrack = {
              container: 'audio/adts',
              type: 'audio',
              id: 2,
              pid: -1,
              sequenceNumber: 0,
              segmentCodec: 'aac',
              samples: [],
              manifestCodec: e,
              duration: r,
              inputTimeScale: 9e4,
              dropped: 0,
            });
        }
        static probe(t, e) {
          if (!t) return !1;
          let i = Be(t, 0),
            r = i?.length || 0;
          if (da(t, r)) return !1;
          for (let s = t.length; r < s; r++)
            if (
              (function (a, n) {
                if (gi(a, n)) {
                  let l = ia(a, n);
                  if (n + l >= a.length) return !1;
                  let o = ar(a, n);
                  if (o <= l) return !1;
                  let d = n + o;
                  return d === a.length || gi(a, d);
                }
                return !1;
              })(t, r)
            )
              return e.log('ADTS sync word found !'), !0;
          return !1;
        }
        canParse(t, e) {
          return e + 5 < t.length && ea(t, e) && ar(t, e) <= t.length - e;
        }
        appendFrame(t, e, i) {
          ra(t, this.observer, e, i, t.manifestCodec);
          let r = sa(t, e, i, this.basePTS, this.frameIndex);
          if (r && r.missing === 0) return r;
        }
      }
      let ua = (h, t) => {
        let e = 0,
          i = 5;
        t += 5;
        let r = new Uint32Array(1),
          s = new Uint32Array(1),
          a = new Uint8Array(1);
        for (; i > 0; ) {
          a[0] = h[t];
          let n = Math.min(i, 8),
            l = 8 - n;
          (s[0] = (4278190080 >>> (24 + l)) << l),
            (r[0] = (a[0] & s[0]) >> l),
            (e = e ? (e << n) | r[0] : r[0]),
            (t += 1),
            (i -= n);
        }
        return e;
      };
      class $n extends or {
        constructor(t) {
          super(), (this.observer = void 0), (this.observer = t);
        }
        resetInitSegment(t, e, i, r) {
          super.resetInitSegment(t, e, i, r),
            (this._audioTrack = {
              container: 'audio/ac-3',
              type: 'audio',
              id: 2,
              pid: -1,
              sequenceNumber: 0,
              segmentCodec: 'ac3',
              samples: [],
              manifestCodec: e,
              duration: r,
              inputTimeScale: 9e4,
              dropped: 0,
            });
        }
        canParse(t, e) {
          return e + 64 < t.length;
        }
        appendFrame(t, e, i) {
          let r = ca(t, e, i, this.basePTS, this.frameIndex);
          if (r !== -1)
            return {
              sample: t.samples[t.samples.length - 1],
              length: r,
              missing: 0,
            };
        }
        static probe(t) {
          if (!t) return !1;
          let e = Be(t, 0);
          if (!e) return !1;
          let i = e.length;
          return (
            t[i] === 11 && t[i + 1] === 119 && lr(e) !== void 0 && 16 > ua(t, i)
          );
        }
      }
      function ca(h, t, e, i, r) {
        if (e + 8 > t.length || t[e] !== 11 || t[e + 1] !== 119) return -1;
        let s = t[e + 4] >> 6;
        if (s >= 3) return -1;
        let a = [48e3, 44100, 32e3][s],
          n = 63 & t[e + 4],
          l =
            2 *
            [
              64, 69, 96, 64, 70, 96, 80, 87, 120, 80, 88, 120, 96, 104, 144,
              96, 105, 144, 112, 121, 168, 112, 122, 168, 128, 139, 192, 128,
              140, 192, 160, 174, 240, 160, 175, 240, 192, 208, 288, 192, 209,
              288, 224, 243, 336, 224, 244, 336, 256, 278, 384, 256, 279, 384,
              320, 348, 480, 320, 349, 480, 384, 417, 576, 384, 418, 576, 448,
              487, 672, 448, 488, 672, 512, 557, 768, 512, 558, 768, 640, 696,
              960, 640, 697, 960, 768, 835, 1152, 768, 836, 1152, 896, 975,
              1344, 896, 976, 1344, 1024, 1114, 1536, 1024, 1115, 1536, 1152,
              1253, 1728, 1152, 1254, 1728, 1280, 1393, 1920, 1280, 1394, 1920,
            ][3 * n + s];
        if (e + l > t.length) return -1;
        let o = t[e + 6] >> 5,
          d = 0;
        o === 2 ? (d += 2) : (1 & o && o !== 1 && (d += 2), 4 & o && (d += 2));
        let u = (((t[e + 6] << 8) | t[e + 7]) >> (12 - d)) & 1,
          c = [2, 1, 2, 3, 3, 4, 4, 5][o] + u,
          f = t[e + 5] >> 3,
          g = 7 & t[e + 5],
          E = new Uint8Array([
            (s << 6) | (f << 1) | (g >> 2),
            ((3 & g) << 6) | (o << 3) | (u << 2) | (n >> 4),
            (n << 4) & 224,
          ]),
          m = t.subarray(e, e + l);
        return (
          (h.config = E),
          (h.channelCount = c),
          (h.samplerate = a),
          h.samples.push({ unit: m, pts: i + (1536 / a) * 9e4 * r }),
          l
        );
      }
      class Gn extends or {
        resetInitSegment(t, e, i, r) {
          super.resetInitSegment(t, e, i, r),
            (this._audioTrack = {
              container: 'audio/mpeg',
              type: 'audio',
              id: 2,
              pid: -1,
              sequenceNumber: 0,
              segmentCodec: 'mp3',
              samples: [],
              manifestCodec: e,
              duration: r,
              inputTimeScale: 9e4,
              dropped: 0,
            });
        }
        static probe(t) {
          if (!t) return !1;
          let e = Be(t, 0),
            i = e?.length || 0;
          if (
            e &&
            t[i] === 11 &&
            t[i + 1] === 119 &&
            lr(e) !== void 0 &&
            16 >= ua(t, i)
          )
            return !1;
          for (let r = t.length; i < r; i++)
            if (da(t, i)) return nt.log('MPEG Audio sync word found !'), !0;
          return !1;
        }
        canParse(t, e) {
          return hr(t, e) && 4 <= t.length - e;
        }
        appendFrame(t, e, i) {
          if (this.basePTS !== null)
            return la(t, e, i, this.basePTS, this.frameIndex);
        }
      }
      let Kn = /\/emsg[-/]ID3/i;
      class Vn {
        constructor(t, e) {
          (this.remainderData = null),
            (this.timeOffset = 0),
            (this.config = void 0),
            (this.videoTrack = void 0),
            (this.audioTrack = void 0),
            (this.id3Track = void 0),
            (this.txtTrack = void 0),
            (this.config = e);
        }
        resetTimeStamp() {}
        resetInitSegment(t, e, i, r) {
          let s = (this.videoTrack = ee('video', 1)),
            a = (this.audioTrack = ee('audio', 1)),
            n = (this.txtTrack = ee('text', 1));
          if (
            ((this.id3Track = ee('id3', 1)),
            (this.timeOffset = 0),
            !(t != null && t.byteLength))
          )
            return;
          let l = Xr(t);
          if (l.video) {
            let { id: o, timescale: d, codec: u, supplemental: c } = l.video;
            (s.id = o),
              (s.timescale = n.timescale = d),
              (s.codec = u),
              (s.supplemental = c);
          }
          if (l.audio) {
            let { id: o, timescale: d, codec: u } = l.audio;
            (a.id = o), (a.timescale = d), (a.codec = u);
          }
          (n.id = Yr.text),
            (s.sampleDuration = 0),
            (s.duration = a.duration = r);
        }
        resetContiguity() {
          this.remainderData = null;
        }
        static probe(t) {
          return (function (e) {
            let i = e.byteLength;
            for (let r = 0; r < i; ) {
              let s = tt(e, r);
              if (
                s > 8 &&
                e[r + 4] === 109 &&
                e[r + 5] === 111 &&
                e[r + 6] === 111 &&
                e[r + 7] === 102
              )
                return !0;
              r = s > 1 ? r + s : i;
            }
            return !1;
          })(t);
        }
        demux(t, e) {
          this.timeOffset = e;
          let i = t,
            r = this.videoTrack,
            s = this.txtTrack;
          if (this.config.progressive) {
            this.remainderData && (i = Wt(this.remainderData, t));
            let n = (function (l) {
              let o = { valid: null, remainder: null },
                d = ot(l, ['moof']);
              if (d.length < 2) return (o.remainder = l), o;
              let u = d[d.length - 1];
              return (
                (o.valid = l.slice(0, u.byteOffset - 8)),
                (o.remainder = l.slice(u.byteOffset - 8)),
                o
              );
            })(i);
            (this.remainderData = n.remainder),
              (r.samples = n.valid || new Uint8Array());
          } else r.samples = i;
          let a = this.extractID3Track(r, e);
          return (
            (s.samples = Qr(e, r)),
            {
              videoTrack: r,
              audioTrack: this.audioTrack,
              id3Track: a,
              textTrack: this.txtTrack,
            }
          );
        }
        flush() {
          let t = this.timeOffset,
            e = this.videoTrack,
            i = this.txtTrack;
          (e.samples = this.remainderData || new Uint8Array()),
            (this.remainderData = null);
          let r = this.extractID3Track(e, this.timeOffset);
          return (
            (i.samples = Qr(t, e)),
            { videoTrack: e, audioTrack: ee(), id3Track: r, textTrack: ee() }
          );
        }
        extractID3Track(t, e) {
          let i = this.id3Track;
          if (t.samples.length) {
            let r = ot(t.samples, ['emsg']);
            r &&
              r.forEach((s) => {
                let a = (function (n) {
                  let l = n[0],
                    o = '',
                    d = '',
                    u = 0,
                    c = 0,
                    f = 0,
                    g = 0,
                    E = 0,
                    m = 0;
                  if (l === 0) {
                    for (; wt(n.subarray(m, m + 1)) !== '\0'; )
                      (o += wt(n.subarray(m, m + 1))), (m += 1);
                    for (
                      o += wt(n.subarray(m, m + 1)), m += 1;
                      wt(n.subarray(m, m + 1)) !== '\0';

                    )
                      (d += wt(n.subarray(m, m + 1))), (m += 1);
                    (d += wt(n.subarray(m, m + 1))),
                      (m += 1),
                      (u = tt(n, 12)),
                      (c = tt(n, 16)),
                      (g = tt(n, 20)),
                      (E = tt(n, 24)),
                      (m = 28);
                  } else if (l === 1) {
                    (m += 4), (u = tt(n, m));
                    let y = tt(n, (m += 4)),
                      S = tt(n, (m += 4));
                    for (
                      m += 4,
                        Ci((f = 4294967296 * y + S)) ||
                          ((f = Number.MAX_SAFE_INTEGER),
                          nt.warn(
                            'Presentation time exceeds safe integer limit and wrapped to max safe integer in parsing emsg box'
                          )),
                        g = tt(n, m),
                        m += 4,
                        E = tt(n, m),
                        m += 4;
                      wt(n.subarray(m, m + 1)) !== '\0';

                    )
                      (o += wt(n.subarray(m, m + 1))), (m += 1);
                    for (
                      o += wt(n.subarray(m, m + 1)), m += 1;
                      wt(n.subarray(m, m + 1)) !== '\0';

                    )
                      (d += wt(n.subarray(m, m + 1))), (m += 1);
                    (d += wt(n.subarray(m, m + 1))), (m += 1);
                  }
                  return {
                    schemeIdUri: o,
                    value: d,
                    timeScale: u,
                    presentationTime: f,
                    presentationTimeDelta: c,
                    eventDuration: g,
                    id: E,
                    payload: n.subarray(m, n.byteLength),
                  };
                })(s);
                if (Kn.test(a.schemeIdUri)) {
                  let n = fa(a, e),
                    l =
                      a.eventDuration === 4294967295
                        ? Number.POSITIVE_INFINITY
                        : a.eventDuration / a.timeScale;
                  l <= 0.001 && (l = Number.POSITIVE_INFINITY);
                  let o = a.payload;
                  i.samples.push({
                    data: o,
                    len: o.byteLength,
                    dts: n,
                    pts: n,
                    type: Vt.emsg,
                    duration: l,
                  });
                } else if (
                  this.config.enableEmsgKLVMetadata &&
                  a.schemeIdUri.startsWith('urn:misb:KLV:bin:1910.1')
                ) {
                  let n = fa(a, e);
                  i.samples.push({
                    data: a.payload,
                    len: a.payload.byteLength,
                    dts: n,
                    pts: n,
                    type: Vt.misbklv,
                    duration: Number.POSITIVE_INFINITY,
                  });
                }
              });
          }
          return i;
        }
        demuxSampleAes(t, e, i) {
          return Promise.reject(
            Error('The MP4 demuxer does not support SAMPLE-AES decryption')
          );
        }
        destroy() {
          (this.config = null),
            (this.remainderData = null),
            (this.videoTrack =
              this.audioTrack =
              this.id3Track =
              this.txtTrack =
                void 0);
        }
      }
      function fa(h, t) {
        return Y(h.presentationTime)
          ? h.presentationTime / h.timeScale
          : t + h.presentationTimeDelta / h.timeScale;
      }
      class Hn {
        constructor(t, e, i) {
          (this.keyData = void 0),
            (this.decrypter = void 0),
            (this.keyData = i),
            (this.decrypter = new Hi(e, { removePKCS7Padding: !1 }));
        }
        decryptBuffer(t) {
          return this.decrypter.decrypt(
            t,
            this.keyData.key.buffer,
            this.keyData.iv.buffer,
            he.cbc
          );
        }
        decryptAacSample(t, e, i) {
          let r = t[e].unit;
          if (r.length <= 16) return;
          let s = r.subarray(16, r.length - (r.length % 16)),
            a = s.buffer.slice(s.byteOffset, s.byteOffset + s.length);
          this.decryptBuffer(a)
            .then((n) => {
              let l = new Uint8Array(n);
              r.set(l, 16),
                this.decrypter.isSync() || this.decryptAacSamples(t, e + 1, i);
            })
            .catch(i);
        }
        decryptAacSamples(t, e, i) {
          for (; ; e++) {
            if (e >= t.length) {
              i();
              return;
            }
            if (
              !(t[e].unit.length < 32) &&
              (this.decryptAacSample(t, e, i), !this.decrypter.isSync())
            )
              return;
          }
        }
        getAvcEncryptedData(t) {
          let e = new Int8Array(16 * Math.floor((t.length - 48) / 160) + 16),
            i = 0;
          for (let r = 32; r < t.length - 16; r += 160, i += 16)
            e.set(t.subarray(r, r + 16), i);
          return e;
        }
        getAvcDecryptedUnit(t, e) {
          let i = new Uint8Array(e),
            r = 0;
          for (let s = 32; s < t.length - 16; s += 160, r += 16)
            t.set(i.subarray(r, r + 16), s);
          return t;
        }
        decryptAvcSample(t, e, i, r, s) {
          let a = Zr(s.data),
            n = this.getAvcEncryptedData(a);
          this.decryptBuffer(n.buffer)
            .then((l) => {
              (s.data = this.getAvcDecryptedUnit(a, l)),
                this.decrypter.isSync() ||
                  this.decryptAvcSamples(t, e, i + 1, r);
            })
            .catch(r);
        }
        decryptAvcSamples(t, e, i, r) {
          if (t instanceof Uint8Array)
            throw Error('Cannot decrypt samples of type Uint8Array');
          for (; ; e++, i = 0) {
            if (e >= t.length) {
              r();
              return;
            }
            let s = t[e].units;
            for (; !(i >= s.length); i++) {
              let a = s[i];
              if (
                !(a.data.length <= 48) &&
                (a.type === 1 || a.type === 5) &&
                (this.decryptAvcSample(t, e, i, r, a), !this.decrypter.isSync())
              )
                return;
            }
          }
        }
      }
      class ga {
        constructor() {
          this.VideoSample = null;
        }
        createVideoSample(t, e, i) {
          return { key: t, frame: !1, pts: e, dts: i, units: [], length: 0 };
        }
        getLastNalUnit(t) {
          var e;
          let i,
            r = this.VideoSample;
          if (
            ((r && r.units.length !== 0) || (r = t[t.length - 1]),
            (e = r) != null && e.units)
          ) {
            let s = r.units;
            i = s[s.length - 1];
          }
          return i;
        }
        pushAccessUnit(t, e) {
          if (t.units.length && t.frame) {
            if (t.pts === void 0) {
              let i = e.samples,
                r = i.length;
              if (r) {
                let s = i[r - 1];
                (t.pts = s.pts), (t.dts = s.dts);
              } else {
                e.dropped++;
                return;
              }
            }
            e.samples.push(t);
          }
        }
        parseNALu(t, e, i) {
          let r,
            s,
            a,
            n = e.byteLength,
            l = t.naluState || 0,
            o = l,
            d = [],
            u = 0,
            c = -1,
            f = 0;
          for (
            l === -1 &&
            ((c = 0), (f = this.getNALuType(e, 0)), (l = 0), (u = 1));
            u < n;

          ) {
            if (((r = e[u++]), !l)) {
              l = r ? 0 : 1;
              continue;
            }
            if (l === 1) {
              l = r ? 0 : 2;
              continue;
            }
            if (r)
              if (r === 1) {
                if (((s = u - l - 1), c >= 0)) {
                  let g = { data: e.subarray(c, s), type: f };
                  d.push(g);
                } else {
                  let g = this.getLastNalUnit(t.samples);
                  g &&
                    (o &&
                      u <= 4 - o &&
                      g.state &&
                      (g.data = g.data.subarray(0, g.data.byteLength - o)),
                    s > 0 &&
                      ((g.data = Wt(g.data, e.subarray(0, s))), (g.state = 0)));
                }
                u < n
                  ? ((a = this.getNALuType(e, u)), (c = u), (f = a), (l = 0))
                  : (l = -1);
              } else l = 0;
            else l = 3;
          }
          if (c >= 0 && l >= 0) {
            let g = { data: e.subarray(c, n), type: f, state: l };
            d.push(g);
          }
          if (d.length === 0) {
            let g = this.getLastNalUnit(t.samples);
            g && (g.data = Wt(g.data, e));
          }
          return (t.naluState = l), d;
        }
      }
      class $e {
        constructor(t) {
          (this.data = void 0),
            (this.bytesAvailable = void 0),
            (this.word = void 0),
            (this.bitsAvailable = void 0),
            (this.data = t),
            (this.bytesAvailable = t.byteLength),
            (this.word = 0),
            (this.bitsAvailable = 0);
        }
        loadWord() {
          let t = this.data,
            e = this.bytesAvailable,
            i = t.byteLength - e,
            r = new Uint8Array(4),
            s = Math.min(4, e);
          if (s === 0) throw Error('no bytes available');
          r.set(t.subarray(i, i + s)),
            (this.word = new DataView(r.buffer).getUint32(0)),
            (this.bitsAvailable = 8 * s),
            (this.bytesAvailable -= s);
        }
        skipBits(t) {
          let e;
          (t = Math.min(t, 8 * this.bytesAvailable + this.bitsAvailable)),
            this.bitsAvailable > t ||
              ((t -= this.bitsAvailable),
              (e = t >> 3),
              (t -= e << 3),
              (this.bytesAvailable -= e),
              this.loadWord()),
            (this.word <<= t),
            (this.bitsAvailable -= t);
        }
        readBits(t) {
          let e = Math.min(this.bitsAvailable, t),
            i = this.word >>> (32 - e);
          if (
            (t > 32 && nt.error('Cannot read more than 32 bits at a time'),
            (this.bitsAvailable -= e),
            this.bitsAvailable > 0)
          )
            this.word <<= e;
          else if (this.bytesAvailable > 0) this.loadWord();
          else throw Error('no bits available');
          return (e = t - e) > 0 && this.bitsAvailable
            ? (i << e) | this.readBits(e)
            : i;
        }
        skipLZ() {
          let t;
          for (t = 0; t < this.bitsAvailable; ++t)
            if ((this.word & (2147483648 >>> t)) != 0)
              return (this.word <<= t), (this.bitsAvailable -= t), t;
          return this.loadWord(), t + this.skipLZ();
        }
        skipUEG() {
          this.skipBits(1 + this.skipLZ());
        }
        skipEG() {
          this.skipBits(1 + this.skipLZ());
        }
        readUEG() {
          let t = this.skipLZ();
          return this.readBits(t + 1) - 1;
        }
        readEG() {
          let t = this.readUEG();
          return 1 & t ? (1 + t) >>> 1 : -1 * (t >>> 1);
        }
        readBoolean() {
          return this.readBits(1) === 1;
        }
        readUByte() {
          return this.readBits(8);
        }
        readUShort() {
          return this.readBits(16);
        }
        readUInt() {
          return this.readBits(32);
        }
      }
      class Yn extends ga {
        parsePES(t, e, i, r) {
          let s,
            a = this.parseNALu(t, i.data, r),
            n = this.VideoSample,
            l = !1;
          (i.data = null),
            n &&
              a.length &&
              !t.audFound &&
              (this.pushAccessUnit(n, t),
              (n = this.VideoSample =
                this.createVideoSample(!1, i.pts, i.dts))),
            a.forEach((o) => {
              var d, u, c, f, g;
              switch (o.type) {
                case 1: {
                  let E = !1;
                  s = !0;
                  let m = o.data;
                  if (l && m.length > 4) {
                    let y = this.readSliceType(m);
                    (y === 2 || y === 4 || y === 7 || y === 9) && (E = !0);
                  }
                  E &&
                    (c = n) != null &&
                    c.frame &&
                    !n.key &&
                    (this.pushAccessUnit(n, t), (n = this.VideoSample = null)),
                    n ||
                      (n = this.VideoSample =
                        this.createVideoSample(!0, i.pts, i.dts)),
                    (n.frame = !0),
                    (n.key = E);
                  break;
                }
                case 5:
                  (s = !0),
                    (d = n) != null &&
                      d.frame &&
                      !n.key &&
                      (this.pushAccessUnit(n, t),
                      (n = this.VideoSample = null)),
                    n ||
                      (n = this.VideoSample =
                        this.createVideoSample(!0, i.pts, i.dts)),
                    (n.key = !0),
                    (n.frame = !0);
                  break;
                case 6:
                  (s = !0), Mi(o.data, 1, i.pts, e.samples);
                  break;
                case 7: {
                  (s = !0), (l = !0);
                  let E = o.data,
                    m = this.readSPS(E);
                  if (
                    !t.sps ||
                    t.width !== m.width ||
                    t.height !== m.height ||
                    ((f = t.pixelRatio) == null ? void 0 : f[0]) !==
                      m.pixelRatio[0] ||
                    ((g = t.pixelRatio) == null ? void 0 : g[1]) !==
                      m.pixelRatio[1]
                  ) {
                    (t.width = m.width),
                      (t.height = m.height),
                      (t.pixelRatio = m.pixelRatio),
                      (t.sps = [E]);
                    let y = E.subarray(1, 4),
                      S = 'avc1.';
                    for (let T = 0; T < 3; T++) {
                      let A = y[T].toString(16);
                      A.length < 2 && (A = '0' + A), (S += A);
                    }
                    t.codec = S;
                  }
                  break;
                }
                case 8:
                  (s = !0), (t.pps = [o.data]);
                  break;
                case 9:
                  (s = !0),
                    (t.audFound = !0),
                    (u = n) != null &&
                      u.frame &&
                      (this.pushAccessUnit(n, t), (n = null)),
                    n ||
                      (n = this.VideoSample =
                        this.createVideoSample(!1, i.pts, i.dts));
                  break;
                case 12:
                  s = !0;
                  break;
                default:
                  s = !1;
              }
              n && s && n.units.push(o);
            }),
            r && n && (this.pushAccessUnit(n, t), (this.VideoSample = null));
        }
        getNALuType(t, e) {
          return 31 & t[e];
        }
        readSliceType(t) {
          let e = new $e(t);
          return e.readUByte(), e.readUEG(), e.readUEG();
        }
        skipScalingList(t, e) {
          let i = 8,
            r = 8;
          for (let s = 0; s < t; s++)
            r !== 0 && (r = (i + e.readEG() + 256) % 256),
              (i = r === 0 ? i : r);
        }
        readSPS(t) {
          let e,
            i,
            r,
            s = new $e(t),
            a = 0,
            n = 0,
            l = 0,
            o = 0,
            d = s.readUByte.bind(s),
            u = s.readBits.bind(s),
            c = s.readUEG.bind(s),
            f = s.readBoolean.bind(s),
            g = s.skipBits.bind(s),
            E = s.skipEG.bind(s),
            m = s.skipUEG.bind(s),
            y = this.skipScalingList.bind(this);
          d();
          let S = d();
          if (
            (u(5),
            g(3),
            d(),
            m(),
            S === 100 ||
              S === 110 ||
              S === 122 ||
              S === 244 ||
              S === 44 ||
              S === 83 ||
              S === 86 ||
              S === 118 ||
              S === 128)
          ) {
            let _ = c();
            if ((_ === 3 && g(1), m(), m(), g(1), f()))
              for (r = 0, i = _ !== 3 ? 8 : 12; r < i; r++)
                f() && y(r < 6 ? 16 : 64, s);
          }
          m();
          let T = c();
          if (T === 0) c();
          else if (T === 1)
            for (g(1), E(), E(), e = c(), r = 0; r < e; r++) E();
          m(), g(1);
          let A = c(),
            R = c(),
            I = u(1);
          I === 0 && g(1),
            g(1),
            f() && ((a = c()), (n = c()), (l = c()), (o = c()));
          let v = [1, 1];
          if (f() && f())
            switch (d()) {
              case 1:
                v = [1, 1];
                break;
              case 2:
                v = [12, 11];
                break;
              case 3:
                v = [10, 11];
                break;
              case 4:
                v = [16, 11];
                break;
              case 5:
                v = [40, 33];
                break;
              case 6:
                v = [24, 11];
                break;
              case 7:
                v = [20, 11];
                break;
              case 8:
                v = [32, 11];
                break;
              case 9:
                v = [80, 33];
                break;
              case 10:
                v = [18, 11];
                break;
              case 11:
                v = [15, 11];
                break;
              case 12:
                v = [64, 33];
                break;
              case 13:
                v = [160, 99];
                break;
              case 14:
                v = [4, 3];
                break;
              case 15:
                v = [3, 2];
                break;
              case 16:
                v = [2, 1];
                break;
              case 255:
                v = [(d() << 8) | d(), (d() << 8) | d()];
            }
          return {
            width: Math.ceil((A + 1) * 16 - 2 * a - 2 * n),
            height: (2 - I) * (R + 1) * 16 - (I ? 2 : 4) * (l + o),
            pixelRatio: v,
          };
        }
      }
      class Wn extends ga {
        constructor(...t) {
          super(...t), (this.initVPS = null);
        }
        parsePES(t, e, i, r) {
          let s,
            a = this.parseNALu(t, i.data, r),
            n = this.VideoSample,
            l = !1;
          (i.data = null),
            n &&
              a.length &&
              !t.audFound &&
              (this.pushAccessUnit(n, t),
              (n = this.VideoSample =
                this.createVideoSample(!1, i.pts, i.dts))),
            a.forEach((o) => {
              var d, u, c;
              switch (o.type) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                  n ||
                    (n = this.VideoSample =
                      this.createVideoSample(!1, i.pts, i.dts)),
                    (n.frame = !0),
                    (s = !0);
                  break;
                case 16:
                case 17:
                case 18:
                case 21:
                  (s = !0),
                    l &&
                      (c = n) != null &&
                      c.frame &&
                      !n.key &&
                      (this.pushAccessUnit(n, t),
                      (n = this.VideoSample = null)),
                    n ||
                      (n = this.VideoSample =
                        this.createVideoSample(!0, i.pts, i.dts)),
                    (n.key = !0),
                    (n.frame = !0);
                  break;
                case 19:
                case 20:
                  (s = !0),
                    (d = n) != null &&
                      d.frame &&
                      !n.key &&
                      (this.pushAccessUnit(n, t),
                      (n = this.VideoSample = null)),
                    n ||
                      (n = this.VideoSample =
                        this.createVideoSample(!0, i.pts, i.dts)),
                    (n.key = !0),
                    (n.frame = !0);
                  break;
                case 39:
                  (s = !0), Mi(o.data, 2, i.pts, e.samples);
                  break;
                case 32:
                  (s = !0),
                    t.vps ||
                      (typeof t.params != 'object' && (t.params = {}),
                      (t.params = at(t.params, this.readVPS(o.data))),
                      (this.initVPS = o.data)),
                    (t.vps = [o.data]);
                  break;
                case 33:
                  if (
                    ((s = !0),
                    (l = !0),
                    t.vps === void 0 ||
                      t.vps[0] === this.initVPS ||
                      t.sps === void 0 ||
                      this.matchSPS(t.sps[0], o.data) ||
                      ((this.initVPS = t.vps[0]), (t.sps = t.pps = void 0)),
                    !t.sps)
                  ) {
                    let f = this.readSPS(o.data);
                    for (let g in ((t.width = f.width),
                    (t.height = f.height),
                    (t.pixelRatio = f.pixelRatio),
                    (t.codec = f.codecString),
                    (t.sps = []),
                    typeof t.params != 'object' && (t.params = {}),
                    f.params))
                      t.params[g] = f.params[g];
                  }
                  this.pushParameterSet(t.sps, o.data, t.vps),
                    n ||
                      (n = this.VideoSample =
                        this.createVideoSample(!0, i.pts, i.dts)),
                    (n.key = !0);
                  break;
                case 34:
                  if (((s = !0), typeof t.params == 'object')) {
                    if (!t.pps) {
                      t.pps = [];
                      let f = this.readPPS(o.data);
                      for (let g in f) t.params[g] = f[g];
                    }
                    this.pushParameterSet(t.pps, o.data, t.vps);
                  }
                  break;
                case 35:
                  (s = !0),
                    (t.audFound = !0),
                    (u = n) != null &&
                      u.frame &&
                      (this.pushAccessUnit(n, t), (n = null)),
                    n ||
                      (n = this.VideoSample =
                        this.createVideoSample(!1, i.pts, i.dts));
                  break;
                default:
                  s = !1;
              }
              n && s && n.units.push(o);
            }),
            r && n && (this.pushAccessUnit(n, t), (this.VideoSample = null));
        }
        pushParameterSet(t, e, i) {
          ((!i || i[0] !== this.initVPS) && (i || t.length)) || t.push(e);
        }
        getNALuType(t, e) {
          return (126 & t[e]) >>> 1;
        }
        ebsp2rbsp(t) {
          let e = new Uint8Array(t.byteLength),
            i = 0;
          for (let r = 0; r < t.byteLength; r++)
            (!(r >= 2) || t[r] !== 3 || t[r - 1] !== 0 || t[r - 2] !== 0) &&
              ((e[i] = t[r]), i++);
          return new Uint8Array(e.buffer, 0, i);
        }
        pushAccessUnit(t, e) {
          super.pushAccessUnit(t, e), this.initVPS && (this.initVPS = null);
        }
        readVPS(t) {
          let e = new $e(t);
          return (
            e.readUByte(),
            e.readUByte(),
            e.readBits(4),
            e.skipBits(2),
            e.readBits(6),
            {
              numTemporalLayers: e.readBits(3) + 1,
              temporalIdNested: e.readBoolean(),
            }
          );
        }
        readSPS(t) {
          let e = new $e(this.ebsp2rbsp(t));
          e.readUByte(), e.readUByte(), e.readBits(4);
          let i = e.readBits(3);
          e.readBoolean();
          let r = e.readBits(2),
            s = e.readBoolean(),
            a = e.readBits(5),
            n = e.readUByte(),
            l = e.readUByte(),
            o = e.readUByte(),
            d = e.readUByte(),
            u = e.readUByte(),
            c = e.readUByte(),
            f = e.readUByte(),
            g = e.readUByte(),
            E = e.readUByte(),
            m = e.readUByte(),
            y = e.readUByte(),
            S = [],
            T = [];
          for (let H = 0; H < i; H++)
            S.push(e.readBoolean()), T.push(e.readBoolean());
          if (i > 0) for (let H = i; H < 8; H++) e.readBits(2);
          for (let H = 0; H < i; H++)
            S[H] &&
              (e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte(),
              e.readUByte()),
              T[H] && e.readUByte();
          e.readUEG();
          let A = e.readUEG();
          A == 3 && e.skipBits(1);
          let R = e.readUEG(),
            I = e.readUEG(),
            v = e.readBoolean(),
            _ = 0,
            L = 0,
            C = 0,
            M = 0;
          v &&
            ((_ += e.readUEG()),
            (L += e.readUEG()),
            (C += e.readUEG()),
            (M += e.readUEG()));
          let G = e.readUEG(),
            k = e.readUEG(),
            P = e.readUEG(),
            x = e.readBoolean();
          for (let H = x ? 0 : i; H <= i; H++)
            e.skipUEG(), e.skipUEG(), e.skipUEG();
          if (
            (e.skipUEG(),
            e.skipUEG(),
            e.skipUEG(),
            e.skipUEG(),
            e.skipUEG(),
            e.skipUEG(),
            e.readBoolean() && e.readBoolean())
          )
            for (let H = 0; H < 4; H++)
              for (let ut = 0; ut < (H === 3 ? 2 : 6); ut++)
                if (e.readBoolean()) {
                  let ct = Math.min(64, 1 << (4 + (H << 1)));
                  H > 1 && e.readEG();
                  for (let vt = 0; vt < ct; vt++) e.readEG();
                } else e.readUEG();
          e.readBoolean(),
            e.readBoolean(),
            e.readBoolean() &&
              (e.readUByte(), e.skipUEG(), e.skipUEG(), e.readBoolean());
          let U = e.readUEG(),
            $ = 0;
          for (let H = 0; H < U; H++) {
            let ut = !1;
            if ((H !== 0 && (ut = e.readBoolean()), ut)) {
              H === U && e.readUEG(), e.readBoolean(), e.readUEG();
              let ct = 0;
              for (let vt = 0; vt <= $; vt++) {
                let pt = e.readBoolean(),
                  Et = !1;
                pt || (Et = e.readBoolean()), (pt || Et) && ct++;
              }
              $ = ct;
            } else {
              let ct = e.readUEG(),
                vt = e.readUEG();
              $ = ct + vt;
              for (let pt = 0; pt < ct; pt++) e.readUEG(), e.readBoolean();
              for (let pt = 0; pt < vt; pt++) e.readUEG(), e.readBoolean();
            }
          }
          if (e.readBoolean()) {
            let H = e.readUEG();
            for (let ut = 0; ut < H; ut++) {
              for (let ct = 0; ct < P + 4; ct++) e.readBits(1);
              e.readBits(1);
            }
          }
          let B = 0,
            O = 1,
            w = 1,
            q = !0,
            Z = 1,
            X = 0;
          if ((e.readBoolean(), e.readBoolean(), e.readBoolean())) {
            if (e.readBoolean()) {
              let H = e.readUByte();
              H > 0 && H < 16
                ? ((O = [
                    1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2,
                  ][H - 1]),
                  (w = [
                    1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1,
                  ][H - 1]))
                : H === 255 && ((O = e.readBits(16)), (w = e.readBits(16)));
            }
            if (
              (e.readBoolean() && e.readBoolean(),
              e.readBoolean() &&
                (e.readBits(3),
                e.readBoolean(),
                e.readBoolean() &&
                  (e.readUByte(), e.readUByte(), e.readUByte())),
              e.readBoolean() && (e.readUEG(), e.readUEG()),
              e.readBoolean(),
              e.readBoolean(),
              e.readBoolean(),
              e.readBoolean() &&
                (e.skipUEG(), e.skipUEG(), e.skipUEG(), e.skipUEG()),
              e.readBoolean() &&
                ((Z = e.readBits(32)),
                (X = e.readBits(32)),
                e.readBoolean() && e.readUEG(),
                e.readBoolean()))
            ) {
              let H = e.readBoolean(),
                ut = e.readBoolean(),
                ct = !1;
              (H || ut) &&
                ((ct = e.readBoolean()) &&
                  (e.readUByte(),
                  e.readBits(5),
                  e.readBoolean(),
                  e.readBits(5)),
                e.readBits(4),
                e.readBits(4),
                ct && e.readBits(4),
                e.readBits(5),
                e.readBits(5),
                e.readBits(5));
              for (let vt = 0; vt <= i; vt++) {
                let pt = (q = e.readBoolean()) || e.readBoolean(),
                  Et = !1;
                pt ? e.readEG() : (Et = e.readBoolean());
                let It = Et ? 1 : e.readUEG() + 1;
                if (H)
                  for (let et = 0; et < It; et++)
                    e.readUEG(),
                      e.readUEG(),
                      ct && (e.readUEG(), e.readUEG()),
                      e.skipBits(1);
                if (ut)
                  for (let et = 0; et < It; et++)
                    e.readUEG(),
                      e.readUEG(),
                      ct && (e.readUEG(), e.readUEG()),
                      e.skipBits(1);
              }
            }
            e.readBoolean() &&
              (e.readBoolean(),
              e.readBoolean(),
              e.readBoolean(),
              (B = e.readUEG()));
          }
          let V = R,
            K = I;
          if (v) {
            let H = 1,
              ut = 1;
            A === 1 ? (H = ut = 2) : A == 2 && (H = 2),
              (V = R - H * L - H * _),
              (K = I - ut * M - ut * C);
          }
          let z = r ? ['A', 'B', 'C'][r] : '',
            W = (n << 24) | (l << 16) | (o << 8) | d,
            dt = 0;
          for (let H = 0; H < 32; H++)
            dt = (dt | (((W >> H) & 1) << (31 - H))) >>> 0;
          let gt = dt.toString(16);
          return (
            a === 1 && gt === '2' && (gt = '6'),
            {
              codecString: `hvc1.${z}${a}.${gt}.${s ? 'H' : 'L'}${y}.B0`,
              params: {
                general_tier_flag: s,
                general_profile_idc: a,
                general_profile_space: r,
                general_profile_compatibility_flags: [n, l, o, d],
                general_constraint_indicator_flags: [u, c, f, g, E, m],
                general_level_idc: y,
                bit_depth: G + 8,
                bit_depth_luma_minus8: G,
                bit_depth_chroma_minus8: k,
                min_spatial_segmentation_idc: B,
                chroma_format_idc: A,
                frame_rate: { fixed: q, fps: X / Z },
              },
              width: V,
              height: K,
              pixelRatio: [O, w],
            }
          );
        }
        readPPS(t) {
          let e = new $e(this.ebsp2rbsp(t));
          e.readUByte(),
            e.readUByte(),
            e.skipUEG(),
            e.skipUEG(),
            e.skipBits(2),
            e.skipBits(3),
            e.skipBits(2),
            e.skipUEG(),
            e.skipUEG(),
            e.skipEG(),
            e.skipBits(2),
            e.readBoolean() && e.skipUEG(),
            e.skipEG(),
            e.skipEG(),
            e.skipBits(4);
          let i = e.readBoolean(),
            r = e.readBoolean(),
            s = 1;
          return (
            r && i ? (s = 0) : r ? (s = 3) : i && (s = 2),
            { parallelismType: s }
          );
        }
        matchSPS(t, e) {
          return (
            String.fromCharCode.apply(null, t).substr(3) ===
            String.fromCharCode.apply(null, e).substr(3)
          );
        }
      }
      class de {
        constructor(t, e, i, r) {
          (this.logger = void 0),
            (this.observer = void 0),
            (this.config = void 0),
            (this.typeSupported = void 0),
            (this.sampleAes = null),
            (this.pmtParsed = !1),
            (this.audioCodec = void 0),
            (this.videoCodec = void 0),
            (this._pmtId = -1),
            (this._videoTrack = void 0),
            (this._audioTrack = void 0),
            (this._id3Track = void 0),
            (this._txtTrack = void 0),
            (this.aacOverFlow = null),
            (this.remainderData = null),
            (this.videoParser = void 0),
            (this.observer = t),
            (this.config = e),
            (this.typeSupported = i),
            (this.logger = r),
            (this.videoParser = null);
        }
        static probe(t, e) {
          let i = de.syncOffset(t);
          return (
            i > 0 &&
              e.warn(
                `MPEG2-TS detected but first sync word found @ offset ${i}`
              ),
            i !== -1
          );
        }
        static syncOffset(t) {
          let e = t.length,
            i = Math.min(940, e - 188) + 1,
            r = 0;
          for (; r < i; ) {
            let s = !1,
              a = -1,
              n = 0;
            for (let l = r; l < e; l += 188)
              if (t[l] === 71 && (e - l == 188 || t[l + 188] === 71)) {
                if (
                  (n++,
                  a === -1 &&
                    (a = l) !== 0 &&
                    (i = Math.min(a + 18612, t.length - 188) + 1),
                  s || (s = dr(t, l) === 0),
                  s && n > 1 && ((a === 0 && n > 2) || l + 188 > i))
                )
                  return a;
              } else {
                if (n) return -1;
                break;
              }
            r++;
          }
          return -1;
        }
        static createTrack(t, e) {
          return {
            container: t === 'video' || t === 'audio' ? 'video/mp2t' : void 0,
            type: t,
            id: Yr[t],
            pid: -1,
            inputTimeScale: 9e4,
            sequenceNumber: 0,
            samples: [],
            dropped: 0,
            duration: t === 'audio' ? e : void 0,
          };
        }
        resetInitSegment(t, e, i, r) {
          (this.pmtParsed = !1),
            (this._pmtId = -1),
            (this._videoTrack = de.createTrack('video')),
            (this._videoTrack.duration = r),
            (this._audioTrack = de.createTrack('audio', r)),
            (this._id3Track = de.createTrack('id3')),
            (this._txtTrack = de.createTrack('text')),
            (this._audioTrack.segmentCodec = 'aac'),
            (this.videoParser = null),
            (this.aacOverFlow = null),
            (this.remainderData = null),
            (this.audioCodec = e),
            (this.videoCodec = i);
        }
        resetTimeStamp() {}
        resetContiguity() {
          let { _audioTrack: t, _videoTrack: e, _id3Track: i } = this;
          t && (t.pesData = null),
            e && (e.pesData = null),
            i && (i.pesData = null),
            (this.aacOverFlow = null),
            (this.remainderData = null);
        }
        demux(t, e, i = !1, r = !1) {
          let s;
          i || (this.sampleAes = null);
          let a = this._videoTrack,
            n = this._audioTrack,
            l = this._id3Track,
            o = this._txtTrack,
            d = a.pid,
            u = a.pesData,
            c = n.pid,
            f = l.pid,
            g = n.pesData,
            E = l.pesData,
            m = null,
            y = this.pmtParsed,
            S = this._pmtId,
            T = t.length;
          if (
            (this.remainderData &&
              ((T = (t = Wt(this.remainderData, t)).length),
              (this.remainderData = null)),
            T < 188 && !r)
          )
            return (
              (this.remainderData = t),
              { audioTrack: n, videoTrack: a, id3Track: l, textTrack: o }
            );
          let A = Math.max(0, de.syncOffset(t));
          (T -= (T - A) % 188) < t.byteLength &&
            !r &&
            (this.remainderData = new Uint8Array(
              t.buffer,
              T,
              t.buffer.byteLength - T
            ));
          let R = 0;
          for (let L = A; L < T; L += 188)
            if (t[L] === 71) {
              let C,
                M = !!(64 & t[L + 1]),
                G = dr(t, L);
              if ((48 & t[L + 3]) >> 4 > 1) {
                if ((C = L + 5 + t[L + 4]) === L + 188) continue;
              } else C = L + 4;
              switch (G) {
                case d:
                  M &&
                    (u &&
                      (s = De(u, this.logger)) &&
                      (this.readyVideoParser(a.segmentCodec),
                      this.videoParser !== null &&
                        this.videoParser.parsePES(a, o, s, !1)),
                    (u = { data: [], size: 0 })),
                    u &&
                      (u.data.push(t.subarray(C, L + 188)),
                      (u.size += L + 188 - C));
                  break;
                case c:
                  if (M) {
                    if (g && (s = De(g, this.logger)))
                      switch (n.segmentCodec) {
                        case 'aac':
                          this.parseAACPES(n, s);
                          break;
                        case 'mp3':
                          this.parseMPEGPES(n, s);
                          break;
                        case 'ac3':
                          this.parseAC3PES(n, s);
                      }
                    g = { data: [], size: 0 };
                  }
                  g &&
                    (g.data.push(t.subarray(C, L + 188)),
                    (g.size += L + 188 - C));
                  break;
                case f:
                  M &&
                    (E && (s = De(E, this.logger)) && this.parseID3PES(l, s),
                    (E = { data: [], size: 0 })),
                    E &&
                      (E.data.push(t.subarray(C, L + 188)),
                      (E.size += L + 188 - C));
                  break;
                case 0:
                  var I, v;
                  M && (C += t[C] + 1),
                    (S = this._pmtId =
                      ((31 & (I = t)[(v = C) + 10]) << 8) | I[v + 11]);
                  break;
                case S: {
                  M && (C += t[C] + 1);
                  let k = (function (P, x, U, $, B, O) {
                    let w = {
                        audioPid: -1,
                        videoPid: -1,
                        id3Pid: -1,
                        segmentVideoCodec: 'avc',
                        segmentAudioCodec: 'aac',
                      },
                      q = ((15 & P[x + 1]) << 8) | P[x + 2],
                      Z = x + 3 + q - 4,
                      X = ((15 & P[x + 10]) << 8) | P[x + 11];
                    for (x += 12 + X; x < Z; ) {
                      let V = dr(P, x),
                        K = ((15 & P[x + 3]) << 8) | P[x + 4];
                      switch (P[x]) {
                        case 207:
                          if (!$) {
                            cr('ADTS AAC', O);
                            break;
                          }
                        case 15:
                          w.audioPid === -1 && (w.audioPid = V);
                          break;
                        case 21:
                          w.id3Pid === -1 && (w.id3Pid = V);
                          break;
                        case 219:
                          if (!$) {
                            cr('H.264', O);
                            break;
                          }
                        case 27:
                          w.videoPid === -1 && (w.videoPid = V);
                          break;
                        case 3:
                        case 4:
                          U.mpeg || U.mp3
                            ? w.audioPid === -1 &&
                              ((w.audioPid = V), (w.segmentAudioCodec = 'mp3'))
                            : O.log(
                                'MPEG audio found, not supported in this browser'
                              );
                          break;
                        case 193:
                          if (!$) {
                            cr('AC-3', O);
                            break;
                          }
                        case 129:
                          U.ac3
                            ? w.audioPid === -1 &&
                              ((w.audioPid = V), (w.segmentAudioCodec = 'ac3'))
                            : O.log(
                                'AC-3 audio found, not supported in this browser'
                              );
                          break;
                        case 6:
                          if (w.audioPid === -1 && K > 0) {
                            let z = x + 5,
                              W = K;
                            for (; W > 2; ) {
                              P[z] === 106 &&
                                (U.ac3 !== !0
                                  ? O.log(
                                      'AC-3 audio found, not supported in this browser for now'
                                    )
                                  : ((w.audioPid = V),
                                    (w.segmentAudioCodec = 'ac3')));
                              let dt = P[z + 1] + 2;
                              (z += dt), (W -= dt);
                            }
                          }
                          break;
                        case 194:
                        case 135:
                          return (
                            ur(
                              B,
                              Error('Unsupported EC-3 in M2TS found'),
                              void 0,
                              O
                            ),
                            w
                          );
                        case 36:
                          w.videoPid === -1 &&
                            ((w.videoPid = V),
                            (w.segmentVideoCodec = 'hevc'),
                            O.log('HEVC in M2TS found'));
                      }
                      x += K + 5;
                    }
                    return w;
                  })(t, C, this.typeSupported, i, this.observer, this.logger);
                  (d = k.videoPid) > 0 &&
                    ((a.pid = d), (a.segmentCodec = k.segmentVideoCodec)),
                    (c = k.audioPid) > 0 &&
                      ((n.pid = c), (n.segmentCodec = k.segmentAudioCodec)),
                    (f = k.id3Pid) > 0 && (l.pid = f),
                    m === null ||
                      y ||
                      (this.logger.warn(
                        `MPEG-TS PMT found at ${L} after unknown PID '${m}'. Backtracking to sync byte @${A} to parse all TS packets.`
                      ),
                      (m = null),
                      (L = A - 188)),
                    (y = this.pmtParsed = !0);
                  break;
                }
                case 17:
                case 8191:
                  break;
                default:
                  m = G;
              }
            } else R++;
          R > 0 &&
            ur(
              this.observer,
              Error(`Found ${R} TS packet/s that do not start with 0x47`),
              void 0,
              this.logger
            ),
            (a.pesData = u),
            (n.pesData = g),
            (l.pesData = E);
          let _ = { audioTrack: n, videoTrack: a, id3Track: l, textTrack: o };
          return r && this.extractRemainingSamples(_), _;
        }
        flush() {
          let t,
            { remainderData: e } = this;
          return (
            (this.remainderData = null),
            (t = e
              ? this.demux(e, -1, !1, !0)
              : {
                  videoTrack: this._videoTrack,
                  audioTrack: this._audioTrack,
                  id3Track: this._id3Track,
                  textTrack: this._txtTrack,
                }),
            this.extractRemainingSamples(t),
            this.sampleAes ? this.decrypt(t, this.sampleAes) : t
          );
        }
        extractRemainingSamples(t) {
          let e,
            { audioTrack: i, videoTrack: r, id3Track: s, textTrack: a } = t,
            n = r.pesData,
            l = i.pesData,
            o = s.pesData;
          if (
            (n && (e = De(n, this.logger))
              ? (this.readyVideoParser(r.segmentCodec),
                this.videoParser !== null &&
                  (this.videoParser.parsePES(r, a, e, !0), (r.pesData = null)))
              : (r.pesData = n),
            l && (e = De(l, this.logger)))
          ) {
            switch (i.segmentCodec) {
              case 'aac':
                this.parseAACPES(i, e);
                break;
              case 'mp3':
                this.parseMPEGPES(i, e);
                break;
              case 'ac3':
                this.parseAC3PES(i, e);
            }
            i.pesData = null;
          } else
            l != null &&
              l.size &&
              this.logger.log(
                'last AAC PES packet truncated,might overlap between fragments'
              ),
              (i.pesData = l);
          o && (e = De(o, this.logger))
            ? (this.parseID3PES(s, e), (s.pesData = null))
            : (s.pesData = o);
        }
        demuxSampleAes(t, e, i) {
          let r = this.demux(t, i, !0, !this.config.progressive),
            s = (this.sampleAes = new Hn(this.observer, this.config, e));
          return this.decrypt(r, s);
        }
        readyVideoParser(t) {
          this.videoParser === null &&
            (t === 'avc'
              ? (this.videoParser = new Yn())
              : t === 'hevc' && (this.videoParser = new Wn()));
        }
        decrypt(t, e) {
          return new Promise((i) => {
            let { audioTrack: r, videoTrack: s } = t;
            r.samples && r.segmentCodec === 'aac'
              ? e.decryptAacSamples(r.samples, 0, () => {
                  s.samples
                    ? e.decryptAvcSamples(s.samples, 0, 0, () => {
                        i(t);
                      })
                    : i(t);
                })
              : s.samples &&
                e.decryptAvcSamples(s.samples, 0, 0, () => {
                  i(t);
                });
          });
        }
        destroy() {
          this.observer && this.observer.removeAllListeners(),
            (this.config = this.logger = this.observer = null),
            (this.aacOverFlow =
              this.videoParser =
              this.remainderData =
              this.sampleAes =
                null),
            (this._videoTrack =
              this._audioTrack =
              this._id3Track =
              this._txtTrack =
                void 0);
        }
        parseAACPES(t, e) {
          let i,
            r,
            s,
            a,
            n = 0,
            l = this.aacOverFlow,
            o = e.data;
          if (l) {
            this.aacOverFlow = null;
            let u = l.missing,
              c = l.sample.unit.byteLength;
            u === -1
              ? (o = Wt(l.sample.unit, o))
              : (l.sample.unit.set(o.subarray(0, u), c - u),
                t.samples.push(l.sample),
                (n = l.missing));
          }
          for (i = n, r = o.length; i < r - 1 && !gi(o, i); i++);
          if (i !== n) {
            let u,
              c = i < r - 1;
            if (
              ((u = c
                ? `AAC PES did not start with ADTS header,offset:${i}`
                : 'No ADTS header found in AAC PES'),
              ur(this.observer, Error(u), c, this.logger),
              !c)
            )
              return;
          }
          if ((ra(t, this.observer, o, i, this.audioCodec), e.pts !== void 0))
            s = e.pts;
          else if (l) {
            let u = 9216e4 / t.samplerate;
            s = l.sample.pts + u;
          } else {
            this.logger.warn('[tsdemuxer]: AAC PES unknown PTS');
            return;
          }
          let d = 0;
          for (; i < r; ) {
            if (((a = sa(t, o, i, s, d)), (i += a.length), a.missing)) {
              this.aacOverFlow = a;
              break;
            }
            for (d++; i < r - 1 && !gi(o, i); i++);
          }
        }
        parseMPEGPES(t, e) {
          let i = e.data,
            r = i.length,
            s = 0,
            a = 0,
            n = e.pts;
          if (n === void 0) {
            this.logger.warn('[tsdemuxer]: MPEG PES unknown PTS');
            return;
          }
          for (; a < r; )
            if (ha(i, a)) {
              let l = la(t, i, a, n, s);
              if (l) (a += l.length), s++;
              else break;
            } else a++;
        }
        parseAC3PES(t, e) {
          {
            let i,
              r = e.data,
              s = e.pts;
            if (s === void 0) {
              this.logger.warn('[tsdemuxer]: AC3 PES unknown PTS');
              return;
            }
            let a = r.length,
              n = 0,
              l = 0;
            for (; l < a && (i = ca(t, r, l, s, n++)) > 0; ) l += i;
          }
        }
        parseID3PES(t, e) {
          if (e.pts === void 0) {
            this.logger.warn('[tsdemuxer]: ID3 PES unknown PTS');
            return;
          }
          let i = at({}, e, {
            type: this._videoTrack ? Vt.emsg : Vt.audioId3,
            duration: Number.POSITIVE_INFINITY,
          });
          t.samples.push(i);
        }
      }
      function dr(h, t) {
        return ((31 & h[t + 1]) << 8) + h[t + 2];
      }
      function ur(h, t, e, i) {
        i.warn(`parsing error: ${t.message}`),
          h.emit(p.ERROR, p.ERROR, {
            type: Q.MEDIA_ERROR,
            details: b.FRAG_PARSING_ERROR,
            fatal: !1,
            levelRetry: e,
            error: t,
            reason: t.message,
          });
      }
      function cr(h, t) {
        t.log(`${h} with AES-128-CBC encryption found in unencrypted stream`);
      }
      function De(h, t) {
        let e,
          i,
          r,
          s,
          a,
          n = 0,
          l = h.data;
        if (!h || h.size === 0) return null;
        for (; l[0].length < 19 && l.length > 1; )
          (l[0] = Wt(l[0], l[1])), l.splice(1, 1);
        if (((e = l[0])[0] << 16) + (e[1] << 8) + e[2] === 1) {
          if ((i = (e[4] << 8) + e[5]) && i > h.size - 6) return null;
          let o = e[7];
          192 & o &&
            ((s =
              (14 & e[9]) * 536870912 +
              (255 & e[10]) * 4194304 +
              (254 & e[11]) * 16384 +
              (255 & e[12]) * 128 +
              (254 & e[13]) / 2),
            64 & o
              ? s -
                  (a =
                    (14 & e[14]) * 536870912 +
                    (255 & e[15]) * 4194304 +
                    (254 & e[16]) * 16384 +
                    (255 & e[17]) * 128 +
                    (254 & e[18]) / 2) >
                  54e5 &&
                (t.warn(
                  `${Math.round(
                    (s - a) / 9e4
                  )}s delta between PTS and DTS, align them`
                ),
                (s = a))
              : (a = s));
          let d = (r = e[8]) + 9;
          if (h.size <= d) return null;
          h.size -= d;
          let u = new Uint8Array(h.size);
          for (let c = 0, f = l.length; c < f; c++) {
            let g = (e = l[c]).byteLength;
            if (d) {
              if (d > g) {
                d -= g;
                continue;
              }
              (e = e.subarray(d)), (g -= d), (d = 0);
            }
            u.set(e, n), (n += g);
          }
          return i && (i -= r + 3), { data: u, pts: s, dts: a, len: i };
        }
        return null;
      }
      class jn {
        static getSilentFrame(t, e) {
          if (t === 'mp4a.40.2') {
            if (e === 1) return new Uint8Array([0, 200, 0, 128, 35, 128]);
            if (e === 2)
              return new Uint8Array([33, 0, 73, 144, 2, 25, 0, 35, 128]);
            if (e === 3)
              return new Uint8Array([
                0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 142,
              ]);
            if (e === 4)
              return new Uint8Array([
                0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 128, 44, 128, 8,
                2, 56,
              ]);
            if (e === 5)
              return new Uint8Array([
                0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153,
                0, 33, 144, 2, 56,
              ]);
            if (e === 6)
              return new Uint8Array([
                0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153,
                0, 33, 144, 2, 0, 178, 0, 32, 8, 224,
              ]);
          } else {
            if (e === 1)
              return new Uint8Array([
                1, 64, 34, 128, 163, 78, 230, 128, 186, 8, 0, 0, 0, 28, 6, 241,
                193, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
                90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
                90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94,
              ]);
            if (e === 2 || e === 3)
              return new Uint8Array([
                1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0,
                6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
                90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
                90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94,
              ]);
          }
        }
      }
      class D {
        static init() {
          let t;
          for (t in ((D.types = {
            avc1: [],
            avcC: [],
            hvc1: [],
            hvcC: [],
            btrt: [],
            dinf: [],
            dref: [],
            esds: [],
            ftyp: [],
            hdlr: [],
            mdat: [],
            mdhd: [],
            mdia: [],
            mfhd: [],
            minf: [],
            moof: [],
            moov: [],
            mp4a: [],
            '.mp3': [],
            dac3: [],
            'ac-3': [],
            mvex: [],
            mvhd: [],
            pasp: [],
            sdtp: [],
            stbl: [],
            stco: [],
            stsc: [],
            stsd: [],
            stsz: [],
            stts: [],
            tfdt: [],
            tfhd: [],
            traf: [],
            trak: [],
            trun: [],
            trex: [],
            tkhd: [],
            vmhd: [],
            smhd: [],
          }),
          D.types))
            D.types.hasOwnProperty(t) &&
              (D.types[t] = [
                t.charCodeAt(0),
                t.charCodeAt(1),
                t.charCodeAt(2),
                t.charCodeAt(3),
              ]);
          let e = new Uint8Array([
              0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72, 97, 110, 100, 108, 101,
              114, 0,
            ]),
            i = new Uint8Array([
              0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101,
              114, 0,
            ]);
          D.HDLR_TYPES = { video: e, audio: i };
          let r = new Uint8Array([
              0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0,
              1,
            ]),
            s = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
          (D.STTS = D.STSC = D.STCO = s),
            (D.STSZ = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
            (D.VMHD = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0])),
            (D.SMHD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])),
            (D.STSD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]));
          let a = new Uint8Array([105, 115, 111, 109]),
            n = new Uint8Array([97, 118, 99, 49]),
            l = new Uint8Array([0, 0, 0, 1]);
          (D.FTYP = D.box(D.types.ftyp, a, l, a, n)),
            (D.DINF = D.box(D.types.dinf, D.box(D.types.dref, r)));
        }
        static box(t, ...e) {
          let i = 8,
            r = e.length,
            s = r;
          for (; r--; ) i += e[r].byteLength;
          let a = new Uint8Array(i);
          for (
            a[0] = (i >> 24) & 255,
              a[1] = (i >> 16) & 255,
              a[2] = (i >> 8) & 255,
              a[3] = 255 & i,
              a.set(t, 4),
              r = 0,
              i = 8;
            r < s;
            r++
          )
            a.set(e[r], i), (i += e[r].byteLength);
          return a;
        }
        static hdlr(t) {
          return D.box(D.types.hdlr, D.HDLR_TYPES[t]);
        }
        static mdat(t) {
          return D.box(D.types.mdat, t);
        }
        static mdhd(t, e) {
          let i = Math.floor((e *= t) / 4294967296),
            r = Math.floor(e % 4294967296);
          return D.box(
            D.types.mdhd,
            new Uint8Array([
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              2,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              3,
              (t >> 24) & 255,
              (t >> 16) & 255,
              (t >> 8) & 255,
              255 & t,
              i >> 24,
              (i >> 16) & 255,
              (i >> 8) & 255,
              255 & i,
              r >> 24,
              (r >> 16) & 255,
              (r >> 8) & 255,
              255 & r,
              85,
              196,
              0,
              0,
            ])
          );
        }
        static mdia(t) {
          return D.box(
            D.types.mdia,
            D.mdhd(t.timescale || 0, t.duration || 0),
            D.hdlr(t.type),
            D.minf(t)
          );
        }
        static mfhd(t) {
          return D.box(
            D.types.mfhd,
            new Uint8Array([
              0,
              0,
              0,
              0,
              t >> 24,
              (t >> 16) & 255,
              (t >> 8) & 255,
              255 & t,
            ])
          );
        }
        static minf(t) {
          return t.type === 'audio'
            ? D.box(
                D.types.minf,
                D.box(D.types.smhd, D.SMHD),
                D.DINF,
                D.stbl(t)
              )
            : D.box(
                D.types.minf,
                D.box(D.types.vmhd, D.VMHD),
                D.DINF,
                D.stbl(t)
              );
        }
        static moof(t, e, i) {
          return D.box(D.types.moof, D.mfhd(t), D.traf(i, e));
        }
        static moov(t) {
          let e = t.length,
            i = [];
          for (; e--; ) i[e] = D.trak(t[e]);
          return D.box.apply(
            null,
            [D.types.moov, D.mvhd(t[0].timescale || 0, t[0].duration || 0)]
              .concat(i)
              .concat(D.mvex(t))
          );
        }
        static mvex(t) {
          let e = t.length,
            i = [];
          for (; e--; ) i[e] = D.trex(t[e]);
          return D.box.apply(null, [D.types.mvex, ...i]);
        }
        static mvhd(t, e) {
          let i = Math.floor((e *= t) / 4294967296),
            r = Math.floor(e % 4294967296),
            s = new Uint8Array([
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              2,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              3,
              (t >> 24) & 255,
              (t >> 16) & 255,
              (t >> 8) & 255,
              255 & t,
              i >> 24,
              (i >> 16) & 255,
              (i >> 8) & 255,
              255 & i,
              r >> 24,
              (r >> 16) & 255,
              (r >> 8) & 255,
              255 & r,
              0,
              1,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              64,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              255,
              255,
              255,
              255,
            ]);
          return D.box(D.types.mvhd, s);
        }
        static sdtp(t) {
          let e,
            i,
            r = t.samples || [],
            s = new Uint8Array(4 + r.length);
          for (e = 0; e < r.length; e++)
            (i = r[e].flags),
              (s[e + 4] =
                (i.dependsOn << 4) | (i.isDependedOn << 2) | i.hasRedundancy);
          return D.box(D.types.sdtp, s);
        }
        static stbl(t) {
          return D.box(
            D.types.stbl,
            D.stsd(t),
            D.box(D.types.stts, D.STTS),
            D.box(D.types.stsc, D.STSC),
            D.box(D.types.stsz, D.STSZ),
            D.box(D.types.stco, D.STCO)
          );
        }
        static avc1(t) {
          let e,
            i,
            r,
            s = [],
            a = [];
          for (e = 0; e < t.sps.length; e++)
            (r = (i = t.sps[e]).byteLength),
              s.push((r >>> 8) & 255),
              s.push(255 & r),
              (s = s.concat(Array.prototype.slice.call(i)));
          for (e = 0; e < t.pps.length; e++)
            (r = (i = t.pps[e]).byteLength),
              a.push((r >>> 8) & 255),
              a.push(255 & r),
              (a = a.concat(Array.prototype.slice.call(i)));
          let n = D.box(
              D.types.avcC,
              new Uint8Array(
                [1, s[3], s[4], s[5], 255, 224 | t.sps.length]
                  .concat(s)
                  .concat([t.pps.length])
                  .concat(a)
              )
            ),
            l = t.width,
            o = t.height,
            d = t.pixelRatio[0],
            u = t.pixelRatio[1];
          return D.box(
            D.types.avc1,
            new Uint8Array([
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              (l >> 8) & 255,
              255 & l,
              (o >> 8) & 255,
              255 & o,
              0,
              72,
              0,
              0,
              0,
              72,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              18,
              100,
              97,
              105,
              108,
              121,
              109,
              111,
              116,
              105,
              111,
              110,
              47,
              104,
              108,
              115,
              46,
              106,
              115,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              24,
              17,
              17,
            ]),
            n,
            D.box(
              D.types.btrt,
              new Uint8Array([
                0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192,
              ])
            ),
            D.box(
              D.types.pasp,
              new Uint8Array([
                d >> 24,
                (d >> 16) & 255,
                (d >> 8) & 255,
                255 & d,
                u >> 24,
                (u >> 16) & 255,
                (u >> 8) & 255,
                255 & u,
              ])
            )
          );
        }
        static esds(t) {
          return new Uint8Array([
            0,
            0,
            0,
            0,
            3,
            25,
            0,
            1,
            0,
            4,
            17,
            64,
            21,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            5,
            2,
            ...t.config,
            6,
            1,
            2,
          ]);
        }
        static audioStsd(t) {
          let e = t.samplerate || 0;
          return new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            t.channelCount || 0,
            0,
            16,
            0,
            0,
            0,
            0,
            (e >> 8) & 255,
            255 & e,
            0,
            0,
          ]);
        }
        static mp4a(t) {
          return D.box(
            D.types.mp4a,
            D.audioStsd(t),
            D.box(D.types.esds, D.esds(t))
          );
        }
        static mp3(t) {
          return D.box(D.types['.mp3'], D.audioStsd(t));
        }
        static ac3(t) {
          return D.box(
            D.types['ac-3'],
            D.audioStsd(t),
            D.box(D.types.dac3, t.config)
          );
        }
        static stsd(t) {
          let { segmentCodec: e } = t;
          if (t.type === 'audio') {
            if (e === 'aac') return D.box(D.types.stsd, D.STSD, D.mp4a(t));
            if (e === 'ac3' && t.config)
              return D.box(D.types.stsd, D.STSD, D.ac3(t));
            if (e === 'mp3' && t.codec === 'mp3')
              return D.box(D.types.stsd, D.STSD, D.mp3(t));
          } else if (t.pps && t.sps) {
            if (e === 'avc') return D.box(D.types.stsd, D.STSD, D.avc1(t));
            if (e === 'hevc' && t.vps)
              return D.box(D.types.stsd, D.STSD, D.hvc1(t));
          } else throw Error('video track missing pps or sps');
          throw Error(`unsupported ${t.type} segment codec (${e}/${t.codec})`);
        }
        static tkhd(t) {
          let e = t.id,
            i = (t.duration || 0) * (t.timescale || 0),
            r = t.width || 0,
            s = t.height || 0,
            a = Math.floor(i / 4294967296),
            n = Math.floor(i % 4294967296);
          return D.box(
            D.types.tkhd,
            new Uint8Array([
              1,
              0,
              0,
              7,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              2,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              3,
              (e >> 24) & 255,
              (e >> 16) & 255,
              (e >> 8) & 255,
              255 & e,
              0,
              0,
              0,
              0,
              a >> 24,
              (a >> 16) & 255,
              (a >> 8) & 255,
              255 & a,
              n >> 24,
              (n >> 16) & 255,
              (n >> 8) & 255,
              255 & n,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              64,
              0,
              0,
              0,
              (r >> 8) & 255,
              255 & r,
              0,
              0,
              (s >> 8) & 255,
              255 & s,
              0,
              0,
            ])
          );
        }
        static traf(t, e) {
          let i = D.sdtp(t),
            r = t.id,
            s = Math.floor(e / 4294967296),
            a = Math.floor(e % 4294967296);
          return D.box(
            D.types.traf,
            D.box(
              D.types.tfhd,
              new Uint8Array([
                0,
                0,
                0,
                0,
                r >> 24,
                (r >> 16) & 255,
                (r >> 8) & 255,
                255 & r,
              ])
            ),
            D.box(
              D.types.tfdt,
              new Uint8Array([
                1,
                0,
                0,
                0,
                s >> 24,
                (s >> 16) & 255,
                (s >> 8) & 255,
                255 & s,
                a >> 24,
                (a >> 16) & 255,
                (a >> 8) & 255,
                255 & a,
              ])
            ),
            D.trun(t, i.length + 16 + 20 + 8 + 16 + 8 + 8),
            i
          );
        }
        static trak(t) {
          return (
            (t.duration = t.duration || 4294967295),
            D.box(D.types.trak, D.tkhd(t), D.mdia(t))
          );
        }
        static trex(t) {
          let e = t.id;
          return D.box(
            D.types.trex,
            new Uint8Array([
              0,
              0,
              0,
              0,
              e >> 24,
              (e >> 16) & 255,
              (e >> 8) & 255,
              255 & e,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              1,
            ])
          );
        }
        static trun(t, e) {
          let i,
            r,
            s,
            a,
            n,
            l,
            o = t.samples || [],
            d = o.length,
            u = 12 + 16 * d,
            c = new Uint8Array(u);
          for (
            e += 8 + u,
              c.set(
                [
                  t.type === 'video' ? 1 : 0,
                  0,
                  15,
                  1,
                  (d >>> 24) & 255,
                  (d >>> 16) & 255,
                  (d >>> 8) & 255,
                  255 & d,
                  (e >>> 24) & 255,
                  (e >>> 16) & 255,
                  (e >>> 8) & 255,
                  255 & e,
                ],
                0
              ),
              i = 0;
            i < d;
            i++
          )
            (s = (r = o[i]).duration),
              (a = r.size),
              (n = r.flags),
              (l = r.cts),
              c.set(
                [
                  (s >>> 24) & 255,
                  (s >>> 16) & 255,
                  (s >>> 8) & 255,
                  255 & s,
                  (a >>> 24) & 255,
                  (a >>> 16) & 255,
                  (a >>> 8) & 255,
                  255 & a,
                  (n.isLeading << 2) | n.dependsOn,
                  (n.isDependedOn << 6) |
                    (n.hasRedundancy << 4) |
                    (n.paddingValue << 1) |
                    n.isNonSync,
                  61440 & n.degradPrio,
                  15 & n.degradPrio,
                  (l >>> 24) & 255,
                  (l >>> 16) & 255,
                  (l >>> 8) & 255,
                  255 & l,
                ],
                12 + 16 * i
              );
          return D.box(D.types.trun, c);
        }
        static initSegment(t) {
          D.types || D.init();
          let e = D.moov(t);
          return Wt(D.FTYP, e);
        }
        static hvc1(t) {
          let e = t.params,
            i = [t.vps, t.sps, t.pps],
            r = new Uint8Array([
              1,
              (e.general_profile_space << 6) |
                (e.general_tier_flag ? 32 : 0) |
                e.general_profile_idc,
              e.general_profile_compatibility_flags[0],
              e.general_profile_compatibility_flags[1],
              e.general_profile_compatibility_flags[2],
              e.general_profile_compatibility_flags[3],
              e.general_constraint_indicator_flags[0],
              e.general_constraint_indicator_flags[1],
              e.general_constraint_indicator_flags[2],
              e.general_constraint_indicator_flags[3],
              e.general_constraint_indicator_flags[4],
              e.general_constraint_indicator_flags[5],
              e.general_level_idc,
              240 | (e.min_spatial_segmentation_idc >> 8),
              255 & e.min_spatial_segmentation_idc,
              252 | e.parallelismType,
              252 | e.chroma_format_idc,
              248 | e.bit_depth_luma_minus8,
              248 | e.bit_depth_chroma_minus8,
              0,
              parseInt(e.frame_rate.fps),
              3 |
                (e.temporal_id_nested << 2) |
                (e.num_temporal_layers << 3) |
                (e.frame_rate.fixed ? 64 : 0),
              i.length,
            ]),
            s = r.length;
          for (let f = 0; f < i.length; f += 1) {
            s += 3;
            for (let g = 0; g < i[f].length; g += 1) s += 2 + i[f][g].length;
          }
          let a = new Uint8Array(s);
          a.set(r, 0), (s = r.length);
          let n = i.length - 1;
          for (let f = 0; f < i.length; f += 1) {
            a.set(
              new Uint8Array([(32 + f) | (f === n ? 128 : 0), 0, i[f].length]),
              s
            ),
              (s += 3);
            for (let g = 0; g < i[f].length; g += 1)
              a.set(
                new Uint8Array([i[f][g].length >> 8, 255 & i[f][g].length]),
                s
              ),
                (s += 2),
                a.set(i[f][g], s),
                (s += i[f][g].length);
          }
          let l = D.box(D.types.hvcC, a),
            o = t.width,
            d = t.height,
            u = t.pixelRatio[0],
            c = t.pixelRatio[1];
          return D.box(
            D.types.hvc1,
            new Uint8Array([
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              (o >> 8) & 255,
              255 & o,
              (d >> 8) & 255,
              255 & d,
              0,
              72,
              0,
              0,
              0,
              72,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              18,
              100,
              97,
              105,
              108,
              121,
              109,
              111,
              116,
              105,
              111,
              110,
              47,
              104,
              108,
              115,
              46,
              106,
              115,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              24,
              17,
              17,
            ]),
            l,
            D.box(
              D.types.btrt,
              new Uint8Array([
                0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192,
              ])
            ),
            D.box(
              D.types.pasp,
              new Uint8Array([
                u >> 24,
                (u >> 16) & 255,
                (u >> 8) & 255,
                255 & u,
                c >> 24,
                (c >> 16) & 255,
                (c >> 8) & 255,
                255 & c,
              ])
            )
          );
        }
      }
      function fr(h, t, e = 1, i = !1) {
        let r = h * t * e;
        return i ? Math.round(r) : r;
      }
      function Ge(h, t = !1) {
        return fr(h, 1e3, 11111111111111112e-21, t);
      }
      (D.types = void 0),
        (D.HDLR_TYPES = void 0),
        (D.STTS = void 0),
        (D.STSC = void 0),
        (D.STCO = void 0),
        (D.STSZ = void 0),
        (D.VMHD = void 0),
        (D.SMHD = void 0),
        (D.STSD = void 0),
        (D.FTYP = void 0),
        (D.DINF = void 0);
      let ke = null,
        gr = null;
      function ma(h, t, e, i) {
        return {
          duration: t,
          size: e,
          cts: i,
          flags: {
            isLeading: 0,
            isDependedOn: 0,
            hasRedundancy: 0,
            degradPrio: 0,
            dependsOn: h ? 2 : 1,
            isNonSync: h ? 0 : 1,
          },
        };
      }
      class pi extends it {
        constructor(t, e, i, r) {
          if (
            (super('mp4-remuxer', r),
            (this.observer = void 0),
            (this.config = void 0),
            (this.typeSupported = void 0),
            (this.ISGenerated = !1),
            (this._initPTS = null),
            (this._initDTS = null),
            (this.nextVideoTs = null),
            (this.nextAudioTs = null),
            (this.videoSampleDuration = null),
            (this.isAudioContiguous = !1),
            (this.isVideoContiguous = !1),
            (this.videoTrackConfig = void 0),
            (this.observer = t),
            (this.config = e),
            (this.typeSupported = i),
            (this.ISGenerated = !1),
            ke === null)
          ) {
            let s = (navigator.userAgent || '').match(/Chrome\/(\d+)/i);
            ke = s ? parseInt(s[1]) : 0;
          }
          if (gr === null) {
            let s = navigator.userAgent.match(/Safari\/(\d+)/i);
            gr = s ? parseInt(s[1]) : 0;
          }
        }
        destroy() {
          this.config =
            this.videoTrackConfig =
            this._initPTS =
            this._initDTS =
              null;
        }
        resetTimeStamp(t) {
          this.log('initPTS & initDTS reset'),
            (this._initPTS = this._initDTS = t);
        }
        resetNextTimestamp() {
          this.log('reset next timestamp'),
            (this.isVideoContiguous = !1),
            (this.isAudioContiguous = !1);
        }
        resetInitSegment() {
          this.log('ISGenerated flag reset'),
            (this.ISGenerated = !1),
            (this.videoTrackConfig = void 0);
        }
        getVideoStartPts(t) {
          let e = !1,
            i = t[0].pts,
            r = t.reduce((s, a) => {
              let n = a.pts,
                l = n - s;
              return (
                l < -4294967296 && ((e = !0), (l = (n = jt(n, i)) - s)),
                l > 0 ? s : n
              );
            }, i);
          return e && this.debug('PTS rollover detected'), r;
        }
        remux(t, e, i, r, s, a, n, l) {
          let o,
            d,
            u,
            c,
            f,
            g,
            E = s,
            m = s,
            y = t.pid > -1,
            S = e.pid > -1,
            T = e.samples.length,
            A = t.samples.length > 0,
            R = (n && T > 0) || T > 1;
          if (((!y || A) && (!S || R)) || this.ISGenerated || n) {
            let C;
            if (this.ISGenerated) {
              var I, v, _, L;
              let k = this.videoTrackConfig;
              ((k &&
                (e.width !== k.width ||
                  e.height !== k.height ||
                  ((I = e.pixelRatio) == null ? void 0 : I[0]) !==
                    ((v = k.pixelRatio) == null ? void 0 : v[0]) ||
                  ((_ = e.pixelRatio) == null ? void 0 : _[1]) !==
                    ((L = k.pixelRatio) == null ? void 0 : L[1]))) ||
                (!k && R) ||
                (this.nextAudioTs === null && A)) &&
                this.resetInitSegment();
            }
            this.ISGenerated || (u = this.generateIS(t, e, s, a));
            let M = this.isVideoContiguous,
              G = -1;
            if (
              R &&
              ((G = (function (k) {
                for (let P = 0; P < k.length; P++) if (k[P].key) return P;
                return -1;
              })(e.samples)),
              !M && this.config.forceKeyFrameOnDiscontinuity)
            )
              if (((g = !0), G > 0)) {
                this.warn(
                  `Dropped ${G} out of ${T} video samples due to a missing keyframe`
                );
                let k = this.getVideoStartPts(e.samples);
                (e.samples = e.samples.slice(G)),
                  (e.dropped += G),
                  (m += (e.samples[0].pts - k) / e.inputTimeScale),
                  (C = m);
              } else
                G === -1 &&
                  (this.warn(`No keyframe found out of ${T} video samples`),
                  (g = !1));
            if (this.ISGenerated) {
              if (A && R) {
                let k = this.getVideoStartPts(e.samples),
                  P = (jt(t.samples[0].pts, k) - k) / e.inputTimeScale;
                (E += Math.max(0, P)), (m += Math.max(0, -P));
              }
              if (A) {
                if (
                  (t.samplerate ||
                    (this.warn('regenerate InitSegment as audio detected'),
                    (u = this.generateIS(t, e, s, a))),
                  (d = this.remuxAudio(
                    t,
                    E,
                    this.isAudioContiguous,
                    a,
                    S || R || l === j.AUDIO ? m : void 0
                  )),
                  R)
                ) {
                  let k = d ? d.endPTS - d.startPTS : 0;
                  e.inputTimeScale ||
                    (this.warn('regenerate InitSegment as video detected'),
                    (u = this.generateIS(t, e, s, a))),
                    (o = this.remuxVideo(e, m, M, k));
                }
              } else R && (o = this.remuxVideo(e, m, M, 0));
              o &&
                ((o.firstKeyFrame = G),
                (o.independent = G !== -1),
                (o.firstKeyFramePTS = C));
            }
          }
          return (
            this.ISGenerated &&
              this._initPTS &&
              this._initDTS &&
              (i.samples.length && (f = pa(i, s, this._initPTS, this._initDTS)),
              r.samples.length && (c = Ea(r, s, this._initPTS))),
            {
              audio: d,
              video: o,
              initSegment: u,
              independent: g,
              text: c,
              id3: f,
            }
          );
        }
        generateIS(t, e, i, r) {
          let s,
            a,
            n,
            l = t.samples,
            o = e.samples,
            d = this.typeSupported,
            u = {},
            c = this._initPTS,
            f = !c || r,
            g = 'audio/mp4',
            E = -1;
          if ((f && (s = a = 1 / 0), t.config && l.length)) {
            switch (((t.timescale = t.samplerate), t.segmentCodec)) {
              case 'mp3':
                d.mpeg
                  ? ((g = 'audio/mpeg'), (t.codec = ''))
                  : d.mp3 && (t.codec = 'mp3');
                break;
              case 'ac3':
                t.codec = 'ac-3';
            }
            (u.audio = {
              id: 'audio',
              container: g,
              codec: t.codec,
              initSegment:
                t.segmentCodec === 'mp3' && d.mpeg
                  ? new Uint8Array(0)
                  : D.initSegment([t]),
              metadata: { channelCount: t.channelCount },
            }),
              f &&
                ((E = t.id),
                (n = t.inputTimeScale),
                c && n === c.timescale
                  ? (f = !1)
                  : (s = a = l[0].pts - Math.round(n * i)));
          }
          if (e.sps && e.pps && o.length) {
            if (
              ((e.timescale = e.inputTimeScale),
              (u.video = {
                id: 'main',
                container: 'video/mp4',
                codec: e.codec,
                initSegment: D.initSegment([e]),
                metadata: { width: e.width, height: e.height },
              }),
              f)
            )
              if (((E = e.id), (n = e.inputTimeScale), c && n === c.timescale))
                f = !1;
              else {
                let m = this.getVideoStartPts(o),
                  y = Math.round(n * i);
                (a = Math.min(a, jt(o[0].dts, m) - y)),
                  (s = Math.min(s, m - y));
              }
            this.videoTrackConfig = {
              width: e.width,
              height: e.height,
              pixelRatio: e.pixelRatio,
            };
          }
          if (Object.keys(u).length)
            return (
              (this.ISGenerated = !0),
              f
                ? (c &&
                    this.warn(
                      `Timestamps at playlist time: ${r ? '' : '~'}${i} ${
                        s / n
                      } != initPTS: ${c.baseTime / c.timescale} (${
                        c.baseTime
                      }/${c.timescale}) trackId: ${c.trackId}`
                    ),
                  this.log(
                    `Found initPTS at playlist time: ${i} offset: ${
                      s / n
                    } (${s}/${n}) trackId: ${E}`
                  ),
                  (this._initPTS = { baseTime: s, timescale: n, trackId: E }),
                  (this._initDTS = { baseTime: a, timescale: n, trackId: E }))
                : (s = n = void 0),
              { tracks: u, initPTS: s, timescale: n, trackId: E }
            );
        }
        remuxVideo(t, e, i, r) {
          let s,
            a,
            n,
            l = t.inputTimeScale,
            o = t.samples,
            d = [],
            u = o.length,
            c = this._initPTS,
            f = (c.baseTime * l) / c.timescale,
            g = this.nextVideoTs,
            E = 8,
            m = this.videoSampleDuration,
            y = Number.POSITIVE_INFINITY,
            S = Number.NEGATIVE_INFINITY,
            T = !1;
          if (!i || g === null) {
            let O = f + e * l,
              w = o[0].pts - jt(o[0].dts, o[0].pts);
            ke && g !== null && 15e3 > Math.abs(O - w - (g + f))
              ? (i = !0)
              : (g = O - w - f);
          }
          let A = g + f;
          for (let O = 0; O < u; O++) {
            let w = o[O];
            (w.pts = jt(w.pts, A)),
              (w.dts = jt(w.dts, A)),
              w.dts < o[O > 0 ? O - 1 : O].dts && (T = !0);
          }
          T &&
            o.sort(function (O, w) {
              let q = O.dts - w.dts,
                Z = O.pts - w.pts;
              return q || Z;
            }),
            (s = o[0].dts);
          let R = (a = o[o.length - 1].dts) - s,
            I = R ? Math.round(R / (u - 1)) : m || t.inputTimeScale / 30;
          if (i) {
            let O = s - A,
              w = O > I,
              q = O < -1;
            if (
              (w || q) &&
              (w
                ? this.warn(
                    `${(t.segmentCodec || '').toUpperCase()}: ${Ge(
                      O,
                      !0
                    )} ms (${O}dts) hole between fragments detected at ${e.toFixed(
                      3
                    )}`
                  )
                : this.warn(
                    `${(t.segmentCodec || '').toUpperCase()}: ${Ge(
                      -O,
                      !0
                    )} ms (${O}dts) overlapping between fragments detected at ${e.toFixed(
                      3
                    )}`
                  ),
              !q || A >= o[0].pts || ke)
            ) {
              s = A;
              let Z = o[0].pts - O;
              if (w) (o[0].dts = s), (o[0].pts = Z);
              else {
                let X = !0;
                for (let V = 0; V < o.length && (!(o[V].dts > Z) || !X); V++) {
                  let K = o[V].pts;
                  if (((o[V].dts -= O), (o[V].pts -= O), V < o.length - 1)) {
                    let z = o[V + 1].pts;
                    X = z <= o[V].pts == z <= K;
                  }
                }
              }
              this.log(
                `Video: Initial PTS/DTS adjusted: ${Ge(Z, !0)}/${Ge(
                  s,
                  !0
                )}, delta: ${Ge(O, !0)} ms`
              );
            }
          }
          let v = 0,
            _ = 0,
            L = (s = Math.max(0, s));
          for (let O = 0; O < u; O++) {
            let w = o[O],
              q = w.units,
              Z = q.length,
              X = 0;
            for (let V = 0; V < Z; V++) X += q[V].data.length;
            (_ += X),
              (v += Z),
              (w.length = X),
              w.dts < L ? ((w.dts = L), (L += (I / 4) | 0 || 1)) : (L = w.dts),
              (y = Math.min(w.pts, y)),
              (S = Math.max(w.pts, S));
          }
          a = o[u - 1].dts;
          let C = _ + 4 * v + 8;
          try {
            n = new Uint8Array(C);
          } catch (O) {
            this.observer.emit(p.ERROR, p.ERROR, {
              type: Q.MUX_ERROR,
              details: b.REMUX_ALLOC_ERROR,
              fatal: !1,
              error: O,
              bytes: C,
              reason: `fail allocating video mdat ${C}`,
            });
            return;
          }
          let M = new DataView(n.buffer);
          M.setUint32(0, C), n.set(D.types.mdat, 4);
          let G = !1,
            k = Number.POSITIVE_INFINITY,
            P = Number.POSITIVE_INFINITY,
            x = Number.NEGATIVE_INFINITY,
            U = Number.NEGATIVE_INFINITY;
          for (let O = 0; O < u; O++) {
            let w,
              q = o[O],
              Z = q.units,
              X = 0;
            for (let K = 0, z = Z.length; K < z; K++) {
              let W = Z[K],
                dt = W.data,
                gt = W.data.byteLength;
              M.setUint32(E, gt),
                (E += 4),
                n.set(dt, E),
                (E += gt),
                (X += 4 + gt);
            }
            if (O < u - 1)
              (m = o[O + 1].dts - q.dts), (w = o[O + 1].pts - q.pts);
            else {
              let K = this.config,
                z = O > 0 ? q.dts - o[O - 1].dts : I;
              if (
                ((w = O > 0 ? q.pts - o[O - 1].pts : I),
                K.stretchShortVideoTrack && this.nextAudioTs !== null)
              ) {
                let W = Math.floor(K.maxBufferHole * l),
                  dt = (r ? y + r * l : this.nextAudioTs + f) - q.pts;
                dt > W
                  ? ((m = dt - z) < 0 ? (m = z) : (G = !0),
                    this.log(
                      `It is approximately ${
                        dt / 90
                      } ms to the next segment; using duration ${
                        m / 90
                      } ms for the last video frame.`
                    ))
                  : (m = z);
              } else m = z;
            }
            let V = Math.round(q.pts - q.dts);
            (k = Math.min(k, m)),
              (x = Math.max(x, m)),
              (P = Math.min(P, w)),
              (U = Math.max(U, w)),
              d.push(ma(q.key, m, X, V));
          }
          if (d.length) {
            if (ke) {
              if (ke < 70) {
                let O = d[0].flags;
                (O.dependsOn = 2), (O.isNonSync = 0);
              }
            } else if (gr && U - P < x - k && I / x < 0.025 && d[0].cts === 0) {
              this.warn(
                'Found irregular gaps in sample duration. Using PTS instead of DTS to determine MP4 sample duration.'
              );
              let O = s;
              for (let w = 0, q = d.length; w < q; w++) {
                let Z = O + d[w].duration,
                  X = O + d[w].cts;
                if (w < q - 1) {
                  let V = Z + d[w + 1].cts;
                  d[w].duration = V - X;
                } else d[w].duration = w ? d[w - 1].duration : I;
                (d[w].cts = 0), (O = Z);
              }
            }
          }
          let $ = a + (m = G || !m ? I : m);
          (this.nextVideoTs = g = $ - f),
            (this.videoSampleDuration = m),
            (this.isVideoContiguous = !0);
          let B = {
            data1: D.moof(t.sequenceNumber++, s, at(t, { samples: d })),
            data2: n,
            startPTS: (y - f) / l,
            endPTS: (S + m - f) / l,
            startDTS: (s - f) / l,
            endDTS: g / l,
            type: 'video',
            hasAudio: !1,
            hasVideo: !0,
            nb: d.length,
            dropped: t.dropped,
          };
          return (t.samples = []), (t.dropped = 0), B;
        }
        getSamplesPerFrame(t) {
          switch (t.segmentCodec) {
            case 'mp3':
              return 1152;
            case 'ac3':
              return 1536;
            default:
              return 1024;
          }
        }
        remuxAudio(t, e, i, r, s) {
          let a,
            n = t.inputTimeScale,
            l = t.samplerate ? t.samplerate : n,
            o = n / l,
            d = this.getSamplesPerFrame(t),
            u = d * o,
            c = this._initPTS,
            f = t.segmentCodec === 'mp3' && this.typeSupported.mpeg,
            g = [],
            E = s !== void 0,
            m = t.samples,
            y = f ? 0 : 8,
            S = this.nextAudioTs || -1,
            T = (c.baseTime * n) / c.timescale,
            A = T + e * n;
          if (
            ((this.isAudioContiguous = i =
              i ||
              (m.length &&
                S > 0 &&
                ((r && 9e3 > Math.abs(A - (S + T))) ||
                  Math.abs(jt(m[0].pts, A) - (S + T)) < 20 * u))),
            m.forEach(function (x) {
              x.pts = jt(x.pts, A);
            }),
            !i || S < 0)
          ) {
            if (!(m = m.filter((x) => x.pts >= 0)).length) return;
            S = s === 0 ? 0 : r && !E ? Math.max(0, A - T) : m[0].pts - T;
          }
          if (t.segmentCodec === 'aac') {
            let x = this.config.maxAudioFramesDrift;
            for (let U = 0, $ = S + T; U < m.length; U++) {
              let B = m[U],
                O = B.pts,
                w = O - $,
                q = Math.abs((1e3 * w) / n);
              if (w <= -x * u && E)
                U === 0 &&
                  (this.warn(
                    `Audio frame @ ${(O / n).toFixed(
                      3
                    )}s overlaps marker by ${Math.round((1e3 * w) / n)} ms.`
                  ),
                  (this.nextAudioTs = S = O - T),
                  ($ = O));
              else if (w >= x * u && q < 1e4 && E) {
                let Z = Math.round(w / u);
                for ($ = O - Z * u; $ < 0 && Z && u; ) Z--, ($ += u);
                U === 0 && (this.nextAudioTs = S = $ - T),
                  this.warn(
                    `Injecting ${Z} audio frames @ ${(($ - T) / n).toFixed(
                      3
                    )}s due to ${Math.round((1e3 * w) / n)} ms gap.`
                  );
                for (let X = 0; X < Z; X++) {
                  let V = jn.getSilentFrame(
                    t.parsedCodec || t.manifestCodec || t.codec,
                    t.channelCount
                  );
                  V ||
                    (this.log(
                      'Unable to get silent frame for given audio codec; duplicating last frame instead.'
                    ),
                    (V = B.unit.subarray())),
                    m.splice(U, 0, { unit: V, pts: $ }),
                    ($ += u),
                    U++;
                }
              }
              (B.pts = $), ($ += u);
            }
          }
          let R = null,
            I = null,
            v = 0,
            _ = m.length;
          for (; _--; ) v += m[_].unit.byteLength;
          for (let x = 0, U = m.length; x < U; x++) {
            let $ = m[x],
              B = $.unit,
              O = $.pts;
            if (I !== null) g[x - 1].duration = Math.round((O - I) / o);
            else {
              if (
                (i && t.segmentCodec === 'aac' && (O = S + T),
                (R = O),
                !(v > 0))
              )
                return;
              v += y;
              try {
                a = new Uint8Array(v);
              } catch (q) {
                this.observer.emit(p.ERROR, p.ERROR, {
                  type: Q.MUX_ERROR,
                  details: b.REMUX_ALLOC_ERROR,
                  fatal: !1,
                  error: q,
                  bytes: v,
                  reason: `fail allocating audio mdat ${v}`,
                });
                return;
              }
              f ||
                (new DataView(a.buffer).setUint32(0, v),
                a.set(D.types.mdat, 4));
            }
            a.set(B, y);
            let w = B.byteLength;
            (y += w), g.push(ma(!0, d, w, 0)), (I = O);
          }
          let L = g.length;
          if (!L) return;
          let C = g[g.length - 1];
          (S = I - T), (this.nextAudioTs = S + o * C.duration);
          let M = f
            ? new Uint8Array(0)
            : D.moof(t.sequenceNumber++, R / o, at({}, t, { samples: g }));
          t.samples = [];
          let G = (R - T) / n,
            k = S / n,
            P = {
              data1: M,
              data2: a,
              startPTS: G,
              endPTS: k,
              startDTS: G,
              endDTS: k,
              type: 'audio',
              hasAudio: !0,
              hasVideo: !1,
              nb: L,
            };
          return (this.isAudioContiguous = !0), P;
        }
      }
      function jt(h, t) {
        let e;
        if (t === null) return h;
        for (
          e = t < h ? -8589934592 : 8589934592;
          Math.abs(h - t) > 4294967296;

        )
          h += e;
        return h;
      }
      function pa(h, t, e, i) {
        let r = h.samples.length;
        if (!r) return;
        let s = h.inputTimeScale;
        for (let n = 0; n < r; n++) {
          let l = h.samples[n];
          (l.pts = jt(l.pts - (e.baseTime * s) / e.timescale, t * s) / s),
            (l.dts = jt(l.dts - (i.baseTime * s) / i.timescale, t * s) / s);
        }
        let a = h.samples;
        return (h.samples = []), { samples: a };
      }
      function Ea(h, t, e) {
        let i = h.samples.length;
        if (!i) return;
        let r = h.inputTimeScale;
        for (let a = 0; a < i; a++) {
          let n = h.samples[a];
          n.pts = jt(n.pts - (e.baseTime * r) / e.timescale, t * r) / r;
        }
        h.samples.sort((a, n) => a.pts - n.pts);
        let s = h.samples;
        return (h.samples = []), { samples: s };
      }
      class qn extends it {
        constructor(t, e, i, r) {
          super('passthrough-remuxer', r),
            (this.emitInitSegment = !1),
            (this.audioCodec = void 0),
            (this.videoCodec = void 0),
            (this.initData = void 0),
            (this.initPTS = null),
            (this.initTracks = void 0),
            (this.lastEndTime = null),
            (this.isVideoContiguous = !1);
        }
        destroy() {}
        resetTimeStamp(t) {
          this.lastEndTime = null;
          let e = this.initPTS;
          (e &&
            t &&
            e.baseTime === t.baseTime &&
            e.timescale === t.timescale) ||
            (this.initPTS = t);
        }
        resetNextTimestamp() {
          (this.isVideoContiguous = !1), (this.lastEndTime = null);
        }
        resetInitSegment(t, e, i, r) {
          (this.audioCodec = e),
            (this.videoCodec = i),
            this.generateInitSegment(t, r),
            (this.emitInitSegment = !0);
        }
        generateInitSegment(t, e) {
          let { audioCodec: i, videoCodec: r } = this;
          if (!(t != null && t.byteLength)) {
            (this.initTracks = void 0), (this.initData = void 0);
            return;
          }
          let { audio: s, video: a } = (this.initData = Xr(t));
          if (e)
            (function (l, o) {
              if (!l || !o) return;
              let d = o.keyId;
              d &&
                o.isCommonEncryption &&
                ot(l, ['moov', 'trak']).forEach((u) => {
                  let c = ot(u, ['mdia', 'minf', 'stbl', 'stsd'])[0].subarray(
                      8
                    ),
                    f = ot(c, ['enca']),
                    g = f.length > 0;
                  g || (f = ot(c, ['encv'])),
                    f.forEach((E) => {
                      ot(g ? E.subarray(28) : E.subarray(78), ['sinf']).forEach(
                        (m) => {
                          let y = zr(m);
                          if (y) {
                            let S = y.subarray(8, 24);
                            S.some((T) => T !== 0) ||
                              (nt.log(
                                `[eme] Patching keyId in 'enc${
                                  g ? 'a' : 'v'
                                }>sinf>>tenc' box: ${Ot(S)} -> ${Ot(d)}`
                              ),
                              y.set(d, 8));
                          }
                        }
                      );
                    });
                });
            })(t, e);
          else {
            let l = s || a;
            l != null &&
              l.encrypted &&
              this.warn(
                `Init segment with encrypted track with has no key ("${l.codec}")!`
              );
          }
          s && (i = ya(s, mt.AUDIO, this)), a && (r = ya(a, mt.VIDEO, this));
          let n = {};
          s && a
            ? (n.audiovideo = {
                container: 'video/mp4',
                codec: i + ',' + r,
                supplemental: a.supplemental,
                encrypted: a.encrypted,
                initSegment: t,
                id: 'main',
              })
            : s
            ? (n.audio = {
                container: 'audio/mp4',
                codec: i,
                encrypted: s.encrypted,
                initSegment: t,
                id: 'audio',
              })
            : a
            ? (n.video = {
                container: 'video/mp4',
                codec: r,
                supplemental: a.supplemental,
                encrypted: a.encrypted,
                initSegment: t,
                id: 'main',
              })
            : this.warn('initSegment does not contain moov or trak boxes.'),
            (this.initTracks = n);
        }
        remux(t, e, i, r, s, a) {
          var n, l;
          let { initPTS: o, lastEndTime: d } = this,
            u = {
              audio: void 0,
              video: void 0,
              text: r,
              id3: i,
              initSegment: void 0,
            };
          Y(d) || (d = this.lastEndTime = s || 0);
          let c = e.samples;
          if (!c.length) return u;
          let f = { initPTS: void 0, timescale: void 0, trackId: void 0 },
            g = this.initData;
          if (
            (((n = g) != null && n.length) ||
              (this.generateInitSegment(c), (g = this.initData)),
            !((l = g) != null && l.length))
          )
            return this.warn('Failed to generate initSegment.'), u;
          this.emitInitSegment &&
            ((f.tracks = this.initTracks), (this.emitInitSegment = !1));
          let E = (function ($, B, O) {
              let w = {},
                q = ot($, ['moof', 'traf']);
              for (let Z = 0; Z < q.length; Z++) {
                let X = q[Z],
                  V = ot(X, ['tfhd'])[0],
                  K = tt(V, 4),
                  z = B[K];
                if (!z) continue;
                w[K] ||
                  (w[K] = {
                    start: NaN,
                    duration: 0,
                    sampleCount: 0,
                    timescale: z.timescale,
                    type: z.type,
                  });
                let W = w[K],
                  dt = ot(X, ['tfdt'])[0];
                if (dt) {
                  let It = dt[0],
                    et = tt(dt, 4);
                  It === 1 &&
                    (et === 4294967295
                      ? O.warn(
                          '[mp4-demuxer]: Ignoring assumed invalid signed 64-bit track fragment decode time'
                        )
                      : ((et *= 4294967296), (et += tt(dt, 8)))),
                    Y(et) && (!Y(W.start) || et < W.start) && (W.start = et);
                }
                let gt = z.default,
                  H = tt(V, 0) | gt?.flags,
                  ut = gt?.duration || 0;
                8 & H && (ut = 2 & H ? tt(V, 12) : tt(V, 8));
                let ct = ot(X, ['trun']),
                  vt = W.start || 0,
                  pt = 0,
                  Et = ut;
                for (let It = 0; It < ct.length; It++) {
                  let et = ct[It],
                    Gt = tt(et, 4),
                    Ht = W.sampleCount;
                  W.sampleCount += Gt;
                  let Yt = 1 & et[3],
                    Gr = 4 & et[3],
                    Ye = 1 & et[2],
                    We = 2 & et[2],
                    Pi = 4 & et[2],
                    _i = 8 & et[2],
                    ht = 8,
                    ft = Gt;
                  for (
                    Yt && (ht += 4),
                      Gr &&
                        Gt &&
                        (1 & et[ht + 1] ||
                          W.keyFrameIndex !== void 0 ||
                          (W.keyFrameIndex = Ht),
                        (ht += 4),
                        Ye ? ((Et = tt(et, ht)), (ht += 4)) : (Et = ut),
                        We && (ht += 4),
                        _i && (ht += 4),
                        (vt += Et),
                        (pt += Et),
                        ft--);
                    ft--;

                  )
                    Ye ? ((Et = tt(et, ht)), (ht += 4)) : (Et = ut),
                      We && (ht += 4),
                      Pi &&
                        (1 & et[ht + 1] ||
                          W.keyFrameIndex !== void 0 ||
                          ((W.keyFrameIndex = W.sampleCount - (ft + 1)),
                          (W.keyFrameStart = vt)),
                        (ht += 4)),
                      _i && (ht += 4),
                      (vt += Et),
                      (pt += Et);
                  !pt && ut && (pt += ut * Gt);
                }
                W.duration += pt;
              }
              if (!Object.keys(w).some((Z) => w[Z].duration)) {
                let Z = 1 / 0,
                  X = 0,
                  V = ot($, ['sidx']);
                for (let K = 0; K < V.length; K++) {
                  let z = (function (W) {
                    let dt = [],
                      gt = W[0],
                      H = 8,
                      ut = tt(W, 8);
                    H += 4;
                    let ct = 0,
                      vt = 0;
                    gt === 0
                      ? ((ct = tt(W, H)), (vt = tt(W, H + 4)), (H += 8))
                      : ((ct = jr(W, H)), (vt = jr(W, H + 8)), (H += 16)),
                      (H += 2);
                    let pt = W.length + vt,
                      Et = Wr(W, H);
                    H += 2;
                    for (let It = 0; It < Et; It++) {
                      let et = H,
                        Gt = tt(W, et);
                      et += 4;
                      let Ht = 2147483647 & Gt;
                      if ((2147483648 & Gt) >>> 31 == 1)
                        return (
                          nt.warn(
                            'SIDX has hierarchical references (not supported)'
                          ),
                          null
                        );
                      let Yt = tt(W, et);
                      (et += 4),
                        dt.push({
                          referenceSize: Ht,
                          subsegmentDuration: Yt,
                          info: {
                            duration: Yt / ut,
                            start: pt,
                            end: pt + Ht - 1,
                          },
                        }),
                        (pt += Ht),
                        (et += 4),
                        (H = et);
                    }
                    return {
                      earliestPresentationTime: ct,
                      timescale: ut,
                      version: gt,
                      referencesCount: Et,
                      references: dt,
                    };
                  })(V[K]);
                  if (z != null && z.references) {
                    Z = Math.min(Z, z.earliestPresentationTime / z.timescale);
                    let W = z.references.reduce(
                      (dt, gt) => dt + gt.info.duration || 0,
                      0
                    );
                    X = Math.max(
                      X,
                      W + z.earliestPresentationTime / z.timescale
                    );
                  }
                }
                X &&
                  Y(X) &&
                  Object.keys(w).forEach((K) => {
                    w[K].duration ||
                      (w[K].duration = X * w[K].timescale - w[K].start);
                  });
              }
              return w;
            })(c, g, this),
            m = g.audio ? E[g.audio.id] : null,
            y = g.video ? E[g.video.id] : null,
            S = Ei(y, 1 / 0),
            T = Ei(m, 1 / 0),
            A = Ei(y, 0, !0),
            R = Ei(m, 0, !0),
            I = s,
            v = 0,
            _ = m && (!y || (!o && T < S) || (o && o.trackId === g.audio.id)),
            L = _ ? m : y;
          if (L) {
            let $ = L.timescale,
              B = L.start - s * $,
              O = _ ? g.audio.id : g.video.id;
            (I = L.start / $),
              (v = _ ? R - T : A - S),
              (a || !o) &&
                ((function (w, q, Z, X) {
                  if (w === null) return !0;
                  let V = Math.max(X, 1);
                  return Math.abs(q - w.baseTime / w.timescale - Z) > V;
                })(o, I, s, v) ||
                  $ !== o.timescale) &&
                (o &&
                  this.warn(
                    `Timestamps at playlist time: ${a ? '' : '~'}${s} ${
                      B / $
                    } != initPTS: ${o.baseTime / o.timescale} (${o.baseTime}/${
                      o.timescale
                    }) trackId: ${o.trackId}`
                  ),
                this.log(
                  `Found initPTS at playlist time: ${s} offset: ${
                    I - s
                  } (${B}/${$}) trackId: ${O}`
                ),
                (o = null),
                (f.initPTS = B),
                (f.timescale = $),
                (f.trackId = O));
          } else
            this.warn(
              `No audio or video samples found for initPTS at playlist time: ${s}`
            );
          o
            ? ((f.initPTS = o.baseTime),
              (f.timescale = o.timescale),
              (f.trackId = o.trackId))
            : ((f.timescale && f.trackId !== void 0 && f.initPTS !== void 0) ||
                (this.warn('Could not set initPTS'),
                (f.initPTS = I),
                (f.timescale = 1),
                (f.trackId = -1)),
              (this.initPTS = o =
                {
                  baseTime: f.initPTS,
                  timescale: f.timescale,
                  trackId: f.trackId,
                }));
          let C = I - o.baseTime / o.timescale,
            M = C + v;
          v > 0
            ? (this.lastEndTime = M)
            : (this.warn(
                'Duration parsed from mp4 should be greater than zero'
              ),
              this.resetNextTimestamp());
          let G = !!g.audio,
            k = !!g.video,
            P = '';
          G && (P += 'audio'), k && (P += 'video');
          let x = {
            data1: c,
            startPTS: C,
            startDTS: C,
            endPTS: M,
            endDTS: M,
            type: P,
            hasAudio: G,
            hasVideo: k,
            nb: 1,
            dropped: 0,
            encrypted:
              (!!g.audio && g.audio.encrypted) ||
              (!!g.video && g.video.encrypted),
          };
          (u.audio = G && !k ? x : void 0), (u.video = k ? x : void 0);
          let U = y?.sampleCount;
          if (U) {
            let $ = y.keyFrameIndex,
              B = $ !== -1;
            (x.nb = U),
              (x.dropped = $ === 0 || this.isVideoContiguous ? 0 : B ? $ : U),
              (x.independent = B),
              (x.firstKeyFrame = $),
              B &&
                y.keyFrameStart &&
                (x.firstKeyFramePTS =
                  (y.keyFrameStart - o.baseTime) / o.timescale),
              this.isVideoContiguous || (u.independent = B),
              this.isVideoContiguous || (this.isVideoContiguous = B),
              x.dropped &&
                this.warn(
                  `fmp4 does not start with IDR: firstIDR ${$}/${U} dropped: ${
                    x.dropped
                  } start: ${x.firstKeyFramePTS || 'NA'}`
                );
          }
          return (
            (u.initSegment = f),
            (u.id3 = pa(i, s, o, o)),
            r.samples.length && (u.text = Ea(r, s, o)),
            u
          );
        }
      }
      function Ei(h, t, e = !1) {
        return h?.start !== void 0
          ? (h.start + (e ? h.duration : 0)) / h.timescale
          : t;
      }
      function ya(h, t, e) {
        let i = h.codec;
        return i && i.length > 4
          ? i
          : t === mt.AUDIO
          ? i === 'ec-3' || i === 'ac-3' || i === 'alac'
            ? i
            : i === 'fLaC' || i === 'Opus'
            ? Je(i, !1)
            : (e.warn(`Unhandled audio codec "${i}" in mp4 MAP`), i || 'mp4a')
          : (e.warn(`Unhandled video codec "${i}" in mp4 MAP`), i || 'avc1');
      }
      try {
        Pt = F.performance.now.bind(F.performance);
      } catch {
        Pt = Date.now;
      }
      let yi = [
        { demux: Vn, remux: qn },
        { demux: de, remux: pi },
        { demux: Bn, remux: pi },
        { demux: Gn, remux: pi },
      ];
      yi.splice(2, 0, { demux: $n, remux: pi });
      class va {
        constructor(t, e, i, r, s, a) {
          (this.asyncResult = !1),
            (this.logger = void 0),
            (this.observer = void 0),
            (this.typeSupported = void 0),
            (this.config = void 0),
            (this.id = void 0),
            (this.demuxer = void 0),
            (this.remuxer = void 0),
            (this.decrypter = void 0),
            (this.probe = void 0),
            (this.decryptionPromise = null),
            (this.transmuxConfig = void 0),
            (this.currentTransmuxState = void 0),
            (this.observer = t),
            (this.typeSupported = e),
            (this.config = i),
            (this.id = s),
            (this.logger = a);
        }
        configure(t) {
          (this.transmuxConfig = t), this.decrypter && this.decrypter.reset();
        }
        push(t, e, i, r) {
          let s,
            a = i.transmuxing;
          a.executeStart = Pt();
          let n = new Uint8Array(t),
            { currentTransmuxState: l, transmuxConfig: o } = this;
          r && (this.currentTransmuxState = r);
          let {
              contiguous: d,
              discontinuity: u,
              trackSwitch: c,
              accurateTimeOffset: f,
              timeOffset: g,
              initSegmentChange: E,
            } = r || l,
            {
              audioCodec: m,
              videoCodec: y,
              defaultInitPts: S,
              duration: T,
              initSegmentData: A,
            } = o,
            R =
              ((s = null),
              n.byteLength > 0 &&
                e?.key != null &&
                e.iv !== null &&
                e.method != null &&
                (s = e),
              s);
          if (R && Re(R.method)) {
            let L = this.getDecrypter(),
              C = qi(R.method);
            if (!L.isSync())
              return (
                (this.asyncResult = !0),
                (this.decryptionPromise = L.webCryptoDecrypt(
                  n,
                  R.key.buffer,
                  R.iv.buffer,
                  C
                ).then((M) => {
                  let G = this.push(M, null, i);
                  return (this.decryptionPromise = null), G;
                })),
                this.decryptionPromise
              );
            {
              let M = L.softwareDecrypt(n, R.key.buffer, R.iv.buffer, C);
              if (i.part > -1) {
                let G = L.flush();
                M = G && G.buffer;
              }
              if (!M) return (a.executeEnd = Pt()), mr(i);
              n = new Uint8Array(M);
            }
          }
          let I = this.needsProbing(u, c);
          if (I) {
            let L = this.configureTransmuxer(n);
            if (L)
              return (
                this.logger.warn(`[transmuxer] ${L.message}`),
                this.observer.emit(p.ERROR, p.ERROR, {
                  type: Q.MEDIA_ERROR,
                  details: b.FRAG_PARSING_ERROR,
                  fatal: !1,
                  error: L,
                  reason: L.message,
                }),
                (a.executeEnd = Pt()),
                mr(i)
              );
          }
          (u || c || E || I) && this.resetInitSegment(A, m, y, T, e),
            (u || E || I) && this.resetInitialTimestamp(S),
            d || this.resetContiguity();
          let v = this.transmux(n, R, g, f, i);
          this.asyncResult = Ke(v);
          let _ = this.currentTransmuxState;
          return (
            (_.contiguous = !0),
            (_.discontinuity = !1),
            (_.trackSwitch = !1),
            (a.executeEnd = Pt()),
            v
          );
        }
        flush(t) {
          let e = t.transmuxing;
          e.executeStart = Pt();
          let {
            decrypter: i,
            currentTransmuxState: r,
            decryptionPromise: s,
          } = this;
          if (s) return (this.asyncResult = !0), s.then(() => this.flush(t));
          let a = [],
            { timeOffset: n } = r;
          if (i) {
            let u = i.flush();
            u && a.push(this.push(u.buffer, null, t));
          }
          let { demuxer: l, remuxer: o } = this;
          if (!l || !o) {
            e.executeEnd = Pt();
            let u = [mr(t)];
            return this.asyncResult ? Promise.resolve(u) : u;
          }
          let d = l.flush(n);
          return Ke(d)
            ? ((this.asyncResult = !0),
              d.then((u) => (this.flushRemux(a, u, t), a)))
            : (this.flushRemux(a, d, t),
              this.asyncResult ? Promise.resolve(a) : a);
        }
        flushRemux(t, e, i) {
          let { audioTrack: r, videoTrack: s, id3Track: a, textTrack: n } = e,
            { accurateTimeOffset: l, timeOffset: o } =
              this.currentTransmuxState;
          this.logger.log(
            `[transmuxer.ts]: Flushed ${this.id} sn: ${i.sn}${
              i.part > -1 ? ' part: ' + i.part : ''
            } of ${this.id === j.MAIN ? 'level' : 'track'} ${i.level}`
          );
          let d = this.remuxer.remux(r, s, a, n, o, l, !0, this.id);
          t.push({ remuxResult: d, chunkMeta: i }),
            (i.transmuxing.executeEnd = Pt());
        }
        resetInitialTimestamp(t) {
          let { demuxer: e, remuxer: i } = this;
          e && i && (e.resetTimeStamp(t), i.resetTimeStamp(t));
        }
        resetContiguity() {
          let { demuxer: t, remuxer: e } = this;
          t && e && (t.resetContiguity(), e.resetNextTimestamp());
        }
        resetInitSegment(t, e, i, r, s) {
          let { demuxer: a, remuxer: n } = this;
          a &&
            n &&
            (a.resetInitSegment(t, e, i, r), n.resetInitSegment(t, e, i, s));
        }
        destroy() {
          this.demuxer && (this.demuxer.destroy(), (this.demuxer = void 0)),
            this.remuxer && (this.remuxer.destroy(), (this.remuxer = void 0));
        }
        transmux(t, e, i, r, s) {
          return e && e.method === 'SAMPLE-AES'
            ? this.transmuxSampleAes(t, e, i, r, s)
            : this.transmuxUnencrypted(t, i, r, s);
        }
        transmuxUnencrypted(t, e, i, r) {
          let {
            audioTrack: s,
            videoTrack: a,
            id3Track: n,
            textTrack: l,
          } = this.demuxer.demux(t, e, !1, !this.config.progressive);
          return {
            remuxResult: this.remuxer.remux(s, a, n, l, e, i, !1, this.id),
            chunkMeta: r,
          };
        }
        transmuxSampleAes(t, e, i, r, s) {
          return this.demuxer
            .demuxSampleAes(t, e, i)
            .then((a) => ({
              remuxResult: this.remuxer.remux(
                a.audioTrack,
                a.videoTrack,
                a.id3Track,
                a.textTrack,
                i,
                r,
                !1,
                this.id
              ),
              chunkMeta: s,
            }));
        }
        configureTransmuxer(t) {
          let e,
            { config: i, observer: r, typeSupported: s } = this;
          for (let u = 0, c = yi.length; u < c; u++) {
            var a;
            if ((a = yi[u].demux) != null && a.probe(t, this.logger)) {
              e = yi[u];
              break;
            }
          }
          if (!e)
            return Error('Failed to find demuxer by probing fragment data');
          let n = this.demuxer,
            l = this.remuxer,
            o = e.remux,
            d = e.demux;
          (l && l instanceof o) || (this.remuxer = new o(r, i, s, this.logger)),
            (n && n instanceof d) ||
              ((this.demuxer = new d(r, i, s, this.logger)),
              (this.probe = d.probe));
        }
        needsProbing(t, e) {
          return !this.demuxer || !this.remuxer || t || e;
        }
        getDecrypter() {
          let t = this.decrypter;
          return t || (t = this.decrypter = new Hi(this.config)), t;
        }
      }
      let mr = (h) => ({ remuxResult: {}, chunkMeta: h });
      function Ke(h) {
        return 'then' in h && h.then instanceof Function;
      }
      class Xn {
        constructor(t, e, i, r, s) {
          (this.audioCodec = void 0),
            (this.videoCodec = void 0),
            (this.initSegmentData = void 0),
            (this.duration = void 0),
            (this.defaultInitPts = void 0),
            (this.audioCodec = t),
            (this.videoCodec = e),
            (this.initSegmentData = i),
            (this.duration = r),
            (this.defaultInitPts = s || null);
        }
      }
      class zn {
        constructor(t, e, i, r, s, a) {
          (this.discontinuity = void 0),
            (this.contiguous = void 0),
            (this.accurateTimeOffset = void 0),
            (this.trackSwitch = void 0),
            (this.timeOffset = void 0),
            (this.initSegmentChange = void 0),
            (this.discontinuity = t),
            (this.contiguous = e),
            (this.accurateTimeOffset = i),
            (this.trackSwitch = r),
            (this.timeOffset = s),
            (this.initSegmentChange = a);
        }
      }
      let Ta = 0;
      class Sa {
        constructor(t, e, i, r) {
          (this.error = null),
            (this.hls = void 0),
            (this.id = void 0),
            (this.instanceNo = Ta++),
            (this.observer = void 0),
            (this.frag = null),
            (this.part = null),
            (this.useWorker = void 0),
            (this.workerContext = null),
            (this.transmuxer = null),
            (this.onTransmuxComplete = void 0),
            (this.onFlush = void 0),
            (this.onWorkerMessage = (l) => {
              let o = l.data,
                d = this.hls;
              if (d && o != null && o.event && o.instanceNo === this.instanceNo)
                switch (o.event) {
                  case 'init': {
                    var u;
                    let c =
                      (u = this.workerContext) == null ? void 0 : u.objectURL;
                    c && F.URL.revokeObjectURL(c);
                    break;
                  }
                  case 'transmuxComplete':
                    this.handleTransmuxComplete(o.data);
                    break;
                  case 'flush':
                    this.onFlush(o.data);
                    break;
                  case 'workerLog':
                    d.logger[o.data.logType] &&
                      d.logger[o.data.logType](o.data.message);
                    break;
                  default:
                    (o.data = o.data || {}),
                      (o.data.frag = this.frag),
                      (o.data.part = this.part),
                      (o.data.id = this.id),
                      d.trigger(o.event, o.data);
                }
            }),
            (this.onWorkerError = (l) => {
              if (!this.hls) return;
              let o = Error(`${l.message}  (${l.filename}:${l.lineno})`);
              (this.hls.config.enableWorker = !1),
                this.hls.logger.warn(
                  `Error in "${this.id}" Web Worker, fallback to inline`
                ),
                this.hls.trigger(p.ERROR, {
                  type: Q.OTHER_ERROR,
                  details: b.INTERNAL_EXCEPTION,
                  fatal: !1,
                  event: 'demuxerWorker',
                  error: o,
                });
            });
          let s = t.config;
          (this.hls = t),
            (this.id = e),
            (this.useWorker = !!s.enableWorker),
            (this.onTransmuxComplete = i),
            (this.onFlush = r);
          let a = (l, o) => {
            ((o = o || {}).frag = this.frag || void 0),
              l === p.ERROR &&
                ((o.parent = this.id),
                (o.part = this.part),
                (this.error = o.error)),
              this.hls.trigger(l, o);
          };
          (this.observer = new rr()),
            this.observer.on(p.FRAG_DECRYPTED, a),
            this.observer.on(p.ERROR, a);
          let n = is(s.preferManagedMediaSource);
          if (this.useWorker && typeof Worker < 'u') {
            let l = this.hls.logger;
            if (s.workerPath || typeof __HLS_WORKER_BUNDLE__ == 'function') {
              try {
                s.workerPath
                  ? (l.log(`loading Web Worker ${s.workerPath} for "${e}"`),
                    (this.workerContext = (function (d) {
                      let u = be[d];
                      if (u) return u.clientCount++, u;
                      let c = new F.URL(d, F.location.href).href,
                        f = {
                          worker: new F.Worker(c),
                          scriptURL: c,
                          clientCount: 1,
                        };
                      return (be[d] = f), f;
                    })(s.workerPath)))
                  : (l.log(`injecting Web Worker for "${e}"`),
                    (this.workerContext = (function () {
                      let d = be[Ue];
                      if (d) return d.clientCount++, d;
                      let u = new F.Blob(
                          [
                            `var exports={};var module={exports:exports};function define(f){f()};define.amd=true;(${__HLS_WORKER_BUNDLE__.toString()})(true);`,
                          ],
                          { type: 'text/javascript' }
                        ),
                        c = F.URL.createObjectURL(u),
                        f = {
                          worker: new F.Worker(c),
                          objectURL: c,
                          clientCount: 1,
                        };
                      return (be[Ue] = f), f;
                    })()));
                let { worker: o } = this.workerContext;
                o.addEventListener('message', this.onWorkerMessage),
                  o.addEventListener('error', this.onWorkerError),
                  o.postMessage({
                    instanceNo: this.instanceNo,
                    cmd: 'init',
                    typeSupported: n,
                    id: e,
                    config: yt(s),
                  });
              } catch (o) {
                l.warn(
                  `Error setting up "${e}" Web Worker, fallback to inline`,
                  o
                ),
                  this.terminateWorker(),
                  (this.error = null),
                  (this.transmuxer = new va(
                    this.observer,
                    n,
                    s,
                    '',
                    e,
                    t.logger
                  ));
              }
              return;
            }
          }
          this.transmuxer = new va(this.observer, n, s, '', e, t.logger);
        }
        reset() {
          if (((this.frag = null), (this.part = null), this.workerContext)) {
            let t = this.instanceNo;
            this.instanceNo = Ta++;
            let e = this.hls.config,
              i = is(e.preferManagedMediaSource);
            this.workerContext.worker.postMessage({
              instanceNo: this.instanceNo,
              cmd: 'reset',
              resetNo: t,
              typeSupported: i,
              id: this.id,
              config: yt(e),
            });
          }
        }
        terminateWorker() {
          if (this.workerContext) {
            let { worker: t } = this.workerContext;
            (this.workerContext = null),
              t.removeEventListener('message', this.onWorkerMessage),
              t.removeEventListener('error', this.onWorkerError),
              (function (e) {
                let i = be[e || Ue];
                if (i && i.clientCount-- == 1) {
                  let { worker: r, objectURL: s } = i;
                  delete be[e || Ue],
                    s && F.URL.revokeObjectURL(s),
                    r.terminate();
                }
              })(this.hls.config.workerPath);
          }
        }
        destroy() {
          if (this.workerContext)
            this.terminateWorker(),
              (this.onWorkerMessage = this.onWorkerError = null);
          else {
            let e = this.transmuxer;
            e && (e.destroy(), (this.transmuxer = null));
          }
          let t = this.observer;
          t && t.removeAllListeners(),
            (this.frag = null),
            (this.part = null),
            (this.observer = null),
            (this.hls = null);
        }
        push(t, e, i, r, s, a, n, l, o, d) {
          var u, c;
          o.transmuxing.start = F.performance.now();
          let { instanceNo: f, transmuxer: g } = this,
            E = a ? a.start : s.start,
            m = s.decryptdata,
            y = this.frag,
            S = !(y && s.cc === y.cc),
            T = !(y && o.level === y.level),
            A = y ? o.sn - y.sn : -1,
            R = this.part ? o.part - this.part.index : -1,
            I = A === 0 && o.id > 1 && o.id === y?.stats.chunkCount,
            v = !T && (A === 1 || (A === 0 && (R === 1 || (I && R <= 0)))),
            _ = F.performance.now();
          (T || A || s.stats.parsing.start === 0) &&
            (s.stats.parsing.start = _),
            a && (R || !v) && (a.stats.parsing.start = _);
          let L = !(
              y &&
              ((u = s.initSegment) == null ? void 0 : u.url) ===
                ((c = y.initSegment) == null ? void 0 : c.url)
            ),
            C = new zn(S, v, l, T, E, L);
          if (!v || S || L) {
            this.hls.logger
              .log(`[transmuxer-interface]: Starting new transmux session for ${
              s.type
            } sn: ${o.sn}${o.part > -1 ? ' part: ' + o.part : ''} ${
              this.id === j.MAIN ? 'level' : 'track'
            }: ${o.level} id: ${o.id}
        discontinuity: ${S}
        trackSwitch: ${T}
        contiguous: ${v}
        accurateTimeOffset: ${l}
        timeOffset: ${E}
        initSegmentChange: ${L}`);
            let M = new Xn(i, r, e, n, d);
            this.configureTransmuxer(M);
          }
          if (((this.frag = s), (this.part = a), this.workerContext))
            this.workerContext.worker.postMessage(
              {
                instanceNo: f,
                cmd: 'demux',
                data: t,
                decryptdata: m,
                chunkMeta: o,
                state: C,
              },
              t instanceof ArrayBuffer ? [t] : []
            );
          else if (g) {
            let M = g.push(t, m, o, C);
            Ke(M)
              ? M.then((G) => {
                  this.handleTransmuxComplete(G);
                }).catch((G) => {
                  this.transmuxerError(G, o, 'transmuxer-interface push error');
                })
              : this.handleTransmuxComplete(M);
          }
        }
        flush(t) {
          t.transmuxing.start = F.performance.now();
          let { instanceNo: e, transmuxer: i } = this;
          if (this.workerContext)
            this.workerContext.worker.postMessage({
              instanceNo: e,
              cmd: 'flush',
              chunkMeta: t,
            });
          else if (i) {
            let r = i.flush(t);
            Ke(r)
              ? r
                  .then((s) => {
                    this.handleFlushResult(s, t);
                  })
                  .catch((s) => {
                    this.transmuxerError(
                      s,
                      t,
                      'transmuxer-interface flush error'
                    );
                  })
              : this.handleFlushResult(r, t);
          }
        }
        transmuxerError(t, e, i) {
          this.hls &&
            ((this.error = t),
            this.hls.trigger(p.ERROR, {
              type: Q.MEDIA_ERROR,
              details: b.FRAG_PARSING_ERROR,
              chunkMeta: e,
              frag: this.frag || void 0,
              part: this.part || void 0,
              fatal: !1,
              error: t,
              err: t,
              reason: i,
            }));
        }
        handleFlushResult(t, e) {
          t.forEach((i) => {
            this.handleTransmuxComplete(i);
          }),
            this.onFlush(e);
        }
        configureTransmuxer(t) {
          let { instanceNo: e, transmuxer: i } = this;
          this.workerContext
            ? this.workerContext.worker.postMessage({
                instanceNo: e,
                cmd: 'configure',
                config: t,
              })
            : i && i.configure(t);
        }
        handleTransmuxComplete(t) {
          (t.chunkMeta.transmuxing.end = F.performance.now()),
            this.onTransmuxComplete(t);
        }
      }
      class Qn extends ir {
        constructor(t, e, i) {
          super(t, e, i, 'audio-stream-controller', j.AUDIO),
            (this.mainAnchor = null),
            (this.mainFragLoading = null),
            (this.audioOnly = !1),
            (this.bufferedTrack = null),
            (this.switchingTrack = null),
            (this.trackId = -1),
            (this.waitingData = null),
            (this.mainDetails = null),
            (this.flushing = !1),
            (this.bufferFlushed = !1),
            (this.cachedTrackLoadedData = null),
            this.registerListeners();
        }
        onHandlerDestroying() {
          this.unregisterListeners(),
            super.onHandlerDestroying(),
            this.resetItem();
        }
        resetItem() {
          this.mainDetails =
            this.mainAnchor =
            this.mainFragLoading =
            this.bufferedTrack =
            this.switchingTrack =
            this.waitingData =
            this.cachedTrackLoadedData =
              null;
        }
        registerListeners() {
          super.registerListeners();
          let { hls: t } = this;
          t.on(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.on(p.AUDIO_TRACKS_UPDATED, this.onAudioTracksUpdated, this),
            t.on(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this),
            t.on(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this),
            t.on(p.BUFFER_RESET, this.onBufferReset, this),
            t.on(p.BUFFER_CREATED, this.onBufferCreated, this),
            t.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this),
            t.on(p.BUFFER_FLUSHED, this.onBufferFlushed, this),
            t.on(p.INIT_PTS_FOUND, this.onInitPtsFound, this),
            t.on(p.FRAG_LOADING, this.onFragLoading, this),
            t.on(p.FRAG_BUFFERED, this.onFragBuffered, this);
        }
        unregisterListeners() {
          let { hls: t } = this;
          t &&
            (super.unregisterListeners(),
            t.off(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.off(p.AUDIO_TRACKS_UPDATED, this.onAudioTracksUpdated, this),
            t.off(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this),
            t.off(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this),
            t.off(p.BUFFER_RESET, this.onBufferReset, this),
            t.off(p.BUFFER_CREATED, this.onBufferCreated, this),
            t.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this),
            t.off(p.BUFFER_FLUSHED, this.onBufferFlushed, this),
            t.off(p.INIT_PTS_FOUND, this.onInitPtsFound, this),
            t.off(p.FRAG_LOADING, this.onFragLoading, this),
            t.off(p.FRAG_BUFFERED, this.onFragBuffered, this));
        }
        onInitPtsFound(
          t,
          { frag: e, id: i, initPTS: r, timescale: s, trackId: a }
        ) {
          if (i === j.MAIN) {
            let n = e.cc,
              l = this.fragCurrent;
            if (
              ((this.initPTS[n] = { baseTime: r, timescale: s, trackId: a }),
              this.log(
                `InitPTS for cc: ${n} found from main: ${
                  r / s
                } (${r}/${s}) trackId: ${a}`
              ),
              (this.mainAnchor = e),
              this.state === N.WAITING_INIT_PTS)
            ) {
              let o = this.waitingData;
              ((o || this.loadingParts) && (!o || o.frag.cc === n)) ||
                this.syncWithAnchor(e, o?.frag);
            } else
              !this.hls.hasEnoughToStart && l && l.cc !== n
                ? (l.abortRequests(), this.syncWithAnchor(e, l))
                : this.state === N.IDLE && this.tick();
          }
        }
        getLoadPosition() {
          return !this.startFragRequested && this.nextLoadPosition >= 0
            ? this.nextLoadPosition
            : super.getLoadPosition();
        }
        syncWithAnchor(t, e) {
          var i;
          let r =
            ((i = this.mainFragLoading) == null ? void 0 : i.frag) || null;
          if (e && r?.cc === e.cc) return;
          let s = (r || t).cc,
            a = ms(this.getLevelDetails(), s, this.getLoadPosition());
          a &&
            (this.log(`Syncing with main frag at ${a.start} cc ${a.cc}`),
            (this.startFragRequested = !1),
            (this.nextLoadPosition = a.start),
            this.resetLoadingState(),
            this.state === N.IDLE && this.doTickIdle());
        }
        startLoad(t, e) {
          if (!this.levels) {
            (this.startPosition = t), (this.state = N.STOPPED);
            return;
          }
          let i = this.lastCurrentTime;
          this.stopLoad(),
            this.setInterval(100),
            i > 0 && t === -1
              ? (this.log(
                  `Override startPosition with lastCurrentTime @${i.toFixed(3)}`
                ),
                (t = i),
                (this.state = N.IDLE))
              : (this.state = N.WAITING_TRACK),
            (this.nextLoadPosition = this.lastCurrentTime =
              t + this.timelineOffset),
            (this.startPosition = e ? -1 : t),
            this.tick();
        }
        doTick() {
          switch (this.state) {
            case N.IDLE:
              this.doTickIdle();
              break;
            case N.WAITING_TRACK: {
              let { levels: t, trackId: e } = this,
                i = t?.[e],
                r = i?.details;
              if (r && !this.waitForLive(i)) {
                if (this.waitForCdnTuneIn(r)) break;
                this.state = N.WAITING_INIT_PTS;
              }
              break;
            }
            case N.FRAG_LOADING_WAITING_RETRY:
              this.checkRetryDate();
              break;
            case N.WAITING_INIT_PTS: {
              let t = this.waitingData;
              if (t) {
                let { frag: e, part: i, cache: r, complete: s } = t,
                  a = this.mainAnchor;
                if (this.initPTS[e.cc] !== void 0) {
                  (this.waitingData = null), (this.state = N.FRAG_LOADING);
                  let n = {
                    frag: e,
                    part: i,
                    payload: r.flush().buffer,
                    networkDetails: null,
                  };
                  this._handleFragmentLoadProgress(n),
                    s && super._handleFragmentLoadComplete(n);
                } else
                  a && a.cc !== t.frag.cc && this.syncWithAnchor(a, t.frag);
              } else this.state = N.IDLE;
            }
          }
          this.onTickEnd();
        }
        resetLoadingState() {
          let t = this.waitingData;
          t &&
            (this.fragmentTracker.removeFragment(t.frag),
            (this.waitingData = null)),
            super.resetLoadingState();
        }
        onTickEnd() {
          let { media: t } = this;
          t != null && t.readyState && (this.lastCurrentTime = t.currentTime);
        }
        doTickIdle() {
          var t;
          let { hls: e, levels: i, media: r, trackId: s } = this,
            a = e.config;
          if (
            !this.buffering ||
            (!r &&
              !this.primaryPrefetch &&
              (this.startFragRequested || !a.startFragPrefetch)) ||
            !(i != null && i[s])
          )
            return;
          let n = i[s],
            l = n.details;
          if (!l || this.waitForLive(n) || this.waitForCdnTuneIn(l)) {
            (this.state = N.WAITING_TRACK), (this.startFragRequested = !1);
            return;
          }
          let o = this.mediaBuffer ? this.mediaBuffer : this.media;
          this.bufferFlushed &&
            o &&
            ((this.bufferFlushed = !1),
            this.afterBufferFlushed(o, mt.AUDIO, j.AUDIO));
          let d = this.getFwdBufferInfo(o, j.AUDIO);
          if (d === null) return;
          if (!this.switchingTrack && this._streamEnded(d, l)) {
            e.trigger(p.BUFFER_EOS, { type: 'audio' }), (this.state = N.ENDED);
            return;
          }
          let u = d.len,
            c = e.maxBufferLength,
            f = l.fragments,
            g = f[0].start,
            E = this.getLoadPosition(),
            m = this.flushing ? E : d.end;
          if (
            (this.switchingTrack &&
              r &&
              l.PTSKnown &&
              E < g &&
              (d.end > g || d.nextStart) &&
              (this.log(
                'Alt audio track ahead of main track, seek to start of alt audio track'
              ),
              (r.currentTime = g + 0.05)),
            u >= c && !this.switchingTrack && m < f[f.length - 1].start)
          )
            return;
          let y = this.getNextFragment(m, l);
          if (
            (y &&
              this.isLoopLoading(y, m) &&
              (y = this.getNextFragmentLoopLoading(y, l, d, j.MAIN, c)),
            !y)
          ) {
            this.bufferFlushed = !0;
            return;
          }
          let S =
            ((t = this.mainFragLoading) == null ? void 0 : t.frag) || null;
          if (
            !this.audioOnly &&
            this.startFragRequested &&
            S &&
            _t(y) &&
            !y.endList &&
            (!l.live ||
              (!this.loadingParts && m < this.hls.liveSyncPosition)) &&
            (this.fragmentTracker.getState(S) === xt.OK &&
              (this.mainFragLoading = S = null),
            S && _t(S))
          ) {
            if (y.start > S.end) {
              let T = this.fragmentTracker.getFragAtPos(m, j.MAIN);
              T &&
                T.end > S.end &&
                ((S = T),
                (this.mainFragLoading = { frag: T, targetBufferTime: null }));
            }
            if (y.start > S.end) return;
          }
          this.loadFragment(y, n, m);
        }
        onMediaDetaching(t, e) {
          (this.bufferFlushed = this.flushing = !1),
            super.onMediaDetaching(t, e);
        }
        onAudioTracksUpdated(t, { audioTracks: e }) {
          this.resetTransmuxer(), (this.levels = e.map((i) => new Me(i)));
        }
        onAudioTrackSwitching(t, e) {
          let i = !!e.url;
          this.trackId = e.id;
          let { fragCurrent: r } = this;
          r && (r.abortRequests(), this.removeUnbufferedFrags(r.start)),
            this.resetLoadingState(),
            i
              ? ((this.switchingTrack = e),
                this.flushAudioIfNeeded(e),
                this.state !== N.STOPPED &&
                  (this.setInterval(100), (this.state = N.IDLE), this.tick()))
              : (this.resetTransmuxer(),
                (this.switchingTrack = null),
                (this.bufferedTrack = e),
                this.clearInterval());
        }
        onManifestLoading() {
          super.onManifestLoading(),
            (this.bufferFlushed = this.flushing = this.audioOnly = !1),
            this.resetItem(),
            (this.trackId = -1);
        }
        onLevelLoaded(t, e) {
          this.mainDetails = e.details;
          let i = this.cachedTrackLoadedData;
          i &&
            ((this.cachedTrackLoadedData = null),
            this.onAudioTrackLoaded(p.AUDIO_TRACK_LOADED, i));
        }
        onAudioTrackLoaded(t, e) {
          var i, r;
          let { levels: s } = this,
            { details: a, id: n, groupId: l, track: o } = e;
          if (!s) {
            this.warn(
              `Audio tracks reset while loading track ${n} "${o.name}" of "${l}"`
            );
            return;
          }
          let d = this.mainDetails;
          if (!d || a.endCC > d.endCC || d.expired) {
            (this.cachedTrackLoadedData = e),
              this.state !== N.STOPPED && (this.state = N.WAITING_TRACK);
            return;
          }
          (this.cachedTrackLoadedData = null),
            this.log(
              `Audio track ${n} "${o.name}" of "${l}" loaded [${a.startSN},${
                a.endSN
              }]${
                a.lastPartSn ? `[part-${a.lastPartSn}-${a.lastPartIndex}]` : ''
              },duration:${a.totalduration}`
            );
          let u = s[n],
            c = 0;
          if (a.live || ((i = u.details) != null && i.live)) {
            if ((this.checkLiveUpdate(a), a.deltaUpdateFailed)) return;
            u.details &&
              (c = this.alignPlaylists(
                a,
                u.details,
                (r = this.levelLastLoaded) == null ? void 0 : r.details
              )),
              a.alignedSliding ||
                (zs(a, d), a.alignedSliding || ci(a, d), (c = a.fragmentStart));
          }
          (u.details = a),
            (this.levelLastLoaded = u),
            this.startFragRequested || this.setStartPosition(d, c),
            this.hls.trigger(p.AUDIO_TRACK_UPDATED, {
              details: a,
              id: n,
              groupId: e.groupId,
            }),
            this.state !== N.WAITING_TRACK ||
              this.waitForCdnTuneIn(a) ||
              (this.state = N.IDLE),
            this.tick();
        }
        _handleFragmentLoadProgress(t) {
          var e;
          let i = t.frag,
            { part: r, payload: s } = t,
            { config: a, trackId: n, levels: l } = this;
          if (!l) {
            this.warn(
              `Audio tracks were reset while fragment load was in progress. Fragment ${i.sn} of level ${i.level} will not be buffered`
            );
            return;
          }
          let o = l[n];
          if (!o) {
            this.warn('Audio track is undefined on fragment load progress');
            return;
          }
          let d = o.details;
          if (!d) {
            this.warn(
              'Audio track details undefined on fragment load progress'
            ),
              this.removeUnbufferedFrags(i.start);
            return;
          }
          let u = a.defaultAudioCodec || o.audioCodec || 'mp4a.40.2',
            c = this.transmuxer;
          c ||
            (c = this.transmuxer =
              new Sa(
                this.hls,
                j.AUDIO,
                this._handleTransmuxComplete.bind(this),
                this._handleTransmuxerFlush.bind(this)
              ));
          let f = this.initPTS[i.cc],
            g = (e = i.initSegment) == null ? void 0 : e.data;
          if (f !== void 0) {
            let E = r ? r.index : -1,
              m = new Yi(
                i.level,
                i.sn,
                i.stats.chunkCount,
                s.byteLength,
                E,
                E !== -1
              );
            c.push(s, g, u, '', i, r, d.totalduration, !1, m, f);
          } else {
            this.log(
              `Unknown video PTS for cc ${i.cc}, waiting for video PTS before demuxing audio frag ${i.sn} of [${d.startSN} ,${d.endSN}],track ${n}`
            );
            let { cache: E } = (this.waitingData = this.waitingData || {
              frag: i,
              part: r,
              cache: new Zs(),
              complete: !1,
            });
            E.push(new Uint8Array(s)),
              this.state !== N.STOPPED && (this.state = N.WAITING_INIT_PTS);
          }
        }
        _handleFragmentLoadComplete(t) {
          if (this.waitingData) {
            this.waitingData.complete = !0;
            return;
          }
          super._handleFragmentLoadComplete(t);
        }
        onBufferReset() {
          this.mediaBuffer = null;
        }
        onBufferCreated(t, e) {
          this.bufferFlushed = this.flushing = !1;
          let i = e.tracks.audio;
          i && (this.mediaBuffer = i.buffer || null);
        }
        onFragLoading(t, e) {
          !this.audioOnly &&
            e.frag.type === j.MAIN &&
            _t(e.frag) &&
            ((this.mainFragLoading = e), this.state === N.IDLE && this.tick());
        }
        onFragBuffered(t, e) {
          let { frag: i, part: r } = e;
          if (i.type !== j.AUDIO) {
            this.audioOnly ||
              i.type !== j.MAIN ||
              i.elementaryStreams.video ||
              i.elementaryStreams.audiovideo ||
              ((this.audioOnly = !0), (this.mainFragLoading = null));
            return;
          }
          if (this.fragContextChanged(i)) {
            this.warn(
              `Fragment ${i.sn}${r ? ' p: ' + r.index : ''} of level ${
                i.level
              } finished buffering, but was aborted. state: ${
                this.state
              }, audioSwitch: ${
                this.switchingTrack ? this.switchingTrack.name : 'false'
              }`
            );
            return;
          }
          if (_t(i)) {
            this.fragPrevious = i;
            let s = this.switchingTrack;
            s &&
              ((this.bufferedTrack = s),
              (this.switchingTrack = null),
              this.hls.trigger(p.AUDIO_TRACK_SWITCHED, J({}, s)));
          }
          this.fragBufferedComplete(i, r), this.media && this.tick();
        }
        onError(t, e) {
          var i;
          if (e.fatal) {
            this.state = N.ERROR;
            return;
          }
          switch (e.details) {
            case b.FRAG_GAP:
            case b.FRAG_PARSING_ERROR:
            case b.FRAG_DECRYPT_ERROR:
            case b.FRAG_LOAD_ERROR:
            case b.FRAG_LOAD_TIMEOUT:
            case b.KEY_LOAD_ERROR:
            case b.KEY_LOAD_TIMEOUT:
              this.onFragmentOrKeyLoadError(j.AUDIO, e);
              break;
            case b.AUDIO_TRACK_LOAD_ERROR:
            case b.AUDIO_TRACK_LOAD_TIMEOUT:
            case b.LEVEL_PARSING_ERROR:
              e.levelRetry ||
                this.state !== N.WAITING_TRACK ||
                ((i = e.context) == null ? void 0 : i.type) !==
                  lt.AUDIO_TRACK ||
                (this.state = N.IDLE);
              break;
            case b.BUFFER_ADD_CODEC_ERROR:
            case b.BUFFER_APPEND_ERROR:
              if (e.parent !== 'audio') return;
              this.reduceLengthAndFlushBuffer(e) || this.resetLoadingState();
              break;
            case b.BUFFER_FULL_ERROR:
              if (e.parent !== 'audio') return;
              this.reduceLengthAndFlushBuffer(e) &&
                ((this.bufferedTrack = null),
                super.flushMainBuffer(0, Number.POSITIVE_INFINITY, 'audio'));
              break;
            case b.INTERNAL_EXCEPTION:
              this.recoverWorkerError(e);
          }
        }
        onBufferFlushing(t, { type: e }) {
          e !== mt.VIDEO && (this.flushing = !0);
        }
        onBufferFlushed(t, { type: e }) {
          if (e !== mt.VIDEO) {
            (this.flushing = !1),
              (this.bufferFlushed = !0),
              this.state === N.ENDED && (this.state = N.IDLE);
            let i = this.mediaBuffer || this.media;
            i && (this.afterBufferFlushed(i, e, j.AUDIO), this.tick());
          }
        }
        _handleTransmuxComplete(t) {
          var e;
          let i = 'audio',
            { hls: r } = this,
            { remuxResult: s, chunkMeta: a } = t,
            n = this.getCurrentContext(a);
          if (!n) {
            this.resetWhenMissingContext(a);
            return;
          }
          let { frag: l, part: o, level: d } = n,
            { details: u } = d,
            { audio: c, text: f, id3: g, initSegment: E } = s;
          if (this.fragContextChanged(l) || !u) {
            this.fragmentTracker.removeFragment(l);
            return;
          }
          if (
            ((this.state = N.PARSING),
            this.switchingTrack &&
              c &&
              this.completeAudioSwitch(this.switchingTrack),
            E != null && E.tracks)
          ) {
            let m = l.initSegment || l;
            if (this.unhandledEncryptionError(E, l)) return;
            this._bufferInitSegment(d, E.tracks, m, a),
              r.trigger(p.FRAG_PARSING_INIT_SEGMENT, {
                frag: m,
                id: i,
                tracks: E.tracks,
              });
          }
          if (c) {
            let { startPTS: m, endPTS: y, startDTS: S, endDTS: T } = c;
            o &&
              (o.elementaryStreams[mt.AUDIO] = {
                startPTS: m,
                endPTS: y,
                startDTS: S,
                endDTS: T,
              }),
              l.setElementaryStreamInfo(mt.AUDIO, m, y, S, T),
              this.bufferFragmentData(c, l, o, a);
          }
          if (g != null && (e = g.samples) != null && e.length) {
            let m = at({ id: i, frag: l, details: u }, g);
            r.trigger(p.FRAG_PARSING_METADATA, m);
          }
          if (f) {
            let m = at({ id: i, frag: l, details: u }, f);
            r.trigger(p.FRAG_PARSING_USERDATA, m);
          }
        }
        _bufferInitSegment(t, e, i, r) {
          if (
            this.state !== N.PARSING ||
            (e.video && delete e.video,
            e.audiovideo && delete e.audiovideo,
            !e.audio)
          )
            return;
          let s = e.audio;
          s.id = j.AUDIO;
          let a = t.audioCodec;
          this.log(
            `Init audio buffer, container:${s.container}, codecs[level/parsed]=[${a}/${s.codec}]`
          ),
            a && a.split(',').length === 1 && (s.levelCodec = a),
            this.hls.trigger(p.BUFFER_CODECS, e);
          let n = s.initSegment;
          if (n != null && n.byteLength) {
            let l = {
              type: 'audio',
              frag: i,
              part: null,
              chunkMeta: r,
              parent: i.type,
              data: n,
            };
            this.hls.trigger(p.BUFFER_APPENDING, l);
          }
          this.tickImmediate();
        }
        loadFragment(t, e, i) {
          let r = this.fragmentTracker.getState(t);
          if (this.switchingTrack || r === xt.NOT_LOADED || r === xt.PARTIAL) {
            var s;
            if (_t(t))
              if ((s = e.details) != null && s.live && !this.initPTS[t.cc]) {
                this.log(
                  `Waiting for video PTS in continuity counter ${t.cc} of live stream before loading audio fragment ${t.sn} of level ${this.trackId}`
                ),
                  (this.state = N.WAITING_INIT_PTS);
                let a = this.mainDetails;
                a &&
                  a.fragmentStart !== e.details.fragmentStart &&
                  ci(e.details, a);
              } else super.loadFragment(t, e, i);
            else this._loadInitSegment(t, e);
          } else this.clearTrackerIfNeeded(t);
        }
        flushAudioIfNeeded(t) {
          if (this.media && this.bufferedTrack) {
            let {
              name: e,
              lang: i,
              assocLang: r,
              characteristics: s,
              audioCodec: a,
              channels: n,
            } = this.bufferedTrack;
            ge(
              {
                name: e,
                lang: i,
                assocLang: r,
                characteristics: s,
                audioCodec: a,
                channels: n,
              },
              t,
              me
            ) ||
              (ri(t.url, this.hls)
                ? (this.log('Switching audio track : flushing all audio'),
                  super.flushMainBuffer(0, Number.POSITIVE_INFINITY, 'audio'),
                  (this.bufferedTrack = null))
                : (this.bufferedTrack = t));
          }
        }
        completeAudioSwitch(t) {
          let { hls: e } = this;
          this.flushAudioIfNeeded(t),
            (this.bufferedTrack = t),
            (this.switchingTrack = null),
            e.trigger(p.AUDIO_TRACK_SWITCHED, J({}, t));
        }
      }
      class pr extends it {
        constructor(t, e) {
          super(e, t.logger),
            (this.hls = void 0),
            (this.canLoad = !1),
            (this.timer = -1),
            (this.hls = t);
        }
        destroy() {
          this.clearTimer(), (this.hls = this.log = this.warn = null);
        }
        clearTimer() {
          this.timer !== -1 && (F.clearTimeout(this.timer), (this.timer = -1));
        }
        startLoad() {
          (this.canLoad = !0), this.loadPlaylist();
        }
        stopLoad() {
          (this.canLoad = !1), this.clearTimer();
        }
        switchParams(t, e, i) {
          let r = e?.renditionReports;
          if (r) {
            let s = -1;
            for (let a = 0; a < r.length; a++) {
              let n,
                l = r[a];
              try {
                n = new F.URL(l.URI, e.url).href;
              } catch (o) {
                this.warn(
                  `Could not construct new URL for Rendition Report: ${o}`
                ),
                  (n = l.URI || '');
              }
              if (n === t) {
                s = a;
                break;
              }
              n === t.substring(0, n.length) && (s = a);
            }
            if (s !== -1) {
              let a = r[s],
                n = parseInt(a['LAST-MSN']) || e.lastPartSn,
                l = parseInt(a['LAST-PART']) || e.lastPartIndex;
              if (this.hls.config.lowLatencyMode) {
                let o = Math.min(e.age - e.partTarget, e.targetduration);
                l >= 0 && o > e.partTarget && (l += 1);
              }
              return new os(n, l >= 0 ? l : void 0, i && ls(i));
            }
          }
        }
        loadPlaylist(t) {
          this.clearTimer();
        }
        loadingPlaylist(t, e) {
          this.clearTimer();
        }
        shouldLoadPlaylist(t) {
          return (
            this.canLoad && !!t && !!t.url && (!t.details || t.details.live)
          );
        }
        getUrlWithDirectives(t, e) {
          if (e)
            try {
              return e.addDirectives(t);
            } catch (i) {
              this.warn(
                `Could not construct new URL with HLS Delivery Directives: ${i}`
              );
            }
          return t;
        }
        playlistLoaded(t, e, i) {
          let { details: r, stats: s } = e,
            a = F.performance.now(),
            n = s.loading.first ? Math.max(0, a - s.loading.first) : 0;
          r.advancedDateTime = Date.now() - n;
          let l = this.hls.config.timelineOffset;
          if (l !== r.appliedTimelineOffset) {
            let d = Math.max(l || 0, 0);
            (r.appliedTimelineOffset = d),
              r.fragments.forEach((u) => {
                u.setStart(u.playlistOffset + d);
              });
          }
          if (r.live || (i != null && i.live)) {
            let d,
              u,
              c,
              f = 'levelInfo' in e ? e.levelInfo : e.track;
            if ((r.reloaded(i), i && r.fragments.length > 0)) {
              (function (T, A, R) {
                let I;
                if (T === A) return;
                let v = null,
                  _ = T.fragments;
                for (let k = _.length - 1; k >= 0; k--) {
                  let P = _[k].initSegment;
                  if (P) {
                    v = P;
                    break;
                  }
                }
                T.fragmentHint && delete T.fragmentHint.endPTS,
                  (function (k, P, x) {
                    let U = P.skippedSegments,
                      $ = Math.max(k.startSN, P.startSN) - P.startSN,
                      B =
                        (k.fragmentHint ? 1 : 0) +
                        (U ? P.endSN : Math.min(k.endSN, P.endSN)) -
                        P.startSN,
                      O = P.startSN - k.startSN,
                      w = P.fragmentHint
                        ? P.fragments.concat(P.fragmentHint)
                        : P.fragments,
                      q = k.fragmentHint
                        ? k.fragments.concat(k.fragmentHint)
                        : k.fragments;
                    for (let V = $; V <= B; V++) {
                      let K = q[O + V],
                        z = w[V];
                      if ((U && !z && K && (z = P.fragments[V] = K), K && z)) {
                        var Z, X;
                        x(K, z, V, w);
                        let W = K.relurl,
                          dt = z.relurl;
                        if (W && (Z = W) !== (X = dt) && X && js(Z) !== js(X)) {
                          P.playlistParsingError = $s(
                            `media sequence mismatch ${z.sn}:`,
                            k,
                            P,
                            K,
                            z
                          );
                          return;
                        }
                        if (K.cc !== z.cc) {
                          P.playlistParsingError = $s(
                            `discontinuity sequence mismatch (${K.cc}!=${z.cc})`,
                            k,
                            P,
                            K,
                            z
                          );
                          return;
                        }
                      }
                    }
                  })(T, A, (k, P, x, U) => {
                    if ((!A.startCC || A.skippedSegments) && P.cc !== k.cc) {
                      let $ = k.cc - P.cc;
                      for (let B = x; B < U.length; B++) U[B].cc += $;
                      A.endCC = U[U.length - 1].cc;
                    }
                    Y(k.startPTS) &&
                      Y(k.endPTS) &&
                      (P.setStart((P.startPTS = k.startPTS)),
                      (P.startDTS = k.startDTS),
                      (P.maxStartPTS = k.maxStartPTS),
                      (P.endPTS = k.endPTS),
                      (P.endDTS = k.endDTS),
                      (P.minEndPTS = k.minEndPTS),
                      P.setDuration(k.endPTS - k.startPTS),
                      P.duration && (I = P),
                      (A.PTSKnown = A.alignedSliding = !0)),
                      k.hasStreams &&
                        (P.elementaryStreams = k.elementaryStreams),
                      (P.loader = k.loader),
                      k.hasStats && (P.stats = k.stats),
                      k.initSegment &&
                        ((P.initSegment = k.initSegment), (v = k.initSegment));
                  });
                let L = A.fragments,
                  C = A.fragmentHint ? L.concat(A.fragmentHint) : L;
                if (
                  (v &&
                    C.forEach((k) => {
                      var P;
                      k &&
                        (!k.initSegment ||
                          k.initSegment.relurl ===
                            ((P = v) == null ? void 0 : P.relurl)) &&
                        (k.initSegment = v);
                    }),
                  A.skippedSegments)
                ) {
                  if (
                    ((A.deltaUpdateFailed = L.some((k) => !k)),
                    A.deltaUpdateFailed)
                  ) {
                    R.warn(
                      '[level-helper] Previous playlist missing segments skipped in delta playlist'
                    );
                    for (let k = A.skippedSegments; k--; ) L.shift();
                    A.startSN = L[0].sn;
                  } else {
                    A.canSkipDateRanges &&
                      (A.dateRanges = (function (P, x, U) {
                        let { dateRanges: $, recentlyRemovedDateranges: B } = x,
                          O = at({}, P);
                        B &&
                          B.forEach((q) => {
                            delete O[q];
                          });
                        let w = Object.keys(O).length;
                        return w
                          ? (Object.keys($).forEach((q) => {
                              let Z = O[q],
                                X = new Rs($[q].attr, Z);
                              X.isValid
                                ? ((O[q] = X), Z || (X.tagOrder += w))
                                : U.warn(
                                    `Ignoring invalid Playlist Delta Update DATERANGE tag: "${yt(
                                      $[q].attr
                                    )}"`
                                  );
                            }),
                            O)
                          : $;
                      })(T.dateRanges, A, R));
                    let k = T.fragments.filter((P) => P.rawProgramDateTime);
                    if (T.hasProgramDateTime && !A.hasProgramDateTime)
                      for (let P = 1; P < C.length; P++)
                        C[P].programDateTime === null && Ji(C[P], C[P - 1], k);
                    Cs(k, A);
                  }
                  A.endCC = L[L.length - 1].cc;
                }
                if (!A.startCC) {
                  var M;
                  let k = Vs(T, A.startSN - 1);
                  A.startCC = (M = k?.cc) != null ? M : L[0].cc;
                }
                (function (k, P, x) {
                  if (k && P) {
                    let U = 0;
                    for (let $ = 0, B = k.length; $ <= B; $++) {
                      let O = k[$],
                        w = P[$ + U];
                      O &&
                      w &&
                      O.index === w.index &&
                      O.fragment.sn === w.fragment.sn
                        ? x(O, w)
                        : U--;
                    }
                  }
                })(T.partList, A.partList, (k, P) => {
                  (P.elementaryStreams = k.elementaryStreams),
                    (P.stats = k.stats);
                }),
                  I
                    ? Bs(A, I, I.startPTS, I.endPTS, I.startDTS, I.endDTS, R)
                    : Gs(T, A),
                  L.length && (A.totalduration = A.edge - L[0].start),
                  (A.driftStartTime = T.driftStartTime),
                  (A.driftStart = T.driftStart);
                let G = A.advancedDateTime;
                if (A.advanced && G) {
                  let k = A.edge;
                  A.driftStart || ((A.driftStartTime = G), (A.driftStart = k)),
                    (A.driftEndTime = G),
                    (A.driftEnd = k);
                } else
                  (A.driftEndTime = T.driftEndTime),
                    (A.driftEnd = T.driftEnd),
                    (A.advancedDateTime = T.advancedDateTime);
                A.requestScheduled === -1 &&
                  (A.requestScheduled = T.requestScheduled);
              })(i, r, this);
              let S = r.playlistParsingError;
              if (S) {
                this.warn(S);
                let T = this.hls;
                if (!T.config.ignorePlaylistParsingErrors) {
                  var o;
                  let { networkDetails: A } = e;
                  T.trigger(p.ERROR, {
                    type: Q.NETWORK_ERROR,
                    details: b.LEVEL_PARSING_ERROR,
                    fatal: !1,
                    url: r.url,
                    error: S,
                    reason: S.message,
                    level: e.level || void 0,
                    parent: (o = r.fragments[0]) == null ? void 0 : o.type,
                    networkDetails: A,
                    stats: s,
                  });
                  return;
                }
                r.playlistParsingError = null;
              }
            }
            r.requestScheduled === -1 && (r.requestScheduled = s.loading.start);
            let g = this.hls.mainForwardBufferInfo,
              E = g ? g.end - g.len : 0,
              m = (r.edge - E) * 1e3,
              y = Ks(r, m);
            if (
              (r.requestScheduled + y < a
                ? (r.requestScheduled = a)
                : (r.requestScheduled += y),
              this.log(
                `live playlist ${t} ${
                  r.advanced
                    ? 'REFRESHED ' + r.lastPartSn + '-' + r.lastPartIndex
                    : r.updated
                    ? 'UPDATED'
                    : 'MISSED'
                }`
              ),
              !this.canLoad || !r.live)
            )
              return;
            if (r.canBlockReload && r.endSN && r.advanced) {
              let S = this.hls.config.lowLatencyMode,
                T = r.lastPartSn,
                A = r.endSN,
                R = r.lastPartIndex,
                I = T === A;
              R !== -1
                ? I
                  ? ((u = A + 1), (c = S ? 0 : R))
                  : ((u = T), (c = S ? R + 1 : r.maxPartIndex))
                : (u = A + 1);
              let v = r.age,
                _ = v + r.ageHeader,
                L = Math.min(_ - r.partTarget, 1.5 * r.targetduration);
              if (L > 0) {
                if (_ > 3 * r.targetduration)
                  this.log(
                    `Playlist last advanced ${v.toFixed(
                      2
                    )}s ago. Omitting segment and part directives.`
                  ),
                    (u = void 0),
                    (c = void 0);
                else if (
                  i != null &&
                  i.tuneInGoal &&
                  _ - r.partTarget > i.tuneInGoal
                )
                  this.warn(
                    `CDN Tune-in goal increased from: ${i.tuneInGoal} to: ${L} with playlist age: ${r.age}`
                  ),
                    (L = 0);
                else {
                  let C = Math.floor(L / r.targetduration);
                  (u += C),
                    c !== void 0 &&
                      (c += Math.round((L % r.targetduration) / r.partTarget)),
                    this.log(
                      `CDN Tune-in age: ${
                        r.ageHeader
                      }s last advanced ${v.toFixed(
                        2
                      )}s goal: ${L} skip sn ${C} to part ${c}`
                    );
                }
                r.tuneInGoal = L;
              }
              if (
                ((d = this.getDeliveryDirectives(
                  r,
                  e.deliveryDirectives,
                  u,
                  c
                )),
                S || !I)
              ) {
                (r.requestScheduled = a), this.loadingPlaylist(f, d);
                return;
              }
            } else
              (r.canBlockReload || r.canSkipUntil) &&
                (d = this.getDeliveryDirectives(r, e.deliveryDirectives, u, c));
            d &&
              u !== void 0 &&
              r.canBlockReload &&
              (r.requestScheduled =
                s.loading.first + Math.max(y - 2 * n, y / 2)),
              this.scheduleLoading(f, d, r);
          } else this.clearTimer();
        }
        scheduleLoading(t, e, i) {
          let r = i || t.details;
          if (!r) {
            this.loadingPlaylist(t, e);
            return;
          }
          let s = F.performance.now(),
            a = r.requestScheduled;
          if (s >= a) {
            this.loadingPlaylist(t, e);
            return;
          }
          let n = a - s;
          this.log(
            `reload live playlist ${
              t.name || t.bitrate + 'bps'
            } in ${Math.round(n)} ms`
          ),
            this.clearTimer(),
            (this.timer = F.setTimeout(() => this.loadingPlaylist(t, e), n));
        }
        getDeliveryDirectives(t, e, i, r) {
          let s = ls(t);
          return (
            e != null &&
              e.skip &&
              t.deltaUpdateFailed &&
              ((i = e.msn), (r = e.part), (s = ii.No)),
            new os(i, r, s)
          );
        }
        checkRetry(t) {
          let e = t.details,
            i = si(t),
            r = t.errorAction,
            { action: s, retryCount: a = 0, retryConfig: n } = r || {},
            l =
              !!r &&
              !!n &&
              (s === Ft.RetryRequest ||
                (!r.resolved && s === Ft.SendAlternateToPenaltyBox));
          if (l) {
            var o;
            if (a >= n.maxNumRetry) return !1;
            if (i && (o = t.context) != null && o.deliveryDirectives)
              this.warn(
                `Retrying playlist loading ${a + 1}/${
                  n.maxNumRetry
                } after "${e}" without delivery-directives`
              ),
                this.loadPlaylist();
            else {
              let d = Ki(n, a);
              this.clearTimer(),
                (this.timer = F.setTimeout(() => this.loadPlaylist(), d)),
                this.warn(
                  `Retrying playlist loading ${a + 1}/${
                    n.maxNumRetry
                  } after "${e}" in ${d}ms`
                );
            }
            (t.levelRetry = !0), (r.resolved = !0);
          }
          return l;
        }
      }
      function Aa(h, t) {
        if (h.length !== t.length) return !1;
        for (let e = 0; e < h.length; e++)
          if (!Ve(h[e].attrs, t[e].attrs)) return !1;
        return !0;
      }
      function Ve(h, t, e) {
        let i = h['STABLE-RENDITION-ID'];
        return i && !e
          ? i === t['STABLE-RENDITION-ID']
          : !(
              e || [
                'LANGUAGE',
                'NAME',
                'CHARACTERISTICS',
                'AUTOSELECT',
                'DEFAULT',
                'FORCED',
                'ASSOC-LANGUAGE',
              ]
            ).some((r) => h[r] !== t[r]);
      }
      function Er(h, t) {
        return (
          t.label.toLowerCase() === h.name.toLowerCase() &&
          (!t.language ||
            t.language.toLowerCase() === (h.lang || '').toLowerCase())
        );
      }
      class Zn extends pr {
        constructor(t) {
          super(t, 'audio-track-controller'),
            (this.tracks = []),
            (this.groupIds = null),
            (this.tracksInGroup = []),
            (this.trackId = -1),
            (this.currentTrack = null),
            (this.selectDefaultTrack = !0),
            this.registerListeners();
        }
        registerListeners() {
          let { hls: t } = this;
          t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.on(p.LEVEL_LOADING, this.onLevelLoading, this),
            t.on(p.LEVEL_SWITCHING, this.onLevelSwitching, this),
            t.on(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this),
            t.on(p.ERROR, this.onError, this);
        }
        unregisterListeners() {
          let { hls: t } = this;
          t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.off(p.LEVEL_LOADING, this.onLevelLoading, this),
            t.off(p.LEVEL_SWITCHING, this.onLevelSwitching, this),
            t.off(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this),
            t.off(p.ERROR, this.onError, this);
        }
        destroy() {
          this.unregisterListeners(),
            (this.tracks.length = 0),
            (this.tracksInGroup.length = 0),
            (this.currentTrack = null),
            super.destroy();
        }
        onManifestLoading() {
          (this.tracks = []),
            (this.tracksInGroup = []),
            (this.groupIds = null),
            (this.currentTrack = null),
            (this.trackId = -1),
            (this.selectDefaultTrack = !0);
        }
        onManifestParsed(t, e) {
          this.tracks = e.audioTracks || [];
        }
        onAudioTrackLoaded(t, e) {
          let { id: i, groupId: r, details: s } = e,
            a = this.tracksInGroup[i];
          if (!a || a.groupId !== r) {
            this.warn(
              `Audio track with id:${i} and group:${r} not found in active group ${a?.groupId}`
            );
            return;
          }
          let n = a.details;
          (a.details = e.details),
            this.log(
              `Audio track ${i} "${a.name}" lang:${a.lang} group:${r} loaded [${s.startSN}-${s.endSN}]`
            ),
            i === this.trackId && this.playlistLoaded(i, e, n);
        }
        onLevelLoading(t, e) {
          this.switchLevel(e.level);
        }
        onLevelSwitching(t, e) {
          this.switchLevel(e.level);
        }
        switchLevel(t) {
          let e = this.hls.levels[t];
          if (!e) return;
          let i = e.audioGroups || null,
            r = this.groupIds,
            s = this.currentTrack;
          if (
            !i ||
            r?.length !== i?.length ||
            (i != null && i.some((n) => r?.indexOf(n) === -1))
          ) {
            (this.groupIds = i),
              (this.trackId = -1),
              (this.currentTrack = null);
            let n = this.tracks.filter(
              (u) => !i || i.indexOf(u.groupId) !== -1
            );
            if (n.length)
              this.selectDefaultTrack &&
                !n.some((u) => u.default) &&
                (this.selectDefaultTrack = !1),
                n.forEach((u, c) => {
                  u.id = c;
                });
            else if (!s && !this.tracksInGroup.length) return;
            this.tracksInGroup = n;
            let l = this.hls.config.audioPreference;
            if (!s && l) {
              let u = Jt(l, n, me);
              if (u > -1) s = n[u];
              else {
                let c = Jt(l, this.tracks);
                s = this.tracks[c];
              }
            }
            let o = this.findTrackId(s);
            o === -1 && s && (o = this.findTrackId(null)),
              this.log(
                `Updating audio tracks, ${
                  n.length
                } track(s) found in group(s): ${i?.join(',')}`
              ),
              this.hls.trigger(p.AUDIO_TRACKS_UPDATED, { audioTracks: n });
            let d = this.trackId;
            if (o !== -1 && d === -1) this.setAudioTrack(o);
            else if (n.length && d === -1) {
              var a;
              let u = Error(
                `No audio track selected for current audio group-ID(s): ${
                  (a = this.groupIds) == null ? void 0 : a.join(',')
                } track count: ${n.length}`
              );
              this.warn(u.message),
                this.hls.trigger(p.ERROR, {
                  type: Q.MEDIA_ERROR,
                  details: b.AUDIO_TRACK_LOAD_ERROR,
                  fatal: !0,
                  error: u,
                });
            }
          }
        }
        onError(t, e) {
          !e.fatal &&
            e.context &&
            (e.context.type !== lt.AUDIO_TRACK ||
              e.context.id !== this.trackId ||
              (this.groupIds &&
                this.groupIds.indexOf(e.context.groupId) === -1) ||
              this.checkRetry(e));
        }
        get allAudioTracks() {
          return this.tracks;
        }
        get audioTracks() {
          return this.tracksInGroup;
        }
        get audioTrack() {
          return this.trackId;
        }
        set audioTrack(t) {
          (this.selectDefaultTrack = !1), this.setAudioTrack(t);
        }
        setAudioOption(t) {
          let e = this.hls;
          if (((e.config.audioPreference = t), t)) {
            let i = this.allAudioTracks;
            if (((this.selectDefaultTrack = !1), i.length)) {
              let r = this.currentTrack;
              if (r && ge(t, r, me)) return r;
              let s = Jt(t, this.tracksInGroup, me);
              if (s > -1) {
                let a = this.tracksInGroup[s];
                return this.setAudioTrack(s), a;
              }
              if (r) {
                let a = e.loadLevel;
                a === -1 && (a = e.firstAutoLevel);
                let n = (function (l, o, d, u, c) {
                  let f = o[u],
                    g = o.reduce((T, A, R) => {
                      let I = A.uri;
                      return (T[I] || (T[I] = [])).push(R), T;
                    }, {})[f.uri];
                  g.length > 1 && (u = Math.max.apply(Math, g));
                  let E = f.videoRange,
                    m = f.frameRate,
                    y = f.codecSet.substring(0, 4),
                    S = cs(o, u, (T) => {
                      if (
                        T.videoRange !== E ||
                        T.frameRate !== m ||
                        T.codecSet.substring(0, 4) !== y
                      )
                        return !1;
                      let A = T.audioGroups;
                      return (
                        Jt(
                          l,
                          d.filter((R) => !A || A.indexOf(R.groupId) !== -1),
                          c
                        ) > -1
                      );
                    });
                  return S > -1
                    ? S
                    : cs(o, u, (T) => {
                        let A = T.audioGroups;
                        return (
                          Jt(
                            l,
                            d.filter((R) => !A || A.indexOf(R.groupId) !== -1),
                            c
                          ) > -1
                        );
                      });
                })(t, e.levels, i, a, me);
                if (n === -1) return null;
                e.nextLoadLevel = n;
              }
              if (t.channels || t.audioCodec) {
                let a = Jt(t, i);
                if (a > -1) return i[a];
              }
            }
          }
          return null;
        }
        setAudioTrack(t) {
          let e = this.tracksInGroup;
          if (t < 0 || t >= e.length) {
            this.warn(`Invalid audio track id: ${t}`);
            return;
          }
          this.selectDefaultTrack = !1;
          let i = this.currentTrack,
            r = e[t],
            s = r.details && !r.details.live;
          if (
            (t === this.trackId && r === i && s) ||
            (this.log(
              `Switching to audio-track ${t} "${r.name}" lang:${r.lang} group:${r.groupId} channels:${r.channels}`
            ),
            (this.trackId = t),
            (this.currentTrack = r),
            this.hls.trigger(p.AUDIO_TRACK_SWITCHING, J({}, r)),
            s)
          )
            return;
          let a = this.switchParams(r.url, i?.details, r.details);
          this.loadPlaylist(a);
        }
        findTrackId(t) {
          let e = this.tracksInGroup;
          for (let i = 0; i < e.length; i++) {
            let r = e[i];
            if ((!this.selectDefaultTrack || r.default) && (!t || ge(t, r, me)))
              return i;
          }
          if (t) {
            let {
              name: i,
              lang: r,
              assocLang: s,
              characteristics: a,
              audioCodec: n,
              channels: l,
            } = t;
            for (let o = 0; o < e.length; o++)
              if (
                ge(
                  {
                    name: i,
                    lang: r,
                    assocLang: s,
                    characteristics: a,
                    audioCodec: n,
                    channels: l,
                  },
                  e[o],
                  me
                )
              )
                return o;
            for (let o = 0; o < e.length; o++) {
              let d = e[o];
              if (
                Ve(t.attrs, d.attrs, [
                  'LANGUAGE',
                  'ASSOC-LANGUAGE',
                  'CHARACTERISTICS',
                ])
              )
                return o;
            }
            for (let o = 0; o < e.length; o++) {
              let d = e[o];
              if (Ve(t.attrs, d.attrs, ['LANGUAGE'])) return o;
            }
          }
          return -1;
        }
        loadPlaylist(t) {
          super.loadPlaylist();
          let e = this.currentTrack;
          this.shouldLoadPlaylist(e) &&
            ri(e.url, this.hls) &&
            this.scheduleLoading(e, t);
        }
        loadingPlaylist(t, e) {
          super.loadingPlaylist(t, e);
          let i = t.id,
            r = t.groupId,
            s = this.getUrlWithDirectives(t.url, e),
            a = t.details,
            n = a?.age;
          this.log(
            `Loading audio-track ${i} "${t.name}" lang:${t.lang} group:${r}${
              e?.msn !== void 0 ? ' at sn ' + e.msn + ' part ' + e.part : ''
            }${
              n && a.live
                ? ' age ' + n.toFixed(1) + (a.type ? ' ' + a.type : '')
                : ''
            } ${s}`
          ),
            this.hls.trigger(p.AUDIO_TRACK_LOADING, {
              url: s,
              id: i,
              groupId: r,
              deliveryDirectives: e || null,
              track: t,
            });
        }
      }
      class Jn {
        constructor(t) {
          (this.tracks = void 0),
            (this.queues = { video: [], audio: [], audiovideo: [] }),
            (this.tracks = t);
        }
        destroy() {
          this.tracks = this.queues = null;
        }
        append(t, e, i) {
          if (this.queues === null || this.tracks === null) return;
          let r = this.queues[e];
          r.push(t), r.length !== 1 || i || this.executeNext(e);
        }
        appendBlocker(t) {
          return new Promise((e) => {
            this.append(
              {
                label: 'async-blocker',
                execute: e,
                onStart: () => {},
                onComplete: () => {},
                onError: () => {},
              },
              t
            );
          });
        }
        prependBlocker(t) {
          return new Promise((e) => {
            this.queues &&
              this.queues[t].unshift({
                label: 'async-blocker-prepend',
                execute: e,
                onStart: () => {},
                onComplete: () => {},
                onError: () => {},
              });
          });
        }
        removeBlockers() {
          this.queues !== null &&
            [
              this.queues.video,
              this.queues.audio,
              this.queues.audiovideo,
            ].forEach((t) => {
              var e;
              let i = (e = t[0]) == null ? void 0 : e.label;
              (i === 'async-blocker' || i === 'async-blocker-prepend') &&
                (t[0].execute(), t.splice(0, 1));
            });
        }
        unblockAudio(t) {
          this.queues !== null &&
            this.queues.audio[0] === t &&
            this.shiftAndExecuteNext('audio');
        }
        executeNext(t) {
          if (this.queues === null || this.tracks === null) return;
          let e = this.queues[t];
          if (e.length) {
            let r = e[0];
            try {
              r.execute();
            } catch (s) {
              var i;
              if ((r.onError(s), this.queues === null || this.tracks === null))
                return;
              let a = (i = this.tracks[t]) == null ? void 0 : i.buffer;
              (a != null && a.updating) || this.shiftAndExecuteNext(t);
            }
          }
        }
        shiftAndExecuteNext(t) {
          this.queues !== null && (this.queues[t].shift(), this.executeNext(t));
        }
        current(t) {
          var e;
          return ((e = this.queues) == null ? void 0 : e[t][0]) || null;
        }
        toString() {
          let { queues: t, tracks: e } = this;
          return t === null || e === null
            ? '<destroyed>'
            : `
${this.list('video')}
${this.list('audio')}
${this.list('audiovideo')}}`;
        }
        list(t) {
          var e, i;
          return ((e = this.queues) != null && e[t]) ||
            ((i = this.tracks) != null && i[t])
            ? `${t}: (${this.listSbInfo(t)}) ${this.listOps(t)}`
            : '';
        }
        listSbInfo(t) {
          var e;
          let i = (e = this.tracks) == null ? void 0 : e[t],
            r = i?.buffer;
          return r
            ? `SourceBuffer${r.updating ? ' updating' : ''}${
                i.ended ? ' ended' : ''
              }${i.ending ? ' ending' : ''}`
            : 'none';
        }
        listOps(t) {
          var e;
          return (
            ((e = this.queues) == null
              ? void 0
              : e[t].map((i) => i.label).join(', ')) || ''
          );
        }
      }
      let La = /(avc[1234]|hvc1|hev1|dvh[1e]|vp09|av01)(?:\.[^.,]+)+/,
        Ia = 'HlsJsTrackRemovedError';
      class tl extends Error {
        constructor(t) {
          super(t), (this.name = Ia);
        }
      }
      class el extends it {
        constructor(t, e) {
          var i;
          super('buffer-controller', t.logger),
            (this.hls = void 0),
            (this.fragmentTracker = void 0),
            (this.details = null),
            (this._objectUrl = null),
            (this.operationQueue = null),
            (this.bufferCodecEventsTotal = 0),
            (this.media = null),
            (this.mediaSource = null),
            (this.lastMpegAudioChunk = null),
            (this.blockedAudioAppend = null),
            (this.lastVideoAppendEnd = 0),
            (this.appendSource = void 0),
            (this.transferData = void 0),
            (this.overrides = void 0),
            (this.appendErrors = { audio: 0, video: 0, audiovideo: 0 }),
            (this.tracks = {}),
            (this.sourceBuffers = [
              [null, null],
              [null, null],
            ]),
            (this._onEndStreaming = (r) => {
              var s;
              this.hls &&
                ((s = this.mediaSource) == null ? void 0 : s.readyState) ===
                  'open' &&
                this.hls.pauseBuffering();
            }),
            (this._onStartStreaming = (r) => {
              this.hls && this.hls.resumeBuffering();
            }),
            (this._onMediaSourceOpen = (r) => {
              let { media: s, mediaSource: a } = this;
              r && this.log('Media source opened'),
                s &&
                  a &&
                  (a.removeEventListener('sourceopen', this._onMediaSourceOpen),
                  s.removeEventListener('emptied', this._onMediaEmptied),
                  this.updateDuration(),
                  this.hls.trigger(p.MEDIA_ATTACHED, {
                    media: s,
                    mediaSource: a,
                  }),
                  this.mediaSource !== null && this.checkPendingTracks());
            }),
            (this._onMediaSourceClose = () => {
              this.log('Media source closed');
            }),
            (this._onMediaSourceEnded = () => {
              this.log('Media source ended');
            }),
            (this._onMediaEmptied = () => {
              let { mediaSrc: r, _objectUrl: s } = this;
              r !== s &&
                this.error(
                  `Media element src was set while attaching MediaSource (${s} > ${r})`
                );
            }),
            (this.hls = t),
            (this.fragmentTracker = e),
            (this.appendSource =
              ((i = bt(t.config.preferManagedMediaSource)),
              typeof F < 'u' && i === F.ManagedMediaSource)),
            this.initTracks(),
            this.registerListeners();
        }
        hasSourceTypes() {
          return Object.keys(this.tracks).length > 0;
        }
        destroy() {
          this.unregisterListeners(),
            (this.details = null),
            (this.lastMpegAudioChunk = this.blockedAudioAppend = null),
            (this.transferData = this.overrides = void 0),
            this.operationQueue &&
              (this.operationQueue.destroy(), (this.operationQueue = null)),
            (this.hls = this.fragmentTracker = null),
            (this._onMediaSourceOpen = this._onMediaSourceClose = null),
            (this._onMediaSourceEnded = null),
            (this._onStartStreaming = this._onEndStreaming = null);
        }
        registerListeners() {
          let { hls: t } = this;
          t.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.on(p.BUFFER_RESET, this.onBufferReset, this),
            t.on(p.BUFFER_APPENDING, this.onBufferAppending, this),
            t.on(p.BUFFER_CODECS, this.onBufferCodecs, this),
            t.on(p.BUFFER_EOS, this.onBufferEos, this),
            t.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this),
            t.on(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.on(p.FRAG_PARSED, this.onFragParsed, this),
            t.on(p.FRAG_CHANGED, this.onFragChanged, this),
            t.on(p.ERROR, this.onError, this);
        }
        unregisterListeners() {
          let { hls: t } = this;
          t.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.off(p.BUFFER_RESET, this.onBufferReset, this),
            t.off(p.BUFFER_APPENDING, this.onBufferAppending, this),
            t.off(p.BUFFER_CODECS, this.onBufferCodecs, this),
            t.off(p.BUFFER_EOS, this.onBufferEos, this),
            t.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this),
            t.off(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.off(p.FRAG_PARSED, this.onFragParsed, this),
            t.off(p.FRAG_CHANGED, this.onFragChanged, this),
            t.off(p.ERROR, this.onError, this);
        }
        transferMedia() {
          let { media: t, mediaSource: e } = this;
          if (!t) return null;
          let i = {};
          if (this.operationQueue) {
            let s = this.isUpdating();
            s || this.operationQueue.removeBlockers();
            let a = this.isQueued();
            (s || a) &&
              this.warn(
                `Transfering MediaSource with${
                  a ? ' operations in queue' : ''
                }${s ? ' updating SourceBuffer(s)' : ''} ${this.operationQueue}`
              ),
              this.operationQueue.destroy();
          }
          let r = this.transferData;
          return (
            !this.sourceBufferCount && r && r.mediaSource === e
              ? at(i, r.tracks)
              : this.sourceBuffers.forEach((s) => {
                  let [a] = s;
                  a && ((i[a] = at({}, this.tracks[a])), this.removeBuffer(a)),
                    (s[0] = s[1] = null);
                }),
            { media: t, mediaSource: e, tracks: i }
          );
        }
        initTracks() {
          (this.sourceBuffers = [
            [null, null],
            [null, null],
          ]),
            (this.tracks = {}),
            this.resetQueue(),
            this.resetAppendErrors(),
            (this.lastMpegAudioChunk = this.blockedAudioAppend = null),
            (this.lastVideoAppendEnd = 0);
        }
        onManifestLoading() {
          (this.bufferCodecEventsTotal = 0), (this.details = null);
        }
        onManifestParsed(t, e) {
          var i;
          let r = 2;
          ((!e.audio || e.video) && e.altAudio) || (r = 1),
            (this.bufferCodecEventsTotal = r),
            this.log(`${r} bufferCodec event(s) expected.`),
            (i = this.transferData) != null &&
              i.mediaSource &&
              this.sourceBufferCount &&
              r &&
              this.bufferCreated();
        }
        onMediaAttaching(t, e) {
          let i = (this.media = e.media);
          this.transferData = this.overrides = void 0;
          let r = bt(this.appendSource);
          if (r) {
            let s = !!e.mediaSource;
            (s || e.overrides) &&
              ((this.transferData = e), (this.overrides = e.overrides));
            let a = (this.mediaSource = e.mediaSource || new r());
            if ((this.assignMediaSource(a), s))
              (this._objectUrl = i.src), this.attachTransferred();
            else {
              let n = (this._objectUrl = F.URL.createObjectURL(a));
              if (this.appendSource)
                try {
                  i.removeAttribute('src');
                  let l = F.ManagedMediaSource;
                  (i.disableRemotePlayback =
                    i.disableRemotePlayback || (l && a instanceof l)),
                    Ra(i),
                    (function (o, d) {
                      let u = F.document.createElement('source');
                      (u.type = 'video/mp4'), (u.src = d), o.appendChild(u);
                    })(i, n),
                    i.load();
                } catch {
                  i.src = n;
                }
              else i.src = n;
            }
            i.addEventListener('emptied', this._onMediaEmptied);
          }
        }
        assignMediaSource(t) {
          var e, i;
          this.log(
            `${
              ((e = this.transferData) == null ? void 0 : e.mediaSource) === t
                ? 'transferred'
                : 'created'
            } media source: ${(i = t.constructor) == null ? void 0 : i.name}`
          ),
            t.addEventListener('sourceopen', this._onMediaSourceOpen),
            t.addEventListener('sourceended', this._onMediaSourceEnded),
            t.addEventListener('sourceclose', this._onMediaSourceClose),
            this.appendSource &&
              (t.addEventListener('startstreaming', this._onStartStreaming),
              t.addEventListener('endstreaming', this._onEndStreaming));
        }
        attachTransferred() {
          let t = this.media,
            e = this.transferData;
          if (!e || !t) return;
          let i = this.tracks,
            r = e.tracks,
            s = r ? Object.keys(r) : null,
            a = s ? s.length : 0,
            n = () => {
              Promise.resolve().then(() => {
                this.media &&
                  this.mediaSourceOpenOrEnded &&
                  this._onMediaSourceOpen();
              });
            };
          if (r && s && a) {
            if (!this.tracksReady) {
              (this.hls.config.startFragPrefetch = !0),
                this.log(
                  'attachTransferred: waiting for SourceBuffer track info'
                );
              return;
            }
            if (
              (this.log(`attachTransferred: (bufferCodecEventsTotal ${
                this.bufferCodecEventsTotal
              })
required tracks: ${yt(i, (l, o) => (l === 'initSegment' ? void 0 : o))};
transfer tracks: ${yt(r, (l, o) => (l === 'initSegment' ? void 0 : o))}}`),
              !Mt(r, i))
            ) {
              (e.mediaSource = null), (e.tracks = void 0);
              let l = t.currentTime,
                o = this.details,
                d = Math.max(l, o?.fragments[0].start || 0);
              if (d - l > 1) {
                this.log(
                  `attachTransferred: waiting for playback to reach new tracks start time ${l} -> ${d}`
                );
                return;
              }
              this.warn(
                `attachTransferred: resetting MediaSource for incompatible tracks ("${Object.keys(
                  r
                )}"->"${Object.keys(i)}") start time: ${d} currentTime: ${l}`
              ),
                this.onMediaDetaching(p.MEDIA_DETACHING, {}),
                this.onMediaAttaching(p.MEDIA_ATTACHING, e),
                (t.currentTime = d);
              return;
            }
            (this.transferData = void 0),
              s.forEach((l) => {
                let o = r[l];
                if (o) {
                  let d = o.buffer;
                  if (d) {
                    let u = this.fragmentTracker,
                      c = o.id;
                    if (u.hasFragments(c) || u.hasParts(c)) {
                      let E = rt.getBuffered(d);
                      u.detectEvictedFragments(l, E, c, null, !0);
                    }
                    let f = yr(l),
                      g = [l, d];
                    (this.sourceBuffers[f] = g),
                      d.updating &&
                        this.operationQueue &&
                        this.operationQueue.prependBlocker(l),
                      this.trackSourceBuffer(l, o);
                  }
                }
              }),
              n(),
              this.bufferCreated();
          } else
            this.log('attachTransferred: MediaSource w/o SourceBuffers'), n();
        }
        get mediaSourceOpenOrEnded() {
          var t;
          let e = (t = this.mediaSource) == null ? void 0 : t.readyState;
          return e === 'open' || e === 'ended';
        }
        onMediaDetaching(t, e) {
          let i = !!e.transferMedia;
          this.transferData = this.overrides = void 0;
          let { media: r, mediaSource: s, _objectUrl: a } = this;
          if (s) {
            if (
              (this.log(`media source ${i ? 'transferring' : 'detaching'}`), i)
            )
              this.sourceBuffers.forEach(([n]) => {
                n && this.removeBuffer(n);
              }),
                this.resetQueue();
            else {
              if (this.mediaSourceOpenOrEnded) {
                let n = s.readyState === 'open';
                try {
                  let l = s.sourceBuffers;
                  for (let o = l.length; o--; )
                    n && l[o].abort(), s.removeSourceBuffer(l[o]);
                  n && s.endOfStream();
                } catch (l) {
                  this.warn(
                    `onMediaDetaching: ${l.message} while calling endOfStream`
                  );
                }
              }
              this.sourceBufferCount && this.onBufferReset();
            }
            s.removeEventListener('sourceopen', this._onMediaSourceOpen),
              s.removeEventListener('sourceended', this._onMediaSourceEnded),
              s.removeEventListener('sourceclose', this._onMediaSourceClose),
              this.appendSource &&
                (s.removeEventListener(
                  'startstreaming',
                  this._onStartStreaming
                ),
                s.removeEventListener('endstreaming', this._onEndStreaming)),
              (this.mediaSource = null),
              (this._objectUrl = null);
          }
          r &&
            (r.removeEventListener('emptied', this._onMediaEmptied),
            i ||
              (a && F.URL.revokeObjectURL(a),
              this.mediaSrc === a
                ? (r.removeAttribute('src'),
                  this.appendSource && Ra(r),
                  r.load())
                : this.warn(
                    'media|source.src was changed by a third party - skip cleanup'
                  )),
            (this.media = null)),
            this.hls.trigger(p.MEDIA_DETACHED, e);
        }
        onBufferReset() {
          this.sourceBuffers.forEach(([t]) => {
            t && this.resetBuffer(t);
          }),
            this.initTracks();
        }
        resetBuffer(t) {
          var e, i;
          let r = (e = this.tracks[t]) == null ? void 0 : e.buffer;
          if ((this.removeBuffer(t), r))
            try {
              (i = this.mediaSource) != null &&
                i.sourceBuffers.length &&
                this.mediaSource.removeSourceBuffer(r);
            } catch (s) {
              this.warn(`onBufferReset ${t}`, s);
            }
          delete this.tracks[t];
        }
        removeBuffer(t) {
          this.removeBufferListeners(t),
            (this.sourceBuffers[yr(t)] = [null, null]);
          let e = this.tracks[t];
          e && (e.buffer = void 0);
        }
        resetQueue() {
          this.operationQueue && this.operationQueue.destroy(),
            (this.operationQueue = new Jn(this.tracks));
        }
        onBufferCodecs(t, e) {
          let i = this.tracks,
            r = Object.keys(e);
          this.log(
            `BUFFER_CODECS: "${r}" (current SB count ${this.sourceBufferCount})`
          );
          let s =
              ('audiovideo' in e && (i.audio || i.video)) ||
              (i.audiovideo && ('audio' in e || 'video' in e)),
            a =
              !s &&
              this.sourceBufferCount &&
              this.media &&
              r.some((n) => !i[n]);
          if (s || a) {
            this.warn(
              `Unsupported transition between "${Object.keys(
                i
              )}" and "${r}" SourceBuffers`
            );
            return;
          }
          r.forEach((n) => {
            var l, o;
            let {
                id: d,
                codec: u,
                levelCodec: c,
                container: f,
                metadata: g,
                supplemental: E,
              } = e[n],
              m = i[n],
              y =
                (l = this.transferData) == null || (l = l.tracks) == null
                  ? void 0
                  : l[n],
              S = y != null && y.buffer ? y : m,
              T = S?.pendingCodec || S?.codec,
              A = S?.levelCodec;
            m ||
              (m = i[n] =
                {
                  buffer: void 0,
                  listeners: [],
                  codec: u,
                  supplemental: E,
                  container: f,
                  levelCodec: c,
                  metadata: g,
                  id: d,
                });
            let R = ti(T, A),
              I = R?.replace(La, '$1'),
              v = ti(u, c),
              _ = (o = v) == null ? void 0 : o.replace(La, '$1');
            v &&
              R &&
              I !== _ &&
              (n.slice(0, 5) === 'audio' && (v = Je(v, this.appendSource)),
              this.log(`switching codec ${T} to ${v}`),
              v !== (m.pendingCodec || m.codec) && (m.pendingCodec = v),
              (m.container = f),
              this.appendChangeType(n, f, v));
          }),
            (this.tracksReady || this.sourceBufferCount) &&
              (e.tracks = this.sourceBufferTracks),
            !this.sourceBufferCount &&
              this.mediaSourceOpenOrEnded &&
              this.checkPendingTracks();
        }
        get sourceBufferTracks() {
          return Object.keys(this.tracks).reduce((t, e) => {
            let i = this.tracks[e];
            return (
              (t[e] = {
                id: i.id,
                container: i.container,
                codec: i.codec,
                levelCodec: i.levelCodec,
              }),
              t
            );
          }, {});
        }
        appendChangeType(t, e, i) {
          let r = `${e};codecs=${i}`,
            s = {
              label: `change-type=${r}`,
              execute: () => {
                let a = this.tracks[t];
                if (a) {
                  let n = a.buffer;
                  n != null &&
                    n.changeType &&
                    (this.log(`changing ${t} sourceBuffer type to ${r}`),
                    n.changeType(r),
                    (a.codec = i),
                    (a.container = e));
                }
                this.shiftAndExecuteNext(t);
              },
              onStart: () => {},
              onComplete: () => {},
              onError: (a) => {
                this.warn(`Failed to change ${t} SourceBuffer type`, a);
              },
            };
          this.append(s, t, this.isPending(this.tracks[t]));
        }
        blockAudio(t) {
          var e;
          let i = t.start,
            r = i + 0.05 * t.duration;
          if (
            ((e = this.fragmentTracker.getAppendedFrag(i, j.MAIN)) == null
              ? void 0
              : e.gap) === !0
          )
            return;
          let s = {
            label: 'block-audio',
            execute: () => {
              var a;
              let n = this.tracks.video;
              (this.lastVideoAppendEnd > r ||
                (n != null && n.buffer && rt.isBuffered(n.buffer, r)) ||
                ((a = this.fragmentTracker.getAppendedFrag(r, j.MAIN)) == null
                  ? void 0
                  : a.gap) === !0) &&
                ((this.blockedAudioAppend = null),
                this.shiftAndExecuteNext('audio'));
            },
            onStart: () => {},
            onComplete: () => {},
            onError: (a) => {
              this.warn('Error executing block-audio operation', a);
            },
          };
          (this.blockedAudioAppend = { op: s, frag: t }),
            this.append(s, 'audio', !0);
        }
        unblockAudio() {
          let { blockedAudioAppend: t, operationQueue: e } = this;
          t && e && ((this.blockedAudioAppend = null), e.unblockAudio(t.op));
        }
        onBufferAppending(t, e) {
          let { tracks: i } = this,
            {
              data: r,
              type: s,
              parent: a,
              frag: n,
              part: l,
              chunkMeta: o,
              offset: d,
            } = e,
            u = o.buffering[s],
            { sn: c, cc: f } = n,
            g = F.performance.now();
          u.start = g;
          let E = n.stats.buffering,
            m = l ? l.stats.buffering : null;
          E.start === 0 && (E.start = g), m && m.start === 0 && (m.start = g);
          let y = i.audio,
            S = !1;
          s === 'audio' &&
            y?.container === 'audio/mpeg' &&
            ((S =
              !this.lastMpegAudioChunk ||
              o.id === 1 ||
              this.lastMpegAudioChunk.sn !== o.sn),
            (this.lastMpegAudioChunk = o));
          let T = i.video,
            A = T?.buffer;
          if (A && c !== 'initSegment') {
            let v = l || n,
              _ = this.blockedAudioAppend;
            if (
              s !== 'audio' ||
              a === 'main' ||
              this.blockedAudioAppend ||
              T.ending ||
              T.ended
            ) {
              if (s === 'video') {
                let L = v.end;
                if (_) {
                  let C = _.frag.start;
                  (L > C ||
                    L < this.lastVideoAppendEnd ||
                    rt.isBuffered(A, C)) &&
                    this.unblockAudio();
                }
                this.lastVideoAppendEnd = L;
              }
            } else {
              let L = v.start + 0.05 * v.duration,
                C = A.buffered,
                M = this.currentOp('video');
              ((C.length || M) &&
                (M || rt.isBuffered(A, L) || !(this.lastVideoAppendEnd < L))) ||
                this.blockAudio(v);
            }
          }
          let R = (l || n).start,
            I = {
              label: `append-${s}`,
              execute: () => {
                var v;
                u.executeStart = F.performance.now();
                let _ = (v = this.tracks[s]) == null ? void 0 : v.buffer;
                _ &&
                  (S
                    ? this.updateTimestampOffset(_, R, 0.1, s, c, f)
                    : d !== void 0 &&
                      Y(d) &&
                      this.updateTimestampOffset(_, d, 1e-6, s, c, f)),
                  this.appendExecutor(r, s);
              },
              onStart: () => {},
              onComplete: () => {
                let v = F.performance.now();
                (u.executeEnd = u.end = v),
                  E.first === 0 && (E.first = v),
                  m && m.first === 0 && (m.first = v);
                let _ = {};
                this.sourceBuffers.forEach(([L, C]) => {
                  L && (_[L] = rt.getBuffered(C));
                }),
                  (this.appendErrors[s] = 0),
                  s === 'audio' || s === 'video'
                    ? (this.appendErrors.audiovideo = 0)
                    : ((this.appendErrors.audio = 0),
                      (this.appendErrors.video = 0)),
                  this.hls.trigger(p.BUFFER_APPENDED, {
                    type: s,
                    frag: n,
                    part: l,
                    chunkMeta: o,
                    parent: n.type,
                    timeRanges: _,
                  });
              },
              onError: (v) => {
                var _;
                let L = {
                    type: Q.MEDIA_ERROR,
                    parent: n.type,
                    details: b.BUFFER_APPEND_ERROR,
                    sourceBufferName: s,
                    frag: n,
                    part: l,
                    chunkMeta: o,
                    error: v,
                    err: v,
                    fatal: !1,
                  },
                  C = (_ = this.media) == null ? void 0 : _.error;
                if (
                  v.code === DOMException.QUOTA_EXCEEDED_ERR ||
                  v.name == 'QuotaExceededError' ||
                  'quota' in v
                )
                  L.details = b.BUFFER_FULL_ERROR;
                else if (
                  v.code === DOMException.INVALID_STATE_ERR &&
                  this.mediaSourceOpenOrEnded &&
                  !C
                )
                  L.errorAction = Le(!0);
                else if (v.name === Ia && this.sourceBufferCount === 0)
                  L.errorAction = Le(!0);
                else {
                  let M = ++this.appendErrors[s];
                  this.warn(
                    `Failed ${M}/${
                      this.hls.config.appendErrorMaxRetry
                    } times to append segment in "${s}" sourceBuffer (${
                      C || 'no media error'
                    })`
                  ),
                    (M >= this.hls.config.appendErrorMaxRetry || C) &&
                      (L.fatal = !0);
                }
                this.hls.trigger(p.ERROR, L);
              },
            };
          this.append(I, s, this.isPending(this.tracks[s]));
        }
        getFlushOp(t, e, i) {
          return (
            this.log(`queuing "${t}" remove ${e}-${i}`),
            {
              label: 'remove',
              execute: () => {
                this.removeExecutor(t, e, i);
              },
              onStart: () => {},
              onComplete: () => {
                this.hls.trigger(p.BUFFER_FLUSHED, { type: t });
              },
              onError: (r) => {
                this.warn(
                  `Failed to remove ${e}-${i} from "${t}" SourceBuffer`,
                  r
                );
              },
            }
          );
        }
        onBufferFlushing(t, e) {
          let { type: i, startOffset: r, endOffset: s } = e;
          i
            ? this.append(this.getFlushOp(i, r, s), i)
            : this.sourceBuffers.forEach(([a]) => {
                a && this.append(this.getFlushOp(a, r, s), a);
              });
        }
        onFragParsed(t, e) {
          let { frag: i, part: r } = e,
            s = [],
            a = r ? r.elementaryStreams : i.elementaryStreams;
          a[mt.AUDIOVIDEO]
            ? s.push('audiovideo')
            : (a[mt.AUDIO] && s.push('audio'), a[mt.VIDEO] && s.push('video')),
            s.length === 0 &&
              this.warn(
                `Fragments must have at least one ElementaryStreamType set. type: ${i.type} level: ${i.level} sn: ${i.sn}`
              ),
            this.blockBuffers(() => {
              let n = F.performance.now();
              (i.stats.buffering.end = n), r && (r.stats.buffering.end = n);
              let l = r ? r.stats : i.stats;
              this.hls.trigger(p.FRAG_BUFFERED, {
                frag: i,
                part: r,
                stats: l,
                id: i.type,
              });
            }, s).catch((n) => {
              this.warn(`Fragment buffered callback ${n}`),
                this.stepOperationQueue(this.sourceBufferTypes);
            });
        }
        onFragChanged(t, e) {
          this.trimBuffers();
        }
        get bufferedToEnd() {
          return (
            this.sourceBufferCount > 0 &&
            !this.sourceBuffers.some(([t]) => {
              if (t) {
                let e = this.tracks[t];
                if (e) return !e.ended || e.ending;
              }
              return !1;
            })
          );
        }
        onBufferEos(t, e) {
          var i;
          this.sourceBuffers.forEach(([s]) => {
            if (s) {
              let a = this.tracks[s];
              (e.type && e.type !== s) ||
                ((a.ending = !0),
                a.ended ||
                  ((a.ended = !0), this.log(`${s} buffer reached EOS`)));
            }
          });
          let r =
            ((i = this.overrides) == null ? void 0 : i.endOfStream) !== !1;
          this.sourceBufferCount > 0 &&
          !this.sourceBuffers.some(([s]) => {
            var a;
            return s && !((a = this.tracks[s]) != null && a.ended);
          })
            ? r
              ? (this.log('Queueing EOS'),
                this.blockUntilOpen(() => {
                  this.tracksEnded();
                  let { mediaSource: s } = this;
                  if (!s || s.readyState !== 'open') {
                    s &&
                      this.log(
                        `Could not call mediaSource.endOfStream(). mediaSource.readyState: ${s.readyState}`
                      );
                    return;
                  }
                  this.log('Calling mediaSource.endOfStream()'),
                    s.endOfStream(),
                    this.hls.trigger(p.BUFFERED_TO_END, void 0);
                }))
              : (this.tracksEnded(),
                this.hls.trigger(p.BUFFERED_TO_END, void 0))
            : e.type === 'video' && this.unblockAudio();
        }
        tracksEnded() {
          this.sourceBuffers.forEach(([t]) => {
            if (t !== null) {
              let e = this.tracks[t];
              e && (e.ending = !1);
            }
          });
        }
        onLevelUpdated(t, { details: e }) {
          e.fragments.length && ((this.details = e), this.updateDuration());
        }
        updateDuration() {
          this.blockUntilOpen(() => {
            let t = this.getDurationAndRange();
            t && this.updateMediaSource(t);
          });
        }
        onError(t, e) {
          if (e.details === b.BUFFER_APPEND_ERROR && e.frag) {
            var i;
            let r = (i = e.errorAction) == null ? void 0 : i.nextAutoLevel;
            Y(r) && r !== e.frag.level && this.resetAppendErrors();
          }
        }
        resetAppendErrors() {
          this.appendErrors = { audio: 0, video: 0, audiovideo: 0 };
        }
        trimBuffers() {
          let { hls: t, details: e, media: i } = this;
          if (!i || e === null || !this.sourceBufferCount) return;
          let r = t.config,
            s = i.currentTime,
            a = e.levelTargetDuration,
            n =
              e.live && r.liveBackBufferLength !== null
                ? r.liveBackBufferLength
                : r.backBufferLength;
          if (Y(n) && n >= 0) {
            let o = Math.max(n, a);
            this.flushBackBuffer(s, a, Math.floor(s / a) * a - o);
          }
          let l = r.frontBufferFlushThreshold;
          if (Y(l) && l > 0) {
            let o = Math.max(Math.max(r.maxBufferLength, l), a);
            this.flushFrontBuffer(s, a, Math.floor(s / a) * a + o);
          }
        }
        flushBackBuffer(t, e, i) {
          this.sourceBuffers.forEach(([r, s]) => {
            if (s) {
              let n = rt.getBuffered(s);
              if (n.length > 0 && i > n.start(0)) {
                var a;
                this.hls.trigger(p.BACK_BUFFER_REACHED, { bufferEnd: i });
                let l = this.tracks[r];
                if ((a = this.details) != null && a.live)
                  this.hls.trigger(p.LIVE_BACK_BUFFER_REACHED, {
                    bufferEnd: i,
                  });
                else if (l != null && l.ended) {
                  this.log(
                    `Cannot flush ${r} back buffer while SourceBuffer is in ended state`
                  );
                  return;
                }
                this.hls.trigger(p.BUFFER_FLUSHING, {
                  startOffset: 0,
                  endOffset: i,
                  type: r,
                });
              }
            }
          });
        }
        flushFrontBuffer(t, e, i) {
          this.sourceBuffers.forEach(([r, s]) => {
            if (s) {
              let a = rt.getBuffered(s),
                n = a.length;
              if (n < 2) return;
              let l = a.start(n - 1),
                o = a.end(n - 1);
              i > l ||
                (t >= l && t <= o) ||
                this.hls.trigger(p.BUFFER_FLUSHING, {
                  startOffset: l,
                  endOffset: 1 / 0,
                  type: r,
                });
            }
          });
        }
        getDurationAndRange() {
          var t;
          let { details: e, mediaSource: i } = this;
          if (!e || !this.media || i?.readyState !== 'open') return null;
          let r = e.edge;
          if (e.live && this.hls.config.liveDurationInfinity) {
            if (e.fragments.length && i.setLiveSeekableRange) {
              let n = Math.max(0, e.fragmentStart),
                l = Math.max(n, r);
              return { duration: 1 / 0, start: n, end: l };
            }
            return { duration: 1 / 0 };
          }
          let s = (t = this.overrides) == null ? void 0 : t.duration;
          if (s) return Y(s) ? { duration: s } : null;
          let a = this.media.duration;
          return (r > (Y(i.duration) ? i.duration : 0) && r > a) || !Y(a)
            ? { duration: r }
            : null;
        }
        updateMediaSource({ duration: t, start: e, end: i }) {
          let r = this.mediaSource;
          this.media &&
            r &&
            r.readyState === 'open' &&
            (r.duration !== t &&
              (Y(t) &&
                this.log(`Updating MediaSource duration to ${t.toFixed(3)}`),
              (r.duration = t)),
            e !== void 0 &&
              i !== void 0 &&
              (this.log(
                `MediaSource duration is set to ${r.duration}. Setting seekable range to ${e}-${i}.`
              ),
              r.setLiveSeekableRange(e, i)));
        }
        get tracksReady() {
          let t = this.pendingTrackCount;
          return (
            t > 0 &&
            (t >= this.bufferCodecEventsTotal ||
              this.isPending(this.tracks.audiovideo))
          );
        }
        checkPendingTracks() {
          let {
            bufferCodecEventsTotal: t,
            pendingTrackCount: e,
            tracks: i,
          } = this;
          if (
            (this.log(
              `checkPendingTracks (pending: ${e} codec events expected: ${t}) ${yt(
                i
              )}`
            ),
            this.tracksReady)
          ) {
            var r;
            let s = (r = this.transferData) == null ? void 0 : r.tracks;
            s && Object.keys(s).length
              ? this.attachTransferred()
              : this.createSourceBuffers();
          }
        }
        bufferCreated() {
          if (this.sourceBufferCount) {
            let t = {};
            this.sourceBuffers.forEach(([e, i]) => {
              if (e) {
                let r = this.tracks[e];
                t[e] = {
                  buffer: i,
                  container: r.container,
                  codec: r.codec,
                  supplemental: r.supplemental,
                  levelCodec: r.levelCodec,
                  id: r.id,
                  metadata: r.metadata,
                };
              }
            }),
              this.hls.trigger(p.BUFFER_CREATED, { tracks: t }),
              this.log(
                `SourceBuffers created. Running queue: ${this.operationQueue}`
              ),
              this.sourceBuffers.forEach(([e]) => {
                this.executeNext(e);
              });
          } else {
            let t = Error('could not create source buffer for media codec(s)');
            this.hls.trigger(p.ERROR, {
              type: Q.MEDIA_ERROR,
              details: b.BUFFER_INCOMPATIBLE_CODECS_ERROR,
              fatal: !0,
              error: t,
              reason: t.message,
            });
          }
        }
        createSourceBuffers() {
          let { tracks: t, sourceBuffers: e, mediaSource: i } = this;
          if (!i)
            throw Error('createSourceBuffers called when mediaSource was null');
          for (let s in t) {
            let a = t[s];
            if (this.isPending(a)) {
              let n = this.getTrackCodec(a, s),
                l = `${a.container};codecs=${n}`;
              (a.codec = n),
                this.log(
                  `creating sourceBuffer(${l})${
                    this.currentOp(s) ? ' Queued' : ''
                  } ${yt(a)}`
                );
              try {
                let o = i.addSourceBuffer(l),
                  d = yr(s),
                  u = [s, o];
                (e[d] = u), (a.buffer = o);
              } catch (o) {
                var r;
                this.error(
                  `error while trying to add sourceBuffer: ${o.message}`
                ),
                  this.shiftAndExecuteNext(s),
                  (r = this.operationQueue) == null || r.removeBlockers(),
                  delete this.tracks[s],
                  this.hls.trigger(p.ERROR, {
                    type: Q.MEDIA_ERROR,
                    details: b.BUFFER_ADD_CODEC_ERROR,
                    fatal: !1,
                    error: o,
                    sourceBufferName: s,
                    mimeType: l,
                    parent: a.id,
                  });
                return;
              }
              this.trackSourceBuffer(s, a);
            }
          }
          this.bufferCreated();
        }
        getTrackCodec(t, e) {
          let i = t.supplemental,
            r = t.codec;
          i &&
            (e === 'video' || e === 'audiovideo') &&
            Ni(i, 'video') &&
            (r = (function (a, n) {
              let l = [];
              if (a) {
                let o = a.split(',');
                for (let d = 0; d < o.length; d++)
                  Fi(o[d], 'video') || l.push(o[d]);
              }
              return n && l.push(n), l.join(',');
            })(r, i));
          let s = ti(r, t.levelCodec);
          return s
            ? e.slice(0, 5) === 'audio'
              ? Je(s, this.appendSource)
              : s
            : '';
        }
        trackSourceBuffer(t, e) {
          let i = e.buffer;
          if (!i) return;
          let r = this.getTrackCodec(e, t);
          (this.tracks[t] = {
            buffer: i,
            codec: r,
            container: e.container,
            levelCodec: e.levelCodec,
            supplemental: e.supplemental,
            metadata: e.metadata,
            id: e.id,
            listeners: [],
          }),
            this.removeBufferListeners(t),
            this.addBufferListener(t, 'updatestart', this.onSBUpdateStart),
            this.addBufferListener(t, 'updateend', this.onSBUpdateEnd),
            this.addBufferListener(t, 'error', this.onSBUpdateError),
            this.appendSource &&
              this.addBufferListener(t, 'bufferedchange', (s, a) => {
                let n = a.removedRanges;
                n != null &&
                  n.length &&
                  this.hls.trigger(p.BUFFER_FLUSHED, { type: s });
              });
        }
        get mediaSrc() {
          var t, e;
          let i =
            ((t = this.media) == null || (e = t.querySelector) == null
              ? void 0
              : e.call(t, 'source')) || this.media;
          return i?.src;
        }
        onSBUpdateStart(t) {
          let e = this.currentOp(t);
          e && e.onStart();
        }
        onSBUpdateEnd(t) {
          var e;
          if (
            ((e = this.mediaSource) == null ? void 0 : e.readyState) ===
            'closed'
          ) {
            this.resetBuffer(t);
            return;
          }
          let i = this.currentOp(t);
          i && (i.onComplete(), this.shiftAndExecuteNext(t));
        }
        onSBUpdateError(t, e) {
          var i;
          let r = Error(
            `${t} SourceBuffer error. MediaSource readyState: ${
              (i = this.mediaSource) == null ? void 0 : i.readyState
            }`
          );
          this.error(`${r}`, e),
            this.hls.trigger(p.ERROR, {
              type: Q.MEDIA_ERROR,
              details: b.BUFFER_APPENDING_ERROR,
              sourceBufferName: t,
              error: r,
              fatal: !1,
            });
          let s = this.currentOp(t);
          s && s.onError(r);
        }
        updateTimestampOffset(t, e, i, r, s, a) {
          Math.abs(e - t.timestampOffset) >= i &&
            (this.log(
              `Updating ${r} SourceBuffer timestampOffset to ${e} (sn: ${s} cc: ${a})`
            ),
            (t.timestampOffset = e));
        }
        removeExecutor(t, e, i) {
          let { media: r, mediaSource: s } = this,
            a = this.tracks[t],
            n = a?.buffer;
          if (!r || !s || !n) {
            this.warn(
              `Attempting to remove from the ${t} SourceBuffer, but it does not exist`
            ),
              this.shiftAndExecuteNext(t);
            return;
          }
          let l = Y(r.duration) ? r.duration : 1 / 0,
            o = Y(s.duration) ? s.duration : 1 / 0,
            d = Math.max(0, e),
            u = Math.min(i, l, o);
          u > d && (!a.ending || a.ended)
            ? ((a.ended = !1),
              this.log(`Removing [${d},${u}] from the ${t} SourceBuffer`),
              n.remove(d, u))
            : this.shiftAndExecuteNext(t);
        }
        appendExecutor(t, e) {
          let i = this.tracks[e],
            r = i?.buffer;
          if (!r)
            throw new tl(
              `Attempting to append to the ${e} SourceBuffer, but it does not exist`
            );
          (i.ending = !1), (i.ended = !1), r.appendBuffer(t);
        }
        blockUntilOpen(t) {
          if (this.isUpdating() || this.isQueued())
            this.blockBuffers(t).catch((e) => {
              this.warn(`SourceBuffer blocked callback ${e}`),
                this.stepOperationQueue(this.sourceBufferTypes);
            });
          else
            try {
              t();
            } catch (e) {
              this.warn(
                `Callback run without blocking ${this.operationQueue} ${e}`
              );
            }
        }
        isUpdating() {
          return this.sourceBuffers.some(([t, e]) => t && e.updating);
        }
        isQueued() {
          return this.sourceBuffers.some(([t]) => t && !!this.currentOp(t));
        }
        isPending(t) {
          return !!t && !t.buffer;
        }
        blockBuffers(t, e = this.sourceBufferTypes) {
          if (!e.length)
            return (
              this.log(
                'Blocking operation requested, but no SourceBuffers exist'
              ),
              Promise.resolve().then(t)
            );
          let { operationQueue: i } = this,
            r = e.map((s) => this.appendBlocker(s));
          return (
            e.length > 1 && this.blockedAudioAppend && this.unblockAudio(),
            Promise.all(r).then((s) => {
              i === this.operationQueue &&
                (t(), this.stepOperationQueue(this.sourceBufferTypes));
            })
          );
        }
        stepOperationQueue(t) {
          t.forEach((e) => {
            var i;
            let r = (i = this.tracks[e]) == null ? void 0 : i.buffer;
            r && !r.updating && this.shiftAndExecuteNext(e);
          });
        }
        append(t, e, i) {
          this.operationQueue && this.operationQueue.append(t, e, i);
        }
        appendBlocker(t) {
          if (this.operationQueue) return this.operationQueue.appendBlocker(t);
        }
        currentOp(t) {
          return this.operationQueue ? this.operationQueue.current(t) : null;
        }
        executeNext(t) {
          t && this.operationQueue && this.operationQueue.executeNext(t);
        }
        shiftAndExecuteNext(t) {
          this.operationQueue && this.operationQueue.shiftAndExecuteNext(t);
        }
        get pendingTrackCount() {
          return Object.keys(this.tracks).reduce(
            (t, e) => t + (this.isPending(this.tracks[e]) ? 1 : 0),
            0
          );
        }
        get sourceBufferCount() {
          return this.sourceBuffers.reduce((t, [e]) => t + (e ? 1 : 0), 0);
        }
        get sourceBufferTypes() {
          return this.sourceBuffers.map(([t]) => t).filter((t) => !!t);
        }
        addBufferListener(t, e, i) {
          let r = this.tracks[t];
          if (!r) return;
          let s = r.buffer;
          if (!s) return;
          let a = i.bind(this, t);
          r.listeners.push({ event: e, listener: a }), s.addEventListener(e, a);
        }
        removeBufferListeners(t) {
          let e = this.tracks[t];
          if (!e) return;
          let i = e.buffer;
          i &&
            (e.listeners.forEach((r) => {
              i.removeEventListener(r.event, r.listener);
            }),
            (e.listeners.length = 0));
        }
      }
      function Ra(h) {
        let t = h.querySelectorAll('source');
        [].slice.call(t).forEach((e) => {
          h.removeChild(e);
        });
      }
      function yr(h) {
        return h === 'audio' ? 1 : 0;
      }
      class vr {
        constructor(t) {
          (this.hls = void 0),
            (this.autoLevelCapping = void 0),
            (this.firstLevel = void 0),
            (this.media = void 0),
            (this.restrictedLevels = void 0),
            (this.timer = void 0),
            (this.clientRect = void 0),
            (this.streamController = void 0),
            (this.hls = t),
            (this.autoLevelCapping = Number.POSITIVE_INFINITY),
            (this.firstLevel = -1),
            (this.media = null),
            (this.restrictedLevels = []),
            (this.timer = void 0),
            (this.clientRect = null),
            this.registerListeners();
        }
        setStreamController(t) {
          this.streamController = t;
        }
        destroy() {
          this.hls && this.unregisterListener(),
            this.timer && this.stopCapping(),
            (this.media = null),
            (this.clientRect = null),
            (this.hls = this.streamController = null);
        }
        registerListeners() {
          let { hls: t } = this;
          t.on(p.FPS_DROP_LEVEL_CAPPING, this.onFpsDropLevelCapping, this),
            t.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.on(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.on(p.BUFFER_CODECS, this.onBufferCodecs, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this);
        }
        unregisterListener() {
          let { hls: t } = this;
          t.off(p.FPS_DROP_LEVEL_CAPPING, this.onFpsDropLevelCapping, this),
            t.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.off(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.off(p.BUFFER_CODECS, this.onBufferCodecs, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this);
        }
        onFpsDropLevelCapping(t, e) {
          let i = this.hls.levels[e.droppedLevel];
          this.isLevelAllowed(i) &&
            this.restrictedLevels.push({
              bitrate: i.bitrate,
              height: i.height,
              width: i.width,
            });
        }
        onMediaAttaching(t, e) {
          (this.media = e.media instanceof HTMLVideoElement ? e.media : null),
            (this.clientRect = null),
            this.timer && this.hls.levels.length && this.detectPlayerSize();
        }
        onManifestParsed(t, e) {
          let i = this.hls;
          (this.restrictedLevels = []),
            (this.firstLevel = e.firstLevel),
            i.config.capLevelToPlayerSize && e.video && this.startCapping();
        }
        onLevelsUpdated(t, e) {
          this.timer && Y(this.autoLevelCapping) && this.detectPlayerSize();
        }
        onBufferCodecs(t, e) {
          this.hls.config.capLevelToPlayerSize &&
            e.video &&
            this.startCapping();
        }
        onMediaDetaching() {
          this.stopCapping(), (this.media = null);
        }
        detectPlayerSize() {
          if (this.media) {
            if (this.mediaHeight <= 0 || this.mediaWidth <= 0) {
              this.clientRect = null;
              return;
            }
            let t = this.hls.levels;
            if (t.length) {
              let e = this.hls,
                i = this.getMaxLevel(t.length - 1);
              i !== this.autoLevelCapping &&
                e.logger.log(
                  `Setting autoLevelCapping to ${i}: ${t[i].height}p@${t[i].bitrate} for media ${this.mediaWidth}x${this.mediaHeight}`
                ),
                (e.autoLevelCapping = i),
                e.autoLevelEnabled &&
                  e.autoLevelCapping > this.autoLevelCapping &&
                  this.streamController &&
                  this.streamController.nextLevelSwitch(),
                (this.autoLevelCapping = e.autoLevelCapping);
            }
          }
        }
        getMaxLevel(t) {
          let e = this.hls.levels;
          if (!e.length) return -1;
          let i = e.filter((r, s) => this.isLevelAllowed(r) && s <= t);
          return (
            (this.clientRect = null),
            vr.getMaxLevelByMediaSize(i, this.mediaWidth, this.mediaHeight)
          );
        }
        startCapping() {
          this.timer ||
            ((this.autoLevelCapping = Number.POSITIVE_INFINITY),
            F.clearInterval(this.timer),
            (this.timer = F.setInterval(this.detectPlayerSize.bind(this), 1e3)),
            this.detectPlayerSize());
        }
        stopCapping() {
          (this.restrictedLevels = []),
            (this.firstLevel = -1),
            (this.autoLevelCapping = Number.POSITIVE_INFINITY),
            this.timer && (F.clearInterval(this.timer), (this.timer = void 0));
        }
        getDimensions() {
          if (this.clientRect) return this.clientRect;
          let t = this.media,
            e = { width: 0, height: 0 };
          if (t) {
            let i = t.getBoundingClientRect();
            (e.width = i.width),
              (e.height = i.height),
              e.width ||
                e.height ||
                ((e.width = i.right - i.left || t.width || 0),
                (e.height = i.bottom - i.top || t.height || 0));
          }
          return (this.clientRect = e), e;
        }
        get mediaWidth() {
          return this.getDimensions().width * this.contentScaleFactor;
        }
        get mediaHeight() {
          return this.getDimensions().height * this.contentScaleFactor;
        }
        get contentScaleFactor() {
          let t = 1;
          if (!this.hls.config.ignoreDevicePixelRatio)
            try {
              t = F.devicePixelRatio;
            } catch {}
          return Math.min(t, this.hls.config.maxDevicePixelRatio);
        }
        isLevelAllowed(t) {
          return !this.restrictedLevels.some(
            (e) =>
              t.bitrate === e.bitrate &&
              t.width === e.width &&
              t.height === e.height
          );
        }
        static getMaxLevelByMediaSize(t, e, i) {
          if (!(t != null && t.length)) return -1;
          let r = (n, l) => !l || n.width !== l.width || n.height !== l.height,
            s = t.length - 1,
            a = Math.max(e, i);
          for (let n = 0; n < t.length; n += 1) {
            let l = t[n];
            if ((l.width >= a || l.height >= a) && r(l, t[n + 1])) {
              s = n;
              break;
            }
          }
          return s;
        }
      }
      let $t = {
          MANIFEST: 'm',
          AUDIO: 'a',
          VIDEO: 'v',
          MUXED: 'av',
          INIT: 'i',
          TIMED_TEXT: 'tt',
        },
        il = { HLS: 'h' };
      class ie {
        constructor(t, e) {
          Array.isArray(t) &&
            (t = t.map((i) => (i instanceof ie ? i : new ie(i)))),
            (this.value = t),
            (this.params = e);
        }
      }
      function re(h, t, e) {
        return Error(
          `failed to serialize "${
            Array.isArray(h)
              ? JSON.stringify(h)
              : h instanceof Map
              ? 'Map{}'
              : h instanceof Set
              ? 'Set{}'
              : typeof h == 'object'
              ? JSON.stringify(h)
              : String(h)
          }" as ${t}`,
          { cause: e }
        );
      }
      class ba {
        constructor(t) {
          this.description = t;
        }
      }
      let Da = 'Bare Item';
      function ka(h) {
        if (h < -999999999999999 || 999999999999999 < h) throw re(h, 'Integer');
        return h.toString();
      }
      let rl = /[\x00-\x1f\x7f]+/;
      function Pa(h) {
        let t = h.description || h.toString().slice(7, -1);
        if (/^([a-zA-Z*])([!#$%&'*+\-.^_`|~\w:/]*)$/.test(t) === !1)
          throw re(t, 'Token');
        return t;
      }
      function Tr(h) {
        switch (typeof h) {
          case 'number':
            if (!Y(h)) throw re(h, Da);
            return Number.isInteger(h)
              ? ka(h)
              : (function (t) {
                  let e = (function r(s, a) {
                    if (s < 0) return -r(-s, a);
                    let n = Math.pow(10, a);
                    if (!(Math.abs(((s * n) % 1) - 0.5) < Number.EPSILON))
                      return Math.round(s * n) / n;
                    {
                      let l = Math.floor(s * n);
                      return (l % 2 == 0 ? l : l + 1) / n;
                    }
                  })(t, 3);
                  if (Math.floor(Math.abs(e)).toString().length > 12)
                    throw re(t, 'Decimal');
                  let i = e.toString();
                  return i.includes('.') ? i : `${i}.0`;
                })(h);
          case 'string':
            return (function (t) {
              if (rl.test(t)) throw re(t, 'String');
              return `"${t.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
            })(h);
          case 'symbol':
            return Pa(h);
          case 'boolean':
            return (function (t) {
              if (typeof t != 'boolean') throw re(t, 'Boolean');
              return t ? '?1' : '?0';
            })(h);
          case 'object':
            if (h instanceof Date) return `@${ka(h.getTime() / 1e3)}`;
            if (h instanceof Uint8Array)
              return (function (t) {
                if (ArrayBuffer.isView(t) === !1) throw re(t, 'Byte Sequence');
                return `:${btoa(String.fromCharCode(...t))}:`;
              })(h);
            if (h instanceof ba) return Pa(h);
          default:
            throw re(h, Da);
        }
      }
      function Sr(h) {
        if (/^[a-z*][a-z0-9\-_.*]*$/.test(h) === !1) throw re(h, 'Key');
        return h;
      }
      function Ar(h) {
        return h == null
          ? ''
          : Object.entries(h)
              .map(([t, e]) => (e === !0 ? `;${Sr(t)}` : `;${Sr(t)}=${Tr(e)}`))
              .join('');
      }
      function _a(h) {
        return h instanceof ie ? `${Tr(h.value)}${Ar(h.params)}` : Tr(h);
      }
      function Ca(h, t) {
        return (function (e, i = { whitespace: !0 }) {
          if (typeof e != 'object' || e == null) throw re(e, 'Dict');
          let r = e instanceof Map ? e.entries() : Object.entries(e),
            s = i?.whitespace ? ' ' : '';
          return Array.from(r)
            .map(([a, n]) => {
              !(n instanceof ie) && (n = new ie(n));
              let l = Sr(a);
              if (n.value === !0) l += Ar(n.params);
              else if (((l += '='), Array.isArray(n.value))) {
                var o;
                l += ((o = n), `(${o.value.map(_a).join(' ')})${Ar(o.params)}`);
              } else l += _a(n);
              return l;
            })
            .join(`,${s}`);
        })(h, t);
      }
      let se = 'CMCD-Object',
        kt = 'CMCD-Request',
        Ee = 'CMCD-Session',
        ue = 'CMCD-Status',
        sl = {
          br: se,
          ab: se,
          d: se,
          ot: se,
          tb: se,
          tpb: se,
          lb: se,
          tab: se,
          lab: se,
          url: se,
          pb: kt,
          bl: kt,
          tbl: kt,
          dl: kt,
          ltc: kt,
          mtp: kt,
          nor: kt,
          nrr: kt,
          rc: kt,
          sn: kt,
          sta: kt,
          su: kt,
          ttfb: kt,
          ttfbb: kt,
          ttlb: kt,
          cmsdd: kt,
          cmsds: kt,
          smrt: kt,
          df: kt,
          cs: kt,
          ts: kt,
          cid: Ee,
          pr: Ee,
          sf: Ee,
          sid: Ee,
          st: Ee,
          v: Ee,
          msd: Ee,
          bs: ue,
          bsd: ue,
          cdn: ue,
          rtp: ue,
          bg: ue,
          pt: ue,
          ec: ue,
          e: ue,
        },
        al = { REQUEST: kt },
        Oa = 'event',
        vi = (h) => Math.round(h),
        Lr = (h, t) =>
          Array.isArray(h)
            ? h.map((e) => Lr(e, t))
            : h instanceof ie && typeof h.value == 'string'
            ? new ie(Lr(h.value, t), h.params)
            : (t.baseUrl &&
                (h = (function (e, i) {
                  let r = new URL(e),
                    s = new URL(i);
                  if (r.origin !== s.origin) return e;
                  let a = r.pathname.split('/').slice(1),
                    n = s.pathname.split('/').slice(1, -1);
                  for (; a[0] === n[0]; ) a.shift(), n.shift();
                  for (; n.length; ) n.shift(), a.unshift('..');
                  return a.join('/') + r.search + r.hash;
                })(h, t.baseUrl)),
              t.version === 1 ? encodeURIComponent(h) : h),
        Ti = (h) => 100 * vi(h / 100),
        nl = {
          br: vi,
          d: vi,
          bl: Ti,
          dl: Ti,
          mtp: Ti,
          nor: (h, t) => {
            let e = h;
            return (
              t.version >= 2 &&
                (h instanceof ie && typeof h.value == 'string'
                  ? (e = new ie([h]))
                  : typeof h == 'string' && (e = [h])),
              Lr(e, t)
            );
          },
          rtp: Ti,
          tb: vi,
        },
        wa = 'request',
        xa = 'response',
        Ir = [
          'ab',
          'bg',
          'bl',
          'br',
          'bs',
          'bsd',
          'cdn',
          'cid',
          'cs',
          'df',
          'ec',
          'lab',
          'lb',
          'ltc',
          'msd',
          'mtp',
          'pb',
          'pr',
          'pt',
          'sf',
          'sid',
          'sn',
          'st',
          'sta',
          'tab',
          'tb',
          'tbl',
          'tpb',
          'ts',
          'v',
        ],
        ll = ['e'],
        ol = /^[a-zA-Z0-9-.]+-[a-zA-Z0-9-.]+$/;
      function Si(h) {
        return ol.test(h);
      }
      let Ma = ['d', 'dl', 'nor', 'ot', 'rtp', 'su'],
        hl = ['cmsdd', 'cmsds', 'rc', 'smrt', 'ttfb', 'ttfbb', 'ttlb', 'url'],
        dl = [
          'bl',
          'br',
          'bs',
          'cid',
          'd',
          'dl',
          'mtp',
          'nor',
          'nrr',
          'ot',
          'pr',
          'rtp',
          'sf',
          'sid',
          'st',
          'su',
          'tb',
          'v',
        ];
      function ul(h) {
        return dl.includes(h) || Si(h);
      }
      let cl = {
        [xa]: function (h) {
          return Ir.includes(h) || Ma.includes(h) || hl.includes(h) || Si(h);
        },
        [Oa]: function (h) {
          return Ir.includes(h) || ll.includes(h) || Si(h);
        },
        [wa]: function (h) {
          return Ir.includes(h) || Ma.includes(h) || Si(h);
        },
      };
      function Fa(h, t = {}) {
        let e = {};
        if (h == null || typeof h != 'object') return e;
        let i = t.version || h.v || 1,
          r = t.reportingMode || wa,
          s = i === 1 ? ul : cl[r],
          a = Object.keys(h).filter(s),
          n = t.filter;
        typeof n == 'function' && (a = a.filter(n));
        let l = r === xa || r === Oa;
        l && !a.includes('ts') && a.push('ts'),
          i > 1 && !a.includes('v') && a.push('v');
        let o = at({}, nl, t.formatters),
          d = { version: i, reportingMode: r, baseUrl: t.baseUrl };
        return (
          a.sort().forEach((u) => {
            var c;
            let f = h[u],
              g = o[u];
            if ((typeof g == 'function' && (f = g(f, d)), u === 'v')) {
              if (i === 1) return;
              f = i;
            }
            (u != 'pr' || f !== 1) &&
              (l && u === 'ts' && !Y(f) && (f = Date.now()),
              (typeof (c = f) == 'number'
                ? Y(c)
                : c != null && c !== '' && c !== !1) &&
                (['ot', 'sf', 'st', 'e', 'sta'].includes(u) &&
                  typeof f == 'string' &&
                  (f = new ba(f)),
                (e[u] = f)));
          }),
          e
        );
      }
      let Na = /CMCD=[^&#]+/;
      class fl {
        constructor(t) {
          (this.hls = void 0),
            (this.config = void 0),
            (this.media = void 0),
            (this.sid = void 0),
            (this.cid = void 0),
            (this.useHeaders = !1),
            (this.includeKeys = void 0),
            (this.initialized = !1),
            (this.starved = !1),
            (this.buffering = !0),
            (this.audioBuffer = void 0),
            (this.videoBuffer = void 0),
            (this.onWaiting = () => {
              this.initialized && (this.starved = !0), (this.buffering = !0);
            }),
            (this.onPlaying = () => {
              this.initialized || (this.initialized = !0),
                (this.buffering = !1);
            }),
            (this.applyPlaylistData = (r) => {
              try {
                this.apply(r, { ot: $t.MANIFEST, su: !this.initialized });
              } catch (s) {
                this.hls.logger.warn(
                  'Could not generate manifest CMCD data.',
                  s
                );
              }
            }),
            (this.applyFragmentData = (r) => {
              try {
                let { frag: s, part: a } = r,
                  n = this.hls.levels[s.level],
                  l = this.getObjectType(s),
                  o = { d: 1e3 * (a || s).duration, ot: l };
                (l === $t.VIDEO || l === $t.AUDIO || l == $t.MUXED) &&
                  ((o.br = n.bitrate / 1e3),
                  (o.tb = this.getTopBandwidth(l) / 1e3),
                  (o.bl = this.getBufferLength(l)));
                let d = a ? this.getNextPart(a) : this.getNextFrag(s);
                d != null && d.url && d.url !== s.url && (o.nor = d.url),
                  this.apply(r, o);
              } catch (s) {
                this.hls.logger.warn(
                  'Could not generate segment CMCD data.',
                  s
                );
              }
            }),
            (this.hls = t);
          let e = (this.config = t.config),
            { cmcd: i } = e;
          i != null &&
            ((e.pLoader = this.createPlaylistLoader()),
            (e.fLoader = this.createFragmentLoader()),
            (this.sid = i.sessionId || t.sessionId),
            (this.cid = i.contentId),
            (this.useHeaders = i.useHeaders === !0),
            (this.includeKeys = i.includeKeys),
            this.registerListeners());
        }
        registerListeners() {
          let t = this.hls;
          t.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.on(p.MEDIA_DETACHED, this.onMediaDetached, this),
            t.on(p.BUFFER_CREATED, this.onBufferCreated, this);
        }
        unregisterListeners() {
          let t = this.hls;
          t.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.off(p.MEDIA_DETACHED, this.onMediaDetached, this),
            t.off(p.BUFFER_CREATED, this.onBufferCreated, this);
        }
        destroy() {
          this.unregisterListeners(),
            this.onMediaDetached(),
            (this.hls =
              this.config =
              this.audioBuffer =
              this.videoBuffer =
                null),
            (this.onWaiting = this.onPlaying = this.media = null);
        }
        onMediaAttached(t, e) {
          (this.media = e.media),
            this.media.addEventListener('waiting', this.onWaiting),
            this.media.addEventListener('playing', this.onPlaying);
        }
        onMediaDetached() {
          this.media &&
            (this.media.removeEventListener('waiting', this.onWaiting),
            this.media.removeEventListener('playing', this.onPlaying),
            (this.media = null));
        }
        onBufferCreated(t, e) {
          var i, r;
          (this.audioBuffer = (i = e.tracks.audio) == null ? void 0 : i.buffer),
            (this.videoBuffer =
              (r = e.tracks.video) == null ? void 0 : r.buffer);
        }
        createData() {
          var t;
          return {
            v: 1,
            sf: il.HLS,
            sid: this.sid,
            cid: this.cid,
            pr: (t = this.media) == null ? void 0 : t.playbackRate,
            mtp: this.hls.bandwidthEstimate / 1e3,
          };
        }
        apply(t, e = {}) {
          at(e, this.createData());
          let i = e.ot === $t.INIT || e.ot === $t.VIDEO || e.ot === $t.MUXED;
          this.starved && i && ((e.bs = !0), (e.su = !0), (this.starved = !1)),
            e.su == null && (e.su = this.buffering);
          let { includeKeys: r } = this;
          r &&
            (e = Object.keys(e).reduce(
              (n, l) => (r.includes(l) && (n[l] = e[l]), n),
              {}
            ));
          let s = { baseUrl: t.url };
          if (this.useHeaders) {
            var a;
            t.headers || (t.headers = {}),
              (a = t.headers),
              at(
                a,
                (function (n, l = {}) {
                  let o = {};
                  return n
                    ? Object.entries(
                        (function (d, u) {
                          let c = {};
                          if (!d) return c;
                          let f = Object.keys(d),
                            g = u
                              ? Object.keys(u).reduce((E, m) => {
                                  var y;
                                  return (
                                    (y = u[m]) === null ||
                                      y === void 0 ||
                                      y.forEach((S) => (E[S] = m)),
                                    E
                                  );
                                }, {})
                              : {};
                          return f.reduce((E, m) => {
                            var y;
                            let S = sl[m] || g[m] || al.REQUEST;
                            return (
                              (((y = E[S]) !== null && y !== void 0
                                ? y
                                : (E[S] = {}))[m] = d[m]),
                              E
                            );
                          }, c);
                        })(Fa(n, l), l?.customHeaderMap)
                      ).reduce((d, [u, c]) => {
                        let f = Ca(c, { whitespace: !1 });
                        return f && (d[u] = f), d;
                      }, o)
                    : o;
                })(e, s)
              );
          } else
            t.url = (function (n, l, o) {
              let d = (function (c, f = {}) {
                return c
                  ? `CMCD=${(function (E, m = {}) {
                      return E
                        ? encodeURIComponent(
                            (function (y, S = {}) {
                              return y ? Ca(Fa(y, S), { whitespace: !1 }) : '';
                            })(E, m)
                          )
                        : '';
                    })(c, f)}`
                  : '';
              })(l, o);
              if (!d) return n;
              if (Na.test(n)) return n.replace(Na, d);
              let u = n.includes('?') ? '&' : '?';
              return `${n}${u}${d}`;
            })(t.url, e, s);
        }
        getNextFrag(t) {
          var e;
          let i = (e = this.hls.levels[t.level]) == null ? void 0 : e.details;
          if (i) {
            let r = t.sn - i.startSN;
            return i.fragments[r + 1];
          }
        }
        getNextPart(t) {
          var e;
          let { index: i, fragment: r } = t,
            s =
              (e = this.hls.levels[r.level]) == null || (e = e.details) == null
                ? void 0
                : e.partList;
          if (s) {
            let { sn: a } = r;
            for (let n = s.length - 1; n >= 0; n--) {
              let l = s[n];
              if (l.index === i && l.fragment.sn === a) return s[n + 1];
            }
          }
        }
        getObjectType(t) {
          let { type: e } = t;
          return e === 'subtitle'
            ? $t.TIMED_TEXT
            : t.sn === 'initSegment'
            ? $t.INIT
            : e === 'audio'
            ? $t.AUDIO
            : e === 'main'
            ? this.hls.audioTracks.length
              ? $t.VIDEO
              : $t.MUXED
            : void 0;
        }
        getTopBandwidth(t) {
          let e,
            i = 0,
            r = this.hls;
          if (t === $t.AUDIO) e = r.audioTracks;
          else {
            let s = r.maxAutoLevel,
              a = s > -1 ? s + 1 : r.levels.length;
            e = r.levels.slice(0, a);
          }
          return (
            e.forEach((s) => {
              s.bitrate > i && (i = s.bitrate);
            }),
            i > 0 ? i : NaN
          );
        }
        getBufferLength(t) {
          let e = this.media,
            i = t === $t.AUDIO ? this.audioBuffer : this.videoBuffer;
          return i && e
            ? 1e3 *
                rt.bufferInfo(i, e.currentTime, this.config.maxBufferHole).len
            : NaN;
        }
        createPlaylistLoader() {
          let { pLoader: t } = this.config,
            e = this.applyPlaylistData,
            i = t || this.config.loader;
          return class {
            constructor(r) {
              (this.loader = void 0), (this.loader = new i(r));
            }
            get stats() {
              return this.loader.stats;
            }
            get context() {
              return this.loader.context;
            }
            destroy() {
              this.loader.destroy();
            }
            abort() {
              this.loader.abort();
            }
            load(r, s, a) {
              e(r), this.loader.load(r, s, a);
            }
          };
        }
        createFragmentLoader() {
          let { fLoader: t } = this.config,
            e = this.applyFragmentData,
            i = t || this.config.loader;
          return class {
            constructor(r) {
              (this.loader = void 0), (this.loader = new i(r));
            }
            get stats() {
              return this.loader.stats;
            }
            get context() {
              return this.loader.context;
            }
            destroy() {
              this.loader.destroy();
            }
            abort() {
              this.loader.abort();
            }
            load(r, s, a) {
              e(r), this.loader.load(r, s, a);
            }
          };
        }
      }
      class gl extends it {
        constructor(t) {
          super('content-steering', t.logger),
            (this.hls = void 0),
            (this.loader = null),
            (this.uri = null),
            (this.pathwayId = '.'),
            (this._pathwayPriority = null),
            (this.timeToLoad = 300),
            (this.reloadTimer = -1),
            (this.updated = 0),
            (this.started = !1),
            (this.enabled = !0),
            (this.levels = null),
            (this.audioTracks = null),
            (this.subtitleTracks = null),
            (this.penalizedPathways = {}),
            (this.hls = t),
            this.registerListeners();
        }
        registerListeners() {
          let t = this.hls;
          t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.on(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.on(p.ERROR, this.onError, this);
        }
        unregisterListeners() {
          let t = this.hls;
          t &&
            (t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.off(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.off(p.ERROR, this.onError, this));
        }
        pathways() {
          return (this.levels || []).reduce(
            (t, e) => (t.indexOf(e.pathwayId) === -1 && t.push(e.pathwayId), t),
            []
          );
        }
        get pathwayPriority() {
          return this._pathwayPriority;
        }
        set pathwayPriority(t) {
          this.updatePathwayPriority(t);
        }
        startLoad() {
          if (
            ((this.started = !0), this.clearTimeout(), this.enabled && this.uri)
          ) {
            if (this.updated) {
              let t =
                1e3 * this.timeToLoad - (performance.now() - this.updated);
              if (t > 0) {
                this.scheduleRefresh(this.uri, t);
                return;
              }
            }
            this.loadSteeringManifest(this.uri);
          }
        }
        stopLoad() {
          (this.started = !1),
            this.loader && (this.loader.destroy(), (this.loader = null)),
            this.clearTimeout();
        }
        clearTimeout() {
          this.reloadTimer !== -1 &&
            (F.clearTimeout(this.reloadTimer), (this.reloadTimer = -1));
        }
        destroy() {
          this.unregisterListeners(),
            this.stopLoad(),
            (this.hls = null),
            (this.levels = this.audioTracks = this.subtitleTracks = null);
        }
        removeLevel(t) {
          let e = this.levels;
          e && (this.levels = e.filter((i) => i !== t));
        }
        onManifestLoading() {
          this.stopLoad(),
            (this.enabled = !0),
            (this.timeToLoad = 300),
            (this.updated = 0),
            (this.uri = null),
            (this.pathwayId = '.'),
            (this.levels = this.audioTracks = this.subtitleTracks = null);
        }
        onManifestLoaded(t, e) {
          let { contentSteering: i } = e;
          i !== null &&
            ((this.pathwayId = i.pathwayId),
            (this.uri = i.uri),
            this.started && this.startLoad());
        }
        onManifestParsed(t, e) {
          (this.audioTracks = e.audioTracks),
            (this.subtitleTracks = e.subtitleTracks);
        }
        onError(t, e) {
          let { errorAction: i } = e;
          if (
            i?.action === Ft.SendAlternateToPenaltyBox &&
            i.flags === Kt.MoveAllAlternatesMatchingHost
          ) {
            let r = this.levels,
              s = this._pathwayPriority,
              a = this.pathwayId;
            if (e.context) {
              let { groupId: n, pathwayId: l, type: o } = e.context;
              n && r ? (a = this.getPathwayForGroupId(n, o, a)) : l && (a = l);
            }
            a in this.penalizedPathways ||
              (this.penalizedPathways[a] = performance.now()),
              !s && r && (s = this.pathways()),
              s &&
                s.length > 1 &&
                (this.updatePathwayPriority(s),
                (i.resolved = this.pathwayId !== a)),
              e.details !== b.BUFFER_APPEND_ERROR || e.fatal
                ? i.resolved ||
                  this.warn(
                    `Could not resolve ${e.details} ("${
                      e.error.message
                    }") with content-steering for Pathway: ${a} levels: ${
                      r && r.length
                    } priorities: ${yt(s)} penalized: ${yt(
                      this.penalizedPathways
                    )}`
                  )
                : (i.resolved = !0);
          }
        }
        filterParsedLevels(t) {
          this.levels = t;
          let e = this.getLevelsForPathway(this.pathwayId);
          if (e.length === 0) {
            let i = t[0].pathwayId;
            this.log(
              `No levels found in Pathway ${this.pathwayId}. Setting initial Pathway to "${i}"`
            ),
              (e = this.getLevelsForPathway(i)),
              (this.pathwayId = i);
          }
          return (
            e.length !== t.length &&
              this.log(
                `Found ${e.length}/${t.length} levels in Pathway "${this.pathwayId}"`
              ),
            e
          );
        }
        getLevelsForPathway(t) {
          return this.levels === null
            ? []
            : this.levels.filter((e) => t === e.pathwayId);
        }
        updatePathwayPriority(t) {
          let e;
          this._pathwayPriority = t;
          let i = this.penalizedPathways,
            r = performance.now();
          Object.keys(i).forEach((s) => {
            r - i[s] > 3e5 && delete i[s];
          });
          for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (a in i) continue;
            if (a === this.pathwayId) return;
            let n = this.hls.nextLoadLevel,
              l = this.hls.levels[n];
            if ((e = this.getLevelsForPathway(a)).length > 0) {
              this.log(`Setting Pathway to "${a}"`),
                (this.pathwayId = a),
                Ws(e),
                this.hls.trigger(p.LEVELS_UPDATED, { levels: e });
              let o = this.hls.levels[n];
              l &&
                o &&
                this.levels &&
                (o.attrs['STABLE-VARIANT-ID'] !==
                  l.attrs['STABLE-VARIANT-ID'] &&
                  o.bitrate !== l.bitrate &&
                  this.log(
                    `Unstable Pathways change from bitrate ${l.bitrate} to ${o.bitrate}`
                  ),
                (this.hls.nextLoadLevel = n));
              break;
            }
          }
        }
        getPathwayForGroupId(t, e, i) {
          let r = this.getLevelsForPathway(i).concat(this.levels || []);
          for (let s = 0; s < r.length; s++)
            if (
              (e === lt.AUDIO_TRACK && r[s].hasAudioGroup(t)) ||
              (e === lt.SUBTITLE_TRACK && r[s].hasSubtitleGroup(t))
            )
              return r[s].pathwayId;
          return i;
        }
        clonePathways(t) {
          let e = this.levels;
          if (!e) return;
          let i = {},
            r = {};
          t.forEach((s) => {
            let { ID: a, 'BASE-ID': n, 'URI-REPLACEMENT': l } = s;
            if (e.some((d) => d.pathwayId === a)) return;
            let o = this.getLevelsForPathway(n).map((d) => {
              let u = new Lt(d.attrs);
              u['PATHWAY-ID'] = a;
              let c = u.AUDIO && `${u.AUDIO}_clone_${a}`,
                f = u.SUBTITLES && `${u.SUBTITLES}_clone_${a}`;
              c && ((i[u.AUDIO] = c), (u.AUDIO = c)),
                f && ((r[u.SUBTITLES] = f), (u.SUBTITLES = f));
              let g = Ba(d.uri, u['STABLE-VARIANT-ID'], 'PER-VARIANT-URIS', l),
                E = new Me({
                  attrs: u,
                  audioCodec: d.audioCodec,
                  bitrate: d.bitrate,
                  height: d.height,
                  name: d.name,
                  url: g,
                  videoCodec: d.videoCodec,
                  width: d.width,
                });
              if (d.audioGroups)
                for (let m = 1; m < d.audioGroups.length; m++)
                  E.addGroupId('audio', `${d.audioGroups[m]}_clone_${a}`);
              if (d.subtitleGroups)
                for (let m = 1; m < d.subtitleGroups.length; m++)
                  E.addGroupId('text', `${d.subtitleGroups[m]}_clone_${a}`);
              return E;
            });
            e.push(...o),
              Ua(this.audioTracks, i, l, a),
              Ua(this.subtitleTracks, r, l, a);
          });
        }
        loadSteeringManifest(t) {
          let e,
            i = this.hls.config,
            r = i.loader;
          this.loader && this.loader.destroy(), (this.loader = new r(i));
          try {
            e = new F.URL(t);
          } catch {
            (this.enabled = !1),
              this.log(`Failed to parse Steering Manifest URI: ${t}`);
            return;
          }
          if (e.protocol !== 'data:') {
            let o =
              0 | (this.hls.bandwidthEstimate || i.abrEwmaDefaultEstimate);
            e.searchParams.set('_HLS_pathway', this.pathwayId),
              e.searchParams.set('_HLS_throughput', '' + o);
          }
          let s = { responseType: 'json', url: e.href },
            a = i.steeringManifestLoadPolicy.default,
            n = a.errorRetry || a.timeoutRetry || {},
            l = {
              loadPolicy: a,
              timeout: a.maxLoadTimeMs,
              maxRetry: n.maxNumRetry || 0,
              retryDelay: n.retryDelayMs || 0,
              maxRetryDelay: n.maxRetryDelayMs || 0,
            };
          this.log(`Requesting steering manifest: ${e}`),
            this.loader.load(s, l, {
              onSuccess: (o, d, u, c) => {
                this.log(`Loaded steering manifest: "${e}"`);
                let f = o.data;
                if (f?.VERSION !== 1) {
                  this.log(`Steering VERSION ${f.VERSION} not supported!`);
                  return;
                }
                (this.updated = performance.now()), (this.timeToLoad = f.TTL);
                let {
                  'RELOAD-URI': g,
                  'PATHWAY-CLONES': E,
                  'PATHWAY-PRIORITY': m,
                } = f;
                if (g)
                  try {
                    this.uri = new F.URL(g, e).href;
                  } catch {
                    (this.enabled = !1),
                      this.log(
                        `Failed to parse Steering Manifest RELOAD-URI: ${g}`
                      );
                    return;
                  }
                this.scheduleRefresh(this.uri || u.url),
                  E && this.clonePathways(E);
                let y = { steeringManifest: f, url: e.toString() };
                this.hls.trigger(p.STEERING_MANIFEST_LOADED, y),
                  m && this.updatePathwayPriority(m);
              },
              onError: (o, d, u, c) => {
                if (
                  (this.log(
                    `Error loading steering manifest: ${o.code} ${o.text} (${d.url})`
                  ),
                  this.stopLoad(),
                  o.code === 410)
                ) {
                  (this.enabled = !1),
                    this.log(`Steering manifest ${d.url} no longer available`);
                  return;
                }
                let f = 1e3 * this.timeToLoad;
                if (o.code === 429) {
                  let g = this.loader;
                  if (typeof g?.getResponseHeader == 'function') {
                    let E = g.getResponseHeader('Retry-After');
                    E && (f = 1e3 * parseFloat(E));
                  }
                  this.log(`Steering manifest ${d.url} rate limited`);
                  return;
                }
                this.scheduleRefresh(this.uri || d.url, f);
              },
              onTimeout: (o, d, u) => {
                this.log(`Timeout loading steering manifest (${d.url})`),
                  this.scheduleRefresh(this.uri || d.url);
              },
            });
        }
        scheduleRefresh(t, e = 1e3 * this.timeToLoad) {
          this.clearTimeout(),
            (this.reloadTimer = F.setTimeout(() => {
              var i;
              let r = (i = this.hls) == null ? void 0 : i.media;
              if (r && !r.ended) {
                this.loadSteeringManifest(t);
                return;
              }
              this.scheduleRefresh(t, 1e3 * this.timeToLoad);
            }, e));
        }
      }
      function Ua(h, t, e, i) {
        h &&
          Object.keys(t).forEach((r) => {
            let s = h
              .filter((a) => a.groupId === r)
              .map((a) => {
                let n = at({}, a);
                return (
                  (n.details = void 0),
                  (n.attrs = new Lt(n.attrs)),
                  (n.url = n.attrs.URI =
                    Ba(
                      a.url,
                      a.attrs['STABLE-RENDITION-ID'],
                      'PER-RENDITION-URIS',
                      e
                    )),
                  (n.groupId = n.attrs['GROUP-ID'] = t[r]),
                  (n.attrs['PATHWAY-ID'] = i),
                  n
                );
              });
            h.push(...s);
          });
      }
      function Ba(h, t, e, i) {
        let r,
          { HOST: s, PARAMS: a, [e]: n } = i;
        t && (r = n?.[t]) && (h = r);
        let l = new F.URL(h);
        return (
          s && !r && (l.host = s),
          a &&
            Object.keys(a)
              .sort()
              .forEach((o) => {
                o && l.searchParams.set(o, a[o]);
              }),
          l.href
        );
      }
      class Pe extends it {
        constructor(t) {
          super('eme', t.logger),
            (this.hls = void 0),
            (this.config = void 0),
            (this.media = null),
            (this.keyFormatPromise = null),
            (this.keySystemAccessPromises = {}),
            (this._requestLicenseFailureCount = 0),
            (this.mediaKeySessions = []),
            (this.keyIdToKeySessionPromise = {}),
            (this.mediaKeys = null),
            (this.setMediaKeysQueue = Pe.CDMCleanupPromise
              ? [Pe.CDMCleanupPromise]
              : []),
            (this.bannedKeyIds = {}),
            (this.onMediaEncrypted = (e) => {
              let { initDataType: i, initData: r } = e,
                s = `"${e.type}" event: init data type: "${i}"`;
              if ((this.debug(s), r !== null)) {
                if (!this.keyFormatPromise) {
                  let a = Object.keys(this.keySystemAccessPromises);
                  a.length || (a = Fe(this.config));
                  let n = a.map(Qi).filter((l) => !!l);
                  this.keyFormatPromise = this.getKeyFormatPromise(n);
                }
                this.keyFormatPromise
                  .then((a) => {
                    let n,
                      l = hi(a);
                    if (i !== 'sinf' || l !== Dt.FAIRPLAY) {
                      this.log(
                        `Ignoring "${e.type}" event with init data type: "${i}" for selected key-system ${l}`
                      );
                      return;
                    }
                    try {
                      let f = wt(new Uint8Array(r)),
                        g = Xi(JSON.parse(f).sinf),
                        E = zr(g);
                      if (!E)
                        throw Error(
                          "'schm' box missing or not cbcs/cenc with schi > tenc"
                        );
                      n = new Uint8Array(E.subarray(8, 24));
                    } catch (f) {
                      this.warn(`${s} Failed to parse sinf: ${f}`);
                      return;
                    }
                    let o = Ot(n),
                      { keyIdToKeySessionPromise: d, mediaKeySessions: u } =
                        this,
                      c = d[o];
                    for (let f = 0; f < u.length; f++) {
                      let g = u[f],
                        E = g.decryptdata;
                      if (!E.keyId) continue;
                      let m = Ot(E.keyId);
                      if (
                        o === m ||
                        E.uri.replace(/-/g, '').indexOf(o) !== -1
                      ) {
                        if (!(c = d[m])) continue;
                        if (E.pssh) break;
                        delete d[m],
                          (E.pssh = new Uint8Array(r)),
                          (E.keyId = n),
                          (c = d[o] =
                            c.then(() =>
                              this.generateRequestWithPreferredKeySession(
                                g,
                                i,
                                r,
                                'encrypted-event-key-match'
                              )
                            )).catch((y) => this.handleError(y));
                        break;
                      }
                    }
                    c ||
                      this.handleError(
                        Error(
                          `Key ID ${o} not encountered in playlist. Key-system sessions ${u.length}.`
                        )
                      );
                  })
                  .catch((a) => this.handleError(a));
              }
            }),
            (this.onWaitingForKey = (e) => {
              this.log(`"${e.type}" event`);
            }),
            (this.hls = t),
            (this.config = t.config),
            this.registerListeners();
        }
        destroy() {
          this.onDestroying(), this.onMediaDetached();
          let t = this.config;
          (t.requestMediaKeySystemAccessFunc = null),
            (t.licenseXhrSetup = t.licenseResponseCallback = void 0),
            (t.drmSystems = t.drmSystemOptions = {}),
            (this.hls = this.config = this.keyIdToKeySessionPromise = null),
            (this.onMediaEncrypted = this.onWaitingForKey = null);
        }
        registerListeners() {
          this.hls.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            this.hls.on(p.MEDIA_DETACHED, this.onMediaDetached, this),
            this.hls.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            this.hls.on(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            this.hls.on(p.DESTROYING, this.onDestroying, this);
        }
        unregisterListeners() {
          this.hls.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            this.hls.off(p.MEDIA_DETACHED, this.onMediaDetached, this),
            this.hls.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            this.hls.off(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            this.hls.off(p.DESTROYING, this.onDestroying, this);
        }
        getLicenseServerUrl(t) {
          let { drmSystems: e, widevineLicenseUrl: i } = this.config,
            r = e?.[t];
          return r ? r.licenseUrl : t === Dt.WIDEVINE && i ? i : void 0;
        }
        getLicenseServerUrlOrThrow(t) {
          let e = this.getLicenseServerUrl(t);
          if (e === void 0)
            throw Error(
              `no license server URL configured for key-system "${t}"`
            );
          return e;
        }
        getServerCertificateUrl(t) {
          let { drmSystems: e } = this.config,
            i = e?.[t];
          if (i) return i.serverCertificateUrl;
          this.log(`No Server Certificate in config.drmSystems["${t}"]`);
        }
        attemptKeySystemAccess(t) {
          let e = this.hls.levels,
            i = (a, n, l) => !!a && l.indexOf(a) === n,
            r = e.map((a) => a.audioCodec).filter(i),
            s = e.map((a) => a.videoCodec).filter(i);
          return (
            r.length + s.length === 0 && s.push('avc1.42e01e'),
            new Promise((a, n) => {
              let l = (o) => {
                let d = o.shift();
                this.getMediaKeysPromise(d, r, s)
                  .then((u) => a({ keySystem: d, mediaKeys: u }))
                  .catch((u) => {
                    o.length
                      ? l(o)
                      : u instanceof Xt
                      ? n(u)
                      : n(
                          new Xt(
                            {
                              type: Q.KEY_SYSTEM_ERROR,
                              details: b.KEY_SYSTEM_NO_ACCESS,
                              error: u,
                              fatal: !0,
                            },
                            u.message
                          )
                        );
                  });
              };
              l(t);
            })
          );
        }
        requestMediaKeySystemAccess(t, e) {
          let { requestMediaKeySystemAccessFunc: i } = this.config;
          if (typeof i != 'function') {
            let r = `Configured requestMediaKeySystemAccess is not a function ${i}`;
            return (
              ks === null &&
                F.location.protocol === 'http:' &&
                (r = `navigator.requestMediaKeySystemAccess is not available over insecure protocol ${location.protocol}`),
              Promise.reject(Error(r))
            );
          }
          return i(t, e);
        }
        getMediaKeysPromise(t, e, i) {
          var r;
          let s = (function (l, o, d, u) {
              let c;
              switch (l) {
                case Dt.FAIRPLAY:
                  c = ['cenc', 'sinf'];
                  break;
                case Dt.WIDEVINE:
                case Dt.PLAYREADY:
                  c = ['cenc'];
                  break;
                case Dt.CLEARKEY:
                  c = ['cenc', 'keyids'];
                  break;
                default:
                  throw Error(`Unknown key-system: ${l}`);
              }
              return [
                {
                  initDataTypes: c,
                  persistentState: u.persistentState || 'optional',
                  distinctiveIdentifier: u.distinctiveIdentifier || 'optional',
                  sessionTypes: u.sessionTypes || [
                    u.sessionType || 'temporary',
                  ],
                  audioCapabilities: o.map((f) => ({
                    contentType: `audio/mp4; codecs=${f}`,
                    robustness: u.audioRobustness || '',
                    encryptionScheme: u.audioEncryptionScheme || null,
                  })),
                  videoCapabilities: d.map((f) => ({
                    contentType: `video/mp4; codecs=${f}`,
                    robustness: u.videoRobustness || '',
                    encryptionScheme: u.videoEncryptionScheme || null,
                  })),
                },
              ];
            })(t, e, i, this.config.drmSystemOptions || {}),
            a = this.keySystemAccessPromises[t],
            n = (r = a) == null ? void 0 : r.keySystemAccess;
          if (!n) {
            this.log(
              `Requesting encrypted media "${t}" key-system access with config: ${yt(
                s
              )}`
            ),
              (n = this.requestMediaKeySystemAccess(t, s));
            let l =
              (a =
              this.keySystemAccessPromises[t] =
                { keySystemAccess: n });
            return (
              n.catch((o) => {
                this.log(`Failed to obtain access to key-system "${t}": ${o}`);
              }),
              n.then((o) => {
                this.log(`Access for key-system "${o.keySystem}" obtained`);
                let d = this.fetchServerCertificate(t);
                this.log(`Create media-keys for "${t}"`);
                let u = (l.mediaKeys = o
                  .createMediaKeys()
                  .then(
                    (c) => (
                      this.log(`Media-keys created for "${t}"`),
                      (l.hasMediaKeys = !0),
                      d.then((f) =>
                        f ? this.setMediaKeysServerCertificate(c, t, f) : c
                      )
                    )
                  ));
                return (
                  u.catch((c) => {
                    this.error(`Failed to create media-keys for "${t}"}: ${c}`);
                  }),
                  u
                );
              })
            );
          }
          return n.then(() => a.mediaKeys);
        }
        createMediaKeySessionContext({
          decryptdata: t,
          keySystem: e,
          mediaKeys: i,
        }) {
          this.log(
            `Creating key-system session "${e}" keyId: ${Ot(t.keyId || [])}`
          );
          let r = i.createSession(),
            s = {
              decryptdata: t,
              keySystem: e,
              mediaKeys: i,
              mediaKeysSession: r,
              keyStatus: 'status-pending',
            };
          return this.mediaKeySessions.push(s), s;
        }
        renewKeySession(t) {
          let e = t.decryptdata;
          if (e.pssh) {
            let i = this.createMediaKeySessionContext(t),
              r = this.getKeyIdString(e);
            this.keyIdToKeySessionPromise[r] =
              this.generateRequestWithPreferredKeySession(
                i,
                'cenc',
                e.pssh.buffer,
                'expired'
              );
          } else
            this.warn(
              'Could not renew expired session. Missing pssh initData.'
            );
          this.removeSession(t);
        }
        getKeyIdString(t) {
          if (!t) throw Error('Could not read keyId of undefined decryptdata');
          if (t.keyId === null) throw Error('keyId is null');
          return Ot(t.keyId);
        }
        updateKeySession(t, e) {
          let i = t.mediaKeysSession;
          return (
            this.log(`Updating key-session "${i.sessionId}" for keyId ${Ot(
              t.decryptdata.keyId || []
            )}
      } (data length: ${e.byteLength})`),
            i.update(e)
          );
        }
        getSelectedKeySystemFormats() {
          return Object.keys(this.keySystemAccessPromises)
            .map((t) => ({
              keySystem: t,
              hasMediaKeys: this.keySystemAccessPromises[t].hasMediaKeys,
            }))
            .filter(({ hasMediaKeys: t }) => !!t)
            .map(({ keySystem: t }) => Qi(t))
            .filter((t) => !!t);
        }
        getKeySystemAccess(t) {
          return this.getKeySystemSelectionPromise(t).then(
            ({ keySystem: e, mediaKeys: i }) => this.attemptSetMediaKeys(e, i)
          );
        }
        selectKeySystem(t) {
          return new Promise((e, i) => {
            this.getKeySystemSelectionPromise(t)
              .then(({ keySystem: r }) => {
                let s = Qi(r);
                s
                  ? e(s)
                  : i(Error(`Unable to find format for key-system "${r}"`));
              })
              .catch(i);
          });
        }
        selectKeySystemFormat(t) {
          let e = Object.keys(t.levelkeys || {});
          return (
            this.keyFormatPromise ||
              (this.log(
                `Selecting key-system from fragment (sn: ${t.sn} ${t.type}: ${
                  t.level
                }) key formats ${e.join(', ')}`
              ),
              (this.keyFormatPromise = this.getKeyFormatPromise(e))),
            this.keyFormatPromise
          );
        }
        getKeyFormatPromise(t) {
          let e = Fe(this.config),
            i = t.map(hi).filter((r) => !!r && e.indexOf(r) !== -1);
          return this.selectKeySystem(i);
        }
        loadKey(t) {
          let e = t.keyInfo.decryptdata,
            i = this.getKeyIdString(e),
            r = this.bannedKeyIds[i];
          if (r) {
            let n = $a(r, e);
            return this.handleError(n, t.frag), Promise.reject(n);
          }
          let s = `(keyId: ${i} format: "${e.keyFormat}" method: ${e.method} uri: ${e.uri})`;
          this.log(`Starting session for key ${s}`);
          let a = this.keyIdToKeySessionPromise[i];
          if (!a) {
            let n = this.getKeySystemForKeyPromise(e)
              .then(
                ({ keySystem: l, mediaKeys: o }) => (
                  this.throwIfDestroyed(),
                  this.log(
                    `Handle encrypted media sn: ${t.frag.sn} ${t.frag.type}: ${t.frag.level} using key ${s}`
                  ),
                  this.attemptSetMediaKeys(l, o).then(
                    () => (
                      this.throwIfDestroyed(),
                      this.createMediaKeySessionContext({
                        keySystem: l,
                        mediaKeys: o,
                        decryptdata: e,
                      })
                    )
                  )
                )
              )
              .then((l) => {
                let o = e.pssh ? e.pssh.buffer : null;
                return this.generateRequestWithPreferredKeySession(
                  l,
                  'cenc',
                  o,
                  'playlist-key'
                );
              });
            return (
              n.catch((l) => this.handleError(l, t.frag)),
              (this.keyIdToKeySessionPromise[i] = n),
              n
            );
          }
          return a;
        }
        throwIfDestroyed(t = 'Invalid state') {
          if (!this.hls) throw Error('invalid state');
        }
        handleError(t, e) {
          this.hls &&
            (this.error(t.message),
            t instanceof Xt
              ? (e && (t.data.frag = e), this.hls.trigger(p.ERROR, t.data))
              : this.hls.trigger(p.ERROR, {
                  type: Q.KEY_SYSTEM_ERROR,
                  details: b.KEY_SYSTEM_NO_KEYS,
                  error: t,
                  fatal: !0,
                }));
        }
        getKeySystemForKeyPromise(t) {
          let e = this.getKeyIdString(t),
            i = this.keyIdToKeySessionPromise[e];
          if (!i) {
            let r = hi(t.keyFormat),
              s = r ? [r] : Fe(this.config);
            return this.attemptKeySystemAccess(s);
          }
          return i;
        }
        getKeySystemSelectionPromise(t) {
          if ((t.length || (t = Fe(this.config)), t.length === 0))
            throw new Xt(
              {
                type: Q.KEY_SYSTEM_ERROR,
                details: b.KEY_SYSTEM_NO_CONFIGURED_LICENSE,
                fatal: !0,
              },
              `Missing key-system license configuration options ${yt({
                drmSystems: this.config.drmSystems,
              })}`
            );
          return this.attemptKeySystemAccess(t);
        }
        attemptSetMediaKeys(t, e) {
          if (this.mediaKeys === e) return Promise.resolve();
          let i = this.setMediaKeysQueue.slice();
          this.log(`Setting media-keys for "${t}"`);
          let r = Promise.all(i).then(() => {
            if (!this.media)
              throw (
                ((this.mediaKeys = null),
                Error(
                  'Attempted to set mediaKeys without media element attached'
                ))
              );
            return this.media.setMediaKeys(e);
          });
          return (
            (this.mediaKeys = e),
            this.setMediaKeysQueue.push(r),
            r.then(() => {
              this.log(`Media-keys set for "${t}"`),
                i.push(r),
                (this.setMediaKeysQueue = this.setMediaKeysQueue.filter(
                  (s) => i.indexOf(s) === -1
                ));
            })
          );
        }
        generateRequestWithPreferredKeySession(t, e, i, r) {
          var s;
          let a =
            (s = this.config.drmSystems) == null || (s = s[t.keySystem]) == null
              ? void 0
              : s.generateRequest;
          if (a)
            try {
              let c = a.call(this.hls, e, i, t);
              if (!c)
                throw Error(
                  'Invalid response from configured generateRequest filter'
                );
              (e = c.initDataType),
                (i = c.initData ? c.initData : null),
                (t.decryptdata.pssh = i ? new Uint8Array(i) : null);
            } catch (c) {
              if ((this.warn(c.message), this.hls && this.hls.config.debug))
                throw c;
            }
          if (i === null)
            return (
              this.log(`Skipping key-session request for "${r}" (no initData)`),
              Promise.resolve(t)
            );
          let n = this.getKeyIdString(t.decryptdata);
          this.log(
            `Generating key-session request for "${r}": ${n} (init data type: ${e} length: ${i.byteLength})`
          );
          let l = new rr(),
            o = (t._onmessage = (c) => {
              let f = t.mediaKeysSession;
              if (!f) {
                l.emit('error', Error('invalid state'));
                return;
              }
              let { messageType: g, message: E } = c;
              this.log(
                `"${g}" message event for session "${f.sessionId}" message size: ${E.byteLength}`
              ),
                g === 'license-request' || g === 'license-renewal'
                  ? this.renewLicense(t, E).catch((m) => {
                      l.eventNames().length
                        ? l.emit('error', m)
                        : this.handleError(m);
                    })
                  : g === 'license-release'
                  ? t.keySystem === Dt.FAIRPLAY &&
                    (this.updateKeySession(t, zi('acknowledged')),
                    this.removeSession(t))
                  : this.warn(`unhandled media key message type "${g}"`);
            }),
            d = (t._onkeystatuseschange = (c) => {
              if (!t.mediaKeysSession) {
                l.emit('error', Error('invalid state'));
                return;
              }
              let f = t.keyStatus;
              this.onKeyStatusChange(t);
              let g = t.keyStatus;
              g !== f &&
                (l.emit('keyStatus', g, t),
                g === 'expired' &&
                  (this.log(`${t.keySystem} expired for key ${n}`),
                  this.renewKeySession(t)));
            });
          Nt(t.mediaKeysSession, 'message', o),
            Nt(t.mediaKeysSession, 'keystatuseschange', d);
          let u = new Promise((c, f) => {
            l.on('error', f),
              l.on('keyStatus', (g, { decryptdata: E }) => {
                g.startsWith('usable')
                  ? c()
                  : g === 'internal-error' || g === 'output-restricted'
                  ? f($a(g, E))
                  : g === 'expired'
                  ? f(
                      Error(
                        `key expired while generating request (keyId: ${n})`
                      )
                    )
                  : this.warn(
                      `unhandled key status change "${g}" (keyId: ${n})`
                    );
              });
          });
          return t.mediaKeysSession
            .generateRequest(e, i)
            .then(() => {
              this.log(
                `Request generated for key-session "${t.mediaKeysSession.sessionId}" keyId: ${n}`
              );
            })
            .catch((c) => {
              throw new Xt(
                {
                  type: Q.KEY_SYSTEM_ERROR,
                  details: b.KEY_SYSTEM_NO_SESSION,
                  error: c,
                  decryptdata: t.decryptdata,
                  fatal: !1,
                },
                `Error generating key-session request: ${c}`
              );
            })
            .then(() => u)
            .catch((c) => {
              throw (l.removeAllListeners(), this.removeSession(t), c);
            })
            .then(() => (l.removeAllListeners(), t));
        }
        onKeyStatusChange(t) {
          let e = Ot(new Uint8Array(t.decryptdata.keyId || []));
          t.mediaKeysSession.keyStatuses.forEach((i, r) => {
            if (typeof r == 'string' && typeof i == 'object') {
              let n = r;
              (r = i), (i = n);
            }
            let s = Ot(
              'buffer' in r
                ? new Uint8Array(r.buffer, r.byteOffset, r.byteLength)
                : new Uint8Array(r)
            );
            i === 'internal-error' && (this.bannedKeyIds[s] = i);
            let a = s === e;
            this.log(
              `${
                a ? '' : 'un'
              }matched key status change "${i}" for keyStatuses keyId: ${s} session keyId: ${e} uri: ${
                t.decryptdata.uri
              }`
            ),
              a && (t.keyStatus = i);
          });
        }
        fetchServerCertificate(t) {
          let e = this.config,
            i = new e.loader(e),
            r = this.getServerCertificateUrl(t);
          return r
            ? (this.log(`Fetching server certificate for "${t}"`),
              new Promise((s, a) => {
                let n = { responseType: 'arraybuffer', url: r },
                  l = e.certLoadPolicy.default,
                  o = {
                    loadPolicy: l,
                    timeout: l.maxLoadTimeMs,
                    maxRetry: 0,
                    retryDelay: 0,
                    maxRetryDelay: 0,
                  };
                i.load(n, o, {
                  onSuccess: (d, u, c, f) => {
                    s(d.data);
                  },
                  onError: (d, u, c, f) => {
                    a(
                      new Xt(
                        {
                          type: Q.KEY_SYSTEM_ERROR,
                          details:
                            b.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,
                          fatal: !0,
                          networkDetails: c,
                          response: J({ url: n.url, data: void 0 }, d),
                        },
                        `"${t}" certificate request failed (${r}). Status: ${d.code} (${d.text})`
                      )
                    );
                  },
                  onTimeout: (d, u, c) => {
                    a(
                      new Xt(
                        {
                          type: Q.KEY_SYSTEM_ERROR,
                          details:
                            b.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,
                          fatal: !0,
                          networkDetails: c,
                          response: { url: n.url, data: void 0 },
                        },
                        `"${t}" certificate request timed out (${r})`
                      )
                    );
                  },
                  onAbort: (d, u, c) => {
                    a(Error('aborted'));
                  },
                });
              }))
            : Promise.resolve();
        }
        setMediaKeysServerCertificate(t, e, i) {
          return new Promise((r, s) => {
            t.setServerCertificate(i)
              .then((a) => {
                this.log(
                  `setServerCertificate ${
                    a ? 'success' : 'not supported by CDM'
                  } (${i.byteLength}) on "${e}"`
                ),
                  r(t);
              })
              .catch((a) => {
                s(
                  new Xt(
                    {
                      type: Q.KEY_SYSTEM_ERROR,
                      details: b.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED,
                      error: a,
                      fatal: !0,
                    },
                    a.message
                  )
                );
              });
          });
        }
        renewLicense(t, e) {
          return this.requestLicense(t, new Uint8Array(e)).then((i) =>
            this.updateKeySession(t, new Uint8Array(i)).catch((r) => {
              throw new Xt(
                {
                  type: Q.KEY_SYSTEM_ERROR,
                  details: b.KEY_SYSTEM_SESSION_UPDATE_FAILED,
                  decryptdata: t.decryptdata,
                  error: r,
                  fatal: !1,
                },
                r.message
              );
            })
          );
        }
        unpackPlayReadyKeyMessage(t, e) {
          let i = String.fromCharCode.apply(null, new Uint16Array(e.buffer));
          if (!i.includes('PlayReadyKeyMessage'))
            return (
              t.setRequestHeader('Content-Type', 'text/xml; charset=utf-8'), e
            );
          let r = new DOMParser().parseFromString(i, 'application/xml'),
            s = r.querySelectorAll('HttpHeader');
          if (s.length > 0) {
            let d;
            for (let u = 0, c = s.length; u < c; u++) {
              var a, n;
              let f =
                  (a = (d = s[u]).querySelector('name')) == null
                    ? void 0
                    : a.textContent,
                g =
                  (n = d.querySelector('value')) == null
                    ? void 0
                    : n.textContent;
              f && g && t.setRequestHeader(f, g);
            }
          }
          let l = r.querySelector('Challenge'),
            o = l?.textContent;
          if (!o) throw Error('Cannot find <Challenge> in key message');
          return zi(atob(o));
        }
        setupLicenseXHR(t, e, i, r) {
          let s = this.config.licenseXhrSetup;
          return s
            ? Promise.resolve()
                .then(() => {
                  if (!i.decryptdata) throw Error('Key removed');
                  return s.call(this.hls, t, e, i, r);
                })
                .catch((a) => {
                  if (!i.decryptdata) throw a;
                  return t.open('POST', e, !0), s.call(this.hls, t, e, i, r);
                })
                .then(
                  (a) => (
                    t.readyState || t.open('POST', e, !0),
                    { xhr: t, licenseChallenge: a || r }
                  )
                )
            : (t.open('POST', e, !0),
              Promise.resolve({ xhr: t, licenseChallenge: r }));
        }
        requestLicense(t, e) {
          let i = this.config.keyLoadPolicy.default;
          return new Promise((r, s) => {
            let a = this.getLicenseServerUrlOrThrow(t.keySystem);
            this.log(`Sending license request to URL: ${a}`);
            let n = new XMLHttpRequest();
            (n.responseType = 'arraybuffer'),
              (n.onreadystatechange = () => {
                if (!this.hls || !t.mediaKeysSession)
                  return s(Error('invalid state'));
                if (n.readyState === 4)
                  if (n.status === 200) {
                    this._requestLicenseFailureCount = 0;
                    let l = n.response;
                    this.log(
                      `License received ${
                        l instanceof ArrayBuffer ? l.byteLength : l
                      }`
                    );
                    let o = this.config.licenseResponseCallback;
                    if (o)
                      try {
                        l = o.call(this.hls, n, a, t);
                      } catch (d) {
                        this.error(d);
                      }
                    r(l);
                  } else {
                    let l = i.errorRetry,
                      o = l ? l.maxNumRetry : 0;
                    if (
                      (this._requestLicenseFailureCount++,
                      this._requestLicenseFailureCount > o ||
                        (n.status >= 400 && n.status < 500))
                    )
                      s(
                        new Xt(
                          {
                            type: Q.KEY_SYSTEM_ERROR,
                            details: b.KEY_SYSTEM_LICENSE_REQUEST_FAILED,
                            decryptdata: t.decryptdata,
                            fatal: !0,
                            networkDetails: n,
                            response: {
                              url: a,
                              data: void 0,
                              code: n.status,
                              text: n.statusText,
                            },
                          },
                          `License Request XHR failed (${a}). Status: ${n.status} (${n.statusText})`
                        )
                      );
                    else {
                      let d = o - this._requestLicenseFailureCount + 1;
                      this.warn(`Retrying license request, ${d} attempts left`),
                        this.requestLicense(t, e).then(r, s);
                    }
                  }
              }),
              t.licenseXhr &&
                t.licenseXhr.readyState !== XMLHttpRequest.DONE &&
                t.licenseXhr.abort(),
              (t.licenseXhr = n),
              this.setupLicenseXHR(n, a, t, e)
                .then(({ xhr: l, licenseChallenge: o }) => {
                  t.keySystem == Dt.PLAYREADY &&
                    (o = this.unpackPlayReadyKeyMessage(l, o)),
                    l.send(o);
                })
                .catch(s);
          });
        }
        onDestroying() {
          this.unregisterListeners(), this._clear();
        }
        onMediaAttached(t, e) {
          if (!this.config.emeEnabled) return;
          let i = e.media;
          (this.media = i),
            Nt(i, 'encrypted', this.onMediaEncrypted),
            Nt(i, 'waitingforkey', this.onWaitingForKey);
        }
        onMediaDetached() {
          let t = this.media;
          t &&
            (Bt(t, 'encrypted', this.onMediaEncrypted),
            Bt(t, 'waitingforkey', this.onWaitingForKey),
            (this.media = null),
            (this.mediaKeys = null));
        }
        _clear() {
          var t;
          if (
            ((this._requestLicenseFailureCount = 0),
            (this.keyIdToKeySessionPromise = {}),
            (this.bannedKeyIds = {}),
            !this.mediaKeys && !this.mediaKeySessions.length)
          )
            return;
          let e = this.media,
            i = this.mediaKeySessions.slice();
          (this.mediaKeySessions = []),
            (this.mediaKeys = null),
            ui.clearKeyUriToKeyIdMap();
          let r = i.length;
          Pe.CDMCleanupPromise = Promise.all(
            i
              .map((s) => this.removeSession(s))
              .concat(
                e == null || (t = e.setMediaKeys(null)) == null
                  ? void 0
                  : t.catch((s) => {
                      this.log(`Could not clear media keys: ${s}`),
                        this.hls &&
                          this.hls.trigger(p.ERROR, {
                            type: Q.OTHER_ERROR,
                            details: b.KEY_SYSTEM_DESTROY_MEDIA_KEYS_ERROR,
                            fatal: !1,
                            error: Error(`Could not clear media keys: ${s}`),
                          });
                    })
              )
          )
            .catch((s) => {
              this.log(`Could not close sessions and clear media keys: ${s}`),
                this.hls &&
                  this.hls.trigger(p.ERROR, {
                    type: Q.OTHER_ERROR,
                    details: b.KEY_SYSTEM_DESTROY_CLOSE_SESSION_ERROR,
                    fatal: !1,
                    error: Error(
                      `Could not close sessions and clear media keys: ${s}`
                    ),
                  });
            })
            .then(() => {
              r &&
                this.log(
                  'finished closing key sessions and clearing media keys'
                );
            });
        }
        onManifestLoading() {
          (this.keyFormatPromise = null), (this.bannedKeyIds = {});
        }
        onManifestLoaded(t, { sessionKeys: e }) {
          if (e && this.config.emeEnabled && !this.keyFormatPromise) {
            let i = e.reduce(
              (r, s) => (
                r.indexOf(s.keyFormat) === -1 && r.push(s.keyFormat), r
              ),
              []
            );
            this.log(`Selecting key-system from session-keys ${i.join(', ')}`),
              (this.keyFormatPromise = this.getKeyFormatPromise(i));
          }
        }
        removeSession(t) {
          let { mediaKeysSession: e, licenseXhr: i, decryptdata: r } = t;
          if (e) {
            var s;
            this.log(
              `Remove licenses and keys and close session "${
                e.sessionId
              }" keyId: ${Ot(r?.keyId || [])}`
            ),
              t._onmessage &&
                (e.removeEventListener('message', t._onmessage),
                (t._onmessage = void 0)),
              t._onkeystatuseschange &&
                (e.removeEventListener(
                  'keystatuseschange',
                  t._onkeystatuseschange
                ),
                (t._onkeystatuseschange = void 0)),
              i && i.readyState !== XMLHttpRequest.DONE && i.abort(),
              (t.mediaKeysSession = t.decryptdata = t.licenseXhr = void 0);
            let a = this.mediaKeySessions.indexOf(t);
            a > -1 && this.mediaKeySessions.splice(a, 1);
            let { drmSystemOptions: n } = this.config;
            return (
              n &&
              (n.sessionType === 'persistent-license' ||
                ((s = n.sessionTypes) != null &&
                  s.some((l) => l === 'persistent-license')))
                ? new Promise((l, o) => {
                    F.setTimeout(
                      () => o(Error('MediaKeySession.remove() timeout')),
                      8e3
                    ),
                      e.remove().then(l).catch(o);
                  })
                : Promise.resolve()
            )
              .catch((l) => {
                this.log(`Could not remove session: ${l}`),
                  this.hls &&
                    this.hls.trigger(p.ERROR, {
                      type: Q.OTHER_ERROR,
                      details: b.KEY_SYSTEM_DESTROY_REMOVE_SESSION_ERROR,
                      fatal: !1,
                      error: Error(`Could not remove session: ${l}`),
                    });
              })
              .then(() => e.close())
              .catch((l) => {
                this.log(`Could not close session: ${l}`),
                  this.hls &&
                    this.hls.trigger(p.ERROR, {
                      type: Q.OTHER_ERROR,
                      details: b.KEY_SYSTEM_DESTROY_CLOSE_SESSION_ERROR,
                      fatal: !1,
                      error: Error(`Could not close session: ${l}`),
                    });
              });
          }
        }
      }
      Pe.CDMCleanupPromise = void 0;
      class Xt extends Error {
        constructor(t, e) {
          super(e),
            (this.data = void 0),
            t.error || (t.error = Error(e)),
            (this.data = t),
            (t.err = t.error);
        }
      }
      function $a(h, t) {
        let e = h === 'output-restricted',
          i = e
            ? b.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED
            : b.KEY_SYSTEM_STATUS_INTERNAL_ERROR;
        return new Xt(
          { type: Q.KEY_SYSTEM_ERROR, details: i, fatal: !1, decryptdata: t },
          e ? 'HDCP level output restricted' : `key status changed to "${h}"`
        );
      }
      class ml {
        constructor(t) {
          (this.hls = void 0),
            (this.isVideoPlaybackQualityAvailable = !1),
            (this.timer = void 0),
            (this.media = null),
            (this.lastTime = void 0),
            (this.lastDroppedFrames = 0),
            (this.lastDecodedFrames = 0),
            (this.streamController = void 0),
            (this.hls = t),
            this.registerListeners();
        }
        setStreamController(t) {
          this.streamController = t;
        }
        registerListeners() {
          this.hls.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            this.hls.on(p.MEDIA_DETACHING, this.onMediaDetaching, this);
        }
        unregisterListeners() {
          this.hls.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            this.hls.off(p.MEDIA_DETACHING, this.onMediaDetaching, this);
        }
        destroy() {
          this.timer && clearInterval(this.timer),
            this.unregisterListeners(),
            (this.isVideoPlaybackQualityAvailable = !1),
            (this.media = null);
        }
        onMediaAttaching(t, e) {
          let i = this.hls.config;
          if (i.capLevelOnFPSDrop) {
            let r = e.media instanceof F.HTMLVideoElement ? e.media : null;
            (this.media = r),
              r &&
                typeof r.getVideoPlaybackQuality == 'function' &&
                (this.isVideoPlaybackQualityAvailable = !0),
              F.clearInterval(this.timer),
              (this.timer = F.setInterval(
                this.checkFPSInterval.bind(this),
                i.fpsDroppedMonitoringPeriod
              ));
          }
        }
        onMediaDetaching() {
          this.media = null;
        }
        checkFPS(t, e, i) {
          let r = performance.now();
          if (e) {
            if (this.lastTime) {
              let s = r - this.lastTime,
                a = i - this.lastDroppedFrames,
                n = e - this.lastDecodedFrames,
                l = (1e3 * a) / s,
                o = this.hls;
              if (
                (o.trigger(p.FPS_DROP, {
                  currentDropped: a,
                  currentDecoded: n,
                  totalDroppedFrames: i,
                }),
                l > 0 && a > o.config.fpsDroppedMonitoringThreshold * n)
              ) {
                let d = o.currentLevel;
                o.logger.warn(
                  'drop FPS ratio greater than max allowed value for currentLevel: ' +
                    d
                ),
                  d > 0 &&
                    (o.autoLevelCapping === -1 || o.autoLevelCapping >= d) &&
                    ((d -= 1),
                    o.trigger(p.FPS_DROP_LEVEL_CAPPING, {
                      level: d,
                      droppedLevel: o.currentLevel,
                    }),
                    (o.autoLevelCapping = d),
                    this.streamController.nextLevelSwitch());
              }
            }
            (this.lastTime = r),
              (this.lastDroppedFrames = i),
              (this.lastDecodedFrames = e);
          }
        }
        checkFPSInterval() {
          let t = this.media;
          if (t)
            if (this.isVideoPlaybackQualityAvailable) {
              let e = t.getVideoPlaybackQuality();
              this.checkFPS(t, e.totalVideoFrames, e.droppedVideoFrames);
            } else
              this.checkFPS(
                t,
                t.webkitDecodedFrameCount,
                t.webkitDroppedFrameCount
              );
        }
      }
      function Ga(h, t) {
        let e;
        try {
          e = new Event('addtrack');
        } catch {
          (e = document.createEvent('Event')).initEvent('addtrack', !1, !1);
        }
        (e.track = h), t.dispatchEvent(e);
      }
      function Ka(h, t) {
        let e = h.mode;
        if (
          (e === 'disabled' && (h.mode = 'hidden'),
          h.cues && !h.cues.getCueById(t.id))
        )
          try {
            if ((h.addCue(t), !h.cues.getCueById(t.id)))
              throw Error(`addCue is failed for: ${t}`);
          } catch (i) {
            nt.debug(`[texttrack-utils]: ${i}`);
            try {
              let r = new F.TextTrackCue(t.startTime, t.endTime, t.text);
              (r.id = t.id), h.addCue(r);
            } catch (r) {
              nt.debug(
                `[texttrack-utils]: Legacy TextTrackCue fallback failed: ${r}`
              );
            }
          }
        e === 'disabled' && (h.mode = e);
      }
      function _e(h, t) {
        let e = h.mode;
        if ((e === 'disabled' && (h.mode = 'hidden'), h.cues))
          for (let i = h.cues.length; i--; )
            t && h.cues[i].removeEventListener('enter', t),
              h.removeCue(h.cues[i]);
        e === 'disabled' && (h.mode = e);
      }
      function Rr(h, t, e, i) {
        let r = h.mode;
        if (
          (r === 'disabled' && (h.mode = 'hidden'), h.cues && h.cues.length > 0)
        ) {
          let s = (function (a, n, l) {
            let o = [],
              d = (function (u, c) {
                let f;
                if (c <= u[0].startTime) return 0;
                let g = u.length - 1;
                if (c > u[g].endTime) return -1;
                let E = 0,
                  m = g;
                for (; E <= m; )
                  if (c < u[(f = Math.floor((m + E) / 2))].startTime) m = f - 1;
                  else {
                    if (!(c > u[f].startTime) || !(E < g)) return f;
                    E = f + 1;
                  }
                return u[E].startTime - c < c - u[m].startTime ? E : m;
              })(a, n);
            if (d > -1)
              for (let u = d, c = a.length; u < c; u++) {
                let f = a[u];
                if (f.startTime >= n && f.endTime <= l) o.push(f);
                else if (f.startTime > l) break;
              }
            return o;
          })(h.cues, t, e);
          for (let a = 0; a < s.length; a++)
            (!i || i(s[a])) && h.removeCue(s[a]);
        }
        r === 'disabled' && (h.mode = r);
      }
      function Ai(h) {
        let t = [];
        for (let e = 0; e < h.length; e++) {
          let i = h[e];
          (i.kind === 'subtitles' || i.kind === 'captions') &&
            i.label &&
            t.push(h[e]);
        }
        return t;
      }
      class pl extends pr {
        constructor(t) {
          super(t, 'subtitle-track-controller'),
            (this.media = null),
            (this.tracks = []),
            (this.groupIds = null),
            (this.tracksInGroup = []),
            (this.trackId = -1),
            (this.currentTrack = null),
            (this.selectDefaultTrack = !0),
            (this.queuedDefaultTrack = -1),
            (this.useTextTrackPolling = !1),
            (this.subtitlePollingInterval = -1),
            (this._subtitleDisplay = !0),
            (this.asyncPollTrackChange = () => this.pollTrackChange(0)),
            (this.onTextTracksChanged = () => {
              if (
                (this.useTextTrackPolling ||
                  F.clearInterval(this.subtitlePollingInterval),
                !this.media || !this.hls.config.renderTextTracksNatively)
              )
                return;
              let e = null,
                i = Ai(this.media.textTracks);
              for (let s = 0; s < i.length; s++)
                if (i[s].mode === 'hidden') e = i[s];
                else if (i[s].mode === 'showing') {
                  e = i[s];
                  break;
                }
              let r = this.findTrackForTextTrack(e);
              this.subtitleTrack !== r && this.setSubtitleTrack(r);
            }),
            this.registerListeners();
        }
        destroy() {
          this.unregisterListeners(),
            (this.tracks.length = 0),
            (this.tracksInGroup.length = 0),
            (this.currentTrack = null),
            (this.onTextTracksChanged = this.asyncPollTrackChange = null),
            super.destroy();
        }
        get subtitleDisplay() {
          return this._subtitleDisplay;
        }
        set subtitleDisplay(t) {
          (this._subtitleDisplay = t),
            this.trackId > -1 && this.toggleTrackModes();
        }
        registerListeners() {
          let { hls: t } = this;
          t.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.on(p.LEVEL_LOADING, this.onLevelLoading, this),
            t.on(p.LEVEL_SWITCHING, this.onLevelSwitching, this),
            t.on(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this),
            t.on(p.ERROR, this.onError, this);
        }
        unregisterListeners() {
          let { hls: t } = this;
          t.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.off(p.LEVEL_LOADING, this.onLevelLoading, this),
            t.off(p.LEVEL_SWITCHING, this.onLevelSwitching, this),
            t.off(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this),
            t.off(p.ERROR, this.onError, this);
        }
        onMediaAttached(t, e) {
          (this.media = e.media),
            this.media &&
              (this.queuedDefaultTrack > -1 &&
                ((this.subtitleTrack = this.queuedDefaultTrack),
                (this.queuedDefaultTrack = -1)),
              (this.useTextTrackPolling = !(
                this.media.textTracks && 'onchange' in this.media.textTracks
              )),
              this.useTextTrackPolling
                ? this.pollTrackChange(500)
                : this.media.textTracks.addEventListener(
                    'change',
                    this.asyncPollTrackChange
                  ));
        }
        pollTrackChange(t) {
          F.clearInterval(this.subtitlePollingInterval),
            (this.subtitlePollingInterval = F.setInterval(
              this.onTextTracksChanged,
              t
            ));
        }
        onMediaDetaching(t, e) {
          let i = this.media;
          if (!i) return;
          let r = !!e.transferMedia;
          F.clearInterval(this.subtitlePollingInterval),
            this.useTextTrackPolling ||
              i.textTracks.removeEventListener(
                'change',
                this.asyncPollTrackChange
              ),
            this.trackId > -1 && (this.queuedDefaultTrack = this.trackId),
            (this.subtitleTrack = -1),
            (this.media = null),
            r ||
              Ai(i.textTracks).forEach((s) => {
                _e(s);
              });
        }
        onManifestLoading() {
          (this.tracks = []),
            (this.groupIds = null),
            (this.tracksInGroup = []),
            (this.trackId = -1),
            (this.currentTrack = null),
            (this.selectDefaultTrack = !0);
        }
        onManifestParsed(t, e) {
          this.tracks = e.subtitleTracks;
        }
        onSubtitleTrackLoaded(t, e) {
          let { id: i, groupId: r, details: s } = e,
            a = this.tracksInGroup[i];
          if (!a || a.groupId !== r) {
            this.warn(
              `Subtitle track with id:${i} and group:${r} not found in active group ${a?.groupId}`
            );
            return;
          }
          let n = a.details;
          (a.details = e.details),
            this.log(
              `Subtitle track ${i} "${a.name}" lang:${a.lang} group:${r} loaded [${s.startSN}-${s.endSN}]`
            ),
            i === this.trackId && this.playlistLoaded(i, e, n);
        }
        onLevelLoading(t, e) {
          this.switchLevel(e.level);
        }
        onLevelSwitching(t, e) {
          this.switchLevel(e.level);
        }
        switchLevel(t) {
          let e = this.hls.levels[t];
          if (!e) return;
          let i = e.subtitleGroups || null,
            r = this.groupIds,
            s = this.currentTrack;
          if (
            !i ||
            r?.length !== i?.length ||
            (i != null && i.some((a) => r?.indexOf(a) === -1))
          ) {
            (this.groupIds = i),
              (this.trackId = -1),
              (this.currentTrack = null);
            let a = this.tracks.filter(
              (o) => !i || i.indexOf(o.groupId) !== -1
            );
            if (a.length)
              this.selectDefaultTrack &&
                !a.some((o) => o.default) &&
                (this.selectDefaultTrack = !1),
                a.forEach((o, d) => {
                  o.id = d;
                });
            else if (!s && !this.tracksInGroup.length) return;
            this.tracksInGroup = a;
            let n = this.hls.config.subtitlePreference;
            if (!s && n) {
              this.selectDefaultTrack = !1;
              let o = Jt(n, a);
              if (o > -1) s = a[o];
              else {
                let d = Jt(n, this.tracks);
                s = this.tracks[d];
              }
            }
            let l = this.findTrackId(s);
            l === -1 && s && (l = this.findTrackId(null)),
              this.log(
                `Updating subtitle tracks, ${
                  a.length
                } track(s) found in "${i?.join(',')}" group-id`
              ),
              this.hls.trigger(p.SUBTITLE_TRACKS_UPDATED, {
                subtitleTracks: a,
              }),
              l !== -1 && this.trackId === -1 && this.setSubtitleTrack(l);
          }
        }
        findTrackId(t) {
          let e = this.tracksInGroup,
            i = this.selectDefaultTrack;
          for (let r = 0; r < e.length; r++) {
            let s = e[r];
            if ((!i || s.default) && (i || t) && (!t || ge(s, t))) return r;
          }
          if (t) {
            for (let r = 0; r < e.length; r++) {
              let s = e[r];
              if (
                Ve(t.attrs, s.attrs, [
                  'LANGUAGE',
                  'ASSOC-LANGUAGE',
                  'CHARACTERISTICS',
                ])
              )
                return r;
            }
            for (let r = 0; r < e.length; r++) {
              let s = e[r];
              if (Ve(t.attrs, s.attrs, ['LANGUAGE'])) return r;
            }
          }
          return -1;
        }
        findTrackForTextTrack(t) {
          if (t) {
            let e = this.tracksInGroup;
            for (let i = 0; i < e.length; i++) if (Er(e[i], t)) return i;
          }
          return -1;
        }
        onError(t, e) {
          !e.fatal &&
            e.context &&
            (e.context.type !== lt.SUBTITLE_TRACK ||
              e.context.id !== this.trackId ||
              (this.groupIds &&
                this.groupIds.indexOf(e.context.groupId) === -1) ||
              this.checkRetry(e));
        }
        get allSubtitleTracks() {
          return this.tracks;
        }
        get subtitleTracks() {
          return this.tracksInGroup;
        }
        get subtitleTrack() {
          return this.trackId;
        }
        set subtitleTrack(t) {
          (this.selectDefaultTrack = !1), this.setSubtitleTrack(t);
        }
        setSubtitleOption(t) {
          if (((this.hls.config.subtitlePreference = t), t)) {
            if (t.id === -1) return this.setSubtitleTrack(-1), null;
            let e = this.allSubtitleTracks;
            if (((this.selectDefaultTrack = !1), e.length)) {
              let i = this.currentTrack;
              if (i && ge(t, i)) return i;
              let r = Jt(t, this.tracksInGroup);
              if (r > -1) {
                let s = this.tracksInGroup[r];
                return this.setSubtitleTrack(r), s;
              }
              if (!i) {
                let s = Jt(t, e);
                if (s > -1) return e[s];
              }
            }
          }
          return null;
        }
        loadPlaylist(t) {
          super.loadPlaylist(),
            this.shouldLoadPlaylist(this.currentTrack) &&
              this.scheduleLoading(this.currentTrack, t);
        }
        loadingPlaylist(t, e) {
          super.loadingPlaylist(t, e);
          let i = t.id,
            r = t.groupId,
            s = this.getUrlWithDirectives(t.url, e),
            a = t.details,
            n = a?.age;
          this.log(
            `Loading subtitle ${i} "${t.name}" lang:${t.lang} group:${r}${
              e?.msn !== void 0 ? ' at sn ' + e.msn + ' part ' + e.part : ''
            }${
              n && a.live
                ? ' age ' + n.toFixed(1) + (a.type ? ' ' + a.type : '')
                : ''
            } ${s}`
          ),
            this.hls.trigger(p.SUBTITLE_TRACK_LOADING, {
              url: s,
              id: i,
              groupId: r,
              deliveryDirectives: e || null,
              track: t,
            });
        }
        toggleTrackModes() {
          let t,
            { media: e } = this;
          if (!e) return;
          let i = Ai(e.textTracks),
            r = this.currentTrack;
          if (
            (!r ||
              (t = i.filter((s) => Er(r, s))[0]) ||
              this.warn(
                `Unable to find subtitle TextTrack with name "${r.name}" and language "${r.lang}"`
              ),
            [].slice.call(i).forEach((s) => {
              s.mode !== 'disabled' && s !== t && (s.mode = 'disabled');
            }),
            t)
          ) {
            let s = this.subtitleDisplay ? 'showing' : 'hidden';
            t.mode !== s && (t.mode = s);
          }
        }
        setSubtitleTrack(t) {
          let e = this.tracksInGroup;
          if (!this.media) {
            this.queuedDefaultTrack = t;
            return;
          }
          if (t < -1 || t >= e.length || !Y(t)) {
            this.warn(`Invalid subtitle track id: ${t}`);
            return;
          }
          this.selectDefaultTrack = !1;
          let i = this.currentTrack,
            r = e[t] || null;
          if (
            ((this.trackId = t),
            (this.currentTrack = r),
            this.toggleTrackModes(),
            !r)
          ) {
            this.hls.trigger(p.SUBTITLE_TRACK_SWITCH, { id: t });
            return;
          }
          let s = !!r.details && !r.details.live;
          if (t === this.trackId && r === i && s) return;
          this.log(
            `Switching to subtitle-track ${t}` +
              (r ? ` "${r.name}" lang:${r.lang} group:${r.groupId}` : '')
          );
          let { id: a, groupId: n = '', name: l, type: o, url: d } = r;
          this.hls.trigger(p.SUBTITLE_TRACK_SWITCH, {
            id: a,
            groupId: n,
            name: l,
            type: o,
            url: d,
          });
          let u = this.switchParams(r.url, i?.details, r.details);
          this.loadPlaylist(u);
        }
      }
      function He(h) {
        let t = 5381,
          e = h.length;
        for (; e; ) t = (33 * t) ^ h.charCodeAt(--e);
        return (t >>> 0).toString();
      }
      let Li = (function (h) {
        return (h[(h.Point = 0)] = 'Point'), (h[(h.Range = 1)] = 'Range'), h;
      })({});
      class El {
        constructor(t, e) {
          (this.base = void 0),
            (this._duration = null),
            (this._timelineStart = null),
            (this.appendInPlaceDisabled = void 0),
            (this.appendInPlaceStarted = void 0),
            (this.dateRange = void 0),
            (this.hasPlayed = !1),
            (this.cumulativeDuration = 0),
            (this.resumeOffset = NaN),
            (this.playoutLimit = NaN),
            (this.restrictions = { skip: !1, jump: !1 }),
            (this.snapOptions = { out: !1, in: !1 }),
            (this.assetList = []),
            (this.assetListLoader = void 0),
            (this.assetListResponse = null),
            (this.resumeAnchor = void 0),
            (this.error = void 0),
            (this.resetOnResume = void 0),
            (this.base = e),
            (this.dateRange = t),
            this.setDateRange(t);
        }
        setDateRange(t) {
          (this.dateRange = t),
            (this.resumeOffset = t.attr.optionalFloat(
              'X-RESUME-OFFSET',
              this.resumeOffset
            )),
            (this.playoutLimit = t.attr.optionalFloat(
              'X-PLAYOUT-LIMIT',
              this.playoutLimit
            )),
            (this.restrictions = t.attr.enumeratedStringList(
              'X-RESTRICT',
              this.restrictions
            )),
            (this.snapOptions = t.attr.enumeratedStringList(
              'X-SNAP',
              this.snapOptions
            ));
        }
        reset() {
          var t;
          (this.appendInPlaceStarted = !1),
            (t = this.assetListLoader) == null || t.destroy(),
            (this.assetListLoader = void 0),
            this.supplementsPrimary ||
              ((this.assetListResponse = null),
              (this.assetList = []),
              (this._duration = null));
        }
        isAssetPastPlayoutLimit(t) {
          var e;
          if (t > 0 && t >= this.assetList.length) return !0;
          let i = this.playoutLimit;
          return (
            !(t <= 0 || isNaN(i)) &&
            (i === 0 ||
              (((e = this.assetList[t]) == null ? void 0 : e.startOffset) ||
                0) > i)
          );
        }
        findAssetIndex(t) {
          return this.assetList.indexOf(t);
        }
        get identifier() {
          return this.dateRange.id;
        }
        get startDate() {
          return this.dateRange.startDate;
        }
        get startTime() {
          let t = this.dateRange.startTime;
          if (this.snapOptions.out) {
            let e = this.dateRange.tagAnchor;
            if (e) return br(t, e);
          }
          return t;
        }
        get startOffset() {
          return this.cue.pre ? 0 : this.startTime;
        }
        get startIsAligned() {
          if (this.startTime === 0 || this.snapOptions.out) return !0;
          let t = this.dateRange.tagAnchor;
          if (t) {
            let e = this.dateRange.startTime,
              i = br(e, t);
            return e - i < 0.1;
          }
          return !1;
        }
        get resumptionOffset() {
          let t = this.resumeOffset,
            e = Y(t) ? t : this.duration;
          return this.cumulativeDuration + e;
        }
        get resumeTime() {
          let t = this.startOffset + this.resumptionOffset;
          if (this.snapOptions.in) {
            let e = this.resumeAnchor;
            if (e) return br(t, e);
          }
          return t;
        }
        get appendInPlace() {
          return (
            !!this.appendInPlaceStarted ||
            (!this.appendInPlaceDisabled &&
              !!(
                !this.cue.once &&
                !this.cue.pre &&
                this.startIsAligned &&
                ((isNaN(this.playoutLimit) && isNaN(this.resumeOffset)) ||
                  (this.resumeOffset &&
                    this.duration &&
                    0.025 > Math.abs(this.resumeOffset - this.duration)))
              ))
          );
        }
        set appendInPlace(t) {
          if (this.appendInPlaceStarted) {
            this.resetOnResume = !t;
            return;
          }
          this.appendInPlaceDisabled = !t;
        }
        get timelineStart() {
          return this._timelineStart !== null
            ? this._timelineStart
            : this.startTime;
        }
        set timelineStart(t) {
          this._timelineStart = t;
        }
        get duration() {
          let t,
            e = this.playoutLimit;
          return (
            (t =
              this._duration !== null
                ? this._duration
                : this.dateRange.duration
                ? this.dateRange.duration
                : this.dateRange.plannedDuration || 0),
            !isNaN(e) && e < t && (t = e),
            t
          );
        }
        set duration(t) {
          this._duration = t;
        }
        get cue() {
          return this.dateRange.cue;
        }
        get timelineOccupancy() {
          return this.dateRange.attr['X-TIMELINE-OCCUPIES'] === 'RANGE'
            ? Li.Range
            : Li.Point;
        }
        get supplementsPrimary() {
          return this.dateRange.attr['X-TIMELINE-STYLE'] === 'PRIMARY';
        }
        get contentMayVary() {
          return this.dateRange.attr['X-CONTENT-MAY-VARY'] !== 'NO';
        }
        get assetUrl() {
          return this.dateRange.attr['X-ASSET-URI'];
        }
        get assetListUrl() {
          return this.dateRange.attr['X-ASSET-LIST'];
        }
        get baseUrl() {
          return this.base.url;
        }
        get assetListLoaded() {
          return this.assetList.length > 0 || this.assetListResponse !== null;
        }
        toString() {
          return `["${this.identifier}" ${
            this.cue.pre ? '<pre>' : this.cue.post ? '<post>' : ''
          }${this.timelineStart.toFixed(2)}-${this.resumeTime.toFixed(2)}]`;
        }
      }
      function br(h, t) {
        return h - t.start < t.duration / 2 &&
          !(0.025 > Math.abs(h - (t.start + t.duration)))
          ? t.start
          : t.start + t.duration;
      }
      function Va(h, t, e) {
        let i = new F.URL(h, e);
        return (
          i.protocol !== 'data:' && i.searchParams.set('_HLS_primary_id', t), i
        );
      }
      function Dr(h, t) {
        for (; (e = h.assetList[++t]) != null && e.error; ) var e;
        return t;
      }
      function Ce(h) {
        let t = h.timelineStart,
          e = h.duration || 0;
        return `["${h.identifier}" ${t.toFixed(2)}-${(t + e).toFixed(2)}]`;
      }
      class yl {
        constructor(t, e, i, r) {
          (this.hls = void 0),
            (this.interstitial = void 0),
            (this.assetItem = void 0),
            (this.tracks = null),
            (this.hasDetails = !1),
            (this.mediaAttached = null),
            (this._currentTime = void 0),
            (this._bufferedEosTime = void 0),
            (this.checkPlayout = () => {
              this.reachedPlayout(this.currentTime) &&
                this.hls &&
                this.hls.trigger(p.PLAYOUT_LIMIT_REACHED, {});
            });
          let s = (this.hls = new t(e));
          (this.interstitial = i), (this.assetItem = r);
          let a = () => {
            this.hasDetails = !0;
          };
          s.once(p.LEVEL_LOADED, a),
            s.once(p.AUDIO_TRACK_LOADED, a),
            s.once(p.SUBTITLE_TRACK_LOADED, a),
            s.on(p.MEDIA_ATTACHING, (n, { media: l }) => {
              this.removeMediaListeners(),
                (this.mediaAttached = l),
                this.interstitial.playoutLimit &&
                  (l.addEventListener('timeupdate', this.checkPlayout),
                  this.appendInPlace &&
                    s.on(p.BUFFER_APPENDED, () => {
                      let o = this.bufferedEnd;
                      this.reachedPlayout(o) &&
                        ((this._bufferedEosTime = o),
                        s.trigger(p.BUFFERED_TO_END, void 0));
                    }));
            });
        }
        get appendInPlace() {
          return this.interstitial.appendInPlace;
        }
        loadSource() {
          let t = this.hls;
          if (t)
            if (t.url) t.levels.length && !t.started && t.startLoad(-1, !0);
            else {
              let e = this.assetItem.uri;
              try {
                e = Va(e, t.config.primarySessionId || '').href;
              } catch {}
              t.loadSource(e);
            }
        }
        bufferedInPlaceToEnd(t) {
          var e;
          if (!this.appendInPlace) return !1;
          if ((e = this.hls) != null && e.bufferedToEnd) return !0;
          if (!t) return !1;
          let i = Math.min(this._bufferedEosTime || 1 / 0, this.duration),
            r = this.timelineOffset,
            s = rt.bufferInfo(t, r, 0);
          return this.getAssetTime(s.end) >= i - 0.02;
        }
        reachedPlayout(t) {
          let e = this.interstitial.playoutLimit;
          return this.startOffset + t >= e;
        }
        get destroyed() {
          var t;
          return !((t = this.hls) != null && t.userConfig);
        }
        get assetId() {
          return this.assetItem.identifier;
        }
        get interstitialId() {
          return this.assetItem.parentIdentifier;
        }
        get media() {
          var t;
          return ((t = this.hls) == null ? void 0 : t.media) || null;
        }
        get bufferedEnd() {
          let t = this.media || this.mediaAttached;
          if (!t)
            return this._bufferedEosTime
              ? this._bufferedEosTime
              : this.currentTime;
          let e = rt.bufferInfo(t, t.currentTime, 0.001);
          return this.getAssetTime(e.end);
        }
        get currentTime() {
          let t = this.media || this.mediaAttached;
          return t ? this.getAssetTime(t.currentTime) : this._currentTime || 0;
        }
        get duration() {
          let t = this.assetItem.duration;
          if (!t) return 0;
          let e = this.interstitial.playoutLimit;
          if (e) {
            let i = e - this.startOffset;
            if (i > 0 && i < t) return i;
          }
          return t;
        }
        get remaining() {
          let t = this.duration;
          return t ? Math.max(0, t - this.currentTime) : 0;
        }
        get startOffset() {
          return this.assetItem.startOffset;
        }
        get timelineOffset() {
          var t;
          return (
            ((t = this.hls) == null ? void 0 : t.config.timelineOffset) || 0
          );
        }
        set timelineOffset(t) {
          let e = this.timelineOffset;
          if (t !== e && Math.abs(t - e) > 11111111111111112e-21 && this.hls) {
            if (this.hasDetails)
              throw Error(
                'Cannot set timelineOffset after playlists are loaded'
              );
            this.hls.config.timelineOffset = t;
          }
        }
        getAssetTime(t) {
          return Math.min(Math.max(0, t - this.timelineOffset), this.duration);
        }
        removeMediaListeners() {
          let t = this.mediaAttached;
          t &&
            ((this._currentTime = t.currentTime),
            this.bufferSnapShot(),
            t.removeEventListener('timeupdate', this.checkPlayout));
        }
        bufferSnapShot() {
          if (this.mediaAttached) {
            var t;
            (t = this.hls) != null &&
              t.bufferedToEnd &&
              (this._bufferedEosTime = this.bufferedEnd);
          }
        }
        destroy() {
          this.removeMediaListeners(),
            this.hls && this.hls.destroy(),
            (this.hls = null),
            (this.tracks = this.mediaAttached = this.checkPlayout = null);
        }
        attachMedia(t) {
          var e;
          this.loadSource(), (e = this.hls) == null || e.attachMedia(t);
        }
        detachMedia() {
          var t;
          this.removeMediaListeners(),
            (this.mediaAttached = null),
            (t = this.hls) == null || t.detachMedia();
        }
        resumeBuffering() {
          var t;
          (t = this.hls) == null || t.resumeBuffering();
        }
        pauseBuffering() {
          var t;
          (t = this.hls) == null || t.pauseBuffering();
        }
        transferMedia() {
          var t;
          return (
            this.bufferSnapShot(),
            ((t = this.hls) == null ? void 0 : t.transferMedia()) || null
          );
        }
        resetDetails() {
          let t = this.hls;
          if (t && this.hasDetails) {
            t.stopLoad();
            let e = (i) => delete i.details;
            t.levels.forEach(e),
              t.allAudioTracks.forEach(e),
              t.allSubtitleTracks.forEach(e),
              (this.hasDetails = !1);
          }
        }
        on(t, e, i) {
          var r;
          (r = this.hls) == null || r.on(t, e);
        }
        once(t, e, i) {
          var r;
          (r = this.hls) == null || r.once(t, e);
        }
        off(t, e, i) {
          var r;
          (r = this.hls) == null || r.off(t, e);
        }
        toString() {
          var t;
          return `HlsAssetPlayer: ${Ce(this.assetItem)} ${
            (t = this.hls) == null ? void 0 : t.sessionId
          } ${this.appendInPlace ? 'append-in-place' : ''}`;
        }
      }
      class vl extends it {
        constructor(t, e) {
          super('interstitials-sched', e),
            (this.onScheduleUpdate = void 0),
            (this.eventMap = {}),
            (this.events = null),
            (this.items = null),
            (this.durations = { primary: 0, playout: 0, integrated: 0 }),
            (this.onScheduleUpdate = t);
        }
        destroy() {
          this.reset(), (this.onScheduleUpdate = null);
        }
        reset() {
          (this.eventMap = {}),
            this.setDurations(0, 0, 0),
            this.events && this.events.forEach((t) => t.reset()),
            (this.events = this.items = null);
        }
        resetErrorsInRange(t, e) {
          return this.events
            ? this.events.reduce(
                (i, r) =>
                  t <= r.startOffset && e > r.startOffset
                    ? (delete r.error, i + 1)
                    : i,
                0
              )
            : 0;
        }
        get duration() {
          let t = this.items;
          return t ? t[t.length - 1].end : 0;
        }
        get length() {
          return this.items ? this.items.length : 0;
        }
        getEvent(t) {
          return (t && this.eventMap[t]) || null;
        }
        hasEvent(t) {
          return t in this.eventMap;
        }
        findItemIndex(t, e) {
          if (t.event) return this.findEventIndex(t.event.identifier);
          let i = -1;
          t.nextEvent
            ? (i = this.findEventIndex(t.nextEvent.identifier) - 1)
            : t.previousEvent &&
              (i = this.findEventIndex(t.previousEvent.identifier) + 1);
          let r = this.items;
          if (r)
            for (
              r[i] ||
              (e === void 0 && (e = t.start),
              (i = this.findItemIndexAtTime(e)));
              i >= 0 && (s = r[i]) != null && s.event;

            ) {
              var s;
              i--;
            }
          return i;
        }
        findItemIndexAtTime(t, e) {
          let i = this.items;
          if (i)
            for (let r = 0; r < i.length; r++) {
              let s = i[r];
              if (
                (e && e !== 'primary' && (s = s[e]),
                t === s.start || (t > s.start && t < s.end))
              )
                return r;
            }
          return -1;
        }
        findJumpRestrictedIndex(t, e) {
          let i = this.items;
          if (i)
            for (let r = t; r <= e && i[r]; r++) {
              let s = i[r].event;
              if (s != null && s.restrictions.jump && !s.appendInPlace)
                return r;
            }
          return -1;
        }
        findEventIndex(t) {
          let e = this.items;
          if (e)
            for (let r = e.length; r--; ) {
              var i;
              if (((i = e[r].event) == null ? void 0 : i.identifier) === t)
                return r;
            }
          return -1;
        }
        findAssetIndex(t, e) {
          let i = t.assetList,
            r = i.length;
          if (r > 1)
            for (let s = 0; s < r; s++) {
              let a = i[s];
              if (!a.error) {
                let n = a.timelineStart;
                if (
                  e === n ||
                  (e > n && (e < n + (a.duration || 0) || s === r - 1))
                )
                  return s;
              }
            }
          return 0;
        }
        get assetIdAtEnd() {
          var t;
          let e =
            (t = this.items) == null || (t = t[this.length - 1]) == null
              ? void 0
              : t.event;
          if (e) {
            let i = e.assetList,
              r = i[i.length - 1];
            if (r) return r.identifier;
          }
          return null;
        }
        parseInterstitialDateRanges(t, e) {
          let i = t.main.details,
            { dateRanges: r } = i,
            s = this.events,
            a = this.parseDateRanges(r, { url: i.url }, e),
            n = Object.keys(r),
            l = s ? s.filter((o) => !n.includes(o.identifier)) : [];
          a.length &&
            a.sort((o, d) => {
              let u = o.cue.pre,
                c = o.cue.post,
                f = d.cue.pre,
                g = d.cue.post;
              if (u && !f) return -1;
              if ((f && !u) || (c && !g)) return 1;
              if (g && !c) return -1;
              if (!u && !f && !c && !g) {
                let E = o.startTime,
                  m = d.startTime;
                if (E !== m) return E - m;
              }
              return o.dateRange.tagOrder - d.dateRange.tagOrder;
            }),
            (this.events = a),
            l.forEach((o) => {
              this.removeEvent(o);
            }),
            this.updateSchedule(t, l);
        }
        updateSchedule(t, e = [], i = !1) {
          let r = this.events || [];
          if (r.length || e.length || this.length < 2) {
            let s = this.items,
              a = this.parseSchedule(r, t);
            (i ||
              e.length ||
              s?.length !== a.length ||
              a.some(
                (n, l) =>
                  Math.abs(n.playout.start - s[l].playout.start) > 0.005 ||
                  Math.abs(n.playout.end - s[l].playout.end) > 0.005
              )) &&
              ((this.items = a), this.onScheduleUpdate(e, s));
          }
        }
        parseDateRanges(t, e, i) {
          let r = [],
            s = Object.keys(t);
          for (let a = 0; a < s.length; a++) {
            let n = s[a],
              l = t[n];
            if (l.isInterstitial) {
              let o = this.eventMap[n];
              o
                ? o.setDateRange(l)
                : ((o = new El(l, e)),
                  (this.eventMap[n] = o),
                  i === !1 && (o.appendInPlace = i)),
                r.push(o);
            }
          }
          return r;
        }
        parseSchedule(t, e) {
          let i = [],
            r = e.main.details,
            s = r.live ? 1 / 0 : r.edge,
            a = 0;
          if (
            (t = t.filter((l) => !l.error && !(l.cue.once && l.hasPlayed)))
              .length
          ) {
            this.resolveOffsets(t, e);
            let l = 0,
              o = 0;
            if (
              (t.forEach((d, u) => {
                let c = d.cue.pre,
                  f = d.cue.post,
                  g = t[u - 1] || null,
                  E = d.appendInPlace,
                  m = f ? s : d.startOffset,
                  y = d.duration,
                  S = d.timelineOccupancy === Li.Range ? y : 0,
                  T = d.resumptionOffset,
                  A = g?.startTime === m,
                  R = m + d.cumulativeDuration,
                  I = E ? R + y : m + T;
                if (c || (!f && m <= 0)) {
                  let _ = o;
                  (o += S), (d.timelineStart = R);
                  let L = a;
                  (a += y),
                    i.push({
                      event: d,
                      start: R,
                      end: I,
                      playout: { start: L, end: a },
                      integrated: { start: _, end: o },
                    });
                } else {
                  if (!(m <= s)) return;
                  if (!A) {
                    let C = m - l;
                    if (C > 0.033) {
                      let M = l,
                        G = o;
                      o += C;
                      let k = a;
                      a += C;
                      let P = {
                        previousEvent: t[u - 1] || null,
                        nextEvent: d,
                        start: M,
                        end: M + C,
                        playout: { start: k, end: a },
                        integrated: { start: G, end: o },
                      };
                      i.push(P);
                    } else
                      C > 0 &&
                        g &&
                        ((g.cumulativeDuration += C),
                        (i[i.length - 1].end = m));
                  }
                  f && (I = R), (d.timelineStart = R);
                  let _ = o;
                  o += S;
                  let L = a;
                  (a += y),
                    i.push({
                      event: d,
                      start: R,
                      end: I,
                      playout: { start: L, end: a },
                      integrated: { start: _, end: o },
                    });
                }
                let v = d.resumeTime;
                l = f || v > s ? s : v;
              }),
              l < s)
            ) {
              var n;
              let d = l,
                u = o,
                c = s - l;
              o += c;
              let f = a;
              (a += c),
                i.push({
                  previousEvent:
                    ((n = i[i.length - 1]) == null ? void 0 : n.event) || null,
                  nextEvent: null,
                  start: l,
                  end: d + c,
                  playout: { start: f, end: a },
                  integrated: { start: u, end: o },
                });
            }
            this.setDurations(s, a, o);
          } else
            i.push({
              previousEvent: null,
              nextEvent: null,
              start: 0,
              end: s,
              playout: { start: 0, end: s },
              integrated: { start: 0, end: s },
            }),
              this.setDurations(s, s, s);
          return i;
        }
        setDurations(t, e, i) {
          this.durations = { primary: t, playout: e, integrated: i };
        }
        resolveOffsets(t, e) {
          let i = e.main.details,
            r = i.live ? 1 / 0 : i.edge,
            s = 0,
            a = -1;
          t.forEach((n, l) => {
            let o = n.cue.pre,
              d = n.cue.post,
              u = o ? 0 : d ? r : n.startTime;
            this.updateAssetDurations(n),
              a === u ? (n.cumulativeDuration = s) : ((s = 0), (a = u)),
              !d &&
                n.snapOptions.in &&
                (n.resumeAnchor =
                  pe(
                    null,
                    i.fragments,
                    n.startOffset + n.resumptionOffset,
                    0,
                    0
                  ) || void 0),
              !n.appendInPlace ||
                n.appendInPlaceStarted ||
                this.primaryCanResumeInPlaceAt(n, e) ||
                (n.appendInPlace = !1),
              !n.appendInPlace &&
                l + 1 < t.length &&
                t[l + 1].startTime - t[l].resumeTime < 0.033 &&
                ((t[l + 1].appendInPlace = !1),
                t[l + 1].appendInPlace &&
                  this.warn(
                    `Could not change append strategy for abutting event ${n}`
                  ));
            let c = Y(n.resumeOffset) ? n.resumeOffset : n.duration;
            s += c;
          });
        }
        primaryCanResumeInPlaceAt(t, e) {
          let i = t.resumeTime,
            r = t.startTime + t.resumptionOffset;
          return Math.abs(i - r) > 0.025
            ? (this.log(
                `"${t.identifier}" resumption ${i} not aligned with estimated timeline end ${r}`
              ),
              !1)
            : !Object.keys(e).some((s) => {
                let a = e[s].details,
                  n = a.edge;
                if (i >= n)
                  return (
                    this.log(
                      `"${t.identifier}" resumption ${i} past ${s} playlist end ${n}`
                    ),
                    !1
                  );
                let l = pe(null, a.fragments, i);
                if (!l)
                  return (
                    this.log(
                      `"${t.identifier}" resumption ${i} does not align with any fragments in ${s} playlist (${a.fragStart}-${a.fragmentEnd})`
                    ),
                    !0
                  );
                let o = s === 'audio' ? 0.175 : 0;
                return (
                  !(
                    Math.abs(l.start - i) < 0.025 + o ||
                    Math.abs(l.end - i) < 0.025 + o
                  ) &&
                  (this.log(
                    `"${t.identifier}" resumption ${i} not aligned with ${s} fragment bounds (${l.start}-${l.end} sn: ${l.sn} cc: ${l.cc})`
                  ),
                  !0)
                );
              });
        }
        updateAssetDurations(t) {
          if (!t.assetListLoaded) return;
          let e = t.timelineStart,
            i = 0,
            r = !1,
            s = !1;
          for (let a = 0; a < t.assetList.length; a++) {
            let n = t.assetList[a],
              l = e + i;
            (n.startOffset = i),
              (n.timelineStart = l),
              r || (r = n.duration === null),
              s || (s = !!n.error),
              (i += n.error ? 0 : n.duration || 0);
          }
          r && !s ? (t.duration = Math.max(i, t.duration)) : (t.duration = i);
        }
        removeEvent(t) {
          t.reset(), delete this.eventMap[t.identifier];
        }
      }
      function zt(h) {
        return `[${
          h.event ? '"' + h.event.identifier + '"' : 'primary'
        }: ${h.start.toFixed(2)}-${h.end.toFixed(2)}]`;
      }
      class Tl {
        constructor(t) {
          (this.hls = void 0), (this.hls = t);
        }
        destroy() {
          this.hls = null;
        }
        loadAssetList(t, e) {
          let i,
            r = t.assetListUrl;
          try {
            i = Va(r, this.hls.sessionId, t.baseUrl);
          } catch (d) {
            let u = this.assignAssetListError(t, b.ASSET_LIST_LOAD_ERROR, d, r);
            this.hls.trigger(p.ERROR, u);
            return;
          }
          e &&
            i.protocol !== 'data:' &&
            i.searchParams.set('_HLS_start_offset', '' + e);
          let s = this.hls.config,
            a = new s.loader(s),
            n = { responseType: 'json', url: i.href },
            l = s.interstitialAssetListLoadPolicy.default,
            o = {
              loadPolicy: l,
              timeout: l.maxLoadTimeMs,
              maxRetry: 0,
              retryDelay: 0,
              maxRetryDelay: 0,
            };
          return (
            a.load(n, o, {
              onSuccess: (d, u, c, f) => {
                let g = d.data;
                if (!Array.isArray(g?.ASSETS)) {
                  let E = this.assignAssetListError(
                    t,
                    b.ASSET_LIST_PARSING_ERROR,
                    Error('Invalid interstitial asset list'),
                    c.url,
                    u,
                    f
                  );
                  this.hls.trigger(p.ERROR, E);
                  return;
                }
                (t.assetListResponse = g),
                  this.hls.trigger(p.ASSET_LIST_LOADED, {
                    event: t,
                    assetListResponse: g,
                    networkDetails: f,
                  });
              },
              onError: (d, u, c, f) => {
                let g = this.assignAssetListError(
                  t,
                  b.ASSET_LIST_LOAD_ERROR,
                  Error(
                    `Error loading X-ASSET-LIST: HTTP status ${d.code} ${d.text} (${u.url})`
                  ),
                  u.url,
                  f,
                  c
                );
                this.hls.trigger(p.ERROR, g);
              },
              onTimeout: (d, u, c) => {
                let f = this.assignAssetListError(
                  t,
                  b.ASSET_LIST_LOAD_TIMEOUT,
                  Error(`Timeout loading X-ASSET-LIST (${u.url})`),
                  u.url,
                  d,
                  c
                );
                this.hls.trigger(p.ERROR, f);
              },
            }),
            this.hls.trigger(p.ASSET_LIST_LOADING, { event: t }),
            a
          );
        }
        assignAssetListError(t, e, i, r, s, a) {
          return (
            (t.error = i),
            {
              type: Q.NETWORK_ERROR,
              details: e,
              fatal: !1,
              interstitial: t,
              url: r,
              error: i,
              networkDetails: a,
              stats: s,
            }
          );
        }
      }
      function Ha(h) {
        h?.play().catch(() => {});
      }
      function Ii(h, t) {
        return `[${h}] Advancing timeline position to ${t}`;
      }
      class Sl extends it {
        constructor(t, e) {
          super('interstitials', t.logger),
            (this.HlsPlayerClass = void 0),
            (this.hls = void 0),
            (this.assetListLoader = void 0),
            (this.mediaSelection = null),
            (this.altSelection = null),
            (this.media = null),
            (this.detachedData = null),
            (this.requiredTracks = null),
            (this.manager = null),
            (this.playerQueue = []),
            (this.bufferedPos = -1),
            (this.timelinePos = -1),
            (this.schedule = void 0),
            (this.playingItem = null),
            (this.bufferingItem = null),
            (this.waitingItem = null),
            (this.endedItem = null),
            (this.playingAsset = null),
            (this.endedAsset = null),
            (this.bufferingAsset = null),
            (this.shouldPlay = !1),
            (this.onPlay = () => {
              this.shouldPlay = !0;
            }),
            (this.onPause = () => {
              this.shouldPlay = !1;
            }),
            (this.onSeeking = () => {
              var i, r;
              let s = this.currentTime;
              if (s === void 0 || this.playbackDisabled || !this.schedule)
                return;
              let a = s - this.timelinePos;
              if (Math.abs(a) < 14172335600907028e-25) return;
              let n = a <= -0.01;
              (this.timelinePos = s), (this.bufferedPos = s);
              let l = this.playingItem;
              if (!l) {
                this.checkBuffer();
                return;
              }
              if (
                (n &&
                  this.schedule.resetErrorsInRange(s, s - a) &&
                  this.updateSchedule(!0),
                this.checkBuffer(),
                (n && s < l.start) || s >= l.end)
              ) {
                let c = this.findItemIndex(l),
                  f = this.schedule.findItemIndexAtTime(s);
                if (
                  (f === -1 &&
                    ((f = c + (n ? -1 : 1)),
                    this.log(
                      `seeked ${
                        n ? 'back ' : ''
                      }to position not covered by schedule ${s} (resolving from ${c} to ${f})`
                    )),
                  !this.isInterstitial(l) &&
                    (i = this.media) != null &&
                    i.paused &&
                    (this.shouldPlay = !1),
                  !n && f > c)
                ) {
                  let g = this.schedule.findJumpRestrictedIndex(c + 1, f);
                  if (g > c) {
                    this.setSchedulePosition(g);
                    return;
                  }
                }
                this.setSchedulePosition(f);
                return;
              }
              let o = this.playingAsset;
              if (!o) {
                if (this.playingLastItem && this.isInterstitial(l)) {
                  let c = l.event.assetList[0];
                  c &&
                    ((this.endedItem = this.playingItem),
                    (this.playingItem = null),
                    this.setScheduleToAssetAtTime(s, c));
                }
                return;
              }
              let d = o.timelineStart,
                u = o.duration || 0;
              ((n && s < d) || s >= d + u) &&
                ((r = l.event) != null &&
                  r.appendInPlace &&
                  (this.clearInterstitial(l.event, l),
                  this.flushFrontBuffer(s)),
                this.setScheduleToAssetAtTime(s, o));
            }),
            (this.onTimeupdate = () => {
              let i = this.currentTime;
              if (
                i === void 0 ||
                this.playbackDisabled ||
                !(i > this.timelinePos)
              )
                return;
              (this.timelinePos = i),
                i > this.bufferedPos && this.checkBuffer();
              let r = this.playingItem;
              if (!r || this.playingLastItem) return;
              if (i >= r.end) {
                this.timelinePos = r.end;
                let a = this.findItemIndex(r);
                this.setSchedulePosition(a + 1);
              }
              let s = this.playingAsset;
              s &&
                i >= s.timelineStart + (s.duration || 0) &&
                this.setScheduleToAssetAtTime(i, s);
            }),
            (this.onScheduleUpdate = (i, r) => {
              let s = this.schedule;
              if (!s) return;
              let a = this.playingItem,
                n = s.events || [],
                l = s.items || [],
                o = s.durations,
                d = i.map((E) => E.identifier),
                u = !!(n.length || d.length);
              (u || r) &&
                this.log(`INTERSTITIALS_UPDATED (${n.length}): ${n}
Schedule: ${l.map((E) => zt(E))} pos: ${this.timelinePos}`),
                d.length && this.log(`Removed events ${d}`);
              let c = null,
                f = null;
              a &&
                ((c = this.updateItem(a, this.timelinePos)),
                this.itemsMatch(a, c)
                  ? (this.playingItem = c)
                  : (this.waitingItem = this.endedItem = null)),
                (this.waitingItem = this.updateItem(this.waitingItem)),
                (this.endedItem = this.updateItem(this.endedItem));
              let g = this.bufferingItem;
              if (
                (g &&
                  ((f = this.updateItem(g, this.bufferedPos)),
                  this.itemsMatch(g, f)
                    ? (this.bufferingItem = f)
                    : g.event &&
                      ((this.bufferingItem = this.playingItem),
                      this.clearInterstitial(g.event, null))),
                i.forEach((E) => {
                  E.assetList.forEach((m) => {
                    this.clearAssetPlayer(m.identifier, null);
                  });
                }),
                this.playerQueue.forEach((E) => {
                  if (E.interstitial.appendInPlace) {
                    let m = E.assetItem.timelineStart,
                      y = E.timelineOffset - m;
                    if (y)
                      try {
                        E.timelineOffset = m;
                      } catch (S) {
                        Math.abs(y) > 0.025 &&
                          this.warn(
                            `${S} ("${E.assetId}" ${E.timelineOffset}->${m})`
                          );
                      }
                  }
                }),
                u || r)
              ) {
                if (
                  (this.hls.trigger(p.INTERSTITIALS_UPDATED, {
                    events: n.slice(0),
                    schedule: l.slice(0),
                    durations: o,
                    removedIds: d,
                  }),
                  this.isInterstitial(a) && d.includes(a.event.identifier))
                ) {
                  this.warn(
                    `Interstitial "${a.event.identifier}" removed while playing`
                  ),
                    this.primaryFallback(a.event);
                  return;
                }
                a && this.trimInPlace(c, a),
                  g && f !== c && this.trimInPlace(f, g),
                  this.checkBuffer();
              }
            }),
            (this.hls = t),
            (this.HlsPlayerClass = e),
            (this.assetListLoader = new Tl(t)),
            (this.schedule = new vl(this.onScheduleUpdate, t.logger)),
            this.registerListeners();
        }
        registerListeners() {
          let t = this.hls;
          t &&
            (t.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.on(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this),
            t.on(p.AUDIO_TRACK_UPDATED, this.onAudioTrackUpdated, this),
            t.on(p.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this),
            t.on(p.SUBTITLE_TRACK_UPDATED, this.onSubtitleTrackUpdated, this),
            t.on(p.EVENT_CUE_ENTER, this.onInterstitialCueEnter, this),
            t.on(p.ASSET_LIST_LOADED, this.onAssetListLoaded, this),
            t.on(p.BUFFER_APPENDED, this.onBufferAppended, this),
            t.on(p.BUFFER_FLUSHED, this.onBufferFlushed, this),
            t.on(p.BUFFERED_TO_END, this.onBufferedToEnd, this),
            t.on(p.MEDIA_ENDED, this.onMediaEnded, this),
            t.on(p.ERROR, this.onError, this),
            t.on(p.DESTROYING, this.onDestroying, this));
        }
        unregisterListeners() {
          let t = this.hls;
          t &&
            (t.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.off(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this),
            t.off(p.AUDIO_TRACK_UPDATED, this.onAudioTrackUpdated, this),
            t.off(p.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this),
            t.off(p.SUBTITLE_TRACK_UPDATED, this.onSubtitleTrackUpdated, this),
            t.off(p.EVENT_CUE_ENTER, this.onInterstitialCueEnter, this),
            t.off(p.ASSET_LIST_LOADED, this.onAssetListLoaded, this),
            t.off(p.BUFFER_CODECS, this.onBufferCodecs, this),
            t.off(p.BUFFER_APPENDED, this.onBufferAppended, this),
            t.off(p.BUFFER_FLUSHED, this.onBufferFlushed, this),
            t.off(p.BUFFERED_TO_END, this.onBufferedToEnd, this),
            t.off(p.MEDIA_ENDED, this.onMediaEnded, this),
            t.off(p.ERROR, this.onError, this),
            t.off(p.DESTROYING, this.onDestroying, this));
        }
        startLoad() {
          this.resumeBuffering();
        }
        stopLoad() {
          this.pauseBuffering();
        }
        resumeBuffering() {
          var t;
          (t = this.getBufferingPlayer()) == null || t.resumeBuffering();
        }
        pauseBuffering() {
          var t;
          (t = this.getBufferingPlayer()) == null || t.pauseBuffering();
        }
        destroy() {
          this.unregisterListeners(),
            this.stopLoad(),
            this.assetListLoader && this.assetListLoader.destroy(),
            this.emptyPlayerQueue(),
            this.clearScheduleState(),
            this.schedule && this.schedule.destroy(),
            (this.media =
              this.detachedData =
              this.mediaSelection =
              this.requiredTracks =
              this.altSelection =
              this.schedule =
              this.manager =
                null),
            (this.hls = this.HlsPlayerClass = this.log = null),
            (this.assetListLoader = null),
            (this.onPlay =
              this.onPause =
              this.onSeeking =
              this.onTimeupdate =
                null),
            (this.onScheduleUpdate = null);
        }
        onDestroying() {
          let t = this.primaryMedia || this.media;
          t && this.removeMediaListeners(t);
        }
        removeMediaListeners(t) {
          Bt(t, 'play', this.onPlay),
            Bt(t, 'pause', this.onPause),
            Bt(t, 'seeking', this.onSeeking),
            Bt(t, 'timeupdate', this.onTimeupdate);
        }
        onMediaAttaching(t, e) {
          let i = (this.media = e.media);
          Nt(i, 'seeking', this.onSeeking),
            Nt(i, 'timeupdate', this.onTimeupdate),
            Nt(i, 'play', this.onPlay),
            Nt(i, 'pause', this.onPause);
        }
        onMediaAttached(t, e) {
          let i = this.effectivePlayingItem,
            r = this.detachedData;
          if (((this.detachedData = null), i === null)) this.checkStart();
          else if (!r) {
            this.clearScheduleState();
            let s = this.findItemIndex(i);
            this.setSchedulePosition(s);
          }
        }
        clearScheduleState() {
          this.log('clear schedule state'),
            (this.playingItem =
              this.bufferingItem =
              this.waitingItem =
              this.endedItem =
              this.playingAsset =
              this.endedAsset =
              this.bufferingAsset =
                null);
        }
        onMediaDetaching(t, e) {
          let i = !!e.transferMedia,
            r = this.media;
          if (
            ((this.media = null),
            !i && (r && this.removeMediaListeners(r), this.detachedData))
          ) {
            let s = this.getBufferingPlayer();
            s &&
              (this.log(`Removing schedule state for detachedData and ${s}`),
              (this.playingAsset =
                this.endedAsset =
                this.bufferingAsset =
                this.bufferingItem =
                this.waitingItem =
                this.detachedData =
                  null),
              s.detachMedia()),
              (this.shouldPlay = !1);
          }
        }
        get interstitialsManager() {
          if (!this.hls) return null;
          if (this.manager) return this.manager;
          let t = this,
            e = () => t.bufferingItem || t.waitingItem,
            i = (u) => u && t.getAssetPlayer(u.identifier),
            r = (u, c, f, g, E) => {
              if (u) {
                let m = u[c].start,
                  y = u.event;
                if (y) {
                  if (c === 'playout' || y.timelineOccupancy !== Li.Point) {
                    let S = i(f);
                    S?.interstitial === y &&
                      (m += S.assetItem.startOffset + S[E]);
                  }
                } else m += (g === 'bufferedPos' ? a() : t[g]) - u.start;
                return m;
              }
              return 0;
            },
            s = (u, c) => {
              var f, g;
              if (
                u !== 0 &&
                c !== 'primary' &&
                (f = t.schedule) != null &&
                f.length
              ) {
                let E = t.schedule.findItemIndexAtTime(u),
                  m = (g = t.schedule.items) == null ? void 0 : g[E];
                if (m) return u + (m[c].start - m.start);
              }
              return u;
            },
            a = () => {
              let u = t.bufferedPos;
              return u === Number.MAX_VALUE ? n('primary') : Math.max(u, 0);
            },
            n = (u) => {
              var c, f;
              return (c = t.primaryDetails) != null && c.live
                ? t.primaryDetails.edge
                : ((f = t.schedule) == null ? void 0 : f.durations[u]) || 0;
            },
            l = (u, c) => {
              var f, g;
              let E = t.effectivePlayingItem;
              if (
                (E != null && (f = E.event) != null && f.restrictions.skip) ||
                !t.schedule
              )
                return;
              t.log(`seek to ${u} "${c}"`);
              let m = t.effectivePlayingItem,
                y = t.schedule.findItemIndexAtTime(u, c),
                S = (g = t.schedule.items) == null ? void 0 : g[y],
                T = t.getBufferingPlayer(),
                A = T?.interstitial,
                R = A?.appendInPlace,
                I = m && t.itemsMatch(m, S);
              if (m && (R || I)) {
                let v = i(t.playingAsset),
                  _ = v?.media || t.primaryMedia;
                if (_) {
                  let L =
                      c === 'primary'
                        ? _.currentTime
                        : r(m, c, t.playingAsset, 'timelinePos', 'currentTime'),
                    C = u - L,
                    M = (R ? L : _.currentTime) + C;
                  if (M >= 0 && (!v || R || M <= v.duration)) {
                    _.currentTime = M;
                    return;
                  }
                }
              }
              if (S) {
                let v = u;
                if (c !== 'primary') {
                  let L = u - S[c].start;
                  v = S.start + L;
                }
                let _ = !t.isInterstitial(S);
                if (
                  (!t.isInterstitial(m) || m.event.appendInPlace) &&
                  (_ || S.event.appendInPlace)
                ) {
                  let L = t.media || (R ? T?.media : null);
                  L && (L.currentTime = v);
                } else if (m) {
                  let L = t.findItemIndex(m);
                  if (y > L) {
                    let M = t.schedule.findJumpRestrictedIndex(L + 1, y);
                    if (M > L) {
                      t.setSchedulePosition(M);
                      return;
                    }
                  }
                  let C = 0;
                  if (_) (t.timelinePos = v), t.checkBuffer();
                  else {
                    let M = S.event.assetList,
                      G = u - (S[c] || S).start;
                    for (let k = M.length; k--; ) {
                      let P = M[k];
                      if (
                        P.duration &&
                        G >= P.startOffset &&
                        G < P.startOffset + P.duration
                      ) {
                        C = k;
                        break;
                      }
                    }
                  }
                  t.setSchedulePosition(y, C);
                }
              }
            },
            o = () => {
              let u = t.effectivePlayingItem;
              if (t.isInterstitial(u)) return u;
              let c = e();
              return t.isInterstitial(c) ? c : null;
            },
            d = {
              get bufferedEnd() {
                let u = e(),
                  c = t.bufferingItem;
                if (c && c === u) {
                  var f;
                  return (
                    r(
                      c,
                      'playout',
                      t.bufferingAsset,
                      'bufferedPos',
                      'bufferedEnd'
                    ) - c.playout.start ||
                    ((f = t.bufferingAsset) == null ? void 0 : f.startOffset) ||
                    0
                  );
                }
                return 0;
              },
              get currentTime() {
                let u = o(),
                  c = t.effectivePlayingItem;
                return c && c === u
                  ? r(
                      c,
                      'playout',
                      t.effectivePlayingAsset,
                      'timelinePos',
                      'currentTime'
                    ) - c.playout.start
                  : 0;
              },
              set currentTime(u) {
                let c = o(),
                  f = t.effectivePlayingItem;
                f && f === c && l(u + f.playout.start, 'playout');
              },
              get duration() {
                let u = o();
                return u ? u.playout.end - u.playout.start : 0;
              },
              get assetPlayers() {
                var u;
                let c = (u = o()) == null ? void 0 : u.event.assetList;
                return c ? c.map((f) => t.getAssetPlayer(f.identifier)) : [];
              },
              get playingIndex() {
                var u;
                let c = (u = o()) == null ? void 0 : u.event;
                return c && t.effectivePlayingAsset
                  ? c.findAssetIndex(t.effectivePlayingAsset)
                  : -1;
              },
              get scheduleItem() {
                return o();
              },
            };
          return (this.manager = {
            get events() {
              var u;
              return (
                ((u = t.schedule) == null || (u = u.events) == null
                  ? void 0
                  : u.slice(0)) || []
              );
            },
            get schedule() {
              var u;
              return (
                ((u = t.schedule) == null || (u = u.items) == null
                  ? void 0
                  : u.slice(0)) || []
              );
            },
            get interstitialPlayer() {
              return o() ? d : null;
            },
            get playerQueue() {
              return t.playerQueue.slice(0);
            },
            get bufferingAsset() {
              return t.bufferingAsset;
            },
            get bufferingItem() {
              return e();
            },
            get bufferingIndex() {
              let u = e();
              return t.findItemIndex(u);
            },
            get playingAsset() {
              return t.effectivePlayingAsset;
            },
            get playingItem() {
              return t.effectivePlayingItem;
            },
            get playingIndex() {
              let u = t.effectivePlayingItem;
              return t.findItemIndex(u);
            },
            primary: {
              get bufferedEnd() {
                return a();
              },
              get currentTime() {
                let u = t.timelinePos;
                return u > 0 ? u : 0;
              },
              set currentTime(u) {
                l(u, 'primary');
              },
              get duration() {
                return n('primary');
              },
              get seekableStart() {
                var u;
                return (
                  ((u = t.primaryDetails) == null ? void 0 : u.fragmentStart) ||
                  0
                );
              },
            },
            integrated: {
              get bufferedEnd() {
                return r(
                  e(),
                  'integrated',
                  t.bufferingAsset,
                  'bufferedPos',
                  'bufferedEnd'
                );
              },
              get currentTime() {
                return r(
                  t.effectivePlayingItem,
                  'integrated',
                  t.effectivePlayingAsset,
                  'timelinePos',
                  'currentTime'
                );
              },
              set currentTime(u) {
                l(u, 'integrated');
              },
              get duration() {
                return n('integrated');
              },
              get seekableStart() {
                var u;
                return s(
                  ((u = t.primaryDetails) == null ? void 0 : u.fragmentStart) ||
                    0,
                  'integrated'
                );
              },
            },
            skip: () => {
              let u = t.effectivePlayingItem,
                c = u?.event;
              if (c && !c.restrictions.skip) {
                let f = t.findItemIndex(u);
                c.appendInPlace
                  ? l(u.playout.start + u.event.duration + 0.001, 'playout')
                  : t.advanceAfterAssetEnded(c, f, 1 / 0);
              }
            },
          });
        }
        get effectivePlayingItem() {
          return this.waitingItem || this.playingItem || this.endedItem;
        }
        get effectivePlayingAsset() {
          return this.playingAsset || this.endedAsset;
        }
        get playingLastItem() {
          var t;
          let e = this.playingItem,
            i = (t = this.schedule) == null ? void 0 : t.items;
          return (
            !!this.playbackStarted &&
            !!e &&
            !!i &&
            this.findItemIndex(e) === i.length - 1
          );
        }
        get playbackStarted() {
          return this.effectivePlayingItem !== null;
        }
        get currentTime() {
          var t, e;
          if (this.mediaSelection === null) return;
          let i = this.waitingItem || this.playingItem;
          if (this.isInterstitial(i) && !i.event.appendInPlace) return;
          let r = this.media;
          !r &&
            (t = this.bufferingItem) != null &&
            (t = t.event) != null &&
            t.appendInPlace &&
            (r = this.primaryMedia);
          let s = (e = r) == null ? void 0 : e.currentTime;
          if (s !== void 0 && Y(s)) return s;
        }
        get primaryMedia() {
          var t;
          return (
            this.media ||
            ((t = this.detachedData) == null ? void 0 : t.media) ||
            null
          );
        }
        isInterstitial(t) {
          return !!(t != null && t.event);
        }
        retreiveMediaSource(t, e) {
          let i = this.getAssetPlayer(t);
          i && this.transferMediaFromPlayer(i, e);
        }
        transferMediaFromPlayer(t, e) {
          let i = t.interstitial.appendInPlace,
            r = t.media;
          if (i && r === this.primaryMedia) {
            if (
              ((this.bufferingAsset = null),
              (!e || (this.isInterstitial(e) && !e.event.appendInPlace)) &&
                e &&
                r)
            ) {
              this.detachedData = { media: r };
              return;
            }
            let s = t.transferMedia();
            this.log(`transfer MediaSource from ${t} ${yt(s)}`),
              (this.detachedData = s);
          } else e && r && (this.shouldPlay || (this.shouldPlay = !r.paused));
        }
        transferMediaTo(t, e) {
          var i, r;
          let s;
          if (t.media === e) return;
          let a = null,
            n = this.hls,
            l = t !== n,
            o = l && t.interstitial.appendInPlace,
            d = (i = this.detachedData) == null ? void 0 : i.mediaSource;
          if (n.media)
            o && ((a = n.transferMedia()), (this.detachedData = a)),
              (s = 'Primary');
          else if (d) {
            let g = this.getBufferingPlayer();
            g
              ? ((a = g.transferMedia()), (s = `${g}`))
              : (s = 'detached MediaSource');
          } else s = 'detached media';
          if (!a) {
            if (d)
              (a = this.detachedData),
                this.log(`using detachedData: MediaSource ${yt(a)}`);
            else if (!this.detachedData || n.media === e) {
              let g = this.playerQueue;
              g.length > 1 &&
                g.forEach((E) => {
                  if (l && E.interstitial.appendInPlace !== o) {
                    let m = E.interstitial;
                    this.clearInterstitial(E.interstitial, null),
                      (m.appendInPlace = !1),
                      m.appendInPlace &&
                        this.warn(
                          `Could not change append strategy for queued assets ${m}`
                        );
                  }
                }),
                this.hls.detachMedia(),
                (this.detachedData = { media: e });
            }
          }
          let u =
              a &&
              'mediaSource' in a &&
              ((r = a.mediaSource) == null ? void 0 : r.readyState) !==
                'closed',
            c = u && a ? a : e;
          this.log(
            `${u ? 'transfering MediaSource' : 'attaching media'} to ${
              l ? t : 'Primary'
            } from ${s} (media.currentTime: ${e.currentTime})`
          );
          let f = this.schedule;
          if (c === a && f) {
            let g = l && t.assetId === f.assetIdAtEnd;
            c.overrides = {
              duration: f.duration,
              endOfStream: !l || g,
              cueRemoval: !l,
            };
          }
          t.attachMedia(c);
        }
        onInterstitialCueEnter() {
          this.onTimeupdate();
        }
        checkStart() {
          let t = this.schedule,
            e = t?.events;
          if (!e || this.playbackDisabled || !this.media) return;
          this.bufferedPos === -1 && (this.bufferedPos = 0);
          let i = this.timelinePos,
            r = this.effectivePlayingItem;
          if (i === -1) {
            let s = this.hls.startPosition;
            if (
              (this.log(Ii('checkStart', s)),
              (this.timelinePos = s),
              e.length && e[0].cue.pre)
            ) {
              let a = t.findEventIndex(e[0].identifier);
              this.setSchedulePosition(a);
            } else if (s >= 0 || !this.primaryLive) {
              let a = (this.timelinePos = s > 0 ? s : 0),
                n = t.findItemIndexAtTime(a);
              this.setSchedulePosition(n);
            }
          } else if (r && !this.playingItem) {
            let s = t.findItemIndex(r);
            this.setSchedulePosition(s);
          }
        }
        advanceAssetBuffering(t, e) {
          let i = t.event,
            r = i.findAssetIndex(e),
            s = Dr(i, r);
          if (i.isAssetPastPlayoutLimit(s)) {
            if (this.schedule) {
              var a;
              let n =
                (a = this.schedule.items) == null
                  ? void 0
                  : a[this.findItemIndex(t) + 1];
              n && this.bufferedToItem(n);
            }
          } else this.bufferedToEvent(t, s);
        }
        advanceAfterAssetEnded(t, e, i) {
          let r = Dr(t, i);
          if (t.isAssetPastPlayoutLimit(r)) {
            if (this.schedule) {
              let s = this.schedule.items;
              if (s) {
                let a = e + 1;
                if (a >= s.length) {
                  this.setSchedulePosition(-1);
                  return;
                }
                let n = t.resumeTime;
                this.timelinePos < n &&
                  (this.log(Ii('advanceAfterAssetEnded', n)),
                  (this.timelinePos = n),
                  t.appendInPlace && this.advanceInPlace(n),
                  this.checkBuffer(this.bufferedPos < n)),
                  this.setSchedulePosition(a);
              }
            }
          } else {
            if (t.appendInPlace) {
              let s = t.assetList[r];
              s && this.advanceInPlace(s.timelineStart);
            }
            this.setSchedulePosition(e, r);
          }
        }
        setScheduleToAssetAtTime(t, e) {
          let i = this.schedule;
          if (!i) return;
          let r = e.parentIdentifier,
            s = i.getEvent(r);
          if (s) {
            let a = i.findEventIndex(r),
              n = i.findAssetIndex(s, t);
            this.advanceAfterAssetEnded(s, a, n - 1);
          }
        }
        setSchedulePosition(t, e) {
          var i, r, s;
          let a = (i = this.schedule) == null ? void 0 : i.items;
          if (!a || this.playbackDisabled) return;
          let n = t >= 0 ? a[t] : null;
          this.log(
            `setSchedulePosition ${t}, ${e} (${n && zt(n)}) pos: ${
              this.timelinePos
            }`
          );
          let l = this.waitingItem || this.playingItem,
            o = this.playingLastItem;
          if (this.isInterstitial(l)) {
            let d = l.event,
              u = this.playingAsset,
              c = u?.identifier,
              f = c ? this.getAssetPlayer(c) : null;
            if (
              f &&
              c &&
              (!this.eventItemsMatch(l, n) ||
                (e !== void 0 && c !== d.assetList[e].identifier))
            ) {
              let g = d.findAssetIndex(u);
              if (
                (this.log(
                  `INTERSTITIAL_ASSET_ENDED ${g + 1}/${d.assetList.length} ${Ce(
                    u
                  )}`
                ),
                (this.endedAsset = u),
                (this.playingAsset = null),
                this.hls.trigger(p.INTERSTITIAL_ASSET_ENDED, {
                  asset: u,
                  assetListIndex: g,
                  event: d,
                  schedule: a.slice(0),
                  scheduleIndex: t,
                  player: f,
                }),
                l !== this.playingItem)
              ) {
                this.itemsMatch(l, this.playingItem) &&
                  !this.playingAsset &&
                  this.advanceAfterAssetEnded(
                    d,
                    this.findItemIndex(this.playingItem),
                    g
                  );
                return;
              }
              this.retreiveMediaSource(c, n),
                f.media &&
                  !((r = this.detachedData) != null && r.mediaSource) &&
                  f.detachMedia();
            }
            if (
              !this.eventItemsMatch(l, n) &&
              ((this.endedItem = l),
              (this.playingItem = null),
              this.log(`INTERSTITIAL_ENDED ${d} ${zt(l)}`),
              (d.hasPlayed = !0),
              this.hls.trigger(p.INTERSTITIAL_ENDED, {
                event: d,
                schedule: a.slice(0),
                scheduleIndex: t,
              }),
              d.cue.once)
            ) {
              this.updateSchedule();
              let g = (s = this.schedule) == null ? void 0 : s.items;
              if (n && g) {
                let E = this.findItemIndex(n);
                this.advanceSchedule(E, g, e, l, o);
              }
              return;
            }
          }
          this.advanceSchedule(t, a, e, l, o);
        }
        advanceSchedule(t, e, i, r, s) {
          let a = this.schedule;
          if (!a) return;
          let n = e[t] || null,
            l = this.primaryMedia,
            o = this.playerQueue;
          if (
            (o.length &&
              o.forEach((d) => {
                let u = d.interstitial,
                  c = a.findEventIndex(u.identifier);
                (c < t || c > t + 1) && this.clearInterstitial(u, n);
              }),
            this.isInterstitial(n))
          ) {
            this.timelinePos = Math.min(
              Math.max(this.timelinePos, n.start),
              n.end
            );
            let d = n.event;
            if (i === void 0) {
              i = a.findAssetIndex(d, this.timelinePos);
              let g = Dr(d, i - 1);
              if (
                d.isAssetPastPlayoutLimit(g) ||
                (d.appendInPlace && this.timelinePos === n.end)
              ) {
                this.advanceAfterAssetEnded(d, t, i);
                return;
              }
              i = g;
            }
            let u = this.waitingItem;
            this.assetsBuffered(n, l) || this.setBufferingItem(n);
            let c = this.preloadAssets(d, i);
            if (
              (this.eventItemsMatch(n, u || r) ||
                ((this.waitingItem = n),
                this.log(
                  `INTERSTITIAL_STARTED ${zt(n)} ${
                    d.appendInPlace ? 'append in place' : ''
                  }`
                ),
                this.hls.trigger(p.INTERSTITIAL_STARTED, {
                  event: d,
                  schedule: e.slice(0),
                  scheduleIndex: t,
                })),
              !d.assetListLoaded)
            ) {
              this.log(`Waiting for ASSET-LIST to complete loading ${d}`);
              return;
            }
            if (
              (d.assetListLoader &&
                (d.assetListLoader.destroy(), (d.assetListLoader = void 0)),
              !l)
            ) {
              this.log(`Waiting for attachMedia to start Interstitial ${d}`);
              return;
            }
            (this.waitingItem = this.endedItem = null), (this.playingItem = n);
            let f = d.assetList[i];
            if (!f) {
              this.advanceAfterAssetEnded(d, t, i || 0);
              return;
            }
            if (
              (c || (c = this.getAssetPlayer(f.identifier)),
              c === null || c.destroyed)
            ) {
              let g = d.assetList.length;
              this.warn(`asset ${i + 1}/${g} player destroyed ${d}`),
                (c = this.createAssetPlayer(d, f, i)).loadSource();
            }
            if (
              !this.eventItemsMatch(n, this.bufferingItem) &&
              d.appendInPlace &&
              this.isAssetBuffered(f)
            )
              return;
            this.startAssetPlayer(c, i, e, t, l),
              this.shouldPlay && Ha(c.media);
          } else
            n
              ? (this.resumePrimary(n, t, r),
                this.shouldPlay && Ha(this.hls.media))
              : s &&
                this.isInterstitial(r) &&
                ((this.endedItem = null),
                (this.playingItem = r),
                r.event.appendInPlace ||
                  this.attachPrimary(a.durations.primary, null));
        }
        get playbackDisabled() {
          return this.hls.config.enableInterstitialPlayback === !1;
        }
        get primaryDetails() {
          var t;
          return (t = this.mediaSelection) == null ? void 0 : t.main.details;
        }
        get primaryLive() {
          var t;
          return !!((t = this.primaryDetails) != null && t.live);
        }
        resumePrimary(t, e, i) {
          var r, s;
          if (
            ((this.playingItem = t),
            (this.playingAsset = this.endedAsset = null),
            (this.waitingItem = this.endedItem = null),
            this.bufferedToItem(t),
            this.log(`resuming ${zt(t)}`),
            !((r = this.detachedData) != null && r.mediaSource))
          ) {
            let n = this.timelinePos;
            (n < t.start || n >= t.end) &&
              ((n = this.getPrimaryResumption(t, e)),
              this.log(Ii('resumePrimary', n)),
              (this.timelinePos = n)),
              this.attachPrimary(n, t);
          }
          if (!i) return;
          let a = (s = this.schedule) == null ? void 0 : s.items;
          a &&
            (this.log(`INTERSTITIALS_PRIMARY_RESUMED ${zt(t)}`),
            this.hls.trigger(p.INTERSTITIALS_PRIMARY_RESUMED, {
              schedule: a.slice(0),
              scheduleIndex: e,
            }),
            this.checkBuffer());
        }
        getPrimaryResumption(t, e) {
          let i = t.start;
          if (this.primaryLive) {
            let r = this.primaryDetails;
            if (e === 0) return this.hls.startPosition;
            if (r && (i < r.fragmentStart || i > r.edge))
              return this.hls.liveSyncPosition || -1;
          }
          return i;
        }
        isAssetBuffered(t) {
          let e = this.getAssetPlayer(t.identifier);
          return e != null && e.hls
            ? e.hls.bufferedToEnd
            : rt.bufferInfo(this.primaryMedia, this.timelinePos, 0).end + 1 >=
                t.timelineStart + (t.duration || 0);
        }
        attachPrimary(t, e, i) {
          e
            ? this.setBufferingItem(e)
            : (this.bufferingItem = this.playingItem),
            (this.bufferingAsset = null);
          let r = this.primaryMedia;
          if (!r) return;
          let s = this.hls;
          s.media
            ? this.checkBuffer()
            : (this.transferMediaTo(s, r),
              i && this.startLoadingPrimaryAt(t, i)),
            i ||
              (this.log(Ii('attachPrimary', t)),
              (this.timelinePos = t),
              this.startLoadingPrimaryAt(t, i));
        }
        startLoadingPrimaryAt(t, e) {
          var i;
          let r = this.hls;
          !r.loadingEnabled ||
          !r.media ||
          Math.abs(
            (((i = r.mainForwardBufferInfo) == null ? void 0 : i.start) ||
              r.media.currentTime) - t
          ) > 0.5
            ? r.startLoad(t, e)
            : r.bufferingEnabled || r.resumeBuffering();
        }
        onManifestLoading() {
          var t;
          this.stopLoad(),
            (t = this.schedule) == null || t.reset(),
            this.emptyPlayerQueue(),
            this.clearScheduleState(),
            (this.shouldPlay = !1),
            (this.bufferedPos = this.timelinePos = -1),
            (this.mediaSelection =
              this.altSelection =
              this.manager =
              this.requiredTracks =
                null),
            this.hls.off(p.BUFFER_CODECS, this.onBufferCodecs, this),
            this.hls.on(p.BUFFER_CODECS, this.onBufferCodecs, this);
        }
        onLevelUpdated(t, e) {
          if (e.level === -1 || !this.schedule) return;
          let i = this.hls.levels[e.level],
            r = J(
              J({}, this.mediaSelection || this.altSelection),
              {},
              { main: i }
            );
          (this.mediaSelection = r),
            this.schedule.parseInterstitialDateRanges(
              r,
              this.hls.config.interstitialAppendInPlace
            ),
            !this.effectivePlayingItem &&
              this.schedule.items &&
              this.checkStart();
        }
        onAudioTrackUpdated(t, e) {
          let i = this.hls.audioTracks[e.id],
            r = this.mediaSelection;
          if (!r) {
            this.altSelection = J(J({}, this.altSelection), {}, { audio: i });
            return;
          }
          let s = J(J({}, r), {}, { audio: i });
          this.mediaSelection = s;
        }
        onSubtitleTrackUpdated(t, e) {
          let i = this.hls.subtitleTracks[e.id],
            r = this.mediaSelection;
          if (!r) {
            this.altSelection = J(
              J({}, this.altSelection),
              {},
              { subtitles: i }
            );
            return;
          }
          let s = J(J({}, r), {}, { subtitles: i });
          this.mediaSelection = s;
        }
        onAudioTrackSwitching(t, e) {
          let i = us(e);
          this.playerQueue.forEach(
            ({ hls: r }) => r && (r.setAudioOption(e) || r.setAudioOption(i))
          );
        }
        onSubtitleTrackSwitch(t, e) {
          let i = us(e);
          this.playerQueue.forEach(
            ({ hls: r }) =>
              r &&
              (r.setSubtitleOption(e) ||
                (e.id !== -1 && r.setSubtitleOption(i)))
          );
        }
        onBufferCodecs(t, e) {
          let i = e.tracks;
          i && (this.requiredTracks = i);
        }
        onBufferAppended(t, e) {
          this.checkBuffer();
        }
        onBufferFlushed(t, e) {
          let i = this.playingItem;
          if (
            i &&
            !this.itemsMatch(i, this.bufferingItem) &&
            !this.isInterstitial(i)
          ) {
            let r = this.timelinePos;
            (this.bufferedPos = r), this.checkBuffer();
          }
        }
        onBufferedToEnd(t) {
          if (!this.schedule) return;
          let e = this.schedule.events;
          if (this.bufferedPos < Number.MAX_VALUE && e) {
            for (let r = 0; r < e.length; r++) {
              let s = e[r];
              if (s.cue.post) {
                var i;
                let a = this.schedule.findEventIndex(s.identifier),
                  n = (i = this.schedule.items) == null ? void 0 : i[a];
                this.isInterstitial(n) &&
                  this.eventItemsMatch(n, this.bufferingItem) &&
                  this.bufferedToItem(n, 0);
                break;
              }
            }
            this.bufferedPos = Number.MAX_VALUE;
          }
        }
        onMediaEnded(t) {
          let e = this.playingItem;
          if (!this.playingLastItem && e) {
            let i = this.findItemIndex(e);
            this.setSchedulePosition(i + 1);
          } else this.shouldPlay = !1;
        }
        updateItem(t, e) {
          var i;
          let r = (i = this.schedule) == null ? void 0 : i.items;
          return (t && r && r[this.findItemIndex(t, e)]) || null;
        }
        trimInPlace(t, e) {
          if (
            this.isInterstitial(t) &&
            t.event.appendInPlace &&
            e.end - t.end > 0.25
          ) {
            t.event.assetList.forEach((s, a) => {
              t.event.isAssetPastPlayoutLimit(a) &&
                this.clearAssetPlayer(s.identifier, null);
            });
            let i = t.end + 0.25,
              r = rt.bufferInfo(this.primaryMedia, i, 0);
            (r.end > i || (r.nextStart || 0) > i) &&
              (this.log(`trim buffered interstitial ${zt(t)} (was ${zt(e)})`),
              this.attachPrimary(i, null, !0),
              this.flushFrontBuffer(i));
          }
        }
        itemsMatch(t, e) {
          return (
            !!e &&
            (t === e ||
              (t.event && e.event && this.eventItemsMatch(t, e)) ||
              (!t.event &&
                !e.event &&
                this.findItemIndex(t) === this.findItemIndex(e)))
          );
        }
        eventItemsMatch(t, e) {
          var i;
          return (
            !!e &&
            (t === e ||
              t.event.identifier ===
                ((i = e.event) == null ? void 0 : i.identifier))
          );
        }
        findItemIndex(t, e) {
          return t && this.schedule ? this.schedule.findItemIndex(t, e) : -1;
        }
        updateSchedule(t = !1) {
          var e;
          let i = this.mediaSelection;
          i && ((e = this.schedule) == null || e.updateSchedule(i, [], t));
        }
        checkBuffer(t) {
          var e;
          let i = (e = this.schedule) == null ? void 0 : e.items;
          if (!i) return;
          let r = rt.bufferInfo(this.primaryMedia, this.timelinePos, 0);
          t && (this.bufferedPos = this.timelinePos),
            t || (t = r.len < 1),
            this.updateBufferedPos(r.end, i, t);
        }
        updateBufferedPos(t, e, i) {
          let r = this.schedule,
            s = this.bufferingItem;
          if (this.bufferedPos > t || !r) return;
          if (e.length === 1 && this.itemsMatch(e[0], s)) {
            this.bufferedPos = t;
            return;
          }
          let a = this.playingItem,
            n = this.findItemIndex(a),
            l = r.findItemIndexAtTime(t);
          if (this.bufferedPos < t) {
            var o;
            let d = this.findItemIndex(s),
              u = Math.min(d + 1, e.length - 1),
              c = e[u];
            if (
              (((l === -1 && s && t >= s.end) ||
                ((o = c.event) != null &&
                  o.appendInPlace &&
                  t + 0.01 >= c.start)) &&
                (l = u),
              this.isInterstitial(s))
            ) {
              let f = s.event;
              if (
                (u - n > 1 && f.appendInPlace === !1) ||
                (f.assetList.length === 0 && f.assetListLoader)
              )
                return;
            }
            if (((this.bufferedPos = t), l > d && l > n))
              this.bufferedToItem(c);
            else {
              let f = this.primaryDetails;
              this.primaryLive &&
                f &&
                t > f.edge - f.targetduration &&
                c.start < f.edge + this.hls.config.interstitialLiveLookAhead &&
                this.isInterstitial(c) &&
                this.preloadAssets(c.event, 0);
            }
          } else
            i &&
              a &&
              !this.itemsMatch(a, s) &&
              (l === n
                ? this.bufferedToItem(a)
                : l === n + 1 && this.bufferedToItem(e[l]));
        }
        assetsBuffered(t, e) {
          return (
            t.event.assetList.length !== 0 &&
            !t.event.assetList.some((i) => {
              let r = this.getAssetPlayer(i.identifier);
              return !(r != null && r.bufferedInPlaceToEnd(e));
            })
          );
        }
        setBufferingItem(t) {
          let e = this.bufferingItem,
            i = this.schedule;
          if (!this.itemsMatch(t, e) && i) {
            let { items: r, events: s } = i;
            if (!r || !s) return e;
            let a = this.isInterstitial(t),
              n = this.getBufferingPlayer();
            (this.bufferingItem = t),
              (this.bufferedPos = Math.max(
                t.start,
                Math.min(t.end, this.timelinePos)
              ));
            let l = n ? n.remaining : e ? e.end - this.timelinePos : 0;
            if (
              (this.log(
                `INTERSTITIALS_BUFFERED_TO_BOUNDARY ${zt(t)}` +
                  (e ? ` (${l.toFixed(2)} remaining)` : '')
              ),
              !this.playbackDisabled)
            )
              if (a) {
                let o = i.findAssetIndex(t.event, this.bufferedPos);
                t.event.assetList.forEach((d, u) => {
                  let c = this.getAssetPlayer(d.identifier);
                  c && (u === o && c.loadSource(), c.resumeBuffering());
                });
              } else
                this.hls.resumeBuffering(),
                  this.playerQueue.forEach((o) => o.pauseBuffering());
            this.hls.trigger(p.INTERSTITIALS_BUFFERED_TO_BOUNDARY, {
              events: s.slice(0),
              schedule: r.slice(0),
              bufferingIndex: this.findItemIndex(t),
              playingIndex: this.findItemIndex(this.playingItem),
            });
          } else this.bufferingItem !== t && (this.bufferingItem = t);
          return e;
        }
        bufferedToItem(t, e = 0) {
          let i = this.setBufferingItem(t);
          if (!this.playbackDisabled) {
            if (this.isInterstitial(t)) this.bufferedToEvent(t, e);
            else if (i !== null) {
              this.bufferingAsset = null;
              let r = this.detachedData;
              r && r.mediaSource
                ? this.attachPrimary(t.start, t, !0)
                : this.preloadPrimary(t);
            }
          }
        }
        preloadPrimary(t) {
          let e = this.findItemIndex(t),
            i = this.getPrimaryResumption(t, e);
          this.startLoadingPrimaryAt(i);
        }
        bufferedToEvent(t, e) {
          let i = t.event,
            r = i.assetList.length === 0 && !i.assetListLoader,
            s = i.cue.once;
          if (r || !s) {
            let a = this.preloadAssets(i, e);
            if (a != null && a.interstitial.appendInPlace) {
              let n = this.primaryMedia;
              n && this.bufferAssetPlayer(a, n);
            }
          }
        }
        preloadAssets(t, e) {
          let i = t.assetUrl,
            r = t.assetList.length,
            s = r === 0 && !t.assetListLoader,
            a = t.cue.once;
          if (s) {
            let l,
              o = t.timelineStart;
            if (t.appendInPlace) {
              var n;
              let c = this.playingItem;
              this.isInterstitial(c) ||
                (c == null || (n = c.nextEvent) == null
                  ? void 0
                  : n.identifier) !== t.identifier ||
                this.flushFrontBuffer(o + 0.25);
            }
            let d = 0;
            if (
              (!this.playingItem &&
                this.primaryLive &&
                (d = this.hls.startPosition) === -1 &&
                (d = this.hls.liveSyncPosition || 0),
              d && !(t.cue.pre || t.cue.post))
            ) {
              let c = d - o;
              c > 0 && (l = Math.round(1e3 * c) / 1e3);
            }
            if (
              (this.log(
                `Load interstitial asset ${e + 1}/${i ? 1 : r} ${t}${
                  l ? ` live-start: ${d} start-offset: ${l}` : ''
                }`
              ),
              i)
            )
              return this.createAsset(t, 0, 0, o, t.duration, i);
            let u = this.assetListLoader.loadAssetList(t, l);
            u && (t.assetListLoader = u);
          } else if (!a && r) {
            for (let o = e; o < r; o++) {
              let d = t.assetList[o],
                u = this.getAssetPlayerQueueIndex(d.identifier);
              (u === -1 || this.playerQueue[u].destroyed) &&
                !d.error &&
                this.createAssetPlayer(t, d, o);
            }
            let l = t.assetList[e];
            if (l) {
              let o = this.getAssetPlayer(l.identifier);
              return o && o.loadSource(), o;
            }
          }
          return null;
        }
        flushFrontBuffer(t) {
          let e = this.requiredTracks;
          e &&
            (this.log(`Removing front buffer starting at ${t}`),
            Object.keys(e).forEach((i) => {
              this.hls.trigger(p.BUFFER_FLUSHING, {
                startOffset: t,
                endOffset: 1 / 0,
                type: i,
              });
            }));
        }
        getAssetPlayerQueueIndex(t) {
          let e = this.playerQueue;
          for (let i = 0; i < e.length; i++) if (t === e[i].assetId) return i;
          return -1;
        }
        getAssetPlayer(t) {
          let e = this.getAssetPlayerQueueIndex(t);
          return this.playerQueue[e] || null;
        }
        getBufferingPlayer() {
          let { playerQueue: t, primaryMedia: e } = this;
          if (e) {
            for (let i = 0; i < t.length; i++)
              if (t[i].media === e) return t[i];
          }
          return null;
        }
        createAsset(t, e, i, r, s, a) {
          let n = {
            parentIdentifier: t.identifier,
            identifier: `${t.identifier}-${e + 1}-${He(a)}`,
            duration: s,
            startOffset: i,
            timelineStart: r,
            uri: a,
          };
          return this.createAssetPlayer(t, n, e);
        }
        createAssetPlayer(t, e, i) {
          let r = this.hls,
            s = r.userConfig,
            a = s.videoPreference,
            n = r.loadLevelObj || r.levels[r.currentLevel];
          (a || n) &&
            ((a = at({}, a)),
            n.videoCodec && (a.videoCodec = n.videoCodec),
            n.videoRange && (a.allowedVideoRanges = [n.videoRange]));
          let l = r.audioTracks[r.audioTrack],
            o = r.subtitleTracks[r.subtitleTrack],
            d = 0;
          if (this.primaryLive || t.appendInPlace) {
            let T = this.timelinePos - e.timelineStart;
            if (T > 1) {
              let A = e.duration;
              A && T < A && (d = T);
            }
          }
          let u = e.identifier,
            c = J(
              J({}, s),
              {},
              {
                maxMaxBufferLength: Math.min(180, r.config.maxMaxBufferLength),
                autoStartLoad: !0,
                startFragPrefetch: !0,
                primarySessionId: r.sessionId,
                assetPlayerId: u,
                abrEwmaDefaultEstimate: r.bandwidthEstimate,
                interstitialsController: void 0,
                startPosition: d,
                liveDurationInfinity: !1,
                testBandwidth: !1,
                videoPreference: a,
                audioPreference: l || s.audioPreference,
                subtitlePreference: o || s.subtitlePreference,
              }
            );
          t.appendInPlace &&
            ((t.appendInPlaceStarted = !0),
            e.timelineStart && (c.timelineOffset = e.timelineStart));
          let f = c.cmcd;
          f != null &&
            f.sessionId &&
            f.contentId &&
            (c.cmcd = at({}, f, { contentId: He(e.uri) })),
            this.getAssetPlayer(u) &&
              this.warn(`Duplicate date range identifier ${t} and asset ${u}`);
          let g = new yl(this.HlsPlayerClass, c, t, e);
          this.playerQueue.push(g), (t.assetList[i] = e);
          let E = !0,
            m = (T) => {
              if (T.live) {
                var A;
                let v = Error(`Interstitials MUST be VOD assets ${t}`),
                  _ = {
                    fatal: !0,
                    type: Q.OTHER_ERROR,
                    details: b.INTERSTITIAL_ASSET_ITEM_ERROR,
                    error: v,
                  },
                  L =
                    ((A = this.schedule) == null
                      ? void 0
                      : A.findEventIndex(t.identifier)) || -1;
                this.handleAssetItemError(_, t, L, i, v.message);
                return;
              }
              let R = T.edge - T.fragmentStart,
                I = e.duration;
              (E || I === null || R > I) &&
                ((E = !1),
                this.log(
                  `Interstitial asset "${u}" duration change ${I} > ${R}`
                ),
                (e.duration = R),
                this.updateSchedule());
            };
          g.on(p.LEVEL_UPDATED, (T, { details: A }) => m(A)),
            g.on(p.LEVEL_PTS_UPDATED, (T, { details: A }) => m(A)),
            g.on(p.EVENT_CUE_ENTER, () => this.onInterstitialCueEnter());
          let y = (T, A) => {
            let R = this.getAssetPlayer(u);
            if (R && A.tracks) {
              R.off(p.BUFFER_CODECS, y), (R.tracks = A.tracks);
              let I = this.primaryMedia;
              this.bufferingAsset === R.assetItem &&
                I &&
                !R.media &&
                this.bufferAssetPlayer(R, I);
            }
          };
          g.on(p.BUFFER_CODECS, y),
            g.on(p.BUFFERED_TO_END, () => {
              var T;
              let A = this.getAssetPlayer(u);
              if (
                (this.log(`buffered to end of asset ${A}`),
                !A || !this.schedule)
              )
                return;
              let R = this.schedule.findEventIndex(t.identifier),
                I = (T = this.schedule.items) == null ? void 0 : T[R];
              this.isInterstitial(I) && this.advanceAssetBuffering(I, e);
            });
          let S = (T) => () => {
            if (!this.getAssetPlayer(u) || !this.schedule) return;
            this.shouldPlay = !0;
            let A = this.schedule.findEventIndex(t.identifier);
            this.advanceAfterAssetEnded(t, A, T);
          };
          return (
            g.once(p.MEDIA_ENDED, S(i)),
            g.once(p.PLAYOUT_LIMIT_REACHED, S(1 / 0)),
            g.on(p.ERROR, (T, A) => {
              if (!this.schedule) return;
              let R = this.getAssetPlayer(u);
              if (A.details === b.BUFFER_STALLED_ERROR) {
                if (R != null && R.appendInPlace) {
                  this.handleInPlaceStall(t);
                  return;
                }
                this.onTimeupdate(), this.checkBuffer(!0);
                return;
              }
              this.handleAssetItemError(
                A,
                t,
                this.schedule.findEventIndex(t.identifier),
                i,
                `Asset player error ${A.error} ${t}`
              );
            }),
            g.on(p.DESTROYING, () => {
              if (!this.getAssetPlayer(u) || !this.schedule) return;
              let T = Error(`Asset player destroyed unexpectedly ${u}`),
                A = {
                  fatal: !0,
                  type: Q.OTHER_ERROR,
                  details: b.INTERSTITIAL_ASSET_ITEM_ERROR,
                  error: T,
                };
              this.handleAssetItemError(
                A,
                t,
                this.schedule.findEventIndex(t.identifier),
                i,
                T.message
              );
            }),
            this.log(`INTERSTITIAL_ASSET_PLAYER_CREATED ${Ce(e)}`),
            this.hls.trigger(p.INTERSTITIAL_ASSET_PLAYER_CREATED, {
              asset: e,
              assetListIndex: i,
              event: t,
              player: g,
            }),
            g
          );
        }
        clearInterstitial(t, e) {
          t.assetList.forEach((i) => {
            this.clearAssetPlayer(i.identifier, e);
          }),
            t.reset();
        }
        resetAssetPlayer(t) {
          let e = this.getAssetPlayerQueueIndex(t);
          if (e !== -1) {
            this.log(`reset asset player "${t}" after error`);
            let i = this.playerQueue[e];
            this.transferMediaFromPlayer(i, null), i.resetDetails();
          }
        }
        clearAssetPlayer(t, e) {
          let i = this.getAssetPlayerQueueIndex(t);
          if (i !== -1) {
            let r = this.playerQueue[i];
            this.log(`clear ${r} toSegment: ${e && zt(e)}`),
              this.transferMediaFromPlayer(r, e),
              this.playerQueue.splice(i, 1),
              r.destroy();
          }
        }
        emptyPlayerQueue() {
          let t;
          for (; (t = this.playerQueue.pop()); ) t.destroy();
          this.playerQueue = [];
        }
        startAssetPlayer(t, e, i, r, s) {
          let { interstitial: a, assetItem: n, assetId: l } = t,
            o = a.assetList.length,
            d = this.playingAsset;
          (this.endedAsset = null),
            (this.playingAsset = n),
            (d && d.identifier === l) ||
              (d && (this.clearAssetPlayer(d.identifier, i[r]), delete d.error),
              this.log(`INTERSTITIAL_ASSET_STARTED ${e + 1}/${o} ${Ce(n)}`),
              this.hls.trigger(p.INTERSTITIAL_ASSET_STARTED, {
                asset: n,
                assetListIndex: e,
                event: a,
                schedule: i.slice(0),
                scheduleIndex: r,
                player: t,
              })),
            this.bufferAssetPlayer(t, s);
        }
        bufferAssetPlayer(t, e) {
          var i, r;
          if (!this.schedule) return;
          let { interstitial: s, assetItem: a } = t,
            n = this.schedule.findEventIndex(s.identifier),
            l = (i = this.schedule.items) == null ? void 0 : i[n];
          if (!l) return;
          t.loadSource(), this.setBufferingItem(l), (this.bufferingAsset = a);
          let o = this.getBufferingPlayer();
          if (o === t) return;
          let d = s.appendInPlace;
          if (d && o?.interstitial.appendInPlace === !1) return;
          let u =
            o?.tracks ||
            ((r = this.detachedData) == null ? void 0 : r.tracks) ||
            this.requiredTracks;
          if (d && a !== this.playingAsset) {
            if (!t.tracks) {
              this.log(`Waiting for track info before buffering ${t}`);
              return;
            }
            if (u && !Mt(u, t.tracks)) {
              let c = Error(
                  `Asset ${Ce(a)} SourceBuffer tracks ('${Object.keys(
                    t.tracks
                  )}') are not compatible with primary content tracks ('${Object.keys(
                    u
                  )}')`
                ),
                f = {
                  fatal: !0,
                  type: Q.OTHER_ERROR,
                  details: b.INTERSTITIAL_ASSET_ITEM_ERROR,
                  error: c,
                },
                g = s.findAssetIndex(a);
              this.handleAssetItemError(f, s, n, g, c.message);
              return;
            }
          }
          this.transferMediaTo(t, e);
        }
        handleInPlaceStall(t) {
          let e = this.schedule,
            i = this.primaryMedia;
          if (!e || !i) return;
          let r = i.currentTime,
            s = e.findAssetIndex(t, r),
            a = t.assetList[s];
          if (a) {
            let n = this.getAssetPlayer(a.identifier);
            if (n) {
              let l = n.currentTime || r - a.timelineStart,
                o = n.duration - l;
              if (
                (this.warn(
                  `Stalled at ${l} of ${
                    l + o
                  } in ${n} ${t} (media.currentTime: ${r})`
                ),
                l &&
                  (o / i.playbackRate < 0.5 || n.bufferedInPlaceToEnd(i)) &&
                  n.hls)
              ) {
                let d = e.findEventIndex(t.identifier);
                this.advanceAfterAssetEnded(t, d, s);
              }
            }
          }
        }
        advanceInPlace(t) {
          let e = this.primaryMedia;
          e && e.currentTime < t && (e.currentTime = t);
        }
        handleAssetItemError(t, e, i, r, s) {
          if (t.details === b.BUFFER_STALLED_ERROR) return;
          let a = e.assetList[r] || null;
          if (
            (this.warn(`INTERSTITIAL_ASSET_ERROR ${a && Ce(a)} ${t.error}`),
            !this.schedule)
          )
            return;
          let n = a?.identifier || '',
            l = this.getAssetPlayerQueueIndex(n),
            o = this.playerQueue[l] || null,
            d = this.schedule.items,
            u = at({}, t, {
              fatal: !1,
              errorAction: Le(!0),
              asset: a,
              assetListIndex: r,
              event: e,
              schedule: d,
              scheduleIndex: i,
              player: o,
            });
          if ((this.hls.trigger(p.INTERSTITIAL_ASSET_ERROR, u), !t.fatal))
            return;
          let c = this.playingAsset,
            f = this.bufferingAsset,
            g = Error(s);
          if (
            (a && (this.clearAssetPlayer(n, null), (a.error = g)),
            e.assetList.some((E) => !E.error))
          )
            for (let E = r; E < e.assetList.length; E++)
              this.resetAssetPlayer(e.assetList[E].identifier);
          else e.error = g;
          this.updateSchedule(!0),
            e.error
              ? this.primaryFallback(e)
              : c && c.identifier === n
              ? this.advanceAfterAssetEnded(e, i, r)
              : f &&
                f.identifier === n &&
                this.isInterstitial(this.bufferingItem) &&
                this.advanceAssetBuffering(this.bufferingItem, f);
        }
        primaryFallback(t) {
          let e = t.timelineStart,
            i = this.effectivePlayingItem;
          if (i) {
            this.log(
              `Fallback to primary from event "${
                t.identifier
              }" start: ${e} pos: ${this.timelinePos} playing: ${zt(
                i
              )} error: ${t.error}`
            );
            let r = this.timelinePos;
            r === -1 && (r = this.hls.startPosition);
            let s = this.updateItem(i, r);
            if (
              (this.itemsMatch(i, s) && this.clearInterstitial(t, null),
              t.appendInPlace &&
                (this.attachPrimary(e, null), this.flushFrontBuffer(e)),
              !this.schedule)
            )
              return;
            let a = this.schedule.findItemIndexAtTime(r);
            this.setSchedulePosition(a);
          } else this.checkStart();
        }
        onAssetListLoaded(t, e) {
          var i, r, s;
          let a = e.event,
            n = a.identifier,
            l = e.assetListResponse.ASSETS;
          if (!((i = this.schedule) != null && i.hasEvent(n))) return;
          let o = a.timelineStart,
            d = a.duration,
            u = 0;
          l.forEach((E, m) => {
            let y = parseFloat(E.DURATION);
            this.createAsset(a, m, u, o + u, y, E.URI), (u += y);
          }),
            (a.duration = u),
            this.log(`Loaded asset-list with duration: ${u} (was: ${d}) ${a}`);
          let c = this.waitingItem,
            f = c?.event.identifier === n;
          this.updateSchedule();
          let g = (r = this.bufferingItem) == null ? void 0 : r.event;
          if (f) {
            let E = this.schedule.findEventIndex(n),
              m = (s = this.schedule.items) == null ? void 0 : s[E];
            if (m) {
              if (
                !this.playingItem &&
                this.timelinePos > m.end &&
                this.schedule.findItemIndexAtTime(this.timelinePos) !== E
              ) {
                (a.error = Error(
                  `Interstitial no longer within playback range ${this.timelinePos} ${a}`
                )),
                  this.updateSchedule(!0),
                  this.primaryFallback(a);
                return;
              }
              this.setBufferingItem(m);
            }
            this.setSchedulePosition(E);
          } else if (g?.identifier === n) {
            let E = a.assetList[0];
            if (E) {
              let m = this.getAssetPlayer(E.identifier);
              if (g.appendInPlace) {
                let y = this.primaryMedia;
                m && y && this.bufferAssetPlayer(m, y);
              } else m && m.loadSource();
            }
          }
        }
        onError(t, e) {
          if (this.schedule)
            switch (e.details) {
              case b.ASSET_LIST_PARSING_ERROR:
              case b.ASSET_LIST_LOAD_ERROR:
              case b.ASSET_LIST_LOAD_TIMEOUT: {
                let i = e.interstitial;
                i && (this.updateSchedule(!0), this.primaryFallback(i));
                break;
              }
              case b.BUFFER_STALLED_ERROR: {
                let i = this.endedItem || this.waitingItem || this.playingItem;
                if (this.isInterstitial(i) && i.event.appendInPlace) {
                  this.handleInPlaceStall(i.event);
                  return;
                }
                this.log(
                  `Primary player stall @${this.timelinePos} bufferedPos: ${this.bufferedPos}`
                ),
                  this.onTimeupdate(),
                  this.checkBuffer(!0);
              }
            }
        }
      }
      class Al extends ir {
        constructor(t, e, i) {
          super(t, e, i, 'subtitle-stream-controller', j.SUBTITLE),
            (this.currentTrackId = -1),
            (this.tracksBuffered = []),
            (this.mainDetails = null),
            this.registerListeners();
        }
        onHandlerDestroying() {
          this.unregisterListeners(),
            super.onHandlerDestroying(),
            (this.mainDetails = null);
        }
        registerListeners() {
          super.registerListeners();
          let { hls: t } = this;
          t.on(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.on(p.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this),
            t.on(p.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this),
            t.on(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this),
            t.on(p.SUBTITLE_FRAG_PROCESSED, this.onSubtitleFragProcessed, this),
            t.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this);
        }
        unregisterListeners() {
          super.unregisterListeners();
          let { hls: t } = this;
          t.off(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.off(
              p.SUBTITLE_TRACKS_UPDATED,
              this.onSubtitleTracksUpdated,
              this
            ),
            t.off(p.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this),
            t.off(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this),
            t.off(
              p.SUBTITLE_FRAG_PROCESSED,
              this.onSubtitleFragProcessed,
              this
            ),
            t.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this);
        }
        startLoad(t, e) {
          this.stopLoad(),
            (this.state = N.IDLE),
            this.setInterval(500),
            (this.nextLoadPosition = this.lastCurrentTime =
              t + this.timelineOffset),
            (this.startPosition = e ? -1 : t),
            this.tick();
        }
        onManifestLoading() {
          super.onManifestLoading(), (this.mainDetails = null);
        }
        onMediaDetaching(t, e) {
          (this.tracksBuffered = []), super.onMediaDetaching(t, e);
        }
        onLevelLoaded(t, e) {
          this.mainDetails = e.details;
        }
        onSubtitleFragProcessed(t, e) {
          let i,
            { frag: r, success: s } = e;
          if (
            (this.fragContextChanged(r) ||
              (_t(r) && (this.fragPrevious = r), (this.state = N.IDLE)),
            !s)
          )
            return;
          let a = this.tracksBuffered[this.currentTrackId];
          if (!a) return;
          let n = r.start;
          for (let o = 0; o < a.length; o++)
            if (n >= a[o].start && n <= a[o].end) {
              i = a[o];
              break;
            }
          let l = r.start + r.duration;
          i ? (i.end = l) : ((i = { start: n, end: l }), a.push(i)),
            this.fragmentTracker.fragBuffered(r),
            this.fragBufferedComplete(r, null),
            this.media && this.tick();
        }
        onBufferFlushing(t, e) {
          let { startOffset: i, endOffset: r } = e;
          if (i === 0 && r !== Number.POSITIVE_INFINITY) {
            let s = r - 1;
            if (s <= 0) return;
            (e.endOffsetSubtitles = Math.max(0, s)),
              this.tracksBuffered.forEach((a) => {
                for (let n = 0; n < a.length; ) {
                  if (a[n].end <= s) {
                    a.shift();
                    continue;
                  }
                  if (a[n].start < s) a[n].start = s;
                  else break;
                  n++;
                }
              }),
              this.fragmentTracker.removeFragmentsInRange(i, s, j.SUBTITLE);
          }
        }
        onError(t, e) {
          let i = e.frag;
          i?.type === j.SUBTITLE &&
            (e.details === b.FRAG_GAP &&
              this.fragmentTracker.fragBuffered(i, !0),
            this.fragCurrent && this.fragCurrent.abortRequests(),
            this.state !== N.STOPPED && (this.state = N.IDLE));
        }
        onSubtitleTracksUpdated(t, { subtitleTracks: e }) {
          if (this.levels && Aa(this.levels, e)) {
            this.levels = e.map((i) => new Me(i));
            return;
          }
          (this.tracksBuffered = []),
            (this.levels = e.map((i) => {
              let r = new Me(i);
              return (this.tracksBuffered[r.id] = []), r;
            })),
            this.fragmentTracker.removeFragmentsInRange(
              0,
              Number.POSITIVE_INFINITY,
              j.SUBTITLE
            ),
            (this.fragPrevious = null),
            (this.mediaBuffer = null);
        }
        onSubtitleTrackSwitch(t, e) {
          var i;
          if (
            ((this.currentTrackId = e.id),
            !((i = this.levels) != null && i.length) ||
              this.currentTrackId === -1)
          ) {
            this.clearInterval();
            return;
          }
          let r = this.levels[this.currentTrackId];
          r != null && r.details
            ? (this.mediaBuffer = this.mediaBufferTimeRanges)
            : (this.mediaBuffer = null),
            r && this.state !== N.STOPPED && this.setInterval(500);
        }
        onSubtitleTrackLoaded(t, e) {
          var i, r;
          let { currentTrackId: s, levels: a } = this,
            { details: n, id: l } = e;
          if (!a) {
            this.warn(`Subtitle tracks were reset while loading level ${l}`);
            return;
          }
          let o = a[l];
          if (l >= a.length || !o) return;
          this.log(
            `Subtitle track ${l} loaded [${n.startSN},${n.endSN}]${
              n.lastPartSn ? `[part-${n.lastPartSn}-${n.lastPartIndex}]` : ''
            },duration:${n.totalduration}`
          ),
            (this.mediaBuffer = this.mediaBufferTimeRanges);
          let d = 0;
          if (n.live || ((i = o.details) != null && i.live)) {
            if (n.deltaUpdateFailed) return;
            let u = this.mainDetails;
            if (!u) {
              this.startFragRequested = !1;
              return;
            }
            let c = u.fragments[0];
            o.details
              ? (d = this.alignPlaylists(
                  n,
                  o.details,
                  (r = this.levelLastLoaded) == null ? void 0 : r.details
                )) === 0 &&
                c &&
                er(n, (d = c.start))
              : n.hasProgramDateTime && u.hasProgramDateTime
              ? (ci(n, u), (d = n.fragmentStart))
              : c && er(n, (d = c.start)),
              u && !this.startFragRequested && this.setStartPosition(u, d);
          }
          (o.details = n),
            (this.levelLastLoaded = o),
            l === s &&
              (this.hls.trigger(p.SUBTITLE_TRACK_UPDATED, {
                details: n,
                id: l,
                groupId: e.groupId,
              }),
              this.tick(),
              n.live &&
                !this.fragCurrent &&
                this.media &&
                this.state === N.IDLE &&
                !pe(null, n.fragments, this.media.currentTime, 0) &&
                (this.warn('Subtitle playlist not aligned with playback'),
                (o.details = void 0)));
        }
        _handleFragmentLoadComplete(t) {
          let { frag: e, payload: i } = t,
            r = e.decryptdata,
            s = this.hls;
          if (
            !this.fragContextChanged(e) &&
            i &&
            i.byteLength > 0 &&
            r != null &&
            r.key &&
            r.iv &&
            Re(r.method)
          ) {
            let a = performance.now();
            this.decrypter
              .decrypt(
                new Uint8Array(i),
                r.key.buffer,
                r.iv.buffer,
                qi(r.method)
              )
              .catch((n) => {
                throw (
                  (s.trigger(p.ERROR, {
                    type: Q.MEDIA_ERROR,
                    details: b.FRAG_DECRYPT_ERROR,
                    fatal: !1,
                    error: n,
                    reason: n.message,
                    frag: e,
                  }),
                  n)
                );
              })
              .then((n) => {
                let l = performance.now();
                s.trigger(p.FRAG_DECRYPTED, {
                  frag: e,
                  payload: n,
                  stats: { tstart: a, tdecrypt: l },
                });
              })
              .catch((n) => {
                this.warn(`${n.name}: ${n.message}`), (this.state = N.IDLE);
              });
          }
        }
        doTick() {
          if (!this.media) {
            this.state = N.IDLE;
            return;
          }
          if (this.state === N.IDLE) {
            let { currentTrackId: t, levels: e } = this,
              i = e?.[t];
            if (!i || !e.length || !i.details || this.waitForLive(i)) return;
            let { config: r } = this,
              s = this.getLoadPosition(),
              { end: a, len: n } = rt.bufferedInfo(
                this.tracksBuffered[this.currentTrackId] || [],
                s,
                r.maxBufferHole
              ),
              l = i.details;
            if (n > this.hls.maxBufferLength + l.levelTargetDuration) return;
            let o = l.fragments,
              d = o.length,
              u = l.edge,
              c = null,
              f = this.fragPrevious;
            if (a < u) {
              let E = r.maxFragLookUpTolerance;
              (c = pe(f, o, Math.max(o[0].start, a), a > u - E ? 0 : E)) ||
                !f ||
                !(f.start < o[0].start) ||
                (c = o[0]);
            } else c = o[d - 1];
            if (!(c = this.filterReplacedPrimary(c, i.details))) return;
            let g = o[c.sn - l.startSN - 1];
            if (
              (g &&
                g.cc === c.cc &&
                this.fragmentTracker.getState(g) === xt.NOT_LOADED &&
                (c = g),
              this.fragmentTracker.getState(c) === xt.NOT_LOADED)
            ) {
              let E = this.mapToInitFragWhenRequired(c);
              E && this.loadFragment(E, i, a);
            }
          }
        }
        loadFragment(t, e, i) {
          _t(t) ? super.loadFragment(t, e, i) : this._loadInitSegment(t, e);
        }
        get mediaBufferTimeRanges() {
          return new Ll(this.tracksBuffered[this.currentTrackId] || []);
        }
      }
      class Ll {
        constructor(t) {
          this.buffered = void 0;
          let e = (i, r, s) => {
            if ((r >>>= 0) > s - 1)
              throw new DOMException(
                `Failed to execute '${i}' on 'TimeRanges': The index provided (${r}) is greater than the maximum bound (${s})`
              );
            return t[r][i];
          };
          this.buffered = {
            get length() {
              return t.length;
            },
            end: (i) => e('end', i, t.length),
            start: (i) => e('start', i, t.length),
          };
        }
      }
      let Il = {
          42: 225,
          92: 233,
          94: 237,
          95: 243,
          96: 250,
          123: 231,
          124: 247,
          125: 209,
          126: 241,
          127: 9608,
          128: 174,
          129: 176,
          130: 189,
          131: 191,
          132: 8482,
          133: 162,
          134: 163,
          135: 9834,
          136: 224,
          137: 32,
          138: 232,
          139: 226,
          140: 234,
          141: 238,
          142: 244,
          143: 251,
          144: 193,
          145: 201,
          146: 211,
          147: 218,
          148: 220,
          149: 252,
          150: 8216,
          151: 161,
          152: 42,
          153: 8217,
          154: 9473,
          155: 169,
          156: 8480,
          157: 8226,
          158: 8220,
          159: 8221,
          160: 192,
          161: 194,
          162: 199,
          163: 200,
          164: 202,
          165: 203,
          166: 235,
          167: 206,
          168: 207,
          169: 239,
          170: 212,
          171: 217,
          172: 249,
          173: 219,
          174: 171,
          175: 187,
          176: 195,
          177: 227,
          178: 205,
          179: 204,
          180: 236,
          181: 210,
          182: 242,
          183: 213,
          184: 245,
          185: 123,
          186: 125,
          187: 92,
          188: 94,
          189: 95,
          190: 124,
          191: 8764,
          192: 196,
          193: 228,
          194: 214,
          195: 246,
          196: 223,
          197: 165,
          198: 164,
          199: 9475,
          200: 197,
          201: 229,
          202: 216,
          203: 248,
          204: 9487,
          205: 9491,
          206: 9495,
          207: 9499,
        },
        Ya = (h) => String.fromCharCode(Il[h] || h),
        Rl = { 17: 1, 18: 3, 21: 5, 22: 7, 23: 9, 16: 11, 19: 12, 20: 14 },
        bl = { 17: 2, 18: 4, 21: 6, 22: 8, 23: 10, 19: 13, 20: 15 },
        Dl = { 25: 1, 26: 3, 29: 5, 30: 7, 31: 9, 24: 11, 27: 12, 28: 14 },
        kl = { 25: 2, 26: 4, 29: 6, 30: 8, 31: 10, 27: 13, 28: 15 },
        Pl = [
          'white',
          'green',
          'blue',
          'cyan',
          'red',
          'yellow',
          'magenta',
          'black',
          'transparent',
        ];
      class _l {
        constructor() {
          (this.time = null), (this.verboseLevel = 0);
        }
        log(t, e) {
          if (this.verboseLevel >= t) {
            let i = typeof e == 'function' ? e() : e;
            nt.log(`${this.time} [${t}] ${i}`);
          }
        }
      }
      let ye = function (h) {
        let t = [];
        for (let e = 0; e < h.length; e++) t.push(h[e].toString(16));
        return t;
      };
      class Wa {
        constructor() {
          (this.foreground = 'white'),
            (this.underline = !1),
            (this.italics = !1),
            (this.background = 'black'),
            (this.flash = !1);
        }
        reset() {
          (this.foreground = 'white'),
            (this.underline = !1),
            (this.italics = !1),
            (this.background = 'black'),
            (this.flash = !1);
        }
        setStyles(t) {
          let e = ['foreground', 'underline', 'italics', 'background', 'flash'];
          for (let i = 0; i < e.length; i++) {
            let r = e[i];
            t.hasOwnProperty(r) && (this[r] = t[r]);
          }
        }
        isDefault() {
          return (
            this.foreground === 'white' &&
            !this.underline &&
            !this.italics &&
            this.background === 'black' &&
            !this.flash
          );
        }
        equals(t) {
          return (
            this.foreground === t.foreground &&
            this.underline === t.underline &&
            this.italics === t.italics &&
            this.background === t.background &&
            this.flash === t.flash
          );
        }
        copy(t) {
          (this.foreground = t.foreground),
            (this.underline = t.underline),
            (this.italics = t.italics),
            (this.background = t.background),
            (this.flash = t.flash);
        }
        toString() {
          return (
            'color=' +
            this.foreground +
            ', underline=' +
            this.underline +
            ', italics=' +
            this.italics +
            ', background=' +
            this.background +
            ', flash=' +
            this.flash
          );
        }
      }
      class Cl {
        constructor() {
          (this.uchar = ' '), (this.penState = new Wa());
        }
        reset() {
          (this.uchar = ' '), this.penState.reset();
        }
        setChar(t, e) {
          (this.uchar = t), this.penState.copy(e);
        }
        setPenState(t) {
          this.penState.copy(t);
        }
        equals(t) {
          return this.uchar === t.uchar && this.penState.equals(t.penState);
        }
        copy(t) {
          (this.uchar = t.uchar), this.penState.copy(t.penState);
        }
        isEmpty() {
          return this.uchar === ' ' && this.penState.isDefault();
        }
      }
      class Ol {
        constructor(t) {
          (this.chars = []),
            (this.pos = 0),
            (this.currPenState = new Wa()),
            (this.cueStartTime = null),
            (this.logger = void 0);
          for (let e = 0; e < 100; e++) this.chars.push(new Cl());
          this.logger = t;
        }
        equals(t) {
          for (let e = 0; e < 100; e++)
            if (!this.chars[e].equals(t.chars[e])) return !1;
          return !0;
        }
        copy(t) {
          for (let e = 0; e < 100; e++) this.chars[e].copy(t.chars[e]);
        }
        isEmpty() {
          let t = !0;
          for (let e = 0; e < 100; e++)
            if (!this.chars[e].isEmpty()) {
              t = !1;
              break;
            }
          return t;
        }
        setCursor(t) {
          this.pos !== t && (this.pos = t),
            this.pos < 0
              ? (this.logger.log(3, 'Negative cursor position ' + this.pos),
                (this.pos = 0))
              : this.pos > 100 &&
                (this.logger.log(3, 'Too large cursor position ' + this.pos),
                (this.pos = 100));
        }
        moveCursor(t) {
          let e = this.pos + t;
          if (t > 1)
            for (let i = this.pos + 1; i < e + 1; i++)
              this.chars[i].setPenState(this.currPenState);
          this.setCursor(e);
        }
        backSpace() {
          this.moveCursor(-1),
            this.chars[this.pos].setChar(' ', this.currPenState);
        }
        insertChar(t) {
          t >= 144 && this.backSpace();
          let e = Ya(t);
          if (this.pos >= 100) {
            this.logger.log(
              0,
              () =>
                'Cannot insert ' +
                t.toString(16) +
                ' (' +
                e +
                ') at position ' +
                this.pos +
                '. Skipping it!'
            );
            return;
          }
          this.chars[this.pos].setChar(e, this.currPenState),
            this.moveCursor(1);
        }
        clearFromPos(t) {
          let e;
          for (e = t; e < 100; e++) this.chars[e].reset();
        }
        clear() {
          this.clearFromPos(0), (this.pos = 0), this.currPenState.reset();
        }
        clearToEndOfRow() {
          this.clearFromPos(this.pos);
        }
        getTextString() {
          let t = [],
            e = !0;
          for (let i = 0; i < 100; i++) {
            let r = this.chars[i].uchar;
            r !== ' ' && (e = !1), t.push(r);
          }
          return e ? '' : t.join('');
        }
        setPenStyles(t) {
          this.currPenState.setStyles(t),
            this.chars[this.pos].setPenState(this.currPenState);
        }
      }
      class kr {
        constructor(t) {
          (this.rows = []),
            (this.currRow = 14),
            (this.nrRollUpRows = null),
            (this.lastOutputScreen = null),
            (this.logger = void 0);
          for (let e = 0; e < 15; e++) this.rows.push(new Ol(t));
          this.logger = t;
        }
        reset() {
          for (let t = 0; t < 15; t++) this.rows[t].clear();
          this.currRow = 14;
        }
        equals(t) {
          let e = !0;
          for (let i = 0; i < 15; i++)
            if (!this.rows[i].equals(t.rows[i])) {
              e = !1;
              break;
            }
          return e;
        }
        copy(t) {
          for (let e = 0; e < 15; e++) this.rows[e].copy(t.rows[e]);
        }
        isEmpty() {
          let t = !0;
          for (let e = 0; e < 15; e++)
            if (!this.rows[e].isEmpty()) {
              t = !1;
              break;
            }
          return t;
        }
        backSpace() {
          this.rows[this.currRow].backSpace();
        }
        clearToEndOfRow() {
          this.rows[this.currRow].clearToEndOfRow();
        }
        insertChar(t) {
          this.rows[this.currRow].insertChar(t);
        }
        setPen(t) {
          this.rows[this.currRow].setPenStyles(t);
        }
        moveCursor(t) {
          this.rows[this.currRow].moveCursor(t);
        }
        setCursor(t) {
          this.logger.log(2, 'setCursor: ' + t),
            this.rows[this.currRow].setCursor(t);
        }
        setPAC(t) {
          this.logger.log(2, () => 'pacData = ' + yt(t));
          let e = t.row - 1;
          if (
            (this.nrRollUpRows &&
              e < this.nrRollUpRows - 1 &&
              (e = this.nrRollUpRows - 1),
            this.nrRollUpRows && this.currRow !== e)
          ) {
            for (let n = 0; n < 15; n++) this.rows[n].clear();
            let s = this.currRow + 1 - this.nrRollUpRows,
              a = this.lastOutputScreen;
            if (a) {
              let n = a.rows[s].cueStartTime,
                l = this.logger.time;
              if (n !== null && l !== null && n < l)
                for (let o = 0; o < this.nrRollUpRows; o++)
                  this.rows[e - this.nrRollUpRows + o + 1].copy(a.rows[s + o]);
            }
          }
          this.currRow = e;
          let i = this.rows[this.currRow];
          if (t.indent !== null) {
            let s = Math.max(t.indent - 1, 0);
            i.setCursor(t.indent), (t.color = i.chars[s].penState.foreground);
          }
          let r = {
            foreground: t.color,
            underline: t.underline,
            italics: t.italics,
            background: 'black',
            flash: !1,
          };
          this.setPen(r);
        }
        setBkgData(t) {
          this.logger.log(2, () => 'bkgData = ' + yt(t)),
            this.backSpace(),
            this.setPen(t),
            this.insertChar(32);
        }
        setRollUpRows(t) {
          this.nrRollUpRows = t;
        }
        rollUp() {
          if (this.nrRollUpRows === null) {
            this.logger.log(3, 'roll_up but nrRollUpRows not set yet');
            return;
          }
          this.logger.log(1, () => this.getDisplayText());
          let t = this.currRow + 1 - this.nrRollUpRows,
            e = this.rows.splice(t, 1)[0];
          e.clear(),
            this.rows.splice(this.currRow, 0, e),
            this.logger.log(2, 'Rolling up');
        }
        getDisplayText(t) {
          t = t || !1;
          let e = [],
            i = '',
            r = -1;
          for (let s = 0; s < 15; s++) {
            let a = this.rows[s].getTextString();
            a &&
              ((r = s + 1),
              t ? e.push('Row ' + r + ": '" + a + "'") : e.push(a.trim()));
          }
          return (
            e.length > 0 &&
              (i = t
                ? '[' + e.join(' | ') + ']'
                : e.join(`
`)),
            i
          );
        }
        getTextAndFormat() {
          return this.rows;
        }
      }
      class ja {
        constructor(t, e, i) {
          (this.chNr = void 0),
            (this.outputFilter = void 0),
            (this.mode = void 0),
            (this.verbose = void 0),
            (this.displayedMemory = void 0),
            (this.nonDisplayedMemory = void 0),
            (this.lastOutputScreen = void 0),
            (this.currRollUpRow = void 0),
            (this.writeScreen = void 0),
            (this.cueStartTime = void 0),
            (this.logger = void 0),
            (this.chNr = t),
            (this.outputFilter = e),
            (this.mode = null),
            (this.verbose = 0),
            (this.displayedMemory = new kr(i)),
            (this.nonDisplayedMemory = new kr(i)),
            (this.lastOutputScreen = new kr(i)),
            (this.currRollUpRow = this.displayedMemory.rows[14]),
            (this.writeScreen = this.displayedMemory),
            (this.mode = null),
            (this.cueStartTime = null),
            (this.logger = i);
        }
        reset() {
          (this.mode = null),
            this.displayedMemory.reset(),
            this.nonDisplayedMemory.reset(),
            this.lastOutputScreen.reset(),
            this.outputFilter.reset(),
            (this.currRollUpRow = this.displayedMemory.rows[14]),
            (this.writeScreen = this.displayedMemory),
            (this.mode = null),
            (this.cueStartTime = null);
        }
        getHandler() {
          return this.outputFilter;
        }
        setHandler(t) {
          this.outputFilter = t;
        }
        setPAC(t) {
          this.writeScreen.setPAC(t);
        }
        setBkgData(t) {
          this.writeScreen.setBkgData(t);
        }
        setMode(t) {
          t !== this.mode &&
            ((this.mode = t),
            this.logger.log(2, () => 'MODE=' + t),
            this.mode === 'MODE_POP-ON'
              ? (this.writeScreen = this.nonDisplayedMemory)
              : ((this.writeScreen = this.displayedMemory),
                this.writeScreen.reset()),
            this.mode !== 'MODE_ROLL-UP' &&
              ((this.displayedMemory.nrRollUpRows = null),
              (this.nonDisplayedMemory.nrRollUpRows = null)),
            (this.mode = t));
        }
        insertChars(t) {
          for (let i = 0; i < t.length; i++) this.writeScreen.insertChar(t[i]);
          let e =
            this.writeScreen === this.displayedMemory ? 'DISP' : 'NON_DISP';
          this.logger.log(
            2,
            () => e + ': ' + this.writeScreen.getDisplayText(!0)
          ),
            (this.mode === 'MODE_PAINT-ON' || this.mode === 'MODE_ROLL-UP') &&
              (this.logger.log(
                1,
                () => 'DISPLAYED: ' + this.displayedMemory.getDisplayText(!0)
              ),
              this.outputDataUpdate());
        }
        ccRCL() {
          this.logger.log(2, 'RCL - Resume Caption Loading'),
            this.setMode('MODE_POP-ON');
        }
        ccBS() {
          this.logger.log(2, 'BS - BackSpace'),
            this.mode !== 'MODE_TEXT' &&
              (this.writeScreen.backSpace(),
              this.writeScreen === this.displayedMemory &&
                this.outputDataUpdate());
        }
        ccAOF() {}
        ccAON() {}
        ccDER() {
          this.logger.log(2, 'DER- Delete to End of Row'),
            this.writeScreen.clearToEndOfRow(),
            this.outputDataUpdate();
        }
        ccRU(t) {
          this.logger.log(2, 'RU(' + t + ') - Roll Up'),
            (this.writeScreen = this.displayedMemory),
            this.setMode('MODE_ROLL-UP'),
            this.writeScreen.setRollUpRows(t);
        }
        ccFON() {
          this.logger.log(2, 'FON - Flash On'),
            this.writeScreen.setPen({ flash: !0 });
        }
        ccRDC() {
          this.logger.log(2, 'RDC - Resume Direct Captioning'),
            this.setMode('MODE_PAINT-ON');
        }
        ccTR() {
          this.logger.log(2, 'TR'), this.setMode('MODE_TEXT');
        }
        ccRTD() {
          this.logger.log(2, 'RTD'), this.setMode('MODE_TEXT');
        }
        ccEDM() {
          this.logger.log(2, 'EDM - Erase Displayed Memory'),
            this.displayedMemory.reset(),
            this.outputDataUpdate(!0);
        }
        ccCR() {
          this.logger.log(2, 'CR - Carriage Return'),
            this.writeScreen.rollUp(),
            this.outputDataUpdate(!0);
        }
        ccENM() {
          this.logger.log(2, 'ENM - Erase Non-displayed Memory'),
            this.nonDisplayedMemory.reset();
        }
        ccEOC() {
          if (
            (this.logger.log(2, 'EOC - End Of Caption'),
            this.mode === 'MODE_POP-ON')
          ) {
            let t = this.displayedMemory;
            (this.displayedMemory = this.nonDisplayedMemory),
              (this.nonDisplayedMemory = t),
              (this.writeScreen = this.nonDisplayedMemory),
              this.logger.log(
                1,
                () => 'DISP: ' + this.displayedMemory.getDisplayText()
              );
          }
          this.outputDataUpdate(!0);
        }
        ccTO(t) {
          this.logger.log(2, 'TO(' + t + ') - Tab Offset'),
            this.writeScreen.moveCursor(t);
        }
        ccMIDROW(t) {
          let e = { flash: !1 };
          if (((e.underline = t % 2 == 1), (e.italics = t >= 46), e.italics))
            e.foreground = 'white';
          else {
            let i = Math.floor(t / 2) - 16;
            e.foreground = [
              'white',
              'green',
              'blue',
              'cyan',
              'red',
              'yellow',
              'magenta',
            ][i];
          }
          this.logger.log(2, 'MIDROW: ' + yt(e)), this.writeScreen.setPen(e);
        }
        outputDataUpdate(t = !1) {
          let e = this.logger.time;
          e !== null &&
            this.outputFilter &&
            (this.cueStartTime !== null || this.displayedMemory.isEmpty()
              ? this.displayedMemory.equals(this.lastOutputScreen) ||
                (this.outputFilter.newCue(
                  this.cueStartTime,
                  e,
                  this.lastOutputScreen
                ),
                t &&
                  this.outputFilter.dispatchCue &&
                  this.outputFilter.dispatchCue(),
                (this.cueStartTime = this.displayedMemory.isEmpty() ? null : e))
              : (this.cueStartTime = e),
            this.lastOutputScreen.copy(this.displayedMemory));
        }
        cueSplitAtTime(t) {
          this.outputFilter &&
            !this.displayedMemory.isEmpty() &&
            (this.outputFilter.newCue &&
              this.outputFilter.newCue(
                this.cueStartTime,
                t,
                this.displayedMemory
              ),
            (this.cueStartTime = t));
        }
      }
      class qa {
        constructor(t, e, i) {
          (this.channels = void 0),
            (this.currentChannel = 0),
            (this.cmdHistory = { a: null, b: null }),
            (this.logger = void 0);
          let r = (this.logger = new _l());
          this.channels = [null, new ja(t, e, r), new ja(t + 1, i, r)];
        }
        getHandler(t) {
          return this.channels[t].getHandler();
        }
        setHandler(t, e) {
          this.channels[t].setHandler(e);
        }
        addData(t, e) {
          this.logger.time = t;
          for (let r = 0; r < e.length; r += 2) {
            var i;
            let s = 127 & e[r],
              a = 127 & e[r + 1],
              n = !1,
              l = null;
            if (s === 0 && a === 0) continue;
            this.logger.log(
              3,
              () => '[' + ye([e[r], e[r + 1]]) + '] -> (' + ye([s, a]) + ')'
            );
            let o = this.cmdHistory;
            if (s >= 16 && s <= 31) {
              if (o.a === s && o.b === a) {
                (o.a = null),
                  (o.b = null),
                  this.logger.log(
                    3,
                    () => 'Repeated command (' + ye([s, a]) + ') is dropped'
                  );
                continue;
              }
              ((i = this.cmdHistory).a = s),
                (i.b = a),
                (n = this.parseCmd(s, a)) || (n = this.parseMidrow(s, a)),
                n || (n = this.parsePAC(s, a)),
                n || (n = this.parseBackgroundAttributes(s, a));
            } else (o.a = null), (o.b = null);
            if (!n && (l = this.parseChars(s, a))) {
              let d = this.currentChannel;
              d && d > 0
                ? this.channels[d].insertChars(l)
                : this.logger.log(2, 'No channel found yet. TEXT-MODE?');
            }
            n ||
              l ||
              this.logger.log(
                2,
                () =>
                  "Couldn't parse cleaned data " +
                  ye([s, a]) +
                  ' orig: ' +
                  ye([e[r], e[r + 1]])
              );
          }
        }
        parseCmd(t, e) {
          if (
            !(
              ((t === 20 || t === 28 || t === 21 || t === 29) &&
                e >= 32 &&
                e <= 47) ||
              ((t === 23 || t === 31) && e >= 33 && e <= 35)
            )
          )
            return !1;
          let i = t === 20 || t === 21 || t === 23 ? 1 : 2,
            r = this.channels[i];
          return (
            t === 20 || t === 21 || t === 28 || t === 29
              ? e === 32
                ? r.ccRCL()
                : e === 33
                ? r.ccBS()
                : e === 34
                ? r.ccAOF()
                : e === 35
                ? r.ccAON()
                : e === 36
                ? r.ccDER()
                : e === 37
                ? r.ccRU(2)
                : e === 38
                ? r.ccRU(3)
                : e === 39
                ? r.ccRU(4)
                : e === 40
                ? r.ccFON()
                : e === 41
                ? r.ccRDC()
                : e === 42
                ? r.ccTR()
                : e === 43
                ? r.ccRTD()
                : e === 44
                ? r.ccEDM()
                : e === 45
                ? r.ccCR()
                : e === 46
                ? r.ccENM()
                : e === 47 && r.ccEOC()
              : r.ccTO(e - 32),
            (this.currentChannel = i),
            !0
          );
        }
        parseMidrow(t, e) {
          let i = 0;
          if ((t === 17 || t === 25) && e >= 32 && e <= 47) {
            if ((i = t === 17 ? 1 : 2) !== this.currentChannel)
              return (
                this.logger.log(0, 'Mismatch channel in midrow parsing'), !1
              );
            let r = this.channels[i];
            return (
              !!r &&
              (r.ccMIDROW(e),
              this.logger.log(3, () => 'MIDROW (' + ye([t, e]) + ')'),
              !0)
            );
          }
          return !1;
        }
        parsePAC(t, e) {
          let i,
            r =
              ((t >= 17 && t <= 23) || (t >= 25 && t <= 31)) &&
              e >= 64 &&
              e <= 127,
            s = (t === 16 || t === 24) && e >= 64 && e <= 95;
          if (!(r || s)) return !1;
          let a = t <= 23 ? 1 : 2;
          i =
            e >= 64 && e <= 95
              ? a === 1
                ? Rl[t]
                : Dl[t]
              : a === 1
              ? bl[t]
              : kl[t];
          let n = this.channels[a];
          return (
            !!n &&
            (n.setPAC(this.interpretPAC(i, e)), (this.currentChannel = a), !0)
          );
        }
        interpretPAC(t, e) {
          let i,
            r = {
              color: null,
              italics: !1,
              indent: null,
              underline: !1,
              row: t,
            };
          return (
            (i = e > 95 ? e - 96 : e - 64),
            (r.underline = (1 & i) == 1),
            i <= 13
              ? (r.color = [
                  'white',
                  'green',
                  'blue',
                  'cyan',
                  'red',
                  'yellow',
                  'magenta',
                  'white',
                ][Math.floor(i / 2)])
              : i <= 15
              ? ((r.italics = !0), (r.color = 'white'))
              : (r.indent = 4 * Math.floor((i - 16) / 2)),
            r
          );
        }
        parseChars(t, e) {
          let i,
            r = null,
            s = null;
          if (
            (t >= 25 ? ((i = 2), (s = t - 8)) : ((i = 1), (s = t)),
            s >= 17 && s <= 19)
          ) {
            let a;
            (a = s === 17 ? e + 80 : s === 18 ? e + 112 : e + 144),
              this.logger.log(
                2,
                () => "Special char '" + Ya(a) + "' in channel " + i
              ),
              (r = [a]);
          } else t >= 32 && t <= 127 && (r = e === 0 ? [t] : [t, e]);
          return (
            r && this.logger.log(3, () => 'Char codes =  ' + ye(r).join(',')), r
          );
        }
        parseBackgroundAttributes(t, e) {
          let i;
          if (
            !(
              ((t === 16 || t === 24) && e >= 32 && e <= 47) ||
              ((t === 23 || t === 31) && e >= 45 && e <= 47)
            )
          )
            return !1;
          let r = {};
          return (
            t === 16 || t === 24
              ? ((i = Math.floor((e - 32) / 2)),
                (r.background = Pl[i]),
                e % 2 == 1 && (r.background = r.background + '_semi'))
              : e === 45
              ? (r.background = 'transparent')
              : ((r.foreground = 'black'), e === 47 && (r.underline = !0)),
            this.channels[t <= 23 ? 1 : 2].setBkgData(r),
            !0
          );
        }
        reset() {
          var t;
          for (let e = 0; e < Object.keys(this.channels).length; e++) {
            let i = this.channels[e];
            i && i.reset();
          }
          ((t = this.cmdHistory).a = null), (t.b = null);
        }
        cueSplitAtTime(t) {
          for (let e = 0; e < this.channels.length; e++) {
            let i = this.channels[e];
            i && i.cueSplitAtTime(t);
          }
        }
      }
      var Pr = (function () {
        if (oi != null && oi.VTTCue) return F.VTTCue;
        let h = ['', 'lr', 'rl'],
          t = ['start', 'middle', 'end', 'left', 'right'];
        function e(s, a) {
          if (typeof a != 'string' || !Array.isArray(s)) return !1;
          let n = a.toLowerCase();
          return !!~s.indexOf(n) && n;
        }
        function i(s, ...a) {
          let n = 1;
          for (; n < arguments.length; n++) {
            let l = arguments[n];
            for (let o in l) s[o] = l[o];
          }
          return s;
        }
        function r(s, a, n) {
          let l = { enumerable: !0 };
          this.hasBeenReset = !1;
          let o = '',
            d = !1,
            u = s,
            c = a,
            f = n,
            g = null,
            E = '',
            m = !0,
            y = 'auto',
            S = 'start',
            T = 50,
            A = 'middle',
            R = 50,
            I = 'middle';
          Object.defineProperty(
            this,
            'id',
            i({}, l, {
              get: function () {
                return o;
              },
              set: function (v) {
                o = '' + v;
              },
            })
          ),
            Object.defineProperty(
              this,
              'pauseOnExit',
              i({}, l, {
                get: function () {
                  return d;
                },
                set: function (v) {
                  d = !!v;
                },
              })
            ),
            Object.defineProperty(
              this,
              'startTime',
              i({}, l, {
                get: function () {
                  return u;
                },
                set: function (v) {
                  if (typeof v != 'number')
                    throw TypeError('Start time must be set to a number.');
                  (u = v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'endTime',
              i({}, l, {
                get: function () {
                  return c;
                },
                set: function (v) {
                  if (typeof v != 'number')
                    throw TypeError('End time must be set to a number.');
                  (c = v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'text',
              i({}, l, {
                get: function () {
                  return f;
                },
                set: function (v) {
                  (f = '' + v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'region',
              i({}, l, {
                get: function () {
                  return g;
                },
                set: function (v) {
                  (g = v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'vertical',
              i({}, l, {
                get: function () {
                  return E;
                },
                set: function (v) {
                  let _ = e(h, v);
                  if (_ === !1)
                    throw SyntaxError(
                      'An invalid or illegal string was specified.'
                    );
                  (E = _), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'snapToLines',
              i({}, l, {
                get: function () {
                  return m;
                },
                set: function (v) {
                  (m = !!v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'line',
              i({}, l, {
                get: function () {
                  return y;
                },
                set: function (v) {
                  if (typeof v != 'number' && v !== 'auto')
                    throw SyntaxError(
                      'An invalid number or illegal string was specified.'
                    );
                  (y = v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'lineAlign',
              i({}, l, {
                get: function () {
                  return S;
                },
                set: function (v) {
                  let _ = e(t, v);
                  if (!_)
                    throw SyntaxError(
                      'An invalid or illegal string was specified.'
                    );
                  (S = _), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'position',
              i({}, l, {
                get: function () {
                  return T;
                },
                set: function (v) {
                  if (v < 0 || v > 100)
                    throw Error('Position must be between 0 and 100.');
                  (T = v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'positionAlign',
              i({}, l, {
                get: function () {
                  return A;
                },
                set: function (v) {
                  let _ = e(t, v);
                  if (!_)
                    throw SyntaxError(
                      'An invalid or illegal string was specified.'
                    );
                  (A = _), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'size',
              i({}, l, {
                get: function () {
                  return R;
                },
                set: function (v) {
                  if (v < 0 || v > 100)
                    throw Error('Size must be between 0 and 100.');
                  (R = v), (this.hasBeenReset = !0);
                },
              })
            ),
            Object.defineProperty(
              this,
              'align',
              i({}, l, {
                get: function () {
                  return I;
                },
                set: function (v) {
                  let _ = e(t, v);
                  if (!_)
                    throw SyntaxError(
                      'An invalid or illegal string was specified.'
                    );
                  (I = _), (this.hasBeenReset = !0);
                },
              })
            ),
            (this.displayState = void 0);
        }
        return (
          (r.prototype.getCueAsHTML = function () {
            return F.WebVTT.convertCueToDOMTree(F, this.text);
          }),
          r
        );
      })();
      class wl {
        decode(t, e) {
          if (!t) return '';
          if (typeof t != 'string')
            throw Error('Error - expected string data.');
          return decodeURIComponent(encodeURIComponent(t));
        }
      }
      function Xa(h) {
        function t(i, r, s, a) {
          return (0 | i) * 3600 + (0 | r) * 60 + (0 | s) + parseFloat(a || 0);
        }
        let e = h.match(/^(?:(\d+):)?(\d{2}):(\d{2})(\.\d+)?/);
        return e
          ? parseFloat(e[2]) > 59
            ? t(e[2], e[3], 0, e[4])
            : t(e[1], e[2], e[3], e[4])
          : null;
      }
      class xl {
        constructor() {
          this.values = Object.create(null);
        }
        set(t, e) {
          this.get(t) || e === '' || (this.values[t] = e);
        }
        get(t, e, i) {
          return i
            ? this.has(t)
              ? this.values[t]
              : e[i]
            : this.has(t)
            ? this.values[t]
            : e;
        }
        has(t) {
          return t in this.values;
        }
        alt(t, e, i) {
          for (let r = 0; r < i.length; ++r)
            if (e === i[r]) {
              this.set(t, e);
              break;
            }
        }
        integer(t, e) {
          /^-?\d+$/.test(e) && this.set(t, parseInt(e, 10));
        }
        percent(t, e) {
          if (/^([\d]{1,3})(\.[\d]*)?%$/.test(e)) {
            let i = parseFloat(e);
            if (i >= 0 && i <= 100) return this.set(t, i), !0;
          }
          return !1;
        }
      }
      function za(h, t, e, i) {
        let r = i ? h.split(i) : [h];
        for (let s in r) {
          if (typeof r[s] != 'string') continue;
          let a = r[s].split(e);
          a.length === 2 && t(a[0], a[1]);
        }
      }
      let _r = new Pr(0, 0, ''),
        Ri = _r.align === 'middle' ? 'middle' : 'center';
      function Qa(h) {
        return h.replace(
          /<br(?: \/)?>/gi,
          `
`
        );
      }
      class Ml {
        constructor() {
          (this.state = 'INITIAL'),
            (this.buffer = ''),
            (this.decoder = new wl()),
            (this.regionList = []),
            (this.cue = null),
            (this.oncue = void 0),
            (this.onparsingerror = void 0),
            (this.onflush = void 0);
        }
        parse(t) {
          let e = this;
          function i() {
            let s = e.buffer,
              a = 0;
            for (
              s = Qa(s);
              a < s.length &&
              s[a] !== '\r' &&
              s[a] !==
                `
`;

            )
              ++a;
            let n = s.slice(0, a);
            return (
              s[a] === '\r' && ++a,
              s[a] ===
                `
` && ++a,
              (e.buffer = s.slice(a)),
              n
            );
          }
          t && (e.buffer += e.decoder.decode(t, { stream: !0 }));
          try {
            let s = '';
            if (e.state === 'INITIAL') {
              if (!/\r\n|\n/.test(e.buffer)) return this;
              let n = (s = i()).match(/^(ï»¿)?WEBVTT([ \t].*)?$/);
              if (!(n != null && n[0]))
                throw Error('Malformed WebVTT signature.');
              e.state = 'HEADER';
            }
            let a = !1;
            for (; e.buffer && /\r\n|\n/.test(e.buffer); )
              switch ((a ? (a = !1) : (s = i()), e.state)) {
                case 'HEADER':
                  if (/:/.test(s)) {
                    var r;
                    (r = s), za(r, function (n, l) {}, /:/);
                  } else s || (e.state = 'ID');
                  continue;
                case 'NOTE':
                  s || (e.state = 'ID');
                  continue;
                case 'ID':
                  if (/^NOTE($|[ \t])/.test(s)) {
                    e.state = 'NOTE';
                    break;
                  }
                  if (!s) continue;
                  if (
                    ((e.cue = new Pr(0, 0, '')),
                    (e.state = 'CUE'),
                    s.indexOf('-->') === -1)
                  ) {
                    e.cue.id = s;
                    continue;
                  }
                case 'CUE':
                  if (!e.cue) {
                    e.state = 'BADCUE';
                    continue;
                  }
                  try {
                    (function (n, l, o) {
                      let d = n;
                      function u() {
                        let f = Xa(n);
                        if (f === null)
                          throw Error('Malformed timestamp: ' + d);
                        return (n = n.replace(/^[^\sa-zA-Z-]+/, '')), f;
                      }
                      function c() {
                        n = n.replace(/^\s+/, '');
                      }
                      if (
                        (c(), (l.startTime = u()), c(), n.slice(0, 3) !== '-->')
                      )
                        throw Error(
                          "Malformed time stamp (time stamps must be separated by '-->'): " +
                            d
                        );
                      (n = n.slice(3)),
                        c(),
                        (l.endTime = u()),
                        c(),
                        (function (f, g) {
                          let E = new xl();
                          za(
                            f,
                            function (S, T) {
                              let A;
                              switch (S) {
                                case 'region':
                                  for (let R = o.length - 1; R >= 0; R--)
                                    if (o[R].id === T) {
                                      E.set(S, o[R].region);
                                      break;
                                    }
                                  break;
                                case 'vertical':
                                  E.alt(S, T, ['rl', 'lr']);
                                  break;
                                case 'line':
                                  (A = T.split(',')),
                                    E.integer(S, A[0]),
                                    E.percent(S, A[0]) &&
                                      E.set('snapToLines', !1),
                                    E.alt(S, A[0], ['auto']),
                                    A.length === 2 &&
                                      E.alt('lineAlign', A[1], [
                                        'start',
                                        Ri,
                                        'end',
                                      ]);
                                  break;
                                case 'position':
                                  (A = T.split(',')),
                                    E.percent(S, A[0]),
                                    A.length === 2 &&
                                      E.alt('positionAlign', A[1], [
                                        'start',
                                        Ri,
                                        'end',
                                        'line-left',
                                        'line-right',
                                        'auto',
                                      ]);
                                  break;
                                case 'size':
                                  E.percent(S, T);
                                  break;
                                case 'align':
                                  E.alt(S, T, [
                                    'start',
                                    Ri,
                                    'end',
                                    'left',
                                    'right',
                                  ]);
                              }
                            },
                            /:/,
                            /\s/
                          ),
                            (g.region = E.get('region', null)),
                            (g.vertical = E.get('vertical', ''));
                          let m = E.get('line', 'auto');
                          m === 'auto' && _r.line === -1 && (m = -1),
                            (g.line = m),
                            (g.lineAlign = E.get('lineAlign', 'start')),
                            (g.snapToLines = E.get('snapToLines', !0)),
                            (g.size = E.get('size', 100)),
                            (g.align = E.get('align', Ri));
                          let y = E.get('position', 'auto');
                          y === 'auto' &&
                            _r.position === 50 &&
                            (y =
                              g.align === 'start' || g.align === 'left'
                                ? 0
                                : g.align === 'end' || g.align === 'right'
                                ? 100
                                : 50),
                            (g.position = y);
                        })(n, l);
                    })(s, e.cue, e.regionList);
                  } catch {
                    (e.cue = null), (e.state = 'BADCUE');
                    continue;
                  }
                  e.state = 'CUETEXT';
                  continue;
                case 'CUETEXT':
                  {
                    let n = s.indexOf('-->') !== -1;
                    if (!s || (n && (a = !0))) {
                      e.oncue && e.cue && e.oncue(e.cue),
                        (e.cue = null),
                        (e.state = 'ID');
                      continue;
                    }
                    if (e.cue === null) continue;
                    e.cue.text &&
                      (e.cue.text += `
`),
                      (e.cue.text += s);
                  }
                  continue;
                case 'BADCUE':
                  s || (e.state = 'ID');
              }
          } catch {
            e.state === 'CUETEXT' && e.cue && e.oncue && e.oncue(e.cue),
              (e.cue = null),
              (e.state = e.state === 'INITIAL' ? 'BADWEBVTT' : 'BADCUE');
          }
          return this;
        }
        flush() {
          try {
            if (
              ((this.cue || this.state === 'HEADER') &&
                ((this.buffer += `

`),
                this.parse()),
              this.state === 'INITIAL' || this.state === 'BADWEBVTT')
            )
              throw Error('Malformed WebVTT signature.');
          } catch (t) {
            this.onparsingerror && this.onparsingerror(t);
          }
          return this.onflush && this.onflush(), this;
        }
      }
      let Fl = /\r\n|\n\r|\n|\r/g,
        Cr = function (h, t, e = 0) {
          return h.slice(e, e + t.length) === t;
        },
        Nl = function (h) {
          let t = parseInt(h.slice(-3)),
            e = parseInt(h.slice(-6, -4)),
            i = parseInt(h.slice(-9, -7)),
            r = h.length > 9 ? parseInt(h.substring(0, h.indexOf(':'))) : 0;
          if (!Y(t) || !Y(e) || !Y(i) || !Y(r))
            throw Error(`Malformed X-TIMESTAMP-MAP: Local:${h}`);
          return t + (1e3 * e + 6e4 * i + 36e5 * r);
        };
      function Or(h, t, e) {
        return He(h.toString()) + He(t.toString()) + He(e);
      }
      let Ul = function (h, t, e) {
          let i = h[t],
            r = h[i.prevCC];
          if (!r || (!r.new && i.new)) {
            (h.ccOffset = h.presentationOffset = i.start), (i.new = !1);
            return;
          }
          for (; (s = r) != null && s.new; ) {
            var s;
            (h.ccOffset += i.start - r.start),
              (i.new = !1),
              (r = h[(i = r).prevCC]);
          }
          h.presentationOffset = e;
        },
        wr = 'stpp.ttml.im1t',
        Za = /^(\d{2,}):(\d{2}):(\d{2}):(\d{2})\.?(\d+)?$/,
        Ja = /^(\d*(?:\.\d*)?)(h|m|s|ms|f|t)$/,
        Bl = {
          left: 'start',
          center: 'center',
          right: 'end',
          start: 'start',
          end: 'end',
        };
      function tn(h, t, e, i) {
        let r = ot(new Uint8Array(h), ['mdat']);
        if (r.length === 0) {
          i(Error('Could not parse IMSC1 mdat'));
          return;
        }
        let s = r.map((n) => At(n)),
          a = (function (n, l, o = 1, d = !1) {
            return fr(n, 1, 1 / o, d);
          })(t.baseTime, 0, t.timescale);
        try {
          s.forEach((n) =>
            e(
              (function (l, o) {
                let d = new DOMParser()
                  .parseFromString(l, 'text/xml')
                  .getElementsByTagName('tt')[0];
                if (!d) throw Error('Invalid ttml');
                let u = {
                    frameRate: 30,
                    subFrameRate: 1,
                    frameRateMultiplier: 0,
                    tickRate: 0,
                  },
                  c = Object.keys(u).reduce(
                    (y, S) => ((y[S] = d.getAttribute(`ttp:${S}`) || u[S]), y),
                    {}
                  ),
                  f = d.getAttribute('xml:space') !== 'preserve',
                  g = en(xr(d, 'styling', 'style')),
                  E = en(xr(d, 'layout', 'region')),
                  m = xr(d, 'body', '[begin]');
                return [].map
                  .call(m, (y) => {
                    let S = (function C(M, G) {
                      return [].slice.call(M.childNodes).reduce((k, P, x) => {
                        var U;
                        return P.nodeName === 'br' && x
                          ? k +
                              `
`
                          : (U = P.childNodes) != null && U.length
                          ? C(P, G)
                          : G
                          ? k + P.textContent.trim().replace(/\s+/g, ' ')
                          : k + P.textContent;
                      }, '');
                    })(y, f);
                    if (!S || !y.hasAttribute('begin')) return null;
                    let T = Fr(y.getAttribute('begin'), c),
                      A = Fr(y.getAttribute('dur'), c),
                      R = Fr(y.getAttribute('end'), c);
                    if (T === null) throw rn(y);
                    if (R === null) {
                      if (A === null) throw rn(y);
                      R = T + A;
                    }
                    let I = new Pr(T - o, R - o, S);
                    I.id = Or(I.startTime, I.endTime, I.text);
                    let v = E[y.getAttribute('region')],
                      _ = (function (C, M, G) {
                        let k = 'http://www.w3.org/ns/ttml#styling',
                          P = null,
                          x =
                            C != null && C.hasAttribute('style')
                              ? C.getAttribute('style')
                              : null;
                        return (
                          x && G.hasOwnProperty(x) && (P = G[x]),
                          [
                            'displayAlign',
                            'textAlign',
                            'color',
                            'backgroundColor',
                            'fontSize',
                            'fontFamily',
                          ].reduce((U, $) => {
                            let B = Mr(M, k, $) || Mr(C, k, $) || Mr(P, k, $);
                            return B && (U[$] = B), U;
                          }, {})
                        );
                      })(v, g[y.getAttribute('style')], g),
                      { textAlign: L } = _;
                    if (L) {
                      let C = Bl[L];
                      C && (I.lineAlign = C), (I.align = L);
                    }
                    return at(I, _), I;
                  })
                  .filter((y) => y !== null);
              })(n, a)
            )
          );
        } catch (n) {
          i(n);
        }
      }
      function xr(h, t, e) {
        let i = h.getElementsByTagName(t)[0];
        return i ? [].slice.call(i.querySelectorAll(e)) : [];
      }
      function en(h) {
        return h.reduce((t, e) => {
          let i = e.getAttribute('xml:id');
          return i && (t[i] = e), t;
        }, {});
      }
      function Mr(h, t, e) {
        return h && h.hasAttributeNS(t, e) ? h.getAttributeNS(t, e) : null;
      }
      function rn(h) {
        return Error(`Could not parse ttml timestamp ${h}`);
      }
      function Fr(h, t) {
        if (!h) return null;
        let e = Xa(h);
        return (
          e === null &&
            (Za.test(h)
              ? (e = (function (i, r) {
                  let s = Za.exec(i),
                    a = (0 | s[4]) + (0 | s[5]) / r.subFrameRate;
                  return (
                    (0 | s[1]) * 3600 +
                    (0 | s[2]) * 60 +
                    (0 | s[3]) +
                    a / r.frameRate
                  );
                })(h, t))
              : Ja.test(h) &&
                (e = (function (i, r) {
                  let s = Ja.exec(i),
                    a = Number(s[1]);
                  switch (s[2]) {
                    case 'h':
                      return 3600 * a;
                    case 'm':
                      return 60 * a;
                    case 'ms':
                      return 1e3 * a;
                    case 'f':
                      return a / r.frameRate;
                    case 't':
                      return a / r.tickRate;
                  }
                  return a;
                })(h, t))),
          e
        );
      }
      class bi {
        constructor(t, e) {
          (this.timelineController = void 0),
            (this.cueRanges = []),
            (this.trackName = void 0),
            (this.startTime = null),
            (this.endTime = null),
            (this.screen = null),
            (this.timelineController = t),
            (this.trackName = e);
        }
        dispatchCue() {
          this.startTime !== null &&
            (this.timelineController.addCues(
              this.trackName,
              this.startTime,
              this.endTime,
              this.screen,
              this.cueRanges
            ),
            (this.startTime = null));
        }
        newCue(t, e, i) {
          (this.startTime === null || this.startTime > t) &&
            (this.startTime = t),
            (this.endTime = e),
            (this.screen = i),
            this.timelineController.createCaptionsTrack(this.trackName);
        }
        reset() {
          (this.cueRanges = []), (this.startTime = null);
        }
      }
      class $l {
        constructor(t) {
          (this.hls = void 0),
            (this.media = null),
            (this.config = void 0),
            (this.enabled = !0),
            (this.Cues = void 0),
            (this.textTracks = []),
            (this.tracks = []),
            (this.initPTS = []),
            (this.unparsedVttFrags = []),
            (this.captionsTracks = {}),
            (this.nonNativeCaptionsTracks = {}),
            (this.cea608Parser1 = void 0),
            (this.cea608Parser2 = void 0),
            (this.lastCc = -1),
            (this.lastSn = -1),
            (this.lastPartIndex = -1),
            (this.prevCC = -1),
            (this.vttCCs = nn()),
            (this.captionsProperties = void 0),
            (this.hls = t),
            (this.config = t.config),
            (this.Cues = t.config.cueHandler),
            (this.captionsProperties = {
              textTrack1: {
                label: this.config.captionsTextTrack1Label,
                languageCode: this.config.captionsTextTrack1LanguageCode,
              },
              textTrack2: {
                label: this.config.captionsTextTrack2Label,
                languageCode: this.config.captionsTextTrack2LanguageCode,
              },
              textTrack3: {
                label: this.config.captionsTextTrack3Label,
                languageCode: this.config.captionsTextTrack3LanguageCode,
              },
              textTrack4: {
                label: this.config.captionsTextTrack4Label,
                languageCode: this.config.captionsTextTrack4LanguageCode,
              },
            }),
            t.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.on(p.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this),
            t.on(p.FRAG_LOADING, this.onFragLoading, this),
            t.on(p.FRAG_LOADED, this.onFragLoaded, this),
            t.on(p.FRAG_PARSING_USERDATA, this.onFragParsingUserdata, this),
            t.on(p.FRAG_DECRYPTED, this.onFragDecrypted, this),
            t.on(p.INIT_PTS_FOUND, this.onInitPtsFound, this),
            t.on(p.SUBTITLE_TRACKS_CLEARED, this.onSubtitleTracksCleared, this),
            t.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this);
        }
        destroy() {
          let { hls: t } = this;
          t.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.off(
              p.SUBTITLE_TRACKS_UPDATED,
              this.onSubtitleTracksUpdated,
              this
            ),
            t.off(p.FRAG_LOADING, this.onFragLoading, this),
            t.off(p.FRAG_LOADED, this.onFragLoaded, this),
            t.off(p.FRAG_PARSING_USERDATA, this.onFragParsingUserdata, this),
            t.off(p.FRAG_DECRYPTED, this.onFragDecrypted, this),
            t.off(p.INIT_PTS_FOUND, this.onInitPtsFound, this),
            t.off(
              p.SUBTITLE_TRACKS_CLEARED,
              this.onSubtitleTracksCleared,
              this
            ),
            t.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this),
            (this.hls = this.config = this.media = null),
            (this.cea608Parser1 = this.cea608Parser2 = void 0);
        }
        initCea608Parsers() {
          let t = new bi(this, 'textTrack1'),
            e = new bi(this, 'textTrack2'),
            i = new bi(this, 'textTrack3'),
            r = new bi(this, 'textTrack4');
          (this.cea608Parser1 = new qa(1, t, e)),
            (this.cea608Parser2 = new qa(3, i, r));
        }
        addCues(t, e, i, r, s) {
          let a = !1;
          for (let l = s.length; l--; ) {
            var n;
            let o = s[l],
              d = ((n = o[0]), Math.min(o[1], i) - Math.max(n, e));
            if (
              d >= 0 &&
              ((o[0] = Math.min(o[0], e)),
              (o[1] = Math.max(o[1], i)),
              (a = !0),
              d / (i - e) > 0.5)
            )
              return;
          }
          if ((a || s.push([e, i]), this.config.renderTextTracksNatively)) {
            let l = this.captionsTracks[t];
            this.Cues.newCue(l, e, i, r);
          } else {
            let l = this.Cues.newCue(null, e, i, r);
            this.hls.trigger(p.CUES_PARSED, {
              type: 'captions',
              cues: l,
              track: t,
            });
          }
        }
        onInitPtsFound(
          t,
          { frag: e, id: i, initPTS: r, timescale: s, trackId: a }
        ) {
          let { unparsedVttFrags: n } = this;
          i === j.MAIN &&
            (this.initPTS[e.cc] = { baseTime: r, timescale: s, trackId: a }),
            n.length &&
              ((this.unparsedVttFrags = []),
              n.forEach((l) => {
                this.initPTS[l.frag.cc]
                  ? this.onFragLoaded(p.FRAG_LOADED, l)
                  : this.hls.trigger(p.SUBTITLE_FRAG_PROCESSED, {
                      success: !1,
                      frag: l.frag,
                      error: Error(
                        'Subtitle discontinuity domain does not match main'
                      ),
                    });
              }));
        }
        getExistingTrack(t, e) {
          let { media: i } = this;
          if (i)
            for (let r = 0; r < i.textTracks.length; r++) {
              let s = i.textTracks[r];
              if (
                an(s, {
                  name: t,
                  lang: e,
                  characteristics:
                    'transcribes-spoken-dialog,describes-music-and-sound',
                })
              )
                return s;
            }
          return null;
        }
        createCaptionsTrack(t) {
          this.config.renderTextTracksNatively
            ? this.createNativeTrack(t)
            : this.createNonNativeTrack(t);
        }
        createNativeTrack(t) {
          if (this.captionsTracks[t]) return;
          let { captionsProperties: e, captionsTracks: i, media: r } = this,
            { label: s, languageCode: a } = e[t],
            n = this.getExistingTrack(s, a);
          if (n) (i[t] = n), _e(i[t]), Ga(i[t], r);
          else {
            let l = this.createTextTrack('captions', s, a);
            l && ((l[t] = !0), (i[t] = l));
          }
        }
        createNonNativeTrack(t) {
          if (this.nonNativeCaptionsTracks[t]) return;
          let e = this.captionsProperties[t];
          if (!e) return;
          let i = {
            _id: t,
            label: e.label,
            kind: 'captions',
            default: !!e.media && !!e.media.default,
            closedCaptions: e.media,
          };
          (this.nonNativeCaptionsTracks[t] = i),
            this.hls.trigger(p.NON_NATIVE_TEXT_TRACKS_FOUND, { tracks: [i] });
        }
        createTextTrack(t, e, i) {
          let r = this.media;
          if (r) return r.addTextTrack(t, e, i);
        }
        onMediaAttaching(t, e) {
          (this.media = e.media), e.mediaSource || this._cleanTracks();
        }
        onMediaDetaching(t, e) {
          let i = !!e.transferMedia;
          if (((this.media = null), i)) return;
          let { captionsTracks: r } = this;
          Object.keys(r).forEach((s) => {
            _e(r[s]), delete r[s];
          }),
            (this.nonNativeCaptionsTracks = {});
        }
        onManifestLoading() {
          (this.lastCc = -1),
            (this.lastSn = -1),
            (this.lastPartIndex = -1),
            (this.prevCC = -1),
            (this.vttCCs = nn()),
            this._cleanTracks(),
            (this.tracks = []),
            (this.captionsTracks = {}),
            (this.nonNativeCaptionsTracks = {}),
            (this.textTracks = []),
            (this.unparsedVttFrags = []),
            (this.initPTS = []),
            this.cea608Parser1 &&
              this.cea608Parser2 &&
              (this.cea608Parser1.reset(), this.cea608Parser2.reset());
        }
        _cleanTracks() {
          let { media: t } = this;
          if (!t) return;
          let e = t.textTracks;
          if (e) for (let i = 0; i < e.length; i++) _e(e[i]);
        }
        onSubtitleTracksUpdated(t, e) {
          let i = e.subtitleTracks || [],
            r = i.some((s) => s.textCodec === wr);
          if (this.config.enableWebVTT || (r && this.config.enableIMSC1)) {
            if (Aa(this.tracks, i)) {
              this.tracks = i;
              return;
            }
            if (
              ((this.textTracks = []),
              (this.tracks = i),
              this.config.renderTextTracksNatively)
            ) {
              let s = this.media,
                a = s ? Ai(s.textTracks) : null;
              if (
                (this.tracks.forEach((n, l) => {
                  let o;
                  if (a) {
                    let d = null;
                    for (let u = 0; u < a.length; u++)
                      if (a[u] && an(a[u], n)) {
                        (d = a[u]), (a[u] = null);
                        break;
                      }
                    d && (o = d);
                  }
                  if (o) _e(o);
                  else {
                    let d = sn(n);
                    (o = this.createTextTrack(d, n.name, n.lang)) &&
                      (o.mode = 'disabled');
                  }
                  o && this.textTracks.push(o);
                }),
                a != null && a.length)
              ) {
                let n = a.filter((l) => l !== null).map((l) => l.label);
                n.length &&
                  this.hls.logger.warn(
                    `Media element contains unused subtitle tracks: ${n.join(
                      ', '
                    )}. Replace media element for each source to clear TextTracks and captions menu.`
                  );
              }
            } else if (this.tracks.length) {
              let s = this.tracks.map((a) => ({
                label: a.name,
                kind: a.type.toLowerCase(),
                default: a.default,
                subtitleTrack: a,
              }));
              this.hls.trigger(p.NON_NATIVE_TEXT_TRACKS_FOUND, { tracks: s });
            }
          }
        }
        onManifestLoaded(t, e) {
          this.config.enableCEA708Captions &&
            e.captions &&
            e.captions.forEach((i) => {
              let r = /(?:CC|SERVICE)([1-4])/.exec(i.instreamId);
              if (!r) return;
              let s = `textTrack${r[1]}`,
                a = this.captionsProperties[s];
              a &&
                ((a.label = i.name),
                i.lang && (a.languageCode = i.lang),
                (a.media = i));
            });
        }
        closedCaptionsForLevel(t) {
          let e = this.hls.levels[t.level];
          return e?.attrs['CLOSED-CAPTIONS'];
        }
        onFragLoading(t, e) {
          if (this.enabled && e.frag.type === j.MAIN) {
            var i, r;
            let { cea608Parser1: s, cea608Parser2: a, lastSn: n } = this,
              { cc: l, sn: o } = e.frag,
              d =
                (i = (r = e.part) == null ? void 0 : r.index) != null ? i : -1;
            s &&
              a &&
              (o !== n + 1 ||
                (o === n && d !== this.lastPartIndex + 1) ||
                l !== this.lastCc) &&
              (s.reset(), a.reset()),
              (this.lastCc = l),
              (this.lastSn = o),
              (this.lastPartIndex = d);
          }
        }
        onFragLoaded(t, e) {
          let { frag: i, payload: r } = e;
          if (i.type === j.SUBTITLE)
            if (r.byteLength) {
              let s = i.decryptdata,
                a = 'stats' in e;
              if (s == null || !s.encrypted || a) {
                let n = this.tracks[i.level],
                  l = this.vttCCs;
                l[i.cc] ||
                  ((l[i.cc] = { start: i.start, prevCC: this.prevCC, new: !0 }),
                  (this.prevCC = i.cc)),
                  n && n.textCodec === wr
                    ? this._parseIMSC1(i, r)
                    : this._parseVTTs(e);
              }
            } else
              this.hls.trigger(p.SUBTITLE_FRAG_PROCESSED, {
                success: !1,
                frag: i,
                error: Error('Empty subtitle payload'),
              });
        }
        _parseIMSC1(t, e) {
          let i = this.hls;
          tn(
            e,
            this.initPTS[t.cc],
            (r) => {
              this._appendCues(r, t.level),
                i.trigger(p.SUBTITLE_FRAG_PROCESSED, { success: !0, frag: t });
            },
            (r) => {
              i.logger.log(`Failed to parse IMSC1: ${r}`),
                i.trigger(p.SUBTITLE_FRAG_PROCESSED, {
                  success: !1,
                  frag: t,
                  error: r,
                });
            }
          );
        }
        _parseVTTs(t) {
          var e;
          let { frag: i, payload: r } = t,
            { initPTS: s, unparsedVttFrags: a } = this,
            n = s.length - 1;
          if (!s[i.cc] && n === -1) {
            a.push(t);
            return;
          }
          let l = this.hls;
          (function (o, d, u, c, f, g, E) {
            let m,
              y = new Ml(),
              S = At(new Uint8Array(o))
                .trim()
                .replace(
                  Fl,
                  `
`
                ).split(`
`),
              T = [],
              A = d
                ? (function (L, C = 1) {
                    return fr(L, 9e4, 1 / C);
                  })(d.baseTime, d.timescale)
                : 0,
              R = '00:00.000',
              I = 0,
              v = 0,
              _ = !0;
            (y.oncue = function (L) {
              let C = u[c],
                M = u.ccOffset,
                G = (I - A) / 9e4;
              if (
                (C != null &&
                  C.new &&
                  (v !== void 0 ? (M = u.ccOffset = C.start) : Ul(u, c, G)),
                G)
              ) {
                if (!d) {
                  m = Error('Missing initPTS for VTT MPEGTS');
                  return;
                }
                M = G - u.presentationOffset;
              }
              let k = L.endTime - L.startTime,
                P = jt((L.startTime + M - v) * 9e4, 9e4 * f) / 9e4;
              (L.startTime = Math.max(P, 0)), (L.endTime = Math.max(P + k, 0));
              let x = L.text.trim();
              (L.text = decodeURIComponent(encodeURIComponent(x))),
                L.id || (L.id = Or(L.startTime, L.endTime, x)),
                L.endTime > 0 && T.push(L);
            }),
              (y.onparsingerror = function (L) {
                m = L;
              }),
              (y.onflush = function () {
                if (m) {
                  E(m);
                  return;
                }
                g(T);
              }),
              S.forEach((L) => {
                if (_) {
                  if (Cr(L, 'X-TIMESTAMP-MAP=')) {
                    (_ = !1),
                      L.slice(16)
                        .split(',')
                        .forEach((C) => {
                          Cr(C, 'LOCAL:')
                            ? (R = C.slice(6))
                            : Cr(C, 'MPEGTS:') && (I = parseInt(C.slice(7)));
                        });
                    try {
                      v = Nl(R) / 1e3;
                    } catch (C) {
                      m = C;
                    }
                    return;
                  }
                  L === '' && (_ = !1);
                }
                y.parse(
                  L +
                    `
`
                );
              }),
              y.flush();
          })(
            (e = i.initSegment) != null && e.data
              ? Wt(i.initSegment.data, new Uint8Array(r)).buffer
              : r,
            this.initPTS[i.cc],
            this.vttCCs,
            i.cc,
            i.start,
            (o) => {
              this._appendCues(o, i.level),
                l.trigger(p.SUBTITLE_FRAG_PROCESSED, { success: !0, frag: i });
            },
            (o) => {
              let d = o.message === 'Missing initPTS for VTT MPEGTS';
              d ? a.push(t) : this._fallbackToIMSC1(i, r),
                l.logger.log(`Failed to parse VTT cue: ${o}`),
                (d && n > i.cc) ||
                  l.trigger(p.SUBTITLE_FRAG_PROCESSED, {
                    success: !1,
                    frag: i,
                    error: o,
                  });
            }
          );
        }
        _fallbackToIMSC1(t, e) {
          let i = this.tracks[t.level];
          i.textCodec ||
            tn(
              e,
              this.initPTS[t.cc],
              () => {
                (i.textCodec = wr), this._parseIMSC1(t, e);
              },
              () => {
                i.textCodec = 'wvtt';
              }
            );
        }
        _appendCues(t, e) {
          let i = this.hls;
          if (this.config.renderTextTracksNatively) {
            let r = this.textTracks[e];
            if (!r || r.mode === 'disabled') return;
            t.forEach((s) => Ka(r, s));
          } else {
            let r = this.tracks[e];
            if (!r) return;
            let s = r.default ? 'default' : 'subtitles' + e;
            i.trigger(p.CUES_PARSED, { type: 'subtitles', cues: t, track: s });
          }
        }
        onFragDecrypted(t, e) {
          let { frag: i } = e;
          i.type === j.SUBTITLE && this.onFragLoaded(p.FRAG_LOADED, e);
        }
        onSubtitleTracksCleared() {
          (this.tracks = []), (this.captionsTracks = {});
        }
        onFragParsingUserdata(t, e) {
          if (!this.enabled || !this.config.enableCEA708Captions) return;
          let { frag: i, samples: r } = e;
          if (i.type !== j.MAIN || this.closedCaptionsForLevel(i) !== 'NONE')
            for (let s = 0; s < r.length; s++) {
              let a = r[s].bytes;
              if (a) {
                this.cea608Parser1 || this.initCea608Parsers();
                let n = this.extractCea608Data(a);
                this.cea608Parser1.addData(r[s].pts, n[0]),
                  this.cea608Parser2.addData(r[s].pts, n[1]);
              }
            }
        }
        onBufferFlushing(
          t,
          { startOffset: e, endOffset: i, endOffsetSubtitles: r, type: s }
        ) {
          let { media: a } = this;
          if (a && !(a.currentTime < i)) {
            if (!s || s === 'video') {
              let { captionsTracks: n } = this;
              Object.keys(n).forEach((l) => Rr(n[l], e, i));
            }
            if (
              this.config.renderTextTracksNatively &&
              e === 0 &&
              r !== void 0
            ) {
              let { textTracks: n } = this;
              Object.keys(n).forEach((l) => Rr(n[l], e, r));
            }
          }
        }
        extractCea608Data(t) {
          let e = [[], []],
            i = 31 & t[0],
            r = 2;
          for (let s = 0; s < i; s++) {
            let a = t[r++],
              n = 127 & t[r++],
              l = 127 & t[r++];
            if ((n !== 0 || l !== 0) && (4 & a) != 0) {
              let o = 3 & a;
              (o === 0 || o === 1) && (e[o].push(n), e[o].push(l));
            }
          }
          return e;
        }
      }
      function sn(h) {
        return h.characteristics &&
          /transcribes-spoken-dialog/gi.test(h.characteristics) &&
          /describes-music-and-sound/gi.test(h.characteristics)
          ? 'captions'
          : 'subtitles';
      }
      function an(h, t) {
        return !!h && h.kind === sn(t) && Er(t, h);
      }
      function nn() {
        return {
          ccOffset: 0,
          presentationOffset: 0,
          0: { start: 0, prevCC: -1, new: !0 },
        };
      }
      let Gl = /\s/,
        Kl = /(\d+)-(\d+)\/(\d+)/;
      class ln {
        constructor(t) {
          (this.fetchSetup = void 0),
            (this.requestTimeout = void 0),
            (this.request = null),
            (this.response = null),
            (this.controller = void 0),
            (this.context = null),
            (this.config = null),
            (this.callbacks = null),
            (this.stats = void 0),
            (this.loader = null),
            (this.fetchSetup = t.fetchSetup || Vl),
            (this.controller = new F.AbortController()),
            (this.stats = new Oi());
        }
        destroy() {
          (this.loader =
            this.callbacks =
            this.context =
            this.config =
            this.request =
              null),
            this.abortInternal(),
            (this.response = null),
            (this.fetchSetup = this.controller = this.stats = null);
        }
        abortInternal() {
          this.controller &&
            !this.stats.loading.end &&
            ((this.stats.aborted = !0), this.controller.abort());
        }
        abort() {
          var t;
          this.abortInternal(),
            (t = this.callbacks) != null &&
              t.onAbort &&
              this.callbacks.onAbort(this.stats, this.context, this.response);
        }
        load(t, e, i) {
          let r = this.stats;
          if (r.loading.start) throw Error('Loader can only be used once.');
          r.loading.start = F.performance.now();
          let s = (function (d, u) {
              let c = {
                method: 'GET',
                mode: 'cors',
                credentials: 'same-origin',
                signal: u,
                headers: new F.Headers(at({}, d.headers)),
              };
              return (
                d.rangeEnd &&
                  c.headers.set(
                    'Range',
                    'bytes=' + d.rangeStart + '-' + String(d.rangeEnd - 1)
                  ),
                c
              );
            })(t, this.controller.signal),
            a = t.responseType === 'arraybuffer',
            n = a ? 'byteLength' : 'length',
            { maxTimeToFirstByteMs: l, maxLoadTimeMs: o } = e.loadPolicy;
          (this.context = t),
            (this.config = e),
            (this.callbacks = i),
            (this.request = this.fetchSetup(t, s)),
            F.clearTimeout(this.requestTimeout),
            (e.timeout = l && Y(l) ? l : o),
            (this.requestTimeout = F.setTimeout(() => {
              this.callbacks &&
                (this.abortInternal(),
                this.callbacks.onTimeout(r, t, this.response));
            }, e.timeout)),
            (Ke(this.request)
              ? this.request.then(F.fetch)
              : F.fetch(this.request)
            )
              .then((d) => {
                var u;
                this.response = this.loader = d;
                let c = Math.max(F.performance.now(), r.loading.start);
                if (
                  (F.clearTimeout(this.requestTimeout),
                  (e.timeout = o),
                  (this.requestTimeout = F.setTimeout(() => {
                    this.callbacks &&
                      (this.abortInternal(),
                      this.callbacks.onTimeout(r, t, this.response));
                  }, o - (c - r.loading.start))),
                  !d.ok)
                ) {
                  let { status: g, statusText: E } = d;
                  throw new Hl(E || 'fetch, bad network response', g, d);
                }
                (r.loading.first = c),
                  (r.total =
                    (function (g) {
                      let E = g.get('Content-Range');
                      if (E) {
                        let y = (function (S) {
                          let T = Kl.exec(S);
                          if (T) return parseInt(T[2]) - parseInt(T[1]) + 1;
                        })(E);
                        if (Y(y)) return y;
                      }
                      let m = g.get('Content-Length');
                      if (m) return parseInt(m);
                    })(d.headers) || r.total);
                let f = (u = this.callbacks) == null ? void 0 : u.onProgress;
                return f && Y(e.highWaterMark)
                  ? this.loadProgressively(d, r, t, e.highWaterMark, f)
                  : a
                  ? d.arrayBuffer()
                  : t.responseType === 'json'
                  ? d.json()
                  : d.text();
              })
              .then((d) => {
                var u, c;
                let f = this.response;
                if (!f) throw Error('loader destroyed');
                F.clearTimeout(this.requestTimeout),
                  (r.loading.end = Math.max(
                    F.performance.now(),
                    r.loading.first
                  ));
                let g = d[n];
                g && (r.loaded = r.total = g);
                let E = { url: f.url, data: d, code: f.status },
                  m = (u = this.callbacks) == null ? void 0 : u.onProgress;
                m && !Y(e.highWaterMark) && m(r, t, d, f),
                  (c = this.callbacks) == null || c.onSuccess(E, r, t, f);
              })
              .catch((d) => {
                var u;
                if ((F.clearTimeout(this.requestTimeout), r.aborted)) return;
                let c = (d && d.code) || 0,
                  f = d ? d.message : null;
                (u = this.callbacks) == null ||
                  u.onError({ code: c, text: f }, t, d ? d.details : null, r);
              });
        }
        getCacheAge() {
          let t = null;
          if (this.response) {
            let e = this.response.headers.get('age');
            t = e ? parseFloat(e) : null;
          }
          return t;
        }
        getResponseHeader(t) {
          return this.response ? this.response.headers.get(t) : null;
        }
        loadProgressively(t, e, i, r = 0, s) {
          let a = new Zs(),
            n = t.body.getReader(),
            l = () =>
              n
                .read()
                .then((o) => {
                  if (o.done)
                    return (
                      a.dataLength && s(e, i, a.flush().buffer, t),
                      Promise.resolve(new ArrayBuffer(0))
                    );
                  let d = o.value,
                    u = d.length;
                  return (
                    (e.loaded += u),
                    u < r || a.dataLength
                      ? (a.push(d),
                        a.dataLength >= r && s(e, i, a.flush().buffer, t))
                      : s(e, i, d.buffer, t),
                    l()
                  );
                })
                .catch(() => Promise.reject());
          return l();
        }
      }
      function Vl(h, t) {
        return new F.Request(h.url, t);
      }
      class Hl extends Error {
        constructor(t, e, i) {
          super(t),
            (this.code = void 0),
            (this.details = void 0),
            (this.code = e),
            (this.details = i);
        }
      }
      let Yl = /^age:\s*[\d.]+\s*$/im;
      class on {
        constructor(t) {
          (this.xhrSetup = void 0),
            (this.requestTimeout = void 0),
            (this.retryTimeout = void 0),
            (this.retryDelay = void 0),
            (this.config = null),
            (this.callbacks = null),
            (this.context = null),
            (this.loader = null),
            (this.stats = void 0),
            (this.xhrSetup = (t && t.xhrSetup) || null),
            (this.stats = new Oi()),
            (this.retryDelay = 0);
        }
        destroy() {
          (this.callbacks = null),
            this.abortInternal(),
            (this.loader = null),
            (this.config = null),
            (this.context = null),
            (this.xhrSetup = null);
        }
        abortInternal() {
          let t = this.loader;
          F.clearTimeout(this.requestTimeout),
            F.clearTimeout(this.retryTimeout),
            t &&
              ((t.onreadystatechange = null),
              (t.onprogress = null),
              t.readyState !== 4 && ((this.stats.aborted = !0), t.abort()));
        }
        abort() {
          var t;
          this.abortInternal(),
            (t = this.callbacks) != null &&
              t.onAbort &&
              this.callbacks.onAbort(this.stats, this.context, this.loader);
        }
        load(t, e, i) {
          if (this.stats.loading.start)
            throw Error('Loader can only be used once.');
          (this.stats.loading.start = F.performance.now()),
            (this.context = t),
            (this.config = e),
            (this.callbacks = i),
            this.loadInternal();
        }
        loadInternal() {
          let { config: t, context: e } = this;
          if (!t || !e) return;
          let i = (this.loader = new F.XMLHttpRequest()),
            r = this.stats;
          (r.loading.first = 0), (r.loaded = 0), (r.aborted = !1);
          let s = this.xhrSetup;
          s
            ? Promise.resolve()
                .then(() => {
                  if (this.loader === i && !this.stats.aborted)
                    return s(i, e.url);
                })
                .catch((a) => {
                  if (this.loader === i && !this.stats.aborted)
                    return i.open('GET', e.url, !0), s(i, e.url);
                })
                .then(() => {
                  this.loader !== i ||
                    this.stats.aborted ||
                    this.openAndSendXhr(i, e, t);
                })
                .catch((a) => {
                  var n;
                  (n = this.callbacks) == null ||
                    n.onError({ code: i.status, text: a.message }, e, i, r);
                })
            : this.openAndSendXhr(i, e, t);
        }
        openAndSendXhr(t, e, i) {
          t.readyState || t.open('GET', e.url, !0);
          let r = e.headers,
            { maxTimeToFirstByteMs: s, maxLoadTimeMs: a } = i.loadPolicy;
          if (r) for (let n in r) t.setRequestHeader(n, r[n]);
          e.rangeEnd &&
            t.setRequestHeader(
              'Range',
              'bytes=' + e.rangeStart + '-' + (e.rangeEnd - 1)
            ),
            (t.onreadystatechange = this.readystatechange.bind(this)),
            (t.onprogress = this.loadprogress.bind(this)),
            (t.responseType = e.responseType),
            F.clearTimeout(this.requestTimeout),
            (i.timeout = s && Y(s) ? s : a),
            (this.requestTimeout = F.setTimeout(
              this.loadtimeout.bind(this),
              i.timeout
            )),
            t.send();
        }
        readystatechange() {
          let { context: t, loader: e, stats: i } = this;
          if (!t || !e) return;
          let r = e.readyState,
            s = this.config;
          if (
            !i.aborted &&
            r >= 2 &&
            (i.loading.first === 0 &&
              ((i.loading.first = Math.max(
                F.performance.now(),
                i.loading.start
              )),
              s.timeout !== s.loadPolicy.maxLoadTimeMs &&
                (F.clearTimeout(this.requestTimeout),
                (s.timeout = s.loadPolicy.maxLoadTimeMs),
                (this.requestTimeout = F.setTimeout(
                  this.loadtimeout.bind(this),
                  s.loadPolicy.maxLoadTimeMs -
                    (i.loading.first - i.loading.start)
                )))),
            r === 4)
          ) {
            var a, n, l;
            F.clearTimeout(this.requestTimeout),
              (e.onreadystatechange = null),
              (e.onprogress = null);
            let o = e.status,
              d = e.responseType === 'text' ? e.responseText : null;
            if (o >= 200 && o < 300) {
              let c = d ?? e.response;
              if (c != null) {
                i.loading.end = Math.max(F.performance.now(), i.loading.first);
                let f =
                  e.responseType === 'arraybuffer' ? c.byteLength : c.length;
                (i.loaded = i.total = f),
                  (i.bwEstimate =
                    (8e3 * i.total) / (i.loading.end - i.loading.first));
                let g = (a = this.callbacks) == null ? void 0 : a.onProgress;
                g && g(i, t, c, e);
                let E = { url: e.responseURL, data: c, code: o };
                (n = this.callbacks) == null || n.onSuccess(E, i, t, e);
                return;
              }
            }
            let u = s.loadPolicy.errorRetry;
            ai(u, i.retry, !1, { url: t.url, data: void 0, code: o })
              ? this.retry(u)
              : (nt.error(`${o} while loading ${t.url}`),
                (l = this.callbacks) == null ||
                  l.onError({ code: o, text: e.statusText }, t, e, i));
          }
        }
        loadtimeout() {
          if (!this.config) return;
          let t = this.config.loadPolicy.timeoutRetry;
          if (ai(t, this.stats.retry, !0)) this.retry(t);
          else {
            var e;
            nt.warn(
              `timeout while loading ${
                (e = this.context) == null ? void 0 : e.url
              }`
            );
            let i = this.callbacks;
            i &&
              (this.abortInternal(),
              i.onTimeout(this.stats, this.context, this.loader));
          }
        }
        retry(t) {
          let { context: e, stats: i } = this;
          (this.retryDelay = Ki(t, i.retry)),
            i.retry++,
            nt.warn(
              `${status ? 'HTTP Status ' + status : 'Timeout'} while loading ${
                e?.url
              }, retrying ${i.retry}/${t.maxNumRetry} in ${this.retryDelay}ms`
            ),
            this.abortInternal(),
            (this.loader = null),
            F.clearTimeout(this.retryTimeout),
            (this.retryTimeout = F.setTimeout(
              this.loadInternal.bind(this),
              this.retryDelay
            ));
        }
        loadprogress(t) {
          let e = this.stats;
          (e.loaded = t.loaded), t.lengthComputable && (e.total = t.total);
        }
        getCacheAge() {
          let t = null;
          if (this.loader && Yl.test(this.loader.getAllResponseHeaders())) {
            let e = this.loader.getResponseHeader('age');
            t = e ? parseFloat(e) : null;
          }
          return t;
        }
        getResponseHeader(t) {
          return this.loader &&
            RegExp(`^${t}:\\s*[\\d.]+\\s*$`, 'im').test(
              this.loader.getAllResponseHeaders()
            )
            ? this.loader.getResponseHeader(t)
            : null;
        }
      }
      let Wl = J(
        J(
          {
            autoStartLoad: !0,
            startPosition: -1,
            defaultAudioCodec: void 0,
            debug: !1,
            capLevelOnFPSDrop: !1,
            capLevelToPlayerSize: !1,
            ignoreDevicePixelRatio: !1,
            maxDevicePixelRatio: Number.POSITIVE_INFINITY,
            preferManagedMediaSource: !0,
            initialLiveManifestSize: 1,
            maxBufferLength: 30,
            backBufferLength: 1 / 0,
            frontBufferFlushThreshold: 1 / 0,
            startOnSegmentBoundary: !1,
            maxBufferSize: 6e7,
            maxFragLookUpTolerance: 0.25,
            maxBufferHole: 0.1,
            detectStallWithCurrentTimeMs: 1250,
            highBufferWatchdogPeriod: 2,
            nudgeOffset: 0.1,
            nudgeMaxRetry: 3,
            nudgeOnVideoHole: !0,
            liveSyncMode: 'edge',
            liveSyncDurationCount: 3,
            liveSyncOnStallIncrease: 1,
            liveMaxLatencyDurationCount: 1 / 0,
            liveSyncDuration: void 0,
            liveMaxLatencyDuration: void 0,
            maxLiveSyncPlaybackRate: 1,
            liveDurationInfinity: !1,
            liveBackBufferLength: null,
            maxMaxBufferLength: 600,
            enableWorker: !0,
            workerPath: null,
            enableSoftwareAES: !0,
            startLevel: void 0,
            startFragPrefetch: !1,
            fpsDroppedMonitoringPeriod: 5e3,
            fpsDroppedMonitoringThreshold: 0.2,
            appendErrorMaxRetry: 3,
            ignorePlaylistParsingErrors: !1,
            loader: on,
            fLoader: void 0,
            pLoader: void 0,
            xhrSetup: void 0,
            licenseXhrSetup: void 0,
            licenseResponseCallback: void 0,
            abrController: An,
            bufferController: el,
            capLevelController: vr,
            errorController: Ln,
            fpsController: ml,
            stretchShortVideoTrack: !1,
            maxAudioFramesDrift: 1,
            forceKeyFrameOnDiscontinuity: !0,
            abrEwmaFastLive: 3,
            abrEwmaSlowLive: 9,
            abrEwmaFastVoD: 3,
            abrEwmaSlowVoD: 9,
            abrEwmaDefaultEstimate: 5e5,
            abrEwmaDefaultEstimateMax: 5e6,
            abrBandWidthFactor: 0.95,
            abrBandWidthUpFactor: 0.7,
            abrMaxWithRealBitrate: !1,
            maxStarvationDelay: 4,
            maxLoadingDelay: 4,
            minAutoBitrate: 0,
            emeEnabled: !1,
            widevineLicenseUrl: void 0,
            drmSystems: {},
            drmSystemOptions: {},
            requestMediaKeySystemAccessFunc: ks,
            requireKeySystemAccessOnStart: !1,
            testBandwidth: !0,
            progressive: !1,
            lowLatencyMode: !0,
            cmcd: void 0,
            enableDateRangeMetadataCues: !0,
            enableEmsgMetadataCues: !0,
            enableEmsgKLVMetadata: !1,
            enableID3MetadataCues: !0,
            enableInterstitialPlayback: !0,
            interstitialAppendInPlace: !0,
            interstitialLiveLookAhead: 10,
            useMediaCapabilities: !0,
            preserveManualLevelOnError: !1,
            certLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 8e3,
                maxLoadTimeMs: 2e4,
                timeoutRetry: null,
                errorRetry: null,
              },
            },
            keyLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 8e3,
                maxLoadTimeMs: 2e4,
                timeoutRetry: {
                  maxNumRetry: 1,
                  retryDelayMs: 1e3,
                  maxRetryDelayMs: 2e4,
                  backoff: 'linear',
                },
                errorRetry: {
                  maxNumRetry: 8,
                  retryDelayMs: 1e3,
                  maxRetryDelayMs: 2e4,
                  backoff: 'linear',
                },
              },
            },
            manifestLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 1 / 0,
                maxLoadTimeMs: 2e4,
                timeoutRetry: {
                  maxNumRetry: 2,
                  retryDelayMs: 0,
                  maxRetryDelayMs: 0,
                },
                errorRetry: {
                  maxNumRetry: 1,
                  retryDelayMs: 1e3,
                  maxRetryDelayMs: 8e3,
                },
              },
            },
            playlistLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 1e4,
                maxLoadTimeMs: 2e4,
                timeoutRetry: {
                  maxNumRetry: 2,
                  retryDelayMs: 0,
                  maxRetryDelayMs: 0,
                },
                errorRetry: {
                  maxNumRetry: 2,
                  retryDelayMs: 1e3,
                  maxRetryDelayMs: 8e3,
                },
              },
            },
            fragLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 1e4,
                maxLoadTimeMs: 12e4,
                timeoutRetry: {
                  maxNumRetry: 4,
                  retryDelayMs: 0,
                  maxRetryDelayMs: 0,
                },
                errorRetry: {
                  maxNumRetry: 6,
                  retryDelayMs: 1e3,
                  maxRetryDelayMs: 8e3,
                },
              },
            },
            steeringManifestLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 1e4,
                maxLoadTimeMs: 2e4,
                timeoutRetry: {
                  maxNumRetry: 2,
                  retryDelayMs: 0,
                  maxRetryDelayMs: 0,
                },
                errorRetry: {
                  maxNumRetry: 1,
                  retryDelayMs: 1e3,
                  maxRetryDelayMs: 8e3,
                },
              },
            },
            interstitialAssetListLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 1e4,
                maxLoadTimeMs: 3e4,
                timeoutRetry: {
                  maxNumRetry: 0,
                  retryDelayMs: 0,
                  maxRetryDelayMs: 0,
                },
                errorRetry: {
                  maxNumRetry: 0,
                  retryDelayMs: 1e3,
                  maxRetryDelayMs: 8e3,
                },
              },
            },
            manifestLoadingTimeOut: 1e4,
            manifestLoadingMaxRetry: 1,
            manifestLoadingRetryDelay: 1e3,
            manifestLoadingMaxRetryTimeout: 64e3,
            levelLoadingTimeOut: 1e4,
            levelLoadingMaxRetry: 4,
            levelLoadingRetryDelay: 1e3,
            levelLoadingMaxRetryTimeout: 64e3,
            fragLoadingTimeOut: 2e4,
            fragLoadingMaxRetry: 6,
            fragLoadingRetryDelay: 1e3,
            fragLoadingMaxRetryTimeout: 64e3,
          },
          {
            cueHandler: {
              newCue(h, t, e, i) {
                let r,
                  s,
                  a,
                  n,
                  l,
                  o = [],
                  d = F.VTTCue || F.TextTrackCue;
                for (let c = 0; c < i.rows.length; c++)
                  if (
                    ((r = i.rows[c]), (a = !0), (n = 0), (l = ''), !r.isEmpty())
                  ) {
                    var u;
                    for (let E = 0; E < r.chars.length; E++)
                      Gl.test(r.chars[E].uchar) && a
                        ? n++
                        : ((l += r.chars[E].uchar), (a = !1));
                    (r.cueStartTime = t),
                      t === e && (e += 1e-4),
                      n >= 16 ? n-- : n++;
                    let f = Qa(l.trim()),
                      g = Or(t, e, f);
                    (h != null && (u = h.cues) != null && u.getCueById(g)) ||
                      (((s = new d(t, e, f)).id = g),
                      (s.line = c + 1),
                      (s.align = 'left'),
                      (s.position =
                        10 + Math.min(80, 10 * Math.floor((8 * n) / 32))),
                      o.push(s));
                  }
                return (
                  h &&
                    o.length &&
                    (o.sort((c, f) =>
                      c.line === 'auto' || f.line === 'auto'
                        ? 0
                        : c.line > 8 && f.line > 8
                        ? f.line - c.line
                        : c.line - f.line
                    ),
                    o.forEach((c) => Ka(h, c))),
                  o
                );
              },
            },
            enableWebVTT: !0,
            enableIMSC1: !0,
            enableCEA708Captions: !0,
            captionsTextTrack1Label: 'English',
            captionsTextTrack1LanguageCode: 'en',
            captionsTextTrack2Label: 'Spanish',
            captionsTextTrack2LanguageCode: 'es',
            captionsTextTrack3Label: 'Unknown CC',
            captionsTextTrack3LanguageCode: '',
            captionsTextTrack4Label: 'Unknown CC',
            captionsTextTrack4LanguageCode: '',
            renderTextTracksNatively: !0,
          }
        ),
        {},
        {
          subtitleStreamController: Al,
          subtitleTrackController: pl,
          timelineController: $l,
          audioStreamController: Qn,
          audioTrackController: Zn,
          emeController: Pe,
          cmcdController: fl,
          contentSteeringController: gl,
          interstitialsController: Sl,
        }
      );
      class jl extends Ss {
        constructor(t, e) {
          super('gap-controller', t.logger),
            (this.hls = void 0),
            (this.fragmentTracker = void 0),
            (this.media = null),
            (this.mediaSource = void 0),
            (this.nudgeRetry = 0),
            (this.stallReported = !1),
            (this.stalled = null),
            (this.moved = !1),
            (this.seeking = !1),
            (this.buffered = {}),
            (this.lastCurrentTime = 0),
            (this.ended = 0),
            (this.waiting = 0),
            (this.onMediaPlaying = () => {
              (this.ended = 0), (this.waiting = 0);
            }),
            (this.onMediaWaiting = () => {
              var i;
              ((i = this.media) != null && i.seeking) ||
                ((this.waiting = F.performance.now()), this.tick());
            }),
            (this.onMediaEnded = () => {
              if (this.hls) {
                var i;
                (this.ended =
                  ((i = this.media) == null ? void 0 : i.currentTime) || 1),
                  this.hls.trigger(p.MEDIA_ENDED, { stalled: !1 });
              }
            }),
            (this.hls = t),
            (this.fragmentTracker = e),
            this.registerListeners();
        }
        registerListeners() {
          let { hls: t } = this;
          t &&
            (t.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.BUFFER_APPENDED, this.onBufferAppended, this));
        }
        unregisterListeners() {
          let { hls: t } = this;
          t &&
            (t.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.BUFFER_APPENDED, this.onBufferAppended, this));
        }
        destroy() {
          super.destroy(),
            this.unregisterListeners(),
            (this.media = this.hls = this.fragmentTracker = null),
            (this.mediaSource = void 0);
        }
        onMediaAttached(t, e) {
          this.setInterval(100), (this.mediaSource = e.mediaSource);
          let i = (this.media = e.media);
          Nt(i, 'playing', this.onMediaPlaying),
            Nt(i, 'waiting', this.onMediaWaiting),
            Nt(i, 'ended', this.onMediaEnded);
        }
        onMediaDetaching(t, e) {
          this.clearInterval();
          let { media: i } = this;
          i &&
            (Bt(i, 'playing', this.onMediaPlaying),
            Bt(i, 'waiting', this.onMediaWaiting),
            Bt(i, 'ended', this.onMediaEnded),
            (this.media = null)),
            (this.mediaSource = void 0);
        }
        onBufferAppended(t, e) {
          this.buffered = e.timeRanges;
        }
        get hasBuffered() {
          return Object.keys(this.buffered).length > 0;
        }
        tick() {
          var t;
          if (!((t = this.media) != null && t.readyState) || !this.hasBuffered)
            return;
          let e = this.media.currentTime;
          this.poll(e, this.lastCurrentTime), (this.lastCurrentTime = e);
        }
        poll(t, e) {
          var i, r, s;
          let a = (i = this.hls) == null ? void 0 : i.config;
          if (!a) return;
          let n = this.media;
          if (!n) return;
          let { seeking: l } = n,
            o = this.seeking && !l,
            d = !this.seeking && l,
            u = (n.paused && !l) || n.ended || n.playbackRate === 0;
          if (((this.seeking = l), t !== e)) {
            e && (this.ended = 0),
              (this.moved = !0),
              !l &&
                ((this.nudgeRetry = 0),
                a.nudgeOnVideoHole &&
                  !u &&
                  t > e &&
                  this.nudgeOnVideoHole(t, e)),
              this.waiting === 0 && this.stallResolved(t);
            return;
          }
          if (d || o) {
            o && this.stallResolved(t);
            return;
          }
          if (u) {
            (this.nudgeRetry = 0),
              this.stallResolved(t),
              !this.ended &&
                n.ended &&
                this.hls &&
                ((this.ended = t || 1),
                this.hls.trigger(p.MEDIA_ENDED, { stalled: !1 }));
            return;
          }
          if (!rt.getBuffered(n).length) {
            this.nudgeRetry = 0;
            return;
          }
          let c = rt.bufferInfo(n, t, 0),
            f = c.nextStart || 0,
            g = this.fragmentTracker;
          if (l && g && this.hls) {
            let I = hn(this.hls.inFlightFragments, t),
              v = c.len > 2,
              _ = !f || I || (f - t > 2 && !g.getPartialFragment(t));
            if (v || _) return;
            this.moved = !1;
          }
          let E = (r = this.hls) == null ? void 0 : r.latestLevelDetails;
          if (!this.moved && this.stalled !== null && g) {
            if (!(c.len > 0) && !f) return;
            let I = Math.max(f, c.start || 0) - t,
              v = E != null && E.live ? 2 * E.targetduration : 2,
              _ = Di(t, g);
            if (I > 0 && (I <= v || _)) {
              n.paused || this._trySkipBufferHole(_);
              return;
            }
          }
          let m = a.detectStallWithCurrentTimeMs,
            y = F.performance.now(),
            S = this.waiting,
            T = this.stalled;
          if (T === null)
            if (S > 0 && y - S < m) T = this.stalled = S;
            else {
              this.stalled = y;
              return;
            }
          let A = y - T;
          if (!l && (A >= m || S) && this.hls) {
            if (
              ((s = this.mediaSource) == null ? void 0 : s.readyState) ===
                'ended' &&
              !(E != null && E.live) &&
              1 > Math.abs(t - (E?.edge || 0))
            ) {
              if (this.ended) return;
              (this.ended = t || 1),
                this.hls.trigger(p.MEDIA_ENDED, { stalled: !0 });
              return;
            }
            if ((this._reportStall(c), !this.media || !this.hls)) return;
          }
          let R = rt.bufferInfo(n, t, a.maxBufferHole);
          this._tryFixBufferStall(R, A, t);
        }
        stallResolved(t) {
          let e = this.stalled;
          if (e && this.hls && ((this.stalled = null), this.stallReported)) {
            let i = F.performance.now() - e;
            this.log(
              `playback not stuck anymore @${t}, after ${Math.round(i)}ms`
            ),
              (this.stallReported = !1),
              (this.waiting = 0),
              this.hls.trigger(p.STALL_RESOLVED, {});
          }
        }
        nudgeOnVideoHole(t, e) {
          var i;
          let r = this.buffered.video;
          if (
            this.hls &&
            this.media &&
            this.fragmentTracker &&
            (i = this.buffered.audio) != null &&
            i.length &&
            r &&
            r.length > 1 &&
            t > r.end(0)
          ) {
            let s = rt.bufferedInfo(
              rt.timeRangesToArray(this.buffered.audio),
              t,
              0
            );
            if (s.len > 1 && e >= s.start) {
              let a = rt.timeRangesToArray(r),
                n = rt.bufferedInfo(a, e, 0).bufferedIndex;
              if (n > -1 && n < a.length - 1) {
                let l = rt.bufferedInfo(a, t, 0).bufferedIndex,
                  o = a[n].end,
                  d = a[n + 1].start;
                if ((l === -1 || l > n) && d - o < 1 && t - o < 2) {
                  let u = Error(
                    `nudging playhead to flush pipeline after video hole. currentTime: ${t} hole: ${o} -> ${d} buffered index: ${l}`
                  );
                  this.warn(u.message), (this.media.currentTime += 1e-6);
                  let c = Di(t, this.fragmentTracker);
                  c && 'fragment' in c ? (c = c.fragment) : c || (c = void 0);
                  let f = rt.bufferInfo(this.media, t, 0);
                  this.hls.trigger(p.ERROR, {
                    type: Q.MEDIA_ERROR,
                    details: b.BUFFER_SEEK_OVER_HOLE,
                    fatal: !1,
                    error: u,
                    reason: u.message,
                    frag: c,
                    buffer: f.len,
                    bufferInfo: f,
                  });
                }
              }
            }
          }
        }
        _tryFixBufferStall(t, e, i) {
          var r, s;
          let { fragmentTracker: a, media: n } = this,
            l = (r = this.hls) == null ? void 0 : r.config;
          if (!n || !a || !l) return;
          let o = (s = this.hls) == null ? void 0 : s.latestLevelDetails,
            d = Di(i, a);
          if (
            (d || (o != null && o.live && i < o.fragmentStart)) &&
            (this._trySkipBufferHole(d) || !this.media)
          )
            return;
          let u = t.buffered,
            c = this.adjacentTraversal(t, i);
          ((u && u.length > 1 && t.len > l.maxBufferHole) ||
            (t.nextStart && (t.nextStart - i < l.maxBufferHole || c))) &&
            (e > 1e3 * l.highBufferWatchdogPeriod || this.waiting) &&
            (this.warn('Trying to nudge playhead over buffer-hole'),
            this._tryNudgeBuffer(t));
        }
        adjacentTraversal(t, e) {
          let i = this.fragmentTracker,
            r = t.nextStart;
          if (i && r) {
            let s = i.getFragAtPos(e, j.MAIN),
              a = i.getFragAtPos(r, j.MAIN);
            if (s && a) return a.sn - s.sn < 2;
          }
          return !1;
        }
        _reportStall(t) {
          let { hls: e, media: i, stallReported: r, stalled: s } = this;
          if (!r && s !== null && i && e) {
            this.stallReported = !0;
            let a = Error(
              `Playback stalling at @${i.currentTime} due to low buffer (${yt(
                t
              )})`
            );
            this.warn(a.message),
              e.trigger(p.ERROR, {
                type: Q.MEDIA_ERROR,
                details: b.BUFFER_STALLED_ERROR,
                fatal: !1,
                error: a,
                buffer: t.len,
                bufferInfo: t,
                stalled: { start: s },
              });
          }
        }
        _trySkipBufferHole(t) {
          var e, i;
          let { fragmentTracker: r, media: s } = this,
            a = (e = this.hls) == null ? void 0 : e.config;
          if (!s || !r || !a) return 0;
          let n = s.currentTime,
            l = rt.bufferInfo(s, n, 0),
            o = n < l.start ? l.start : l.nextStart;
          if (o && this.hls) {
            let d = l.len <= a.maxBufferHole,
              u = l.len > 0 && l.len < 1 && s.readyState < 3,
              c = o - n;
            if (c > 0 && (d || u)) {
              if (c > a.maxBufferHole) {
                let g = !1;
                if (n === 0) {
                  let E = r.getAppendedFrag(0, j.MAIN);
                  E && o < E.end && (g = !0);
                }
                if (!g && t) {
                  if (
                    !((i = this.hls.loadLevelObj) != null && i.details) ||
                    hn(this.hls.inFlightFragments, o)
                  )
                    return 0;
                  let E = !1,
                    m = t.end;
                  for (; m < o; ) {
                    let y = Di(m, r);
                    if (y) m += y.duration;
                    else {
                      E = !0;
                      break;
                    }
                  }
                  if (E) return 0;
                }
              }
              let f = Math.max(o + 0.05, n + 0.1);
              if (
                (this.warn(
                  `skipping hole, adjusting currentTime from ${n} to ${f}`
                ),
                (this.moved = !0),
                (s.currentTime = f),
                !(t != null && t.gap))
              ) {
                let g = Error(
                    `fragment loaded with buffer holes, seeking from ${n} to ${f}`
                  ),
                  E = {
                    type: Q.MEDIA_ERROR,
                    details: b.BUFFER_SEEK_OVER_HOLE,
                    fatal: !1,
                    error: g,
                    reason: g.message,
                    buffer: l.len,
                    bufferInfo: l,
                  };
                t && ('fragment' in t ? (E.part = t) : (E.frag = t)),
                  this.hls.trigger(p.ERROR, E);
              }
              return f;
            }
          }
          return 0;
        }
        _tryNudgeBuffer(t) {
          let { hls: e, media: i, nudgeRetry: r } = this,
            s = e?.config;
          if (!i || !s) return 0;
          let a = i.currentTime;
          if ((this.nudgeRetry++, r < s.nudgeMaxRetry)) {
            let n = a + (r + 1) * s.nudgeOffset,
              l = Error(`Nudging 'currentTime' from ${a} to ${n}`);
            this.warn(l.message),
              (i.currentTime = n),
              e.trigger(p.ERROR, {
                type: Q.MEDIA_ERROR,
                details: b.BUFFER_NUDGE_ON_STALL,
                error: l,
                fatal: !1,
                buffer: t.len,
                bufferInfo: t,
              });
          } else {
            let n = Error(
              `Playhead still not moving while enough data buffered @${a} after ${s.nudgeMaxRetry} nudges`
            );
            this.error(n.message),
              e.trigger(p.ERROR, {
                type: Q.MEDIA_ERROR,
                details: b.BUFFER_STALLED_ERROR,
                error: n,
                fatal: !0,
                buffer: t.len,
                bufferInfo: t,
              });
          }
        }
      }
      function hn(h, t) {
        let e = dn(h.main);
        if (e && e.start <= t) return e;
        let i = dn(h.audio);
        return i && i.start <= t ? i : null;
      }
      function dn(h) {
        if (!h) return null;
        switch (h.state) {
          case N.IDLE:
          case N.STOPPED:
          case N.ENDED:
          case N.ERROR:
            return null;
        }
        return h.frag;
      }
      function Di(h, t) {
        return t.getAppendedFrag(h, j.MAIN) || t.getPartialFragment(h);
      }
      function Nr() {
        if (typeof F < 'u') return F.VTTCue || F.TextTrackCue;
      }
      function Ur(h, t, e, i, r) {
        let s = new h(t, e, '');
        try {
          (s.value = i), r && (s.type = r);
        } catch {
          s = new h(t, e, yt(r ? J({ type: r }, i) : i));
        }
        return s;
      }
      let ki = (() => {
        let h = Nr();
        try {
          h && new h(0, Number.POSITIVE_INFINITY, '');
        } catch {
          return Number.MAX_VALUE;
        }
        return Number.POSITIVE_INFINITY;
      })();
      class ql {
        constructor(t) {
          (this.hls = void 0),
            (this.id3Track = null),
            (this.media = null),
            (this.dateRangeCuesAppended = {}),
            (this.removeCues = !0),
            (this.assetCue = void 0),
            (this.onEventCueEnter = () => {
              this.hls && this.hls.trigger(p.EVENT_CUE_ENTER, {});
            }),
            (this.hls = t),
            this._registerListeners();
        }
        destroy() {
          this._unregisterListeners(),
            (this.id3Track = null),
            (this.media = null),
            (this.dateRangeCuesAppended = {}),
            (this.hls = this.onEventCueEnter = null);
        }
        _registerListeners() {
          let { hls: t } = this;
          t &&
            (t.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.FRAG_PARSING_METADATA, this.onFragParsingMetadata, this),
            t.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this),
            t.on(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.on(p.LEVEL_PTS_UPDATED, this.onLevelPtsUpdated, this));
        }
        _unregisterListeners() {
          let { hls: t } = this;
          t &&
            (t.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this),
            t.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.FRAG_PARSING_METADATA, this.onFragParsingMetadata, this),
            t.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this),
            t.off(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.off(p.LEVEL_PTS_UPDATED, this.onLevelPtsUpdated, this));
        }
        onMediaAttaching(t, e) {
          var i;
          (this.media = e.media),
            ((i = e.overrides) == null ? void 0 : i.cueRemoval) === !1 &&
              (this.removeCues = !1);
        }
        onMediaAttached() {
          var t;
          let e = (t = this.hls) == null ? void 0 : t.latestLevelDetails;
          e && this.updateDateRangeCues(e);
        }
        onMediaDetaching(t, e) {
          (this.media = null),
            e.transferMedia ||
              (this.id3Track &&
                (this.removeCues && _e(this.id3Track, this.onEventCueEnter),
                (this.id3Track = null)),
              (this.dateRangeCuesAppended = {}));
        }
        onManifestLoading() {
          this.dateRangeCuesAppended = {};
        }
        createTrack(t) {
          let e = this.getID3Track(t.textTracks);
          return (e.mode = 'hidden'), e;
        }
        getID3Track(t) {
          if (this.media) {
            for (let e = 0; e < t.length; e++) {
              let i = t[e];
              if (i.kind === 'metadata' && i.label === 'id3')
                return Ga(i, this.media), i;
            }
            return this.media.addTextTrack('metadata', 'id3');
          }
        }
        onFragParsingMetadata(t, e) {
          if (!this.media || !this.hls) return;
          let { enableEmsgMetadataCues: i, enableID3MetadataCues: r } =
            this.hls.config;
          if (!i && !r) return;
          let { samples: s } = e;
          this.id3Track || (this.id3Track = this.createTrack(this.media));
          let a = Nr();
          if (a)
            for (let n = 0; n < s.length; n++) {
              let l = s[n].type;
              if ((l === Vt.emsg && !i) || !r) continue;
              let o = aa(s[n].data),
                d = s[n].pts,
                u = d + s[n].duration;
              u > ki && (u = ki), u - d <= 0 && (u = d + 0.25);
              for (let c = 0; c < o.length; c++) {
                let f = o[c];
                if (!na(f)) {
                  this.updateId3CueEnds(d, l);
                  let g = Ur(a, d, u, f, l);
                  g && this.id3Track.addCue(g);
                }
              }
            }
        }
        updateId3CueEnds(t, e) {
          var i;
          let r = (i = this.id3Track) == null ? void 0 : i.cues;
          if (r)
            for (let s = r.length; s--; ) {
              let a = r[s];
              a.type === e &&
                a.startTime < t &&
                a.endTime === ki &&
                (a.endTime = t);
            }
        }
        onBufferFlushing(t, { startOffset: e, endOffset: i, type: r }) {
          let { id3Track: s, hls: a } = this;
          if (!a) return;
          let {
            config: { enableEmsgMetadataCues: n, enableID3MetadataCues: l },
          } = a;
          s &&
            (n || l) &&
            Rr(
              s,
              e,
              i,
              r === 'audio'
                ? (o) => o.type === Vt.audioId3 && l
                : r === 'video'
                ? (o) => o.type === Vt.emsg && n
                : (o) =>
                    (o.type === Vt.audioId3 && l) || (o.type === Vt.emsg && n)
            );
        }
        onLevelUpdated(t, { details: e }) {
          this.updateDateRangeCues(e, !0);
        }
        onLevelPtsUpdated(t, e) {
          Math.abs(e.drift) > 0.01 && this.updateDateRangeCues(e.details);
        }
        updateDateRangeCues(t, e) {
          var i, r;
          if (!this.hls || !this.media) return;
          let {
            assetPlayerId: s,
            timelineOffset: a,
            enableDateRangeMetadataCues: n,
            interstitialsController: l,
          } = this.hls.config;
          if (!n) return;
          let o = Nr();
          if (s && a && !l) {
            let { fragmentStart: E, fragmentEnd: m } = t,
              y = this.assetCue;
            y
              ? ((y.startTime = E), (y.endTime = m))
              : o &&
                (y = this.assetCue =
                  Ur(
                    o,
                    E,
                    m,
                    { assetPlayerId: this.hls.config.assetPlayerId },
                    'hlsjs.interstitial.asset'
                  )) &&
                ((y.id = s),
                this.id3Track || (this.id3Track = this.createTrack(this.media)),
                this.id3Track.addCue(y),
                y.addEventListener('enter', this.onEventCueEnter));
          }
          if (!t.hasProgramDateTime) return;
          let { id3Track: d } = this,
            { dateRanges: u } = t,
            c = Object.keys(u),
            f = this.dateRangeCuesAppended;
          if (d && e)
            if ((i = d.cues) != null && i.length) {
              let E = Object.keys(f).filter((m) => !c.includes(m));
              for (let m = E.length; m--; ) {
                let y = E[m],
                  S = (r = f[y]) == null ? void 0 : r.cues;
                delete f[y],
                  S &&
                    Object.keys(S).forEach((T) => {
                      let A = S[T];
                      if (A) {
                        A.removeEventListener('enter', this.onEventCueEnter);
                        try {
                          d.removeCue(A);
                        } catch {}
                      }
                    });
              }
            } else f = this.dateRangeCuesAppended = {};
          let g = t.fragments[t.fragments.length - 1];
          if (c.length !== 0 && Y(g?.programDateTime)) {
            this.id3Track || (this.id3Track = this.createTrack(this.media));
            for (let E = 0; E < c.length; E++) {
              let m = c[E],
                y = u[m],
                S = y.startTime,
                T = f[m],
                A = T?.cues || {},
                R = T?.durationKnown || !1,
                I = ki,
                { duration: v, endDate: _ } = y;
              if (_ && v !== null) (I = S + v), (R = !0);
              else if (y.endOnNext && !R) {
                let C = c.reduce((M, G) => {
                  if (G !== y.id) {
                    let k = u[G];
                    if (
                      k.class === y.class &&
                      k.startDate > y.startDate &&
                      (!M || y.startDate < M.startDate)
                    )
                      return k;
                  }
                  return M;
                }, null);
                C && ((I = C.startTime), (R = !0));
              }
              let L = Object.keys(y.attr);
              for (let C = 0; C < L.length; C++) {
                let M = L[C];
                if (
                  !(
                    M !== 'ID' &&
                    M !== 'CLASS' &&
                    M !== 'CUE' &&
                    M !== 'START-DATE' &&
                    M !== 'DURATION' &&
                    M !== 'END-DATE' &&
                    M !== 'END-ON-NEXT'
                  )
                )
                  continue;
                let G = A[M];
                if (G)
                  R && !(T != null && T.durationKnown)
                    ? (G.endTime = I)
                    : Math.abs(G.startTime - S) > 0.01 &&
                      ((G.startTime = S), (G.endTime = I));
                else if (o) {
                  let k = y.attr[M];
                  (M === 'SCTE35-OUT' ||
                    M === 'SCTE35-IN' ||
                    M === 'SCTE35-CMD') &&
                    (k = fe(k));
                  let P = Ur(o, S, I, { key: M, data: k }, Vt.dateRange);
                  P &&
                    ((P.id = m),
                    this.id3Track.addCue(P),
                    (A[M] = P),
                    l &&
                      (M === 'X-ASSET-LIST' || M === 'X-ASSET-URL') &&
                      P.addEventListener('enter', this.onEventCueEnter));
                }
              }
              f[m] = { cues: A, dateRange: y, durationKnown: R };
            }
          }
        }
      }
      class Xl {
        constructor(t) {
          (this.hls = void 0),
            (this.config = void 0),
            (this.media = null),
            (this.currentTime = 0),
            (this.stallCount = 0),
            (this._latency = null),
            (this._targetLatencyUpdated = !1),
            (this.onTimeupdate = () => {
              let { media: e } = this,
                i = this.levelDetails;
              if (!e || !i) return;
              this.currentTime = e.currentTime;
              let r = this.computeLatency();
              if (r === null) return;
              this._latency = r;
              let { lowLatencyMode: s, maxLiveSyncPlaybackRate: a } =
                this.config;
              if (!s || a === 1 || !i.live) return;
              let n = this.targetLatency;
              if (n === null) return;
              let l = r - n;
              if (
                l < Math.min(this.maxLatency, n + i.targetduration) &&
                l > 0.05 &&
                this.forwardBufferLength > 1
              ) {
                let o =
                  Math.round(
                    (2 / (1 + Math.exp(-0.75 * l - this.edgeStalled))) * 20
                  ) / 20;
                this.changeMediaPlaybackRate(
                  e,
                  Math.min(Math.min(2, Math.max(1, a)), Math.max(1, o))
                );
              } else
                e.playbackRate !== 1 &&
                  e.playbackRate !== 0 &&
                  this.changeMediaPlaybackRate(e, 1);
            }),
            (this.hls = t),
            (this.config = t.config),
            this.registerListeners();
        }
        get levelDetails() {
          var t;
          return (
            ((t = this.hls) == null ? void 0 : t.latestLevelDetails) || null
          );
        }
        get latency() {
          return this._latency || 0;
        }
        get maxLatency() {
          let { config: t } = this;
          if (t.liveMaxLatencyDuration !== void 0)
            return t.liveMaxLatencyDuration;
          let e = this.levelDetails;
          return e ? t.liveMaxLatencyDurationCount * e.targetduration : 0;
        }
        get targetLatency() {
          let t = this.levelDetails;
          if (t === null || this.hls === null) return null;
          let { holdBack: e, partHoldBack: i, targetduration: r } = t,
            {
              liveSyncDuration: s,
              liveSyncDurationCount: a,
              lowLatencyMode: n,
            } = this.config,
            l = this.hls.userConfig,
            o = (n && i) || e;
          return (
            (this._targetLatencyUpdated ||
              l.liveSyncDuration ||
              l.liveSyncDurationCount ||
              o === 0) &&
              (o = s !== void 0 ? s : a * r),
            o +
              Math.min(this.stallCount * this.config.liveSyncOnStallIncrease, r)
          );
        }
        set targetLatency(t) {
          (this.stallCount = 0),
            (this.config.liveSyncDuration = t),
            (this._targetLatencyUpdated = !0);
        }
        get liveSyncPosition() {
          let t = this.estimateLiveEdge(),
            e = this.targetLatency;
          if (t === null || e === null) return null;
          let i = this.levelDetails;
          if (i === null) return null;
          let r = i.edge,
            s = t - e - this.edgeStalled;
          return Math.min(
            Math.max(r - i.totalduration, s),
            r -
              ((this.config.lowLatencyMode && i.partTarget) || i.targetduration)
          );
        }
        get drift() {
          let t = this.levelDetails;
          return t === null ? 1 : t.drift;
        }
        get edgeStalled() {
          let t = this.levelDetails;
          if (t === null) return 0;
          let e =
            3 *
            ((this.config.lowLatencyMode && t.partTarget) || t.targetduration);
          return Math.max(t.age - e, 0);
        }
        get forwardBufferLength() {
          let { media: t } = this,
            e = this.levelDetails;
          if (!t || !e) return 0;
          let i = t.buffered.length;
          return (i ? t.buffered.end(i - 1) : e.edge) - this.currentTime;
        }
        destroy() {
          this.unregisterListeners(),
            this.onMediaDetaching(),
            (this.hls = null);
        }
        registerListeners() {
          let { hls: t } = this;
          t &&
            (t.on(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.on(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.on(p.ERROR, this.onError, this));
        }
        unregisterListeners() {
          let { hls: t } = this;
          t &&
            (t.off(p.MEDIA_ATTACHED, this.onMediaAttached, this),
            t.off(p.MEDIA_DETACHING, this.onMediaDetaching, this),
            t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.LEVEL_UPDATED, this.onLevelUpdated, this),
            t.off(p.ERROR, this.onError, this));
        }
        onMediaAttached(t, e) {
          (this.media = e.media),
            this.media.addEventListener('timeupdate', this.onTimeupdate);
        }
        onMediaDetaching() {
          this.media &&
            (this.media.removeEventListener('timeupdate', this.onTimeupdate),
            (this.media = null));
        }
        onManifestLoading() {
          (this._latency = null), (this.stallCount = 0);
        }
        onLevelUpdated(t, { details: e }) {
          e.advanced && this.onTimeupdate(),
            !e.live &&
              this.media &&
              this.media.removeEventListener('timeupdate', this.onTimeupdate);
        }
        onError(t, e) {
          var i;
          e.details === b.BUFFER_STALLED_ERROR &&
            (this.stallCount++,
            this.hls &&
              (i = this.levelDetails) != null &&
              i.live &&
              this.hls.logger.warn(
                '[latency-controller]: Stall detected, adjusting target latency'
              ));
        }
        changeMediaPlaybackRate(t, e) {
          var i, r;
          t.playbackRate !== e &&
            ((i = this.hls) == null ||
              i.logger.debug(
                `[latency-controller]: latency=${this.latency.toFixed(
                  3
                )}, targetLatency=${
                  (r = this.targetLatency) == null ? void 0 : r.toFixed(3)
                }, forwardBufferLength=${this.forwardBufferLength.toFixed(
                  3
                )}: adjusting playback rate from ${t.playbackRate} to ${e}`
              ),
            (t.playbackRate = e));
        }
        estimateLiveEdge() {
          let t = this.levelDetails;
          return t === null ? null : t.edge + t.age;
        }
        computeLatency() {
          let t = this.estimateLiveEdge();
          return t === null ? null : t - this.currentTime;
        }
      }
      class zl extends pr {
        constructor(t, e) {
          super(t, 'level-controller'),
            (this._levels = []),
            (this._firstLevel = -1),
            (this._maxAutoLevel = -1),
            (this._startLevel = void 0),
            (this.currentLevel = null),
            (this.currentLevelIndex = -1),
            (this.manualLevelIndex = -1),
            (this.steering = void 0),
            (this.onParsedComplete = void 0),
            (this.steering = e),
            this._registerListeners();
        }
        _registerListeners() {
          let { hls: t } = this;
          t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.on(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.on(p.FRAG_BUFFERED, this.onFragBuffered, this),
            t.on(p.ERROR, this.onError, this);
        }
        _unregisterListeners() {
          let { hls: t } = this;
          t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.MANIFEST_LOADED, this.onManifestLoaded, this),
            t.off(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.off(p.FRAG_BUFFERED, this.onFragBuffered, this),
            t.off(p.ERROR, this.onError, this);
        }
        destroy() {
          this._unregisterListeners(),
            (this.steering = null),
            this.resetLevels(),
            super.destroy();
        }
        stopLoad() {
          this._levels.forEach((t) => {
            (t.loadError = 0), (t.fragmentError = 0);
          }),
            super.stopLoad();
        }
        resetLevels() {
          (this._startLevel = void 0),
            (this.manualLevelIndex = -1),
            (this.currentLevelIndex = -1),
            (this.currentLevel = null),
            (this._levels = []),
            (this._maxAutoLevel = -1);
        }
        onManifestLoading(t, e) {
          this.resetLevels();
        }
        onManifestLoaded(t, e) {
          let i = this.hls.config.preferManagedMediaSource,
            r = [],
            s = {},
            a = {},
            n = !1,
            l = !1,
            o = !1;
          e.levels.forEach((d) => {
            let u = d.attrs,
              { audioCodec: c, videoCodec: f } = d;
            c && (d.audioCodec = c = Je(c, i) || void 0),
              f &&
                (f = d.videoCodec =
                  (function (C) {
                    let M = C.split(',');
                    for (let G = 0; G < M.length; G++) {
                      let k = M[G].split('.');
                      k.length > 2 &&
                        k[0] === 'avc1' &&
                        (M[G] = `avc1.${parseInt(k[1]).toString(16)}${(
                          '000' + parseInt(k[2]).toString(16)
                        ).slice(-4)}`);
                    }
                    return M.join(',');
                  })(f));
            let { width: g, height: E, unknownCodecs: m } = d,
              y = m ? m.length : 0;
            if (m)
              for (let C = y; C--; ) {
                let M = m[C];
                this.isAudioSupported(M)
                  ? ((d.audioCodec = c = c ? `${c},${M}` : M),
                    y--,
                    (Ae.audio[c.substring(0, 4)] = 2))
                  : this.isVideoSupported(M) &&
                    ((d.videoCodec = f = f ? `${f},${M}` : M),
                    y--,
                    (Ae.video[f.substring(0, 4)] = 2));
              }
            if (
              (n || (n = !!(g && E)),
              l || (l = !!f),
              o || (o = !!c),
              y ||
                (c && !this.isAudioSupported(c)) ||
                (f && !this.isVideoSupported(f)))
            ) {
              this.log(`Some or all CODECS not supported "${u.CODECS}"`);
              return;
            }
            let {
                CODECS: S,
                'FRAME-RATE': T,
                'HDCP-LEVEL': A,
                'PATHWAY-ID': R,
                RESOLUTION: I,
                'VIDEO-RANGE': v,
              } = u,
              _ = `${R || '.'}-`,
              L = `${_}${d.bitrate}-${I}-${T}-${S}-${v}-${A}`;
            if (s[L])
              if (s[L].uri === d.url || d.attrs['PATHWAY-ID'])
                s[L].addGroupId('audio', u.AUDIO),
                  s[L].addGroupId('text', u.SUBTITLES);
              else {
                let C = (a[L] += 1);
                d.attrs['PATHWAY-ID'] = Array(C + 1).join('.');
                let M = this.createLevel(d);
                (s[L] = M), r.push(M);
              }
            else {
              let C = this.createLevel(d);
              (s[L] = C), (a[L] = 1), r.push(C);
            }
          }),
            this.filterAndSortMediaOptions(r, e, n, l, o);
        }
        createLevel(t) {
          let e = new Me(t),
            i = t.supplemental;
          if (
            i != null &&
            i.videoCodec &&
            !this.isVideoSupported(i.videoCodec)
          ) {
            let r = Error(
              `SUPPLEMENTAL-CODECS not supported "${i.videoCodec}"`
            );
            this.log(r.message), (e.supportedResult = ss(r, []));
          }
          return e;
        }
        isAudioSupported(t) {
          return Ni(t, 'audio', this.hls.config.preferManagedMediaSource);
        }
        isVideoSupported(t) {
          return Ni(t, 'video', this.hls.config.preferManagedMediaSource);
        }
        filterAndSortMediaOptions(t, e, i, r, s) {
          let a = [],
            n = [],
            l = t;
          if (
            ((i || r) &&
              s &&
              (l = l.filter(
                ({ videoCodec: m, videoRange: y, width: S, height: T }) => {
                  var A;
                  return (!!m || !!(S && T)) && !!(A = y) && ei.indexOf(A) > -1;
                }
              )),
            l.length === 0)
          ) {
            Promise.resolve().then(() => {
              if (this.hls) {
                let m = 'no level with compatible codecs found in manifest',
                  y = m;
                e.levels.length &&
                  ((y = `one or more CODECS in variant not supported: ${yt(
                    e.levels
                      .map((T) => T.attrs.CODECS)
                      .filter((T, A, R) => R.indexOf(T) === A)
                  )}`),
                  this.warn(y),
                  (m += ` (${y})`));
                let S = Error(m);
                this.hls.trigger(p.ERROR, {
                  type: Q.MEDIA_ERROR,
                  details: b.MANIFEST_INCOMPATIBLE_CODECS_ERROR,
                  fatal: !0,
                  url: e.url,
                  error: S,
                  reason: y,
                });
              }
            });
            return;
          }
          e.audioTracks &&
            un(
              (a = e.audioTracks.filter(
                (m) => !m.audioCodec || this.isAudioSupported(m.audioCodec)
              ))
            ),
            e.subtitles && un((n = e.subtitles));
          let o = l.slice(0);
          l.sort((m, y) => {
            if (m.attrs['HDCP-LEVEL'] !== y.attrs['HDCP-LEVEL'])
              return (m.attrs['HDCP-LEVEL'] || '') >
                (y.attrs['HDCP-LEVEL'] || '')
                ? 1
                : -1;
            if (i && m.height !== y.height) return m.height - y.height;
            if (m.frameRate !== y.frameRate) return m.frameRate - y.frameRate;
            if (m.videoRange !== y.videoRange)
              return ei.indexOf(m.videoRange) - ei.indexOf(y.videoRange);
            if (m.videoCodec !== y.videoCodec) {
              let S = ts(m.videoCodec),
                T = ts(y.videoCodec);
              if (S !== T) return T - S;
            }
            if (m.uri === y.uri && m.codecSet !== y.codecSet) {
              let S = Ze(m.codecSet),
                T = Ze(y.codecSet);
              if (S !== T) return T - S;
            }
            return m.averageBitrate !== y.averageBitrate
              ? m.averageBitrate - y.averageBitrate
              : 0;
          });
          let d = o[0];
          if (
            this.steering &&
            (l = this.steering.filterParsedLevels(l)).length !== o.length
          ) {
            for (let m = 0; m < o.length; m++)
              if (o[m].pathwayId === l[0].pathwayId) {
                d = o[m];
                break;
              }
          }
          this._levels = l;
          for (let m = 0; m < l.length; m++)
            if (l[m] === d) {
              var u;
              this._firstLevel = m;
              let y = d.bitrate,
                S = this.hls.bandwidthEstimate;
              if (
                (this.log(
                  `manifest loaded, ${l.length} level(s) found, first bitrate: ${y}`
                ),
                ((u = this.hls.userConfig) == null
                  ? void 0
                  : u.abrEwmaDefaultEstimate) === void 0)
              ) {
                let T = Math.min(y, this.hls.config.abrEwmaDefaultEstimateMax);
                T > S &&
                  S === this.hls.abrEwmaDefaultEstimate &&
                  (this.hls.bandwidthEstimate = T);
              }
              break;
            }
          let c = s && !r,
            f = this.hls.config,
            g = !!(f.audioStreamController && f.audioTrackController),
            E = {
              levels: l,
              audioTracks: a,
              subtitleTracks: n,
              sessionData: e.sessionData,
              sessionKeys: e.sessionKeys,
              firstLevel: this._firstLevel,
              stats: e.stats,
              audio: s,
              video: r,
              altAudio: g && !c && a.some((m) => !!m.url),
            };
          this.hls.trigger(p.MANIFEST_PARSED, E);
        }
        get levels() {
          return this._levels.length === 0 ? null : this._levels;
        }
        get loadLevelObj() {
          return this.currentLevel;
        }
        get level() {
          return this.currentLevelIndex;
        }
        set level(t) {
          let e = this._levels;
          if (e.length === 0) return;
          if (t < 0 || t >= e.length) {
            let d = Error('invalid level idx'),
              u = t < 0;
            if (
              (this.hls.trigger(p.ERROR, {
                type: Q.OTHER_ERROR,
                details: b.LEVEL_SWITCH_ERROR,
                level: t,
                fatal: u,
                error: d,
                reason: d.message,
              }),
              u)
            )
              return;
            t = Math.min(t, e.length - 1);
          }
          let i = this.currentLevelIndex,
            r = this.currentLevel,
            s = r ? r.attrs['PATHWAY-ID'] : void 0,
            a = e[t],
            n = a.attrs['PATHWAY-ID'];
          if (
            ((this.currentLevelIndex = t),
            (this.currentLevel = a),
            i === t && r && s === n)
          )
            return;
          this.log(
            `Switching to level ${t} (${a.height ? a.height + 'p ' : ''}${
              a.videoRange ? a.videoRange + ' ' : ''
            }${a.codecSet ? a.codecSet + ' ' : ''}@${a.bitrate})${
              n ? ' with Pathway ' + n : ''
            } from level ${i}${s ? ' with Pathway ' + s : ''}`
          );
          let l = {
            level: t,
            attrs: a.attrs,
            details: a.details,
            bitrate: a.bitrate,
            averageBitrate: a.averageBitrate,
            maxBitrate: a.maxBitrate,
            realBitrate: a.realBitrate,
            width: a.width,
            height: a.height,
            codecSet: a.codecSet,
            audioCodec: a.audioCodec,
            videoCodec: a.videoCodec,
            audioGroups: a.audioGroups,
            subtitleGroups: a.subtitleGroups,
            loaded: a.loaded,
            loadError: a.loadError,
            fragmentError: a.fragmentError,
            name: a.name,
            id: a.id,
            uri: a.uri,
            url: a.url,
            urlId: 0,
            audioGroupIds: a.audioGroupIds,
            textGroupIds: a.textGroupIds,
          };
          this.hls.trigger(p.LEVEL_SWITCHING, l);
          let o = a.details;
          if (!o || o.live) {
            let d = this.switchParams(a.uri, r?.details, o);
            this.loadPlaylist(d);
          }
        }
        get manualLevel() {
          return this.manualLevelIndex;
        }
        set manualLevel(t) {
          (this.manualLevelIndex = t),
            this._startLevel === void 0 && (this._startLevel = t),
            t !== -1 && (this.level = t);
        }
        get firstLevel() {
          return this._firstLevel;
        }
        set firstLevel(t) {
          this._firstLevel = t;
        }
        get startLevel() {
          if (this._startLevel === void 0) {
            let t = this.hls.config.startLevel;
            return t !== void 0 ? t : this.hls.firstAutoLevel;
          }
          return this._startLevel;
        }
        set startLevel(t) {
          this._startLevel = t;
        }
        get pathways() {
          return this.steering ? this.steering.pathways() : [];
        }
        get pathwayPriority() {
          return this.steering ? this.steering.pathwayPriority : null;
        }
        set pathwayPriority(t) {
          if (this.steering) {
            let e = this.steering.pathways(),
              i = t.filter((r) => e.indexOf(r) !== -1);
            if (t.length < 1) {
              this.warn(
                `pathwayPriority ${t} should contain at least one pathway from list: ${e}`
              );
              return;
            }
            this.steering.pathwayPriority = i;
          }
        }
        onError(t, e) {
          !e.fatal &&
            e.context &&
            e.context.type === lt.LEVEL &&
            e.context.level === this.level &&
            this.checkRetry(e);
        }
        onFragBuffered(t, { frag: e }) {
          if (e !== void 0 && e.type === j.MAIN) {
            let i = e.elementaryStreams;
            if (!Object.keys(i).some((s) => !!i[s])) return;
            let r = this._levels[e.level];
            r != null &&
              r.loadError &&
              (this.log(
                `Resetting level error count of ${r.loadError} on frag buffered`
              ),
              (r.loadError = 0));
          }
        }
        onLevelLoaded(t, e) {
          var i, r;
          let { level: s, details: a } = e,
            n = e.levelInfo;
          if (!n) {
            this.warn(`Invalid level index ${s}`),
              (r = e.deliveryDirectives) != null &&
                r.skip &&
                (a.deltaUpdateFailed = !0);
            return;
          }
          if (n === this.currentLevel || e.withoutMultiVariant) {
            n.fragmentError === 0 && (n.loadError = 0);
            let l = n.details;
            l === e.details && l.advanced && (l = void 0),
              this.playlistLoaded(s, e, l);
          } else
            (i = e.deliveryDirectives) != null &&
              i.skip &&
              (a.deltaUpdateFailed = !0);
        }
        loadPlaylist(t) {
          super.loadPlaylist(),
            this.shouldLoadPlaylist(this.currentLevel) &&
              this.scheduleLoading(this.currentLevel, t);
        }
        loadingPlaylist(t, e) {
          super.loadingPlaylist(t, e);
          let i = this.getUrlWithDirectives(t.uri, e),
            r = this.currentLevelIndex,
            s = t.attrs['PATHWAY-ID'],
            a = t.details,
            n = a?.age;
          this.log(
            `Loading level index ${r}${
              e?.msn !== void 0 ? ' at sn ' + e.msn + ' part ' + e.part : ''
            }${s ? ' Pathway ' + s : ''}${
              n && a.live
                ? ' age ' + n.toFixed(1) + (a.type ? ' ' + a.type : '')
                : ''
            } ${i}`
          ),
            this.hls.trigger(p.LEVEL_LOADING, {
              url: i,
              level: r,
              levelInfo: t,
              pathwayId: t.attrs['PATHWAY-ID'],
              id: 0,
              deliveryDirectives: e || null,
            });
        }
        get nextLoadLevel() {
          return this.manualLevelIndex !== -1
            ? this.manualLevelIndex
            : this.hls.nextAutoLevel;
        }
        set nextLoadLevel(t) {
          (this.level = t),
            this.manualLevelIndex === -1 && (this.hls.nextAutoLevel = t);
        }
        removeLevel(t) {
          var e;
          if (this._levels.length === 1) return;
          let i = this._levels.filter(
            (s, a) =>
              a !== t ||
              (this.steering && this.steering.removeLevel(s),
              s === this.currentLevel &&
                ((this.currentLevel = null),
                (this.currentLevelIndex = -1),
                s.details &&
                  s.details.fragments.forEach((n) => (n.level = -1))),
              !1)
          );
          Ws(i),
            (this._levels = i),
            this.currentLevelIndex > -1 &&
              (e = this.currentLevel) != null &&
              e.details &&
              (this.currentLevelIndex =
                this.currentLevel.details.fragments[0].level),
            this.manualLevelIndex > -1 &&
              (this.manualLevelIndex = this.currentLevelIndex);
          let r = i.length - 1;
          (this._firstLevel = Math.min(this._firstLevel, r)),
            this._startLevel &&
              (this._startLevel = Math.min(this._startLevel, r)),
            this.hls.trigger(p.LEVELS_UPDATED, { levels: i });
        }
        onLevelsUpdated(t, { levels: e }) {
          this._levels = e;
        }
        checkMaxAutoUpdated() {
          let {
            autoLevelCapping: t,
            maxAutoLevel: e,
            maxHdcpLevel: i,
          } = this.hls;
          this._maxAutoLevel !== e &&
            ((this._maxAutoLevel = e),
            this.hls.trigger(p.MAX_AUTO_LEVEL_UPDATED, {
              autoLevelCapping: t,
              levels: this.levels,
              maxAutoLevel: e,
              minAutoLevel: this.hls.minAutoLevel,
              maxHdcpLevel: i,
            }));
        }
      }
      function un(h) {
        let t = {};
        h.forEach((e) => {
          let i = e.groupId || '';
          (e.id = t[i] = t[i] || 0), t[i]++;
        });
      }
      function cn() {
        return F.SourceBuffer || F.WebKitSourceBuffer;
      }
      function fn() {
        if (!bt()) return !1;
        let h = cn();
        return (
          !h ||
          (h.prototype &&
            typeof h.prototype.appendBuffer == 'function' &&
            typeof h.prototype.remove == 'function')
        );
      }
      class Ql extends ir {
        constructor(t, e, i) {
          super(t, e, i, 'stream-controller', j.MAIN),
            (this.audioCodecSwap = !1),
            (this.level = -1),
            (this._forceStartLoad = !1),
            (this._hasEnoughToStart = !1),
            (this.altAudio = 0),
            (this.audioOnly = !1),
            (this.fragPlaying = null),
            (this.fragLastKbps = 0),
            (this.couldBacktrack = !1),
            (this.backtrackFragment = null),
            (this.audioCodecSwitch = !1),
            (this.videoBuffer = null),
            (this.onMediaPlaying = () => {
              this.tick();
            }),
            (this.onMediaSeeked = () => {
              let r = this.media,
                s = r ? r.currentTime : null;
              if (
                s === null ||
                !Y(s) ||
                (this.log(`Media seeked to ${s.toFixed(3)}`),
                !this.getBufferedFrag(s))
              )
                return;
              let a = this.getFwdBufferInfoAtPos(r, s, j.MAIN, 0);
              if (a === null || a.len === 0) {
                this.warn(
                  `Main forward buffer length at ${s} on "seeked" event ${
                    a ? a.len : 'empty'
                  })`
                );
                return;
              }
              this.tick();
            }),
            this.registerListeners();
        }
        registerListeners() {
          super.registerListeners();
          let { hls: t } = this;
          t.on(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.on(p.LEVEL_LOADING, this.onLevelLoading, this),
            t.on(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.on(
              p.FRAG_LOAD_EMERGENCY_ABORTED,
              this.onFragLoadEmergencyAborted,
              this
            ),
            t.on(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this),
            t.on(p.AUDIO_TRACK_SWITCHED, this.onAudioTrackSwitched, this),
            t.on(p.BUFFER_CREATED, this.onBufferCreated, this),
            t.on(p.BUFFER_FLUSHED, this.onBufferFlushed, this),
            t.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.on(p.FRAG_BUFFERED, this.onFragBuffered, this);
        }
        unregisterListeners() {
          super.unregisterListeners();
          let { hls: t } = this;
          t.off(p.MANIFEST_PARSED, this.onManifestParsed, this),
            t.off(p.LEVEL_LOADED, this.onLevelLoaded, this),
            t.off(
              p.FRAG_LOAD_EMERGENCY_ABORTED,
              this.onFragLoadEmergencyAborted,
              this
            ),
            t.off(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this),
            t.off(p.AUDIO_TRACK_SWITCHED, this.onAudioTrackSwitched, this),
            t.off(p.BUFFER_CREATED, this.onBufferCreated, this),
            t.off(p.BUFFER_FLUSHED, this.onBufferFlushed, this),
            t.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this),
            t.off(p.FRAG_BUFFERED, this.onFragBuffered, this);
        }
        onHandlerDestroying() {
          (this.onMediaPlaying = this.onMediaSeeked = null),
            this.unregisterListeners(),
            super.onHandlerDestroying();
        }
        startLoad(t, e) {
          if (this.levels) {
            let { lastCurrentTime: i, hls: r } = this;
            if (
              (this.stopLoad(),
              this.setInterval(100),
              (this.level = -1),
              !this.startFragRequested)
            ) {
              let s = r.startLevel;
              s === -1 &&
                (r.config.testBandwidth && this.levels.length > 1
                  ? ((s = 0), (this.bitrateTest = !0))
                  : (s = r.firstAutoLevel)),
                (r.nextLoadLevel = s),
                (this.level = r.loadLevel),
                (this._hasEnoughToStart = !!e);
            }
            i > 0 &&
              t === -1 &&
              !e &&
              (this.log(
                `Override startPosition with lastCurrentTime @${i.toFixed(3)}`
              ),
              (t = i)),
              (this.state = N.IDLE),
              (this.nextLoadPosition = this.lastCurrentTime =
                t + this.timelineOffset),
              (this.startPosition = e ? -1 : t),
              this.tick();
          } else (this._forceStartLoad = !0), (this.state = N.STOPPED);
        }
        stopLoad() {
          (this._forceStartLoad = !1), super.stopLoad();
        }
        doTick() {
          switch (this.state) {
            case N.WAITING_LEVEL: {
              let { levels: t, level: e } = this,
                i = t?.[e],
                r = i?.details;
              if (
                !r ||
                (r.live && (this.levelLastLoaded !== i || this.waitForLive(i)))
              )
                this.hls.nextLoadLevel !== this.level && (this.state = N.IDLE);
              else {
                if (this.waitForCdnTuneIn(r)) break;
                this.state = N.IDLE;
              }
              break;
            }
            case N.FRAG_LOADING_WAITING_RETRY:
              this.checkRetryDate();
          }
          this.state === N.IDLE && this.doTickIdle(), this.onTickEnd();
        }
        onTickEnd() {
          var t;
          super.onTickEnd(),
            (t = this.media) != null &&
              t.readyState &&
              this.media.seeking === !1 &&
              (this.lastCurrentTime = this.media.currentTime),
            this.checkFragmentChanged();
        }
        doTickIdle() {
          let { hls: t, levelLastLoaded: e, levels: i, media: r } = this;
          if (
            e === null ||
            (!r &&
              !this.primaryPrefetch &&
              (this.startFragRequested || !t.config.startFragPrefetch)) ||
            (this.altAudio && this.audioOnly)
          )
            return;
          let s = this.buffering ? t.nextLoadLevel : t.loadLevel;
          if (!(i != null && i[s])) return;
          let a = i[s],
            n = this.getMainFwdBufferInfo();
          if (n === null) return;
          let l = this.getLevelDetails();
          if (l && this._streamEnded(n, l)) {
            let E = {};
            this.altAudio === 2 && (E.type = 'video'),
              this.hls.trigger(p.BUFFER_EOS, E),
              (this.state = N.ENDED);
            return;
          }
          if (!this.buffering) return;
          t.loadLevel !== s &&
            t.manualLevel === -1 &&
            this.log(`Adapting to level ${s} from level ${this.level}`),
            (this.level = t.nextLoadLevel = s);
          let o = a.details;
          if (!o || this.state === N.WAITING_LEVEL || this.waitForLive(a)) {
            (this.level = s),
              (this.state = N.WAITING_LEVEL),
              (this.startFragRequested = !1);
            return;
          }
          let d = n.len,
            u = this.getMaxBufferLength(a.maxBitrate);
          if (d >= u) return;
          this.backtrackFragment &&
            this.backtrackFragment.start > n.end &&
            (this.backtrackFragment = null);
          let c = this.backtrackFragment ? this.backtrackFragment.start : n.end,
            f = this.getNextFragment(c, o);
          if (
            this.couldBacktrack &&
            !this.fragPrevious &&
            f &&
            _t(f) &&
            this.fragmentTracker.getState(f) !== xt.OK
          ) {
            var g;
            let E =
                ((g = this.backtrackFragment) != null ? g : f).sn - o.startSN,
              m = o.fragments[E - 1];
            m &&
              f.cc === m.cc &&
              ((f = m), this.fragmentTracker.removeFragment(m));
          } else
            this.backtrackFragment && n.len && (this.backtrackFragment = null);
          if (f && this.isLoopLoading(f, c)) {
            if (!f.gap) {
              let E = this.audioOnly && !this.altAudio ? mt.AUDIO : mt.VIDEO,
                m =
                  (E === mt.VIDEO ? this.videoBuffer : this.mediaBuffer) ||
                  this.media;
              m && this.afterBufferFlushed(m, E, j.MAIN);
            }
            f = this.getNextFragmentLoopLoading(f, o, n, j.MAIN, u);
          }
          f &&
            (!f.initSegment ||
              f.initSegment.data ||
              this.bitrateTest ||
              (f = f.initSegment),
            this.loadFragment(f, a, c));
        }
        loadFragment(t, e, i) {
          let r = this.fragmentTracker.getState(t);
          r === xt.NOT_LOADED || r === xt.PARTIAL
            ? _t(t)
              ? this.bitrateTest
                ? (this.log(
                    `Fragment ${t.sn} of level ${t.level} is being downloaded to test bitrate and will not be buffered`
                  ),
                  this._loadBitrateTestFrag(t, e))
                : super.loadFragment(t, e, i)
              : this._loadInitSegment(t, e)
            : this.clearTrackerIfNeeded(t);
        }
        getBufferedFrag(t) {
          return this.fragmentTracker.getBufferedFrag(t, j.MAIN);
        }
        followingBufferedFrag(t) {
          return t ? this.getBufferedFrag(t.end + 0.5) : null;
        }
        immediateLevelSwitch() {
          this.abortCurrentFrag(),
            this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
        }
        nextLevelSwitch() {
          let { levels: t, media: e } = this;
          if (e != null && e.readyState) {
            let i,
              r = this.getAppendedFrag(e.currentTime);
            r && r.start > 1 && this.flushMainBuffer(0, r.start - 1);
            let s = this.getLevelDetails();
            if (s != null && s.live) {
              let n = this.getMainFwdBufferInfo();
              if (!n || n.len < 2 * s.targetduration) return;
            }
            if (!e.paused && t) {
              let n = t[this.hls.nextLoadLevel],
                l = this.fragLastKbps;
              i =
                l && this.fragCurrent
                  ? (this.fragCurrent.duration * n.maxBitrate) / (1e3 * l) + 1
                  : 0;
            } else i = 0;
            let a = this.getBufferedFrag(e.currentTime + i);
            if (a) {
              let n = this.followingBufferedFrag(a);
              if (n) {
                this.abortCurrentFrag();
                let l = n.maxStartPTS ? n.maxStartPTS : n.start,
                  o = n.duration,
                  d = Math.max(
                    a.end,
                    l +
                      Math.min(
                        Math.max(
                          o - this.config.maxFragLookUpTolerance,
                          o * (this.couldBacktrack ? 0.5 : 0.125)
                        ),
                        o * (this.couldBacktrack ? 0.75 : 0.25)
                      )
                  );
                this.flushMainBuffer(d, Number.POSITIVE_INFINITY);
              }
            }
          }
        }
        abortCurrentFrag() {
          let t = this.fragCurrent;
          switch (
            ((this.fragCurrent = null),
            (this.backtrackFragment = null),
            t && (t.abortRequests(), this.fragmentTracker.removeFragment(t)),
            this.state)
          ) {
            case N.KEY_LOADING:
            case N.FRAG_LOADING:
            case N.FRAG_LOADING_WAITING_RETRY:
            case N.PARSING:
            case N.PARSED:
              this.state = N.IDLE;
          }
          this.nextLoadPosition = this.getLoadPosition();
        }
        flushMainBuffer(t, e) {
          super.flushMainBuffer(t, e, this.altAudio === 2 ? 'video' : null);
        }
        onMediaAttached(t, e) {
          super.onMediaAttached(t, e);
          let i = e.media;
          Nt(i, 'playing', this.onMediaPlaying),
            Nt(i, 'seeked', this.onMediaSeeked);
        }
        onMediaDetaching(t, e) {
          let { media: i } = this;
          i &&
            (Bt(i, 'playing', this.onMediaPlaying),
            Bt(i, 'seeked', this.onMediaSeeked)),
            (this.videoBuffer = null),
            (this.fragPlaying = null),
            super.onMediaDetaching(t, e),
            e.transferMedia || (this._hasEnoughToStart = !1);
        }
        onManifestLoading() {
          super.onManifestLoading(),
            this.log('Trigger BUFFER_RESET'),
            this.hls.trigger(p.BUFFER_RESET, void 0),
            (this.couldBacktrack = !1),
            (this.fragLastKbps = 0),
            (this.fragPlaying = this.backtrackFragment = null),
            (this.altAudio = 0),
            (this.audioOnly = !1);
        }
        onManifestParsed(t, e) {
          let i = !1,
            r = !1;
          for (let s = 0; s < e.levels.length; s++) {
            let a = e.levels[s].audioCodec;
            a &&
              ((i = i || a.indexOf('mp4a.40.2') !== -1),
              (r = r || a.indexOf('mp4a.40.5') !== -1));
          }
          (this.audioCodecSwitch =
            i &&
            r &&
            !(function () {
              var s;
              let a = cn();
              return (
                typeof (a == null || (s = a.prototype) == null
                  ? void 0
                  : s.changeType) == 'function'
              );
            })()),
            this.audioCodecSwitch &&
              this.log(
                'Both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC'
              ),
            (this.levels = e.levels),
            (this.startFragRequested = !1);
        }
        onLevelLoading(t, e) {
          let { levels: i } = this;
          if (!i || this.state !== N.IDLE) return;
          let r = e.levelInfo;
          (!r.details ||
            (r.details.live &&
              (this.levelLastLoaded !== r || r.details.expired)) ||
            this.waitForCdnTuneIn(r.details)) &&
            (this.state = N.WAITING_LEVEL);
        }
        onLevelLoaded(t, e) {
          var i, r;
          let { levels: s, startFragRequested: a } = this,
            n = e.level,
            l = e.details,
            o = l.totalduration;
          if (!s) {
            this.warn(`Levels were reset while loading level ${n}`);
            return;
          }
          this.log(
            `Level ${n} loaded [${l.startSN},${l.endSN}]${
              l.lastPartSn ? `[part-${l.lastPartSn}-${l.lastPartIndex}]` : ''
            }, cc [${l.startCC}, ${l.endCC}] duration:${o}`
          );
          let d = e.levelInfo,
            u = this.fragCurrent;
          u &&
            (this.state === N.FRAG_LOADING ||
              this.state === N.FRAG_LOADING_WAITING_RETRY) &&
            u.level !== e.level &&
            u.loader &&
            this.abortCurrentFrag();
          let c = 0;
          if (l.live || ((i = d.details) != null && i.live)) {
            if ((this.checkLiveUpdate(l), l.deltaUpdateFailed)) return;
            c = this.alignPlaylists(
              l,
              d.details,
              (r = this.levelLastLoaded) == null ? void 0 : r.details
            );
          }
          if (
            ((d.details = l),
            (this.levelLastLoaded = d),
            a || this.setStartPosition(l, c),
            this.hls.trigger(p.LEVEL_UPDATED, { details: l, level: n }),
            this.state === N.WAITING_LEVEL)
          ) {
            if (this.waitForCdnTuneIn(l)) return;
            this.state = N.IDLE;
          }
          a && l.live && this.synchronizeToLiveEdge(l), this.tick();
        }
        synchronizeToLiveEdge(t) {
          let { config: e, media: i } = this;
          if (!i) return;
          let r = this.hls.liveSyncPosition,
            s = this.getLoadPosition(),
            a = t.fragmentStart,
            n = t.edge,
            l = s >= a - e.maxFragLookUpTolerance && s <= n;
          if (r !== null && i.duration > r && (s < r || !l)) {
            let d =
              e.liveMaxLatencyDuration !== void 0
                ? e.liveMaxLatencyDuration
                : e.liveMaxLatencyDurationCount * t.targetduration;
            if (
              ((!l && i.readyState < 4) || s < n - d) &&
              (this._hasEnoughToStart || (this.nextLoadPosition = r),
              i.readyState)
            )
              if (
                (this.warn(
                  `Playback: ${s.toFixed(
                    3
                  )} is located too far from the end of live sliding playlist: ${n}, reset currentTime to : ${r.toFixed(
                    3
                  )}`
                ),
                this.config.liveSyncMode === 'buffered')
              ) {
                var o;
                let u = rt.bufferInfo(i, r, 0);
                if (!((o = u.buffered) != null && o.length) || u.start <= s) {
                  i.currentTime = r;
                  return;
                }
                let { nextStart: c } = rt.bufferedInfo(u.buffered, s, 0);
                c && (i.currentTime = c);
              } else i.currentTime = r;
          }
        }
        _handleFragmentLoadProgress(t) {
          var e;
          let i = t.frag,
            { part: r, payload: s } = t,
            { levels: a } = this;
          if (!a) {
            this.warn(
              `Levels were reset while fragment load was in progress. Fragment ${i.sn} of level ${i.level} will not be buffered`
            );
            return;
          }
          let n = a[i.level];
          if (!n) {
            this.warn(`Level ${i.level} not found on progress`);
            return;
          }
          let l = n.details;
          if (!l) {
            this.warn(
              `Dropping fragment ${i.sn} of level ${i.level} after level details were reset`
            ),
              this.fragmentTracker.removeFragment(i);
            return;
          }
          let o = n.videoCodec,
            d = l.PTSKnown || !l.live,
            u = (e = i.initSegment) == null ? void 0 : e.data,
            c = this._getAudioCodec(n),
            f = (this.transmuxer =
              this.transmuxer ||
              new Sa(
                this.hls,
                j.MAIN,
                this._handleTransmuxComplete.bind(this),
                this._handleTransmuxerFlush.bind(this)
              )),
            g = r ? r.index : -1,
            E = new Yi(
              i.level,
              i.sn,
              i.stats.chunkCount,
              s.byteLength,
              g,
              g !== -1
            ),
            m = this.initPTS[i.cc];
          f.push(s, u, c, o, i, r, l.totalduration, d, E, m);
        }
        onAudioTrackSwitching(t, e) {
          let i = this.hls,
            r = this.altAudio === 2;
          if (ri(e.url, i)) this.altAudio = 1;
          else {
            if (this.mediaBuffer !== this.media) {
              this.log(
                'Switching on main audio, use media.buffered to schedule main fragment loading'
              ),
                (this.mediaBuffer = this.media);
              let s = this.fragCurrent;
              s &&
                (this.log(
                  'Switching to main audio track, cancel main fragment load'
                ),
                s.abortRequests(),
                this.fragmentTracker.removeFragment(s)),
                this.resetTransmuxer(),
                this.resetLoadingState();
            } else this.audioOnly && this.resetTransmuxer();
            if (r) {
              this.fragmentTracker.removeAllFragments(),
                i.once(p.BUFFER_FLUSHED, () => {
                  this.hls && this.hls.trigger(p.AUDIO_TRACK_SWITCHED, e);
                }),
                i.trigger(p.BUFFER_FLUSHING, {
                  startOffset: 0,
                  endOffset: Number.POSITIVE_INFINITY,
                  type: null,
                });
              return;
            }
            i.trigger(p.AUDIO_TRACK_SWITCHED, e);
          }
        }
        onAudioTrackSwitched(t, e) {
          let i = ri(e.url, this.hls);
          if (i) {
            let r = this.videoBuffer;
            r &&
              this.mediaBuffer !== r &&
              (this.log(
                'Switching on alternate audio, use video.buffered to schedule main fragment loading'
              ),
              (this.mediaBuffer = r));
          }
          (this.altAudio = i ? 2 : 0), this.tick();
        }
        onBufferCreated(t, e) {
          let i,
            r,
            s = e.tracks,
            a = !1;
          for (let n in s) {
            let l = s[n];
            if (l.id === 'main') {
              if (((r = n), (i = l), n === 'video')) {
                let o = s[n];
                o && (this.videoBuffer = o.buffer);
              }
            } else a = !0;
          }
          a && i
            ? (this.log(
                `Alternate track found, use ${r}.buffered to schedule main fragment loading`
              ),
              (this.mediaBuffer = i.buffer))
            : (this.mediaBuffer = this.media);
        }
        onFragBuffered(t, e) {
          let { frag: i, part: r } = e,
            s = i.type === j.MAIN;
          if (s) {
            if (this.fragContextChanged(i)) {
              this.warn(
                `Fragment ${i.sn}${r ? ' p: ' + r.index : ''} of level ${
                  i.level
                } finished buffering, but was aborted. state: ${this.state}`
              ),
                this.state === N.PARSED && (this.state = N.IDLE);
              return;
            }
            let n = r ? r.stats : i.stats;
            (this.fragLastKbps = Math.round(
              (8 * n.total) / (n.buffering.end - n.loading.first)
            )),
              _t(i) && (this.fragPrevious = i),
              this.fragBufferedComplete(i, r);
          }
          let a = this.media;
          a &&
            (!this._hasEnoughToStart &&
              rt.getBuffered(a).length &&
              ((this._hasEnoughToStart = !0), this.seekToStartPos()),
            s && this.tick());
        }
        get hasEnoughToStart() {
          return this._hasEnoughToStart;
        }
        onError(t, e) {
          var i;
          if (e.fatal) {
            this.state = N.ERROR;
            return;
          }
          switch (e.details) {
            case b.FRAG_GAP:
            case b.FRAG_PARSING_ERROR:
            case b.FRAG_DECRYPT_ERROR:
            case b.FRAG_LOAD_ERROR:
            case b.FRAG_LOAD_TIMEOUT:
            case b.KEY_LOAD_ERROR:
            case b.KEY_LOAD_TIMEOUT:
              this.onFragmentOrKeyLoadError(j.MAIN, e);
              break;
            case b.LEVEL_LOAD_ERROR:
            case b.LEVEL_LOAD_TIMEOUT:
            case b.LEVEL_PARSING_ERROR:
              e.levelRetry ||
                this.state !== N.WAITING_LEVEL ||
                ((i = e.context) == null ? void 0 : i.type) !== lt.LEVEL ||
                (this.state = N.IDLE);
              break;
            case b.BUFFER_ADD_CODEC_ERROR:
            case b.BUFFER_APPEND_ERROR:
              if (e.parent !== 'main') return;
              this.reduceLengthAndFlushBuffer(e) && this.resetLoadingState();
              break;
            case b.BUFFER_FULL_ERROR:
              if (e.parent !== 'main') return;
              this.reduceLengthAndFlushBuffer(e) &&
                (!this.config.interstitialsController &&
                this.config.assetPlayerId
                  ? (this._hasEnoughToStart = !0)
                  : this.flushMainBuffer(0, Number.POSITIVE_INFINITY));
              break;
            case b.INTERNAL_EXCEPTION:
              this.recoverWorkerError(e);
          }
        }
        onFragLoadEmergencyAborted() {
          (this.state = N.IDLE),
            this._hasEnoughToStart ||
              ((this.startFragRequested = !1),
              (this.nextLoadPosition = this.lastCurrentTime)),
            this.tickImmediate();
        }
        onBufferFlushed(t, { type: e }) {
          if (e !== mt.AUDIO || !this.altAudio) {
            let i =
              (e === mt.VIDEO ? this.videoBuffer : this.mediaBuffer) ||
              this.media;
            i && (this.afterBufferFlushed(i, e, j.MAIN), this.tick());
          }
        }
        onLevelsUpdated(t, e) {
          this.level > -1 &&
            this.fragCurrent &&
            ((this.level = this.fragCurrent.level),
            this.level === -1 &&
              this.resetWhenMissingContext(this.fragCurrent)),
            (this.levels = e.levels);
        }
        swapAudioCodec() {
          this.audioCodecSwap = !this.audioCodecSwap;
        }
        seekToStartPos() {
          let { media: t } = this;
          if (!t) return;
          let e = t.currentTime,
            i = this.startPosition;
          if (i >= 0 && e < i) {
            if (t.seeking) {
              this.log(`could not seek to ${i}, already seeking at ${e}`);
              return;
            }
            let r = this.timelineOffset;
            r && i && (i += r);
            let s = this.getLevelDetails(),
              a = rt.getBuffered(t),
              n = a.length ? a.start(0) : 0,
              l = n - i,
              o = Math.max(
                this.config.maxBufferHole,
                this.config.maxFragLookUpTolerance
              );
            (this.config.startOnSegmentBoundary ||
              (l > 0 &&
                (l < o ||
                  (this.loadingParts && l < 2 * (s?.partTarget || 0))))) &&
              (this.log(
                `adjusting start position by ${l} to match buffer start`
              ),
              (i += l),
              (this.startPosition = i)),
              e < i &&
                (this.log(
                  `seek to target start position ${i} from current time ${e} buffer start ${n}`
                ),
                (t.currentTime = i));
          }
        }
        _getAudioCodec(t) {
          let e = this.config.defaultAudioCodec || t.audioCodec;
          return (
            this.audioCodecSwap &&
              e &&
              (this.log('Swapping audio codec'),
              (e = e.indexOf('mp4a.40.5') !== -1 ? 'mp4a.40.2' : 'mp4a.40.5')),
            e
          );
        }
        _loadBitrateTestFrag(t, e) {
          (t.bitrateTest = !0),
            this._doFragLoad(t, e)
              .then((i) => {
                let { hls: r } = this,
                  s = i?.frag;
                if (!s || this.fragContextChanged(s)) return;
                (e.fragmentError = 0),
                  (this.state = N.IDLE),
                  (this.startFragRequested = !1),
                  (this.bitrateTest = !1);
                let a = s.stats;
                (a.parsing.start =
                  a.parsing.end =
                  a.buffering.start =
                  a.buffering.end =
                    F.performance.now()),
                  r.trigger(p.FRAG_LOADED, i),
                  (s.bitrateTest = !1);
              })
              .catch((i) => {
                this.state !== N.STOPPED &&
                  this.state !== N.ERROR &&
                  (this.warn(i), this.resetFragmentLoading(t));
              });
        }
        _handleTransmuxComplete(t) {
          let e = this.playlistType,
            { hls: i } = this,
            { remuxResult: r, chunkMeta: s } = t,
            a = this.getCurrentContext(s);
          if (!a) {
            this.resetWhenMissingContext(s);
            return;
          }
          let { frag: n, part: l, level: o } = a,
            { video: d, text: u, id3: c, initSegment: f } = r,
            { details: g } = o,
            E = this.altAudio ? void 0 : r.audio;
          if (this.fragContextChanged(n)) {
            this.fragmentTracker.removeFragment(n);
            return;
          }
          if (((this.state = N.PARSING), f)) {
            let m = f.tracks;
            if (m) {
              let A = n.initSegment || n;
              if (this.unhandledEncryptionError(f, n)) return;
              this._bufferInitSegment(o, m, A, s),
                i.trigger(p.FRAG_PARSING_INIT_SEGMENT, {
                  frag: A,
                  id: e,
                  tracks: m,
                });
            }
            let y = f.initPTS,
              S = f.timescale,
              T = this.initPTS[n.cc];
            if (Y(y) && (!T || T.baseTime !== y || T.timescale !== S)) {
              let A = f.trackId;
              (this.initPTS[n.cc] = { baseTime: y, timescale: S, trackId: A }),
                i.trigger(p.INIT_PTS_FOUND, {
                  frag: n,
                  id: e,
                  initPTS: y,
                  timescale: S,
                  trackId: A,
                });
            }
          }
          if (d && g) {
            E && d.type === 'audiovideo' && this.logMuxedErr(n);
            let m = g.fragments[n.sn - 1 - g.startSN],
              y = n.sn === g.startSN,
              S = !m || n.cc > m.cc;
            if (r.independent !== !1) {
              let { startPTS: T, endPTS: A, startDTS: R, endDTS: I } = d;
              if (l)
                l.elementaryStreams[d.type] = {
                  startPTS: T,
                  endPTS: A,
                  startDTS: R,
                  endDTS: I,
                };
              else if (
                (d.firstKeyFrame &&
                  d.independent &&
                  s.id === 1 &&
                  !S &&
                  (this.couldBacktrack = !0),
                d.dropped && d.independent)
              ) {
                let v = this.getMainFwdBufferInfo(),
                  _ =
                    (v ? v.end : this.getLoadPosition()) +
                    this.config.maxBufferHole,
                  L = d.firstKeyFramePTS ? d.firstKeyFramePTS : T;
                if (y || !(_ < L - this.config.maxBufferHole) || S)
                  S && (n.gap = !0);
                else {
                  this.backtrack(n);
                  return;
                }
                n.setElementaryStreamInfo(d.type, n.start, A, n.start, I, !0);
              } else
                y && T - (g.appliedTimelineOffset || 0) > 2 && (n.gap = !0);
              n.setElementaryStreamInfo(d.type, T, A, R, I),
                this.backtrackFragment && (this.backtrackFragment = n),
                this.bufferFragmentData(d, n, l, s, y || S);
            } else if (y || S) n.gap = !0;
            else {
              this.backtrack(n);
              return;
            }
          }
          if (E) {
            let { startPTS: m, endPTS: y, startDTS: S, endDTS: T } = E;
            l &&
              (l.elementaryStreams[mt.AUDIO] = {
                startPTS: m,
                endPTS: y,
                startDTS: S,
                endDTS: T,
              }),
              n.setElementaryStreamInfo(mt.AUDIO, m, y, S, T),
              this.bufferFragmentData(E, n, l, s);
          }
          if (g && c != null && c.samples.length) {
            let m = { id: e, frag: n, details: g, samples: c.samples };
            i.trigger(p.FRAG_PARSING_METADATA, m);
          }
          if (g && u) {
            let m = { id: e, frag: n, details: g, samples: u.samples };
            i.trigger(p.FRAG_PARSING_USERDATA, m);
          }
        }
        logMuxedErr(t) {
          this.warn(
            `${
              _t(t) ? 'Media' : 'Init'
            } segment with muxed audiovideo where only video expected: ${t.url}`
          );
        }
        _bufferInitSegment(t, e, i, r) {
          if (this.state !== N.PARSING) return;
          (this.audioOnly = !!e.audio && !e.video),
            this.altAudio &&
              !this.audioOnly &&
              (delete e.audio, e.audiovideo && this.logMuxedErr(i));
          let { audio: s, video: a, audiovideo: n } = e;
          if (s) {
            let o = t.audioCodec,
              d = ti(s.codec, o);
            d === 'mp4a' && (d = 'mp4a.40.5');
            let u = navigator.userAgent.toLowerCase();
            if (this.audioCodecSwitch) {
              d &&
                (d = d.indexOf('mp4a.40.5') !== -1 ? 'mp4a.40.2' : 'mp4a.40.5');
              let c = s.metadata;
              c &&
                'channelCount' in c &&
                (c.channelCount || 1) !== 1 &&
                u.indexOf('firefox') === -1 &&
                (d = 'mp4a.40.5');
            }
            d &&
              d.indexOf('mp4a.40.5') !== -1 &&
              u.indexOf('android') !== -1 &&
              s.container !== 'audio/mpeg' &&
              ((d = 'mp4a.40.2'),
              this.log(`Android: force audio codec to ${d}`)),
              o &&
                o !== d &&
                this.log(`Swapping manifest audio codec "${o}" for "${d}"`),
              (s.levelCodec = d),
              (s.id = j.MAIN),
              this.log(
                `Init audio buffer, container:${
                  s.container
                }, codecs[selected/level/parsed]=[${d || ''}/${o || ''}/${
                  s.codec
                }]`
              ),
              delete e.audiovideo;
          }
          if (a) {
            (a.levelCodec = t.videoCodec), (a.id = j.MAIN);
            let o = a.codec;
            if (o?.length === 4)
              switch (o) {
                case 'hvc1':
                case 'hev1':
                  a.codec = 'hvc1.1.6.L120.90';
                  break;
                case 'av01':
                  a.codec = 'av01.0.04M.08';
                  break;
                case 'avc1':
                  a.codec = 'avc1.42e01e';
              }
            this.log(
              `Init video buffer, container:${
                a.container
              }, codecs[level/parsed]=[${t.videoCodec || ''}/${o}]${
                a.codec !== o ? ' parsed-corrected=' + a.codec : ''
              }${a.supplemental ? ' supplemental=' + a.supplemental : ''}`
            ),
              delete e.audiovideo;
          }
          n &&
            (this.log(
              `Init audiovideo buffer, container:${n.container}, codecs[level/parsed]=[${t.codecs}/${n.codec}]`
            ),
            delete e.video,
            delete e.audio);
          let l = Object.keys(e);
          if (l.length) {
            if ((this.hls.trigger(p.BUFFER_CODECS, e), !this.hls)) return;
            l.forEach((o) => {
              let d = e[o].initSegment;
              d != null &&
                d.byteLength &&
                this.hls.trigger(p.BUFFER_APPENDING, {
                  type: o,
                  data: d,
                  frag: i,
                  part: null,
                  chunkMeta: r,
                  parent: i.type,
                });
            });
          }
          this.tickImmediate();
        }
        getMainFwdBufferInfo() {
          let t =
            this.mediaBuffer && this.altAudio === 2
              ? this.mediaBuffer
              : this.media;
          return this.getFwdBufferInfo(t, j.MAIN);
        }
        get maxBufferLength() {
          let { levels: t, level: e } = this,
            i = t?.[e];
          return i
            ? this.getMaxBufferLength(i.maxBitrate)
            : this.config.maxBufferLength;
        }
        backtrack(t) {
          (this.couldBacktrack = !0),
            (this.backtrackFragment = t),
            this.resetTransmuxer(),
            this.flushBufferGap(t),
            this.fragmentTracker.removeFragment(t),
            (this.fragPrevious = null),
            (this.nextLoadPosition = t.start),
            (this.state = N.IDLE);
        }
        checkFragmentChanged() {
          let t = this.media,
            e = null;
          if (t && t.readyState > 1 && t.seeking === !1) {
            let i = t.currentTime;
            if (
              (rt.isBuffered(t, i)
                ? (e = this.getAppendedFrag(i))
                : rt.isBuffered(t, i + 0.1) &&
                  (e = this.getAppendedFrag(i + 0.1)),
              e)
            ) {
              this.backtrackFragment = null;
              let r = this.fragPlaying,
                s = e.level;
              (r && e.sn === r.sn && r.level === s) ||
                ((this.fragPlaying = e),
                this.hls.trigger(p.FRAG_CHANGED, { frag: e }),
                (r && r.level === s) ||
                  this.hls.trigger(p.LEVEL_SWITCHED, { level: s }));
            }
          }
        }
        get nextLevel() {
          let t = this.nextBufferedFrag;
          return t ? t.level : -1;
        }
        get currentFrag() {
          var t;
          if (this.fragPlaying) return this.fragPlaying;
          let e =
            ((t = this.media) == null ? void 0 : t.currentTime) ||
            this.lastCurrentTime;
          return Y(e) ? this.getAppendedFrag(e) : null;
        }
        get currentProgramDateTime() {
          var t;
          let e =
            ((t = this.media) == null ? void 0 : t.currentTime) ||
            this.lastCurrentTime;
          if (Y(e)) {
            let i = this.getLevelDetails(),
              r = this.currentFrag || (i ? pe(null, i.fragments, e) : null);
            if (r) {
              let s = r.programDateTime;
              if (s !== null) return new Date(s + (e - r.start) * 1e3);
            }
          }
          return null;
        }
        get currentLevel() {
          let t = this.currentFrag;
          return t ? t.level : -1;
        }
        get nextBufferedFrag() {
          let t = this.currentFrag;
          return t ? this.followingBufferedFrag(t) : null;
        }
        get forceStartLoad() {
          return this._forceStartLoad;
        }
      }
      class Zl extends it {
        constructor(t, e) {
          super('key-loader', e),
            (this.config = void 0),
            (this.keyIdToKeyInfo = {}),
            (this.emeController = null),
            (this.config = t);
        }
        abort(t) {
          for (let i in this.keyIdToKeyInfo) {
            let r = this.keyIdToKeyInfo[i].loader;
            if (r) {
              var e;
              if (t && t !== ((e = r.context) == null ? void 0 : e.frag.type))
                return;
              r.abort();
            }
          }
        }
        detach() {
          for (let t in this.keyIdToKeyInfo) {
            let e = this.keyIdToKeyInfo[t];
            (e.mediaKeySessionContext || e.decryptdata.isCommonEncryption) &&
              delete this.keyIdToKeyInfo[t];
          }
        }
        destroy() {
          for (let t in (this.detach(), this.keyIdToKeyInfo)) {
            let e = this.keyIdToKeyInfo[t].loader;
            e && e.destroy();
          }
          this.keyIdToKeyInfo = {};
        }
        createKeyLoadError(t, e = b.KEY_LOAD_ERROR, i, r, s) {
          return new le({
            type: Q.NETWORK_ERROR,
            details: e,
            fatal: !1,
            frag: t,
            response: s,
            error: i,
            networkDetails: r,
          });
        }
        loadClear(t, e, i) {
          if (
            this.emeController &&
            this.config.emeEnabled &&
            !this.emeController.getSelectedKeySystemFormats().length
          ) {
            if (e.length)
              for (let r = 0, s = e.length; r < s; r++) {
                let a = e[r];
                if (
                  (t.cc <= a.cc && (!_t(t) || !_t(a) || t.sn < a.sn)) ||
                  (!i && r == s - 1)
                )
                  return this.emeController
                    .selectKeySystemFormat(a)
                    .then((n) => {
                      if (!this.emeController) return;
                      a.setKeyFormat(n);
                      let l = hi(n);
                      if (l) return this.emeController.getKeySystemAccess([l]);
                    });
              }
            if (this.config.requireKeySystemAccessOnStart) {
              let r = Fe(this.config);
              if (r.length) return this.emeController.getKeySystemAccess(r);
            }
          }
          return null;
        }
        load(t) {
          return !t.decryptdata &&
            t.encrypted &&
            this.emeController &&
            this.config.emeEnabled
            ? this.emeController
                .selectKeySystemFormat(t)
                .then((e) => this.loadInternal(t, e))
            : this.loadInternal(t);
        }
        loadInternal(t, e) {
          var i, r, s;
          e && t.setKeyFormat(e);
          let a = t.decryptdata;
          if (!a) {
            let d = Error(
              e
                ? `Expected frag.decryptdata to be defined after setting format ${e}`
                : 'Missing decryption data on fragment in onKeyLoading'
            );
            return Promise.reject(
              this.createKeyLoadError(t, b.KEY_LOAD_ERROR, d)
            );
          }
          let n = a.uri;
          if (!n)
            return Promise.reject(
              this.createKeyLoadError(
                t,
                b.KEY_LOAD_ERROR,
                Error(`Invalid key URI: "${n}"`)
              )
            );
          let l = Br(a),
            o = this.keyIdToKeyInfo[l];
          if ((i = o) != null && i.decryptdata.key)
            return (
              (a.key = o.decryptdata.key),
              Promise.resolve({ frag: t, keyInfo: o })
            );
          if ((r = o) != null && r.keyLoadPromise)
            switch (
              (s = o.mediaKeySessionContext) == null ? void 0 : s.keyStatus
            ) {
              case 'usable':
              case 'usable-in-future':
                return o.keyLoadPromise.then((d) => {
                  let { keyInfo: u } = d;
                  return (a.key = u.decryptdata.key), { frag: t, keyInfo: u };
                });
            }
          switch (
            (this.log(
              `Loading key ${Ot(a.keyId || [])} from ${t.type} ${t.level}`
            ),
            (o = this.keyIdToKeyInfo[l] =
              {
                decryptdata: a,
                keyLoadPromise: null,
                loader: null,
                mediaKeySessionContext: null,
              }),
            a.method)
          ) {
            case 'SAMPLE-AES':
            case 'SAMPLE-AES-CENC':
            case 'SAMPLE-AES-CTR':
              return a.keyFormat === 'identity'
                ? this.loadKeyHTTP(o, t)
                : this.loadKeyEME(o, t);
            case 'AES-128':
            case 'AES-256':
            case 'AES-256-CTR':
              return this.loadKeyHTTP(o, t);
            default:
              return Promise.reject(
                this.createKeyLoadError(
                  t,
                  b.KEY_LOAD_ERROR,
                  Error(`Key supplied with unsupported METHOD: "${a.method}"`)
                )
              );
          }
        }
        loadKeyEME(t, e) {
          let i = { frag: e, keyInfo: t };
          if (this.emeController && this.config.emeEnabled) {
            let r = this.emeController.loadKey(i);
            return (t.keyLoadPromise = r.then(
              (s) => ((t.mediaKeySessionContext = s), i)
            )).catch((s) => {
              throw ((t.keyLoadPromise = null), s.data && (s.data.frag = e), s);
            });
          }
          return Promise.resolve(i);
        }
        loadKeyHTTP(t, e) {
          let i = this.config,
            r = new i.loader(i);
          return (
            (e.keyLoader = t.loader = r),
            (t.keyLoadPromise = new Promise((s, a) => {
              let n = {
                  keyInfo: t,
                  frag: e,
                  responseType: 'arraybuffer',
                  url: t.decryptdata.uri,
                },
                l = i.keyLoadPolicy.default,
                o = {
                  loadPolicy: l,
                  timeout: l.maxLoadTimeMs,
                  maxRetry: 0,
                  retryDelay: 0,
                  maxRetryDelay: 0,
                };
              r.load(n, o, {
                onSuccess: (d, u, c, f) => {
                  let { frag: g, keyInfo: E, url: m } = c,
                    y = Br(E.decryptdata) || m;
                  if (!g.decryptdata || E !== this.keyIdToKeyInfo[y])
                    return a(
                      this.createKeyLoadError(
                        g,
                        b.KEY_LOAD_ERROR,
                        Error('after key load, decryptdata unset or changed'),
                        f
                      )
                    );
                  (E.decryptdata.key = g.decryptdata.key =
                    new Uint8Array(d.data)),
                    (g.keyLoader = null),
                    (E.loader = null),
                    s({ frag: g, keyInfo: E });
                },
                onError: (d, u, c, f) => {
                  this.resetLoader(u),
                    a(
                      this.createKeyLoadError(
                        e,
                        b.KEY_LOAD_ERROR,
                        Error(`HTTP Error ${d.code} loading key ${d.text}`),
                        c,
                        J({ url: n.url, data: void 0 }, d)
                      )
                    );
                },
                onTimeout: (d, u, c) => {
                  this.resetLoader(u),
                    a(
                      this.createKeyLoadError(
                        e,
                        b.KEY_LOAD_TIMEOUT,
                        Error('key loading timed out'),
                        c
                      )
                    );
                },
                onAbort: (d, u, c) => {
                  this.resetLoader(u),
                    a(
                      this.createKeyLoadError(
                        e,
                        b.INTERNAL_ABORTED,
                        Error('key loading aborted'),
                        c
                      )
                    );
                },
              });
            }))
          );
        }
        resetLoader(t) {
          let { frag: e, keyInfo: i, url: r } = t,
            s = i.loader;
          e.keyLoader === s && ((e.keyLoader = null), (i.loader = null));
          let a = Br(i.decryptdata) || r;
          delete this.keyIdToKeyInfo[a], s && s.destroy();
        }
      }
      function Br(h) {
        let t = h.keyId;
        return t ? Ot(t) : h.uri;
      }
      function gn(h) {
        let { type: t } = h;
        switch (t) {
          case lt.AUDIO_TRACK:
            return j.AUDIO;
          case lt.SUBTITLE_TRACK:
            return j.SUBTITLE;
          default:
            return j.MAIN;
        }
      }
      function $r(h, t) {
        let e = h.url;
        return (e === void 0 || e.indexOf('data:') === 0) && (e = t.url), e;
      }
      class Jl {
        constructor(t) {
          (this.hls = void 0),
            (this.loaders = Object.create(null)),
            (this.variableList = null),
            (this.onManifestLoaded = this.checkAutostartLoad),
            (this.hls = t),
            this.registerListeners();
        }
        startLoad(t) {}
        stopLoad() {
          this.destroyInternalLoaders();
        }
        registerListeners() {
          let { hls: t } = this;
          t.on(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.on(p.LEVEL_LOADING, this.onLevelLoading, this),
            t.on(p.AUDIO_TRACK_LOADING, this.onAudioTrackLoading, this),
            t.on(p.SUBTITLE_TRACK_LOADING, this.onSubtitleTrackLoading, this),
            t.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this);
        }
        unregisterListeners() {
          let { hls: t } = this;
          t.off(p.MANIFEST_LOADING, this.onManifestLoading, this),
            t.off(p.LEVEL_LOADING, this.onLevelLoading, this),
            t.off(p.AUDIO_TRACK_LOADING, this.onAudioTrackLoading, this),
            t.off(p.SUBTITLE_TRACK_LOADING, this.onSubtitleTrackLoading, this),
            t.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this);
        }
        createInternalLoader(t) {
          let e = this.hls.config,
            i = e.pLoader,
            r = e.loader,
            s = new (i || r)(e);
          return (this.loaders[t.type] = s), s;
        }
        getInternalLoader(t) {
          return this.loaders[t.type];
        }
        resetInternalLoader(t) {
          this.loaders[t] && delete this.loaders[t];
        }
        destroyInternalLoaders() {
          for (let t in this.loaders) {
            let e = this.loaders[t];
            e && e.destroy(), this.resetInternalLoader(t);
          }
        }
        destroy() {
          (this.variableList = null),
            this.unregisterListeners(),
            this.destroyInternalLoaders();
        }
        onManifestLoading(t, e) {
          let { url: i } = e;
          (this.variableList = null),
            this.load({
              id: null,
              level: 0,
              responseType: 'text',
              type: lt.MANIFEST,
              url: i,
              deliveryDirectives: null,
              levelOrTrack: null,
            });
        }
        onLevelLoading(t, e) {
          let {
            id: i,
            level: r,
            pathwayId: s,
            url: a,
            deliveryDirectives: n,
            levelInfo: l,
          } = e;
          this.load({
            id: i,
            level: r,
            pathwayId: s,
            responseType: 'text',
            type: lt.LEVEL,
            url: a,
            deliveryDirectives: n,
            levelOrTrack: l,
          });
        }
        onAudioTrackLoading(t, e) {
          let {
            id: i,
            groupId: r,
            url: s,
            deliveryDirectives: a,
            track: n,
          } = e;
          this.load({
            id: i,
            groupId: r,
            level: null,
            responseType: 'text',
            type: lt.AUDIO_TRACK,
            url: s,
            deliveryDirectives: a,
            levelOrTrack: n,
          });
        }
        onSubtitleTrackLoading(t, e) {
          let {
            id: i,
            groupId: r,
            url: s,
            deliveryDirectives: a,
            track: n,
          } = e;
          this.load({
            id: i,
            groupId: r,
            level: null,
            responseType: 'text',
            type: lt.SUBTITLE_TRACK,
            url: s,
            deliveryDirectives: a,
            levelOrTrack: n,
          });
        }
        onLevelsUpdated(t, e) {
          let i = this.loaders[lt.LEVEL];
          if (i) {
            let r = i.context;
            r &&
              !e.levels.some((s) => s === r.levelOrTrack) &&
              (i.abort(), delete this.loaders[lt.LEVEL]);
          }
        }
        load(t) {
          var e;
          let i,
            r = this.hls.config,
            s = this.getInternalLoader(t);
          if (s) {
            let l = this.hls.logger,
              o = s.context;
            if (
              o &&
              o.levelOrTrack === t.levelOrTrack &&
              (o.url === t.url ||
                (o.deliveryDirectives && !t.deliveryDirectives))
            ) {
              o.url === t.url
                ? l.log(`[playlist-loader]: ignore ${t.url} ongoing request`)
                : l.log(
                    `[playlist-loader]: ignore ${t.url} in favor of ${o.url}`
                  );
              return;
            }
            l.log(
              `[playlist-loader]: aborting previous loader for type: ${t.type}`
            ),
              s.abort();
          }
          if (
            ((i =
              t.type === lt.MANIFEST
                ? r.manifestLoadPolicy.default
                : at({}, r.playlistLoadPolicy.default, {
                    timeoutRetry: null,
                    errorRetry: null,
                  })),
            (s = this.createInternalLoader(t)),
            Y((e = t.deliveryDirectives) == null ? void 0 : e.part))
          ) {
            let l;
            if (
              (t.type === lt.LEVEL && t.level !== null
                ? (l = this.hls.levels[t.level].details)
                : t.type === lt.AUDIO_TRACK && t.id !== null
                ? (l = this.hls.audioTracks[t.id].details)
                : t.type === lt.SUBTITLE_TRACK &&
                  t.id !== null &&
                  (l = this.hls.subtitleTracks[t.id].details),
              l)
            ) {
              let o = l.partTarget,
                d = l.targetduration;
              if (o && d) {
                let u = 1e3 * Math.max(3 * o, 0.8 * d);
                i = at({}, i, {
                  maxTimeToFirstByteMs: Math.min(u, i.maxTimeToFirstByteMs),
                  maxLoadTimeMs: Math.min(u, i.maxTimeToFirstByteMs),
                });
              }
            }
          }
          let a = i.errorRetry || i.timeoutRetry || {},
            n = {
              loadPolicy: i,
              timeout: i.maxLoadTimeMs,
              maxRetry: a.maxNumRetry || 0,
              retryDelay: a.retryDelayMs || 0,
              maxRetryDelay: a.maxRetryDelayMs || 0,
            };
          s.load(t, n, {
            onSuccess: (l, o, d, u) => {
              let c = this.getInternalLoader(d);
              this.resetInternalLoader(d.type);
              let f = l.data;
              if (f.indexOf('#EXTM3U') !== 0) {
                this.handleManifestParsingError(
                  l,
                  d,
                  Error('no EXTM3U delimiter'),
                  u || null,
                  o
                );
                return;
              }
              (o.parsing.start = performance.now()),
                te.isMediaPlaylist(f) || d.type !== lt.MANIFEST
                  ? this.handleTrackOrLevelPlaylist(l, o, d, u || null, c)
                  : this.handleMasterPlaylist(l, o, d, u);
            },
            onError: (l, o, d, u) => {
              this.handleNetworkError(o, d, !1, l, u);
            },
            onTimeout: (l, o, d) => {
              this.handleNetworkError(o, d, !0, void 0, l);
            },
          });
        }
        checkAutostartLoad() {
          if (!this.hls) return;
          let {
            config: { autoStartLoad: t, startPosition: e },
            forceStartLoad: i,
          } = this.hls;
          (t || i) &&
            (this.hls.logger.log(
              `${
                t ? 'auto' : 'force'
              } startLoad with configured startPosition ${e}`
            ),
            this.hls.startLoad(e));
        }
        handleMasterPlaylist(t, e, i, r) {
          let s = this.hls,
            a = t.data,
            n = $r(t, i),
            l = te.parseMasterPlaylist(a, n);
          if (l.playlistParsingError) {
            this.handleManifestParsingError(t, i, l.playlistParsingError, r, e);
            return;
          }
          let {
            contentSteering: o,
            levels: d,
            sessionData: u,
            sessionKeys: c,
            startTimeOffset: f,
            variableList: g,
          } = l;
          this.variableList = g;
          let {
            AUDIO: E = [],
            SUBTITLES: m,
            'CLOSED-CAPTIONS': y,
          } = te.parseMasterPlaylistMedia(a, n, l);
          E.length &&
            !E.some((S) => !S.url) &&
            d[0].audioCodec &&
            !d[0].attrs.AUDIO &&
            (this.hls.logger.log(
              '[playlist-loader]: audio codec signaled in quality level, but no embedded audio track signaled, create one'
            ),
            E.unshift({
              type: 'main',
              name: 'main',
              groupId: 'main',
              default: !1,
              autoselect: !1,
              forced: !1,
              id: -1,
              attrs: new Lt({}),
              bitrate: 0,
              url: '',
            })),
            s.trigger(p.MANIFEST_LOADED, {
              levels: d,
              audioTracks: E,
              subtitles: m,
              captions: y,
              contentSteering: o,
              url: n,
              stats: e,
              networkDetails: r,
              sessionData: u,
              sessionKeys: c,
              startTimeOffset: f,
              variableList: g,
            });
        }
        handleTrackOrLevelPlaylist(t, e, i, r, s) {
          let a = this.hls,
            { id: n, level: l, type: o } = i,
            d = $r(t, i),
            u = Y(l) ? l : Y(n) ? n : 0,
            c = gn(i),
            f = te.parseLevelPlaylist(t.data, d, u, c, 0, this.variableList);
          if (o === lt.MANIFEST) {
            let g = {
              attrs: new Lt({}),
              bitrate: 0,
              details: f,
              name: '',
              url: d,
            };
            (f.requestScheduled = e.loading.start + Ks(f, 0)),
              a.trigger(p.MANIFEST_LOADED, {
                levels: [g],
                audioTracks: [],
                url: d,
                stats: e,
                networkDetails: r,
                sessionData: null,
                sessionKeys: null,
                contentSteering: null,
                startTimeOffset: null,
                variableList: null,
              });
          }
          (e.parsing.end = performance.now()),
            (i.levelDetails = f),
            this.handlePlaylistLoaded(f, t, e, i, r, s);
        }
        handleManifestParsingError(t, e, i, r, s) {
          this.hls.trigger(p.ERROR, {
            type: Q.NETWORK_ERROR,
            details: b.MANIFEST_PARSING_ERROR,
            fatal: e.type === lt.MANIFEST,
            url: t.url,
            err: i,
            error: i,
            reason: i.message,
            response: t,
            context: e,
            networkDetails: r,
            stats: s,
          });
        }
        handleNetworkError(t, e, i = !1, r, s) {
          let a = `A network ${
            i ? 'timeout' : 'error' + (r ? ' (status ' + r.code + ')' : '')
          } occurred while loading ${t.type}`;
          t.type === lt.LEVEL
            ? (a += `: ${t.level} id: ${t.id}`)
            : (t.type === lt.AUDIO_TRACK || t.type === lt.SUBTITLE_TRACK) &&
              (a += ` id: ${t.id} group-id: "${t.groupId}"`);
          let n = Error(a);
          this.hls.logger.warn(`[playlist-loader]: ${a}`);
          let l = b.UNKNOWN,
            o = !1,
            d = this.getInternalLoader(t);
          switch (t.type) {
            case lt.MANIFEST:
              (l = i ? b.MANIFEST_LOAD_TIMEOUT : b.MANIFEST_LOAD_ERROR),
                (o = !0);
              break;
            case lt.LEVEL:
              (l = i ? b.LEVEL_LOAD_TIMEOUT : b.LEVEL_LOAD_ERROR), (o = !1);
              break;
            case lt.AUDIO_TRACK:
              (l = i ? b.AUDIO_TRACK_LOAD_TIMEOUT : b.AUDIO_TRACK_LOAD_ERROR),
                (o = !1);
              break;
            case lt.SUBTITLE_TRACK:
              (l = i ? b.SUBTITLE_TRACK_LOAD_TIMEOUT : b.SUBTITLE_LOAD_ERROR),
                (o = !1);
          }
          d && this.resetInternalLoader(t.type);
          let u = {
            type: Q.NETWORK_ERROR,
            details: l,
            fatal: o,
            url: t.url,
            loader: d,
            context: t,
            error: n,
            networkDetails: e,
            stats: s,
          };
          if (r) {
            let c = e?.url || t.url;
            u.response = J({ url: c, data: void 0 }, r);
          }
          this.hls.trigger(p.ERROR, u);
        }
        handlePlaylistLoaded(t, e, i, r, s, a) {
          let n = this.hls,
            { type: l, level: o, id: d, groupId: u, deliveryDirectives: c } = r,
            f = $r(e, r),
            g = gn(r),
            E = typeof r.level == 'number' && g === j.MAIN ? o : void 0;
          if (!t.fragments.length) {
            let y = (t.playlistParsingError = Error(
              'No Segments found in Playlist'
            ));
            n.trigger(p.ERROR, {
              type: Q.NETWORK_ERROR,
              details: b.LEVEL_EMPTY_ERROR,
              fatal: !1,
              url: f,
              error: y,
              reason: y.message,
              response: e,
              context: r,
              level: E,
              parent: g,
              networkDetails: s,
              stats: i,
            });
            return;
          }
          t.targetduration ||
            (t.playlistParsingError = Error('Missing Target Duration'));
          let m = t.playlistParsingError;
          if (m) {
            if (
              (this.hls.logger.warn(`${m} ${t.url}`),
              !n.config.ignorePlaylistParsingErrors)
            ) {
              n.trigger(p.ERROR, {
                type: Q.NETWORK_ERROR,
                details: b.LEVEL_PARSING_ERROR,
                fatal: !1,
                url: f,
                error: m,
                reason: m.message,
                response: e,
                context: r,
                level: E,
                parent: g,
                networkDetails: s,
                stats: i,
              });
              return;
            }
            t.playlistParsingError = null;
          }
          switch (
            (t.live &&
              a &&
              (a.getCacheAge && (t.ageHeader = a.getCacheAge() || 0),
              (!a.getCacheAge || isNaN(t.ageHeader)) && (t.ageHeader = 0)),
            l)
          ) {
            case lt.MANIFEST:
            case lt.LEVEL:
              n.trigger(p.LEVEL_LOADED, {
                details: t,
                levelInfo: r.levelOrTrack || n.levels[0],
                level: E || 0,
                id: d || 0,
                stats: i,
                networkDetails: s,
                deliveryDirectives: c,
                withoutMultiVariant: l === lt.MANIFEST,
              });
              break;
            case lt.AUDIO_TRACK:
              n.trigger(p.AUDIO_TRACK_LOADED, {
                details: t,
                track: r.levelOrTrack,
                id: d || 0,
                groupId: u || '',
                stats: i,
                networkDetails: s,
                deliveryDirectives: c,
              });
              break;
            case lt.SUBTITLE_TRACK:
              n.trigger(p.SUBTITLE_TRACK_LOADED, {
                details: t,
                track: r.levelOrTrack,
                id: d || 0,
                groupId: u || '',
                stats: i,
                networkDetails: s,
                deliveryDirectives: c,
              });
          }
        }
      }
      class ve {
        static get version() {
          return Ue;
        }
        static isMSESupported() {
          return fn();
        }
        static isSupported() {
          return (function () {
            if (!fn()) return !1;
            let t = bt();
            return (
              typeof t?.isTypeSupported == 'function' &&
              (['avc1.42E01E,mp4a.40.2', 'av01.0.01M.08', 'vp09.00.50.08'].some(
                (e) => t.isTypeSupported(xe(e, 'video'))
              ) ||
                ['mp4a.40.2', 'fLaC'].some((e) =>
                  t.isTypeSupported(xe(e, 'audio'))
                ))
            );
          })();
        }
        static getMediaSource() {
          return bt();
        }
        static get Events() {
          return p;
        }
        static get MetadataSchema() {
          return Vt;
        }
        static get ErrorTypes() {
          return Q;
        }
        static get ErrorDetails() {
          return b;
        }
        static get DefaultConfig() {
          return ve.defaultConfig ? ve.defaultConfig : Wl;
        }
        static set DefaultConfig(t) {
          ve.defaultConfig = t;
        }
        constructor(t = {}) {
          (this.config = void 0),
            (this.userConfig = void 0),
            (this.logger = void 0),
            (this.coreComponents = void 0),
            (this.networkControllers = void 0),
            (this._emitter = new rr()),
            (this._autoLevelCapping = -1),
            (this._maxHdcpLevel = null),
            (this.abrController = void 0),
            (this.bufferController = void 0),
            (this.capLevelController = void 0),
            (this.latencyController = void 0),
            (this.levelController = void 0),
            (this.streamController = void 0),
            (this.audioStreamController = void 0),
            (this.subtititleStreamController = void 0),
            (this.audioTrackController = void 0),
            (this.subtitleTrackController = void 0),
            (this.interstitialsController = void 0),
            (this.gapController = void 0),
            (this.emeController = void 0),
            (this.cmcdController = void 0),
            (this._media = null),
            (this._url = null),
            (this._sessionId = void 0),
            (this.triggeringException = void 0),
            (this.started = !1);
          let e = (this.logger = (function (P, x, U) {
              let $ = ne();
              if (
                (typeof console == 'object' && P === !0) ||
                typeof P == 'object'
              ) {
                let B = ['debug', 'log', 'info', 'warn', 'error'];
                B.forEach((O) => {
                  $[O] = qt(O, P, U);
                });
                try {
                  $.log(
                    `Debug logs enabled for "${x}" in hls.js version 1.6.11`
                  );
                } catch {
                  return ne();
                }
                B.forEach((O) => {
                  nt[O] = qt(O, P);
                });
              } else at(nt, $);
              return $;
            })(t.debug || !1, 'Hls instance', t.assetPlayerId)),
            i = (this.config = (function (P, x, U) {
              if (
                (x.liveSyncDurationCount || x.liveMaxLatencyDurationCount) &&
                (x.liveSyncDuration || x.liveMaxLatencyDuration)
              )
                throw Error(
                  "Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration"
                );
              if (
                x.liveMaxLatencyDurationCount !== void 0 &&
                (x.liveSyncDurationCount === void 0 ||
                  x.liveMaxLatencyDurationCount <= x.liveSyncDurationCount)
              )
                throw Error(
                  'Illegal hls.js config: "liveMaxLatencyDurationCount" must be greater than "liveSyncDurationCount"'
                );
              if (
                x.liveMaxLatencyDuration !== void 0 &&
                (x.liveSyncDuration === void 0 ||
                  x.liveMaxLatencyDuration <= x.liveSyncDuration)
              )
                throw Error(
                  'Illegal hls.js config: "liveMaxLatencyDuration" must be greater than "liveSyncDuration"'
                );
              let $ = (function O(w) {
                  return w && typeof w == 'object'
                    ? Array.isArray(w)
                      ? w.map(O)
                      : Object.keys(w).reduce(
                          (q, Z) => ((q[Z] = O(w[Z])), q),
                          {}
                        )
                    : w;
                })(P),
                B = ['TimeOut', 'MaxRetry', 'RetryDelay', 'MaxRetryTimeout'];
              return (
                ['manifest', 'level', 'frag'].forEach((O) => {
                  let w = `${O === 'level' ? 'playlist' : O}LoadPolicy`,
                    q = x[w] === void 0,
                    Z = [];
                  B.forEach((X) => {
                    let V = `${O}Loading${X}`,
                      K = x[V];
                    if (K !== void 0 && q) {
                      Z.push(V);
                      let z = $[w].default;
                      switch (((x[w] = { default: z }), X)) {
                        case 'TimeOut':
                          (z.maxLoadTimeMs = K), (z.maxTimeToFirstByteMs = K);
                          break;
                        case 'MaxRetry':
                          (z.errorRetry.maxNumRetry = K),
                            (z.timeoutRetry.maxNumRetry = K);
                          break;
                        case 'RetryDelay':
                          (z.errorRetry.retryDelayMs = K),
                            (z.timeoutRetry.retryDelayMs = K);
                          break;
                        case 'MaxRetryTimeout':
                          (z.errorRetry.maxRetryDelayMs = K),
                            (z.timeoutRetry.maxRetryDelayMs = K);
                      }
                    }
                  }),
                    Z.length &&
                      U.warn(
                        `hls.js config: "${Z.join(
                          '", "'
                        )}" setting(s) are deprecated, use "${w}": ${yt(x[w])}`
                      );
                }),
                J(J({}, $), x)
              );
            })(ve.DefaultConfig, t, e));
          (this.userConfig = t),
            i.progressive &&
              (function (P, x) {
                let U = P.loader;
                U !== ln && U !== on
                  ? (x.log(
                      '[config]: Custom loader detected, cannot enable progressive streaming'
                    ),
                    (P.progressive = !1))
                  : (function () {
                      if (
                        F.fetch &&
                        F.AbortController &&
                        F.ReadableStream &&
                        F.Request
                      )
                        try {
                          return new F.ReadableStream({}), !0;
                        } catch {}
                      return !1;
                    })() &&
                    ((P.loader = ln),
                    (P.progressive = !0),
                    (P.enableSoftwareAES = !0),
                    x.log(
                      '[config]: Progressive streaming enabled, using FetchLoader'
                    ));
              })(i, e);
          let {
              abrController: r,
              bufferController: s,
              capLevelController: a,
              errorController: n,
              fpsController: l,
            } = i,
            o = new n(this),
            d = (this.abrController = new r(this)),
            u = new In(this),
            c = i.interstitialsController,
            f = c ? (this.interstitialsController = new c(this, ve)) : null,
            g = (this.bufferController = new s(this, u)),
            E = (this.capLevelController = new a(this)),
            m = new l(this),
            y = new Jl(this),
            S = i.contentSteeringController,
            T = S ? new S(this) : null,
            A = (this.levelController = new zl(this, T)),
            R = new ql(this),
            I = new Zl(this.config, this.logger),
            v = (this.streamController = new Ql(this, u, I)),
            _ = (this.gapController = new jl(this, u));
          E.setStreamController(v), m.setStreamController(v);
          let L = [y, A, v];
          f && L.splice(1, 0, f),
            T && L.splice(1, 0, T),
            (this.networkControllers = L);
          let C = [d, g, _, E, m, R, u];
          this.audioTrackController = this.createController(
            i.audioTrackController,
            L
          );
          let M = i.audioStreamController;
          M && L.push((this.audioStreamController = new M(this, u, I))),
            (this.subtitleTrackController = this.createController(
              i.subtitleTrackController,
              L
            ));
          let G = i.subtitleStreamController;
          G && L.push((this.subtititleStreamController = new G(this, u, I))),
            this.createController(i.timelineController, C),
            (I.emeController = this.emeController =
              this.createController(i.emeController, C)),
            (this.cmcdController = this.createController(i.cmcdController, C)),
            (this.latencyController = this.createController(Xl, C)),
            (this.coreComponents = C),
            L.push(o);
          let k = o.onErrorOut;
          typeof k == 'function' && this.on(p.ERROR, k, o),
            this.on(p.MANIFEST_LOADED, y.onManifestLoaded, y);
        }
        createController(t, e) {
          if (t) {
            let i = new t(this);
            return e && e.push(i), i;
          }
          return null;
        }
        on(t, e, i = this) {
          this._emitter.on(t, e, i);
        }
        once(t, e, i = this) {
          this._emitter.once(t, e, i);
        }
        removeAllListeners(t) {
          this._emitter.removeAllListeners(t);
        }
        off(t, e, i = this, r) {
          this._emitter.off(t, e, i, r);
        }
        listeners(t) {
          return this._emitter.listeners(t);
        }
        emit(t, e, i) {
          return this._emitter.emit(t, e, i);
        }
        trigger(t, e) {
          if (this.config.debug) return this.emit(t, t, e);
          try {
            return this.emit(t, t, e);
          } catch (i) {
            if (
              (this.logger.error(
                'An internal error happened while handling event ' +
                  t +
                  '. Error message: "' +
                  i.message +
                  '". Here is a stacktrace:',
                i
              ),
              !this.triggeringException)
            ) {
              this.triggeringException = !0;
              let r = t === p.ERROR;
              this.trigger(p.ERROR, {
                type: Q.OTHER_ERROR,
                details: b.INTERNAL_EXCEPTION,
                fatal: r,
                event: t,
                error: i,
              }),
                (this.triggeringException = !1);
            }
          }
          return !1;
        }
        listenerCount(t) {
          return this._emitter.listenerCount(t);
        }
        destroy() {
          this.logger.log('destroy'),
            this.trigger(p.DESTROYING, void 0),
            this.detachMedia(),
            this.removeAllListeners(),
            (this._autoLevelCapping = -1),
            (this._url = null),
            this.networkControllers.forEach((e) => e.destroy()),
            (this.networkControllers.length = 0),
            this.coreComponents.forEach((e) => e.destroy()),
            (this.coreComponents.length = 0);
          let t = this.config;
          (t.xhrSetup = t.fetchSetup = void 0), (this.userConfig = null);
        }
        attachMedia(t) {
          if (!t || ('media' in t && !t.media)) {
            let s = Error(`attachMedia failed: invalid argument (${t})`);
            this.trigger(p.ERROR, {
              type: Q.OTHER_ERROR,
              details: b.ATTACH_MEDIA_ERROR,
              fatal: !0,
              error: s,
            });
            return;
          }
          this.logger.log('attachMedia'),
            this._media &&
              (this.logger.warn('media must be detached before attaching'),
              this.detachMedia());
          let e = 'media' in t,
            i = e ? t.media : t,
            r = e ? t : { media: i };
          (this._media = i), this.trigger(p.MEDIA_ATTACHING, r);
        }
        detachMedia() {
          this.logger.log('detachMedia'),
            this.trigger(p.MEDIA_DETACHING, {}),
            (this._media = null);
        }
        transferMedia() {
          this._media = null;
          let t = this.bufferController.transferMedia();
          return this.trigger(p.MEDIA_DETACHING, { transferMedia: t }), t;
        }
        loadSource(t) {
          this.stopLoad();
          let e = this.media,
            i = this._url,
            r = (this._url = we.buildAbsoluteURL(F.location.href, t, {
              alwaysNormalize: !0,
            }));
          (this._autoLevelCapping = -1),
            (this._maxHdcpLevel = null),
            this.logger.log(`loadSource:${r}`),
            e &&
              i &&
              (i !== r || this.bufferController.hasSourceTypes()) &&
              (this.detachMedia(), this.attachMedia(e)),
            this.trigger(p.MANIFEST_LOADING, { url: t });
        }
        get url() {
          return this._url;
        }
        get hasEnoughToStart() {
          return this.streamController.hasEnoughToStart;
        }
        get startPosition() {
          return this.streamController.startPositionValue;
        }
        startLoad(t = -1, e) {
          this.logger.log(
            `startLoad(${t + (e ? ', <skip seek to start>' : '')})`
          ),
            (this.started = !0),
            this.resumeBuffering();
          for (
            let i = 0;
            i < this.networkControllers.length &&
            (this.networkControllers[i].startLoad(t, e),
            this.started && this.networkControllers);
            i++
          );
        }
        stopLoad() {
          this.logger.log('stopLoad'), (this.started = !1);
          for (
            let t = 0;
            t < this.networkControllers.length &&
            (this.networkControllers[t].stopLoad(),
            !this.started && this.networkControllers);
            t++
          );
        }
        get loadingEnabled() {
          return this.started;
        }
        get bufferingEnabled() {
          return this.streamController.bufferingEnabled;
        }
        resumeBuffering() {
          this.bufferingEnabled ||
            (this.logger.log('resume buffering'),
            this.networkControllers.forEach((t) => {
              t.resumeBuffering && t.resumeBuffering();
            }));
        }
        pauseBuffering() {
          this.bufferingEnabled &&
            (this.logger.log('pause buffering'),
            this.networkControllers.forEach((t) => {
              t.pauseBuffering && t.pauseBuffering();
            }));
        }
        get inFlightFragments() {
          let t = { [j.MAIN]: this.streamController.inFlightFrag };
          return (
            this.audioStreamController &&
              (t[j.AUDIO] = this.audioStreamController.inFlightFrag),
            this.subtititleStreamController &&
              (t[j.SUBTITLE] = this.subtititleStreamController.inFlightFrag),
            t
          );
        }
        swapAudioCodec() {
          this.logger.log('swapAudioCodec'),
            this.streamController.swapAudioCodec();
        }
        recoverMediaError() {
          this.logger.log('recoverMediaError');
          let t = this._media,
            e = t?.currentTime;
          this.detachMedia(),
            t && (this.attachMedia(t), e && this.startLoad(e));
        }
        removeLevel(t) {
          this.levelController.removeLevel(t);
        }
        get sessionId() {
          let t = this._sessionId;
          return (
            t ||
              (t = this._sessionId =
                (function () {
                  try {
                    return crypto.randomUUID();
                  } catch {
                    try {
                      let i = URL.createObjectURL(new Blob()),
                        r = i.toString();
                      return (
                        URL.revokeObjectURL(i), r.slice(r.lastIndexOf('/') + 1)
                      );
                    } catch {
                      let r = new Date().getTime();
                      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                        /[xy]/g,
                        (s) => {
                          let a = (r + 16 * Math.random()) % 16 | 0;
                          return (
                            (r = Math.floor(r / 16)),
                            (s == 'x' ? a : (3 & a) | 8).toString(16)
                          );
                        }
                      );
                    }
                  }
                })()),
            t
          );
        }
        get levels() {
          return this.levelController.levels || [];
        }
        get latestLevelDetails() {
          return this.streamController.getLevelDetails() || null;
        }
        get loadLevelObj() {
          return this.levelController.loadLevelObj;
        }
        get currentLevel() {
          return this.streamController.currentLevel;
        }
        set currentLevel(t) {
          this.logger.log(`set currentLevel:${t}`),
            (this.levelController.manualLevel = t),
            this.streamController.immediateLevelSwitch();
        }
        get nextLevel() {
          return this.streamController.nextLevel;
        }
        set nextLevel(t) {
          this.logger.log(`set nextLevel:${t}`),
            (this.levelController.manualLevel = t),
            this.streamController.nextLevelSwitch();
        }
        get loadLevel() {
          return this.levelController.level;
        }
        set loadLevel(t) {
          this.logger.log(`set loadLevel:${t}`),
            (this.levelController.manualLevel = t);
        }
        get nextLoadLevel() {
          return this.levelController.nextLoadLevel;
        }
        set nextLoadLevel(t) {
          this.levelController.nextLoadLevel = t;
        }
        get firstLevel() {
          return Math.max(this.levelController.firstLevel, this.minAutoLevel);
        }
        set firstLevel(t) {
          this.logger.log(`set firstLevel:${t}`),
            (this.levelController.firstLevel = t);
        }
        get startLevel() {
          let t = this.levelController.startLevel;
          return t === -1 && this.abrController.forcedAutoLevel > -1
            ? this.abrController.forcedAutoLevel
            : t;
        }
        set startLevel(t) {
          this.logger.log(`set startLevel:${t}`),
            t !== -1 && (t = Math.max(t, this.minAutoLevel)),
            (this.levelController.startLevel = t);
        }
        get capLevelToPlayerSize() {
          return this.config.capLevelToPlayerSize;
        }
        set capLevelToPlayerSize(t) {
          let e = !!t;
          e !== this.config.capLevelToPlayerSize &&
            (e
              ? this.capLevelController.startCapping()
              : (this.capLevelController.stopCapping(),
                (this.autoLevelCapping = -1),
                this.streamController.nextLevelSwitch()),
            (this.config.capLevelToPlayerSize = e));
        }
        get autoLevelCapping() {
          return this._autoLevelCapping;
        }
        get bandwidthEstimate() {
          let { bwEstimator: t } = this.abrController;
          return t ? t.getEstimate() : NaN;
        }
        set bandwidthEstimate(t) {
          this.abrController.resetEstimator(t);
        }
        get abrEwmaDefaultEstimate() {
          let { bwEstimator: t } = this.abrController;
          return t ? t.defaultEstimate : NaN;
        }
        get ttfbEstimate() {
          let { bwEstimator: t } = this.abrController;
          return t ? t.getEstimateTTFB() : NaN;
        }
        set autoLevelCapping(t) {
          this._autoLevelCapping !== t &&
            (this.logger.log(`set autoLevelCapping:${t}`),
            (this._autoLevelCapping = t),
            this.levelController.checkMaxAutoUpdated());
        }
        get maxHdcpLevel() {
          return this._maxHdcpLevel;
        }
        set maxHdcpLevel(t) {
          Gi.indexOf(t) > -1 &&
            this._maxHdcpLevel !== t &&
            ((this._maxHdcpLevel = t),
            this.levelController.checkMaxAutoUpdated());
        }
        get autoLevelEnabled() {
          return this.levelController.manualLevel === -1;
        }
        get manualLevel() {
          return this.levelController.manualLevel;
        }
        get minAutoLevel() {
          let {
            levels: t,
            config: { minAutoBitrate: e },
          } = this;
          if (!t) return 0;
          let i = t.length;
          for (let r = 0; r < i; r++) if (t[r].maxBitrate >= e) return r;
          return 0;
        }
        get maxAutoLevel() {
          let t,
            { levels: e, autoLevelCapping: i, maxHdcpLevel: r } = this;
          if (((t = i === -1 && e != null && e.length ? e.length - 1 : i), r))
            for (let s = t; s--; ) {
              let a = e[s].attrs['HDCP-LEVEL'];
              if (a && a <= r) return s;
            }
          return t;
        }
        get firstAutoLevel() {
          return this.abrController.firstAutoLevel;
        }
        get nextAutoLevel() {
          return this.abrController.nextAutoLevel;
        }
        set nextAutoLevel(t) {
          this.abrController.nextAutoLevel = t;
        }
        get playingDate() {
          return this.streamController.currentProgramDateTime;
        }
        get mainForwardBufferInfo() {
          return this.streamController.getMainFwdBufferInfo();
        }
        get maxBufferLength() {
          return this.streamController.maxBufferLength;
        }
        setAudioOption(t) {
          var e;
          return (
            ((e = this.audioTrackController) == null
              ? void 0
              : e.setAudioOption(t)) || null
          );
        }
        setSubtitleOption(t) {
          var e;
          return (
            ((e = this.subtitleTrackController) == null
              ? void 0
              : e.setSubtitleOption(t)) || null
          );
        }
        get allAudioTracks() {
          let t = this.audioTrackController;
          return t ? t.allAudioTracks : [];
        }
        get audioTracks() {
          let t = this.audioTrackController;
          return t ? t.audioTracks : [];
        }
        get audioTrack() {
          let t = this.audioTrackController;
          return t ? t.audioTrack : -1;
        }
        set audioTrack(t) {
          let e = this.audioTrackController;
          e && (e.audioTrack = t);
        }
        get allSubtitleTracks() {
          let t = this.subtitleTrackController;
          return t ? t.allSubtitleTracks : [];
        }
        get subtitleTracks() {
          let t = this.subtitleTrackController;
          return t ? t.subtitleTracks : [];
        }
        get subtitleTrack() {
          let t = this.subtitleTrackController;
          return t ? t.subtitleTrack : -1;
        }
        get media() {
          return this._media;
        }
        set subtitleTrack(t) {
          let e = this.subtitleTrackController;
          e && (e.subtitleTrack = t);
        }
        get subtitleDisplay() {
          let t = this.subtitleTrackController;
          return !!t && t.subtitleDisplay;
        }
        set subtitleDisplay(t) {
          let e = this.subtitleTrackController;
          e && (e.subtitleDisplay = t);
        }
        get lowLatencyMode() {
          return this.config.lowLatencyMode;
        }
        set lowLatencyMode(t) {
          this.config.lowLatencyMode = t;
        }
        get liveSyncPosition() {
          return this.latencyController.liveSyncPosition;
        }
        get latency() {
          return this.latencyController.latency;
        }
        get maxLatency() {
          return this.latencyController.maxLatency;
        }
        get targetLatency() {
          return this.latencyController.targetLatency;
        }
        set targetLatency(t) {
          this.latencyController.targetLatency = t;
        }
        get drift() {
          return this.latencyController.drift;
        }
        get forceStartLoad() {
          return this.streamController.forceStartLoad;
        }
        get pathways() {
          return this.levelController.pathways;
        }
        get pathwayPriority() {
          return this.levelController.pathwayPriority;
        }
        set pathwayPriority(t) {
          this.levelController.pathwayPriority = t;
        }
        get bufferedToEnd() {
          var t;
          return !!((t = this.bufferController) != null && t.bufferedToEnd);
        }
        get interstitialsManager() {
          var t;
          return (
            ((t = this.interstitialsController) == null
              ? void 0
              : t.interstitialsManager) || null
          );
        }
        getMediaDecodingInfo(t, e = this.allAudioTracks) {
          return as(t, ds(e), navigator.mediaCapabilities);
        }
      }
      ve.defaultConfig = void 0;
    }),
    Kr
  );
export { so as __getNamedExports };
