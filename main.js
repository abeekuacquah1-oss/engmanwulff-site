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

/* ---------- Auto-scroll filmstrip + category filter ----------
   Seamless infinite marquee (vanilla adaptation of the 21st.dev / Aceternity
   "infinite moving cards" pattern). Matching cards are duplicated enough to
   fill the strip for a seam-free loop; the strip can be filtered by category. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoPaused = false, loopWidth = 0, visibleCount = 0;

const originalFrames = [...filmstrip.querySelectorAll('.frame')];
const workEmpty = document.getElementById('workEmpty');

function measureLoop() {
  const frames = filmstrip.querySelectorAll('.frame');
  const firstClone = frames[visibleCount];           // first duplicated card
  loopWidth = firstClone ? (firstClone.offsetLeft - frames[0].offsetLeft) : 0;
}

// Rebuild the strip for a category ('all' = every project). Duplicates the
// matching set enough times to exceed the viewport so the loop never gaps.
function buildStrip(category) {
  filmstrip.querySelectorAll('.frame').forEach(f => f.remove());
  const matches = originalFrames.filter(f => category === 'all' || f.dataset.category === category);
  visibleCount = matches.length;

  if (!matches.length) {                       // e.g. no Video Production projects yet
    filmstrip.style.display = 'none';
    if (workEmpty) workEmpty.style.display = 'block';
    loopWidth = 0;
    return;
  }
  filmstrip.style.display = 'flex';
  if (workEmpty) workEmpty.style.display = 'none';

  matches.forEach(f => filmstrip.appendChild(f));            // set #1 (real cards)
  const last = matches[matches.length - 1];
  const unit = (last.offsetLeft + last.offsetWidth - matches[0].offsetLeft) + 24; // + gap
  const copies = Math.max(2, Math.ceil((filmstrip.clientWidth * 2.2) / Math.max(1, unit)) + 1);
  for (let s = 1; s < copies; s++) {
    matches.forEach(f => {
      const clone = f.cloneNode(true);
      clone.dataset.clone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      filmstrip.appendChild(clone);
    });
  }
  measureLoop();
  filmstrip.scrollLeft = 0;
}

buildStrip('all');
window.addEventListener('resize', measureLoop);
window.addEventListener('load', measureLoop);   // re-measure once images settle

// Filter wiring: chips in the Work section AND the service rows both filter.
function setFilter(category) {
  buildStrip(category);
  document.querySelectorAll('.filter-chip').forEach(c =>
    c.classList.toggle('active', c.dataset.filter === category));
}
document.querySelectorAll('.filter-chip').forEach(chip =>
  chip.addEventListener('click', () => setFilter(chip.dataset.filter)));
document.querySelectorAll('.service-row[data-filter]').forEach(row => {
  const go = () => {
    setFilter(row.dataset.filter);
    document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
  };
  row.setAttribute('role', 'button');
  row.setAttribute('tabindex', '0');
  row.addEventListener('click', go);
  row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});

// Pause on hover ONLY for real hover devices (desktop). On touchscreens
// 'mouseenter' fires on tap but 'mouseleave' often never does, which would
// leave the strip paused forever — so phones rely on the touch handlers only.
if (window.matchMedia('(hover: hover)').matches) {
  filmstrip.addEventListener('mouseenter', () => { autoPaused = true; });
  filmstrip.addEventListener('mouseleave', () => { autoPaused = false; });
}
filmstrip.addEventListener('touchstart', () => { autoPaused = true; }, { passive: true });
filmstrip.addEventListener('touchend',   () => { setTimeout(() => { autoPaused = false; }, 1500); }, { passive: true });

if (!reduceMotion) {
  const SPEED = 0.6; // px per frame (~36px/s) — slow and elegant
  (function autoTick() {
    if (!autoPaused && !isDragging && loopWidth > 0) {
      filmstrip.scrollLeft += SPEED;
      if (filmstrip.scrollLeft >= loopWidth) filmstrip.scrollLeft -= loopWidth;
    }
    requestAnimationFrame(autoTick);
  })();
}

/* ---------- Hero slideshow (cross-fade) ---------- */
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 1 && !reduceMotion) {
  let heroIdx = 0;
  setInterval(() => {
    heroSlides[heroIdx].classList.remove('active');
    heroIdx = (heroIdx + 1) % heroSlides.length;
    heroSlides[heroIdx].classList.add('active');
  }, 6000);
}

/* ---------- Lightbox ---------- */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbTag     = document.getElementById('lbTag');
const lbTitle   = document.getElementById('lbTitle');
const lbDesc    = document.getElementById('lbDesc');
const lbCounter = document.getElementById('lbCounter');

const lbVideo = document.getElementById('lbVideo');
let lbItems = [], lbCurrent = 0, lbProjectTitle = '';

function toAssetSrc(filename) {
  return 'assets/' + filename.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function showLbItem(i) {
  lbCurrent = ((i % lbItems.length) + lbItems.length) % lbItems.length;
  const item = lbItems[lbCurrent];
  if (item.type === 'video') {
    lbImg.style.display = 'none';
    lbVideo.style.display = 'block';
    const src = toAssetSrc(item.src);
    if (lbVideo.getAttribute('src') !== src) {
      lbVideo.setAttribute('src', src);
      if (item.poster) lbVideo.poster = toAssetSrc(item.poster);
    }
    lbVideo.play().catch(() => {});   // play on open (the click is a user gesture)
  } else {
    lbVideo.pause();
    lbVideo.style.display = 'none';
    lbImg.style.display = 'block';
    lbImg.src = toAssetSrc(item.src);
    lbImg.alt = lbProjectTitle + ' — image ' + (lbCurrent + 1) + ' of ' + lbItems.length;
  }
  lbCounter.textContent = (lbCurrent + 1) + ' / ' + lbItems.length;
}

function openLightbox(frame) {
  const gallery = JSON.parse(frame.dataset.gallery);
  lbItems = [];
  if (frame.dataset.video) lbItems.push({ type: 'video', src: frame.dataset.video, poster: frame.dataset.poster });
  gallery.forEach(src => lbItems.push({ type: 'img', src: src }));
  lbProjectTitle = frame.dataset.title;
  lbTag.textContent   = frame.dataset.category + ' — ' + frame.dataset.year;
  lbTitle.textContent = frame.dataset.title;
  lbDesc.textContent  = frame.dataset.desc;
  showLbItem(0);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}

function closeLightbox() {
  lbVideo.pause();
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
document.getElementById('lbPrev').addEventListener('click', () => showLbItem(lbCurrent - 1));
document.getElementById('lbNext').addEventListener('click', () => showLbItem(lbCurrent + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showLbItem(lbCurrent - 1);
  if (e.key === 'ArrowRight')  showLbItem(lbCurrent + 1);
});

/* Touch swipe on lightbox */
let lbTouchX = null;
lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (lbTouchX === null) return;
  const diff = lbTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) showLbItem(lbCurrent + (diff > 0 ? 1 : -1));
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
