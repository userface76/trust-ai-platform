import {analyze} from './detect.js';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const categories=new Set(['investment','delivery','impersonation','shopping','other']);
const validText=(v,max)=>typeof v==='string'&&v.length<=max;
const safe=(v)=>v.replace(/\b\d{6}[- ]?[1-4]\d{6}\b/g,'[주민번호 가림]').replace(/\b01[016789][- ]?\d{3,4}[- ]?\d{4}\b/g,'[전화번호 가림]').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[이메일 가림]').replace(/\b\d{3}[- ]\d{2,6}[- ]\d{3,8}\b/g,'[번호 가림]');
async function digest(s){const bytes=new TextEncoder().encode(s);const hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')}
function access(req){return req.headers.get('x-case-key')||''}
function publicCase(r){return {id:r.id,title:r.title,category:r.category,level:r.level,verification_status:r.verification_status,created_at:r.created_at}}
export default {async fetch(req,env){
 const url=new URL(req.url),path=url.pathname;
 if(path==='/api/health')return json({ok:true,service:'trust-ai-api',storage:env.DB?'d1':'disabled'});
 if(path==='/api/v1/scans'&&req.method==='POST'){
  let body;try{body=await req.json()}catch{return json({error:'JSON 형식이 올바르지 않습니다.'},400)}
  if(!validText(body.text,5000)||!body.text.trim())return json({error:'1~5000자의 텍스트를 입력하세요.'},400);
  return json({id:crypto.randomUUID(),...analyze(body.text)});
 }
 if(path==='/api/v1/cases'&&req.method==='POST'){
  if(!env.DB)return json({error:'데이터베이스가 아직 연결되지 않았습니다.'},503);
  let b;try{b=await req.json()}catch{return json({error:'잘못된 JSON'},400)}
  if(b.consent!==true||!validText(b.text,5000)||!b.text.trim()||!validText(b.title,120)||!b.title.trim()||!validText(b.comment||'',2000))return json({error:'저장 동의, 제목, 텍스트를 확인하세요.'},400);
  const category=categories.has(b.category)?b.category:'other',id=crypto.randomUUID(),key=crypto.randomUUID()+crypto.randomUUID(),hash=await digest(key),result=analyze(b.text);
  try{await env.DB.prepare('INSERT INTO cases (id,access_hash,title,category,redacted_text,level,reasons_json,rule_version,author_comment,checks_json) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id,hash,safe(b.title),category,safe(b.text),result.level,JSON.stringify(result.reasons),result.version,safe(b.comment||''),JSON.stringify(b.checks&&typeof b.checks==='object'?b.checks:{})).run()}
  catch(e){console.error('case insert failed',String(e));return json({error:'사례 저장에 실패했습니다. DB 테이블을 확인하세요.'},503)}
  return json({id,key,visibility:'private',notice:'접근 키는 다시 표시되지 않습니다. 안전한 장소에 보관하세요.'},201);
 }
 if(path==='/api/v1/cases'&&req.method==='GET'){
  if(!env.DB)return json({error:'데이터베이스가 아직 연결되지 않았습니다.'},503);
  const q=(url.searchParams.get('q')||'').slice(0,80),category=url.searchParams.get('category')||'all',level=url.searchParams.get('level')||'all';
  const where=["visibility = 'public'"],args=[];
  if(q){where.push('(title LIKE ? OR redacted_text LIKE ?)');args.push('%'+q+'%','%'+q+'%')}
  if(categories.has(category)){where.push('category = ?');args.push(category)}
  if(['high','caution','unknown'].includes(level)){where.push('level = ?');args.push(level)}
  const rows=await env.DB.prepare('SELECT id,title,category,level,verification_status,created_at FROM cases WHERE '+where.join(' AND ')+' ORDER BY created_at DESC LIMIT 30').bind(...args).all();
  return json({items:rows.results.map(publicCase),note:'관리자 승인된 공개 사례만 표시됩니다.'});
 }
 const match=path.match(/^\/api\/v1\/cases\/([0-9a-f-]{36})$/);
 if(match&&req.method==='GET'){
  if(!env.DB)return json({error:'데이터베이스가 아직 연결되지 않았습니다.'},503);
  const row=await env.DB.prepare('SELECT * FROM cases WHERE id = ?').bind(match[1]).first();
  if(!row)return json({error:'사례를 찾을 수 없습니다.'},404);
  if(row.visibility!=='public'){
   const key=access(req);if(!key||key.length>100||await digest(key)!==row.access_hash)return json({error:'비공개 사례 접근 권한이 없습니다.'},403);
  }
  return json({id:row.id,title:row.title,category:row.category,text:row.redacted_text,level:row.level,reasons:JSON.parse(row.reasons_json),verification_status:row.verification_status,visibility:row.visibility,comment:row.author_comment,checks:JSON.parse(row.checks_json),created_at:row.created_at});
 }
 if(path.startsWith('/api/'))return json({error:'Not found'},404);
 return env.ASSETS.fetch(req);
}};