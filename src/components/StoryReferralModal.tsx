import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, 
  Check, 
  X, 
  Gift, 
  Coins, 
  Share2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserData } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { Tappable } from '@telegram-apps/telegram-ui';

interface StoryReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserData | null;
  botUsername?: string;
}

export function StoryReferralModal({
  isOpen,
  onClose,
  currentUser,
  botUsername = 'TonFlame_Bot'
}: StoryReferralModalProps) {
  const { i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const cleanBotUsername = (botUsername || 'TonFlame_Bot').replace('@', '');
  const tgId = currentUser?.telegramId || currentUser?.id || 'guest';
  const spinInviteLink = `https://t.me/${cleanBotUsername}?startapp=spin_ref_${tgId}`;

  const isFa = i18n.language?.startsWith('fa');

  const handleCopyLink = () => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(spinInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareStory = () => {
    triggerHaptic('selection');
    const tg = (window as any).Telegram?.WebApp;
    const shareText = isFa
      ? `گردونه شانس و جوایز نقدی تتر\nاسپین رایگان:\n${spinInviteLink}`
      : `Lucky Spin - Free USDT Reward:\n${spinInviteLink}`;

    try {
      if (tg?.shareToStory) {
        tg.shareToStory({
          widget_link: {
            url: spinInviteLink,
            name: isFa ? "گردونه شانس" : "Lucky Spin"
          }
        });
      } else if (tg?.openTelegramLink) {
        const url = `https://t.me/share/url?url=${encodeURIComponent(spinInviteLink)}&text=${encodeURIComponent(shareText)}`;
        tg.openTelegramLink(url);
      } else {
        const url = `https://t.me/share/url?url=${encodeURIComponent(spinInviteLink)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
      }
    } catch {
      window.open(spinInviteLink, '_blank');
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 font-['Inter','SF_Pro_Text',system-ui,sans-serif] select-none">
          {/* Telegram Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transform-gpu"
          />

          {/* Bottom-Sheet with Telegram UI Native Physics & Navy Spin Panel Tone */}
          <motion.div
            initial={{ y: "100%", opacity: 0.85 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 350) {
                onClose();
              }
            }}
            className="relative w-full max-w-md bg-gradient-to-b from-[#111b2f] to-[#090f1d] border-0 rounded-t-[26px] sm:rounded-[26px] p-5 shadow-2xl z-10 text-white overflow-hidden max-h-[90vh] flex flex-col transform-gpu will-change-transform touch-pan-y"
            dir={isFa ? 'rtl' : 'ltr'}
          >
            {/* Telegram UI Sheet Handle Bar */}
            <div className="w-10 h-1 bg-white/25 rounded-full mx-auto -mt-1 mb-3.5 sm:hidden shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 shrink-0">
              <div>
                <h3 className="text-[16px] font-bold text-white tracking-tight leading-snug">
                  {isFa ? 'پاداش دعوت و استوری' : 'Story & Referral Program'}
                </h3>
                <p className="text-[12px] text-[#8aa2c0] font-normal mt-0.5">
                  {isFa ? 'اسپین رایگان و سهم نقدی از دوستان' : 'Free spin & direct cash commission'}
                </p>
              </div>

              <Tappable
                Component="button"
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#162335] hover:bg-[#1e314a] text-[#8aa2c0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Tappable>
            </div>

            {/* Scrollable Content Body */}
            <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pb-1">
              {/* Card 1: Free Spin */}
              <div className="p-3.5 rounded-2xl bg-[#162335] border-0 flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-xl bg-[#1f314a] text-[#3fa6ea] flex items-center justify-center shrink-0 mt-0.5">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left rtl:text-right">
                  <h4 className="text-[13px] font-semibold text-white">
                    {isFa ? '۱ اسپین رایگان به ازای هر دعوت' : '1 Free Spin Per Friend'}
                  </h4>
                  <p className="text-[11.5px] text-[#8aa2c0] leading-relaxed mt-0.5">
                    {isFa 
                      ? 'با عضویت هر دوست با لینک اختصاصی شما، ۱ شانس چرخش رایگان به حساب شما افزوده می‌شود.' 
                      : 'Each user joining via your link grants you 1 free spin ticket.'}
                  </p>
                </div>
              </div>

              {/* Card 2: 10% Cash Commission */}
              <div className="p-3.5 rounded-2xl bg-[#162335] border-0 flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-xl bg-[#1f314a] text-[#3fa6ea] flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left rtl:text-right">
                  <h4 className="text-[13px] font-semibold text-white">
                    {isFa ? '۱۰٪ سهم نقدی از شارژ و بردهای دوستان' : '10% Cash from Deposits & Wins'}
                  </h4>
                  <p className="text-[11.5px] text-[#8aa2c0] leading-relaxed mt-0.5">
                    {isFa 
                      ? 'هر زمان دوست شما حسابش را شارژ کند یا در گردونه برنده شود، ۱۰٪ از مبلغ مستقیماً به موجودی کیف‌پول شما واریز می‌شود.' 
                      : 'Whenever your referred friend deposits or wins on the wheel, 10% is credited directly to your balance.'}
                  </p>
                </div>
              </div>

              {/* Card 3: Link Box */}
              <div className="bg-[#162335] border-0 rounded-2xl p-3">
                <div className="text-[11px] text-[#8aa2c0] font-medium mb-1.5 px-0.5">
                  {isFa ? 'لینک اختصاصی شما:' : 'Your invite link:'}
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-[#0d1624] px-3 py-2.5 rounded-xl border-0">
                  <span className="text-[11.5px] font-mono text-[#cbd5e1] truncate flex-1 text-left dir-ltr select-all">
                    {spinInviteLink}
                  </span>
                  <Tappable
                    Component="button"
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#1f4a73] hover:bg-[#255b8c] active:scale-95 text-[#a8dcff] font-semibold text-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#38b0ff]" />
                        <span>{isFa ? 'کپی شد' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isFa ? 'کپی' : 'Copy'}</span>
                      </>
                    )}
                  </Tappable>
                </div>
              </div>
            </div>

            {/* Action Button Footer */}
            <div className="pt-3 shrink-0">
              <Tappable
                Component="button"
                type="button"
                onClick={handleShareStory}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-[#38b0ff] via-[#1d83dc] to-[#176cc0] active:scale-[0.98] text-white font-bold text-[14px] flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer shadow-sm border-0"
              >
                <Share2 className="w-4 h-4 text-white" />
                <span>{isFa ? 'اشتراک‌گذاری در استوری تلگرام' : 'Share to Telegram Story'}</span>
              </Tappable>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
