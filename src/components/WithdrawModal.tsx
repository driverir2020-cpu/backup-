// @ts-nocheck
/**
 * WithdrawModal — "Withdraw" bottom sheet (from the Spin & Win design) as a standalone component.
 *
 * <WithdrawModal
 *   open={open}
 *   available={65}
 *   onClose={() => setOpen(false)}
 *   onSubmit={async ({ amount, network, address }) => { const r = await api.withdraw(...); return { id: r.id }; }}
 * />
 *
 * Flow:  form  →(3D slide)→  confirming (4 animated steps)  →(3D slide)→  result ("Sent for review" + clock)  →  Back.
 *  - The sheet is full width (sticks to the screen edges, max 520px on large screens) and taller than before.
 *  - onSubmit is called as soon as the user taps Withdraw; the steps animate while it runs.
 *    Resolve → success result (optionally return { id } to show a reference). Reject/throw → failed result with "Try again".
 *  - A chime plays once, only when the result appears (Web Audio, synthesized, created on the tap → no assets, no load cost).
 *  - After a successful withdrawal, when the user leaves the result screen, a notification slides in from the top.
 *  - Address validation: format + checksum per network (TRON base58check, EVM with EIP-55, TON CRC16). Garbage is rejected inline,
 *    a valid address of another network offers a one-tap switch, and Withdraw stays disabled until the address is valid.
 *    `validateAddress(network, address)` is exported — re-run the SAME check on your server; never trust the client alone.
 *    Pass `validate={(network, address) => boolean | string}` to replace the built-in check if you ever need to accept something else.
 *  - Only the modal is rendered (sheet + optional dark backdrop `dim`); no page background. The sheet fill can be changed with the CSS
 *    variable --wdm-bg (e.g. style={{ '--wdm-bg': '#101a2e' }} on a parent).
 *  - Needs Roboto on the page (falls back to system-ui).
 */
import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';

export type Network = 'TRC20' | 'BEP20' | 'TON';
export type WithdrawPayload = { amount: number; network: Network; address: string };
export type WithdrawResult = { id?: string } | void;

type Props = {
  open: boolean;
  onClose?: () => void;
  /** "Back" on the result screen. Defaults to onClose. */
  onBack?: () => void;
  /** Balance shown in "Available" and used by Max. */
  available?: number;
  onSubmit?: (p: WithdrawPayload) => void | Promise<WithdrawResult>;
  /** Play the completion chime. Default true. */
  sound?: boolean;
  /** Show the top notification after a successful withdrawal when the user leaves the result screen. Default true. */
  notify?: boolean;
  /** TESTING: keep the Withdraw button enabled even when the form is empty/invalid.
   *  Empty amount → uses `available`, empty address → a sample address. Remove for production. */
  forceEnable?: boolean;
  /** Dark backdrop behind the sheet (tap it to close). Default true. */
  dim?: boolean;
  /** Replace the built-in address check with your own: return true if valid, false (or an error message string) if not.
   *  Use it if you ever need to accept a format the built-in check doesn't know. */
  validate?: (network: Network, address: string) => boolean | string;
};

type View = 'form' | 'progress' | 'result';
type Snap = { amount: number; network: Network; address: string; fee: number; receive: number };
type Outcome = { ok: true; id?: string } | { ok: false; message: string };

const NETWORKS: Network[] = ['TRC20', 'BEP20', 'TON'];
const FEE = [1, 0.8, 0.3];
const ETA = ['~ 1 min', '~ 20 sec', '~ 10 sec'];
const ADDR_LEN = [34, 42, 48]; // expected length per network — errors are shown from this length on (or after leaving the field)
const VIEWS: View[] = ['form', 'progress', 'result'];
const SAMPLE_ADDRESS = 'UQCz7mKfV3xHt9LqPn2WdYb8RaJe5sGoNc4uXiT1vAyMrEk6';

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
const short = (a: string) => (a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const STEPS: { title: string; sub: (s: Snap, available: number) => string }[] = [
  { title: 'Checking balance', sub: (s, a) => `${fmt(s.amount)} of ${fmt(a)} USDT` },
  { title: 'Verifying address', sub: (s) => `${s.network} · ${short(s.address)}` },
  { title: 'Signing transaction', sub: () => 'Secure confirmation' },
  { title: 'Sending for review', sub: () => 'Submitting to the network' },
];


// ───────────────────────── address validation (no dependencies, usable on the server too) ─────────────────────────
// TRC20 = TRON base58check · BEP20 = EVM 0x… (EIP-55 checksum when mixed-case) · TON = friendly base64 + CRC16, or raw "wc:hex".
// Format + checksum only: it proves the string is a well-formed address, not that a wallet exists or who owns it.
export type AddressCheck = { ok: true } | { ok: false; reason: 'format' | 'checksum' | 'custom'; message?: string };

function sha256(data: Uint8Array): Uint8Array {
  const K: number[] = [];
  const H = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let c = 2, n = 0; n < 64; c++) {
    let p = true;
    for (let d = 2; d * d <= c; d++) if (c % d === 0) { p = false; break; }
    if (!p) continue;
    if (n < 8) H[n] = (Math.pow(c, 1 / 2) % 1) * 4294967296 | 0;
    K[n++] = (Math.pow(c, 1 / 3) % 1) * 4294967296 | 0;
  }
  const len = data.length;
  const total = (((len + 9) >> 6) + 1) << 6;
  const m = new Uint8Array(total);
  m.set(data);
  m[len] = 0x80;
  const dv = new DataView(m.buffer);
  dv.setUint32(total - 4, len * 8);
  const w = new Array<number>(64);
  const h = H.slice();
  for (let o = 0; o < total; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
    for (let i = 16; i < 64; i++) {
      const a = w[i - 15], b = w[i - 2];
      const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
      const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, hh].forEach((v, i) => (h[i] = (h[i] + v) | 0));
  }
  const out = new Uint8Array(32);
  const ov = new DataView(out.buffer);
  h.forEach((v, i) => ov.setUint32(i * 4, v));
  return out;
}

