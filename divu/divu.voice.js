/* ── Voice mimic ── microphone capture → pitch-shifted playback */
import { VOICE_EN } from './divu.config.js';
import { pick } from './divu.utils.js';
import { C } from './divu.comments.js';

export function makeVoice(refs,lerp,applyExprFn,bubble,showSymFn,micBtn){
  let stream=null,ctx=null,listening=false,spkTimer=null,micActive=false;
  const mimeType=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus',''].find(m=>!m||MediaRecorder.isTypeSupported(m))||'';

  function playback(chunks){
    if(!chunks.length||!ctx)return;
    const blob=new Blob(chunks,{type:mimeType||'audio/webm'});
    blob.arrayBuffer().then(buf=>ctx.decodeAudioData(buf)).then(decoded=>{
      if(decoded.duration<0.4)return;
      const src=ctx.createBufferSource();src.buffer=decoded;src.playbackRate.value=1.62;
      const hpfOut=ctx.createBiquadFilter();hpfOut.type='highpass';hpfOut.frequency.value=90;
      const presence=ctx.createBiquadFilter();presence.type='peaking';presence.frequency.value=2400;presence.gain.value=5;presence.Q.value=1.2;
      src.connect(hpfOut);hpfOut.connect(presence);presence.connect(ctx.destination);
      src.start();
      applyExprFn('mimicking',refs,lerp);
      bubble.show(pick(C.mimicking)||'Listen to THIS!! 🎤🐿️');showSymFn(refs,'🎵');
      setTimeout(()=>applyExprFn('idle',refs,lerp),(decoded.duration*1000/1.62)+600);
    }).catch(()=>{});
  }

  function startSession(analyser,data,srcStream){
    const chunks=[];
    const rec=mimeType?new MediaRecorder(srcStream,{mimeType}):new MediaRecorder(srcStream);
    rec.ondataavailable=e=>{if(e.data&&e.data.size>0)chunks.push(e.data);};
    rec.onstop=()=>playback(chunks);
    rec.start(50);
    listening=true;
    applyExprFn('listening',refs,lerp);
    clearTimeout(spkTimer);
    spkTimer=setTimeout(()=>{if(listening&&rec.state==='recording'){listening=false;rec.stop();}},1200);
    (function trackSilence(){
      if(!listening)return;
      analyser.getByteFrequencyData(data);
      const vol=Array.from(data.slice(2,60)).reduce((a,b)=>a+b,0)/58;
      if(vol>26){clearTimeout(spkTimer);spkTimer=setTimeout(()=>{if(listening&&rec.state==='recording'){listening=false;rec.stop();}},1200);}
      if(listening)requestAnimationFrame(trackSilence);
    })();
  }

  function stop(){
    micActive=false;
    listening=false;
    clearTimeout(spkTimer);
    if(stream)stream.getTracks().forEach(t=>t.stop());
    if(ctx)ctx.close().catch(()=>{});
    stream=null;ctx=null;
    if(micBtn)micBtn.classList.remove('active');
    applyExprFn('idle',refs,lerp);
    bubble.show('Mic off 🎤',2500);
  }

  async function start(){
    if(micActive)return;
    try{
      stream=await navigator.mediaDevices.getUserMedia({
        audio:{noiseSuppression:true,echoCancellation:true,autoGainControl:false,channelCount:1},
        video:false
      });
      ctx=new(window.AudioContext||window.webkitAudioContext)();
      const source=ctx.createMediaStreamSource(stream);
      const hpf=ctx.createBiquadFilter();hpf.type='highpass';hpf.frequency.value=120;hpf.Q.value=0.7;
      const analyser=ctx.createAnalyser();analyser.fftSize=512;
      const dest=ctx.createMediaStreamDestination();
      source.connect(hpf);hpf.connect(analyser);hpf.connect(dest);
      const processedStream=dest.stream;
      const data=new Uint8Array(analyser.frequencyBinCount);
      micActive=true;
      applyExprFn('excited',refs,lerp);
      bubble.show('I can HEAR you!! Talk to me! 🎤✨');
      if(micBtn)micBtn.classList.add('active');
      let aboveCount=0;
      (function checkVol(){
        if(!micActive)return;
        analyser.getByteFrequencyData(data);
        const vol=Array.from(data.slice(2,60)).reduce((a,b)=>a+b,0)/58;
        if(vol>38){aboveCount++;}else{aboveCount=0;}
        if(aboveCount>=6&&!listening){aboveCount=0;startSession(analyser,data,processedStream);}
        requestAnimationFrame(checkVol);
      })();
    }catch(_){applyExprFn('sad',refs,lerp);bubble.show('No mic access... I wanted to chat 🎤😢');}
  }

  if(micBtn)micBtn.addEventListener('click',e=>{e.stopPropagation();micActive?stop():start();});
  if(VOICE_EN)setTimeout(()=>start(),3000);
  else setTimeout(()=>bubble.show('Want me to talk back? Tap my mic 🎤',5000),44000);
}
