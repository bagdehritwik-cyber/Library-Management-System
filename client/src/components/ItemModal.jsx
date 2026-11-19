import React, { useState } from 'react';
import { X, Book, Newspaper, BookMarked, AlertCircle } from 'lucide-react';
import { useToast } from './Toast';

export default function ItemModal({ isOpen, onClose, onItemAdded }) {
  const { addToast } = useToast();
  const [type, setType] = useState('Book');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [issueNo, setIssueNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    if (type === 'Book' && !author.trim()) {
      setError('Author cannot be empty for books.');
      return;
    }

    if (type === 'Magazine') {
      const parsed = parseInt(issueNo, 10);
      if (isNaN(parsed) || parsed <= 0) {
        setError('Please enter a valid positive issue number.');
        return;
      }
    }

    if (type === 'Reference' && !author.trim()) {
      setError('Author cannot be empty for reference books.');
      return;
    }

    setLoading(true);
    try {
      await onItemAdded({
        type,
        title: title.trim(),
        author: type === 'Magazine' ? null : author.trim(),
        issueNo: type === 'Magazine' ? parseInt(issueNo, 10) : null
      });

      addToast(`${type} "${title.trim()}" added successfully!`, 'success');
      // Reset form
      setTitle('');
      setAuthor('');
      setIssueNo('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add item');
      addToast(err.message || 'Failed to add item', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-navy-900">Add New Library Item</h3>
            <p className="text-xs text-slate-500 mt-0.5">Choose type and fill in required catalog details</p>
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

          {/* Type Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Item Category
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { setType('Book'); setError(''); }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'Book'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Book className="w-4 h-4 text-blue-600" />
                Book
              </button>

              <button
                type="button"
                onClick={() => { setType('Magazine'); setError(''); }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'Magazine'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Newspaper className="w-4 h-4 text-emerald-600" />
                Magazine
              </button>

              <button
                type="button"
                onClick={() => { setType('Reference'); setError(''); }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'Reference'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <BookMarked className="w-4 h-4 text-purple-600" />
                Reference
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'Book'
                  ? 'e.g. Clean Code'
                  : type === 'Magazine'
                  ? 'e.g. Wired, Time, IEEE Spectrum'
                  : 'e.g. C++ Primer, Introduction to Algorithms'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Author for Book & Reference */}
          {type !== 'Magazine' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Robert C. Martin, Stanley Lippman"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Issue Number for Magazine */}
          {type === 'Magazine' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Issue Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={issueNo}
                onChange={(e) => setIssueNo(e.target.value)}
                placeholder="e.g. 12, 45, 108"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Business rule reminder based on type */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-navy-900 block">Class & Business Rules:</span>
            {type === 'Book' && (
              <p>• Derived from <code className="text-accent-600 font-mono">Item</code>. Loan period: 7 days. Late fine: ₹2 per day.</p>
            )}
            {type === 'Magazine' && (
              <p>• Derived from <code className="text-accent-600 font-mono">Item</code>. Loan period: 7 days. Late fine: ₹5 per day.</p>
            )}
            {type === 'Reference' && (
              <p className="text-purple-700 font-medium">
                • Multilevel inheritance (<code className="font-mono">ReferenceBook → Book → Item</code>). Cannot be issued for borrowing; for library reading only.
              </p>
            )}
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
              {loading ? 'Adding...' : `Add ${type}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
