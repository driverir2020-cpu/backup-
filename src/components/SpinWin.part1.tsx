// @ts-nocheck
/**
 * ===================================================================
 *  SpinWin — PART 1 of 2  ·  VISUAL LAYER (markup + styles only, NO logic)
 * ===================================================================
 */

export const CSS = `.sw-root{position:fixed;inset:0;z-index:2147483000;margin:0;overflow:hidden;touch-action:none;-webkit-tap-highlight-color:transparent;user-select:none;color-scheme:dark;box-sizing:border-box}
.sw-root,.sw-root *{box-sizing:border-box}
.sw-gbg{position:absolute;inset:0;will-change:opacity;background:radial-gradient(circle at 18% 14%,#1f3b66,transparent 46%),radial-gradient(circle at 86% 82%,#4b2b66,transparent 46%),#0a0f1a}
.sw-host{position:absolute;inset:0}
.sw-root #wcd{will-change:transform}
.sw-root *{box-sizing:border-box}
.sw-root #wrap{position:fixed;inset:0;overflow:hidden}
.sw-root #bd{position:absolute;inset:0;background:#000;opacity:0}
.sw-root #sheet{position:absolute;left:0;right:0;top:calc(10px + env(safe-area-inset-top,0px));bottom:0;border-radius:28px 28px 0 0;background:linear-gradient(#1a2030,#0b0e16);box-shadow:0 -12px 50px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08);will-change:transform;transform:translate3d(0,110vh,0)}
.sw-root #grab{position:absolute;left:50%;top:8px;width:38px;height:5px;margin-left:-19px;border-radius:3px;background:#475068}
.sw-root #dev{position:absolute;left:50%;top:calc(26px + (100% - 26px)/2);width:408px;height:867px;margin:-433.5px 0 0 -204px;transform-origin:50% 50%}
.sw-root #fr{position:relative;width:408px;height:867px;border-radius:62px;padding:2.5px;background:linear-gradient(135deg,#8c8e96,#3a3b41 25%,#a7a9b0 50%,#303136 75%,#7c7e86);box-shadow:0 24px 60px rgba(0,0,0,.55)}
.sw-root #fr i{position:absolute;width:3px;border-radius:2px;background:#5a5c64}
.sw-root #bz{width:100%;height:100%;border-radius:59.5px;background:#000;padding:5px}
.sw-root #scr{position:relative;width:393px;height:852px;border-radius:54px;overflow:hidden;background:#000}
.sw-root #isl{position:absolute;left:50%;top:11px;width:112px;height:32px;margin-left:-56px;border-radius:20px;background:#000;z-index:30;box-shadow:0 0 0 1px #0d0d11}
.sw-root #isl::after{content:'';position:absolute;right:11px;top:10px;width:11px;height:11px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#2a3350,#0b0d16 60%)}
.sw-root #sbar{position:absolute;top:18px;left:0;right:0;height:22px;z-index:29;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif;font-weight:600;font-size:16.5px;color:#fff}
.sw-root #sbar span{position:absolute;left:46px;top:1px}
.sw-root #sbar svg{position:absolute;top:4px}
.sw-root #hi{position:absolute;left:50%;bottom:8px;width:138px;height:5px;margin-left:-69px;border-radius:3px;background:#fff;opacity:.92;z-index:30}
.sw-root #scr::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.05),transparent 26%);z-index:31}
.sw-root #app{position:absolute;left:0;top:0;width:364px;height:789px;transform:scale(1.0797);transform-origin:0 0;overflow:hidden;direction:ltr;font-family:Roboto,system-ui,"Segoe UI",sans-serif;color:#fff;-webkit-font-smoothing:antialiased;background:#000 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' fill='none' stroke='%23191a20' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 32c-6-6 1-14 7-8 6-6 13 2 7 8l-7 7z'/%3E%3Cpath d='M82 20a10 10 0 1 0 8 16a8 8 0 0 1-8-16z'/%3E%3Cpath d='M60 78l3 7 7 3-7 3-3 7-3-7-7-3 7-3z'/%3E%3Ccircle cx='22' cy='92' r='7'/%3E%3Cpath d='M92 90l2 5 5 2-5 2-2 5-2-5-5-2 5-2z'/%3E%3C/svg%3E")}
.sw-root .hb{position:absolute;top:54px;width:38px;height:38px;display:grid;place-items:center;background:#1b1b1e;border:1px solid #3a3a3f;z-index:10}
.sw-root #rays{position:absolute;left:-48px;width:460px;height:460px;border-radius:50%;opacity:0;will-change:transform;background:repeating-conic-gradient(rgba(255,196,70,.38) 0 7deg,transparent 7deg 22deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 68%);mask:radial-gradient(circle,#000 0,transparent 68%)}
.sw-root #reel{position:absolute;left:2px;width:360px;overflow:hidden}
.sw-root #strip{position:absolute;left:0;top:0;width:360px;will-change:transform}
.sw-root .t{position:absolute;left:103px;width:154px;height:101.5px;background-size:100% 100%;background-repeat:no-repeat}
.sw-root .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--tx)}
.sw-root .sh{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;clip-path:path('M0 22.8L13.7 0H140.3L154 22.8V78.7Q142.6 86.7 138 101.5H16Q11.4 86.7 0 78.7Z')}
.sw-root .n{display:flex;align-items:center;gap:6px;font-weight:700;font-size:32px;line-height:34px;letter-spacing:-.3px;white-space:nowrap}
.sw-root .n svg{width:31px;height:31px;flex:none}
.sw-root .l{font-size:13.7px;line-height:16px;margin-top:3px;font-weight:500;opacity:.78}
.sw-root .orange{--tx:#5c2a08}
.sw-root .gold{--tx:#5a3d09}
.sw-root .purple{--tx:#2a1552}
.sw-root .blue{--tx:#10304f}
.sw-root .pink{--tx:#4a0b2c}
.sw-root .teal{--tx:#06403a}
.sw-root .ar{position:absolute;width:0;height:0;border:13px solid transparent;z-index:3}
.sw-root #bn{position:absolute;left:0;right:0;top:104px;text-align:center;opacity:0;z-index:12;text-shadow:0 2px 14px rgba(0,0,0,.45);will-change:transform,opacity}
.sw-root #bn small{display:block;font-size:15px;color:#d6deea;font-weight:500}
.sw-root #bn b{font-size:38px;color:#FFD66B}
.sw-root #cf{position:absolute;left:0;top:0;width:364px;height:789px;z-index:14;pointer-events:none}
.sw-root #pn{position:absolute;left:0;right:0;bottom:0;height:184px;border-radius:22px 22px 0 0;background:linear-gradient(#111c31,#0e1727);border-top:1px solid #1d2b47;z-index:8}
.sw-root #pn>*{position:absolute}
.sw-root #pn svg.ti{left:14px;top:12px;width:38px;height:38px}
.sw-root #bal{left:63px;top:15px;font-size:15px;font-weight:700}
.sw-root #dp{transform-origin:0 50%;left:63px;top:36px;font-size:14px;font-weight:500;color:#3E9BEA}
.sw-root .cb{top:11px;width:35px;height:35px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:#13223c}
.sw-root #mi{left:244px;color:#2c3c58}
.sw-root #pl{left:314px;color:#3E9BEA}
.sw-root #stk{left:277px;top:15px;width:40px;text-align:center;font-size:18px;font-weight:700}
.sw-root #roy{right:12px;top:48px;font-size:13px;color:#9aa3b5;font-weight:500}
.sw-root .bt{top:70px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:700}
.sw-root #as{left:14px;width:112px;background:#172338;color:#3E9BEA;box-shadow:inset 0 0 0 1px #1d2c47;gap:8px}
.sw-root #as::before{content:'';width:7px;height:7px;border-radius:50%;background:#34507a}
.sw-root #sp{left:136px;width:212px;color:#fff;background:linear-gradient(#39B0FF,#0F72E8);box-shadow:inset 0 1px 0 rgba(255,255,255,.35)}
.sw-root #iv{left:14px;top:125px;width:334px;height:30px;border-radius:12px;background:#0c1423;box-shadow:inset 0 0 0 1px #223250;font-size:13px;font-weight:700;padding:0 0 0 12px;display:flex;align-items:center}
.sw-root #iv u{text-decoration:none;position:absolute;top:4px;height:22px;border-radius:7px;font-size:12px;font-weight:700;display:grid;place-items:center}
.sw-root #lt{position:absolute;left:32px;width:300px;height:230px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,246,222,.95),rgba(255,214,130,.36) 46%,transparent);opacity:0;z-index:6;pointer-events:none;will-change:transform,opacity}
.sw-root .shn{position:absolute;inset:0;overflow:hidden;pointer-events:none;clip-path:path('M0 22.8L13.7 0H140.3L154 22.8V78.7Q142.6 86.7 138 101.5H16Q11.4 86.7 0 78.7Z')}
.sw-root .shn i{position:absolute;top:0;bottom:0;left:0;width:60px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);transform:translate3d(-160px,0,0) skewX(-18deg)}
.sw-root #reel{contain:layout paint}
.sw-root .t,.sw-root #strip{backface-visibility:hidden}
.sw-root #sheet{background:linear-gradient(#111c31,#0e1727);border-top:1px solid #1d2b47}
.sw-root #grab{background:#2d3e60}
.sw-root #pn{border-radius:30px 30px 0 0}
.sw-root .bt{border-radius:23px}
.sw-root #iv{border-radius:16px}
.sw-root .wc{background:#121c30;border-radius:18px!important;box-shadow:none!important}
.sw-root #wd{border-radius:32px 32px 0 0;border-top:0}
.sw-root #tk{background:#0E141C}
.sw-root .void{--tx:#222a3a}
.sw-root #pw{position:absolute;inset:0;z-index:30;background:rgba(9,13,21,.5);-webkit-backdrop-filter:blur(26px) saturate(1.15);backdrop-filter:blur(26px) saturate(1.15);opacity:0;visibility:hidden;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.sw-root #pw .ic{position:relative;width:96px;height:96px;margin-bottom:22px}
.sw-root #pw .ic svg{position:absolute;inset:0}
.sw-root #pwt{font-size:46px;line-height:52px;font-weight:700;letter-spacing:1px;font-variant-numeric:tabular-nums}
.sw-root #pwl{font-size:18px;font-weight:600;margin:6px 0}
.sw-root #pws{font-size:14px;color:#9aa6bb}
.sw-root #pwp{margin-top:22px;padding:8px 14px;border-radius:16px;background:rgba(255,255,255,.08);font-size:13px;font-weight:500;color:#c9d2e2}
.sw-root #bl{position:absolute;inset:0;z-index:11;background:rgba(6,9,16,.4);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);opacity:0;visibility:hidden;pointer-events:none}
.sw-root #lt{left:-8px!important;width:380px!important;height:300px!important;z-index:12!important}
.sw-root #wcd{left:105px;z-index:13;opacity:0;visibility:hidden}
.sw-root #bn{z-index:14!important}
.sw-root .av.np{background:#1d2230!important}
.sw-root #hnm{max-width:118px}
.sw-root #fg{position:absolute;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.3);border:2px solid rgba(255,255,255,.8);z-index:25;opacity:0;will-change:transform}
.sw-root #rp{position:absolute;left:0;top:0;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;border:3px solid rgba(255,255,255,.8);z-index:24;opacity:0}
.sw-root .av{border-radius:50%;background:linear-gradient(135deg,#5b8cff,#8a5bff) center/cover no-repeat;display:grid;place-items:center;font-weight:700;color:#fff;flex:none;overflow:hidden}
.sw-root #hu{position:absolute;left:50%;top:54px;height:38px;padding:0 14px 0 4px;border-radius:19px;background:#1b1b1e;border:1px solid #3a3a3f;display:flex;align-items:center;gap:8px;z-index:10;font-size:14px;font-weight:500;opacity:0;will-change:transform,opacity}
.sw-root #hu .av{width:30px;height:30px;font-size:13px}
.sw-root #hnm{max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sw-root #wb{position:absolute;inset:0;background:#000;opacity:0;z-index:18;pointer-events:none}
.sw-root #wd{position:absolute;left:0;right:0;bottom:0;height:620px;border-radius:32px 32px 0 0;background:linear-gradient(#141f35,#0e1727);z-index:20;will-change:transform;transform:translate3d(0,620px,0)}
.sw-root #wd>*{position:absolute}
.sw-root .ab{position:absolute}
.sw-root .wl{left:16px;font-size:12px;font-weight:500;color:#8a95a9}
.sw-root .wc{left:16px;width:332px;background:#0c1423;border-radius:14px;box-shadow:inset 0 0 0 1px #223250;transition:box-shadow .25s}
.sw-root .ch{position:absolute;top:0;width:104px;height:40px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:13px;font-weight:700}
.sw-root .wr{position:absolute;left:14px;right:14px;display:flex;justify-content:space-between;font-size:13px;font-weight:500}
.sw-root .wr span:first-child{color:#8a95a9}
.sw-root #wat::after{content:'';display:inline-block;width:1.5px;height:14px;background:#3E9BEA;margin-left:1px;vertical-align:-2px;opacity:var(--cr,0)}
.sw-root #tk{position:absolute;inset:0;z-index:40;background:#0E141C;transform:scale(.9);opacity:0;visibility:hidden;will-change:transform,opacity;overflow:hidden}
.sw-root #ain{position:absolute;inset:0;overflow:hidden;will-change:transform,opacity}
.sw-root #tk>*{position:absolute}
.sw-root .ta{top:208px;width:77px;height:66px;border-radius:22px;background:#151D28;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:12px;font-weight:500;color:#AEB8C8}
.sw-root .tr{height:72px;display:flex;align-items:center;padding:0 16px;gap:12px;position:relative}
.sw-root .tr svg.lg{width:44px;height:44px;flex:none}
.sw-root .tr>div:nth-child(2){flex:1}
.sw-root .t1{font-size:16px;line-height:22px;font-weight:600}
.sw-root .t2{font-size:14px;line-height:19px;color:#8D98AA}
.sw-root .tb{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;font-weight:500;color:#8D98AA}
.sw-root #tkn{position:absolute;left:12px;top:48px;width:340px;height:64px;border-radius:18px;background:rgba(48,54,66,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 10px 30px rgba(0,0,0,.45);z-index:45;opacity:0;transform:translate3d(0,-140px,0);will-change:transform}
.sw-root #hs{position:absolute;inset:0;z-index:-1;opacity:0;visibility:hidden;overflow:hidden;will-change:transform,opacity;transform-origin:50% 50%}
.sw-root #hs .hw{position:absolute;inset:-40px;background:radial-gradient(130% 70% at 15% 8%,#4b3a9a 0,transparent 60%),radial-gradient(110% 60% at 90% 85%,#0b6fa8 0,transparent 62%),linear-gradient(#0e1226,#0a0d1c)}
.sw-root .hi{position:absolute;width:60px;display:flex;flex-direction:column;align-items:center;gap:5px;font-size:11px;font-weight:500;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.5);will-change:transform}
.sw-root .hq{width:60px;height:60px;border-radius:14px;display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.25)}
.sw-root .hd{position:absolute;left:0;right:0;bottom:104px;height:6px;background:radial-gradient(circle,rgba(255,255,255,.9) 0 3px,transparent 3.5px) 150px 0/9px 6px no-repeat,radial-gradient(circle,rgba(255,255,255,.35) 0 3px,transparent 3.5px) 168px 0/9px 6px no-repeat,radial-gradient(circle,rgba(255,255,255,.35) 0 3px,transparent 3.5px) 186px 0/9px 6px no-repeat}
.sw-root .hk{position:absolute;left:12px;right:12px;bottom:22px;height:80px;border-radius:30px;background:rgba(255,255,255,.16);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}
.sw-root #fg2{position:absolute;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.3);border:2px solid rgba(255,255,255,.8);z-index:39;opacity:0;will-change:transform}
.sw-root #ain{position:absolute;left:0;top:0;width:364px;height:789px;overflow:hidden;background:inherit;will-change:transform,opacity}
.sw-root #hs .hw{background:radial-gradient(90% 55% at 12% 6%,#5b46c8 0,transparent 62%),radial-gradient(80% 50% at 95% 42%,rgba(214,69,143,.35) 0,transparent 60%),radial-gradient(120% 60% at 85% 100%,#0e86c8 0,transparent 64%),linear-gradient(#10142c,#0a0d1d)}
.sw-root .hq{position:relative;box-shadow:inset 0 0 0 .5px rgba(255,255,255,.22),0 3px 8px rgba(0,0,0,.28)}
.sw-root .hq::after{content:'';position:absolute;inset:0;border-radius:14px;background:linear-gradient(rgba(255,255,255,.2),transparent 48%);pointer-events:none}
.sw-root .hd{bottom:150px}
.sw-root .hwd{position:absolute;left:16px;top:72px;width:332px;height:148px;border-radius:26px;background:linear-gradient(160deg,#4a90f5,#2a4fd0);box-shadow:0 6px 18px rgba(0,0,0,.3);overflow:hidden;color:#fff}
.sw-root .hwd .w1{position:absolute;left:18px;top:14px}
.sw-root .hwd .w1 span{display:block;font-size:14px;font-weight:600}
.sw-root .hwd .w1 .tmp{display:block;font-size:48px;line-height:52px;font-weight:300}
.sw-root .hwd .w1 small{display:none}
.sw-root .hwd .ws{position:absolute;right:20px;top:16px}
.sw-root .hwd .w2{position:absolute;left:14px;right:14px;bottom:10px;display:flex;justify-content:space-between;text-align:center;font-size:11px}
.sw-root .hwd .w2 div{display:flex;flex-direction:column;align-items:center;gap:2px}
.sw-root .hwd .w2 b{font-weight:600;font-size:13px}
.sw-root .hwd .w2 small{opacity:.8}
.sw-root .hwl{position:absolute;left:0;width:364px;top:224px;text-align:center;font-size:11px;font-weight:500;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.5)}
.sw-root .hsr{position:absolute;left:50%;bottom:114px;height:32px;margin-left:-46px;width:92px;border-radius:16px;background:rgba(255,255,255,.2);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:500;color:#fff}
.sw-root #fr .shn i{width:60px;border-radius:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)}
.sw-root #fr #wsp{background:none}`;

