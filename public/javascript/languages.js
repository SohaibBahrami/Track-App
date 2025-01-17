const i18next = window.i18next;
const Backend = window.i18nextHttpBackend;

const html = document.querySelector("html");
const main = document.querySelector("main");
const footer = document.querySelector("footer p");

i18next.debug = true;

// Function to get language from cookies
function getLanguageFromCookies() {
  const match = document.cookie.match(/lang=([^;]+)/);
  return match ? match[1] : null;
}

const defaultLang = getLanguageFromCookies() || "en"; // default to 'en' if no cookie
document.getElementById("langSelector").value = defaultLang; // Set the dropdown value

i18next.use(Backend).init(
  {
    lng: defaultLang, // use language from cookies
    fallbackLng: "en", // fallback language
    backend: {
      loadPath: "/languages/{{lng}}.json",
    },
  },
  (err, t) => {
    if (err) return console.error(err);
    updateContent();
    setLanguage(defaultLang); // Set language after initialization
  }
);

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = i18next.t(key);
  });
}

function setLanguage(lang) {
  document.cookie = `lang=${lang}; path=/`; // Set cookie for language
  i18next.changeLanguage(lang, (err, t) => {
    if (err) return console.error(err);
    updateContent();
    if (lang == "fa") {
      main.setAttribute("dir", "rtl");
      footer.style.textAlign = "right";
    } else {
      main.setAttribute("dir", "ltr");
      footer.style.textAlign = "left";
    }
    html.setAttribute("lang", lang);
  });
}

document.getElementById("langSelector").addEventListener("change", (event) => {
  const lang = event.target.value;
  setLanguage(lang);
});
