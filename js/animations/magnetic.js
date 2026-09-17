export function initMagnetic() {
  const gsap = window.gsap;
  if (!gsap) return;

  const isFine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFine || reduced) return;

  const strength = 10;

  document.querySelectorAll(".magnetic").forEach((btn) => {
    const quickX = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
    const quickY = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      quickX(gsap.utils.clamp(-strength, strength, relX * 0.35));
      quickY(gsap.utils.clamp(-strength, strength, relY * 0.35));
    });

    btn.addEventListener("mouseleave", () => {
      quickX(0);
      quickY(0);
    });
  });
}
