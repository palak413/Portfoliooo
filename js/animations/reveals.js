// Reusable scroll-reveal utilities. Works with or without GSAP: without it,
// reveals still happen via CSS transitions on the .is-visible class.

export function initReveals(reducedMotion) {
  // Stagger children inside a group by setting transition-delay per index.
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const items = group.querySelectorAll("[data-reveal]");
    items.forEach((item, i) => {
      item.style.transitionDelay = reducedMotion ? "0ms" : `${Math.min(i * 70, 420)}ms`;
    });
  });

  const items = document.querySelectorAll("[data-reveal]");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => io.observe(el));
}

// Generic clip/mask line reveal — used for the contact headline and the
// type-break section. Each element matching `groupSelector` is treated as
// its own group: its .reveal-line-inner children rise into view together
// once that group scrolls into the viewport.
export function initMaskReveal(groupSelector, reducedMotion) {
  const groups = document.querySelectorAll(groupSelector);
  if (!groups.length) return;

  const gsap = window.gsap;

  groups.forEach((group) => {
    const lines = group.querySelectorAll(".reveal-line-inner");
    if (!lines.length) return;

    if (reducedMotion || !gsap) {
      lines.forEach((l) => { l.style.transform = "none"; });
      return;
    }

    gsap.set(lines, { yPercent: 100 });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(lines, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.1 });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    io.observe(group);
  });
}
