/* ─────────────────────────────────────────────────────────────────────────────
   orbi.js v3 — 3D sphere face · super-expressive edition
   <script src="orbi.js"></script> on any page. Self-contained, no deps.
───────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── Geometry ────────────────────────────────────────────────────────────── */
  const EL = { cx: 68, cy: 86 };
  const ER = { cx: 132, cy: 86 };
  const SR = 26;   // sclera radius
  const IR = 17;   // iris radius
  const PR = 10;   // pupil radius
  const MT = 8;    // max pupil travel
  const LR = 29;   // lid circle radius
  const U_OPEN   = -58;  // upper lid fully open
  const U_WIDE   = -60;  // surprised/wide
  const U_LOVEY  = -50;  // romantic half-lid
  const U_HALF   = -22;  // bored/squint
  const U_DROOPY = -28;  // sad droopy
  const U_SLEEPY = -10;  // almost closed
  const L_OPEN   =  58;  // lower lid fully open (pushed below clip)
  const MX1 = 60, MX2 = 140, MQX = 100, MBASE = 140;

  /* ── Expressions ─────────────────────────────────────────────────────────── */
  // ll/lr    = upper lid Y (left/right)    lll/lrl  = lower lid Y (left/right)
  // bly/bry  = brow Y shift                blr/brr  = brow rotation deg
  // my       = mouth control-point Y       ck       = cheek opacity
  // iris     = iris base colour            oMouth   = O-mouth
  // teeth    = show grin fill              tongue   = peeking tongue
  // tears    = animated tear drops         sweat    = sweat drop
  // avert    = pupil direction: 'dl' 'dr' 'up'
  // rapidBlink = quick blink cadence
  const X = {
    // ── Core ──────────────────────────────────────────────────────────────────
    idle:       { ll:U_OPEN,  lr:U_OPEN,  lll:L_OPEN, lrl:L_OPEN, bly:0,   bry:0,   blr:0,  brr:0,  my:148, ck:0 },
    curious:    { ll:U_WIDE,  lr:U_WIDE,  lll:L_OPEN, lrl:L_OPEN, bly:-8,  bry:0,   blr:-4, brr:0,  my:145, ck:0 },
    happy:      { ll:U_OPEN,  lr:U_OPEN,  lll:L_OPEN, lrl:L_OPEN, bly:-6,  bry:-6,  blr:0,  brr:0,  my:157, ck:.3 },
    excited:    { ll:U_WIDE,  lr:U_WIDE,  lll:L_OPEN, lrl:L_OPEN, bly:-12, bry:-12, blr:0,  brr:0,  my:166, ck:.58, teeth:true },
    sad:        { ll:U_DROOPY,lr:U_DROOPY,lll:L_OPEN, lrl:L_OPEN, bly:7,   bry:7,   blr:6,  brr:-6, my:124, ck:0 },
    surprised:  { ll:U_WIDE,  lr:U_WIDE,  lll:L_OPEN, lrl:L_OPEN, bly:-14, bry:-14, blr:0,  brr:0,  my:143, ck:0,  oMouth:true },
    bored:      { ll:U_HALF,  lr:U_HALF,  lll:46,     lrl:46,     bly:2,   bry:2,   blr:0,  brr:0,  my:143, ck:0 },
    sleepy:     { ll:U_SLEEPY,lr:U_SLEEPY,lll:32,     lrl:32,     bly:1,   bry:1,   blr:0,  brr:0,  my:145, ck:0 },
    skeptical:  { ll:U_HALF,  lr:U_OPEN,  lll:46,     lrl:L_OPEN, bly:-8,  bry:5,   blr:0,  brr:7,  my:147, ck:0 },
    lovey:      { ll:U_LOVEY, lr:U_LOVEY, lll:L_OPEN, lrl:L_OPEN, bly:-5,  bry:-5,  blr:0,  brr:0,  my:159, ck:.45, iris:'#ec4899' },
    worried:    { ll:U_OPEN,  lr:U_OPEN,  lll:L_OPEN, lrl:L_OPEN, bly:6,   bry:6,   blr:-7, brr:7,  my:130, ck:0,  sweat:true },
    proud:      { ll:-52,     lr:-52,     lll:L_OPEN, lrl:L_OPEN, bly:-4,  bry:-4,  blr:4,  brr:-4, my:154, ck:.12 },
    confused:   { ll:U_OPEN,  lr:U_OPEN,  lll:L_OPEN, lrl:L_OPEN, bly:-7,  bry:4,   blr:4,  brr:6,  my:138, ck:0 },
    thinking:   { ll:U_LOVEY, lr:U_LOVEY, lll:L_OPEN, lrl:L_OPEN, bly:-5,  bry:2,   blr:-4, brr:4,  my:148, ck:0 },
    // ── Expressive ────────────────────────────────────────────────────────────
    laughing:   { ll:U_WIDE,  lr:U_WIDE,  lll:20,     lrl:20,     bly:-9,  bry:-9,  blr:0,  brr:0,  my:168, ck:.68, teeth:true },
    beaming:    { ll:U_WIDE,  lr:U_WIDE,  lll:28,     lrl:28,     bly:-10, bry:-10, blr:0,  brr:0,  my:163, ck:.5,  teeth:true },
    melting:    { ll:-54,     lr:-54,     lll:24,     lrl:24,     bly:-7,  bry:-7,  blr:0,  brr:0,  my:170, ck:.72, iris:'#f472b6', teeth:true },
    triumphant: { ll:U_WIDE,  lr:U_WIDE,  lll:L_OPEN, lrl:L_OPEN, bly:-13, bry:-13, blr:3,  brr:-3, my:167, ck:.45, teeth:true, iris:'#f59e0b' },
    cheeky:     { ll:U_OPEN,  lr:U_OPEN,  lll:L_OPEN, lrl:L_OPEN, bly:-4,  bry:-7,  blr:3,  brr:-6, my:156, ck:.22, teeth:true, tongue:true },
    wink:       { ll:U_OPEN,  lr:0,       lll:L_OPEN, lrl:0,      bly:-4,  bry:4,   blr:0,  brr:3,  my:156, ck:.2 },
    flirty:     { ll:U_OPEN,  lr:-16,     lll:L_OPEN, lrl:L_OPEN, bly:-5,  bry:3,   blr:0,  brr:4,  my:156, ck:.25 },
    mischievous:{ ll:U_OPEN,  lr:-18,     lll:L_OPEN, lrl:44,     bly:-6,  bry:-10, blr:-4, brr:0,  my:154, ck:.14 },
    smug:       { ll:U_HALF,  lr:-54,     lll:46,     lrl:L_OPEN, bly:0,   bry:-5,  blr:3,  brr:-4, my:150, ck:0 },
    proud_big:  { ll:U_OPEN,  lr:U_OPEN,  lll:L_OPEN, lrl:L_OPEN, bly:-9,  bry:-9,  blr:3,  brr:-3, my:165, ck:.4,  teeth:true },
    // ── Dramatic ──────────────────────────────────────────────────────────────
    awestruck:  { ll:U_WIDE,  lr:U_WIDE,  lll:L_OPEN, lrl:L_OPEN, bly:-15, bry:-15, blr:0,  brr:0,  my:148, ck:0,  oMouth:true, iris:'#a5b4fc' },
    starstruck: { ll:U_WIDE,  lr:U_WIDE,  lll:L_OPEN, lrl:L_OPEN, bly:-13, bry:-13, blr:0,  brr:0,  my:162, ck:.38, iris:'#f59e0b' },
    pleading:   { ll:U_WIDE,  lr:U_WIDE,  lll:L_OPEN, lrl:L_OPEN, bly:6,   bry:6,   blr:-9, brr:9,  my:130, ck:.1 },
    tearful:    { ll:-24,     lr:-24,     lll:L_OPEN, lrl:L_OPEN, bly:8,   bry:8,   blr:7,  brr:-7, my:120, ck:0,  tears:true },
    angry:      { ll:-38,     lr:-38,     lll:L_OPEN, lrl:L_OPEN, bly:9,   bry:9,   blr:-9, brr:9,  my:124, ck:0,  iris:'#ef4444' },
    // ── Subtle ────────────────────────────────────────────────────────────────
    shy:        { ll:-44,     lr:-44,     lll:L_OPEN, lrl:L_OPEN, bly:0,   bry:0,   blr:0,  brr:0,  my:152, ck:.8,  avert:'dl' },
    embarrassed:{ ll:-44,     lr:-44,     lll:L_OPEN, lrl:L_OPEN, bly:0,   bry:0,   blr:0,  brr:0,  my:150, ck:.85, avert:'dr' },
    nervous:    { ll:-50,     lr:-50,     lll:L_OPEN, lrl:L_OPEN, bly:4,   bry:4,   blr:-4, brr:4,  my:140, ck:0,  sweat:true, rapidBlink:true },
    determined: { ll:-36,     lr:-36,     lll:48,     lrl:48,     bly:5,   bry:5,   blr:-6, brr:6,  my:144, ck:0 },
  };

  /* ── Comment pools ───────────────────────────────────────────────────────── */
  const C = {
    idle:        ['Just watching... 👀','Take your time!','I see you exploring!','Psst... the premium session is *chef\'s kiss* 🤫','No pressure. Just saying, those sessions up there are 🔥','Looking for something specific?','*taps foot patiently*'],
    curious:     ['Hmm, something caught your eye? 🤔','Ooh, tell me more!','I see you sneaking around up there...','What\'s pulling your attention?','You have the eye of a scholar 🧐','Interesting direction~'],
    happy:       ['Getting warmer! ✨','Oh! That looks promising!','I like where this is going 🔥','Now we\'re talking!','SO close...','You\'re on the right track! 🎯'],
    excited:     ['YES! Click it!! 🎉','DO IT DO IT DO IT!','Best. Decision. Ever. 💫','GO GO GO!! 🚀','That\'s THE one!!','THIS IS IT!!','PRABHAT SIR IS WAITING!! 🙌'],
    sad:         ['Nooooo come back... 🥺','I had such high hopes','So close, yet so far...','It was RIGHT THERE! 😭','My heart... it aches. 💔'],
    surprised:   ['WOAH!! 😱','Did NOT see that coming!','My eyes!! 👀','Unexpected. Respect.','YOU MOVE FAST!!','Blink and I missed it! 💨'],
    bored:       ['...tick tock...','Hello? Earth to cursor?','I\'ve seen glaciers move faster 🧊','Anytime now.','*yawns dramatically*'],
    sleepy:      ['So... sleepy... 💤','zzz...','Just five more minutes...','*snores gently*','...zz... hm? oh. hi.'],
    skeptical:   ['Make up your mind! 😤','Back and forth... again.','Pick a lane!','We doing this or not?','I\'ve been counting. This is the 3rd time.'],
    lovey:       ['Ooh, premium taste! 💛','The ₹5000 session?? EXCEPTIONAL!!','You have SPECTACULAR taste ✨','Prabhat sir will be thrilled!','THE best one. And you know it. 💎'],
    worried:     ['Please don\'t go... 🥺','You JUST got here!','Was it something I said?','Noooo wait!!','Come baaaack! 😭'],
    proud:       ['You scrolled ALL the way! 💪','Committed energy!','That\'s the spirit! 🔥','Explorer vibes! 🌍'],
    confused:    ['Where are you even going? 😵','Left? Right? Both?','Classic chaos energy 🌀','Random walk algorithm? 🎲','I give up trying to predict you.'],
    thinking:    ['Hmm... 🤔','Big brain moment 🧠','Taking it all in?','I\'ll wait... *taps chin*','Processing... please hold 💭'],
    laughing:    ['HAHAHA 😂','*can\'t stop laughing*','I can\'t even— 🤣','lmaoooo','THE ENERGY!! 😆'],
    beaming:     ['😄 YAAAY!','*happy explosion*','THIS IS THE BEST!!','I love this SO much!! 🌟','Pure joy!! Pure vibes!! 🎊'],
    melting:     ['I CAN\'T!! 🫠💖','*melts into a puddle*','TOO MUCH HAPPINESS!!','Peak joy achieved!! ✨','This moment > everything 🌸'],
    triumphant:  ['VICTORY!! 🏆','CHAMPION! 🎉','FLAWLESS!! ✨','GOOOOO!! 🚀','WE. DID. IT!! 💪'],
    cheeky:      ['Gotcha! 😜','*sticks tongue out*','Hehehe~','Can\'t catch me! 😝','Hehe~ 😏'],
    wink:        ['😉','Smooth. Very smooth.','*wink*','Between you and me... just book it 😏','I see you! 👀✨'],
    flirty:      ['Hey there~ 😉','Well HELLO!','Looking good, making great choices!','Someone knows what they want 😏'],
    mischievous: ['Ooh, I see what you\'re doing 😈','*suspicious grin*','Sneaky... I respect it 😏','Look at you scheming~','Nice move. 👀'],
    smug:        ['Obviously. 😏','As I predicted.','Told ya so! 😎','My instincts are never wrong.','You\'re welcome.'],
    proud_big:   ['LEGENDARY!! 🏆','You absolute LEGEND! 💪','THAT\'S MY HUMAN!! 🎉','NOTHING CAN STOP YOU NOW!! 🚀'],
    awestruck:   ['...woah 🌌','I\'m speechless.','How... HOW? ✨','Mind = blown 🤯','That\'s... incredible.'],
    starstruck:  ['Oh WOW!! ⭐','*jaw drops on the floor*','STARS IN MY EYES!! ✨','I\'m not worthy!! 🙇','LEGENDARY!!'],
    pleading:    ['Please please PLEASE... 🥺','*puppy eyes activated*','I\'m begging you! 🙏','Just this once? For me? 👉👈','PLEASE I believe in you!!'],
    tearful:     ['Please... 😢','*wipes a tear*','Come back... I\'ll miss you 🥺','Don\'t go... not like this.'],
    angry:       ['I\'m not angry. I\'m DISAPPOINTED. 😤','Oh. OH. We\'re doing THIS?','FINE!! 😠','*takes deep breath*','My brows are judging you.'],
    shy:         ['H-hey... 😳','Oh! You noticed me...','*hides slightly*','I\'m not blushing YOU\'RE blushing!'],
    embarrassed: ['Oh gosh... 😳','*looks away*','Please forget that happened 😅','*nervous laughter*'],
    nervous:     ['Okay okay okay... 😰','*sweating*','This is fine. Everything is fine. 🫠','Just breathe... right??'],
    determined:  ['FOCUS MODE: ON 💪','Zero hesitation. Respect. 🔥','Unstoppable! 🚀','That\'s the energy!!'],
  };

  /* ── CSS ─────────────────────────────────────────────────────────────────── */
  const CSS = `
#orbi-root{position:fixed;bottom:28px;right:28px;z-index:99998;display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none}
#orbi-face{pointer-events:auto;cursor:none;filter:drop-shadow(0 6px 28px rgba(30,20,80,.55)) drop-shadow(0 0 16px rgba(99,102,241,.22))}
#orbi-face-wrap{animation:orbiFloat 4.2s ease-in-out infinite}
@keyframes orbiFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
#orbi-bubble{position:absolute;bottom:calc(100% + 10px);right:0;background:rgba(8,8,22,.94);border:1px solid rgba(99,102,241,.5);border-radius:14px;padding:9px 14px;font-size:13px;font-family:system-ui,-apple-system,sans-serif;color:#e0e0ff;pointer-events:none;opacity:0;transform:scale(.85) translateY(10px);transform-origin:bottom right;transition:opacity .22s ease,transform .3s cubic-bezier(.34,1.56,.64,1);max-width:230px;line-height:1.45;z-index:99999;white-space:normal}
#orbi-bubble.show{opacity:1;transform:scale(1) translateY(0)}
#orbi-bubble::after{content:'';position:absolute;bottom:-7px;right:24px;width:12px;height:12px;background:rgba(8,8,22,.94);border-right:1px solid rgba(99,102,241,.5);border-bottom:1px solid rgba(99,102,241,.5);transform:rotate(45deg)}
#orbi-name{font-size:10px;font-family:ui-monospace,monospace;color:rgba(99,102,241,.55);letter-spacing:.14em;margin-top:4px}
.ob-lid{transition:transform .32s cubic-bezier(.34,1.56,.64,1)}
.ob-brow{transition:transform .38s cubic-bezier(.34,1.56,.64,1);transform-box:fill-box;transform-origin:center}
.ob-cheek{transition:opacity .5s ease}
#o-l-iris,#o-r-iris{transition:fill .55s ease}
#om,#om-sh{transition:opacity .28s ease}
#omo{transition:opacity .28s ease}
#o-teeth,#o-tongue{transition:opacity .3s ease}
#o-sweat{transition:opacity .4s ease}
.ob-tear{transform-box:fill-box;transform-origin:center top}
@keyframes tearFall{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(46px);opacity:0}}
.ob-tear.cry{animation:tearFall 1.3s ease-in infinite}
.ob-tear.cry.ob-delay{animation-delay:.65s}
@keyframes sweatBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
#o-sweat.show{animation:sweatBounce .95s ease-in-out infinite}
#o-symbol{transform-box:fill-box;transform-origin:center bottom}
@keyframes symPop{0%{opacity:0;transform:scale(.3) translateY(12px)}14%{opacity:1;transform:scale(1.2) translateY(-3px)}25%,78%{opacity:1;transform:scale(1) translateY(0)}100%{opacity:0;transform:scale(.85) translateY(-14px)}}
#o-symbol.pop{animation:symPop 2.6s ease forwards}
`;

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  const NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, cls) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    if (cls) e.setAttribute('class', cls);
    return e;
  }

  function stop(el, offset, color, opacity) {
    const s = svgEl('stop', { offset });
    s.setAttribute('stop-color', color);
    if (opacity != null) s.setAttribute('stop-opacity', String(opacity));
    el.appendChild(s);
  }

  function showSymbol(refs, char) {
    const el = refs.symbol;
    el.textContent = char;
    el.classList.remove('pop');
    void el.getBoundingClientRect();
    el.classList.add('pop');
    el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
  }

  /* ── Build SVG face ──────────────────────────────────────────────────────── */
  function buildFace() {
    const svg = svgEl('svg', { id:'orbi-face', width:180, height:180, viewBox:'0 0 200 200', overflow:'visible' });
    const defs = svgEl('defs', {});

    /* Clip paths */
    for (const [s, eye] of [['l', EL], ['r', ER]]) {
      const cp = svgEl('clipPath', { id:`ocl-${s}` });
      cp.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy, r:SR+2 }));
      defs.appendChild(cp);
    }

    /* ── Gradients ── */

    /* Head sphere: lit top-left → dark bottom-right (userSpaceOnUse so lids match) */
    const gHead = svgEl('radialGradient', { id:'og-h', cx:72, cy:52, r:140, gradientUnits:'userSpaceOnUse' });
    stop(gHead, '0%',  '#1e1e58');
    stop(gHead, '40%', '#0d0d20');
    stop(gHead, '100%','#030310');
    defs.appendChild(gHead);

    /* Specular highlight: bright spot at top-left of sphere */
    const gSpec = svgEl('radialGradient', { id:'og-sp', cx:'30%', cy:'20%', r:'42%' });
    stop(gSpec, '0%',  'rgba(165,175,255,0.32)');
    stop(gSpec, '55%', 'rgba(99,102,241,0.06)');
    stop(gSpec, '100%','rgba(0,0,0,0)');
    defs.appendChild(gSpec);

    /* Bottom ambient occlusion: subtle dark at base of sphere */
    const gAO = svgEl('radialGradient', { id:'og-ao', cx:'50%', cy:'88%', r:'52%' });
    stop(gAO, '0%',  'rgba(0,0,10,0.38)');
    stop(gAO, '100%','rgba(0,0,0,0)');
    defs.appendChild(gAO);

    /* Rim gradient: linear top-left bright → bottom-right dim */
    const gRim = svgEl('linearGradient', { id:'og-rim', x1:'0%', y1:'0%', x2:'100%', y2:'100%' });
    stop(gRim, '0%',  '#a5b4fc', 0.9);
    stop(gRim, '45%', '#6366f1', 0.65);
    stop(gRim, '100%','#3730a3', 0.28);
    defs.appendChild(gRim);

    /* Sclera: soft blue-white gradient for depth */
    const gScl = svgEl('radialGradient', { id:'og-sc', cx:'38%', cy:'32%', r:'62%' });
    stop(gScl, '0%',  '#ffffff');
    stop(gScl, '100%','#d5d8f2');
    defs.appendChild(gScl);

    /* Iris depth overlay: light sheen top-left, dark edge */
    const gIrisD = svgEl('radialGradient', { id:'og-id', cx:'32%', cy:'27%', r:'60%' });
    stop(gIrisD, '0%',  'rgba(255,255,255,0.3)');
    stop(gIrisD, '42%', 'rgba(255,255,255,0.04)');
    stop(gIrisD, '100%','rgba(0,0,22,0.34)');
    defs.appendChild(gIrisD);

    /* Pupil depth */
    const gPup = svgEl('radialGradient', { id:'og-pu', cx:'33%', cy:'28%', r:'62%' });
    stop(gPup, '0%',  '#18183a');
    stop(gPup, '100%','#000008');
    defs.appendChild(gPup);

    /* Eye socket blur filter */
    const fSock = svgEl('filter', { id:'f-sk', x:'-45%', y:'-45%', width:'190%', height:'190%' });
    fSock.appendChild(svgEl('feGaussianBlur', { stdDeviation:'2.6' }));
    defs.appendChild(fSock);

    svg.appendChild(defs);

    /* ── Head ── */
    /* Outer ambient glow */
    svg.appendChild(svgEl('circle', { cx:100, cy:100, r:97, fill:'none', stroke:'rgba(99,102,241,0.12)', 'stroke-width':16 }));
    /* Sphere base (3D gradient) */
    svg.appendChild(svgEl('circle', { cx:100, cy:100, r:92, fill:'url(#og-h)' }));
    /* Specular sheen */
    svg.appendChild(svgEl('circle', { cx:100, cy:100, r:92, fill:'url(#og-sp)' }));
    /* Ambient occlusion (bottom shadow) */
    svg.appendChild(svgEl('circle', { cx:100, cy:100, r:92, fill:'url(#og-ao)' }));
    /* Rim light border */
    svg.appendChild(svgEl('circle', { cx:100, cy:100, r:92, fill:'none', stroke:'url(#og-rim)', 'stroke-width':2 }));
    /* Subtle inner ring */
    svg.appendChild(svgEl('circle', { cx:100, cy:100, r:77, fill:'none', stroke:'rgba(139,92,246,0.09)', 'stroke-width':1 }));

    /* ── Eyes ── */
    for (const [s, eye] of [['l', EL], ['r', ER]]) {
      /* Socket shadow: soft dark ring makes eyes look inset into sphere */
      svg.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy+2, r:SR+7, fill:'rgba(0,0,14,0.52)', filter:'url(#f-sk)' }));

      /* Sclera */
      svg.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy, r:SR, fill:'url(#og-sc)' }));

      /* Iris + pupils (clipped to sclera) */
      const iG = svgEl('g', { 'clip-path':`url(#ocl-${s})` });
      /* Base iris — flat colour, changed by JS */
      iG.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy, r:IR, fill:'#6366f1', id:`o-${s}-iris` }));
      /* Iris depth overlay — constant gradient for 3D sheen */
      iG.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy, r:IR, fill:'url(#og-id)' }));
      /* Pupil */
      iG.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy, r:PR, fill:'url(#og-pu)', id:`o-${s}-pupil` }));
      /* Main specular highlight */
      iG.appendChild(svgEl('circle', { cx:eye.cx+4, cy:eye.cy-5, r:3.8, fill:'white', opacity:'.9', id:`o-${s}-hi` }));
      /* Secondary micro-highlight */
      iG.appendChild(svgEl('circle', { cx:eye.cx-3.5, cy:eye.cy+4, r:1.5, fill:'white', opacity:'.38' }));
      svg.appendChild(iG);

      /* Upper eyelid — uses head gradient so it blends seamlessly */
      const lidG = svgEl('g', { id:`o-${s}-lid`, 'clip-path':`url(#ocl-${s})` }, 'ob-lid');
      lidG.style.transform = `translateY(${U_OPEN}px)`;
      lidG.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy, r:LR, fill:'url(#og-h)' }));
      /* Lid crease shadow for thickness illusion */
      lidG.appendChild(svgEl('ellipse', { cx:eye.cx, cy:eye.cy+LR-3.5, rx:LR*.9, ry:3.8, fill:'rgba(0,0,22,0.46)' }));
      svg.appendChild(lidG);

      /* Lower eyelid */
      const llidG = svgEl('g', { id:`o-${s}-llid`, 'clip-path':`url(#ocl-${s})` }, 'ob-lid');
      llidG.style.transform = `translateY(${L_OPEN}px)`;
      llidG.appendChild(svgEl('circle', { cx:eye.cx, cy:eye.cy, r:LR, fill:'url(#og-h)' }));
      svg.appendChild(llidG);
    }

    /* ── Eyebrows ── */
    for (const [s, x1, cpx, x2] of [['l',40,68,96],['r',104,132,160]]) {
      const g = svgEl('g', { id:`o-brow-${s}` }, 'ob-brow');
      /* Drop shadow path for depth */
      g.appendChild(svgEl('path', { d:`M${x1} 58 Q${cpx} 50 ${x2} 58`, fill:'none', stroke:'rgba(0,0,22,0.5)', 'stroke-width':7, 'stroke-linecap':'round' }));
      /* Main brow */
      g.appendChild(svgEl('path', { d:`M${x1} 56 Q${cpx} 48 ${x2} 56`, fill:'none', stroke:'#c7d2fe', 'stroke-width':4, 'stroke-linecap':'round' }));
      svg.appendChild(g);
    }

    /* ── Mouth ── */
    /* Shadow path (slightly below, wider — gives lip depth) */
    svg.appendChild(svgEl('path', { id:'om-sh', d:`M${MX1} ${MBASE} Q${MQX} 148 ${MX2} ${MBASE}`, fill:'none', stroke:'rgba(0,0,20,0.5)', 'stroke-width':6.5, 'stroke-linecap':'round' }));
    /* Main mouth curve */
    svg.appendChild(svgEl('path', { id:'om', d:`M${MX1} ${MBASE} Q${MQX} 148 ${MX2} ${MBASE}`, fill:'none', stroke:'white', 'stroke-width':3.5, 'stroke-linecap':'round' }));
    /* O-mouth (surprised) — filled dark to show depth */
    svg.appendChild(svgEl('ellipse', { id:'omo', cx:100, cy:140, rx:11, ry:13, fill:'#040410', stroke:'white', 'stroke-width':2.5, opacity:0 }));
    /* Teeth/grin fill */
    svg.appendChild(svgEl('path', { id:'o-teeth', d:'M72 148 Q100 149 128 148 L128 154 Q100 158 72 154 Z', fill:'white', opacity:0 }));
    /* Tongue for playful expressions */
    svg.appendChild(svgEl('ellipse', { id:'o-tongue', cx:100, cy:156, rx:9, ry:6, fill:'#f9a8d4', opacity:0 }));

    /* ── Cheeks ── */
    for (const [s, cx] of [['l',42],['r',158]]) {
      svg.appendChild(svgEl('ellipse', { id:`o-ck-${s}`, cx, cy:114, rx:17, ry:9, fill:'#f472b6', opacity:0 }, 'ob-cheek'));
    }

    /* ── Effects ── */
    for (const [s, cx, extra] of [['l', EL.cx, ''],['r', ER.cx, ' ob-delay']]) {
      const t = svgEl('ellipse', { id:`o-tear-${s}`, cx, cy:EL.cy+SR-1, rx:3.5, ry:5.5, fill:'#93c5fd' });
      t.setAttribute('class', `ob-tear${extra}`);
      svg.appendChild(t);
    }
    svg.appendChild(svgEl('path', { id:'o-sweat', d:'M168 62 Q162 48 158 62 A6 8 0 0 0 174 62 Z', fill:'#93c5fd', opacity:0 }));
    const sym = svgEl('text', { id:'o-symbol', x:152, y:42, 'text-anchor':'middle', fill:'white', 'font-size':'26', 'font-family':'system-ui,sans-serif', opacity:0 });
    svg.appendChild(sym);

    return svg;
  }

  /* ── DOM refs ────────────────────────────────────────────────────────────── */
  function getRefs() {
    return {
      lidL:   document.getElementById('o-l-lid'),
      lidR:   document.getElementById('o-r-lid'),
      llidL:  document.getElementById('o-l-llid'),
      llidR:  document.getElementById('o-r-llid'),
      browL:  document.getElementById('o-brow-l'),
      browR:  document.getElementById('o-brow-r'),
      mouth:  document.getElementById('om'),
      mouthSh:document.getElementById('om-sh'),
      mouthO: document.getElementById('omo'),
      teeth:  document.getElementById('o-teeth'),
      tongue: document.getElementById('o-tongue'),
      ckL:    document.getElementById('o-ck-l'),
      ckR:    document.getElementById('o-ck-r'),
      lPupil: document.getElementById('o-l-pupil'),
      rPupil: document.getElementById('o-r-pupil'),
      lHi:    document.getElementById('o-l-hi'),
      rHi:    document.getElementById('o-r-hi'),
      lIris:  document.getElementById('o-l-iris'),
      rIris:  document.getElementById('o-r-iris'),
      tearL:  document.getElementById('o-tear-l'),
      tearR:  document.getElementById('o-tear-r'),
      sweat:  document.getElementById('o-sweat'),
      symbol: document.getElementById('o-symbol'),
      svg:    document.getElementById('orbi-face'),
    };
  }

  /* ── Apply expression ────────────────────────────────────────────────────── */
  function applyExpr(name, refs, lerp) {
    const e = X[name] || X.idle;
    refs.lidL.style.transform  = `translateY(${e.ll}px)`;
    refs.lidR.style.transform  = `translateY(${e.lr}px)`;
    refs.llidL.style.transform = `translateY(${e.lll != null ? e.lll : L_OPEN}px)`;
    refs.llidR.style.transform = `translateY(${e.lrl != null ? e.lrl : L_OPEN}px)`;
    refs.browL.style.transform = `translateY(${e.bly}px) rotate(${e.blr}deg)`;
    refs.browR.style.transform = `translateY(${e.bry}px) rotate(${e.brr}deg)`;
    const ic = e.iris || '#6366f1';
    refs.lIris.style.fill = ic;
    refs.rIris.style.fill = ic;
    refs.tearL.classList.toggle('cry', !!e.tears);
    refs.tearR.classList.toggle('cry', !!e.tears);
    refs.sweat.classList.toggle('show', !!e.sweat);
    lerp.setTarget(e.my, e.ck || 0, !!e.oMouth, !!e.teeth, !!e.tongue);
    lerp.setAvert(e.avert || null);
  }

  /* ── Lerp (mouth, cheeks, teeth, tongue — rAF-driven) ────────────────────── */
  function makeLerp(refs) {
    let mY = 148, mYt = 148;
    let ck = 0, ckt = 0;
    let th = 0, tht = 0;
    let tg = 0, tgt = 0;
    let oMouth = false, avert = null;

    function setTarget(my, cheek, om, teeth, tongue) {
      mYt = my; ckt = cheek; tht = teeth ? 1 : 0; tgt = tongue ? 1 : 0;
      oMouth = om;
      const mo = om ? '0' : '1';
      refs.mouth.style.opacity   = mo;
      refs.mouthSh.style.opacity = mo;
      refs.mouthO.style.opacity  = om ? '1' : '0';
    }

    function setAvert(dir) { avert = dir; }
    function getAvert()    { return avert; }

    function tick() {
      mY += (mYt - mY) * .1;
      ck += (ckt - ck) * .08;
      th += (tht - th) * .1;
      tg += (tgt - tg) * .1;
      if (!oMouth) {
        const d = `M${MX1} ${MBASE} Q${MQX} ${mY.toFixed(2)} ${MX2} ${MBASE}`;
        refs.mouth.setAttribute('d', d);
        refs.mouthSh.setAttribute('d', d);
      }
      refs.ckL.setAttribute('opacity', ck.toFixed(4));
      refs.ckR.setAttribute('opacity', ck.toFixed(4));
      refs.teeth.setAttribute('opacity', th.toFixed(4));
      refs.tongue.setAttribute('opacity', tg.toFixed(4));
    }

    return { setTarget, setAvert, getAvert, tick };
  }

  /* ── Pupil tracker ───────────────────────────────────────────────────────── */
  function makePupils(refs, lerp) {
    let lpx = EL.cx, lpy = EL.cy, rpx = ER.cx, rpy = ER.cy;
    let tlx = EL.cx, tly = EL.cy, trx = ER.cx, try_ = ER.cy;
    let svgR = null;

    function setTarget(mx, my) {
      const av = lerp.getAvert();
      if (av === 'dl') { tlx = EL.cx-7; tly = EL.cy+6; trx = ER.cx-7; try_ = ER.cy+6; return; }
      if (av === 'dr') { tlx = EL.cx+7; tly = EL.cy+6; trx = ER.cx+7; try_ = ER.cy+6; return; }
      if (av === 'up') { tlx = EL.cx;   tly = EL.cy-7; trx = ER.cx;   try_ = ER.cy-7; return; }
      if (!svgR) svgR = refs.svg.getBoundingClientRect();
      const sc = 200 / svgR.width;
      const vx = (mx - svgR.left) * sc;
      const vy = (my - svgR.top)  * sc;
      for (const [eye, isL] of [[EL, true], [ER, false]]) {
        const dx = vx - eye.cx, dy = vy - eye.cy;
        const d  = Math.hypot(dx, dy) || 1;
        const pull = Math.min(1, d / 72);
        const nx = eye.cx + (dx / d) * MT * pull;
        const ny = eye.cy + (dy / d) * MT * pull;
        if (isL) { tlx = nx; tly = ny; } else { trx = nx; try_ = ny; }
      }
    }

    function wander() {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * MT * .6;
      tlx = EL.cx + Math.cos(a) * r; tly = EL.cy + Math.sin(a) * r;
      trx = ER.cx + Math.cos(a) * r; try_ = ER.cy + Math.sin(a) * r;
    }

    function tick() {
      lpx += (tlx - lpx) * .12; lpy += (tly - lpy) * .12;
      rpx += (trx - rpx) * .12; rpy += (try_ - rpy) * .12;
      refs.lPupil.setAttribute('cx', lpx.toFixed(2));
      refs.lPupil.setAttribute('cy', lpy.toFixed(2));
      refs.rPupil.setAttribute('cx', rpx.toFixed(2));
      refs.rPupil.setAttribute('cy', rpy.toFixed(2));
      refs.lHi.setAttribute('cx', (lpx + 3.5).toFixed(2));
      refs.lHi.setAttribute('cy', (lpy - 4.5).toFixed(2));
      refs.rHi.setAttribute('cx', (rpx + 3.5).toFixed(2));
      refs.rHi.setAttribute('cy', (rpy - 4.5).toFixed(2));
    }

    return { setTarget, wander, tick, resetRect: () => { svgR = null; } };
  }

  /* ── Blink ───────────────────────────────────────────────────────────────── */
  function makeBlink(refs, getState) {
    let timer = null;

    function blink() {
      const e = X[getState()] || X.idle;
      refs.lidL.style.transition = refs.lidR.style.transition = 'transform .09s ease';
      refs.lidL.style.transform  = refs.lidR.style.transform  = 'translateY(0px)';
      setTimeout(() => {
        refs.lidL.style.transition = refs.lidR.style.transition = 'transform .15s ease';
        refs.lidL.style.transform = `translateY(${e.ll}px)`;
        refs.lidR.style.transform = `translateY(${e.lr}px)`;
        setTimeout(() => {
          refs.lidL.style.transition = refs.lidR.style.transition = '';
          schedule();
        }, 220);
      }, 105);
    }

    function schedule() {
      clearTimeout(timer);
      const rapid = (X[getState()] || {}).rapidBlink;
      timer = setTimeout(blink, rapid ? (700 + Math.random() * 700) : (2600 + Math.random() * 3400));
    }

    return { start: schedule };
  }

  /* ── Speech bubble ───────────────────────────────────────────────────────── */
  function makeBubble(el) {
    let timer = null, cooldownUntil = 0, recent = [];

    function show(txt, dur) {
      if (Date.now() < cooldownUntil) return;
      clearTimeout(timer);
      el.textContent = txt;
      el.classList.add('show');
      timer = setTimeout(() => el.classList.remove('show'), dur || 3800);
      cooldownUntil = Date.now() + 7000;
    }

    function forState(s, force) {
      const pool = C[s];
      if (!pool || (!force && Math.random() > .38)) return;
      let picks = pool.filter(m => !recent.includes(m));
      if (!picks.length) { recent = []; picks = pool; }
      const msg = picks[Math.floor(Math.random() * picks.length)];
      recent = [...recent.slice(-2), msg];
      show(msg);
    }

    return { show, forState };
  }

  /* ── Intelligence / state machine ───────────────────────────────────────── */
  function makeIntel(refs, lerp, pupils, bubble) {
    let state = 'idle';
    let lastMoveMs = Date.now();
    let lastMx = 0, lastMy = 0, velBuf = [];
    let lastBtnEl = null, btnHoversSinceClick = 0;
    let manualUntil = 0;
    let lastScrollY = 0, lastScrollMs = Date.now();
    let posBuf = [], circleCooldown = 0;
    let premFirstVisit = true, tabWasHidden = false;
    const startTime = Date.now();
    const milestones = [
      { ms:30000,  state:'happy',      msg:'30 seconds in! Clearly intrigued 😊' },
      { ms:60000,  state:'proud',      msg:'One whole minute! That\'s commitment! ✨' },
      { ms:120000, state:'beaming',    msg:'2 minutes!! You WANT this. Just book it 😤' },
      { ms:300000, state:'triumphant', msg:'5 minutes here. You\'re basically enrolled already 💖' },
    ];
    let milestoneIdx = 0;

    function forceState(s, dur, msg) {
      state = s;
      applyExpr(s, refs, lerp);
      if (msg) bubble.show(msg);
      else bubble.forState(s, true);
      manualUntil = Date.now() + (dur || 3000);
    }

    function setState(s) {
      if (s === state || Date.now() < manualUntil) return;
      state = s;
      applyExpr(s, refs, lerp);
      bubble.forState(s, false);
    }

    function nearBtnDist(mx, my) {
      let min = Infinity;
      document.querySelectorAll('.btn-primary,.btn-cta,[data-orbi-btn]').forEach(b => {
        if (!b.offsetParent) return;
        const r = b.getBoundingClientRect();
        min = Math.min(min, Math.hypot(mx - (r.left+r.width/2), my - (r.top+r.height/2)));
      });
      return min;
    }

    function inPrem(mx, my) {
      const p = document.querySelector('.prem-card');
      if (!p) return false;
      const r = p.getBoundingClientRect();
      return mx > r.left && mx < r.right && my > r.top && my < r.bottom;
    }

    function nearOrbi(mx, my) {
      const r = refs.svg.getBoundingClientRect();
      return Math.hypot(mx - (r.left+r.width/2), my - (r.top+r.height/2)) < 92;
    }

    function checkCircles(mx, my, vel) {
      if (vel < 3) { posBuf = []; return false; }
      posBuf = [...posBuf.slice(-9), { x:mx, y:my }];
      if (posBuf.length < 8) return false;
      const angles = [];
      for (let i = 1; i < posBuf.length; i++) {
        const dx = posBuf[i].x - posBuf[i-1].x, dy = posBuf[i].y - posBuf[i-1].y;
        if (Math.hypot(dx, dy) < 2) continue;
        angles.push(Math.atan2(dy, dx));
      }
      if (angles.length < 5) return false;
      let total = 0;
      for (let i = 1; i < angles.length; i++) {
        let d = angles[i] - angles[i-1];
        if (d >  Math.PI) d -= 2*Math.PI;
        if (d < -Math.PI) d += 2*Math.PI;
        total += d;
      }
      return Math.abs(total) > Math.PI * 1.5;
    }

    function decide(mx, my, vel) {
      const idle = Date.now() - lastMoveMs;
      if (idle > 35000) return 'sleepy';
      if (idle > 12000) return 'bored';
      if (idle > 2500)  return 'thinking';
      if (nearOrbi(mx, my)) return 'shy';
      if (vel > 35)     return 'surprised';
      if (my < window.innerHeight * .06) return 'worried';
      if (inPrem(mx, my)) return 'lovey';
      if (btnHoversSinceClick >= 5) return 'pleading';
      if (btnHoversSinceClick >= 3) return 'nervous';
      const d = nearBtnDist(mx, my);
      if (d < 35)  return 'excited';
      if (d < 130) return 'happy';
      if (d < 290) return (vel > 0.4 && vel < 2.8) ? 'thinking' : 'curious';
      if (vel > 0.4 && vel < 2.8) return 'thinking';
      return 'idle';
    }

    /* ── mousemove ── */
    document.addEventListener('mousemove', e => {
      const dx = e.clientX - lastMx, dy = e.clientY - lastMy;
      const v  = Math.hypot(dx, dy);
      velBuf   = [...velBuf.slice(-3), v];
      const av = velBuf.reduce((a, b) => a + b, 0) / velBuf.length;
      lastMx = e.clientX; lastMy = e.clientY;
      lastMoveMs = Date.now();
      pupils.setTarget(e.clientX, e.clientY);

      if (checkCircles(e.clientX, e.clientY, av) && Date.now() > circleCooldown) {
        circleCooldown = Date.now() + 5500;
        forceState('confused', 3500, 'Getting DIZZY watching you!! 😵‍💫');
        showSymbol(refs, '😵');
        return;
      }
      setState(decide(e.clientX, e.clientY, av));
    });

    document.addEventListener('mouseleave', () => {
      bubble.show("Hello?? Don't leave me! 👀");
      state = 'worried'; applyExpr('worried', refs, lerp); pupils.wander();
    });
    document.addEventListener('mouseenter', () => {
      if (Date.now() > manualUntil) setState('idle');
    });

    /* ── Scroll ── */
    window.addEventListener('scroll', () => {
      const now = Date.now();
      const dy  = Math.abs(window.scrollY - lastScrollY);
      const dt  = Math.max(1, now - lastScrollMs);
      lastScrollY = window.scrollY; lastScrollMs = now;
      if (dt < 40) return;
      if (dy / dt > 2.2 && Date.now() > manualUntil) {
        forceState('awestruck', 2000, 'SLOW DOWN!! Did you even read that? 😤');
        showSymbol(refs, '!');
      }
      const pct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (pct > .92 && Date.now() > manualUntil) {
        forceState('triumphant', 3200, 'You scrolled ALL the way! LEGENDARY dedication! 💪');
        showSymbol(refs, '✓');
      }
    }, { passive: true });

    /* ── Tab visibility ── */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        tabWasHidden = true;
      } else if (tabWasHidden) {
        tabWasHidden = false;
        forceState('beaming', 4000, "OH! You're BACK!! I missed you SO much! 🥹");
        showSymbol(refs, '!');
      }
    });

    /* ── Right-click ── */
    document.addEventListener('contextmenu', () => {
      forceState('mischievous', 2500, "Ooh sneaky!! What are you plotting? 😏");
      showSymbol(refs, '?');
    });

    /* ── Copy ── */
    document.addEventListener('copy', () => {
      if (Date.now() > manualUntil)
        forceState('smug', 2000, "Copying good content? Excellent taste 😏");
    });

    /* ── Text selection ── */
    let selTimer = null;
    document.addEventListener('selectionchange', () => {
      clearTimeout(selTimer);
      selTimer = setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 15 && Date.now() > manualUntil)
          forceState('curious', 2500, "Taking notes? Very studious! 📝");
      }, 600);
    });

    /* ── Button hovers ── */
    document.querySelectorAll('.btn-primary,.btn-cta').forEach(b => {
      b.addEventListener('mouseenter', () => {
        btnHoversSinceClick = (b === lastBtnEl) ? btnHoversSinceClick + 1 : 1;
        lastBtnEl = b;
        if (btnHoversSinceClick === 4 && Date.now() > manualUntil) {
          forceState('pleading', 2800, "JUST CLICK IT!! I AM BEGGING YOU!! 🥺🙏");
          showSymbol(refs, '!');
        }
      });
    });

    /* ── Click ── */
    document.addEventListener('click', e => {
      const onBtn = e.target.closest('.btn-primary,.btn-secondary,.btn-cta');
      if (onBtn) {
        btnHoversSinceClick = 0;
        /* Alternate between celebrations */
        const cel = Math.random() > .5 ? 'triumphant' : 'beaming';
        forceState(cel, 3200, cel === 'triumphant' ? 'YESSS!! ABSOLUTE LEGEND!! 🎉🚀' : 'YAAAAAY!! GREAT CHOICE!! 😄✨');
        showSymbol(refs, '!');
      }
    });

    /* ── Price hover ── */
    document.querySelectorAll('.prem-price,.best-price,.pdf-price,.price').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (Date.now() > manualUntil)
          forceState('starstruck', 2500, "Worth. Every. Single. Rupee!! 💰✨");
      });
    });

    /* ── YouTube hover ── */
    document.querySelectorAll('a[href*="youtube"],a[href*="youtu.be"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (Date.now() > manualUntil)
          forceState('smug', 2000, "Due diligence! I respect that! 📺");
      });
    });

    /* ── Premium card first visit ── */
    const premCard = document.querySelector('.prem-card');
    if (premCard) {
      premCard.addEventListener('mouseenter', () => {
        if (premFirstVisit && Date.now() > manualUntil) {
          premFirstVisit = false;
          forceState('melting', 3500, "THE premium choice! You have EXCEPTIONAL taste! 💎");
          showSymbol(refs, '♥');
        }
      });
    }

    /* ── Idle + milestone timer ── */
    setInterval(() => {
      if (milestoneIdx < milestones.length) {
        const m = milestones[milestoneIdx];
        if (Date.now() - startTime >= m.ms) { milestoneIdx++; forceState(m.state, 3500, m.msg); return; }
      }
      if (Date.now() < manualUntil) return;
      const idle = Date.now() - lastMoveMs;
      if (idle > 35000) { state = 'sleepy'; applyExpr('sleepy', refs, lerp); showSymbol(refs, 'z'); }
      else if (idle > 12000) { state = 'bored'; applyExpr('bored', refs, lerp); }
      if (idle > 4000) pupils.wander();
    }, 4000);

    /* ── Playful randomizer — wink, cheeky, or flirty when happy ── */
    setInterval(() => {
      if (['happy','lovey','excited','proud'].includes(state) && Date.now() > manualUntil && Math.random() > .6) {
        const prev = state;
        const pick = ['wink','cheeky','flirty'][Math.floor(Math.random()*3)];
        state = pick; applyExpr(pick, refs, lerp);
        setTimeout(() => { if (state === pick) { state = prev; applyExpr(prev, refs, lerp); } }, 1000);
      }
    }, 10000);

    /* ── Greeting ── */
    setTimeout(() => {
      forceState('flirty', 2200, "Heyyy! I\'m Orbi~ I\'ll be watching your every move 👀✨");
    }, 1800);

    return { getState: () => state };
  }

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  function boot() {
    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    const root = document.createElement('div');
    root.id = 'orbi-root';

    const bubbleEl = document.createElement('div');
    bubbleEl.id = 'orbi-bubble';
    root.appendChild(bubbleEl);

    const wrap = document.createElement('div');
    wrap.id = 'orbi-face-wrap';
    wrap.appendChild(buildFace());
    root.appendChild(wrap);

    const nameEl = document.createElement('div');
    nameEl.id = 'orbi-name';
    nameEl.textContent = 'ORBI';
    root.appendChild(nameEl);

    document.body.appendChild(root);

    const refs   = getRefs();
    const lerp   = makeLerp(refs);
    const pupils = makePupils(refs, lerp);
    const bubble = makeBubble(bubbleEl);
    const intel  = makeIntel(refs, lerp, pupils, bubble);
    const blink  = makeBlink(refs, intel.getState);

    applyExpr('idle', refs, lerp);
    blink.start();

    (function loop() { pupils.tick(); lerp.tick(); requestAnimationFrame(loop); })();

    window.addEventListener('resize', pupils.resetRect, { passive: true });
    window.addEventListener('scroll', pupils.resetRect, { passive: true });

    window.Orbi = {
      say:    (txt, dur) => bubble.show(txt, dur),
      feel:   name       => { applyExpr(name, refs, lerp); },
      wink:   ()         => { const p = intel.getState(); applyExpr('wink', refs, lerp); setTimeout(() => applyExpr(p, refs, lerp), 900); },
      symbol: ch         => showSymbol(refs, ch),
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
