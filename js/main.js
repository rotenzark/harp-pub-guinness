/* ============ HARP PUB GUINNESS · main.js ============ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- INTRO ---- */
  var intro = document.getElementById('intro');
  function closeIntro() { if (intro) { intro.classList.add('done'); setTimeout(function () { intro.style.display = 'none'; }, 800); } }
  if (intro) {
    if (reduce) { intro.style.display = 'none'; }
    else {
      document.getElementById('intro-skip').addEventListener('click', closeIntro);
      setTimeout(closeIntro, 3600);
    }
  }

  /* ---- HEADER scroll ---- */
  var header = document.getElementById('site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- MOBILE NAV ---- */
  var burger = document.getElementById('burger'), nav = document.querySelector('.nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = ''; });
  });

  /* ---- REVEAL ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
    // watchdog
    setTimeout(function () { reveals.forEach(function (r) { if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('in'); }); }, 1500);
  } else { reveals.forEach(function (r) { r.classList.add('in'); }); }

  /* ---- DYNAMIC HOURS ---- */
  function romeNow() { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' })); }
  function isOpen(d) {
    var day = d.getDay(), h = d.getHours() + d.getMinutes() / 60;
    if (day >= 1 && day <= 5 && h >= 11) return true;       // Mon–Fri 11:00 → midnight
    if (day >= 2 && day <= 6 && h < 1) return true;         // Tue–Sat 00:00–00:59 (tail of Mon–Fri)
    return false;
  }
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function nextOpenDay(day) { // day 0-6, returns index of next Mon-Fri (today counts handled by caller)
    for (var i = 0; i < 7; i++) { var d = (day + i) % 7; if (d >= 1 && d <= 5) return { d: d, off: i }; }
    return { d: 1, off: 0 };
  }
  function updateLive() {
    var d = romeNow(), open = isOpen(d), dot = document.getElementById('live-dot'), txt = document.getElementById('live-text');
    if (!dot) return;
    var en = LANG === 'en';
    if (open) {
      dot.className = 'open';
      txt.textContent = en ? 'Open now · closes at 01:00' : 'Aperto ora · chiude all’01:00';
    } else {
      dot.className = 'closed';
      var day = d.getDay(), h = d.getHours() + d.getMinutes() / 60, info;
      if (day >= 1 && day <= 5 && h < 11) info = { d: day, off: 0 }; else info = nextOpenDay((day + 1) % 7);
      var name = info.off === 0 ? (en ? 'today' : 'oggi') : (en ? DAYS_EN[info.d] : DAYS_IT[info.d]);
      txt.textContent = (en ? 'Closed · opens ' + name + ' at 11:00' : 'Chiuso · apre ' + name + ' alle 11:00');
    }
    // highlight today's chip
    document.querySelectorAll('.day').forEach(function (c) {
      c.classList.toggle('today', parseInt(c.getAttribute('data-day'), 10) === d.getDay());
    });
  }

  /* ---- LIGHTBOX ---- */
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lb-img');
  document.querySelectorAll('.g-item').forEach(function (fig) {
    fig.addEventListener('click', function () {
      lbImg.src = fig.getAttribute('data-full'); lbImg.alt = (fig.querySelector('img') || {}).alt || '';
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    });
  });
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); setTimeout(function () { lbImg.src = ''; }, 300); }
  document.getElementById('lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ---- i18n (EN overlay on IT DOM) ---- */
  var LANG = 'it';
  var EN = {
    'brand.sub': 'Guinness · since 1976',
    'nav.rito': 'The pour', 'nav.scaffale': 'The shelf', 'nav.lavagna': 'Kitchen', 'nav.orari': 'Hours', 'nav.gallery': 'Gallery', 'nav.dove': 'Find us',
    'cta.call': 'Call', 'intro.count': '119.5″', 'intro.skip': 'Enter →',
    'hero.eyebrow': 'Piazza Leonardo da Vinci · Milan',
    'hero.h1a': 'The ritual of the', 'hero.h1b': 'perfect pint',
    'hero.sub': "The Politecnico's pub since 1976: 200+ whisky labels, Guinness on tap and piadine late into the night. Monday to Friday, at the far end of the square.",
    'hero.cta1': 'Call & book', 'hero.cta2': 'See the place', 'hero.live': 'Checking hours…',
    'rito.kicker': 'The pour', 'rito.h2': 'A hundred and nineteen and a half seconds.',
    'rito.lead': "The perfect pint isn't poured — it's waited for. The time Guinness needs to settle, honoured here for half a century.",
    'rito.s1t': 'Pull at 45°', 'rito.s1p': 'Glass tilted, up to three quarters. Then stop.',
    'rito.s2t': 'Let it settle', 'rito.s2p': 'The cascade falls, the head firms up. A hundred and nineteen and a half seconds of patience.',
    'rito.s3t': 'Top it straight', 'rito.s3p': 'Up to the ivory collar, just above the rim. Served.',
    'rito.cap': 'Guinness on tap & piadine — the counter classic.',
    'scaffale.ghost': 'THE BACKBAR', 'scaffale.kicker': 'The shelf', 'scaffale.h2': 'Two hundred bottles on the backbar.', 'scaffale.lead': 'Scroll the shelf →',
    'shelf.1t': 'Whisky', 'shelf.1p': 'Over 200 labels: peated Islay, Speyside, rare malts. Plus our tasting nights.', 'shelf.1tag': 'Laphroaig · Talisker · Lagavulin · Bunnahabhain',
    'shelf.2t': 'Rum, Spirits & Amari', 'shelf.2p': 'A wall of bottles: aged rums, gin, spirits and after-dinner amari.', 'shelf.2tag': 'From shelf to glass',
    'shelf.3t': 'Gin Tonic & Cocktails', 'shelf.3p': 'Negroni, gin tonic, signatures. Made properly, no rush.', 'shelf.3tag': 'Classic & signature',
    'shelf.4t': 'Beers & Guinness', 'shelf.4p': 'Guinness on tap, plus seasonal beers on tap and in bottle.', 'shelf.4tag': 'Stout · Ale · seasonal',
    'lavagna.kicker': 'The kitchen, on the board', 'lavagna.h2': 'Food served late',
    'lav.1t': 'Custom piadine', 'lav.1p': 'you build them, at the counter', 'lav.2t': 'Sharing boards', 'lav.2p': 'included with aperitivo',
    'lav.3t': 'Panini & Quesadillas', 'lav.3p': 'hot, for the evening', 'lav.4t': 'Quick lunch', 'lav.4p': 'steps from the Politecnico',
    'lavagna.note': 'The menu changes; prices are indicative — just ask at the counter.',
    'orari.ghost': 'MON–FRI', 'orari.kicker': 'Hours', 'orari.h2': 'Monday to Friday.<br>Weekends off.',
    'day.mon': 'Mon', 'day.tue': 'Tue', 'day.wed': 'Wed', 'day.thu': 'Thu', 'day.fri': 'Fri', 'day.sat': 'Sat', 'day.sun': 'Sun', 'day.closed': 'closed',
    'orari.foot': 'For info and bookings',
    'gallery.kicker': 'Gallery', 'gallery.h2': 'Inside the pub',
    'rev.kicker': 'At the counter', 'rev.h2': 'What people say', 'rev.count': '1,144 reviews on Google',
    'dove.kicker': 'Find us', 'dove.h2': 'At the end of the square,<br>facing the Politecnico.',
    'dove.addr': 'Address', 'dove.near': 'at Albergo Leonardo Da Vinci', 'dove.hours': 'Hours', 'dove.hoursv': 'Mon–Fri 11:00–01:00 · Sat & Sun closed',
    'dove.phone': 'Phone', 'dove.route': 'Get directions', 'dove.call': 'Call',
    'faq.h2': 'Frequently asked',
    'faq.q1': 'Where is the Harp Pub?', 'faq.a1': 'At Piazza Leonardo da Vinci 10, facing the Politecnico (at the Albergo Leonardo Da Vinci).',
    'faq.q2': 'When are you open?', 'faq.a2': 'Monday to Friday, 11:00 to 01:00. Closed Saturday and Sunday.',
    'faq.q3': 'Is there food?', 'faq.a3': 'Yes: custom piadine, sharing boards, panini and quesadillas, from a quick lunch to late night.',
    'faq.q4': 'Do you do whisky tastings?', 'faq.a4': 'Yes. The backbar holds 200+ labels and we run tasting nights.',
    'faq.q5': 'How do I book a table?', 'faq.a5': 'Call 02 3668 6194. In summer there are tables outside on the square.',
    'foot.contact': 'Contact', 'foot.where': 'Where', 'foot.hours': 'Hours', 'foot.weekend': 'Sat & Sun closed',
    'foot.disclaimer': 'Demo website. Content and photos gathered from public sources (Google Maps, Instagram); some details and prices are indicative, to be confirmed with the venue.',
    'ab.call': 'Call', 'ab.route': 'Directions'
  };
  var IT = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { IT[el.getAttribute('data-i18n')] = el.innerHTML; });
  function setLang(lang) {
    LANG = lang;
    var dict = lang === 'en' ? EN : IT;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); var v = dict[k];
      if (v == null && lang === 'en') v = IT[k];
      if (v != null) el.innerHTML = v;
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
    updateLive();
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---- INIT ---- */
  updateLive();
  setInterval(updateLive, 60000);
})();
