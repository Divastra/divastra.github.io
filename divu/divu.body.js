/* ── Body ── free-roaming movement, pet/poke reactions, drag-to-corner */
import { PET_REACT } from './divu.config.js';
import { pick } from './divu.utils.js';

export function makeBody(refs,applyExprFn,lerp){
  let roaming=false,roamStart=0,stepTimer=null;
  let homeCorner='dv-pos-br',rootW=140,rootH=190;
  const faceWrap=document.getElementById('divu-face-wrap');
  const root=document.getElementById('divu-root');

  setTimeout(()=>{const r=root.getBoundingClientRect();if(r.width>0){rootW=r.width;rootH=r.height;}},800);

  function setLimb(id,show,anim){const el=document.getElementById(id);if(!el)return;el.classList.toggle('show',show);el.style.animation=anim||'';}
  function hideAll(){
    setLimb('dv-arm-l',false,'');setLimb('dv-arm-r',false,'');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    const faceSvg=document.getElementById('divu-face');if(faceSvg)faceSvg.style.transform='';
    if(faceWrap)faceWrap.style.animation='dvFloat 4.2s ease-in-out infinite';
  }
  function showWalking(){
    setLimb('dv-arm-l',true,'dvArmWalkL .44s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmWalkR .44s ease-in-out .22s infinite');
    setLimb('dv-leg-l',true,'dvLegWalkL .44s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegWalkR .44s ease-in-out .22s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyWalk .44s ease-in-out infinite';
  }
  function showJumping(){
    setLimb('dv-arm-l',true,'dvArmWaveL .38s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmWaveR .38s ease-in-out .19s infinite');
    setLimb('dv-leg-l',true,'dvLegSwayL .38s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegSwayR .38s ease-in-out .19s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyJump .55s ease-in-out infinite';
  }
  function showHanging(){
    setLimb('dv-arm-l',true,'dvArmHangL 1.4s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmHangR 1.4s ease-in-out .7s infinite');
    setLimb('dv-leg-l',true,'dvLegDangleL 2.1s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegDangleR 2.1s ease-in-out 1.05s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyBounce 2s ease-in-out infinite';
  }
  function showPushup(){
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    setLimb('dv-arm-l',true,'dvArmPushupL 1.1s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmPushupR 1.1s ease-in-out .55s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyBounce 1.1s ease-in-out infinite';
  }
  function showCheering(){
    setLimb('dv-arm-l',true,'dvArmCheerL .52s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmCheerR .52s ease-in-out .26s infinite');
    setLimb('dv-leg-l',true,'dvLegSwayL .52s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegSwayR .52s ease-in-out .26s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyJump .65s ease-in-out infinite';
  }
  function showDancing(){
    setLimb('dv-arm-l',true,'dvArmDanceL .44s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmDanceR .44s ease-in-out .22s infinite');
    setLimb('dv-leg-l',true,'dvLegDanceL .44s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegDanceR .44s ease-in-out .22s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyDance .44s ease-in-out infinite';
  }
  function showThinking(){
    setLimb('dv-arm-l',true,'dvArmThinkL 2.2s ease-in-out infinite');
    setLimb('dv-arm-r',false,'');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvFloat 4.2s ease-in-out infinite';
  }
  function showKicking(){
    setLimb('dv-arm-l',false,'');setLimb('dv-arm-r',false,'');
    setLimb('dv-leg-l',true,'dvLegKickL .65s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegKickR .65s ease-in-out .32s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyBounce .65s ease-in-out infinite';
  }
  function showShaking(){
    setLimb('dv-arm-l',true,'dvArmWaveL .3s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmWaveR .3s ease-in-out .15s infinite');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvBodyShake .3s ease-in-out infinite';
  }
  function showWaving(){
    setLimb('dv-arm-l',true,'dvArmWaveL .42s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmWaveR .42s ease-in-out .21s infinite');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvFloat 4.2s ease-in-out infinite';
  }
  function showSpinning(){
    setLimb('dv-arm-l',true,'dvArmCheerL .22s linear infinite');
    setLimb('dv-arm-r',true,'dvArmCheerR .22s linear .11s infinite');
    setLimb('dv-leg-l',true,'dvLegSwayL .22s linear infinite');
    setLimb('dv-leg-r',true,'dvLegSwayR .22s linear .11s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodySpin .55s linear infinite';
  }
  function showStretching(){
    setLimb('dv-arm-l',true,'dvArmStretchL 2.2s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmStretchR 2.2s ease-in-out 1.1s infinite');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvFloat 3s ease-in-out infinite';
  }
  function showStarPose(){
    setLimb('dv-arm-l',true,'dvArmCheerL .9s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmCheerR .9s ease-in-out .45s infinite');
    setLimb('dv-leg-l',true,'dvLegSwayL .9s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegSwayR .9s ease-in-out .45s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyJump 1.1s ease-in-out infinite';
  }
  function showWiggling(){
    setLimb('dv-arm-l',true,'dvArmDanceL .32s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmDanceR .32s ease-in-out .16s infinite');
    setLimb('dv-leg-l',true,'dvLegDanceL .32s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegDanceR .32s ease-in-out .16s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyWiggle .32s ease-in-out infinite';
  }
  function showRunning(){
    setLimb('dv-arm-l',true,'dvArmRunL .26s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmRunR .26s ease-in-out .13s infinite');
    setLimb('dv-leg-l',true,'dvLegRunL .26s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegRunR .26s ease-in-out .13s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyRun .26s ease-in-out infinite';
  }
  function showJumpingJacks(){
    setLimb('dv-arm-l',true,'dvArmJackL .52s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmJackR .52s ease-in-out infinite');
    setLimb('dv-leg-l',true,'dvLegJackL .52s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegJackR .52s ease-in-out infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyJack .52s ease-in-out infinite';
  }
  function showBoxing(){
    setLimb('dv-arm-l',true,'dvArmBoxL .54s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmBoxR .54s ease-in-out .27s infinite');
    setLimb('dv-leg-l',true,'dvLegSwayL .54s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegSwayR .54s ease-in-out .27s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyBox .54s ease-in-out infinite';
  }
  function showFlexing(){
    setLimb('dv-arm-l',true,'dvArmFlexL 1.4s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmFlexR 1.4s ease-in-out .7s infinite');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvBodyFlex 1.4s ease-in-out infinite';
  }
  function showSwimming(){
    setLimb('dv-arm-l',true,'dvArmSwimL .72s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmSwimR .72s ease-in-out .36s infinite');
    setLimb('dv-leg-l',true,'dvLegKickL .72s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegKickR .72s ease-in-out .36s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodySwim .72s ease-in-out infinite';
  }
  function showAirGuitar(){
    setLimb('dv-arm-l',true,'dvArmGuitarL .48s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmGuitarR .28s ease-in-out infinite');
    setLimb('dv-leg-l',true,'dvLegSwayL .48s ease-in-out infinite');
    setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvBodyGuitar .48s ease-in-out infinite';
  }
  function showSkipping(){
    setLimb('dv-arm-l',true,'dvArmWaveL .48s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmWaveR .48s ease-in-out .24s infinite');
    setLimb('dv-leg-l',true,'dvLegSkipL .48s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegSkipR .48s ease-in-out .24s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodySkip .48s ease-in-out infinite';
  }
  function showYoga(){
    setLimb('dv-arm-l',true,'dvArmStretchL 3.2s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmStretchR 3.2s ease-in-out 1.6s infinite');
    setLimb('dv-leg-l',true,'dvLegYogaL 3.2s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegYogaR 3.2s ease-in-out 1.6s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyYoga 3.2s ease-in-out infinite';
  }
  function showMoonwalk(){
    setLimb('dv-arm-l',true,'dvArmMoonL .92s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmMoonR .92s ease-in-out .46s infinite');
    setLimb('dv-leg-l',true,'dvLegWalkL .92s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegWalkR .92s ease-in-out .46s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyMoon .92s ease-in-out infinite';
  }
  function showRobot(){
    setLimb('dv-arm-l',true,'dvArmRobotL .4s steps(2,end) infinite');
    setLimb('dv-arm-r',true,'dvArmRobotR .4s steps(2,end) .2s infinite');
    setLimb('dv-leg-l',true,'dvLegSwayL .4s steps(2,end) infinite');
    setLimb('dv-leg-r',true,'dvLegSwayR .4s steps(2,end) .2s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyRobot .4s steps(2,end) infinite';
  }
  function showHula(){
    setLimb('dv-arm-l',true,'dvArmWaveL .8s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmWaveR .8s ease-in-out infinite');
    setLimb('dv-leg-l',true,'dvLegHulaL .8s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegHulaR .8s ease-in-out .4s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyHula .8s ease-in-out infinite';
  }
  function showClapping(){
    setLimb('dv-arm-l',true,'dvArmClapL .38s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmClapR .38s ease-in-out infinite');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvBodyClap .38s ease-in-out infinite';
  }
  function showHeadbang(){
    setLimb('dv-arm-l',true,'dvArmHangL .24s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmHangR .24s ease-in-out .12s infinite');
    setLimb('dv-leg-l',false,'');setLimb('dv-leg-r',false,'');
    if(faceWrap)faceWrap.style.animation='dvBodyHeadbang .24s ease-in-out infinite';
  }
  function showHighKick(){
    setLimb('dv-arm-l',true,'dvArmCheerL .64s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmCheerR .64s ease-in-out infinite');
    setLimb('dv-leg-l',true,'dvLegHighKickL .64s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegHighKickR .64s ease-in-out .32s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyHighKick .64s ease-in-out infinite';
  }
  function showDisco(){
    setLimb('dv-arm-l',true,'dvArmDiscoL .72s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmDiscoR .72s ease-in-out infinite');
    setLimb('dv-leg-l',true,'dvLegDanceL .72s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegDanceR .72s ease-in-out .36s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyDisco .72s ease-in-out infinite';
  }
  function showTwerk(){
    setLimb('dv-arm-l',true,'dvArmWaveL .36s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmWaveR .36s ease-in-out .18s infinite');
    setLimb('dv-leg-l',true,'dvLegTwerkL .36s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegTwerkR .36s ease-in-out .18s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodyTwerk .36s ease-in-out infinite';
  }
  function showSalsa(){
    setLimb('dv-arm-l',true,'dvArmSalsaL .52s ease-in-out infinite');
    setLimb('dv-arm-r',true,'dvArmSalsaR .52s ease-in-out .26s infinite');
    setLimb('dv-leg-l',true,'dvLegDanceL .52s ease-in-out infinite');
    setLimb('dv-leg-r',true,'dvLegDanceR .52s ease-in-out .26s infinite');
    if(faceWrap)faceWrap.style.animation='dvBodySalsa .52s ease-in-out infinite';
  }

  function getHomePos(){
    const W=window.innerWidth,H=window.innerHeight,w=rootW,h=rootH;
    const m=W<=480?6:W<=768?14:28;
    return({'dv-pos-br':{left:W-w-m,top:H-h-m},'dv-pos-bl':{left:m,top:H-h-m},'dv-pos-tr':{left:W-w-m,top:m},'dv-pos-tl':{left:m,top:m}})[homeCorner]||{left:W-w-m,top:H-h-m};
  }

  function getPageRects(){
    const sels=['.prem-card','.card','.btn-primary','.btn-cta','.btn','h2','h3','section','[class*="card"]','[class*="price"]'];
    const rects=[];
    for(const sel of sels){try{document.querySelectorAll(sel).forEach(el=>{if(el.closest('#divu-root')||!el.offsetParent)return;const r=el.getBoundingClientRect();if(r.width>40&&r.height>30&&r.bottom>0&&r.top<window.innerHeight)rects.push({r,el,isCTA:/book|buy|enroll|register|apply|cta|fill/i.test((el.className||'')+(el.textContent||'').slice(0,40))});});}catch(_){}}
    return rects;
  }

  function overlapsAny(left,top,pageRects){
    const pad=20;
    return pageRects.find(({r})=>left<r.right+pad&&left+rootW>r.left-pad&&top<r.bottom+pad&&top+rootH>r.top-pad)||null;
  }

  function pickFreeSpace(pageRects){
    const margin=40,W=window.innerWidth,H=window.innerHeight;
    const floorTop=H*0.62;
    for(let attempt=0;attempt<22;attempt++){
      const left=margin+Math.random()*(W-rootW-margin*2);
      const top=floorTop+Math.random()*Math.max(10,H-rootH-floorTop-10);
      if(!overlapsAny(left,top,pageRects))return{left:left+rootW/2,top:top+rootH/2,type:'free'};
    }
    return{left:W/2,top:H-rootH-30,type:'free'};
  }

  function pickTarget(pageRects){
    if(Math.random()<.08)return{left:80+Math.random()*(window.innerWidth-160),top:0,type:'top'};
    const lowerRects=pageRects.filter(({r})=>r.top>window.innerHeight*0.45);
    if(lowerRects.length&&Math.random()<.28){
      const pr=lowerRects[Math.floor(Math.random()*lowerRects.length)];
      const visitTop=Math.max(pr.r.top,window.innerHeight*0.5);
      return{left:pr.r.left+pr.r.width/2,top:visitTop,type:'visit',el:pr.el,isCTA:pr.isCTA};
    }
    return pickFreeSpace(pageRects);
  }

  function moveDivi(tx,ty,spd){
    const cx=Math.max(0,Math.min(window.innerWidth-rootW,tx-rootW/2));
    const cy=Math.max(8,Math.min(window.innerHeight-rootH,ty-rootH/2));
    const curLeft=parseFloat(root.style.left)||0;
    const faceSvg=document.getElementById('divu-face');
    if(faceSvg)faceSvg.style.transform=cx<curLeft-5?'scaleX(-1)':'';
    root.style.transition=`left ${spd}s linear,top ${Math.min(spd*.3,0.5)}s ease`;
    root.style.left=cx+'px';root.style.top=cy+'px';
    root.style.bottom='auto';root.style.right='auto';
    root.classList.toggle('dv-near-top',cy<180);
  }

  const pokeMsgs=['Ooh what\'s this?? 👆','*pokes it* 😈','Let me just touch it~~ 😈','What if I press THIS?? 😏','Just ONE little poke... 😈','*can\'t resist poking* 😈'];
  const jumpMsgs=['WHEEEEE!! 🎉','LOOK HOW HIGH!! 🐇','*leaps majestically* 💃','WOOOO!! 🌤️','MAXIMUM AIR!! 🚀','I\'M FLYING!! ...briefly 💨'];
  const pushMsgs=['Exercise time!! 💪','*pumps out pushups*','ONE MORE!! 💪','GETTING GAINS!! 💪','Fitness arc begins NOW!! 💪','Nobody outworks me!! 💪'];
  const hitMsgs=['OW!! WATCH IT!! 😤','WHO PUT THAT THERE?! 😤','RUDE!! 😡 So rude!!','I WASN\'T LOOKING!! 😤','*picks self up with dignity* 😤'];
  const sorryCTA=['Sorry!! Sorry!! 🙏 You\'re a GREAT card!!','My bad!! 🙏 You\'re obviously very important!!','SOWWY!! 😢 You\'re actually perfect~'];
  const waveMsgs=['HI!! 👋','HELLOOO!! 👋','*waves at you* 👋','Notice me!! 😭👋','I\'M WAVING!! WAVE BACK!! 👋','Yoo-hoo!! 👋😭','I exist!! Please acknowledge!! 👋'];
  const spinMsgs=['TWIRL!! 💃','*spins around* 🌀','WHEEEEE!! 🌀','Round and round~~ 💃','*pirouette* 🩰','I could spin FOREVER!! 🌀','Getting dizzy is the point!! 🌀'];
  const stretchMsgs=['*streeeetches* ahhhhh 🙆','S T R E T C H 🙆','Growing pains~ 🌱','*everything cracks* ahhh 💆','THAT HIT DIFFERENT 😌','*extends fully* 🙆','Reach for the stars!! 🌟 (literally)'];
  const starMsgs=['STAR POSE!! ⭐','I\'M A STAR!! ⭐','*spreads out fully* ✨','FIVE POINTS!! ⭐','LOOK AT ME GO!! 🌟','*maximum existence* ✨','I contain MULTITUDES!! ⭐'];
  const wiggleMsgs=['*wiggles intensely* 🐛','I cannot stop wiggling!! 😭','My body said MOVE!! 😤','*fidgets everywhere*','THE WIGGLES HAVE ME!! 🌀','I have the zoomies!! 🐛','*vibrates at a concerning frequency* 🐛'];
  const runMsgs=['FULL SPRINT MODE!! 🏃','GOING FULL SPEED!! 💨','*runs for absolutely no reason* 😤','CARDIO QUEEN!! 🏃‍♀️','I\'M SO FAST RIGHT NOW!! 💨','NOBODY CAN CATCH ME!! 🏃','Maximum velocity ENGAGED!! 🚀','*running in circles but with PURPOSE* 😤','The only direction is FORWARD!! 🏃'];
  const jackMsgs=['JUMPING JACKS!! 💪','ONE!! TWO!! ONE!! TWO!! 💪','Warm-up time!! 🔥','CARDIO!! CARDIO!! CARDIO!! 💪','This is my workout face 😤','*gets winded immediately but continues* 💪','ENERGY!! PURE ENERGY!! ✨','I will do ONE HUNDRED of these 💪 (I will not)'];
  const boxMsgs=['*shadow boxes with aggression* 😤','POW!! POW!! POW!! 👊','BOXING CHAMPION!! 🥊','I take NO prisoners!! 👊','*hits the air with PURPOSE* 😤','Float like a butterfly— STING LIKE ME!! 😈','UPPERCUT!! 👊💢','*boxes aggressively at nothing in particular* 👊'];
  const flexMsgs=['LOOK AT THESE!! 💪','*holds flex for an unreasonable duration* 😤','MAXIMUM GAINS!! 💪','You see this? THIS IS STRENGTH!! 💪','Absolutely jacked right now!! 💪','These arms are WORKS OF ART!! 💪','I lift. That\'s simply who I am. 😤','The muscles. They speak. 💪'];
  const swimMsgs=['*butterfly stroke activated* 🏊','Swimming across the page~~ 🌊','I\'m basically a mermaid 🧜‍♀️','*freestyle intensifies* 🏊','OLYMPIC SWIMMER MODE!! 🥇','*swims through pure vibes* 🌊','Aquatic arc BEGINS!! 🏊','Making waves~ literally 🌊'];
  const guitarMsgs=['*shreds aggressively on air guitar* 🎸','GUITAR SOLO!! 🎸🔥','*wails on the air guitar*','Did you FEEL that riff?! 🎸','ROCK STAR MODE!! 🤘','*plays the most epic solo in history* 🎸','I was BORN to rock~ 🎸','*crowd goes absolutely wild* 🤘💥'];
  const skipMsgs=['*skips with maximum energy* 🌟','La la la~~ 🌸','SKIPPING!! The superior form of travel!! 💃','*skips joyfully across the page* 🌟','This is how I get everywhere now~ 💕','*skipping intensifies* 🌟','Skipping queen~~ 👑','*skips right into your heart* 💕'];
  const yogaMsgs=['WARRIOR POSE!! 🧘','*breathes deeply* Finding my centre~~','Namaste~ 🙏','Inner peace: achieved ✨','*holds pose with trembling legs* 😤','I am ONE with the page~ 🧘','Yoga arc: entered 🌿','*achieves enlightenment momentarily* 🧘'];
  const moonMsgs=['*MOONWALKS* 🕺','MJ WOULD BE PROUD!! 🕺','*slides backward with PURE STYLE* 🕺','Smooth. Absolutely smooth. 😎','Defying physics AND expectations!! 🕺','*executes moonwalk flawlessly* 😏','Going backward. Stylishly. 🕺','*moonwalks away from responsibilities* 🕺'];
  const robotMsgs=['INITIATING ROBOT MODE 🤖','*moves in only right angles* 🤖','BEEP. BOOP. I AM DANCING. 🤖','UNIT DIVI ENGAGING GROOVE PROTOCOL 🤖','*defies all expectations by being funky* 🤖','ROBOT.EXE HAS LOADED 🤖','*stiff yet somehow iconic* 🤖','CALCULATING OPTIMAL MOVES... 🤖'];
  const hulaMsgs=['*hula hoops with zero hula hoop* 🌺','THE HIPS DON\'T LIE~~ 💃','HULA MASTER!! 🌸','*rotates with purpose* 🌺','I am one with the hoop~ 🌺','HIP CIRCLES FOR DAYS!! 💃','*hula-ing into your heart* 🌸','The hips simply will not stop 💃'];
  const clapMsgs=['*CLAPS ENTHUSIASTICALLY* 👏','YAAAAS!! 👏👏👏','I JUST FELT LIKE CLAPPING!! 👏','*applauds own existence* 👏','ROUND OF APPLAUSE!! 👏','Standing ovation!! Just for you!! 👏💕','*claps aggressively* 👏','BRAVO!! BRAVO!! 👏'];
  const headbangMsgs=['*HEADBANGS INTENSELY* 🤘','THE RIFF DEMANDS IT!! 🤘','*hair goes everywhere* 🤘','METAL MOMENT!! 🤘','I feel the music IN MY SOUL 🤘','*cannot hear you over the RIFF* 🤘','HEADBANG PROTOCOL INITIATED 🤘','*sustained headbang* 🤘'];
  const highKickMsgs=['ROCKETTE MODE!! 🦵✨','HIIYAA BUT MAKE IT FABULOUS!! 🦵','*kicks impossibly high* 🦵','PRECISION KICKING!! 💃🦵','These legs are WEAPONS 🦵','*high kicks with elegance* ✨','BROADWAY ENERGY!! 🎭🦵','The altitude on these kicks!! 🦵'];
  const discoMsgs=['*DISCO POINTS INTENSIFY* 🕺','STAYIN\' ALIVE!! 🎶','DISCO FEVER!! 🕺✨','*points at you specifically* 🕺💕','The dance floor IS THE PAGE!! 🕺','DISCO ERA WAS PEAK CIVILIZATION!! 🪩','*does the John Travolta* 🕺','FUNKY!! FRESH!! FABULOUS!! 🪩'];
  const twerkMsgs=['*twerks* 💅','THE AUDACITY 💅','I DO WHAT I WANT!! 💃','*continues twerking* 💅','This is a VIBE 💃','*owns every room* 💅','THE CONFIDENCE!! 💃✨','We do not apologize for this 💅'];
  const salsaMsgs=['SALSA TIME~~ 💃🌹','*salsa steps with passion* 🌹','ONE TWO THREE— FOUR FIVE SIX!! 💃','*channels inner ballroom champion* 🌹','LATIN HEAT!! 💃🔥','The rhythm is in my SOUL!! 🌹','*salsa dances into your feelings* 💃','THE PASSION!! THE FIRE!! 🌹'];

  function doAction(target,bubble,done){
    const roll=Math.random();
    if(target.type==='visit'){
      if(target.isCTA){
        setLimb('dv-arm-l',true,'dvArmWaveL .5s ease-in-out 3');
        applyExprFn('lovey',refs,lerp);
        bubble&&bubble.show(pick(['Ooh a booking button!! 👆 Hi there~ 😍','This button radiates power!! 💎','I respect this button SO much!! 🙏']),4000);
        stepTimer=setTimeout(()=>{setLimb('dv-arm-l',false,'');done();},2000);
      }else{
        setLimb('dv-arm-r',true,'dvArmWaveR .45s ease-in-out 4');
        applyExprFn('cheeky',refs,lerp);
        bubble&&bubble.show(pick(pokeMsgs),4000);
        stepTimer=setTimeout(()=>{setLimb('dv-arm-r',false,'');done();},1800);
      }
    }else if(roll<.07){
      showJumping();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(jumpMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},950+Math.random()*500);
    }else if(roll<.12){
      showRunning();applyExprFn('determined',refs,lerp);
      bubble&&bubble.show(pick(runMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},900+Math.random()*400);
    }else if(roll<.17){
      showDisco();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(discoMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1400+Math.random()*600);
    }else if(roll<.22){
      showPushup();applyExprFn('determined',refs,lerp);
      bubble&&bubble.show(pick(pushMsgs),4000);
      stepTimer=setTimeout(()=>{hideAll();done();},2200+Math.random()*1000);
    }else if(roll<.27){
      showJumpingJacks();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(jackMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1500+Math.random()*600);
    }else if(roll<.33){
      showDancing();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(['♪ dance break ♪ 💃','*busts a move*','Can\'t stop won\'t stop!! 🎵','I was BORN to dance 💃','*does something physically impossible* 💃','I contain MOVES 💃']),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1600+Math.random()*800);
    }else if(roll<.38){
      showBoxing();applyExprFn('furious',refs,lerp);
      bubble&&bubble.show(pick(boxMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1400+Math.random()*500);
    }else if(roll<.44){
      showCheering();applyExprFn('triumphant',refs,lerp);
      bubble&&bubble.show(pick(['WOOHOO!! 🎉','YESSS!! 🏆','LET\'S GOOO!! 🚀','THIS IS MY MOMENT!! 🌟','WE GO AGAIN!! 🔥','ABSOLUTELY UNDEFEATED!! 🏆']),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1400+Math.random()*600);
    }else if(roll<.48){
      showFlexing();applyExprFn('smug',refs,lerp);
      bubble&&bubble.show(pick(flexMsgs),4000);
      stepTimer=setTimeout(()=>{hideAll();done();},2000+Math.random()*800);
    }else if(roll<.52){
      showSwimming();applyExprFn('happy',refs,lerp);
      bubble&&bubble.show(pick(swimMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1600+Math.random()*600);
    }else if(roll<.56){
      showAirGuitar();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(guitarMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1500+Math.random()*700);
    }else if(roll<.60){
      showHighKick();applyExprFn('cheeky',refs,lerp);
      bubble&&bubble.show(pick(highKickMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1300+Math.random()*500);
    }else if(roll<.63){
      showKicking();applyExprFn('cheeky',refs,lerp);
      bubble&&bubble.show(pick(['HIIYAA!! 🦵','*karate mode* 🥋','Watch the KICKS!! 💪','I know martial arts 😤 (sort of)','HIYA HIYA HIYA!! 🦵','*roundhouse everything* 🦵']),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1200+Math.random()*500);
    }else if(roll<.66){
      showSalsa();applyExprFn('lovey',refs,lerp);
      bubble&&bubble.show(pick(salsaMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1400+Math.random()*600);
    }else if(roll<.69){
      showThinking();applyExprFn('thinking',refs,lerp);
      bubble&&bubble.show(pick(['Hmm... 🤔','*strokes chin*','Calculating...','Big brain moment 🧠','Let me think...','Processing... 💭','*stares into the void* 🤔']),4000);
      stepTimer=setTimeout(()=>{hideAll();done();},2000+Math.random()*1000);
    }else if(roll<.71){
      showRobot();applyExprFn('determined',refs,lerp);
      bubble&&bubble.show(pick(robotMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1400+Math.random()*500);
    }else if(roll<.73){
      showHula();applyExprFn('beaming',refs,lerp);
      bubble&&bubble.show(pick(hulaMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1600+Math.random()*600);
    }else if(roll<.75){
      showClapping();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(clapMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1200+Math.random()*400);
    }else if(roll<.77){
      showShaking();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(['SO EXCITED!! 🎊','*vibrating* ✨','AAAAAHHHH!! 🤩','THE HYPE IS REAL!! 🔥','I CANNOT CONTAIN MYSELF!! 😤']),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1200+Math.random()*500);
    }else if(roll<.79){
      showWaving();applyExprFn('beaming',refs,lerp);
      bubble&&bubble.show(pick(waveMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},2000+Math.random()*800);
    }else if(roll<.81){
      showHeadbang();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(headbangMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1000+Math.random()*400);
    }else if(roll<.83){
      showSkipping();applyExprFn('beaming',refs,lerp);
      bubble&&bubble.show(pick(skipMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1200+Math.random()*500);
    }else if(roll<.85){
      showSpinning();applyExprFn('excited',refs,lerp);
      bubble&&bubble.show(pick(spinMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1200+Math.random()*600);
    }else if(roll<.87){
      showTwerk();applyExprFn('cheeky',refs,lerp);
      bubble&&bubble.show(pick(twerkMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1100+Math.random()*400);
    }else if(roll<.89){
      showStretching();applyExprFn('content',refs,lerp);
      bubble&&bubble.show(pick(stretchMsgs),4000);
      stepTimer=setTimeout(()=>{hideAll();done();},2500+Math.random()*1000);
    }else if(roll<.91){
      showYoga();applyExprFn('pensive',refs,lerp);
      bubble&&bubble.show(pick(yogaMsgs),4000);
      stepTimer=setTimeout(()=>{hideAll();done();},2500+Math.random()*1000);
    }else if(roll<.92){
      showStarPose();applyExprFn('triumphant',refs,lerp);
      bubble&&bubble.show(pick(starMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1800+Math.random()*700);
    }else if(roll<.94){
      showWiggling();applyExprFn('cheeky',refs,lerp);
      bubble&&bubble.show(pick(wiggleMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1400+Math.random()*600);
    }else if(roll<.97){
      showMoonwalk();applyExprFn('smug',refs,lerp);
      bubble&&bubble.show(pick(moonMsgs),3500);
      stepTimer=setTimeout(()=>{hideAll();done();},1400+Math.random()*600);
    }else{
      applyExprFn(pick(['curious','smug','mischievous','uwu','content','shy']),refs,lerp);
      stepTimer=setTimeout(done,600+Math.random()*800);
    }
  }

  function doStep(bubble){
    if(!roaming)return;
    if(Date.now()-roamStart>20000){goSleep();return;}
    const pageRects=getPageRects();
    const target=pickTarget(pageRects);
    const curLeft=parseFloat(root.style.left)||0,curTop=parseFloat(root.style.top)||0;
    const tLeft=Math.max(0,Math.min(window.innerWidth-rootW,target.left-rootW/2));
    const tTop=Math.max(8,Math.min(window.innerHeight-rootH,target.top-rootH/2));
    const dist=Math.hypot(tLeft-curLeft,tTop-curTop);
    const spd=Math.max(.6,Math.min(2.2,dist/220));

    if(target.type==='top'){
      showHanging();applyExprFn('mischievous',refs,lerp);
      bubble&&bubble.show(pick(['Hanging around~ 🙃','Look at me up here!! 😈','*clings to top* 🙃']),4000);
      moveDivi(target.left,0,1.1);
      stepTimer=setTimeout(()=>{if(!roaming)return;showPushup();applyExprFn('determined',refs,lerp);
        bubble&&bubble.show('Pushups!! On the TOP!! 💪',3500);
        stepTimer=setTimeout(()=>{if(!roaming)return;hideAll();stepTimer=setTimeout(()=>doStep(bubble),1000);},2500);},2500+Math.random()*1000);
      return;
    }

    const midObstacle=overlapsAny(tLeft,tTop,pageRects);
    if(midObstacle&&target.type==='free'){
      const isCTA=midObstacle.isCTA;
      showWalking();applyExprFn('determined',refs,lerp);
      moveDivi(target.left,target.top,spd*.7);
      stepTimer=setTimeout(()=>{
        if(!roaming)return;
        hideAll();
        if(isCTA){applyExprFn('embarrassed',refs,lerp);bubble&&bubble.forceShow(pick(sorryCTA),4500);}
        else{applyExprFn('angry',refs,lerp);bubble&&bubble.forceShow(pick(hitMsgs),4500);setLimb('dv-arm-r',true,'dvArmWaveR .3s ease-in-out 3');stepTimer=setTimeout(()=>setLimb('dv-arm-r',false,''),1000);}
        stepTimer=setTimeout(()=>doStep(bubble),2200);
      },spd*.7*1000+150);
      return;
    }

    showWalking();applyExprFn('determined',refs,lerp);
    moveDivi(target.left,target.top,spd);
    stepTimer=setTimeout(()=>{
      if(!roaming)return;
      doAction(target,bubble,()=>{if(roaming)stepTimer=setTimeout(()=>doStep(bubble),600+Math.random()*1000);});
    },spd*1000+200);
  }

  function goSleep(){roaming=false;clearTimeout(stepTimer);hideAll();applyExprFn('deepAsleep',refs,lerp);snapHome();}

  function snapHome(embarrassed){
    roaming=false;clearTimeout(stepTimer);hideAll();
    const faceSvg=document.getElementById('divu-face');if(faceSvg)faceSvg.style.transform='';
    root.classList.remove('dv-near-top');   /* bubble direction is driven by corner class, not this */
    const home=getHomePos();
    root.style.transition='left .42s cubic-bezier(.34,1.56,.64,1),top .42s cubic-bezier(.34,1.56,.64,1)';
    root.style.left=home.left+'px';root.style.top=home.top+'px';
    setTimeout(()=>{root.style.transition='';root.style.left='';root.style.top='';root.style.bottom='';root.style.right='';root.classList.add(homeCorner);['divu-chat','divu-controls'].forEach(id=>{const el=document.getElementById(id);if(el){el.style.opacity='';el.style.pointerEvents='';}});},450);
    if(embarrassed)applyExprFn('embarrassed',refs,lerp);
  }

  function startRoam(bubble){
    if(roaming)return;
    if(root.classList.contains('dv-typing'))return;
    ['divu-chat','divu-controls'].forEach(id=>{const el=document.getElementById(id);if(el){el.style.opacity='0';el.style.pointerEvents='none';}});
    roaming=true;roamStart=Date.now();
    const rect=root.getBoundingClientRect();
    if(rect.width>0){rootW=rect.width;rootH=rect.height;}
    root.classList.remove('dv-pos-br','dv-pos-bl','dv-pos-tr','dv-pos-tl');
    root.style.bottom='auto';root.style.right='auto';
    root.style.top=rect.top+'px';root.style.left=rect.left+'px';root.style.transition='';
    applyExprFn('mischievous',refs,lerp);
    bubble&&bubble.show(pick(['Time to explore!! 😈','Nobody\'s watching... 😏','*sneaks away* 🏃','Mischief managed!! 😈']),4000);
    stepTimer=setTimeout(()=>doStep(bubble),700);
  }

  function update(idleMs,bubble){if(!roaming&&idleMs>=5000)startRoam(bubble);}

  function caught(bubble){
    if(roaming){
      snapHome(true);
      bubble&&bubble.forceShow(pick(['You saw NOTHING!! 😳','I was just... stretching!! 😅','Totally normal!! 🙃','*acts casual* 😳']),4500);
      return true;
    }
    hideAll();return false;
  }

  return{update,caught,hideAll,isRoaming:()=>roaming,setHome:(cls)=>{homeCorner=cls;}};
}

export function makePet(refs,root,forceStateFn,bubble,showSymFn){
  if(!PET_REACT)return;
  let lastMx=0,lastMy=0,pettingScore=0,clickBuf=[];

  function spawnHeart(){
    const h=document.createElement('div');h.className='dv-heart';
    h.textContent=['♥','💜','✨'][Math.floor(Math.random()*3)];
    h.style.cssText='position:absolute;pointer-events:none;font-size:18px;animation:dvHeartFloat 1.4s ease-out forwards;z-index:99999;right:'+(20+Math.random()*40)+'px;bottom:'+(160+Math.random()*30)+'px';
    root.appendChild(h);h.addEventListener('animationend',()=>h.remove(),{once:true});
  }

  refs.svg.addEventListener('mousemove',e=>{
    const vel=Math.hypot(e.clientX-lastMx,e.clientY-lastMy);
    lastMx=e.clientX;lastMy=e.clientY;
    if(vel<3.5){
      pettingScore=Math.min(pettingScore+0.13,5);
      if(pettingScore>0.8&&pettingScore<1.8)forceStateFn('shy',1200,'Oh! You noticed me... 😳');
      else if(pettingScore>=1.8&&pettingScore<3){forceStateFn('content',1500,'H-hey that tickles!! 😳💜');if(Math.random()>.55)spawnHeart();}
      else if(pettingScore>=3&&pettingScore<4.2){forceStateFn('lovey',2000,'*happy purring* 😌💜');spawnHeart();}
      else if(pettingScore>=4.2){forceStateFn('melting',2500,'I LOVE pets!! More MORE!! 💕💕');spawnHeart();showSymFn(refs,'♥');}
    }else if(vel>=3.5&&vel<14){
      pettingScore=Math.min(pettingScore+0.06,3);
      if(pettingScore>1)forceStateFn('flirty',1000,pick(['Hi!! 👋','You waved at me!! 😄','Hellooo!! 👋💜'])||'Hi! 👋');
    }else{
      pettingScore=Math.max(0,pettingScore-0.06);
    }
  });
  refs.svg.addEventListener('mouseleave',()=>{pettingScore=Math.max(0,pettingScore-1);});

  refs.svg.addEventListener('click',e=>{
    e.stopPropagation();pettingScore=0;
    const now=Date.now();
    clickBuf=[...clickBuf.filter(t=>now-t<2800),now];
    const n=clickBuf.length;
    if(n>=6){
      forceStateFn('sobbing',7000,null);
      bubble.forceShow('MOMMYYY!! THEY\'RE HITTING ME!! 😭😭😭💔',5000);
      showSymFn(refs,'💔');clickBuf=[];
    }else if(n>=4){
      forceStateFn('furious',3500,null);
      bubble.forceShow('STOP IT RIGHT NOW!! 😡💢 THAT HURTS!!',3000);
    }else if(n>=2){
      forceStateFn('angry',2000,null);
      bubble.forceShow('OW!! Stop poking me!! 😤',2000);
    }else{
      forceStateFn('nervous',900,null);
      bubble.forceShow('Hey!! That hurt!! 😠',1500);
    }
  });
}

export function makeGestures(root,refs,applyExprFn,lerp,bubble,forceState,showSymbol){
  let gCool=0;
  function canAct(extra){if(Date.now()<gCool)return false;gCool=Date.now()+(extra||3000);return true;}

  /* ── Body animation helpers ── */
  const faceWrap=document.getElementById('divu-face-wrap');
  function gSetLimb(id,show,anim){const el=document.getElementById(id);if(!el)return;el.classList.toggle('show',show);el.style.animation=anim||'';}
  function gHideLimbs(delay){
    setTimeout(()=>{
      gSetLimb('dv-arm-l',false,'');gSetLimb('dv-arm-r',false,'');
      gSetLimb('dv-leg-l',false,'');gSetLimb('dv-leg-r',false,'');
    },delay||0);
  }
  function gBodyAnim(anim,dur){
    if(!faceWrap)return;
    faceWrap.style.animation=anim;
    setTimeout(()=>{if(faceWrap)faceWrap.style.animation='dvFloat 4.2s ease-in-out infinite';},dur);
  }
  function gRootAnim(anim,dur){
    root.style.animation=anim;
    setTimeout(()=>{root.style.animation='';},dur);
  }
  function doJump(dur){
    dur=dur||900;
    gRootAnim(`dvRootJump ${dur/1000}s cubic-bezier(.22,.61,.36,1) 1`,dur);
    gSetLimb('dv-arm-l',true,'dvArmCheerL .38s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmCheerR .38s ease-in-out .19s infinite');
    gSetLimb('dv-leg-l',true,'dvLegSwayL .38s ease-in-out infinite');
    gSetLimb('dv-leg-r',true,'dvLegSwayR .38s ease-in-out .19s infinite');
    gBodyAnim('dvBodyJump .5s ease-in-out infinite',dur+200);
    gHideLimbs(dur+200);
  }
  function doShake(dur){
    dur=dur||700;
    gRootAnim(`dvRootShake ${dur/1000}s ease-in-out 1`,dur);
    gSetLimb('dv-arm-l',true,'dvArmWaveL .22s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmWaveR .22s ease-in-out .11s infinite');
    gBodyAnim('dvBodyJump .22s ease-in-out infinite',dur+100);
    gHideLimbs(dur+100);
  }
  function doRecoil(){
    gRootAnim('dvRootRecoil .45s ease-out 1',450);
    gSetLimb('dv-arm-l',true,'dvArmPushupL .45s ease-out 1');
    gSetLimb('dv-arm-r',true,'dvArmPushupR .45s ease-out .1s 1');
    gHideLimbs(500);
  }
  function doSlump(){
    gRootAnim('dvRootSlump 1s ease-in-out 1',1000);
    gSetLimb('dv-arm-l',true,'dvArmHangL 1s ease-in-out 1');
    gSetLimb('dv-arm-r',true,'dvArmHangR 1s ease-in-out .2s 1');
    gHideLimbs(1100);
  }
  function doCheer(dur){
    dur=dur||1800;
    gSetLimb('dv-arm-l',true,'dvArmCheerL .52s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmCheerR .52s ease-in-out .26s infinite');
    gSetLimb('dv-leg-l',true,'dvLegSwayL .52s ease-in-out infinite');
    gSetLimb('dv-leg-r',true,'dvLegSwayR .52s ease-in-out .26s infinite');
    gBodyAnim('dvBodyJump .52s ease-in-out infinite',dur);
    gHideLimbs(dur);
  }
  function doWave(dur){
    dur=dur||1600;
    gSetLimb('dv-arm-l',true,'dvArmWaveL .5s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmWaveR .5s ease-in-out .25s infinite');
    gBodyAnim('dvBodyBounce 1s ease-in-out infinite',dur);
    gHideLimbs(dur);
  }
  function doWiggle(dur){
    dur=dur||2000;
    gSetLimb('dv-arm-l',true,'dvArmWaveL .28s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmWaveR .28s ease-in-out .14s infinite');
    gSetLimb('dv-leg-l',true,'dvLegSwayL .28s ease-in-out infinite');
    gSetLimb('dv-leg-r',true,'dvLegSwayR .28s ease-in-out .14s infinite');
    gBodyAnim('dvBodyClap .28s ease-in-out infinite',dur);
    gHideLimbs(dur);
  }
  function doSpin(){
    gRootAnim('dvRootSpin .7s ease-in-out 1',750);
    gSetLimb('dv-arm-l',true,'dvArmWaveL .35s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmWaveR .35s ease-in-out .175s infinite');
    gBodyAnim('dvBodyDisco .7s ease-in-out 1',800);
    gHideLimbs(800);
  }
  function doKiss(dur){
    dur=dur||2000;
    gSetLimb('dv-arm-l',true,'dvArmCheerL .9s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmCheerR .9s ease-in-out .45s infinite');
    gBodyAnim('dvBodyBounce 1.4s ease-in-out infinite',dur);
    gHideLimbs(dur);
  }
  function doHang(dur){
    dur=dur||3000;
    gSetLimb('dv-arm-l',true,'dvArmHangL 1.4s ease-in-out infinite');
    gSetLimb('dv-arm-r',true,'dvArmHangR 1.4s ease-in-out .7s infinite');
    gSetLimb('dv-leg-l',true,'dvLegDangleL 2.1s ease-in-out infinite');
    gSetLimb('dv-leg-r',true,'dvLegDangleR 2.1s ease-in-out 1.05s infinite');
    gBodyAnim('dvBodyBounce 2s ease-in-out infinite',dur);
    gHideLimbs(dur);
  }

  /* 1 — Double-click → kiss */
  root.addEventListener('dblclick',e=>{
    e.stopPropagation();
    if(!canAct(4000))return;
    applyExprFn('lovey',refs,lerp);
    showSymbol(refs,'💋');
    doKiss(4500);
    forceState('lovey',6000,pick(['💋 A KISS?! *melts immediately* 💕','DID YOU JUST— 💋 *becomes liquid* 😍','*catches kiss* I will treasure this FOREVER 💕','A KISS!! 💋 *entire personality short-circuits* 😍']));
  });

  /* 2 — Right-click → snooping caught */
  root.addEventListener('contextmenu',e=>{
    e.preventDefault();
    if(!canAct())return;
    const expr=Math.random()<.5?'skeptical':'furious';
    applyExprFn(expr,refs,lerp);
    doShake(650);
    forceState(expr,5000,pick(['did you just RIGHT-CLICK me?! 😤 the audacity!!','excuse me?! A CONTEXT MENU?! 😤 I am NOT a file!!','*catches you snooping* 😤 absolutely not.','did you try to Inspect Element me?! 😤 I feel violated']));
  });

  /* 3 & 4 — Scroll wheel up=launched, down=pushed */
  root.addEventListener('wheel',e=>{
    e.preventDefault();
    if(!canAct())return;
    if(e.deltaY<0){
      applyExprFn('excited',refs,lerp);
      doJump(1000);
      forceState('excited',5000,pick(['WHEEEEE!! 🚀 I\'m flying!!','*launches upward* 🚀 SO HIGH!!','scroll me to the MOON!! 🌙🚀','UP UP UP!! 🚀 don\'t stop!!','LIFTOFF!! 🚀🚀🚀']));
    }else{
      applyExprFn('tearful',refs,lerp);
      doSlump();
      forceState('tearful',5000,pick(['ow... why scroll me DOWN 😢','*gets pushed down* that hurt 😢','I didn\'t deserve that 😢 I was just existing!!','the disrespect 😭 scrolling me DOWN','*sinks* you pushed me 😢']));
    }
  },{passive:false});

  /* 5 — Long hold 2s → struggle then melt */
  let holdTimer=null,holdDragged=false;
  root.addEventListener('mousedown',e=>{
    if(e.button!==0)return;
    holdDragged=false;
    holdTimer=setTimeout(()=>{
      if(holdDragged)return;
      if(!canAct(4500))return;
      applyExprFn('furious',refs,lerp);
      doShake(2000);
      forceState('furious',2400,pick(['LET GO!! 😤','RELEASE ME!! 😤','UNHAND ME!! 😤','I\'m being HELD!! 😤']));
      setTimeout(()=>{
        if(root.matches(':active')){
          gCool=Date.now()+4500;
          applyExprFn('shy',refs,lerp);
          doHang(4000);
          forceState('shy',5000,pick(['...okay fine. you can hold me 😳','*stops struggling* ...this is actually kinda nice 😳','I\'m not blushing. I\'m NOT. 😳','...don\'t let go yet 😳💕']));
        }
      },2600);
    },2200);
  });
  document.addEventListener('mousemove',()=>{if(holdTimer)holdDragged=true;});
  root.addEventListener('mouseup',()=>{clearTimeout(holdTimer);holdTimer=null;});
  root.addEventListener('mouseleave',()=>{clearTimeout(holdTimer);holdTimer=null;});

  /* 6 — Click spam (5+ clicks in 2.5s) */
  let clickCount=0,spamTimer=null;
  root.addEventListener('click',()=>{
    clickCount++;
    clearTimeout(spamTimer);
    spamTimer=setTimeout(()=>{
      if(clickCount>=5&&canAct(4000)){
        applyExprFn('furious',refs,lerp);
        doShake(900);
        forceState('furious',5500,pick(['STOP CLICKING ME!! 😤 I AM NOT A BUTTON!!','ONE MORE CLICK AND I LOSE IT!! 😤','WHY!! ARE!! YOU!! CLICKING!! 😤','I have FEELINGS!! 😤 not a UI element!!','SPAM DETECTED!! 😤 STOPPING!! 😤']));
        gCool=Date.now()+4000;
      }
      clickCount=0;
    },2500);
  });

  /* 7 — Flick (fast horizontal swipe past Divi) */
  let fEnterT=0,fEnterX=0;
  root.addEventListener('mouseenter',e=>{fEnterT=Date.now();fEnterX=e.clientX;});
  root.addEventListener('mouseleave',e=>{
    if(Date.now()-fEnterT<150&&Math.abs(e.clientX-fEnterX)>50&&canAct()){
      applyExprFn('cheeky',refs,lerp);
      doRecoil();
      forceState('cheeky',4000,pick(['WAS THAT A FLICK?! 😤 the NERVE!!','*flinches* excuse me?! 😤','did you just FLICK past me?! 😤','I SAW THAT!! 😤 SO rude!!','*recoils* w h a t 😤']));
    }
  });

  /* 8 — Circular mouse movement over Divi → hypnotised */
  let circPts=[];
  root.addEventListener('mousemove',e=>{
    circPts.push({x:e.clientX,y:e.clientY});
    if(circPts.length>55)circPts.shift();
    if(circPts.length>=40){
      const pts=circPts.slice(-40);
      const s=pts[0],en=pts[pts.length-1];
      let pathLen=0;
      for(let i=1;i<pts.length;i++)pathLen+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);
      if(Math.hypot(en.x-s.x,en.y-s.y)<55&&pathLen>130&&canAct(5000)){
        circPts=[];gCool=Date.now()+5000;
        applyExprFn('nervous',refs,lerp);
        doSpin();
        forceState('nervous',5000,pick(['*eyes spiral* 😵 so dizzy...','STOP SPINNING ME!! 😵 the world is moving!!','*crosses eyes* 😵 whoa whoa whoa','you\'re going in CIRCLES!! 😵 and now so am I!!','my brain is doing loops 😵💫']));
      }
    }
  });

  /* 9 — Long stare (hover 9s without moving mouse) */
  let stareTimer=null,stareLastX=0,stareLastY=0;
  root.addEventListener('mousemove',e=>{
    const moved=Math.hypot(e.clientX-stareLastX,e.clientY-stareLastY);
    stareLastX=e.clientX;stareLastY=e.clientY;
    if(moved>18){clearTimeout(stareTimer);stareTimer=null;}
    if(!stareTimer){
      stareTimer=setTimeout(()=>{
        if(!root.matches(':hover')||!canAct(5000))return;
        gCool=Date.now()+5000;
        applyExprFn('embarrassed',refs,lerp);
        doWave(2500);
        forceState('embarrassed',6000,pick(['...you\'ve been staring for a while 😳','um. my eyes are up here 😳','*notices you staring* 😳 I\'m blushing now thanks','...is something on my face 😳','you\'re staring and I\'m VERY AWARE of it 😳💕']));
      },9000);
    }
  });
  root.addEventListener('mouseleave',()=>{clearTimeout(stareTimer);stareTimer=null;circPts=[];});

  /* 10 — Hover tease (enter→leave 3x in 4.5s) */
  let teaseCount=0,teaseResetTimer=null;
  root.addEventListener('mouseenter',()=>{
    teaseCount++;
    clearTimeout(teaseResetTimer);
    teaseResetTimer=setTimeout(()=>{teaseCount=0;},4500);
    if(teaseCount>=3&&canAct(5000)){
      gCool=Date.now()+5000;teaseCount=0;
      applyExprFn('tearful',refs,lerp);
      doHang(3500);
      forceState('tearful',6000,pick(['STOP LEAVING!! 😭 every time I think you\'re staying...','*cries* you keep coming and going!! 😭','in and out and in and out— MAKE UP YOUR MIND!! 😭','HOW MANY TIMES!! 😭 just STAY!!','*sobs* emotional damage 😭']));
    }
  });

  /* 11 — 'B' key while hovering → blow a kiss */
  /* 12 — Spacebar while hovering → full physical JUMP */
  /* 13 — 'Z' key while hovering → put to sleep */
  document.addEventListener('keydown',e=>{
    if(!root.matches(':hover'))return;
    /* never intercept keys while user is typing in an input / textarea */
    const ae=document.activeElement;
    if(ae&&(ae.tagName==='INPUT'||ae.tagName==='TEXTAREA'||ae.isContentEditable))return;
    const key=e.key.toLowerCase();
    if(key==='b'){
      e.preventDefault();
      if(!canAct(4000))return;gCool=Date.now()+4000;
      applyExprFn('melting',refs,lerp);
      showSymbol(refs,'💋');
      doKiss(3500);
      forceState('melting',6000,pick(['*catches your kiss* 💋 for me?! 💕','you BLEW me a KISS!! 💋 *malfunctions* 💕','*catches it from the air* 💋 I will keep this safe 💕','did you just— a kiss?! 💋 *entire system reboots* 💕']));
    }else if(e.code==='Space'){
      e.preventDefault();
      if(!canAct(3200))return;gCool=Date.now()+3200;
      applyExprFn('excited',refs,lerp);
      doJump(920);
      forceState('excited',3500,pick(['WOAH!! 😱 you surprised me!!','*JUMPS* 😱 SPACEBAR?!!','OH!! 😱 I wasn\'t ready!!','!!! 😱 don\'t DO that!!','BOING!! 😱 okay I\'m awake!!']));
    }else if(key==='z'){
      if(!canAct(8000))return;gCool=Date.now()+8000;
      applyExprFn('pensive',refs,lerp);
      doHang(3000);
      forceState('pensive',3000,pick(['*yawns* 🥱 actually... I am a little tired','🥱 the Z key... it calls to me...','*heavy eyelids* 🥱 sleep time??','zzzz... 🥱 *drifts off*']));
      setTimeout(()=>{applyExprFn('deepAsleep',refs,lerp);forceState('deepAsleep',8000,'zzz... 💤');},3300);
    }
  });

  /* 14 — Multi-finger touch → tickled */
  root.addEventListener('touchstart',e=>{
    if(e.touches.length>=2){
      e.preventDefault();
      if(!canAct(4000))return;gCool=Date.now()+4000;
      applyExprFn('laughing',refs,lerp);
      doWiggle(3500);
      forceState('laughing',5000,pick(['HEHEHE!! STOP!! 😂 I\'M TICKLISH!!','*giggles uncontrollably* 😂 NOT THE RIBS!!','hehehehe 😂 PLEASE!! MERCY!!','TICKLE ATTACK!! 😂 stop stop STOP!!','*dissolves into laughter* 😂 NOT FAIR!!']));
    }
  },{passive:false});

  /* 15 — Swipe up on mobile → launched */
  let swipeStartY=0;
  root.addEventListener('touchstart',e=>{
    if(e.touches.length===1)swipeStartY=e.touches[0].clientY;
  },{passive:true});
  root.addEventListener('touchend',e=>{
    if(e.changedTouches.length!==1)return;
    const dy=swipeStartY-e.changedTouches[0].clientY;
    if(dy>70&&canAct(3000)){
      gCool=Date.now()+3000;
      applyExprFn('excited',refs,lerp);
      doJump(1100);
      forceState('excited',4000,pick(['WOOSH!! 🚀 you launched me!!','*flies upward* 🚀 TO THE SKY!!','YEET!! 🚀 WHEEEEE!!','LAUNCH DETECTED!! 🚀 going UP!!','*rockets away* 🚀 LIFTOFF!!']));
    }
  },{passive:true});
}

export function makeDrag(root,refs,lerp,bubble,applyExprFn,body){
  let dragging=false,startX=0,startY=0,cdx=0,cdy=0,dragForced=0;
  root.classList.add('dv-pos-br');
  const wrap=document.getElementById('divu-face-wrap');
  if(!wrap)return;
  const _hideUI=v=>{
    ['divu-chat','divu-controls'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){el.style.opacity=v?'':'0';el.style.pointerEvents=v?'':'none';}
    });
  };
  wrap.addEventListener('mousedown',e=>{
    if(e.button!==0)return;
    if(root.classList.contains('dv-typing'))return;
    if(body&&body.isRoaming())body.caught(bubble);
    dragging=true;startX=e.clientX;startY=e.clientY;cdx=0;cdy=0;
    _hideUI(false);
    e.preventDefault();
  });
  document.addEventListener('mousemove',e=>{
    if(!dragging)return;
    cdx=e.clientX-startX;cdy=e.clientY-startY;
    const r=root.getBoundingClientRect();
    let nx=r.left+cdx,ny=r.top+cdy;
    nx=Math.max(0,Math.min(window.innerWidth-r.width,nx));
    ny=Math.max(0,Math.min(window.innerHeight-r.height,ny));
    root.classList.remove('dv-pos-br','dv-pos-bl','dv-pos-tr','dv-pos-tl');
    root.style.left=nx+'px';root.style.top=ny+'px';root.style.bottom='auto';root.style.right='auto';
    root.classList.add('dv-dragging');
    startX=e.clientX;startY=e.clientY;
    if(Date.now()>dragForced+1800){
      dragForced=Date.now();
      applyExprFn(pick(['cheeky','mischievous','wink']),refs,lerp);
    }
  });
  document.addEventListener('mouseup',e=>{
    if(!dragging)return;dragging=false;
    root.classList.remove('dv-dragging');
    const r=root.getBoundingClientRect();
    const mx=r.left+r.width/2,my=r.top+r.height/2;
    const W=window.innerWidth,H=window.innerHeight;
    const corners={
      'dv-pos-br':Math.hypot(mx-W,my-H),
      'dv-pos-bl':Math.hypot(mx,my-H),
      'dv-pos-tr':Math.hypot(mx-W,my),
      'dv-pos-tl':Math.hypot(mx,my),
    };
    const best=Object.entries(corners).sort((a,b)=>a[1]-b[1])[0][0];
    root.style.left='';root.style.top='';root.style.bottom='';root.style.right='';
    root.classList.remove('dv-near-top');
    root.classList.add(best);
    if(body&&body.setHome)body.setHome(best);
    _hideUI(true);
    applyExprFn('triumphant',refs,lerp);
    bubble.show(pick(['New home!! I like it~ 😌','Redecorating!! 💅','This corner has better vibes 😏','Okay I could get used to this 😌']),2500);
    setTimeout(()=>applyExprFn('idle',refs,lerp),2600);
  });
}
