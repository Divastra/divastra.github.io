/* ── Visitor ── collect name / phone / email per IP, persist in localStorage */
const LS_KEY='divu_visitor';
const IP_KEY='divu_ip';

function _load(){
  try{const r=localStorage.getItem(LS_KEY);if(r)return JSON.parse(r);}catch(_){}
  return{ip:null,name:null,phone:null,email:null,firstSeen:new Date().toISOString(),asks:0};
}
function _save(v){
  try{v.lastSeen=new Date().toISOString();localStorage.setItem(LS_KEY,JSON.stringify(v));}catch(_){}
}

export function validPhone(raw){
  const d=raw.replace(/[\s\-\(\)\+\.]/g,'');
  if(/^\d{10}$/.test(d))return d;
  if(/^\d{12}$/.test(d))return d;
  return null;
}
export function validEmail(raw){
  const t=raw.trim();
  return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)?t:null;
}

async function _fetchIP(){
  try{const c=localStorage.getItem(IP_KEY);if(c&&c!=='unknown')return c;}catch(_){}
  try{
    const r=await fetch('https://api.ipify.org/?format=json');
    const d=await r.json();
    try{localStorage.setItem(IP_KEY,d.ip);}catch(_){}
    return d.ip;
  }catch(_){return'unknown';}
}

