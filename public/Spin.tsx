// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { StoryReferralModal } from "../components/StoryReferralModal";
import { rewardReferrerCommission } from "../services/systemService";

const CSS = `:host{display:block;width:100%;height:100%}
.spin-root{
  --w:clamp(300px, 100vw, 440px);
  --u:calc(var(--w)/63.9);
  --tk:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 242 160' preserveAspectRatio='none'%3E%3Cpath d='M24.45,1.5H217.55A24.5,24.5 0 0 0 240.5,24.45L240.5,36.3C238.0,36.3 236,37.5 236,39.5L236,42.5C236,44.5 238.0,45.7 240.5,45.7L240.5,55.8C238.0,55.8 236,57.0 236,59.0L236,62.0C236,64.0 238.0,65.2 240.5,65.2L240.5,75.3C238.0,75.3 236,76.5 236,78.5L236,81.5C236,83.5 238.0,84.7 240.5,84.7L240.5,94.8C238.0,94.8 236,96.0 236,98.0L236,101.0C236,103.0 238.0,104.2 240.5,104.2L240.5,114.3C238.0,114.3 236,115.5 236,117.5L236,120.5C236,122.5 238.0,123.7 240.5,123.7L240.5,135.55A24.5,24.5 0 0 0 217.55,158.5H24.45A24.5,24.5 0 0 0 1.5,135.55L1.5,123.7C4.0,123.7 6,122.5 6,120.5L6,117.5C6,115.5 4.0,114.3 1.5,114.3L1.5,104.2C4.0,104.2 6,103.0 6,101.0L6,98.0C6,96.0 4.0,94.8 1.5,94.8L1.5,84.7C4.0,84.7 6,83.5 6,81.5L6,78.5C6,76.5 4.0,75.3 1.5,75.3L1.5,65.2C4.0,65.2 6,64.0 6,62.0L6,59.0C6,57.0 4.0,55.8 1.5,55.8L1.5,45.7C4.0,45.7 6,44.5 6,42.5L6,39.5C6,37.5 4.0,36.3 1.5,36.3L1.5,24.45A24.5,24.5 0 0 0 24.45,1.5Z' fill='%23000' stroke='%23000' stroke-width='3' stroke-linejoin='round'/%3E%3C/svg%3E");
  --rim:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 242 160' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23fff' stop-opacity='.6'/%3E%3Cstop offset='.35' stop-color='%23fff' stop-opacity='.1'/%3E%3Cstop offset='.7' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='.3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M24.45,1.5H217.55A24.5,24.5 0 0 0 240.5,24.45L240.5,36.3C238.0,36.3 236,37.5 236,39.5L236,42.5C236,44.5 238.0,45.7 240.5,45.7L240.5,55.8C238.0,55.8 236,57.0 236,59.0L236,62.0C236,64.0 238.0,65.2 240.5,65.2L240.5,75.3C238.0,75.3 236,76.5 236,78.5L236,81.5C236,83.5 238.0,84.7 240.5,84.7L240.5,94.8C238.0,94.8 236,96.0 236,98.0L236,101.0C236,103.0 238.0,104.2 240.5,104.2L240.5,114.3C238.0,114.3 236,115.5 236,117.5L236,120.5C236,122.5 238.0,123.7 240.5,123.7L240.5,135.55A24.5,24.5 0 0 0 217.55,158.5H24.45A24.5,24.5 0 0 0 1.5,135.55L1.5,123.7C4.0,123.7 6,122.5 6,120.5L6,117.5C6,115.5 4.0,114.3 1.5,114.3L1.5,104.2C4.0,104.2 6,103.0 6,101.0L6,98.0C6,96.0 4.0,94.8 1.5,94.8L1.5,84.7C4.0,84.7 6,83.5 6,81.5L6,78.5C6,76.5 4.0,75.3 1.5,75.3L1.5,65.2C4.0,65.2 6,64.0 6,62.0L6,59.0C6,57.0 4.0,55.8 1.5,55.8L1.5,45.7C4.0,45.7 6,44.5 6,42.5L6,39.5C6,37.5 4.0,36.3 1.5,36.3L1.5,24.45A24.5,24.5 0 0 0 24.45,1.5Z' fill='none' stroke='url(%23g)' stroke-width='3' stroke-linejoin='round'/%3E%3C/svg%3E");
  position:relative;width:100%;height:100%;display:flex;direction:ltr;justify-content:center;overflow:hidden;isolation:isolate;
  background-color:#000000;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420' viewBox='0 0 420 420'%3E%3Cdefs%3E%3Cpath id='i0' d='M0-20V20M-17-10L17 10M-17 10L17-10M-5-16L0-12L5-16M-5 16L0 12L5 16M-14-7L-8-7M14 7L8 7'/%3E%3Cpath id='i1' d='M0-20C2-6 6-2 20 0C6 2 2 6 0 20C-2 6-6 2-20 0C-6-2-2-6 0-20Z'/%3E%3Cpath id='i2' d='M-16-4H16V18H-16ZM-18-12H18V-4H-18ZM0-12V18M0-12C-6-24-16-18-8-12M0-12C6-24 16-18 8-12'/%3E%3Cpath id='i3' d='M0-20L11-5H5L15 9H-15L-5-5H-11ZM0 9V19M-4-8h.1M4 2h.1'/%3E%3Cpath id='i4' d='M8 20V-8A8 8 0 0 0-8-8M3 14L13 10M3 6L13 2M3-2L13-6'/%3E%3Cpath id='i5' d='M-14 4a14 14 0 1 0 28 0a14 14 0 1 0-28 0M-4-10H4V-6H-4ZM0-10V-16M-12 0Q0 7 12 0'/%3E%3Cpath id='i6' d='M-6-8C-12-26-3-26-3-8M6-8C12-26 3-26 3-8M-12 4a12 12 0 1 0 24 0a12 12 0 1 0-24 0M-4 2h.1M4 2h.1M-1.5 8h3'/%3E%3Cpath id='i7' d='M-12-8H8V14Q8 18 4 18H-8Q-12 18-12 14ZM8-4H13Q17-4 17 2Q17 8 8 8M-6-16Q-3-12-6-9M2-16Q5-12 2-9'/%3E%3Cpath id='i8' d='M-5-14a5 5 0 1 0 10 0a5 5 0 1 0-10 0M-5-9L-16-6V-1L-6-3L-8 6L-14 18H-7L0 10L7 18H14L8 6L6-3L16-1V-6L5-9M-2-15h.1M2-15h.1'/%3E%3Cpath id='i9' d='M-15 12H15M-13 12L-4-14L10-8Q14 0 14 12M6-8a4 4 0 1 0 8 0a4 4 0 1 0-8 0'/%3E%3Cpath id='i10' d='M-12-4a12 12 0 1 0 24 0a12 12 0 1 0-24 0M-6-4a6 6 0 1 0 12 0a6 6 0 1 0-12 0M0 8V22'/%3E%3Cpath id='i11' d='M-20 2L18-8L12 8L2 4L-2 14L-6 4ZM18-8L-6 4'/%3E%3Cpath id='i12' d='M8-16A16 16 0 1 0 16 8A12 12 0 0 1 8-16ZM12-4h.1'/%3E%3Cpath id='i13' d='M0 16C-22 0-12-18 0-6C12-18 22 0 0 16Z'/%3E%3Cpath id='i14' d='M-18 14Q0 0 18-14M-6 6Q-14 0-10-10Q-4-6-6 6M4-2Q12 4 14 12Q6 12 4-2M-2 3Q-2-8 6-12Q8-4-2 3'/%3E%3Cpath id='i15' d='M-14 4a14 14 0 1 0 28 0a14 14 0 1 0-28 0M0-4V4L6 8M-12-14L-8-18M12-14L8-18'/%3E%3C/defs%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.06' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cuse href='%23i0' transform='translate(44 45) rotate(-30) scale(1.15)'/%3E%3Cuse href='%23i5' transform='translate(152 53) rotate(17) scale(1.15)'/%3E%3Cuse href='%23i10' transform='translate(260 46) rotate(4) scale(1.15)'/%3E%3Cuse href='%23i15' transform='translate(368 54) rotate(-9) scale(1.15)'/%3E%3Cuse href='%23i4' transform='translate(108 152) rotate(-22) scale(1.15)'/%3E%3Cuse href='%23i9' transform='translate(216 160) rotate(25) scale(1.15)'/%3E%3Cuse href='%23i14' transform='translate(307 153) rotate(12) scale(1.15)'/%3E%3Cuse href='%23i3' transform='translate(-5 161) rotate(-1) scale(1.15)'/%3E%3Cuse href='%23i3' transform='translate(415 161) rotate(-1) scale(1.15)'/%3E%3Cuse href='%23i8' transform='translate(51 259) rotate(-14) scale(1.15)'/%3E%3Cuse href='%23i13' transform='translate(159 267) rotate(-27) scale(1.15)'/%3E%3Cuse href='%23i2' transform='translate(267 260) rotate(20) scale(1.15)'/%3E%3Cuse href='%23i7' transform='translate(375 268) rotate(7) scale(1.15)'/%3E%3Cuse href='%23i12' transform='translate(98 366) rotate(-6) scale(1.15)'/%3E%3Cuse href='%23i1' transform='translate(206 374) rotate(-19) scale(1.15)'/%3E%3Cuse href='%23i6' transform='translate(314 367) rotate(28) scale(1.15)'/%3E%3Cuse href='%23i11' transform='translate(2 360) rotate(15) scale(1.15)'/%3E%3Cuse href='%23i11' transform='translate(422 360) rotate(15) scale(1.15)'/%3E%3C/g%3E%3C/svg%3E");
  background-size:240px 240px;color:#fff;font-family:Inter,"SF Pro Text",system-ui,sans-serif;overscroll-behavior:none;text-align:left;line-height:normal;box-sizing:border-box
}
.spin-root *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.spin-root button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;padding:0}
.spin-root :focus-visible{outline:calc(.3*var(--u)) solid #7cc4ff;outline-offset:calc(.3*var(--u))}
.spin-root .app{
  position:relative;width:var(--w);height:100%;margin:0 auto;flex:none;
  background-color:#000000;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420' viewBox='0 0 420 420'%3E%3Cdefs%3E%3Cpath id='i0' d='M0-20V20M-17-10L17 10M-17 10L17-10M-5-16L0-12L5-16M-5 16L0 12L5 16M-14-7L-8-7M14 7L8 7'/%3E%3Cpath id='i1' d='M0-20C2-6 6-2 20 0C6 2 2 6 0 20C-2 6-6 2-20 0C-6-2-2-6 0-20Z'/%3E%3Cpath id='i2' d='M-16-4H16V18H-16ZM-18-12H18V-4H-18ZM0-12V18M0-12C-6-24-16-18-8-12M0-12C6-24 16-18 8-12'/%3E%3Cpath id='i3' d='M0-20L11-5H5L15 9H-15L-5-5H-11ZM0 9V19M-4-8h.1M4 2h.1'/%3E%3Cpath id='i4' d='M8 20V-8A8 8 0 0 0-8-8M3 14L13 10M3 6L13 2M3-2L13-6'/%3E%3Cpath id='i5' d='M-14 4a14 14 0 1 0 28 0a14 14 0 1 0-28 0M-4-10H4V-6H-4ZM0-10V-16M-12 0Q0 7 12 0'/%3E%3Cpath id='i6' d='M-6-8C-12-26-3-26-3-8M6-8C12-26 3-26 3-8M-12 4a12 12 0 1 0 24 0a12 12 0 1 0-24 0M-4 2h.1M4 2h.1M-1.5 8h3'/%3E%3Cpath id='i7' d='M-12-8H8V14Q8 18 4 18H-8Q-12 18-12 14ZM8-4H13Q17-4 17 2Q17 8 8 8M-6-16Q-3-12-6-9M2-16Q5-12 2-9'/%3E%3Cpath id='i8' d='M-5-14a5 5 0 1 0 10 0a5 5 0 1 0-10 0M-5-9L-16-6V-1L-6-3L-8 6L-14 18H-7L0 10L7 18H14L8 6L6-3L16-1V-6L5-9M-2-15h.1M2-15h.1'/%3E%3Cpath id='i9' d='M-15 12H15M-13 12L-4-14L10-8Q14 0 14 12M6-8a4 4 0 1 0 8 0a4 4 0 1 0-8 0'/%3E%3Cpath id='i10' d='M-12-4a12 12 0 1 0 24 0a12 12 0 1 0-24 0M-6-4a6 6 0 1 0 12 0a6 6 0 1 0-12 0M0 8V22'/%3E%3Cpath id='i11' d='M-20 2L18-8L12 8L2 4L-2 14L-6 4ZM18-8L-6 4'/%3E%3Cpath id='i12' d='M8-16A16 16 0 1 0 16 8A12 12 0 0 1 8-16ZM12-4h.1'/%3E%3Cpath id='i13' d='M0 16C-22 0-12-18 0-6C12-18 22 0 0 16Z'/%3E%3Cpath id='i14' d='M-18 14Q0 0 18-14M-6 6Q-14 0-10-10Q-4-6-6 6M4-2Q12 4 14 12Q6 12 4-2M-2 3Q-2-8 6-12Q8-4-2 3'/%3E%3Cpath id='i15' d='M-14 4a14 14 0 1 0 28 0a14 14 0 1 0-28 0M0-4V4L6 8M-12-14L-8-18M12-14L8-18'/%3E%3C/defs%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.06' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cuse href='%23i0' transform='translate(44 45) rotate(-30) scale(1.15)'/%3E%3Cuse href='%23i5' transform='translate(152 53) rotate(17) scale(1.15)'/%3E%3Cuse href='%23i10' transform='translate(260 46) rotate(4) scale(1.15)'/%3E%3Cuse href='%23i15' transform='translate(368 54) rotate(-9) scale(1.15)'/%3E%3Cuse href='%23i4' transform='translate(108 152) rotate(-22) scale(1.15)'/%3E%3Cuse href='%23i9' transform='translate(216 160) rotate(25) scale(1.15)'/%3E%3Cuse href='%23i14' transform='translate(307 153) rotate(12) scale(1.15)'/%3E%3Cuse href='%23i3' transform='translate(-5 161) rotate(-1) scale(1.15)'/%3E%3Cuse href='%23i3' transform='translate(415 161) rotate(-1) scale(1.15)'/%3E%3Cuse href='%23i8' transform='translate(51 259) rotate(-14) scale(1.15)'/%3E%3Cuse href='%23i13' transform='translate(159 267) rotate(-27) scale(1.15)'/%3E%3Cuse href='%23i2' transform='translate(267 260) rotate(20) scale(1.15)'/%3E%3Cuse href='%23i7' transform='translate(375 268) rotate(7) scale(1.15)'/%3E%3Cuse href='%23i12' transform='translate(98 366) rotate(-6) scale(1.15)'/%3E%3Cuse href='%23i1' transform='translate(206 374) rotate(-19) scale(1.15)'/%3E%3Cuse href='%23i6' transform='translate(314 367) rotate(28) scale(1.15)'/%3E%3Cuse href='%23i11' transform='translate(2 360) rotate(15) scale(1.15)'/%3E%3Cuse href='%23i11' transform='translate(422 360) rotate(15) scale(1.15)'/%3E%3C/g%3E%3C/svg%3E");
  background-size:240px 240px;
  display:grid;grid-template-rows:1fr auto;overflow:hidden;isolation:isolate;padding-top:env(safe-area-inset-top,0px)
}
.spin-root .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.spin-root #reel-mount{position:relative;min-height:0;z-index:1}
.spin-root .reel{position:absolute;inset:0;overflow:hidden;--grow:0;contain:layout paint}
.spin-root .reel__track{position:absolute;left:0;right:0;top:calc(50% - calc(73.85*var(--u)));will-change:transform;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.spin-root .slot{height:calc(21.1*var(--u));display:grid;place-items:center}
.spin-root .reel__track > .slot:first-child .ticket,
.spin-root .reel__track > .slot:last-child .ticket{opacity:.35;transform:scale(.92)}
.spin-root .reel__track > .slot:nth-child(2) .ticket,
.spin-root .reel__track > .slot:nth-child(6) .ticket{opacity:.88;transform:scale(.96)}
.spin-root .reel__track > .slot:nth-child(3) .ticket,
.spin-root .reel__track > .slot:nth-child(5) .ticket{opacity:.97;transform:scale(.99)}
.spin-root .reel__track > .slot:nth-child(4) .ticket.is-focus{opacity:1;transform:scale(calc(1.08 + var(--grow) + var(--bonus)));z-index:3}
.spin-root .reel__fog{position:absolute;left:0;right:0;height:24%;z-index:4;pointer-events:none}
.spin-root .reel__fog--top{top:0;background:linear-gradient(180deg,#000000 0%,rgba(0,0,0,.85) 30%,rgba(0,0,0,.15) 80%,transparent 100%)}
.spin-root .reel__fog--bottom{bottom:0;background:linear-gradient(0deg,#000000 0%,rgba(0,0,0,.85) 30%,rgba(0,0,0,.15) 80%,transparent 100%)}

.spin-root .back-btn{
  position:absolute;
  top:calc(env(safe-area-inset-top, 12px) + calc(1.4*var(--u)));
  left:calc(2*var(--u));
  z-index:20;
  width:max(42px,calc(5.4*var(--u)));
  height:max(42px,calc(5.4*var(--u)));
  display:grid;
  place-items:center;
  border-radius:calc(1.6*var(--u));
  color:#fff;
  background:rgba(255,255,255,.12);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.16);
  box-shadow:0 4px 16px rgba(0,0,0,.45);
  transition:background .2s,transform .15s;
  cursor:pointer;
}
.spin-root .back-btn:hover{background:rgba(255,255,255,.22)}
.spin-root .back-btn:active{transform:scale(.92)}
.spin-root .back-btn svg{width:calc(2.6*var(--u));height:calc(2.6*var(--u))}

.spin-root .sound{
  position:absolute;
  top:calc(env(safe-area-inset-top, 12px) + calc(1.4*var(--u)));
  right:calc(2*var(--u));
  z-index:20;
  width:max(42px,calc(5.4*var(--u)));
  height:max(42px,calc(5.4*var(--u)));
  display:grid;
  place-items:center;
  border-radius:50%;
  color:#8aa4b8;
  background:rgba(255,255,255,.07);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.12);
  transition:background .2s,color .2s,transform .15s;
  cursor:pointer;
}
.spin-root .sound:hover{background:rgba(255,255,255,.14)}
.spin-root .sound:active{transform:scale(.9)}
.spin-root .sound[aria-pressed=true]{color:#7fc4f5}
.spin-root .sound svg{width:calc(2.6*var(--u));height:calc(2.6*var(--u))}

.spin-root .nav{position:absolute;top:50%;translate:0 -50%;z-index:5;width:calc(7*var(--u));height:calc(9*var(--u));display:grid;place-items:center;border-radius:calc(2*var(--u));transition:transform .2s,opacity .3s}
.spin-root .nav--prev{left:calc(3.4*var(--u))}
.spin-root .nav--next{right:calc(3.4*var(--u))}
.spin-root .nav svg{width:calc(3.9*var(--u));height:calc(5.2*var(--u))}
.spin-root .nav:hover{transform:scale(1.1)}
.spin-root .nav:active{transform:scale(.92)}
.spin-root .nav:disabled{opacity:.35;cursor:default}
.spin-root .ticket{
  --c1:#4aa8f0;--c2:#269BE8;--c3:#1673b8;--ink:rgba(10,50,85,.9);--bonus:0;
  position:relative;width:calc(24.2*var(--u));height:calc(16*var(--u));
  transform:scale(1);transition:transform .35s cubic-bezier(.25,1,.5,1);
}
.spin-root .ticket[data-tier=blue]{--c1:#4aa8f0;--c2:#269BE8;--c3:#1673b8;--ink:rgba(10,50,85,.9);--bonus:0}
.spin-root .ticket[data-tier=gold]{--c1:#f7df82;--c2:#EBC341;--c3:#c99a22;--ink:rgba(70,48,6,.9);--bonus:.05}
.spin-root .ticket[data-tier=teal]{--c1:#52d9d6;--c2:#18B8B5;--c3:#0e8d8d;--ink:rgba(8,65,65,.9)}
.spin-root .ticket[data-tier=pink]{--c1:#f58abf;--c2:#E94E9B;--c3:#bf2f78;--ink:rgba(90,12,50,.9)}
.spin-root .ticket[data-tier=violet]{--c1:#ab8dfa;--c2:#8B5CF6;--c3:#6a3fd6;--ink:rgba(40,15,95,.9)}
.spin-root .ticket[data-tier=orange]{--c1:#ffb760;--c2:#F28C28;--c3:#d06a10;--ink:rgba(85,38,0,.9)}
.spin-root .ticket[data-tier=green]{--c1:#74dd94;--c2:#3DBE6B;--c3:#269a52;--ink:rgba(6,60,30,.9)}
.spin-root .ticket[data-tier=gray]{--c1:#64748b;--c2:#475569;--c3:#334155;--ink:rgba(226,232,240,.9)}
.spin-root .ticket.is-focus{transform:scale(calc(1.08 + var(--grow) + var(--bonus)));z-index:3}
.spin-root .ticket__body{
  position:absolute;inset:0;border-radius:calc(1*var(--u));
  background:var(--rim) center/100% 100% no-repeat,linear-gradient(180deg,var(--c1),var(--c2) 46%,var(--c3));
  --m:var(--tk) center/100% 100% no-repeat;
  -webkit-mask:var(--m);mask:var(--m);
}
.spin-root .ticket__frame{
  position:absolute;inset:calc(2.1*var(--u));border-radius:calc(1.3*var(--u));
  border:calc(.2*var(--u)) solid rgba(0,0,0,.12);
  background:linear-gradient(rgba(255,255,255,.15),rgba(255,255,255,0));
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(.4*var(--u));color:var(--ink)
}
.spin-root .ticket__amount{display:flex;align-items:center;gap:calc(var(--cn,calc(5.6*var(--u)))*.22)}
.spin-root .ticket__amount b{
  font-size:var(--fs,calc(5.4*var(--u)));font-weight:800;letter-spacing:-.035em;line-height:1;
  white-space:nowrap;font-variant-numeric:tabular-nums lining-nums;
  transition:font-size .25s ease
}
.spin-root .ticket__frame>span{font-size:calc(2.1*var(--u));font-weight:600;line-height:1;letter-spacing:.01em}
.spin-root .coin{
  width:var(--cn,calc(5.6*var(--u)));height:var(--cn,calc(5.6*var(--u)));flex:none;
  filter:none;
}
.spin-root .ticket[data-tier=gold].is-vip{--c1:#fff0b0;--c2:#f4b92b;--c3:#b4700c;--ink:rgba(72,36,0,.92)}
.spin-root .is-vip .ticket__frame{border-color:rgba(255,248,205,.6)}
.spin-root .vip{position:absolute;left:50%;top:calc(-1.5*var(--u));translate:-50% 0;z-index:4;display:flex;align-items:center;padding:calc(.5*var(--u)) calc(1.4*var(--u));border-radius:calc(1.5*var(--u));background:#1a1303;color:#ffd96e;font-size:calc(1.8*var(--u));font-weight:800;letter-spacing:.06em;line-height:1;border:calc(.12*var(--u)) solid #e9b838;opacity:0;pointer-events:none}
.spin-root .is-vip .vip{opacity:1}
.spin-root .jackpot{
  position:fixed;inset:0;width:100%;height:100%;z-index:9999;
  display:grid;place-items:center;overflow:hidden;
  opacity:0;visibility:hidden;
  background:rgba(0,0,0,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  transition:opacity .35s cubic-bezier(.25,1,.5,1),visibility .35s ease
}
.spin-root .jackpot.is-on{opacity:1;visibility:visible}
.spin-root .jackpot__label{
  position:absolute;left:0;right:0;top:calc(50% - calc(23*var(--u)));
  margin:0;text-align:center;font-size:max(18px,calc(3*var(--u)));
  font-weight:800;color:#fff;letter-spacing:-.02em;
  opacity:0;transform:translateY(calc(1.2*var(--u)));
  transition:opacity .3s .05s,transform .35s .05s cubic-bezier(.16,1,.3,1);
  z-index:12
}
.spin-root .is-on .jackpot__label{opacity:1;transform:translateY(0)}
.spin-root .jackpot[data-tier=gold] .jackpot__label{color:#ffd96e}
.spin-root .jackpot__card{
  position:relative;transform:scale(.6);opacity:0;
  transition:transform .4s cubic-bezier(.2,1.2,.35,1),opacity .3s ease;
  z-index:10;display:flex;align-items:center;justify-content:center
}
.spin-root .is-on .jackpot__card{transform:scale(1.68);opacity:1}
.spin-root .jackpot .slot{height:auto}
.spin-root .jackpot .ticket,
.spin-root .ticket.is-win{opacity:1 !important;filter:drop-shadow(0 calc(1.5*var(--u)) calc(3.5*var(--u)) rgba(0,0,0,.75))}
.spin-root .jackpot__sub{
  position:absolute;left:0;right:0;top:calc(50% + calc(16*var(--u)));
  margin:0;padding:0 calc(4*var(--u));text-align:center;
  font-size:max(13px,calc(2.2*var(--u)));font-weight:600;color:#f3d890;
  opacity:0;transform:translateY(calc(-.6*var(--u)));
  transition:opacity .3s .15s,transform .3s .15s ease-out;
  z-index:12
}
.spin-root .is-on .jackpot__sub{opacity:1;transform:translateY(0)}
.spin-root .jackpot__close{
  position:absolute;bottom:calc(calc(5.5*var(--u)) + env(safe-area-inset-bottom,16px));
  left:50%;translate:-50% 0;min-height:max(48px,calc(6*var(--u)));
  padding:0 calc(5*var(--u));border-radius:calc(2.4*var(--u));
  background:linear-gradient(180deg,#38b0ff,#1d83dc 60%,#176cc0);
  color:#fff;font-size:max(15px,calc(2.6*var(--u)));font-weight:700;
  opacity:0;transform:translateY(calc(1*var(--u)));
  transition:opacity .3s .2s,transform .3s .2s cubic-bezier(.16,1,.3,1);
  z-index:15;box-shadow:0 8px 24px rgba(30,131,220,.35)
}
.spin-root .is-on .jackpot__close{opacity:1;transform:translateY(0)}
.spin-root .panel{position:relative;z-index:4;background:linear-gradient(180deg,#111b2f 0%,#090f1d 100%);border-radius:calc(3.4*var(--u)) calc(3.4*var(--u)) 0 0;padding:calc(2*var(--u)) calc(2.4*var(--u)) calc(calc(1.8*var(--u)) + env(safe-area-inset-bottom,0px));box-shadow:0 calc(-.1*var(--u)) 0 rgba(255,255,255,.08),0 calc(-2*var(--u)) calc(3*var(--u)) rgba(0,0,0,.85)}
.spin-root .panel__row{display:flex;align-items:center;justify-content:space-between;gap:calc(1*var(--u))}
.spin-root .balance{display:flex;align-items:center;gap:calc(2*var(--u));min-width:0}
.spin-root .balance .coin{width:calc(6.6*var(--u));height:calc(6.6*var(--u))}
.spin-root .balance strong{display:block;font-size:max(13px,calc(2.4*var(--u)));font-weight:700;white-space:nowrap}
.spin-root .balance button{font-size:max(12px,calc(2.2*var(--u)));font-weight:600;color:var(--sky,#4aa8f0);margin-top:calc(.4*var(--u));border-radius:calc(.6*var(--u))}
.spin-root .bet{display:flex;flex-direction:column;align-items:flex-end;gap:calc(.5*var(--u))}
.spin-root .bet__row{display:flex;align-items:center}
.spin-root .bet__step{width:max(38px,calc(6*var(--u)));height:max(38px,calc(6*var(--u)));display:grid;place-items:center;border-radius:50%;color:#4aa8f0;background:rgba(74,168,240,.08);transition:transform .15s,background .2s}
.spin-root .bet__step svg{width:calc(2.6*var(--u));height:calc(2.6*var(--u))}
.spin-root .bet__step:hover{background:rgba(74,168,240,.18)}
.spin-root .bet__step:active{transform:scale(.88)}
.spin-root .bet__step:disabled{opacity:.25;cursor:default}
.spin-root .bet__value{min-width:calc(6.5*var(--u));text-align:center;font-size:max(15px,calc(2.8*var(--u)));font-weight:700;font-variant-numeric:tabular-nums;cursor:pointer;padding:calc(.2*var(--u)) calc(.4*var(--u));border-radius:calc(.6*var(--u));transition:background .2s}
.spin-root .bet__value:hover{background:rgba(74,168,240,.1)}
.spin-root .bet small{font-size:max(11px,calc(2*var(--u)));font-weight:500;color:#94a3b8;white-space:nowrap;padding-right:calc(.3*var(--u))}
.spin-root .actions{display:grid;grid-template-columns:19.7fr 36.9fr;gap:calc(1.8*var(--u));margin-top:calc(1.4*var(--u))}
.spin-root .act{height:max(50px,calc(8.2*var(--u)));border-radius:calc(2.4*var(--u));font-size:max(15px,calc(2.7*var(--u)));font-weight:700;display:flex;align-items:center;justify-content:center;gap:calc(1*var(--u));transition:transform .15s ease,background .25s,box-shadow .25s;box-shadow:inset 0 calc(.1*var(--u)) 0 rgba(255,255,255,.1),0 calc(.4*var(--u)) calc(1.2*var(--u)) rgba(0,0,0,.5);white-space:nowrap}
.spin-root .act:active:not(:disabled){transform:scale(.97)}
.spin-root .auto{background:#162335;color:#3fa6ea}
.spin-root .auto:hover{background:#1e314a}
.spin-root .auto__dot{width:calc(1.1*var(--u));height:calc(1.1*var(--u));border-radius:50%;background:#3a5167;transition:background .25s}
.spin-root .auto[aria-pressed=true]{background:linear-gradient(#1f4a73,#173a5c);color:#a8dcff;box-shadow:inset 0 0 0 calc(.2*var(--u)) #3fa6ea}
.spin-root .spin{background:linear-gradient(180deg,#38b0ff,#1d83dc 60%,#176cc0);color:#fff;box-shadow:inset 0 calc(.15*var(--u)) 0 rgba(255,255,255,.35)}
.spin-root .spin.is-free{background:linear-gradient(180deg,#38b0ff,#1d83dc 60%,#176cc0);color:#fff}
.spin-root .spin:hover:not(:disabled){filter:brightness(1.08)}
.spin-root .spin:disabled{cursor:default;background:linear-gradient(#2a7fbf,#1f67a3);color:#d6ecff;opacity:.7}
.spin-root .referral-strip{display:flex;align-items:center;justify-content:space-between;gap:calc(1*var(--u));margin-top:calc(1.4*var(--u));padding:calc(.9*var(--u)) calc(1.4*var(--u));border-radius:calc(1.8*var(--u));background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.spin-root .referral-strip p{margin:0;font-size:max(11px,calc(1.9*var(--u)));color:#cbd5e1;font-weight:600}
.spin-root .referral-strip .ref-btns{display:flex;gap:calc(.8*var(--u))}
.spin-root .referral-strip button{padding:calc(.5*var(--u)) calc(1.2*var(--u));border-radius:calc(1*var(--u));font-size:max(11px,calc(1.9*var(--u)));font-weight:700;display:flex;align-items:center}
.spin-root .ref-btn-story{background:linear-gradient(#0088cc,#006699);color:#fff}
.spin-root .ref-btn-copy{background:rgba(255,255,255,.1);color:#fff}
`;

