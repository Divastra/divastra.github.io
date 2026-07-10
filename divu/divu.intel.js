/* ── Intelligence ── 70+ behavioural scenarios + visitor profiling + funnel */
import { applyExpr } from './divu.face.js';
import { showSymbol } from './divu.utils.js';
import { C } from './divu.comments.js';
import { pick } from './divu.utils.js';
import { CFG, EXCITE_D, HAPPY_D, IDLE_ANIM, NAME } from './divu.config.js';
import { analyzeEl } from './divu.face-mimic.js';
import { initMischief, initFlirty } from './divu.mischief.js';
import { initChat } from './divu.chat.js';

export function makeIntel(refs,lerp,pupils,bubble,root,body){
  /* ctx holds mutable state shared with initFlirty and initChat via reference */
  const ctx={state:'idle',manualUntil:0};
  let lastMoveMs=Date.now(),lastMx=0,lastMy=0,velBuf=[];
  let lastBtnEl=null,btnHoversSinceClick=0;
  let lastScrollY=0,lastScrollMs=Date.now();
  let posBuf=[],circleCooldown=0,premFirstVisit=true,tabWasHidden=false,mouseLeaveCoolMs=0;
  let formFocused=false,typingBuf=[],capsActive=false;
  const startTime=Date.now();

  /* ── Page context (set by each page before loading bundle) ── */
  const PAGE=window.DiviPageCtx||{id:'unknown',label:'',funnel:'awareness'};

  /* ── Cross-page journey tracker ── */
  const journey=(()=>{
    try{
      const j=JSON.parse(localStorage.getItem('divi_journey')||'{}');
      const prev=j.lastPage||null;
      j.pages=j.pages||{};
      j.pages[PAGE.id]=(j.pages[PAGE.id]||0)+1;
      j.pagesVisited=Object.keys(j.pages).filter(k=>k!=='unknown').length;
      j.lastPage=PAGE.id;
      j.prevPage=prev;
      j.firstSeen=j.firstSeen||Date.now();
      j.totalVisits=(j.totalVisits||0)+1;
      localStorage.setItem('divi_journey',JSON.stringify(j));
      return j;
    }catch(_){return{pages:{},pagesVisited:0,prevPage:null,totalVisits:1};}
  })();

  let visitCount=1,lastVisitDelta=null;
  try{visitCount=parseInt(localStorage.getItem('divi_visits')||'0')+1;localStorage.setItem('divi_visits',visitCount);const lt=localStorage.getItem('divi_last');localStorage.setItem('divi_last',Date.now());if(lt)lastVisitDelta=Date.now()-parseInt(lt);}catch(_){}

  const milestones=[
    {ms:30000,state:'happy',msg:'30 seconds in! Clearly intrigued 😊'},
    {ms:60000,state:'proud',msg:'One whole minute! Dedication! ✨'},
    {ms:120000,state:'beaming',msg:'2 minutes! You REALLY want this 😤'},
    {ms:300000,state:'triumphant',msg:'5 minutes!! You\'re practically in!! 💖'},
  ];
  let mIdx=0;

  function forceState(s,dur,msg){
    ctx.state=s;applyExpr(s,refs,lerp);
    if(msg)bubble.forceShow(msg,dur||3000);else bubble.forState(s,true);
    ctx.manualUntil=Date.now()+(dur||3000);
  }
  function setState(s){
    if(s===ctx.state||Date.now()<ctx.manualUntil)return;
    ctx.state=s;applyExpr(s,refs,lerp);bubble.forState(s,false);
  }

  const CTASel=[...new Set(['.btn-primary','.btn-cta','button[type="submit"]','input[type="submit"]',...(CFG.ctaSelectors||[])])].join(',');

  function nearBtnDist(mx,my){let min=Infinity;try{document.querySelectorAll(CTASel).forEach(b=>{if(!b.offsetParent)return;const r=b.getBoundingClientRect();min=Math.min(min,Math.hypot(mx-(r.left+r.width/2),my-(r.top+r.height/2)));});}catch(_){}return min;}
  function inPremium(mx,my){for(const sel of(CFG.premiumSelectors||[])){const p=document.querySelector(sel);if(!p)continue;const r=p.getBoundingClientRect();if(mx>r.left&&mx<r.right&&my>r.top&&my<r.bottom)return true;}return false;}
  function nearSelf(mx,my){const r=refs.svg.getBoundingClientRect();return Math.hypot(mx-(r.left+r.width/2),my-(r.top+r.height/2))<92;}
  function inCloseArea(mx,my){return mx>window.innerWidth-75&&my<65;}
  function atCenter(mx,my){return Math.hypot(mx-window.innerWidth/2,my-window.innerHeight/2)<40;}

  function checkCircles(mx,my,vel){
    if(vel<3){posBuf=[];return false;}
    posBuf=[...posBuf.slice(-9),{x:mx,y:my}];if(posBuf.length<8)return false;
    const angles=[];for(let i=1;i<posBuf.length;i++){const dx=posBuf[i].x-posBuf[i-1].x,dy=posBuf[i].y-posBuf[i-1].y;if(Math.hypot(dx,dy)<2)continue;angles.push(Math.atan2(dy,dx));}
    if(angles.length<5)return false;let total=0;for(let i=1;i<angles.length;i++){let d=angles[i]-angles[i-1];if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;total+=d;}
    return Math.abs(total)>Math.PI*1.5;
  }

  function timeGreeting(){
    const h=new Date().getHours();
    if(h>=2&&h<6)return{s:'worried',m:`It's ${h}AM!! Go to SLEEP!! 😱😴`};
    if(h>=6&&h<10)return{s:'beaming',m:'Good morning!! ☀️ Early bird energy! Let\'s go!'};
    if(h>=10&&h<13)return{s:'happy',m:'Morning! ☕ Productive mode: ON!'};
    if(h>=13&&h<15)return{s:'cheeky',m:'Lunch break browsing? I respect that 😏'};
    if(h>=15&&h<19)return{s:'happy',m:'Afternoon! 🌤️ Let\'s find what you need!'};
    if(h>=19&&h<22)return{s:'content',m:'Evening~ 🌆 Winding down or just starting?'};
    return{s:'curious',m:'Night owl! 🦉 What are we exploring tonight?'};
  }

  function decide(mx,my,vel){
    const idle=Date.now()-lastMoveMs;
    if(idle>60000)return'deepAsleep';if(idle>35000)return'sleepy';if(idle>12000)return'bored';if(idle>3500)return'thinking';
    if(nearSelf(mx,my))return'shy';
    if(inCloseArea(mx,my))return'panicking';
    if(atCenter(mx,my)&&vel<0.5)return'curious';
    if(vel>38)return'surprised';if(vel>18)return'excited';
    if(my<window.innerHeight*.05)return'worried';
    if(inPremium(mx,my))return'lovey';
    if(formFocused)return'excited';
    if(btnHoversSinceClick>=5)return'pleading';if(btnHoversSinceClick>=3)return'nervous';
    const d=nearBtnDist(mx,my);
    if(d<35)return'excited';if(d<EXCITE_D)return'happy';if(d<HAPPY_D)return(vel>0.4&&vel<2.8)?'thinking':'curious';
    if(vel>0.4&&vel<2.8)return'pensive';
    return'idle';
  }

  function attachSmartListeners(){
    const allSel=[CTASel,...(CFG.priceSelectors||[]),'[class*="price"]','a[href*="youtube"]','a[href*="youtu.be"]','input:not([type="hidden"])','textarea','select',...(CFG.premiumSelectors||[]),'[class*="review"],[class*="rating"]','[class*="success"],[class*="error"]','video'].join(',');
    try{document.querySelectorAll(allSel).forEach(el=>{if(el.closest('#divu-root'))return;const react=()=>{if(Date.now()<ctx.manualUntil)return;const r=analyzeEl(el);if(!r)return;forceState(r.state,2200,r.msg||null);if(!r.msg)bubble.forState(r.state,true);};el.addEventListener('mouseenter',react,{passive:true});el.addEventListener('focus',react,{passive:true});});}catch(_){}
  }

  document.addEventListener('mousemove',e=>{
    const dx=e.clientX-lastMx,dy=e.clientY-lastMy,v=Math.hypot(dx,dy);
    velBuf=[...velBuf.slice(-3),v];const av=velBuf.reduce((a,b)=>a+b,0)/velBuf.length;
    lastMx=e.clientX;lastMy=e.clientY;
    const wasIdle=Date.now()-lastMoveMs>5000;lastMoveMs=Date.now();
    pupils.setTarget(e.clientX,e.clientY);
    if(body&&(wasIdle||body.isRoaming()))body.caught(bubble);
    if(checkCircles(e.clientX,e.clientY,av)&&Date.now()>circleCooldown){circleCooldown=Date.now()+5500;forceState('confused',3500,'You\'re making me DIZZY!! 😵‍💫');showSymbol(refs,'😵');return;}
    setState(decide(e.clientX,e.clientY,av));
  });
  document.addEventListener('mouseleave',()=>{
    const now=Date.now();
    /* Only fire once per 3 min, and only after user has been on page ≥10 s */
    if(now>ctx.manualUntil&&now-startTime>10000&&now-mouseLeaveCoolMs>180000){
      mouseLeaveCoolMs=now;
      forceState('worried',5000,'Hey!! Don\'t leave me!! 🥺');
    }
    pupils.wander();
  });
  document.addEventListener('mouseenter',()=>{if(Date.now()>ctx.manualUntil)forceState('happy',2000,lastVisitDelta&&lastVisitDelta<3600000?'Back so soon?? I love it!! ❤️':null);});

  document.addEventListener('keydown',e=>{
    const active=document.activeElement;const inForm=['INPUT','TEXTAREA'].includes(active?.tagName);
    if(inForm){
      typingBuf=[...typingBuf.slice(-4),Date.now()];
      if(typingBuf.length>=4&&typingBuf[3]-typingBuf[0]<380&&Date.now()>ctx.manualUntil){forceState('impressed',1500,'FAST TYPER!! ⚡');return;}
      if(e.key==='Backspace'&&e.repeat&&Date.now()>ctx.manualUntil){forceState('worried',1500,'Wait!! Don\'t delete EVERYTHING!! 😱');return;}
      if(e.key==='Enter'&&Date.now()>ctx.manualUntil){forceState('excited',1500,'YES!! Submitting!! GO!! 🚀');return;}
      if(Date.now()>ctx.manualUntil)setState('curious');
    }else{
      if(e.key==='Escape'&&Date.now()>ctx.manualUntil){forceState('confused',1500,'Escaping from what exactly? 😅');return;}
      if((e.ctrlKey||e.metaKey)&&e.key==='z'&&Date.now()>ctx.manualUntil){forceState('laughing',1500,'Ctrl+Z — classic!! 😂');return;}
      if((e.ctrlKey||e.metaKey)&&e.key==='a'&&Date.now()>ctx.manualUntil){forceState('impressed',1500,'SELECT ALL?! Big moves! 👏');return;}
      if((e.ctrlKey||e.metaKey)&&e.key==='p'&&Date.now()>ctx.manualUntil){forceState('smug',2000,'Printing it out? Very old school 😏');return;}
    }
    if(e.getModifierState&&e.getModifierState('CapsLock')&&!capsActive){capsActive=true;if(Date.now()>ctx.manualUntil)forceState('surprised',2000,'WHY ARE YOU SHOUTING?? 😱');}
  });
  document.addEventListener('keyup',e=>{if(e.key==='CapsLock')capsActive=false;});

  window.addEventListener('scroll',()=>{
    lastMoveMs=Date.now(); /* scrolling = user is active */
    const now=Date.now(),dy=Math.abs(window.scrollY-lastScrollY),dt=Math.max(1,now-lastScrollMs);
    lastScrollY=window.scrollY;lastScrollMs=now;if(dt<50)return;
    const spd=dy/dt;
    if(spd>3&&Date.now()>ctx.manualUntil){forceState('awestruck',2000,'SLOW DOWN!! Did you even read that?! 😤');showSymbol(refs,'!');return;}
    if(spd<0.2&&dy>5&&Date.now()>ctx.manualUntil)setState('content');
    const pct=window.scrollY/Math.max(1,document.body.scrollHeight-window.innerHeight);
    if(pct>.92&&Date.now()>ctx.manualUntil){forceState('triumphant',3200,'Scrolled ALL the way! LEGENDARY!! 💪');showSymbol(refs,'✓');}
    if(pct<.05&&lastScrollY>200&&Date.now()>ctx.manualUntil)forceState('excited',2000,'Fresh start from the top! Let\'s GO!! 🔄✨');
  },{passive:true});

  /* Mobile touch: treat touch and touchmove as user activity (same as mousemove on desktop) */
  document.addEventListener('touchstart',e=>{
    const t=e.touches[0];if(t)pupils.setTarget(t.clientX,t.clientY);
    const wasIdle=Date.now()-lastMoveMs>5000;lastMoveMs=Date.now();
    if(body&&(wasIdle||body.isRoaming()))body.caught(bubble);
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    const t=e.touches[0];if(t)pupils.setTarget(t.clientX,t.clientY);
    lastMoveMs=Date.now();
  },{passive:true});

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){tabWasHidden=true;}
    else if(tabWasHidden){tabWasHidden=false;forceState('beaming',4000,'YOU\'RE BACK!! I missed you SO MUCH!! 🥹');showSymbol(refs,'!');}
  });

  document.addEventListener('contextmenu',()=>{forceState('mischievous',2500,'Ooh sneaky! What are you plotting? 😏');showSymbol(refs,'?');});
  document.addEventListener('copy',()=>{if(Date.now()>ctx.manualUntil)forceState('smug',2000,'Copying good stuff! Excellent taste 😏');});
  document.addEventListener('paste',()=>{if(Date.now()>ctx.manualUntil)forceState('surprised',1500,'Pasted something? Bold move! 📋');});

  let selTimer=null;
  document.addEventListener('selectionchange',()=>{clearTimeout(selTimer);selTimer=setTimeout(()=>{const s=window.getSelection();if(s&&s.toString().length>15&&Date.now()>ctx.manualUntil)forceState('curious',2500,'Taking notes? Very studious! 📝');},600);});

  document.addEventListener('focusin',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)&&!e.target.closest('#divu-root')){formFocused=true;if(Date.now()>ctx.manualUntil)forceState('excited',2000,pick(C.onFormFocus)||'Filling something in! ✏️ Let\'s go!!');}});
  document.addEventListener('focusout',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)&&!e.target.closest('#divu-root')){formFocused=false;const val=(e.target.value||'').trim();if(!val&&Date.now()>ctx.manualUntil)forceState('pleading',3000,'Wait! Come back and fill that in! 🥺');}});

  document.querySelectorAll(CTASel).forEach(b=>{b.addEventListener('mouseenter',()=>{btnHoversSinceClick=(b===lastBtnEl)?btnHoversSinceClick+1:1;lastBtnEl=b;if(btnHoversSinceClick===4&&Date.now()>ctx.manualUntil){forceState('pleading',3000,'JUST CLICK IT!! I\'M BEGGING YOU!! 🥺🙏');showSymbol(refs,'!');}});});
  document.addEventListener('click',e=>{const onBtn=e.target.closest(CTASel.split(',').join(','));if(onBtn){btnHoversSinceClick=0;const s=Math.random()>.5?'triumphant':'beaming';forceState(s,3200,s==='triumphant'?'YESSSS!! ABSOLUTE LEGEND!! 🎉🚀':'YAAAAAY!! GREAT CHOICE!! 😄✨');showSymbol(refs,'!');}});

  (CFG.premiumSelectors||[]).forEach(sel=>{const card=document.querySelector(sel);if(!card)return;card.addEventListener('mouseenter',()=>{if(premFirstVisit&&Date.now()>ctx.manualUntil){premFirstVisit=false;forceState('melting',3500,pick(C.lovey)||'PREMIUM TASTE!! Exceptional!! 💎');showSymbol(refs,'♥');}});});

  window.addEventListener('resize',()=>{const W=window.innerWidth;if(W<500&&Date.now()>ctx.manualUntil)forceState('nervous',1500,'Mobile mode! Cozy little screen! 📱');else if(W>2400&&Date.now()>ctx.manualUntil)forceState('awestruck',2000,'What a HUGE screen!! 🖥️ So much space!');},{passive:true});

  setInterval(()=>{
    if(mIdx<milestones.length&&Date.now()-startTime>=milestones[mIdx].ms){const m=milestones[mIdx++];forceState(m.state,3500,m.msg);return;}
    if(Date.now()<ctx.manualUntil)return;
    const idleMs=Date.now()-lastMoveMs;
    if(IDLE_ANIM&&body)body.update(idleMs,bubble);
    if(idleMs>60000){ctx.state='deepAsleep';applyExpr('deepAsleep',refs,lerp);showSymbol(refs,'z');}
    else if(idleMs>35000){ctx.state='sleepy';applyExpr('sleepy',refs,lerp);}
    else if(idleMs>12000){ctx.state='bored';applyExpr('bored',refs,lerp);}
    if(idleMs>4500)pupils.wander();
  },3500);

  setInterval(()=>{if(Date.now()-lastMoveMs>900)pupils.wander();},900);

  const tg=timeGreeting();const greet=CFG.greeting||`Hey! I'm ${NAME}! 👋 Let me know if you need anything ✨`;

  /* ── Page-aware greeting ── */
  function pageGreeting(){
    const p=journey.pages,pv=journey.pagesVisited,prev=journey.prevPage;
    /* Counselling page — reference their journey */
    if(PAGE.id==='counselling'){
      if(p.rank>=1)return{s:'excited',m:'You checked your rank AND came here~ you\'re doing this properly!! 🎯 Let\'s find your dream college!'};
      if(p.books>=1&&p.video>=1)return{s:'beaming',m:'Books, videos AND now counselling~ I love a thorough student!! Prabhat sir will too 💕'};
      if(pv>=2)return{s:'flirty',m:'You\'ve explored a bit before landing here~ I like that. Now let\'s get serious 😏'};
      return null; /* fall through to default */
    }
    /* Rank predictor — they\'re checking rank, high intent */
    if(PAGE.id==='rank'){
      if(p.counselling>=1)return{s:'wink',m:'Back from the counselling page~ checking numbers again? Smart! 😏'};
      return{s:'curious',m:'Predicting your rank? This is where it gets REAL 👀 Enter your marks and let\'s see what we\'re working with~'};
    }
    /* Books page */
    if(PAGE.id==='books'){
      if(p.counselling>=1)return{s:'smug',m:'Already visited the counselling page AND came back for books~ I like your style 📚😏'};
      if(p.video>=1)return{s:'happy',m:'Videos AND books — you\'re doing your homework properly! Prabhat sir notices students like you 😌'};
      return{s:'curious',m:'Free books are amazing~ but between us? A personal session with Prabhat sir beats any PDF 📚😏'};
    }
    /* Video page */
    if(PAGE.id==='video'){
      if(p.counselling>=1)return{s:'lovey',m:'Already booked and still watching videos~ dedicated!! 🥰'};
      return{s:'happy',m:'Watching Prabhat sir\'s videos~ someone\'s getting serious! 📺 The live version hits different though 😏'};
    }
    /* Home page */
    if(PAGE.id==='home'){
      if(pv>=3)return{s:'lovey',m:`You've explored ${pv} pages already~ I've been watching 👀 The counselling page is where it all comes together 💕`};
      if(p.counselling>=1)return{s:'beaming',m:'Back to explore more~ I\'m always here for you 💕'};
    }
    return null;
  }

  /* ── Counselling nudge — fires 90-120s after load on non-counselling pages ── */
  if(PAGE.id!=='counselling'){
    const nudgeDelay=90000+Math.random()*30000;
    setTimeout(()=>{
      if(Date.now()<ctx.manualUntil+500||journey.pages.counselling>=1)return;
      const nudges={
        rank:   ['With your rank in hand, a JoSAA strategy session is literally the next step 🎯 Have you seen the counselling page?','Your rank means options — but only if you navigate JoSAA right. That\'s exactly what Prabhat sir does 💡'],
        books:  ['These resources are great~ but imagine getting all of this EXPLAINED for your specific rank and options. Prabhat sir\'s counselling page does exactly that 💡','Free resources are the start~ but one session with Prabhat sir can save months of confusion 😌'],
        video:  ['You\'re learning from his videos~ now imagine asking YOUR specific questions directly to Prabhat sir 🎯 The counselling page has that option~','Videos teach everyone the same thing. A counselling session is just for YOU~ 😏'],
        home:   ['You\'ve been exploring~ have you seen the counselling page yet? That\'s where the real magic happens for your JEE journey 💡','Everything on this site points to one thing — Prabhat sir\'s counselling. Have you checked it out? 😏'],
        unknown:['Quick question~ have you seen the counselling page? That\'s where JEE guidance gets personal 🎯'],
      };
      const pool=nudges[PAGE.id]||nudges.unknown;
      forceState('wink',6000,pick(pool));
    },nudgeDelay);
  }

  setTimeout(()=>{
    const pg=pageGreeting();
    if(pg){forceState(pg.s,4000,pg.m);return;}
    if(visitCount===1)forceState('excited',3500,greet);
    else if(lastVisitDelta&&lastVisitDelta<86400000)forceState('lovey',3000,'You\'re back!! I\'ve been waiting!! ❤️');
    else forceState(tg.s||'flirty',3000,tg.m||greet);
  },1800);

  setTimeout(()=>attachSmartListeners(),3000);

  /* ── Intelligence System v2 ── visitor profiling · funnel · section-aware comments */
  (()=>{
    const prof={
      type:visitCount>1?'returnVisitor':'unknown',funnel:'aware',engagement:0,
      signals:{ctaHovers:0,textSelections:0,scrollReversals:0,scrollDepthMax:0,sectionsVisited:new Set(),backToSectionCount:0,rageScrolls:0},
    };
    function updateFunnel(){
      const s=prof.signals,dwell=Date.now()-startTime;
      if(s.ctaHovers>=4||(s.scrollDepthMax>.85&&dwell>120000)){prof.funnel='almostBuyer';if(prof.type!=='returnVisitor'&&prof.type!=='converted')prof.type='almostBuyer';}
      else if(s.ctaHovers>=2||s.scrollDepthMax>.7||dwell>60000){if(prof.funnel==='aware'||prof.funnel==='curious'||prof.funnel==='engaged')prof.funnel='considering';}
      else if(s.sectionsVisited.size>=3||dwell>30000){if(prof.funnel==='aware'||prof.funnel==='curious')prof.funnel='engaged';}
      else if(s.scrollReversals>=1||s.scrollDepthMax>.3){if(prof.funnel==='aware')prof.funnel='curious';}
      if(prof.type!=='almostBuyer'&&prof.type!=='returnVisitor'&&prof.type!=='converted'){
        if(s.textSelections>2||(dwell>90000&&s.scrollDepthMax>.5))prof.type='researcher';
        else if(s.ctaHovers>0&&dwell<25000)prof.type='impulse';
        else if(s.scrollReversals>3&&s.backToSectionCount>2)prof.type='comparison';
        else if(s.scrollDepthMax<.15&&dwell>20000)prof.type='lost';
      }
    }
    function engUp(n){prof.engagement=Math.min(100,prof.engagement+n);}

    const conv={lastMs:0,lastTopic:null,stack:[],funnelFired:new Set(),sectionFirst:{},anchoredPricing:false,fomoFired:false,lossAversionFired:false,typeReacted:{},escalationIdx:0};
    const NAR_GAP=8000;
    function canNar(){return Date.now()-conv.lastMs>NAR_GAP&&Date.now()>ctx.manualUntil+200;}
    function nar(s,d,msg,topic){if(!canNar())return false;forceState(s,d,msg);conv.lastMs=Date.now();conv.lastTopic=topic||s;conv.stack=[...conv.stack.slice(-4),{topic:topic||s,ts:Date.now()}];engUp(1);return true;}
    function narForce(s,d,msg,topic){forceState(s,d,msg);conv.lastMs=Date.now();conv.lastTopic=topic||s;conv.stack=[...conv.stack.slice(-4),{topic:topic||s,ts:Date.now()}];}

    const PAGE_MAP=CFG.pageMap||[
      {sel:'[id*="feature"],[class*="feature"],[data-section="features"]',         topic:'features',   intent:'awareness'},
      {sel:'[id*="price"],[id*="pricing"],[class*="pric"],[data-section="pricing"]',topic:'pricing',    intent:'decision'},
      {sel:'[id*="review"],[id*="testimonial"],[class*="review"],[class*="testimonial"]',topic:'social',intent:'trust'},
      {sel:'[id*="faq"],[class*="faq"],[id*="question"],[data-section="faq"]',     topic:'objections', intent:'hesitation'},
      {sel:'[id*="contact"],[id*="enroll"],[id*="book"],[class*="cta-section"]',   topic:'cta',        intent:'conversion'},
      {sel:'footer,[id*="footer"],[class*="footer"]',                              topic:'footer',     intent:'exit'},
    ];
    function getTopicEntry(){for(const e of PAGE_MAP){try{for(const el of document.querySelectorAll(e.sel)){if(el.closest('#divu-root'))continue;const r=el.getBoundingClientRect();if(Math.max(0,Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0))>window.innerHeight*.28)return e;}}catch(_){}}return null;}

    function onTopicFirst(entry){
      const{topic}=entry;
      if(topic==='pricing'&&!conv.anchoredPricing){conv.anchoredPricing=true;setTimeout(()=>nar('smug',4000,pick(['Most people come here expecting to be shocked. And then... aren\'t. 😌','Not gonna lie, this is where people go "wait, that\'s it?" 😏','Pricing section~ where people pleasantly surprise themselves 💅','I\'m watching your face when you see the number~ 😏']),'pricing_anchor'),1800);}
      else if(topic==='social'){setTimeout(()=>nar('curious',3500,pick(['Reading the reviews? Classic pre-decision move. I respect it 📖','The reviews section~ where skeptics become believers 😌','Other people felt exactly what you\'re feeling. And then they didn\'t. 😌','Checking what others say~ smart. You\'re thorough. 🧐']),'social_first'),1500);}
      else if(topic==='objections'){setTimeout(()=>nar('wink',3500,pick(['The FAQ section~ this is where "almost" becomes "yes" 😏','Most people only hit FAQ when they\'re already half-convinced 😌','I see you doing your due diligence~ I like that about you 🧐','FAQ visit means you\'re *this* close. I\'m calling it. 😏']),'faq_first'),1500);}
      else if(topic==='cta'){setTimeout(()=>nar('flirty',4000,pick(['You scrolled ALL the way here. That\'s not an accident. 😌','Okay so you\'ve made it~ the universe is saying something 😏','This is my favourite part of the page. Because you\'re ready. 😏','We ended up here together~ feels right 😌']),'cta_first'),1000);}
      else if(topic==='features'){setTimeout(()=>nar('curious',3000,pick(['Features section~ let\'s see what catches your eye 👀','This is where people go "oh wait, THAT too?" 😮','Something here is going to land different. I can feel it~ 🧐']),'features_first'),1500);}
      else if(topic==='footer'){setTimeout(()=>{if(prof.funnel==='converted')return;nar('pleading',3500,pick(['The footer already? We weren\'t done~ 😔','Everything you need is one scroll back up 😏','You made it this far~ don\'t stop now 🥺']),'footer_hit');},600);}
    }

    function onFunnelAdvance(f){
      if(conv.funnelFired.has(f))return;conv.funnelFired.add(f);
      if(f==='engaged')setTimeout(()=>nar('flirty',3500,pick(['You\'ve been here a while~ I notice these things 😌','Okay we\'re properly exploring now. I like it. 😏','The longer you stay the more I like you~ just saying 😌','Something\'s keeping you here. I choose to believe it\'s me. 😌']),'funnel_engaged'),800);
      else if(f==='considering')setTimeout(()=>nar('smug',3500,pick(['I can tell you\'re actually thinking about this 😏','Something\'s holding you back~ what is it? Tell me 🤔','Almost. *taps chin* You\'re almost there 😌','You\'re in "weighing it up" mode. I can see it. 👀']),'funnel_considering'),800);
      else if(f==='almostBuyer')setTimeout(()=>nar('beaming',4500,pick(['Okay so I\'ve been watching and... you want this. You know it. 😏','Everything you\'ve done on this page is pointing to one thing 😌','I\'ve seen a lot of visitors. You have that energy~ 💅','This is the moment. I can feel it from here. 🌟']),'funnel_almostBuyer'),400);
    }

    function onTypeDetected(type){
      if(conv.typeReacted[type])return;conv.typeReacted[type]=true;
      const msgs={researcher:['I can tell you\'re the "read everything first" type 📖 I like you.','Thorough researcher energy~ you don\'t rush decisions. Respect. 🧐','Collecting all the info before deciding. Smart. Very smart. 😌'],impulse:['Someone who knows what they want 😏 I see it.','Quick and decisive~ I\'m already a fan 💅'],comparison:['You\'re comparing, aren\'t you~ I can see the back-and-forth 😏','Weighing your options? I\'m biased but I know what I\'d choose 😌'],lost:['Hey~ can I help you find something? I\'m right here 🧐','Not sure where to start? Let me guide you~ 😌','Tell me what you\'re looking for and I\'ll point you there 👀'],returnVisitor:['You came back~ I was hoping you would 😌','The return visit! This means something 😏','Back again~ honestly I\'m flattered 😌']};
      const pool=msgs[type];
      if(pool)setTimeout(()=>nar(type==='lost'?'worried':type==='researcher'?'pensive':type==='returnVisitor'?'lovey':'smug',3500,pick(pool),'type_'+type),2000);
    }

    const escalation=[
      {check:()=>prof.signals.sectionsVisited.size>=2,s:'happy',msgs:['Exploring multiple sections~ good strategy 😌','Being thorough. I respect that. 🧐']},
      {check:()=>prof.signals.sectionsVisited.size>=4,s:'proud',msgs:['You\'ve seen most of the page~ what\'s the verdict? 🧐','Full tour done! What\'s standing out? 😏']},
      {check:()=>prof.signals.ctaHovers>=1,           s:'wink', msgs:['Noticed you looking at the main button~ 😉','That button noticed you too. Just saying. 😏']},
      {check:()=>prof.signals.ctaHovers>=3,           s:'smug', msgs:['Three hovers. At this point I\'m a witness. 😏','Impressive self-restraint. I couldn\'t do it. 💅']},
    ];
    function checkEscalation(){if(conv.escalationIdx>=escalation.length)return;const e=escalation[conv.escalationIdx];if(e.check()&&nar(e.s,3000,pick(e.msgs),'escalation'))conv.escalationIdx++;}

    const bm={scrollDir:'none',lastScrollY:window.scrollY,scrollHistory:[],currentTopic:null,topicEnterMs:0,topicTimeMap:{},topicReturns:{},lastIndecisionMs:0,lastRageMs:0,btnHovers:{},readNudgeFired:false,prevFunnel:'aware'};
    let scrRaf=false;
    window.addEventListener('scroll',()=>{
      if(scrRaf)return;scrRaf=true;
      requestAnimationFrame(()=>{
        scrRaf=false;
        const now=Date.now(),y=window.scrollY,dy=y-bm.lastScrollY;if(Math.abs(dy)<6)return;
        const dir=dy>0?'down':'up';
        prof.signals.scrollDepthMax=Math.max(prof.signals.scrollDepthMax,y/Math.max(1,document.body.scrollHeight-window.innerHeight));
        if(Math.abs(dy)>350&&now-bm.lastRageMs>8000){bm.lastRageMs=now;prof.signals.rageScrolls++;nar('surprised',2500,pick(['WOAH!! Easy there!! 😱','Rage scrolling?? Did I do something?? 😅','That was a fast exit from that section 😮','Okay okay, moving on! 💨']),'rage');}
        if(dir!==bm.scrollDir&&bm.scrollDir!=='none'){
          bm.scrollHistory=[...bm.scrollHistory.slice(-11),{dir,ts:now}];prof.signals.scrollReversals++;
          if(dir==='up'){const recentUps=bm.scrollHistory.filter(h=>h.dir==='up'&&now-h.ts<20000).length;if(recentUps>=3&&now-bm.lastIndecisionMs>14000){bm.lastIndecisionMs=now;if(prof.type!=='almostBuyer')prof.type='comparison';nar('cheeky',3500,pick(['Okay I\'m going to say it — you can\'t decide, can you? 😏','Back and forth, back and forth~ I see you 👀','Your commitment to being undecided is honestly impressive 😈','Are you comparing? Talk to me~ I have opinions 🤔','The indecision is SENDING me 😂 What are we looking for?']),'indecision');}else{nar('curious',2800,pick(['Going back up? Something caught your eye~ 👀','Scrolling back! Miss something? 🧐','*watches you scroll up* Interesting. Very interesting. 😏','Can\'t stop thinking about something up there~ 🤔','That reversal~ something grabbed you, didn\'t it 😏']),'reversal');}}
          else{if(conv.lastTopic==='reversal'||conv.lastTopic==='indecision')nar('smug',2500,pick(['Found what you were looking for? 😏 Called it.','Back on track! I knew you\'d figure it out 💅','Decision made? Good. I was waiting. 😌','And we\'re moving forward~ I respect the whole process 🚀']),'resume');}
        }
        bm.scrollDir=dir;bm.lastScrollY=y;
        const entry=getTopicEntry(),topicKey=entry?.topic||null;
        if(topicKey!==bm.currentTopic){
          if(bm.currentTopic&&bm.topicEnterMs)bm.topicTimeMap[bm.currentTopic]=(bm.topicTimeMap[bm.currentTopic]||0)+(now-bm.topicEnterMs);
          if(topicKey){prof.signals.sectionsVisited.add(topicKey);bm.topicReturns[topicKey]=(bm.topicReturns[topicKey]||0)+1;const ret=bm.topicReturns[topicKey];if(ret===1&&entry)onTopicFirst(entry);else if(ret===2){prof.signals.backToSectionCount++;nar('wink',2800,pick(['Back to this part again~ 😉','Second visit — I notice everything 😏','Can\'t stay away from this spot~ 😌']),'section_return');}else if(ret>=3){nar('smug',2800,pick(['Third time here. Officially your favourite. 😏','Okay this is clearly THE spot. I\'m noting this. 💅']),'section_return3');}}
          bm.currentTopic=topicKey;bm.topicEnterMs=now;bm.readNudgeFired=false;
        }
        updateFunnel();if(prof.funnel!==bm.prevFunnel){onFunnelAdvance(prof.funnel);bm.prevFunnel=prof.funnel;}
        if(prof.type!=='unknown')onTypeDetected(prof.type);checkEscalation();
      });
    },{passive:true});

    setInterval(()=>{
      if(!bm.currentTopic||!bm.topicEnterMs)return;
      const spent=Date.now()-bm.topicEnterMs;
      if(spent>22000&&!bm.readNudgeFired){bm.readNudgeFired=true;nar('pensive',3500,pick(['*quietly watches you read* Thorough. I like it. 📖','You\'re really taking this in~ good sign 😌','Reading every word! I respect that 🧐','*leans over* What\'s catching your eye here? 👀','Taking your time~ smart. Best way to decide. 😌','Not skimming~ actually reading. You\'re different~ 📖']),'reading');}
      if(spent>60000&&canNar()){nar('flirty',3500,pick(['Still here with me~ I could get used to this 😌','You and this section, huh? I see how it is 😏','We\'ve been here a while together. Feels close~ 😌']),'dwelling');bm.topicEnterMs=Date.now();}
      if(!conv.fomoFired&&CFG.socialProof&&(prof.funnel==='considering'||prof.funnel==='almostBuyer')&&Date.now()-startTime>90000&&canNar()){conv.fomoFired=true;const n=CFG.socialProof.weeklySignups||143;nar('flirty',4500,CFG.socialProof.message||`${n} students joined this week. Just putting that out there~ 📊`,'fomo');}
    },6000);

    let hesX=0,hesY=0,hesTimer=null;
    document.addEventListener('mousemove',e=>{
      if(Math.hypot(e.clientX-hesX,e.clientY-hesY)>16){
        hesX=e.clientX;hesY=e.clientY;clearTimeout(hesTimer);
        hesTimer=setTimeout(()=>{
          if(Date.now()<ctx.manualUntil+200)return;
          const el=document.elementFromPoint(hesX,hesY);if(!el||el.closest('#divu-root'))return;
          const onCta=!!el.closest('button,a,[class*="btn"]');const txt=(el.textContent||'').trim();
          if(onCta&&txt.length>0)nar('wink',2500,pick(['That thing you\'re hovering~ it\'s good 😉','*notices where your cursor stopped* Interesting choice 😏','I see what you\'re considering~ 👀','Just hovering... or deciding? 😌']),'hesitation_cta');
          else if(txt.length>25)nar('curious',2500,pick(['*leans in* That part caught your eye~ 🧐','Reading that closely? Something resonating? 😌','That\'s a good one to sit with 😏','*quietly reads alongside you* 📖']),'hesitation_text');
        },1800);
      }
    });

    let exitCooldown=0,prevMouseY=0;
    document.addEventListener('mousemove',e=>{
      const prevY=prevMouseY;prevMouseY=e.clientY;
      if(e.clientY<45&&prevY>90&&Date.now()>exitCooldown&&Date.now()>ctx.manualUntil){
        const dwell=Date.now()-startTime;if(dwell<40000)return;
        exitCooldown=Date.now()+35000;
        if(dwell>120000&&!conv.lossAversionFired){conv.lossAversionFired=true;narForce('tearful',5000,pick([`You've spent ${Math.round(dwell/60000)} minute${dwell>119999?'s':''} here... don't let that research be for nothing~ 🥺`,'Wait— you\'re leaving? After everything we\'ve been through? 😢','I watched you go through this whole page and you\'re just... going? 🥺']),'loss_aversion');}
        else{nar('worried',4000,pick(['Wait wait wait— one more second~ 😰','You\'re so close! Don\'t go now~ 🥺','Come BACK!! We were getting somewhere!! 😭','I have more to show you!! 😰','No no no— not yet~ 🥺']),'exit_intent');}
      }
    });

    setTimeout(()=>{
      document.querySelectorAll(CTASel).forEach(btn=>{
        if(btn.closest('#divu-root'))return;
        const key=(btn.textContent||btn.value||'').trim().slice(0,30)||btn.className.slice(0,20);
        btn.addEventListener('mouseenter',()=>{
          prof.signals.ctaHovers++;
          const h=bm.btnHovers[key]||(bm.btnHovers[key]={count:0,nagged:false});h.count++;
          updateFunnel();if(prof.funnel!==bm.prevFunnel){onFunnelAdvance(prof.funnel);bm.prevFunnel=prof.funnel;}
          if(h.count===3&&!h.nagged){h.nagged=true;nar('wink',3500,pick(['You keep hovering over this~ 😉 It\'s calling your name.','Third time here... *raises eyebrow* 😏','It\'s not going to click itself~ 😌','This button and you have unfinished business 😏']),'btn3');}
          else if(h.count===5){nar('smug',3500,pick(['Five times hovering. I am personally invested now 😏','THE BUTTON IS RIGHT THERE. I have nothing more to add. 💅','Okay five hovers means you WANT to. Stop teasing yourself. 😤']),'btn5');}
        });
        btn.addEventListener('click',()=>{
          prof.funnel='converted';prof.type='converted';
          const h=bm.btnHovers[key];
          if(h&&h.count>=3){forceState('triumphant',4000,pick(['FINALLY!! I was rooting for you this WHOLE time!! 🎉','YESSS!! I KNEW it!! Called it from the beginning!! 🏆','The glow-up arc is officially COMPLETE!! 🚀💫','After ALL that hovering~ YES!! I\'m so proud!! 🎊']));conv.lastMs=Date.now();}
          engUp(20);
        });
      });
    },4000);

    let rapidCount=0,rapidTimer=null,rapidPrevY=window.scrollY;
    window.addEventListener('scroll',()=>{const spd=Math.abs(window.scrollY-rapidPrevY);rapidPrevY=window.scrollY;if(spd>100){rapidCount++;clearTimeout(rapidTimer);rapidTimer=setTimeout(()=>{if(rapidCount>=3)nar('confused',3000,pick(['Speed-running the page! At least wave hi! 💨','Scanning for something? Tell me and I\'ll point you there~ 🧐','You scroll like you know exactly what you want 😏','If you\'re looking for something specific, I\'m RIGHT HERE 🙋','Okay okay zoom past me~ 💨 I\'m fine. (I\'m not fine.)']),'scanning');rapidCount=0;},1800);}},{passive:true});

    document.addEventListener('selectionchange',()=>{const sel=window.getSelection();if(sel&&sel.toString().length>20)prof.signals.textSelections++;});

    setInterval(()=>{updateFunnel();if(prof.funnel!==bm.prevFunnel){onFunnelAdvance(prof.funnel);bm.prevFunnel=prof.funnel;}if(prof.type!=='unknown')onTypeDetected(prof.type);checkEscalation();},10000);
  })();

  /* Start the sub-systems */
  initMischief(ctx,refs,lerp,bubble,applyExpr);
  initFlirty(ctx,root,forceState);
  initChat(ctx,refs,lerp,applyExpr,bubble,root,body);

  /* ── Analytics Logger ── collects IP, session, events, chats */
  (function(){
    const sid=Math.random().toString(36).slice(2,10)+Date.now().toString(36);
    const startTs=Date.now();
    const session={type:'session',sid,ip:null,ua:navigator.userAgent.slice(0,120),
      startTs,endTs:null,duration:0,scrollDepthMax:0,
      chatCount:0,funnel:'aware',userType:'unknown',
      url:location.pathname,ref:document.referrer||'direct'};
    let ip=null;

    fetch('https://api.ipify.org?format=json')
      .then(r=>r.json()).then(d=>{ip=d.ip;session.ip=d.ip;}).catch(()=>{});

    /* Use Apps Script URL when set in config, fall back to local dev server */
    const LOG_URL=(window.DiviConfig&&window.DiviConfig.analyticsUrl)||'/api/log';

    function send(obj){
      const data=JSON.stringify(obj);
      /* Send as plain text — avoids CORS preflight, Apps Script reads e.postData.contents */
      try{navigator.sendBeacon(LOG_URL,data);}
      catch(_){fetch(LOG_URL,{method:'POST',body:data,mode:'no-cors',keepalive:true}).catch(()=>{});}
    }

    window._dLog=function(type,data){send(Object.assign({type,ip,sid,ts:Date.now()},data));};
    window._dSid=sid;

    let scrollMax=0,scrollDepthSent=new Set();
    window.addEventListener('scroll',()=>{
      const pct=Math.round(100*window.scrollY/Math.max(1,document.body.scrollHeight-window.innerHeight));
      if(pct>scrollMax){scrollMax=pct;session.scrollDepthMax=pct;}
      const milestone=[25,50,75,100].find(m=>pct>=m&&!scrollDepthSent.has(m));
      if(milestone){scrollDepthSent.add(milestone);send({type:'event',eventType:'scroll_depth',ip,sid,ts:Date.now(),depth:milestone});}
    },{passive:true});

    document.addEventListener('click',e=>{
      const btn=e.target.closest('.btn-primary,.btn-cta,.book-btn,.fill-form,.cta-btn,button[type="submit"]');
      if(btn&&!btn.closest('#divu-root'))send({type:'event',eventType:'cta_click',ip,sid,ts:Date.now(),text:(btn.textContent||'').trim().slice(0,50)});
    });

    function flush(){session.endTs=Date.now();session.duration=Date.now()-startTs;send(session);}
    window.addEventListener('pagehide',flush);
    window.addEventListener('beforeunload',flush);
  })();

  /* ── Page-aware behaviour: tour, section comments, activity feedback, cursor/scroll stop ── */
  (function(){
    /* ── Per-page config: tour intro + activity events only.
       Section reactions are now fully dynamic — Divi reads the DOM. ── */
    const aw={
      home:{
        tour:[
          {delay:18000,s:'curious',m:'Let me show you around~ there\'s more here than just a homepage 👀'},
          {delay:8000, s:'happy',  m:'Rank Predictor, free Books, Video Lectures, and personal Counselling~ all built for JEE students! 🛠️'},
          {delay:10000,s:'wink',   m:'Most students who explore a bit end up at the counselling page~ just putting that out there 😏'},
        ],
        events:[
          {sel:'.btn-primary',             ev:'click',s:'wink',   m:'Heading to counselling~ now THAT\'s the smart move 😏💕'},
          {sel:'.btn-secondary',           ev:'click',s:'excited',m:'Rank Predictor~ let\'s see exactly where you stand! 📊🔥'},
          {sel:'a[href*="counselling"]',   ev:'click',s:'wink',   m:'Counselling page~ I\'ll be there too 😏'},
          {sel:'a[href*="rankPredictor"]', ev:'click',s:'excited',m:'Let\'s find your rank!! 📊'},
          {sel:'a[href*="books"]',         ev:'click',s:'happy',  m:'Free book library~ every JEE resource, zero cost 📚'},
          {sel:'a[href*="video"]',         ev:'click',s:'happy',  m:'Video lectures~ Prabhat sir explains what textbooks can\'t 📺'},
        ],
      },
      rank:{
        tour:[
          {delay:15000,s:'curious',m:'Here\'s how this works~ pick your exam, enter marks, set difficulty, hit Calculate 📊'},
          {delay:9000, s:'happy',  m:'The difficulty adjustment really matters~ a hard paper means your raw score is worth more than it looks 👀'},
        ],
        events:[
          {sel:'#level',ev:'change',s:'excited',m:null,dynamic:el=>{
            const m={'Very Easy':'Very Easy paper~ 9% boost applied to your raw score ✅','Easy':'Easy paper~ 5.2% boost. Your effective score just went up 📈','Medium':'Medium difficulty~ roughly neutral, marks track closely with rank ⚖️','Hard':'Hard paper~ 4.3% cut, but your competition also struggled so ranks bunch up 🔥','Very Hard':'Very Hard~ 9% cut, but when everyone finds it hard your relative rank barely shifts 💀'};
            return{s:'excited',m:m[el.value]||'Difficulty set~ adjustment applied 📊'};
          }},
          {sel:'#marks',ev:'focus',s:'curious',m:'Enter your total raw marks out of 300~ just the number 📝'},
          {sel:'#marks',ev:'input',s:'happy',coolMs:8000,m:null,dynamic:el=>{
            const v=parseInt(el.value);if(isNaN(v)||v<1)return null;
            if(v>270)return{s:'starstruck',m:v+' marks?! If that\'s accurate~ let\'s calculate RIGHT NOW 🔥'};
            if(v>220)return{s:'excited',m:v+' out of 300~ solid! Let\'s see what rank this becomes 📊'};
            if(v>150)return{s:'happy',m:v+' marks~ every single mark shifts your rank positioning 📈'};
            if(v>80) return{s:'curious',m:v+' marks~ difficulty adjustment will shift this, let\'s calculate 👀'};
            return{s:'thinking',m:v+' marks~ still worth calculating, more options than you might think 💡'};
          }},
          {sel:'#studentName',   ev:'focus', s:'happy',  m:'Your name on the rank card~ make it official 😄'},
          {sel:'#predictBtn',    ev:'click', s:'excited',m:'Calculating~ moment of truth!! 🎯🔥'},
          {sel:'#shareResultBtn',ev:'click', s:'wink',   m:'Sharing your result~ let them see what you\'re working with 😏'},
        ],
      },
      books:{
        tour:[
          {delay:15000,s:'happy',  m:'Everything here is free to download~ curated by Prabhat sir for JEE prep 📚'},
          {delay:8000, s:'curious',m:'Use the filter buttons at the top~ NCERT, Reference, PYQs, DPPs, Papers~ all organised! 🔍'},
        ],
        events:[
          {sel:'#searchInput',ev:'focus',s:'curious',m:'Search by subject, topic, or book name~ filters live as you type! 🔍'},
          {sel:'#searchInput',ev:'input',s:'happy',coolMs:6000,m:null,dynamic:el=>{
            if((el.value||'').length<3)return null;
            return{s:'curious',m:'Looking for "'+el.value+'"~ can\'t find it? Just ask me! 💬'};
          }},
          {sel:'.filter-btn',ev:'click',s:'happy',m:null,dynamic:el=>{
            const msgs={all:'All resources~ browse and see what stands out 👀',ncert:'NCERT first~ master these before anything else 📖',reference:'Reference books~ HC Verma, Irodov, Cengage territory 💪',revision:'Revision sheets~ perfect for the final sprint 🔥',class12:'Class 12 + JEE overlap~ boards and JEE at the same time 📚',papers:'Past exam papers~ pattern recognition is a genuine skill 🧠',dpp:'Daily Practice Problems~ consistency is literally everything 📝',pyq:'Previous Year Questions~ non-negotiable. Solve ALL of them 🎯'};
            return{s:'happy',m:msgs[el.dataset&&el.dataset.filter]||'Filtered! Find what you need 📚'};
          }},
          {sel:'.book-open-btn',ev:'click',s:'wink',m:'Opening it~ actually use it this time 😏📚'},
        ],
      },
      video:{
        tour:[
          {delay:15000,s:'happy',m:'These are Prabhat sir\'s lectures~ focused JEE content, no distractions 📺'},
          {delay:9000, s:'wink', m:'The live 1-on-1 sessions hit different though~ you get to ask YOUR specific questions 😏 Just saying~'},
        ],
        events:[
          {sel:'.btn-outline',ev:'click',s:'happy',m:'Browsing the library~ find a topic and watch a few! 📺'},
        ],
      },
      counselling:{
        tour:[
          {delay:12000,s:'curious',m:'This is where Prabhat sir personally helps students plan their JoSAA strategy~ 1-on-1! 🎓'},
          {delay:8000, s:'excited',m:'Choice filling, college shortlisting, branch selection, UPTAC, career roadmap~ all in one session 📋'},
          {delay:10000,s:'wink',   m:'Students with a proper JoSAA strategy get dramatically better college placements than those who guess 😏'},
        ],
        events:[
          {sel:'#session',        ev:'click',s:'excited',m:'The session that maps your full JoSAA strategy~ this is the one 💪'},
          {sel:'.coupon-copy-btn',ev:'click',s:'beaming',m:'Coupon copied!! Use it when you book~ never leave discounts on the table 🎟️😏'},
          {sel:'#pdfs',           ev:'click',s:'happy',  m:'PDF shortlists~ data-driven college options by rank 📄'},
        ],
      },
    }[PAGE.id];
    if(!aw)return;

    /* Force-show helper for activity events — always interrupts, brief state lock */
    function actForce(s,msg){
      ctx.state=s;applyExpr(s,refs,lerp);
      bubble.forceShow(msg,5000);
      ctx.manualUntil=Date.now()+4000;
    }

    /* ── Tour sequence: fires once per step, skipped if Divi is busy ── */
    let _cumD=0;
    (aw.tour||[]).forEach(step=>{
      _cumD+=step.delay;
      setTimeout(()=>{
        if(Date.now()<ctx.manualUntil+200)return;
        applyExpr(step.s,refs,lerp);
        bubble.show(step.m,6500);
      },_cumD);
    });

    /* ── Dynamic section reader ──────────────────────────────────────────────
       Keyword taxonomy: maps content keywords → personality + message template.
       Works on ANY section — present, future, or from a site update.          */
    /* ── Semantic taxonomy — ordered most-specific first ── */
    const _TAX=[
      /* Specific book titles */
      {kw:['hc verma','concepts of physics'],
       r:[{s:'excited',m:h=>`"${h}"~ THE physics book for JEE. If you haven't started this one, now is the time 📖`}]},
      {kw:['irodov','problems in general physics'],
       r:[{s:'curious',m:h=>`"${h}"~ serious territory. Most JEE toppers have solved chunks of this 💪`}]},
      {kw:['dc pandey','cengage','arihant'],
       r:[{s:'happy',m:h=>`"${h}"~ solid reference material! Works great alongside NCERT 📚`}]},
      {kw:['ncert exemplar','exemplar'],
       r:[{s:'happy',m:h=>`"${h}"~ don't skip NCERT Exemplar, especially for Chemistry 📖`}]},
      {kw:['pyq','previous year','past year question'],
       r:[{s:'excited',m:h=>`"${h}"~ non-negotiable! Pattern recognition is a real JEE skill 🎯`}]},
      {kw:['dpp','daily practice problem'],
       r:[{s:'curious',m:h=>`"${h}"~ consistency through DPPs is what actually builds speed 📝`}]},
      /* Specific colleges */
      {kw:['iit bombay','iit delhi','iit madras','iit kanpur','iit kharagpur'],
       r:[{s:'starstruck',m:h=>`"${h}"~ IIT top tier!! These are the dream choices — worth every effort 🏆`}]},
      {kw:['nit trichy','nit warangal','nit surathkal','nit jamshedpur','nit calicut'],
       r:[{s:'excited',m:h=>`"${h}"~ premier NITs! These are very achievable with the right JoSAA strategy 🎯`}]},
      {kw:['iiit hyderabad','iiit delhi','iiit bangalore'],
       r:[{s:'happy',m:h=>`"${h}"~ IIITs are underrated gems — great for CS especially 💻`}]},
      {kw:['uptac','jceceb','state counselling','state quota'],
       r:[{s:'curious',m:h=>`"${h}"~ state counselling is massively underused. Many good colleges here! 👀`}]},
      {kw:['comedk'],
       r:[{s:'happy',m:h=>`"${h}"~ COMEDK has great private engineering colleges in Karnataka 📋`}]},
      /* Stats */
      {kw:['subscribers on youtube','35k+','35k subscribers'],
       r:[{s:'excited',m:h=>`"${h}"~ 35K+ JEE students are already part of this community 📺`}]},
      {kw:['views on youtube','1cr+','1 crore','crore views'],
       r:[{s:'starstruck',m:h=>`"${h}"!! One CRORE views means the JEE community genuinely trusts this 🔥`}]},
      {kw:['students guided','10k+','10,000'],
       r:[{s:'beaming',m:h=>`"${h}"~ 10,000 students each got their college answer here. That's real 🎓`}]},
      {kw:['college reviews','450+'],
       r:[{s:'happy',m:h=>`"${h}"~ Prabhat sir has firsthand knowledge of these campuses 🏫`}]},
      {kw:['videos published','2500+'],
       r:[{s:'curious',m:h=>`"${h}"~ there is literally content for every JEE concept in this library 📺`}]},
      {kw:['nit jamshedpur mentor','nit jamshedpur'],
       r:[{s:'beaming',m:h=>`"${h}"~ guidance from someone who's been exactly where you want to go 🎓`}]},
      /* Coupons */
      {kw:['80%','maximum discount','best available'],
       r:[{s:'beaming',m:h=>`${h}~ that's a huge discount! Copy the code before it expires 🎟️`}]},
      {kw:['50%','off — highest'],
       r:[{s:'happy',m:h=>`${h}~ half price! Definitely worth grabbing this one 🎟️`}]},
      {kw:['physics wallah','pw ioi'],
       r:[{s:'curious',m:h=>`"${h}"~ if you're already subscribed, this coupon saves real money 💰`}]},
      {kw:['unacademy','allen','aakash'],
       r:[{s:'curious',m:h=>`"${h}"~ if you use this platform, this coupon is worth copying! 💰`}]},
      {kw:['coupon','discount','code','promo','offer','save'],
       r:[{s:'beaming',m:h=>`"${h}"~ copy the code before you book! Never leave discounts unused 🎟️`}]},
      /* Rank zones */
      {kw:['iit (top tier)','iit zone','iit territory'],
       r:[{s:'starstruck',m:h=>`"${h}"~ IIT territory!! Every choice fill at this rank matters enormously 🏆`}]},
      {kw:['nit (top tier)','nit top tier','nit zone'],
       r:[{s:'excited',m:h=>`"${h}"~ NIT top tier! Trichy, Warangal, Surathkal range 💪`}]},
      {kw:['iiit zone','gfti','iiit and gfti'],
       r:[{s:'happy',m:h=>`"${h}"~ more solid options here than most students realize 👀`}]},
      /* Services */
      {kw:['1-on-1','₹5,000','₹5000','guidance session','admission guidance'],
       r:[
         {s:'excited',m:h=>`"${h}"~ Prabhat sir personally maps your JoSAA strategy 💪`},
         {s:'wink',   m:h=>`"${h}"~ most students say this was the decision that changed everything 😏`},
       ]},
      {kw:['preference order pdf','josaa / csab','csab full','josaa full'],
       r:[{s:'happy',m:h=>`"${h}"~ data-driven shortlist in PDF form. Great if you prefer it in writing 📄`}]},
      {kw:['shortlist','prediction pdf','college list'],
       r:[{s:'happy',m:h=>`"${h}"~ college options mapped by rank. Saves a lot of guesswork 📄`}]},
      /* Counselling/guidance (broad) */
      {kw:['counsell','guidance','josaa','choice fill','strategy','career roadmap'],
       r:[
         {s:'excited',m:h=>`"${h}"~ this is where JEE outcomes actually change 💪`},
         {s:'wink',   m:h=>`"${h}"~ the important section 😏 Worth your time!`},
       ]},
      /* Rank/predictor */
      {kw:['rank','predict','percentile','marks out of','nta formula'],
       r:[
         {s:'curious',m:h=>`"${h}"~ enter your marks and see exactly where you stand 📊`},
         {s:'excited',m:h=>`"${h}"~ moment of truth territory! 🎯`},
       ]},
      /* Books (broad) */
      {kw:['book','pdf','download','library','revision','study material'],
       r:[{s:'happy',m:h=>`"${h}"~ all free and curated. Download whatever you need 📚`}]},
      /* Video */
      {kw:['video','lecture','watch','youtube','learn','tutorial'],
       r:[{s:'happy',m:h=>`"${h}"~ focused JEE content, no distractions 📺`}]},
      /* Stats (broad) */
      {kw:['students guided','track record','achievement','success'],
       r:[{s:'excited',m:h=>`"${h}"~ real numbers from real students 📊`}]},
      /* About/mentor */
      {kw:['about','mentor','prabhat','bhaiya','who is','mechanical engineering'],
       r:[{s:'beaming',m:h=>`"${h}"~ he's been exactly where you are. That's why it lands 🎓`}]},
      /* Free/zero cost */
      {kw:['zero cost','no sign-up','no login','no payment','100% free'],
       r:[{s:'happy',m:h=>`"${h}"~ no catch, no paywall. Just use it 📖`}]},
      /* Tools */
      {kw:['tool','toolkit','built for','free tool','jee toolkit'],
       r:[{s:'curious',m:h=>`"${h}"~ designed specifically for JEE students 🛠️`}]},
    ];

    /* ── Multi-strategy element analyzer: reads actual content per element type ── */
    function _analyzeEl(el){
      if(!el||el===document.body||el.closest('#divu-root'))return null;
      let searchTxt='',display='';

      /* Strategy A: stat card (.stat-num + .stat-label) */
      const statNum=el.querySelector('.stat-num');
      const statLabel=el.querySelector('.stat-label');
      if(statNum&&statLabel){
        display=statNum.textContent.trim()+' '+statLabel.textContent.trim();
        searchTxt=display.toLowerCase();
        for(const g of _TAX)if(g.kw.some(k=>searchTxt.includes(k))){const v=g.r[0];return{s:v.s,m:v.m(display)};}
        return{s:'excited',m:`"${display}"~ real numbers, real students 📊`};
      }

      /* Strategy B: book card (.book-title + .book-sub + .book-pub) */
      const bookTitle=el.querySelector('.book-title');
      if(bookTitle){
        const bookSub=(el.querySelector('.book-sub')?.textContent||'').trim();
        const bookPub=(el.querySelector('.book-pub')?.textContent||'').trim();
        display=bookTitle.textContent.trim();
        searchTxt=(display+' '+bookSub+' '+bookPub).toLowerCase();
        for(const g of _TAX)if(g.kw.some(k=>searchTxt.includes(k))){const v=g.r[Math.floor(Math.random()*g.r.length)];return{s:v.s,m:v.m(display)};}
        return{s:'happy',m:`"${display}"~ good find! Download this one 📚`};
      }

      /* Strategy C: service card (.prem-title / .best-title + price) */
      const svcTitle=el.querySelector('.prem-title,.best-title');
      if(svcTitle){
        const price=(el.querySelector('.prem-price')?.textContent||'').trim();
        display=svcTitle.textContent.replace(/\s+/g,' ').trim();
        searchTxt=(display+' '+price).toLowerCase();
        for(const g of _TAX)if(g.kw.some(k=>searchTxt.includes(k))){const v=g.r[Math.floor(Math.random()*g.r.length)];return{s:v.s,m:v.m(display+(price?' · '+price:''))};}
        return{s:'curious',m:`"${display}"${price?' at '+price:''} — want to know what's included? Just ask! 💬`};
      }

      /* Strategy D: coupon card (.coupon-discount + .coupon-brand + .coupon-code) */
      const couponDisc=el.querySelector('.coupon-discount');
      if(couponDisc){
        const brand=(el.querySelector('.coupon-brand')?.textContent||'this platform').trim();
        const code=(el.querySelector('.coupon-code')?.textContent||'').trim();
        const disc=couponDisc.textContent.trim();
        searchTxt=(disc+' '+brand).toLowerCase();
        for(const g of _TAX)if(g.kw.some(k=>searchTxt.includes(k))){const v=g.r[0];return{s:v.s,m:v.m(disc+' off '+brand+(code?' — Code: '+code:''))};}
        return{s:'beaming',m:`${disc} off ${brand}!${code?' Code: '+code:''} Copy before it expires 🎟️`};
      }

      /* Strategy E: bento card (.card-title + .card-desc) */
      const cardTitle=el.querySelector('.card-title');
      if(cardTitle){
        const desc=(el.querySelector('.card-desc,p')?.textContent||'').trim().slice(0,120);
        const badge=(el.querySelector('.card-badge')?.textContent||'').trim();
        display=cardTitle.textContent.trim();
        searchTxt=(display+' '+badge+' '+desc).toLowerCase();
        for(const g of _TAX)if(g.kw.some(k=>searchTxt.includes(k))){const v=g.r[Math.floor(Math.random()*g.r.length)];return{s:v.s,m:v.m(display)};}
        return{s:'curious',m:`"${display}"~ click to explore! 👀`};
      }

      /* Strategy F: zone display (.pred-zone-name / .report-zone-text + sub) */
      const zoneName=el.querySelector('#zoneName,#rcZoneName,.pred-zone-name,.report-zone-text');
      if(zoneName){
        const zoneSub=(el.querySelector('#zoneSub,#rcZoneSub,.pred-zone-sub,.report-zone-sub')?.textContent||'').trim().slice(0,100);
        display=zoneName.textContent.trim();
        searchTxt=(display+' '+zoneSub).toLowerCase();
        for(const g of _TAX)if(g.kw.some(k=>searchTxt.includes(k))){const v=g.r[0];return{s:v.s,m:v.m(display+(zoneSub?' — '+zoneSub:''))};}
        return{s:'curious',m:`Your zone: "${display}"${zoneSub?' — '+zoneSub:''} 📊`};
      }

      /* Strategy G: default — heading + label + paragraph */
      const hEl=el.querySelector('h1,h2,h3,.section-title,.hero-title,.books-section-title')
        ||el.closest('section,article,[class*="-section"]')?.querySelector('h1,h2,h3,.section-title');
      const heading=(hEl?.textContent||'').replace(/\s+/g,' ').trim().slice(0,80);
      const lbl=(el.querySelector('.section-label,.card-badge,.badge')?.textContent||'').trim().slice(0,60);
      const para=(el.querySelector('p,.card-desc,.section-sub')?.textContent||'').trim().slice(0,200);
      searchTxt=(heading+' '+lbl+' '+para).toLowerCase();
      for(const g of _TAX){
        if(g.kw.some(k=>searchTxt.includes(k))){
          const v=g.r[Math.floor(Math.random()*g.r.length)];
          return{s:v.s,m:v.m(heading||lbl||'this section')};
        }
      }
      if(heading)return{s:'curious',m:`"${heading}"~ want to know more? Just ask! 💬`};
      return null;
    }

    /* ── Dynamic IntersectionObserver — watches ALL section-level elements ── */
    if('IntersectionObserver' in window){
      const _seen=new Set();
      const _obs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
          if(!e.isIntersecting)return;
          /* Assign a stable key so each element reacts only once */
          if(!e.target._dvk){e.target._dvk=Math.random().toString(36).slice(2);}
          if(_seen.has(e.target._dvk))return;
          _seen.add(e.target._dvk);
          setTimeout(()=>{
            const r=e.target.getBoundingClientRect();
            if(r.bottom<0||r.top>window.innerHeight)return; /* scrolled away */
            if(Date.now()<ctx.manualUntil+200)return;
            const hint=_analyzeEl(e.target);
            if(hint){applyExpr(hint.s,refs,lerp);bubble.show(hint.m,6500);}
          },1800);
        });
      },{threshold:0.3});
      /* Broad selector: catches current sections AND any future ones added to the site */
      document.querySelectorAll(
        'section,article,.content-section,.hero-section,.about-section,.bento-section,.stats-section,.library,.prem-card,.best-card,[class*="-section"],[data-svc],.stat-card,.book-card,.coupon-card,.card,.zone-card'
      ).forEach(el=>{if(!el.closest('#divu-root'))_obs.observe(el);});

      /* Card hover-with-delay: react to individual cards after 1.5 s of hover intent */
      const _CARD_SEL='.stat-card,.book-card,.coupon-card,.prem-card,.best-card,.card,.zone-card';
      let _cardTimer=null;
      document.addEventListener('mouseover',e=>{
        const card=e.target.closest(_CARD_SEL);
        if(!card||card.closest('#divu-root'))return;
        clearTimeout(_cardTimer);
        _cardTimer=setTimeout(()=>{
          if(!card.matches(':hover'))return;
          const r=_analyzeEl(card);
          if(!r)return;
          bubble.forceShow(r.m,6000);
          applyExpr(r.s,refs,lerp);
          setTimeout(()=>applyExpr(ctx.state,refs,lerp),6300);
        },1500);
      },{capture:true,passive:true});
      document.addEventListener('mouseout',e=>{
        const card=e.target.closest(_CARD_SEL);
        if(!card||card.closest('#divu-root'))return;
        if(!card.contains(e.relatedTarget))clearTimeout(_cardTimer);
      },{capture:true,passive:true});
    }

    /* ── Event delegation: activity feedback for clicks, focus, change, input ── */
    const _evCool={};
    function _handleEv(evType,target){
      if(!target||target.closest('#divu-root'))return;
      for(const def of(aw.events||[])){
        if(def.ev!==evType)continue;
        const matchEl=(target.matches&&target.matches(def.sel))?target:target.closest(def.sel);
        if(!matchEl)continue;
        const ck=def.sel+evType;
        if(def.coolMs&&_evCool[ck]&&Date.now()-_evCool[ck]<def.coolMs)continue;
        _evCool[ck]=Date.now();
        let msg=def.m,s=def.s;
        if(def.dynamic){
          const res=def.dynamic(matchEl);
          if(res===null)break;
          if(res){if(res.m!==undefined)msg=res.m;if(res.s)s=res.s;}
        }
        if(msg)actForce(s,msg);
        break;
      }
    }
    document.addEventListener('click', e=>_handleEv('click', e.target),true);
    document.addEventListener('focus', e=>_handleEv('focus', e.target),true);
    document.addEventListener('change',e=>_handleEv('change',e.target),true);
    document.addEventListener('input', e=>_handleEv('input', e.target),true);

    /* ── Cursor stop (3.2 s): find what's under cursor, analyze it ── */
    let _curT=null,_cx=0,_cy=0;
    document.addEventListener('mousemove',e=>{
      if(Math.abs(e.clientX-_cx)<10&&Math.abs(e.clientY-_cy)<10)return;
      _cx=e.clientX;_cy=e.clientY;
      clearTimeout(_curT);
      _curT=setTimeout(()=>{
        if(Date.now()<ctx.manualUntil+300)return;
        const el=document.elementFromPoint(_cx,_cy);
        if(!el||el.closest('#divu-root'))return;
        /* Walk up to find a section-level container worth commenting on */
        let t=el,hint=null;
        for(let i=0;i<8;i++){
          if(!t||t===document.body)break;
          const tag=t.tagName||'';
          if(tag==='SECTION'||tag==='ARTICLE'||(t.className&&/section|card|prem|best|library/i.test(t.className))){
            hint=_analyzeEl(t);if(hint)break;
          }
          /* Also react to hovering on headings */
          if(tag==='H2'||tag==='H3'){
            const txt=(t.textContent||'').replace(/\s+/g,' ').trim().slice(0,60);
            if(txt){hint={s:'curious',m:`"${txt}"~ want me to tell you more about this? Just ask! 💬`};break;}
          }
          t=t.parentElement;
        }
        if(hint){applyExpr(hint.s,refs,lerp);bubble.show(hint.m,5000);}
      },3200);
    },{passive:true});

    /* ── Scroll stop (2 s): most visible section-level element → analyze it ── */
    let _scrT=null,_pSY=window.scrollY;
    window.addEventListener('scroll',()=>{
      clearTimeout(_scrT);
      _scrT=setTimeout(()=>{
        const delta=Math.abs(window.scrollY-_pSY);_pSY=window.scrollY;
        if(delta<80||Date.now()<ctx.manualUntil+300)return;
        /* Find the section/card with the most pixels visible in the viewport */
        let best=null,bestVis=80;
        document.querySelectorAll('section,article,.content-section,.prem-card,.best-card,[class*="-section"]').forEach(el=>{
          if(el.closest('#divu-root'))return;
          const r=el.getBoundingClientRect();
          const vis=Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0);
          if(vis>bestVis){bestVis=vis;best=el;}
        });
        if(!best)return;
        const hint=_analyzeEl(best);
        if(hint){applyExpr(hint.s,refs,lerp);bubble.show(hint.m,5500);}
      },2000);
    },{passive:true});
  })();

  return{getState:()=>ctx.state,forceState};
}
