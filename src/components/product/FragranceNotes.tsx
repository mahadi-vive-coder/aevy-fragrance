import React, { useState } from 'react';
import { DBProduct } from '../../types';
import { ChevronDown, Sparkles, Clock, Compass } from 'lucide-react';

interface FragranceNotesProps {
  product: DBProduct;
}

export const FragranceNotes: React.FC<FragranceNotesProps> = ({ product }) => {
  const [openSection, setOpenSection] = useState<'profile' | 'details' | 'wear' | 'story' | null>(
    'profile'
  );

  const toggle = (section: 'profile' | 'details' | 'wear' | 'story') => {
    setOpenSection((curr) => (curr === section ? null : section));
  };

  const topNotes = product.notes?.top || (product.top_notes ? [product.top_notes] : []);
  const heartNotes = product.notes?.heart || (product.heart_notes ? [product.heart_notes] : []);
  const baseNotes = product.notes?.base || (product.base_notes ? [product.base_notes] : []);

  const hasNotes = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;

  return (
    <div className="border-t border-[#E6E3DC] divide-y divide-[#E6E3DC] font-sans">
      {/* Fragrance Profile (Notes) */}
      {hasNotes && (
        <div className="py-5">
          <button
            onClick={() => toggle('profile')}
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="font-serif text-xl sm:text-2xl text-[#111111] group-hover:text-[#C8A96A] transition-colors">
              Fragrance Profile
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 ${
                openSection === 'profile' ? 'rotate-180 text-[#111111]' : ''
              }`}
            />
          </button>

          {openSection === 'profile' && (
            <div className="pt-5 space-y-4 animate-in fade-in duration-200">
              {topNotes.length > 0 && (
                <div className="p-4 bg-white border border-[#E6E3DC] rounded-sm">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
                    Top Notes
                  </span>
                  <p className="text-sm font-serif text-[#111111] mt-1 text-lg">
                    {topNotes.join(' • ')}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    Initial sensory impressions upon application.
                  </p>
                </div>
              )}

              {heartNotes.length > 0 && (
                <div className="p-4 bg-white border border-[#E6E3DC] rounded-sm">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
                    Heart Notes
                  </span>
                  <p className="text-sm font-serif text-[#111111] mt-1 text-lg">
                    {heartNotes.join(' • ')}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    The core character as the fragrance warms to your skin.
                  </p>
                </div>
              )}

              {baseNotes.length > 0 && (
                <div className="p-4 bg-white border border-[#E6E3DC] rounded-sm">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
                    Base Notes
                  </span>
                  <p className="text-sm font-serif text-[#111111] mt-1 text-lg">
                    {baseNotes.join(' • ')}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    The enduring trail that settles close to skin and fabric.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Details */}
      <div className="py-5">
        <button
          onClick={() => toggle('details')}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="font-serif text-xl sm:text-2xl text-[#111111] group-hover:text-[#C8A96A] transition-colors">
            Specifications
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 ${
              openSection === 'details' ? 'rotate-180 text-[#111111]' : ''
            }`}
          />
        </button>

        {openSection === 'details' && (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
            <div className="p-3.5 bg-white border border-[#E6E3DC] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C8A96A]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Longevity</span>
              </div>
              <p className="text-sm text-[#111111] font-medium">
                {product.longevity || '8 - 12 Hours (Extrait de Parfum)'}
              </p>
            </div>

            <div className="p-3.5 bg-white border border-[#E6E3DC] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C8A96A]">
                <Compass className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Concentration</span>
              </div>
              <p className="text-sm text-[#111111] font-medium">Extrait de Parfum (30% Oil)</p>
            </div>

            <div className="sm:col-span-2 p-3.5 bg-white border border-[#E6E3DC] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C8A96A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Occasion</span>
              </div>
              <p className="text-sm text-[#111111] font-medium">
                {product.perfect_for || product.perfectFor || 'Signature Day & Evening Wear'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* How to Wear */}
      <div className="py-5">
        <button
          onClick={() => toggle('wear')}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="font-serif text-xl sm:text-2xl text-[#111111] group-hover:text-[#C8A96A] transition-colors">
            Application & Wear
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 ${
              openSection === 'wear' ? 'rotate-180 text-[#111111]' : ''
            }`}
          />
        </button>

        {openSection === 'wear' && (
          <div className="pt-4 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-sans animate-in fade-in duration-200 space-y-2">
            <p>
              Apply directly to pulse points — the base of the neck, inner wrists, and collarbone.
            </p>
            <p>
              Allow the fragrance to dry down naturally without rubbing, allowing the notes to unfold in balance with your body heat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
