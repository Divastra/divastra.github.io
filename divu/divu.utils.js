/* ── Utilities ── shared helpers used across all modules */
export const NS='http://www.w3.org/2000/svg';

export function svgEl(tag,attrs,cls){
  const e=document.createElementNS(NS,tag);
  if(attrs)for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));
  if(cls)e.setAttribute('class',cls);
  return e;
}

export function gStop(g,offset,color,opacity){
  const s=svgEl('stop',{offset});
  s.setAttribute('stop-color',color);
  if(opacity!=null)s.setAttribute('stop-opacity',String(opacity));
  g.appendChild(s);
}

export function pick(arr){return arr&&arr.length?arr[Math.floor(Math.random()*arr.length)]:null;}

export function showSymbol(refs,char){
  const el=refs.symbol;
  el.textContent=char;
  el.classList.remove('pop');
  void el.getBoundingClientRect();
  el.classList.add('pop');
  el.addEventListener('animationend',()=>el.classList.remove('pop'),{once:true});
}
