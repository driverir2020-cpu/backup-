import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@telegram-apps/telegram-ui';
import { 
  Phone, 
  Check, 
  User as UserIcon,
  Lock, 
  Unlock,
  KeyRound,
  ShieldCheck, 
  AlertCircle, 
  CreditCard, 
  Coins, 
  ChevronRight, 
  Shield, 
  Star,
  Crown,
  Sparkles,
  Zap, 
  Percent,
  CalendarCheck,
  Landmark,
  BadgeCheck,
  BookOpen,
  ArrowRight,
  Globe,
  Eye,
  RefreshCw,
  X,
  Radio
} from 'lucide-react';
import { FaWalletIcon, FaDollarIcon } from '../components/CustomIcons';
import { useAuth } from '../context/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LoanRecord } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { useTranslation } from 'react-i18next';

const COLORS = {
  green: "#34d399",
  blue: "#4aa3ff",
  gold: "#f2b632",
  purple: "#b583ff",
};

const CARD = "#1C1C1E";

/** Telegram-style quote icon (top-right). */
const QuoteMark: React.FC<{ color: string }> = ({ color }) => (
  <svg
    viewBox="0 0 14 12"
    width={13}
    height={11}
    fill={color}
    className="absolute right-2.5 top-[9px] opacity-75"
    aria-hidden="true"
  >
    <path d="M0 6.2C0 2.6 1.8.6 4.6 0l.7 1.5C3.8 2 3.2 3 3.2 4.2H6V12H0zm8 0C8 2.6 9.8.6 12.6 0l.7 1.5c-1.5.5-2.1 1.5-2.1 2.7H14V12H8z" />
  </svg>
);

/** Telegram-style blockquote: left accent bar, tinted card, quote mark with refined typography. */
const Quote: React.FC<{
  color: string;
  className?: string;
  children: React.ReactNode;
}> = ({ color, className = "", children }) => (
  <div
    className={`relative rounded-[14px] border-l-[3.5px] py-2.5 pl-3 pr-8 text-[13px] sm:text-[13.5px] leading-relaxed text-tg-text bg-tg-secondary border border-tg-separator shadow-sm ${className}`}
    style={{
      borderLeftColor: color,
    }}
  >
    <QuoteMark color={color} />
    {children}
  </div>
);

const Item: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="[&+&]:mt-3">
    <h3 className="mb-0.5 flex items-center gap-1.5 text-[14px] sm:text-[14.5px] font-medium text-tg-text tracking-tight">
      {icon}
      <span>{title}</span>
    </h3>
    <div className="text-[12.5px] sm:text-[13px] leading-relaxed text-tg-hint">
      {children}
    </div>
  </div>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <b className="font-semibold text-tg-text">{children}</b>
);

const iconProps = { size: 16, strokeWidth: 1.8 } as const;

interface DollarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  rot: number;
  vRot: number;
  color: string;
  isDollar: boolean;
}

