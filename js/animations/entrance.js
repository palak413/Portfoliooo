// Short, non-blocking entrance sequence (~1.6s). Only runs when GSAP loaded
// and the user has not requested reduced motion — callers handle the fallback.
export function runEntrance(onComplete) {
  const gsap = window.gsap;
  const entrance = document.getElementById("entrance");
  const pk = document.getElementById("entrancePk");
  const full = document.getElementById("entranceFull");
  const navWrap = document.getElementById("navWrap");
  const kicker = document.querySelector('[data-entrance="kicker"]');
  const lines = gsap.utils.toArray('[data-entrance="line"]');
  const role = document.querySelector('[data-entrance="role"]');
  const sub = document.querySelector('[data-entrance="sub"]');
  const cta = document.querySelector('[data-entrance="cta"]');
  const visual = document.querySelector('[data-entrance="visual"]');
  const scrollHint = document.querySelector('[data-entrance="scroll"]');
  const labels = gsap.utils.toArray('[data-entrance="label"]');
  const tlines = gsap.utils.toArray("[data-tline]");

  if (!entrance || !pk || !full || !navWrap) {
    skipEntrance();
    if (onComplete) onComplete();
    return null;
  }

  document.body.classList.add("no-scroll");

  gsap.set(navWrap, { opacity: 0, y: -12 });
  gsap.set([kicker, role, sub, cta, visual, scrollHint], { opacity: 0, y: 16 });
  gsap.set(lines, { yPercent: 100 });
  gsap.set(labels, { opacity: 0, scale: 0.8 });
  gsap.set(tlines, { opacity: 0 });
  gsap.set(full, { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      entrance.setAttribute("hidden", "");
      document.body.classList.remove("no-scroll");
      if (onComplete) onComplete();
    }
  });

  tl.to(pk, { opacity: 1, duration: 0.3 })
    .to(pk, { opacity: 0, duration: 0.25 }, "+=0.2")
    .to(full, { opacity: 1, duration: 0.35 }, "<")
    .to(full, { opacity: 0, duration: 0.25 }, "+=0.15")
    .to(entrance, { opacity: 0, duration: 0.35 }, "-=0.05")
    .add(() => { entrance.style.pointerEvents = "none"; })
    .to(navWrap, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
    .to(kicker, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
    .to(lines, { yPercent: 0, duration: 0.75, stagger: 0.09 }, "-=0.2")
    .to(role, { opacity: 1, y: 0, duration: 0.4 }, "-=0.4")
    .to(sub, { opacity: 1, y: 0, duration: 0.45 }, "-=0.3")
    .to(cta, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
    .to(labels, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06 }, "-=0.35")
    .to(visual, { opacity: 1, y: 0, duration: 0.55 }, "-=0.35")
    .to(scrollHint, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
    .to(tlines, { opacity: 1, duration: 0.3, stagger: 0.06 }, "-=0.3");

  return tl;
}

// Fallback for no-GSAP / reduced-motion: just make everything visible.
export function skipEntrance() {
  const entrance = document.getElementById("entrance");
  if (entrance) entrance.remove();
  document.querySelectorAll(
    ".reveal-line-inner, [data-tline], [data-entrance]"
  ).forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}
