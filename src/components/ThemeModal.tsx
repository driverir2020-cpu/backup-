import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Smartphone, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { useTheme, AppTheme } from '../context/ThemeContext';
import { triggerHaptic } from '../utils/haptics';
import { useTranslation } from 'react-i18next';
import { Tappable, Button } from '@telegram-apps/telegram-ui';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const { theme, setTheme, colorScheme } = useTheme();
  const { t } = useTranslation();

  const handleSelectTheme = (newTheme: AppTheme) => {
    triggerHaptic('medium');
    setTheme(newTheme);
  };

  const modalElement = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 font-sans">
          
          {/* Telegram Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom-Sheet Card */}
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
            className="relative w-full max-w-md bg-tg-secondary sm:rounded-[28px] rounded-t-[28px] z-10 max-h-[85vh] flex flex-col overflow-hidden text-tg-text font-sans border-t border-tg-separator sm:border"
          >
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-[var(--tg-hint-color)] opacity-40 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            {/* Header Bar */}
            <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-tg-separator">
              <div>
                <h3 className="text-[17px] font-bold text-tg-text tracking-tight">
                  {t('theme', 'Telegram Theme')}
                </h3>
                <p className="text-[12px] text-tg-hint">
                  {t('theme_desc', 'Synchronized with Telegram Mini Apps SDK')}
                </p>
              </div>

              <Tappable
                Component="button"
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-tg-bg flex items-center justify-center text-tg-hint hover:text-tg-text transition-all cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </Tappable>
            </div>

            {/* 3 Theme Options */}
            <div className="p-4 space-y-3 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* 1. AUTO / TELEGRAM SYSTEM */}
                <Tappable
                  Component="button"
                  type="button"
                  onClick={() => handleSelectTheme('auto')}
                  className={`p-3 rounded-[20px] flex flex-col items-center text-center transition-all cursor-pointer relative overflow-hidden border ${
                    theme === 'auto'
                      ? 'bg-tg-bg border-tg-link ring-2 ring-[var(--tg-link-color)]'
                      : 'bg-tg-bg border-tg-separator opacity-80'
                  }`}
                >
                  {theme === 'auto' && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-tg-link text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-2 text-tg-link">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-bold text-tg-text block">
                    Auto
                  </span>
                  <span className="text-[10px] text-tg-hint block mt-0.5">
                    Telegram
                  </span>
                </Tappable>

                {/* 2. TELEGRAM DARK */}
                <Tappable
                  Component="button"
                  type="button"
                  onClick={() => handleSelectTheme('dark')}
                  className={`p-3 rounded-[20px] flex flex-col items-center text-center transition-all cursor-pointer relative overflow-hidden border ${
                    theme === 'dark' || (theme !== 'light' && theme !== 'auto')
                      ? 'bg-tg-bg border-tg-link ring-2 ring-[var(--tg-link-color)]'
                      : 'bg-tg-bg border-tg-separator opacity-80'
                  }`}
                >
                  {(theme === 'dark' || theme === 'onyx' || theme === 'navy') && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-tg-link text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-2 text-amber-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-bold text-tg-text block">
                    Dark
                  </span>
                  <span className="text-[10px] text-tg-hint block mt-0.5">
                    Night Mode
                  </span>
                </Tappable>

                {/* 3. TELEGRAM LIGHT */}
                <Tappable
                  Component="button"
                  type="button"
                  onClick={() => handleSelectTheme('light')}
                  className={`p-3 rounded-[20px] flex flex-col items-center text-center transition-all cursor-pointer relative overflow-hidden border ${
                    theme === 'light'
                      ? 'bg-tg-bg border-tg-link ring-2 ring-[var(--tg-link-color)]'
                      : 'bg-tg-bg border-tg-separator opacity-80'
                  }`}
                >
                  {theme === 'light' && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-tg-link text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-2 text-amber-500">
                    <Sun className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-bold text-tg-text block">
                    Light
                  </span>
                  <span className="text-[10px] text-tg-hint block mt-0.5">
                    Day Mode
                  </span>
                </Tappable>

              </div>

              {/* Status Info Box */}
              <div className="p-3 rounded-[16px] bg-tg-bg border border-tg-separator flex items-center justify-between text-[12px]">
                <span className="text-tg-hint">Current Active Mode:</span>
                <span className="font-bold text-tg-link capitalize">
                  {colorScheme === 'dark' ? 'Dark Mode (شب)' : 'Light Mode (روز)'}
                </span>
              </div>

              {/* Confirm / Close Button using @telegram-apps/telegram-ui Button */}
              <div className="pt-1">
                <Button
                  size="l"
                  stretched
                  onClick={onClose}
                  className="font-bold cursor-pointer"
                >
                  <span className="flex items-center justify-center space-x-1.5 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </span>
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}
