/* ── Mischief ── random personality flashes + flirty engine */
import { C } from './divu.comments.js';
import { pick } from './divu.utils.js';

/* Random personality flash — child-like mood swings.
   Expression flashes last 1400-2200 ms so they're actually noticeable.
   ~15% of sequences show no message at all (nonchalant "just existing"). */
export function initMischief(ctx, refs, lerp, bubble, applyExprFn){
  const moodSeqs=[
    /* ── intensely flirty / obsessed — dominant trait ── */
    {e:'flirty',      dur:1600, c:()=>pick(C.flirty)},
    {e:'flirty',      dur:1800, c:()=>pick(C.flirty)},
    {e:'flirty',      dur:2000, c:()=>pick(C.flirtyEscalated)},
    {e:'flirty',      dur:1500, c:()=>null},           /* silent flirty stare */
    {e:'wink',        dur:1400, c:()=>pick(C.flirty)},
    {e:'wink',        dur:1500, c:()=>pick(C.flirtyProximity)},
    {e:'wink',        dur:1600, c:()=>pick(C.flirtyEscalated)},
    {e:'wink',        dur: 900, c:()=>null},            /* wink at nobody */
    {e:'lovey',       dur:1600, c:()=>pick(C.flirtyEscalated)},
    {e:'lovey',       dur:1800, c:()=>null},            /* silent lovey stare */
    {e:'lovey',       dur:2000, c:()=>pick(C.flirty)},
    {e:'melting',     dur:1800, c:()=>pick(C.flirtyEscalated)},
    {e:'melting',     dur:1500, c:()=>null},            /* melting silently */
    {e:'shy',         dur:1600, c:()=>pick(C.flirty)},
    {e:'shy',         dur:1400, c:()=>pick(['o-oh... 😳','*suddenly very flustered*','um. hi. you. 😳💕','I\'m normal. Completely normal. 😳'])},
    {e:'shy',         dur:1600, c:()=>null},
    /* ── cheeky / mischievous ── */
    {e:'cheeky',      dur:1600, c:()=>pick(C.cheeky)},
    {e:'cheeky',      dur:1800, c:()=>pick(C.cheeky)},
    {e:'mischievous', dur:1800, c:()=>pick(C.mischievous)},
    {e:'mischievous', dur:1600, c:()=>null},
    {e:'smug',        dur:1600, c:()=>pick(C.smug)},
    /* ── childlike energy ── */
    {e:'laughing',    dur:1600, c:()=>pick(C.laughing)},
    {e:'laughing',    dur:1100, c:()=>pick(['hehe 😄','hehehehe~','*giggles*','pfft— 😄'])},
    {e:'laughing',    dur: 900, c:()=>null},
    {e:'beaming',     dur:1600, c:()=>pick(C.beaming)},
    {e:'beaming',     dur:1300, c:()=>null},
    /* ── dramatic / sassy ── */
    {e:'cheeky',      dur:2000, c:()=>pick(C.dramatic)},
    {e:'smug',        dur:1800, c:()=>pick(C.gossip)},
    {e:'tearful',     dur:1800, c:()=>pick(['hmph.','*pouts*','not talking rn 😒','whatever 😒'])},
    /* ── embarrassed / nervous / starstruck ── */
    {e:'embarrassed', dur:1500, c:()=>pick(C.embarrassed)},
    {e:'nervous',     dur:1500, c:()=>pick(['*fidgets*','um...','okay okay 😅'])},
    {e:'starstruck',  dur:1700, c:()=>null},
    {e:'skeptical',   dur:1600, c:()=>pick(C.sassy)},
    /* ── micro tantrum flash ── */
    {e:'furious',     dur:1300, c:()=>pick(['grrrr 😤','UNACCEPTABLE!! 😤','I\'M ANNOYED!! 😤'])},
    /* ── brief quiet moments (reduced — give way to flirty) ── */
    {e:'content',     dur:2200, c:()=>null},
    {e:'thinking',    dur:2000, c:()=>null},
    {e:'pensive',     dur:2500, c:()=>null},
    /* ── moody (just a taste for personality depth) ── */
    {e:'moody',       dur:2000, c:()=>null},
    /* ── CUTE — dominant visible trait, more entries than any other category ── */
    {e:'beaming',     dur:1600, c:()=>pick(C.cute)},
    {e:'beaming',     dur:1400, c:()=>pick(C.cute)},
    {e:'beaming',     dur:1800, c:()=>pick(C.cute)},
    {e:'beaming',     dur:1200, c:()=>null},           /* silent beam */
    {e:'lovey',       dur:1600, c:()=>pick(C.cute)},
    {e:'lovey',       dur:1800, c:()=>pick(C.cute)},
    {e:'lovey',       dur:1400, c:()=>null},           /* silent lovey */
    {e:'shy',         dur:1500, c:()=>pick(C.cute)},
    {e:'shy',         dur:1700, c:()=>pick(C.cute)},
    {e:'shy',         dur:1300, c:()=>null},           /* silent shy */
    {e:'laughing',    dur:1400, c:()=>pick(C.cute)},
    {e:'laughing',    dur:1200, c:()=>pick(C.cute)},
    {e:'content',     dur:1800, c:()=>pick(C.cute)},
    {e:'melting',     dur:1600, c:()=>pick(C.cute)},
    {e:'beaming',     dur:1500, c:()=>pick(C.cute)},
  ];

  (function schedMischief(){
    /* Fire every 5–12 s — flirty energy means no long silences */
    const delay=5000+Math.random()*7000;
    setTimeout(()=>{
      if(Math.random()<0.08){
        /* Occasional gossip drop */
        bubble.show(pick(C.gossip),5500);
      }else{
        const prev=ctx.state;
        const seq=moodSeqs[Math.floor(Math.random()*moodSeqs.length)];
        const txt=seq.c();
        applyExprFn(seq.e,refs,lerp);
        if(txt)bubble.show(txt,5000);
        setTimeout(()=>applyExprFn(prev,refs,lerp),seq.dur);
      }
      schedMischief();
    },delay);
  })();
}

