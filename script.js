const CONFIG = {
  social: {
    // Replace these with the final official handles/numbers before production.
    instagramUsername: 'underchargers',
    facebookUrl: 'https://www.facebook.com/underchargersofficial',
    messengerUsername: 'underchargersofficial',
    tiktokUsername: 'underchargers',
    phone: '+639179620045',
    viberPhone: '+639179620045',
    whatsappPhone: '639179620045'
  },
  maps: {
    qc: 'https://www.google.com/maps/search/?api=1&query=116%20Diamond%20Ave%20Novaliches%20Quezon%20City',
    md: 'https://www.google.com/maps/search/?api=1&query=122%20Primo%20Cruz%20Street%20San%20Jose%20Mandaluyong',
    lp: 'https://www.google.com/maps/search/?api=1&query=320%20Alabang-Zapote%20Road%20Talon%20Uno%20Las%20Pinas'
  }
};

// Reveal animations.
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Active Samsung-style horizontal nav. On narrower screens the active item is centered automatically.
const nav = document.querySelector('[data-scroll-nav]');
const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
const sectionIds = navLinks.map(a => a.getAttribute('href').slice(1));
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const navObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const id = visible.target.id;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
  const active = navLinks.find(link => link.classList.contains('active'));
  if (active && window.innerWidth <= 820) {
    const x = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
    nav.scrollTo({left: Math.max(0,x), behavior:'smooth'});
  }
}, { rootMargin: '-25% 0px -55% 0px', threshold: [0,.1,.3,.6] });
sections.forEach(section => navObserver.observe(section));

// Local image placeholders automatically become images once matching files are dropped into assets/images/.
function loadLocalImage(el, name, extraGradient='linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.16))') {
  if (!el || !name) return;
  const src = name;
  const img = new Image();
  img.onload = () => {
    el.style.background = `${extraGradient},url("${src}") center/cover no-repeat`;
    el.classList.add('has-image');
  };
  img.src = src;
}
document.querySelectorAll('.media[data-image]').forEach(el => loadLocalImage(el, el.dataset.image));

// Engine brand photo selector.
const enginePhoto = document.getElementById('engine-photo');
document.querySelectorAll('[data-engine]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-engine]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadLocalImage(enginePhoto, btn.dataset.engine, 'linear-gradient(180deg,rgba(0,0,0,.01),rgba(0,0,0,.05))');
}));

// Portrait showcase.
const showcase = ['showcase-1.jpg','showcase-2.jpg','showcase-3.jpg','showcase-4.jpg','showcase-5.jpg'];
let showIndex = 0;
function setMediaImage(el,name){ if(!el)return; el.dataset.image=name; el.style.background=''; loadLocalImage(el,name,'linear-gradient(180deg,rgba(0,0,0,.01),rgba(0,0,0,.08))'); }
function renderShowcase(){
  const main=document.querySelector('.portrait-main .portrait-media'),prev=document.querySelector('.portrait-side.prev .portrait-media'),next=document.querySelector('.portrait-side.next .portrait-media');
  setMediaImage(main,showcase[showIndex]); setMediaImage(prev,showcase[(showIndex-1+showcase.length)%showcase.length]); setMediaImage(next,showcase[(showIndex+1)%showcase.length]);
  const c=document.getElementById('showcase-count'); if(c)c.textContent=String(showIndex+1).padStart(2,'0')+' / '+String(showcase.length).padStart(2,'0');
}
function moveShowcase(step){showIndex=(showIndex+step+showcase.length)%showcase.length;renderShowcase();}
document.querySelectorAll('[data-prev],.portrait-side.prev').forEach(b=>b.addEventListener('click',()=>moveShowcase(-1)));
document.querySelectorAll('[data-next],.portrait-side.next').forEach(b=>b.addEventListener('click',()=>moveShowcase(1)));
let touchX=null; const stage=document.querySelector('[data-carousel]');
if(stage){ stage.addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true}); stage.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)moveShowcase(dx<0?1:-1);touchX=null},{passive:true}); }

