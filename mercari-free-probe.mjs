// Diagnostic only: no Apify calls, secrets, email, or scheduled runs.
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
    const scripts = [...html.matchAll(/<script[^>]*type=["']application\\/json["'][^>]*>([\\s\\S]*?)<\\/script>/g)];
    const meta = [...html.matchAll(/<meta\\s+[^>]*(?:name|property)=["']([^"']+)["'][^>]*content=["']([^"']{0,250})["'][^>]*>/g)].slice(0,12).map(m=>({key:m[1],value:m[2]}));
    const data = scripts.map(m=>{try{return JSON.parse(m[1]);}catch{return null;}}).filter(Boolean);
    const roots = data.map(o=>Object.keys(o).slice(0,12));
    const hasNext = html.includes('__NEXT_DATA__');
    const counts = {itemId:(html.match(/"itemId"/g)||[]).length,price:(html.match(/"price"/g)||[]).length,searchResult:(html.match(/searchResult/g)||[]).length};
    console.log(JSON.stringify({query,status:response.status,htmlLength:html.length,hasNext,scriptJsonCount:data.length,scriptRoots:roots,counts,meta}));
  } catch(e) { console.log(JSON.stringify({query,error:e.message})); }
}
