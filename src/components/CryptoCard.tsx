import React from "react";

export type CardProps = {
  name?: string;
  amount?: string | number;
  usdAmount?: string | number;
  serial?: string;
  className?: string;
};

const css = `
.cw{container-type:inline-size;width:100%;max-width:560px}
.cd{position:relative;width:100%;aspect-ratio:1.74/1;border-radius:6.2cqw;overflow:hidden;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",system-ui,sans-serif;box-shadow:inset 0 0 0 .3cqw rgba(255,255,255,.28)}
.cd.gram{background:radial-gradient(60% 70% at 66% 22%,rgba(80,190,255,.75),transparent 70%),radial-gradient(45% 55% at 40% 88%,rgba(40,170,255,.55),transparent 70%),radial-gradient(40% 50% at 8% 10%,rgba(20,110,255,.9),transparent 70%),linear-gradient(160deg,#2392ff,#0f72f4 50%,#0a5fe6)}
.cd.tether{background:radial-gradient(60% 70% at 66% 22%,rgba(30,185,180,.3),transparent 70%),radial-gradient(40% 50% at 8% 10%,rgba(0,95,95,.45),transparent 70%),linear-gradient(160deg,#0aa09d,#009393 50%,#007f7f)}
.cd.gold{background:radial-gradient(60% 70% at 66% 22%,rgba(255,215,0,.4),transparent 70%),radial-gradient(45% 55% at 40% 88%,rgba(217,119,6,.5),transparent 70%),radial-gradient(40% 50% at 8% 10%,rgba(251,191,36,.6),transparent 70%),linear-gradient(160deg,#d97706,#b45309 50%,#78350f)}
.cd::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.12),rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(0,40,100,.14))}
.cd .bal{position:absolute;left:7.6cqw;top:35%;display:flex;align-items:center;gap:1.8cqw}
.cd .gem{width:9.6cqw;height:auto}
.cd .amt{font-size:8cqw;font-weight:600;letter-spacing:-.01em;line-height:1}
.cd .amt span{font-weight:500;margin-left:.4cqw;color:var(--sub)}
.cd .usd{position:absolute;left:8.2cqw;top:54%;font-size:3.7cqw;font-weight:500;color:var(--sub2)}
.cd .own{position:absolute;left:8.8cqw;bottom:8.2%;font:700 3.3cqw ui-monospace,Menlo,Consolas,monospace;letter-spacing:.07em}
.cd .chip{position:absolute;right:15.5cqw;top:36%;width:12.6cqw;aspect-ratio:1/.9;border-radius:2.6cqw;background:linear-gradient(145deg,#f1f6ff,#c9d8f0 55%,#a9bddf);display:grid;place-items:center}
.cd .chip svg{width:56%;height:auto}
.cd .ser{position:absolute;right:3.2cqw;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;text-orientation:sideways;font:600 2.45cqw/1.5 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.1em;white-space:nowrap;user-select:none;color:var(--ser);text-shadow:.2cqw .2cqw 0 rgba(255,255,255,.22),-.12cqw -.12cqw 0 rgba(0,20,60,.3)}
.cd.gram{--sub:#63c4ff;--sub2:#8fd3ff;--ser:rgba(6,50,150,.5)}
.cd.tether{--sub:#e3f7f6;--sub2:#b5e3e1;--ser:rgba(0,60,60,.45)}
.cd.gold{--sub:#fef3c7;--sub2:#fde68a;--ser:rgba(120,53,15,.5)}
`;

export const Chip = () => (
  <div className="chip" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="#6b82a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="7.5" height="7.5" rx="2" />
      <rect x="14" y="2.5" width="7.5" height="7.5" rx="2" />
      <rect x="2.5" y="14" width="7.5" height="7.5" rx="2" />
      <path d="M14 14h2.5v2.5H14zM19 14h2.5M14 19.5h2.5M19 19v2.5" />
    </svg>
  </div>
);

export const GramGem = () => (
  <svg className="gem" viewBox="0 0 64 56" aria-hidden="true">
    <defs>
      <linearGradient id="gg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#bfe3ff" /></linearGradient>
      <linearGradient id="gg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9f6ff" /><stop offset="1" stopColor="#8fc9ff" /></linearGradient>
      <linearGradient id="gg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfe9ff" /><stop offset="1" stopColor="#6fb2f5" /></linearGradient>
    </defs>
    <path d="M14 3h36l13 15-31 35L1 18z" fill="url(#gg1)" />
    <path d="M1 18h62L32 53z" fill="url(#gg2)" />
    <path d="M14 3L22 18 32 3zM50 3L42 18 32 3z" fill="#fff" opacity=".85" />
    <path d="M22 18h20L32 53z" fill="url(#gg3)" />
    <path d="M1 18L14 3l8 15zM63 18L50 3l-8 15z" fill="#d9eeff" opacity=".9" />
  </svg>
);

export const TetherGem = () => (
  <svg className="gem" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M18.7 14.5H45.2L56.3 30.4L32.3 53.8L7.8 30.4Z" fill="#fff" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
    <ellipse cx="32.1" cy="32.2" rx="11.5" ry="3" fill="#009393" />
    <ellipse cx="32.1" cy="32.2" rx="9.3" ry="1.3" fill="#fff" />
    <rect x="22.3" y="22.1" width="19.5" height="3.8" rx=".8" fill="#009393" />
    <rect x="29.5" y="24" width="5.1" height="18" rx=".9" fill="#009393" />
    {/* TON badge */}
    <circle cx="53" cy="52" r="9.5" fill="#0098EA" stroke="#fff" strokeWidth="2" />
    <path fill="#fff" d="M47.8 47.5h10.4L53 57.2z" />
  </svg>
);

export function GramCard({
  name = "ALICIA",
  amount = "10,000",
  usdAmount = "4,200",
  serial = "GRAM · 2024 · TON",
  className = ""
}: CardProps) {
  return (
    <div className={`cw ${className}`}>
      <style>{css}</style>
      <div className="cd gram">
        <div className="bal">
          <GramGem />
          <div className="amt">{amount} <span>GRAM</span></div>
        </div>
        <div className="usd">≈ ${usdAmount}</div>
        <div className="own">{name}</div>
        <Chip />
        <div className="ser">{serial}</div>
      </div>
    </div>
  );
}

export function TetherCard({
  name = "ALICIA",
  amount = "10,000",
  usdAmount = "10,000",
  serial = "USD₮ · 2024 · TON",
  className = ""
}: CardProps) {
  return (
    <div className={`cw ${className}`}>
      <style>{css}</style>
      <div className="cd tether">
        <div className="bal">
          <TetherGem />
          <div className="amt">{amount} <span>USDT</span></div>
        </div>
        <div className="usd">≈ ${usdAmount}</div>
        <div className="own">{name}</div>
        <Chip />
        <div className="ser">{serial}</div>
      </div>
    </div>
  );
}

export default { GramCard, TetherCard, Chip, GramGem, TetherGem };
