// LGPD consent + analytics gating.
// - Mostra banner se o usuário ainda não decidiu.
// - Carrega GA4 e Microsoft Clarity APENAS após aceite.
// - Persiste decisão em localStorage por 180 dias.
(function () {
  if (typeof window === "undefined") return;
  const STORAGE_KEY = "fr_consent_v1";
  const TTL_MS = 180 * 24 * 60 * 60 * 1000;
  const banner = document.querySelector("[data-cookie-banner]");
  const acceptBtn = document.querySelector("[data-cookie-accept]");
  const essentialBtn = document.querySelector("[data-cookie-essential]");

  const claritySource = document.querySelector('meta[name="x-clarity-id"]');
  const gaSource = document.querySelector('meta[name="x-ga-id"]');
  const clarityId = claritySource ? claritySource.getAttribute("content") : "";
  const gaId = gaSource ? gaSource.getAttribute("content") : "";

  function readStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.timestamp || Date.now() - parsed.timestamp > TTL_MS) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function persist(decision) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ decision, timestamp: Date.now() }),
      );
    } catch {
      /* private mode / quota */
    }
  }

  function loadAnalytics() {
    if (gaId) loadGa(gaId);
    if (clarityId) loadClarity(clarityId);
  }

  function loadGa(id) {
    if (document.getElementById("ga4-script")) return;
    const s = document.createElement("script");
    s.id = "ga4-script";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id, { anonymize_ip: true, allow_google_signals: false });
  }

  function loadClarity(id) {
    if (document.getElementById("clarity-script")) return;
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.id = "clarity-script";
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", id);
  }

  function show() {
    if (!banner) return;
    banner.hidden = false;
  }

  function hide() {
    if (!banner) return;
    banner.hidden = true;
  }

  const stored = readStored();
  if (stored?.decision === "all") {
    loadAnalytics();
  } else if (!stored) {
    show();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      persist("all");
      hide();
      loadAnalytics();
    });
  }
  if (essentialBtn) {
    essentialBtn.addEventListener("click", () => {
      persist("essential");
      hide();
    });
  }
})();
