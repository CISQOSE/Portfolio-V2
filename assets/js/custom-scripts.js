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

  /* ── Active nav on scroll ─────────────────────────────────────────── */
  $(window).on('scroll.active', function () {
    var scrollPos = $(document).scrollTop() + 80;
    $('nav a[href^="#"]').each(function () {
      var $section = $($(this).attr('href'));
      if (!$section.length) return;
      var top    = $section.offset().top;
      var bottom = top + $section.outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        $('nav .nav-item').removeClass('active');
        $(this).closest('.nav-item').addClass('active');
      }
    });
  });

  /* ── Owl Carousel — testimonials ──────────────────────────────────── */
  var $review = $('#mh-client-review');
  if ($review.length && typeof $.fn.owlCarousel !== 'undefined') {
    $review.owlCarousel({
      loop:               true,
      margin:             24,
      nav:                false,
      dots:               true,
      autoplay:           true,
      autoplayTimeout:    4500,
      autoplayHoverPause: true,
      smartSpeed:         600,
      responsive: {
        0:   { items: 1 },
        576: { items: 2 },
        992: { items: 3 }
      }
    });
  }

  /* ── Skills — run once when section is visible ────────────────────── */
  var skillsDone = false;

  function initSkills() {
    if (skillsDone) return;
    skillsDone = true;

    /* Progress bars — animate width from 0 */
    $('.percentagem').each(function () {
      var targetW = $(this).css('width'); // already set inline
      $(this).css('width', 0).stop(true).animate({ width: targetW }, {
        duration: 1100,
        easing:   'swing',
        step: function (now, fx) {
          /* live gradient shift */
          $(this).css('background', 'linear-gradient(90deg, #00e5c3, #0099ff)');
        }
      });
    });

    /* Animate skill stack fill bars */
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
