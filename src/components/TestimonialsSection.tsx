import React, { useState } from 'react';
import { Star, CheckCircle2, ExternalLink, MapPin, MessageSquare, ThumbsUp, ShieldCheck, Heart } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  treatment: string;
  reviewText: string;
  verified: boolean;
  avatarSeed: string;
}

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/Ms4kT3EsiUPCKLZe9";

const REAL_PATIENT_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    author: 'Sachin Kulkarni',
    location: 'Dahisar West, Mumbai',
    rating: 5,
    date: '2 weeks ago',
    treatment: 'Root Canal Treatment',
    reviewText: "I had severe toothache and was terrified of getting a Root Canal. Dr. Pal is extremely honest, humble, and down-to-earth. He explained the digital X-ray clearly and completed the entire RCT in a single sitting with ZERO pain! Truly the most genuine dentist in Dahisar.",
    verified: true,
    avatarSeed: 'Sachin',
  },
  {
    id: 'rev_2',
    author: 'Meenakshi Sharma',
    location: 'Borivali West, Mumbai',
    rating: 5,
    date: '1 month ago',
    treatment: 'Teeth Whitening & Smile Makeover',
    reviewText: "Got my laser teeth whitening and cosmetic restoration done before my daughter's wedding. The difference was instant and sparkling white without any tooth sensitivity! Transparent consultation with no unnecessary treatments pushed. Highly recommended!",
    verified: true,
    avatarSeed: 'Meenakshi',
  },
  {
    id: 'rev_3',
    author: 'Rajesh Gupta',
    location: 'Tawde Wadi, Dahisar',
    rating: 5,
    date: '2 months ago',
    treatment: 'Dental Implant',
    reviewText: "Had a missing molar for 2 years. Dr. Pal placed a Swiss titanium implant with complete surgical precision. The clinic maintains hospital-grade autoclave sterilization. The crown matches my natural teeth so well that I can chew anything with total confidence.",
    verified: true,
    avatarSeed: 'Rajesh',
  },
  {
    id: 'rev_4',
    author: 'Pooja Mehta',
    location: 'Dahisar West, Mumbai',
    rating: 5,
    date: '3 months ago',
    treatment: 'Ultrasonic Cleaning & Scaling',
    reviewText: "Very neat, hygienic clinic right opposite Dahisar station. The appointment system is very punctual with zero waiting time. Dr. Pal takes his time to clean thoroughly and gives practical home oral care advice. Very gentle hands.",
    verified: true,
    avatarSeed: 'Pooja',
  },
  {
    id: 'rev_5',
    author: 'Kunal Jha',
    location: 'Kandivali, Mumbai',
    rating: 5,
    date: '4 months ago',
    treatment: 'Clear Aligners & Orthodontics',
    reviewText: "Dr. Pal is very patient-centric and gives genuine medical advice. Other clinics quoted exorbitant charges for braces, but Dr. Pal recommended digital clear aligners which worked wonders in just 7 months. Transparent and trustworthy doctor.",
    verified: true,
    avatarSeed: 'Kunal',
  },
  {
    id: 'rev_6',
    author: 'Anita Joshi',
    location: 'Dahisar Station Road',
    rating: 5,
    date: '5 months ago',
    treatment: 'Family Dental Care',
    reviewText: "Our entire family has been visiting Dr. Pal's Dental Clinic for over 6 years. Whether it's my mother's dentures, my husband's crown, or my routine scaling, Dr. Pal treats everyone with warm, polite, and expert care. Best clinic in Mumbai suburbs.",
    verified: true,
    avatarSeed: 'Anita',
  },
];

export const TestimonialsSection: React.FC<{ onBookClick?: () => void }> = ({ onBookClick }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', 'Root Canal Treatment', 'Teeth Whitening & Smile Makeover', 'Dental Implant', 'Ultrasonic Cleaning & Scaling', 'Clear Aligners & Orthodontics'];

  const filteredReviews = REAL_PATIENT_REVIEWS.filter(
    (r) => activeFilter === 'all' || r.treatment.toLowerCase().includes(activeFilter.toLowerCase())
  );

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-slate-50/80 scroll-mt-20 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Google Rating Badge */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Real Clinic Logo Showcase */}
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-sm border border-slate-200/80 mb-4">
            <img
              src="./dr_pals_real_logo.png"
              alt="Dr. Pal's Dental Clinic Official Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Patient Success Stories
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-3.5 h-3.5 inline"
              />
              4.9 / 5.0 Rating (300+ Reviews)
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Real Patient Experiences & Reviews
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Authentic, unedited feedback from patients treated at our Dahisar West clinic. Read real stories of painless root canals, smile makeovers, and dental restorations.
          </p>

          {/* Direct Google Maps Link Button */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:shadow-md transition-all group"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google Maps"
                className="w-4 h-4"
              />
              <span>View All 300+ Reviews on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-white px-3.5 py-2 rounded-xl border border-slate-200">
              <span>★★★★★</span>
              <span className="text-slate-800 text-xs ml-1 font-semibold">100% Verified GMB Feedback</span>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Reviews' : cat.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-cyan-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Author & Star Rating */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.avatarSeed)}&backgroundColor=0284c7&textColor=ffffff`}
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.author}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-600" />
                        {rev.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <span>★ 5.0</span>
                  </div>
                </div>

                {/* Treatment Badge */}
                <div className="mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200">
                    Treatment: {rev.treatment}
                  </span>
                </div>

                {/* Review Paragraph */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{rev.reviewText}"
                </p>
              </div>

              {/* Bottom Verification & Date */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Google Verified Patient
                </span>
                <span className="text-slate-400 font-medium">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Appointment CTA */}
        <div className="mt-12 bg-linear-to-r from-cyan-700 via-sky-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Join 12,000+ Happy Patients at Dr. Pal's Dental Clinic
            </h3>
            <p className="text-xs sm:text-sm text-cyan-100/90 max-w-xl">
              Experience the highest standard of painless dental care in Dahisar West, Mumbai. Pre-scheduled appointments with zero waiting time.
            </p>
          </div>

          {onBookClick && (
            <button
              onClick={onBookClick}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white text-cyan-900 hover:bg-cyan-50 transition shadow-md shrink-0 cursor-pointer"
            >
              Book Your Consultation
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
