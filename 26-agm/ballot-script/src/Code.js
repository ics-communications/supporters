/**
 * ICS 2026 AGM electronic ballot.
 *
 * Run buildBallot() once from the Apps Script editor. It creates the Google
 * Form and its response Sheet, and schedules the form to close at the voting
 * deadline. Running it again, before any votes arrive, rebuilds the questions
 * in the same form, so the link already sent to members keeps working.
 *
 * All wording lives in BALLOT below. Fiscal years, names and page numbers come
 * from the 2026 members' package (26-agm/ICS-AGM-2026-Package.pdf).
 */

const PACKAGE_URL = 'https://supporters.icscanada.edu/26-agm/ICS-AGM-2026-Package.pdf';
const ANNUAL_REPORT_URL = 'https://supporters.icscanada.edu/26-annual/';
const ZOOM_URL = 'https://us02web.zoom.us/j/81325686051?pwd=pEo2RfSbjbQefAiMXQFMUqb1nu39nf.1';
const HELP_EMAIL = 'ics-communications@icscanada.edu';

// Saturday, December 12, 2026, 4:00 pm Eastern (EST, UTC-5): the end of the AGM.
const CLOSES_AT = new Date('2026-12-12T16:00:00-05:00');

const APPROVE = 'Approve';
const DO_NOT_APPROVE = 'Do not approve';

