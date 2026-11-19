import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Shield } from 'lucide-react';
import { useToast } from './Toast';

export default function MemberModal({ isOpen, onClose, onMemberAdded, nextId }) {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Member name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await onMemberAdded(name.trim());
      addToast(`Member "${name.trim()}" registered successfully!`, 'success');
      setName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register member');
      addToast(err.message || 'Failed to register member', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent-50 text-accent-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">Register Library Member</h3>
              <p className="text-xs text-slate-500">Generates unique ID & borrowing quota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Member ID Preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 font-medium">Assigned Member ID:</span>
              <div className="text-sm font-bold text-navy-900">
                #{nextId ? nextId : 'Auto-generated'}
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              C++ nextMemberId()
            </span>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma, Priya Patel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Rule Card */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-blue-800">
              <Shield className="w-3.5 h-3.5" />
              <span>Borrowing Policy (MAX_BORROW)</span>
            </div>
            <p className="text-blue-700 leading-relaxed">
              Every registered member can borrow a maximum of <strong>3 items</strong> at any given time. Loan period is 7 days.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-navy-900 hover:bg-navy-800 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
