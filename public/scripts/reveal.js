// Reveal-on-scroll. Adiciona `is-revealed` quando o elemento entra na viewport.
// Usado por [data-reveal] em Section.astro, Hero.astro, etc.
(function () {
  if (typeof window === "undefined") return;
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
})();
