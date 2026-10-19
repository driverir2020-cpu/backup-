// @ts-nocheck
/**
 * ===================================================================
 *  SpinWin — PART 2 of 2  ·  MOTION + REACT COMPONENT
 * ===================================================================
 *  Needs Part 1 (SpinWin.part1.tsx) in the same folder: it exports the CSS and HTML strings
 *  (the scoped styles and the phone-mockup markup). This file adds all logic.
 *
 *  Usage:
 *    import SpinWin from './SpinWin';
 *    <SpinWin onFinish={() => ...}> <YourWebsite /> </SpinWin>
 */
import { useLayoutEffect, useRef, useState, startTransition, type ReactNode } from 'react';
import { CSS, HTML } from './SpinWin.part1';

type SpinWinProps = {
  /** Your real web page — shown the instant the motion finishes. */
  children?: ReactNode;
  /** Called once, at the exact moment the motion ends. */
  onFinish?: () => void;
  /** Mount the website from the start (heavier). Default: it mounts at t = 31.2 s. */
  preloadChildren?: boolean;
  /** Authenticated user data to populate the motion's avatar and name badge */
  user?: {
    firstName?: string;
    lastName?: string;
    telegramUsername?: string;
    photoUrl?: string;
    [key: string]: any;
  } | null;
};

// Kick off the Roboto download as soon as this module is imported (before the component mounts).
if (typeof document !== 'undefined' && !document.getElementById('sw-roboto')) {
  const pc1 = document.createElement('link');
  pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
  const pc2 = document.createElement('link');
  pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com'; pc2.crossOrigin = '';
  const l = document.createElement('link');
  l.id = 'sw-roboto'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
  document.head.append(pc1, pc2, l);
}

