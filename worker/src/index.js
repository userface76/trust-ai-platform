import {analyze} from './detect.js';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export default {async fetch(req,env){
 const url=new URL(req.url);
 if(url.pathname==='/api/health')return json({ok:true,service:'trust-ai-api',storage:env.DB?'d1':'disabled'});
 if(url.pathname==='/api/v1/scans'&&req.method==='POST'){
  let body;try{body=await req.json()}catch{return json({error:'JSON 형식이 올바르지 않습니다.'},400)}
  if(typeof body.text!=='string'||!body.text.trim()||body.text.length>5000)return json({error:'1~5000자의 텍스트를 입력하세요.'},400);
  const id=crypto.randomUUID(),result=analyze(body.text);
  if(env.DB){try{await env.DB.prepare('INSERT INTO scan_results (id,level,reason_codes,rule_version) VALUES (?,?,?,?)').bind(id,result.level,JSON.stringify(result.reasons),result.version).run()}catch(e){console.error('D1 write failed',String(e))}}
  return json({id,...result});
 }
 if(url.pathname.startsWith('/api/'))return json({error:'Not found'},404);
 return env.ASSETS.fetch(req);
}};