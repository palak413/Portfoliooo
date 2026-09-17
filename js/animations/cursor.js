export function initCursor() {
  const cursor = document.getElementById("cursor");
  const label = document.getElementById("cursorLabel");
  if (!cursor || !label) return;

  const isFine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFine || reduced) return;

  document.body.classList.add("custom-cursor-active");

  const gsap = window.gsap;
  let quickX, quickY;
  if (gsap) {
    quickX = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    quickY = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      if (quickX) {
        quickX(e.clientX);
        quickY(e.clientY);
      } else {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    },
    { passive: true }
  );

  const labels = { view: "VIEW ↗", open: "OPEN ↗" };

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const type = el.getAttribute("data-cursor");
      if (type === "grow") {
        cursor.classList.add("is-growing");
        return;
      }
      label.textContent = labels[type] || "";
      cursor.classList.add("is-active");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-active");
      cursor.classList.remove("is-growing");
    });
  });

  document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
}
