// Dohyeon — shared interactions

document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Nav active state
  var path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (href.endsWith('/') && path.endsWith(href))) {
      a.classList.add('active');
    }
  });

  // Project filter tabs (Projects page) — remembers the last selected
  // filter in sessionStorage so it's restored when navigating back from
  // a project detail page instead of resetting to "All".
  var filterTabs = document.querySelectorAll('.filter-tab');
  var filterGrid = document.querySelector('#project-grid');
  if (filterTabs.length && filterGrid) {
    var filterCards = filterGrid.querySelectorAll('.project-card');
    var filterCategories = Array.prototype.map.call(filterTabs, function (t) {
      return t.getAttribute('data-filter');
    }).filter(function (f) { return f !== 'all'; });
    var applyFilter = function (filter) {
      filterTabs.forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-filter') === filter);
      });
      filterCards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        var match = filter === 'all'
          ? filterCategories.indexOf(category) !== -1
          : category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    };
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = tab.getAttribute('data-filter');
        try { sessionStorage.setItem('projectFilter', filter); } catch (e) {}
        applyFilter(filter);
      });
    });
    var savedFilter = 'all';
    try { savedFilter = sessionStorage.getItem('projectFilter') || 'all'; } catch (e) {}
    applyFilter(savedFilter);
  }

  // Contact form — submits to Jotform via fetch so the page doesn't reload.
  // Jotform's submit endpoint is cross-origin and doesn't return readable
  // CORS headers, so we send it in "no-cors" mode: we can't read the actual
  // response, but if the request doesn't throw, we treat it as sent.
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var status = document.querySelector('#form-status');
      var originalBtn = btn.textContent;
      var originalStatus = status ? status.textContent : '';
      btn.disabled = true;
      btn.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(form)
      })
        .then(function () {
          btn.textContent = 'Sent ✓';
          if (status) status.textContent = "Thanks — I'll get back to you soon.";
          form.reset();
        })
        .catch(function (err) {
          btn.textContent = 'Try again';
          if (status) status.textContent = err.message || 'Something went wrong — please try again.';
        })
        .finally(function () {
          btn.disabled = false;
          setTimeout(function () {
            btn.textContent = originalBtn;
            if (status) status.textContent = originalStatus;
          }, 3500);
        });
    });
  }
});
