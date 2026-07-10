/* ── Face mimic ── MediaPipe camera face tracking + smart element analysis */
import { EL, ER, IR, PR, MT, MX1, MX2, MQX, MBASE } from './divu.expressions.js';
import { CFG } from './divu.config.js';
import { C } from './divu.comments.js';
import { pick } from './divu.utils.js';

export function makeCamera(refs,lerp,applyExprFn,bubble,camBtn){
  let videoEl=null,landmarker=null,camRunning=false,camStream=null;

  async function loadLandmarker(){
    const m=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
    const vis=await m.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
    return m.FaceLandmarker.createFromOptions(vis,{
      baseOptions:{
        modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate:'GPU'
      },
      outputFaceBlendshapes:true,runningMode:'VIDEO',numFaces:1
    });
  }

  function bs(shapes,name){
    if(!shapes||!shapes[0]||!shapes[0].categories)return 0;
    return shapes[0].categories.find(c=>c.categoryName===name)?.score||0;
  }

  function applyBS(shapes){
    const g=n=>bs(shapes,n);

    const blinkL=g('eyeBlinkLeft'),blinkR=g('eyeBlinkRight');
    const wideL=g('eyeWideLeft'),wideR=g('eyeWideRight');
    refs.lidL.style.transform=`translateY(${(-58*(1-blinkL)-wideL*7).toFixed(1)}px)`;
    refs.lidR.style.transform=`translateY(${(-58*(1-blinkR)-wideR*7).toFixed(1)}px)`;

    const sqL=Math.max(g('cheekSquintLeft'),g('eyeSquintLeft'));
    const sqR=Math.max(g('cheekSquintRight'),g('eyeSquintRight'));
    refs.llidL.style.transform=`translateY(${(58*(1-sqL*.65)).toFixed(1)}px)`;
    refs.llidR.style.transform=`translateY(${(58*(1-sqR*.65)).toFixed(1)}px)`;

    const bDL=g('browDownLeft'),bDR=g('browDownRight'),bIU=g('browInnerUp');
    const bOUL=g('browOuterUpLeft'),bOUR=g('browOuterUpRight');
    const browLY=(-bDL*12+bIU*5+bOUL*8).toFixed(1);
    const browRY=(-bDR*12+bIU*5+bOUR*8).toFixed(1);
    const browLR=(-bDL*6+bOUL*4).toFixed(1);
    const browRR=(bDR*6-bOUR*4).toFixed(1);
    refs.browL.style.transform=`translateY(${browLY}px) rotate(${browLR}deg)`;
    refs.browR.style.transform=`translateY(${browRY}px) rotate(${browRR}deg)`;

    const gxL=(g('eyeLookOutLeft')-g('eyeLookInLeft'))*MT;
    const gyL=(g('eyeLookDownLeft')-g('eyeLookUpLeft'))*MT*.7;
    const gxR=(g('eyeLookInRight')-g('eyeLookOutRight'))*MT;
    const gyR=(g('eyeLookDownRight')-g('eyeLookUpRight'))*MT*.7;
    refs.lPupil.setAttribute('cx',(EL.cx+gxL).toFixed(2));refs.lPupil.setAttribute('cy',(EL.cy+gyL).toFixed(2));
    refs.rPupil.setAttribute('cx',(ER.cx+gxR).toFixed(2));refs.rPupil.setAttribute('cy',(ER.cy+gyR).toFixed(2));
    refs.lHi.setAttribute('cx',(EL.cx+gxL+3.5).toFixed(2));refs.lHi.setAttribute('cy',(EL.cy+gyL-4.5).toFixed(2));
    refs.rHi.setAttribute('cx',(ER.cx+gxR+3.5).toFixed(2));refs.rHi.setAttribute('cy',(ER.cy+gyR-4.5).toFixed(2));

    const wideAvg=(wideL+wideR)*.5;
    const pR=Math.max(6,Math.min(PR+6,PR+wideAvg*6-blinkL*3)).toFixed(1);
    const iR=Math.max(14,Math.min(IR+6,IR+wideAvg*5)).toFixed(1);
    refs.lPupil.setAttribute('r',pR);refs.rPupil.setAttribute('r',pR);
    refs.lIris.setAttribute('r',iR);refs.rIris.setAttribute('r',iR);
    if(refs.lIrisOv)refs.lIrisOv.setAttribute('r',iR);
    if(refs.rIrisOv)refs.rIrisOv.setAttribute('r',iR);

    const smL=g('mouthSmileLeft'),smR=g('mouthSmileRight');
    const frL=g('mouthFrownLeft'),frR=g('mouthFrownRight');
    const jaw=g('jawOpen');
    const pucker=Math.max(g('mouthPucker'),g('mouthFunnel')*.75);
    const press=(g('mouthPressLeft')+g('mouthPressRight'))*.5;
    const lowerDrop=(g('mouthLowerDownLeft')+g('mouthLowerDownRight'))*.5;
    const smile=(smL+smR)*.5;
    const frown=Math.min(1,(frL+frR)*.9+lowerDrop*.6);
    const smirk=(smL-smR)*.5;
    const frownAsymm=(frL-frR)*.5;

    refs.mouthCat&&refs.mouthCat.setAttribute('opacity','0');
    refs.mouthCatL&&refs.mouthCatL.setAttribute('opacity','0');
    refs.mouthDot&&refs.mouthDot.setAttribute('opacity','0');
    refs.mouthQ&&refs.mouthQ.setAttribute('opacity','0');

    const showJaw=jaw>0.22;
    const showPucker=pucker>0.4&&!showJaw;
    const showPress=press>0.55&&!showJaw&&!showPucker;

    if(showJaw){
      refs.mouthO.setAttribute('rx',Math.min(15,9+jaw*10).toFixed(1));
      refs.mouthO.setAttribute('ry',Math.min(18,7+jaw*17).toFixed(1));
      refs.mouthO.setAttribute('cy',(137+jaw*5).toFixed(1));
      refs.mouthO.style.opacity=Math.min(1,(jaw-.22)*4.5).toFixed(2);
      refs.mouth.style.opacity='0';refs.mouthSh.style.opacity='0';
      if(refs.mouthPucker)refs.mouthPucker.setAttribute('opacity','0');
      refs.teeth.setAttribute('opacity',jaw>0.38?Math.min(1,(jaw-.38)*5).toFixed(2):'0');
      refs.tongue.setAttribute('opacity',g('tongueOut')>0.38?Math.min(1,(g('tongueOut')-.38)*6).toFixed(2):'0');
    }else if(showPucker){
      refs.mouthO.style.opacity='0';refs.mouth.style.opacity='0';refs.mouthSh.style.opacity='0';
      refs.teeth.setAttribute('opacity','0');refs.tongue.setAttribute('opacity','0');
      if(refs.mouthPucker)refs.mouthPucker.setAttribute('opacity',Math.min(1,(pucker-.4)*5.5).toFixed(2));
    }else if(showPress){
      const d=`M${MX1} ${MBASE} Q${MQX} ${MBASE+1} ${MX2} ${MBASE}`;
      refs.mouth.setAttribute('d',d);refs.mouthSh.setAttribute('d',d);
      refs.mouth.style.opacity='1';refs.mouthSh.style.opacity='1';
      refs.mouthO.style.opacity='0';refs.teeth.setAttribute('opacity','0');refs.tongue.setAttribute('opacity','0');
      if(refs.mouthPucker)refs.mouthPucker.setAttribute('opacity','0');
    }else{
      const mY=(MBASE+4+smile*30-frown*38).toFixed(1);
      const mqx=(MQX+smirk*22-frownAsymm*18).toFixed(1);
      const d=`M${MX1} ${MBASE} Q${mqx} ${mY} ${MX2} ${MBASE}`;
      refs.mouth.setAttribute('d',d);refs.mouthSh.setAttribute('d',d);
      refs.mouth.style.opacity='1';refs.mouthSh.style.opacity='1';
      refs.mouthO.style.opacity='0';refs.teeth.setAttribute('opacity','0');refs.tongue.setAttribute('opacity','0');
      if(refs.mouthPucker)refs.mouthPucker.setAttribute('opacity','0');
    }

    const dimpleAmt=Math.max(0,(smile-.55)*2.4);
    if(refs.dimpleL)refs.dimpleL.setAttribute('opacity',Math.min(1,dimpleAmt).toFixed(2));
    if(refs.dimpleR)refs.dimpleR.setAttribute('opacity',Math.min(1,dimpleAmt).toFixed(2));

    const puff=g('cheekPuff');
    if(refs.puffL)refs.puffL.setAttribute('opacity',Math.min(.9,puff*1.4).toFixed(3));
    if(refs.puffR)refs.puffR.setAttribute('opacity',Math.min(.9,puff*1.4).toFixed(3));

    const blushAmt=Math.min(.88,(smile*.62+(sqL+sqR)*.5*.36)).toFixed(3);
    if(refs.ckL)refs.ckL.setAttribute('opacity',blushAmt);
    if(refs.ckR)refs.ckR.setAttribute('opacity',blushAmt);

    if(refs.sneerL)refs.sneerL.setAttribute('opacity',Math.min(1,g('noseSneerLeft')*2.8).toFixed(2));
    if(refs.sneerR)refs.sneerR.setAttribute('opacity',Math.min(1,g('noseSneerRight')*2.8).toFixed(2));

    refs.lIris.style.fill=refs.rIris.style.fill=bDL>.55&&bDR>.55&&jaw<.1?'#ef4444':'#7c3aed';
  }

  async function start(){
    if(camRunning)return;
    try{
      bubble.show('Loading face AI... 👁️');
      if(!landmarker)landmarker=await loadLandmarker();
      camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:320},height:{ideal:240}},audio:false});
      videoEl=document.createElement('video');
      Object.assign(videoEl.style,{position:'fixed',bottom:'8px',left:'8px',width:'110px',height:'82px',
        borderRadius:'12px',border:'2px solid rgba(192,132,252,.7)',objectFit:'cover',
        zIndex:'99998',opacity:'0.88',transform:'scaleX(-1)',transition:'opacity .3s'});
      videoEl.srcObject=camStream;videoEl.autoplay=true;videoEl.playsInline=true;videoEl.muted=true;
      document.body.appendChild(videoEl);
      await new Promise(r=>{videoEl.onloadeddata=r;});
      document.querySelectorAll('.ob-lid,.ob-brow').forEach(el=>el.style.transition='none');
      camRunning=true;
      if(camBtn)camBtn.classList.add('active');
      bubble.show('Mirror mode ON! 📷 Copy me~',3000);
      let lastT=-1;
      (function detect(){
        if(!camRunning)return;
        const t=performance.now();
        if(videoEl.readyState>=2&&t!==lastT){
          lastT=t;
          const r=landmarker.detectForVideo(videoEl,t);
          if(r.faceBlendshapes&&r.faceBlendshapes.length)applyBS(r.faceBlendshapes);
        }
        requestAnimationFrame(detect);
      })();
    }catch(_){
      bubble.show('Camera unavailable 📷😢');applyExprFn('sad',refs,lerp);
    }
  }

  function stop(){
    camRunning=false;
    if(camStream)camStream.getTracks().forEach(t=>t.stop());
    if(videoEl&&videoEl.parentNode)videoEl.remove();
    videoEl=null;camStream=null;
    document.querySelectorAll('.ob-lid,.ob-brow').forEach(el=>el.style.transition='');
    refs.lIris.setAttribute('r',IR);refs.rIris.setAttribute('r',IR);
    if(refs.lIrisOv)refs.lIrisOv.setAttribute('r',IR);if(refs.rIrisOv)refs.rIrisOv.setAttribute('r',IR);
    refs.lPupil.setAttribute('r',PR);refs.rPupil.setAttribute('r',PR);
    refs.mouthO.setAttribute('rx','11');refs.mouthO.setAttribute('ry','13');refs.mouthO.setAttribute('cy','140');
    [refs.mouthPucker,refs.puffL,refs.puffR,refs.dimpleL,refs.dimpleR,refs.sneerL,refs.sneerR]
      .forEach(el=>{if(el)el.setAttribute('opacity','0');});
    if(camBtn)camBtn.classList.remove('active');
    applyExprFn('idle',refs,lerp);
  }

  if(camBtn)camBtn.addEventListener('click',e=>{e.stopPropagation();camRunning?stop():start();});
}

