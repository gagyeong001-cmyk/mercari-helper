// Experimental no-cost Mercari public-page probe. No Apify, credentials, or email.
const queries = ['ちいかわ入れ替わっちゃった', '口だけは出してッ'];
for (const query of queries) {
  const url = 'https://jp.mercari.com/search?keyword=' + encodeURIComponent(query) + '&price_max=3000&sort=created_time&order=desc';
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml',
        'accept-language': 'ja-JP,ja;q=0.9'
      },
      signal: AbortSignal.timeout(20000)
    });
    const html = await response.text();
    const ids = [...new Set([...html.matchAll(/(?:https?:\\/\\/jp\\.mercari\\.com)?\\/item\\/(m\\d{8,})/g)].map(x => x[1]))];
    const hasData = html.includes('__NEXT_DATA__') || html.includes('itemName') || html.includes('itemPrice');
    console.log(JSON.stringify({query, status:response.status, htmlLength:html.length, itemLinks:ids.length, sampleIds:ids.slice(0,3), hasData, blocked:response.status===403||response.status===429}));
  } catch(e) { console.log(JSON.stringify({query,error:e.message})); }
}
