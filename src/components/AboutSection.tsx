import React from 'react';
import { Award, ShieldCheck, Heart, Stethoscope, CheckCircle2, MapPin, Sparkles, Building2, Star } from 'lucide-react';

export const AboutSection: React.FC<{ onBookClick?: () => void }> = ({ onBookClick }) => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-slate-50/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Official Clinical Credentials & Medical Seal Emblem (No random photo) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-linear-to-b from-slate-900 via-sky-950 to-cyan-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border-4 border-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Doctor Crest / Official Insignia */}
              <div className="text-center relative z-10 space-y-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-linear-to-tr from-cyan-600 via-sky-600 to-teal-400 p-1 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full rounded-[22px] bg-slate-900/90 flex flex-col items-center justify-center text-white">
                    <span className="text-3xl mb-0.5">🦷</span>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">MDS CLINIC</span>
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Verified Chief Dental Surgeon
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Dr. S. Pal
                  </h3>
                  <p className="text-cyan-200 text-sm font-semibold mt-1">
                    BDS, MDS (Prosthodontics & Oral Implantology)
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Consultant Cosmetic Dentist & Implant Specialist
                  </p>
                </div>

                {/* Ratings & Key Metrics */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-left">
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <span className="text-slate-400 text-[10px] block uppercase font-medium">Experience</span>
                    <span className="text-xl font-bold text-white">15+ Years</span>
                    <span className="text-[10px] text-cyan-300 block">Dahisar West, Mumbai</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <span className="text-slate-400 text-[10px] block uppercase font-medium">Patients Treated</span>
                    <span className="text-xl font-bold text-emerald-300">12,000+</span>
                    <span className="text-[10px] text-emerald-200 block">4.9/5 Patient Rating</span>
                  </div>
                </div>

                <div className="pt-2 text-left bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Opposite Dahisar Railway Station (West), Mumbai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>State-Of-The-Art Digital Operatory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clinic Philosophy & Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
              <Award className="w-3.5 h-3.5 text-cyan-600" />
              About Dr. Pal's Dental Practice
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Dr. S. Pal, <span className="text-cyan-700 font-sans font-normal text-2xl">BDS, MDS</span>
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Welcome to <strong>Dr. Pal's Dental Clinic</strong> in Dahisar West, Mumbai. Our clinic was founded with a singular conviction: visiting the dentist should be a calm, dignified, and pain-free experience.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Specializing in advanced Prosthodontics, cosmetic smile redesign, and bio-compatible dental implants, Dr. Pal integrates modern European technology with a warm, patient-first approach. We eliminate dental anxiety through gentle techniques, local numbing gel protocols, and complete transparency.
            </p>

            {/* Core Values Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Zero-Pain Commitment</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Gentle computerized anesthesia and soft-touch micro-dentistry ensuring zero fear or discomfort.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Strict Sterility Assurance</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Hospital-grade 6-step sterilization protocols with individual sterile instrumentation kits.
                </p>
              </div>
            </div>

            {/* Credentials Badges List */}
            <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Member of the Indian Dental Association (IDA) & International Congress of Oral Implantologists (ICOI)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Certified Digital Smile Design (DSD) & CAD-CAM Ceramic Restorations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Convenient Dahisar West location right opposite the railway station</span>
              </div>
            </div>

            {onBookClick && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onBookClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-linear-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-md shadow-cyan-600/20 transition cursor-pointer"
                >
                  Schedule Consultation with Dr. Pal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