export function Loans() {
  const { user, patchUser, refreshUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Phone verification state & robust local persistence
  const [localVerified, setLocalVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tonflame_phone_verified') === 'true';
    } catch {
      return false;
    }
  });

  const isPhoneVerified = Boolean(user?.phoneVerified) || localVerified;
  const [currentStep, setCurrentStep] = useState<'overview' | 'verification'>('overview');

  // Terms agreement checkbox
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // Active loans from Firestore
  const [activeLoans, setActiveLoans] = useState<LoanRecord[]>([]);

  // Loan calculator state (130% Collateral Ratio matching server)
  const [loanAmount, setLoanAmount] = useState<number>(100);
  const loanFeePercent = 1.8; // 1.8% fixed origination fee
  const calculatedFee = Number(((loanAmount * loanFeePercent) / 100).toFixed(2));
  const collateralRequired = Math.round(loanAmount * 1.30); // 130% collateral ($100 loan -> $130 collateral)

  const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  const [repayingLoanId, setRepayingLoanId] = useState<string | null>(null);

  const userBalance = Number(user?.balance || 0);
  const hasEnoughCollateral = userBalance >= collateralRequired;

  // 4K Loan Proof Certificate Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [previewImageKey, setPreviewImageKey] = useState<number>(Date.now());

  // Verification UI state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastExiting, setIsToastExiting] = useState<boolean>(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [badgeScale, setBadgeScale] = useState<boolean>(false);

  const triggerToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setIsToastExiting(false);
    setToastMessage(msg);

    toastTimeoutRef.current = setTimeout(() => {
      setIsToastExiting(true);
      setTimeout(() => {
        setToastMessage(null);
        setIsToastExiting(false);
      }, 300);
    }, 2600);
  }, []);

  // Canvas sparkle Dollar particles animation ref (Optimized ultra-lightweight)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<DollarParticle[]>([]);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);

  const PARTICLE_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#60A5FA', '#FFFFFF'];

  // Draw lightweight clean Dollar symbol / spark (No heavy shadowBlur)
  const drawDollarParticle = (
    ctx: CanvasRenderingContext2D,
    p: DollarParticle
  ) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
    ctx.fillStyle = p.color;

    if (p.isDollar) {
      ctx.font = `bold ${Math.round(p.size)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 0);
    } else {
      const s = p.size * 0.45;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  };

  // Trigger burst of snappy, lightweight Dollars ($) on click
  const triggerDollarBurst = useCallback((count = 18) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / (2 * (window.devicePixelRatio || 1));
    const cy = canvas.height / (2 * (window.devicePixelRatio || 1));

    setBadgeScale(true);
    setTimeout(() => setBadgeScale(false), 140);
    triggerHaptic('light');

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 3.6;
      const dist = 24 + Math.random() * 18;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

      particlesRef.current.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        size: 10 + Math.random() * 8,
        alpha: 0,
        maxAlpha: 0.9,
        life: 0,
        maxLife: 32 + Math.random() * 20,
        rot: (Math.random() - 0.5) * 0.4,
        vRot: (Math.random() - 0.5) * 0.06,
        color,
        isDollar: Math.random() > 0.35
      });
    }
  }, []);

  // Ambient & click particles loop (Smooth, gentle auto-flow from behind the square)
  useEffect(() => {
    if (currentStep !== 'verification') return;

    const canvas = canvasRef.current;
    const container = heroContainerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // Automatically spawn gentle particles emerging from behind the blue square
      if (frameCount % 20 === 0 && particlesRef.current.length < 18) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.35 + Math.random() * 0.65;
        const dist = 24 + Math.random() * 14;
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

        particlesRef.current.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.25,
          size: 8 + Math.random() * 7,
          alpha: 0,
          maxAlpha: 0.75,
          life: 0,
          maxLife: 55 + Math.random() * 35,
          rot: (Math.random() - 0.5) * 0.3,
          vRot: (Math.random() - 0.5) * 0.03,
          color,
          isDollar: Math.random() > 0.4
        });
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        p.life++;

        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * p.maxAlpha;
        } else {
          p.alpha = Math.max(0, (1 - (p.life - halfLife) / halfLife) * p.maxAlpha);
        }

        drawDollarParticle(ctx, p);

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentStep]);

  // Subscribe to user active loans from Firestore
  useEffect(() => {
    if (!user?.id) return;
    try {
      const q = query(
        collection(db, 'loans'),
        where('userId', '==', user.id)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const list: LoanRecord[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as LoanRecord);
        });
        setActiveLoans(list);
      }, (err) => {
        console.warn("Loans listener fallback:", err);
      });
      return () => unsub();
    } catch {}
  }, [user?.id]);

  // Phone verification save with reliable instant fallback
  const savePhoneVerification = async (phone: string) => {
    setLocalVerified(true);
    try {
      localStorage.setItem('tonflame_phone_verified', 'true');
    } catch {}

    try {
      await patchUser({
        phoneVerified: true,
        phoneNumber: phone,
        phoneVerifiedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("User patch fallback:", err);
    }

    setIsVerifying(false);
    triggerToast('Phone number verified');
    triggerHaptic('medium');
  };

  const handleResetVerificationForDev = () => {
    setLocalVerified(false);
    try {
      localStorage.removeItem('tonflame_phone_verified');
    } catch {}
    try {
      patchUser({
        phoneVerified: false,
        phoneNumber: '',
        phoneVerifiedAt: ''
      });
    } catch {}
    triggerToast('Verification reset for testing');
    triggerHaptic('selection');
  };

  const handleVerifyClick = async () => {
    triggerHaptic('medium');
    const tg = (window as any).Telegram?.WebApp;
    
    // Check if running inside real Telegram app with requestContact capability
    if (tg && typeof tg.requestContact === 'function' && tg.initData) {
      setIsVerifying(true);
      try {
        tg.requestContact((ok: boolean, response: any) => {
          if (ok && response?.responseUnsafe?.contact?.phone_number) {
            savePhoneVerification(response.responseUnsafe.contact.phone_number);
          } else {
            setIsVerifying(false);
            triggerToast('Verification cancelled');
          }
        });
      } catch {
        setIsVerifying(false);
        triggerToast('Could not open Telegram prompt');
      }
    } else {
      // Immediate instant mock verification for development & web testing
      setIsVerifying(true);
      setTimeout(async () => {
        const testPhone = '+1 (917) 555-0198';
        await savePhoneVerification(testPhone);
      }, 350);
    }
  };

  const handleApplyLoan = async () => {
    if (!user?.id || loanAmount <= 0) return;
    if (!hasEnoughCollateral) {
      navigate(`/deposit?amount=${collateralRequired}&title=Loan%20Collateral`);
      return;
    }

    setIsBorrowing(true);
    triggerHaptic('medium');
    try {
      const res = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          telegramId: user.telegramId,
          telegramUsername: user.telegramUsername,
          borrowAmount: loanAmount,
          collateralAmount: collateralRequired,
          collateralCoin: 'USDT'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerDollarBurst(28);
        triggerToast(`Loan Approved! +$${loanAmount} USDT credited.`);
        await refreshUser();
      } else {
        triggerToast(data.error || 'Failed to apply for loan');
      }
    } catch (e: any) {
      triggerToast(e.message || 'Error submitting loan application');
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleRepayLoan = async (loan: LoanRecord) => {
    if (!user?.id || loan.status !== 'active') return;
    const currentBal = Number(user?.balance || 0);
    if (currentBal < loan.borrowAmount) {
      triggerToast(`Insufficient balance to repay $${loan.borrowAmount.toFixed(2)} USDT.`);
      return;
    }

    setRepayingLoanId(loan.id);
    triggerHaptic('medium');
    try {
      const res = await fetch(`/api/loans/${loan.id}/repay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast(`Loan #${loan.txid || loan.id.slice(-6)} repaid! Collateral unlocked.`);
        await refreshUser();
      } else {
        triggerToast(data.error || 'Failed to repay loan');
      }
    } catch (e: any) {
      triggerToast(e.message || 'Error processing repayment');
    } finally {
      setRepayingLoanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text pb-36 pt-2 select-none font-sans relative" dir="ltr">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-out ${
          isToastExiting ? '-translate-y-3 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
        }`}>
          <div className="bg-tg-secondary border border-tg-separator shadow-lg py-2 px-3.5 rounded-full flex items-center gap-2 pointer-events-auto select-none">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-[12px] font-medium text-tg-text leading-none">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 space-y-4">

        {/* =========================================================================
            TOP SEGMENTED SWITCHER (Telegram UI Pill)
            ========================================================================= */}
        <div className="flex items-center justify-center p-1 bg-tg-secondary border border-tg-separator rounded-2xl">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setCurrentStep('overview');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border-0 ${
              currentStep === 'overview'
                ? 'bg-tg-bg text-tg-link shadow-sm'
                : 'text-tg-hint hover:text-tg-text'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('loans.termsTab', 'Terms & Levels')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setCurrentStep('verification');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border-0 ${
              currentStep === 'verification'
                ? 'bg-tg-bg text-tg-link shadow-sm'
                : 'text-tg-hint hover:text-tg-text'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('loans.facilityTab', 'Credit Facility')}</span>
          </button>
        </div>

        {/* =========================================================================
            VIEW 1: TELEGRAM-STYLE QUOTE LOAN TERMS
            ========================================================================= */}
        {currentStep === 'overview' && (
          <div className="w-full pb-2 font-light animate-in fade-in duration-200" dir="ltr">
            <header className="mx-1 mb-3">
              <h1 className="text-[18px] sm:text-[19px] font-medium tracking-[0.2px] text-tg-text">
                TonFlame Liquidity Facility
              </h1>
              <p className="mt-0.5 text-xs text-tg-hint">Terms &amp; Conditions</p>
            </header>

            {/* Big quote: terms 1–4 */}
            <Quote color={COLORS.blue} className="!py-[12px]">
              <Item
                icon={<Zap {...iconProps} color={COLORS.green} />}
                title="1. Instant Liquidity Allocation"
              >
                <p>
                  Borrow between <B>$100.00</B> and <B>$50,000.00 USDT</B> instantly
                  without traditional credit checks or KYC delays. Funds are credited
                  directly to your trading account in USDT (TRC20/BEP20) or TON,
                  allowing you to deploy capital immediately into real-time
                  cross-exchange arbitrage spreads.
                </p>
              </Item>

              <Item
                icon={<Percent {...iconProps} color={COLORS.blue} />}
                title="2. Fixed 1.80% Origination Fee"
              >
                <p>
                  Flat one-time facility fee of <B>1.80%</B>. No compounding daily
                  interest or hidden spread fees.
                </p>
                <p className="mt-1 text-[#8e8e93] text-[12px]">
                  Example: A $500.00 USDT facility requires exactly $9.00 USD
                  origination fee. You receive $500.00 in trading capital.
                </p>
              </Item>

              <Item
                icon={<Lock {...iconProps} color={COLORS.gold} />}
                title="3. 130% Collateral & Instant Release"
              >
                <p>
                  Secured by a <B>130%</B> collateral ratio in supported crypto (USDT,
                  TON, BTC, ETH). Your collateral is locked in isolated smart custody.
                  100% of your collateral is released and returned to your balance
                  automatically upon loan repayment.
                </p>
              </Item>

              <Item
                icon={<CalendarCheck {...iconProps} color={COLORS.purple} />}
                title="4. 30-Day Flexible Repayment"
              >
                <p>
                  Repay anytime within the <B>30-day</B> duration using accumulated
                  arbitrage profits or main balance. Zero prepayment penalties. Early
                  settlement unlocks instant facility re-borrowing and increases your
                  credit limits.
                </p>
              </Item>
            </Quote>

            {/* Small quote: term 5 */}
            <Quote color={COLORS.gold} className="mt-3">
              <Item
                icon={<ShieldCheck {...iconProps} color={COLORS.gold} />}
                title="5. Institutional Vault Security"
              >
                <p>
                  Non-rehypothecated asset custody. Dedicated risk desk support
                  available 24/7 via Telegram (<B>@ai_zke</B>).
                </p>
              </Item>
            </Quote>

            {/* Custom Interactive Agreement Checkbox & Action Button */}
            <div className="pt-3 space-y-2.5">
              <div 
                onClick={() => {
                  triggerHaptic('selection');
                  setTermsAccepted(!termsAccepted);
                }}
                className="p-3 rounded-xl bg-tg-secondary hover:bg-tg-bg active:scale-[0.99] flex items-center space-x-3 cursor-pointer select-none transition-all border border-tg-separator"
              >
                {/* Custom Telegram Squircle Checkbox */}
                <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-all duration-200 shrink-0 ${
                  termsAccepted 
                    ? 'bg-tg-button text-tg-button-text scale-100' 
                    : 'bg-tg-bg border border-tg-separator text-transparent scale-95'
                }`}>
                  <Check className={`w-3.5 h-3.5 stroke-[2.8] transition-transform duration-150 ${termsAccepted ? 'scale-100' : 'scale-0'}`} />
                </div>
                <span className="text-[12px] sm:text-[12.5px] text-tg-hint leading-snug">
                  I have reviewed and agree to the <b className="text-tg-text font-medium">1.80% facility fee</b> and <b className="text-tg-text font-medium">130% collateral terms</b>.
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setCurrentStep('verification');
                }}
                className="w-full py-3.5 rounded-[16px] bg-tg-button text-tg-button-text font-bold text-sm flex items-center justify-center space-x-2 hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer border-0 shadow-none"
              >
                <span>Continue to Credit Facility</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: CREDIT FACILITY DESK / VERIFICATION
            ========================================================================= */}
        {currentStep === 'verification' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* STAGE A: PHONE UNVERIFIED -> SHOW 3-STEP VERIFICATION TIMELINE & HERO BADGE */}
            {!isPhoneVerified ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 1. HERO INTERACTIVE DOLLAR BADGE ($) & SPARKLING CANVAS */}
                <div 
                  ref={heroContainerRef}
                  className="relative w-full pt-3 pb-1 flex flex-col items-center justify-center overflow-visible"
                >
                  <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  />

                  {/* Glowing Dollar Sign Badge ($) with Click Particle Burst */}
                  <div 
                    onClick={() => triggerDollarBurst(18)}
                    className={`relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-[24px] bg-tg-button text-tg-button-text flex items-center justify-center cursor-pointer transition-transform duration-150 shadow-md ${
                      badgeScale ? 'scale-90' : 'active:scale-95'
                    }`}
                    title="Tap to generate dollars"
                  >
                    <FaDollarIcon className="w-8 h-8 sm:w-9 sm:h-9 text-tg-button-text drop-shadow-md select-none" />
                  </div>

                  <div className="relative z-10 text-center mt-2.5">
                    <h2 className="text-[17px] font-bold text-tg-text tracking-tight">
                      {t('loans.creditLineVerification', 'Credit Line Verification')}
                    </h2>
                    <p className="text-xs text-tg-hint font-light mt-0.5">
                      Tap $ to generate floating dollar particles • Instant 1-click processing
                    </p>
                  </div>
                </div>

                {/* 2. CONNECTED 3-STEP TIMELINE */}
                <div className="bg-tg-secondary border border-tg-separator rounded-[24px] p-5">
                  <div className="relative">
                    
                    {/* Step 1: Telegram Mini App Session */}
                    <div className="relative flex items-start space-x-4 pb-7">
                      <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-tg-separator -translate-x-1/2" />
                      
                      <div className="relative z-10 w-10 h-10 rounded-full bg-tg-bg border border-tg-separator flex items-center justify-center shrink-0 text-tg-link overflow-hidden">
                        {user?.telegramUsername ? (
                          <span className="font-bold text-sm text-tg-link">
                            {user.telegramUsername.substring(0, 2).toUpperCase()}
                          </span>
                        ) : (
                          <UserIcon className="w-5 h-5 text-tg-link" />
                        )}
                      </div>

                      <div className="pt-2 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[14px] font-bold text-tg-text leading-tight">
                            {t('loans.telegramAccount', 'Telegram Account')}
                          </h3>
                          <span className="text-[11px] font-bold text-tg-link bg-tg-link/10 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>{t('loans.verified', 'Verified')}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: In-App Custodial Wallet Vault */}
                    <div className="relative flex items-start space-x-4 pb-7">
                      <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-tg-separator -translate-x-1/2" />

                      <div className="relative z-10 w-10 h-10 rounded-full bg-tg-bg border border-tg-separator flex items-center justify-center shrink-0 text-tg-link">
                        <FaWalletIcon className="w-4.5 h-4.5 text-tg-link" />
                      </div>

                      <div className="pt-2 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[14px] font-bold text-tg-text leading-tight">
                            {t('loans.inAppWallet', 'In-App Custodial Wallet')}
                          </h3>
                          <span className="text-[11px] font-bold text-tg-link bg-tg-link/10 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>{t('loans.active', 'Active')}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Phone Number Verification */}
                    <div className="relative flex items-start space-x-4 opacity-50">
                      <div className="relative z-10 w-10 h-10 rounded-full bg-tg-bg border border-tg-separator text-tg-hint flex items-center justify-center shrink-0">
                        <Phone className="w-4.5 h-4.5" />
                      </div>

                      <div className="pt-2 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[14px] font-bold leading-tight text-tg-hint">
                            {t('loans.phoneVerification', 'Phone Verification')}
                          </h3>
                          <span className="text-[11px] font-medium text-tg-hint bg-tg-bg px-2 py-0.5 rounded-full border border-tg-separator">
                            {t('loans.required', 'Required')}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Verification Action Button */}
                <button
                  type="button"
                  onClick={handleVerifyClick}
                  disabled={isVerifying}
                  className="w-full py-4 rounded-[18px] bg-tg-button text-tg-button-text font-bold text-sm flex items-center justify-center space-x-2 hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 border-0 shadow-none"
                >
                  <Phone className="w-4 h-4" />
                  <span>
                    {isVerifying ? t('loans.verifying', 'Verifying...') : t('loans.verifyPhoneBtn', 'Verify Phone Number')}
                  </span>
                </button>
              </div>
            ) : (
              /* STAGE B: PHONE VERIFIED */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-250">
                
                {/* Verified Header Status Banner */}
                <div className="w-full py-2.5 px-4 rounded-xl bg-tg-secondary border border-tg-separator text-emerald-400 text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                    <span>{t('loans.accountVerifiedReady', 'Instant Credit Facility • Active & Ready')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetVerificationForDev}
                    className="text-[10px] text-tg-hint hover:text-tg-text underline cursor-pointer"
                    title="Reset verification for testing"
                  >
                    Reset Test
                  </button>
                </div>

                {/* Minimalist Loan Desk Card */}
                <div className="bg-tg-secondary border border-tg-separator rounded-[24px] p-5 space-y-4 text-left">
                  <div className="flex justify-between items-center text-xs text-tg-hint">
                    <span className="font-mono uppercase font-bold text-[11px] tracking-wider text-tg-hint">
                      {t('loans.loanRequestAmount', 'Loan Request Amount')}
                    </span>
                    <span className="text-tg-link font-bold font-mono tabular-nums">
                      {loanFeePercent}% Fixed Fee
                    </span>
                  </div>

                  {/* Official @telegram-apps/telegram-ui Input */}
                  <div className="rounded-2xl overflow-hidden bg-tg-bg border border-tg-separator">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={loanAmount > 0 ? String(loanAmount) : ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setLoanAmount(isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      after={
                        <div className="flex items-center space-x-1.5 pr-3 text-tg-text font-mono font-bold text-sm">
                          <span className="text-tg-link font-bold">USDT</span>
                        </div>
                      }
                      className="border-0 bg-transparent text-tg-text font-mono font-bold text-xl"
                    />
                  </div>

                  {/* Quick Amount Selector Chips */}
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          triggerHaptic('selection');
                          setLoanAmount(amt);
                        }}
                        className={`py-2.5 rounded-xl text-xs font-mono tabular-nums font-bold transition-all cursor-pointer border ${
                          loanAmount === amt
                            ? 'bg-tg-button text-tg-button-text border-transparent shadow-sm'
                            : 'bg-tg-bg text-tg-hint border-tg-separator hover:text-tg-text'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {/* 130% Matrix */}
                  <div className="bg-tg-bg border border-tg-separator rounded-2xl p-3.5 space-y-2 text-xs font-mono tabular-nums">
                    <div className="flex justify-between items-center text-tg-hint">
                      <span>Loan Liquidity:</span>
                      <span className="text-tg-text font-extrabold">${loanAmount}.00 USDT</span>
                    </div>
                    <div className="flex justify-between items-center text-tg-hint">
                      <span>Facility Fee ({loanFeePercent}%):</span>
                      <span className="text-tg-link font-bold">${calculatedFee} USD</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-tg-separator">
                      <span className="text-tg-hint font-medium">{t('loans.collateralRequired', 'Required Collateral (130%):')}</span>
                      <span className="text-emerald-400 font-extrabold text-sm">${collateralRequired}.00 USDT</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-tg-hint">
                      <span>Your Balance:</span>
                      <span className={hasEnoughCollateral ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                        ${userBalance.toFixed(2)} USDT {hasEnoughCollateral ? '(Sufficient)' : '(Deposit needed)'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic CTA */}
                  {hasEnoughCollateral ? (
                    <button
                      type="button"
                      disabled={loanAmount <= 0 || isBorrowing}
                      onClick={handleApplyLoan}
                      className="w-full py-4 rounded-[18px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 border-0 shadow-sm"
                    >
                      {isBorrowing ? (
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 text-white" />
                      )}
                      <span>
                        {isBorrowing 
                          ? 'Processing Loan Application...' 
                          : `Instant Borrow $${loanAmount} USDT (Collateral Ready)`}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={loanAmount <= 0}
                      onClick={() => navigate(`/deposit?amount=${collateralRequired}&title=Loan%20Collateral`)}
                      className="w-full py-4 rounded-[18px] bg-tg-button hover:opacity-90 text-tg-button-text font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 border-0 shadow-none"
                    >
                      <FaWalletIcon className="w-4 h-4 text-tg-button-text" />
                      <span>
                        {loanAmount > 0 
                          ? `Deposit $${collateralRequired} Collateral & Get $${loanAmount}` 
                          : 'Enter Loan Amount'}
                      </span>
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* 3. ACTIVE LOANS SECTION */}
            {activeLoans.length > 0 && (
              <div className="bg-tg-secondary border border-tg-separator rounded-[24px] p-4.5 space-y-3">
                <h3 className="text-xs font-bold text-tg-hint uppercase tracking-wider font-mono">
                  {t('loans.activeLoans', 'Active Loans')}
                </h3>
                <div className="divide-y divide-tg-separator">
                  {activeLoans.map((loan) => (
                    <div 
                      key={loan.id} 
                      className="py-3 flex justify-between items-center text-xs font-mono tabular-nums"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-tg-text">${loan.borrowAmount.toFixed(2)} USDT</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            loan.status === 'active' ? 'bg-tg-link/15 text-tg-link' : 'bg-emerald-500/15 text-emerald-400'
                          }`}>
                            {loan.status === 'active' ? t('loans.active', 'Active') : t('loans.repaid', 'Repaid')}
                          </span>
                        </div>
                        <p className="text-[11px] text-tg-hint mt-0.5">
                          Collateral: ${loan.collateralAmount.toFixed(2)} USD • Tx: {loan.txid || 'TONFLAME-LN'}
                        </p>
                      </div>

                      <div>
                        {loan.status === 'active' ? (
                          <button
                            type="button"
                            disabled={repayingLoanId === loan.id}
                            onClick={() => handleRepayLoan(loan)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer border border-emerald-500/30 active:scale-95 disabled:opacity-50"
                          >
                            {repayingLoanId === loan.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            <span>Repay</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-tg-hint">
                            Settled
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. 4K LIVE LOAN SETTLEMENT CERTIFICATE INSPECTOR (FOR DEV / TESTING) */}
            <div className="bg-tg-secondary rounded-[24px] p-4.5 border border-tg-separator space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-tg-link/15 flex items-center justify-center text-tg-link shrink-0">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-tg-text">🖼️ نمونه سند واریزی ۴K کانال (تست کیفیت)</h4>
                    <p className="text-[10.5px] text-tg-hint">سند واریزی رندر شده توسط موتور Node.js جهت ارسال به کانال</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3.5 py-1.5 bg-tg-button hover:opacity-90 text-tg-button-text text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>مشاهده نمونه ۴K</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 4K FULLSCREEN LOAN CERTIFICATE PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="bg-tg-secondary rounded-[28px] p-5 w-full max-w-2xl border border-tg-separator shadow-2xl relative space-y-4 text-tg-text">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-tg-link/15 flex items-center justify-center text-tg-link">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-tg-text">سند واریزی وام کریپتو (4K Vector Receipt)</h3>
                  <p className="text-[11px] text-tg-link font-mono">TONFLAME LENDING PROTOCOL • LIVE ON-CHAIN SETTLEMENT</p>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-tg-bg border border-tg-separator text-tg-hint hover:text-tg-text flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-Res Image Container */}
            <div className="rounded-2xl overflow-hidden bg-tg-bg border border-tg-separator p-2 flex items-center justify-center shadow-inner">
              <img
                src={`/api/channel/preview-receipt?t=${previewImageKey}`}
                alt="4K Loan Disbursement Certificate"
                className="w-full h-auto max-h-[380px] object-contain rounded-xl"
              />
            </div>

            {/* Modal Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-tg-separator text-xs">
              <span className="text-[11px] text-tg-hint text-center sm:text-left">
                تولیدشده توسط موتور Node.js با رزولوشن بالا و آماده درج خودکار در کانال.
              </span>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewImageKey(Date.now())}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-tg-bg border border-tg-separator hover:bg-tg-bg/80 text-tg-text font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>سند تصادفی جدید</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-tg-button hover:opacity-90 text-tg-button-text font-bold rounded-xl transition-all active:scale-95"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

