var n = {},
  _ = (c, s, a) => (
    (n.__chunk_52387 = (i, o, r) => {
      'use strict';
      function l(u) {
        let e = u.cookies.get('auth');
        if (!e) return null;
        try {
          let t = decodeURIComponent(e.value);
          return JSON.parse(t);
        } catch {
          return null;
        }
      }
      r.d(o, { l: () => l });
    }),
    n
  );
export { _ as __getNamedExports };
