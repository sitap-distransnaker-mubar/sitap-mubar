/* ============================================================
   api-shim.js — pengganti google.script.run untuk GitHub Pages.
   Semua panggilan google.script.run.NAMA(...) dikirim sebagai
   POST {fn, args, base} ke Web App Apps Script (config.js).
   ============================================================ */
(function () {
  'use strict';
  var CFG = window.SITAP_CONFIG || {};
  var BASE = location.origin + location.pathname.replace(/[^\/]*$/, ''); // folder situs ini, mis. https://user.github.io/repo/

  function belumDiisi() { return !CFG.API_URL || /ISI_ID_DEPLOYMENT/.test(CFG.API_URL); }

  function panggil(fn, args) {
    if (belumDiisi()) {
      return Promise.reject(new Error('API_URL di config.js belum diisi dengan URL Web App Apps Script (/exec).'));
    }
    return fetch(CFG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // "simple request": tanpa preflight CORS
      body: JSON.stringify({ fn: fn, args: args, base: BASE }),
      redirect: 'follow'
    }).then(function (r) {
      return r.text();
    }).then(function (txt) {
      var o;
      try { o = JSON.parse(txt); }
      catch (e) { throw new Error('Respons server tidak valid. Pastikan Web App di-deploy: Execute as "Me", akses "Anyone", dan versi terbaru.'); }
      if (o && o.__error) throw new Error(o.__error);
      return o ? o.result : null;
    }, function () {
      throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    });
  }

  function runner(ok, fail, userObj) {
    return new Proxy({}, {
      get: function (_, name) {
        if (typeof name !== 'string') return undefined;
        if (name === 'withSuccessHandler') return function (f) { return runner(f, fail, userObj); };
        if (name === 'withFailureHandler') return function (f) { return runner(ok, f, userObj); };
        if (name === 'withUserObject') return function (u) { return runner(ok, fail, u); };
        return function () {
          var args = Array.prototype.slice.call(arguments);
          panggil(name, args).then(function (r) {
            if (ok) ok(r, userObj);
          }, function (e) {
            if (fail) fail(e, userObj); else if (window.console) console.error('[' + name + ']', e);
          });
        };
      }
    });
  }

  window.google = window.google || {};
  window.google.script = {
    run: runner(null, null, undefined),
    host: { close: function () {}, setHeight: function () {}, setWidth: function () {}, origin: location.origin },
    history: { push: function () {}, replace: function () {}, setChangeHandler: function () {} }
  };
})();