// Nine testimonial slots, three visible per cycle. The first three are existing reviews; the remaining six are intentionally marked placeholders so no customer quote is fabricated.
const reviews = [
  {name:'Jhun Porbus',branch:'Underchargers client',text:'Staff are very welcoming and friendly. Associates explain every process and the mechanics are well experienced. We will surely come again.'},
  {name:'Martin Sadongdong',branch:'Underchargers Las Piñas',text:'A perfect 10 with flying colors for the staff and mechanics. The problem was explained well and the troubleshooting was done very well.'},
  {name:'Byron Angeles',branch:'Underchargers Mandaluyong',text:'They expertly fixed the air conditioning on my Subaru XV after numerous unsuccessful consultations with other shops. Outstanding service, skill, and professionalism.'},
  {name:'Review Slot 04',branch:'Replace with verified customer review',text:'Add a verified Underchargers customer testimonial here.'},
  {name:'Review Slot 05',branch:'Replace with verified customer review',text:'Add a verified Underchargers customer testimonial here.'},
  {name:'Review Slot 06',branch:'Replace with verified customer review',text:'Add a verified Underchargers customer testimonial here.'},
  {name:'Review Slot 07',branch:'Replace with verified customer review',text:'Add a verified Underchargers customer testimonial here.'},
  {name:'Review Slot 08',branch:'Replace with verified customer review',text:'Add a verified Underchargers customer testimonial here.'},
  {name:'Review Slot 09',branch:'Replace with verified customer review',text:'Add a verified Underchargers customer testimonial here.'}
];
let reviewGroup = 0;
const reviewGrid = document.getElementById('reviews-grid');
const reviewCount = document.getElementById('review-count');
let reviewTimer;
function renderReviewGroup(animate=true){
  if(!reviewGrid)return;
  if(animate) reviewGrid.classList.add('is-changing');
  const doRender=()=>{
    const start=reviewGroup*3;
    reviewGrid.innerHTML=reviews.slice(start,start+3).map(r=>{const initials=r.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();return `<article class="review-card"><div class="stars">★★★★★</div><blockquote>“${r.text}”</blockquote><div class="review-person"><div class="testimonial-avatar">${initials}</div><div class="review-person-copy"><strong>${r.name}</strong><span>${r.branch}</span></div></div></article>`}).join('');
    if(reviewCount) reviewCount.textContent=String(reviewGroup+1).padStart(2,'0')+' / 03';
    requestAnimationFrame(()=>reviewGrid.classList.remove('is-changing'));
  };
  animate ? setTimeout(doRender,220) : doRender();
}
function moveReviewGroup(step){ reviewGroup=(reviewGroup+step+3)%3; renderReviewGroup(); restartReviewTimer(); }
function restartReviewTimer(){ clearInterval(reviewTimer); reviewTimer=setInterval(()=>{reviewGroup=(reviewGroup+1)%3;renderReviewGroup();},5000); }
renderReviewGroup(false); restartReviewTimer();
document.getElementById('review-prev')?.addEventListener('click',()=>moveReviewGroup(-1));
document.getElementById('review-next')?.addEventListener('click',()=>moveReviewGroup(1));
document.getElementById('reviews-viewport')?.addEventListener('mouseenter',()=>clearInterval(reviewTimer));
document.getElementById('reviews-viewport')?.addEventListener('mouseleave',restartReviewTimer);

