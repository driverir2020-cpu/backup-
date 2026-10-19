import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { HandCoins, Sparkles } from 'lucide-react';
import { FaWalletIcon, FaReferralIcon } from './CustomIcons';
import { useAuth } from '../context/AuthContext';
import { triggerHaptic } from '../utils/haptics';

function ProfileAvatarFill({ user }: { user: any }) {
  const [imgError, setImgError] = useState(false);
  const photo = user?.photoUrl;
  const displayName = user?.firstName || user?.telegramUsername || 'Trader';
  const initial = displayName.charAt(0).toUpperCase();

  if (photo && !imgError) {
    return (
      <img
        src={photo}
        alt={displayName}
        className="w-[44px] h-[44px] rounded-full object-cover select-none pointer-events-none ring-1 ring-tg-separator shadow-sm"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold text-tg-text text-[15px] bg-tg-secondary ring-1 ring-tg-separator select-none pointer-events-none shadow-sm">
      {initial}
    </div>
  );
}

export function LiquidGlassNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isProfileActive = location.pathname === '/profile';
  const isSpinActive = location.pathname === '/spin';

  const isWalletActive = location.pathname === '/' || location.pathname.startsWith('/assets') || location.pathname.startsWith('/deposit');

  const mainTabs = [
    {
      to: '/',
      label: 'Wallet',
      renderIcon: (active: boolean) => (
        <FaWalletIcon
          className={`w-[20px] h-[20px] transition-all duration-200 ${
            active ? 'text-tg-link' : 'text-tg-hint'
          }`}
        />
      ),
      isActive: isWalletActive
    },
    {
      to: '/loans',
      label: 'Loans',
      renderIcon: (active: boolean) => (
        <HandCoins
          className={`w-[20px] h-[20px] transition-all duration-200 ${
            active ? 'text-tg-link' : 'text-tg-hint'
          }`}
        />
      ),
      isActive: location.pathname.startsWith('/loans')
    },
    {
      to: '/referral',
      label: 'Invite',
      renderIcon: (active: boolean) => (
        <FaReferralIcon
          className={`w-[20px] h-[20px] transition-all duration-200 ${
            active ? 'text-tg-link' : 'text-tg-hint'
          }`}
        />
      ),
      isActive: location.pathname.startsWith('/referral')
    }
  ];

  const handleTabClick = (to: string) => {
    triggerHaptic('selection');
    navigate(to);
  };

  return (
    <div
      className="liquid-bar pointer-events-auto select-none"
      id="liquid-glass-navigation-bar"
    >
      {/* ---------- Left Standalone Bubble (Spin Wheel) ---------- */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic('selection');
          navigate('/spin');
        }}
        id="nav-spin-bubble"
        className={`liquid-bubble cursor-pointer ${isSpinActive ? 'active' : ''}`}
        aria-label="Royal Spin"
        title="Royal Spin"
      >
        <div className="z-10 flex items-center justify-center">
          <Sparkles className={`w-[20px] h-[20px] transition-colors duration-200 ${isSpinActive ? 'text-tg-link' : 'text-tg-hint'}`} />
        </div>
        <span className={`label z-10 ${isSpinActive ? 'text-tg-link' : 'text-tg-hint'}`}>Spin</span>
      </button>

      {/* ---------- Center Pill Group ---------- */}
      <div className="liquid-pill" id="nav-pill-group">
        {mainTabs.map((tab) => {
          const active = tab.isActive;
          return (
            <button
              key={tab.to}
              type="button"
              onClick={() => handleTabClick(tab.to)}
              id={`nav-tab-${tab.to.replace('/', '') || 'swap'}`}
              className={`liquid-tab ${active ? 'active' : ''}`}
              aria-label={tab.label}
            >
              {active && (
                <motion.div
                  layoutId="liquid-indicator"
                  className="liquid-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="z-10 flex items-center justify-center relative">
                {tab.renderIcon(active)}
              </div>
              <span className="label z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Right Standalone Bubble (User Profile) ---------- */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic('selection');
          navigate('/profile');
        }}
        id="nav-profile-bubble"
        className={`liquid-avatar-bubble cursor-pointer ${isProfileActive ? 'active' : ''}`}
        aria-label="User Profile"
      >
        <ProfileAvatarFill user={user} />
      </button>
    </div>
  );
}