const KRC = [0x1n, 0x8082n, 0x800000000000808an, 0x8000000080008000n, 0x808bn, 0x80000001n, 0x8000000080008081n, 0x8000000000008009n, 0x8an, 0x88n, 0x80008009n, 0x8000000an, 0x8000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n, 0x8000000000008002n, 0x8000000000000080n, 0x800an, 0x800000008000000an, 0x8000000080008081n, 0x8000000000008080n, 0x80000001n, 0x8000000080008008n];
const KROT = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 2, 14, 27, 41, 56, 8, 25, 43, 62, 18, 39, 61, 20, 44];
const KPI = [10, 7, 11, 17, 18, 3, 5, 16, 8, 21, 24, 4, 15, 23, 19, 13, 12, 2, 20, 14, 22, 9, 6, 1];
function keccak256(data: Uint8Array): Uint8Array {
  const M = (1n << 64n) - 1n;
  const rotl = (x: bigint, n: number) => (n ? ((x << BigInt(n)) | (x >> BigInt(64 - n))) & M : x);
  const st: bigint[] = new Array(25).fill(0n);
  const rate = 136;
  const padded = new Uint8Array(Math.ceil((data.length + 1) / rate) * rate);
  padded.set(data);
  padded[data.length] ^= 0x01;
  padded[padded.length - 1] ^= 0x80;
  for (let off = 0; off < padded.length; off += rate) {
    for (let i = 0; i < rate / 8; i++) {
      let lane = 0n;
      for (let b = 7; b >= 0; b--) lane = (lane << 8n) | BigInt(padded[off + i * 8 + b]);
      st[i] ^= lane;
    }
    for (let r = 0; r < 24; r++) {
      const bc: bigint[] = [];
      for (let i = 0; i < 5; i++) bc[i] = st[i] ^ st[i + 5] ^ st[i + 10] ^ st[i + 15] ^ st[i + 20];
      for (let i = 0; i < 5; i++) {
        const t = bc[(i + 4) % 5] ^ rotl(bc[(i + 1) % 5], 1);
        for (let j = 0; j < 25; j += 5) st[j + i] ^= t;
      }
      let t = st[1];
      for (let i = 0; i < 24; i++) {
        const j = KPI[i];
        const tmp = st[j];
        st[j] = rotl(t, KROT[i]);
        t = tmp;
      }
      for (let j = 0; j < 25; j += 5) {
        for (let i = 0; i < 5; i++) bc[i] = st[j + i];
        for (let i = 0; i < 5; i++) st[j + i] ^= ~bc[(i + 1) % 5] & M & bc[(i + 2) % 5];
      }
      st[0] ^= KRC[r];
    }
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 4; i++) for (let b = 0; b < 8; b++) out[i * 8 + b] = Number((st[i] >> BigInt(8 * b)) & 0xffn);
  return out;
}

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58Decode(s: string): Uint8Array | null {
  let n = 0n;
  for (const ch of s) {
    const i = B58.indexOf(ch);
    if (i < 0) return null;
    n = n * 58n + BigInt(i);
  }
  const bytes: number[] = [];
  while (n > 0n) { bytes.unshift(Number(n & 0xffn)); n >>= 8n; }
  for (const ch of s) { if (ch === '1') bytes.unshift(0); else break; }
  return Uint8Array.from(bytes);
}

function checkTron(a: string): AddressCheck {
  if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(a)) return { ok: false, reason: 'format' };
  const raw = base58Decode(a);
  if (!raw || raw.length !== 25 || raw[0] !== 0x41) return { ok: false, reason: 'format' };
  const sum = sha256(sha256(raw.slice(0, 21)));
  return [0, 1, 2, 3].every((i) => sum[i] === raw[21 + i]) ? { ok: true } : { ok: false, reason: 'checksum' };
}

function checkEvm(a: string): AddressCheck {
  if (!/^0x[0-9a-fA-F]{40}$/.test(a)) return { ok: false, reason: 'format' };
  const hex = a.slice(2);
  if (/^0+$/.test(hex)) return { ok: false, reason: 'format' }; // zero (burn) address
  if (hex === hex.toLowerCase() || hex === hex.toUpperCase()) return { ok: true }; // no checksum casing used
  const hash = keccak256(new TextEncoder().encode(hex.toLowerCase()));
  for (let i = 0; i < 40; i++) {
    if (!/[a-f]/i.test(hex[i])) continue;
    const nib = (hash[i >> 1] >> (i % 2 ? 0 : 4)) & 0xf;
    if (hex[i] !== (nib >= 8 ? hex[i].toUpperCase() : hex[i].toLowerCase())) return { ok: false, reason: 'checksum' };
  }
  return { ok: true };
}

