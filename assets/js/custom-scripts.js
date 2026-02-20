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

  /* ── Testimonials — scroll natif (v4) ────────────────────────────── */
  (function () {
    var wrap    = document.querySelector('.testi-track-wrap');
    var track   = document.getElementById('testi-track');
    var dotsEl  = document.getElementById('testi-dots');
    var btnP    = document.getElementById('testi-prev');
    var btnN    = document.getElementById('testi-next');
    if (!track || !wrap) return;

    var dots   = dotsEl ? dotsEl.querySelectorAll('.testi-dot') : [];
    var timer  = null;
    var DELAY  = 5000;

    /* Largeur d'un pas = 1 card + gap */
    function stepW() {
      var card = track.querySelector('.testi-card');
      if (!card) return wrap.offsetWidth;
      var gap = 20;
      var vis = window.innerWidth <= 575 ? 1 : (window.innerWidth <= 991 ? 2 : 3);
      return (wrap.offsetWidth - gap * (vis - 1)) / vis + gap;
    }

    /* Index courant basé sur scrollLeft */
    function getIdx() {
      return Math.round(track.scrollLeft / stepW());
    }

    /* Nb max d'index */
    function getMax() {
      var vis = window.innerWidth <= 575 ? 1 : (window.innerWidth <= 991 ? 2 : 3);
      return Math.max(0, track.querySelectorAll('.testi-card').length - vis);
    }

    /* Aller à un index */
    function goTo(idx) {
      var max = getMax();
      idx = Math.max(0, Math.min(idx, max));
      track.scrollTo({ left: idx * stepW(), behavior: 'smooth' });
    }

    /* Mettre à jour dots + boutons */
    function updateUI() {
      var idx = getIdx();
      var max = getMax();
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === idx);
      }
      if (btnP) btnP.disabled = (idx <= 0);
      if (btnN) btnN.disabled = (idx >= max);
    }

    /* Auto */
    function startAuto() {
      stopAuto();
      timer = setInterval(function () {
        var idx = getIdx();
        goTo(idx >= getMax() ? 0 : idx + 1);
      }, DELAY);
    }
    function stopAuto() { clearInterval(timer); timer = null; }

    /* Boutons */
    if (btnN) btnN.addEventListener('click', function (e) {
      e.preventDefault(); goTo(getIdx() + 1); startAuto();
    });
    if (btnP) btnP.addEventListener('click', function (e) {
      e.preventDefault(); goTo(getIdx() - 1); startAuto();
    });

    /* Dots */
    for (var d = 0; d < dots.length; d++) {
      (function (i) {
        dots[i].addEventListener('click', function () { goTo(i); startAuto(); });
      })(d);
    }

    /* Sync dots/boutons au scroll */
    track.addEventListener('scroll', updateUI, { passive: true });

    /* Pause hover */
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);

    /* Resize */
    window.addEventListener('resize', function () {
      updateUI();
    });

    /* Init après layout */
    setTimeout(function () {
      goTo(0);
      updateUI();
      startAuto();
    }, 200);
  })();


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
