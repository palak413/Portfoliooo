// Journey: keep the section in normal document flow. ScrollTrigger only
// drives the active state and rail progress; it does not pin the content.
// This avoids the large empty gap and prevents the Journey from competing
// with the preceding horizontal project pin.
export function initJourney(reducedMotion) {
  const section = document.querySelector(".journey-pin");
  const items = Array.from(document.querySelectorAll("[data-journey-item]"));
  const fill = document.getElementById("journeyFill");
  if (!section || !items.length) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const titles = items.map((item) => item.querySelector(".journey-title"));
  const indices = items.map((item) => item.querySelector(".journey-index"));

  const ACCENT = "#b8a5ff";
  const TITLE_DEFAULT = "#f2f1ee";
  const INDEX_DEFAULT = "#616167";
  const INACTIVE_OPACITY = 0.42;

  // No-JS / reduced-motion fallback: everything is readable.
  if (reducedMotion || !gsap || !ScrollTrigger) {
    if (fill) fill.style.height = "100%";
    items.forEach((item) => { item.style.opacity = "1"; item.style.transform = "none"; });
    titles.forEach((el) => { if (el) el.style.color = TITLE_DEFAULT; });
    indices.forEach((el) => { if (el) el.style.color = INDEX_DEFAULT; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // On desktop, use a normal-flow list. The active item is determined by
  // which item is nearest the viewport's visual center. No hover panel and
  // no pinned inner element.
  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
    gsap.set(items, { opacity: INACTIVE_OPACITY, scale: 0.985 });

    let currentIndex = -1;
    function setActive(idx) {
      idx = Math.max(0, Math.min(items.length - 1, idx));
      if (idx === currentIndex) return;

      items.forEach((item, i) => {
        const active = i === idx;
        gsap.to(item, {
          opacity: active ? 1 : INACTIVE_OPACITY,
          scale: active ? 1 : 0.985,
          duration: 0.28,
          ease: "power2.out",
          overwrite: true
        });
        if (titles[i]) gsap.to(titles[i], { color: active ? ACCENT : TITLE_DEFAULT, duration: 0.24, overwrite: true });
        if (indices[i]) gsap.to(indices[i], { color: active ? ACCENT : INDEX_DEFAULT, duration: 0.24, overwrite: true });
      });
      currentIndex = idx;
    }

    const itemTriggers = items.map((item, i) => ScrollTrigger.create({
      trigger: item,
      start: "top 62%",
      end: "bottom 38%",
      onEnter: () => setActive(i),
      onEnterBack: () => setActive(i)
    }));

    const progressTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 30%",
      onUpdate: (self) => {
        if (fill) fill.style.height = `${self.progress * 100}%`;
      },
      onLeaveBack: () => { if (fill) fill.style.height = "0%"; },
      onLeave: () => { if (fill) fill.style.height = "100%"; }
    });

    setActive(0);

    return () => {
      itemTriggers.forEach((st) => st.kill());
      progressTrigger.kill();
      gsap.set(items, { clearProps: "opacity,transform" });
      gsap.set(titles.filter(Boolean), { clearProps: "color" });
      gsap.set(indices.filter(Boolean), { clearProps: "color" });
    };
  });

  mm.add("(max-width: 899px)", () => {
    if (fill) fill.style.height = "100%";
    items.forEach((item) => { item.style.opacity = "1"; item.style.transform = "none"; });
    return () => {};
  });
}
