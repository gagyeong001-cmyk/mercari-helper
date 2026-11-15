// Read-only public-page diagnostics. No Apify, secrets, or email.
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
    const marker = '__NEXT_DATA__';
    const index = html.indexOf(marker);
    const itemIdCount = html.split('"itemId"').length - 1;
    const priceCount = html.split('"price"').length - 1;
    const searchResultCount = html.split('searchResult').length - 1;
    const itemIds = [...new Set(html.match(/m[0-9]{8,}/g) || [])].slice(0, 5);
    console.log(JSON.stringify({
      query, status: response.status, htmlLength: html.length,
      hasNextData: index >= 0, itemIdCount, priceCount,
      searchResultCount, sampleItemIds: itemIds,
      blocked: response.status === 403 || response.status === 429
    }));
  } catch (error) {
    console.log(JSON.stringify({query, error: error.message}));
  }
}
