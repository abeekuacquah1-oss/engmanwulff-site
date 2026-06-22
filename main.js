/* ============================================================
   Engman Wulff — main.js
   ============================================================ */

/* ---------- Header scroll ---------- */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- Mobile nav ---------- */
const menuBtn    = document.getElementById('menuBtn');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

menuBtn.addEventListener('click', () => {
  mobileNav.classList.add('open');
  mobileClose.focus();
});
mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileNav.classList.remove('open'))
);

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Filmstrip drag-to-scroll ---------- */
const filmstrip = document.querySelector('.filmstrip');
let isDragging = false, startX, scrollLeft, dragDelta = 0;

filmstrip.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragDelta  = 0;
  filmstrip.classList.add('dragging');
  startX     = e.pageX - filmstrip.offsetLeft;
  scrollLeft = filmstrip.scrollLeft;
});
['mouseleave', 'mouseup'].forEach(evt =>
  filmstrip.addEventListener(evt, () => {
    isDragging = false;
    filmstrip.classList.remove('dragging');
  })
);
filmstrip.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - filmstrip.offsetLeft;
  dragDelta = x - startX;
  filmstrip.scrollLeft = scrollLeft - dragDelta * 1.4;
});

/* ---------- Auto-scroll filmstrip (seamless infinite marquee) ----------
   Adapted from the common "infinite moving cards" pattern (21st.dev /
   Aceternity) as vanilla JS — duplicate the cards once, then advance
   scrollLeft and wrap at the loop width for a seam-free loop. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoPaused = false, loopWidth = 0;

const originalFrames = [...filmstrip.querySelectorAll('.frame')];
originalFrames.forEach(f => {
  const clone = f.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');  // duplicates are decorative
  clone.setAttribute('tabindex', '-1');
  filmstrip.appendChild(clone);
});

function measureLoop() {
  const frames = filmstrip.querySelectorAll('.frame');
  const firstClone = frames[originalFrames.length];
  // exact repeat distance = gap between an original card and its clone
  loopWidth = firstClone ? (firstClone.offsetLeft - frames[0].offsetLeft) : filmstrip.scrollWidth / 2;
}
measureLoop();
window.addEventListener('resize', measureLoop);

// Pause so cards stay readable / tappable
filmstrip.addEventListener('mouseenter', () => { autoPaused = true; });
filmstrip.addEventListener('mouseleave', () => { autoPaused = false; });
filmstrip.addEventListener('touchstart', () => { autoPaused = true; }, { passive: true });
filmstrip.addEventListener('touchend',   () => { setTimeout(() => { autoPaused = false; }, 2500); }, { passive: true });

if (!reduceMotion) {
  const SPEED = 0.5; // px per frame (~30px/s) — slow and elegant
  (function autoTick() {
    if (!autoPaused && !isDragging && loopWidth > 0) {
      filmstrip.scrollLeft += SPEED;
      if (filmstrip.scrollLeft >= loopWidth) filmstrip.scrollLeft -= loopWidth;
    }
    requestAnimationFrame(autoTick);
  })();
}

/* ---------- Lightbox ---------- */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbTag     = document.getElementById('lbTag');
const lbTitle   = document.getElementById('lbTitle');
const lbDesc    = document.getElementById('lbDesc');
const lbCounter = document.getElementById('lbCounter');

let lbImages = [], lbCurrent = 0, lbProjectTitle = '';

function toAssetSrc(filename) {
  return 'assets/' + filename.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function showLbImage(i) {
  lbCurrent = ((i % lbImages.length) + lbImages.length) % lbImages.length;
  lbImg.src = toAssetSrc(lbImages[lbCurrent]);
  lbImg.alt = lbProjectTitle + ' — image ' + (lbCurrent + 1) + ' of ' + lbImages.length;
  lbCounter.textContent = (lbCurrent + 1) + ' / ' + lbImages.length;
}

function openLightbox(frame) {
  lbImages       = JSON.parse(frame.dataset.gallery);
  lbProjectTitle = frame.dataset.title;
  lbTag.textContent   = frame.dataset.category + ' — ' + frame.dataset.year;
  lbTitle.textContent = frame.dataset.title;
  lbDesc.textContent  = frame.dataset.desc;
  showLbImage(0);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Keyboard access + labels on the original cards only (clones are aria-hidden)
originalFrames.forEach(frame => {
  frame.setAttribute('tabindex', '0');
  frame.setAttribute('role', 'button');
  frame.setAttribute('aria-label', 'Open ' + frame.dataset.title + ' gallery');
  frame.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(frame); }
  });
});

// Click (delegated) — works for both the originals and the duplicated cards
filmstrip.addEventListener('click', (e) => {
  const frame = e.target.closest('.frame');
  if (!frame) return;
  if (Math.abs(dragDelta) > 6) return; // suppress click right after a drag
  openLightbox(frame);
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => showLbImage(lbCurrent - 1));
document.getElementById('lbNext').addEventListener('click', () => showLbImage(lbCurrent + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showLbImage(lbCurrent - 1);
  if (e.key === 'ArrowRight')  showLbImage(lbCurrent + 1);
});

/* Touch swipe on lightbox */
let lbTouchX = null;
lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (lbTouchX === null) return;
  const diff = lbTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) showLbImage(lbCurrent + (diff > 0 ? 1 : -1));
  lbTouchX = null;
});

/* ---------- Testimonial carousel ---------- */
const slides = document.querySelectorAll('.quote-slide');
const dots   = document.querySelectorAll('.quote-dot');
let qCurrent = 0, qTimer;

function showQuote(i) {
  slides[qCurrent].classList.remove('active');
  dots[qCurrent].classList.remove('active');
  qCurrent = ((i % slides.length) + slides.length) % slides.length;
  slides[qCurrent].classList.add('active');
  dots[qCurrent].classList.add('active');
}

function resetTimer() {
  clearInterval(qTimer);
  qTimer = setInterval(() => showQuote(qCurrent + 1), 6000);
}

document.getElementById('qPrev').addEventListener('click', () => { showQuote(qCurrent - 1); resetTimer(); });
document.getElementById('qNext').addEventListener('click', () => { showQuote(qCurrent + 1); resetTimer(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { showQuote(i); resetTimer(); }));
resetTimer();

/* ---------- Contact form (Web3Forms) ---------- */
const contactForm  = document.getElementById('contactForm');
const submitBtn    = contactForm.querySelector('.submit-btn');
const formSuccess  = document.getElementById('formSuccess');
const formError    = document.getElementById('formError');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  formSuccess.className = 'form-status';
  formError.className   = 'form-status';

  try {
    const res    = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(contactForm) });
    const result = await res.json();
    if (result.success) {
      formSuccess.className = 'form-status success';
      contactForm.reset();
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch {
    formError.className = 'form-status error';
  } finally {
    submitBtn.textContent = 'Send Inquiry →';
    submitBtn.disabled = false;
  }
});

/* ---------- Dynamic footer year ---------- */
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
