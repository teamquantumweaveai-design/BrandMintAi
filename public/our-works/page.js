'use strict';

const menuButton = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
function closeMenu() {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  header.classList.toggle('menu-open', open);
});
document.querySelectorAll('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Self-hosted Lenis: native touch, keyboard and reduced-motion behavior retained.
const smoothScroll = typeof window.Lenis === 'function' ? new window.Lenis({
  autoRaf: true,
  lerp: 0.085,
  smoothWheel: true,
  syncTouch: false,
  anchors: false,
  respectReducedMotion: true,
  prevent: node => Boolean(node.closest?.('[data-lenis-prevent]'))
}) : null;
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]:not(.skip)');
  if (!smoothScroll || reducedMotion.matches || !link || event.defaultPrevented ||
      event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  smoothScroll.scrollTo(target);
});
window.addEventListener('pagehide', () => smoothScroll?.stop());
window.addEventListener('pageshow', () => {
  if (!document.querySelector('dialog[open]')) smoothScroll?.start();
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px' });
  document.querySelectorAll('.reveal').forEach(element => {
    const siblings = [...element.parentElement.children].filter(child => child.classList.contains('reveal'));
    element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 3) * 75}ms`);
    revealObserver.observe(element);
  });
  document.body.classList.add('motion-ready');
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.body.classList.remove('motion-ready');
      revealObserver.disconnect();
    }
  });
}

const progress = document.querySelector('.reading-progress');
let scrollQueued = false;
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0}%`;
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    window.requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('#navigation a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('#story, #work, #voices, #contact').forEach(section => sectionObserver.observe(section));
}


document.querySelector('#year').textContent = String(new Date().getFullYear());

// A native dialog keeps focus inside the popup and restores it on close.
// All content is local, and all popups require a visitor action.
const dialog = document.querySelector('#experience-dialog');
const dialogContent = document.querySelector('#dialog-content');
let closeTimer;
let dialogOpener;
let previousOverflow = '';
function openPopup(content) {
  clearTimeout(closeTimer);
  dialog.classList.remove('closing');
  dialogContent.replaceChildren(content);
  dialog.classList.toggle('letter-cinema', Boolean(dialogContent.querySelector('.letter-preview')));
  dialogOpener = document.activeElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  smoothScroll?.stop();
  dialog.showModal();
}
function closePopup() {
  if (!dialog.open) return;
  dialog.close();
  dialogContent.replaceChildren();
  document.body.style.overflow = previousOverflow;
  smoothScroll?.start();
  if (dialogOpener?.isConnected) dialogOpener.focus({ preventScroll: true });
}
dialog.querySelector('.dialog-close').addEventListener('click', closePopup);
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closePopup();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePopup();
});
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  clearTimeout(closeTimer);
  dialogContent.replaceChildren(); // Removes any video and stops its playback.
  dialog.classList.remove('closing');
  document.body.style.overflow = previousOverflow;
  smoothScroll?.start();
  if (dialogOpener?.isConnected) dialogOpener.focus({ preventScroll: true });
});
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function popupHeading(container, eyebrow, title) {
  const heading = element('h2', '', title);
  heading.id = 'dialog-title';
  container.append(heading);
}

document.querySelectorAll('[data-letter]').forEach(button => {
  button.addEventListener('click', () => {
    const content = document.createDocumentFragment();
    popupHeading(content, '', button.dataset.client);
    content.append(element('p', 'dialog-intro', `An individual appreciation letter from the founding team’s previous professional work. Original wording and recipients are preserved.`));
    const preview = element('img', 'letter-preview');
    preview.src = `/our-works/assets/letter-${button.dataset.letter}.png`;
    preview.alt = `${button.dataset.client} historical appreciation letter, original page ${button.dataset.letter}`;
    preview.width = 536;
    preview.height = 758;
    content.append(preview);
    const original = element('a', 'button primary', 'Open this letter image ↗');
    original.href = `/our-works/assets/letter-${button.dataset.letter}.png`;
    original.target = '_blank'; original.rel = 'noopener';
    content.append(original);
    content.append(element('p', 'source-note', 'This document relates to previous professional work and was not issued to BrandMint AI Private Limited.'));
    openPopup(content);
  });
});

