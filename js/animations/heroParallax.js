export function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const glow = document.getElementById("heroGlow");
  const labels = document.querySelectorAll(".hero-label");
  const visual = document.querySelector(".hero-visual");
  if (!hero) return;

  const isFine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFine || reduced) return;

  const gsap = window.gsap;

  const movers = [];
  if (glow) movers.push({ el: glow, depth: 0.4, quick: null });
  labels.forEach((el) => {
    movers.push({ el, depth: parseFloat(el.getAttribute("data-depth")) || 0.8, quick: null });
  });
  if (visual) movers.push({ el: visual, depth: 1.3, quick: null, baseline: true });

  if (gsap) {
    movers.forEach((m) => {
      m.quickX = gsap.quickTo(m.el, "x", { duration: 0.6, ease: "power3.out" });
      m.quickY = gsap.quickTo(m.el, "y", { duration: 0.6, ease: "power3.out" });
    });
  }

  hero.addEventListener(
    "mousemove",
    (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      movers.forEach((m) => {
        const rangeX = 24 * m.depth;
        const rangeY = 16 * m.depth;
        const targetX = relX * rangeX;
        const targetY = relY * rangeY;
        if (m.quickX) {
          m.quickX(targetX);
          m.quickY(targetY);
        } else {
          m.el.style.transform = `translate(${targetX}px, ${targetY}px)`;
        }
      });
    },
    { passive: true }
  );

  hero.addEventListener("mouseleave", () => {
    movers.forEach((m) => {
      if (m.quickX) {
        m.quickX(0);
        m.quickY(0);
      }
    });
  });
}
