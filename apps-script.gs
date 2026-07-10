/* ══════════════════════════════════════════════════════════════════════
   Divastra Analytics — Google Apps Script backend

   SETUP (one-time, ~5 minutes):
   1. Go to sheets.google.com → create a new blank spreadsheet
   2. Extensions → Apps Script → paste this entire file → Save (Ctrl+S)
   3. Click Deploy → New deployment
        Type: Web app
        Execute as: Me
        Who has access: Anyone
   4. Click Deploy → copy the Web App URL
   5. Paste that URL into customize.js as:  analyticsUrl: 'PASTE_HERE'
   6. Rebuild the bundle and push to GitHub
══════════════════════════════════════════════════════════════════════ */

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if      (d.type === 'session') writeSession(ss, d);
    else if (d.type === 'chat')    writeChat(ss, d);
    else if (d.type === 'event')   writeEvent(ss, d);
  } catch(err) {
    // silent — never break the user's page
  }
  return ContentService.createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const out = {
    sessions: sheetRows(ss, 'Sessions'),
    chats:    sheetRows(ss, 'Chats'),
    events:   sheetRows(ss, 'Events'),
  };
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── Writers ── */

function writeSession(ss, d) {
  const sh = getSheet(ss, 'Sessions', [
    'Date', 'SessionID', 'IP',
    'ScrollDepth%', 'Duration(s)', 'ChatCount',
    'Funnel', 'UserType', 'URL', 'Referrer', 'UserAgent'
  ]);
  sh.appendRow([
    new Date(d.startTs || d.ts || Date.now()),
    d.sid || '', d.ip || '',
    d.scrollDepthMax || 0,
    Math.round((d.duration || 0) / 1000),
    d.chatCount || 0,
    d.funnel || 'aware',
    d.userType || 'unknown',
    d.url || '', d.ref || '',
    (d.ua || '').slice(0, 100)
  ]);
}

function writeChat(ss, d) {
  const sh = getSheet(ss, 'Chats', [
    'Date', 'IP', 'SessionID', 'UserMessage', 'DivuReply', 'Category', 'Known'
  ]);
  sh.appendRow([
    new Date(d.ts || Date.now()),
    d.ip || '', d.sid || '',
    (d.userMsg || '').slice(0, 500),
    (d.reply   || '').slice(0, 500),
    d.category || '',
    d.known ? 'YES' : 'NO'
  ]);
}

function writeEvent(ss, d) {
  const sh = getSheet(ss, 'Events', [
    'Date', 'IP', 'SessionID', 'EventType', 'Data'
  ]);
  sh.appendRow([
    new Date(d.ts || Date.now()),
    d.ip || '', d.sid || '',
    d.eventType || '',
    JSON.stringify(d)
  ]);
}

/* ── Helpers ── */

function getSheet(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

function sheetRows(ss, name) {
  const sh = ss.getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const vals  = sh.getDataRange().getValues();
  const heads = vals[0].map(String);
  return vals.slice(1).map(row =>
    Object.fromEntries(heads.map((h, i) => [h, row[i]]))
  );
}
