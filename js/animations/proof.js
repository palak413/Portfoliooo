export function initProof(reducedMotion) {
  const items = document.querySelectorAll("[data-proof-anim]");
  if (!items.length) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (reducedMotion || !gsap) {
    items.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    return;
  }

  const from = {
    x: { opacity: 0, x: -32 },
    y: { opacity: 0, y: 32 },
    scale: { opacity: 0, scale: 0.9 }
  };

  items.forEach((el) => {
    const kind = el.getAttribute("data-proof-anim");
    const start = from[kind] || from.y;
    gsap.set(el, start);

    const animate = () => {
      gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, ease: "power3.out" });
    };

    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: animate
      });
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(el);
    }
  });
}
