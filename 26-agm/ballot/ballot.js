/* 2026 AGM ballot.
   Sends one ballot as JSON to the Apps Script web app in 26-agm/ballot-script,
   which checks it and records it in the 2026 Google Form. Nothing is sent
   anywhere else. Choices are kept in sessionStorage so a reload, or a trip to
   the notes, doesn't lose them; they are cleared once the ballot is recorded.
   Add ?test to the address to send dry runs that are checked but not recorded. */
(function () {
  'use strict';

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4dCkBib40xD97LrEleUzTz55tSAJkxQlP34bbrKzYwLMf01P1l-MP5YblWRhnx3bR/exec';
  var FORM_URL = 'https://forms.gle/4aiR7DFHBDutPobf7';
  var HELP_EMAIL = 'ics-communications@icscanada.edu';
  var CLOSES_AT = Date.parse('2026-12-12T16:00:00-05:00');
  // The server decides when voting has closed. The device clock only hides the
  // ballot when it is a day past the deadline, so a fast clock can't shut a member out.
  var CLEARLY_CLOSED = CLOSES_AT + 864e5;
  var TIMEOUT_MS = 45000;
  var STORE = 'ics-agm-2026-ballot';
  var CAST = 'ics-agm-2026-cast';
  var TEST = /[?&]test\b/.test(location.search);

  var ITEMS = [
    { key: 'auditor', num: '1', label: 'Auditor for 2026–27' },
    { key: 'statements', num: '2', label: 'Audited financial statements, 2025–26' },
    { key: 'budget', num: '3', label: 'Operating budget, 2026–27' },
    { key: 'dejonge', num: '4a', label: 'Heidi De Jonge, Eastern Canada', region: 'Eastern Canada' },
    { key: 'tinsley', num: '4b', label: 'Jeremy Tinsley, BC and Western US', region: 'BC or the western US' },
    { key: 'barthel', num: '4c', label: 'Bob Barthel, Member-at-Large' }
  ];
  var CHOICE = { approve: 'Approve', reject: 'Do not approve' };

  var form = document.getElementById('ballot-form');
  var views = {};
  form.querySelectorAll('[data-view]').forEach(function (v) { views[v.getAttribute('data-view')] = v; });
  var countEl = form.querySelector('[data-count]');
  var errorBox = form.querySelector('[data-error]');
  var castBtn = form.querySelector('[data-cast]');
  var sendingRule = form.querySelector('[data-sending]');
  var fields = {
    name: document.getElementById('f-name'),
    email: document.getElementById('f-email'),
    signature: document.getElementById('f-signature')
  };
  var sending = false;

  form.hidden = false;
  if (TEST) document.querySelector('[data-testmode]').hidden = false;

  /* ------------------------------------------------------ storage */
  function load(key) {
    try { return JSON.parse(sessionStorage.getItem(key)) || null; } catch (e) { return null; }
  }
  function save(key, value) {
    try {
      if (value === null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* private mode: the page still works, it just forgets */ }
  }
  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'b-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  var state = load(STORE) || {};
  if (!state.id) state.id = newId();
  if (!state.votes) state.votes = {};

  function persist() {
    state.name = fields.name.value;
    state.email = fields.email.value;
    state.signature = fields.signature.value;
    save(STORE, state);
  }

  /* ------------------------------------------------------- votes */
  function choiceText(item, value) {
    if (!value) return '';
    if (value === 'region') return 'I don’t live in ' + item.region;
    return CHOICE[value];
  }

  function refresh() {
    var marked = 0;
    ITEMS.forEach(function (item) {
      var fs = form.querySelector('.bv[data-key="' + item.key + '"]');
      var value = state.votes[item.key] || '';
      fs.querySelectorAll('input').forEach(function (input) { input.checked = input.value === value; });
      fs.querySelector('.bv__clear').hidden = !value;
      if (value) marked++;
    });
    countEl.textContent = marked;
  }

  form.addEventListener('change', function (e) {
    var fs = e.target.closest('.bv');
    if (!fs || e.target.type !== 'radio') return;
    state.votes[fs.getAttribute('data-key')] = e.target.value;
    persist();
    refresh();
  });

  form.addEventListener('click', function (e) {
    var clear = e.target.closest('.bv__clear');
    if (clear) {
      var fs = clear.closest('.bv');
      delete state.votes[fs.getAttribute('data-key')];
      persist();
      refresh();
      fs.querySelector('input').focus();
      return;
    }
    var go = e.target.closest('[data-go]');
    if (go) {
      var target = go.getAttribute('data-go');
      if (target === 'review') renderReview(form.querySelector('[data-review]'));
      show(target);
      return;
    }
    if (e.target.closest('[data-again]')) {
      save(CAST, null);
      state = { id: newId(), votes: {} };
      fields.name.value = fields.email.value = fields.signature.value = '';
      save(STORE, state);
      refresh();
      show('mark');
    }
  });

  ['name', 'email', 'signature'].forEach(function (k) {
    fields[k].addEventListener('input', function () {
      persist();
      if (fields[k].getAttribute('aria-invalid') === 'true') clearFieldError(k);
    });
  });

  /* ------------------------------------------------------- views */
  function show(name) {
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
    var bal = document.getElementById('ballot');
    bal.scrollTop = 0;
    var heading = views[name].querySelector('h2');
    if (heading) heading.focus({ preventScroll: true });
    // On one column the panel sits above the notes; bring its top into view.
    var top = bal.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) bal.scrollIntoView({ block: 'start' });
  }

  function renderReview(list, votes) {
    votes = votes || state.votes;
    list.textContent = '';
    ITEMS.forEach(function (item) {
      var li = document.createElement('li');
      var num = document.createElement('span');
      num.className = 'rv__num';
      num.textContent = item.num;
      var label = document.createElement('span');
      label.className = 'rv__item';
      label.textContent = item.label;
      var choice = document.createElement('span');
      var text = choiceText(item, votes[item.key]);
      choice.className = 'rv__choice' + (text ? '' : ' is-blank');
      choice.textContent = text || 'Left blank';
      li.append(num, label, choice);
      list.appendChild(li);
    });
  }

  /* -------------------------------------------------- validation */
  function fieldError(k, message) {
    var input = fields[k];
    input.setAttribute('aria-invalid', 'true');
    var msg = document.getElementById(input.id + '-error');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'af-error-msg';
      msg.id = input.id + '-error';
      input.insertAdjacentElement('afterend', msg);
      input.setAttribute('aria-describedby', input.getAttribute('aria-describedby') + ' ' + msg.id);
    }
    msg.textContent = message;
  }
  function clearFieldError(k) {
    var input = fields[k];
    input.removeAttribute('aria-invalid');
    var msg = document.getElementById(input.id + '-error');
    if (msg) {
      msg.remove();
      input.setAttribute('aria-describedby', input.id + '-note');
    }
  }

  function validate() {
    var problems = [];
    var name = fields.name.value.trim();
    var email = fields.email.value.trim();
    var sig = fields.signature.value.trim();
    ['name', 'email', 'signature'].forEach(clearFieldError);
    if (!name) problems.push(['name', 'Enter your full name.']);
    if (!email) problems.push(['email', 'Enter your email address.']);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push(['email', 'Enter an email address, like name@example.com.']);
    if (!sig) problems.push(['signature', 'Type your full name to sign the ballot.']);
    problems.forEach(function (p) { fieldError(p[0], p[1]); });
    if (problems.length) fields[problems[0][0]].focus();
    return !problems.length;
  }

  /* ----------------------------------------------------- casting */
  function showError(title, html) {
    errorBox.innerHTML = '<strong>' + title + '</strong>' + html;
    errorBox.hidden = false;
  }
  var fallback = ' If it keeps failing, email <a href="mailto:' + HELP_EMAIL + '">' + HELP_EMAIL + '</a> or vote on the <a href="' + FORM_URL + '">Google Form version of the ballot</a>.';

  function setSending(on) {
    sending = on;
    castBtn.disabled = on;
    castBtn.textContent = on ? 'Recording your ballot…' : 'Cast my ballot';
    sendingRule.hidden = !on;
    form.setAttribute('aria-busy', on ? 'true' : 'false');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    errorBox.hidden = true;
    if (Date.now() >= CLEARLY_CLOSED) { show('closed'); return; }
    if (!validate()) return;
    persist();
    cast();
  });

  function cast() {
    setSending(true);
    var payload = {
      id: state.id,
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      signature: fields.signature.value.trim(),
      votes: state.votes,
      website: document.getElementById('f-website').value
    };
    if (TEST) payload.dryRun = true;

    var controller = 'AbortController' in window ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    fetch(SCRIPT_URL, {
      method: 'POST',
      // text/plain keeps this a simple request, with no preflight Apps Script can't answer.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        clearTimeout(timer);
        setSending(false);
        if (data.ok) return recorded(data);
        if (data.error === 'closed') return show('closed');
        if (data.error === 'invalid' && data.field && fields[data.field]) {
          fieldError(data.field, data.message);
          fields[data.field].focus();
          return;
        }
        showError('Your ballot was not recorded.', ' ' + escapeHtml(data.message || 'Something went wrong.') + fallback);
      })
      .catch(function (err) {
        clearTimeout(timer);
        setSending(false);
        if (navigator.onLine === false) {
          showError('You seem to be offline.', ' Your ballot was not sent. Your choices are still here: reconnect and cast it again.' + fallback);
        } else {
          // Timeouts, redirects that fail and unreadable replies can all follow a
          // ballot that was in fact recorded, so say so plainly.
          showError('We didn’t hear back from the ballot box.', ' Your ballot may or may not have been recorded. Cast it again: it will only be counted once.' + fallback);
        }
      });
  }

  function recorded(data) {
    var when = new Date(data.receivedAt || Date.now());
    var cast = { at: when.toISOString(), votes: state.votes, test: !!data.dryRun };
    // A test run leaves the ballot as it was, so real voting in this tab still works.
    if (!data.dryRun) {
      save(CAST, cast);
      save(STORE, null);
    }
    showDone(cast);
  }

  function showDone(cast) {
    var when = new Date(cast.at);
    var stamp = when.toLocaleString('en-CA', {
      timeZone: 'America/Toronto', weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    });
    views.done.querySelector('[data-done-when]').textContent =
      (cast.test ? 'Test only, not recorded: ' : 'Recorded ') + stamp + '. Your choices:';
    renderReview(views.done.querySelector('[data-done-review]'), cast.votes);
    show('done');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* --------------------------------------------- time left, closed */
  function timeLeft() {
    var el = document.querySelector('[data-left]');
    var ms = CLOSES_AT - Date.now();
    if (ms <= 0) { el.textContent = '· closed'; return; }
    var days = Math.floor(ms / 864e5);
    var hours = Math.floor(ms / 36e5);
    el.textContent = '· ' + (days >= 2 ? days + ' days left' : hours >= 2 ? hours + ' hours left' : 'closing soon');
  }

  /* ------------------------------------- the item being read (desktop) */
  function watchReading() {
    if (!('IntersectionObserver' in window)) return;
    var rows = {};
    form.querySelectorAll('.bv').forEach(function (fs) { rows[fs.getAttribute('data-key')] = fs; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.getAttribute('data-item')] = en.isIntersecting; });
      var current = null;
      document.querySelectorAll('[data-item]').forEach(function (el) {
        if (!current && visible[el.getAttribute('data-item')]) current = el.getAttribute('data-item');
      });
      Object.keys(rows).forEach(function (k) { rows[k].classList.toggle('is-reading', k === current); });
    }, { rootMargin: '-30% 0px -45% 0px' });
    document.querySelectorAll('[data-item]').forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- start */
  fields.name.value = state.name || '';
  fields.email.value = state.email || '';
  fields.signature.value = state.signature || '';
  save(STORE, state);
  refresh();
  timeLeft();
  setInterval(timeLeft, 60000);
  watchReading();

  var done = TEST ? null : load(CAST);
  if (Date.now() >= CLEARLY_CLOSED) {
    views.mark.hidden = true;
    views.closed.hidden = false;
  } else if (done) {
    views.mark.hidden = true;
    showDone(done);
    window.scrollTo(0, 0);
  } else if (!TEST) {
    // A ballot closed by hand before the deadline: ask quietly, don't wait on it.
    fetch(SCRIPT_URL).then(function (r) { return r.json(); }).then(function (s) {
      if (s && s.open === false && !sending) show('closed');
    }).catch(function () {});
  }
})();
