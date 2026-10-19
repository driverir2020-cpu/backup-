import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Transaction, Investment, UserData, DepositRecord } from '../types';
import { subscribeTransactions, subscribeDeposits, submitWithdrawal } from '../services/systemService';
import { SUPPORTED_COINS, CryptoCoin } from '../data/cryptoAssets';
import { CryptoIcon } from '../components/CryptoIcon';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { CoinDetailView } from '../components/CoinDetailView';
import { fetchLiveCryptoRatesAndChanges, FALLBACK_RATES } from '../utils/cryptoRates';
import { preloadTopCoinsMarketData } from '../services/coinMarketService';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Copy, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Zap,
  Clock,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  SlidersHorizontal,
  ArrowLeftRight,
  Sparkles,
  ChevronDown,
  Info,
  TrendingUp,
  TrendingDown,
  Wallet,
  Check,
  AlertCircle,
  AlertTriangle,
  ScanLine,
  Gift,
  Coins,
  Lock,
  KeyRound
} from 'lucide-react';
import { FaGiftIcon, FaDollarIcon } from '../components/CustomIcons';

import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';
import { DepositModal } from '../components/DepositModal';
import { WithdrawModal } from '../components/WithdrawModal';
import { SwipeToConfirm } from '../components/SwipeToConfirm';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { WalletPinLock } from '../components/WalletPinLock';
import { AssetsBannerSlider } from '../components/AssetsBannerSlider';
import { StoryReferralModal } from '../components/StoryReferralModal';
import { TransactionDetailScreen } from '../components/TransactionDetailScreen';
import { 
  isWalletPinSet, 
  isWalletUnlockedInSession, 
  setWalletSessionUnlocked, 
  removeWalletPin 
} from '../utils/walletSecurity';

const DEFAULT_PREVIEW_USER: UserData = {
  id: 'guest_user',
  telegramId: 84920412,
  telegramUsername: 'guest_trader',
  balance: 0.00,
  bonusBalance: 5.00,
  cryptoBalances: {
    USDT: 0.00,
    TON: 0.00,
    BTC: 0.00,
    ETH: 0.00
  },
  role: 'user',
  createdAt: Date.now(),
};

type AssetFilter = 'all' | 'holdings' | 'l1' | 'stable';

interface CoinRowProps {
  coin: CryptoCoin;
  amount: number;
  rate: number;
  usdVal: number;
  pct: string;
  isPos: boolean;
  showBalance: boolean;
  isFa: boolean;
  hasApprovedDeposit?: boolean;
  onSelect: () => void;
}

