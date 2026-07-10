/* ── Styles ── all CSS injected once at boot */
export const CSS = `
#divu-root{position:fixed;bottom:28px;right:28px;z-index:99998;display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none;overflow:visible}
#divu-root.dv-pos-br{bottom:28px;right:28px;top:auto;left:auto}
#divu-root.dv-pos-bl{bottom:28px;left:28px;top:auto;right:auto}
#divu-root.dv-pos-tr{top:28px;right:28px;bottom:auto;left:auto}
#divu-root.dv-pos-tl{top:28px;left:28px;bottom:auto;right:auto}
#divu-face-wrap{pointer-events:auto;cursor:grab;animation:dvFloat 4.2s ease-in-out infinite;overflow:visible}
#divu-face-wrap:active{cursor:grabbing}
#divu-face{filter:drop-shadow(0 8px 28px rgba(149,58,218,.48)) drop-shadow(0 0 32px rgba(236,210,255,.9));overflow:visible}
@keyframes dvFloat{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-5px) rotate(-1.8deg)}75%{transform:translateY(-3px) rotate(1.8deg)}}
#divu-bubble{position:absolute;bottom:calc(100% + 10px);right:0;background:rgba(255,250,255,.97);border:1.5px solid rgba(192,132,252,.45);border-radius:14px;padding:9px 14px;font-size:13px;font-family:system-ui,-apple-system,sans-serif;color:#581c87;pointer-events:none;opacity:0;transform:scale(.85) translateY(10px);transform-origin:bottom right;transition:opacity .22s ease,transform .3s cubic-bezier(.34,1.56,.64,1);max-width:230px;line-height:1.45;z-index:99999;white-space:normal}
#divu-bubble.show{opacity:1;transform:scale(1) translateY(0)}
#divu-bubble.dv-ask{font-size:15px;font-weight:700;max-width:260px;padding:11px 16px;border-width:2.5px;border-color:rgba(255,80,140,.65);background:rgba(255,245,255,.99);color:#7c1d6f;box-shadow:0 4px 22px rgba(255,60,130,.35),0 0 0 3px rgba(255,110,160,.18)}
@keyframes dvAskPulse{0%,100%{box-shadow:0 4px 22px rgba(255,60,130,.35),0 0 0 3px rgba(255,110,160,.18)}50%{box-shadow:0 6px 28px rgba(255,60,130,.55),0 0 0 6px rgba(255,110,160,.28)}}
#divu-bubble.dv-ask.show{animation:dvAskPulse 1.8s ease-in-out infinite}
#divu-bubble::after{content:'';position:absolute;bottom:-7px;right:24px;width:12px;height:12px;background:rgba(255,250,255,.97);border-right:1.5px solid rgba(192,132,252,.45);border-bottom:1.5px solid rgba(192,132,252,.45);transform:rotate(45deg)}
#divu-root.dv-pos-tr #divu-bubble,#divu-root.dv-pos-tl #divu-bubble,#divu-root.dv-near-top #divu-bubble{bottom:auto;top:calc(100% + 10px);transform:scale(.85) translateY(-10px);transform-origin:top right}
#divu-root.dv-pos-tr #divu-bubble.show,#divu-root.dv-pos-tl #divu-bubble.show,#divu-root.dv-near-top #divu-bubble.show{opacity:1;transform:scale(1) translateY(0)}
#divu-root.dv-pos-tr #divu-bubble::after,#divu-root.dv-pos-tl #divu-bubble::after,#divu-root.dv-near-top #divu-bubble::after{bottom:auto;top:-7px;border-right:none;border-bottom:none;border-left:1.5px solid rgba(192,132,252,.45);border-top:1.5px solid rgba(192,132,252,.45);transform:rotate(45deg)}
.dv-typing #divu-face-wrap{animation-play-state:paused;cursor:default!important}
#divu-controls{display:flex;gap:6px;align-items:center;margin-top:3px;pointer-events:auto;transition:opacity .18s ease,visibility .18s ease}
#divu-chat{display:flex;align-items:center;gap:5px;width:174px;margin-top:4px;pointer-events:auto;transition:opacity .18s ease,visibility .18s ease}
.dv-dragging #divu-controls,.dv-dragging #divu-chat{opacity:0;pointer-events:none!important;visibility:hidden}
#divu-name{font-size:10px;font-family:ui-monospace,monospace;color:rgba(109,40,217,.65);letter-spacing:.16em}
#dv-mic-btn,#dv-cam-btn{font-size:14px;cursor:pointer;opacity:.45;transition:opacity .2s,transform .2s,color .2s;line-height:1;pointer-events:auto}
#dv-mic-btn:hover,#dv-cam-btn:hover{opacity:1;transform:scale(1.2)}
#dv-mic-btn.active{opacity:1;color:#e879f9;animation:dvMicPulse .9s ease-in-out infinite}
#dv-cam-btn.active{opacity:1;color:#e879f9}
@keyframes dvMicPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.22)}}
.ob-lid{transition:transform .32s cubic-bezier(.34,1.56,.64,1)}
.ob-brow{transition:transform .38s cubic-bezier(.34,1.56,.64,1);transform-box:fill-box;transform-origin:center}
#o-l-iris,#o-r-iris{transition:fill .55s ease}
#om-quiver{transition:opacity .28s ease}
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
.dv-limb{opacity:0;transition:opacity .22s ease}
.dv-limb.show{opacity:1}
.ob-cheek{transition:opacity .6s ease}
#dv-arm-l{transform-box:fill-box;transform-origin:100% 60%}
#dv-arm-r{transform-box:fill-box;transform-origin:0% 60%}
#dv-leg-l{transform-box:fill-box;transform-origin:75% 0%}
#dv-leg-r{transform-box:fill-box;transform-origin:25% 0%}
@keyframes dvArmWaveL{0%,100%{transform:rotate(0deg)}40%{transform:rotate(-28deg)}80%{transform:rotate(8deg)}}
@keyframes dvArmWaveR{0%,100%{transform:rotate(0deg)}40%{transform:rotate(28deg)}80%{transform:rotate(-8deg)}}
@keyframes dvLegSwayL{0%,100%{transform:rotate(0deg)}50%{transform:rotate(12deg)}}
@keyframes dvLegSwayR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-12deg)}}
@keyframes dvArmPushupL{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-38deg)}}
@keyframes dvArmPushupR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(38deg)}}
@keyframes dvBodyBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes dvArmWalkL{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-32deg)}}
@keyframes dvArmWalkR{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(32deg)}}
@keyframes dvLegWalkL{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(28deg)}}
@keyframes dvLegWalkR{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-28deg)}}
@keyframes dvBodyWalk{0%,50%,100%{transform:translateY(0)}25%{transform:translateY(-8px)}75%{transform:translateY(-8px)}}
@keyframes dvBodyJump{0%{transform:translateY(0) scaleY(1)}35%{transform:translateY(-20px) scaleY(1.1)}65%{transform:translateY(-20px) scaleY(1.1)}85%{transform:translateY(4px) scaleY(.92)}100%{transform:translateY(0) scaleY(1)}}
@keyframes dvArmHangL{0%,100%{transform:rotate(-48deg)}50%{transform:rotate(-58deg)}}
@keyframes dvArmHangR{0%,100%{transform:rotate(48deg)}50%{transform:rotate(58deg)}}
@keyframes dvLegDangleL{0%,100%{transform:rotate(6deg)}50%{transform:rotate(22deg)}}
@keyframes dvLegDangleR{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-22deg)}}
.dv-heart{position:absolute;pointer-events:none;font-size:18px;animation:dvHeartFloat 1.4s ease-out forwards;z-index:99999}
@keyframes dvHeartFloat{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-55px) scale(.5)}}
@keyframes dvArmCheerL{0%,100%{transform:rotate(-62deg)}50%{transform:rotate(-78deg)}}
@keyframes dvArmCheerR{0%,100%{transform:rotate(62deg)}50%{transform:rotate(78deg)}}
@keyframes dvArmDanceL{0%,30%,100%{transform:rotate(14deg)}65%{transform:rotate(-50deg)}}
@keyframes dvArmDanceR{0%,30%,100%{transform:rotate(-14deg)}65%{transform:rotate(50deg)}}
@keyframes dvArmThinkL{0%,100%{transform:rotate(-44deg)}50%{transform:rotate(-54deg)}}
@keyframes dvLegKickL{0%,55%,100%{transform:rotate(0deg)}28%{transform:rotate(46deg)}}
@keyframes dvLegKickR{0%,55%,100%{transform:rotate(0deg)}28%{transform:rotate(-46deg)}}
@keyframes dvLegDanceL{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(34deg)}}
@keyframes dvLegDanceR{0%,100%{transform:rotate(10deg)}50%{transform:rotate(-34deg)}}
@keyframes dvBodyDance{0%,100%{transform:translateY(0) rotate(0deg)}30%{transform:translateY(-7px) rotate(-5deg)}70%{transform:translateY(-7px) rotate(5deg)}}
@keyframes dvBodyShake{0%,100%{transform:translateX(0) rotate(0deg)}25%{transform:translateX(-5px) rotate(-3deg)}75%{transform:translateX(5px) rotate(3deg)}}
@keyframes dvBodySpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes dvArmStretchL{0%{transform:rotate(0deg)}55%{transform:rotate(-92deg)}72%{transform:rotate(-97deg)}100%{transform:rotate(0deg)}}
@keyframes dvArmStretchR{0%{transform:rotate(0deg)}55%{transform:rotate(92deg)}72%{transform:rotate(97deg)}100%{transform:rotate(0deg)}}
@keyframes dvBodyWiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px) rotate(-3deg)}75%{transform:translateX(5px) rotate(3deg)}}
#om-cat,#om-dot{transition:opacity .28s ease}
#om-pucker,#om-dimple-l,#om-dimple-r,#om-sneer-l,#om-sneer-r{transition:opacity .18s ease}
#o-puff-l,#o-puff-r{transition:opacity .22s ease}
@keyframes dvArmRunL{0%,100%{transform:rotate(38deg)}50%{transform:rotate(-48deg)}}
@keyframes dvArmRunR{0%,100%{transform:rotate(-38deg)}50%{transform:rotate(48deg)}}
@keyframes dvLegRunL{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(42deg)}}
@keyframes dvLegRunR{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-42deg)}}
@keyframes dvBodyRun{0%,50%,100%{transform:translateY(0)}25%{transform:translateY(-12px)}75%{transform:translateY(-12px)}}
@keyframes dvArmJackL{0%,100%{transform:rotate(12deg)}50%{transform:rotate(-72deg)}}
@keyframes dvArmJackR{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(72deg)}}
@keyframes dvLegJackL{0%,100%{transform:rotate(0deg)}50%{transform:rotate(28deg)}}
@keyframes dvLegJackR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-28deg)}}
@keyframes dvBodyJack{0%,100%{transform:translateY(0)}45%{transform:translateY(-9px)}}
@keyframes dvArmBoxL{0%,48%,100%{transform:rotate(0deg)}22%{transform:rotate(-52deg)}}
@keyframes dvArmBoxR{0%,55%,100%{transform:rotate(0deg)}72%,86%{transform:rotate(52deg)}}
@keyframes dvBodyBox{0%,100%{transform:translateX(0) rotate(0deg)}25%{transform:translateX(4px) rotate(2deg)}75%{transform:translateX(-4px) rotate(-2deg)}}
@keyframes dvArmFlexL{0%,100%{transform:rotate(0deg)}40%,60%{transform:rotate(-84deg)}}
@keyframes dvArmFlexR{0%,100%{transform:rotate(0deg)}40%,60%{transform:rotate(84deg)}}
@keyframes dvBodyFlex{0%,100%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.04) translateY(-2px)}}
@keyframes dvArmSwimL{0%{transform:rotate(-56deg)}42%{transform:rotate(20deg)}100%{transform:rotate(-56deg)}}
@keyframes dvArmSwimR{0%{transform:rotate(20deg)}42%{transform:rotate(-56deg)}100%{transform:rotate(20deg)}}
@keyframes dvBodySwim{0%,100%{transform:translateX(0) rotate(0deg)}33%{transform:translateX(5px) rotate(5deg)}66%{transform:translateX(-5px) rotate(-5deg)}}
@keyframes dvArmGuitarL{0%,100%{transform:rotate(-28deg)}50%{transform:rotate(-46deg)}}
@keyframes dvArmGuitarR{0%,20%,60%,100%{transform:rotate(22deg)}10%{transform:rotate(56deg)}40%{transform:rotate(56deg)}}
@keyframes dvBodyGuitar{0%,100%{transform:rotate(0deg) translateY(0)}35%{transform:rotate(-5deg) translateY(-3px)}70%{transform:rotate(4deg) translateY(-2px)}}
@keyframes dvLegSkipL{0%,50%,100%{transform:rotate(-8deg)}25%{transform:rotate(42deg)}}
@keyframes dvLegSkipR{0%,50%,100%{transform:rotate(8deg)}75%{transform:rotate(-42deg)}}
@keyframes dvBodySkip{0%,50%,100%{transform:translateY(0)}25%{transform:translateY(-17px)}}
@keyframes dvLegYogaL{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(18deg)}}
@keyframes dvLegYogaR{0%,100%{transform:rotate(5deg)}50%{transform:rotate(-18deg)}}
@keyframes dvBodyYoga{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-3px) rotate(1deg)}}
@keyframes dvArmMoonL{0%,100%{transform:rotate(8deg)}50%{transform:rotate(-18deg)}}
@keyframes dvArmMoonR{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(18deg)}}
@keyframes dvBodyMoon{0%,100%{transform:translateX(0) rotate(0deg)}30%{transform:translateX(-9px) rotate(-4deg)}70%{transform:translateX(9px) rotate(4deg)}}
@keyframes dvArmRobotL{0%{transform:rotate(0deg)}50%{transform:rotate(-55deg)}100%{transform:rotate(0deg)}}
@keyframes dvArmRobotR{0%{transform:rotate(0deg)}50%{transform:rotate(55deg)}100%{transform:rotate(0deg)}}
@keyframes dvBodyRobot{0%,100%{transform:translateX(0)}33%{transform:translateX(6px)}66%{transform:translateX(-6px)}}
@keyframes dvBodyHula{0%{transform:translateX(0) rotate(0deg)}25%{transform:translateX(9px) rotate(4deg)}50%{transform:translateX(0) rotate(0deg)}75%{transform:translateX(-9px) rotate(-4deg)}100%{transform:translateX(0) rotate(0deg)}}
@keyframes dvLegHulaL{0%,100%{transform:rotate(8deg)}50%{transform:rotate(-8deg)}}
@keyframes dvLegHulaR{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes dvArmClapL{0%,100%{transform:rotate(0deg)}45%,55%{transform:rotate(-62deg)}}
@keyframes dvArmClapR{0%,100%{transform:rotate(0deg)}45%,55%{transform:rotate(62deg)}}
@keyframes dvBodyClap{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes dvBodyHeadbang{0%,100%{transform:translateY(0) rotate(0deg)}45%,55%{transform:translateY(6px) rotate(22deg)}}
@keyframes dvLegHighKickL{0%,60%,100%{transform:rotate(0deg)}30%{transform:rotate(72deg)}}
@keyframes dvLegHighKickR{0%,60%{transform:rotate(0deg)}80%{transform:rotate(-72deg)}}
@keyframes dvBodyHighKick{0%,100%{transform:translateY(0)}30%,80%{transform:translateY(-6px)}}
@keyframes dvArmDiscoL{0%,50%,100%{transform:rotate(0deg)}20%,30%{transform:rotate(-72deg)}}
@keyframes dvArmDiscoR{0%,100%{transform:rotate(0deg)}70%,80%{transform:rotate(72deg)}}
@keyframes dvBodyDisco{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-4px) rotate(-6deg)}75%{transform:translateY(-4px) rotate(6deg)}}
@keyframes dvBodyTwerk{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(8px) scaleY(.92)}}
@keyframes dvLegTwerkL{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-8deg)}}
@keyframes dvLegTwerkR{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(8deg)}}
@keyframes dvArmSalsaL{0%,100%{transform:rotate(-20deg)}25%{transform:rotate(-38deg)}75%{transform:rotate(-8deg)}}
@keyframes dvArmSalsaR{0%,100%{transform:rotate(20deg)}25%{transform:rotate(8deg)}75%{transform:rotate(38deg)}}
@keyframes dvBodySalsa{0%,100%{transform:translateX(0) rotate(0deg)}25%{transform:translateX(7px) rotate(5deg)}75%{transform:translateX(-7px) rotate(-5deg)}}
@keyframes dvRootJump{0%{transform:translateY(0) scaleX(1) scaleY(1)}8%{transform:translateY(0) scaleX(1.15) scaleY(.85)}20%{transform:translateY(-52px) scaleX(.88) scaleY(1.12)}38%{transform:translateY(-60px) scaleX(.86) scaleY(1.14)}55%{transform:translateY(-28px) scaleX(.94) scaleY(1.06)}68%{transform:translateY(-5px) scaleX(1.08) scaleY(.93)}78%{transform:translateY(-18px) scaleX(.96) scaleY(1.04)}88%{transform:translateY(-2px) scaleX(1.04) scaleY(.97)}100%{transform:translateY(0) scaleX(1) scaleY(1)}}
@keyframes dvRootShake{0%,100%{transform:translateX(0) rotate(0deg)}10%{transform:translateX(-9px) rotate(-3deg)}20%{transform:translateX(9px) rotate(3deg)}30%{transform:translateX(-7px) rotate(-2deg)}40%{transform:translateX(7px) rotate(2deg)}50%{transform:translateX(-5px) rotate(-1deg)}60%{transform:translateX(5px) rotate(1deg)}70%{transform:translateX(-3px)}80%{transform:translateX(3px)}90%{transform:translateX(-1px)}}
@keyframes dvRootSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes dvRootRecoil{0%,100%{transform:translateX(0)}15%{transform:translateX(-18px)}35%{transform:translateX(6px)}55%{transform:translateX(-4px)}75%{transform:translateX(2px)}}
@keyframes dvRootSlump{0%{transform:translateY(0) rotate(0deg)}40%{transform:translateY(12px) rotate(4deg)}70%{transform:translateY(8px) rotate(2deg)}100%{transform:translateY(0) rotate(0deg)}}
@media (max-width:768px){
  #divu-root,#divu-root.dv-pos-br{bottom:14px;right:14px;top:auto;left:auto;zoom:.85}
  #divu-root.dv-pos-bl{bottom:14px;left:14px;right:auto;top:auto;zoom:.85}
  #divu-root.dv-pos-tr{top:14px;right:14px;bottom:auto;left:auto;zoom:.85}
  #divu-root.dv-pos-tl{top:14px;left:14px;bottom:auto;right:auto;zoom:.85}
}
@media (max-width:480px){
  #divu-root,#divu-root.dv-pos-br{bottom:6px;right:6px;top:auto;left:auto;zoom:.72}
  #divu-root.dv-pos-bl{bottom:6px;left:6px;right:auto;top:auto;zoom:.72}
  #divu-root.dv-pos-tr{top:6px;right:6px;bottom:auto;left:auto;zoom:.72}
  #divu-root.dv-pos-tl{top:6px;left:6px;bottom:auto;right:auto;zoom:.72}
}
`;