const BALLOT = {
  title: 'ICS 2026 AGM Ballot',
  description: [
    'Ballot for the Annual General Meeting of the Institute for Christian Studies, Saturday, December 12, 2026.',
    'Voting closes Saturday, December 12 at 4:00 pm ET. Please vote even if you plan to attend the meeting on Zoom, and submit one ballot per member.',
    'Before you vote, read the members’ package. It has the financial statements, the proposed budget and the nominees’ biographies:\n' + PACKAGE_URL,
    'The 2025–26 Annual Report:\n' + ANNUAL_REPORT_URL,
    'Questions? Email Mark Standish at ' + HELP_EMAIL + '.',
  ].join('\n\n'),

  confirmation: [
    'Thank you. Your ballot has been recorded.',
    'Results will be reported at the AGM on Saturday, December 12, 2026, 2:00 to 4:00 pm ET. Join on Zoom:\n' + ZOOM_URL + '\nMeeting ID 813 2568 6051 · Passcode 613600',
    'If you need to correct your ballot, email ' + HELP_EMAIL + '.',
  ].join('\n\n'),

  closedMessage: 'Voting for the 2026 ICS AGM closed on Saturday, December 12 at 4:00 pm ET. Questions? Email ' + HELP_EMAIL + '.',

  sections: [
    {
      // The first section shares the page with the form's title and description.
      items: [
        { key: 'firstName', type: 'text', title: 'First name', required: true },
        { key: 'lastName', type: 'text', title: 'Last name', required: true },
        { key: 'email', type: 'email', title: 'Email address', required: true },
      ],
    },
    {
      title: 'Finances',
      help: 'The financial statements are on pages 14–15 of the members’ package, and the budget is on page 16.',
      items: [
        { key: 'auditor', type: 'vote', title: 'Item 1 · Appointment of the auditor for 2026–27',
          help: 'Do you approve the appointment of Capstick McCollum & Associates as the external auditor of the Institute for Christian Studies for the fiscal year ending June 30, 2027?' },
        { key: 'statements', type: 'vote', title: 'Item 2 · 2025–26 audited financial statements',
          help: 'Do you approve the audited financial statements for the year ended June 30, 2026? The complete audited statements are available on request.' },
        { key: 'budget', type: 'vote', title: 'Item 3 · 2026–27 operating budget',
          help: 'Do you ratify the operating budget for the fiscal year ending June 30, 2027?' },
      ],
    },
    {
      title: 'Board of Trustees',
      help: [
        'Three nominees stand for election. Their biographies are below and on pages 17–19 of the members’ package.',
        'A regional seat is decided by the members who live in that region. We check each regional vote against our membership records before counting it, so if you aren’t sure of your region, vote and we’ll check. Every member may vote for the Member-at-Large seat.',
      ].join('\n\n'),
      items: [
        { key: 'dejonge', type: 'vote', region: 'Eastern Canada',
          title: 'Item 4a · Heidi De Jonge, Eastern Canada',
          help: 'Do you approve the election of Heidi De Jonge to the Board of Trustees for the Eastern Canada region? Only votes from members in Eastern Canada are counted.',
          bio: [
            'Heidi De Jonge is a pastor, chaplain, and restorative practitioner based in Kingston, Ontario. She serves as a spiritual care provider at Providence Care Hospice’s AB Smith Homestead House and as an associate chaplain in Queen’s University’s Office of Faith and Spiritual Life, where her work focuses primarily on grief and loss.',
            'Heidi is also a trainer and coach with The Colossian Forum, helping organizations transform their conflict culture. Since 2022, she has offered restorative practices to churches experiencing conflict and trained practitioners in that work.',
            'Her ministry experience includes ten years as pastor of Westside Fellowship Christian Reformed Church in Kingston, earlier congregational ministry at Harderwyk CRC in Holland, Michigan, and service as Pastor for Discernment at Calvin Theological Seminary. Across these roles, she has worked in preaching, pastoral care, leadership development, vocational discernment, and community formation.',
            'She holds a Doctor of Ministry from Western Theological Seminary, a Master of Divinity from Calvin Theological Seminary, and a bachelor’s degree in philosophy and psychology from Dordt University. Her doctoral dissertation, “Truthing in Love: Engaging Conflict with the Disarming Love of God,” reflects her continuing interest in faith, conflict, and reconciliation.',
          ] },
        { key: 'tinsley', type: 'vote', region: 'BC or the western US',
          title: 'Item 4b · Jeremy Tinsley, BC and Western US',
          help: 'Do you approve the election of Jeremy Tinsley to the Board of Trustees for the BC and Western US region? Only votes from members in British Columbia and the western United States are counted.',
          bio: [
            'Jeremy Tinsley serves as Superintendent at Vancouver Christian School in Vancouver, BC. A graduate of Abbotsford Christian School and Dordt University, he began his career in education as a teacher at a small Christian school in rural Iowa, followed by five years at Kyiv International School in Ukraine. He and his wife later moved to Vancouver Island, where he spent 12 years as vice principal and principal at Duncan Christian School.',
            'Throughout his career, God has worked through the many people Jeremy has known to shape his leadership. He finds joy in supporting Christian educational communities as they equip students to know, love, and serve the Lord and others.',
            'Jeremy and his wife, Jen, attend Tenth Church in Vancouver and enjoy backpacking along BC’s coastal and mountain trails. They have three children: two attending university and one in grade twelve at VCS.',
          ] },
        { key: 'barthel', type: 'vote',
          title: 'Item 4c · Bob Barthel, Member-at-Large',
          help: 'Do you approve the election of Bob Barthel to the Board of Trustees as a Member-at-Large? Every member may vote for this seat.',
          bio: [
            'Bob Barthel is a retired educational leader with 40 years of experience in education, including 20 years in school leadership. He holds a Bachelor of Arts from Calvin University and a Master of Worldview Studies from the Institute for Christian Studies.',
            'Bob served as a school principal and district principal in Christian and public school settings. He spent five years as District Principal with Red Deer Public School District, supporting educational leadership and learning across the district.',
            'His commitment to Christian education also took him and his family to Honduras for a year at Academia Los Pinares in partnership with World Renew. That experience broadened his perspective on the relationship between faith, learning, and community in different cultural contexts.',
            'Bob has served on church boards and other committees and boards, including the Ten Thousand Villages board. He brings experience in governance, organizational leadership, and community engagement, alongside a deep interest in Christian worldview and education’s contribution to the common good.',
            'In retirement, he looks forward to contributing his educational leadership, governance experience, international perspective, and commitment to Christian education to the mission and future of ICS.',
          ] },
      ],
    },
    {
      title: 'Sign and submit',
      help: 'Use Back to check your answers. Once you submit, your ballot can’t be changed here; to correct it, email ' + HELP_EMAIL + '.',
      items: [
        { key: 'signature', type: 'text', title: 'Signature', required: true,
          help: 'Type your full name to confirm that you are an ICS member and that you cast these votes yourself.' },
      ],
    },
  ],
};

const PROP_FORM_ID = 'BALLOT_FORM_ID';
const PROP_SHEET_ID = 'BALLOT_SHEET_ID';

