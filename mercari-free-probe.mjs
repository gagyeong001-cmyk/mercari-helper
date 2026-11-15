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
    const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.includes('self.__next_f.push'));
    const text = scripts.join('');
    const markers = ['itemId','itemName','price','m56788464657','m77688585101'];
    const samples = Object.fromEntries(markers.map(k=>{
      const i=text.indexOf(k);
      return [k,i<0?null:text.slice(Math.max(0,i-100),Math.min(text.length,i+180))];
    }));
    console.log(JSON.stringify({query,status:response.status,flightLength:text.length,samples}));
  } catch(error) {console.log(JSON.stringify({query,error:error.message}));}
}
