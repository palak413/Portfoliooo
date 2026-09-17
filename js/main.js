import { runEntrance, skipEntrance } from "./animations/entrance.js";
import { initReveals, initMaskReveal } from "./animations/reveals.js";
import { initMagnetic } from "./animations/magnetic.js";
import { initCursor } from "./animations/cursor.js";
import { initHeroParallax } from "./animations/heroParallax.js";
import { initProjectScroll } from "./animations/projectScroll.js";
import { initCountUp } from "./animations/stats.js";
import { initProof } from "./animations/proof.js";
import { initJourney } from "./animations/journey.js";
import { initApproach } from "./animations/approach.js";
import { initToolkit } from "./animations/toolkit.js";
import { initBackground } from "./background.js";
import { initNav, initScrollProgress } from "./nav.js";
import { initTerminalEasterEgg } from "./terminal.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof window.gsap !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

if (reducedMotion) document.documentElement.classList.add("reduced-motion");
if (!hasGsap) document.documentElement.classList.add("no-js");

// Explicit, visible diagnostics rather than silently assuming the CDN
// scripts loaded — this is the first thing to check in the console.
console.log(
  `[portfolio] GSAP: ${hasGsap ? "loaded" : "MISSING"} · ` +
  `ScrollTrigger: ${hasScrollTrigger ? "loaded" : "MISSING"} · ` +
  `reduced motion: ${reducedMotion}`
);
if (hasGsap && hasScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
} else if (hasGsap && !hasScrollTrigger) {
  console.warn("[portfolio] GSAP loaded but ScrollTrigger did not — pinned/scrubbed " +
    "sections (projects, journey) will fall back to their static layouts.");
}

// Run each feature in isolation — one broken module (or a blocked CDN)
// should never stop the rest of the page from working.
function safe(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[portfolio] "${name}" failed, skipping it:`, err);
  }
}

// Subtle radial glow behind the contact headline, expanding in once.
function initContactGlow(reduced) {
  const glow = document.getElementById("contact-glow") || document.querySelector(".contact-glow");
  if (!glow) return;
  const gsap = window.gsap;
  if (reduced || !gsap) { glow.style.opacity = "0.6"; return; }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(glow, { opacity: 0.6, scale: 1, duration: 1.4, ease: "power2.out" });
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(glow);
}

// Guarantee the entrance overlay can never permanently block the page,
// no matter what goes wrong inside GSAP (blocked CDN, thrown error,
// a tab that was backgrounded mid-animation, anything).
function forceRevealIfStuck() {
  const entrance = document.getElementById("entrance");
  if (!entrance || entrance.hasAttribute("hidden") || !document.body.contains(entrance)) return;
  console.warn("[portfolio] Entrance animation didn't finish in time — revealing the page anyway.");
  entrance.remove();
  document.body.classList.remove("no-scroll");
  safe("skipEntrance (watchdog)", skipEntrance);
  afterEntrance();
}

// Features that don't depend on the entrance sequence can start immediately.
safe("nav", initNav);
safe("scrollProgress", initScrollProgress);
safe("background", () => initBackground(reducedMotion));
safe("reveals", () => initReveals(reducedMotion));
safe("maskReveal", () => initMaskReveal(".contact-title, .typebreak-text", reducedMotion));
safe("contactGlow", () => initContactGlow(reducedMotion));
safe("countUp", () => initCountUp(reducedMotion));
safe("proof", () => initProof(reducedMotion));
safe("journey", () => initJourney(reducedMotion));
safe("approach", () => initApproach(reducedMotion));
safe("toolkit", initToolkit);
safe("projectScroll", () => initProjectScroll(reducedMotion));
safe("terminalEasterEgg", initTerminalEasterEgg);

function afterEntrance() {
  safe("magnetic", initMagnetic);
  safe("cursor", initCursor);
  safe("heroParallax", initHeroParallax);
}

if (reducedMotion || !hasGsap) {
  safe("skipEntrance", skipEntrance);
  afterEntrance();
} else {
  safe("runEntrance", () => runEntrance(afterEntrance));
  // Belt and suspenders: even if runEntrance's own timeline silently stalls
  // (rather than throwing), this makes sure the page is never stuck.
  window.setTimeout(forceRevealIfStuck, 2500);
}

// Web fonts swapping in after first paint can reflow the page (line wraps,
// heading heights), which desyncs any ScrollTrigger pin/scrub distance that
// was measured before the swap. Recalculate once fonts and images have
// settled so the horizontal project scroll and pinned journey stay accurate.
if (hasGsap && hasScrollTrigger) {
  const refresh = () => safe("ScrollTrigger.refresh", () => window.ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }
  window.addEventListener("load", refresh);
}