export function analyzeEl(el){
  for(const r of(CFG.elementReactions||[])){try{if(el.matches(r.selector))return{state:r.state||'happy',msg:r.message};}catch(_){}}
  const txt=[el.textContent,el.value,el.getAttribute('aria-label'),el.getAttribute('placeholder')].filter(Boolean).join(' ').trim().toLowerCase();
  const href=el.getAttribute('href')||'';const tag=el.tagName.toLowerCase();const cls=(el.className||'').toLowerCase();
  if(href.includes('youtube')||href.includes('youtu.be'))return{state:'smug',msg:pick(C.onVideoHover||[])||'Background check! Respect! 📺'};
  if(['input','textarea','select'].includes(tag)&&el.getAttribute('type')!=='hidden')return{state:'curious',msg:pick(C.onFormFocus||[])||'Typing something? 📝'};
  if(/₹|\$|price|cost|fee|inr/.test(txt+cls))return{state:'starstruck',msg:pick(C.onPriceHover||[])||'That\'s great value! 💰'};
  if(/book|register|enroll|apply|join|buy|pay|purchase/.test(txt))return{state:'excited',msg:pick(C.onBookButton||[])||null};
  if(/download|pdf|get|claim/.test(txt))return{state:'happy',msg:pick(C.onDownload||[])||'Downloading! 📥 Smart!'};
  if(/demo|trial|free|try/.test(txt))return{state:'flirty',msg:pick(C.onDemo||[])||'Smart! Try before you decide 😉'};
  if(/review|testimonial|rating|star/.test(txt+cls))return{state:'lovey',msg:'People LOVE this! Real results! 💛'};
  if(/error|failed|sorry|oops/.test(txt+cls))return{state:'worried',msg:'Oops! Don\'t worry, we\'ll sort it! 🤗'};
  if(/success|thank|confirmed|done|complete/.test(txt+cls))return{state:'triumphant',msg:'YESSS!! You did it!! 🎉'};
  return null;
}
