// Read-only diagnostics. No Apify, credentials, or email.
const queries = ['ちいかわ入れ替わっちゃった', '口だけは出してッ'];
for (const query of queries) {
  const url = 'https://jp.mercari.com/search?keyword=' + encodeURIComponent(query) + '&price_max=3000&sort=created_time&order=desc';
  try {
    const response = await fetch(url, {headers:{
      'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'accept':'text/html,application/xhtml+xml','accept-language':'ja-JP,ja;q=0.9'
    },signal:AbortSignal.timeout(20000)});
    const html = await response.text();
    const flightScripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.includes('self.__next_f.push'));
    const flightText = flightScripts.join('');
    const itemIds = [...new Set(flightText.match(/m[0-9]{8,}/g)||[])];
    const markers = ['price','itemName','itemId','searchResult','items','商品','ちいかわ','口だけ','mercari'];
    const markerCounts = Object.fromEntries(markers.map(k=>[k,flightText.split(k).length-1]));
    console.log(JSON.stringify({query,status:response.status,flightScriptCount:flightScripts.length,flightLength:flightText.length,flightItemIds:itemIds.slice(0,5),markerCounts,htmlItemIds:[...new Set(html.match(/m[0-9]{8,}/g)||[])].slice(0,5)}));
  } catch(error) {console.log(JSON.stringify({query,error:error.message}));}
}