function runSpinWin(
  root: HTMLElement,
  gb: HTMLElement,
  onFinish: () => void,
  onReveal: () => void,
  initialUser?: { firstName?: string; lastName?: string; telegramUsername?: string; photoUrl?: string } | null
): () => void {
  const cleanups: Array<() => void> = [];
  let dead = false;
  let fin = false;
  let __rv = false;
  const __gb = gb;
  const finish = () => { if (fin) return; fin = true; onFinish(); };
  const addEventListener = (type: string, fn: any, opts?: any) => {
    window.addEventListener(type, fn, opts);
    cleanups.push(() => window.removeEventListener(type, fn, opts));
  };
  const addDoc = (type: string, fn: any, opts?: any) => {
    document.addEventListener(type, fn, opts);
    cleanups.push(() => document.removeEventListener(type, fn, opts));
  };

// ================= original script (unchanged logic) =================
const $=i=>root.querySelector('#'+i),cl=v=>Math.max(0,Math.min(1,v)),seg=(t,a,b)=>cl((t-a)/(b-a)),eo=p=>1-Math.pow(1-p,3),eo4=p=>1-Math.pow(1-p,4),sm=p=>p*p*(3-2*p),
bk=p=>{const k=1.9;return 1+(k+1)*Math.pow(p-1,3)+k*Math.pow(p-1,2)};
const css=(el,k,v)=>{if(!el)return;const c=el._c||(el._c={});if(c[k]!==v){c[k]=v;el.style[k]=v}},txt=(el,v)=>{if(!el)return;if(el._t!==v){el._t=v;el.textContent=v}};
const sheetEl=$('sheet'),bd=$('bd'),dev=$('dev'),reel=$('reel'),strip=$('strip'),rays=$('rays'),bn=$('bn'),cfc=$('cf'),cx=cfc.getContext('2d');
const E={bal:$('bal'),stk:$('stk'),roy:$('roy'),mi:$('mi'),sp:$('sp'),pl:$('pl'),fg:$('fg'),rp:$('rp')};
// ---------- geometry (app space 364 x 789) ----------
const Hd=789,RT=104,RH=493,C=RH/2,CY=RT+C,PT=Hd-184;
reel.style.top=RT+'px';reel.style.height=RH+'px';$('al').style.top=$('ar').style.top=CY-13+'px';rays.style.top=CY-230+'px';
// ---------- tickets ----------
const GR={void:['#8f97aa','#6f778b','#5a6275','#a6aebe'],orange:['#DA9650','#EE8E2E','#C96119','#EBB070'],gold:['#F8E190','#E9C14C','#D3A02C','#F6DC84'],purple:['#AD91F7','#8657EA','#6B3DCB','#BCA5F9'],blue:['#66BEF9','#3A94E8','#2C86E2','#92D3FB'],pink:['#F4529F','#DD3688','#C12375','#F882BC'],teal:['#62DBCD','#2FBDAE','#16A89A','#8DE8DD']};
const BD={void:'rgba(20,26,40,.3)',orange:'rgba(110,45,0,.3)',gold:'rgba(120,80,0,.28)',purple:'rgba(40,10,100,.32)',blue:'rgba(10,50,110,.3)',pink:'rgba(80,0,40,.32)',teal:'rgba(0,70,60,.3)'};
const PATH='M0 20L12 0H123L135 20V69Q125 76 121 89H14Q10 76 0 69Z';
function tsvg(c){const g=GR[c];let m='';for(let y=24;y<=66;y+=4.2)m+=`<circle cx='0' cy='${y}' r='1.7'/><circle cx='135' cy='${y}' r='1.7'/>`;
return `<svg xmlns='http://www.w3.org/2000/svg' width='462' height='305' viewBox='0 0 135 89'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${g[0]}'/><stop offset='.5' stop-color='${g[1]}'/><stop offset='1' stop-color='${g[2]}'/></linearGradient><mask id='m' maskUnits='userSpaceOnUse' x='-2' y='0' width='139' height='89'><rect x='-2' width='139' height='89' fill='white'/><g fill='black'>${m}</g></mask></defs><g mask='url(#m)'><path d='${PATH}' fill='url(#g)' stroke='${g[3]}' stroke-width='1.6' stroke-linejoin='round'/></g><rect x='12' y='12' width='111' height='65' rx='9' fill='none' stroke='${BD[c]}' stroke-width='2'/><path d='M13.6 24Q13.6 13.6 24 13.6H111' fill='none' stroke='rgba(255,255,255,.22)' stroke-width='1.4'/></svg>`}
const st=document.createElement('style');st.textContent=Object.keys(GR).map(c=>`.sw-root .${c}{background-image:url("data:image/svg+xml,${encodeURIComponent(tsvg(c))}")}`).join('');root.appendChild(st);
const COL=['pink','orange','purple','blue','teal'],SV=[.5,.7,.85,1.1,1.3,1.6,1.9,2.4,.9,1.4,2.1,.6],N=46,W=41,S0=3,TR=W-S0,P=119,TH=101.5,BS=1/1.14;
let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
const CT=[],CC=[],TW=[30,22,16,10,6,3],pk=()=>{let r=rnd()*87,k=0;while(k<5&&r>=TW[k]){r-=TW[k];k++}return k};
for(let i=0;i<N;i++)CT[i]=rnd()<.12?'V':pk();
CT[3]=CT[29]='R';CT[17]=5;CT[36]=4;CT[W]=3;
CT.forEach((v,i)=>CC[i]=v==='R'?'gold':v==='V'?'void':['teal','blue','purple','pink','orange','orange'][v]);const B=CT.slice();
const th=n=>String(n).replace(/\B(?=(\d{3})+$)/g,'\u2009'),lab=v=>v<1?v.toFixed(2):v<100?String(parseFloat(v.toFixed(1))):th(Math.round(v));
strip.style.height=N*P+'px';
strip.innerHTML=B.map((_,i)=>`<div class="t ${CC[i]}" style="top:${i*P+(P-TH)/2}px"><div class="in"><div class="n"><svg viewBox="0 0 32 32"><use href="#tt"/></svg><span></span></div><div class="l">Tether</div></div><div class="sh"></div></div>`).join('');
const T=[...strip.children],SP=T.map(t=>t.querySelector('span'));T.forEach(t=>t._sh=t.querySelector('.sh'));T[W].style.zIndex=5;
let PZ=120,CSK=1;
const TBL={1:[500,[1,2.5,5,8,14,24],1],2:[1000,[2,5,10,16,20,24],1],5:[1500,[5,12.5,25,38,50,60],1],10:[2000,[10,25,50,75,100,120],0],20:[2500,[20,50,100,150,200,240],0],50:[3000,[50,120,250,380,500,600],0]},TC=['teal','blue','purple','pink','orange','orange'];
function setLabels(m){CSK=m;const[ro,sd2,vd]=TBL[m];SP.forEach((s,i)=>{const ty=CT[i];let x,cls;if(i===W){x=lab(PZ*m/50);cls=TC[ty]}else if(ty==='R'){x=lab(ro);cls='gold'}else if(ty==='V'&&vd){x='Empty';cls='void'}else{const k=ty==='V'?0:ty;x=lab(sd2[k]);cls=TC[k]}
 const L=x.length,e=x==='Empty';s.textContent=x;s.style.fontSize=(L>=6?25:L==5?28:32)+'px';T[i].className='t '+cls;T[i].querySelector('svg').style.display=e?'none':'';T[i].querySelector('.l').textContent=e?'No prize':'Tether'})}
function newPrize(){PZ=95+5*Math.floor(Math.random()*32);const k=PZ<120?1:PZ<160?2:PZ<200?3:4;CT[W]=k;$('bnv').textContent=PZ+' USDT';$('wav2').textContent=PZ+' USDT';
 $('tknv').textContent='Received '+(PZ-.3).toFixed(2)+' USDT';$('tkhv').textContent='+'+(PZ-.3).toFixed(2)+' USDT';setLabels(CSK)}
setLabels(1);
newPrize();
const SHN=document.createElement('div');SHN.className='shn';SHN.innerHTML='<i></i>';T[W].appendChild(SHN);const SHI=SHN.firstChild,LT=$('lt');LT.style.top=CY-150+'px';const WC=$('wcd');WC.style.top=CY-50.75+'px';let WCs=0,WCI=null,BL=$('bl');
const PRE=Promise.all(Object.keys(GR).map(c=>{const im=new Image();im.src='data:image/svg+xml,'+encodeURIComponent(tsvg(c));return im.decode?im.decode().catch(()=>{}):0}));
// ---------- audio ----------
let AC,mst,rev,nb,swG,swF,padG;
function initAudio(){try{
 AC=new(window.AudioContext||window.webkitAudioContext)();mst=AC.createGain();mst.gain.value=.9;
 const cp=AC.createDynamicsCompressor();mst.connect(cp);cp.connect(AC.destination);
 const len=AC.sampleRate*2.4,ib=AC.createBuffer(2,len,AC.sampleRate);
 for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.8)}
 rev=AC.createConvolver();rev.buffer=ib;const wg=AC.createGain();wg.gain.value=.4;rev.connect(wg);wg.connect(mst);
 nb=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 const ns=AC.createBufferSource();ns.buffer=nb;ns.loop=true;swF=AC.createBiquadFilter();swF.type='bandpass';swF.Q.value=.7;swG=AC.createGain();swG.gain.value=0;ns.connect(swF);swF.connect(swG);swG.connect(mst);ns.start();
 padG=AC.createGain();padG.gain.value=0;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=850;padG.connect(lp);lp.connect(mst);lp.connect(rev);
 [130.81,196,261.63,329.63,392,493.88].forEach((f,i)=>[-5,5].forEach(d=>{const o=AC.createOscillator();o.type=i%2?'sine':'triangle';o.frequency.value=f;o.detune.value=d;const g=AC.createGain();g.gain.value=.04;o.connect(g);g.connect(padG);o.start()}))}catch(e){AC=null}}
