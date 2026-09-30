// ---------- Render helpers ----------
// Turn the data arrays in content/*.js into the same markup the page used
// to have hand-written inline. Each render* function fills one mount point
// (an empty element with an id) found in index.html.

function renderPublications(mountId, items) {
  var el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = items.map(function (item) {
    var whenHTML = item.venue
      ? item.when + '<br><span class="venue">' + item.venue + '</span>'
      : item.when;
    var titleHTML = item.href
      ? '<a href="' + item.href + '" target="_blank" rel="noopener">' + item.title + '</a>'
      : item.title;
    return (
      '<div class="entry">' +
        '<div class="when">' + whenHTML + '</div>' +
        '<div>' +
          '<div class="title">' + titleHTML + '</div>' +
          '<div class="meta">' + item.meta + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function renderEntries(mountId, items) {
  var el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = items.map(function (item) {
    return (
      '<div class="entry">' +
        '<div class="when">' + item.when + '</div>' +
        '<div>' +
          '<div class="title">' + item.title + '</div>' +
          '<div class="meta">' + item.meta + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function renderTagList(mountId, items) {
  var el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = items.map(function (item) {
    return '<li>' + item.text + '<span class="tag">' + item.tag + '</span></li>';
  }).join('');
}

function renderSupervisionList(mountId, items) {
  var el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = items.map(function (item) {
    return '<li>' + item.name + ' — <em>' + item.title + '</em><span class="tag">' + item.tag + '</span></li>';
  }).join('');
}

function renderTools(mountId, items) {
  var el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = items.map(function (item) {
    return '<span class="tool' + (item.primary ? ' primary' : '') + '">' + item.label + '</span>';
  }).join('');
}

// ---------- Populate the page from content/*.js ----------
(function () {
  var content = window.SITE_CONTENT || {};
  var research = content.research || {};
  var teaching = content.teaching || {};
  var dataAnalytics = content.dataAnalytics || {};

  ['en', 'no'].forEach(function (lang) {
    var r = research[lang] || {};
    renderPublications('pub-list-' + lang, r.publications || []);
    renderEntries('wp-list-' + lang, r.workingPapers || []);
    renderEntries('talks-list-' + lang, r.talks || []);

    var t = teaching[lang] || {};
    renderTagList('lecturer-list-' + lang, t.lecturer || []);
    renderTagList('seminar-list-' + lang, t.seminar || []);
    renderSupervisionList('supervision-list-' + lang, t.supervision || []);

    var d = dataAnalytics[lang] || {};
    renderEntries('experience-list-' + lang, d.experience || []);
    renderTools('tools-list-' + lang, d.tools || []);
  });
})();

// ---------- Language toggle (EN / NO) ----------
(function () {
  var shell = document.querySelector('.shell');
  var buttons = document.querySelectorAll('.lang-btn');

  function setLang(lang) {
    shell.setAttribute('data-lang', lang);
    shell.setAttribute('lang', lang === 'no' ? 'nb' : 'en');
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === lang ? 'true' : 'false');
    });
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')); });
  });

  var saved = null;
  try { saved = localStorage.getItem('site-lang'); } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'no');
})();

// ---------- Mobile menu toggle ----------
(function () {
  var sidebar = document.getElementById('sidebar');
  var menuBtn = document.querySelector('.menu-toggle');

  function setMenu(open) {
    sidebar.setAttribute('data-menu', open ? 'open' : 'closed');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  menuBtn.addEventListener('click', function () {
    setMenu(sidebar.getAttribute('data-menu') !== 'open');
  });

  document.querySelectorAll('.sidenav a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
})();
