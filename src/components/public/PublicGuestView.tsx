import React, { useState } from 'react';
import { InvitationData, GuestRsvp } from '../../types/invitation';
import { CoverScreen } from '../invitation/CoverScreen';
import { InvitationView } from '../invitation/InvitationView';
import { invitationAudio } from '../../utils/audioPlayer';
import { SacredCrossIcon, GoldSparkleIcon } from '../common/DecorativeIcons';
import { Edit3, ExternalLink } from 'lucide-react';

interface PublicGuestViewProps {
  data: InvitationData;
  guestRsvps: GuestRsvp[];
  onAddRsvp: (rsvp: GuestRsvp) => void;
  onOpenBuilder?: () => void;
}

export const PublicGuestView: React.FC<PublicGuestViewProps> = ({
  data,
  guestRsvps,
  onAddRsvp,
  onOpenBuilder,
}) => {
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  const handleOpenCover = () => {
    setIsCoverOpen(true);
    if (data.musicEnabled) {
      invitationAudio.play();
    }
  };

  const handleResetCover = () => {
    setIsCoverOpen(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-amber-100"
      style={{
        backgroundColor: data.secondaryColor || '#F7F4EE',
        backgroundImage: `radial-gradient(ellipse at 50% 0%, #FFFFFF 0%, ${data.secondaryColor} 65%, #EDE6DA 100%)`,
      }}
    >
      {/* Desktop Presentation Ambiance: Soft floating light and delicate golden dust */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-35"
          style={{ background: `radial-gradient(circle, ${data.accentColor}30, transparent 70%)` }}
        />
        <div className="absolute top-20 left-16 animate-sparkle opacity-25">
          <GoldSparkleIcon color={data.accentColor} className="w-6 h-6" />
        </div>
        <div className="absolute top-40 right-20 animate-sparkle opacity-25" style={{ animationDelay: '1.5s' }}>
          <GoldSparkleIcon color={data.accentColor} className="w-5 h-5" />
        </div>
        <div className="absolute bottom-24 left-24 animate-sparkle opacity-20" style={{ animationDelay: '2s' }}>
          <GoldSparkleIcon color={data.accentColor} className="w-6 h-6" />
        </div>
        <div className="absolute bottom-32 right-28 animate-sparkle opacity-20" style={{ animationDelay: '0.7s' }}>
          <GoldSparkleIcon color={data.accentColor} className="w-5 h-5" />
        </div>
      </div>

      {/* Invitation Core Container: Mobile (100% fluid) / Desktop (420px max centered) */}
      <div
        className="w-full max-w-[430px] min-h-screen relative flex flex-col md:my-6 md:rounded-[36px] shadow-2xl transition-all duration-300 md:border md:border-stone-200/80 overflow-hidden"
        style={{
          backgroundColor: data.primaryColor || '#FFFDF8',
        }}
      >
        {/* Full-Screen Cover Screen */}
        <CoverScreen
          data={data}
          isOpen={isCoverOpen}
          onOpen={handleOpenCover}
        />

        {/* Main Sacred & Joyful Invitation Content */}
        <div className="w-full flex-1">
          <InvitationView
            data={data}
            onResetCover={handleResetCover}
            guestRsvps={guestRsvps}
            onAddRsvp={onAddRsvp}
          />
        </div>

        {/* Subtle, Dignified Footer for Public Guests */}
        <div className="py-4 px-6 text-center border-t border-stone-200/50 bg-stone-50/60 font-montserrat text-[11px] text-stone-400">
          <div className="flex items-center justify-center gap-1.5 mb-1 opacity-70">
            <SacredCrossIcon color={data.accentColor} className="w-3 h-3" />
            <span className="tracking-widest uppercase text-[10px]">Blessed Milestones</span>
          </div>
          <p className="font-light">
            Digital Invitation for {data.babyName}&apos;s Holy Baptism &amp; 1st Birthday
          </p>

          {/* Discreet Host Access Link */}
          {onOpenBuilder && (
            <div className="mt-3 pt-2 border-t border-stone-200/40">
              <button
                onClick={onOpenBuilder}
                className="text-[10px] text-stone-400 hover:text-stone-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Host? Switch to Invitation Studio</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