const on=()=>AC&&AC.state==='running';
function tone(f,d,ty,v,o={}){if(!on())return;const n=AC.currentTime+(o.at||0),os=AC.createOscillator(),g=AC.createGain();os.type=ty;os.frequency.setValueAtTime(f,n);if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,n+d);g.gain.setValueAtTime(.0001,n);g.gain.linearRampToValueAtTime(v,n+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,n+d);os.connect(g);g.connect(mst);if(o.wet)g.connect(rev);os.start(n);os.stop(n+d+.05)}
function nz(d,v,f,o={}){if(!on())return;const n=AC.currentTime+(o.at||0),s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nb;fl.type=o.ty||'bandpass';fl.Q.value=o.q||1;fl.frequency.setValueAtTime(f,n);if(o.to)fl.frequency.exponentialRampToValueAtTime(o.to,n+d);g.gain.setValueAtTime(.0001,n);g.gain.linearRampToValueAtTime(v,n+(o.a||.01));g.gain.exponentialRampToValueAtTime(.0001,n+d);s.connect(fl);fl.connect(g);g.connect(mst);if(o.wet)g.connect(rev);s.start(n,Math.random());s.stop(n+d+.05)}
const bell=(f,v,at=0)=>{tone(f,1.8,'sine',v,{at,wet:1,a:.006});tone(f*2.76,.7,'sine',v*.22,{at,wet:1});tone(f*5.4,.3,'sine',v*.08,{at})};
const sfx={
 sheet:()=>nz(.8,.09,260,{to:1900,a:.3,wet:1}),
 tap:k=>{tone(470+k*95,.1,'sine',.2,{to:360+k*60});nz(.03,.05,3500)},
 press:()=>{tone(320,.14,'triangle',.22,{to:150});nz(.04,.08,1800)},
 riser:()=>nz(1.4,.16,300,{to:4200,a:.5,wet:1}),
 tick:q=>{tone(880+Math.random()*60,.045,'triangle',.05+.05*q);nz(.02,.03+.03*q,4000)},
 land:()=>{tone(120,.4,'sine',.4,{to:50});nz(.14,.12,260,{ty:'lowpass'})},
 win:()=>{tone(70,.9,'sine',.45,{to:40});nz(.5,.14,900,{to:6000,a:.02,wet:1});[523.25,659.25,783.99,1046.5,1318.5,1568].forEach((f,i)=>bell(f,.12,i*.075));for(let i=0;i<9;i++)tone(2400+Math.random()*2400,.25,'sine',.04,{at:.3+i*.09,wet:1})},
 coin:k=>{const f=1500+k*55;tone(f,.16,'sine',.06,{wet:1});tone(f*1.5,.1,'sine',.03)},
 down:()=>nz(.8,.07,1800,{to:260,a:.2,wet:1})
};
const EV=[[-.85,sfx.sheet],[.95,()=>sfx.tap(0)],[1.4,()=>sfx.tap(1)],[1.85,()=>sfx.tap(2)],[2.3,()=>sfx.tap(3)],[3.15,sfx.press],[3.3,sfx.riser],[10.45,sfx.land],[10.62,sfx.win],[14,()=>sfx.tap(1)],[14.08,()=>sfx.sheet()],[15.6,()=>sfx.tap(2)],[16.15,()=>sfx.tap(0)],[18.7,()=>sfx.tap(3)],[19.9,()=>sfx.press()],[21.02,()=>sfx.done()],[25.3,()=>sfx.done()],[25.95,()=>sfx.swipe()],[27.55,()=>sfx.tap(1)],[27.8,()=>sfx.swipe()],[29.2,()=>sfx.notif()],[33.3,()=>sfx.down()]];
// ---------- confetti / device fit ----------
const CF=Array.from({length:130},()=>{const a=-Math.PI/2+(rnd()-.5)*2.7,sp=240+rnd()*430;return{vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:rnd()*6,w:(rnd()-.5)*14,s:5+rnd()*6,c:['#FFD66B','#F24C9C','#63BCF8','#60DACC','#fff','#A98BF5'][Math.floor(rnd()*6)]}});
let ds=1;
function fit(){const w=innerWidth,h=innerHeight-10;ds=Math.min((w-20)/408,(h-40)/867,1.5);dev.style.transform=`scale(${ds})`}
addEventListener('resize',fit);fit();
const D=34.8,ST=[2,5,10,20,50],SS=3.4,SE=10.4,WT=10.6,T0=-.9;
const TAPS=[[.95,331.5,PT+28.5],[1.4,331.5,PT+28.5],[1.85,331.5,PT+28.5],[2.3,331.5,PT+28.5],[3.15,242,PT+93],[14,98,PT+44],[15.6,293,415],[16.15,110,483],[18.7,318,309],[19.9,182,720]];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let t=reduce?13:T0,playing=false,started=false,ended=false,anchor=0,baseT=0,lastT=t,prev=S0,lastIdx=S0,lastK=-1,nextCoin=0,au=0,cfOn=false;
const pr=tt=>seg(t,tt-.05,tt+.03)*(1-seg(t,tt+.06,tt+.17));
function frame(dt){
 const up=eo4(seg(t,T0,0)),out=ec(seg(t,33.3,34.8));
 css(sheetEl,'transform',`translate3d(0,${((1-up+out)*innerHeight*1.02).toFixed(1)}px,0)`);css(bd,'opacity',(.55*up*(1-out)).toFixed(3));css(__gb,'opacity',(1-out).toFixed(3));
 const sp=seg(t,SS,SE),r=sm(seg(sp,0,.06)),e=(1-Math.pow(1-sp,3.4))*r,bnc=seg(t,SE,SE+.8);
 const pos=S0+TR*e+Math.sin(bnc*Math.PI)*.03*(1-bnc);
 const v=dt>0?Math.abs(pos-prev)/dt:0;prev=pos;
 css(strip,'transform',`translate3d(0,${(C-(pos*P+P/2)).toFixed(3)}px,0)`);
 const w=t-WT,wp=seg(w,0,.5),dz=sm(seg(t,11.9,13));
 const lo=Math.max(0,Math.floor(pos)-4),hi=Math.min(N-1,Math.ceil(pos)+4);
 for(let i=lo;i<=hi;i++){const d=Math.abs(i-pos),f=cl(1-d/.85);let sc=BS+(1-BS)*sm(f);
  let op=.82*sm(cl((d-1.55)/.95));
  if(i===W){sc*=1+.1*bk(wp)+.06*dz}else op=1-(1-op)*(1-.72*wp*(1-sm(seg(t,12.6,13.6))));
  css(T[i],'willChange','transform');css(T[i],'transform',`scale(${sc.toFixed(4)})`);css(T[i]._sh,'opacity',op<.004?'0':op.toFixed(3))}
 for(let j=lo-2;j<lo;j++)if(j>=0)css(T[j],'willChange','auto');for(let j=hi+1;j<=hi+2;j++)if(j<N)css(T[j],'willChange','auto');css(rays,'opacity',(wp*(1-dz)).toFixed(3));css(rays,'transform',`rotate(${(t*14).toFixed(2)}deg)`);
 const ba=seg(w,.2,.7);css(bn,'opacity',(ba*(1-sm(seg(t,12.9,13.4)))).toFixed(3));css(bn,'transform',`translateY(${((1-eo(ba))*14).toFixed(1)}px)`);
 let k=0;for(let j=0;j<4;j++)if(t>=TAPS[j][0]+.06)k=j+1;const sk=ST[k];
 if(k!==lastK){lastK=k;setLabels(sk)}
 let pop=0;for(let j=0;j<4;j++){const tt=TAPS[j][0];pop=Math.max(pop,seg(t,tt+.06,tt+.12)*(1-seg(t,tt+.12,tt+.3)))}
 txt(E.stk,'$'+sk);css(E.stk,'transform',`scale(${(1+.18*pop).toFixed(3)})`);
 txt(E.roy,'Royal: $'+th(TBL[sk][0]));css(E.mi,'color',k?'#3E9BEA':'#2c3c58');
 const bal=t<3.25?50:t<11.3?0:t<21?PZ*eo(seg(t,11.3,12.8)):PZ*(1-eo(seg(t,21,21.8)));
 txt(E.bal,'Balance '+Math.round(bal)+' USDT');
 const busy=t>=3.3&&t<10.6,sb=E.sp;
 txt(sb,busy?'Spinning…':'Spin for $'+sk);css(sb,'background',busy?'linear-gradient(#2b4a74,#1e3658)':'linear-gradient(#39B0FF,#0F72E8)');css(sb,'color',busy?'#7fa3cf':'#fff');
 const ps=pr(3.15);css(sb,'transform',`scale(${(1-.04*ps).toFixed(3)})`);
 const pp=Math.max(pr(.95),pr(1.4),pr(1.85),pr(2.3));css(E.pl,'transform',`scale(${(1-.1*pp).toFixed(3)})`);css(E.pl,'background',pp>0?'#1c3558':'#13223c');
 const f1=eo(seg(t,.6,.95)),f2=eo(seg(t,2.55,3.05)),fa=seg(t,.6,.85)*(1-seg(t,3.45,3.8));
 const x1=TAPS[0][1],y1=TAPS[0][2],x2=TAPS[4][1],y2=TAPS[4][2];
 const fx=340+(x1-340)*f1+(x2-x1)*f2,fy=(Hd-60)+(y1-(Hd-60))*f1+(y2-y1)*f2,fp=Math.max(pp,ps);
 if(t<5)css(E.fg,'opacity',fa.toFixed(3));if(t<5)css(E.fg,'transform',`translate3d(${fx.toFixed(2)}px,${fy.toFixed(2)}px,0) scale(${(1-.16*fp).toFixed(3)})`);
 let ro=0;for(const[tt,x,y]of TAPS){const q=seg(t,tt,tt+.5);if(q>0&&q<1){css(E.rp,'transform',`translate3d(${x}px,${y}px,0) scale(${(.4+q*1.5).toFixed(3)})`);ro=1-q}}css(E.rp,'opacity',ro.toFixed(3));
 if(w>0&&w<4){cfOn=true;cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,728,1578);cx.globalAlpha=1-seg(w,2.4,3.9);
  for(const c of CF){const x=182+c.vx*w*.8,y=CY+c.vy*w*.8+.5*820*w*w,a=c.r+c.w*w,co=Math.cos(a)*2,si=Math.sin(a)*2;cx.setTransform(co,si,-si,co,x*2,y*2);cx.fillStyle=c.c;cx.fillRect(-c.s/2,-c.s/4,c.s,c.s/2)}}
 else if(cfOn){cfOn=false;cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,728,1578)}
 if(on()&&playing&&(++au%2===0)){const n=AC.currentTime;
  swG.gain.setTargetAtTime(Math.min(.15,v/22*.15),n,.06);swF.frequency.setTargetAtTime(220+v*60,n,.06);
  padG.gain.setTargetAtTime((.2+.16*wp)*seg(t,-.4,1.6)*(1-seg(t,33.2,34.8)),n,.35)}
 if(on()&&playing){const idx=Math.floor(pos+.5);if(idx!==lastIdx){lastIdx=idx;if(t>SS+.05&&t<SE+.2&&(v<24||idx%2==0))sfx.tick(1-Math.min(1,v/20))}
  if(t>=11.3&&t<=12.85){if(nextCoin<11.3)nextCoin=11.3;if(t>=nextCoin){sfx.coin(Math.round((t-11.3)*14));nextCoin+=.07}}else nextCoin=0}
 else lastIdx=Math.floor(pos+.5);
}
function loop(ts){
 if(dead)return;
 let nt=t;if(playing){nt=baseT+(ts-anchor)/1000;if(t<0&&nt>lastT+.034){nt=lastT+.034;baseT=nt;anchor=ts}if(nt>=D){nt=D;playing=false;ended=true}}
 const dt=playing&&nt>lastT&&nt-lastT<.3?nt-lastT:0;
 t=nt;
 try {
  frame(dt);ext(dt);
 } catch (err) {
  console.warn("SpinWin motion frame warn:", err);
 }
 if(!__rv&&t>=31.2){__rv=true;onReveal()}
 if(dt>0)EV.forEach(([et,fn])=>{if(et>lastT&&et<=t){try{fn()}catch(e){}}});
 lastT=t;
 if(ended){finish();return}
 requestAnimationFrame(loop)}