/** Creates the ballot, or rebuilds its questions in place if it already exists and has no votes. */
function buildBallot() {
  const props = PropertiesService.getScriptProperties();
  let form;
  const formId = props.getProperty(PROP_FORM_ID);

  if (formId) {
    form = FormApp.openById(formId);
    const votes = form.getResponses().length;
    if (votes > 0) {
      throw new Error('This ballot already has ' + votes + ' response(s), so it was not rebuilt. Edit it by hand in Google Forms: ' + form.getEditUrl());
    }
    form.getItems().forEach((item) => form.deleteItem(item));
  } else {
    form = FormApp.create(BALLOT.title);
    props.setProperty(PROP_FORM_ID, form.getId());
  }

  applySettings_(form);
  addSections_(form);

  if (!props.getProperty(PROP_SHEET_ID)) {
    const sheet = SpreadsheetApp.create(BALLOT.title + ' (Responses)');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
    props.setProperty(PROP_SHEET_ID, sheet.getId());
  }

  scheduleClose_();
  logLinks_(form);
}

/** Stops accepting votes. Runs on its own at CLOSES_AT; can also be run by hand. */
function closeBallot() {
  const form = getForm_();
  form.setCustomClosedFormMessage(BALLOT.closedMessage);
  form.setAcceptingResponses(false);
  Logger.log('Ballot closed at %s.', new Date());
}

/** Reopens voting, for example if the meeting runs late. Cancel or reschedule the automatic close separately. */
function reopenBallot() {
  getForm_().setAcceptingResponses(true);
  Logger.log('Ballot reopened.');
}

/** Prints the form, response and Sheet links again. */
function showLinks() {
  logLinks_(getForm_());
}

function applySettings_(form) {
  form
    .setTitle(BALLOT.title)
    .setDescription(BALLOT.description)
    .setConfirmationMessage(BALLOT.confirmation)
    .setCustomClosedFormMessage(BALLOT.closedMessage)
    .setProgressBar(true)
    .setShuffleQuestions(false)
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setLimitOneResponsePerUser(false)
    .setPublishingSummary(false)
    .setShowLinkToRespondAgain(false)
    .setAcceptingResponses(true);

  // Members vote from personal accounts, so the ballot must not require an ICS sign-in.
  try {
    form.setRequireLogin(false);
  } catch (e) {
    // Only Workspace forms have this setting.
  }
}

function addSections_(form) {
  BALLOT.sections.forEach((section, i) => {
    if (i > 0) {
      form.addPageBreakItem().setTitle(section.title).setHelpText(section.help || '');
    }
    section.items.forEach((spec) => addItem_(form, spec));
  });
}

function addItem_(form, spec) {
  if (spec.type === 'text' || spec.type === 'email') {
    const item = form.addTextItem().setTitle(spec.title).setHelpText(spec.help || '').setRequired(!!spec.required);
    if (spec.type === 'email') {
      item.setValidation(
        FormApp.createTextValidation().requireTextIsEmail().setHelpText('Enter an email address, like name@example.com.').build()
      );
    }
    return item;
  }

  if (spec.type === 'vote') {
    const choices = [APPROVE, DO_NOT_APPROVE];
    if (spec.region) choices.push('I don’t live in ' + spec.region);

    const help = spec.bio ? spec.help + '\n\n' + spec.bio.join('\n\n') : spec.help;
    return form.addMultipleChoiceItem()
      .setTitle(spec.title)
      .setHelpText(help)
      .setChoiceValues(choices)
      .setRequired(false);
  }

  throw new Error('Unknown item type: ' + spec.type);
}

function scheduleClose_() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'closeBallot')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  if (CLOSES_AT > new Date()) {
    ScriptApp.newTrigger('closeBallot').timeBased().at(CLOSES_AT).create();
  }
}

function getForm_() {
  const id = PropertiesService.getScriptProperties().getProperty(PROP_FORM_ID);
  if (!id) throw new Error('No ballot yet. Run buildBallot first.');
  return FormApp.openById(id);
}

