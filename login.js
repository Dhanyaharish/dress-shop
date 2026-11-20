// Login page. First visit: create a password. After that: log in.
// A correct login lasts until the browser tab is closed or "Log out" is tapped.

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const FAIL_KEY = "shopManagerFails.v1";
  const DATA_KEY = "shopManagerData.v1";

  // Already logged in? Go straight to the manager.
  if (ShopAuth.getLock() && ShopAuth.isLoggedIn()) {
    location.replace("admin.html");
    return;
  }

  const setupMode = !ShopAuth.getLock(); // no password yet -> create one

  /* ---------- Text in English and Kannada ---------- */
  const I18N = {
    en: {
      "login.title": "Owner login",
      "login.setupTitle": "Create a password",
      "login.setupHelp": "First time here. Choose a password for the shop manager and write it down. It cannot be recovered.",
      "login.password": "Password",
      "login.confirm": "Confirm password",
      "login.button": "Log in",
      "login.create": "Create password and continue",
      "login.wrong": "Wrong password.",
      "login.short": "Use at least 4 characters.",
      "login.mismatch": "The two passwords do not match.",
      "login.needHttps": "Passwords need a secure (https) page. Open the site from its https link.",
      "login.wait": "Too many wrong tries. Wait {n} seconds.",
      "login.saveFail": "Could not save the password. Turn off private browsing and try again.",
      "login.noSession": "Your browser blocked the login session. Turn off private browsing and try again.",
      "login.forgot": "Forgot the password? It cannot be recovered. Clearing this browser's site data removes it, but also erases the saved stock and sales unless you have a backup.",
      "login.back": "← Back to website"
    },
    kn: {
      "login.title": "ಮಾಲೀಕರ ಲಾಗಿನ್",
      "login.setupTitle": "ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ",
      "login.setupHelp": "ಮೊದಲ ಬಾರಿ. ಅಂಗಡಿ ನಿರ್ವಹಣೆಗೆ ಪಾಸ್‌ವರ್ಡ್ ಆರಿಸಿ ಮತ್ತು ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ. ಇದನ್ನು ಮರಳಿ ಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      "login.password": "ಪಾಸ್‌ವರ್ಡ್",
      "login.confirm": "ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ",
      "login.button": "ಲಾಗಿನ್",
      "login.create": "ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ ಮುಂದುವರಿಸಿ",
      "login.wrong": "ತಪ್ಪು ಪಾಸ್‌ವರ್ಡ್.",
      "login.short": "ಕನಿಷ್ಠ 4 ಅಕ್ಷರ ಬಳಸಿ.",
      "login.mismatch": "ಎರಡೂ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದುತ್ತಿಲ್ಲ.",
      "login.needHttps": "ಪಾಸ್‌ವರ್ಡ್‌ಗೆ ಸುರಕ್ಷಿತ (https) ಪುಟ ಬೇಕು. https ಲಿಂಕ್‌ನಿಂದ ತೆರೆಯಿರಿ.",
      "login.wait": "ಹಲವು ತಪ್ಪು ಪ್ರಯತ್ನಗಳು. {n} ಸೆಕೆಂಡ್ ಕಾಯಿರಿ.",
      "login.saveFail": "ಪಾಸ್‌ವರ್ಡ್ ಉಳಿಸಲು ಆಗಲಿಲ್ಲ. ಪ್ರೈವೇಟ್ ಬ್ರೌಸಿಂಗ್ ಆಫ್ ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      "login.noSession": "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಲಾಗಿನ್ ಸೆಷನ್ ತಡೆದಿದೆ. ಪ್ರೈವೇಟ್ ಬ್ರೌಸಿಂಗ್ ಆಫ್ ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      "login.forgot": "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ? ಅದನ್ನು ಮರಳಿ ಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ. ಈ ಬ್ರೌಸರ್‌ನ ಸೈಟ್ ಡೇಟಾ ಅಳಿಸಿದರೆ ಪಾಸ್‌ವರ್ಡ್ ಹೋಗುತ್ತದೆ, ಆದರೆ ಬ್ಯಾಕಪ್ ಇಲ್ಲದಿದ್ದರೆ ಸ್ಟಾಕ್ ಮತ್ತು ಮಾರಾಟದ ಡೇಟಾವೂ ಅಳಿಯುತ್ತದೆ.",
      "login.back": "← ವೆಬ್‌ಸೈಟ್‌ಗೆ ಹಿಂತಿರುಗಿ"
    }
  };

  let lang = "en";
  try { lang = localStorage.getItem("lang") === "kn" ? "kn" : "en"; } catch (e) { /* ignore */ }

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }

  // The shop name the owner saved in the manager (if any).
  function shopName() {
    try {
      const d = JSON.parse(localStorage.getItem(DATA_KEY));
      return (d && d.settings && d.settings.shopName) || "";
    } catch (e) { return ""; }
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.body.classList.toggle("kn", lang === "kn");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    $("langBtn").textContent = lang === "en" ? "ಕನ್ನಡ" : "English";
    $("loginShop").textContent = shopName() || "Shop Manager";
    $("loginSub").firstChild.textContent = t(setupMode ? "login.setupTitle" : "login.title");
    $("loginHelp").textContent = t("login.setupHelp");
    $("loginHelp").hidden = !setupMode;
    $("confirmWrap").hidden = !setupMode;
    $("loginBtn").textContent = t(setupMode ? "login.create" : "login.button");
    $("loginForgot").textContent = setupMode ? "" : t("login.forgot");
    document.title = t(setupMode ? "login.setupTitle" : "login.title");
  }

  $("langBtn").addEventListener("click", () => {
    lang = lang === "en" ? "kn" : "en";
    try { localStorage.setItem("lang", lang); } catch (e) { /* ignore */ }
    applyLang();
  });

  /* ---------- Slow down repeated wrong guesses ---------- */
  function getFails() {
    try { return JSON.parse(localStorage.getItem(FAIL_KEY)) || { count: 0, until: 0 }; }
    catch (e) { return { count: 0, until: 0 }; }
  }
  function setFails(f) {
    try { localStorage.setItem(FAIL_KEY, JSON.stringify(f)); } catch (e) { /* ignore */ }
  }

  function fail(msg) {
    $("loginError").textContent = msg;
    $("loginError").hidden = false;
  }

  function enter() {
    ShopAuth.setLoggedIn();
    if (!ShopAuth.isLoggedIn()) { fail(t("login.noSession")); return; }
    location.replace("admin.html");
  }

  /* ---------- Form ---------- */
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    $("loginError").hidden = true;
    const pw = $("loginPassword").value;

    if (!ShopAuth.canHash()) { fail(t("login.needHttps")); return; }

    if (setupMode) {
      if (pw.length < 4) { fail(t("login.short")); return; }
      if (pw !== $("loginConfirm").value) { fail(t("login.mismatch")); return; }
      ShopAuth.createLock(pw).then(enter).catch(() => fail(t("login.saveFail")));
      return;
    }

    const f = getFails();
    if (Date.now() < f.until) {
      fail(t("login.wait", { n: Math.ceil((f.until - Date.now()) / 1000) }));
      return;
    }

    ShopAuth.checkPassword(pw).then((ok) => {
      if (ok) {
        setFails({ count: 0, until: 0 });
        enter();
      } else {
        f.count += 1;
        if (f.count % 5 === 0) f.until = Date.now() + 30000; // 30 second wait after every 5 wrong tries
        setFails(f);
        fail(f.until > Date.now() ? t("login.wait", { n: 30 }) : t("login.wrong"));
        $("loginPassword").select();
      }
    }).catch(() => fail(t("login.needHttps")));
  });

  applyLang();
  $("loginPassword").focus();
})();