const MARKUP = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
<symbol id="usdt" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="#009393"/><path d="M 160 128 H 352 L 438 243 L 258 419 L 74 243 Z" fill="#ffffff" stroke="#ffffff" stroke-width="24" stroke-linejoin="round"/><path fill="#009393" fill-rule="evenodd" d="M 164 258 A 92 25 0 1 0 348 258 A 92 25 0 1 0 164 258 Z M 182 258 A 74 11 0 1 0 330 258 A 74 11 0 1 0 182 258 Z"/><rect x="178" y="177" width="156" height="30" rx="4" fill="#009393"/><rect x="236" y="177" width="40" height="159" rx="4" fill="#009393"/></symbol>
</defs>
</svg>

<main class="app" id="app">
<button class="back-btn" id="spin-back-btn" type="button" aria-label="Go back">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 19l-7-7 7-7"/>
  </svg>
</button>
<div id="reel-mount"></div>
<div id="panel-mount"></div>
<div class="sr" aria-live="polite" id="announce"></div>
<div class="jackpot" id="jackpot" role="dialog" aria-modal="true" aria-label="Prize won" aria-hidden="true"><p class="jackpot__label"></p><div class="jackpot__card"></div><p class="jackpot__sub"></p><button class="jackpot__close" type="button">Claim & Continue</button></div>
<slot></slot>
</main>`;

type SpinProps = {
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
};

export function Spin({ className, style, height }: SpinProps) {
  const host = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, creditUserBalance } = useAuth();
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const openStoryRef = useRef(() => setIsStoryModalOpen(true));
  openStoryRef.current = () => setIsStoryModalOpen(true);
  const userRef = useRef(user);
  userRef.current = user;
  const creditRef = useRef(creditUserBalance);
  creditRef.current = creditUserBalance;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const balancePanelRef = useRef<any>(null);

  useEffect(() => {
    const hostEl = host.current as HTMLElement;
    if (!hostEl) return;
    const sr = hostEl.shadowRoot;
    const balEl = sr?.querySelector('#spin-bal');
    if (balEl && user) {
      const b = user.balance ?? user.cryptoBalances?.USDT ?? 0;
      const formatted = (b < 100 ? Math.round(b * 100) / 100 : Math.round(b)).toLocaleString();
      balEl.textContent = formatted;
      balancePanelRef.current?.update?.(b);
    }
  }, [user?.balance, user?.cryptoBalances?.USDT]);

  useEffect(() => {
    const hostEl = host.current as HTMLElement;
    if (!hostEl) return;
    const sr = hostEl.shadowRoot || hostEl.attachShadow({ mode: "open" });
    sr.innerHTML = `<style>${CSS}</style><div class="spin-root">${MARKUP}</div>`;
    const rootEl = sr.querySelector(".spin-root") as HTMLElement;
    if (!rootEl) return;

    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready?.();
        tg.expand?.();
      }
    } catch {}

    const freeSpinKey = `tonflame_freespin_${userRef.current?.id || userRef.current?.telegramId || 'guest'}`;
    // Kept active for development/testing environment
    let isFreeSpinAvailable = true;

    // Standard requested bet tiers: 1, 2, 4, 5, 10, 20, 50
    const BET_TIERS = [1, 2, 4, 5, 10, 20, 50];
    const BET_MIN = BET_TIERS[0], BET_MAX = BET_TIERS[BET_TIERS.length - 1];
    const ROYAL_BY_BET = { 0: 500, 1: 500, 2: 1000, 4: 1200, 5: 1500, 10: 2000, 20: 2500, 50: 3000 };
    const getRoyalPrize = v => ROYAL_BY_BET[v] || 500;

    // Visual surrounding cards on track for high excitement + calibrated realistic weights for house safety
    const POOLS_BY_BET = {
      0: [
        { base: 0.87, tier: 'teal', w: 30 },
        { base: 0.74, tier: 'blue', w: 25 },
        { base: 0.62, tier: 'orange', w: 20 },
        { base: 0.55, tier: 'violet', w: 15 },
        { base: 0.92, tier: 'green', w: 10 },
        { base: 500, tier: 'gold', w: 0.001 }
      ],
      1: [
        { base: 0, tier: 'gray', isZero: true, w: 42 },
        { base: 0.2, tier: 'blue', w: 32 },
        { base: 0.5, tier: 'teal', w: 16 },
        { base: 1, tier: 'orange', w: 8 },
        { base: 2.5, tier: 'violet', w: 2 },
        { base: 8, tier: 'green', w: 0.1 },
        { base: 24, tier: 'pink', w: 0.01 },
        { base: 500, tier: 'gold', w: 0.001 }
      ],
      2: [
        { base: 0, tier: 'gray', isZero: true, w: 42 },
        { base: 0.5, tier: 'blue', w: 32 },
        { base: 1, tier: 'teal', w: 16 },
        { base: 2, tier: 'orange', w: 8 },
        { base: 5, tier: 'violet', w: 2 },
        { base: 16, tier: 'green', w: 0.1 },
        { base: 24, tier: 'pink', w: 0.01 },
        { base: 1000, tier: 'gold', w: 0.001 }
      ],
      4: [
        { base: 0, tier: 'gray', isZero: true, w: 42 },
        { base: 1, tier: 'blue', w: 32 },
        { base: 2, tier: 'teal', w: 16 },
        { base: 4, tier: 'orange', w: 8 },
        { base: 10, tier: 'violet', w: 2 },
        { base: 20, tier: 'green', w: 0.1 },
        { base: 48, tier: 'pink', w: 0.01 },
        { base: 1200, tier: 'gold', w: 0.001 }
      ],
      5: [
        { base: 0, tier: 'gray', isZero: true, w: 42 },
        { base: 1.5, tier: 'blue', w: 32 },
        { base: 2.5, tier: 'teal', w: 16 },
        { base: 5, tier: 'orange', w: 8 },
        { base: 12.5, tier: 'violet', w: 2 },
        { base: 25, tier: 'green', w: 0.1 },
        { base: 60, tier: 'pink', w: 0.01 },
        { base: 1500, tier: 'gold', w: 0.001 }
      ],
      10: [
        { base: 2, tier: 'blue', w: 55 },
        { base: 3, tier: 'teal', w: 30 },
        { base: 0, tier: 'gray', isZero: true, w: 12 },
        { base: 5, tier: 'orange', w: 2.9 },
        { base: 10, tier: 'violet', w: 0.09 },
        { base: 25, tier: 'green', w: 0.009 },
        { base: 2000, tier: 'gold', w: 0.001 }
      ],
      20: [
        { base: 4, tier: 'blue', w: 55 },
        { base: 6, tier: 'teal', w: 30 },
        { base: 0, tier: 'gray', isZero: true, w: 12 },
        { base: 10, tier: 'orange', w: 2.9 },
        { base: 20, tier: 'violet', w: 0.09 },
        { base: 50, tier: 'green', w: 0.009 },
        { base: 2500, tier: 'gold', w: 0.001 }
      ],
      50: [
        { base: 10, tier: 'blue', w: 55 },
        { base: 15, tier: 'teal', w: 30 },
        { base: 0, tier: 'gray', isZero: true, w: 12 },
        { base: 25, tier: 'orange', w: 2.9 },
        { base: 50, tier: 'violet', w: 0.09 },
        { base: 120, tier: 'green', w: 0.009 },
        { base: 3000, tier: 'gold', w: 0.001 }
      ]
    };

    const VIP_AT = 20;
    const Econ = { mult: 1, vip: false, bet: 1 };
    const fmt = n => {
      if (typeof n !== 'number' || isNaN(n)) return '0';
      if (n < 10) {
        return n % 1 === 0 ? String(n) : Number(n.toFixed(2)).toString();
      }
      const v = n < 100 ? Math.round(n * 100) / 100 : Math.round(n);
      const [a, b] = String(v).split('.');
      return a.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') + (b ? '.' + b : '');
    };
    const sizing = t => t.length <= 3 ? [5.0, 5.2] : t.length === 4 ? [4.6, 4.8] : t.length === 5 ? [4.0, 4.2] : [3.5, 3.8];
    
    const pickFrom = (avoid, currentBet) => {
      const activePool = POOLS_BY_BET[currentBet] || POOLS_BY_BET[1];
      const ok = activePool.filter(p => !avoid.includes(p.base)), c = ok.length ? ok : activePool;
      let r = Math.random() * c.reduce((a, p) => a + p.w, 0);
      for (const p of c) { if ((r -= p.w) < 0) return p; }
      return c[0];
    };

    const sequence = (prev, n, at, force, currentBet) => {
      const out = [], hist = prev.map(p => p.base);
      for (let i = 0; i < n; i++) {
        const av = hist.slice(-5);
        const p = i === at ? (force || pickFrom(av, currentBet)) : pickFrom(av, currentBet);
        out.push(p);
        hist.push(p.base);
      }
      return out;
    };

    const easeSpin = t => 1 - Math.pow(1 - t, 3.6);
    const easeOutQuart = t => 1 - Math.pow(1 - t, 3.2);
    const SPIN_MS = 5000, SPIN_CARDS = 38;

    // Lightweight Web Audio synthesizer synchronized perfectly with sliding reel
    const Sound = {
      ctx: null, on: true,
      init() {
        if (!this.ctx) {
          const C = window.AudioContext || window.webkitAudioContext;
          if (!C) return;
          this.ctx = new C();
          this.out = this.ctx.createGain();
          this.out.gain.value = .85;
          this.out.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
      },
      ready() { return this.on && this.ctx; },
      tick() {
        if (!this.ready()) return;
        const c = this.ctx, t = c.currentTime;
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(220, t);
        o.frequency.exponentialRampToValueAtTime(70, t + .035);
        g.gain.setValueAtTime(.0001, t);
        g.gain.exponentialRampToValueAtTime(.16, t + .003);
        g.gain.exponentialRampToValueAtTime(.0001, t + .04);
        o.connect(g).connect(this.out);
        o.start(t); o.stop(t + .045);
      },
      whoosh() {
        if (!this.ready()) return;
        const c = this.ctx, t = c.currentTime;
        const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
        o.type = 'triangle';
        f.type = 'bandpass';
        f.Q.value = 1.2;
        f.frequency.setValueAtTime(220, t);
        f.frequency.exponentialRampToValueAtTime(1400, t + 0.8);
        f.frequency.exponentialRampToValueAtTime(320, t + 1.9);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.18);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.1);
        o.connect(f).connect(g).connect(this.out);
        o.start(t); o.stop(t + 2.15);
      },
      bell(freq, at, gain, dur) {
        const c = this.ctx;
        [[1, 1], [2.76, .25]].forEach(([m, a]) => {
          const o = c.createOscillator(), g = c.createGain();
          o.type = 'sine';
          o.frequency.value = freq * m;
          g.gain.setValueAtTime(.0001, at);
          g.gain.exponentialRampToValueAtTime(gain * a, at + .01);
          g.gain.exponentialRampToValueAtTime(.0001, at + dur / m ** .4);
          o.connect(g).connect(this.out);
          o.start(at); o.stop(at + dur + .08);
        });
      },
      blip(f0, f1, dur, gain, type = 'sine') {
        if (!this.ready()) return;
        const c = this.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f0, t);
        o.frequency.exponentialRampToValueAtTime(f1, t + dur);
        g.gain.setValueAtTime(.0001, t);
        g.gain.exponentialRampToValueAtTime(gain, t + .006);
        g.gain.exponentialRampToValueAtTime(.0001, t + dur + .04);
        o.connect(g).connect(this.out);
        o.start(t); o.stop(t + dur + .05);
      },
      ui(kind) {
        ({
          up: () => this.blip(400, 600, .06, .12),
          down: () => this.blip(600, 400, .06, .12),
          nav: () => this.blip(520, 700, .05, .09),
          press: () => this.blip(200, 80, .12, .25),
          dud: () => this.blip(300, 180, .16, .12)
        })[kind]?.();
      },
      vip() {
        if (!this.ready()) return;
        [1047, 1319, 1568, 2093].forEach((f, i) => this.bell(f, this.ctx.currentTime + i * .07, .12, 1.2));
      },
      win(tier) {
        if (!this.ready()) return;
        const t = this.ctx.currentTime + .02;
        const seq = { blue: [659, 880], teal: [523, 659, 784], pink: [523, 659, 784, 1047], gold: [523, 659, 784, 1047, 1319, 1568] }[tier] || [659, 880];
        seq.forEach((f, i) => this.bell(f, t + i * .09, tier === 'gold' ? .18 : .14, tier === 'gold' ? 1.6 : 1.1));
      }
    };

    const Coin = () => '<svg class="coin" viewBox="0 0 32 32" aria-hidden="true"><use href="#usdt"/></svg>';
    const PACK_NAME = 'Royal';
    const PrizeCard = p => {
      const isGold = p.tier === 'gold';
      const isZero = p.base === 0 || p.isZero;
      const currentBet = isFreeSpinAvailable ? 0 : Econ.bet;
      const val = isGold ? getRoyalPrize(currentBet) : p.base;
      const t = isZero ? '0' : fmt(val);
      const [fs, cn] = sizing(t);
      const subLabel = isZero ? 'Try Again' : 'Tether';
      return `<div class="slot"><article class="ticket${isGold && Econ.vip ? ' is-vip' : ''}" data-tier="${p.tier}" data-base="${p.base}" style="--fs:calc(${fs}*var(--u));--cn:calc(${cn}*var(--u))"><div class="ticket__body"><div class="ticket__frame"><div class="ticket__amount">${isZero ? '' : Coin()}<b>${t}</b></div><span>${subLabel}</span></div></div>${isGold ? `<span class="vip" aria-hidden="true">${PACK_NAME.toUpperCase()}</span>` : ''}</article></div>`;
    };

    class PrizeReel {
      constructor(mount) {
        mount.innerHTML = `<section class="reel" aria-label="Prize reel"><div class="reel__fog reel__fog--top"></div><div class="reel__fog reel__fog--bottom"></div>
        <button class="nav nav--prev" type="button" aria-label="Previous prize"><svg viewBox="0 0 38 52"><path d="M7 5.500L32 24a2.800 2.800 0 0 1 0 4L7 46.500C4 48.800 2 47.800 2 44V8c0-3.800 2-4.800 5-2.500z" fill="#269BE8" stroke="#269BE8" stroke-width="4" stroke-linejoin="round"/></svg></button>
        <button class="nav nav--next" type="button" aria-label="Next prize"><svg viewBox="0 0 38 52"><path d="M31 5.500L6 24a2.800 2.800 0 0 0 0 4l25 18.500c3 2.300 5 1.300 5-2.500V8c0-3.800-2-4.800-5-2.500z" fill="#269BE8" stroke="#269BE8" stroke-width="4" stroke-linejoin="round"/></svg></button>
        <div class="reel__track"></div></section>`;
        this.root = mount.firstElementChild;
        this.track = this.root.querySelector('.reel__track');
        this.navs = [...this.root.querySelectorAll('.nav')];
        
        const initPool = POOLS_BY_BET[isFreeSpinAvailable ? 0 : 1];
        const goldCard = initPool.find(p => p.tier === 'gold') || { base: 500, tier: 'gold' };
        this.view = [initPool[0], initPool[1], initPool[2], goldCard, initPool[3], initPool[4] || initPool[0], initPool[1]];
        this.busy = false; this.onBusy = () => {};
        this.navs[0].onclick = () => { Sound.init(); this.move(-1); };
        this.navs[1].onclick = () => { Sound.init(); this.move(1); };
        this.render(this.view); this.settle(false);
      }
      render(list) { this.track.innerHTML = list.map(PrizeCard).join(''); }
      pitch() { return this.track.firstElementChild?.offsetHeight || 100; }
      focusCard() { return this.track.children[3]?.firstElementChild; }
      setGrow(v) { this.root.style.setProperty('--grow', v); }
      updateTierView(betVal) {
        const pool = POOLS_BY_BET[isFreeSpinAvailable ? 0 : betVal] || POOLS_BY_BET[1];
        const goldCard = pool.find(p => p.tier === 'gold') || { base: getRoyalPrize(betVal), tier: 'gold' };
        this.view = [pool[0], pool[1], pool[2], goldCard, pool[3], pool[4] || pool[0], pool[1]];
        this.render(this.view);
        this.settle(false);
      }
      setBusy(b) { this.busy = b; this.navs.forEach(n => n.disabled = b); this.onBusy(b); }
      settle(win) {
        requestAnimationFrame(() => {
          const c = this.focusCard();
          if (!c) return;
          c.classList.add('is-focus');
          if (win) {
            c.classList.add('is-win');
            setTimeout(() => c?.classList.remove('is-win'), 800);
          }
        });
      }
      run(list, from, to, ms, ease, endIdx, onStep) {
        return new Promise(done => {
          const start = performance.now(), pt = this.pitch();
          let lastStep = -1;
          this.track.style.willChange = 'transform';
          const frame = now => {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / ms);
            const y = from + (to - from) * ease(t);
            this.track.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`;
            if (onStep) {
              const currentStep = Math.floor(Math.abs(y - from) / pt);
              if (currentStep !== lastStep && currentStep >= 0) {
                lastStep = currentStep;
                onStep();
              }
            }
            if (t < 1) {
              requestAnimationFrame(frame);
            } else {
              this.track.style.willChange = 'auto';
              this.view = list.slice(endIdx, endIdx + 7);
              this.render(this.view);
              this.track.style.transform = 'translate3d(0,0,0)';
              done();
            }
          };
          requestAnimationFrame(frame);
        });
      }
      async spin(forcePrize) {
        const N = SPIN_CARDS, p = this.pitch();
        const activeBet = isFreeSpinAvailable ? 0 : Econ.bet;
        const fresh = sequence(this.view, N, N - 4, forcePrize, activeBet), win = fresh[N - 4];
        const list = [...this.view, ...fresh];
        this.setBusy(true); Sound.whoosh();
        this.focusCard()?.classList.remove('is-focus', 'is-win');
        this.root.classList.add('is-spinning');
        this.track.insertAdjacentHTML('beforeend', fresh.map(PrizeCard).join(''));
        try {
          await this.run(list, 0, -N * p, SPIN_MS, easeSpin, N, () => Sound.tick());
        } finally {
          this.root.classList.remove('is-spinning');
        }
        this.settle(true); this.setBusy(false);
        return win;
      }
      async move(dir) {
        if (this.busy) return;
        const p = this.pitch(), activeBet = isFreeSpinAvailable ? 0 : Econ.bet;
        const fresh = dir > 0 ? sequence(this.view, 1, 0, null, activeBet)[0] : pickFrom(this.view.slice(0, 5).map(x => x.base), activeBet);
        this.setBusy(true); Sound.ui('nav'); this.focusCard()?.classList.remove('is-focus');
        let list;
        if (dir > 0) {
          list = [...this.view, fresh];
          this.track.insertAdjacentHTML('beforeend', PrizeCard(fresh));
          await this.run(list, 0, -p, 380, easeOutQuart, 1);
        } else {
          list = [fresh, ...this.view];
          this.track.insertAdjacentHTML('afterbegin', PrizeCard(fresh));
          await this.run(list, -p, 0, 380, easeOutQuart, 0);
        }
        this.settle(false); this.setBusy(false);
      }
    }

    const getCurrentBalance = () => userRef.current?.balance ?? userRef.current?.cryptoBalances?.USDT ?? 0;

    class BalancePanel {
      constructor() {
        this.el = document.createElement('div');
        this.el.className = 'balance';
        this.el.innerHTML = `${Coin()}<div><strong>Balance <span id="spin-bal">${fmt(getCurrentBalance())}</span> USDT</strong><button type="button" id="deposit-btn">Deposit &rsaquo;</button></div>`;
        this.el.querySelector('#deposit-btn').onclick = () => {
          const currentBetVal = bet?.value || 10;
          navigateRef.current(`/deposit?amount=${currentBetVal}`, {
            state: { amount: currentBetVal, initialAmount: currentBetVal, fromSpin: true }
          });
        };
        balancePanelRef.current = this;
      }
      update(val) {
        const el = this.el.querySelector('#spin-bal');
        if (el) el.textContent = fmt(val);
      }
    }

    class BetControls {
      constructor(tiers, start, onChange) {
        this.tiers = tiers; this.value = start; this.onChange = onChange;
        this.el = document.createElement('div'); this.el.className = 'bet';
        this.el.innerHTML = `<div class="bet__row"><button class="bet__step" data-dir="-1" type="button" aria-label="Decrease bet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg></button><div class="bet__value" title="Click to cycle bet"><span>$${this.value}</span></div><button class="bet__step" data-dir="1" type="button" aria-label="Increase bet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></button></div><small>Royal: $${getRoyalPrize(this.value)}</small>`;
        [this.minus, this.plus] = this.el.querySelectorAll('.bet__step');
        this.valEl = this.el.querySelector('.bet__value span');
        this.royalLabel = this.el.querySelector('small');
        this.minus.onclick = () => this.step(-1);
        this.plus.onclick = () => this.step(1);
        this.el.querySelector('.bet__value').onclick = () => this.step(1);
        this.updateButtons();
      }
      step(dir) {
        if (reel.busy) return;
        Sound.init();
        const currentIdx = this.tiers.indexOf(this.value);
        let nextIdx = currentIdx + dir;
        if (nextIdx < 0) nextIdx = this.tiers.length - 1;
        if (nextIdx >= this.tiers.length) nextIdx = 0;
        if (nextIdx === currentIdx) return;
        const nextVal = this.tiers[nextIdx];
        Sound.ui(dir > 0 ? 'up' : 'down');
        this.value = nextVal;
        this.valEl.textContent = `$${this.value}`;
        this.royalLabel.textContent = `Royal: $${getRoyalPrize(this.value)}`;
        this.updateButtons();
        this.onChange(this.value);
      }
      updateButtons() {
        const idx = this.tiers.indexOf(this.value);
        this.minus.disabled = idx <= 0;
        this.plus.disabled = idx >= this.tiers.length - 1;
      }
    }

    class SpinActions {
      constructor(getBet, onSpin, onAuto) {
        this.getBet = getBet;
        this.el = document.createElement('div'); this.el.className = 'actions';
        this.el.innerHTML = `<button class="act auto" type="button" aria-pressed="false"><span class="auto__dot"></span>Auto-Spin</button><button class="act spin" type="button"></button>`;
        [this.auto, this.spin] = this.el.children;
        this.spin.onclick = onSpin;
        this.auto.onclick = () => {
          const on = this.auto.getAttribute('aria-pressed') !== 'true';
          this.auto.setAttribute('aria-pressed', on);
          Sound.init(); Sound.ui(on ? 'up' : 'down');
          onAuto(on);
        };
        this.paint(false);
      }
      paint(busy) {
        this.spin.disabled = busy;
        if (isFreeSpinAvailable) {
          this.spin.classList.add('is-free');
          this.spin.textContent = busy ? 'Spinning...' : 'Free Spin';
        } else {
          this.spin.classList.remove('is-free');
          this.spin.textContent = busy ? 'Spinning...' : `Spin for $${this.getBet()}`;
        }
      }
    }

    const reel = new PrizeReel(rootEl.querySelector('#reel-mount'));
    const announce = rootEl.querySelector('#announce');
    let autoOn = false;

    // Connect in-shadow back button
    const backBtn = rootEl.querySelector('#spin-back-btn');
    if (backBtn) {
      backBtn.onclick = () => {
        Sound.init();
        Sound.ui('nav');
        if (window.history.length > 1) {
          navigateRef.current(-1);
        } else {
          navigateRef.current('/');
        }
      };
    }

    function setEconomy(v) {
      const oldBet = Econ.bet;
      if (oldBet === v) return;
      const was = Econ.vip;
      Econ.vip = v >= VIP_AT;
      Econ.bet = v;
      Econ.mult = 1;
      if (Econ.vip && !was) { Sound.vip(); announce.textContent = PACK_NAME + ' prize unlocked'; }
      reel.updateTierView(v);
    }

    const growFor = v => ((v - BET_MIN) / Math.max(1, BET_MAX - BET_MIN)) * .3;
    const bet = new BetControls(BET_TIERS, 1, v => {
      reel.setGrow(growFor(v));
      setEconomy(v);
      if (!reel.busy) actions.paint(false);
    });
    const actions = new SpinActions(() => bet.value, () => {
      Sound.init(); Sound.ui('press'); runSpin();
    }, on => {
      autoOn = on; if (on && !reel.busy) runSpin();
    });
    const balance = new BalancePanel();
    reel.setGrow(growFor(bet.value));

    const speaker = document.createElement('button');
    speaker.className = 'sound'; speaker.type = 'button'; speaker.setAttribute('aria-pressed', 'true'); speaker.setAttribute('aria-label', 'Sound');
    const paintSpeaker = () => {
      speaker.setAttribute('aria-pressed', Sound.on);
      speaker.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/>${Sound.on ? '<path d="M16.500 9a4 4 0 0 1 0 6M19 6.500a8 8 0 0 1 0 11"/>' : '<path d="M17 9.500l4 5M21 9.500l-4 5"/>'}</svg>`;
    };
    speaker.onclick = () => { Sound.on = !Sound.on; if (Sound.on) { Sound.init(); Sound.tick(); } paintSpeaker(); };
    paintSpeaker(); reel.root.append(speaker);

    // Referral link builder for Story and direct share
    const botUser = 'TonFlame_Bot';
    const currentRefId = userRef.current?.telegramId || userRef.current?.id || 'guest';
    const refCode = userRef.current?.referralCode || `ref_${currentRefId}`;
    const inviteUrl = `https://t.me/${botUser}?startapp=${refCode}`;

    const panel = document.createElement('section');
    panel.className = 'panel'; panel.setAttribute('aria-label', 'Controls');

    const row = document.createElement('div'); row.className = 'panel__row';
    row.append(balance.el, bet.el);
    panel.append(row, actions.el);

    // Referral & Telegram Story Strip without emojis
    const refStrip = document.createElement('div');
    refStrip.className = 'referral-strip';
    refStrip.innerHTML = `<p>Invite friends for extra spins</p><div class="ref-btns"><button class="ref-btn-story" type="button">Story</button><button class="ref-btn-copy" type="button">Copy Link</button></div>`;
    
    refStrip.querySelector('.ref-btn-story').onclick = () => {
      Sound.init(); Sound.ui('press');
      if (typeof openStoryRef.current === 'function') {
        openStoryRef.current();
      }
    };

    refStrip.querySelector('.ref-btn-copy').onclick = (e: any) => {
      Sound.init(); Sound.ui('press');
      navigator.clipboard.writeText(inviteUrl);
      const originalText = e.target.textContent;
      e.target.textContent = 'Copied';
      setTimeout(() => { e.target.textContent = originalText; }, 2000);
    };

    panel.append(refStrip);
    rootEl.querySelector('#panel-mount').replaceWith(panel);

    reel.onBusy = b => {
      actions.paint(b);
      bet.minus.disabled = b || bet.value <= BET_TIERS[0];
      bet.plus.disabled = b || bet.value >= BET_TIERS[BET_TIERS.length - 1];
    };

    // Instant, ultra-smooth modern win celebration modal
    const Jackpot = {
      el: rootEl.querySelector('#jackpot'),
      show(prize, customSub = '', isFreePrize = false) {
        return new Promise(res => {
          const el = this.el, g = prize.tier === 'gold';
          el.dataset.tier = prize.tier;
          el.querySelector('.jackpot__label').textContent = isFreePrize ? 'Welcome Free Prize!' : g ? PACK_NAME + ' Prize!' : 'You Won!';
          el.querySelector('.jackpot__sub').textContent = customSub;
          const card = el.querySelector('.jackpot__card');
          card.innerHTML = PrizeCard(prize).replace('class="ticket', 'class="ticket is-win' + (g ? ' is-vip' : ''));
          el.setAttribute('aria-hidden', 'false');
          el.classList.add('is-on');
          if (g) Sound.vip(); else Sound.win(prize.tier);
          navigator.vibrate?.([30, 40, 70]);

          const close = () => {
            clearTimeout(timer);
            el.classList.remove('is-on');
            el.setAttribute('aria-hidden', 'true');
            el.removeEventListener('click', close);
            document.removeEventListener('keydown', key);
            setTimeout(res, 350);
          };
          const key = e => { if (e.key === 'Escape' || e.key === 'Enter') close(); };
          const timer = setTimeout(close, 4000);
          el.querySelector('.jackpot__close').onclick = close;
          el.addEventListener('click', close);
          document.addEventListener('keydown', key);
        });
      }
    };

    // Spin execution engine with profitable house edge distribution
    async function runSpin() {
      if (reel.busy) return;
      const isFree = isFreeSpinAvailable;
      const bal = getCurrentBalance();
      const cost = isFree ? 0 : bet.value;

      // When balance is insufficient on paid spin, immediately redirect directly to deposit page with selected amount prefilled
      if (!isFree) {
        if (typeof cost !== 'number' || isNaN(cost) || !BET_TIERS.includes(cost)) {
          announce.textContent = 'Security Error: Unauthorized bet.';
          Sound.ui('dud');
          return;
        }
        if (bal < cost) {
          Sound.ui('dud');
          autoOn = false;
          actions.auto.setAttribute('aria-pressed', 'false');
          navigateRef.current(`/deposit?amount=${cost}`, {
            state: { amount: cost, initialAmount: cost, fromSpin: true }
          });
          return;
        }
      }

      Sound.init();

      // If paid spin, deduct balance immediately
      if (!isFree && cost > 0 && typeof creditRef.current === 'function') {
        creditRef.current(-cost, 'USDT');
      }
      balance.update(Math.max(0, getCurrentBalance() - (!isFree ? cost : 0)));

      // Free spin gives guaranteed exciting win strictly UNDER 1.00 USDT (e.g. 0.45, 0.58, 0.64, 0.72, 0.81, 0.87)
      let forcedPrize = null;
      if (isFree) {
        const freeWinOptions = [0.48, 0.55, 0.62, 0.74, 0.81, 0.87, 0.92, 0.68, 0.79];
        const winAmount = freeWinOptions[Math.floor(Math.random() * freeWinOptions.length)];
        forcedPrize = { base: winAmount, tier: 'teal' };
      }

      const win = await reel.spin(forcedPrize);
      const isGold = win.tier === 'gold';
      const reward = isGold ? getRoyalPrize(isFree ? 0 : Econ.bet) : Number(win.base);

      // Consume free spin strictly ONCE in live, kept testable
      if (isFree) {
        localStorage.setItem(freeSpinKey, 'true');
        // If testing, remains available
        isFreeSpinAvailable = false;
        actions.paint(false);
      }

      // Immediately show winning card modal without any async network blocking
      Jackpot.show(win, reward > 0 ? `+${fmt(reward)} USDT added to your balance!` : '', isFree);

      // Process credit and gift history transaction in background
      if (reward > 0) {
        if (typeof creditRef.current === 'function') {
          creditRef.current(reward, 'USDT');
        }

        try {
          const uId = userRef.current?.id || 'guest_user';
          const tgId = userRef.current?.telegramId || '';
          const tgUsername = userRef.current?.telegramUsername || '';
          addDoc(collection(db, 'transactions'), {
            userId: uId,
            telegramUsername: tgUsername,
            telegramId: tgId,
            type: 'gift',
            amount: reward,
            cryptoAmount: String(reward),
            currency: 'USDT',
            status: 'completed',
            createdAt: Date.now(),
            note: isFree ? 'Lucky Spin Welcome Gift' : `Lucky Spin Gift ($${bet.value} tier)`,
            recipient: 'Lucky Spin'
          }).catch(() => {});

          // Reward referrer 10% commission on win
          if (userRef.current?.referredBy) {
            rewardReferrerCommission(userRef.current, reward, 'spin_win').catch(() => {});
          }
        } catch {}
      }

      balance.update(getCurrentBalance() + reward);

      if (isFree) {
        reel.updateTierView(bet.value);
      }

      if (autoOn) setTimeout(() => { if (autoOn && !reel.busy) runSpin(); }, 1400);
    }

    return () => {
      autoOn = false;
      if (Sound.ctx && typeof Sound.ctx.close === 'function') {
        try { Sound.ctx.close(); } catch {}
      }
    };
  }, []);

  const vars: any = {
    display: "block",
    width: "100%",
    height: "var(--spin-h, 100dvh)",
    position: "relative",
    ...(height !== undefined ? { "--spin-h": typeof height === "number" ? height + "px" : height } : {}),
    ...style,
  };

  return (
    <>
      <div 
        ref={host} 
        className={className} 
        style={vars}
      />
      <StoryReferralModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        currentUser={user}
      />
    </>
  );
}

export default Spin;
