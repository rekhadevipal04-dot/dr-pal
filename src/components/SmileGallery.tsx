import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  dentistNotes: string;
  patientAge: string;
}

const CASES: CaseStudy[] = [
  {
    id: 'case_scaling',
    title: 'Ultrasonic Gum Scaling & Plaque Removal',
    category: 'Preventive Cleaning',
    duration: 'Single 30-Min Session',
    description: 'Removal of heavy supragingival calculus, tartar deposits, and plaque along the gum margin with air-flow polishing and gum detox.',
    beforeImg: './gallery/scaling_before.jpg',
    afterImg: './gallery/scaling_after.jpg',
    dentistNotes: 'Inflamed bleeding gingiva completely resolved. Enamel smoothed and fluoride protected.',
    patientAge: '34 yrs, Dahisar West',
  },
  {
    id: 'case_implant',
    title: 'Single Incisor Dental Implant & Zirconia Crown',
    category: 'Implantology',
    duration: 'Complete Restoration',
    description: 'Replacement of missing front tooth with bio-compatible titanium fixture and custom CAD/CAM zirconia aesthetic crown.',
    beforeImg: './gallery/implant_before.jpg',
    afterImg: './gallery/implant_after.jpg',
    dentistNotes: 'Natural emergence profile achieved with harmonious gingival margin alignment.',
    patientAge: '29 yrs, Executive',
  },
  {
    id: 'case_ortho',
    title: 'Anterior Crowding & Bite Alignment',
    category: 'Orthodontics',
    duration: 'Alignment Correction',
    description: 'Correction of severe anterior dental crowding, overlapping incisors, and malocclusion into an aligned functional bite.',
    beforeImg: './gallery/ortho_before.jpg',
    afterImg: './gallery/ortho_after.jpg',
    dentistNotes: 'Symmetrical arch expansion with ideal overjet and overbite balance.',
    patientAge: '22 yrs, College Student',
  },
  {
    id: 'case_whitening',
    title: 'Laser Teeth Whitening & Stain Removal',
    category: 'Cosmetic Whitening',
    duration: '45-Min Session',
    description: 'Elimination of deep extrinsic yellow staining and enamel discoloration using professional laser-activated whitening technology.',
    beforeImg: './gallery/whitening_before_hd.jpg',
    afterImg: './gallery/whitening_after_hd.jpg',
    dentistNotes: 'Elevated 6 VITA shades lighter with natural enamel luster preserved.',
    patientAge: '38 yrs, Business Owner',
  },
];

export const SmileGallery: React.FC<{ onBookService?: (serviceName: string) => void }> = ({ onBookService }) => {
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({
    case_scaling: 50,
    case_implant: 50,
    case_ortho: 50,
    case_whitening: 50,
  });

  const handleSliderMove = (id: string, val: number) => {
    setSliderPositions((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-slate-100/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Verified Clinical Outcomes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Smile Transformations & Results
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Drag the interactive slider sideways on each clinical case below to compare the genuine before and after results performed at Dr. Pal's Dental Clinic.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASES.map((item) => {
            const sliderPos = sliderPositions[item.id] ?? 50;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Comparison Box with Interactive Slider */}
                <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-900 select-none">
                  {/* After Image (Background) */}
                  <img
                    src={item.afterImg}
                    alt={`${item.title} After Treatment`}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600 text-white uppercase tracking-wider shadow-sm select-none">
                    After
                  </span>

                  {/* Before Image (Pixel-perfect overlay with CSS clip-path) */}
                  <img
                    src={item.beforeImg}
                    alt={`${item.title} Before Treatment`}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/85 text-white uppercase tracking-wider shadow-sm select-none">
                    Before
                  </span>

                  {/* Divider Line & Interactive Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl pointer-events-none z-20"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-cyan-800 shadow-lg flex items-center justify-center font-bold text-xs border-2 border-cyan-500">
                      ↔
                    </div>
                  </div>

                  {/* Range Input covering the area for seamless mouse/touch drag */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => handleSliderMove(item.id, Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                    aria-label={`Before and after slider for ${item.title}`}
                  />
                </div>

                {/* Details Card */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-cyan-700 uppercase tracking-wider bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                        {item.category}
                      </span>
                      <span className="text-slate-500 font-medium">{item.duration}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 space-y-1.5">
                      <p>
                        <strong className="text-slate-800 font-semibold">Clinical Note:</strong> {item.dentistNotes}
                      </p>
                      <p className="text-slate-400 font-medium">
                        Patient Profile: {item.patientAge}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      100% Genuine Clinical Case
                    </span>
                    {onBookService && (
                      <button
                        type="button"
                        onClick={() => onBookService(item.title)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 transition cursor-pointer"
                      >
                        Book Consultation
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
