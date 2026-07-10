/* ── Chat ── chat input UI + send handler + visitor registration */
import { R, FU_Q, CAT_EXPR } from './divu.replies.js';
import { classify, rankReply, resolveFollowUp, logMsg } from './divu.classify.js';
import { pick } from './divu.utils.js';
import { makeVisitor } from './divu.visitor.js';
import { CFG } from './divu.config.js';

/* ── Visitor ask message pools ── */
const VA={
  name:[
    "hey wait — I don't even know your name!! what should I call you? 🥺",
    "omg we've been chatting and I still don't know who you are 😅 what's your name?",
    "btw — what do I call you?? it feels rude not knowing your name!! 👀",
    "I feel so bad not knowing your name~ could you tell me? 😊",
    "wait wait wait — who AM I talking to?? 😂 what's your name?",
  ],
  phone:[
    "since we're chatting~ mind sharing your phone number? 📱 totally optional!",
    "if you'd ever want Prabhat bhaiya to reach out — drop your number? 📞 no pressure~",
    "want to stay in touch? you can share your number~ 📱 only if you're comfy!",
    "hey {name}~ can I get your phone number? 📱 totally your call!",
  ],
  email:[
    "one last thing~ your email ID? 📧 we'd love to send you JEE updates!",
    "drop your email and we'll keep you posted on everything JEE~ 📧 totally optional!",
    "hey {name}~ if you want useful JEE stuff in your inbox — email ID? 📧",
    "last one I promise~ email ID? 📧 so we can reach you with updates!",
  ],
  phone_invalid:[
    "hmm that doesn't look like a valid number 🤔 it should be 10 digits, or 12 with country code (like 91XXXXXXXXXX)~ try again?",
    "oops! phone should be 10 digits or 12 digits with country code~ could you re-enter? 📱",
  ],
  email_invalid:[
    "hmm that email doesn't look right 🤔 try something like name@gmail.com~",
    "that doesn't look like a valid email format~ try name@domain.com? 📧",
  ],
  refusal_ok:[
    "okay, no pressure at all!! 😊 just ask if you change your mind~",
    "totally fine!! 💕 I'm here whenever you need~",
    "no worries!! 😊 we can chat without it~",
  ],
  thanks_name:[
    "yay!! nice to meet you, {name}!! 🌟",
    "omg {name}!! love that name!! 💕",
    "aww {name}~ so glad you told me!! 😊✨",
    "{name}!! what a lovely name~ I'll remember that!! 💖",
  ],
  thanks_phone:[
    "got it, {name}!! 📱 we'll reach out if there's anything important~",
    "saved!! 📱 thanks {name}~",
    "perfect {name}!! 📱 we're all connected now~",
  ],
  thanks_email:[
    "perfect!! 📧 you'll get all the good stuff now, {name}~",
    "yay, all done!! 🎉 thanks {name}~ we have everything we need!",
    "amazing!! 📧 got it {name}~ you're fully registered now! 🌟",
  ],
};

const REFUSAL_RE=/\b(no|nope|skip|later|next time|don.?t want|not now|maybe later|pass|nahi|nope|privacy)\b/i;

