// Shop Manager: stock, sales and wholesale bill photos.
// Data is saved in THIS browser only:
//   - numbers (items, sales, bill details) -> localStorage
//   - bill photos                          -> IndexedDB
// Use "Download backup" on the Home tab regularly.

(function () {
  "use strict";

  // Alert when an item has LESS than this many pieces (so 0, 1 or 2).
  const LOW_LIMIT = 3;
  const LS_KEY = "shopManagerData.v1";
  const $ = (id) => document.getElementById(id);

  /* ---------- Text in English and Kannada ---------- */
  const I18N = {
    en: {
      "app.title": "Shop Manager",
      "btn.enableAlerts": "Enable alerts",
      "btn.alertsOn": "Alerts on",
      "nav.home": "Home", "nav.stock": "Stock", "nav.sales": "Sales", "nav.bills": "Bills",
      "dash.today": "Today's sales", "dash.month": "This month",
      "dash.items": "Pieces in stock", "dash.low": "Low stock items",
      "dash.lowList": "Needs restocking", "dash.none": "Nothing is low.",
      "dash.backup": "Backup",
      "dash.backupHelp": "Your data is saved on this phone/browser only. Download a backup often.",
      "btn.export": "Download backup", "btn.import": "Restore backup",
      "stock.add": "Add item", "stock.edit": "Edit item",
      "f.name": "Item name", "f.category": "Category",
      "f.cost": "Cost price (₹)", "f.price": "Selling price (₹)", "f.qty": "Quantity",
      "btn.save": "Save", "btn.cancel": "Cancel", "btn.edit": "Edit", "btn.delete": "Delete",
      "btn.addStock": "+ Stock", "btn.close": "Close",
      "stock.search": "Search items",
      "stock.empty": "No items yet. Add your first item above.",
      "stock.left": "left", "stock.low": "Low stock", "stock.out": "Out of stock",
      "stock.addHowMany": "How many pieces to add to \"{name}\"?",
      "stock.confirmDelete": "Delete \"{name}\"?",
      "sales.record": "Record a sale",
      "f.item": "Item", "f.date": "Date",
      "f.saleQty": "Quantity sold", "f.salePrice": "Price per piece (₹)",
      "btn.sell": "Record sale",
      "sales.choose": "Choose item",
      "sales.history": "Recent sales", "sales.empty": "No sales yet.",
      "sales.notEnough": "Only {n} left in stock.",
      "sales.confirmDelete": "Delete this sale? The pieces go back to stock.",
      "bills.add": "Save wholesale bill",
      "f.supplier": "Supplier", "f.amount": "Total amount (₹)", "f.note": "Note",
      "f.photo": "Photo of the list",
      "bills.history": "Saved bills", "bills.empty": "No bills saved yet.",
      "bills.needPhoto": "Please choose a photo.",
      "bills.confirmDelete": "Delete this bill?",
      "msg.saved": "Saved",
      "msg.lowAlert": "Low stock: {name} ({n} left)",
      "banner.low": "{n} item(s) low on stock",
      "msg.alertsBlocked": "Alerts are blocked in your browser settings.",
      "msg.alertsUnsupported": "This browser does not support alerts. The red banner will still show.",
      "msg.restoreOk": "Backup restored",
      "msg.restoreBad": "This file is not a valid backup.",
      "msg.restoreConfirm": "This replaces all current data. Continue?",
      "msg.needName": "Please enter an item name.",
      "msg.saveFail": "Could not save. Storage may be full."
    },
    kn: {
      "app.title": "ಅಂಗಡಿ ನಿರ್ವಹಣೆ",
      "btn.enableAlerts": "ಎಚ್ಚರಿಕೆ ಆನ್ ಮಾಡಿ",
      "btn.alertsOn": "ಎಚ್ಚರಿಕೆ ಆನ್ ಆಗಿದೆ",
      "nav.home": "ಮುಖಪುಟ", "nav.stock": "ಸ್ಟಾಕ್", "nav.sales": "ಮಾರಾಟ", "nav.bills": "ಬಿಲ್‌ಗಳು",
      "dash.today": "ಇಂದಿನ ಮಾರಾಟ", "dash.month": "ಈ ತಿಂಗಳು",
      "dash.items": "ಸ್ಟಾಕ್‌ನಲ್ಲಿರುವ ಪೀಸ್‌ಗಳು", "dash.low": "ಕಡಿಮೆ ಸ್ಟಾಕ್ ಇರುವ ವಸ್ತುಗಳು",
      "dash.lowList": "ಹೊಸ ಸ್ಟಾಕ್ ಬೇಕಾಗಿದೆ", "dash.none": "ಯಾವುದೂ ಕಡಿಮೆ ಇಲ್ಲ.",
      "dash.backup": "ಬ್ಯಾಕಪ್",
      "dash.backupHelp": "ನಿಮ್ಮ ಡೇಟಾ ಈ ಫೋನ್/ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಉಳಿಯುತ್ತದೆ. ಆಗಾಗ ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
      "btn.export": "ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್", "btn.import": "ಬ್ಯಾಕಪ್ ಮರುಸ್ಥಾಪಿಸಿ",
      "stock.add": "ವಸ್ತು ಸೇರಿಸಿ", "stock.edit": "ವಸ್ತು ಬದಲಿಸಿ",
      "f.name": "ವಸ್ತುವಿನ ಹೆಸರು", "f.category": "ವರ್ಗ",
      "f.cost": "ಖರೀದಿ ಬೆಲೆ (₹)", "f.price": "ಮಾರಾಟ ಬೆಲೆ (₹)", "f.qty": "ಸಂಖ್ಯೆ",
      "btn.save": "ಉಳಿಸಿ", "btn.cancel": "ರದ್ದು", "btn.edit": "ಬದಲಿಸಿ", "btn.delete": "ಅಳಿಸಿ",
      "btn.addStock": "+ ಸ್ಟಾಕ್", "btn.close": "ಮುಚ್ಚಿ",
      "stock.search": "ವಸ್ತುಗಳನ್ನು ಹುಡುಕಿ",
      "stock.empty": "ಇನ್ನೂ ವಸ್ತುಗಳಿಲ್ಲ. ಮೇಲೆ ಮೊದಲ ವಸ್ತು ಸೇರಿಸಿ.",
      "stock.left": "ಉಳಿದಿದೆ", "stock.low": "ಕಡಿಮೆ ಸ್ಟಾಕ್", "stock.out": "ಸ್ಟಾಕ್ ಇಲ್ಲ",
      "stock.addHowMany": "\"{name}\" ಗೆ ಎಷ್ಟು ಪೀಸ್ ಸೇರಿಸಬೇಕು?",
      "stock.confirmDelete": "\"{name}\" ಅಳಿಸಬೇಕೇ?",
      "sales.record": "ಮಾರಾಟ ದಾಖಲಿಸಿ",
      "f.item": "ವಸ್ತು", "f.date": "ದಿನಾಂಕ",
      "f.saleQty": "ಮಾರಿದ ಸಂಖ್ಯೆ", "f.salePrice": "ಒಂದು ಪೀಸ್ ಬೆಲೆ (₹)",
      "btn.sell": "ಮಾರಾಟ ದಾಖಲಿಸಿ",
      "sales.choose": "ವಸ್ತು ಆರಿಸಿ",
      "sales.history": "ಇತ್ತೀಚಿನ ಮಾರಾಟ", "sales.empty": "ಇನ್ನೂ ಮಾರಾಟ ಇಲ್ಲ.",
      "sales.notEnough": "ಸ್ಟಾಕ್‌ನಲ್ಲಿ {n} ಮಾತ್ರ ಇದೆ.",
      "sales.confirmDelete": "ಈ ಮಾರಾಟ ಅಳಿಸಬೇಕೇ? ಪೀಸ್‌ಗಳು ಸ್ಟಾಕ್‌ಗೆ ಮರಳುತ್ತವೆ.",
      "bills.add": "ಸಗಟು ಬಿಲ್ ಉಳಿಸಿ",
      "f.supplier": "ಸರಬರಾಜುದಾರ", "f.amount": "ಒಟ್ಟು ಮೊತ್ತ (₹)", "f.note": "ಟಿಪ್ಪಣಿ",
      "f.photo": "ಪಟ್ಟಿಯ ಫೋಟೋ",
      "bills.history": "ಉಳಿಸಿದ ಬಿಲ್‌ಗಳು", "bills.empty": "ಇನ್ನೂ ಬಿಲ್‌ಗಳಿಲ್ಲ.",
      "bills.needPhoto": "ದಯವಿಟ್ಟು ಫೋಟೋ ಆರಿಸಿ.",
      "bills.confirmDelete": "ಈ ಬಿಲ್ ಅಳಿಸಬೇಕೇ?",
      "msg.saved": "ಉಳಿಸಲಾಗಿದೆ",
      "msg.lowAlert": "ಕಡಿಮೆ ಸ್ಟಾಕ್: {name} ({n} ಉಳಿದಿದೆ)",
      "banner.low": "{n} ವಸ್ತುಗಳ ಸ್ಟಾಕ್ ಕಡಿಮೆ ಇದೆ",
      "msg.alertsBlocked": "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ನಲ್ಲಿ ಎಚ್ಚರಿಕೆ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.",
      "msg.alertsUnsupported": "ಈ ಬ್ರೌಸರ್ ಎಚ್ಚರಿಕೆ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ಕೆಂಪು ಬ್ಯಾನರ್ ತೋರಿಸುತ್ತದೆ.",
      "msg.restoreOk": "ಬ್ಯಾಕಪ್ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ",
      "msg.restoreBad": "ಇದು ಮಾನ್ಯ ಬ್ಯಾಕಪ್ ಫೈಲ್ ಅಲ್ಲ.",
      "msg.restoreConfirm": "ಇದು ಈಗಿನ ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ. ಮುಂದುವರಿಯಬೇಕೇ?",
      "msg.needName": "ದಯವಿಟ್ಟು ವಸ್ತುವಿನ ಹೆಸರು ನಮೂದಿಸಿ.",
      "msg.saveFail": "ಉಳಿಸಲು ಆಗಲಿಲ್ಲ. ಸ್ಟೋರೇಜ್ ತುಂಬಿರಬಹುದು."
    }
  };

  let lang = "en";
  try { lang = localStorage.getItem("lang") === "kn" ? "kn" : "en"; } catch (e) { /* ignore */ }

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }

  /* ---------- Small helpers ---------- */
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function num(v) { const n = Number(v); return isFinite(n) ? n : 0; }
  function money(n) { return "₹" + num(n).toLocaleString("en-IN"); }
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function fmtDate(s) {
    const p = String(s || "").split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : s || "";
  }

  let toastTimer;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3500);
  }

  /* ---------- Saved data (items, sales, bills) ---------- */
  let data = { items: [], sales: [], bills: [] };

  function loadData() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        data = { items: d.items || [], sales: d.sales || [], bills: d.bills || [] };
      }
    } catch (e) { /* start empty */ }
  }
  function saveData() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); return true; }
    catch (e) { toast(t("msg.saveFail")); return false; }
  }

  /* ---------- Bill photos (IndexedDB) ---------- */
  let dbPromise;
  function openDB() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open("shopManagerPhotos", 1);
        req.onupgradeneeded = () => req.result.createObjectStore("photos", { keyPath: "id" });
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }
  function idb(mode, work) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction("photos", mode);
      const req = work(tx.objectStore("photos"));
      tx.oncomplete = () => resolve(req ? req.result : undefined);
      tx.onerror = () => reject(tx.error);
    }));
  }
  const photoPut = (id, dataUrl) => idb("readwrite", (s) => s.put({ id, dataUrl }));
  const photoGet = (id) => idb("readonly", (s) => s.get(id)).then((r) => (r ? r.dataUrl : null));
  const photoDelete = (id) => idb("readwrite", (s) => s.delete(id));
  const photoAll = () => idb("readonly", (s) => s.getAll());
  const photoClear = () => idb("readwrite", (s) => s.clear());

  // Shrinks big phone photos so many bills fit in storage.
  function compressImage(file, maxSide, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image")); };
      img.src = url;
    });
  }

  /* ---------- Low-stock alerts ---------- */
  function lowItems() {
    return data.items.filter((i) => i.qty < LOW_LIMIT).sort((a, b) => a.qty - b.qty);
  }

  function showNotification(title, body) {
    try {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      const opts = { body: body, tag: "low-stock" };
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) reg.showNotification(title, opts);
          else new Notification(title, opts);
        }).catch(() => { try { new Notification(title, opts); } catch (e) { /* ignore */ } });
      } else {
        new Notification(title, opts);
      }
    } catch (e) { /* notifications are best-effort */ }
  }

  // Call after any change that lowers an item's quantity.
  function alertIfBecameLow(item, previousQty) {
    if (item.qty < LOW_LIMIT && previousQty >= LOW_LIMIT) {
      const msg = t("msg.lowAlert", { name: item.name, n: item.qty });
      toast(msg);
      showNotification(t("banner.low", { n: lowItems().length }), msg);
    }
  }

  function updateAlertBtn() {
    const on = "Notification" in window && Notification.permission === "granted";
    $("alertBtn").textContent = t(on ? "btn.alertsOn" : "btn.enableAlerts");
    $("alertBtn").classList.toggle("on", on);
  }

  /* ---------- Rendering ---------- */
  function renderBanner() {
    const low = lowItems();
    const b = $("lowBanner");
    b.hidden = low.length === 0;
    b.textContent = "⚠ " + t("banner.low", { n: low.length });
    document.title = (low.length ? "(" + low.length + ") " : "") + t("app.title");
  }

  function renderDashboard() {
    const today = todayStr();
    const month = today.slice(0, 7);
    let todayTotal = 0, monthTotal = 0;
    data.sales.forEach((s) => {
      const amt = s.qty * s.price;
      if (s.date === today) todayTotal += amt;
      if (String(s.date).slice(0, 7) === month) monthTotal += amt;
    });
    $("statToday").textContent = money(todayTotal);
    $("statMonth").textContent = money(monthTotal);
    $("statPieces").textContent = data.items.reduce((a, i) => a + i.qty, 0);
    const low = lowItems();
    $("statLow").textContent = low.length;
    $("lowList").innerHTML = low.length
      ? low.map((i) =>
          '<div class="row"><div class="row-main"><strong>' + esc(i.name) + '</strong>' +
          '<span class="muted">' + esc(i.category || "") + '</span></div>' +
          '<span class="badge ' + (i.qty === 0 ? "bad" : "warn") + '">' + i.qty + " " + t("stock.left") + "</span></div>"
        ).join("")
      : '<p class="empty">' + t("dash.none") + "</p>";
  }

  function renderStock() {
    const q = $("stockSearch").value.trim().toLowerCase();
    const list = data.items
      .filter((i) => !q || (i.name + " " + (i.category || "")).toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (!data.items.length) {
      $("stockList").innerHTML = '<p class="empty">' + t("stock.empty") + "</p>";
      return;
    }
    $("stockList").innerHTML = list.map((i) => {
      const cls = i.qty === 0 ? "out" : i.qty < LOW_LIMIT ? "low" : "";
      const badge = i.qty === 0 ? ["bad", t("stock.out")]
        : i.qty < LOW_LIMIT ? ["warn", i.qty + " " + t("stock.left") + " · " + t("stock.low")]
        : ["", i.qty + " " + t("stock.left")];
      return '<div class="item ' + cls + '">' +
        '<div class="item-head"><div class="row-main"><strong>' + esc(i.name) + "</strong>" +
        '<span class="muted">' + esc(i.category || "") + (i.category ? " · " : "") + money(i.price) + "</span></div>" +
        '<span class="badge ' + badge[0] + '">' + esc(badge[1]) + "</span></div>" +
        '<div class="row-actions">' +
        '<button class="link" data-action="add" data-id="' + i.id + '">' + t("btn.addStock") + "</button>" +
        '<button class="link" data-action="edit" data-id="' + i.id + '">' + t("btn.edit") + "</button>" +
        '<button class="link danger" data-action="del" data-id="' + i.id + '">' + t("btn.delete") + "</button>" +
        "</div></div>";
    }).join("");
  }

  function renderSaleSelect() {
    const sel = $("saleItem");
    const keep = sel.value;
    sel.innerHTML = '<option value="">' + t("sales.choose") + "</option>" +
      data.items.slice().sort((a, b) => a.name.localeCompare(b.name)).map((i) =>
        '<option value="' + i.id + '"' + (i.qty === 0 ? " disabled" : "") + ">" +
        esc(i.name) + " (" + i.qty + ")</option>"
      ).join("");
    if (keep && data.items.some((i) => i.id === keep && i.qty > 0)) sel.value = keep;
  }

  function renderSales() {
    const today = todayStr();
    let total = 0;
    data.sales.forEach((s) => { if (s.date === today) total += s.qty * s.price; });
    $("todayTotal").textContent = money(total);
    const sorted = data.sales.slice()
      .sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.ts - a.ts)
      .slice(0, 50);
    $("salesList").innerHTML = sorted.length
      ? sorted.map((s) =>
          '<div class="row"><div class="row-main"><strong>' + esc(s.name) + "</strong>" +
          '<span class="muted">' + s.qty + " × " + money(s.price) + " · " + fmtDate(s.date) + "</span></div>" +
          '<div class="row-side"><strong>' + money(s.qty * s.price) + "</strong>" +
          '<button class="link danger" data-action="del-sale" data-id="' + s.id + '">' + t("btn.delete") + "</button></div></div>"
        ).join("")
      : '<p class="empty">' + t("sales.empty") + "</p>";
  }

  function renderBills() {
    $("billList").innerHTML = data.bills.length
      ? data.bills.map((b) =>
          '<div class="bill"><img class="thumb" alt="" data-photo="' + b.id + '" />' +
          '<div class="row-main"><strong>' + esc(b.supplier || "—") + "</strong>" +
          '<span class="muted">' + fmtDate(b.date) + (b.amount ? " · " + money(b.amount) : "") + "</span>" +
          (b.note ? '<span class="muted">' + esc(b.note) + "</span>" : "") + "</div>" +
          '<button class="link danger" data-action="del-bill" data-id="' + b.id + '">' + t("btn.delete") + "</button></div>"
        ).join("")
      : '<p class="empty">' + t("bills.empty") + "</p>";
    document.querySelectorAll("#billList img[data-photo]").forEach((img) => {
      photoGet(img.getAttribute("data-photo")).then((url) => { if (url) img.src = url; }).catch(() => {});
    });
  }

  function renderAll() {
    renderBanner();
    renderDashboard();
    renderStock();
    renderSaleSelect();
    renderSales();
    renderBills();
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.body.classList.toggle("kn", lang === "kn");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    $("langBtn").textContent = lang === "en" ? "ಕನ್ನಡ" : "English";
    if ($("itemId").value) $("itemFormTitle").textContent = t("stock.edit");
    updateAlertBtn();
    renderAll();
  }

  /* ---------- Tabs ---------- */
  function showTab(name) {
    document.querySelectorAll(".tab").forEach((s) => s.classList.toggle("active", s.id === "tab-" + name));
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    window.scrollTo(0, 0);
  }
  document.querySelectorAll(".nav-btn").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));
  $("lowBanner").addEventListener("click", () => showTab("home"));

  /* ---------- Language & alert buttons ---------- */
  $("langBtn").addEventListener("click", () => {
    lang = lang === "en" ? "kn" : "en";
    try { localStorage.setItem("lang", lang); } catch (e) { /* ignore */ }
    applyLang();
  });

  $("alertBtn").addEventListener("click", () => {
    if (!("Notification" in window)) { toast(t("msg.alertsUnsupported")); return; }
    if (Notification.permission === "denied") { toast(t("msg.alertsBlocked")); return; }
    if (Notification.permission === "granted") { toast(t("btn.alertsOn")); return; }
    Notification.requestPermission().then(() => {
      updateAlertBtn();
      if (Notification.permission === "denied") toast(t("msg.alertsBlocked"));
    }).catch(() => {});
  });

  /* ---------- Stock ---------- */
  function resetItemForm() {
    $("itemForm").reset();
    $("itemId").value = "";
    $("itemQty").value = "0";
    $("itemFormTitle").textContent = t("stock.add");
    $("itemCancel").hidden = true;
  }

  $("itemForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("itemName").value.trim();
    if (!name) { toast(t("msg.needName")); return; }
    const fields = {
      name: name,
      category: $("itemCategory").value.trim(),
      cost: Math.max(0, num($("itemCost").value)),
      price: Math.max(0, num($("itemPrice").value)),
      qty: Math.max(0, Math.floor(num($("itemQty").value)))
    };
    const id = $("itemId").value;
    let item, prev = Infinity;
    if (id) {
      item = data.items.find((i) => i.id === id);
      if (item) { prev = item.qty; Object.assign(item, fields); }
    }
    if (!item) { item = Object.assign({ id: uid() }, fields); data.items.push(item); }
    if (saveData()) toast(t("msg.saved"));
    resetItemForm();
    renderAll();
    alertIfBecameLow(item, prev);
  });

  $("itemCancel").addEventListener("click", resetItemForm);
  $("stockSearch").addEventListener("input", renderStock);

  $("stockList").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const item = data.items.find((i) => i.id === btn.dataset.id);
    if (!item) return;
    const action = btn.dataset.action;

    if (action === "add") {
      const v = parseInt(prompt(t("stock.addHowMany", { name: item.name }), "1"), 10);
      if (v > 0) { item.qty += v; saveData(); renderAll(); }
    } else if (action === "edit") {
      $("itemId").value = item.id;
      $("itemName").value = item.name;
      $("itemCategory").value = item.category || "";
      $("itemCost").value = item.cost || "";
      $("itemPrice").value = item.price || "";
      $("itemQty").value = item.qty;
      $("itemFormTitle").textContent = t("stock.edit");
      $("itemCancel").hidden = false;
      window.scrollTo(0, 0);
    } else if (action === "del") {
      if (confirm(t("stock.confirmDelete", { name: item.name }))) {
        data.items = data.items.filter((i) => i.id !== item.id);
        saveData();
        renderAll();
      }
    }
  });

  /* ---------- Sales ---------- */
  $("saleItem").addEventListener("change", () => {
    const item = data.items.find((i) => i.id === $("saleItem").value);
    if (item) $("salePrice").value = item.price || "";
  });

  $("saleForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const item = data.items.find((i) => i.id === $("saleItem").value);
    if (!item) return;
    const qty = Math.floor(num($("saleQty").value));
    if (qty < 1) return;
    if (qty > item.qty) { toast(t("sales.notEnough", { n: item.qty })); return; }
    const prev = item.qty;
    item.qty -= qty;
    data.sales.push({
      id: uid(), ts: Date.now(), itemId: item.id, name: item.name,
      qty: qty, price: Math.max(0, num($("salePrice").value)), date: $("saleDate").value || todayStr()
    });
    if (saveData()) toast(t("msg.saved"));
    $("saleQty").value = "1";
    $("saleItem").value = "";
    $("salePrice").value = "";
    renderAll();
    alertIfBecameLow(item, prev);
  });

  $("salesList").addEventListener("click", (e) => {
    const btn = e.target.closest('button[data-action="del-sale"]');
    if (!btn) return;
    const sale = data.sales.find((s) => s.id === btn.dataset.id);
    if (!sale || !confirm(t("sales.confirmDelete"))) return;
    const item = data.items.find((i) => i.id === sale.itemId);
    if (item) item.qty += sale.qty;
    data.sales = data.sales.filter((s) => s.id !== sale.id);
    saveData();
    renderAll();
  });

  /* ---------- Wholesale bills ---------- */
  $("billPhoto").addEventListener("change", () => {
    const file = $("billPhoto").files[0];
    const prev = $("billPreview");
    if (file) { prev.src = URL.createObjectURL(file); prev.hidden = false; }
    else { prev.hidden = true; }
  });

  $("billForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const file = $("billPhoto").files[0];
    if (!file) { toast(t("bills.needPhoto")); return; }
    compressImage(file, 1400, 0.8).then((dataUrl) => {
      const id = uid();
      return photoPut(id, dataUrl).then(() => {
        data.bills.unshift({
          id: id,
          supplier: $("billSupplier").value.trim(),
          date: $("billDate").value || todayStr(),
          amount: Math.max(0, num($("billAmount").value)),
          note: $("billNote").value.trim()
        });
        if (saveData()) toast(t("msg.saved"));
        $("billForm").reset();
        $("billDate").value = todayStr();
        $("billPreview").hidden = true;
        renderBills();
      });
    }).catch(() => toast(t("msg.saveFail")));
  });

  $("billList").addEventListener("click", (e) => {
    const del = e.target.closest('button[data-action="del-bill"]');
    if (del) {
      if (!confirm(t("bills.confirmDelete"))) return;
      const id = del.dataset.id;
      data.bills = data.bills.filter((b) => b.id !== id);
      saveData();
      photoDelete(id).catch(() => {}).then(renderBills);
      return;
    }
    const img = e.target.closest("img.thumb");
    if (img && img.src) {
      const bill = data.bills.find((b) => b.id === img.getAttribute("data-photo"));
      $("viewerImg").src = img.src;
      $("viewerCaption").textContent = bill
        ? (bill.supplier || "") + " · " + fmtDate(bill.date) + (bill.amount ? " · " + money(bill.amount) : "")
        : "";
      $("viewer").hidden = false;
    }
  });
  $("viewerClose").addEventListener("click", () => { $("viewer").hidden = true; });

  /* ---------- Backup ---------- */
  $("exportBtn").addEventListener("click", () => {
    photoAll().catch(() => []).then((photos) => {
      const payload = {
        version: 1, exported: new Date().toISOString(),
        items: data.items, sales: data.sales, bills: data.bills, photos: photos || []
      };
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "shop-backup-" + todayStr() + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
  });

  $("importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let d;
      try { d = JSON.parse(reader.result); } catch (err) { toast(t("msg.restoreBad")); return; }
      if (!d || !Array.isArray(d.items) || !Array.isArray(d.sales) || !Array.isArray(d.bills)) {
        toast(t("msg.restoreBad"));
        return;
      }
      if (!confirm(t("msg.restoreConfirm"))) return;
      data = { items: d.items, sales: d.sales, bills: d.bills };
      saveData();
      photoClear().catch(() => {})
        .then(() => Promise.all((d.photos || []).map((p) => photoPut(p.id, p.dataUrl))))
        .catch(() => {})
        .then(() => { renderAll(); toast(t("msg.restoreOk")); });
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  /* ---------- Start ---------- */
  loadData();
  $("saleDate").value = todayStr();
  $("billDate").value = todayStr();
  applyLang();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => { /* needs https or localhost */ });
  }

  // One summary alert when the manager is opened and stock is low.
  const lowNow = lowItems();
  if (lowNow.length) {
    showNotification(t("banner.low", { n: lowNow.length }), lowNow.map((i) => i.name).join(", "));
  }
})();
