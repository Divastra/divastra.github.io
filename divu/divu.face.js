/* ── Face ── DOM refs, expression application, mouth lerp, pupils, blink */
import { X, EL, ER, SR, IR, PR, MT, L_OPEN, MX1, MX2, MQX, MBASE } from './divu.expressions.js';

export function getRefs(){return{
  lidL:document.getElementById('o-l-lid'),lidR:document.getElementById('o-r-lid'),
  llidL:document.getElementById('o-l-llid'),llidR:document.getElementById('o-r-llid'),
  browL:document.getElementById('o-brow-l'),browR:document.getElementById('o-brow-r'),
  mouth:document.getElementById('om'),mouthSh:document.getElementById('om-sh'),mouthO:document.getElementById('omo'),
  mouthQ:document.getElementById('om-quiver'),
  mouthCat:document.getElementById('om-cat'),mouthCatL:document.getElementById('om-cat-line'),mouthDot:document.getElementById('om-dot'),
  mouthPucker:document.getElementById('om-pucker'),
  dimpleL:document.getElementById('om-dimple-l'),dimpleR:document.getElementById('om-dimple-r'),
  sneerL:document.getElementById('om-sneer-l'),sneerR:document.getElementById('om-sneer-r'),
  puffL:document.getElementById('o-puff-l'),puffR:document.getElementById('o-puff-r'),
  teeth:document.getElementById('o-teeth'),tongue:document.getElementById('o-tongue'),
  ckL:document.getElementById('o-ck-l'),ckR:document.getElementById('o-ck-r'),
  lPupil:document.getElementById('o-l-pupil'),rPupil:document.getElementById('o-r-pupil'),
  lHi:document.getElementById('o-l-hi'),rHi:document.getElementById('o-r-hi'),
  lIris:document.getElementById('o-l-iris'),rIris:document.getElementById('o-r-iris'),
  lIrisOv:document.getElementById('o-l-irisOv'),rIrisOv:document.getElementById('o-r-irisOv'),
  tearL:document.getElementById('o-tear-l'),tearR:document.getElementById('o-tear-r'),
  sweat:document.getElementById('o-sweat'),symbol:document.getElementById('o-symbol'),
  svg:document.getElementById('divu-face'),
};}

export function applyExpr(name,refs,lerp){
  const e=X[name]||X.idle;
  refs.lidL.style.transform=`translateY(${e.ll}px)`;refs.lidR.style.transform=`translateY(${e.lr}px)`;
  refs.llidL.style.transform=`translateY(${e.lll!=null?e.lll:L_OPEN}px)`;refs.llidR.style.transform=`translateY(${e.lrl!=null?e.lrl:L_OPEN}px)`;
  refs.browL.style.transform=`translateY(${e.bly||0}px) rotate(${e.blr||0}deg)`;
  refs.browR.style.transform=`translateY(${e.bry||0}px) rotate(${e.brr||0}deg)`;
  if(refs.lIris)refs.lIris.setAttribute('fill',e.iris||'#7c3aed');
  if(refs.rIris)refs.rIris.setAttribute('fill',e.iris||'#7c3aed');
  const useCat=!!e.cat;const useDot=!!e.dot;
  if(refs.mouthCat)refs.mouthCat.setAttribute('opacity',useCat?'1':'0');
  if(refs.mouthCatL)refs.mouthCatL.setAttribute('opacity',useCat?'1':'0');
  if(refs.mouthDot)refs.mouthDot.setAttribute('opacity',useDot?'1':'0');
  lerp.setTarget(e.my,e.ck||0,!!e.oMouth,!!e.teeth,!!e.tongue,e.mqx||MQX,!!e.quiver,useCat||useDot);
  lerp.setAvert(e.avert||null);
  if(refs.sweat)refs.sweat.setAttribute('opacity',e.sweat?'1':'0');
  if(e.sweat&&refs.sweat)refs.sweat.classList.add('show');else if(refs.sweat)refs.sweat.classList.remove('show');
  if(refs.tearL&&refs.tearR){
    if(e.tears){refs.tearL.classList.add('cry');refs.tearR.classList.add('cry');}
    else{refs.tearL.classList.remove('cry');refs.tearR.classList.remove('cry');}
  }
  if(refs.mouthQ)refs.mouthQ.setAttribute('opacity',e.quiver?'1':'0');
}

