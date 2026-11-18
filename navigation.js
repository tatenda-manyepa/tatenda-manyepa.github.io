const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep scroll offset in line with the sticky header
const header = document.querySelector('header');
function setHeaderHeight() {
  if (header) document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
}
window.addEventListener('resize', setHeaderHeight);
setHeaderHeight();

// Fade sections in as they scroll into view
const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => io.observe(el));
}

// Count numbers up when they appear
const counters = document.querySelectorAll('[data-count]');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const step = now => {
        const p = Math.min(1, (now - start) / 900);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => co.observe(el));
}

// Hero console: types out a PickPath investigation
const consoleBody = document.getElementById('console');
if (consoleBody) {
  const lines = [
    ['c-amber', '$ incident "PS3 idle 12 min"'],
    ['c-dim', '› searching telemetry, logs, tickets…'],
    ['', '› C2 charger fault at 14:02 (CHG-214)'],
    ['', '› 5 robots queued, battery < 15%'],
    ['', '› matches past ticket INC-0142'],
    ['c-teal', '✓ likely cause: charger C2 failure'],
    ['c-amber', '⏸ awaiting engineer approval']
  ];
  const render = (count, partial) => {
    consoleBody.innerHTML = '';
    lines.slice(0, count).forEach(([cls, text], i) => {
      const p = document.createElement('p');
      p.className = cls;
      p.textContent = (i === count - 1 && partial !== undefined) ? text.slice(0, partial) : text;
      if (i === count - 1 && partial !== undefined) p.classList.add('caret');
      consoleBody.append(p);
    });
  };
  if (reduceMotion) {
    render(lines.length);
  } else {
    let line = 0, ch = 0;
    const tick = () => {
      if (line >= lines.length) { setTimeout(() => { line = 0; ch = 0; tick(); }, 6000); return; }
      ch += 1;
      render(line + 1, ch);
      if (ch >= lines[line][1].length) { line += 1; ch = 0; setTimeout(tick, 380); }
      else setTimeout(tick, 26);
    };
    tick();
  }
}

// Architecture diagram: show what each component does
const arch = document.querySelector('.arch');
if (arch) {
  const info = arch.querySelector('.arch-info');
  arch.querySelectorAll('.node').forEach(node => {
    node.addEventListener('click', () => {
      arch.querySelectorAll('.node').forEach(n => n.setAttribute('aria-pressed', 'false'));
      node.setAttribute('aria-pressed', 'true');
      info.textContent = node.dataset.info;
    });
  });
}
