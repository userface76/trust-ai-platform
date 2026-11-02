import {analyze} from './detect.js';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'*'}});
export default {async fetch(req,env){
 const url=new URL(req.url);
 if(url.pathname==='/api/health')return json({ok:true,service:'trust-ai-api'});
 if(url.pathname==='/api/v1/scans'&&req.method==='POST'){
  let body;try{body=await req.json()}catch{return json({error:'JSON 형식이 올바르지 않습니다.'},400)}
  if(typeof body.text!=='string'||!body.text.trim()||body.text.length>5000)return json({error:'1~5000자의 텍스트를 입력하세요.'},400);
  const id=crypto.randomUUID(),result=analyze(body.text);
  if(env.SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY){
   try{await fetch(`${env.SUPABASE_URL}/rest/v1/scan_results`,{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({id,level:result.level,reason_codes:result.reasons,rule_version:result.version})})}catch{/* best-effort MVP persistence */}
  }
  return json({id,...result});
 }
 return json({error:'Not found'},404);
}};