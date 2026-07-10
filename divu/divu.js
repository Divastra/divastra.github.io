/* ── Divu entry point ── wires all modules together and boots
   Original monolithic divu.js (3423 lines) is now split into:
     divu.config.js      — CFG, personality constants
     divu.expressions.js — expression geometry + X table
     divu.utils.js       — NS, svgEl, gStop, pick, showSymbol
     divu.styles.js      — CSS string
     divu.comments.js    — BASE_C + merged C pools
     divu.look.js        — buildFace() SVG construction
     divu.face.js        — getRefs, applyExpr, makeLerp, makePupils, makeBlink
     divu.bubble.js      — makeBubble
     divu.body.js        — makeBody, makePet, makeDrag
     divu.voice.js       — makeVoice (mic capture + pitch shift)
     divu.face-mimic.js  — makeCamera (MediaPipe blendshapes) + analyzeEl
     divu.replies.js     — R, FU_R, FU_Q, CAT_EXPR data
     divu.classify.js    — classify, rankReply, resolveFollowUp, logMsg
     divu.mischief.js    — initMischief (mood flashes), initFlirty (engine)
     divu.chat.js        — initChat (chat UI + send handler)
     divu.intel.js       — makeIntel (all 70+ behavioural scenarios)
*/
import { CSS } from './divu.styles.js';
import { NAME, IDLE_ANIM } from './divu.config.js';
import { buildFace } from './divu.look.js';
import { getRefs, applyExpr, makeLerp, makePupils, makeBlink } from './divu.face.js';
import { showSymbol } from './divu.utils.js';
import { makeBubble } from './divu.bubble.js';
import { makeBody, makePet, makeDrag, makeGestures } from './divu.body.js';
import { makeVoice } from './divu.voice.js';
import { makeCamera } from './divu.face-mimic.js';
import { makeIntel } from './divu.intel.js';

function boot(){
  const style=document.createElement('style');style.textContent=CSS;document.head.appendChild(style);

  const root=document.createElement('div');root.id='divu-root';

  const bubbleEl=document.createElement('div');bubbleEl.id='divu-bubble';root.appendChild(bubbleEl);

  const wrap=document.createElement('div');wrap.id='divu-face-wrap';wrap.appendChild(buildFace());root.appendChild(wrap);

  const controls=document.createElement('div');controls.id='divu-controls';
  const nameEl=document.createElement('div');nameEl.id='divu-name';nameEl.textContent=NAME.toUpperCase();
  const micBtn=document.createElement('div');micBtn.id='dv-mic-btn';micBtn.title='Talk to me! 🎤';micBtn.textContent='🎤';
  const camBtn=document.createElement('div');camBtn.id='dv-cam-btn';camBtn.title='Mirror my face! 📷';camBtn.textContent='📷';
  controls.appendChild(nameEl);controls.appendChild(micBtn);controls.appendChild(camBtn);root.appendChild(controls);

  document.body.appendChild(root);

  const refs=getRefs();
  const lerp=makeLerp(refs);
  const pupils=makePupils(refs,lerp);
  const bubble=makeBubble(bubbleEl);
  const body=IDLE_ANIM?makeBody(refs,applyExpr,lerp):null;
  const intel=makeIntel(refs,lerp,pupils,bubble,root,body);
  const blink=makeBlink(refs,intel.getState);

  makeDrag(root,refs,lerp,bubble,applyExpr,body);
  makePet(refs,root,intel.forceState,bubble,showSymbol);
  makeGestures(root,refs,applyExpr,lerp,bubble,intel.forceState,showSymbol);
  makeVoice(refs,lerp,applyExpr,bubble,showSymbol,micBtn);
  makeCamera(refs,lerp,applyExpr,bubble,camBtn);

  applyExpr('idle',refs,lerp);
  blink.start();
  (function loop(){pupils.tick();lerp.tick();requestAnimationFrame(loop);})();
  window.addEventListener('resize',pupils.resetRect,{passive:true});
  window.addEventListener('scroll',pupils.resetRect,{passive:true});

  window.Divi={
    say:        (txt,dur)=>bubble.show(txt,dur),
    shout:      (txt,dur)=>bubble.shout(txt,dur),   /* always interrupts, used for key moments */
    feel:       name=>applyExpr(name,refs,lerp),
    forceState: (s,dur,msg)=>intel.forceState(s,dur,msg),
    wink:       ()=>{const p=intel.getState();applyExpr('wink',refs,lerp);setTimeout(()=>applyExpr(p,refs,lerp),920);},
    symbol:     ch=>showSymbol(refs,ch),
    listen:     ()=>document.getElementById('dv-mic-btn')&&document.getElementById('dv-mic-btn').click(),
  };
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
