import React from 'react';
import { Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';

export const Footer: React.FC<{
  onNavigateSection: (id: string) => void;
  onOpenBooking: () => void;
}> = ({ onNavigateSection, onOpenBooking }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 px-2 py-1 rounded-xl bg-white border border-slate-700 flex items-center justify-center">
                <img
                  src="./dr_pals_real_logo.png"
                  alt="Dr. Pal's Dental Clinic Real Logo"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="font-serif text-lg font-bold text-white">
                Dr. Pal's Dental Clinic
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premier dental care facility in Dahisar West, Mumbai. Specializing in advanced painless root canals, digital smile makeovers, and bio-compatible dental implants.
            </p>
            <div className="text-[11px] text-cyan-400 font-medium">
              Reg. ISO 9001:2015 Certified Dental Healthcare Center
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Explore Clinic
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateSection('gallery')}
                  className="hover:text-cyan-400 transition"
                >
                  Smile Transformations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('services')}
                  className="hover:text-cyan-400 transition"
                >
                  Specialized Dental Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('about')}
                  className="hover:text-cyan-400 transition"
                >
                  About Dr. S. Pal, MDS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('testimonials')}
                  className="hover:text-cyan-400 transition flex items-center gap-1.5"
                >
                  <span>Patient Reviews</span>
                  <span className="text-[10px] font-bold text-amber-400">★ 4.9</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('location')}
                  className="hover:text-cyan-400 transition"
                >
                  Location & Map Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Specializations */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Specialized Care
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Single Sitting Painless Root Canal</li>
              <li>Laser Teeth Whitening (Philips Zoom)</li>
              <li>Permanent Swiss Dental Implants</li>
              <li>Ceramic Porcelain Veneers</li>
              <li>Ultrasonic Cleaning & Gum Polish</li>
              <li>Invisible Clear Aligners</li>
            </ul>
          </div>

          {/* Col 4: Contact & Appointments */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Bookings & Enquiries
            </h4>
            <div className="space-y-3">
              <p className="text-slate-400 leading-relaxed">
                Shop No. 5, Soniya Budhiya Compound, LT Road, opp. Railway Station, Dahisar West, Mumbai 400068
              </p>
              <a
                href="tel:+919820123456"
                className="inline-flex items-center gap-2 text-white hover:text-emerald-400 font-bold text-sm transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 98201 23456</span>
              </a>
              <button
                onClick={onOpenBooking}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition shadow-sm text-center cursor-pointer"
              >
                Schedule Visit Now
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Dr. Pal's Dental Clinic. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Sterility guaranteed & patient comfort prioritized</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
