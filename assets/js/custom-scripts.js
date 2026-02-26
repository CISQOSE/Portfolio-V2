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

  /* ── Salutation dynamique selon l'heure ──────────────────────────── */
  (function () {
    var hour = new Date().getHours();
    var greeting = (hour >= 6 && hour < 18) ? 'Bonjour · je suis' : 'Bonsoir · je suis';
    var $promo = $('.mh-promo span');
    if ($promo.length) $promo.text(greeting);
  })();

  /* ── Sticky nav ───────────────────────────────────────────────────── */
  var $header = $('#mh-header');
  $(window).on('scroll.nav', function () {
    $header.toggleClass('nav-scroll', $(this).scrollTop() > 60);
  });

  /* ── Menu mobile — ouverture & fermeture DOM pure ───────────────── */
  var $nav      = $('#navbarSupportedContent');
  var $toggler  = $('.navbar-toggler');

  function showMenu() {
    $nav.addClass('show');
    $toggler.attr('aria-expanded', 'true').addClass('active');
  }

  function hideMenu() {
    $nav.removeClass('show');
    $toggler.attr('aria-expanded', 'false').removeClass('active');
  }

  function menuIsOpen() {
    return $nav.hasClass('show');
  }

  /* Clic sur le bouton hamburger : toggle */
  $toggler.on('click', function (e) {
    e.stopPropagation();
    if (menuIsOpen()) { hideMenu(); } else { showMenu(); }
  });

  /* Clic sur un lien dans le menu : fermer immédiatement */
  $nav.on('click', '.nav-link', function () {
    if (menuIsOpen()) { hideMenu(); }
  });

  /* Clic en dehors de la navbar : fermer */
  $(document).on('click touchstart', function (e) {
    if (menuIsOpen() && !$(e.target).closest('#mh-header').length) {
      hideMenu();
    }
  });

  /* ── Smooth scroll — fermer menu PUIS scroller ────────────────────── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var hash    = this.hash;
    var $target = $(hash);
    if (!$target.length) return;
    e.preventDefault();

    var wasOpen = menuIsOpen();
    if (wasOpen) { hideMenu(); }

    setTimeout(function () {
      $('html, body').animate({ scrollTop: $target.offset().top - 72 }, 500, 'swing');
    }, wasOpen ? 300 : 0);
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

  /* ── Contact form — Vercel Serverless API ─────────────────────────── */
  var form       = document.getElementById('contactForm');
  var msg        = document.getElementById('msgSubmit');
  var submitBtn  = document.getElementById('form-submit');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var prenom  = (document.getElementById('prenom')  || {}).value  || '';
      var nom     = (document.getElementById('nom')     || {}).value  || '';
      var email   = (document.getElementById('email')   || {}).value  || '';
      var message = (document.getElementById('message') || {}).value  || '';

      /* Validation minimale côté client */
      if (!prenom || !email || !message) {
        showContactMsg('error', '⚠️ Veuillez remplir tous les champs obligatoires.');
        return;
      }

      /* État chargement */
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Envoi en cours… <i class=\"fa-solid fa-spinner fa-spin\"></i>';
      }

      fetch('/api/contact', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ prenom: prenom, nom: nom, email: email, message: message })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showContactMsg('success', '✅ Message envoyé ! Je vous répondrai très bientôt.');
          form.reset();
        } else {
          showContactMsg('error', '❌ ' + (data.error || "Erreur lors de l\'envoi. Réessayez."));
        }
      })
      .catch(function () {
        showContactMsg('error', '❌ Connexion impossible. Vérifiez votre réseau et réessayez.');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Envoyer &nbsp;<i class=\"fa-solid fa-paper-plane\"></i>';
        }
      });
    });
  }

  /* Helper notification */
  function showContactMsg(type, text) {
    if (!msg) return;
    msg.className = 'contact-msg contact-msg--' + type;
    msg.textContent = text;
    msg.style.display = 'block';
    msg.style.opacity = '1';
    clearTimeout(msg._hideTimer);
    msg._hideTimer = setTimeout(function () {
      msg.style.transition = 'opacity 0.5s';
      msg.style.opacity = '0';
      setTimeout(function () {
        msg.style.display = 'none';
        msg.style.opacity = '';
      }, 500);
    }, 6000);
  }

  /* ── Theme toggle — clair / sombre ───────────────────────────────── */
  var $body      = $('body');
  var $toggleBtn = $('#themeToggle');
  var $ttLabel   = $('#ttLabel');

  function applyTheme(theme) {
    if (theme === 'light') {
      $body.addClass('light-theme');
      $ttLabel.text('Mode sombre');
    } else {
      $body.removeClass('light-theme');
      $ttLabel.text('Mode clair');
    }
  }

  // Sombre par défaut, restaurer la préférence
  applyTheme(localStorage.getItem('shanks-theme') || 'dark');

  $toggleBtn.on('click', function (e) {
    e.stopPropagation();
    var next = $body.hasClass('light-theme') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('shanks-theme', next);
  });

  })(jQuery);