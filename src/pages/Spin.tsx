// @ts-nocheck
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { StoryReferralModal } from "../components/StoryReferralModal";
import { rewardReferrerCommission, submitWithdrawal } from "../services/systemService";
import SpinWin from "../components/SpinWin";
import WithdrawModal from "../components/WithdrawModal";

const CSS = `:host{display:block;width:100%;height:100%}
.spin-root{
  --w:clamp(300px, 100vw, 440px);
  --u:calc(var(--w)/63.9);
  --tk:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 242 160' preserveAspectRatio='none'%3E%3Cpath d='M24.45,1.5H217.55A24.5,24.5 0 0 0 240.5,24.45L240.5,36.3C238.0,36.3 236,37.5 236,39.5L236,42.5C236,44.5 238.0,45.7 240.5,45.7L240.5,55.8C238.0,55.8 236,57.0 236,59.0L236,62.0C236,64.0 238.0,65.2 240.5,65.2L240.5,75.3C238.0,75.3 236,76.5 236,78.5L236,81.5C236,83.5 238.0,84.7 240.5,84.7L240.5,94.8C238.0,94.8 236,96.0 236,98.0L236,101.0C236,103.0 238.0,104.2 240.5,104.2L240.5,114.3C238.0,114.3 236,115.5 236,117.5L236,120.5C236,122.5 238.0,123.7 240.5,123.7L240.5,135.55A24.5,24.5 0 0 0 217.55,158.5H24.45A24.5,24.5 0 0 0 1.5,135.55L1.5,123.7C4.0,123.7 6,122.5 6,120.5L6,117.5C6,115.5 4.0,114.3 1.5,114.3L1.5,104.2C4.0,104.2 6,103.0 6,101.0L6,98.0C6,96.0 4.0,94.8 1.5,94.8L1.5,84.7C4.0,84.7 6,83.5 6,81.5L6,78.5C6,76.5 4.0,75.3 1.5,75.3L1.5,65.2C4.0,65.2 6,64.0 6,62.0L6,59.0C6,57.0 4.0,55.8 1.5,55.8L1.5,45.7C4.0,45.7 6,44.5 6,42.5L6,39.5C6,37.5 4.0,36.3 1.5,36.3L1.5,24.45A24.5,24.5 0 0 0 24.45,1.5Z' fill='%23000' stroke='%23000' stroke-width='3' stroke-linejoin='round'/%3E%3C/svg%3E");
  --rim:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 242 160' preserveAspectRatio='none'%3E%3Cpath d='M24.45,1.5H217.55A24.5,24.5 0 0 0 240.5,24.45L240.5,36.3C238.0,36.3 236,37.5 236,39.5L236,42.5C236,44.5 238.0,45.7 240.5,45.7L240.5,55.8C238.0,55.8 236,57.0 236,59.0L236,62.0C236,64.0 238.0,65.2 240.5,65.2L240.5,75.3C238.0,75.3 236,76.5 236,78.5L236,81.5C236,83.5 238.0,84.7 240.5,84.7L240.5,94.8C238.0,94.8 236,96.0 236,98.0L236,101.0C236,103.0 238.0,104.2 240.5,104.2L240.5,114.3C238.0,114.3 236,115.5 236,117.5L236,120.5C236,122.5 238.0,123.7 240.5,123.7L240.5,135.55A24.5,24.5 0 0 0 217.55,158.5H24.45A24.5,24.5 0 0 0 1.5,135.55L1.5,123.7C4.0,123.7 6,122.5 6,120.5L6,117.5C6,115.5 4.0,114.3 1.5,114.3L1.5,104.2C4.0,104.2 6,103.0 6,101.0L6,98.0C6,96.0 4.0,94.8 1.5,94.8L1.5,84.7C4.0,84.7 6,83.5 6,81.5L6,78.5C6,76.5 4.0,75.3 1.5,75.3L1.5,65.2C4.0,65.2 6,64.0 6,62.0L6,59.0C6,57.0 4.0,55.8 1.5,55.8L1.5,45.7C4.0,45.7 6,44.5 6,42.5L6,39.5C6,37.5 4.0,36.3 1.5,36.3L1.5,24.45A24.5,24.5 0 0 0 24.45,1.5Z' fill='none' stroke='%23ffffff' stroke-opacity='0.42' stroke-width='2.6' stroke-linejoin='round'/%3E%3C/svg%3E");
  position:relative;width:100%;height:100%;display:flex;direction:ltr;justify-content:center;overflow:hidden;isolation:isolate;
  background-color:var(--tg-theme-bg-color, #0e1621);
  background-repeat:repeat;
  background-size:192px 192px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='192' height='192' viewBox='0 0 192 192'%3E%3Cdefs%3E%3Cg id='t'%3E%3Cg fill='none' stroke='%2322364d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cg transform='translate(6,8) rotate(-12 11 11)'%3E%3Crect x='0' y='9' width='22' height='12' rx='2'/%3E%3Crect x='-1' y='4' width='24' height='5' rx='1.5'/%3E%3Cpath d='M11 4V21M11 4C6 -2 2 1 6 4M11 4C16 -2 20 1 16 4'/%3E%3C/g%3E%3Cg transform='translate(58,4)'%3E%3Ccircle cx='11' cy='11' r='11'/%3E%3Ccircle cx='11' cy='11' r='8' stroke-dasharray='1.5 2.5'/%3E%3Cpath d='M8 6h5a2.5 2.5 0 0 1 0 5H8M8 11h6a2.5 2.5 0 0 1 0 5H8M8 6v10M10 4v2M10 16v2'/%3E%3C/g%3E%3Cg transform='translate(96,6) rotate(10 10 11)'%3E%3Crect x='1' y='9' width='18' height='13' rx='2'/%3E%3Cpath d='M5 9V6a5 5 0 0 1 10 0v3'/%3E%3Ccircle cx='10' cy='15' r='1.6'/%3E%3C/g%3E%3Cg transform='translate(36,34) rotate(14 8 8)'%3E%3Cpath d='M8 0L10.3 5.4L16 5.9L11.7 9.7L13 15.4L8 12.4L3 15.4L4.3 9.7L0 5.9L5.7 5.4Z'/%3E%3C/g%3E%3Cg transform='translate(2,48) rotate(-8 13 8)'%3E%3Cpath d='M3 0H23a3 3 0 0 0 3 3V13a3 3 0 0 0-3 3H3a3 3 0 0 0-3-3V3a3 3 0 0 0 3-3Z'/%3E%3Cpath d='M18 2V14' stroke-dasharray='2 2'/%3E%3Cpath d='M6 6H13M6 10H11'/%3E%3C/g%3E%3Cg transform='translate(48,50)'%3E%3Cpath d='M10 0L19 11L10 15L1 11Z'/%3E%3Cpath d='M1 14L10 24L19 14M10 15V24'/%3E%3C/g%3E%3Cg transform='translate(92,48) rotate(28 10 11)'%3E%3Cpath d='M10 0C16 4 16 12 14 18H6C4 12 4 4 10 0Z'/%3E%3Ccircle cx='10' cy='8' r='2'/%3E%3Cpath d='M6 14L2 19L6 18M14 14L18 19L14 18M10 20V24'/%3E%3C/g%3E%3Cg transform='translate(6,88)'%3E%3Cpath d='M5 0H15L20 6L10 18L0 6Z'/%3E%3Cpath d='M0 6H20M7 0L5 6L10 18L15 6L13 0'/%3E%3C/g%3E%3Cg transform='translate(36,92) rotate(-6 12 10)'%3E%3Crect x='0' y='3' width='24' height='16' rx='3'/%3E%3Cpath d='M0 8H20'/%3E%3Cpath d='M17 11H24V17H17a3 3 0 0 1 0-6Z'/%3E%3C/g%3E%3Cg transform='translate(76,90)'%3E%3Cpath d='M3 0V20M3 4H0V12H6V4H3M13 6V22M13 9H10V17H16V9H13'/%3E%3C/g%3E%3Cg transform='translate(100,92)'%3E%3Cpath d='M8 0L16 3V9C16 14 12 17 8 19C4 17 0 14 0 9V3Z'/%3E%3Cpath d='M4 9L7 12L12 6'/%3E%3C/g%3E%3C/g%3E%3Cg fill='none' stroke='%231b2c40' stroke-width='1.8' stroke-linecap='round'%3E%3Cpath d='M84 30V38M80 34H88M81.5 31.5L86.5 36.5M81.5 36.5L86.5 31.5'/%3E%3Cpath d='M20 76V82M17 79H23'/%3E%3Cpath d='M68 78V84M65 81H71'/%3E%3Cpath d='M112 78V86M108 82H116'/%3E%3Cpath d='M112 36V42M109 39H115'/%3E%3Cpath d='M50 22V28M47 25H53'/%3E%3C/g%3E%3Cg fill='%231b2c40'%3E%3Ccircle cx='30' cy='62' r='2'/%3E%3Ccircle cx='86' cy='70' r='2'/%3E%3Ccircle cx='46' cy='84' r='1.6'/%3E%3Ccircle cx='116' cy='62' r='2'/%3E%3Ccircle cx='26' cy='116' r='2'/%3E%3Ccircle cx='68' cy='112' r='1.8'/%3E%3Ccircle cx='90' cy='26' r='1.6'/%3E%3Ccircle cx='4' cy='38' r='1.8'/%3E%3C/g%3E%3C/g%3E%3C/defs%3E%3Cuse xlink:href='%23t' transform='translate(48,48) scale(.8) translate(-60,-60)'/%3E%3Cuse xlink:href='%23t' transform='translate(144,48) rotate(90) scale(.8) translate(-60,-60)'/%3E%3Cuse xlink:href='%23t' transform='translate(48,144) rotate(270) scale(.8) translate(-60,-60)'/%3E%3Cuse xlink:href='%23t' transform='translate(144,144) rotate(180) scale(.8) translate(-60,-60)'/%3E%3C/svg%3E");
  color:var(--tg-theme-text-color, #fff);font-family:Inter,"SF Pro Text",system-ui,sans-serif;overscroll-behavior:none;text-align:left;line-height:normal;box-sizing:border-box
}
@media (min-width: 1024px) {
  .spin-root { background-size: 240px 240px; }
}
.spin-root *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.spin-root button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;padding:0}
.spin-root :focus-visible{outline:calc(.3*var(--u)) solid #7cc4ff;outline-offset:calc(.3*var(--u))}
.spin-root .app{
  position:relative;width:var(--w);height:100%;margin:0 auto;flex:none;
  background-color:transparent;
  display:grid;grid-template-rows:1fr auto;overflow:hidden;isolation:isolate;padding-top:env(safe-area-inset-top,0px)
}
.spin-root .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.spin-root #reel-mount{position:relative;min-height:0;z-index:1}
.spin-root .reel{position:absolute;inset:0;overflow:hidden;--grow:0;contain:layout}
.spin-root .reel__track{
  position:absolute;left:0;right:0;top:calc(50% - calc(73.85*var(--u)));
  will-change:transform;
  transform:translate3d(0,0,0);
  -webkit-transform:translate3d(0,0,0);
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden;
}
.spin-root .ticket{
  --c1:#4aa8f0;--c2:#269BE8;--c3:#1673b8;--ink:rgba(10,50,85,.9);--bonus:0;
  position:relative;width:calc(24.2*var(--u));height:calc(16*var(--u));
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden;
  transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .4s ease;
}
.spin-root.is-spinning .ticket,
.spin-root .is-spinning .ticket{
  transition:none !important;
}
.spin-root .slot{height:calc(21.1*var(--u));display:grid;place-items:center}
.spin-root .reel__track > .slot:first-child .ticket,
.spin-root .reel__track > .slot:last-child .ticket{opacity:.35;transform:scale(.92)}
.spin-root .reel__track > .slot:nth-child(2) .ticket,
.spin-root .reel__track > .slot:nth-child(6) .ticket{opacity:.88;transform:scale(.96)}
.spin-root .reel__track > .slot:nth-child(3) .ticket,
.spin-root .reel__track > .slot:nth-child(5) .ticket{opacity:.97;transform:scale(.99)}
.spin-root .reel__track > .slot:nth-child(4) .ticket.is-focus{opacity:1;transform:scale(calc(1.08 + var(--grow) + var(--bonus)));z-index:3}
.spin-root .ticket.is-winning-lift{
  transform:scale(1.15) translate3d(0, calc(-0.8*var(--u)), 0) !important;
  opacity:1 !important;
  z-index:10 !important;
  transition:transform .55s cubic-bezier(.16,1,.3,1),opacity .45s ease !important;
  box-shadow:0 0 25px rgba(56,176,255,.35);
}
.spin-root .reel__fog{position:absolute;left:0;right:0;height:22%;z-index:4;pointer-events:none}
.spin-root .reel__fog--top{top:0;background:linear-gradient(180deg,var(--tg-theme-bg-color, #0e1621) 0%,rgba(14,22,33,.85) 35%,rgba(14,22,33,.15) 80%,transparent 100%)}
.spin-root .reel__fog--bottom{display:none !important}

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
  position:absolute;inset:0;
  background:var(--rim) center/100% 100% no-repeat,linear-gradient(180deg,var(--c1),var(--c2) 46%,var(--c3));
  -webkit-mask:var(--tk) center/100% 100% no-repeat;
  mask:var(--tk) center/100% 100% no-repeat;
  -webkit-mask-size:100% 100%;
  mask-size:100% 100%;
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden;
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
  opacity:0;visibility:hidden;pointer-events:none;
  background:rgba(8,14,24,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  transition:opacity .45s cubic-bezier(.2,.9,.3,1),visibility .45s ease;
}
.spin-root .jackpot.is-on{opacity:1;visibility:visible;pointer-events:auto}
.spin-root .jackpot__label{
  position:absolute;left:0;right:0;top:calc(50% - calc(23*var(--u)));
  margin:0;text-align:center;font-size:max(18px,calc(3*var(--u)));
  font-weight:800;color:#fff;letter-spacing:-.02em;
  opacity:0;transform:translateY(calc(1.8*var(--u)));
  transition:opacity .45s .1s cubic-bezier(.16,1,.3,1),transform .5s .1s cubic-bezier(.16,1,.3,1);
  z-index:12
}
.spin-root .is-on .jackpot__label{opacity:1;transform:translateY(0)}
.spin-root .jackpot[data-tier=gold] .jackpot__label{color:#ffd96e}
.spin-root .jackpot__card{
  position:relative;transform:scale(1.02) translateY(calc(1.5*var(--u)));opacity:0;
  transition:transform .52s cubic-bezier(.16,1,.3,1),opacity .45s ease;
  z-index:10;display:flex;align-items:center;justify-content:center
}
.spin-root .is-on .jackpot__card{transform:scale(1.48) translateY(0);opacity:1}
.spin-root .jackpot .slot{height:auto}
.spin-root .jackpot .ticket,
.spin-root .ticket.is-win{opacity:1 !important;filter:drop-shadow(0 calc(1.5*var(--u)) calc(3.5*var(--u)) rgba(0,0,0,.75))}
.spin-root .jackpot__sub{
  position:absolute;left:0;right:0;top:calc(50% + calc(16*var(--u)));
  margin:0;padding:0 calc(4*var(--u));text-align:center;
  font-size:max(13px,calc(2.2*var(--u)));font-weight:600;color:#f3d890;
  opacity:0;transform:translateY(calc(-1*var(--u)));
  transition:opacity .45s .18s ease-out,transform .45s .18s cubic-bezier(.16,1,.3,1);
  z-index:12
}
.spin-root .is-on .jackpot__sub{opacity:1;transform:translateY(0)}
.spin-root .jackpot__close{
  position:absolute;bottom:calc(calc(5.5*var(--u)) + env(safe-area-inset-bottom,16px));
  left:50%;translate:-50% 0;min-height:max(48px,calc(6*var(--u)));
  padding:0 calc(5*var(--u));border-radius:calc(2.4*var(--u));
  background:linear-gradient(180deg,#38b0ff,#1d83dc 60%,#176cc0);
  color:#fff;font-size:max(15px,calc(2.6*var(--u)));font-weight:700;
  opacity:0;transform:translateY(calc(1.5*var(--u)));
  transition:opacity .4s .22s cubic-bezier(.16,1,.3,1),transform .45s .22s cubic-bezier(.16,1,.3,1);
  z-index:15;box-shadow:0 8px 24px rgba(30,131,220,.35)
}
.spin-root .is-on .jackpot__close{opacity:1;transform:translateY(0)}
.spin-root .panel{position:relative;z-index:4;background:var(--tg-theme-secondary-bg-color, #111b2f);border-radius:calc(3.4*var(--u)) calc(3.4*var(--u)) 0 0;padding:calc(2*var(--u)) calc(2.4*var(--u)) calc(calc(1.8*var(--u)) + env(safe-area-inset-bottom,0px));border-top:1px solid var(--tg-theme-separator-color, rgba(255,255,255,.08));box-shadow:none}
.spin-root .panel__row{display:flex;align-items:center;justify-content:space-between;gap:calc(1*var(--u))}
.spin-root .balance{display:flex;align-items:center;gap:calc(2*var(--u));min-width:0}
.spin-root .balance .coin{width:calc(6.6*var(--u));height:calc(6.6*var(--u))}
.spin-root .balance strong{display:block;font-size:max(13px,calc(2.4*var(--u)));font-weight:700;white-space:nowrap;color:var(--tg-theme-text-color, #fff)}
.spin-root .balance-actions{display:flex;align-items:center;gap:calc(.8*var(--u));margin-top:calc(.4*var(--u))}
.spin-root .balance button{font-size:max(11px,calc(2.1*var(--u)));font-weight:600;color:var(--tg-theme-link-color, #4aa8f0);padding:calc(.2*var(--u)) calc(.6*var(--u));border-radius:calc(.6*var(--u));background:rgba(74,168,240,.1);transition:background .2s,transform .1s}
.spin-root .balance button:hover{background:rgba(74,168,240,.2)}
.spin-root .balance button:active{transform:scale(.95)}
.spin-root .balance button.withdraw-btn{color:var(--tg-theme-button-color, #34d399);background:rgba(52,211,153,.12)}
.spin-root .balance button.withdraw-btn:hover{background:rgba(52,211,153,.22)}
.spin-root .bet{display:flex;flex-direction:column;align-items:flex-end;gap:calc(.5*var(--u))}
.spin-root .bet__row{display:flex;align-items:center}
.spin-root .bet__step{width:max(38px,calc(6*var(--u)));height:max(38px,calc(6*var(--u)));display:grid;place-items:center;border-radius:50%;color:var(--tg-theme-button-color, #4aa8f0);background:rgba(74,168,240,.08);transition:transform .15s,background .2s}
.spin-root .bet__step svg{width:calc(2.6*var(--u));height:calc(2.6*var(--u))}
.spin-root .bet__step:hover{background:rgba(74,168,240,.18)}
.spin-root .bet__step:active{transform:scale(.88)}
.spin-root .bet__step:disabled{opacity:.25;cursor:default}
.spin-root .bet__value{min-width:calc(6.5*var(--u));text-align:center;font-size:max(15px,calc(2.8*var(--u)));font-weight:700;font-variant-numeric:tabular-nums;cursor:pointer;padding:calc(.2*var(--u)) calc(.4*var(--u));border-radius:calc(.6*var(--u));transition:background .2s;color:var(--tg-theme-text-color, #fff)}
.spin-root .bet__value:hover{background:rgba(74,168,240,.1)}
.spin-root .bet small{font-size:max(11px,calc(2*var(--u)));font-weight:500;color:var(--tg-theme-hint-color, #94a3b8);white-space:nowrap;padding-right:calc(.3*var(--u))}
.spin-root .actions{display:grid;grid-template-columns:19.7fr 36.9fr;gap:calc(1.8*var(--u));margin-top:calc(1.4*var(--u))}
.spin-root .act{height:max(50px,calc(8.2*var(--u)));border-radius:calc(2.4*var(--u));font-size:max(15px,calc(2.7*var(--u)));font-weight:700;display:flex;align-items:center;justify-content:center;gap:calc(1*var(--u));transition:transform .15s ease,background .25s,box-shadow .25s;box-shadow:inset 0 calc(.1*var(--u)) 0 rgba(255,255,255,.1),0 calc(.4*var(--u)) calc(1.2*var(--u)) rgba(0,0,0,.5);white-space:nowrap}
.spin-root .act:active:not(:disabled){transform:scale(.97)}
.spin-root .auto{background:rgba(255,255,255,.06);color:var(--tg-theme-link-color, #3fa6ea)}
.spin-root .auto:hover{background:rgba(255,255,255,.1)}
.spin-root .auto__dot{width:calc(1.1*var(--u));height:calc(1.1*var(--u));border-radius:50%;background:#3a5167;transition:background .25s}
.spin-root .auto[aria-pressed=true]{background:var(--tg-theme-link-color, #1f4a73);color:#fff;box-shadow:inset 0 0 0 calc(.2*var(--u)) #3fa6ea}
.spin-root .spin{background:var(--tg-theme-button-color, #38b0ff);color:var(--tg-theme-button-text-color, #fff);box-shadow:inset 0 calc(.15*var(--u)) 0 rgba(255,255,255,.35)}
.spin-root .spin.is-free{background:var(--tg-theme-button-color, #38b0ff);color:var(--tg-theme-button-text-color, #fff)}
.spin-root .spin:hover:not(:disabled){filter:brightness(1.08)}
.spin-root .spin:disabled{cursor:default;background:rgba(125,125,125,.3);color:var(--tg-theme-hint-color, #d6ecff);opacity:.7}
.spin-root .referral-strip{display:flex;align-items:center;justify-content:space-between;gap:calc(1*var(--u));margin-top:calc(1.4*var(--u));padding:calc(.9*var(--u)) calc(1.4*var(--u));border-radius:calc(1.8*var(--u));background:rgba(255,255,255,.05);border:1px solid var(--tg-theme-separator-color, rgba(255,255,255,.08))}
.spin-root .referral-strip p{margin:0;font-size:max(11px,calc(1.9*var(--u)));color:var(--tg-theme-hint-color, #cbd5e1);font-weight:600}
.spin-root .referral-strip .ref-btns{display:flex;gap:calc(.8*var(--u))}
.spin-root .referral-strip button{padding:calc(.5*var(--u)) calc(1.2*var(--u));border-radius:calc(1*var(--u));font-size:max(11px,calc(1.9*var(--u)));font-weight:700;display:flex;align-items:center}
.spin-root .ref-btn-story{background:var(--tg-theme-button-color, #0088cc);color:var(--tg-theme-button-text-color, #fff)}
.spin-root .ref-btn-copy{background:rgba(255,255,255,.1);color:var(--tg-theme-text-color, #fff)}
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
  const [hostEl, setHostEl] = useState<HTMLDivElement | null>(null);
  const host = useCallback((node: HTMLDivElement | null) => {
    setHostEl(node);
  }, []);
  const navigate = useNavigate();
  const { user, creditUserBalance, systemSettings } = useAuth();
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const openStoryRef = useRef(() => setIsStoryModalOpen(true));
  openStoryRef.current = () => setIsStoryModalOpen(true);
  const openWithdrawRef = useRef(() => setIsWithdrawOpen(true));
  openWithdrawRef.current = () => setIsWithdrawOpen(true);
  const userRef = useRef(user);
  userRef.current = user;
  const systemSettingsRef = useRef(systemSettings);
  systemSettingsRef.current = systemSettings;
  const creditRef = useRef(creditUserBalance);
  creditRef.current = creditUserBalance;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const balancePanelRef = useRef<any>(null);
  const isSpinningRef = useRef(false);
  const initialBal = Number(user?.balance !== undefined && Number(user.balance) > 0 ? user.balance : (user?.cryptoBalances?.USDT ?? 500));
  const localBalRef = useRef(initialBal || 500);

  const fmt = n => {
    if (typeof n !== 'number' || isNaN(n)) return '0';
    const v = Math.round(n * 100) / 100;
    return v % 1 === 0 ? String(v) : v.toFixed(2);
  };

  useEffect(() => {
    if (!hostEl) return;
    const sr = hostEl.shadowRoot;
    const balEl = sr?.querySelector('#spin-bal');
    if (balEl && user) {
      const b = Number(user.balance !== undefined ? user.balance : (user.cryptoBalances?.USDT ?? 0));
      if (!isSpinningRef.current) {
        localBalRef.current = b;
        balEl.textContent = fmt(b);
        balancePanelRef.current?.update?.(b);
      }
    }
  }, [hostEl, user?.balance, user?.cryptoBalances?.USDT]);

  useEffect(() => {
    if (!hostEl) return;
    const sr = hostEl.shadowRoot || hostEl.attachShadow({ mode: "open" });
    sr.innerHTML = `<style>${CSS}</style><div class="spin-root">${MARKUP}</div>`;
    const rootEl = sr.querySelector(".spin-root") as HTMLElement;
    if (!rootEl) return;

    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = '#0e1621';
    document.documentElement.style.backgroundColor = '#0e1621';

    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready?.();
        tg.expand?.();
        if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor('#0e1621');
        if (typeof tg.setBackgroundColor === 'function') tg.setBackgroundColor('#0e1621');
        if (typeof tg.setBottomBarColor === 'function') tg.setBottomBarColor('#0e1621');
      }
    } catch {}

    const freeSpinKey = `tonflame_freespin_${userRef.current?.id || userRef.current?.telegramId || 'guest'}`;
    let isFreeSpinAvailable = !localStorage.getItem(freeSpinKey);

    // Standard requested bet tiers: 1, 2, 4, 5, 10, 20, 50
    const BET_TIERS = [1, 2, 4, 5, 10, 20, 50];
    const BET_MIN = BET_TIERS[0], BET_MAX = BET_TIERS[BET_TIERS.length - 1];
    const ROYAL_BY_BET = { 0: 500, 1: 500, 2: 1000, 4: 1200, 5: 1500, 10: 2000, 20: 2500, 50: 3000 };
    const getRoyalPrize = v => ROYAL_BY_BET[v] || (v ? v * 60 : 500);

    // Visual surrounding cards on track for high excitement + calibrated realistic weights for house safety
    const POOLS_BY_BET = {
      0: [
        { base: 1.2, tier: 'teal', w: 25 },
        { base: 2, tier: 'blue', w: 20 },
        { base: 3, tier: 'orange', w: 15 },
        { base: 4, tier: 'pink', w: 8 },
        { base: 8, tier: 'green', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
        { base: 500, tier: 'gold', w: 0.001 }
      ],
      1: [
        { base: 1.2, tier: 'teal', w: 25 },
        { base: 2, tier: 'blue', w: 20 },
        { base: 3, tier: 'orange', w: 15 },
        { base: 4, tier: 'pink', w: 8 },
        { base: 8, tier: 'green', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
        { base: 500, tier: 'gold', w: 0.001 }
      ],
      2: [
        { base: 2.4, tier: 'teal', w: 25 },
        { base: 4, tier: 'blue', w: 20 },
        { base: 6, tier: 'orange', w: 15 },
        { base: 8, tier: 'pink', w: 8 },
        { base: 16, tier: 'green', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
        { base: 1000, tier: 'gold', w: 0.001 }
      ],
      4: [
        { base: 4.8, tier: 'teal', w: 25 },
        { base: 8, tier: 'blue', w: 20 },
        { base: 12, tier: 'orange', w: 15 },
        { base: 16, tier: 'pink', w: 8 },
        { base: 32, tier: 'green', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
        { base: 1200, tier: 'gold', w: 0.001 }
      ],
      5: [
        { base: 6, tier: 'teal', w: 25 },
        { base: 10, tier: 'blue', w: 20 },
        { base: 15, tier: 'orange', w: 15 },
        { base: 20, tier: 'pink', w: 8 },
        { base: 40, tier: 'green', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
        { base: 1500, tier: 'gold', w: 0.001 }
      ],
      10: [
        { base: 12, tier: 'teal', w: 25 },
        { base: 20, tier: 'blue', w: 20 },
        { base: 30, tier: 'orange', w: 15 },
        { base: 40, tier: 'pink', w: 8 },
        { base: 80, tier: 'green', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
        { base: 2000, tier: 'gold', w: 0.001 }
      ],
      20: [
        { base: 24, tier: 'teal', w: 25 },
        { base: 40, tier: 'blue', w: 20 },
        { base: 60, tier: 'orange', w: 15 },
        { base: 80, tier: 'pink', w: 8 },
        { base: 160, tier: 'green', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
        { base: 2500, tier: 'gold', w: 0.001 }
      ],
      50: [
        { base: 50, tier: 'blue', w: 25 },
        { base: 65, tier: 'teal', w: 20 },
        { base: 80, tier: 'orange', w: 15 },
        { base: 105, tier: 'green', w: 8 },
        { base: 200, tier: 'violet', w: 2 },
        { base: 0, tier: 'gray', isZero: true, w: 29.999 },
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

    const easeSpin = t => 1 - Math.pow(1 - t, 4);
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeSmoothSlide = t => 1 - Math.pow(1 - t, 3.5);
    const SPIN_MS = 4500, SPIN_CARDS = 28;

    // Lightweight Web Audio synthesizer synchronized perfectly with sliding reel
    const Sound = {
      ctx: null, on: true, lastTick: 0,
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
        const now = performance.now();
        if (now - this.lastTick < 35) return;
        this.lastTick = now;
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
      const currentBet = Econ.bet || 1;
      const val = isGold ? getRoyalPrize(currentBet) : p.base;
      const t = isZero ? '0' : fmt(val);
      const [fs, cn] = sizing(t);
      const subLabel = isZero ? 'Try Again' : 'Tether';
      return `<div class="slot"><article class="ticket${isGold && Econ.vip ? ' is-vip' : ''}" data-tier="${p.tier}" data-base="${val}" style="--fs:calc(${fs}*var(--u));--cn:calc(${cn}*var(--u))"><div class="ticket__body"><div class="ticket__frame"><div class="ticket__amount">${isZero ? '' : Coin()}<b>${t}</b></div><span>${subLabel}</span></div></div>${isGold ? `<span class="vip" aria-hidden="true">${PACK_NAME.toUpperCase()}</span>` : ''}</article></div>`;
    };

    class PrizeReel {
      constructor(mount) {
        mount.innerHTML = `<section class="reel" aria-label="Prize reel"><div class="reel__fog reel__fog--top"></div>
        <button class="nav nav--prev" type="button" aria-label="Previous prize"><svg viewBox="0 0 38 52"><path d="M7 5.500L32 24a2.800 2.800 0 0 1 0 4L7 46.500C4 48.800 2 47.800 2 44V8c0-3.800 2-4.800 5-2.500z" fill="#269BE8" stroke="#269BE8" stroke-width="4" stroke-linejoin="round"/></svg></button>
        <button class="nav nav--next" type="button" aria-label="Next prize"><svg viewBox="0 0 38 52"><path d="M31 5.500L6 24a2.800 2.800 0 0 0 0 4l25 18.500c3 2.300 5 1.300 5-2.500V8c0-3.800-2-4.800-5-2.500z" fill="#269BE8" stroke="#269BE8" stroke-width="4" stroke-linejoin="round"/></svg></button>
        <div class="reel__track"></div></section>`;
        this.root = mount.firstElementChild;
        this.track = this.root.querySelector('.reel__track');
        this.navs = [...this.root.querySelectorAll('.nav')];
        
        const initPool = POOLS_BY_BET[1];
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
        const pool = POOLS_BY_BET[betVal] || POOLS_BY_BET[1];
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
        const activeBet = Econ.bet || 1;
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
        const p = this.pitch(), activeBet = Econ.bet || 1;
        const fresh = dir > 0 ? sequence(this.view, 1, 0, null, activeBet)[0] : pickFrom(this.view.slice(0, 5).map(x => x.base), activeBet);
        this.setBusy(true); Sound.ui('nav'); this.focusCard()?.classList.remove('is-focus');
        let list;
        if (dir > 0) {
          list = [...this.view, fresh];
          this.track.insertAdjacentHTML('beforeend', PrizeCard(fresh));
          await this.run(list, 0, -p, 420, easeSmoothSlide, 1);
        } else {
          list = [fresh, ...this.view];
          this.track.insertAdjacentHTML('afterbegin', PrizeCard(fresh));
          await this.run(list, -p, 0, 420, easeSmoothSlide, 0);
        }
        this.settle(false); this.setBusy(false);
      }
    }

    const getCurrentBalance = () => userRef.current?.balance ?? userRef.current?.cryptoBalances?.USDT ?? 0;

    class BalancePanel {
      constructor() {
        this.el = document.createElement('div');
        this.el.className = 'balance';
        this.el.innerHTML = `${Coin()}<div><strong>Balance <span id="spin-bal">${fmt(localBalRef.current)}</span> USDT</strong><div class="balance-actions"><button type="button" id="deposit-btn">Deposit &rsaquo;</button><button type="button" class="withdraw-btn" id="withdraw-btn">Withdraw &rsaquo;</button></div></div>`;
        this.el.querySelector('#deposit-btn').onclick = () => {
          const currentBetVal = bet?.value || 10;
          navigateRef.current(`/deposit?amount=${currentBetVal}`, {
            state: { amount: currentBetVal, initialAmount: currentBetVal, fromSpin: true }
          });
        };
        this.el.querySelector('#withdraw-btn').onclick = () => {
          Sound.init();
          Sound.ui('press');
          if (typeof openWithdrawRef.current === 'function') {
            openWithdrawRef.current();
          }
        };
        balancePanelRef.current = this;
      }
      update(val) {
        localBalRef.current = Number(val);
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
        const currentBet = this.getBet();
        if (isFreeSpinAvailable && currentBet === 1) {
          this.spin.classList.add('is-free');
          this.spin.textContent = busy ? 'Spinning...' : 'Free Spin';
        } else {
          this.spin.classList.remove('is-free');
          this.spin.textContent = busy ? 'Spinning...' : `Spin for $${currentBet}`;
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
    const botUser = (systemSettingsRef.current?.primaryBotUsername || userRef.current?.sourceBotUsername || 'TonFlame_Bot').replace('@', '');
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
            setTimeout(res, 450);
          };
          const key = e => { if (e.key === 'Escape' || e.key === 'Enter') close(); };
          const timer = setTimeout(close, 4000);
          el.querySelector('.jackpot__close').onclick = close;
          el.addEventListener('click', close);
          document.addEventListener('keydown', key);
        });
      }
    };

    // Spin execution engine with profitable house edge distribution & deterministic balance management
    async function runSpin() {
      if (reel.busy || isSpinningRef.current) return;
      isSpinningRef.current = true;

      try {
        const isFree = isFreeSpinAvailable && bet.value === 1;
        const cost = isFree ? 0 : bet.value;
        const currentBal = localBalRef.current;

        // When balance is insufficient on paid spin, immediately redirect directly to deposit page with selected amount prefilled
        if (!isFree) {
          if (typeof cost !== 'number' || isNaN(cost) || !BET_TIERS.includes(cost)) {
            announce.textContent = 'Security Error: Unauthorized bet.';
            Sound.ui('dud');
            isSpinningRef.current = false;
            return;
          }
          if (currentBal < cost) {
            Sound.ui('dud');
            autoOn = false;
            actions.auto.setAttribute('aria-pressed', 'false');
            isSpinningRef.current = false;
            navigateRef.current(`/deposit?amount=${cost}`, {
              state: { amount: cost, initialAmount: cost, fromSpin: true }
            });
            return;
          }
        }

        Sound.init();

        // 1. If paid spin, deduct cost immediately from local balance and UI
        if (!isFree && cost > 0) {
          const balAfterBet = Math.max(0, parseFloat((currentBal - cost).toFixed(2)));
          balance.update(balAfterBet);
          if (typeof creditRef.current === 'function') {
            creditRef.current(-cost, 'USDT');
          }
        }

        // Guaranteed starter bonus for free spin picked from visible amounts (1.2 or 2 USDT)
        let forcedPrize = null;
        if (isFree) {
          const freeWinOptions = [1.2, 2];
          const winAmount = freeWinOptions[Math.floor(Math.random() * freeWinOptions.length)];
          forcedPrize = { base: winAmount, tier: winAmount === 1.2 ? 'teal' : 'blue' };
        }

        // 2. Execute reel spin animation
        const win = await reel.spin(forcedPrize);
        const isGold = win.tier === 'gold';
        const reward = isGold ? getRoyalPrize(Econ.bet) : Number(win.base || 0);

        // Consume free spin strictly ONCE in live, kept testable
        if (isFree) {
          localStorage.setItem(freeSpinKey, 'true');
          isFreeSpinAvailable = false;
          actions.paint(false);
        }

        // 3. Add winning reward accurately to balance and persist
        if (reward > 0) {
          const balWithPrize = parseFloat((localBalRef.current + reward).toFixed(2));
          balance.update(balWithPrize);

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
              network: 'TonFlame Platform',
              status: 'completed',
              createdAt: Date.now(),
              note: 'TonFlame Gift',
              recipient: 'TonFlame Gift'
            }).catch(() => {});

            // Reward referrer 10% commission on win
            if (userRef.current?.referredBy) {
              rewardReferrerCommission(userRef.current, reward, 'spin_win').catch(() => {});
            }
          } catch {}
        } else {
          // If win is 0, ensure current deducted balance remains active
          balance.update(localBalRef.current);
        }

        // 4. Smoothly elevate the winning card on the reel, then open the celebration modal
        const focusCard = reel.focusCard();
        if (reward > 0) {
          if (focusCard) {
            focusCard.classList.add('is-winning-lift');
          }
          await new Promise(r => setTimeout(r, 480));
          await Jackpot.show(win, `+${fmt(reward)} USDT added to your balance!`, isFree);
          if (focusCard) {
            focusCard.classList.remove('is-winning-lift');
          }
        } else {
          Sound.ui('dud');
          announce.textContent = 'Try Again!';
          await new Promise(r => setTimeout(r, 400));
        }

        if (isFree) {
          reel.updateTierView(bet.value);
        }
      } finally {
        isSpinningRef.current = false;
      }

      if (autoOn) setTimeout(() => { if (autoOn && !reel.busy) runSpin(); }, 1400);
    }

    return () => {
      autoOn = false;
      document.body.style.backgroundColor = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBg;
      try {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
          if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor('#000000');
          if (typeof tg.setBackgroundColor === 'function') tg.setBackgroundColor('#000000');
          if (typeof tg.setBottomBarColor === 'function') tg.setBottomBarColor('#000000');
        }
      } catch {}
      if (Sound.ctx && typeof Sound.ctx.close === 'function') {
        try { Sound.ctx.close(); } catch {}
      }
    };
  }, [hostEl]);

  const vars: any = {
    display: "block",
    width: "100%",
    height: "var(--spin-h, 100dvh)",
    position: "relative",
    ...(height !== undefined ? { "--spin-h": typeof height === "number" ? height + "px" : height } : {}),
    ...style,
  };

  const handleWithdrawSubmit = async ({ amount: withdrawAmt, network: withdrawNet, address: withdrawAddr }: { amount: number; network: string; address: string }) => {
    const curUserId = user?.id || (user as any)?.uid || 'guest_user';
    const res = await submitWithdrawal({
      userId: curUserId,
      telegramUsername: user?.telegramUsername || '',
      telegramId: user?.telegramId || '',
      amount: withdrawAmt,
      currency: 'USDT',
      network: withdrawNet,
      recipient: withdrawAddr,
    });
    if (!res.success) {
      throw new Error(res.message || 'Withdrawal rejected');
    }
    const newBal = Math.max(0, localBalRef.current - withdrawAmt);
    localBalRef.current = newBal;
    balancePanelRef.current?.update?.(newBal);
    return { id: res.tx?.txid || res.tx?.id || `WD-${Date.now()}` };
  };

  return (
    <SpinWin user={user}>
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
      <WithdrawModal
        open={isWithdrawOpen}
        available={localBalRef.current}
        onClose={() => setIsWithdrawOpen(false)}
        onBack={() => setIsWithdrawOpen(false)}
        onSubmit={handleWithdrawSubmit}
      />
    </SpinWin>
  );
}

export default Spin;
