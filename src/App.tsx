/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InvitationData, GuestRsvp } from './types/invitation';
import { INITIAL_INVITATION_DATA } from './utils/templates';
import { BuilderSidebar } from './components/builder/BuilderSidebar';
import { PreviewFrame } from './components/builder/PreviewFrame';
import { PublicGuestView } from './components/public/PublicGuestView';
import { ShareModal } from './components/builder/ShareModal';
import { SacredCrossIcon } from './components/common/DecorativeIcons';
import { Eye, Edit3, Share2, Globe } from 'lucide-react';

const STORAGE_KEY_DATA = 'blessed_invitation_data_v1';
const STORAGE_KEY_RSVPS = 'blessed_invitation_rsvps_v1';

const INITIAL_RSVPS: GuestRsvp[] = [
  {
    id: 'rsvp_sample_1',
    name: 'Maria Santos',
    attending: true,
    guestCount: 1,
    message: 'So honored to be Godmother to baby Liam! May God shower his life with endless blessings.',
    submittedAt: 'Oct 4, 2026',
  },
  {
    id: 'rsvp_sample_2',
    name: 'Engr. Rafael Reyes',
    attending: true,
    guestCount: 1,
    message: 'Can’t wait to celebrate Liam’s first milestone and sacrament with the family!',
    submittedAt: 'Oct 5, 2026',
  },
];

export default function App() {
  const [data, setData] = useState<InvitationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_INVITATION_DATA;
  });

  const [guestRsvps, setGuestRsvps] = useState<GuestRsvp[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RSVPS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_RSVPS;
  });

  // Check if URL has ?view=guest
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'guest';
  });

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setIsGuestMode(params.get('view') === 'guest');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openGuestMode = () => {
    setIsGuestMode(true);
    const newUrl = `${window.location.pathname}?view=guest`;
    window.history.pushState({ view: 'guest' }, '', newUrl);
  };

  const closeGuestMode = () => {
    setIsGuestMode(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Mobile layout tab: 'editor' vs 'preview'
  const [mobileActiveView, setMobileActiveView] = useState<'editor' | 'preview'>('preview');

  // Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    } catch {
      // Storage error
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(guestRsvps));
    } catch {
      // Storage error
    }
  }, [guestRsvps]);

  const handleAddRsvp = (newRsvp: GuestRsvp) => {
    setGuestRsvps((prev) => {
      const filtered = prev.filter((r) => r.id !== newRsvp.id);
      return [newRsvp, ...filtered];
    });
  };

  const handleClearRsvps = () => {
    if (window.confirm('Are you sure you want to clear all guest RSVP responses?')) {
      setGuestRsvps([]);
    }
  };

  // If in pure Public Guest View mode, render dedicated distraction-free invitation
  if (isGuestMode) {
    return (
      <div className="w-full min-h-screen">
        <PublicGuestView
          data={data}
          guestRsvps={guestRsvps}
          onAddRsvp={handleAddRsvp}
          onOpenBuilder={closeGuestMode}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-stone-100 overflow-hidden font-montserrat text-stone-900">
      {/* Top Bar Navigation (Following Top Bar Contract: 3 zones, single line) */}
      <header className="h-14 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Zone 1: Single text element wordmark with delicate cross icon */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${data.accentColor}20` }}
          >
            <SacredCrossIcon color={data.accentColor} className="w-3.5 h-4.5" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-stone-900 truncate">
            Blessed Milestones
          </h1>
        </div>

        {/* Zone 2: Navigation Links / Segmented View Controls on Mobile */}
        <div className="md:hidden flex items-center bg-stone-100 p-0.5 rounded-xl text-xs">
          <button
            onClick={() => setMobileActiveView('editor')}
            className={`px-3 py-1 font-semibold rounded-lg flex items-center gap-1 transition-all ${
              mobileActiveView === 'editor'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setMobileActiveView('preview')}
            className={`px-3 py-1 font-semibold rounded-lg flex items-center gap-1 transition-all ${
              mobileActiveView === 'preview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-3 text-xs font-medium text-stone-600">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Public Invitation Live</span>
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500">{data.babyName}&apos;s Holy Baptism &amp; 1st Birthday</span>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={openGuestMode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>View as Guest</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl text-white shadow-xs transition-all hover:opacity-95 active:scale-95 cursor-pointer"
            style={{ backgroundColor: data.accentColor }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Publish &amp; Share</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Builder Sidebar + Right Preview Frame */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Customization Controls (Hidden on mobile if preview tab active) */}
        <aside
          className={`w-full md:w-[420px] lg:w-[460px] h-full shrink-0 ${
            mobileActiveView === 'editor' ? 'block' : 'hidden md:block'
          }`}
        >
          <BuilderSidebar
            data={data}
            onChange={setData}
            guestRsvps={guestRsvps}
            onOpenShare={() => setIsShareModalOpen(true)}
            onClearRsvps={handleClearRsvps}
          />
        </aside>

        {/* Right Live Preview: Interactive Phone / Desktop Canvas */}
        <section
          className={`flex-1 h-full ${
            mobileActiveView === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          <PreviewFrame
            data={data}
            guestRsvps={guestRsvps}
            onAddRsvp={handleAddRsvp}
            isGuestMode={false}
            onToggleGuestMode={openGuestMode}
          />
        </section>
      </main>

      {/* Share & QR Code Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={data}
        onOpenGuestView={openGuestMode}
      />
    </div>
  );
}
