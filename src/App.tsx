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
  Sparkles, Calendar, Phone, Clock
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Fixed Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        <div>
          {/* Hero Welcome Banner */}
          <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-linear-to-b from-cyan-50/80 via-sky-50/50 to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-cyan-800 border border-cyan-200 shadow-xs mb-6">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Dahisar West's Premier Dental Clinic & Smile Center</span>
                <span className="flex items-center text-amber-500 font-bold ml-1">
                  ★★★★★ <span className="text-slate-600 text-[10px] ml-1">(4.9/5 from 300+ Google Reviews)</span>
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
                Experience Painless Dental Care & <span className="bg-linear-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">Flawless Smiles</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Led by <strong>Dr. S. Pal (BDS, MDS Prosthodontics & Oral Implantology)</strong>. Advanced painless root canals, computer-guided dental implants, laser whitening, and dedicated patient care.
              </p>

              {/* Action Buttons: Book Priority Appointment & Call Us */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-lg shadow-cyan-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Priority Appointment
                </button>

                <a
                  href="tel:+919820123456"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300/80 shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <Phone className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Call Us: +91 98201 23456</span>
                </a>
              </div>

              {/* Trust Metrics Bar */}
              <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <span className="block text-2xl lg:text-3xl font-bold text-slate-900">15+ Years</span>
                  <span className="text-xs text-slate-500 font-medium">Clinical Experience</span>
                </div>
                <div>
                  <span className="block text-2xl lg:text-3xl font-bold text-cyan-700">12,000+</span>
                  <span className="text-xs text-slate-500 font-medium">Smiles Restored</span>
                </div>
                <div>
                  <span className="block text-2xl lg:text-3xl font-bold text-slate-900">100% Sterile</span>
                  <span className="text-xs text-slate-500 font-medium">Class-B Autoclave</span>
                </div>
                <div>
                  <span className="block text-2xl lg:text-3xl font-bold text-cyan-700">0% Pain</span>
                  <span className="text-xs text-slate-500 font-medium">Computerized Anesthesia</span>
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

          {/* Direct Consultation & Call Us Helpline Card (Replaced Patient/Doctor Portal) */}
          <section className="py-14 bg-linear-to-r from-sky-900 via-cyan-900 to-slate-900 text-white text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 mb-3 border border-emerald-400/30">
                <Phone className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Need Immediate Dental Consultation or Emergency Care?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-cyan-100/80 max-w-xl mx-auto">
                Speak directly with Dr. Pal's Dental Clinic front-desk for quick consultations, severe toothache relief, or same-day appointment scheduling.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
                <a
                  href="tel:+919820123456"
                  className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us Now: +91 98201 23456</span>
                </a>

                <button
                  onClick={() => handleOpenBooking()}
                  className="px-7 py-3.5 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/25 text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-cyan-300" />
                  <span>Book Appointment Online</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-cyan-200/80 flex flex-wrap items-center justify-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
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

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preSelectedService={selectedServiceForBooking}
      />
    </div>
  );
}