export function initChat(ctx, refs, lerp, applyExprFn, bubble, root, body){
  const sid=Math.random().toString(36).slice(2,10);
  let lastCat=null,pendingFU=null;
  let pendingField=null,pendingFieldBadOnce=false;
  let chatCount=0,lastAskAt=-9;

  /* ── Visitor registration ── */
  const visitor=makeVisitor((field,val,ip)=>{
    if(CFG.divaLog){
      const p={ts:new Date().toISOString(),type:'visitor_field',field,value:val,ip};
      try{navigator.sendBeacon(CFG.divaLog,new Blob([JSON.stringify(p)],{type:'application/json'}));}catch(_){}
    }
  });

  /* ── Build UI ── */
  const chatWrap=document.createElement('div');
  chatWrap.id='divu-chat';

  const inp=document.createElement('input');
  inp.type='text';inp.placeholder='Say something~ 💬';inp.maxLength=200;
  inp.setAttribute('autocomplete','off');inp.setAttribute('spellcheck','false');
  Object.assign(inp.style,{
    flex:'1',padding:'5px 10px',fontSize:'11px',lineHeight:'1.3',
    border:'1.5px solid rgba(255,110,160,0.4)',borderRadius:'20px',outline:'none',
    background:'rgba(255,255,255,0.94)',color:'#444',fontFamily:'inherit',
    boxShadow:'0 2px 10px rgba(255,100,150,0.15)',transition:'border-color .2s,box-shadow .2s',
  });
  inp.addEventListener('focus',()=>{
    inp.style.borderColor='rgba(255,60,120,0.75)';
    inp.style.boxShadow='0 2px 12px rgba(255,80,130,0.28)';
    root.classList.add('dv-typing');
    if(body&&body.isRoaming())body.caught(bubble);
  });
  inp.addEventListener('blur',()=>{
    inp.style.borderColor='rgba(255,110,160,0.4)';
    inp.style.boxShadow='0 2px 10px rgba(255,100,150,0.15)';
    root.classList.remove('dv-typing');
  });

  const btn=document.createElement('button');
  btn.textContent='💬';btn.title='Send';
  Object.assign(btn.style,{
    background:'linear-gradient(135deg,#ff7eb3,#ff4e8a)',border:'none',borderRadius:'50%',
    width:'27px',height:'27px',flexShrink:'0',cursor:'pointer',fontSize:'13px',
    display:'flex',alignItems:'center',justifyContent:'center',
    boxShadow:'0 2px 8px rgba(255,60,130,0.35)',transition:'transform .15s,box-shadow .15s',
  });
  btn.addEventListener('mouseenter',()=>{btn.style.transform='scale(1.18)';btn.style.boxShadow='0 3px 12px rgba(255,60,130,0.5)';});
  btn.addEventListener('mouseleave',()=>{btn.style.transform='scale(1)';btn.style.boxShadow='0 2px 8px rgba(255,60,130,0.35)';});

  chatWrap.appendChild(inp);chatWrap.appendChild(btn);
  root.appendChild(chatWrap);

  /* ── Helpers ── */
  function fillN(msg){return msg.replace(/\{name\}/g,visitor.getName()||'you');}

  function personalize(reply){
    const n=visitor.getName();
    if(!n||Math.random()>.2)return reply;
    return Math.random()<.5?n+'~ '+reply:reply+' ~'+n;
  }

  function slipAsk(mainReply,mainDur){
    const nextF=visitor.nextField();
    if(!nextF||visitor.isSnoozed()||pendingFU||pendingField||(chatCount-lastAskAt)<4)return false;
    if(chatCount%4!==0)return false;
    pendingField=nextF;lastAskAt=chatCount;visitor.bumpAsks();
    bubble.chatShow(mainReply,mainDur);
    const askMsg=fillN(pick(VA[nextF]));
    setTimeout(()=>{bubble.chatShow(askMsg,ASK_DUR);if(bEl){bEl.classList.add('dv-ask');setTimeout(()=>bEl.classList.remove('dv-ask'),ASK_DUR);}},3500);
    return true;
  }

  /* ── Proactive visitor ask ── */
  let lastProactiveMs=0;
  const PROACTIVE_GAP=3*60*1000;
  const ASK_DUR=18000;

  const bEl=document.getElementById('divu-bubble');
  function visitorShout(msg){
    bubble.shout(msg,ASK_DUR);
    if(bEl){bEl.classList.add('dv-ask');setTimeout(()=>bEl.classList.remove('dv-ask'),ASK_DUR);}
  }

  function triggerVisitorAsk(){
    const nextF=visitor.nextField();
    if(!nextF||visitor.isSnoozed())return;
    if(Date.now()-lastProactiveMs<PROACTIVE_GAP)return;
    pendingField=null;  /* clear stale unanswered ask before re-asking */
    lastProactiveMs=Date.now();
    pendingField=nextF;
    visitor.bumpAsks();
    applyExprFn('curious',refs,lerp);
    ctx.state='curious';ctx.manualUntil=Date.now()+ASK_DUR+2000;
    visitorShout(fillN(pick(VA[nextF])));
  }

  setTimeout(triggerVisitorAsk,25000);
  setInterval(triggerVisitorAsk,PROACTIVE_GAP);

  /* ── Registration Card ── */
  let regCardEl=null;

  function showRegCard(){
    if(visitor.isComplete())return;
    if(!regCardEl)_buildRegCard();
    /* pre-fill known values without overwriting what user may have typed */
    const vd=visitor.get(),ri=regCardEl._inp;
    if(vd.name&&!ri.name.value)ri.name.value=vd.name;
    if(vd.phone&&!ri.phone.value)ri.phone.value=vd.phone;
    if(vd.email&&!ri.email.value)ri.email.value=vd.email;
    if(regCardEl.style.display==='none'||!regCardEl._shown){
      regCardEl.style.display='';regCardEl._shown=true;
      regCardEl.style.animation='none';
      void regCardEl.offsetHeight;
      regCardEl.style.animation='dvCardIn .32s cubic-bezier(.34,1.56,.64,1) forwards';
    }
  }

  function _buildRegCard(){
    if(!document.getElementById('dv-rc-style')){
      const s=document.createElement('style');s.id='dv-rc-style';
      s.textContent='@keyframes dvCardIn{from{opacity:0;transform:translateY(14px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}';
      document.head.appendChild(s);
    }
    const card=document.createElement('div');
    card.id='dv-reg-card';
    Object.assign(card.style,{
      position:'fixed',zIndex:'2147483647',
      bottom:'82px',right:'18px',width:'272px',boxSizing:'border-box',
      background:'rgba(255,248,252,.98)',borderRadius:'18px',
      border:'2px solid rgba(255,100,160,.4)',
      boxShadow:'0 8px 36px rgba(255,60,130,.22),0 2px 8px rgba(0,0,0,.1)',
      padding:'15px 15px 13px',fontFamily:'inherit',
    });
    ['mousedown','click','pointerdown','touchstart'].forEach(ev=>
      card.addEventListener(ev,e=>e.stopPropagation(),{passive:false})
    );

    /* header */
    const hdr=document.createElement('div');
    hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:8px';
    const ttl=document.createElement('div');
    ttl.style.cssText='font-size:13px;font-weight:700;color:#c2185b;line-height:1';
    ttl.textContent='Quick Registration 💖';
    const xBtn=document.createElement('button');
    xBtn.textContent='×';
    xBtn.style.cssText='background:none;border:none;font-size:22px;line-height:1;cursor:pointer;color:#ccc;padding:0;transition:color .15s';
    xBtn.onmouseenter=()=>xBtn.style.color='#999';
    xBtn.onmouseleave=()=>xBtn.style.color='#ccc';
    xBtn.onclick=()=>card.style.display='none';
    hdr.appendChild(ttl);hdr.appendChild(xBtn);

    const hint=document.createElement('div');
    hint.style.cssText='font-size:10.5px;color:#b06090;margin-bottom:11px;line-height:1.4';
    hint.textContent="fill whatever you'd like~ Divi will remember you! 🌸";

    /* field factory */
    const flds={};let msgTa=null;
    function mkFld(key,lbl,type,ph){
      const wrap=document.createElement('div');wrap.style.marginBottom='9px';
      const label=document.createElement('label');
      label.htmlFor='dv-rc-'+key;
      label.style.cssText='display:block;font-size:9.5px;font-weight:700;color:#a0557a;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px';
      label.textContent=lbl;
      const fi=document.createElement('input');
      fi.type=type;fi.id='dv-rc-'+key;fi.placeholder=ph;
      fi.setAttribute('autocomplete','off');fi.setAttribute('spellcheck','false');
      fi.style.cssText='display:block;width:100%;box-sizing:border-box;padding:7px 10px;font-size:12px;color:#444;background:#fff;border:1.5px solid rgba(255,110,160,.35);border-radius:9px;outline:none;font-family:inherit;transition:border-color .18s,box-shadow .18s';
      const errDiv=document.createElement('div');
      errDiv.style.cssText='font-size:10px;color:#e91e63;margin-top:3px;display:none;line-height:1.3';
      fi.addEventListener('focus',()=>{
        fi.style.borderColor='rgba(255,60,120,.7)';
        fi.style.boxShadow='0 0 0 3px rgba(255,100,160,.12)';
        errDiv.style.display='none';
      });
      fi.addEventListener('blur',()=>{fi.style.borderColor='rgba(255,110,160,.35)';fi.style.boxShadow='none';});
      fi.addEventListener('keydown',e=>{if(e.key==='Enter'){e.stopPropagation();saveBtn.click();}});
      wrap.appendChild(label);wrap.appendChild(fi);wrap.appendChild(errDiv);
      flds[key]={inp:fi,errDiv};
      return wrap;
    }

    /* save button */
    const saveBtn=document.createElement('button');
    saveBtn.textContent='Save & Continue 💕';
    saveBtn.style.cssText='display:block;width:100%;margin-top:5px;padding:8px 0;font-size:12px;font-weight:700;background:linear-gradient(135deg,#ff7eb3,#ff4e8a);color:#fff;border:none;border-radius:9px;cursor:pointer;transition:opacity .15s,transform .12s';
    saveBtn.onmouseenter=()=>{saveBtn.style.opacity='.88';saveBtn.style.transform='scale(1.02)';};
    saveBtn.onmouseleave=()=>{saveBtn.style.opacity='1';saveBtn.style.transform='scale(1)';};
    saveBtn.onclick=()=>{
      let anyErr=false,saved=[];
      const ERRS={
        name:'Name should only contain letters — 2 to 60 characters',
        phone:'Phone should be 10 digits, or 12 with country code (e.g. 91XXXXXXXXXX)',
        email:'Enter a valid email address like name@gmail.com',
      };
      ['name','phone','email'].forEach(key=>{
        const f=flds[key],val=f.inp.value.trim();
        if(!val){f.errDiv.style.display='none';return;}
        if(visitor.capture(val,key)){
          saved.push(key);
          f.inp.style.borderColor='rgba(76,175,80,.65)';
          f.inp.style.background='rgba(232,245,233,.5)';
          f.errDiv.style.display='none';
        }else{
          f.errDiv.textContent=ERRS[key];
          f.errDiv.style.display='block';
          f.inp.style.borderColor='rgba(233,30,99,.6)';
          anyErr=true;
        }
      });
      const msg=msgTa?msgTa.value.trim():'';
      if(!anyErr&&saved.length===0&&!msg){
        flds.name.errDiv.textContent='Please fill in at least one field~';
        flds.name.errDiv.style.display='block';
        return;
      }
      if(!anyErr){
        if(msg){
          try{localStorage.setItem('divu_visitor_msg',JSON.stringify({msg,ts:new Date().toISOString()}));}catch(_){}
          if(CFG.divaLog){
            const p={ts:new Date().toISOString(),type:'visitor_message',value:msg,ip:visitor.get().ip||'unknown'};
            try{navigator.sendBeacon(CFG.divaLog,new Blob([JSON.stringify(p)],{type:'application/json'}));}catch(_){}
          }
        }
        saveBtn.textContent='✓ Saved!';
        saveBtn.style.background='linear-gradient(135deg,#66bb6a,#43a047)';
        setTimeout(()=>{
          card.style.display='none';
          pendingField=null;pendingFieldBadOnce=false;
          applyExprFn('lovey',refs,lerp);ctx.state='lovey';ctx.manualUntil=Date.now()+5000;
          bubble.chatShow(
            visitor.isComplete()
              ?fillN('yay {name}!! all done~ you\'re fully registered!! 🎉💕')
              :fillN('got it {name}!! saved what you filled~ you can add more anytime!! 💕'),
            7000
          );
        },700);
      }
    };

    card.appendChild(hdr);
    card.appendChild(hint);
    card.appendChild(mkFld('name','Full Name','text','e.g. Rahul Sharma'));
    card.appendChild(mkFld('phone','Phone / WhatsApp','tel','10 or 12 digit number'));
    card.appendChild(mkFld('email','Email ID','email','name@gmail.com'));
    /* message / feedback textarea */
    const msgWrap=document.createElement('div');msgWrap.style.marginBottom='9px';
    const msgLbl=document.createElement('label');
    msgLbl.htmlFor='dv-rc-msg';
    msgLbl.style.cssText='display:block;font-size:9.5px;font-weight:700;color:#a0557a;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px';
    msgLbl.textContent='Message / Question / Feedback';
    msgTa=document.createElement('textarea');
    msgTa.id='dv-rc-msg';msgTa.rows=3;
    msgTa.placeholder='any question, feedback, or comment~ 💭';
    msgTa.style.cssText='display:block;width:100%;box-sizing:border-box;padding:7px 10px;font-size:12px;color:#444;background:#fff;border:1.5px solid rgba(255,110,160,.35);border-radius:9px;outline:none;font-family:inherit;resize:vertical;min-height:52px;transition:border-color .18s,box-shadow .18s';
    msgTa.addEventListener('focus',()=>{msgTa.style.borderColor='rgba(255,60,120,.7)';msgTa.style.boxShadow='0 0 0 3px rgba(255,100,160,.12)';});
    msgTa.addEventListener('blur',()=>{msgTa.style.borderColor='rgba(255,110,160,.35)';msgTa.style.boxShadow='none';});
    ['mousedown','click','pointerdown','touchstart'].forEach(ev=>
      msgTa.addEventListener(ev,e=>e.stopPropagation(),{passive:false})
    );
    msgWrap.appendChild(msgLbl);msgWrap.appendChild(msgTa);
    card.appendChild(msgWrap);
    card.appendChild(saveBtn);
    document.body.appendChild(card);
    card._inp=Object.fromEntries(Object.entries(flds).map(([k,v])=>[k,v.inp]));
    regCardEl=card;
  }

  /* ── Send handler ── */
  function send(){
    const txt=inp.value.trim();if(!txt)return;
    inp.value='';
    chatCount++;

    /* 0 — passive sniff: detect volunteered info anywhere in message */
    const preSniff={name:visitor.get().name,phone:visitor.get().phone,email:visitor.get().email};
    visitor.sniff(txt);
    const postSniff=visitor.get();
    const justCaptured=['name','phone','email'].find(f=>!preSniff[f]&&postSniff[f])||null;

    /* show card whenever user signals intent to share any personal detail — right or wrong format */
    if(!visitor.isComplete()){
      const wantsToShare=justCaptured||
        /* name intent */
        /(?:my\s+(?:full\s+|good\s+)?name\s*(?:is|:)|(?:please\s+)?call\s+me\s+\w|i[' ]?m\s+called|i\s+am\s+called|i\s+go\s+by|myself\s+[A-Z]|my\s+nickname\s+is|(?:[Ii]\s+am|[Ii][' ]?m)\s+[A-Z])/i.test(txt)||
        /* phone intent right or wrong */
        /(?:my\s+(?:phone|mobile|mob|cell|contact|whatsapp|wp)\s*(?:number|no\.?|is|:)|(?:call|text|reach|whatsapp)\s+me\s+(?:at|on))/i.test(txt)||
        /* email intent or @ */
        /@/.test(txt)||/my\s+(?:email|e-?mail|gmail|mail)\s*(?:id|is|:)/i.test(txt);
      if(wantsToShare)showRegCard();
    }

    /* 0b — name re-declaration or update */
    if(preSniff.name&&!justCaptured){
      const nameUpdated=postSniff.name&&postSniff.name!==preSniff.name;
      if(nameUpdated){
        const n=postSniff.name;
        applyExprFn('lovey',refs,lerp);ctx.state='lovey';ctx.manualUntil=Date.now()+4000;
        bubble.chatShow(pick([
          `oh!! I'll call you ${n} from now on~ 💕 sorry for the confusion!!`,
          `got it!! ${n} it is~ 😊 I've updated your name!!`,
          `aww ${n}~ noted!! I'll remember that from now on!! 💖`,
          `${n}!! ooh I love that~ updated!! 💕✨`,
        ]),5000);
        if(!visitor.isComplete())setTimeout(showRegCard,1000);
        return;
      }
      const NAME_REDECL=/(?:my\s+(?:full\s+|good\s+)?name\s*(?:is|:)|(?:please\s+)?call\s+me\s+\w|i[' ]?m\s+called|i\s+am\s+called|i\s+go\s+by|myself\s+[A-Z]|my\s+nickname\s+is|(?:[Ii]\s+am|[Ii][' ]?m)\s+[A-Z])/;
      if(NAME_REDECL.test(txt)){
        const n=preSniff.name;
        applyExprFn('lovey',refs,lerp);ctx.state='lovey';ctx.manualUntil=Date.now()+4000;
        bubble.chatShow(pick([
          `hehe I already know!! you're ${n}~ I could never forget!! 💕`,
          `yes yes!! ${n}!! how could I ever forget your name~ 😊✨`,
          `of course!! ${n}!! it's right here in my heart~ 💖`,
          `silly!! I know you're ${n}~ you don't need to introduce yourself again!! 😄`,
        ]),5000);
        return;
      }
    }

    /* 1 — handle explicit pendingField */
    if(pendingField){
      /* sniff captured exactly what we asked for */
      if(justCaptured===pendingField){
        const f=pendingField;pendingField=null;pendingFieldBadOnce=false;
        applyExprFn('lovey',refs,lerp);ctx.state='lovey';ctx.manualUntil=Date.now()+4000;
        bubble.chatShow(fillN(pick(VA['thanks_'+f])),5000);
        if(!visitor.isComplete())setTimeout(showRegCard,900);
        return;
      }
      /* cross-field: user gave a different field than asked */
      if(justCaptured&&justCaptured!==pendingField){
        const n=visitor.getName()||'you';
        const reAsk=pendingField==='name'?'what should I call you? 😊'
          :pendingField==='phone'?'could I also get your phone number? 📱'
          :'what about your email ID? 📧';
        applyExprFn('lovey',refs,lerp);ctx.state='lovey';ctx.manualUntil=Date.now()+6000;
        bubble.chatShow(
          justCaptured==='name'?`aww ${n}!! love that name!! 💕 now, ${reAsk}`:`got it~ 💕 now, ${reAsk}`,
          9000
        );
        if(!visitor.isComplete())setTimeout(showRegCard,900);
        return;
      }
      /* refusal */
      if(REFUSAL_RE.test(txt)){
        pendingField=null;pendingFieldBadOnce=false;
        visitor.snooze(24);
        bubble.chatShow(pick(VA.refusal_ok),4000);
        return;
      }
      /* direct answer attempt */
      const isChatMsg=classify(txt.toLowerCase())!=='deflect'&&txt.length>30;
      if(!isChatMsg){
        const ok=visitor.capture(txt,pendingField);
        if(ok){
          const f=pendingField;pendingField=null;pendingFieldBadOnce=false;
          applyExprFn('lovey',refs,lerp);ctx.state='lovey';ctx.manualUntil=Date.now()+4000;
          bubble.chatShow(fillN(pick(VA['thanks_'+f])),5000);
          if(!visitor.isComplete())setTimeout(showRegCard,900);
          return;
        }
        /* invalid format — show error + open card so they can fill it correctly */
        if((pendingField==='phone'||pendingField==='email')&&!pendingFieldBadOnce){
          pendingFieldBadOnce=true;
          bubble.chatShow(pick(VA[pendingField+'_invalid']),7000);
          setTimeout(showRegCard,500);
          return;
        }
      }
      pendingField=null;pendingFieldBadOnce=false;
    }

    /* 2 — pending follow-up */
    if(pendingFU){
      const fu=resolveFollowUp(pendingFU,txt);
      if(fu){
        const reply=pick(fu.pool);
        lastCat=fu.cat;pendingFU=fu.next||null;
        logMsg(txt,fu.cat+'_fu',sid,reply);
        const expr=CAT_EXPR[fu.cat]||'flirty';
        ctx.state=expr;applyExprFn(expr,refs,lerp);
        ctx.manualUntil=Date.now()+6000;
        const dur=Math.max(6000,Math.min(13000,reply.length*90));
        if(!slipAsk(reply,dur))bubble.chatShow(reply,dur);
        return;
      }
      pendingFU=null;
    }

    /* 3 — rank number shortcut */
    const nm=txt.toLowerCase().match(/\b(\d{3,6})\b/);
    if(nm&&/\b(rank|air|score|got|my|mera|percentile)\b/.test(txt.toLowerCase())){
      const pool=rankReply(parseInt(nm[1]));
      const reply=pick(pool);
      lastCat='rank';pendingFU=null;
      logMsg(txt,'rank_specific',sid,reply);
      ctx.state='curious';applyExprFn('curious',refs,lerp);
      ctx.manualUntil=Date.now()+6000;
      const dur=Math.max(6000,Math.min(13000,reply.length*90));
      if(!slipAsk(reply,dur))bubble.chatShow(reply,dur);
      return;
    }

    /* 4 — fresh classification */
    const t=txt.toLowerCase();
    const cat=classify(t);
    const pool=R[cat]||R.deflect;
    lastCat=cat;

    const fuDef=FU_Q[cat];
    const reply=personalize(pick(pool));
    logMsg(txt,cat,sid,reply);
    const expr=CAT_EXPR[cat]||'flirty';
    ctx.state=expr;applyExprFn(expr,refs,lerp);
    ctx.manualUntil=Date.now()+6000;

    if(fuDef&&Math.random()<0.55){
      pendingFU=fuDef.key;
      const full=reply+' '+fuDef.q;
      bubble.chatShow(full,Math.max(7000,Math.min(14000,full.length*80)));
    }else{
      pendingFU=null;
      const dur=Math.max(6000,Math.min(13000,reply.length*90));
      if(!slipAsk(reply,dur))bubble.chatShow(reply,dur);
    }
  }

  btn.addEventListener('click',send);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send();}});

  chatWrap.addEventListener('mousedown',e=>e.stopPropagation());
  chatWrap.addEventListener('click',e=>e.stopPropagation());
  chatWrap.addEventListener('pointerdown',e=>e.stopPropagation());
}
