import React, { useState, useEffect } from 'react';
import { DentalService } from '../types';
import { Sparkles, Activity, ShieldCheck, Smile, Zap, Layers, ArrowRight, Check } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

const DEFAULT_SERVICES: DentalService[] = [
  {
    id: 'srv_whitening',
    title: 'Advanced Laser Teeth Whitening',
    description: 'Philips Zoom WhiteSpeed laser technology elevating tooth shade by up to 8 shades in a single comfortable 45-minute sitting.',
    price: '',
    duration: '45 mins',
    category: 'Cosmetic',
    badge: 'Most Popular',
    icon: 'Sparkles',
  },
  {
    id: 'srv_rct',
    title: 'Single-Sitting Painless Root Canal',
    description: 'Precision rotary endodontics with 3D apex locator and digital X-ray verification for zero discomfort and fast relief.',
    price: '',
    duration: '60 mins',
    category: 'Endodontics',
    badge: 'Pain-Free',
    icon: 'Activity',
  },
  {
    id: 'srv_implants',
    title: 'Permanent Titanium Dental Implants',
    description: 'Bio-compatible Swiss titanium implants restoring natural bite strength, chewing power, and lifelong dental stability.',
    price: '',
    duration: '90 mins',
    category: 'Surgery',
    badge: 'Lifetime Care',
    icon: 'ShieldCheck',
  },
  {
    id: 'srv_smile',
    title: 'Digital Smile Restoration & Veneers',
    description: 'Ultra-thin E-max porcelain veneers custom designed to correct gaps, chips, discolored enamel, and minor misalignment.',
    price: '',
    duration: '60 mins',
    category: 'Cosmetic',
    badge: 'Celebrity Choice',
    icon: 'Smile',
  },
  {
    id: 'srv_cleaning',
    title: 'Ultrasonic Scaling & Air-Flow Polishing',
    description: 'Deep calculus and stain removal, gum detox treatment, and fluoride varnish protective shield for fresh breath and oral health.',
    price: '',
    duration: '30 mins',
    category: 'Preventive',
    icon: 'Zap',
  },
  {
    id: 'srv_aligners',
    title: 'Invisible Clear Aligners (Orthodontics)',
    description: 'Custom 3D-scanned transparent aligners that gently straighten teeth without metallic wires or food restrictions.',
    price: '',
    duration: '45 mins',
    category: 'Orthodontics',
    badge: 'Discreet',
    icon: 'Layers',
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<DentalService[]>(DEFAULT_SERVICES);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/services')
      .then((res) => {
        if (!res.ok) return null;
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {
        // Fallback to static DEFAULT_SERVICES on static hosting
      });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Smile':
        return <Smile className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Layers':
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const categories = ['all', 'Cosmetic', 'Endodontics', 'Surgery', 'Preventive', 'Orthodontics'];

  const filtered = services.filter((s) => activeCategory === 'all' || s.category === activeCategory);

  return (
    <section id="services" className="py-16 lg:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200 mb-3">
            Clinical Care Spectrum
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Specialized Dental Services
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            World-class dental treatments with painless computerized anesthesia, German biocompatible materials, and international sterilization protocols.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Treatments' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid - NO PRICING AS REQUESTED BY USER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((srv) => (
            <div
              key={srv.id}
              className="group relative bg-slate-50 hover:bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-cyan-400 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-inner">
                    {getIcon(srv.icon)}
                  </div>
                  {srv.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-800 border border-cyan-200">
                      {srv.badge}
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {srv.category} • {srv.duration}
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition">
                  {srv.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              {/* Action Bar - Clean without pricing */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Painless Technique
                </span>
                <button
                  type="button"
                  onClick={() => onSelectService(srv.title)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition-all shadow-sm cursor-pointer"
                >
                  <span>Book Treatment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
