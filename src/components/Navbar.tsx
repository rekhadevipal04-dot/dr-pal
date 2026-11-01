import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Phone } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/85 backdrop-blur-xs border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo Branding */}
        <button
          onClick={handleScrollToTop}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="h-10 px-2 py-1 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shadow-xs group-hover:border-cyan-300 transition-colors">
            <img
              src="./dr_pals_real_logo.png"
              alt="Dr. Pal's Dental Clinic Real Logo"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold text-slate-900 tracking-tight group-hover:text-cyan-700 transition">
                Dr. Pal's Dental Clinic
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                MDS
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block -mt-0.5">
              Dahisar West, Mumbai • 4.9 ★ Google Rated
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleNavClick('gallery')}
            className="px-3 py-2 rounded-lg hover:text-cyan-700 hover:bg-slate-100/70 transition cursor-pointer"
          >
            Smile Transformations
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className="px-3 py-2 rounded-lg hover:text-cyan-700 hover:bg-slate-100/70 transition cursor-pointer"
          >
            Specialized Services
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="px-3 py-2 rounded-lg hover:text-cyan-700 hover:bg-slate-100/70 transition cursor-pointer"
          >
            About Dr. Pal
          </button>
          <button
            onClick={() => handleNavClick('testimonials')}
            className="px-3 py-2 rounded-lg hover:text-cyan-700 hover:bg-slate-100/70 transition cursor-pointer flex items-center gap-1"
          >
            <span>Patient Reviews</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">4.9★</span>
          </button>
          <button
            onClick={() => handleNavClick('location')}
            className="px-3 py-2 rounded-lg hover:text-cyan-700 hover:bg-slate-100/70 transition cursor-pointer"
          >
            Directions & Contact
          </button>
        </nav>

        {/* Right Action: Call Us & Book Visit (No Portal / No Sign-In) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:+919820123456"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition border border-slate-200 hover:border-emerald-300 shadow-2xs group cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Call Us: +91 98201 23456</span>
          </a>

          {/* Book Appointment CTA */}
          <button
            onClick={() => onOpenBooking()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-md shadow-cyan-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>
        </div>

        {/* Mobile Header Buttons */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="tel:+919820123456"
            className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
            aria-label="Call Dr. Pal's Dental Clinic"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => onOpenBooking()}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-cyan-600"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (No Sign In or Portal options) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('gallery')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Smile Transformations
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Specialized Services
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            About Dr. Pal
          </button>
          <button
            onClick={() => handleNavClick('testimonials')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Patient Reviews & Stories</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">4.9★</span>
          </button>
          <button
            onClick={() => handleNavClick('location')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clinic Directions & Map
          </button>

          {/* Direct Call & Book Actions in Mobile Menu */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="tel:+919820123456"
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-center flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us: +91 98201 23456</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-cyan-600 hover:bg-cyan-700 text-white text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Priority Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
