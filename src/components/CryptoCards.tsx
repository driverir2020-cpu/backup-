import React from "react";

export type CardProps = {
  name?: string;
  className?: string;
  amount?: number | string;
  currency?: string;
  usdValue?: number | string;
  isZero?: boolean;
};

export const cryptoCardsCss = `
.cw{container-type:inline-size;width:100%;max-width:560px}
.cd{position:relative;width:100%;aspect-ratio:1.74/1;border-radius:6.2cqw;overflow:hidden;color:#fff;
  font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",system-ui,sans-serif;
  box-shadow:inset 0 0 0 .3cqw rgba(255,255,255,.28);
  transition:transform .3s ease,box-shadow .3s ease}
.cd.gram{background:
  radial-gradient(60% 70% at 66% 22%,rgba(80,190,255,.75),transparent 70%),
  radial-gradient(45% 55% at 40% 88%,rgba(40,170,255,.55),transparent 70%),
  radial-gradient(40% 50% at 8% 10%,rgba(20,110,255,.9),transparent 70%),
  linear-gradient(160deg,#2392ff,#0f72f4 50%,#0a5fe6)}
.cd.tether{background:
  radial-gradient(60% 70% at 66% 22%,rgba(30,185,180,.3),transparent 70%),
  radial-gradient(40% 50% at 8% 10%,rgba(0,95,95,.45),transparent 70%),
  linear-gradient(160deg,#0aa09d,#009393 50%,#007f7f)}
.cd.zero{background:
  radial-gradient(60% 70% at 66% 22%,rgba(100,116,139,.4),transparent 70%),
  radial-gradient(40% 50% at 8% 10%,rgba(51,65,85,.5),transparent 70%),
  linear-gradient(160deg,#475569,#334155 50%,#1e293b)}
.cd::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(115deg,rgba(255,255,255,.12),rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(0,40,100,.14))}
.cd .bal{position:absolute;left:7.6cqw;top:35%;display:flex;align-items:center;gap:1.8cqw}
.cd .gem{width:9.6cqw;height:auto;flex-shrink:0}
.cd .amt{font-size:8cqw;font-weight:600;letter-spacing:-.01em;line-height:1;display:flex;align-items:baseline}
.cd .amt span{font-weight:500;margin-left:.4cqw;color:var(--sub)}
.cd .usd{position:absolute;left:8.2cqw;top:54%;font-size:3.7cqw;font-weight:500;color:var(--sub2)}
.cd .own{position:absolute;left:8.8cqw;bottom:8.2%;font:700 3.3cqw ui-monospace,Menlo,Consolas,monospace;letter-spacing:.07em}
.cd .chip{position:absolute;right:15.5cqw;top:36%;width:12.6cqw;aspect-ratio:1/.9;border-radius:2.6cqw;
  background:linear-gradient(145deg,#f1f6ff,#c9d8f0 55%,#a9bddf);display:grid;place-items:center}
.cd .chip svg{width:56%;height:auto}
.cd .ser{position:absolute;right:3.2cqw;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;text-orientation:sideways;
  font:600 2.45cqw/1.5 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.1em;white-space:nowrap;user-select:none;color:var(--ser);
  text-shadow:.2cqw .2cqw 0 rgba(255,255,255,.22),-.12cqw -.12cqw 0 rgba(0,20,60,.3)}
.cd.gram{--sub:#63c4ff;--sub2:#8fd3ff;--ser:rgba(6,50,150,.5)}
.cd.tether{--sub:#e3f7f6;--sub2:#b5e3e1;--ser:rgba(0,60,60,.45)}
.cd.zero{--sub:#cbd5e1;--sub2:#94a3b8;--ser:rgba(15,23,42,.5)}
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
  className,
  amount = 88,
  currency = "GRAM",
  usdValue = "$127.67",
}: CardProps) {
  return (
    <div className={`cw ${className ?? ""}`}>
      <div className="cd gram" role="img" aria-label={`Gram card, ${amount} ${currency}, ${usdValue}, ${name}`}>
        <div className="bal">
          <GramGem />
          <div className="amt">{amount}<span> {currency}</span></div>
        </div>
        <div className="usd">{usdValue}</div>
        <div className="own">{name}</div>
        <Chip />
        <div className="ser" aria-hidden="true">
          0DC1 EOGD WKYJ OLFW 3CY0 NGU1<br />UOCL SGJU DVPM LDLX 9PYB 1QRT
        </div>
      </div>
    </div>
  );
}

export function TetherCard({
  name = "ALICIA",
  className,
  amount = 127.67,
  currency = "USDT",
  usdValue = "$127.67",
  isZero = false,
}: CardProps) {
  return (
    <div className={`cw ${className ?? ""}`}>
      <div className={`cd ${isZero ? 'zero' : 'tether'}`} role="img" aria-label={`Tether card, ${amount} ${currency}, ${usdValue}, ${name}`}>
        <div className="bal">
          <TetherGem />
          <div className="amt">{amount}<span> {currency}</span></div>
        </div>
        <div className="usd">{usdValue}</div>
        <div className="own">{name}</div>
        <Chip />
        <div className="ser" aria-hidden="true">
          TX7K 2MQD 8VHA R4ZN 0LPE W9CJ<br />USDT 6BXF 3GYT QN5A 1DHM 7RKS
        </div>
      </div>
    </div>
  );
}

/** Both cards with a simple switch as provided by user */
export default function Cards() {
  const [tab, setTab] = React.useState<"gram" | "tether">("gram");
  return (
    <div className="p-4 flex flex-col items-center">
      <style>{cryptoCardsCss}</style>
      <div className="w-full max-w-[420px]">
        {tab === "gram" ? <GramCard /> : <TetherCard />}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === "gram" ? "bg-blue-600 text-white" : "bg-white/10 text-slate-300"
          }`}
          onClick={() => setTab("gram")}
          aria-pressed={tab === "gram"}
        >
          Gram
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === "tether" ? "bg-teal-600 text-white" : "bg-white/10 text-slate-300"
          }`}
          onClick={() => setTab("tether")}
          aria-pressed={tab === "tether"}
        >
          Tether
        </button>
      </div>
    </div>
  );
}

/**
 * Returns raw HTML string for reel slot rendering inside Spin.tsx
 */
export function getCryptoCardHtml(
  type: 'gram' | 'tether' | 'zero',
  amountStr: string,
  currencyStr: string,
  usdStr: string,
  ownerName: string,
  customClass: string = ''
): string {
  const isGram = type === 'gram';
  const isZero = type === 'zero';
  const cardTypeClass = isGram ? 'gram' : isZero ? 'zero' : 'tether';
  const serial = isGram
    ? '0DC1 EOGD WKYJ OLFW 3CY0 NGU1<br />UOCL SGJU DVPM LDLX 9PYB 1QRT'
    : 'TX7K 2MQD 8VHA R4ZN 0LPE W9CJ<br />USDT 6BXF 3GYT QN5A 1DHM 7RKS';

  const gemSvg = isGram
    ? `<svg class="gem" viewBox="0 0 64 56" aria-hidden="true">
        <path d="M14 3h36l13 15-31 35L1 18z" fill="#bfe3ff"/>
        <path d="M1 18h62L32 53z" fill="#8fc9ff"/>
        <path d="M14 3L22 18 32 3zM50 3L42 18 32 3z" fill="#fff" opacity=".85"/>
        <path d="M22 18h20L32 53z" fill="#6fb2f5"/>
        <path d="M1 18L14 3l8 15zM63 18L50 3l-8 15z" fill="#d9eeff" opacity=".9"/>
      </svg>`
    : `<svg class="gem" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18.7 14.5H45.2L56.3 30.4L32.3 53.8L7.8 30.4Z" fill="#fff" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>
        <ellipse cx="32.1" cy="32.2" rx="11.5" ry="3" fill="#009393"/>
        <ellipse cx="32.1" cy="32.2" rx="9.3" ry="1.3" fill="#fff"/>
        <rect x="22.3" y="22.1" width="19.5" height="3.8" rx=".8" fill="#009393"/>
        <rect x="29.5" y="24" width="5.1" height="18" rx=".9" fill="#009393"/>
        <circle cx="53" cy="52" r="9.5" fill="#0098EA" stroke="#fff" stroke-width="2"/>
        <path fill="#fff" d="M47.8 47.5h10.4L53 57.2z"/>
      </svg>`;

  const chipSvg = `<div class="chip" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="#6b82a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2.5" y="2.5" width="7.5" height="7.5" rx="2"/>
      <rect x="14" y="2.5" width="7.5" height="7.5" rx="2"/>
      <rect x="2.5" y="14" width="7.5" height="7.5" rx="2"/>
      <path d="M14 14h2.5v2.5H14zM19 14h2.5M14 19.5h2.5M19 19v2.5"/>
    </svg>
  </div>`;

  return `<div class="cw ${customClass}">
    <div class="cd ${cardTypeClass}">
      <div class="bal">
        ${gemSvg}
        <div class="amt">${amountStr}<span> ${currencyStr}</span></div>
      </div>
      <div class="usd">${usdStr}</div>
      <div class="own">${ownerName}</div>
      ${chipSvg}
      <div class="ser" aria-hidden="true">${serial}</div>
    </div>
  </div>`;
}
