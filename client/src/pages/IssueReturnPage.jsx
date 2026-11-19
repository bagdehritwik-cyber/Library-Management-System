import React, { useState } from 'react';
import {
  ArrowLeftRight,
  RotateCcw,
  Clock,
  AlertTriangle,
  Coins,
  BookOpen,
  Newspaper,
  BookMarked,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function IssueReturnPage({
  issuedItems = [],
  members = [],
  onOpenIssue,
  onOpenReturn,
  onQuickReturnItem
}) {
  // Fine simulator state
  const [simType, setSimType] = useState('Book');
  const [simDays, setSimDays] = useState(10);

  const simAllowed = 7;
  const simLate = Math.max(0, simDays - simAllowed);
  let simRate = 0;
  if (simType === 'Book') simRate = 2.0;
  else if (simType === 'Magazine') simRate = 5.0;
  else if (simType === 'Reference') simRate = 0.0;
  const simFine = simLate * simRate;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-surface p-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight">Circulation Desk</h2>
          <p className="text-xs text-slate-500 mt-1">
            Issue materials to registered readers and process check-in returns with automated fine calculation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenIssue}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-accent-600 hover:bg-accent-700 text-white shadow-sm transition-all"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Issue Item</span>
          </button>
          <button
            onClick={() => onOpenReturn()}
            disabled={issuedItems.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return Item</span>
          </button>
        </div>
      </div>

      {/* Circulation Policy Rules & Fine Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Overview */}
        <div className="lg:col-span-1 card-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-navy-900 font-bold mb-3 text-base">
              <ShieldCheck className="w-5 h-5 text-accent-500" />
              <span>C++ Circulation Rules</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Enforced by polymorphic member functions in <code className="font-mono text-accent-600">Item</code> derived classes:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-blue-900">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Book Loan & Fine
                  </span>
                  <span>₹2.00 / day</span>
                </div>
                <p className="text-blue-700 mt-1 text-[11px]">
                  Loan window: 7 days. Late fine begins on Day 8.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-emerald-600" />
                    Magazine Loan & Fine
                  </span>
                  <span>₹5.00 / day</span>
                </div>
                <p className="text-emerald-700 mt-1 text-[11px]">
                  Periodicals have shorter life cycle and higher overdue charge.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-purple-900">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-purple-600" />
                    Reference Books
                  </span>
                  <span className="text-purple-700 font-semibold">Non-lendable</span>
                </div>
                <p className="text-purple-700 mt-1 text-[11px]">
                  Overridden <code className="font-mono">issueTo()</code> throws exception. In-library reading only.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Max items per member:</span>
            <strong className="text-navy-900">3 items</strong>
          </div>
        </div>

        {/* Interactive Late Fine Calculator / Tester */}
        <div className="lg:col-span-2 card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                Interactive Fine Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Test the polymorphic formula: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-navy-900">max(0, days - 7) * rate</code>
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Live Simulator
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Item Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Book', 'Magazine', 'Reference'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSimType(t)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                        simType === t
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Days Kept by Reader:
                  </label>
                  <span className="text-xs font-extrabold text-navy-900 px-2 py-0.5 bg-slate-100 rounded">
                    {simDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={simDays}
                  onChange={(e) => setSimDays(parseInt(e.target.value, 10))}
                  className="w-full accent-navy-900 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 day (On time)</span>
                  <span>7 days (Due limit)</span>
                  <span>30 days (Late)</span>
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Standard Loan Window:</span>
                  <span className="font-semibold text-slate-800">7 Days</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Days Overdue:</span>
                  <span className={`font-semibold ${simLate > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {simLate} Day{simLate === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Daily Late Fee:</span>
                  <span className="font-semibold text-slate-800">
                    {simType === 'Reference' ? 'N/A (Reference)' : `₹${simRate.toFixed(2)} / day`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Calculated Fine
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {simLate > 0 ? `${simLate} days × ₹${simRate}` : 'Returned on time'}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-navy-900">
                  ₹{simFine}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Issued Items Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-500" />
              Currently Issued Items ({issuedItems.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active loans across registered library members
            </p>
          </div>

          <div className="text-xs text-slate-500">
            {issuedItems.filter(i => i.isOverdue).length} item(s) overdue
          </div>
        </div>

        {issuedItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-3 opacity-60" />
            <p className="text-base font-semibold text-slate-700">No active loans</p>
            <p className="text-xs text-slate-400 mt-1">
              All books and magazines are returned and available on the shelves.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 pl-6">Item</th>
                  <th className="py-3.5">Category</th>
                  <th className="py-3.5">Issued To</th>
                  <th className="py-3.5">Issue Date</th>
                  <th className="py-3.5">Days Kept</th>
                  <th className="py-3.5">Fine Status</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issuedItems.map((item) => {
                  const member = members.find(m => m.id === item.memberId);
                  const isLate = item.daysKept > 7;
                  const lateDays = Math.max(0, item.daysKept - 7);
                  const rate = item.type === 'Book' ? 2 : 5;
                  const fine = lateDays * rate;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 pl-6">
                        <div className="font-semibold text-navy-900">{item.title}</div>
                        <div className="text-[11px] text-slate-400">#{item.id} • {item.detail}</div>
                      </td>

                      <td className="py-4 whitespace-nowrap">
                        <span className={item.type === 'Book' ? 'badge-book' : 'badge-magazine'}>
                          {item.type}
                        </span>
                      </td>

                      <td className="py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {member ? member.name : `Member #${item.memberId}`}
                        </div>
                        <div className="text-[11px] text-slate-400">Member ID #{item.memberId}</div>
                      </td>

                      <td className="py-4 whitespace-nowrap text-slate-600">
                        {item.issueDate
                          ? new Date(item.issueDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : '—'}
                      </td>

                      <td className="py-4 whitespace-nowrap font-medium text-slate-700">
                        {item.daysKept} Day{item.daysKept === 1 ? '' : 's'}
                      </td>

                      <td className="py-4 whitespace-nowrap">
                        {isLate ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {lateDays}d Late (₹{fine})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            On Schedule (₹0 fine)
                          </span>
                        )}
                      </td>

                      <td className="py-4 pr-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => onQuickReturnItem(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Check-in Return</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