function logLinks_(form) {
  const sheetId = PropertiesService.getScriptProperties().getProperty(PROP_SHEET_ID);
  Logger.log('Ballot link for members: %s', form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('Full ballot link:        %s', form.getPublishedUrl());
  Logger.log('Edit the form:           %s', form.getEditUrl());
  if (sheetId) Logger.log('Responses Sheet:         https://docs.google.com/spreadsheets/d/%s/edit', sheetId);
  Logger.log('Closes automatically:    %s', CLOSES_AT.toString());
}

/* ------------------------------------------------------------------------
 * Web ballot (26-agm/ballot/). The page POSTs one JSON ballot here; it is
 * validated and recorded as a response in the same Google Form, so the Form's
 * response Sheet stays the single record. Deploy as a web app that executes
 * as the owner and is open to anyone (see appsscript.json).
 *
 * Body: { id, firstName, lastName, email, signature, votes: { auditor: 'approve' | 'reject' | 'region' | '' , ... }, website? }
 * Test runs (dryRun) have ended: a ballot that asks for one is refused, so the
 * endpoint can't be used to tie up the lock without recording anything.
 * website: a hidden field people never see; anything in it is refused, never confirmed.
 * Once recorded, the member is emailed a copy of their ballot (see sendConfirmation_);
 * the reply says { ok, receivedAt, mailed }.
 * ---------------------------------------------------------------------- */

const VOTE_VALUES = { approve: () => APPROVE, reject: () => DO_NOT_APPROVE, region: (spec) => 'I don’t live in ' + spec.region };

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    // A real ballot is well under 2 KB; anything far larger is refused unread.
    if (raw.length > 8000) {
      return json_({ ok: false, error: 'bad_request', message: 'The ballot could not be read. Please reload the page and try again.' });
    }
    let body;
    try {
      body = JSON.parse(raw);
    } catch (err) {
      return json_({ ok: false, error: 'bad_request', message: 'The ballot could not be read. Please try again.' });
    }
    if (!body || typeof body !== 'object') {
      return json_({ ok: false, error: 'bad_request', message: 'The ballot could not be read. Please try again.' });
    }
    if (body.dryRun) {
      return json_({ ok: false, error: 'test_off', message: 'Test mode has ended. Remove ?test from the address, reload the page and cast your ballot.' });
    }
    // Never confirm a ballot that wasn't saved, even one that looks like a bot's.
    if (body.website) {
      return json_({ ok: false, error: 'invalid', message: 'Your ballot could not be accepted. Please reload the page and cast it again.' });
    }

    const check = validateBallot_(body);
    if (check.error) return json_({ ok: false, error: 'invalid', field: check.field, message: check.error });

    const lock = LockService.getScriptLock();
    lock.waitLock(25000);
    let receivedAt, earlier, mailsSoFar;
    try {
      // A ballot sent twice (a retry after a timeout) is recorded once. The id
      // is kept in Script Properties (durable) as well as the cache (fast), and
      // is checked before the closing time so a late retry still hears "recorded".
      const key = 'ballot:' + body.id;
      const cache = CacheService.getScriptCache();
      const props = PropertiesService.getScriptProperties();
      const seen = cache.get(key) || props.getProperty(key);
      if (seen) return json_({ ok: true, receivedAt: seen, repeat: true });

      const form = getForm_();
      if (new Date() >= CLOSES_AT || !form.isAcceptingResponses()) {
        return json_({ ok: false, error: 'closed', message: BALLOT.closedMessage });
      }

      const response = buildResponse_(form, check.values);
      receivedAt = new Date().toISOString();

      response.submit();
      props.setProperty(key, receivedAt);
      cache.put(key, receivedAt, 21600);

      // Counted per member (name and address: two members may share an
      // address) to say when a ballot replaces an earlier one, and per address
      // to cap how many confirmations one address can be sent.
      const memberKey = 'cast:' + digest_([check.values.firstName, check.values.lastName, check.values.email].join('|'));
      const mailKey = 'mailed:' + digest_(check.values.email);
      earlier = Number(props.getProperty(memberKey) || 0);
      mailsSoFar = Number(props.getProperty(mailKey) || 0);
      props.setProperty(memberKey, String(earlier + 1));
      if (mailsSoFar < MAIL_CAP) props.setProperty(mailKey, String(mailsSoFar + 1));
    } finally {
      lock.releaseLock();
    }
    // The ballot is recorded whatever happens to the email.
    const mailed = mailsSoFar < MAIL_CAP && sendConfirmation_(check.values, new Date(receivedAt), earlier > 0);
    return json_({ ok: true, receivedAt: receivedAt, mailed: mailed });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server', message: 'The ballot box had a problem and your ballot was not recorded.' });
  }
}

/** Lets the page ask whether voting is open (for a ballot closed by hand). */
function doGet() {
  let open = new Date() < CLOSES_AT;
  try {
    open = open && getForm_().isAcceptingResponses();
  } catch (err) {
    console.error(err);
  }
  return json_({ ok: true, open: open, closesAt: CLOSES_AT.toISOString() });
}

function ballotSpecs_() {
  const specs = {};
  BALLOT.sections.forEach((s) => s.items.forEach((spec) => { specs[spec.key] = spec; }));
  return specs;
}

