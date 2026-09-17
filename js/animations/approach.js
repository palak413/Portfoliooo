export function initApproach(reducedMotion) {
  const items = document.querySelectorAll("[data-approach-item]");
  if (!items.length) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (reducedMotion || !gsap || !ScrollTrigger) {
    items.forEach((i) => i.classList.add("is-active"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  items.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 65%",
      end: "bottom 40%",
      onEnter: () => item.classList.add("is-active"),
      onEnterBack: () => item.classList.add("is-active"),
      onLeave: () => item.classList.remove("is-active"),
      onLeaveBack: () => item.classList.remove("is-active")
    });
  });
}
