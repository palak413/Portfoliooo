export function initTerminalEasterEgg() {
  const trigger = document.getElementById("terminalTrigger");
  const overlay = document.getElementById("terminalOverlay");
  const closeBtn = document.getElementById("terminalClose");
  const log = document.getElementById("terminalLog");
  const input = document.getElementById("terminalInput");
  if (!trigger || !overlay || !input) return;

  const commands = {
    help: () =>
      "Commands: about · projects · skills · achievements · journey · contact · github · resume · clear",
    about: () => navigateTo("#about", "Jumping to About."),
    projects: () => navigateTo("#work", "Opening Work."),
    skills: () => navigateTo("#toolkit", "Opening Toolkit."),
    achievements: () => navigateTo("#proof", "Opening Proof of Work."),
    proof: () => navigateTo("#proof", "Opening Proof of Work."),
    journey: () => navigateTo("#journey", "Opening Journey."),
    contact: () => navigateTo("#contact", "Opening Contact."),
    github: () => { window.open("https://github.com/palak413", "_blank", "noopener"); return "Opening GitHub in a new tab."; },
    resume: () => { window.open("resume.pdf", "_blank", "noopener"); return "Opening resume."; },
    clear: () => { log.innerHTML = ""; return null; },
    exit: () => { closeTerminal(); return null; }
  };

  function navigateTo(hash, message) {
    closeTerminal();
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: "smooth" });
    return message;
  }

  function printLine(text, cls) {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function openTerminal() {
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    trigger.setAttribute("aria-expanded", "true");
    window.setTimeout(() => input.focus(), 30);
  }

  function closeTerminal() {
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }

  trigger.addEventListener("click", openTerminal);
  closeBtn.addEventListener("click", closeTerminal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeTerminal(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeTerminal();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value.trim();
    if (!raw) return;
    printLine(`palak@dev ~ ${raw}`, "cmd");
    input.value = "";

    const handler = commands[raw.toLowerCase()];
    if (!handler) {
      printLine(`command not found: ${raw} — try "help"`, "out");
      return;
    }
    const result = handler();
    if (result) printLine(result, "out");
  });
}
