/* ── Looks ── SVG face construction (visual appearance) */
import { EL, ER, SR, IR, PR, LR, U_OPEN, L_OPEN, MX1, MX2, MQX, MBASE } from './divu.expressions.js';
import { svgEl, gStop } from './divu.utils.js';

export function buildFace(){
  const svg=svgEl('svg',{id:'divu-face',width:180,height:180,viewBox:'0 0 200 200',overflow:'visible'});
  const defs=svgEl('defs',{});

  for(const[s,eye]of[['l',EL],['r',ER]]){const cp=svgEl('clipPath',{id:`ocl-${s}`});cp.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy,r:SR+2}));defs.appendChild(cp);}

  const gH=svgEl('radialGradient',{id:'dg-h',cx:68,cy:46,r:132,gradientUnits:'userSpaceOnUse'});
  gStop(gH,'0%','#fff2fe');gStop(gH,'18%','#f0b0ff');gStop(gH,'48%','#cc6ef8');gStop(gH,'76%','#9440e2');gStop(gH,'100%','#6b22c0');
  defs.appendChild(gH);

  const gSp=svgEl('radialGradient',{id:'dg-sp',cx:'24%',cy:'16%',r:'44%'});
  gStop(gSp,'0%','rgba(255,255,255,0.92)');gStop(gSp,'38%','rgba(255,255,255,0.18)');gStop(gSp,'100%','rgba(0,0,0,0)');
  defs.appendChild(gSp);

  const gAO=svgEl('radialGradient',{id:'dg-ao',cx:'50%',cy:'92%',r:'48%'});
  gStop(gAO,'0%','rgba(80,15,130,0.22)');gStop(gAO,'100%','rgba(0,0,0,0)');
  defs.appendChild(gAO);

  const gRm=svgEl('linearGradient',{id:'dg-rim',x1:'0%',y1:'0%',x2:'100%',y2:'100%'});
  gStop(gRm,'0%','#fce8ff',0.9);gStop(gRm,'50%','#c084fc',0.6);gStop(gRm,'100%','#7e22ce',0.08);
  defs.appendChild(gRm);

  const gSc=svgEl('radialGradient',{id:'dg-sc',cx:'36%',cy:'30%',r:'66%'});
  gStop(gSc,'0%','#ffffff');gStop(gSc,'85%','#f5eeff');gStop(gSc,'100%','#ede0ff');
  defs.appendChild(gSc);

  const gId=svgEl('radialGradient',{id:'dg-id',cx:'28%',cy:'22%',r:'60%'});
  gStop(gId,'0%','rgba(255,255,255,0.58)');gStop(gId,'38%','rgba(255,255,255,0.06)');gStop(gId,'100%','rgba(18,4,62,0.62)');
  defs.appendChild(gId);

  const gPu=svgEl('radialGradient',{id:'dg-pu',cx:'32%',cy:'26%',r:'64%'});
  gStop(gPu,'0%','#1e0840');gStop(gPu,'100%','#00000a');
  defs.appendChild(gPu);

  const gCk=svgEl('radialGradient',{id:'dg-ck',cx:'50%',cy:'50%',r:'50%'});
  gStop(gCk,'0%','rgba(255,92,148,0.80)');gStop(gCk,'50%','rgba(255,82,142,0.32)');gStop(gCk,'100%','rgba(255,82,142,0)');
  defs.appendChild(gCk);

  const fSk=svgEl('filter',{id:'dg-sk',x:'-45%',y:'-45%',width:'190%',height:'190%'});
  fSk.appendChild(svgEl('feGaussianBlur',{stdDeviation:'2.4'}));
  defs.appendChild(fSk);

  svg.appendChild(defs);

  const armL=svgEl('g',{id:'dv-arm-l'},'dv-limb');
  armL.appendChild(svgEl('path',{d:'M 16 124 Q 2 118 -8 110',stroke:'#e9d5ff','stroke-width':'10','stroke-linecap':'round',fill:'none'}));
  armL.appendChild(svgEl('circle',{cx:'-8',cy:'108',r:'7',fill:'#e9d5ff',stroke:'#c084fc','stroke-width':'1.2'}));
  svg.appendChild(armL);

  const armR=svgEl('g',{id:'dv-arm-r'},'dv-limb');
  armR.appendChild(svgEl('path',{d:'M 184 124 Q 198 118 208 110',stroke:'#e9d5ff','stroke-width':'10','stroke-linecap':'round',fill:'none'}));
  armR.appendChild(svgEl('circle',{cx:'208',cy:'108',r:'7',fill:'#e9d5ff',stroke:'#c084fc','stroke-width':'1.2'}));
  svg.appendChild(armR);

  const legL=svgEl('g',{id:'dv-leg-l'},'dv-limb');
  legL.appendChild(svgEl('path',{d:'M 84 188 Q 80 202 80 213',stroke:'#e9d5ff','stroke-width':'10','stroke-linecap':'round',fill:'none'}));
  legL.appendChild(svgEl('ellipse',{cx:'80',cy:'216',rx:'9',ry:'5.5',fill:'#e9d5ff',stroke:'#c084fc','stroke-width':'1'}));
  svg.appendChild(legL);

  const legR=svgEl('g',{id:'dv-leg-r'},'dv-limb');
  legR.appendChild(svgEl('path',{d:'M 116 188 Q 120 202 120 213',stroke:'#e9d5ff','stroke-width':'10','stroke-linecap':'round',fill:'none'}));
  legR.appendChild(svgEl('ellipse',{cx:'120',cy:'216',rx:'9',ry:'5.5',fill:'#e9d5ff',stroke:'#c084fc','stroke-width':'1'}));
  svg.appendChild(legR);

  svg.appendChild(svgEl('circle',{cx:100,cy:100,r:97,fill:'none',stroke:'rgba(233,213,255,0.50)','stroke-width':13}));
  svg.appendChild(svgEl('circle',{cx:100,cy:100,r:92,fill:'url(#dg-h)'}));
  svg.appendChild(svgEl('circle',{cx:100,cy:100,r:92,fill:'url(#dg-sp)'}));
  svg.appendChild(svgEl('circle',{cx:100,cy:100,r:92,fill:'url(#dg-ao)'}));
  svg.appendChild(svgEl('circle',{cx:100,cy:100,r:92,fill:'none',stroke:'url(#dg-rim)','stroke-width':2.5}));

  svg.appendChild(svgEl('ellipse',{id:'o-puff-l',cx:36,cy:116,rx:30,ry:21,fill:'#f0d4ff',opacity:0}));
  svg.appendChild(svgEl('ellipse',{id:'o-puff-r',cx:164,cy:116,rx:30,ry:21,fill:'#f0d4ff',opacity:0}));

  for(const cx of[56,144])svg.appendChild(svgEl('ellipse',{cx,cy:108,rx:18,ry:11,fill:'url(#dg-ck)',opacity:0.44}));
  for(const[s,cx]of[['l',56],['r',144]])svg.appendChild(svgEl('ellipse',{id:`o-ck-${s}`,cx,cy:108,rx:18,ry:11,fill:'url(#dg-ck)',opacity:0}));

  for(const[s,eye]of[['l',EL],['r',ER]]){
    svg.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy+2,r:SR,fill:'rgba(60,0,100,0.12)'}));
    svg.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy,r:SR,fill:'url(#dg-sc)'}));
    const iG=svgEl('g',{id:`o-${s}-irisG`,'clip-path':`url(#ocl-${s})`});
    iG.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy,r:IR,fill:'#7c3aed',id:`o-${s}-iris`}));
    iG.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy,r:IR,fill:'url(#dg-id)',id:`o-${s}-irisOv`}));
    iG.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy,r:PR,fill:'url(#dg-pu)',id:`o-${s}-pupil`}));
    iG.appendChild(svgEl('circle',{cx:eye.cx+7,cy:eye.cy-9,r:8,fill:'white',opacity:'.95',id:`o-${s}-hi`}));
    iG.appendChild(svgEl('circle',{cx:eye.cx-5,cy:eye.cy+3,r:3,fill:'white',opacity:'.50'}));
    svg.appendChild(iG);
    const lidWrap=svgEl('g',{'clip-path':`url(#ocl-${s})`});
    const lidG=svgEl('g',{id:`o-${s}-lid`},'ob-lid');
    lidG.style.transform=`translateY(${U_OPEN}px)`;
    lidG.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy,r:LR,fill:'url(#dg-h)'}));
    lidWrap.appendChild(lidG);svg.appendChild(lidWrap);
    const llidWrap=svgEl('g',{'clip-path':`url(#ocl-${s})`});
    const llidG=svgEl('g',{id:`o-${s}-llid`},'ob-lid');
    llidG.style.transform=`translateY(${L_OPEN}px)`;
    llidG.appendChild(svgEl('circle',{cx:eye.cx,cy:eye.cy,r:LR,fill:'url(#dg-h)'}));
    llidWrap.appendChild(llidG);svg.appendChild(llidWrap);
  }

  for(const[s,x1,cpx,x2]of[['l',41,68,95],['r',105,132,159]]){
    const g=svgEl('g',{id:`o-brow-${s}`},'ob-brow');
    g.appendChild(svgEl('path',{d:`M${x1} 57 Q${cpx} 49 ${x2} 57`,fill:'none',stroke:'rgba(90,20,170,0.22)','stroke-width':8,'stroke-linecap':'round'}));
    g.appendChild(svgEl('path',{d:`M${x1} 55 Q${cpx} 47 ${x2} 55`,fill:'none',stroke:'#5b21b6','stroke-width':4.4,'stroke-linecap':'round'}));
    svg.appendChild(g);
  }

  svg.appendChild(svgEl('path',{id:'om-sh',d:`M${MX1} ${MBASE} Q${MQX} 148 ${MX2} ${MBASE}`,fill:'none',stroke:'rgba(90,20,170,0.18)','stroke-width':7,'stroke-linecap':'round'}));
  svg.appendChild(svgEl('path',{id:'om',d:`M${MX1} ${MBASE} Q${MQX} 148 ${MX2} ${MBASE}`,fill:'none',stroke:'#5b21b6','stroke-width':3.6,'stroke-linecap':'round'}));
  svg.appendChild(svgEl('ellipse',{id:'omo',cx:100,cy:140,rx:11,ry:13,fill:'#1e0840',stroke:'#5b21b6','stroke-width':2.5,opacity:0}));
  svg.appendChild(svgEl('path',{id:'o-teeth',d:'M73 148 Q100 149 127 148 L127 154 Q100 158 73 154 Z',fill:'white',opacity:0}));
  svg.appendChild(svgEl('ellipse',{id:'o-tongue',cx:100,cy:155,rx:9,ry:6,fill:'#fca5c8',opacity:0}));

  svg.appendChild(svgEl('path',{id:'om-cat',d:'M74 143 Q84 153 93 143 Q97 149 100 143 Q103 149 107 143 Q116 153 126 143',fill:'none',stroke:'rgba(90,20,170,0.18)','stroke-width':7,'stroke-linecap':'round','stroke-linejoin':'round',opacity:0}));
  svg.appendChild(svgEl('path',{id:'om-cat-line',d:'M74 143 Q84 153 93 143 Q97 149 100 143 Q103 149 107 143 Q116 153 126 143',fill:'none',stroke:'#5b21b6','stroke-width':3.2,'stroke-linecap':'round','stroke-linejoin':'round',opacity:0}));
  svg.appendChild(svgEl('circle',{id:'om-dot',cx:100,cy:144,r:3.8,fill:'#5b21b6',opacity:0}));
  svg.appendChild(svgEl('path',{id:'om-quiver',d:'M65 141 Q74 134 83 141 Q92 148 101 141 Q110 134 119 141 Q128 148 137 141',fill:'none',stroke:'#5b21b6','stroke-width':3.2,'stroke-linecap':'round','stroke-linejoin':'round',opacity:0}));
  svg.appendChild(svgEl('ellipse',{id:'om-pucker',cx:100,cy:144,rx:8,ry:7,fill:'rgba(130,40,210,0.72)',opacity:0}));
  svg.appendChild(svgEl('path',{id:'om-dimple-l',d:'M71 150 Q70 153 73 155',fill:'none',stroke:'rgba(140,40,200,0.55)','stroke-width':2.2,'stroke-linecap':'round',opacity:0}));
  svg.appendChild(svgEl('path',{id:'om-dimple-r',d:'M129 150 Q130 153 127 155',fill:'none',stroke:'rgba(140,40,200,0.55)','stroke-width':2.2,'stroke-linecap':'round',opacity:0}));
  svg.appendChild(svgEl('path',{id:'om-sneer-l',d:'M83 137 Q79 133 83 130',fill:'none',stroke:'rgba(140,30,200,0.62)','stroke-width':2,'stroke-linecap':'round',opacity:0}));
  svg.appendChild(svgEl('path',{id:'om-sneer-r',d:'M117 137 Q121 133 117 130',fill:'none',stroke:'rgba(140,30,200,0.62)','stroke-width':2,'stroke-linecap':'round',opacity:0}));

  for(const[s,cx,extra]of[['l',EL.cx,''],['r',ER.cx,' ob-delay']]){
    const t=svgEl('ellipse',{id:`o-tear-${s}`,cx,cy:EL.cy+SR-1,rx:3.5,ry:5.5,fill:'#a78bfa',opacity:0});
    t.setAttribute('class',`ob-tear${extra}`);svg.appendChild(t);
  }

  svg.appendChild(svgEl('path',{id:'o-sweat',d:'M168 62 Q162 48 158 62 A6 8 0 0 0 174 62 Z',fill:'#a78bfa',opacity:0}));
  svg.appendChild(svgEl('text',{id:'o-symbol',x:152,y:42,'text-anchor':'middle',fill:'#1e0840','font-size':'24','font-family':'system-ui,sans-serif',opacity:0}));
  return svg;
}