function validateBallot_(body) {
  const specs = ballotSpecs_();
  const values = {};

  if (typeof body.id !== 'string' || !/^[\w-]{8,64}$/.test(body.id)) {
    return { error: 'The ballot was missing its reference. Please reload the page and try again.' };
  }

  const text = { firstName: 'your first name', lastName: 'your last name', email: 'your email address', signature: 'your signature' };
  for (const key in text) {
    const v = typeof body[key] === 'string' ? body[key].trim() : '';
    if (!v) return { field: key, error: 'Enter ' + text[key] + '.' };
    if (v.length > (key === 'email' ? 254 : 200)) return { field: key, error: 'That is longer than we can store. Shorten ' + text[key] + '.' };
    values[key] = v;
  }
  const emailProblem = emailProblem_(values.email);
  if (emailProblem) return { field: 'email', error: emailProblem };

  const votes = body.votes && typeof body.votes === 'object' ? body.votes : {};
  for (const key in votes) {
    const spec = specs[key];
    if (!spec || spec.type !== 'vote') return { error: 'The ballot had an item we don’t recognise. Please reload the page.' };
    const v = votes[key];
    if (v === '' || v === null) continue;
    if (!VOTE_VALUES[v] || (v === 'region' && !spec.region)) {
      return { error: 'The ballot had a choice we don’t recognise. Please reload the page.' };
    }
    values[key] = VOTE_VALUES[v](spec);
  }
  return { values: values };
}

// The same check as the ballot page (ballot.js): a dot-atom local part, then a
// domain of letter-or-digit labels (hyphens inside only) ending in a 2+ letter TLD.
const EMAIL_RE = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

function emailProblem_(email) {
  if (/\s/.test(email)) return 'Remove the spaces from your email address.';
  if (email.indexOf('@') < 0) return 'Your email address needs an @, like name@example.com.';
  if (email.length > 254 || email.split('@')[0].length > 64 || !EMAIL_RE.test(email)) {
    return 'Check your email address. It should look like name@example.com.';
  }
  return '';
}

/**
 * One-time change (November 2026): splits "Full name" into "First name" and
 * "Last name" and removes the notes under the name and email questions. It
 * edits the live form in place, so existing responses and the link are kept.
 * Safe to run more than once.
 */
function splitNameQuestion() {
  const form = getForm_();
  const items = form.getItems();
  const find = (title) => items.find((item) => item.getTitle() === title);

  let first = find('First name');
  const full = find('Full name');
  if (!first && full) first = full.setTitle('First name');
  if (!first) throw new Error('Neither "Full name" nor "First name" is on the form.');
  first.setHelpText('');

  if (!find('Last name')) {
    const last = form.addTextItem().setTitle('Last name').setRequired(true);
    form.moveItem(last.getIndex(), first.getIndex() + 1);
  }

  const email = find('Email address');
  if (email) email.setHelpText('');

  Logger.log('Done. Questions now: %s', form.getItems().slice(0, 4).map((item) => item.getTitle()).join(' | '));
}

/** Matches each form item to BALLOT by its title and fills in the answers. */
function buildResponse_(form, values) {
  const specs = ballotSpecs_();
  const byTitle = {};
  Object.keys(specs).forEach((k) => { byTitle[specs[k].title] = specs[k]; });

  const response = form.createResponse();
  const found = {};
  form.getItems().forEach((item) => {
    const spec = byTitle[item.getTitle()];
    if (!spec) return;
    found[spec.key] = true;
    const value = values[spec.key];
    if (!value) return;
    if (spec.type === 'vote') {
      response.withItemResponse(item.asMultipleChoiceItem().createResponse(value));
    } else {
      response.withItemResponse(item.asTextItem().createResponse(value));
    }
  });

  const missing = Object.keys(specs).filter((k) => !found[k]);
  if (missing.length) throw new Error('The form no longer matches BALLOT; missing: ' + missing.join(', '));
  return response;
}

/* ------------------------------------------------------------------------
 * Confirmation email. Sent from the account that runs the script
 * (ics-communications@icscanada.edu), with replies going to HELP_EMAIL.
 * The page takes any address, so one address gets at most MAIL_CAP of these.
 * ---------------------------------------------------------------------- */

const MAIL_CAP = 10;
const MAIL_FROM_NAME = 'Institute for Christian Studies';

