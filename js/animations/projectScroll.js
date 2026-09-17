export function initProjectScroll(reducedMotion) {
  const section = document.querySelector(".work-pin");
  const wrap = document.querySelector(".work-track-wrap");
  const track = document.getElementById("workTrack");
  if (!section || !wrap || !track) return;

  const gsap = window.gsap;
  const slides = Array.from(track.querySelectorAll(".work-slide"));

  // Projects are intentionally a normal responsive card grid now.
  // There is no horizontal ScrollTrigger/pinning, so every project and
  // every GitHub button stays reachable without scrolling sideways.
  wrap.style.overflow = "visible";
  track.style.transform = "none";

  slides.forEach((slide) => {
    slide.style.transform = "none";
    slide.style.opacity = "1";
  });

  if (reducedMotion || !gsap) return;

  const reveal = (slide, index) => {
    gsap.fromTo(
      slide,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: index * 0.08,
        ease: "power2.out",
        overwrite: true
      }
    );
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = slides.indexOf(entry.target);
        reveal(entry.target, Math.max(0, index));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    slides.forEach((slide) => io.observe(slide));
  } else {
    slides.forEach(reveal);
  }
}
