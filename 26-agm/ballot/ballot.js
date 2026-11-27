/* 2026 AGM ballot.
   Sends one ballot as JSON to the Apps Script web app in 26-agm/ballot-script,
   which checks it and records it in the 2026 Google Form. Nothing is sent
   anywhere else. Choices are kept in sessionStorage so a reload, or a trip to
   the notes, doesn't lose them; they are cleared once the ballot is recorded.
   Test runs have ended: ?test now only shows a notice that this is the real
   ballot, and anything cast with it is recorded like any other ballot. */
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
  var OLD_TEST_LINK = /[?&]test\b/.test(location.search);

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
    firstName: document.getElementById('f-first'),
    lastName: document.getElementById('f-last'),
    email: document.getElementById('f-email'),
    signature: document.getElementById('f-signature')
  };
  var sending = false;

  form.hidden = false;
  if (OLD_TEST_LINK) document.querySelector('[data-testmode]').hidden = false;

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
    state.firstName = fields.firstName.value;
    state.lastName = fields.lastName.value;
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
      Object.keys(fields).forEach(function (k) { fields[k].value = ''; });
      save(STORE, state);
      refresh();
      show('mark');
    }
  });

  Object.keys(fields).forEach(function (k) {
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
      input.setAttribute('aria-describedby', ((input.getAttribute('aria-describedby') || '') + ' ' + msg.id).trim());
    }
    msg.textContent = message;
  }
  function clearFieldError(k) {
    var input = fields[k];
    input.removeAttribute('aria-invalid');
    var msg = document.getElementById(input.id + '-error');
    if (msg) {
      msg.remove();
      var rest = (input.getAttribute('aria-describedby') || '').split(' ').filter(function (id) { return id && id !== msg.id; }).join(' ');
      if (rest) input.setAttribute('aria-describedby', rest);
      else input.removeAttribute('aria-describedby');
    }
  }

  // Kept in step with emailProblem_() in ballot-script/src/Code.js.
  var EMAIL_RE = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
  function emailProblem(email) {
    if (!email) return 'Enter your email address.';
    if (/\s/.test(email)) return 'Remove the spaces from your email address.';
    if (email.indexOf('@') < 0) return 'Your email address needs an @, like name@example.com.';
    if (email.length > 254 || email.split('@')[0].length > 64 || !EMAIL_RE.test(email)) {
      return 'Check your email address. It should look like name@example.com.';
    }
    return '';
  }

  // Check the address as soon as someone leaves the field, not only on Cast.
  fields.email.addEventListener('change', function () {
    var problem = fields.email.value.trim() && emailProblem(fields.email.value.trim());
    if (problem) fieldError('email', problem); else clearFieldError('email');
  });

  function validate() {
    var problems = [];
    var first = fields.firstName.value.trim();
    var last = fields.lastName.value.trim();
    var emailMsg = emailProblem(fields.email.value.trim());
    var sig = fields.signature.value.trim();
    Object.keys(fields).forEach(clearFieldError);
    if (!first) problems.push(['firstName', 'Enter your first name.']);
    if (!last) problems.push(['lastName', 'Enter your last name.']);
    if (emailMsg) problems.push(['email', emailMsg]);
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

  // What a ballot says, in a fixed order. If anything changes after a send
  // whose reply was lost, the ballot gets a new id, so the retry is recorded as
  // a new ballot (the later one counts) instead of being taken for the first.
  function fingerprint() {
    return JSON.stringify([
      fields.firstName.value.trim(), fields.lastName.value.trim(),
      fields.email.value.trim(), fields.signature.value.trim()
    ].concat(ITEMS.map(function (item) { return state.votes[item.key] || ''; })));
  }

  function cast() {
    var sig = fingerprint();
    if (state.sentAs && state.sentAs !== sig) state.id = newId();
    state.sentAs = sig;
    save(STORE, state);
    setSending(true);
    // The receipt shows what was sent, even if choices change while it's on its way.
    var sentVotes = JSON.parse(JSON.stringify(state.votes));
    var payload = {
      id: state.id,
      firstName: fields.firstName.value.trim(),
      lastName: fields.lastName.value.trim(),
      email: fields.email.value.trim(),
      signature: fields.signature.value.trim(),
      votes: sentVotes,
      website: document.getElementById('f-website').value
    };

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
        if (data.ok) return recorded(data, sentVotes, data.mailed ? payload.email : '');
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
          showError('We didn’t hear back from the ballot box.', ' Your ballot may or may not have been recorded. Cast it again: it will only be counted once. If you change anything first, your later ballot is the one counted.' + fallback);
        }
      });
  }

  function recorded(data, votes, mailedTo) {
    var when = new Date(data.receivedAt || Date.now());
    var cast = { at: when.toISOString(), votes: votes, mailedTo: mailedTo || '' };
    save(CAST, cast);
    save(STORE, null);
    showDone(cast);
  }

  function showDone(cast) {
    var when = new Date(cast.at);
    var stamp = when.toLocaleString('en-CA', {
      timeZone: 'America/Toronto', weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    });
    views.done.querySelector('[data-done-when]').textContent =
      'Recorded ' + stamp + '. Your choices:';
    renderReview(views.done.querySelector('[data-done-review]'), cast.votes);
    var mail = views.done.querySelector('[data-done-mail]');
    mail.textContent = cast.mailedTo ? 'We’ve emailed a copy to ' + cast.mailedTo + '.' : '';
    mail.hidden = !cast.mailedTo;
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
  fields.firstName.value = state.firstName || '';
  fields.lastName.value = state.lastName || '';
  fields.email.value = state.email || '';
  fields.signature.value = state.signature || '';
  save(STORE, state);
  refresh();
  timeLeft();
  setInterval(timeLeft, 60000);
  watchReading();

  var done = load(CAST);
  if (Date.now() >= CLEARLY_CLOSED) {
    views.mark.hidden = true;
    views.closed.hidden = false;
  } else if (done) {
    views.mark.hidden = true;
    showDone(done);
    window.scrollTo(0, 0);
  } else {
    // A ballot closed by hand before the deadline: ask quietly, don't wait on it.
    fetch(SCRIPT_URL).then(function (r) { return r.json(); }).then(function (s) {
      if (s && s.open === false && !sending) show('closed');
    }).catch(function () {});
  }

  // Print the minutes in full: a closed <details> would print as one line.
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details.mins:not([open])').forEach(function (d) { d.open = true; d.dataset.printOpened = '1'; });
  });
  window.addEventListener('afterprint', function () {
    document.querySelectorAll('details[data-print-opened]').forEach(function (d) { d.open = false; delete d.dataset.printOpened; });
  });
})();
