/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { InvitationData, GuestRsvp, PublicSite } from './types/invitation';
import { INITIAL_INVITATION_DATA } from './utils/templates';
import { BuilderSidebar } from './components/builder/BuilderSidebar';
import { PreviewFrame } from './components/builder/PreviewFrame';
import { PublicGuestView } from './components/public/PublicGuestView';
import { ShareModal } from './components/builder/ShareModal';
import { AdminSiteManagerModal } from './components/admin/AdminSiteManagerModal';
import { SacredCrossIcon } from './components/common/DecorativeIcons';
import { Eye, Edit3, Share2, Globe, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY_SITES = 'blessed_sites_v2';

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

const DEFAULT_SITE_1: PublicSite = {
  id: 'site_liam_1',
  slug: 'liam-alexander',
  title: "Liam Alexander's Holy Baptism & 1st Birthday",
  isPublished: true,
  publishedAt: 'Oct 5, 2026',
  createdAt: 'Oct 1, 2026',
  viewCount: 142,
  allowGuestRsvp: true,
  data: INITIAL_INVITATION_DATA,
  rsvps: INITIAL_RSVPS,
};

export default function App() {
  // All public sites managed by the admin
  const [sites, setSites] = useState<PublicSite[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SITES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [DEFAULT_SITE_1];
  });

  const [activeSiteId, setActiveSiteId] = useState<string>(() => {
    return sites[0]?.id || DEFAULT_SITE_1.id;
  });

  // URL state checking
  const [currentUrlParams, setCurrentUrlParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrlParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save sites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(sites));
    } catch {
      // Storage error
    }
  }, [sites]);

  // Determine active site for editing or viewing
  const activeSite = useMemo(() => {
    return sites.find((s) => s.id === activeSiteId) || sites[0] || DEFAULT_SITE_1;
  }, [sites, activeSiteId]);

  // Determine site for guest viewing
  const guestSite = useMemo(() => {
    const slugParam = currentUrlParams.get('site');
    if (slugParam) {
      const matched = sites.find((s) => s.slug === slugParam.toLowerCase().trim());
      if (matched) return matched;
    }
    return activeSite;
  }, [sites, currentUrlParams, activeSite]);

  const isGuestMode = currentUrlParams.get('view') === 'guest';

  // Mobile layout tab: 'editor' vs 'preview'
  const [mobileActiveView, setMobileActiveView] = useState<'editor' | 'preview'>('preview');

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdminSiteModalOpen, setIsAdminSiteModalOpen] = useState(false);

  // Update active site data from Builder
  const handleUpdateActiveSiteData = (updatedData: InvitationData) => {
    setSites((prevSites) =>
      prevSites.map((site) =>
        site.id === activeSite.id
          ? {
              ...site,
              title: `${updatedData.babyName}'s Holy Baptism & 1st Birthday`,
              data: updatedData,
            }
          : site
      )
    );
  };

  // RSVP submission (by guest on public site or preview)
  const handleAddRsvpToGuestSite = (newRsvp: GuestRsvp) => {
    setSites((prevSites) =>
      prevSites.map((site) =>
        site.id === guestSite.id
          ? {
              ...site,
              rsvps: [newRsvp, ...site.rsvps.filter((r) => r.id !== newRsvp.id)],
            }
          : site
      )
    );
  };

  // Clear RSVPs on active site
  const handleClearActiveSiteRsvps = () => {
    if (window.confirm('Are you sure you want to clear all guest RSVP responses for this site?')) {
      setSites((prevSites) =>
        prevSites.map((site) =>
          site.id === activeSite.id
            ? {
                ...site,
                rsvps: [],
              }
            : site
        )
      );
    }
  };

  // Admin: Create new site
  const handleCreateNewSite = (newSite: PublicSite) => {
    setSites((prev) => [newSite, ...prev]);
    setActiveSiteId(newSite.id);
  };

  // Admin: Toggle publish status
  const handleTogglePublish = (siteId: string) => {
    setSites((prev) =>
      prev.map((site) =>
        site.id === siteId
          ? {
              ...site,
              isPublished: !site.isPublished,
              publishedAt: !site.isPublished
                ? new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : site.publishedAt,
            }
          : site
      )
    );
  };

  // Admin: Delete site
  const handleDeleteSite = (siteId: string) => {
    const remaining = sites.filter((s) => s.id !== siteId);
    if (remaining.length > 0) {
      setSites(remaining);
      setActiveSiteId(remaining[0].id);
    }
  };

  // Navigation helpers
  const openGuestMode = (slug?: string) => {
    const targetSlug = slug || activeSite.slug;
    const newUrl = `${window.location.pathname}?site=${targetSlug}&view=guest`;
    window.history.pushState({ view: 'guest' }, '', newUrl);
    setCurrentUrlParams(new URLSearchParams(`?site=${targetSlug}&view=guest`));
  };

  const closeGuestMode = () => {
    window.history.pushState({}, '', window.location.pathname);
    setCurrentUrlParams(new URLSearchParams(''));
  };

  // If in pure Public Guest View mode, render dedicated distraction-free invitation
  if (isGuestMode) {
    return (
      <div className="w-full min-h-screen">
        <PublicGuestView
          data={guestSite.data}
          guestRsvps={guestSite.rsvps}
          onAddRsvp={handleAddRsvpToGuestSite}
          onOpenBuilder={closeGuestMode}
          isPublished={guestSite.isPublished}
          passwordProtected={guestSite.passwordProtected}
          sitePassword={guestSite.password}
          siteTitle={guestSite.title}
        />
      </div>
    );
  }

  // Admin Studio Mode
  return (
    <div className="w-full h-screen flex flex-col bg-stone-100 overflow-hidden font-montserrat text-stone-900">
      {/* Top Bar Navigation (Following Top Bar Contract: 3 zones, single line) */}
      <header className="h-14 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Zone 1: Brand title with delicate sacred cross icon */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${activeSite.data.accentColor}20` }}
          >
            <SacredCrossIcon color={activeSite.data.accentColor} className="w-3.5 h-4.5" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-stone-900 truncate">
            Blessed Milestones
          </h1>
        </div>

        {/* Zone 2: Navigation Links / Admin Controls & Mobile Segmented View */}
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
          {/* Admin Multi-Site Manager Trigger */}
          <button
            onClick={() => setIsAdminSiteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors font-semibold cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-stone-600" />
            <span>Sites ({sites.length})</span>
            <span className="text-[10px] text-stone-400 font-mono">/{activeSite.slug}</span>
          </button>

          <span className="text-stone-300">·</span>

          {/* Quick Publish Toggle Button */}
          <button
            onClick={() => handleTogglePublish(activeSite.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
              activeSite.isPublished
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title="Click to toggle publish status"
          >
            {activeSite.isPublished ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Public Site: Live</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Site: Draft (Offline)</span>
              </>
            )}
          </button>

          <span className="text-stone-300">·</span>
          <span className="text-stone-500 truncate max-w-xs">{activeSite.data.babyName}&apos;s Celebration</span>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Admin Sites Button */}
          <button
            onClick={() => setIsAdminSiteModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-stone-600" />
            <span>Admin Sites</span>
          </button>

          {/* Public Guest View Link */}
          <button
            onClick={() => openGuestMode()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>View as Guest</span>
          </button>

          {/* Publish & Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl text-white shadow-xs transition-all hover:opacity-95 active:scale-95 cursor-pointer"
            style={{ backgroundColor: activeSite.data.accentColor }}
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
            data={activeSite.data}
            onChange={handleUpdateActiveSiteData}
            guestRsvps={activeSite.rsvps}
            onOpenShare={() => setIsShareModalOpen(true)}
            onClearRsvps={handleClearActiveSiteRsvps}
          />
        </aside>

        {/* Right Live Preview: Interactive Phone / Desktop Canvas */}
        <section
          className={`flex-1 h-full ${
            mobileActiveView === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          <PreviewFrame
            data={activeSite.data}
            guestRsvps={activeSite.rsvps}
            onAddRsvp={handleAddRsvpToGuestSite}
            isGuestMode={false}
            onToggleGuestMode={() => openGuestMode()}
          />
        </section>
      </main>

      {/* Share & QR Code Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={activeSite.data}
        siteSlug={activeSite.slug}
        onOpenGuestView={() => openGuestMode()}
      />

      {/* Admin Multi-Site Manager Console Modal */}
      <AdminSiteManagerModal
        isOpen={isAdminSiteModalOpen}
        onClose={() => setIsAdminSiteModalOpen(false)}
        sites={sites}
        activeSiteId={activeSite.id}
        onSelectSite={(id) => {
          setActiveSiteId(id);
          setIsAdminSiteModalOpen(false);
        }}
        onCreateSite={handleCreateNewSite}
        onTogglePublish={handleTogglePublish}
        onUpdateSiteConfig={(id, updates) => {
          setSites((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
          );
        }}
        onDeleteSite={handleDeleteSite}
        onOpenPublicSite={(slug) => {
          setIsAdminSiteModalOpen(false);
          openGuestMode(slug);
        }}
      />
    </div>
  );
}
