// Shared password helpers used by login.html and admin.html.
// Only a salted hash of the password is saved on this phone/browser, never the password itself.

(function () {
  "use strict";

  var LOCK_KEY = "shopManagerLock.v1";   // { salt, hash }
  var AUTH_KEY = "shopManagerAuth";      // "1" while logged in (cleared when the tab closes)

  function getLock() {
    try { return JSON.parse(localStorage.getItem(LOCK_KEY)); } catch (e) { return null; }
  }

  // Password hashing needs a secure page (https or localhost).
  function canHash() {
    return !!(window.crypto && window.crypto.subtle && window.TextEncoder);
  }

  function toHex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function fromHex(h) {
    var a = new Uint8Array(h.length / 2);
    for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16);
    return a;
  }

  function hashPassword(password, saltHex) {
    return window.crypto.subtle
      .importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"])
      .then(function (key) {
        return window.crypto.subtle.deriveBits(
          { name: "PBKDF2", salt: fromHex(saltHex), iterations: 100000, hash: "SHA-256" }, key, 256);
      })
      .then(toHex);
  }

  // Resolves true when the typed password is right. Resolves false if no password exists yet.
  function checkPassword(password) {
    var lock = getLock();
    if (!lock) return Promise.resolve(false);
    return hashPassword(password, lock.salt).then(function (h) { return h === lock.hash; });
  }

  // Saves a new password (replaces any old one). Rejects if storage is unavailable.
  function createLock(password) {
    var salt = toHex(window.crypto.getRandomValues(new Uint8Array(16)));
    return hashPassword(password, salt).then(function (hash) {
      localStorage.setItem(LOCK_KEY, JSON.stringify({ salt: salt, hash: hash }));
    });
  }

  function isLoggedIn() {
    try { return sessionStorage.getItem(AUTH_KEY) === "1"; } catch (e) { return false; }
  }

  function setLoggedIn() {
    try { sessionStorage.setItem(AUTH_KEY, "1"); } catch (e) { /* checked by isLoggedIn */ }
  }

  function logout() {
    try { sessionStorage.removeItem(AUTH_KEY); } catch (e) { /* ignore */ }
    location.replace("login.html");
  }

  window.ShopAuth = {
    getLock: getLock,
    canHash: canHash,
    checkPassword: checkPassword,
    createLock: createLock,
    isLoggedIn: isLoggedIn,
    setLoggedIn: setLoggedIn,
    logout: logout
  };
})();
