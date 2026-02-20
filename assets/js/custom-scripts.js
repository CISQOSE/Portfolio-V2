/* =====================================================================
   SHANKS_DEV — custom-scripts.js  v2
   ===================================================================== */

(function ($) {
  'use strict';

  /* ── WOW.js ───────────────────────────────────────────────────────── */
  if (typeof WOW !== 'undefined') {
    new WOW({
      offset:   80,
      mobile:   false,
      duration: '0.7s'
    }).init();
  }

  /* ── Sticky nav ───────────────────────────────────────────────────── */
  var $header = $('#mh-header');
  $(window).on('scroll.nav', function () {
    $header.toggleClass('nav-scroll', $(this).scrollTop() > 60);
  });

  /* ── Smooth scroll ────────────────────────────────────────────────── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var hash   = this.hash;
    var $target = $(hash);
    if (!$target.length) return;
    e.preventDefault();
    $('html, body').animate({ scrollTop: $target.offset().top - 72 }, 550, 'swing');
    $('.navbar-collapse').collapse('hide');
  });

  /* ── Active nav on scroll — moving underline ─────────────────────── */
  function updateActiveNav() {
    var scrollPos = $(document).scrollTop() + 120;
    var $navLinks  = $('nav a[href^="#"]');

    // Build sorted section list
    var sections = [];
    $navLinks.each(function () {
      var hash     = $(this).attr('href');
      var $section = $(hash);
      if ($section.length) {
        sections.push({
          link : $(this),
          top  : $section.offset().top
        });
      }
    });
    sections.sort(function (a, b) { return a.top - b.top; });

    // Active = last section whose top <= scrollPos
    var active = null;
    for (var i = 0; i < sections.length; i++) {
      if (scrollPos >= sections[i].top) {
        active = sections[i];
      }
    }

    // If nothing matched (user is above everything), use first
    if (!active && sections.length) active = sections[0];

    if (active) {
      $('nav .nav-item').removeClass('active');
      active.link.closest('.nav-item').addClass('active');
    }
  }

  $(window).on('scroll.active', updateActiveNav);
  // Also run on page load after layout settles
  $(window).on('load', updateActiveNav);
  setTimeout(updateActiveNav, 400);

  /* ── Testimonials — horizontal slider ────────────────────────────── */
  (function () {
    var track     = document.getElementById('testi-track');
    var dotsWrap  = document.getElementById('testi-dots');
    var btnPrev   = document.getElementById('testi-prev');
    var btnNext   = document.getElementById('testi-next');
    if (!track) return;

    var cards     = track.querySelectorAll('.testi-card');
    var dots      = dotsWrap ? dotsWrap.querySelectorAll('.testi-dot') : [];
    var total     = cards.length;
    var current   = 0;
    var autoTimer = null;
    var visibleCount = 3; // desktop default

    function getVisible() {
      var w = window.innerWidth;
      if (w <= 575)  return 1;
      if (w <= 991)  return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, total - getVisible());
    }

    function goTo(idx) {
      visibleCount = getVisible();
      var max = getMaxIndex();
      current = Math.max(0, Math.min(idx, max));

      // Calc card width + gap
      var cardEl   = cards[0];
      var gap      = 20; // 1.25rem ≈ 20px
      var cardW    = cardEl.getBoundingClientRect().width;
      var offset   = current * (cardW + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';

      // Update dots
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === current);
      }

      // Update buttons
      if (btnPrev) btnPrev.disabled = (current === 0);
      if (btnNext) btnNext.disabled = (current >= max);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () {
        if (current >= getMaxIndex()) goTo(0);
        else next();
      }, 4500);
    }
    function stopAuto() { clearInterval(autoTimer); }

    // Buttons
    if (btnNext) btnNext.addEventListener('click', function () { next(); startAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', function () { prev(); startAuto(); });

    // Dots
    for (var d = 0; d < dots.length; d++) {
      (function(i) {
        dots[i].addEventListener('click', function () { goTo(i); startAuto(); });
      })(d);
    }

    // Drag / swipe
    var dragStart = null, dragX = 0;
    track.addEventListener('mousedown', function (e) {
      dragStart = e.clientX; track.classList.add('grabbing'); stopAuto();
    });
    document.addEventListener('mouseup', function (e) {
      if (dragStart === null) return;
      dragX = e.clientX - dragStart; dragStart = null;
      track.classList.remove('grabbing');
      if (dragX < -50)       next();
      else if (dragX > 50)   prev();
      startAuto();
    });
    track.addEventListener('touchstart', function (e) { dragStart = e.touches[0].clientX; stopAuto(); }, {passive:true});
    track.addEventListener('touchend', function (e) {
      if (dragStart === null) return;
      dragX = e.changedTouches[0].clientX - dragStart; dragStart = null;
      if (dragX < -50)       next();
      else if (dragX > 50)   prev();
      startAuto();
    }, {passive:true});

    // Pause on hover
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    // Recalc on resize
    window.addEventListener('resize', function () { goTo(Math.min(current, getMaxIndex())); });

    // Init
    goTo(0);
    startAuto();
  })();

  /* ── Owl Carousel — legacy (disabled, replaced by custom slider) ───── */

  /* ── Skills — run once when section is visible ────────────────────── */
  var skillsDone = false;

  function initSkills() {
    if (skillsDone) return;
    skillsDone = true;

    /* Animate sk2-fill progress bars */
    $('.sk2-fill').each(function () {
      var $bar  = $(this);
      var width = parseInt($bar.data('width'), 10) || 0;
      $bar.css('width', 0).animate({ width: width + '%' }, {
        duration: 1100,
        easing:   'swing'
      });
    });

    /* Legacy: Progress bars — animate width from 0 */
    $('.percentagem').each(function () {
      var targetW = $(this).css('width');
      $(this).css('width', 0).stop(true).animate({ width: targetW }, {
        duration: 1100,
        easing:   'swing',
        step: function (now) {
          $(this).css('background', 'linear-gradient(90deg, #00e5c3, #0099ff)');
        }
      });
    });

    /* Legacy: skill-stack-fill bars */
    $('.skill-stack-fill').each(function () {
      var $bar  = $(this);
      var width = parseInt($bar.data('width'), 10) || 0;
      $bar.css('width', 0).animate({ width: width + '%' }, {
        duration: 1100,
        easing:   'swing'
      });
    });
  }

  /* Trigger skills on scroll */
  function checkSkillsVisible() {
    var $skills = $('#mh-skills');
    if (!$skills.length) return;
    var top    = $skills.offset().top;
    var bottom = $(window).scrollTop() + $(window).height();
    if (bottom > top + 80) {
      initSkills();
      $(window).off('scroll.skills');
    }
  }
  $(window).on('scroll.skills', checkSkillsVisible);
  checkSkillsVisible(); // in case already visible on load

  /* ── Contact form ─────────────────────────────────────────────────── */
  var form = document.getElementById('contactForm');
  var msg  = document.getElementById('msgSubmit');

  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.classList.remove('hidden');
      msg.textContent = 'Message envoyé avec succès ! Redirection…';
      setTimeout(function () { form.submit(); }, 1400);
    });
  }

})(jQuery);
