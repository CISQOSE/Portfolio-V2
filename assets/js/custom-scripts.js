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


  /* ── Menu mobile — fermeture au clic sur un lien ──────────────────── */
  $(document).on('click', '.navbar-nav .nav-link', function () {
    var $toggle = $('.navbar-toggler');
    var $collapse = $('.navbar-collapse');
    if ($collapse.hasClass('show')) {
      $toggle.click();
    }
  });

  /* Fermeture en cliquant en dehors du menu */
  $(document).on('click', function (e) {
    var $collapse = $('.navbar-collapse');
    if ($collapse.hasClass('show')) {
      var $nav = $('.mh-nav');
      if (!$nav.is(e.target) && $nav.find(e.target).length === 0) {
        $('.navbar-toggler').click();
      }
    }
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

  /* ── Owl Carousel — témoignages ──────────────────────────────────── */
  var $review = $('#mh-client-review');
  if ($review.length && typeof $.fn.owlCarousel !== 'undefined') {
    $review.owlCarousel({
      loop               : true,
      margin             : 24,
      nav                : false,
      dots               : true,
      autoplay           : true,
      autoplayTimeout    : 5000,
      autoplayHoverPause : true,
      smartSpeed         : 600,
      responsive: {
        0   : { items: 1 },
        576 : { items: 1 },
        768 : { items: 2 },
        992 : { items: 3 }
      }
    });
  }

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
