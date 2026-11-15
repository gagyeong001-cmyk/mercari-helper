// Read-only diagnostics for public Mercari search page. No Apify or email.
const queries = ['ちいかわ入れ替わっちゃった', '口だけは出してッ'];
for (const query of queries) {
  const url = 'https://jp.mercari.com/search?keyword=' + encodeURIComponent(query) + '&price_max=3000&sort=created_time&order=desc';
  try {
    const response = await fetch(url, {headers:{
      'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'accept':'text/html,application/xhtml+xml','accept-language':'ja-JP,ja;q=0.9'
    },signal:AbortSignal.timeout(20000)});
    const html = await response.text();
    const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map(x=>x[0].slice(0,200));
    const scriptSrcs = scripts.filter(s=>s.includes('src=')).slice(0,8);
    const markerCounts = Object.fromEntries(['__NEXT_DATA__','__next_f','__NUXT__','application/ld+json','application/json','商品','検索結果','mercari','m56788464657','m77688585101'].map(k=>[k,html.split(k).length-1]));
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)||[])[1]||'';
    const description = (html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)||[])[1]||'';
    console.log(JSON.stringify({query,status:response.status,length:html.length,title:title.slice(0,120),description:description.slice(0,160),markerCounts,scriptCount:scripts.length,scriptSrcs}));
  } catch(error) {console.log(JSON.stringify({query,error:error.message}));}
}
