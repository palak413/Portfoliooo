export function initToolkit() {
  const words = document.querySelectorAll("[data-tk-word]");
  const detail = document.getElementById("skillDetail");
  if (!words.length) return;

  const gsap = window.gsap;
  const defaultText = detail ? detail.textContent : "";

  function setActive(target) {
    words.forEach((w) => {
      const isTarget = w === target;
      const opacity = target ? (isTarget ? 1 : 0.28) : 1;
      const scale = target && isTarget ? 1.1 : 1;

      if (gsap) {
        gsap.to(w, { opacity, scale, duration: 0.35, ease: "power3.out" });
      } else {
        w.style.opacity = String(opacity);
        w.style.transform = scale !== 1 ? `scale(${scale})` : "none";
      }
    });

    if (detail) {
      if (target) {
        detail.textContent = `${target.textContent} — ${target.getAttribute("data-desc")}`;
        detail.classList.add("is-active");
      } else {
        detail.textContent = defaultText;
        detail.classList.remove("is-active");
      }
    }
  }

  words.forEach((w) => {
    w.addEventListener("mouseenter", () => setActive(w));
    w.addEventListener("focus", () => setActive(w));
    w.addEventListener("mouseleave", () => setActive(null));
    w.addEventListener("blur", () => setActive(null));
  });
}