function setPlay(p){playing=p;if(p){anchor=performance.now();baseT=t}}
function tryAudio(){if(AC&&AC.state!=='running')AC.resume().catch(()=>{})}
function start(){newPrize();if(!AC)initAudio();started=true;ended=false;t=T0;lastT=t;prev=S0;setPlay(true);tryAudio()}
function unlock(){tryAudio()}
['pointerdown','touchstart','keydown','click','wheel'].forEach(e=>addEventListener(e,unlock,{passive:true}));
{const __iv=setInterval(tryAudio,300);cleanups.push(()=>clearInterval(__iv))}
addDoc('visibilitychange',()=>{if(!started||ended)return;if(document.hidden){setPlay(false);AC&&AC.suspend()}else{setPlay(true);tryAudio()}});

const U={name:'Player',photo:''};
const SIL='<svg width="22" height="22" viewBox="0 0 24 24" fill="#8a95a9"><circle cx="12" cy="8.5" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z"/></svg>';
function dispName(){const full=[U.first,U.last].filter(Boolean).join(' ')||U.name||'',un=U.username||'';return full.length>14&&un?'@'+un:(full||(un?'@'+un:'Player'))}
function paint(){const e=$('hav');if(!e)return;e.innerHTML=U.photo?'':SIL;e.style.backgroundImage=U.photo?`url("${U.photo.replace(/"/g,'%22')}")`:'';const nm=$('hnm');if(nm)nm.textContent=dispName()}
function setSpinUser(o){Object.assign(U,o||{});paint();if(U.photo){const im=new Image();im.onerror=()=>{U.photo='';paint()};im.src=U.photo}}
(function(){
  try{Telegram.WebApp.ready();Telegram.WebApp.expand()}catch(e){}
  const q=new URLSearchParams(location.search);
  const su=window.SPIN_USER||{};
  const tg=(window.Telegram&&Telegram.WebApp&&Telegram.WebApp.initDataUnsafe&&Telegram.WebApp.initDataUnsafe.user)||{};
  const iu=initialUser||{};
  setSpinUser({
    first:iu.firstName||q.get('name')||su.name||tg.first_name||'',
    last:iu.lastName||(iu.firstName?'':q.get('name')||su.name?'':tg.last_name||''),
    username:iu.telegramUsername||q.get('username')||su.username||tg.username||'',
    photo:iu.photoUrl||q.get('photo')||su.photo||tg.photo_url||''
  });
})();
addEventListener('dragover',e=>e.preventDefault());
addEventListener('drop',e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&/^image/.test(f.type)){const r=new FileReader();r.onload=()=>setSpinUser({photo:r.result});r.readAsDataURL(f)}});
Object.assign(sfx,{tick:p=>{tone(820+760*p,.05,'sine',.055);nz(.01,.02,6000)},key:()=>{tone(1900+Math.random()*500,.03,'square',.02);nz(.015,.03,5000)},done:()=>{bell(783.99,.1);bell(1174.7,.09,.1)},swipe:()=>nz(.55,.1,500,{to:2600,a:.2,wet:1}),notif:()=>{bell(1318.5,.09);bell(1760,.08,.12)}});
const DP=$('dp'),WB=$('wb'),WD=$('wd'),WI=$('wi'),WAT=$('wat'),WPA=$('wpa'),WA=$('wa'),WAM=$('wam'),WMX=$('wmx'),WBT=$('wbt'),WBB=$('wbb'),WBL=$('wbl'),WG2=$('wg2'),WSP=$('wsp'),WOK=$('wok'),WCK=$('wck'),TK=$('tk'),TKN=$('tkn'),
 ST2=[...root.querySelectorAll('.st')],CH=[...root.querySelectorAll('.ch')];
