import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Appointment, DentalRecord, ToothCondition } from '../../types';
import { DentalToothChart } from '../DentalToothChart';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, XCircle, FileText, 
  Pill, Plus, User, Phone, Droplet, AlertTriangle, ShieldCheck, 
  Download, Printer, Sparkles, ChevronRight
} from 'lucide-react';

interface PatientDashboardProps {
  onBookNewAppointment: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onBookNewAppointment }) => {
  const { user, getAuthHeaders, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'appointments' | 'chart' | 'prescriptions' | 'profile'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [toothData, setToothData] = useState<Record<number, ToothCondition>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [allergies, setAllergies] = useState(user?.allergies || '');
  const [medicalNotes, setMedicalNotes] = useState(user?.medicalNotes || '');

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const [aptsRes, recsRes, chartRes] = await Promise.all([
        fetch('/api/appointments', { headers }),
        fetch(`/api/patients/${user.id}/records`, { headers }),
        fetch(`/api/patients/${user.id}/tooth-chart`, { headers }),
      ]);

      if (aptsRes.ok) setAppointments(await aptsRes.json());
      if (recsRes.ok) setRecords(await recsRes.json());
      if (chartRes.ok) setToothData(await chartRes.json());
    } catch (e) {
      console.error('Failed to load patient dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ phone, bloodGroup, allergies, medicalNotes });
    setIsEditingProfile(false);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Verification Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Patient Welcome Hero Card */}
      <div className="relative rounded-3xl bg-linear-to-r from-sky-900 via-cyan-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-cyan-400/40 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Verified Patient
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {user?.id.slice(-6).toUpperCase()}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Welcome back, {user?.name}
              </h2>
              <p className="text-sm text-cyan-100/80 mt-0.5">
                Dr. Pal's Dental Clinic Patient Care Dashboard
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onBookNewAppointment}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Quick Health Vitals Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block">Blood Group</span>
              <span className="font-bold text-white">{user?.bloodGroup || 'Not specified'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block">Allergies</span>
              <span className="font-bold text-white truncate max-w-[120px]">{user?.allergies || 'None recorded'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block">Total Visits</span>
              <span className="font-bold text-white">{appointments.length} Consultations</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block">Primary Dentist</span>
              <span className="font-bold text-white">Dr. S. Pal, MDS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chart')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'chart'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>32-Tooth Health Chart</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'prescriptions'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Clinical Records & Prescriptions ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Medical History</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No scheduled appointments yet</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Schedule your next checkup, teeth whitening, or consultation with Dr. Pal.
              </p>
              <button
                onClick={onBookNewAppointment}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
              >
                Book Appointment Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-cyan-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-slate-400 block">
                          Booking #{apt.id.slice(-6).toUpperCase()}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">{apt.service}</h4>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{apt.time}</span>
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-slate-600 mb-2">
                        <strong className="text-slate-800 font-semibold">Your Note:</strong> {apt.notes}
                      </p>
                    )}

                    {apt.doctorNotes && (
                      <div className="p-2.5 rounded-lg bg-cyan-50/70 border border-cyan-100 text-xs text-cyan-900 mb-3">
                        <strong className="block font-bold text-cyan-950 mb-0.5">Clinical Note from Dr. Pal:</strong>
                        {apt.doctorNotes}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Estimated Fee:</span>
                      <span className="font-bold text-slate-900">₹{apt.estimatedCost.toLocaleString('en-IN')}</span>
                      {apt.paid && (
                        <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          PAID
                        </span>
                      )}
                    </div>

                    {apt.status === 'pending' && (
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 32-TOOTH CHART */}
      {activeTab === 'chart' && (
        <DentalToothChart toothData={toothData} isEditable={false} />
      )}

      {/* TAB 3: RECORDS & PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          {records.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No clinical records on file yet</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Your digital prescriptions, procedure history, and diagnosis will appear here after your first consultation.
              </p>
            </div>
          ) : (
            records.map((rec) => (
              <div key={rec.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
                      Clinical Treatment Record • {rec.date}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">{rec.procedure}</h4>
                    <p className="text-xs text-slate-500">Supervising Surgeon: {rec.doctorName}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Procedure Cost</span>
                    <span className="text-base font-bold text-slate-900">₹{rec.cost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block font-bold text-slate-700 mb-1">Diagnosis & Clinical Observation:</strong>
                    <p className="text-slate-600 leading-relaxed">{rec.diagnosis}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block font-bold text-slate-700 mb-1">Treated Tooth Numbers (FDI):</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.toothNumbers.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold">
                          Tooth #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prescriptions */}
                {rec.prescriptions && rec.prescriptions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-cyan-600" />
                      Prescribed Medication
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-100">
                            <th className="py-2">Medicine Name</th>
                            <th className="py-2">Dosage Instructions</th>
                            <th className="py-2">Course Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rec.prescriptions.map((p, idx) => (
                            <tr key={idx} className="text-slate-700">
                              <td className="py-2 font-bold text-slate-900">{p.medicine}</td>
                              <td className="py-2">{p.dosage}</td>
                              <td className="py-2 font-medium text-cyan-700">{p.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: PROFILE & MEDICAL NOTES */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Personal & Dental History Profile</h4>
              <p className="text-xs text-slate-500">Keep your allergies and medical history updated for safe treatment.</p>
            </div>
            {!isEditingProfile && (
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Known Drug Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Latex, Sulfa drugs"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Conditions & Dental History</label>
                <textarea
                  rows={3}
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="e.g. Diabetes, Hypertension, Bleeding tendencies, previous extractions"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Name</span>
                  <span className="font-semibold text-slate-900">{user?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email</span>
                  <span className="font-semibold text-slate-900">{user?.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Phone</span>
                  <span className="font-semibold text-slate-900">{user?.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Blood Group</span>
                  <span className="font-semibold text-slate-900">{user?.bloodGroup || 'Not specified'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Allergies:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg text-xs">
                  {user?.allergies || 'No known allergies reported.'}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Medical Conditions & Dental History:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg text-xs leading-relaxed">
                  {user?.medicalNotes || 'No specific health conditions recorded.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
