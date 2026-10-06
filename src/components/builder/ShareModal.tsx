import React, { useState } from 'react';
import { InvitationData } from '../../types/invitation';
import { Check, Copy, Share2, QrCode, X, Printer } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-montserrat">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3"
            style={{ background: `${data.accentColor}20` }}
          >
            <Share2 className="w-6 h-6" style={{ color: data.accentColor }} />
          </div>
          <h3 className="font-cormorant text-2xl font-bold text-stone-800">
            Share Digital Invitation
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Invite family and godparents to {data.babyName}&apos;s celebration
          </p>
        </div>

        {/* Share Link Copy */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Invitation Web Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-600 select-all font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-white flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                style={{ backgroundColor: data.accentColor }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* QR Code representation */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center flex flex-col items-center">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200 mb-2">
              {/* SVG QR Code pattern */}
              <svg className="w-28 h-28 text-stone-900" viewBox="0 0 100 100" fill="currentColor">
                {/* Corner top-left */}
                <rect x="10" y="10" width="26" height="26" rx="3" fill="#1C1917" />
                <rect x="15" y="15" width="16" height="16" rx="2" fill="white" />
                <rect x="19" y="19" width="8" height="8" rx="1" fill="#1C1917" />
                {/* Corner top-right */}
                <rect x="64" y="10" width="26" height="26" rx="3" fill="#1C1917" />
                <rect x="69" y="15" width="16" height="16" rx="2" fill="white" />
                <rect x="73" y="19" width="8" height="8" rx="1" fill="#1C1917" />
                {/* Corner bottom-left */}
                <rect x="10" y="64" width="26" height="26" rx="3" fill="#1C1917" />
                <rect x="15" y="69" width="16" height="16" rx="2" fill="white" />
                <rect x="19" y="73" width="8" height="8" rx="1" fill="#1C1917" />
                {/* Data bits */}
                <rect x="42" y="14" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="52" y="14" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="42" y="24" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="42" y="44" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="52" y="44" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="62" y="44" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="22" y="44" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="74" y="54" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="84" y="64" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="54" y="74" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="64" y="84" width="6" height="6" rx="1" fill="#1C1917" />
                <rect x="74" y="74" width="6" height="6" rx="1" fill="#1C1917" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-stone-400" />
              Scan QR code for instant RSVP
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">
              Printable on physical keepsake envelopes
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-opacity"
              style={{ backgroundColor: data.accentColor }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
