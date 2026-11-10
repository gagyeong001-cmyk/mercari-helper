import express from 'express';
const app=express();app.use(express.json());app.use(express.static('public'));
app.post('/api/extract',async(req,res)=>{
 try{
  const match=String(req.body.url||'').match(/^https:\/\/jp\.mercari\.com\/item\/(m\d+)/i);
  if(!match)return res.status(400).json({error:'메루카리 상품 링크를 입력해 주세요.'});
  if(!process.env.APIFY_TOKEN)return res.status(503).json({error:'APIFY_TOKEN 설정이 필요합니다.'});
  const url='https://jp.mercari.com/item/'+match[1];
  const endpoint='https://api.apify.com/v2/acts/maksim_lazouski~mercari-japan-scraper/run-sync-get-dataset-items?token='+encodeURIComponent(process.env.APIFY_TOKEN)+'&timeout=90';
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[url],searches:[],sellers:[],scrapeDetails:true,translateTitles:false,maxItems:1})});
  if(!response.ok)throw Error('매물 조회 서비스 오류 ('+response.status+')');
  const rows=await response.json();const item=Array.isArray(rows)?rows.find(x=>x&&(x.name||x.title)):null;
  if(!item)throw Error('상품 정보를 찾지 못했습니다.');
  const title=String(item.name||item.title||'');const price=Number(item.price);
  if(!title||!Number.isFinite(price))throw Error('상품명 또는 가격을 확인할 수 없습니다.');
  let korean='';try{const t=await fetch('https://api.mymemory.translated.net/get?langpair=ja%7Cko&q='+encodeURIComponent(title),{signal:AbortSignal.timeout(8000)});if(t.ok)korean=(await t.json()).responseData?.translatedText||'';}catch{}
  res.json({url,title,korean,price});
 }catch(e){res.status(502).json({error:e.message||'조회 실패'});}
});
app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Mercari helper running'));