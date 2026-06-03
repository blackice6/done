import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Save, RotateCcw, School, MapPin, Phone, Mail, Award } from 'lucide-react';
import type { Term } from '../types';

export default function Settings() {
  const { settings, updateSettings, resetData, addAuditLog } = useData();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    addAuditLog({ userId: 1, userName: 'Admin', action: 'UPDATE_SETTINGS', details: 'Updated school settings' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    resetData();
    addAuditLog({ userId: 1, userName: 'Admin', action: 'RESET_DATA', details: 'Reset all system data to defaults' });
    setForm({ ...settings });
    setShowReset(false);
  };

  const updateFee = (index: number, field: 'grade' | 'amount', value: string | number) => {
    const updated = [...form.feeStructure];
    if (field === 'grade') updated[index] = { ...updated[index], grade: value as string };
    else updated[index] = { ...updated[index], amount: value as number };
    setForm({ ...form, feeStructure: updated });
  };

  const addFeeRow = () => {
    setForm({ ...form, feeStructure: [...form.feeStructure, { grade: '', amount: 0 }] });
  };

  const removeFeeRow = (index: number) => {
    setForm({ ...form, feeStructure: form.feeStructure.filter((_, i) => i !== index) });
  };

  const terms: Term[] = ['Term 1', 'Term 2', 'Term 3'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">School Settings</h1>
        <p className="text-gray-500 text-sm">Configure your school details and preferences</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn">
          ✅ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <School className="w-5 h-5 text-amber-500" /> School Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">School Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Motto</label>
              <input value={form.motto} onChange={e => setForm({ ...form, motto: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">County</label>
              <input value={form.county} onChange={e => setForm({ ...form, county: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Phone className="w-4 h-4" /> Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Mail className="w-4 h-4" /> Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Number</label>
              <input value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Award className="w-4 h-4" /> Principal Name</label>
              <input value={form.principalName} onChange={e => setForm({ ...form, principalName: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Academic Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Academic Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Term</label>
              <select value={form.currentTerm} onChange={e => setForm({ ...form, currentTerm: e.target.value as Term })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                {terms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Year</label>
              <input type="number" value={form.currentYear} onChange={e => setForm({ ...form, currentYear: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Fee Structure</h3>
            <button type="button" onClick={addFeeRow} className="text-sm font-semibold text-amber-600 hover:text-amber-700">+ Add Row</button>
          </div>
          <div className="space-y-2">
            {form.feeStructure.map((fee, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={fee.grade} onChange={e => updateFee(i, 'grade', e.target.value)} placeholder="Grade name"
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 outline-none text-sm" />
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-sm text-gray-500">KES</span>
                  <input type="number" value={fee.amount} onChange={e => updateFee(i, 'amount', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 outline-none text-sm" />
                </div>
                <button type="button" onClick={() => removeFeeRow(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
            <Save className="w-5 h-5" /> Save Settings
          </button>
          <button type="button" onClick={() => setShowReset(true)} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-100 transition-all">
            <RotateCcw className="w-5 h-5" /> Reset All Data
          </button>
        </div>
      </form>

      {showReset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-2">⚠️ Reset All Data?</h3>
            <p className="text-gray-500 text-sm mb-6">This will delete ALL custom data and restore defaults. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleReset} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">Reset Everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