function checkTon(a: string): AddressCheck {
  if (/^-?\d+:[0-9a-fA-F]{64}$/.test(a)) return { ok: true }; // raw form "workchain:hex"
  if (!/^[A-Za-z0-9_+/-]{48}$/.test(a)) return { ok: false, reason: 'format' };
  let bin: string;
  try { bin = atob(a.replace(/-/g, '+').replace(/_/g, '/')); } catch { return { ok: false, reason: 'format' }; }
  if (bin.length !== 36) return { ok: false, reason: 'format' };
  const b = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  // tag/workchain are not restricted on purpose: a matching CRC16 is what proves the address is well-formed
  let crc = 0; // CRC16-XMODEM over tag, workchain and the 32-byte hash
  for (let i = 0; i < 34; i++) {
    crc ^= b[i] << 8;
    for (let k = 0; k < 8; k++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc === ((b[34] << 8) | b[35]) ? { ok: true } : { ok: false, reason: 'checksum' };
}

export function validateAddress(network: 'TRC20' | 'BEP20' | 'TON', address: string): AddressCheck {
  const a = address.trim();
  return network === 'TRC20' ? checkTron(a) : network === 'BEP20' ? checkEvm(a) : checkTon(a);
}

/** Clean pasted/typed text: drop invisible & format characters (zero-width, RTL marks, NBSP…) and whitespace. */
const cleanAddress = (t: string) => t.replace(/[\p{Cf}\p{Z}\p{Cc}]/gu, '');

/**
 * Finds a valid address inside pasted text — a bare address, "ton://transfer/ADDR?amount=…",
 * a wallet link, or a sentence around it. Returns the address and the networks it is valid for.
 */
function extractAddress(text: string, check: (n: Network, a: string) => AddressCheck): { address: string; nets: number[] } | null {
  const spaced = text.replace(/[\p{Cf}\p{Cc}]/gu, '').replace(/[\p{Z}\s]+/gu, ' ');
  // whole text first, then each token (split on spaces, "/", "?", "=", … so links and sentences work).
  // Whole tokens only — a valid address with extra characters glued on is NOT accepted.
  const cands = [cleanAddress(text), ...spaced.split(/[^A-Za-z0-9_:+-]+/).filter(Boolean)];
  for (const c of cands) {
    const nets = NETWORKS.map((n, i) => (check(n, c).ok ? i : -1)).filter((i) => i >= 0);
    if (nets.length) return { address: c, nets };
  }
  return null;
}

const CSS = `
.wdm{position:fixed;left:0;right:0;top:0;bottom:0;z-index:1000;direction:ltr;font-family:Roboto,system-ui,"Segoe UI",sans-serif;color:#fff;-webkit-font-smoothing:antialiased;user-select:none;-webkit-tap-highlight-color:transparent;pointer-events:none}
.wdm.open{pointer-events:auto}
.wdm,.wdm *{box-sizing:border-box}
.wdm .dim{position:absolute;inset:0;background:#000;transition:opacity .35s}
.wdm .lift{position:absolute;inset:0;pointer-events:none;will-change:transform;transition:transform .28s cubic-bezier(.16,1,.3,1)}
.wdm .sheet{position:absolute;left:0;right:0;bottom:0;margin:0 auto;width:100%;max-width:520px;height:min(600px,calc(100% - 12px));display:flex;flex-direction:column;overflow:hidden;contain:layout paint;border-radius:28px 28px 0 0;border-top:1px solid #1d2b47;background:var(--wdm-bg,linear-gradient(#141f35,#0e1727));pointer-events:auto;touch-action:manipulation;transition:transform .5s cubic-bezier(.22,.9,.25,1),max-height .28s cubic-bezier(.16,1,.3,1)}
.wdm .head{position:relative;flex:none;height:54px}
.wdm .htitle{position:absolute;left:0;width:100%;top:22px;text-align:center;font-size:17px;font-weight:600;animation:wdm-fade .3s ease both}
.wdm .hbtn{position:absolute;top:11px;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:14px;color:#8a95a9;background:#13223c;cursor:pointer;transition:opacity .3s,transform .3s}
.wdm .hbtn.off{opacity:0;pointer-events:none;transform:scale(.8)}
.wdm .stage{position:relative;flex:1 1 auto;min-height:0;perspective:1200px;overflow:hidden}
.wdm .pane{position:absolute;inset:0;display:flex;flex-direction:column;contain:layout paint;transition:transform .6s cubic-bezier(.22,.9,.25,1),opacity .4s ease,visibility 0s linear .6s}
.wdm .pane.cur{transform:none;opacity:1;visibility:visible;transition:transform .6s cubic-bezier(.22,.9,.25,1) .06s,opacity .45s ease .1s,visibility 0s}
.wdm .pane.prev{transform:translate3d(-55%,0,-160px) rotateY(24deg);opacity:0;visibility:hidden;pointer-events:none}
.wdm .pane.next{transform:translate3d(55%,0,-160px) rotateY(-24deg);opacity:0;visibility:hidden;pointer-events:none}
.wdm .body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;scroll-padding:12px 0 24px;padding:0 16px 10px;-webkit-overflow-scrolling:touch}
.wdm .foot{flex:none;padding:6px 16px calc(14px + env(safe-area-inset-bottom,0px))}
.wdm .ab{position:absolute}
.wdm .wc{position:relative;background:#0c1423;border-radius:18px}
.wdm .tabs{height:44px;margin-top:12px}
.wdm .ch{position:absolute;top:0;width:33.333%;height:44px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .25s}
.wdm .wr{display:flex;justify-content:space-between;height:28px;align-items:center;font-size:13px;font-weight:500;padding:0 14px}
.wdm .wr span:first-child{color:#8a95a9}
.wdm input,.wdm textarea{font-family:inherit;background:transparent;border:0;outline:0;padding:0;margin:0;color:#fff;user-select:text}
.wdm textarea{resize:none;overflow:hidden;display:block}
.wdm .addr{position:absolute;left:14px;top:11px;width:calc((100% - 82px) / .75);height:50.6px;font:500 16px/25.3px ui-monospace,Menlo,Consolas,monospace;word-break:break-all;color:#fff;transform:scale(.75);transform-origin:0 0}
/* address field: hairline outline with a notch for the floating label */
.wdm .of{position:absolute;left:0;right:0;bottom:0;top:-5.5px;margin:0;padding:0 14px;min-width:0;border:1px solid rgba(138,149,169,.38);border-radius:16px;pointer-events:none;transition:border-color .25s ease}
.wdm .of.f{border-color:#3E9BEA}
.wdm .of legend{display:block;width:auto;height:12px;padding:0;font-size:12px;line-height:12px;visibility:hidden;max-width:.01px;white-space:nowrap;transition:max-width .12s cubic-bezier(0,0,.2,1)}
.wdm .of legend.n{max-width:100%;transition:max-width .2s cubic-bezier(0,0,.2,1) .06s}
.wdm .of legend span{display:inline-block;padding:0 5px;opacity:0;visibility:visible}
.wdm .lbl{position:absolute;left:0;top:0;z-index:1;pointer-events:none;white-space:nowrap;transform-origin:0 50%;font-size:14px;line-height:16px;color:#5d6a82;transform:translate(16px,26px);transition:transform .24s cubic-bezier(.3,.8,.3,1),color .24s ease}
.wdm .lbl.f{transform:translate(20px,-8px) scale(.857);color:#8a95a9}
.wdm .lbl.f.a{color:#3E9BEA}
.wdm .hint{font-size:12px;color:#8a95a9;text-align:center;padding-top:6px}
.wdm .hint.err{color:#ff7a7a}
.wdm .lnk{color:#3E9BEA;font-weight:700;margin-left:6px;cursor:pointer;white-space:nowrap}
.wdm .of.e{border-color:#ff6b6b}
.wdm .lbl.f.e{color:#ff7a7a}
.wdm .col{display:grid;grid-template-rows:1fr;opacity:1;transition:grid-template-rows .38s cubic-bezier(.3,.8,.3,1),opacity .28s ease}
.wdm .col.off{grid-template-rows:0fr;opacity:0;pointer-events:none}
.wdm .col>div{min-height:0;overflow:hidden;contain:layout paint}
.wdm .btn{position:relative;width:100%;height:52px;border-radius:26px;background:#1b2638;overflow:hidden;font-size:17px;font-weight:700;transition:transform .18s ease}
.wdm .btn.on:active{transform:scale(.985)}
.wdm .btn .g{position:absolute;inset:0;transition:opacity .4s ease}
.wdm .btn .t{position:absolute;inset:0;display:grid;place-items:center;transition:color .35s ease}
/* confirming */
.wdm .pbody{flex:1 1 auto;min-height:0;overflow-y:auto;padding:4px 28px 14px;display:flex;flex-direction:column}
.wdm .phead{text-align:center;padding:10px 0 26px;animation:wdm-rise .5s cubic-bezier(.22,.9,.25,1) both}
.wdm .phead b{display:block;font-size:34px;font-weight:700;letter-spacing:-.5px}
.wdm .phead span{font-size:13px;color:#8a95a9}
.wdm .st{position:relative;display:flex;gap:14px;padding-bottom:24px;animation:wdm-rise .5s cubic-bezier(.22,.9,.25,1) both}
.wdm .st:last-child{padding-bottom:0}
.wdm .dot{position:relative;flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;border:2px solid #2a3a5a;transition:border-color .3s,background .3s}
.wdm .dot.act{border-color:transparent}
.wdm .dot.done{background:linear-gradient(#34c77b,#1f9f5c);border-color:transparent;animation:wdm-pop .45s cubic-bezier(.3,1.4,.4,1)}
.wdm .dot.err{background:linear-gradient(#ff7a7a,#d63c3c);border-color:transparent;animation:wdm-pop .45s cubic-bezier(.3,1.4,.4,1)}
.wdm .dot svg{width:16px;height:16px}
.wdm .dot path{stroke-dasharray:16;stroke-dashoffset:16;animation:wdm-draw .4s ease .1s forwards}
.wdm .spin{position:absolute;inset:-2px;border-radius:50%;border:2px solid rgba(62,155,234,.2);border-top-color:#3E9BEA;animation:wdm-spin .8s linear infinite}
.wdm .line{position:absolute;left:13px;top:32px;bottom:3px;width:2px;border-radius:1px;background:#22304d;overflow:hidden}
.wdm .line i{display:block;width:100%;height:100%;background:linear-gradient(#34c77b,#3E9BEA);transform:scaleY(0);transform-origin:top;transition:transform .5s ease}
.wdm .line.on i{transform:scaleY(1)}
.wdm .tx b{display:block;font-size:15px;font-weight:600;line-height:28px;color:#5d6a82;transition:color .3s}
.wdm .tx span{display:block;font-size:12px;margin-top:-3px;color:#5d6a82;transition:color .3s}
.wdm .st.act .tx b,.wdm .st.done .tx b,.wdm .st.bad .tx b{color:#fff}
.wdm .st.act .tx span,.wdm .st.done .tx span,.wdm .st.bad .tx span{color:#8a95a9}
.wdm .pnote{margin-top:auto;padding-top:18px;text-align:center;font-size:12px;color:#5d6a82}
/* result */
.wdm .rbody{flex:1 1 auto;min-height:0;overflow-y:auto;padding:0 16px 10px;text-align:center}
.wdm .ricon{position:relative;width:112px;height:112px;margin:6px auto 2px}
.wdm .rip{position:absolute;inset:6px;border-radius:50%;border:2px solid #F5B544;opacity:0;animation:wdm-ripple 2.6s ease-out 1s infinite}
.wdm .rip.b{animation-delay:2.3s}
.wdm .rt{font-size:22px;font-weight:700;margin-top:8px;animation:wdm-rise .5s cubic-bezier(.22,.9,.25,1) .25s both}
.wdm .rs{font-size:13px;color:#8a95a9;line-height:19px;margin:6px auto 16px;max-width:310px;animation:wdm-rise .5s cubic-bezier(.22,.9,.25,1) .33s both}
.wdm .card{background:#121c30;border-radius:16px;padding:6px 0;text-align:left;animation:wdm-rise .5s cubic-bezier(.22,.9,.25,1) .41s both}
.wdm .card .wr{height:32px}
.wdm .pill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:12px;background:rgba(245,181,68,.14);color:#F5B544;font-size:12px;font-weight:700}
.wdm .pill i{width:6px;height:6px;border-radius:50%;background:#F5B544;animation:wdm-pulse 1.4s ease-in-out infinite}
.wdm .pill.bad{background:rgba(255,107,107,.14);color:#ff7a7a}
.wdm .pill.bad i{background:#ff7a7a;animation:none}
/* top notification */
.wdm .toast{position:absolute;left:12px;right:12px;top:calc(10px + env(safe-area-inset-top,0px));margin:0 auto;max-width:420px;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;border:1px solid #1d2b47;background:linear-gradient(#141f35,#0e1727);box-shadow:0 12px 40px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06);pointer-events:auto;cursor:pointer;z-index:5;will-change:transform;transition:transform .55s cubic-bezier(.22,.9,.25,1),opacity .35s ease}
.wdm .toast.off{transform:translate3d(0,-160%,0);opacity:0;pointer-events:none}
.wdm .toast b{display:block;font-size:14px;font-weight:700}
.wdm .toast span{display:block;font-size:12px;color:#8a95a9;margin-top:1px}
@keyframes wdm-fade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes wdm-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes wdm-pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes wdm-draw{to{stroke-dashoffset:0}}
@keyframes wdm-spin{to{transform:rotate(360deg)}}
@keyframes wdm-hand{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes wdm-hand-in{from{transform:rotate(var(--from))}to{transform:rotate(0)}}
@keyframes wdm-ripple{0%{transform:scale(.8);opacity:.55}100%{transform:scale(1.4);opacity:0}}
@keyframes wdm-pulse{50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){.wdm *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;transition-delay:0s!important}}
`;

/**
 * Smooth keyboard handling — no React work, no CSS-variable invalidation, only two direct style writes:
 *   • .lift  → transform: translateY(-keyboard)   (compositor-only, eased)
 *   • .sheet → height capped to the visible area  (eased, only when the sheet would not fit)
 * The lift starts the moment a field gets focus, using the last measured (or an estimated) keyboard height, so the sheet moves WITH
 * the keyboard instead of jumping after it; when visualViewport reports the real size it eases to it. If no keyboard shows up
 * (hardware keyboard / desktop) it eases back. Works with keyboards that resize the layout viewport too.
 */
function useKeyboardLift(
  open: boolean,
  rootRef: { current: HTMLDivElement | null },
  liftRef: { current: HTMLDivElement | null },
  sheetRef: { current: HTMLDivElement | null },
) {
  useEffect(() => {
    const root = rootRef.current;
    const lift = liftRef.current;
    const sheet = sheetRef.current;
    if (!root || !lift || !open) return;
    const vv = window.visualViewport;

    let cur = 0;
    let raf = 0;
    let focused = false;

    const set = (kb: number) => {
      const clamped = Math.max(0, Math.round(kb));
      if (Math.abs(clamped - cur) > 0.5) {
        cur = clamped;
        lift.style.transform = clamped > 0 ? `translate3d(0,${-clamped}px,0)` : '';
        if (sheet) {
          if (clamped > 0) {
            const visibleArea = (vv?.height || window.innerHeight) - 16;
            sheet.style.maxHeight = `${Math.max(280, visibleArea)}px`;
          } else {
            sheet.style.maxHeight = '';
          }
        }
      }
    };

    const sync = () => {
      raf = 0;
      if (vv) {
        const kb = Math.max(0, Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0)));
        if (kb > 30 || focused) {
          set(kb);
        } else {
          set(0);
        }
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!target.matches?.('input,textarea')) return;
      focused = true;
      schedule();
      setTimeout(() => {
        target.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    };

    const onFocusOut = () => {
      focused = false;
      window.setTimeout(() => {
        const active = document.activeElement;
        if (!active || !(active as HTMLElement).matches?.('input,textarea')) {
          set(0);
        }
      }, 120);
    };

    sync();
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    vv?.addEventListener('resize', schedule);
    vv?.addEventListener('scroll', schedule);
    window.addEventListener('resize', schedule);

    const tg = (window as any).Telegram?.WebApp;
    if (tg?.onEvent) {
      tg.onEvent('viewportChanged', schedule);
    }

    return () => {
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      vv?.removeEventListener('resize', schedule);
      vv?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (tg?.offEvent) {
        tg.offEvent('viewportChanged', schedule);
      }
      if (raf) cancelAnimationFrame(raf);
      lift.style.transform = '';
      if (sheet) sheet.style.maxHeight = '';
    };
  }, [open, rootRef, liftRef, sheetRef]);
}

/** Animated "in review" clock: draws its ring, hands spin up and then keep ticking, soft ripples around it. */
function ClockIcon() {
  const hand = (len: number, w: number, color: string, from: number, period: number) => (
    <line
      x1="48" y1="48" x2="48" y2={48 - len}
      stroke={color} strokeWidth={w} strokeLinecap="round"
      style={{
        transformBox: 'view-box', transformOrigin: '48px 48px', ['--from' as string]: `${from}deg`,
        animation: `wdm-hand-in 1.2s cubic-bezier(.2,.8,.2,1) .2s both, wdm-hand ${period}s linear 1.4s infinite`,
      } as CSSProperties}
    />
  );
  return (
    <div className="ricon">
      <span className="rip" />
      <span className="rip b" />
      <svg viewBox="0 0 96 96" width="112" height="112" style={{ animation: 'wdm-pop .7s cubic-bezier(.3,1.35,.4,1) both' }}>
        <defs>
          <linearGradient id="wdm-amb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD27A" />
            <stop offset="1" stopColor="#F0A020" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="44" fill="rgba(245,181,68,.10)" />
        <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(245,181,68,.2)" strokeWidth="4" />
        <circle cx="48" cy="48" r="38" fill="none" stroke="url(#wdm-amb)" strokeWidth="4" strokeLinecap="round" strokeDasharray="239" strokeDashoffset="239" transform="rotate(-90 48 48)" style={{ animation: 'wdm-draw 1s cubic-bezier(.4,0,.2,1) .15s forwards' }} />
        <g stroke="#F5B544" strokeWidth="2.4" strokeLinecap="round" opacity=".7">
          <line x1="48" y1="15" x2="48" y2="19" /><line x1="81" y1="48" x2="77" y2="48" />
          <line x1="48" y1="81" x2="48" y2="77" /><line x1="15" y1="48" x2="19" y2="48" />
        </g>
        {hand(14, 3.6, '#FFD27A', -180, 30)}
        {hand(21, 3.2, '#fff', -720, 4)}
        <circle cx="48" cy="48" r="3.6" fill="#fff" />
      </svg>
    </div>
  );
}

function FailIcon() {
  return (
    <div className="ricon">
      <svg viewBox="0 0 96 96" width="112" height="112" style={{ animation: 'wdm-pop .7s cubic-bezier(.3,1.35,.4,1) both' }}>
        <circle cx="48" cy="48" r="44" fill="rgba(255,107,107,.10)" />
        <circle cx="48" cy="48" r="38" fill="none" stroke="#ff7a7a" strokeWidth="4" strokeLinecap="round" strokeDasharray="239" strokeDashoffset="239" transform="rotate(-90 48 48)" style={{ animation: 'wdm-draw .9s cubic-bezier(.4,0,.2,1) .1s forwards' }} />
        <path d="M36 36l24 24M60 36L36 60" stroke="#ff7a7a" strokeWidth="5" strokeLinecap="round" strokeDasharray="34" strokeDashoffset="34" style={{ animation: 'wdm-draw .4s ease .7s forwards' }} />
      </svg>
    </div>
  );
}

export function WithdrawModal({ open, onClose, onBack, available = 0, onSubmit, sound = true, notify = true, forceEnable = false, dim = true, validate }: Props) {
  const [amount, setAmount] = useState('');
  const [net, setNet] = useState(2); // 0 TRC20, 1 BEP20, 2 TON
  const [address, setAddress] = useState('');
  const [addrFocus, setAddrFocus] = useState(false);
  const [hint, setHint] = useState('');
  const [addrTouched, setAddrTouched] = useState(false);

  const [view, setView] = useState<View>('form');
  const [stepIdx, setStepIdx] = useState(0); // steps before this index are done; this one is active; 4 = all done
  const [failed, setFailed] = useState(false);
  const [snap, setSnap] = useState<Snap | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [toast, setToast] = useState<{ title: string; text: string } | null>(null);
  const [toastOn, setToastOn] = useState(false);

  const resetTimer = useRef<number | undefined>(undefined);
  const hintTimer = useRef<number | undefined>(undefined);
  const toastTimer = useRef<number | undefined>(undefined);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const run = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  useKeyboardLift(open, rootRef, liftRef, sheetRef);

  // lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // reset after the sheet has slid away
  useEffect(() => {
    if (open) return;
    run.current++; // cancel any running flow
    resetTimer.current = window.setTimeout(() => {
      setAmount('');
      setAddress('');
      setHint('');
      setAddrTouched(false);
      setView('form');
      setStepIdx(0);
      setFailed(false);
      setOutcome(null);
    }, 650);
    return () => window.clearTimeout(resetTimer.current);
  }, [open]);

  useEffect(
    () => () => {
      run.current++;
      [hintTimer, toastTimer].forEach((t) => window.clearTimeout(t.current));
      audio.current?.close?.().catch(() => {});
    },
    [],
  );

  const amt = parseFloat(amount) || 0;
  // address validation (format + checksum for the selected network, or your own `validate`)
  const check = (n: Network, a: string): AddressCheck => {
    if (!validate) return validateAddress(n, a);
    const r = validate(n, a);
    return r === true ? { ok: true } : { ok: false, reason: 'custom', message: typeof r === 'string' ? r : undefined };
  };
  const addrCheck = address ? check(NETWORKS[net], address) : null;
  const addrOk = !!addrCheck?.ok;
  const showErr = !!address && !addrOk && (addrTouched || address.length >= ADDR_LEN[net]);
  const otherNet = showErr ? NETWORKS.findIndex((n, i) => i !== net && check(n, address).ok) : -1;
  const canSubmit = view === 'form' && (forceEnable || (amt > 0 && amt <= available && addrOk));
  const subAmt = amt > 0 ? amt : forceEnable ? available || 1 : 0; // what is actually submitted
  const subAddr = address.trim() || (forceEnable ? SAMPLE_ADDRESS : '');

  const onAmount = (e: ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9.]/g, '');
    const i = v.indexOf('.');
    if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, '');
    setAmount(v);
  };

  const showHint = (msg: string) => {
    setHint(msg);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(''), 3000);
  };

  // Shared by the Paste button and by a manual (long-press) paste into the field.
  const applyPasted = (raw: string) => {
    const found = extractAddress(raw, check);
    const text = found ? found.address : cleanAddress(raw).slice(0, 100);
    // valid for another network only → switch the tab for the user
    const alt = found && !found.nets.includes(net) ? found.nets[0] : -1;
    if (alt >= 0) setNet(alt);
    setAddress(text);
    setAddrTouched(true);
    if (alt >= 0) showHint(`Switched to ${NETWORKS[alt]} network`);
    else setHint('');
  };

  // Paste: read the clipboard and fill the address automatically.
  // (Needs HTTPS + a user tap; the browser may ask for clipboard permission once.)
  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (cleanAddress(text)) applyPasted(text);
      else showHint('Clipboard is empty');
    } catch {
      taRef.current?.focus(); // clipboard blocked → let the user long-press to paste
      showHint('Clipboard blocked — long-press the field to paste');
    }
  };

  // ---- sound: created on the Withdraw tap (needs a user gesture), played only when the result appears
  const unlockAudio = () => {
    if (!sound) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audio.current) audio.current = new AC();
      audio.current.resume?.();
    } catch {
      /* no audio */
    }
  };
  const chime = () => {
    const a = audio.current;
    if (!sound || !a || a.state !== 'running') return;
    const t = a.currentTime;
    [[659.25, 0], [987.77, 0.11], [1318.5, 0.24]].forEach(([f, d]) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + d);
      g.gain.linearRampToValueAtTime(0.12, t + d + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.9);
      o.connect(g).connect(a.destination);
      o.start(t + d);
      o.stop(t + d + 1);
    });
  };

  // ---- submit: 3D-slide to the confirming screen, run the steps, slide to the result
  const submit = async () => {
    if (!canSubmit) return;
    if (!forceEnable && !check(NETWORKS[net], address).ok) return; // never submit an invalid address
    (document.activeElement as HTMLElement | null)?.blur?.();
    unlockAudio();
    const id = ++run.current;
    const stale = () => run.current !== id;
    const payload: WithdrawPayload = { amount: subAmt, network: NETWORKS[net], address: subAddr };
    setSnap({ ...payload, fee: FEE[net], receive: Math.max(0, subAmt - FEE[net]) });
    setOutcome(null);
    setFailed(false);
    setStepIdx(0);
    setRunKey((k) => k + 1);
    setView('progress');

    // the real request starts right away; the steps animate while it runs
    const call: Promise<Outcome> = Promise.resolve()
      .then(() => (onSubmit ? onSubmit(payload) : sleep(600)))
      .then(
        (r) => ({ ok: true as const, id: (r as { id?: string } | undefined)?.id }),
        (e: unknown) => ({ ok: false as const, message: (e as Error)?.message || 'Something went wrong. Please try again.' }),
      );

    await sleep(1000); // 3D slide + first step
    if (stale()) return;
    setStepIdx(1);
    await sleep(850);
    if (stale()) return;
    setStepIdx(2);
    await sleep(850);
    if (stale()) return;
    setStepIdx(3);
    const [out] = await Promise.all([call, sleep(1000)]);
    if (stale()) return;
    if (out.ok) {
      setStepIdx(4);
      await sleep(700);
    } else {
      setFailed(true);
      await sleep(800);
    }
    if (stale()) return;
    setOutcome(out);
    setView('result');
    if (out.ok) chime();
  };

  // ---- leaving the sheet (Back / ✕ / tap outside). Not possible while confirming.
  const leave = (cb?: () => void) => {
    if (view === 'progress') return;
    if (view === 'result' && outcome?.ok && snap && notify) {
      setToast({ title: 'Withdrawal submitted', text: `${fmt(snap.amount)} USDT · ${snap.network} — in review` });
      setToastOn(true);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToastOn(false), 4800);
    }
    cb?.();
  };
  const close = () => leave(onClose);
  const back = () => leave(onBack ?? onClose);
  const tryAgain = () => {
    setView('form');
    setFailed(false);
    setStepIdx(0);
  };

  const paneClass = (v: View) => {
    const i = VIEWS.indexOf(v);
    const c = VIEWS.indexOf(view);
    return 'pane ' + (i === c ? 'cur' : i < c ? 'prev' : 'next');
  };

  const title = view === 'form' ? 'Withdraw' : view === 'progress' ? 'Confirming' : outcome && !outcome.ok ? 'Failed' : 'Withdrawal';
  const floated = addrFocus || address.length > 0;
  const s = snap;

  return (
    <div ref={rootRef} className={'wdm' + (open ? ' open' : '')} aria-hidden={!open}>
      <style>{CSS}</style>

      {/* reusable logos (Tether, TON) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <symbol id="wdm-tt" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="256" fill="#009393" />
            <path d="M 160 128 H 352 L 438 243 L 258 419 L 74 243 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="24" strokeLinejoin="round" />
            <path fill="#009393" fillRule="evenodd" d="M 164 258 A 92 25 0 1 0 348 258 A 92 25 0 1 0 164 258 Z M 182 258 A 74 11 0 1 0 330 258 A 74 11 0 1 0 182 258 Z" />
            <rect x="178" y="177" width="156" height="30" rx="4" fill="#009393" />
            <rect x="236" y="177" width="40" height="159" rx="4" fill="#009393" />
          </symbol>
          <symbol id="wdm-tn" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="16" fill="#0098EA" />
            <path d="M16 23.4 8.9 11.6a1 1 0 0 1 .9-1.5h12.4a1 1 0 0 1 .9 1.5z" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
            <path d="M16 10.4v13" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
          </symbol>
        </defs>
      </svg>

      <div className="dim" style={{ opacity: open && dim ? 0.5 : 0 }} onClick={close} />

      <div className="lift" ref={liftRef}>
      <div className="sheet" ref={sheetRef} role="dialog" aria-label="Withdraw" style={{ transform: open ? 'translate3d(0,0,0)' : 'translate3d(0,100%,0)' }}>
        {/* header: grabber, title, back / close */}
        <div className="head">
          <div className="ab" style={{ left: '50%', top: 8, width: 36, height: 4, marginLeft: -18, borderRadius: 2, background: '#3a4560' }} />
          <div className="htitle" key={title}>{title}</div>
          <div className={'hbtn' + (view === 'result' ? '' : ' off')} role="button" aria-label="Back" onClick={back} style={{ left: 16, fontSize: 24, paddingBottom: 3 }}>‹</div>
          <div className={'hbtn' + (view === 'form' ? '' : ' off')} role="button" aria-label="Close" onClick={close} style={{ right: 16 }}>✕</div>
        </div>

        <div className="stage">
          {/* ───────────── 1 · FORM ───────────── */}
          <div className={paneClass('form')}>
            <div className="body">
              <div style={{ textAlign: 'center', paddingTop: 6 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 6px', borderRadius: 20, background: '#121c30', fontSize: 13, fontWeight: 600 }}>
                  <svg width="24" height="24" viewBox="0 0 32 32"><use href="#wdm-tt" /></svg>
                  USDT
                </div>
              </div>

              {/* amount + Max */}
              <div style={{ position: 'relative', height: 64, marginTop: 12 }}>
                <div className="ab" style={{ inset: 0, display: 'flex', justifyContent: 'center' }}>
                  <input
                    value={amount}
                    onChange={onAmount}
                    inputMode="decimal"
                    enterKeyHint="done"
                    onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                    placeholder="0"
                    aria-label="Amount"
                    style={{ width: 200, textAlign: 'center', fontSize: 52, lineHeight: '64px', height: 64, fontWeight: 700, color: amt > 0 ? '#fff' : '#5d6a82' }}
                  />
                </div>
                <div
                  className="ab"
                  role="button"
                  onClick={() => setAmount(String(available))}
                  style={{ right: 4, top: 16, width: 52, height: 32, borderRadius: 16, background: '#172338', color: '#3E9BEA', fontSize: 13, fontWeight: 700, display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                >
                  Max
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#8a95a9', marginTop: 6 }}>
                Available <b style={{ color: '#fff', fontWeight: 600 }}>{fmt(available)} USDT</b>
              </div>

              {/* network tabs */}
              <div className="wc tabs" style={{ borderRadius: 22 }}>
                <div
                  className="ab"
                  style={{ left: 0, top: 0, width: '33.333%', height: 44, borderRadius: 22, background: '#22406e', willChange: 'transform', transform: `translate3d(${net * 100}%,0,0)`, transition: 'transform .3s cubic-bezier(.3,.8,.3,1)' }}
                />
                <div className="ch" onClick={() => setNet(0)} style={{ left: 0, opacity: net === 0 ? 1 : 0.5 }}>TRC20</div>
                <div className="ch" onClick={() => setNet(1)} style={{ left: '33.333%', opacity: net === 1 ? 1 : 0.5 }}>BEP20</div>
                <div className="ch" onClick={() => setNet(2)} style={{ left: '66.666%', opacity: net === 2 ? 1 : 0.5 }}>
                  <svg width="16" height="16"><use href="#wdm-tn" /></svg>
                  TON
                </div>
              </div>

              {/* address + Paste — outlined field, label floats into a notch in the border on focus */}
              <div
                className="wc"
                onClick={() => taRef.current?.focus()}
                style={{ height: 64, marginTop: 18, borderRadius: 16, background: addrFocus ? '#17233a' : '#121c30', transition: 'background .25s' }}
              >
                <fieldset className={'of' + (showErr ? ' e' : addrFocus ? ' f' : '')} aria-hidden="true">
                  <legend className={floated ? 'n' : ''}><span>Enter Address</span></legend>
                </fieldset>
                <div className={'lbl' + (floated ? ' f' : '') + (showErr ? ' e' : addrFocus ? ' a' : '')}>Enter Address</div>
                <textarea
                  ref={taRef}
                  className="addr"
                  rows={2}
                  value={address}
                  onChange={(e) => { const v = cleanAddress(e.target.value).slice(0, 100); setAddress(v); if (!v) setAddrTouched(false); }}
                  onFocus={() => setAddrFocus(true)}
                  onBlur={() => { setAddrFocus(false); setAddrTouched(true); }}
                  enterKeyHint="done"
                  autoCapitalize="off"
                  autoCorrect="off"
                  onPaste={(e) => {
                    const t = e.clipboardData?.getData('text');
                    if (t) { e.preventDefault(); applyPasted(t); }
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLTextAreaElement).blur(); } }}
                  aria-label="Enter Address"
                  spellCheck={false}
                  autoComplete="off"
                />
                <div
                  className="ab"
                  role="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => { e.stopPropagation(); paste(); }}
                  style={{ right: 16, top: 22, fontSize: 13, fontWeight: 700, color: addrOk ? '#46C67D' : '#3E9BEA', cursor: 'pointer', zIndex: 2 }}
                >
                  {addrOk ? '✓' : 'Paste'}
                </div>
              </div>
              <div className={'col' + (showErr || hint ? '' : ' off')} aria-live="polite">
                <div>
                  <div className={'hint' + (showErr ? ' err' : '')}>
                    {showErr ? (
                      <>
                        {otherNet >= 0
                          ? `This is a ${NETWORKS[otherNet]} address, not ${NETWORKS[net]}.`
                          : addrCheck && !addrCheck.ok && addrCheck.reason === 'custom' && addrCheck.message
                            ? addrCheck.message
                            : addrCheck && !addrCheck.ok && addrCheck.reason === 'checksum'
                            ? 'Checksum doesn’t match — check the address for typos.'
                            : /[^\x00-\x7f]/.test(address)
                              ? 'Use the English keyboard — this contains non-English characters.'
                              : `Not a valid ${NETWORKS[net]} address.${address.length !== ADDR_LEN[net] && !address.includes(':') ? ` ${ADDR_LEN[net]} characters expected, you entered ${address.length}.` : ''}`}
                        {otherNet >= 0 && <span className="lnk" role="button" onClick={() => setNet(otherNet)}>Switch to {NETWORKS[otherNet]}</span>}
                      </>
                    ) : hint}
                  </div>
                </div>
              </div>

              {/* details */}
              <div style={{ paddingTop: 12 }}>
                <div className="wr"><span>Network</span><span>{NETWORKS[net]}</span></div>
                <div className="wr"><span>Network fee</span><span>{FEE[net].toFixed(2)} USDT</span></div>
                <div className="wr"><span>Estimated time</span><span>{ETA[net]}</span></div>
                <div className="wr" style={{ fontWeight: 700 }}><span style={{ fontWeight: 500 }}>You receive</span><span>{Math.max(0, amt - FEE[net]).toFixed(2)} USDT</span></div>
              </div>
            </div>

            <div className="foot">
              <div className={'btn' + (canSubmit ? ' on' : '')} role="button" aria-disabled={!canSubmit} onClick={submit} style={{ cursor: canSubmit ? 'pointer' : 'default' }}>
                <div className="g" style={{ background: 'linear-gradient(#39B0FF,#0F72E8)', opacity: canSubmit ? 1 : 0 }} />
                <div className="t" style={{ color: canSubmit ? '#fff' : '#5d6a82' }}>
                  <span key={amt > 0 ? 'amount' : 'empty'} style={{ animation: 'wdm-fade .3s ease both' }}>{amt > 0 ? `Withdraw ${fmt(amt)} USDT` : 'Withdraw'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────── 2 · CONFIRMING ───────────── */}
          <div className={paneClass('progress')}>
            <div className="pbody" key={runKey}>
              <div className="phead">
                <b>{s ? fmt(s.amount) : '0'} USDT</b>
                <span>to {s ? `${s.network} · ${short(s.address)}` : ''}</span>
              </div>
              {STEPS.map((st, i) => {
                const bad = failed && i === 3;
                const done = !bad && stepIdx > i;
                const act = !bad && stepIdx === i;
                return (
                  <div className={'st' + (done ? ' done' : '') + (act ? ' act' : '') + (bad ? ' bad' : '')} key={i} style={{ animationDelay: `${0.12 + i * 0.08}s` }}>
                    <div className={'dot' + (done ? ' done' : '') + (act ? ' act' : '') + (bad ? ' err' : '')}>
                      {act && <i className="spin" />}
                      {done && (
                        <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg>
                      )}
                      {bad && (
                        <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
                      )}
                    </div>
                    {i < STEPS.length - 1 && <div className={'line' + (done ? ' on' : '')}><i /></div>}
                    <div className="tx">
                      <b>{st.title}</b>
                      <span>{s ? st.sub(s, available) : ''}</span>
                    </div>
                  </div>
                );
              })}
              <div className="pnote">Please keep this screen open</div>
            </div>
          </div>

          {/* ───────────── 3 · RESULT ───────────── */}
          <div className={paneClass('result')}>
            <div className="rbody" key={'r' + runKey + (outcome ? (outcome.ok ? 'ok' : 'bad') : '')}>
              {outcome && (outcome.ok ? <ClockIcon /> : <FailIcon />)}
              {outcome && (
                <>
                  <div className="rt">{outcome.ok ? 'Sent for review' : 'Withdrawal failed'}</div>
                  <div className="rs">
                    {outcome.ok
                      ? 'Your withdrawal was submitted and is being reviewed. We’ll let you know as soon as it’s completed.'
                      : outcome.message}
                  </div>
                  {s && outcome.ok && (
                    <div className="card">
                      <div className="wr"><span>Amount</span><span style={{ fontWeight: 700 }}>{fmt(s.amount)} USDT</span></div>
                      <div className="wr"><span>Network</span><span>{s.network}</span></div>
                      <div className="wr"><span>To</span><span style={{ fontFamily: 'ui-monospace,Menlo,Consolas,monospace', fontSize: 12 }}>{short(s.address)}</span></div>
                      <div className="wr"><span>Network fee</span><span>{s.fee.toFixed(2)} USDT</span></div>
                      <div className="wr"><span>You receive</span><span style={{ fontWeight: 700 }}>{s.receive.toFixed(2)} USDT</span></div>
                      {outcome.id && <div className="wr"><span>Reference</span><span style={{ fontFamily: 'ui-monospace,Menlo,Consolas,monospace', fontSize: 12 }}>{outcome.id}</span></div>}
                      <div className="wr"><span>Status</span><span className="pill"><i />In review</span></div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="foot">
              {outcome && !outcome.ok ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="btn on" role="button" onClick={back} style={{ flex: 1, background: '#1b2638', cursor: 'pointer' }}>
                    <div className="t" style={{ color: '#8a95a9' }}>Close</div>
                  </div>
                  <div className="btn on" role="button" onClick={tryAgain} style={{ flex: 1.4, cursor: 'pointer' }}>
                    <div className="g" style={{ background: 'linear-gradient(#39B0FF,#0F72E8)' }} />
                    <div className="t" style={{ color: '#fff' }}>Try again</div>
                  </div>
                </div>
              ) : (
                <div className="btn on" role="button" onClick={back} style={{ cursor: 'pointer' }}>
                  <div className="g" style={{ background: 'linear-gradient(#39B0FF,#0F72E8)' }} />
                  <div className="t" style={{ color: '#fff' }}>Back</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* top notification — same look as the sheet, slides in from the top */}
      <div className={'toast' + (toastOn ? '' : ' off')} role="status" onClick={() => setToastOn(false)}>
        <svg width="36" height="36" viewBox="0 0 36 36" style={{ flex: 'none' }}>
          <circle cx="18" cy="18" r="18" fill="rgba(245,181,68,.16)" />
          <circle cx="18" cy="18" r="11" fill="none" stroke="#F5B544" strokeWidth="2" />
          <path d="M18 12v6l4 2.5" fill="none" stroke="#FFD27A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ minWidth: 0 }}>
          <b>{toast?.title}</b>
          <span>{toast?.text}</span>
        </div>
      </div>
    </div>
  );
}

export default WithdrawModal;
