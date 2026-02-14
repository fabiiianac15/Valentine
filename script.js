// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);
});

// ===== SISTEMA DE NAVEGACIÓN ENTRE PÁGINAS =====
let currentPage = 1;
const totalPages = 4;

function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;

  const pages = document.querySelectorAll('.page');
  const dots = document.querySelectorAll('.dot');

  const oldPage = pages[currentPage - 1];
  const newPage = pages[pageNumber - 1];

  // Exit animation for old page
  oldPage.classList.remove('active');
  oldPage.classList.add('exit-up');

  // Remove exit class after transition
  setTimeout(() => {
    oldPage.classList.remove('exit-up');
  }, 700);

  // Remove active from all dots
  dots.forEach(d => d.classList.remove('active'));

  // Enter animation for new page
  setTimeout(() => {
    newPage.classList.add('active');
    dots[pageNumber - 1].classList.add('active');
  }, 80);

  currentPage = pageNumber;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger reveal animations on the new page
  setTimeout(() => {
    triggerReveals(newPage);
  }, 300);

  // Heart explosion on page 4
  if (pageNumber === 4) {
    setTimeout(createHeartExplosion, 600);
  }
}

// ===== ANIMACIÓN DEL SOBRE (PÁGINA 1) =====
const envelopeMain = document.getElementById('envelope-main');
const letterReveal = document.getElementById('letter-reveal');

if (envelopeMain) {
  envelopeMain.addEventListener('click', function () {
    if (!this.classList.contains('opened')) {
      this.classList.add('opened');
      setTimeout(() => {
        letterReveal.classList.add('visible');
      }, 650);
    }
  });
}



// ===== ANIMACIÓN DEL DISPENSADOR DE RECIBO (PÁGINA 3) =====
let receiptStarted = false;

function startReceiptAnimation() {
  if (receiptStarted) return;

  const receiptPaper = document.getElementById('receipt-roll');
  const startBtn = document.getElementById('start-receipt');

  if (receiptPaper && startBtn) {
    receiptStarted = true;
    receiptPaper.classList.add('printing');
    startBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      <span>Imprimiendo...</span>
    `;
    startBtn.disabled = true;

    setTimeout(() => {
      startBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        <span>Completado</span>
      `;
    }, 3500);
  }
}

// ===== CANVAS DE PARTÍCULAS – CORAZONES VECTORIALES =====
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawHeart(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // Left curve
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  // Left bottom
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
  // Right bottom
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  // Right curve
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

class HeartParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 30;
    this.size = Math.random() * 14 + 8;
    this.speedY = Math.random() * 1.2 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.35 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.color = this.getRandomColor();
    this.oscillationAmp = Math.random() * 1.5 + 0.5;
    this.oscillationSpeed = Math.random() * 0.015 + 0.008;
    this.phase = Math.random() * Math.PI * 2;
  }

  getRandomColor() {
    const colors = [
      '#ffffff', '#fff5f8', '#fff0f5', '#fffafa',
      '#fef1f6', '#fdf2f8', '#ffe8f0', '#ffe0ec'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.y * this.oscillationSpeed + this.phase) * this.oscillationAmp;
    this.rotation += this.rotationSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    drawHeart(ctx, 0, -this.size / 2, this.size, this.color, this.opacity);
    ctx.restore();
  }
}

const particles = [];
const particleCount = 18;

for (let i = 0; i < particleCount; i++) {
  const p = new HeartParticle();
  p.y = Math.random() * canvas.height;
  particles.push(p);
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// ===== COUNTDOWN TO VALENTINE'S DAY =====
function updateCountdown() {
  const now = new Date();
  let valentine = new Date(now.getFullYear(), 1, 14); // Feb 14

  // If Valentine's Day has passed this year, use next year
  if (now > valentine) {
    valentine = new Date(now.getFullYear() + 1, 1, 14);
  }

  const diff = valentine - now;

  const section = document.getElementById('countdown-section');

  if (diff <= 0) {
    // It's Valentine's Day!
    if (section) {
      section.classList.add('arrived');
      const label = section.querySelector('.countdown-label');
      if (label) label.textContent = '¡Feliz Día de San Valentín! 🤍';
      const countdown = document.getElementById('countdown');
      if (countdown) countdown.style.display = 'none';
    }
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
  if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== REVEAL ANIMATIONS (Intersection Observer) =====
function triggerReveals(container) {
  const elements = container.querySelectorAll('.reveal-text, .heart-photo-frame, .thought-item, .message-card, .future-valentines');
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 150);
  });
}

// Set up observer for scroll-based reveals
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal-text, .heart-photo-frame, .thought-item, .message-card, .future-valentines').forEach((el) => {
  revealObserver.observe(el);
});

