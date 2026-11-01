import React, { useState } from 'react';
import { ToothCondition } from '../types';
import { ShieldCheck, Info, Check, AlertCircle, Wrench, Sparkles } from 'lucide-react';

interface DentalToothChartProps {
  toothData: Record<number, ToothCondition>;
  isEditable?: boolean;
  onUpdateTooth?: (toothNumber: number, status: ToothCondition['status'], notes?: string) => Promise<void>;
}

// Universal numbering system: 1-16 Upper arch, 17-32 Lower arch
const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const LOWER_TEETH = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

const TOOTH_NAMES: Record<number, string> = {
  1: 'Upper Right 3rd Molar (Wisdom)',
  2: 'Upper Right 2nd Molar',
  3: 'Upper Right 1st Molar',
  4: 'Upper Right 2nd Premolar',
  5: 'Upper Right 1st Premolar',
  6: 'Upper Right Canine',
  7: 'Upper Right Lateral Incisor',
  8: 'Upper Right Central Incisor',
  9: 'Upper Left Central Incisor',
  10: 'Upper Left Lateral Incisor',
  11: 'Upper Left Canine',
  12: 'Upper Left 1st Premolar',
  13: 'Upper Left 2nd Premolar',
  14: 'Upper Left 1st Molar',
  15: 'Upper Left 2nd Molar',
  16: 'Upper Left 3rd Molar (Wisdom)',
  17: 'Lower Left 3rd Molar (Wisdom)',
  18: 'Lower Left 2nd Molar',
  19: 'Lower Left 1st Molar',
  20: 'Lower Left 2nd Premolar',
  21: 'Lower Left 1st Premolar',
  22: 'Lower Left Canine',
  23: 'Lower Left Lateral Incisor',
  24: 'Lower Left Central Incisor',
  25: 'Lower Right Central Incisor',
  26: 'Lower Right Lateral Incisor',
  27: 'Lower Right Canine',
  28: 'Lower Right 1st Premolar',
  29: 'Lower Right 2nd Premolar',
  30: 'Lower Right 1st Molar',
  31: 'Lower Right 2nd Molar',
  32: 'Lower Right 3rd Molar (Wisdom)',
};

export const DentalToothChart: React.FC<DentalToothChartProps> = ({
  toothData,
  isEditable = false,
  onUpdateTooth,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<ToothCondition['status']>('healthy');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const getToothStatus = (num: number): ToothCondition => {
    return toothData[num] || { number: num, status: 'healthy' };
  };

  const getStatusColor = (status: ToothCondition['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100';
      case 'cavity':
        return 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 animate-pulse';
      case 'treated':
        return 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100';
      case 'crown':
        return 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100';
      case 'implant':
        return 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100';
      case 'missing':
        return 'bg-slate-100 text-slate-400 border-slate-200 line-through';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    }
  };

  const handleToothClick = (num: number) => {
    setSelectedTooth(num);
    const curr = getToothStatus(num);
    setEditStatus(curr.status);
    setEditNotes(curr.notes || '');
  };

  const handleSaveTooth = async () => {
    if (selectedTooth === null || !onUpdateTooth) return;
    setIsSaving(true);
    try {
      await onUpdateTooth(selectedTooth, editStatus, editNotes);
      setSelectedTooth(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Interactive 32-Tooth Dental Health Chart</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              Universal FDI System
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Click any tooth to examine diagnosis, restorative caps, implants, and periodontal notes.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Healthy
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Cavity / Need Care
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span> Treated / RCT
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Crown / Cap
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Dental Implant
          </span>
        </div>
      </div>

      {/* Tooth Arch Graphical Representation */}
      <div className="space-y-6 select-none">
        {/* Upper Arch (Maxilla) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex justify-between">
            <span>Upper Right (1-8)</span>
            <span className="text-cyan-600 font-semibold">MAXILLARY ARCH</span>
            <span>Upper Left (9-16)</span>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 sm:gap-2">
            {UPPER_TEETH.map((num) => {
              const tooth = getToothStatus(num);
              const isSelected = selectedTooth === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleToothClick(num)}
                  className={`relative p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-cyan-500 scale-105 z-10 shadow-md' : ''
                  } ${getStatusColor(tooth.status)}`}
                  title={`${num}: ${TOOTH_NAMES[num]} (${tooth.status})`}
                >
                  <span className="text-[10px] sm:text-xs font-mono font-bold">{num}</span>
                  <div className="w-4 h-5 sm:w-5 sm:h-6 my-1 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-85">
                      <path d="M7 2C4 2 2 4.5 2 8C2 12 5 19 7 21C8 22 9.5 22 10.5 20C11.5 18 12 18 12 18C12 18 12.5 18 13.5 20C14.5 22 16 22 17 21C19 19 22 12 22 8C22 4.5 20 2 17 2C14 2 12 4 12 4C12 4 10 2 7 2Z" />
                    </svg>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-tighter truncate max-w-full">
                    {tooth.status.slice(0, 4)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Central Gum Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent my-4"></div>

        {/* Lower Arch (Mandible) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex justify-between">
            <span>Lower Right (32-25)</span>
            <span className="text-cyan-600 font-semibold">MANDIBULAR ARCH</span>
            <span>Lower Left (24-17)</span>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 sm:gap-2">
            {LOWER_TEETH.map((num) => {
              const tooth = getToothStatus(num);
              const isSelected = selectedTooth === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleToothClick(num)}
                  className={`relative p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-cyan-500 scale-105 z-10 shadow-md' : ''
                  } ${getStatusColor(tooth.status)}`}
                  title={`${num}: ${TOOTH_NAMES[num]} (${tooth.status})`}
                >
                  <span className="text-[10px] sm:text-xs font-mono font-bold">{num}</span>
                  <div className="w-4 h-5 sm:w-5 sm:h-6 my-1 flex items-center justify-center transform rotate-180">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-85">
                      <path d="M7 2C4 2 2 4.5 2 8C2 12 5 19 7 21C8 22 9.5 22 10.5 20C11.5 18 12 18 12 18C12 18 12.5 18 13.5 20C14.5 22 16 22 17 21C19 19 22 12 22 8C22 4.5 20 2 17 2C14 2 12 4 12 4C12 4 10 2 7 2Z" />
                    </svg>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-tighter truncate max-w-full">
                    {tooth.status.slice(0, 4)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Tooth Inspection / Editor Card */}
      {selectedTooth !== null && (
        <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-cyan-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Tooth Details</span>
              <h5 className="text-base font-bold text-slate-900">
                #{selectedTooth}: {TOOTH_NAMES[selectedTooth]}
              </h5>
            </div>
            <button
              onClick={() => setSelectedTooth(null)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>

          {isEditable ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Condition Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {(['healthy', 'cavity', 'treated', 'crown', 'implant', 'missing'] as ToothCondition['status'][]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setEditStatus(st)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold capitalize border transition-all ${
                          editStatus === st ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor / Clinical Notes</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Zirconia Crown cemented, check margins in 6 months"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTooth(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTooth}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
                >
                  {isSaving ? 'Saving...' : 'Update Tooth Record'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Current Health:</span>
                  <span className="text-xs font-bold capitalize px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    {getToothStatus(selectedTooth).status}
                  </span>
                </div>
                <p className="text-sm text-slate-700">
                  {getToothStatus(selectedTooth).notes || 'Healthy enamel and bone structure with no current interventions required.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
