import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, AlertCircle, Book, Newspaper, BookMarked, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';

export default function IssueModal({ isOpen, onClose, items = [], members = [], onIssueSuccess, preselectedItemId }) {
  const { addToast } = useToast();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedItemId) {
      setSelectedItemId(preselectedItemId.toString());
    } else {
      setSelectedItemId('');
    }
    setError('');
  }, [isOpen, preselectedItemId]);

  if (!isOpen) return null;

  // Filter items: only available items
  const availableItems = items.filter(i => i.memberId === 0);
  const selectedItem = items.find(i => i.id.toString() === selectedItemId);
  const selectedMember = members.find(m => m.id.toString() === selectedMemberId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedItemId) {
      setError('Please select an item to issue.');
      return;
    }

    if (!selectedMemberId) {
      setError('Please select a member.');
      return;
    }

    if (selectedItem && selectedItem.type === 'Reference') {
      setError('Reference books cannot be issued.');
      return;
    }

    if (selectedMember && selectedMember.borrowedCount >= 3) {
      setError(`${selectedMember.name} has already reached the maximum limit of 3 items.`);
      return;
    }

    setLoading(true);
    try {
      await onIssueSuccess(parseInt(selectedItemId, 10), parseInt(selectedMemberId, 10));
      addToast(`"${selectedItem?.title}" issued to ${selectedMember?.name} for 7 days!`, 'success');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to issue item');
      addToast(err.message || 'Failed to issue item', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">Issue Item to Member</h3>
              <p className="text-xs text-slate-500">Loan duration: 7 days • Max 3 items per member</p>
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

          {/* Select Item */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Item <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedItemId}
              onChange={(e) => {
                setSelectedItemId(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-white"
            >
              <option value="">-- Choose an item --</option>
              {items.map(item => {
                const isRef = item.type === 'Reference';
                const isIssued = item.memberId !== 0;
                const disabled = isRef || isIssued;
                let statusSuffix = '';
                if (isRef) statusSuffix = ' [Reference - In-library reading only]';
                else if (isIssued) statusSuffix = ' [Already Issued]';
                else statusSuffix = ' [Available]';

                return (
                  <option
                    key={item.id}
                    value={item.id}
                    disabled={disabled}
                    className={disabled ? 'text-slate-400 bg-slate-50' : 'text-slate-800'}
                  >
                    #{item.id} - {item.title} ({item.type}: {item.detail}){statusSuffix}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Item details card preview */}
          {selectedItem && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
              selectedItem.type === 'Reference'
                ? 'bg-purple-50/70 border-purple-200 text-purple-900'
                : 'bg-blue-50/70 border-blue-200 text-blue-900'
            }`}>
              <div className="mt-0.5">
                {selectedItem.type === 'Book' && <Book className="w-4 h-4 text-blue-600" />}
                {selectedItem.type === 'Magazine' && <Newspaper className="w-4 h-4 text-emerald-600" />}
                {selectedItem.type === 'Reference' && <BookMarked className="w-4 h-4 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="font-bold">{selectedItem.title}</div>
                <div className="text-slate-600 mt-0.5">
                  Type: <strong>{selectedItem.type}</strong> • {selectedItem.detail}
                </div>
                {selectedItem.type === 'Reference' && (
                  <div className="mt-1 font-semibold text-purple-700 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Reference books cannot be issued according to C++ rules.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Select Member */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Member <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedMemberId}
              onChange={(e) => {
                setSelectedMemberId(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-white"
            >
              <option value="">-- Choose registered member --</option>
              {members.map(member => {
                const count = member.borrowedCount || 0;
                const isFull = count >= 3;
                return (
                  <option
                    key={member.id}
                    value={member.id}
                    disabled={isFull}
                    className={isFull ? 'text-red-400 bg-red-50' : 'text-slate-800'}
                  >
                    #{member.id} - {member.name} ({count}/3 items borrowed){isFull ? ' [LIMIT REACHED]' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Member info preview */}
          {selectedMember && (
            <div className={`p-3 rounded-xl border text-xs ${
              selectedMember.borrowedCount >= 3
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex justify-between items-center font-semibold">
                <span>Member: {selectedMember.name}</span>
                <span>Active Loans: {selectedMember.borrowedCount}/3</span>
              </div>
              {selectedMember.borrowedCount >= 3 ? (
                <p className="mt-1 text-red-600 font-medium">
                  Borrowing limit of 3 items reached. Cannot issue any more items.
                </p>
              ) : (
                <p className="mt-1 text-emerald-700 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Eligible for {3 - selectedMember.borrowedCount} more item(s).
                </p>
              )}
            </div>
          )}

          {/* Loan terms preview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Standard Loan Period:</span>
              <span className="font-semibold text-navy-900">7 Days</span>
            </div>
            <div className="flex justify-between">
              <span>Return Due Date:</span>
              <span className="font-semibold text-navy-900">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200/60">
              <span>Late fine applies after:</span>
              <span>Day 7 (₹2/day for Book, ₹5/day for Magazine)</span>
            </div>
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
              disabled={loading || (selectedItem && selectedItem.type === 'Reference') || (selectedMember && selectedMember.borrowedCount >= 3)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-accent-600 hover:bg-accent-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