export const HTML = `<svg width="0" height="0" style="position:absolute"><defs>
<symbol id="tt" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="#009393"/><path d="M 160 128 H 352 L 438 243 L 258 419 L 74 243 Z" fill="#ffffff" stroke="#ffffff" stroke-width="24" stroke-linejoin="round"/><path fill="#009393" fill-rule="evenodd" d="M 164 258 A 92 25 0 1 0 348 258 A 92 25 0 1 0 164 258 Z M 182 258 A 74 11 0 1 0 330 258 A 74 11 0 1 0 182 258 Z"/><rect x="178" y="177" width="156" height="30" rx="4" fill="#009393"/><rect x="236" y="177" width="40" height="159" rx="4" fill="#009393"/></symbol>
<symbol id="tn" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#0098EA"/><path d="M16 23.4 8.9 11.6a1 1 0 0 1 .9-1.5h12.4a1 1 0 0 1 .9 1.5z" fill="none" stroke="#fff" stroke-width="1.9" stroke-linejoin="round"/><path d="M16 10.4v13" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/></symbol>
<symbol id="tkl" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="url(#tkg)"/><defs><linearGradient id="tkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FA9F8"/><stop offset="1" stop-color="#0B73DA"/></linearGradient></defs><path d="M16 24 8.4 11.8a1 1 0 0 1 .9-1.6h13.4a1 1 0 0 1 .9 1.6z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M16 10.4V24" stroke="#fff" stroke-width="2" stroke-linecap="round"/></symbol>
</defs></svg>
<div id="wrap"><div id="bd"></div>
<div id="sheet"><div id="grab"></div>
<div id="dev"><div id="fr"><i style="left:-3px;top:118px;height:26px;border-radius:2px 0 0 2px"></i><i style="left:-3px;top:176px;height:52px;border-radius:2px 0 0 2px"></i><i style="left:-3px;top:242px;height:52px;border-radius:2px 0 0 2px"></i><i style="right:-3px;top:206px;height:84px;border-radius:0 2px 2px 0"></i>
<div id="bz"><div id="scr">
<div id="app">
<div class="hb" style="left:12px;border-radius:9px"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 3 5.5 9l6 6"/></svg></div>
<div class="hb" id="hbr" style="right:12px;border-radius:50%;padding:0;overflow:hidden;background:#16171b;border-color:#2e2f35"><svg width="20" height="20" viewBox="0 0 20 20" fill="#8a95a9"><circle cx="4.5" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="15.5" cy="10" r="1.7"/></svg></div>
<div id="hu"><div class="av" id="hav"></div><span id="hnm"></span></div>
<div id="rays"></div>
<div id="reel"><div id="strip"></div></div>
<div class="ar" id="al" style="left:25px;border-left:21px solid #2196F3;border-right:0"></div>
<div class="ar" id="ar" style="right:25px;border-right:21px solid #2196F3;border-left:0"></div>
<div id="bn"><small>You won</small><b id="bnv">65 USDT</b></div>
<div id="bl"></div><div id="lt"></div><div id="wcd" class="t"></div><canvas id="cf" width="728" height="1578"></canvas>
<div id="pn">
 <svg class="ti" viewBox="0 0 32 32"><use href="#tt"/></svg>
 <div id="bal">Balance 20 USDT</div><div id="dp">Deposit ›</div>
 <div class="cb" id="mi">−</div><div id="stk">$1</div><div class="cb" id="pl">+</div><div id="roy">Royal: $500</div>
 <div class="bt" id="as">Auto-Spin</div><div class="bt" id="sp">Spin for $1</div>
 <div id="iv">Invite friends for extra spins<u style="right:76px;width:42px;background:#0A7AD8">Story</u><u style="right:8px;width:62px;background:#252b38">Copy Link</u></div>
</div>
<div id="wb"></div>
<div id="wd"><div style="left:50%;top:8px;width:36px;height:4px;margin-left:-18px;border-radius:2px;background:#3a4560"></div>
<div class="st" style="left:0;width:100%;top:24px;text-align:center;font-size:17px;font-weight:600">Withdraw</div>
<div class="st cb" style="right:16px;top:18px;width:32px;height:32px;font-size:14px;color:#8a95a9">✕</div>
<div class="st" style="left:0;width:100%;top:70px;text-align:center"><div style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;border-radius:20px;background:#121c30;font-size:13px;font-weight:600"><svg width="24" height="24" viewBox="0 0 32 32"><use href="#tt"/></svg>USDT</div></div>
<div class="st" style="left:0;width:100%;top:112px;height:56px"><div class="ab" style="inset:0;display:flex;align-items:baseline;justify-content:center;gap:8px"><span id="wam" style="font-size:52px;line-height:56px;font-weight:700">0</span></div><div id="wmx" class="ab" style="right:20px;top:12px;width:52px;height:32px;border-radius:16px;background:#172338;color:#3E9BEA;font-size:13px;font-weight:700;display:grid;place-items:center">Max</div></div>
<div class="st" style="left:0;width:100%;top:176px;text-align:center;font-size:13px;color:#8a95a9">Available <b style="color:#fff;font-weight:600" id="wav2"></b></div>
<div class="st wc" style="top:224px;height:44px;border-radius:22px"><div id="wi" class="ab" style="left:0;top:0;width:110px;height:44px;border-radius:22px;background:#22406e;will-change:transform"></div>
<div class="ch" style="left:0;width:110px;height:44px">TRC20</div><div class="ch" style="left:111px;width:110px;height:44px">BEP20</div><div class="ch" style="left:222px;width:110px;height:44px"><svg width="16" height="16"><use href="#tn"/></svg>TON</div></div>
<div class="st wc" id="wa" style="top:284px;height:60px"><div class="ab" id="wat" style="left:16px;top:11px;width:250px;font:500 12px/19px ui-monospace,Menlo,Consolas,monospace;word-break:break-all"></div><div class="ab" id="wpa" style="right:16px;top:20px;font-size:13px;font-weight:700;color:#3E9BEA">Paste</div></div>
<div class="st wc" style="top:362px;height:108px;background:none"><div class="wr" style="top:6px"><span>Network</span><span id="wnt"></span></div><div class="wr" style="top:32px"><span>Network fee</span><span id="wfe"></span></div><div class="wr" style="top:58px"><span>Estimated time</span><span id="wtm"></span></div><div class="wr" style="top:84px;font-weight:700"><span style="font-weight:500">You receive</span><span id="wrc"></span></div></div>
<div class="st" style="left:16px;top:524px;width:332px;height:54px"><div id="wbt" style="position:relative;width:100%;height:100%;border-radius:27px;background:#1b2638;overflow:hidden;font-size:17px;font-weight:700">
<div id="wbb" class="ab" style="inset:0;background:linear-gradient(#39B0FF,#0F72E8);opacity:0"></div><div id="wg2" class="ab" style="inset:0;background:linear-gradient(#34c77b,#1f9f5c);opacity:0"></div>
<div id="wbl" class="ab" style="inset:0;display:grid;place-items:center;color:#5d6a82">Withdraw</div>
<i id="wsp" class="ab" style="left:50%;top:50%;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;border:3px solid rgba(255,255,255,.28);border-top-color:#fff;opacity:0"></i>
<div id="wok" class="ab" style="inset:0;display:flex;align-items:center;justify-content:center;gap:8px;opacity:0"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path id="wck" d="M4.5 11.5l4.5 4.5 8.5-9.5" stroke-dasharray="22" stroke-dashoffset="22"/></svg>Sent</div></div></div></div>
<div id="pw"><div class="ic"><svg viewBox="0 0 96 96" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,.14)" stroke-width="5"/><circle id="pwr" cx="48" cy="48" r="40" stroke="#3E9BEA" stroke-width="5" stroke-dasharray="251.3" transform="rotate(-90 48 48)"/><g id="pwc" stroke="#fff" stroke-width="5"><path d="M48 48l11 7"/><g id="pwg"><path d="M48 48V27"/></g></g><path id="pwk" d="M31 49l12 12 23-25" stroke="#46C67D" stroke-width="6" stroke-dasharray="60" stroke-dashoffset="60" opacity="0"/></svg></div><div id="pwt">05:00</div><div id="pwl">Processing withdrawal</div><div id="pws">Funds usually arrive in a few minutes</div><div id="pwp"></div></div>
<div id="hs"><div class="hw"></div><div class="hwd"><div class="w1"><span>Sunny</span><b class="tmp">24°</b><small>H:27°  L:16°</small></div><svg class="ws" width="46" height="46" viewBox="0 0 46 46"><circle cx="23" cy="23" r="10" fill="#ffd60a"/><g stroke="#ffd60a" stroke-width="3" stroke-linecap="round"><path d="M23 4v5M23 37v5M4 23h5M37 23h5M9.6 9.6l3.5 3.5M32.9 32.9l3.5 3.5M36.4 9.6l-3.5 3.5M13.1 32.9l-3.5 3.5"/></g></svg><div class="w2"><div><small>Now</small><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="4" fill="#ffd60a"/></svg><b>24°</b></div><div><small>10</small><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="4" fill="#ffd60a"/></svg><b>25°</b></div><div><small>11</small><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="4" fill="#ffd60a"/></svg><b>26°</b></div><div><small>12</small><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="4" fill="#ffd60a"/></svg><b>27°</b></div><div><small>13</small><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="4" fill="#ffd60a"/></svg><b>27°</b></div></div></div><div class="hwl">Weather</div><div class="hi" style="left:24.0px;top:246px"><div class="hq" style="background:linear-gradient(#5BE07A,#1FB84A)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5h16v11H9.5L5 20v-3.5H4z" fill="#fff" stroke="none"/></svg></div><span>Messages</span></div><div class="hi" style="left:109.3px;top:246px"><div class="hq" style="background:#fff"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g stroke="none" opacity=".85"><circle cx="12" cy="7.6" r="4.2" fill="#FF9F0A"/><circle cx="16.4" cy="12" r="4.2" fill="#30D158"/><circle cx="12" cy="16.4" r="4.2" fill="#0A84FF"/><circle cx="7.6" cy="12" r="4.2" fill="#FF453A"/></g></svg></div><span>Photos</span></div><div class="hi" style="left:194.7px;top:246px"><div class="hq" style="background:linear-gradient(#8d8e96,#4a4b52)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5h4l1.5-2h7l1.5 2h4V19H3z"/><circle cx="12" cy="13.5" r="3.4"/></svg></div><span>Camera</span></div><div class="hi" style="left:280.0px;top:246px"><div class="hq" style="background:linear-gradient(#6fd36f,#2fa7e8)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19 19 5M4 12l8 8M12 4l8 8"/><circle cx="14" cy="10" r="2.4" fill="#FF453A" stroke="none"/></svg></div><span>Maps</span></div><div class="hi" style="left:24.0px;top:346px"><div class="hq" style="background:linear-gradient(#ffe27a,#ffc21a)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12M6 12h12M6 16h8"/></svg></div><span>Notes</span></div><div class="hi" style="left:109.3px;top:346px"><div class="hq" style="background:#111"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3.5 2"/></svg></div><span>Clock</span></div><div class="hi" id="hti" style="left:194.7px;top:346px"><svg width="60" height="60" viewBox="0 0 32 32" style="border-radius:14px"><use href="#tkl"/></svg><span>Tonkeeper</span></div><div class="hi" style="left:280.0px;top:346px"><div class="hq" style="background:linear-gradient(#37AEE2,#1E96C8)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 11.7 18.6 6.3c.7-.2 1.2.2 1 1.1l-2.4 11.3c-.2.8-.7 1-1.4.6l-3.7-2.7-1.8 1.7c-.2.2-.4.4-.8.4l.3-3.8 6.9-6.2c.3-.3-.1-.4-.5-.2l-8.5 5.4-3.7-1.1c-.8-.3-.8-.8.2-1.2z" fill="#fff" stroke="none"/></svg></div><span>Telegram</span></div><div class="hi" style="left:24.0px;top:446px"><div class="hq" style="background:linear-gradient(#4aa8ff,#1c6ff0)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="m4 7.5 8 6 8-6"/></svg></div><span>Mail</span></div><div class="hi" style="left:109.3px;top:446px"><div class="hq" style="background:linear-gradient(#ff6b81,#ff2d55)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 17.5V6.5l9-2v11"/><circle cx="7.5" cy="17.5" r="2.2" fill="#fff"/><circle cx="16.5" cy="15.5" r="2.2" fill="#fff"/></svg></div><span>Music</span></div><div class="hi" style="left:194.7px;top:446px"><div class="hq" style="background:linear-gradient(#9a9ba3,#5b5c64)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></svg></div><span>Settings</span></div><div class="hi" style="left:280.0px;top:446px"><div class="hq" style="background:linear-gradient(#4aa8ff,#1c6ff0)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5a1.5 1.5 0 0 1 1.5-1.5H10l2 2h6.5A1.5 1.5 0 0 1 20 9.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5z" fill="#fff" stroke="none"/></svg></div><span>Files</span></div><div class="hi" style="left:24.0px;top:546px"><div class="hq" style="background:#fff"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><text x="12" y="8.2" font-size="4.6" fill="#ff3b30" font-weight="700" text-anchor="middle" stroke="none">THU</text><text x="12" y="19.6" font-size="12" fill="#111" font-weight="500" text-anchor="middle" stroke="none">8</text></svg></div><span>Calendar</span></div><div class="hi" style="left:109.3px;top:546px"><div class="hq" style="background:#fff"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 1.8C19 14.6 12 19 12 19z" fill="#ff2d55" stroke="none"/></svg></div><span>Health</span></div><div class="hi" style="left:194.7px;top:546px"><div class="hq" style="background:linear-gradient(#ffb04a,#ff8a00)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6h6.5v12H5zM12.5 6H19v12h-6.5z"/></svg></div><span>Books</span></div><div class="hi" style="left:280.0px;top:546px"><div class="hq" style="background:#111"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 16 5-5 3 3 7-7" stroke="#30D158" stroke-width="2.2"/></svg></div><span>Stocks</span></div><div class="hd"></div><div class="hsr"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><path d="m11 11 3.5 3.5"/></svg>Search</div><div class="hk"><div class="hi" style="left:14.0px;top:10px"><div class="hq" style="background:linear-gradient(#5BE07A,#1FB84A)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4.5h2.8l1.4 3.6-1.8 1.3a10 10 0 0 0 5.2 5.2l1.3-1.8 3.6 1.4v2.8c0 .9-.8 1.7-1.7 1.7C10.2 18.7 5.3 13.8 4.8 6.2c0-.9.8-1.7 1.7-1.7z" fill="#fff" stroke="none"/></svg></div></div><div class="hi" style="left:91.3px;top:10px"><div class="hq" style="background:linear-gradient(#5cb8ff,#1e7cf0)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.2"/><path d="m15.5 8.5-2 5-5 2 2-5z" fill="#fff"/></svg></div></div><div class="hi" style="left:168.6px;top:10px"><div class="hq" style="background:linear-gradient(#4aa8ff,#1c6ff0)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="m4 7.5 8 6 8-6"/></svg></div></div><div class="hi" style="left:245.9px;top:10px"><div class="hq" style="background:linear-gradient(#ff6b81,#ff2d55)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 17.5V6.5l9-2v11"/><circle cx="7.5" cy="17.5" r="2.2" fill="#fff"/><circle cx="16.5" cy="15.5" r="2.2" fill="#fff"/></svg></div></div></div></div>
<div id="fg2"></div>
<div id="tk"><div style="left:50%;top:54px;height:36px;transform:translateX(-50%);padding:0 12px 0 6px;border-radius:18px;background:#151D28;display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600"><svg width="26" height="26"><use href="#tkl"/></svg>Wallet<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#8D98AA" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></div>
<div style="right:14px;top:54px;width:36px;height:36px;border-radius:50%;background:#151D28;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8D98AA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l1.6-1-1.5-2.6-1.9.5a6 6 0 0 0-1.5-.9L15.3 6h-3l-.4 2a6 6 0 0 0-1.5.9l-1.9-.5L7 11l1.600 1"/></svg></div>
<div id="tkb" style="left:0;right:0;top:112px;text-align:center;font-size:40px;line-height:46px;font-weight:700;letter-spacing:-.5px">$2.32</div>
<div style="left:0;right:0;top:164px;text-align:center;font-size:14px;color:#8D98AA">UQCz…rEk6</div><div class="ta" style="left:16px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#45AEF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>Send</div><div class="ta" style="left:101px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#45AEF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5.5 12.5 12 19l6.5-6.5"/></svg>Receive</div><div class="ta" style="left:186px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#45AEF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/></svg>Scan</div><div class="ta" style="left:271px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#45AEF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v14M3.5 14.5 7 18l3.5-3.5M17 20V6M13.5 9.5 17 6l3.5 3.5"/></svg>Swap</div>
<div id="tkf" style="left:16px;top:298px;width:332px"><div style="background:#151D28;border-radius:24px;overflow:hidden"><div class="tr"><svg class="lg"><use href="#tn"/></svg><div><div class="t1">Toncoin</div><div class="t2">$1.43</div></div><div style="text-align:right"><div class="t1">1.62 TON</div><div class="t2">$2.32</div></div></div>
<div id="tku" style="height:0;opacity:0;overflow:hidden"><div class="tr"><svg class="lg"><use href="#tt"/></svg><div><div class="t1">USD₮ <span style="font-size:11px;font-weight:600;color:#8D98AA;background:#2a3445;border-radius:5px;padding:1px 5px;vertical-align:2px">TON</span></div><div class="t2">$1.00</div></div><div style="text-align:right"><div class="t1" id="tkua">0.00</div><div class="t2" id="tkuf">$0.00</div></div><div id="tkfl" class="ab" style="inset:0;background:#fff;opacity:0"></div></div></div></div>
<div style="margin:22px 0 10px 4px;font-size:18px;font-weight:700">History</div>
<div id="tkh" style="height:0;overflow:hidden"><div id="tki" style="opacity:0"><div class="tr" style="background:#151D28;border-radius:16px"><div style="width:44px;height:44px;border-radius:50%;background:#26382f;display:grid;place-items:center;flex:none"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#46C67D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5.5 12.5 12 19l6.5-6.5"/></svg></div><div><div class="t1">Received</div><div class="t2">UQDe…9f1a</div></div><div style="text-align:right"><div class="t1" id="tkhv" style="color:#46C67D">+0 USDT</div><div class="t2">09:41</div></div></div><div style="height:8px"></div></div></div>
<div class="tr" style="background:#151D28;border-radius:16px"><div style="width:44px;height:44px;border-radius:50%;background:#2a3445;display:grid;place-items:center;flex:none"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8D98AA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></div><div><div class="t1">Sent</div><div class="t2">UQAh…2c7e</div></div><div style="text-align:right"><div class="t1">−0.50 TON</div><div class="t2">Yesterday</div></div></div></div>
<div style="left:16px;right:16px;bottom:24px;height:64px;border-radius:32px;background:#151D28;display:flex;padding-top:10px"><div class="tb" style=color:#45AEF5><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#45AEF5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5zM16 13.5h.01"/></svg>Wallet</div><div class="tb"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8D98AA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>Activity</div><div class="tb"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8D98AA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>Browser</div><div class="tb"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8D98AA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h9M17 7h3M4 17h3M11 17h9M13 5v4M7 15v4"/></svg>Settings</div></div></div>
<div id="tkn"><div class="ab" style="left:12px;top:13px;width:38px;height:38px"><svg width="38" height="38"><use href="#tkl"/></svg></div><div class="ab" style="left:60px;top:11px;right:14px;display:flex;justify-content:space-between;font-size:14px;font-weight:700"><span>Tonkeeper</span><span style="font-weight:400;color:#8D98AA;font-size:12px">now</span></div><div class="ab" id="tknv" style="left:60px;top:32px;font-size:14px">Received 0 USDT</div></div>
<div id="rp"></div><div id="fg"></div>
</div>
<div id="isl"></div>
<div id="sbar"><span>9:41</span>
 <svg style="right:84px" width="19" height="12" viewBox="0 0 19 12" fill="#fff"><rect x="0" y="8" width="3.2" height="4" rx="1"/><rect x="5" y="5.5" width="3.2" height="6.5" rx="1"/><rect x="10" y="3" width="3.2" height="9" rx="1"/><rect x="15" y="0" width="3.2" height="12" rx="1"/></svg>
 <svg style="right:58px" width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"><path d="M1.2 4.3a10 10 0 0 1 14.6 0"/><path d="M3.8 7a6.2 6.2 0 0 1 9.4 0"/><circle cx="8.5" cy="10" r="1.2" fill="#fff" stroke="none"/></svg>
 <svg style="right:24px" width="27" height="13" viewBox="0 0 27 13"><rect x=".6" y=".6" width="23" height="11.8" rx="3.6" fill="none" stroke="#fff" stroke-opacity=".45"/><rect x="2.2" y="2.2" width="19.8" height="8.6" rx="2.2" fill="#fff"/><path d="M25 4.3v4.4c.9-.3 1.5-1.2 1.5-2.2S25.900 4.600 25 4.300z" fill="#fff" fill-opacity=".5"/></svg></div>
<div id="hi"></div>
</div></div></div></div></div></div>
`;