export function makeLerp(refs){
  let mY=148,mYt=148,mX=MQX,mXt=MQX,ck=0,ckt=0,th=0,tht=0,tg=0,tgt=0,oMouth=false,quiver=false,avert=null;
  function setTarget(my,cheek,om,teeth,tongue,mqx,qv,altMouth){
    mYt=my;mXt=mqx||MQX;ckt=cheek||0;tht=teeth?1:0;tgt=tongue?1:0;oMouth=om;quiver=!!qv;
    const showCurve=!om&&!qv&&!altMouth;
    refs.mouth.style.opacity=showCurve?'1':'0';refs.mouthSh.style.opacity=showCurve?'1':'0';
    refs.mouthO.style.opacity=om?'1':'0';
  }
  function setAvert(dir){avert=dir;}function getAvert(){return avert;}
  function tick(){
    mY+=(mYt-mY)*.1;mX+=(mXt-mX)*.1;ck+=(ckt-ck)*.08;th+=(tht-th)*.1;tg+=(tgt-tg)*.1;
    if(!oMouth&&!quiver){const d=`M${MX1} ${MBASE} Q${mX.toFixed(2)} ${mY.toFixed(2)} ${MX2} ${MBASE}`;refs.mouth.setAttribute('d',d);refs.mouthSh.setAttribute('d',d);}
    if(refs.ckL)refs.ckL.setAttribute('opacity',ck.toFixed(4));if(refs.ckR)refs.ckR.setAttribute('opacity',ck.toFixed(4));
    refs.teeth.setAttribute('opacity',th.toFixed(4));refs.tongue.setAttribute('opacity',tg.toFixed(4));
  }
  return{setTarget,setAvert,getAvert,tick};
}

export function makePupils(refs,lerp){
  let lpx=EL.cx,lpy=EL.cy,rpx=ER.cx,rpy=ER.cy,tlx=EL.cx,tly=EL.cy,trx=ER.cx,try_=ER.cy,svgR=null;
  function setTarget(mx,my){
    const av=lerp.getAvert();
    if(av==='dl'){tlx=EL.cx-7;tly=EL.cy+6;trx=ER.cx-7;try_=ER.cy+6;return;}
    if(av==='dr'){tlx=EL.cx+7;tly=EL.cy+6;trx=ER.cx+7;try_=ER.cy+6;return;}
    if(av==='up'){tlx=EL.cx;tly=EL.cy-7;trx=ER.cx;try_=ER.cy-7;return;}
    if(!svgR)svgR=refs.svg.getBoundingClientRect();
    const sc=200/svgR.width,vx=(mx-svgR.left)*sc,vy=(my-svgR.top)*sc;
    for(const[eye,isL]of[[EL,true],[ER,false]]){
      const dx=vx-eye.cx,dy=vy-eye.cy,d=Math.hypot(dx,dy)||1,p=Math.min(1,d/72),nx=eye.cx+(dx/d)*MT*p,ny=eye.cy+(dy/d)*MT*p;
      if(isL){tlx=nx;tly=ny;}else{trx=nx;try_=ny;}
    }
  }
  function wander(){const a=Math.random()*Math.PI*2,r=Math.random()*MT*.6;tlx=EL.cx+Math.cos(a)*r;tly=EL.cy+Math.sin(a)*r;trx=ER.cx+Math.cos(a)*r;try_=ER.cy+Math.sin(a)*r;}
  function tick(){
    lpx+=(tlx-lpx)*.12;lpy+=(tly-lpy)*.12;rpx+=(trx-rpx)*.12;rpy+=(try_-rpy)*.12;
    refs.lPupil.setAttribute('cx',lpx.toFixed(2));refs.lPupil.setAttribute('cy',lpy.toFixed(2));
    refs.rPupil.setAttribute('cx',rpx.toFixed(2));refs.rPupil.setAttribute('cy',rpy.toFixed(2));
    refs.lHi.setAttribute('cx',(lpx+3.5).toFixed(2));refs.lHi.setAttribute('cy',(lpy-4.5).toFixed(2));
    refs.rHi.setAttribute('cx',(rpx+3.5).toFixed(2));refs.rHi.setAttribute('cy',(rpy-4.5).toFixed(2));
  }
  return{setTarget,wander,tick,resetRect:()=>{svgR=null;}};
}

export function makeBlink(refs,getState){
  let timer=null;
  function blink(){
    const e=X[getState()]||X.idle;
    refs.lidL.style.transition=refs.lidR.style.transition='transform .09s ease';
    refs.lidL.style.transform=refs.lidR.style.transform='translateY(0px)';
    setTimeout(()=>{
      refs.lidL.style.transition=refs.lidR.style.transition='transform .15s ease';
      refs.lidL.style.transform=`translateY(${e.ll}px)`;refs.lidR.style.transform=`translateY(${e.lr}px)`;
      setTimeout(()=>{refs.lidL.style.transition=refs.lidR.style.transition='';schedule();},220);
    },105);
  }
  function schedule(){clearTimeout(timer);const rapid=(X[getState()]||{}).rapidBlink;timer=setTimeout(blink,rapid?(550+Math.random()*550):(2500+Math.random()*3500));}
  return{start:schedule};
}