const CoinRow: React.FC<CoinRowProps> = ({
  coin,
  amount,
  rate,
  usdVal,
  pct,
  isPos,
  showBalance,
  isFa,
  hasApprovedDeposit,
  onSelect,
}) => {
  return (
    <div
      key={coin.id}
      className="relative flex items-center justify-between px-4 py-3.5 hover:bg-tg-bg/40 active:bg-tg-bg/70 transition-colors select-none group cursor-pointer outline-none ring-0 border-0"
      onClick={onSelect}
    >
      {/* Left: Coin Icon & Name/Network */}
      <div className="flex items-center space-x-3.5 rtl:space-x-reverse min-w-0">
        <div className="relative shrink-0">
          <CryptoIcon symbol={coin.symbol} network={coin.subBadge} className="w-10 h-10 rounded-full" />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span className="text-[15px] font-bold text-tg-text tracking-tight leading-snug truncate max-w-[130px] sm:max-w-[180px]">
              {coin.name}
            </span>
            {/* Official Telegram Verified Blue Tick Badge */}
            <VerifiedBadge className="w-3.5 h-3.5" />
            <span className="text-[11.5px] font-semibold text-tg-hint tracking-tight">
              {coin.symbol}
            </span>
            {coin.subBadge && (
              <span className="px-1.5 py-0.5 bg-tg-bg text-tg-hint border border-tg-separator text-[10px] font-semibold rounded-md leading-none">
                {coin.subBadge}
              </span>
            )}
            {hasApprovedDeposit && (
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md leading-none flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Deposited</span>
              </span>
            )}
            {coin.tag && (
              <span className="px-1.5 py-0.5 bg-emerald-950/40 text-emerald-400 text-[10px] font-bold rounded-md leading-none">
                {coin.tag}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse mt-0.5">
            <span className="text-[12.5px] text-tg-hint font-medium leading-none">
              ${rate >= 1 ? (rate === 1 ? '1' : rate < 10 ? rate.toFixed(2) : rate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })) : rate.toFixed(4)}
            </span>
            <span className={`text-[12px] font-semibold leading-none ${isPos ? 'text-emerald-400' : pct === '0.00%' ? 'text-tg-hint' : 'text-rose-400'}`}>
              {pct}
            </span>
          </div>
        </div>
      </div>

      {/* Right: USD Amount (Top) & Crypto Amount (Bottom) */}
      <div className="flex items-center space-x-2.5 rtl:space-x-reverse shrink-0">
        <div className={`flex flex-col items-end justify-center transition-all duration-300 ${
          showBalance ? 'blur-0 opacity-100' : 'blur-[7px] opacity-35 select-none pointer-events-none'
        }`}>
          <span className="text-[15px] font-bold text-tg-text tracking-tight leading-snug">
            ${usdVal >= 1000 ? usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 }) : usdVal.toFixed(usdVal < 1 ? 2 : 2)}
          </span>
          <span className="text-[12.5px] text-tg-hint font-semibold leading-tight mt-0.5">
            {amount > 0 ? (amount >= 1000 ? amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) : amount.toFixed(amount < 1 ? 4 : 2)) : '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export function Assets() {
  const { user, refreshUser } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeUser = user || DEFAULT_PREVIEW_USER;

  // Session-based wallet passcode lock state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isWalletUnlockedInSession());
  const [isPinActive, setIsPinActive] = useState<boolean>(() => isWalletPinSet());
  const [isSetupPinOpen, setIsSetupPinOpen] = useState<boolean>(false);
  const [isSecuritySettingsOpen, setIsSecuritySettingsOpen] = useState<boolean>(false);

  // Live Exchange Rates
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  // UI States
  const [showBalance, setShowBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('cryptoapp_show_balance');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cryptoapp_show_balance', String(showBalance));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [showBalance]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<AssetFilter>('all');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedCoinForDetail, setSelectedCoinForDetail] = useState<CryptoCoin | null>(null);

  // Action Modals: 'withdraw' | 'swap' | 'transfer'
  const [modalType, setModalType] = useState<'withdraw' | 'swap' | 'transfer' | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [withdrawCoin, setWithdrawCoin] = useState<string>('USDT');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedWithdrawal, setConfirmedWithdrawal] = useState<{ amount: number; coin: string; address: string } | null>(null);
  const [withdrawWarning, setWithdrawWarning] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isConfirmWithdrawWithPinOpen, setIsConfirmWithdrawWithPinOpen] = useState(false);
  const [pendingWithdrawData, setPendingWithdrawData] = useState<{ amt: number; usdVal: number } | null>(null);

  // Swap State
  const [swapFromCoin, setSwapFromCoin] = useState('USDT');
  const [swapToCoin, setSwapToCoin] = useState('TON');
  const [swapAmount, setSwapAmount] = useState('');

  // Tab State - dynamically read from query params or location state
  const initialTab = (searchParams.get('tab') as 'crypto' | 'history') || 
                     (location.state as any)?.activeTab || 
                     'crypto';
  const [activeTab, setActiveTab] = useState<'crypto' | 'history'>(initialTab);

  // Sync tab if URL param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'history' || tabParam === 'crypto') {
      setActiveTab(tabParam);
    } else if ((location.state as any)?.activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [searchParams, location.state]);

  // Measure Carousel Viewport for 1:1 Physical Touch & Mouse Dragging
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.offsetWidth);
      } else if (typeof window !== 'undefined') {
        setCarouselWidth(window.innerWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Zero-overhead GPU transform ref-based swipe controller (0 React renders during touchmove)
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const isDraggingRef = useRef(false);
  const currentDragOffsetRef = useRef(0);

  const updateTrackTransform = (offsetPx: number, animated: boolean) => {
    if (!trackRef.current) return;
    const basePercent = activeTab === 'crypto' ? 0 : -50;
    trackRef.current.style.transition = animated ? 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
    trackRef.current.style.willChange = animated ? 'auto' : 'transform';
    if (offsetPx === 0) {
      trackRef.current.style.transform = `translateX(${basePercent}%)`;
    } else {
      trackRef.current.style.transform = `translateX(calc(${basePercent}% + ${offsetPx}px))`;
    }
  };

  useEffect(() => {
    updateTrackTransform(0, true);
  }, [activeTab]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    isHorizontalSwipeRef.current = null;
    isDraggingRef.current = false;
    currentDragOffsetRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;

    // Detect gesture intent during the first 6-8px of movement
    if (isHorizontalSwipeRef.current === null) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (absX > 6 || absY > 6) {
        if (absX >= absY) {
          // Horizontal swipe detected
          isHorizontalSwipeRef.current = true;
          isDraggingRef.current = true;
          if (trackRef.current) trackRef.current.style.pointerEvents = 'none';
        } else {
          // Vertical page scroll detected -> cancel swipe tracking to let page scroll freely
          isHorizontalSwipeRef.current = false;
          touchStartRef.current = null;
          return;
        }
      } else {
        return;
      }
    }

    if (!isHorizontalSwipeRef.current) return;

    // Apply smooth rubber-band resistance when pulling past the edges
    let effectiveOffset = deltaX;
    if (activeTab === 'crypto' && deltaX > 0) {
      effectiveOffset = deltaX * 0.22;
    } else if (activeTab === 'history' && deltaX < 0) {
      effectiveOffset = deltaX * 0.22;
    }

    currentDragOffsetRef.current = effectiveOffset;
    // Direct 120fps GPU transform with ZERO React component re-renders!
    updateTrackTransform(effectiveOffset, false);
  };

  const handleTouchEnd = () => {
    if (trackRef.current) trackRef.current.style.pointerEvents = '';
    if (!touchStartRef.current || !isHorizontalSwipeRef.current) {
      touchStartRef.current = null;
      isHorizontalSwipeRef.current = null;
      isDraggingRef.current = false;
      currentDragOffsetRef.current = 0;
      updateTrackTransform(0, true);
      return;
    }

    const elapsed = Math.max(1, Date.now() - touchStartRef.current.time);
    const dragOffset = currentDragOffsetRef.current;
    const velocity = Math.abs(dragOffset) / elapsed; // px per ms
    const distanceThreshold = 28;
    const velocityThreshold = 0.22;

    const isSwipeLeft = dragOffset < -distanceThreshold || (dragOffset < -12 && velocity > velocityThreshold);
    const isSwipeRight = dragOffset > distanceThreshold || (dragOffset > 12 && velocity > velocityThreshold);

    if (activeTab === 'crypto' && isSwipeLeft) {
      triggerHaptic('selection');
      setActiveTab('history');
    } else if (activeTab === 'history' && isSwipeRight) {
      triggerHaptic('selection');
      setActiveTab('crypto');
    } else {
      updateTrackTransform(0, true);
    }

    touchStartRef.current = null;
    isHorizontalSwipeRef.current = null;
    isDraggingRef.current = false;
    currentDragOffsetRef.current = 0;
  };

  const handleTouchCancel = () => {
    if (trackRef.current) trackRef.current.style.pointerEvents = '';
    touchStartRef.current = null;
    isHorizontalSwipeRef.current = null;
    isDraggingRef.current = false;
    currentDragOffsetRef.current = 0;
    updateTrackTransform(0, true);
  };

  // Firestore Live Transactions & Investments
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [historyTab, setHistoryTab] = useState<'all' | 'deposit' | 'withdrawal' | 'bonus'>('all');
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live 24h market price change percentages from Binance API
  const [liveChanges24h, setLiveChanges24h] = useState<Record<string, string>>({
    STARS: '+1.40%',
    USDT: '0.00%',
    USDE: '0.00%',
    USDC: '0.00%',
    BTC: '+0.00%',
    ETH: '+0.00%',
    TON: '+0.00%',
    SOL: '+0.00%',
    BNB: '+0.00%',
    TRX: '+0.00%',
    DOGE: '+0.00%',
    NOT: '+0.00%',
    SUI: '+0.00%',
    XRP: '+0.00%',
    BCH: '+0.00%',
    MATIC: '+0.00%',
  });

  // Fetch Live Real Crypto Prices and 24h Percentages from API for All Coins
  const loadRates = async () => {
    setIsRefreshingRates(true);
    try {
      const { rates: live, changes } = await fetchLiveCryptoRatesAndChanges();
      setRates(live);
      if (changes && Object.keys(changes).length > 0) {
        setLiveChanges24h(prev => ({ ...prev, ...changes }));
      }
    } catch {
      // Keep fallback
    } finally {
      setIsRefreshingRates(false);
    }
  };

  useEffect(() => {
    loadRates();
    preloadTopCoinsMarketData();
    const interval = setInterval(loadRates, 20000);
    return () => clearInterval(interval);
  }, []);

  // Listen to Real-Time Transactions, Deposits & Investments across API & Firestore
  useEffect(() => {
    const currentUserId = user?.id;
    const currentTgId = user?.telegramId;
    const currentTgUser = user?.telegramUsername;

    let serverTxs: Transaction[] = [];
    let serverDeps: DepositRecord[] = [];

    const isMatch = (itemUserId?: string, itemTgId?: string | number, itemTgUsername?: string) => {
      if (!currentUserId) return false;
      if (currentUserId === 'guest_user') {
        return itemUserId === 'guest_user';
      }
      if (itemUserId && String(itemUserId) === String(currentUserId)) return true;
      if (currentTgId && itemTgId && String(itemTgId) === String(currentTgId)) return true;
      if (currentTgUser && itemTgUsername && String(itemTgUsername).toLowerCase() === String(currentTgUser).toLowerCase()) return true;
      return false;
    };

    const updateCombined = () => {
      const mergedList: Transaction[] = [...serverTxs];
      const existingTxIds = new Set(serverTxs.map(t => t.id));
      const existingTxHashes = new Set(serverTxs.map(t => t.txid).filter(Boolean));

      // Merge deposits as transactions if not already in list
      serverDeps.forEach(dep => {
        if (!existingTxIds.has(dep.id) && (!dep.txid || !existingTxHashes.has(dep.txid))) {
          mergedList.push({
            id: dep.id,
            userId: dep.userId,
            telegramUsername: dep.telegramUsername,
            telegramId: dep.telegramId,
            type: 'deposit',
            amount: Number(dep.usdAmount || 0),
            cryptoAmount: String(dep.cryptoAmount || dep.usdAmount || '0'),
            currency: (dep.coin || 'USDT').toUpperCase(),
            network: dep.network || 'Mainnet',
            txid: dep.txid,
            status: dep.status === 'approved' ? 'completed' : dep.status === 'rejected' ? 'rejected' : 'pending',
            createdAt: dep.timestamp || dep.createdAt || Date.now(),
            note: dep.fromBot ? `Deposit for ${dep.botName || 'Arbitrage Bot'}` : `Crypto deposit (${dep.coin || 'USDT'})`
          });
        }
      });

      const userOnly = mergedList.filter(t => isMatch(t.userId, t.telegramId, t.telegramUsername));
      userOnly.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setTransactions(userOnly);
    };

    const unsubTxs = subscribeTransactions((txList) => {
      serverTxs = txList;
      updateCombined();
    });

    const unsubDeps = subscribeDeposits((depList) => {
      serverDeps = depList;
      updateCombined();
    });

    let unsubInv = () => {};
    if (user && user.id !== 'guest_user') {
      try {
        const qInv = query(collection(db, 'investments'), where('userId', '==', user.id));
        unsubInv = onSnapshot(qInv, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
          setInvestments(data.sort((a, b) => b.createdAt - a.createdAt));
        }, (err) => console.warn("Inv listener:", err));
      } catch (e) {
        console.warn("Investments listener fallback:", e);
      }
    }

    return () => {
      unsubTxs();
      unsubDeps();
      unsubInv();
    };
  }, [user]);

  // Compute exact balances per coin
  const userCryptoBalances = useMemo(() => {
    const raw = activeUser.cryptoBalances || {};
    const res: Record<string, number> = { ...raw };

    // Default USDT allocation if only general balance exists
    if (res['USDT'] === undefined && (activeUser.balance || 0) > 0) {
      res['USDT'] = activeUser.balance;
    }
    return res;
  }, [activeUser.cryptoBalances, activeUser.balance]);

  // Compute Crypto Portfolio Value in USD
  const totalCryptoUsd = useMemo(() => {
    let total = 0;
    SUPPORTED_COINS.forEach(c => {
      const amount = userCryptoBalances[c.symbol] || 0;
      const rate = rates[c.symbol] || FALLBACK_RATES[c.symbol] || (c.symbol === 'USDT' ? 1 : 0);
      total += amount * rate;
    });
    return total;
  }, [userCryptoBalances, rates]);

  // Selected Tab Balance in USD
  const activeTabBalanceUsd = useMemo(() => {
    return totalCryptoUsd;
  }, [totalCryptoUsd]);

  // Splitting balance for display
  const balanceInt = Math.floor(activeTabBalanceUsd);
  const balanceDec = (activeTabBalanceUsd % 1).toFixed(2).substring(2) || '00';

  // Compute Deposit Info Map per currency
  const coinDepositInfo = useMemo(() => {
    const map: Record<string, { hasApprovedDeposit: boolean; latestApprovedTime: number; totalDepositedUsd: number }> = {};
    
    transactions.forEach(t => {
      if (t.type === 'deposit' && (t.status === 'completed' || t.status === 'approved')) {
        const coin = (t.currency || 'USDT').toUpperCase();
        if (!map[coin]) {
          map[coin] = { hasApprovedDeposit: true, latestApprovedTime: t.createdAt || 0, totalDepositedUsd: t.amount || 0 };
        } else {
          map[coin].hasApprovedDeposit = true;
          map[coin].latestApprovedTime = Math.max(map[coin].latestApprovedTime, t.createdAt || 0);
          map[coin].totalDepositedUsd += t.amount || 0;
        }
      }
    });

    return map;
  }, [transactions]);

  // Allowed coins for withdrawal (only deposited coins or coins with active positive balance)
  const allowedWithdrawCoins = useMemo(() => {
    const deposited = Object.keys(coinDepositInfo).filter(c => coinDepositInfo[c]?.hasApprovedDeposit);
    const positiveBal = SUPPORTED_COINS.filter(c => (userCryptoBalances[c.symbol] || 0) > 0.000001).map(c => c.symbol);
    const combined = Array.from(new Set([...deposited, ...positiveBal]));
    return combined.length > 0 ? combined : ['USDT'];
  }, [coinDepositInfo, userCryptoBalances]);

  // Auto-detected network from deposit record (Not random, matched to deposit)
  const userDepositNetwork = useMemo(() => {
    const dep = transactions.find(t => 
      t.type === 'deposit' && 
      (t.status === 'completed' || t.status === 'approved') && 
      (t.currency || 'USDT').toUpperCase() === withdrawCoin.toUpperCase()
    );
    if (dep?.network) return dep.network;
    if (withdrawCoin === 'TON') return 'TON';
    if (withdrawCoin === 'BTC') return 'BTC';
    if (withdrawCoin === 'ETH') return 'ERC20';
    if (withdrawCoin === 'SOL') return 'Solana';
    return 'TRC20';
  }, [transactions, withdrawCoin]);

  // Coins with positive available balance
  const userCoinsWithBalance = useMemo(() => {
    return SUPPORTED_COINS.filter(c => (userCryptoBalances[c.symbol] || 0) > 0.000001);
  }, [userCryptoBalances]);

  // Filtered & Deposit-Sorted Coins
  const filteredCoins = useMemo(() => {
    let list = [...SUPPORTED_COINS];

    if (filterType === 'holdings') {
      list = list.filter(c => (userCryptoBalances[c.symbol] || 0) > 0.000001);
    } else if (filterType === 'l1') {
      list = list.filter(c => ['BTC', 'ETH', 'SOL', 'TON', 'BNB', 'TRX', 'DOGE', 'SUI', 'MATIC'].includes(c.symbol));
    } else if (filterType === 'stable') {
      list = list.filter(c => ['USDT', 'USDC'].includes(c.symbol));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.symbol.toLowerCase().includes(q)
      );
    }

    // Sort coins: Most recently deposited coins ALWAYS float straight to the top (#1)!
    list.sort((a, b) => {
      const depA = coinDepositInfo[a.symbol];
      const depB = coinDepositInfo[b.symbol];
      const timeA = depA?.latestApprovedTime || 0;
      const timeB = depB?.latestApprovedTime || 0;

      if (timeA > 0 || timeB > 0) {
        return timeB - timeA;
      }

      const balA = userCryptoBalances[a.symbol] || 0;
      const balB = userCryptoBalances[b.symbol] || 0;
      if (balA > 0 || balB > 0) {
        const valA = balA * (rates[a.symbol] || FALLBACK_RATES[a.symbol] || 1);
        const valB = balB * (rates[b.symbol] || FALLBACK_RATES[b.symbol] || 1);
        return valB - valA;
      }

      return 0;
    });

    return list;
  }, [filterType, searchQuery, userCryptoBalances, coinDepositInfo, rates]);

  const orderedCoins = filteredCoins;

  // Number of positive holdings
  const nonZeroHoldingsCount = useMemo(() => {
    return SUPPORTED_COINS.filter(c => (userCryptoBalances[c.symbol] || 0) > 0.000001).length;
  }, [userCryptoBalances]);

  // Handle Withdrawal Submission with Strict Balance Verification
  const handleWithdrawSubmit = (): boolean => {
    setWithdrawWarning(null);

    // Check 24h withdrawal lock
    if (activeUser.withdrawalLockUntil && Date.now() < activeUser.withdrawalLockUntil) {
      const remainingMs = activeUser.withdrawalLockUntil - Date.now();
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const lockMsg = t('withdraw.lockActiveMsg', '24h withdrawal lock is active ({{hours}}h {{mins}}m remaining).', { hours, mins });
      setWithdrawWarning(lockMsg);
      return false;
    }

    const availableAmt = userCryptoBalances[withdrawCoin] || 0;
    const amt = parseFloat(withdrawAmount);

    // 1. Strict Balance Check: If no balance or entered amount exceeds balance -> Yellow Warning & Fast Kick Out!
    if (availableAmt <= 0 || isNaN(amt) || amt <= 0 || amt > availableAmt) {
      const msg = availableAmt <= 0
        ? t('withdraw.noBalanceMsg', 'No balance available for {{coin}} withdrawal.', { coin: withdrawCoin })
        : t('withdraw.insufficientBalanceMsg', 'Insufficient balance! Available: {{avail}} {{coin}}', { avail: availableAmt.toFixed(4), coin: withdrawCoin });
      
      setWithdrawWarning(msg);
      triggerToast(msg);

      // Fast eject from modal after 1.2s yellow alert feedback
      setTimeout(() => {
        setModalType(null);
        setWithdrawWarning(null);
      }, 1200);

      return false; // Prevents SwipeToConfirm from displaying green success
    }

    if (!recipientAddress.trim() || recipientAddress.trim().length < 8) {
      const msg = t('withdraw.enterValidAddress', 'Please enter a valid wallet address.');
      setWithdrawWarning(msg);
      return false;
    }

    const coinRate = rates[withdrawCoin] || FALLBACK_RATES[withdrawCoin] || 1;
    const usdVal = parseFloat((amt * coinRate).toFixed(2));

    // If PIN protection is active, require 4-digit PIN verification before sending
    if (isPinActive) {
      setPendingWithdrawData({ amt, usdVal });
      setIsConfirmWithdrawWithPinOpen(true);
      return true;
    }

    // Otherwise submit directly
    doExecuteWithdrawal(amt, usdVal);
    return true;
  };

  const doExecuteWithdrawal = (amt: number, usdVal: number) => {
    setIsProcessing(true);
    submitWithdrawal({
      userId: activeUser.id,
      telegramUsername: activeUser.telegramUsername || '',
      telegramId: activeUser.telegramId || '',
      amount: usdVal,
      currency: withdrawCoin,
      network: userDepositNetwork,
      recipient: recipientAddress.trim()
    }).then(res => {
      setIsProcessing(false);
      if (res.success) {
        setConfirmedWithdrawal({
          amount: amt,
          coin: withdrawCoin,
          address: recipientAddress.trim()
        });
        setWithdrawAmount('');
        setRecipientAddress('');
      } else {
        setWithdrawWarning(res.message || t('withdraw.submitFailed', 'Failed to submit withdrawal request.'));
      }
    }).catch((e: any) => {
      setIsProcessing(false);
      setWithdrawWarning(e.message || t('withdraw.networkError', 'Network connection error.'));
    });
  };

  // Filtered Transaction History
  const filteredTransactions = useMemo(() => {
    if (historyTab === 'all') return transactions;
    return transactions.filter(t => t.type === historyTab);
  }, [transactions, historyTab]);

  // -------------------------------------------------------------------------
  // PASSCODE LOCK SCREEN GUARD
  // If the wallet is protected by PIN and not unlocked in this session,
  // render ONLY the Passcode screen directly.
  // This guarantees ZERO flash of underlying content (balance, tokens, transactions)!
  // -------------------------------------------------------------------------
  if (!isUnlocked && isPinActive) {
    return (
      <WalletPinLock
        mode="unlock"
        onUnlocked={() => {
          setIsUnlocked(true);
          setIsPinActive(isWalletPinSet());
        }}
      />
    );
  }

  // Coin Detail Market & Statistics View (Matches uploaded screenshot)
  if (selectedCoinForDetail) {
    return (
      <CoinDetailView
        coin={selectedCoinForDetail}
        balance={userCryptoBalances[selectedCoinForDetail.symbol] || 0}
        rate={rates[selectedCoinForDetail.symbol] || FALLBACK_RATES[selectedCoinForDetail.symbol] || 1}
        transactions={transactions}
        onBack={() => setSelectedCoinForDetail(null)}
        onReceive={() => {
          setSelectedCoinForDetail(null);
          setIsDepositModalOpen(true);
        }}
        onSend={(c) => {
          setSelectedCoinForDetail(null);
          setWithdrawCoin(c.symbol);
          setModalType('withdraw');
        }}
        onSelectTxDetail={(tx) => setSelectedTxForDetail(tx)}
      />
    );
  }

  const isRtl = i18n.language?.startsWith('fa');
  const isFa = isRtl;
  const width = carouselWidth || (typeof window !== 'undefined' ? window.innerWidth : 390);

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text pb-28 pt-2 select-none font-sans">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-3 inset-x-4 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-tg-secondary px-4 py-2.5 rounded-2xl text-xs font-semibold text-tg-text flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-tg-link" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar & Passcode Security Status */}
      <div className="px-4 flex items-center justify-end mb-2 pt-2">
        {/* Wallet Security PIN Lock Status Button */}
        <button
          type="button"
          onClick={() => {
            if (isPinActive) {
              setIsSecuritySettingsOpen(true);
            } else {
              setIsSetupPinOpen(true);
            }
          }}
          title={isPinActive ? 'Wallet Security: Active' : 'Set Wallet Passcode'}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
            isPinActive
              ? 'bg-tg-secondary border-tg-link/40 text-tg-link'
              : 'bg-tg-secondary border-tg-separator text-tg-hint hover:text-tg-text'
          }`}
        >
          {isPinActive ? (
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-tg-link" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          ) : (
            <Lock className="w-3.5 h-3.5 text-tg-hint" />
          )}
        </button>
      </div>

      {/* Main Net Worth Top Header Section */}
      <div className="px-4 mb-4">
        <div className="relative flex flex-col items-center justify-center w-full">

          {/* Large High-Contrast Balance with Smooth Custom Blur Effect & Eye Icon */}
          <div className="flex items-center justify-center space-x-2.5 rtl:space-x-reverse pt-2 pb-6">
            <div className={`flex items-center justify-center tracking-tight transition-all duration-300 ${
              showBalance ? 'blur-0 opacity-100' : 'blur-[10px] opacity-30 select-none pointer-events-none'
            }`}>
              <FaDollarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-tg-link shrink-0 mr-2 rtl:ml-2 rtl:mr-0 self-center" />
              <div className="flex items-baseline">
                <span className="text-[44px] sm:text-[48px] font-bold text-tg-text tracking-tight leading-none">
                  {balanceInt.toLocaleString()}
                </span>
                <span className="text-[28px] sm:text-[32px] font-bold text-tg-hint leading-none ml-0.5 rtl:mr-0.5 rtl:ml-0">
                  .{balanceDec}
                </span>
              </div>
            </div>

            {/* Eye Icon Toggle Button - Pure floating icon without card background */}
            <button
              onClick={() => setShowBalance(!showBalance)}
              title={showBalance ? t('assets.hideBalance', 'Hide Balance') : t('assets.showBalance', 'Show Balance')}
              className="p-1.5 text-tg-hint hover:text-tg-link active:scale-90 transition-all cursor-pointer shrink-0"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-tg-link" />
              ) : (
                <EyeOff className="w-5 h-5 text-rose-400" />
              )}
            </button>
          </div>

          {/* 2 Ergonomic Compact Action Buttons (Deposit & Withdraw) following Telegram theme */}
          <div className="flex items-center justify-center space-x-20 sm:space-x-24 rtl:space-x-reverse w-full max-w-[320px] mx-auto pt-1 pb-2">
            {/* Deposit Button */}
            <button 
              onClick={() => setIsDepositModalOpen(true)}
              className="flex flex-col items-center justify-center space-y-1.5 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-tg-button text-tg-button-text shadow-sm group-hover:brightness-110 active:brightness-95 flex items-center justify-center transition-all">
                <Plus className="w-5 h-5 text-tg-button-text" strokeWidth={2.5} />
              </div>
              <span className="text-[12.5px] font-bold text-tg-text tracking-wide">{t('assets.deposit', 'Deposit')}</span>
            </button>

            {/* Withdraw Button */}
            <button 
              onClick={() => {
                setWithdrawCoin('USDT');
                setModalType('withdraw');
              }}
              className="flex flex-col items-center justify-center space-y-1.5 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-tg-button text-tg-button-text shadow-sm group-hover:brightness-110 active:brightness-95 flex items-center justify-center transition-all">
                <ArrowUp className="w-5 h-5 text-tg-button-text" strokeWidth={2.5} />
              </div>
              <span className="text-[12.5px] font-bold text-tg-text tracking-wide">{t('assets.withdraw', 'Withdraw')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Precision Centered Telegram Native Tab Bar */}
      <div className="flex justify-center items-center px-4 mt-2 mb-3">
        <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse border-b border-tg-separator pb-0">
          {/* Crypto Tab */}
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('crypto');
            }}
            className={`relative pb-2.5 px-3 text-[14.5px] font-bold transition-colors cursor-pointer select-none ${
              activeTab === 'crypto' ? 'text-tg-text' : 'text-tg-hint hover:text-tg-text'
            }`}
          >
            <span>{t('assets.tabCrypto', 'Crypto')}</span>
            {activeTab === 'crypto' && (
              <motion.div
                layoutId="walletTabIndicator"
                className="absolute bottom-0 inset-x-2 h-[2.5px] bg-tg-button rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
          </button>

          {/* History Tab */}
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('history');
            }}
            className={`relative pb-2.5 px-3 text-[14.5px] font-bold transition-colors cursor-pointer select-none flex items-center space-x-1.5 rtl:space-x-reverse ${
              activeTab === 'history' ? 'text-tg-text' : 'text-tg-hint hover:text-tg-text'
            }`}
          >
            <span>{t('assets.tabHistory', 'History')}</span>
            {filteredTransactions.length > 0 && (
              <span className="text-[10px] font-bold text-tg-hint bg-tg-secondary border border-tg-separator px-1.5 py-0.5 rounded-full leading-none">
                {filteredTransactions.length}
              </span>
            )}
            {activeTab === 'history' && (
              <motion.div
                layoutId="walletTabIndicator"
                className="absolute bottom-0 inset-x-2 h-[2.5px] bg-tg-button rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* 2-Page Smooth Native Interactive Carousel */}
      <div 
        ref={carouselRef} 
        className="w-full overflow-hidden select-none touch-pan-y"
        dir="ltr"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex w-[200%] items-start transition-transform duration-300 ease-out"
          style={{ 
            transform: activeTab === 'crypto' ? 'translateX(0%)' : 'translateX(-50%)',
            willChange: 'transform'
          }}
        >
          {/* Slide 0: Crypto Assets List */}
          <div className="w-1/2 shrink-0 px-4 mb-5" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="bg-tg-secondary rounded-2xl overflow-hidden w-full">
              {orderedCoins.length > 0 ? (
                <div className="divide-y divide-tg-separator w-full list-none p-0 m-0">
                  {orderedCoins.map((coin) => {
                    const amount = userCryptoBalances[coin.symbol] || 0;
                    const rate = rates[coin.symbol] || FALLBACK_RATES[coin.symbol] || (coin.symbol === 'USDT' || coin.symbol === 'USDE' ? 1 : 0);
                    const usdVal = amount * rate;
                    const pct = liveChanges24h[coin.symbol] || '+0.00%';
                    const isPos = pct.startsWith('+');

                    return (
                      <CoinRow
                        key={coin.id}
                        coin={coin}
                        amount={amount}
                        rate={rate}
                        usdVal={usdVal}
                        pct={pct}
                        isPos={isPos}
                        showBalance={showBalance}
                        isFa={isFa}
                        hasApprovedDeposit={coinDepositInfo[coin.symbol]?.hasApprovedDeposit}
                        onSelect={() => {
                          triggerHaptic('selection');
                          setSelectedCoinForDetail(coin);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-tg-hint text-xs">
                  <Info className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                  <span>{t('assets.noMatchingCrypto', 'No cryptocurrencies match your search.')}</span>
                </div>
              )}

              {/* Starter Bonus Asset item */}
              <div 
                onClick={() => navigate('/loans')}
                className="p-3.5 flex items-center justify-between hover:bg-tg-bg/40 active:bg-tg-bg/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Gift className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left rtl:text-right">
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <span className="text-[15px] font-bold text-tg-text leading-snug">
                        {'Starter Bonus'}
                      </span>
                      <VerifiedBadge className="w-3.5 h-3.5" />
                      <span className="px-1.5 py-0.5 bg-amber-400/20 text-amber-400 text-[11px] font-semibold rounded-md leading-none">
                        USDT
                      </span>
                    </div>
                    <span className="text-[12px] text-tg-hint font-medium block mt-0.5 leading-none">
                      {'Bot Activation Discount'}
                    </span>
                  </div>
                </div>
                <div className="text-right rtl:text-left">
                  <span className="text-[15px] font-bold font-mono text-amber-400 block leading-snug">
                    +${(activeUser.bonusBalance ?? 5.00).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium block leading-none">
                    {'Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 1: History Transactions List */}
          <div className="w-1/2 shrink-0 px-4 mb-5" dir={isRtl ? 'rtl' : 'ltr'}>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2.5 w-full">
                {filteredTransactions.slice(0, 30).map((tx) => {
                  const isGift = tx.type === 'gift' || tx.note?.includes('Spin') || tx.note?.includes('Gift') || tx.recipient === 'TonFlame Platform' || tx.recipient === 'TonFlame Gift' || tx.recipient === 'Lucky Spin';
                  const isBonus = tx.type === 'bonus' || tx.note?.includes('Bonus');
                  const isYield = tx.type === 'profit' || tx.type === 'yield' || tx.type === 'investment_payout';
                  const isDeposit = tx.type === 'deposit';
                  const isPositive = isGift || isBonus || isYield || isDeposit;
                  const sym = (tx.currency || 'USDT').toUpperCase();
                  const address = tx.recipient || (tx as any).txHash || (tx as any).senderAddress || (tx as any).depositAddress || '';
                  const shortAddress = isGift 
                    ? 'TonFlame Gift' 
                    : isBonus 
                      ? (isFa ? 'پاداش شروع' : 'Starter Bonus') 
                      : address.length > 10 
                        ? `${address.slice(0, 4)}...${address.slice(-4)}` 
                        : address || (isDeposit ? (isFa ? 'واریز' : 'Deposit') : (isFa ? 'برداشت' : 'Withdrawal'));
                  const memo = (tx as any).memo || (tx as any).tag || (tx as any).note || (tx as any).txid?.slice(0, 5);

                  const txTitle = isGift 
                    ? (isFa ? 'دریافت' : 'Received') 
                    : isBonus 
                      ? (isFa ? 'پاداش شروع' : 'Starter Bonus') 
                      : isYield 
                        ? (isFa ? 'سود آربیتراژ' : 'Yield Profit') 
                        : isDeposit 
                          ? (isFa ? 'دریافت' : 'Received') 
                          : (isFa ? 'ارسال' : 'Sent');

                  let cryptoStr = '';
                  if (tx.cryptoAmount) {
                    cryptoStr = `${isPositive ? '+' : '-'} ${tx.cryptoAmount} ${sym}`;
                  } else {
                    const rate = rates[sym] || FALLBACK_RATES[sym] || 1;
                    const qty = rate > 0 ? (tx.amount / rate).toFixed(sym === 'TON' || sym === 'SOL' ? 2 : 2) : tx.amount.toFixed(2);
                    cryptoStr = `${isPositive ? '+' : '-'} ${qty} ${sym}`;
                  }

                  const timeStr = new Date(tx.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  });

                  return (
                    <div 
                      key={tx.id} 
                      onClick={() => setSelectedTxForDetail(tx)}
                      className="bg-tg-secondary rounded-[22px] p-3.5 flex items-center justify-between hover:bg-tg-bg/40 active:scale-[0.99] transition-all cursor-pointer group select-none"
                    >
                      {/* Left: Round icon with arrow or gift + title and address */}
                      <div className="flex items-center space-x-3.5 rtl:space-x-reverse min-w-0">
                        {isGift ? (
                          <div className="w-11 h-11 rounded-full bg-tg-button flex items-center justify-center shrink-0">
                            <Gift className="w-5 h-5 text-tg-button-text" strokeWidth={2.2} />
                          </div>
                        ) : isBonus ? (
                          <div className="w-11 h-11 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0 text-amber-400">
                            <Gift className="w-5 h-5" />
                          </div>
                        ) : sym === 'STARS' ? (
                          <div className="w-11 h-11 flex items-center justify-center shrink-0">
                            <CryptoIcon symbol="STARS" className="w-11 h-11 scale-125 object-contain" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-tg-bg border border-tg-separator flex items-center justify-center shrink-0">
                            {isDeposit ? (
                              <ArrowDown className="w-5 h-5 text-tg-text" strokeWidth={2.2} />
                            ) : (
                              <ArrowUp className="w-5 h-5 text-tg-text" strokeWidth={2.2} />
                            )}
                          </div>
                        )}

                        <div className="min-w-0 flex flex-col justify-center">
                          <span className="text-[15px] font-bold tracking-tight leading-tight text-tg-text">
                            {txTitle}
                          </span>
                          <span className="text-[12px] text-tg-hint font-medium leading-none mt-1">
                            {shortAddress}
                          </span>
                          {memo && !isGift && (
                            <div className="mt-1.5">
                              <span className="px-2 py-0.5 rounded-full bg-tg-bg text-[10.5px] font-mono text-tg-hint border border-tg-separator leading-none inline-block">
                                {memo}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Crypto amount (+0.08 TON in green or -0.14 TON in white) & Time */}
                      <div className="flex flex-col items-end shrink-0 justify-center">
                        <span className={`text-[15px] font-bold tracking-tight leading-tight ${
                          isPositive ? 'text-emerald-400' : 'text-tg-text'
                        }`}>
                          {cryptoStr}
                        </span>
                        <span className="text-[12px] text-tg-hint font-medium leading-none mt-1">
                          {timeStr}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-tg-secondary rounded-[24px] p-8 text-center text-tg-hint text-xs">
                <Activity className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                <span>{t('assets.noTransactions', 'No transactions recorded yet.')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Promotional & Story Referral Banner Slider */}
      <AssetsBannerSlider
        isPinActive={isPinActive}
        onOpenSetupPin={() => setIsSetupPinOpen(true)}
        onOpenSecuritySettings={() => setIsSecuritySettingsOpen(true)}
        onOpenStoryModal={() => setIsStoryModalOpen(true)}
      />

      {/* Story & Spin Referral Modal */}
      <StoryReferralModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        currentUser={activeUser}
      />

      {/* 3D Animated Bottom-Sheet Withdraw Modal */}
      <WithdrawModal
        open={modalType === "withdraw"}
        available={activeUser.balance || 0}
        onClose={() => setModalType(null)}
        onSubmit={async ({ amount, network, address }) => {
          triggerHaptic("medium");
          const res = await submitWithdrawal({
            userId: activeUser.id,
            telegramId: activeUser.telegramId,
            telegramUsername: activeUser.telegramUsername,
            amount: amount,
            currency: "USDT",
            network: network,
            recipient: address
          });

          // Deduct from Firestore user balance
          if (activeUser.id) {
            try {
              const newBal = Math.max(0, (activeUser.balance || 0) - amount);
              await updateDoc(doc(db, "users", activeUser.id), {
                balance: newBal
              });
              await refreshUser();
            } catch (err) {
              console.warn("User balance deduction fallback:", err);
            }
          }

          triggerHaptic("medium");
          return { id: res?.tx?.id || `WD-${Math.floor(100000 + Math.random() * 900000)}` };
        }}
      />

      {/* Deposit Bottom Sheet Modal */}
      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
        onSelectCryptoDirect={() => navigate('/deposit')}
      />

      {/* Wallet Security Settings Modal */}
      <AnimatePresence>
        {isSecuritySettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-tg-secondary rounded-3xl p-5 max-w-xs w-full text-center space-y-4 relative text-tg-text font-sans"
            >
              <button
                type="button"
                onClick={() => setIsSecuritySettingsOpen(false)}
                className="absolute top-4 right-4 text-tg-hint hover:text-tg-text p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-11 h-11 rounded-full bg-tg-link/10 text-tg-link flex items-center justify-center mx-auto mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-tg-text">
                  Wallet Security
                </h3>
                <p className="text-xs text-tg-hint mt-1 leading-relaxed">
                  Your wallet is protected by a 4-digit passcode.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-left">
                {/* Lock Now Button */}
                <button
                  type="button"
                  onClick={() => {
                    setWalletSessionUnlocked(false);
                    setIsUnlocked(false);
                    setIsSecuritySettingsOpen(false);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-tg-bg hover:bg-tg-bg/80 active:scale-[0.98] transition-all flex items-center justify-between text-xs font-medium text-tg-text border border-tg-separator cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-tg-link" />
                    <span>Lock Wallet Now</span>
                  </span>
                  <span className="text-[10px] text-tg-link bg-tg-link/10 px-2 py-0.5 rounded font-mono">
                    Test
                  </span>
                </button>

                {/* Change Passcode Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSecuritySettingsOpen(false);
                    setIsSetupPinOpen(true);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-tg-bg hover:bg-tg-bg/80 active:scale-[0.98] transition-all flex items-center justify-between text-xs font-medium text-tg-text border border-tg-separator cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Change Passcode</span>
                  </span>
                  <span className="text-[10px] text-tg-hint">➔</span>
                </button>

                {/* Disable Passcode Button */}
                <button
                  type="button"
                  onClick={() => {
                    removeWalletPin();
                    setIsPinActive(false);
                    setIsUnlocked(true);
                    setIsSecuritySettingsOpen(false);
                    triggerToast('Passcode removed');
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 active:scale-[0.98] transition-all flex items-center justify-between text-xs font-medium text-rose-400 border border-rose-500/20 cursor-pointer"
                >
                  <span>Disable Passcode</span>
                  <span className="text-[10px] text-rose-400/80">OFF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wallet Passcode Setup Modal */}
      <AnimatePresence>
        {isSetupPinOpen && (
          <WalletPinLock
            key="setup-overlay"
            mode="setup"
            onUnlocked={() => {
              setIsUnlocked(true);
              setIsPinActive(true);
              setIsSetupPinOpen(false);
              triggerToast('Wallet passcode configured!');
            }}
            onCancel={() => setIsSetupPinOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Passcode Confirmation for Withdrawal Authorization */}
      <AnimatePresence>
        {isConfirmWithdrawWithPinOpen && pendingWithdrawData && (
          <WalletPinLock
            key="withdraw-pin-auth"
            mode="confirm_action"
            actionTitle="Confirm Withdrawal"
            actionSubtitle={`Withdraw ${pendingWithdrawData.amt} ${withdrawCoin} ($${pendingWithdrawData.usdVal})`}
            onUnlocked={() => {
              setIsConfirmWithdrawWithPinOpen(false);
              if (pendingWithdrawData) {
                doExecuteWithdrawal(pendingWithdrawData.amt, pendingWithdrawData.usdVal);
                setPendingWithdrawData(null);
              }
            }}
            onCancel={() => {
              setIsConfirmWithdrawWithPinOpen(false);
              setPendingWithdrawData(null);
              setIsProcessing(false);
            }}
          />
        )}
      </AnimatePresence>
      {/* Full-Screen Telegram Wallet Transaction Detail Screen */}
      <TransactionDetailScreen
        transaction={selectedTxForDetail}
        isOpen={Boolean(selectedTxForDetail)}
        onClose={() => setSelectedTxForDetail(null)}
        usdRates={rates}
      />
    </div>
  );
}