const profileVideo = document.querySelector('[data-profile-video]');
profileVideo.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const content = document.createDocumentFragment();
  popupHeading(content, '', 'Meet Kaaranji Shreedhar');
  const video = element('video', 'dialog-video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.src = profileVideo.href;
  video.setAttribute('aria-label', 'Kaaranji Shreedhar introduction');
  const external = element('a', 'text-link', 'Open video in a new tab');
  external.href = profileVideo.href;
  external.target = '_blank';
  external.rel = 'noopener noreferrer';
  content.append(video, external);
  openPopup(content);
});

document.querySelectorAll('[data-video]').forEach(link => {
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const content = document.createDocumentFragment();
    const name = link.closest('.video-card').querySelector('h3').textContent;
    popupHeading(content, 'A VOICE FROM THE HISTORICAL PORTFOLIO', name);
    const frame = element('iframe', 'dialog-video');
    frame.title = `${name} — original portfolio recording`;
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(link.dataset.video)}?rel=0`;
    frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    content.append(frame);
    content.append(element('p', 'source-note', 'This is an original recording from the previous professional portfolio. Its title and attribution are preserved; it is not presented as a testimonial issued to BrandMint AI.'));
    const external = element('a', 'text-link', 'Watch on YouTube ↗');
    external.href = link.href;
    external.target = '_blank';
    external.rel = 'noopener noreferrer';
    content.append(external);
    openPopup(content);
  });
  const image = link.querySelector('img');
  image.addEventListener('error', () => {
    image.hidden = true;
    link.classList.add('thumbnail-unavailable');
  });
});

function showConsultation(event) {
  event?.preventDefault();
  closeMenu();
  const content = document.querySelector('#consult-template').content.cloneNode(true);
  const form = content.querySelector('form');
  form.addEventListener('submit', submit => {
    submit.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const body = `Hello BrandMint AI,\n\nMy name is ${data.get('name')}.\nEmail: ${data.get('email')}\n\nI would like to explore: ${data.get('service')}\n\n${data.get('idea')}\n\nPlease get in touch to discuss a business consultation.\n\nRegards,\n${data.get('name')}`;
    const draft = `mailto:connect@brandmintai.io?subject=${encodeURIComponent('Business consultation — ' + data.get('service'))}&body=${encodeURIComponent(body)}`;
    window.location.href = draft;
    const feedback = form.querySelector('.form-feedback');
    feedback.replaceChildren(document.createTextNode('Email draft prepared. If your email app did not open, '));
    const retry = element('a', 'text-link', 'open the draft here ↗');
    retry.href = draft;
    feedback.append(retry);
  });
  openPopup(content);
}
document.querySelectorAll('[data-consult], a[href^="mailto:"][href*="subject="]').forEach(control => {
  control.setAttribute('aria-haspopup', 'dialog');
  control.addEventListener('click', showConsultation);
});

// The AI circuits animate only while the hero is visible, with reduced-motion support.
const heroMotion = document.querySelector('.hero-art');
let heroInView = true;
function syncHeroMotion() {
  heroMotion.classList.toggle('motion-paused', document.hidden || !heroInView || reducedMotion.matches);
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => { heroInView = entries[0].isIntersecting; syncHeroMotion(); }, {threshold:0}).observe(heroMotion);
}
document.addEventListener('visibilitychange', syncHeroMotion);
reducedMotion.addEventListener('change', syncHeroMotion);
syncHeroMotion();

// Preserve spatial continuity when founder or expertise details unfold.
document.querySelectorAll('.founder summary, .expertise-list summary').forEach(summary => {
  summary.addEventListener('click', event => {
    if (reducedMotion.matches || !document.startViewTransition) return;
    event.preventDefault();
    const disclosure = summary.parentElement;
    document.startViewTransition(() => { disclosure.open = !disclosure.open; });
  });
});




// Repeat the visual sequence around the seven real, keyboard-accessible cards.
const rail = document.querySelector('.experience-track');
const cards = [...rail.children];
function duplicateCards() {
  return cards.map(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    const original = card.querySelector('button');
    const button = copy.querySelector('button');
    button.removeAttribute('data-letter');
    button.tabIndex = -1;
    button.addEventListener('click', () => original.click());
    return copy;
  });
}
const beforeCards = duplicateCards();
const afterCards = duplicateCards();
rail.prepend(...beforeCards);
rail.append(...afterCards);
const visuals = [...rail.children];

let drag;
let suppressClick = false;
let cycle = 0;
let visible = false;
let hovered = false;
let holdUntil = 0;
let frame = 0;
let lastTime = 0;
let position = null;
let settleTimer;
function wrapPosition(value) {
  return cycle ? cycle + ((value - cycle) % cycle + cycle) % cycle : value;
}
function holdRail() {
  holdUntil = performance.now() + 2200;
  position = null;
}
function resizeRail() {
  const oldCycle = cycle;
  const phase = oldCycle ? ((rail.scrollLeft / oldCycle) % 1 + 1) % 1 : 0;
  cycle = cards[0].offsetLeft - beforeCards[0].offsetLeft;
  if (cycle && cycle !== oldCycle) {
    rail.scrollLeft = cycle * (1 + phase);
    position = null;
  }
  queueRailPaint();
}
function tick(now) {
  const elapsed = Math.min(now - lastTime, 32);
  lastTime = now;
  if (!visible) return;
  if (cycle > rail.clientWidth  && !hovered && !drag && !dialog.open &&
      !document.hidden && !reducedMotion.matches &&
      !rail.contains(document.activeElement) && now > holdUntil) {
    position = wrapPosition((position ?? rail.scrollLeft) + elapsed * .074);
    rail.scrollLeft = position;
  } else {
    position = null;
  }
  frame = requestAnimationFrame(tick);
}
new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  cancelAnimationFrame(frame);
  if (visible) {
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }
}, {threshold:.25}).observe(rail);
rail.addEventListener('pointerenter', event => { hovered = event.pointerType === 'mouse'; });
rail.addEventListener('pointerleave', () => { hovered = false; });
for (const event of ['wheel', 'focusin']) rail.addEventListener(event, holdRail, {passive:true});
rail.addEventListener('scroll', () => {
  if (position !== null || drag || rail.contains(document.activeElement)) return;
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    if (!drag && !rail.contains(document.activeElement) && cycle &&
        (rail.scrollLeft < cycle || rail.scrollLeft >= cycle * 2)) {
      rail.scrollLeft = wrapPosition(rail.scrollLeft);
    }
  }, 140);
}, {passive:true});

rail.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const direction = event.key === 'ArrowLeft' ? -1 : 1;
  const width = rail.firstElementChild.offsetWidth + parseFloat(getComputedStyle(rail).columnGap);
  const left = event.key === 'Home' ? cycle : event.key === 'End' ? cycle * 2 - rail.clientWidth + width : rail.scrollLeft + direction * width;
  rail.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
rail.addEventListener('pointerdown', event => {
  holdRail();
  suppressClick = false;
  if (event.pointerType === 'mouse' && event.button === 0) {
    drag = { id: event.pointerId, x: event.clientX, left: rail.scrollLeft, moved: false };
  }
});
window.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const distance = event.clientX - drag.x;
  if (!drag.moved && Math.abs(distance) < 7) return;
  if (!drag.moved) {
    drag.moved = true;
    rail.setPointerCapture(event.pointerId);
    rail.classList.add('is-dragging');
  }
  rail.scrollLeft = wrapPosition(drag.left - distance);
});
function finishDrag(event) {
  if (!drag || drag.id !== event.pointerId) return;
  suppressClick = drag.moved;
  drag = null;
  rail.classList.remove('is-dragging');
  holdRail();
}
window.addEventListener('pointerup', finishDrag);
window.addEventListener('pointercancel', finishDrag);
rail.addEventListener('lostpointercapture', finishDrag);
rail.addEventListener('click', event => {
  if (!suppressClick || event.detail === 0) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  suppressClick = false;
}, true);


let railPaint = 0;
function paintRail() {
  railPaint = 0;
  if (reducedMotion.matches) return;
  const first = visuals[0].offsetLeft;
  const width = rail.clientWidth;
  const center = rail.scrollLeft + width / 2;
  const shifts = visuals.map(card => {
    const position = card.offsetLeft - first + card.offsetWidth / 2 - center;
    return Math.max(-1, Math.min(1, position / (width * .65))) * -24;
  });
  visuals.forEach((card, index) => card.style.setProperty('--art-pan', shifts[index].toFixed(1) + 'px'));
}
function queueRailPaint() {
  if (!railPaint) railPaint = requestAnimationFrame(paintRail);
}
rail.addEventListener('scroll', queueRailPaint, { passive: true });
new ResizeObserver(resizeRail).observe(rail);
resizeRail();

// Loop visual copies around the seven original review excerpts.
const reviewTrack = document.querySelector('.review-track');
const originals = [...reviewTrack.children];
function copyReviews() {
  return originals.map(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden','true');
    return copy;
  });
}
const reviewBefore = copyReviews();
reviewTrack.prepend(...reviewBefore);
reviewTrack.append(...copyReviews());
let reviewVisible = false, reviewHovered = false;
let reviewFrame = 0, reviewTime = 0, reviewPosition = null, reviewHold = 0, reviewCycle = 0;
function wrapReview(value) {
  return reviewCycle ? reviewCycle + ((value-reviewCycle)%reviewCycle+reviewCycle)%reviewCycle : value;
}
function resizeReviews() {
  const old = reviewCycle;
  const phase = old ? ((reviewTrack.scrollLeft/old)%1+1)%1 : 0;
  reviewCycle = originals[0].offsetLeft-reviewBefore[0].offsetLeft;
  if (reviewCycle !== old) {
    reviewTrack.scrollLeft = reviewCycle*(1+phase);
    reviewPosition = null;
  }
}
function animateReviews(now) {
  const elapsed = Math.min(32, now-reviewTime);
  reviewTime = now;
  if (!reviewVisible) return;
  if (!reviewHovered && !document.hidden && !dialog.open && !reducedMotion.matches &&
      !reviewTrack.contains(document.activeElement) && now>reviewHold) {
    reviewPosition = wrapReview((reviewPosition ?? reviewTrack.scrollLeft)+elapsed*.045);
    reviewTrack.scrollLeft = reviewPosition;
  } else reviewPosition = null;
  reviewFrame = requestAnimationFrame(animateReviews);
}
new IntersectionObserver(([entry]) => {
  reviewVisible = entry.isIntersecting;
  cancelAnimationFrame(reviewFrame);
  if (reviewVisible) {
    reviewTime = performance.now();
    reviewFrame = requestAnimationFrame(animateReviews);
  }
}).observe(reviewTrack);
new ResizeObserver(resizeReviews).observe(reviewTrack);
resizeReviews();
reviewTrack.addEventListener('pointerenter', event => {reviewHovered = event.pointerType==='mouse';});
reviewTrack.addEventListener('pointerleave', () => {reviewHovered = false;});
for (const event of ['wheel','pointerdown','focusin']) reviewTrack.addEventListener(event, () => {
  reviewHold = performance.now()+3000;
  reviewPosition = null;
}, {passive:true});
reviewTrack.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  reviewTrack.scrollBy({left:(event.key==='ArrowLeft'?-1:1)*(originals[0].offsetWidth+18),behavior:reducedMotion.matches?'instant':'smooth'});
});
