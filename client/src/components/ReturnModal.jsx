import React, { useState, useEffect } from 'react';
import { X, RotateCcw, AlertCircle, Calendar, Coins, Clock, CheckCircle } from 'lucide-react';
import { useToast } from './Toast';

export default function ReturnModal({ isOpen, onClose, issuedItems = [], members = [], onReturnSuccess, preselectedItemId }) {
  const { addToast } = useToast();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [daysKept, setDaysKept] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Selected item object
  const selectedItem = issuedItems.find(i => i.id.toString() === selectedItemId);
  const borrower = selectedItem ? members.find(m => m.id === selectedItem.memberId) : null;

  useEffect(() => {
    if (preselectedItemId) {
      setSelectedItemId(preselectedItemId.toString());
      const item = issuedItems.find(i => i.id.toString() === preselectedItemId.toString());
      if (item && item.issueDate) {
        const diffMs = Date.now() - new Date(item.issueDate).getTime();
        const autoDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        setDaysKept(autoDays);
      } else {
        setDaysKept(7);
      }
    } else if (issuedItems.length > 0) {
      const first = issuedItems[0];
      setSelectedItemId(first.id.toString());
      if (first.issueDate) {
        const diffMs = Date.now() - new Date(first.issueDate).getTime();
        const autoDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        setDaysKept(autoDays);
      } else {
        setDaysKept(7);
      }
    } else {
      setSelectedItemId('');
      setDaysKept(7);
    }
    setError('');
  }, [isOpen, preselectedItemId, issuedItems]);

  const handleItemChange = (id) => {
    setSelectedItemId(id);
    const item = issuedItems.find(i => i.id.toString() === id);
    if (item && item.issueDate) {
      const diffMs = Date.now() - new Date(item.issueDate).getTime();
      const autoDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      setDaysKept(autoDays);
    } else {
      setDaysKept(7);
    }
  };

  if (!isOpen) return null;

  // Fine calculation
  const allowedDays = 7;
  const days = Math.max(0, parseInt(daysKept, 10) || 0);
  const lateDays = Math.max(0, days - allowedDays);
  let rate = 0;
  if (selectedItem?.type === 'Book') rate = 2.0;
  else if (selectedItem?.type === 'Magazine') rate = 5.0;
  const totalFine = lateDays * rate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedItemId) {
      setError('Please select an item to return.');
      return;
    }

    setLoading(true);
    try {
      const res = await onReturnSuccess(parseInt(selectedItemId, 10), days);
      addToast(
        res.message || `Item returned.${totalFine > 0 ? ` Late by ${lateDays} day(s). Fine: ₹${totalFine}` : ''}`,
        totalFine > 0 ? 'warning' : 'success'
      );
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to process return');
      addToast(err.message || 'Failed to process return', 'error');
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
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">Return Issued Item</h3>
              <p className="text-xs text-slate-500">Check-in item & calculate late fines per C++ rules</p>
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

          {issuedItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <p className="font-semibold text-navy-900">No items are currently issued.</p>
              <p className="text-xs text-slate-400 mt-1">All items in the library are available.</p>
            </div>
          ) : (
            <>
              {/* Select Issued Item */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Issued Item <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedItemId}
                  onChange={(e) => handleItemChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                >
                  {issuedItems.map(item => {
                    const mem = members.find(m => m.id === item.memberId);
                    return (
                      <option key={item.id} value={item.id}>
                        #{item.id} - {item.title} ({item.type}) [Borrowed by {mem ? mem.name : `Member #${item.memberId}`}]
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Borrower & Issue Meta Details */}
              {selectedItem && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Borrower:</span>
                    <span className="font-bold text-navy-900">
                      {borrower ? `${borrower.name} (#${borrower.id})` : `Member #${selectedItem.memberId}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Item Type:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedItem.type} ({selectedItem.detail})
                    </span>
                  </div>
                  {selectedItem.issueDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Issued On:</span>
                      <span className="font-medium text-slate-700">
                        {new Date(selectedItem.issueDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Allowed Loan Duration:</span>
                    <span className="font-semibold text-slate-700">7 Days</span>
                  </div>
                </div>
              )}

              {/* Interactive Days Kept Slider & Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent-600" />
                    Days Kept by Member:
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-navy-900">
                    {days} day{days === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={days}
                    onChange={(e) => setDaysKept(parseInt(e.target.value, 10))}
                    className="flex-1 accent-emerald-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="365"
                    value={days}
                    onChange={(e) => setDaysKept(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-center focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * Pre-filled with actual days elapsed, or adjust slider to test fine rules (e.g. 10 days = 3 late days).
                </p>
              </div>

              {/* Real-time Fine Calculation Summary Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                totalFine > 0
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className={`w-5 h-5 ${totalFine > 0 ? 'text-amber-600' : 'text-emerald-600'}`} />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">
                        {totalFine > 0 ? 'Late Fine Payable' : 'No Fine Payable'}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {lateDays > 0 ? (
                          <>
                            {lateDays} day{lateDays === 1 ? '' : 's'} overdue × ₹{rate}/day ({selectedItem?.type})
                          </>
                        ) : (
                          'Returned within 7-day loan window'
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold tracking-tight">
                      ₹{totalFine}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

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
              disabled={loading || issuedItems.length === 0}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
