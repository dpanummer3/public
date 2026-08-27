const JSON_HEADERS={
  'content-type':'application/json; charset=utf-8',
  'cache-control':'no-store'
};

const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});
let schemaPromise=null;

async function initSchema(env){
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS participants (
    name TEXT PRIMARY KEY COLLATE NOCASE,
    current_stop TEXT NOT NULL DEFAULT '',
    intox INTEGER NOT NULL DEFAULT 1 CHECK(intox BETWEEN 1 AND 5),
    ratings_json TEXT NOT NULL DEFAULT '{}',
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`).run();

  const {results=[]}=await env.DB.prepare(`PRAGMA table_info(participants)`).all();
  if(!results.some(column=>column.name==='ratings_json')){
    await env.DB.prepare(`ALTER TABLE participants ADD COLUMN ratings_json TEXT NOT NULL DEFAULT '{}'`).run();
  }
}

async function ensureSchema(env){
  if(!env.DB)return false;
  if(!schemaPromise){
    schemaPromise=initSchema(env).catch(error=>{
      schemaPromise=null;
      throw error;
    });
  }
  await schemaPromise;
  return true;
}

function cleanRatings(input){
  const out={};
  if(!input||typeof input!=='object'||Array.isArray(input))return out;
  for(const [keyRaw,value] of Object.entries(input)){
    const key=String(keyRaw).slice(0,64),score=Number(value);
    if(key&&Number.isInteger(score)&&score>=1&&score<=5)out[key]=score;
  }
  return out;
}

function rowToParticipant(row){
  let ratings={};
  try{ratings=JSON.parse(row.ratingsJson||'{}')}catch{}
  return {
    name:row.name,
    currentStop:row.currentStop,
    intox:row.intox,
    ratings,
    updatedAt:row.updatedAt
  };
}

async function getParticipants(env){
  if(!await ensureSchema(env))return {shared:false,participants:[]};
  const {results=[]}=await env.DB.prepare(`
    SELECT name,
           current_stop AS currentStop,
           intox,
           ratings_json AS ratingsJson,
           updated_at AS updatedAt
    FROM participants
    WHERE updated_at >= unixepoch() - 172800
    ORDER BY updated_at DESC
    LIMIT 12
  `).all();
  return {shared:true,participants:results.map(rowToParticipant)};
}

async function handleState(request,env,url){
  if(request.method==='GET')return json(await getParticipants(env));
  if(!env.DB)return json({shared:false,participants:[]},503);
  await ensureSchema(env);

  if(request.method==='POST'){
    let body;
    try{body=await request.json()}catch{return json({error:'Ongeldige JSON'},400)}

    const name=String(body.name||'').trim().replace(/\s+/g,' ').slice(0,24);
    if(!name)return json({error:'Naam ontbreekt'},400);

    const currentStop=String(body.currentStop==null?'':body.currentStop).slice(0,64);
    const intox=Math.max(1,Math.min(5,Math.round(Number(body.intox)||1)));
    const ratings=cleanRatings(body.ratings);

    await env.DB.prepare(`
      INSERT INTO participants(name,current_stop,intox,ratings_json,updated_at)
      VALUES(?1,?2,?3,?4,unixepoch())
      ON CONFLICT(name) DO UPDATE SET
        current_stop=excluded.current_stop,
        intox=excluded.intox,
        ratings_json=excluded.ratings_json,
        updated_at=unixepoch()
    `).bind(name,currentStop,intox,JSON.stringify(ratings)).run();
    return json(await getParticipants(env));
  }

  if(request.method==='DELETE'){
    const name=String(url.searchParams.get('name')||'').trim().replace(/\s+/g,' ').slice(0,24);
    if(!name)return json({error:'Naam ontbreekt'},400);
    await env.DB.prepare(`DELETE FROM participants WHERE name=?1`).bind(name).run();
    return json(await getParticipants(env));
  }

  return json({error:'Method not allowed'},405);
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);

    if(url.pathname==='/robots.txt'){
      return new Response('User-agent: *\nDisallow:\n',{
        headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}
      });
    }

    if(url.pathname==='/api/state')return handleState(request,env,url);

    const response=await env.ASSETS.fetch(request);
    const headers=new Headers(response.headers);
    headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
    return new Response(response.body,{
      status:response.status,
      statusText:response.statusText,
      headers
    });
  }
};
