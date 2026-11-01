import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Appointment, ClinicStats, User, DentalRecord, ToothCondition } from '../../types';
import { DentalToothChart } from '../DentalToothChart';
import {
  Users, Calendar, CheckCircle2, Clock, XCircle, Search, 
  DollarSign, Activity, FilePlus, ChevronRight, Stethoscope, 
  AlertCircle, Sparkles, Filter, Edit3, Plus, RefreshCw, Layers
} from 'lucide-react';

export const DoctorAdminDashboard: React.FC = () => {
  const { user, getAuthHeaders } = useAuth();
  const [stats, setStats] = useState<ClinicStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<(User & { appointmentCount: number; lastVisit: string })[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'charts' | 'analytics'>('appointments');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected patient for tooth chart / treatment record creation
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientToothData, setPatientToothData] = useState<Record<number, ToothCondition>>({});
  const [patientRecords, setPatientRecords] = useState<DentalRecord[]>([]);

  // Add Treatment Record modal state
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newProcedure, setNewProcedure] = useState('');
  const [newToothNumbers, setNewToothNumbers] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newCost, setNewCost] = useState('2500');
  const [newMedName, setNewMedName] = useState('Amoxicillin 500mg');
  const [newMedDosage, setNewMedDosage] = useState('1 tab thrice daily after meals');
  const [newMedDuration, setNewMedDuration] = useState('5 days');

  // Edit appointment modal state
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [editCost, setEditCost] = useState(0);
  const [editPaid, setEditPaid] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const [statsRes, aptsRes, ptsRes] = await Promise.all([
        fetch('/api/stats/overview', { headers }),
        fetch('/api/appointments', { headers }),
        fetch('/api/patients', { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (aptsRes.ok) setAppointments(await aptsRes.json());
      if (ptsRes.ok) {
        const ptsData = await ptsRes.json();
        setPatients(ptsData);
        if (ptsData.length > 0 && !selectedPatientId) {
          setSelectedPatientId(ptsData[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load doctor dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // When selected patient changes, fetch their tooth chart & records
  useEffect(() => {
    if (!selectedPatientId) return;
    const headers = getAuthHeaders();

    fetch(`/api/patients/${selectedPatientId}/tooth-chart`, { headers })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => setPatientToothData(data))
      .catch((e) => console.error(e));

    fetch(`/api/patients/${selectedPatientId}/records`, { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPatientRecords(data))
      .catch((e) => console.error(e));
  }, [selectedPatientId]);

  const handleUpdateStatus = async (id: string, status: Appointment['status']) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAppointmentNotes = async () => {
    if (!editingApt) return;
    try {
      const res = await fetch(`/api/appointments/${editingApt.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          doctorNotes,
          estimatedCost: editCost,
          paid: editPaid,
        }),
      });
      if (res.ok) {
        setEditingApt(null);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTooth = async (toothNumber: number, status: ToothCondition['status'], notes?: string) => {
    if (!selectedPatientId) return;
    try {
      const res = await fetch(`/api/patients/${selectedPatientId}/tooth-chart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ toothNumber, status, notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPatientToothData(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    try {
      const res = await fetch(`/api/patients/${selectedPatientId}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          procedure: newProcedure,
          toothNumbers: newToothNumbers ? newToothNumbers.split(',').map((s) => s.trim()) : [],
          diagnosis: newDiagnosis,
          cost: parseFloat(newCost) || 0,
          notes: newNotes,
          prescriptions: newMedName ? [{ medicine: newMedName, dosage: newMedDosage, duration: newMedDuration }] : [],
        }),
      });

      if (res.ok) {
        const newRec = await res.json();
        setPatientRecords([newRec, ...patientRecords]);
        setShowAddRecordModal(false);
        setNewProcedure('');
        setNewDiagnosis('');
        setNewNotes('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery) ||
      a.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Doctor Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-sky-950 to-cyan-950 p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-600/30 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-inner">
              <Stethoscope className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Head Dental Surgeon & Administrator
                </span>
                <span className="text-xs text-slate-400">Dr. S. Pal, BDS, MDS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Clinical Operations & Analytics
              </h2>
              <p className="text-sm text-cyan-100/70">
                Dr. Pal's Dental Clinic • Dahisar West, Mumbai Central System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
              <span>Total Active Patients</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-white">{stats?.totalPatients || patients.length}</span>
            <span className="text-[11px] text-cyan-300 block mt-1">Registered Clinical Records</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
              <span>Total Appointments</span>
              <Calendar className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-white">{stats?.totalAppointments || appointments.length}</span>
            <span className="text-[11px] text-sky-300 block mt-1">Booked Online & In-Clinic</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
              <span>Pending Confirmations</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-amber-300">
              {stats?.pendingAppointments || appointments.filter((a) => a.status === 'pending').length}
            </span>
            <span className="text-[11px] text-amber-200 block mt-1">Awaiting Slot Verification</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
              <span>Estimated Monthly Billing</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-300">
              ₹{(stats?.totalRevenue || 27200).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-200 block mt-1">Treatments & Procedures</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
          <span>Appointment Manager ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'patients'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patient Dental Records & Charting ({patients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Clinic Analytics & Services</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENT MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search patient, phone, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                    filterStatus === st
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient Details</th>
                    <th className="py-3 px-4">Requested Service</th>
                    <th className="py-3 px-4">Schedule Date & Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Estimated Fee</th>
                    <th className="py-3 px-4 text-right">Doctor Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                        No appointments match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                          <span className="text-xs text-slate-500 block">{apt.patientPhone}</span>
                          <span className="text-[11px] text-slate-400 block">{apt.patientEmail}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {apt.service}
                          {apt.notes && (
                            <span className="block text-xs text-slate-500 truncate max-w-xs italic">
                              "{apt.notes}"
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">{apt.date}</span>
                          <span className="text-xs text-cyan-700 font-semibold">{apt.time}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {apt.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              Confirmed
                            </span>
                          )}
                          {apt.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          )}
                          {apt.status === 'completed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                              Completed
                            </span>
                          )}
                          {apt.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                              Cancelled
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          ₹{apt.estimatedCost.toLocaleString('en-IN')}
                          <span className={`block text-[10px] font-bold ${apt.paid ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {apt.paid ? 'PAID' : 'UNPAID'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                                title="Approve & Confirm slot"
                              >
                                Approve
                              </button>
                            )}

                            {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition"
                                title="Mark treatment completed"
                              >
                                Complete
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setEditingApt(apt);
                                setDoctorNotes(apt.doctorNotes || '');
                                setEditCost(apt.estimatedCost);
                                setEditPaid(apt.paid);
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                              title="Clinical Notes & Cost"
                            >
                              Edit / Notes
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PATIENTS & 32-TOOTH CHARTING */}
      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Selector List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Patient Registry ({patients.length})
            </h4>
            <div className="space-y-2">
              {patients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-400 shadow-xs ring-1 ring-cyan-400'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{p.name}</span>
                        <span className="text-xs text-slate-500 block">{p.phone || p.email}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Patient Clinical Station */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                {/* Patient Summary Header Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
                      Active Patient Chart
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Blood: {selectedPatient.bloodGroup || 'N/A'} • Allergies: {selectedPatient.allergies || 'None'} • Visits: {selectedPatient.appointmentCount}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddRecordModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 shadow-sm transition"
                  >
                    <FilePlus className="w-4 h-4" />
                    + Add Treatment & Rx
                  </button>
                </div>

                {/* 32-Tooth Chart with Doctor Edit Mode */}
                <DentalToothChart
                  toothData={patientToothData}
                  isEditable={true}
                  onUpdateTooth={handleUpdateTooth}
                />

                {/* Patient Treatment Records */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <h4 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Clinical History & Past Procedures ({patientRecords.length})</span>
                  </h4>

                  {patientRecords.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No procedures logged for this patient yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {patientRecords.map((r) => (
                        <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-sm text-slate-900">{r.procedure}</span>
                            <span className="text-slate-500">{r.date}</span>
                          </div>
                          <p className="text-slate-600">
                            <strong>Diagnosis:</strong> {r.diagnosis}
                          </p>
                          {r.toothNumbers.length > 0 && (
                            <p className="text-slate-600">
                              <strong>Treated Teeth:</strong> {r.toothNumbers.join(', ')}
                            </p>
                          )}
                          {r.prescriptions && r.prescriptions.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60">
                              <strong className="block text-slate-700 mb-1">Prescription:</strong>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                                {r.prescriptions.map((m, idx) => (
                                  <li key={idx}>
                                    <span className="font-semibold text-slate-900">{m.medicine}</span> ({m.dosage} - {m.duration})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-10 bg-white rounded-2xl border text-center text-slate-400">
                Select a patient from the left column to view their medical chart.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CLINIC ANALYTICS & SERVICES */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600" />
              Service Demand Breakdown
            </h4>
            <div className="space-y-3">
              {stats?.serviceCounts &&
                Object.entries(stats.serviceCounts).map(([svc, count]) => {
                  const percent = Math.round((count / (stats.totalAppointments || 1)) * 100);
                  return (
                    <div key={svc}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{svc}</span>
                        <span>{count} visits ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-cyan-500 to-sky-600 rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              Clinic Operational Standards
            </h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-bold">Class-B Autoclave Sterilization</strong>
                  Instruments sealed in medical pouches and monitored with chemical indicators before every patient.
                </div>
              </div>

              <div className="p-3 bg-cyan-50 text-cyan-900 rounded-xl border border-cyan-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-bold">High Resolution Digital Radiography</strong>
                  Up to 90% reduced radiation compared to conventional film X-rays with instant chairside monitor view.
                </div>
              </div>

              <div className="p-3 bg-sky-50 text-sky-900 rounded-xl border border-sky-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-bold">Biocompatible Materials Only</strong>
                  Zero amalgam policy. 100% tooth-colored composite resins, Swiss titanium, and German zirconia crowns.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT APPOINTMENT / DOCTOR NOTES */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Clinical Notes & Fee Update • {editingApt.patientName}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {editingApt.service} on {editingApt.date} ({editingApt.time})
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor's Observation & Clinical Notes</label>
                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="e.g. Tooth #16 cavity cleaned, glass ionomer base placed, review next week"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee / Procedure Cost (₹)</label>
                  <input
                    type="number"
                    value={editCost}
                    onChange={(e) => setEditCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={editPaid ? 'true' : 'false'}
                    onChange={(e) => setEditPaid(e.target.value === 'true')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="false">Unpaid / Due</option>
                    <option value="true">Paid In Full</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingApt(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAppointmentNotes}
                  className="px-4 py-2 font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD TREATMENT RECORD & PRESCRIPTION */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h4 className="text-xl font-bold text-slate-900 mb-1">
              New Treatment & Prescription Record
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Patient: <strong className="text-slate-800">{selectedPatient?.name}</strong>
            </p>

            <form onSubmit={handleCreateRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Procedure Performed</label>
                <input
                  type="text"
                  required
                  value={newProcedure}
                  onChange={(e) => setNewProcedure(e.target.value)}
                  placeholder="e.g. Single Sitting Root Canal Treatment"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treated Tooth Numbers (FDI)</label>
                  <input
                    type="text"
                    value={newToothNumbers}
                    onChange={(e) => setNewToothNumbers(e.target.value)}
                    placeholder="e.g. 14, 15"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Treatment Fee (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis & Findings</label>
                <input
                  type="text"
                  required
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  placeholder="e.g. Irreversible pulpitis secondary to deep distal caries"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              {/* Prescription */}
              <div className="p-3 bg-cyan-50/70 border border-cyan-200/80 rounded-xl space-y-2">
                <span className="font-bold text-cyan-900 block">Prescription Drug Details</span>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="Drug Name (e.g. Amoxicillin 500mg)"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="Dosage (1 tab twice daily)"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newMedDuration}
                    onChange={(e) => setNewMedDuration(e.target.value)}
                    placeholder="Duration (5 days)"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor's Private Follow-Up Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Recall after 7 days for permanent restoration"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs"
                >
                  Create & Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
