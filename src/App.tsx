import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SmileGallery } from './components/SmileGallery';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { 
  Sparkles, Calendar, Phone, Clock, ShieldCheck
} from 'lucide-react';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>();

  const handleOpenBooking = (serviceName?: string) => {
    setSelectedServiceForBooking(serviceName);
    setBookingModalOpen(true);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* Top Fixed Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Content Area */}
      <main className="flex-1 pt-14 sm:pt-20 pb-20 lg:pb-0">
        <div>
          {/* Hero Welcome Banner (Optimized for Mobile) */}
          <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24 bg-linear-to-b from-cyan-50/80 via-sky-50/50 to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
              {/* Rating Badge */}
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-white text-cyan-800 border border-cyan-200 shadow-2xs mb-4 sm:mb-6 max-w-full">
                <span className="flex items-center gap-1 text-cyan-700">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Dahisar West's Premier Clinic</span>
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center text-amber-500 font-bold">
                  ★★★★★ <span className="text-slate-600 text-[10px] ml-1">(4.9/5 • 300+ Reviews)</span>
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-snug">
                Experience Painless Dental Care & <span className="bg-linear-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">Flawless Smiles</span>
              </h1>

              {/* Doctor Subtext */}
              <p className="mt-3.5 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-1">
                Led by <strong>Dr. Amit Pal (BDS, MDS Prosthodontics & Oral Implantology)</strong>. Advanced painless root canals, computer-guided dental implants, and laser whitening.
              </p>

              {/* Action Buttons: Book Priority Appointment & Call Us */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-cyan-600 to-sky-600 active:from-cyan-700 shadow-lg shadow-cyan-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Book Priority Appointment</span>
                </button>

                <a
                  href="tel:+917977159187"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300/80 shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <Phone className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Call Us: +91 79771 59187</span>
                </a>
              </div>

              {/* Trust Metrics Bar (Responsive 2x2 Grid on Mobile) */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
                <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">15+ Years</span>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Clinical Experience</span>
                </div>
                <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-700">12,000+</span>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Smiles Restored</span>
                </div>
                <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">100% Sterile</span>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Class-B Autoclave</span>
                </div>
                <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-700">0% Pain</span>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Computerized Anesthesia</span>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Before & After Smile Transformation Gallery */}
          <SmileGallery onBookService={(service) => handleOpenBooking(service)} />

          {/* Specialized Dental Services Catalog (Without Pricing) */}
          <ServicesSection onSelectService={(serviceTitle) => handleOpenBooking(serviceTitle)} />

          {/* Doctor Profile & Clinic Credentials (No Fake Photos) */}
          <AboutSection onBookClick={() => handleOpenBooking()} />

          {/* Verified Patient Reviews & Success Stories from Google Maps (4.9★ Rated) */}
          <TestimonialsSection onBookClick={() => handleOpenBooking()} />

          {/* Location, Directions & Contact Section */}
          <LocationSection />

          {/* Direct Consultation & Call Us Helpline Card (Mobile Optimized) */}
          <section className="py-12 sm:py-16 bg-linear-to-r from-sky-900 via-cyan-900 to-slate-900 text-white text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 mb-3 border border-emerald-400/30">
                <Phone className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight px-1">
                Need Immediate Dental Consultation or Emergency Care?
              </h3>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-cyan-100/80 max-w-xl mx-auto leading-relaxed">
                Speak directly with Dr. Pal's Dental Clinic front-desk for quick consultations, severe toothache relief, or same-day appointment scheduling.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
                <a
                  href="tel:+917977159187"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Call Us Now: +91 79771 59187</span>
                </a>

                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/25 text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Book Appointment Online</span>
                </button>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 text-[11px] sm:text-xs text-cyan-200/80 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Mon – Sat: 10:00 AM – 1:30 PM & 5:30 PM – 9:30 PM
                </span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>Opp. Dahisar Railway Station (West), Mumbai</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={handleScrollToSection}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Floating Sticky Mobile Quick Action Bar (Visible Only on Mobile Screens) */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl safe-area-bottom">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5">
          <a
            href="tel:+917977159187"
            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 text-center"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span className="truncate">Call Clinic</span>
          </a>
          <button
            onClick={() => handleOpenBooking()}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-linear-to-r from-cyan-600 to-sky-600 active:from-cyan-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 text-center cursor-pointer"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">Book Visit</span>
          </button>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preSelectedService={selectedServiceForBooking}
      />
    </div>
  );
}
