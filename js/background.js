export function initBackground(reducedMotion) {
  const canvas = document.getElementById("grid-canvas");
  if (!canvas || reducedMotion || window.innerWidth <= 720) {
    if (canvas) canvas.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  let width, height, dpr;
  let points = [];
  const spacing = 44;
  const mouse = { x: -9999, y: -9999 };
  let raf = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    points = [];
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        points.push({ x: c * spacing, y: r * spacing, baseX: c * spacing, baseY: r * spacing });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const radius = 170;
    const near = [];

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const dx = mouse.x - p.baseX;
      const dy = mouse.y - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let size = 1;
      let alpha = 0.12;

      if (dist < radius) {
        const t = 1 - dist / radius;
        size = 1 + t * 2.2;
        alpha = 0.12 + t * 0.55;
        p.x = p.baseX - dx * t * 0.08;
        p.y = p.baseY - dy * t * 0.08;
        if (dist < radius * 0.7) near.push(p);
      } else {
        p.x += (p.baseX - p.x) * 0.12;
        p.y += (p.baseY - p.y) * 0.12;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(155, 135, 245, ${alpha})`;
      ctx.fill();
    }

    // Subtle connecting lines only between points near the cursor — cheap,
    // since `near` is a tiny subset of the full grid.
    if (near.length > 1) {
      ctx.strokeStyle = "rgba(155, 135, 245, 0.14)";
      ctx.lineWidth = 1;
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const a = near[i], b = near[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < spacing * 1.6) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });

  resize();
  raf = requestAnimationFrame(draw);
}
