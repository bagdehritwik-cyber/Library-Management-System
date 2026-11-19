import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  BookOpen,
  RotateCcw,
  Trash2,
  ArrowLeftRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Book,
  Newspaper
} from 'lucide-react';

export default function MembersPage({
  members = [],
  loading = false,
  onOpenRegisterMember,
  onOpenIssueForMember,
  onOpenReturnItem,
  onDeleteMember
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActiveLoansOnly, setFilterActiveLoansOnly] = useState(false);

  const filteredMembers = members.filter(m => {
    if (filterActiveLoansOnly && m.borrowedCount === 0) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchId = m.id.toString() === q;
      const matchItem = m.borrowedItems && m.borrowedItems.some(i => i.title.toLowerCase().includes(q));
      return matchName || matchId || matchItem;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-surface p-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight">Registered Library Members</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track user memberships, active book loans, and enforce the 3-item borrowing quota
          </p>
        </div>

        <button
          onClick={onOpenRegisterMember}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white shadow-sm transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4 text-accent-400" />
          <span>Register Member</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by member name, ID, or borrowed title..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors">
            <input
              type="checkbox"
              checked={filterActiveLoansOnly}
              onChange={(e) => setFilterActiveLoansOnly(e.target.checked)}
              className="rounded accent-accent-600 w-4 h-4"
            />
            <span>Show members with active loans only</span>
          </label>
        </div>
      </div>

      {/* Members Grid / List */}
      {filteredMembers.length === 0 ? (
        <div className="card-surface py-16 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3 opacity-60" />
          <p className="text-base font-semibold text-slate-700">No members found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or register a new member above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const count = member.borrowedCount || 0;
            const isAtLimit = count >= 3;
            const progressPercent = Math.min(100, (count / 3) * 100);

            return (
              <div
                key={member.id}
                className="card-surface p-5 flex flex-col justify-between hover:border-slate-200 transition-all group"
              >
                <div>
                  {/* Top Bar: Member ID & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-sm shrink-0">
                        #{member.id}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-navy-900 leading-snug">
                          {member.name}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {member.joinedAt
                            ? `Joined ${new Date(member.joinedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`
                            : 'Registered Member'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteMember(member)}
                      disabled={count > 0}
                      className={`p-1.5 rounded-lg transition-colors ${
                        count > 0
                          ? 'text-slate-300 cursor-not-allowed opacity-40'
                          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={count > 0 ? 'Cannot remove a member with active loans' : 'Remove member'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Borrowing Limit Progress Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-accent-500" />
                        Borrowing Quota
                      </span>
                      <span className={`font-bold ${isAtLimit ? 'text-rose-600' : 'text-navy-900'}`}>
                        {count} / 3 Items
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isAtLimit
                            ? 'bg-rose-500'
                            : count === 2
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {isAtLimit && (
                      <div className="mt-2 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        Borrowing limit reached (MAX_BORROW = 3).
                      </div>
                    )}
                  </div>

                  {/* Borrowed Items Sub-List */}
                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Currently Borrowed ({count})
                    </div>

                    {count === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No active items borrowed.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {member.borrowedItems?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-subtle hover:border-slate-300 transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-semibold text-navy-900 truncate flex items-center gap-1.5">
                                {item.type === 'Book' ? (
                                  <Book className="w-3 h-3 text-blue-600 shrink-0" />
                                ) : (
                                  <Newspaper className="w-3 h-3 text-emerald-600 shrink-0" />
                                )}
                                <span className="truncate">{item.title}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                #{item.id} • {item.type}
                              </div>
                            </div>

                            <button
                              onClick={() => onOpenReturnItem(item.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shrink-0"
                              title="Return this item"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Return
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action: Issue New Item to this member */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {3 - count} slot{3 - count === 1 ? '' : 's'} available
                  </span>

                  <button
                    onClick={() => onOpenIssueForMember(member.id)}
                    disabled={isAtLimit}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isAtLimit
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-accent-50 text-accent-700 hover:bg-accent-100'
                    }`}
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    Issue Item
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