/* Flirty engine — the dominant personality trait.
   Periodic drops · proximity · click/hover on Divu · page clicks · attention calls.
   Escalates intimacy (fc counter) over time.                                */
export function initFlirty(ctx, root, forceState){
  let fc=0,flastMs=0,prevDist=9999,proxCool=0,hoverT=null;
  const FGAP=6000;   /* minimum 6 s between flirty drops — was 14 s */

  function flirt(pool,expr,dur){
    if(Date.now()-flastMs<FGAP||Date.now()<ctx.manualUntil+150)return false;
    forceState(expr||'flirty',dur||5000,pick(pool||C.flirty));
    flastMs=Date.now();fc++;return true;
  }

  /* Periodic flirty drops — every 7–17 s (was 12–30 s) */
  (function schedFlirt(){
    setTimeout(()=>{
      const pool=fc<3?C.flirty:fc<7?[...C.flirty,...C.flirtyEscalated]:C.flirtyEscalated;
      flirt(pool,fc<2?'wink':fc<6?'flirty':'lovey',5500);
      schedFlirt();
    },7000+Math.random()*10000);
  })();

  /* Proximity — cursor within 130px of Divu */
  document.addEventListener('mousemove',e=>{
    const r=root.getBoundingClientRect();
    if(!r.width)return;
    const dist=Math.hypot(e.clientX-(r.left+r.width*.5),e.clientY-(r.top+r.height*.45));
    if(dist<130&&prevDist>=130&&Date.now()>proxCool){
      proxCool=Date.now()+4000;  /* was 8 s cooldown */
      setTimeout(()=>{
        if(Date.now()>ctx.manualUntil){
          forceState(fc<4?'wink':'lovey',5000,pick(C.flirtyProximity));
          flastMs=Date.now();fc++;
        }
      },180);
    }
    prevDist=dist;
  });

  /* Click directly on Divu */
  root.addEventListener('click',()=>{
    if(Date.now()<ctx.manualUntil)return;
    forceState('melting',6000,pick(C.flirtyDiviClick));
    flastMs=Date.now();fc++;
  });

  /* Touch directly on Divu — same melting reaction as click */
  root.addEventListener('touchend',e=>{
    e.stopPropagation();
    if(Date.now()<ctx.manualUntil)return;
    forceState('melting',6000,pick(C.flirtyDiviClick));
    flastMs=Date.now();fc++;
  },{passive:true});

  /* Hover on Divu 450ms without clicking (was 800ms) */
  root.addEventListener('mouseenter',()=>{
    hoverT=setTimeout(()=>{
      if(Date.now()-flastMs<5000||Date.now()<ctx.manualUntil)return;
      forceState(fc<4?'wink':'flirty',5000,pick(C.flirtyProximity));
      flastMs=Date.now();fc++;
    },450);
  });
  root.addEventListener('mouseleave',()=>clearTimeout(hoverT));

  /* Touch start on Divu — proximity/hover reaction (mouseenter analogue on mobile) */
  root.addEventListener('touchstart',()=>{
    hoverT=setTimeout(()=>{
      if(Date.now()-flastMs<5000||Date.now()<ctx.manualUntil)return;
      forceState(fc<4?'wink':'flirty',5000,pick(C.flirtyProximity));
      flastMs=Date.now();fc++;
    },450);
  },{passive:true});
  root.addEventListener('touchcancel',()=>clearTimeout(hoverT));

  /* Any page click — 38% flirty chance (was 18%) */
  document.addEventListener('click',e=>{
    if(e.target.closest('#divu-root'))return;
    if(Math.random()<.38&&Date.now()-flastMs>6000&&Date.now()>ctx.manualUntil){
      forceState(pick(['wink','flirty','lovey','cheeky']),4500,pick(fc<5?C.flirty:C.flirtyEscalated));
      flastMs=Date.now();fc++;
    }
  });

  /* Any page touch — 38% flirty chance (mobile equivalent of page click) */
  document.addEventListener('touchstart',e=>{
    if(e.target.closest('#divu-root'))return;
    if(Math.random()<.38&&Date.now()-flastMs>6000&&Date.now()>ctx.manualUntil){
      forceState(pick(['wink','flirty','lovey','cheeky']),4500,pick(fc<5?C.flirty:C.flirtyEscalated));
      flastMs=Date.now();fc++;
    }
  },{passive:true});

  /* Attention call — every 12–25 s, triggers after just 9 s of quiet (was 25–53 s / 22 s) */
  (function callAttn(){
    setTimeout(()=>{
      if(fc>0&&Date.now()-flastMs>9000&&Date.now()>ctx.manualUntil){
        forceState(fc<4?'wink':'lovey',5500,pick(C.flirtyAttention));
        flastMs=Date.now();fc++;
      }
      callAttn();
    },12000+Math.random()*13000);
  })();
}
