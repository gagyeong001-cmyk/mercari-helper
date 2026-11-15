import { readFile, writeFile } from 'node:fs/promises';

const config = JSON.parse(await readFile('watch-config.json', 'utf8'));
const state = JSON.parse(await readFile('watch-state.json', 'utf8'));
state.seen ||= {};
state.initialized ||= [];
const enabled = config.watches.filter(w => w.enabled && w.query && Number(w.maxPrice) > 0);
if (!enabled.length) { console.log('No enabled watches'); process.exit(0); }
for (const key of ['APIFY_TOKEN', 'RESEND_API_KEY', 'ALERT_EMAIL_TO', 'ALERT_EMAIL_FROM']) {
  if (!process.env[key]) throw Error('Missing GitHub Actions secret: ' + key);
}
const normalize = (row) => {
  const title = String(row.name || row.title || '').trim();
  const price = Number(String(row.price ?? '').replace(/[^0-9]/g, ''));
  const raw = String(row.url || row.itemUrl || row.link || '');
  const id = String(row.id || row.itemId || raw.match(/m\d{8,}/)?.[0] || '');
  const url = /^https:\/\/jp\.mercari\.com\/item\/m\d+/.test(raw)
    ? raw.split('?')[0] : /^m\d+$/.test(id) ? 'https://jp.mercari.com/item/' + id : '';
  return { id: id || url, url, title, price };
};
const send = async (item, query) => {
  const message = '메루카리 신규 매물\n' + item.title + '\n¥' +
    item.price.toLocaleString('ja-JP') + '\n검색: ' + query + '\n' + item.url;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {'content-type':'application/json', authorization:'Bearer ' + process.env.RESEND_API_KEY},
    body: JSON.stringify({
      from: process.env.ALERT_EMAIL_FROM,
      to: [process.env.ALERT_EMAIL_TO],
      subject: '🐰 메루카리 꿀매 발견: ¥' + item.price.toLocaleString('ja-JP'),
      text: message
    }),
    signal: AbortSignal.timeout(15000)
  });
  if (!res.ok) throw Error('Email delivery failed: HTTP ' + res.status + ' ' + (await res.text()).slice(0,250));
};
let failed = false;
for (const watch of enabled) {
  try {
    const endpoint = 'https://api.apify.com/v2/acts/maksim_lazouski~mercari-japan-scraper/run-sync-get-dataset-items?timeout=90';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'content-type':'application/json', authorization:'Bearer ' + process.env.APIFY_TOKEN},
      body: JSON.stringify({items:[], searches:[watch.query], sellers:[], scrapeDetails:false, translateTitles:false, maxItems:30}),
      signal: AbortSignal.timeout(115000)
    });
    if (!response.ok) throw Error('Apify HTTP ' + response.status);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw Error('Unexpected Apify response');
    const items = rows.map(normalize).filter(x => x.id && x.url && x.title && Number.isFinite(x.price) && x.price > 0);
    if (rows.length && !items.length) throw Error('Apify returned rows but no recognizable listing fields');
    const known = new Set(state.seen[watch.id] || []);
    const firstRun = !state.initialized.includes(watch.id);
    for (const item of items.reverse()) {
      if (known.has(item.id)) continue;
      if (!firstRun && item.price <= watch.maxPrice) await send(item, watch.query);
      known.add(item.id);
    }
    state.seen[watch.id] = [...known].slice(-1500);
    if (firstRun) state.initialized.push(watch.id);
    console.log(watch.id + ': ' + items.length + ' listings, initial=' + firstRun);
  } catch (error) {
    failed = true;
    console.error(watch.id + ': ' + error.message);
  }
}
await writeFile('watch-state.json', JSON.stringify(state, null, 2) + '\n');
if (failed) process.exitCode = 1;