const ADR='UQCz7mKfV3xHt9LqPn2WdYb8RaJe5sGoNc4uXiT1vAyMrEk6',NT=['TRC20','BEP20','TON'],FEE=[1,.8,.3],ETA=['~ 1 min','~ 20 sec','~ 10 sec'];
const TK2=[[13.25,338,Hd-30],[14,98,PT+44],[15.6,293,415],[16.15,110,483],[18.7,318,309],[19.9,182,720]];
let lastN=0,nextCoin2=0,nextTick=0,wSt=0;
function fpos(){let i=1;while(i<TK2.length-1&&t>=TK2[i][0]+.12)i++;const a=TK2[i-1],b=TK2[i],s=i==1?b[0]-.85:Math.max(a[0]+.25,b[0]-.75),p=sm(seg(t,s,b[0]-.12));return[a[1]+(b[1]-a[1])*p,a[2]+(b[2]-a[2])*p]}
const AI=document.createElement('div');AI.id='ain';{const ap_=$('app');[...ap_.children].filter(e=>!['tk','tkn','hs','fg2'].includes(e.id)).forEach(e=>AI.appendChild(e));ap_.insertBefore(AI,ap_.firstChild)}
const ec=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2,PW=$('pw'),PWR=$('pwr'),PWG=$('pwg'),PWC=$('pwc'),PWK=$('pwk'),PWT=$('pwt'),PWL=$('pwl'),PWS=$('pws'),PWP=$('pwp');
const HU=$('hu'),HS=$('hs'),HTI=$('hti'),FG2=$('fg2'),IX=224.7,IY=376;
function ext(){
 {const cs=t>=12.9?1:0;if(cs!==wSt){wSt=cs;if(cs){T[W].className='t void';SP[W].textContent='Claimed';SP[W].style.fontSize='26px';T[W].querySelector('svg').style.display='none';T[W].querySelector('.l').textContent='Prize collected'}else setLabels(CSK)}}
 {const hu=eo(seg(t,-.3,.4));css(HU,'opacity',hu.toFixed(3));css(HU,'transform',`translate(-50%,${((1-hu)*-10).toFixed(1)}px)`)}
 {const pa=sm(seg(t,21.65,22.3)),pd=seg(t,25.3,25.45),rem=300*(1-sm(seg(t,22.3,25.3))),sc=Math.round(rem),dn=t>=25.3;
 css(PW,'opacity',pa.toFixed(3));css(PW,'visibility',pa>0?'visible':'hidden');txt(PWT,String(Math.floor(sc/60)).padStart(2,'0')+':'+String(sc%60).padStart(2,'0'));
 css(PWR,'strokeDashoffset',(251.3*(1-rem/300)).toFixed(1));PWG.setAttribute('transform',`rotate(${(rem*6).toFixed(1)} 48 48)`);css(PWC,'opacity',(1-pd).toFixed(3));css(PWK,'opacity',pd.toFixed(3));css(PWK,'strokeDashoffset',(60*(1-eo(seg(t,25.3,25.8)))).toFixed(1));
 txt(PWL,dn?'Withdrawal completed':'Processing withdrawal');txt(PWS,dn?'Your funds have arrived':'Funds usually arrive in a few minutes');txt(PWP,'TON network · '+(PZ-.3).toFixed(2)+' USDT')}
 const lw=seg(t,11.9,13.1),dz=sm(seg(t,11.9,13)),gi=ec(seg(t,WT,WT+.9)),bo=sm(seg(t,WT,WT+.6))*(1-sm(seg(t,12.8,13.45)));
 if(t<WT-1)WCs=0;if(t>=WT-.05&&!WCs){WCs=1;WC.className=T[W].className;WC.style.backgroundImage=getComputedStyle(T[W]).backgroundImage;WC.innerHTML=T[W].innerHTML;WCI=WC.querySelector('.shn i')}
 const wv=t>=WT-.05?1:0;css(WC,'visibility',wv?'visible':'hidden');css(WC,'opacity',(wv*(1-dz*dz)).toFixed(3));css(WC,'transform',`translate3d(0,${(-8*gi).toFixed(2)}px,0) scale(${(1+.42*gi+.07*dz).toFixed(4)})`);
 css(T[W],'opacity',t<WT-.05?'1':t<13?'0':eo(seg(t,13,13.7)).toFixed(3));if(WCI)css(WCI,'transform',`translate3d(${(-160+520*sm(seg(t,WT+.3,WT+1.5))).toFixed(1)}px,0,0) skewX(-18deg)`);
 css(BL,'opacity',bo.toFixed(3));css(BL,'visibility',bo>0?'visible':'hidden');
 css(LT,'opacity',Math.min(1,.85*sm(seg(t,WT,WT+.7))*(1-dz)+.7*Math.sin(Math.PI*lw)).toFixed(3));css(LT,'transform',`scale(${(.8+.35*gi+.3*dz).toFixed(3)})`);
 css(SHI,'transform',`translate3d(${(-160+520*sm(seg(t,WT+.15,WT+1.25))).toFixed(1)}px,0,0) skewX(-18deg)`);
 txt(DP,t<13?'Deposit ›':'Withdraw ›');css(DP,'opacity',(t<13?1-sm(seg(t,12.85,13)):sm(seg(t,13,13.15))).toFixed(3));css(DP,'transform',`scale(${(1-.08*pr(14)).toFixed(3)})`);
 const ws=eo4(seg(t,14.05,14.85));css(WD,'transform',`translate3d(0,${((1-ws)*620).toFixed(1)}px,0)`);css(WB,'opacity',(.5*ws).toFixed(3));
 ST2.forEach((el,i)=>{const p=eo(seg(t,14.3+i*.04,14.85+i*.04));css(el,'opacity',p.toFixed(3));css(el,'transform',`translate3d(0,${((1-p)*16).toFixed(1)}px,0)`)});
 const xi=sm(seg(t,15.65,16.05))*2,net=t>=15.7?2:0;css(WI,'transform',`translate3d(${(xi*111).toFixed(2)}px,0,0)`);CH.forEach((c,i)=>css(c,'opacity',(.5+.5*cl(1-Math.abs(xi-i))).toFixed(3)));
 const n=Math.floor(48*seg(t,16.3,18.2)),foc=t>=16.15&&t<18.65,cr=foc&&(t*1.8%1<.55)?'1':'0';
 if(WAT._cr!==cr){WAT._cr=cr;WAT.style.setProperty('--cr',cr)}
 txt(WAT,n?ADR.slice(0,n):'Enter '+NT[net]+' address');css(WAT,'color',n?'#fff':'#5d6a82');txt(WPA,n>=48?'✓':'Paste');css(WPA,'color',n>=48?'#46C67D':'#3E9BEA');
 css(WA,'background',foc?'#17233a':'#121c30');
 const am=PZ*eo(seg(t,18.78,19.3));txt(WAM,String(Math.round(am)));css(WAM,'color',am>0?'#fff':'#5d6a82');css(WMX,'transform',`scale(${(1-.1*pr(18.7)).toFixed(3)})`);
 txt($('wnt'),NT[net]);txt($('wfe'),FEE[net].toFixed(2)+' USDT');txt($('wtm'),ETA[net]);txt($('wrc'),Math.max(0,am-FEE[net]).toFixed(2)+' USDT');
 const be=sm(seg(t,18.78,19.1));css(WBB,'opacity',be.toFixed(3));txt(WBL,am>0?'Withdraw '+Math.round(am)+' USDT':'Withdraw');css(WBL,'color',be>.5?'#fff':'#5d6a82');css(WBL,'opacity',(1-seg(t,19.95,20.1)).toFixed(3));
 css(WBT,'transform',`scale(${(1-.035*pr(19.9)).toFixed(3)})`);css(WSP,'opacity',(seg(t,20,20.15)*(1-seg(t,20.95,21.05))).toFixed(3));css(WSP,'transform',`rotate(${(t*620%360).toFixed(1)}deg)`);
 css(WG2,'opacity',sm(seg(t,21,21.3)).toFixed(3));css(WOK,'opacity',seg(t,21.05,21.2).toFixed(3));css(WCK,'strokeDashoffset',(22*(1-eo(seg(t,21.05,21.45)))).toFixed(2));
 if(t>=5){const[fx,fy]=fpos(),fp=Math.max(pr(14),pr(15.6),pr(16.15),pr(18.7),pr(19.9));css(E.fg,'opacity',(seg(t,13.2,13.5)*(1-seg(t,20.2,20.5))).toFixed(3));css(E.fg,'transform',`translate3d(${fx.toFixed(2)}px,${fy.toFixed(2)}px,0) scale(${(1-.16*fp).toFixed(3)})`)}
 const ap=ec(seg(t,25.95,26.75)),tp=eo4(seg(t,27.75,28.6)),hv=eo(seg(t,25.95,26.45))*(1-sm(seg(t,28.45,28.7)));
 css(AI,'transform',`translate3d(0,${(ap*20).toFixed(2)}px,0) scale(${(1-.14*ap).toFixed(4)})`);css(AI,'opacity',(1-ap).toFixed(3));css(AI,'borderRadius',(44*ap).toFixed(1)+'px');css(AI,'visibility',ap>=1?'hidden':'visible');
 css(HS,'opacity',hv.toFixed(3));css(HS,'visibility',hv>0?'visible':'hidden');css(HS,'transform',`scale(${((1.12-.12*eo(seg(t,25.95,26.75)))*(1-.07*tp)).toFixed(4)})`);css(HTI,'transform',`scale(${(1-.12*pr(27.55)).toFixed(3)})`);
 {const fa2=seg(t,26.85,27.15)*(1-seg(t,27.85,28.15)),f2=sm(seg(t,26.85,27.45));css(FG2,'opacity',fa2.toFixed(3));css(FG2,'transform',`translate3d(${(330+(IX-330)*f2).toFixed(2)}px,${(Hd-60+(IY+8-(Hd-60))*f2).toFixed(2)}px,0) scale(${(1-.16*pr(27.55)).toFixed(3)})`)}
 css(TK,'transform',`translate3d(${((IX-182)*(1-tp)).toFixed(2)}px,${((IY-394.5)*(1-tp)).toFixed(2)}px,0) scale(${(.165+.835*tp).toFixed(4)})`);css(TK,'opacity',Math.min(1,tp*4).toFixed(3));css(TK,'borderRadius',(90*(1-tp)).toFixed(1)+'px');css(TK,'visibility',tp>0?'visible':'hidden');
 const ar=eo(seg(t,29.45,30.9)),u=(PZ-.3)*ar;txt($('tkb'),'$'+(2.32+u).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
 const re=sm(seg(t,29.35,30));css($('tku'),'height',(72*re).toFixed(1)+'px');css($('tku'),'opacity',re.toFixed(3));txt($('tkua'),u.toFixed(2));txt($('tkuf'),'$'+u.toFixed(2));
 css($('tkfl'),'opacity',(.07*seg(t,29.8,30.1)*(1-seg(t,30.1,31.5))).toFixed(3));
 const h1=sm(seg(t,30.3,30.9));css($('tkh'),'height',(80*h1).toFixed(1)+'px');css($('tki'),'opacity',h1.toFixed(3));css($('tki'),'transform',`translate3d(0,${((1-h1)*14).toFixed(1)}px,0)`);
 const ni=seg(t,29.2,29.8),no=sm(seg(t,32.3,32.8));css(TKN,'transform',`translate3d(0,${(-140+140*bk(ni)-140*no).toFixed(1)}px,0)`);css(TKN,'opacity',ni>0&&no<1?'1':'0');
 if(on()&&playing){if(n!==lastN){if(n>lastN)sfx.key();lastN=n}
  if(t>=29.3&&t<=30.9){if(nextCoin2<29.3)nextCoin2=29.3;if(t>=nextCoin2){sfx.coin(Math.round((t-29.3)*14));nextCoin2+=.07}}else nextCoin2=0}else lastN=n;
 if(on()&&playing){if(t>=22.3&&t<25.3){const p=seg(t,22.3,25.3);if(nextTick<22.3)nextTick=22.3;if(t>=nextTick){sfx.tick(p);nextTick+=.22-.13*p}}else nextTick=0}
}
requestAnimationFrame(loop);
if(reduce){setTimeout(finish,0)}
if(!reduce){initAudio();tryAudio();Promise.race([Promise.all([document.fonts.load('700 32px Roboto'),PRE]),new Promise(r=>setTimeout(r,500))]).then(()=>requestAnimationFrame(()=>{if(!dead)start()}))}


  const maxSafetyTimeout = setTimeout(() => {
    if (!fin && !dead) finish();
  }, 36000);
  cleanups.push(() => clearTimeout(maxSafetyTimeout));

  return () => {
    dead = true;
    cleanups.forEach((fn) => fn());
    try { if (AC && AC.close) AC.close().catch(() => {}); } catch (e) {}
  };
}