// App-first social links with graceful browser fallback. OS/browser rules can still decide final behavior.
function isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function isAndroid(){return /Android/i.test(navigator.userAgent);}
function appFirst(appUrl,webUrl){
  const started=Date.now(); window.location.href=appUrl;
  setTimeout(()=>{if(!document.hidden && Date.now()-started<2300) window.location.href=webUrl;},950);
}
function openChannel(type){const s=CONFIG.social;switch(type){
  case 'instagram': return appFirst(`instagram://user?username=${s.instagramUsername}`,`https://www.instagram.com/${s.instagramUsername}/`);
  case 'facebook': return isIOS()||isAndroid()?appFirst(`fb://facewebmodal/f?href=${encodeURIComponent(s.facebookUrl)}`,s.facebookUrl):window.location.href=s.facebookUrl;
  case 'messenger': return appFirst(`fb-messenger://user-thread/${s.messengerUsername}`,`https://m.me/${s.messengerUsername}`);
  case 'tiktok': return appFirst(`snssdk1233://user/profile/${s.tiktokUsername}`,`https://www.tiktok.com/@${s.tiktokUsername}`);
  case 'sms': return window.location.href=`sms:${s.phone}${isIOS()?'&':'?'}body=${encodeURIComponent('Hi Underchargers, I have an inquiry about my vehicle.')}`;
  case 'viber': return appFirst(`viber://chat?number=${encodeURIComponent(s.viberPhone)}`,'https://www.viber.com/');
  case 'whatsapp': return appFirst(`whatsapp://send?phone=${s.whatsappPhone}&text=${encodeURIComponent('Hi Underchargers, I have an inquiry about my vehicle.')}`,`https://wa.me/${s.whatsappPhone}?text=${encodeURIComponent('Hi Underchargers, I have an inquiry about my vehicle.')}`);
}}
document.querySelectorAll('[data-channel]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openChannel(a.dataset.channel);}));
document.querySelectorAll('[data-map]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.open(CONFIG.maps[a.dataset.map],'_blank','noopener');}));

// Franchise front-end demo submit.
const franchise=document.getElementById('franchise-form');
if(franchise) franchise.addEventListener('submit',e=>{e.preventDefault();if(!franchise.reportValidity())return;window.location.href=franchise.dataset.success||'thank-you.html';});

// Booking flow: branch -> calendar -> customer details.
const branchButtons=[...document.querySelectorAll('.branch-choice')];
const calendarCard=document.getElementById('calendar-card');
const calendarGrid=document.getElementById('calendar-grid');
const calendarTitle=document.getElementById('calendar-title');
const calendarStep=document.getElementById('calendar-step');
const detailsStep=document.getElementById('details-step');
const bookingForm=document.getElementById('booking-form');
const bookingBranchInput=document.getElementById('booking-branch');
const bookingDateInput=document.getElementById('booking-date');
const calendarBranchNote=document.getElementById('calendar-branch-note');
const bookingSummary=document.getElementById('booking-summary');
let selectedBranch=''; let selectedBranchCode=''; let selectedDate='';
const today=new Date(); today.setHours(0,0,0,0);
let viewYear=today.getFullYear(), viewMonth=today.getMonth();

// UI-only demo unavailable dates by branch. Replace with backend availability later.
const demoBlocked={qc:[3,10,17],md:[5,12,19],lp:[7,14,21]};
function ymd(date){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`;}
function formatDate(date){return new Intl.DateTimeFormat('en-PH',{month:'long',day:'numeric',year:'numeric'}).format(date);}
function renderCalendar(){
  if(!calendarGrid)return;
  const first=new Date(viewYear,viewMonth,1), days=new Date(viewYear,viewMonth+1,0).getDate(), start=first.getDay();
  calendarTitle.textContent=new Intl.DateTimeFormat('en-PH',{month:'long',year:'numeric'}).format(first);
  calendarGrid.innerHTML='';
  for(let i=0;i<start;i++){const empty=document.createElement('button');empty.type='button';empty.className='calendar-day empty';empty.tabIndex=-1;calendarGrid.appendChild(empty);}
  for(let day=1;day<=days;day++){
    const date=new Date(viewYear,viewMonth,day); const button=document.createElement('button'); button.type='button'; button.className='calendar-day'; button.textContent=day;
    const past=date<today; const blocked=demoBlocked[selectedBranchCode]?.includes(day) && viewMonth===today.getMonth() && viewYear===today.getFullYear();
    if(past||blocked||!selectedBranch){button.disabled=true;}
    const dateValue=ymd(date);
    if(selectedDate===dateValue) button.classList.add('selected');
    button.addEventListener('click',()=>selectDate(date));
    calendarGrid.appendChild(button);
  }
}
function selectBranch(btn){
  selectedBranch=btn.dataset.branch; selectedBranchCode=btn.dataset.branchCode; selectedDate='';
  branchButtons.forEach(b=>b.classList.toggle('selected',b===btn));
  branchButtons.forEach(b=>b.setAttribute('aria-checked',String(b===btn)));
  calendarCard.classList.remove('is-locked'); calendarStep.setAttribute('aria-disabled','false');
  detailsStep.setAttribute('aria-disabled','true'); bookingForm.classList.add('is-locked');
  bookingBranchInput.value=selectedBranch; bookingDateInput.value='';
  calendarBranchNote.textContent=`Showing dates for ${selectedBranch}.`;
  bookingSummary.textContent='Choose your date to unlock customer and vehicle details.';
  viewYear=today.getFullYear(); viewMonth=today.getMonth(); renderCalendar();
  calendarStep.scrollIntoView({behavior:'smooth',block:'center'});
}
function selectDate(date){
  selectedDate=ymd(date); bookingDateInput.value=selectedDate;
  detailsStep.setAttribute('aria-disabled','false'); bookingForm.classList.remove('is-locked');
  bookingSummary.textContent=`${selectedBranch} · ${formatDate(date)}`;
  renderCalendar();
  setTimeout(()=>detailsStep.scrollIntoView({behavior:'smooth',block:'start'}),180);
}
branchButtons.forEach(btn=>btn.addEventListener('click',()=>selectBranch(btn)));
document.getElementById('calendar-prev')?.addEventListener('click',()=>{const candidate=new Date(viewYear,viewMonth-1,1);const min=new Date(today.getFullYear(),today.getMonth(),1);if(candidate<min)return;viewYear=candidate.getFullYear();viewMonth=candidate.getMonth();renderCalendar();});
document.getElementById('calendar-next')?.addEventListener('click',()=>{const candidate=new Date(viewYear,viewMonth+1,1);viewYear=candidate.getFullYear();viewMonth=candidate.getMonth();renderCalendar();});
renderCalendar();
if(bookingForm) bookingForm.addEventListener('submit',e=>{
  e.preventDefault();
  if(!selectedBranch||!selectedDate){document.getElementById('booking-note').textContent='Choose a branch and date first.';return;}
  if(!bookingForm.reportValidity())return;
  const note=document.getElementById('booking-note'); note.textContent='Demo booking captured on-screen only. Backend connection is intentionally disabled for now.'; note.style.color='#d8aa41';
});


/* V3 interactions */
(() => {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('[data-scroll-nav], .primary-nav');
  const links = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const offset = () => (header?.offsetHeight || 0) + 10;
  const centerLink = link => {
    if (!nav || innerWidth > 820) return;
    const x = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2;
    nav.scrollTo({left: Math.max(0,x), behavior:'smooth'});
  };
  links.forEach(link => link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + scrollY - offset();
    window.scrollTo({top: Math.max(0,top), behavior:'smooth'});
    centerLink(link);
  }));

  // Core-value flip cards.
  document.querySelectorAll('.core-flip-card').forEach(card => {
    const flip = () => {
      card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(card.classList.contains('is-flipped')));
    };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }});
  });

  // Franchise inclusion modal.
  const triggers = [...document.querySelectorAll('.flip-modal-trigger')];
  if (triggers.length) {
    const modal = document.createElement('div');
    modal.className='feature-modal-v3';
    modal.innerHTML='<div class="modal-panel" role="dialog" aria-modal="true"><button class="modal-close" aria-label="Close">×</button><div class="modal-image"></div><p class="eyebrow">FRANCHISE INCLUSION</p><h3 class="modal-title"></h3><p class="modal-copy"></p></div>';
    document.body.appendChild(modal);
    const close=()=>modal.classList.remove('is-open');
    modal.querySelector('.modal-close').addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    triggers.forEach((t,i)=>t.addEventListener('click',()=>{
      modal.querySelector('.modal-title').textContent=t.querySelector('h3,h4,strong')?.textContent?.trim() || 'Franchise Inclusion';
      modal.querySelector('.modal-copy').textContent=t.querySelector('p')?.textContent?.trim() || 'More visual details can be added here with the official franchise asset.';
      modal.querySelector('.modal-image').style.backgroundImage=`url("franchise-inclusion-${i+1}.jpg")`;
      modal.classList.add('is-open');
    }));
  }

  // Generic autoplay for portrait showcase/carousels without changing their layout.
  const portrait = document.querySelector('.portrait-showcase, .showcase-carousel, [data-showcase]');
  if (portrait) {
    const next = portrait.querySelector('[data-next], .next, .carousel-next, button[aria-label*="Next"]');
    let timer;
    const start=()=>{ clearInterval(timer); if(next) timer=setInterval(()=>next.click(),4500); };
    ['pointerdown','touchstart'].forEach(ev=>portrait.addEventListener(ev,()=>clearInterval(timer),{passive:true}));
    ['pointerup','touchend'].forEach(ev=>portrait.addEventListener(ev,start,{passive:true}));
    portrait.addEventListener('mouseenter',()=>clearInterval(timer));
    portrait.addEventListener('mouseleave',start);
    start();
  }

  // Ensure testimonials continue to rotate automatically, preserving their existing 3-at-a-time layout.
  const testimonials = document.querySelector('.testimonials, #testimonials, [data-testimonials]');
  if (testimonials) {
    const next = testimonials.querySelector('[data-next], .next, .testimonial-next, button[aria-label*="Next"]');
    if (next && !testimonials.dataset.v3Auto) {
      testimonials.dataset.v3Auto='1';
      let t=setInterval(()=>next.click(),5500);
      testimonials.addEventListener('click',()=>{clearInterval(t); t=setInterval(()=>next.click(),5500);});
    }
  }
})();


/* V4 asset bindings */
document.querySelectorAll('.core-flip-card[data-flip-image]').forEach(card=>{
  card.style.setProperty('--flip-image', `url("${card.dataset.flipImage}")`);
});

// If known service image placeholders are present, replace them with actual uploaded media.
const v4ServiceImages = [
  'service-engine-work.jpg','service-diagnostics.jpg','service-aircon.jpg',
  'service-suspension.jpg','service-inspection.jpg','service-engine-cleaning.jpg'
];
document.querySelectorAll('#services .media-placeholder, #services [data-image]').forEach((el,i)=>{
  const src=v4ServiceImages[i % v4ServiceImages.length];
  el.style.backgroundImage=`url("${src}")`;
  el.classList.add('has-real-image');
});

// Messenger destination: use the official Underchargers Facebook username as web fallback.
document.querySelectorAll('a').forEach(a=>{
  const text=(a.textContent||'').trim().toLowerCase();
  if(text.includes('message us') || text.includes('consult our expert')){
    a.href='https://www.facebook.com/underchargersofficial';
    a.target='_blank';
    a.rel='noopener';
  }
});


/* V5 showcase auto-repeat behavior */
(() => {
  const stage = document.querySelector('.portrait-stage[data-carousel], [data-showcase], .portrait-showcase');
  if (!stage) return;

  const items = Array.from(stage.querySelectorAll('img'));
  if (items.length < 2) return;

  let index = 0;
  let timer = null;
  let paused = false;

  const render = () => {
    items.forEach((img, i) => {
      const delta = (i - index + items.length) % items.length;
      img.dataset.showcaseState = delta === 0 ? 'active' : delta === 1 ? 'next' : delta === items.length - 1 ? 'prev' : 'hidden';
    });
  };

  const next = () => { index = (index + 1) % items.length; render(); };
  const prev = () => { index = (index - 1 + items.length) % items.length; render(); };

  const start = () => {
    clearInterval(timer);
    if (!paused) timer = setInterval(next, 4500);
  };
  const manual = fn => { fn(); start(); };

  document.querySelectorAll('[data-carousel-next], .showcase-next').forEach(btn => btn.addEventListener('click', () => manual(next)));
  document.querySelectorAll('[data-carousel-prev], .showcase-prev').forEach(btn => btn.addEventListener('click', () => manual(prev)));

  stage.addEventListener('mouseenter', () => { paused = true; clearInterval(timer); });
  stage.addEventListener('mouseleave', () => { paused = false; start(); });
  stage.addEventListener('touchstart', () => { paused = true; clearInterval(timer); }, {passive:true});
  stage.addEventListener('touchend', () => { paused = false; start(); }, {passive:true});

  render();
  start();
})();


/* V7 showcase carousel */
(() => {
  const stage = document.querySelector('.portrait-stage[data-carousel], [data-showcase], .portrait-showcase');
  if (!stage) return;

  const items = [...stage.querySelectorAll('.showcase-media-item')];
  if (!items.length) return;

  let index = 0;
  let timer = null;
  let touchStartX = 0;

  const activate = (nextIndex) => {
    index = (nextIndex + items.length) % items.length;

    items.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-current', active ? 'true' : 'false');

      const video = item.querySelector('video');
      if (video) {
        if (active) {
          video.muted = true;
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

    const activeItem = items[index];
    const targetLeft = activeItem.offsetLeft - (stage.clientWidth - activeItem.clientWidth) / 2;
    stage.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  };

  const start = () => {
    stop();
    timer = setInterval(() => activate(index + 1), 4500);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  const reset = () => { activate(index); start(); };

  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);
  stage.addEventListener('touchstart', (e) => {
    stop();
    touchStartX = e.touches[0]?.clientX ?? 0;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const dx = endX - touchStartX;
    if (Math.abs(dx) > 45) activate(index + (dx < 0 ? 1 : -1));
    start();
  }, { passive: true });

  document.querySelectorAll('[data-carousel-prev],[data-showcase-prev],.showcase-prev').forEach(btn => {
    btn.addEventListener('click', () => { activate(index - 1); start(); });
  });
  document.querySelectorAll('[data-carousel-next],[data-showcase-next],.showcase-next').forEach(btn => {
    btn.addEventListener('click', () => { activate(index + 1); start(); });
  });

  activate(0);
  start();
})();


/* =========================================================
   V8 CMS / GOOGLE DRIVE INTEGRATION
========================================================= */
(() => {
  const endpoint = window.UC_CMS_ENDPOINT;
  if (!endpoint) return;

  const extractDriveId = value => {
    const raw = String(value || '');
    const match = raw.match(/\/d\/([\w-]+)/) || raw.match(/[?&]id=([\w-]+)/) || raw.match(/^([\w-]{20,})$/);
    return match ? match[1] : '';
  };

  // Google Drive's old `uc?export=view` endpoint is unreliable for direct browser embeds.
  // Images use Drive's thumbnail endpoint; videos use the public file-content endpoint.
  const driveDirect = (item, field = 'drive_url', mediaType = '') => {
    if (!item) return '';
    const id = item[field + '_id'] || extractDriveId(item[field]) || extractDriveId(item[field + '_view_url']);
    if (!id) return item[field] || '';
    const type = String(mediaType || item.media_type || '').toLowerCase();
    if (type === 'video') {
      return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`;
    }
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2400`;
  };

  const installMediaFallbacks = el => {
    if (!el) return;
    const id = extractDriveId(el.src || el.currentSrc || '');
    if (!id) return;
    if (el.tagName === 'IMG') {
      el.addEventListener('error', function retryImage() {
        el.removeEventListener('error', retryImage);
        el.src = `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}=w2400`;
      }, { once: true });
    } else if (el.tagName === 'VIDEO') {
      el.addEventListener('error', function retryVideo() {
        el.removeEventListener('error', retryVideo);
        el.src = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
        el.load();
      }, { once: true });
    }
  };

  const normalize = value => String(value || '').trim().toLowerCase();

  async function loadCMS() {
    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
      if (!res.ok) throw new Error(`CMS ${res.status}`);
      const payload = await res.json();
      if (!payload || !payload.ok || !payload.data) throw new Error('Invalid CMS response');
      applyCMS(payload.data);
      document.documentElement.dataset.cms = 'ready';
    } catch (err) {
      console.warn('[Underchargers CMS] Falling back to built-in content.', err);
      document.documentElement.dataset.cms = 'fallback';
    }
  }

  function applyCMS(data) {
    const settings = data.settings || {};
    if (settings.site_name) document.title = `${settings.site_name} | ${settings.tagline || 'First-Class Performance'}`;

    const services = Array.isArray(data.services) ? data.services : [];
    document.querySelectorAll('[data-cms-service]').forEach(img => {
      const service = services.find(x => normalize(x.service) === normalize(img.dataset.cmsService));
      const url = driveDirect(service, 'drive_url', 'image');
      if (url) { img.src = url; installMediaFallbacks(img); }
    });

    const media = Array.isArray(data.media) ? data.media : [];
    document.querySelectorAll('[data-cms-media-key]').forEach(el => {
      const wantedKey = normalize(el.dataset.cmsMediaKey);
      const wantedFile = normalize(el.dataset.cmsFilename);
      const item = media.find(x => normalize(x.key) === wantedKey) || (wantedFile ? media.find(x => normalize(x.file_name) === wantedFile) : null);
      const url = driveDirect(item, 'drive_url', el.tagName === 'VIDEO' ? 'video' : 'image');
      if (!url) return;
      if (el.tagName === 'VIDEO') {
        el.src = url;
        installMediaFallbacks(el);
        el.load();
        if (el.autoplay) el.play().catch(() => {});
      } else {
        el.src = url;
        installMediaFallbacks(el);
      }
    });

    renderShowcase(data, media);
    renderBranches(data.branches || []);
    renderTestimonialsFromCMS(data.testimonials || []);
  }

  function renderShowcase(data, media) {
    const stage = document.getElementById('showcase-stage');
    if (!stage) return;
    let items = (Array.isArray(data.showcase) ? data.showcase : []).slice();

    // Ensure the extra website-video copy of IMG_9453.MOV is available to Showcase,
    // but avoid a duplicate if it already exists in Showcase.
    const extra = media.find(x => normalize(x.file_name) === 'img_9453.mov' && normalize(x.media_type) === 'video');
    if (extra && !items.some(x => normalize(x.file_name) === 'img_9453.mov')) items.push(extra);

    if (!items.length) return;
    stage.innerHTML = '';
    items.forEach((item, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'showcase-media-item';
      wrap.dataset.showcaseIndex = index;
      const url = driveDirect(item, 'drive_url', normalize(item.media_type));
      if (normalize(item.media_type) === 'video') {
        const v = document.createElement('video');
        v.src = url;
        installMediaFallbacks(v);
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.preload = 'metadata';
        v.setAttribute('aria-label', item.caption || 'Underchargers workshop showcase video');
        wrap.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = url;
        installMediaFallbacks(img);
        img.loading = index < 2 ? 'eager' : 'lazy';
        img.alt = item.caption || 'Underchargers workshop showcase';
        wrap.appendChild(img);
      }
      stage.appendChild(wrap);
    });
    window.dispatchEvent(new CustomEvent('uc:showcase-rebuilt'));
  }

  function renderBranches(branches) {
    if (!Array.isArray(branches) || !branches.length) return;
    branches.forEach(branch => {
      const label = normalize(branch.branch);
      let target;
      if (label.includes('las')) target = document.querySelector('[data-image="branch-las-pinas.jpg"]');
      else if (label.includes('quezon')) target = document.querySelector('[data-image="branch-qc.jpg"]');
      else if (label.includes('mandaluyong')) target = document.querySelector('[data-image="branch-mandaluyong.jpg"]');
      const url = driveDirect(branch, 'drive_url', 'image');
      if (target && url) {
        target.style.backgroundImage = `url("${url}")`;
        target.classList.add('has-drive-image');
        const span = target.querySelector('span');
        if (span) span.remove();
      }
    });
  }

  function renderTestimonialsFromCMS(items) {
    if (!Array.isArray(items) || !items.length) return;
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach(item => {
      const article = document.createElement('article');
      article.className = 'review-card';
      const name = item.name || 'Underchargers Client';
      const initials = name.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();
      article.innerHTML = `<div class="testimonial-avatar">${initials}</div><p>“${String(item.review || '').replace(/[<>]/g,'')}”</p><strong>${String(name).replace(/[<>]/g,'')}</strong>`;
      grid.appendChild(article);
    });
  }

  document.addEventListener('DOMContentLoaded', loadCMS, { once: true });
})();

/* Re-initialize V8 Showcase cleanly after CMS rebuild. */
(() => {
  let timer;
  const setup = () => {
    const stage = document.getElementById('showcase-stage');
    if (!stage) return;
    const items = [...stage.querySelectorAll('.showcase-media-item')];
    if (!items.length) return;
    clearInterval(timer);
    let index = 0;
    const activate = i => {
      index = (i + items.length) % items.length;
      items.forEach((item, idx) => {
        const active = idx === index;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-current', active ? 'true' : 'false');
        const v = item.querySelector('video');
        if (v) active ? v.play().catch(() => {}) : v.pause();
      });
      const item = items[index];
      stage.scrollTo({ left: item.offsetLeft - (stage.clientWidth - item.clientWidth) / 2, behavior: 'smooth' });
    };
    activate(0);
    timer = setInterval(() => activate(index + 1), 4500);
    let sx = 0;
    stage.ontouchstart = e => { sx = e.touches[0].clientX; clearInterval(timer); };
    stage.ontouchend = e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) activate(index + (dx < 0 ? 1 : -1)); timer = setInterval(() => activate(index + 1), 4500); };
  };
  document.addEventListener('DOMContentLoaded', setup);
  window.addEventListener('uc:showcase-rebuilt', setup);
})();


/* V8.3 franchise inclusion modal: actual clickable controls with X / backdrop / Escape. */
(() => {
  const modal=document.getElementById('inclusion-modal');
  if(!modal) return;
  const title=modal.querySelector('#inclusion-modal-title');
  const text=modal.querySelector('#inclusion-modal-text');
  const image=modal.querySelector('#inclusion-modal-image');
  const closeBtn=modal.querySelector('.inclusion-modal-close');
  const items=[
    ['Basic tools & equipment','Core workshop tools and equipment form part of the operating setup.','1cvzjKzr6Djd2vdy90ZonkTxl2TVc3oah'],
    ['Book of Standards','The operating system documents the service and brand standards used across the network.','1tb4kmBkcLSQdeEVEBaUGa3bEuP54W5Gh'],
    ['Initial training','Initial training helps the franchise team prepare for Underchargers operating standards.','1ZwZeKNDNMUboi0AUpVyj_lnrbnx8gV2J'],
    ['Endorsed mechanics','Staffing support includes access to endorsed mechanics for branch operations.','1wAa3RotOSS-QsmhK4Et6ibyX_x9zxQvk'],
    ['Supplier network','The franchise system includes access to the established supplier network.','1D7a7BPWKk4EVEMp2QtuICdS-i2_4Gxwn'],
    ['Marketing support','Brand and marketing support helps the branch launch and communicate consistently.','14oMnTqdnYDmusI5qPEuw6WohO9gPmJ9Q']
  ];
  const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';};
  document.querySelectorAll('.inclusion-item').forEach((btn,i)=>btn.addEventListener('click',()=>{
    const d=items[i]||items[0]; title.textContent=d[0]; text.textContent=d[1];
    image.src=`https://drive.google.com/thumbnail?id=${d[2]}&sz=w1800`; image.alt=`Underchargers — ${d[0]}`;
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeBtn.focus();
  }));
  closeBtn?.addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
})();


/* V8.4 hero media hardening: exact synced filename + exact Drive ID fallback. */
(() => {
  const hero=document.querySelector('.home-hero .hero-video');
  if(!hero) return;
  const id='1ZXaIgjmaovs3SDMJewGOpYwCuIIr0UnB';
  const sources=[
    `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${id}`
  ];
  let fallbackIndex=0;
  const tryPlay=()=>{hero.muted=true;hero.defaultMuted=true;const p=hero.play();if(p&&p.catch)p.catch(()=>{});};
  const useNext=()=>{
    if(fallbackIndex>=sources.length) return;
    const next=sources[fallbackIndex++];
    if(hero.src!==next){hero.src=next;hero.load();}
    tryPlay();
  };
  hero.addEventListener('loadeddata',tryPlay);
  hero.addEventListener('canplay',tryPlay);
  hero.addEventListener('error',useNext);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tryPlay();});
  window.addEventListener('pageshow',tryPlay);
  setTimeout(()=>{if(hero.readyState<2) useNext(); else tryPlay();},2200);
})();
