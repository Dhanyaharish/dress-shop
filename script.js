// Language switching: English <-> Kannada
// The chosen language is remembered in the browser (localStorage).

const toggleBtn = document.getElementById("langToggle");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function getSavedLang() {
  try {
    return localStorage.getItem("lang") || "en";
  } catch (e) {
    return "en";
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem("lang", lang);
  } catch (e) { /* ignore */ }
}

function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.documentElement.lang = lang;          // helps screen readers & SEO
  document.body.classList.toggle("kn", lang === "kn"); // switches font in CSS
  toggleBtn.textContent = lang === "en" ? "ಕನ್ನಡ" : "English";
  saveLang(lang);
}

toggleBtn.addEventListener("click", () => {
  const next = document.documentElement.lang === "en" ? "kn" : "en";
  setLanguage(next);
});

// Mobile menu
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => nav.classList.remove("open"))
);

// On page load
setLanguage(getSavedLang());