export function makeVisitor(onCapture){
  let v=_load();
  _fetchIP().then(ip=>{if(!v.ip||v.ip==='unknown'){v.ip=ip;_save(v);}});

  function nextField(){
    if(!v.name)return'name';
    if(!v.phone)return'phone';
    if(!v.email)return'email';
    return null;
  }

  function capture(txt,field){
    const t=txt.trim();
    let val=null;
    if(field==='name'){
      /* must be 2-60 chars, only letters/spaces/dots/hyphens, no digits/symbols */
      if(t.length>=2&&t.length<=60&&/^[A-Za-z][A-Za-z .'\-]{1,59}$/.test(t)){
        val=t.split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');
      }
    }else if(field==='phone'){val=validPhone(t);}
    else if(field==='email'){val=validEmail(t);}
    if(!val)return false;
    v[field]=val;
    _save(v);
    if(onCapture)onCapture(field,val,v.ip||'unknown');
    return true;
  }

  /* Try to detect volunteered info inside any free-form message */
  function sniff(txt){
    const t=txt.trim();

    /* clip name before filler/preposition words: "Rahul from Delhi" → "Rahul" */
    function _clip(s){
      const m=s.match(/\b(?:and|but|from|at|in|on|is|was|am|are|the|or|for|with|to|of|by|a(?:\s|$)|an(?:\s|$)|here|there|sir|mam|ji)\b/i);
      return(m?s.slice(0,m.index):s).trim();
    }

    /* ── NAME ── */
    /* A) Explicit declarations — always run even if name is set, so user can give a different name */
    const nm_e=t.match(
      /(?:my\s+(?:full\s+|good\s+|complete\s+|own\s+)?name\s*(?:is|:)\s*|(?:please\s+)?call\s+me\s+|you\s+can\s+call\s+me\s+|you\s+may\s+call\s+me\s+|people\s+(?:call|know)\s+me\s+(?:as\s+)?|everyone\s+calls?\s+me\s+|friends\s+call\s+me\s+|my\s+friends\s+call\s+me\s+|they\s+call\s+me\s+|my\s+close\s+ones\s+call\s+me\s+|most\s+people\s+call\s+me\s+|class(?:mates?)?\s+call\s+me\s+|teachers?\s+call\s+me\s+|i[' ]?m\s+called\s+|i\s+am\s+called\s+|i\s+go\s+by(?:\s+the\s+name(?:\s+of?)?)?\s+|known\s+as\s+|usually\s+(?:called|known\s+as)\s+|i(?:[' ]?m|\s+am)\s+known\s+as\s+|you\s+can\s+address\s+me\s+as\s+|please\s+address\s+me\s+as\s+|address\s+me\s+as\s+|you\s+can\s+refer\s+to\s+me\s+as\s+|myself\s+|my\s+name[' ]?s\s+|introducing\s+myself[,.\s]+i(?:[' ]?m|\s+am)\s+|let\s+me\s+introduce\s+myself[,.\s]+i(?:[' ]?m|\s+am)\s+|allow\s+me\s+to\s+introduce[^,]*,\s*i(?:[' ]?m|\s+am)\s+|i\s+would\s+introduce\s+myself\s+as\s+|hi[,\s]+it[' ]?s\s+|hey[,\s]+it[' ]?s\s+|it[' ]?s\s+me[,!\s]+|my\s+nickname\s+is\s+)([A-Za-z][A-Za-z .'\-]{1,50})/i
    );
    if(nm_e){const n=_clip(nm_e[1]);if(n.length>=2)capture(n,'name');}

    /* B) Semi-implicit — also runs when name already set so "I am X" can update it.
       Capital-first-letter + NOT_NAME blocklist guards against "I am fine/good/ok" etc. */
    const nm_i=t.match(
      /(?:this\s+is\s+|hi[,!\s]+(?:i[' ]?m\s+|i\s+am\s+)|hey[,!\s]+(?:i[' ]?m\s+|i\s+am\s+)|hello[,!\s]+(?:i[' ]?m\s+|i\s+am\s+)|nice\s+to\s+meet\s+you[,!\s]+(?:i[' ]?m\s+|i\s+am\s+)|btw[,\s]+(?:i[' ]?m\s+|i\s+am\s+|this\s+is\s+)|fyi[,\s]+(?:i[' ]?m\s+|this\s+is\s+)|by\s+the\s+way[,\s]+(?:i[' ]?m\s+|i\s+am\s+)|hey\s+divi[,!\s]+(?:i[' ]?m\s+|i\s+am\s+)|hi\s+divi[,!\s]+(?:i[' ]?m\s+|i\s+am\s+)|hello\s+divi[,!\s]+(?:i[' ]?m\s+|i\s+am\s+)|[Ii]\s+am\s+|[Ii][' ]?m\s+)([A-Z][a-zA-Z][a-zA-Z .'\-]{0,48})/
    );
    if(nm_i){
      const n=_clip(nm_i[1]);
      const NOT_NAME=/^(?:ok(?:ay)?|fine|good|great|back|done|ready|sure|well|next|last|new|late|free|busy|lost|tired|bored|sad|happy|angry|scared|confused|excited|nervous|afraid|upset|wrong|right|sorry|still|just|also|even|only|able|real|true|both|such|some|many|very)$/i;
      if(n.length>=2&&!NOT_NAME.test(n))capture(n,'name');
    }

    /* ── EMAIL ── intent check OR presence of @ (@ is distinctive enough on its own) */
    if(!v.email){
      const em_int=/(?:my\s+(?:email(?:\s+(?:id|i\.?d\.?|address|handle))?|e[-\s]?mail(?:\s+(?:id|address))?|gmail(?:\s+id)?|yahoo(?:\s+(?:id|mail))?|outlook(?:\s+(?:id|mail))?|hotmail(?:\s+(?:id|mail))?|rediffmail(?:\s+(?:id|mail))?|mail(?:\s+(?:id|address))?|contact\s+email|official\s+email|personal\s+email|business\s+email|work\s+email|inbox|id)\s*(?:is|:)|(?:email|e-?mail|mail)\s+me\s+(?:at|on)|you\s+can\s+(?:email|e-?mail|mail|ping|dm)\s+me|drop\s+(?:me\s+)?(?:an?\s+)?(?:email|mail)\s+(?:at|on|to)?|shoot\s+(?:me\s+)?(?:an?\s+)?(?:email|mail)\s+(?:at|on|to)?|send\s+(?:me\s+)?(?:an?\s+)?(?:email|mail)\s+(?:at|on|to)?|write\s+to\s+me\s+(?:at|on)?|feel\s+free\s+to\s+(?:email|mail)\s+me|(?:please|kindly)\s+(?:email|mail)\s+me|(?:reach|contact)\s+me\s+(?:via|through|over|by)\s+(?:email|e-?mail|mail)|i\s+(?:can\s+be|am)\s+reachable?\s+via\s+(?:email|mail)|here[' ]?s?\s+my\s+(?:email|mail|id)|email\s*(?:id\s*)?(?:is|:)|e-?mail\s*(?:id\s*)?(?:is|:)|ping\s+me\s+at|my\s+(?:email\s+)?address\s+is|(?:can|ask)\s+prabhat(?:\s+(?:bhaiya|sir|ranjan|ji))?\s+(?:to\s+)?(?:email|mail)\s+me)/i;
      if(em_int.test(t)||/@/.test(t)){
        const em=t.match(/\b([^\s@]{1,64}@[^\s@]{1,128}\.[a-zA-Z]{2,})\b/);
        if(em)capture(em[1],'email');
      }
    }

    /* ── PHONE ── only capture when user explicitly intends to share a contact number
       (avoids false-positives like JEE rank "12000", score "360", year "2024") */
    if(!v.phone){
      const ph_int=/(?:my\s+(?:phone(?:\s+(?:number|no\.?|num|#))?|mobile(?:\s+(?:number|no\.?|num))?|mob(?:ile)?(?:\s+(?:no\.?|number|num))?|cell(?:ular)?(?:\s+(?:number|no\.?))?|contact(?:\s+(?:number|no\.?|details?))?|whatsapp(?:\s+(?:number|no\.?))?|wp(?:\s+(?:number|no\.?))?|watsapp(?:\s+(?:number|no\.?))?|number|no\.?|helpline|ph(?:one)?(?:\s+(?:no\.?|number|num))?|tele(?:phone)?(?:\s+(?:no\.?|number))?|personal\s+number|official\s+number)\s*(?:is|:)|(?:call|contact|reach|ring|text|sms|ping|whatsapp|message|buzz)\s+me\s+(?:at|on)|you\s+can\s+(?:call|contact|reach|ring|text|whatsapp|message|buzz)\s+me(?:\s+(?:at|on))?|(?:can|ask)\s+prabhat(?:\s+(?:bhaiya|sir|ranjan|ji))?\s+(?:to\s+)?(?:call|reach|contact|ring|message|whatsapp|buzz)\s+me(?:\s+(?:at|on))?|prabhat(?:\s+(?:bhaiya|sir|ranjan|ji))?\s+can\s+(?:call|reach|contact|ring|message|whatsapp)\s+me(?:\s+(?:at|on))?|feel\s+free\s+to\s+(?:call|contact|reach|ring|text|whatsapp)\s+(?:me\s+)?(?:at|on)?|(?:please|kindly)\s+(?:call|contact|ring|whatsapp)\s+me(?:\s+(?:at|on))?|i\s+(?:can\s+be|am)\s+reachable?\s+(?:at|on)|reach\s+me\s+(?:out\s+(?:to\s+me\s+)?)?(?:at|on)|drop\s+(?:me\s+)?(?:a\s+)?(?:call|ring|text)\s+(?:at|on)|here[' ]?s?\s+my\s+(?:number|contact|phone|mobile)|number\s*(?:is|:)|phone\s*(?:no\.?)?\s*(?:is|:)|mobile\s*(?:no\.?)?\s*(?:is|:)|mob\s*(?:no\.?)?\s*(?:is|:)|dial\s+(?:me\s+)?(?:at|on)|contact\s+(?:no\.?\s*(?:is|:)|me\s+(?:at|on))|call\s+back\s+(?:at|on)|callback\s+(?:at|on))/i;
      if(ph_int.test(t)){
        const ph=t.match(/\b(\+?[\d][\d\s\-\(\)\.]{8,14}[\d])\b/);
        if(ph)capture(ph[1],'phone');
      }
    }
  }

  const SNOOZE_KEY='divu_vsnooze';
  function snooze(hours){
    const until=new Date(Date.now()+(hours||24)*3600*1000).toISOString();
    try{localStorage.setItem(SNOOZE_KEY,until);}catch(_){}
  }
  function isSnoozed(){
    try{const s=localStorage.getItem(SNOOZE_KEY);if(!s)return false;return Date.now()<new Date(s).getTime();}
    catch(_){return false;}
  }

  return{
    get:()=>v,
    nextField,
    isComplete:()=>!nextField(),
    getName:()=>v.name||null,
    capture,
    sniff,
    snooze,
    isSnoozed,
    bumpAsks(){v.asks=(v.asks||0)+1;_save(v);},
    getAsks(){return v.asks||0;},
  };
}
