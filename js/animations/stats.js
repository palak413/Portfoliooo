export function initCountUp(reducedMotion) {
  const gsap = window.gsap;
  const els = document.querySelectorAll("[data-count-to]");
  if (!els.length) return;

  els.forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count-to"));
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";

    if (reducedMotion || !gsap) {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const state = { val: 0 };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(state, {
              val: target,
              duration: 1.3,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${prefix}${Math.round(state.val)}${suffix}`;
              }
            });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
  });
}