// ===== HEART EXPLOSION EFFECT =====
function createHeartExplosion() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
  document.body.appendChild(container);

  const hearts = ['🤍', '🤍', '🤍', '🤍', '🤍', '🤍', '🤍', '✨'];

  for (let i = 0; i < 40; i++) {
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.cssText = `
      position:fixed;left:50%;top:50%;
      font-size:${Math.random() * 28 + 16}px;
      transform:translate(-50%,-50%);
      transition:all ${1.5 + Math.random() * 1}s cubic-bezier(0.22,1,0.36,1);
      opacity:1;z-index:9999;
    `;
    container.appendChild(heart);

    requestAnimationFrame(() => {
      const angle = (Math.PI * 2 * i) / 40;
      const distance = Math.random() * 350 + 150;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${Math.random() * 540 - 270}deg) scale(${Math.random() * 0.5 + 0.5})`;
      heart.style.opacity = '0';
    });
  }

  setTimeout(() => container.remove(), 3000);
}

// ===== VALENTINE'S DAY CLICK EFFECT =====
const valentineDay = document.getElementById('valentine-day');
if (valentineDay) {
  valentineDay.addEventListener('click', function () {
    createMiniHeartExplosion(this);
  });
}

function createMiniHeartExplosion(element) {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 10; i++) {
    const heart = document.createElement('div');
    heart.textContent = ['🤍', '🤍', '✨'][Math.floor(Math.random() * 3)];
    heart.style.cssText = `
      position:fixed;left:${cx}px;top:${cy}px;
      font-size:${Math.random() * 14 + 14}px;
      pointer-events:none;z-index:9999;
      transition:all 0.9s cubic-bezier(0.22,1,0.36,1);
    `;
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      const angle = (Math.PI * 2 * i) / 10;
      const dist = 60 + Math.random() * 60;
      heart.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.4)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 1000);
  }
}

// ===== NAVEGACIÓN CON TECLADO =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && currentPage < totalPages) {
    goToPage(currentPage + 1);
  } else if (e.key === 'ArrowLeft' && currentPage > 1) {
    goToPage(currentPage - 1);
  }
});

// ===== NAVEGACIÓN TÁCTIL (SWIPE) =====
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 60) {
    if (diff > 0 && currentPage < totalPages) goToPage(currentPage + 1);
    else if (diff < 0 && currentPage > 1) goToPage(currentPage - 1);
  }
}, { passive: true });

// ===== EFECTOS DE HOVER EN EDITABLES =====
document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
  el.addEventListener('focus', function () {
    this.style.transition = 'transform 0.3s ease';
    this.style.transform = 'scale(1.01)';
  });
  el.addEventListener('blur', function () {
    this.style.transform = 'scale(1)';
  });
});

// ===== CLICK SPARKLE EFFECT =====
document.addEventListener('click', (e) => {
  // Don't sparkle on buttons or interactive elements
  if (e.target.closest('button, [contenteditable], input, label, .dot')) return;
  createClickSparkle(e.clientX, e.clientY);
});

function createClickSparkle(x, y) {
  const sparkles = ['✨', '🤍', '🤍', '🤍'];
  const count = 3;

  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    s.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      pointer-events:none;z-index:9999;
      font-size:${14 + Math.random() * 10}px;
      transition:all 0.7s cubic-bezier(0.22,1,0.36,1);
    `;
    document.body.appendChild(s);

    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 40;
      s.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 30}px) scale(0.3)`;
      s.style.opacity = '0';
    });

    setTimeout(() => s.remove(), 800);
  }
}

// ===== MUSIC TOGGLE =====
const musicToggle = document.getElementById('music-toggle');
let audioCtx = null;
let isPlaying = false;

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isPlaying) {
      isPlaying = false;
      musicToggle.classList.remove('playing');
      if (audioCtx.state === 'running') {
        audioCtx.suspend();
      }
    } else {
      isPlaying = true;
      musicToggle.classList.add('playing');
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playRomanticMelody();
    }
  });
}

function playRomanticMelody() {
  if (!audioCtx || !isPlaying) return;

  // Simple romantic bell-like melody
  const notes = [
    { freq: 523.25, time: 0 },     // C5
    { freq: 659.25, time: 0.5 },   // E5
    { freq: 783.99, time: 1.0 },   // G5
    { freq: 880.00, time: 1.5 },   // A5
    { freq: 783.99, time: 2.0 },   // G5
    { freq: 659.25, time: 2.5 },   // E5
    { freq: 698.46, time: 3.0 },   // F5
    { freq: 587.33, time: 3.5 },   // D5
    { freq: 523.25, time: 4.0 },   // C5
  ];

  const now = audioCtx.currentTime;

  notes.forEach(({ freq, time }) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0, now + time);
    gain.gain.linearRampToValueAtTime(0.08, now + time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.45);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + time);
    osc.stop(now + time + 0.5);
  });

  // Loop the melody
  setTimeout(() => {
    if (isPlaying) playRomanticMelody();
  }, 5000);
}

// ===== GUARDAR CONTENIDO EN LOCALSTORAGE =====
function saveContent() {
  document.querySelectorAll('[contenteditable="true"]').forEach((el, i) => {
    localStorage.setItem(`valentine-content-${i}`, el.innerHTML);
  });
}

function loadContent() {
  document.querySelectorAll('[contenteditable="true"]').forEach((el, i) => {
    const saved = localStorage.getItem(`valentine-content-${i}`);
    if (saved) el.innerHTML = saved;
  });
}

loadContent();

document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
  el.addEventListener('input', saveContent);
});

// ===== PREVENIR PÉRDIDA DE DATOS =====
let hasEdited = false;
document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
  el.addEventListener('input', () => { hasEdited = true; });
});

window.addEventListener('beforeunload', (e) => {
  if (hasEdited) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  goToPage(1);

  // Trigger reveals for initial page
  const page1 = document.getElementById('page1');
  if (page1) triggerReveals(page1);
});

// ===== CONSOLE MESSAGES =====
console.log(
  '%c🤍 Hecho con amor para ti 🤍',
  'font-size: 22px; color: #be1558; font-weight: bold; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);'
);
console.log(
  '%cCada detalle fue diseñado pensando en ti 🤍',
  'font-size: 13px; color: #ff6b9d; font-style: italic;'
);