/** Sends the confirmation; returns false (and logs) if it couldn't. */
function sendConfirmation_(values, when, replaces) {
  try {
    if (MailApp.getRemainingDailyQuota() < 1) {
      console.warn('Daily email quota used up; no confirmation sent.');
      return false;
    }
    const mail = confirmationEmail_(values, when, replaces);
    MailApp.sendEmail({
      to: values.email,
      subject: mail.subject,
      body: mail.text,
      htmlBody: mail.html,
      name: MAIL_FROM_NAME,
      replyTo: HELP_EMAIL,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function confirmationEmail_(values, when, replaces) {
  const stamp = Utilities.formatDate(when, 'America/Toronto', "EEEE, MMMM d, yyyy 'at' h:mm a z")
    .replace(' AM ', ' am ').replace(' PM ', ' pm ');
  const votes = [];
  BALLOT.sections.forEach((s) => s.items.forEach((spec) => {
    if (spec.type === 'vote') votes.push({ title: spec.title, choice: values[spec.key] || 'Left blank' });
  }));

  const lines = [
    'Thank you for voting. Your ballot for the 2026 Annual General Meeting of the Institute for Christian Studies was recorded on ' + stamp + '.',
  ];
  if (replaces) lines.push('You cast an earlier ballot under the same name and email address. This one replaces it: your latest ballot is the one counted.');
  const meeting = 'Results will be reported at the AGM on Saturday, December 12, 2026, 2:00 to 4:00 pm ET.';
  const help = 'If you have any questions, reply to this email or write to Mark Standish at ' + HELP_EMAIL + '.';

  const text = [
    'Dear ' + values.firstName + ',',
    lines.join('\n\n'),
    'Your votes\n' + votes.map((v) => v.title + ': ' + v.choice).join('\n') + '\nSigned: ' + values.signature,
    meeting + ' Join on Zoom:\n' + ZOOM_URL + '\nMeeting ID 813 2568 6051 · Passcode 613600',
    help,
    MAIL_FROM_NAME,
  ].join('\n\n');

  const h = escapeHtml_;
  const p = (s) => '<p style="margin:0 0 16px">' + s + '</p>';
  const rows = votes.map((v) =>
    '<tr><td style="padding:8px 16px 8px 0;border-bottom:1px solid #EFE3E0;vertical-align:top">' + h(v.title) + '</td>' +
    '<td style="padding:8px 0;border-bottom:1px solid #EFE3E0;vertical-align:top;font-weight:600;color:#2E1318">' + h(v.choice) + '</td></tr>').join('');
  const html =
    '<div style="max-width:560px;font-family:Outfit,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3A3330">' +
    '<h1 style="margin:0 0 20px;font-family:Libre Baskerville,Georgia,serif;font-size:22px;line-height:1.3;color:#9B0D24">Your 2026 AGM ballot is recorded</h1>' +
    p('Dear ' + h(values.firstName) + ',') +
    lines.map((l) => p(h(l))).join('') +
    '<h2 style="margin:24px 0 8px;font-family:Libre Baskerville,Georgia,serif;font-size:17px;color:#9B0D24">Your votes</h2>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-top:1.5px solid #9B0D24;font-size:14px;margin:0 0 8px">' + rows + '</table>' +
    p('<span style="color:#6B655F">Signed: </span>' + h(values.signature)) +
    p(h(meeting) + ' <a href="' + ZOOM_URL + '" style="color:#9B0D24">Join on Zoom</a><br><span style="color:#6B655F">Meeting ID 813 2568 6051 · Passcode 613600</span>') +
    p('If you have any questions, reply to this email or write to Mark Standish at <a href="mailto:' + HELP_EMAIL + '" style="color:#9B0D24">' + HELP_EMAIL + '</a>.') +
    '<p style="margin:24px 0 0;color:#6B655F">' + MAIL_FROM_NAME + '</p></div>';

  return { subject: 'Your 2026 ICS AGM ballot is recorded', text: text, html: html };
}

/**
 * Run once from the Apps Script editor after this change. It asks for the new
 * "send email as you" permission and sends a sample confirmation to the
 * script's own account. Nothing is recorded on the ballot.
 */
function sendTestConfirmation() {
  const to = Session.getEffectiveUser().getEmail();
  const values = { firstName: 'Sample', lastName: 'Member', email: to, signature: 'Sample Member',
    auditor: APPROVE, statements: APPROVE, budget: DO_NOT_APPROVE, dejonge: 'I don’t live in Eastern Canada', barthel: APPROVE };
  const ok = sendConfirmation_(values, new Date(), false);
  Logger.log(ok ? 'Sample confirmation sent to %s.' : 'Sending failed; see the log above. (%s)', to);
}

function digest_(s) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s).trim().toLowerCase(), Utilities.Charset.UTF_8)
  ).slice(0, 22);
}

function escapeHtml_(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