export default function SpinWin({ children, onFinish, user }: SpinWinProps) {
  const [done, setDone] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const gbRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stopFnRef = useRef<(() => void) | null>(null);
  const cb = useRef(onFinish);
  cb.current = onFinish;

  const handleSkip = () => {
    if (isSkipping || done) return;
    setIsSkipping(true);
    // Instant stop of heavy audio and loops to eliminate any frame lag
    if (stopFnRef.current) {
      try { stopFnRef.current(); } catch (e) {}
    }
    // Clean quick exit transition
    setTimeout(() => {
      setDone(true);
      cb.current?.();
    }, 220);
  };

  useLayoutEffect(() => {
    if (done) return;
    const host = hostRef.current;
    const gb = gbRef.current;
    if (!host || !gb) return;
    host.innerHTML = HTML;
    const stop = runSpinWin(
      host,
      gb,
      () => {
        setDone(true);
        cb.current?.();
      },
      () => {},
      user
    );
    stopFnRef.current = stop;
    return () => {
      stop();
      if (host) host.innerHTML = '';
    };
  }, [done, user]);

  return (
    <>
      {children}
      {!done && (
        <div
          ref={rootRef}
          className="sw-root"
          style={{
            opacity: isSkipping ? 0 : 1,
            transform: isSkipping ? 'scale(0.98)' : 'none',
            transition: 'opacity 0.22s ease-out, transform 0.22s ease-out',
            pointerEvents: isSkipping ? 'none' : 'auto',
          }}
        >
          <style>{CSS}</style>
          <div className="sw-gbg" ref={gbRef} />
          <div className="sw-host" ref={hostRef} />

          {/* Clean, Lightweight & Non-Laggy Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip"
            style={{
              position: 'fixed',
              top: 'calc(14px + env(safe-area-inset-top, 0px))',
              right: '16px',
              zIndex: 2147483002,
              background: 'rgba(20, 24, 35, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f1f5f9',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.3px',
              fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              transition: 'opacity 0.15s ease',
            }}
          >
            <span>Skip</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.8 }}
            >
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
