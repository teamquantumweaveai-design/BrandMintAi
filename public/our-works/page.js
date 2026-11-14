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
  anchors: true,
  respectReducedMotion: true,
  prevent: node => Boolean(node.closest?.('[data-lenis-prevent]'))
}) : null;
window.addEventListener('pagehide', () => smoothScroll?.stop());
window.addEventListener('pageshow', () => {
  if (!document.querySelector('dialog[open]')) smoothScroll?.start();
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Replay when returning to a section without hiding focused content.
      } else if (!entry.target.contains(document.activeElement)) {
        entry.target.classList.remove('is-visible');
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

// Animate headings by word while preserving a coherent screen-reader label.
document.querySelectorAll('.section-heading h2, .brand-family h2, .contact h2').forEach(heading => {
  heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
  let index = 0;
  function splitWords(parent) {
    [...parent.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(word => {
          if (!word.trim()) fragment.append(document.createTextNode(word));
          else {
            const span = element('span', 'text-heading-word', word);
            span.style.setProperty('--word-index', index++);
            span.setAttribute('aria-hidden', 'true');
            fragment.append(span);
          }
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') splitWords(child);
    });
  }
  splitWords(heading);
});

// A subtle section transition, with native hash navigation and reduced-motion support.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    if (reducedMotion.matches) return;
    const section = document.getElementById(link.hash.slice(1));
    const title = section?.querySelector('h2');
    if (title && typeof title.animate === 'function') title.animate([
      { opacity: .25, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
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

const approachStrip=document.querySelector('.principle-strip');
const approachPause=document.querySelector('.principle-pause');
approachPause.addEventListener('click',()=>{const paused=approachStrip.classList.toggle('is-paused');approachPause.setAttribute('aria-pressed',String(paused));approachPause.setAttribute('aria-label',paused?'Resume scrolling approach':'Pause scrolling approach');});
let approachInView=true;
const syncApproachMotion=()=>approachStrip.classList.toggle('motion-paused',document.hidden||!approachInView);
new IntersectionObserver(entries=>{approachInView=entries[0].isIntersecting;syncApproachMotion();}).observe(approachStrip);
document.addEventListener('visibilitychange',syncApproachMotion);

// Text entrances replay on each viewport crossing, in either scroll direction.
if ('IntersectionObserver' in window) {
  let lastTextScroll=scrollY;
  const copyObserver=new IntersectionObserver(entries=>{
    const upward=scrollY<lastTextScroll;
    lastTextScroll=scrollY;
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.setProperty('--text-from',upward?'-22px':'22px');
        entry.target.classList.add('copy-in-view');
      }else if(!entry.target.contains(document.activeElement))entry.target.classList.remove('copy-in-view');
    });
  },{threshold:0,rootMargin:'0px'});
  document.querySelectorAll('main section h1, main section h2, main section h3, main section p:not(.eyebrow):not(.role)').forEach(node=>{
    node.classList.add('scroll-copy');
    copyObserver.observe(node);
  });
}

// Stronger, reversible scene entrances without moving the section's anchor box.
if ('IntersectionObserver' in window) {
  let lastSceneScroll=scrollY;
  const sceneObserver=new IntersectionObserver(entries=>{
    const upward=scrollY<lastSceneScroll;
    lastSceneScroll=scrollY;
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.setProperty('--scene-from',upward?'-72px':'72px');
        entry.target.classList.add('scene-active');
      }else if(!entry.target.contains(document.activeElement))entry.target.classList.remove('scene-active');
    });
  },{threshold:0,rootMargin:'-140px 0px -10% 0px'});
  document.querySelectorAll('main>section.section, main>section.brand-family').forEach(section=>sceneObserver.observe(section));
}

// Seven real cards in one horizontal track; no duplicated letter collections.
const clientTrack=document.querySelector('.experience-track');
const clientPause=document.querySelector('[data-carousel="pause"]');
let clientPaused=false,clientVisible=false,clientHover=false,clientDirection=1,clientHold=0,clientFrame=0,clientLast=0;
function moveClientCard(direction){clientHold=performance.now()+8000;const card=clientTrack.querySelector('.experience-card');clientTrack.scrollBy({left:direction*(card.getBoundingClientRect().width+24),behavior:reducedMotion.matches?'instant':'smooth'});}
document.querySelector('[data-carousel="previous"]').addEventListener('click',()=>moveClientCard(-1));
document.querySelector('[data-carousel="next"]').addEventListener('click',()=>moveClientCard(1));
clientPause.addEventListener('click',()=>{clientPaused=!clientPaused;clientPause.textContent=clientPaused?'Play':'Pause';clientPause.setAttribute('aria-pressed',String(clientPaused));clientPause.setAttribute('aria-label',clientPaused?'Resume client cards':'Pause client cards');});
clientTrack.addEventListener('pointerenter',()=>{clientHover=true;});clientTrack.addEventListener('pointerleave',()=>{clientHover=false;});
for(const type of ['pointerdown','wheel','touchstart'])clientTrack.addEventListener(type,()=>{clientHold=performance.now()+8000;},{passive:true});
function clientTick(time){const dt=Math.min(time-clientLast,50);clientLast=time;const focused=clientTrack.contains(document.activeElement);if(clientVisible&&!document.hidden&&!clientPaused&&!clientHover&&!focused&&!dialog.open&&!reducedMotion.matches&&time>clientHold){const max=clientTrack.scrollWidth-clientTrack.clientWidth;if(clientTrack.scrollLeft>=max-1)clientDirection=-1;else if(clientTrack.scrollLeft<=1)clientDirection=1;clientTrack.scrollLeft+=clientDirection*dt*.035;}clientFrame=requestAnimationFrame(clientTick);}
new IntersectionObserver(entries=>{clientVisible=entries[0].isIntersecting;}).observe(clientTrack);
clientFrame=requestAnimationFrame(clientTick);
