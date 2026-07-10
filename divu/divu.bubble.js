/* ── Bubble ── speech bubble: show, forceShow, chatShow, forState */
import { BUBBLE_P } from './divu.config.js';
import { C } from './divu.comments.js';

export function makeBubble(el){
  let timer=null,coolUntil=0,showStartAt=0,recent=[],lastAmbient=0;

  /* Minimum reading time: 5 s floor, 12 s ceiling, ~105 ms per character */
  function _autoDur(txt){return Math.max(5000,Math.min(12000,txt.length*105));}

  /* Ambient / roaming messages — respect cooldown */
  function show(txt,dur){
    if(Date.now()<coolUntil)return;
    clearTimeout(timer);el.textContent=txt;el.classList.add('show');
    const d=dur||_autoDur(txt);
    showStartAt=Date.now();
    timer=setTimeout(()=>el.classList.remove('show'),d);
    coolUntil=Date.now()+d+3000;   /* 3 s breathing room after any ambient message */
  }

  /* Event reactions — can interrupt, but only after the current message is ≥ 1.5 s old */
  function forceShow(txt,dur){
    if(Date.now()-showStartAt<1500&&el.classList.contains('show'))return;
    clearTimeout(timer);el.textContent=txt;el.classList.add('show');
    const d=dur||_autoDur(txt);
    showStartAt=Date.now();
    timer=setTimeout(()=>el.classList.remove('show'),d);
    coolUntil=Date.now()+d+2500;
  }

  /* Chat replies — always win, long display, blocks ambient for 20 s afterward */
  function chatShow(txt,dur){
    clearTimeout(timer);el.textContent=txt;el.classList.add('show');
    const d=dur||Math.max(6000,Math.min(13000,txt.length*90));
    showStartAt=Date.now();
    timer=setTimeout(()=>el.classList.remove('show'),d);
    coolUntil=Date.now()+d+5000;
    lastAmbient=Date.now();   /* suppress ambient chatter after a real conversation */
  }

  /* Ambient personality chatter — min 20 s gap between any two ambient messages */
  function forState(s,force){
    if(!force&&Date.now()-lastAmbient<20000)return;
    const pool=C[s];if(!pool||(!force&&Math.random()>BUBBLE_P))return;
    let picks=pool.filter(m=>!recent.includes(m));if(!picks.length){recent=[];picks=pool;}
    const msg=picks[Math.floor(Math.random()*picks.length)];
    recent=[...recent.slice(-2),msg];
    show(msg);
    lastAmbient=Date.now();
  }

  /* Priority override — always interrupts, no ambient suppression afterward */
  function shout(txt,dur){
    clearTimeout(timer);el.textContent=txt;el.classList.add('show');
    const d=dur||_autoDur(txt);
    showStartAt=Date.now();
    timer=setTimeout(()=>el.classList.remove('show'),d);
    coolUntil=Date.now()+d+2500;
  }

  return{show,forceShow,chatShow,forState,shout};
}
