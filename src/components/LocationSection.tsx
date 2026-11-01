import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation, CheckCircle2 } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const address = "Shop No. 5, Soniya Budhiya Compound, LT Road, opposite Railway Station, near Saikrupa Mall, Tawde Wadi, Dahisar West, Mumbai, Maharashtra 400068";
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Dr Pal's Dental Clinic Dahisar West Mumbai")}`;

  return (
    <section id="location" className="py-16 lg:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200 mb-3">
            Visit Our Clinic
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Clinic Location & Hours
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Conveniently situated right opposite Dahisar West Railway Station, near Saikrupa Mall. Easy access by local train, metro, and road.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact & Hours Card */}
          <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block mb-1">
                  Clinic Landmark Address
                </span>
                <div className="flex items-start gap-3 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Dr. Pal's Dental Clinic</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{address}</p>
                    <p className="text-[11px] text-cyan-700 font-semibold mt-1">
                      Landmark: Opposite Dahisar Railway Station, adjacent to Saikrupa Mall
                    </p>
                  </div>
                </div>
              </div>

              {/* Phones & Email */}
              <div className="space-y-3 pt-4 border-t border-slate-200/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Primary Helpline & Appointments</span>
                    <a href="tel:+917977159187" className="font-bold text-slate-900 hover:text-cyan-700 text-sm">
                      +91 79771 59187
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Enquiries</span>
                    <a href="mailto:contact@drpalsdental.com" className="font-bold text-slate-900 hover:text-cyan-700">
                      contact@drpalsdental.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-4 border-t border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  Clinic Timings
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-600 font-medium">Monday - Friday</span>
                    <span className="font-bold text-slate-900">09:00 AM - 08:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-600 font-medium">Saturday</span>
                    <span className="font-bold text-slate-900">09:30 AM - 06:00 PM</span>
                  </div>
                  <div className="flex justify-between py-1 text-cyan-800 font-medium">
                    <span>Sunday</span>
                    <span className="font-bold">10:00 AM - 02:00 PM (Emergency)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps Navigation</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-75" />
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative min-h-[380px] flex flex-col">
            <iframe
              title="Dr. Pal's Dental Clinic Location Map"
              src="https://maps.google.com/maps?q=Dahisar+West+Railway+Station+Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[380px] border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Quick Badge overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md text-xs">
              <span className="font-bold text-slate-900 block">Dahisar West Station</span>
              <span className="text-[11px] text-cyan-700 font-medium">Just 2 mins walk (Opposite Platform 1)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
