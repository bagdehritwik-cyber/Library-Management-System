import React, { useState } from 'react';
import {
  BookOpen,
  Newspaper,
  BookMarked,
  Search,
  Plus,
  Trash2,
  ArrowLeftRight,
  RotateCcw,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function BooksPage({
  items = [],
  loading = false,
  onOpenAddItem,
  onOpenIssue,
  onOpenReturn,
  onDeleteItem
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Client-side filtering
  const filteredItems = items.filter(item => {
    // Type filter
    if (selectedType !== 'All' && item.type !== selectedType) {
      return false;
    }

    // Status filter
    if (selectedStatus === 'available' && item.memberId !== 0) {
      return false;
    }
    if (selectedStatus === 'issued' && item.memberId === 0) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDetail = item.detail && item.detail.toLowerCase().includes(q);
      const matchId = item.id.toString() === q;
      const matchMember = item.member && item.member.name.toLowerCase().includes(q);
      return matchTitle || matchDetail || matchId || matchMember;
    }

    return true;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Book':
        return <span className="badge-book"><BookOpen className="w-3 h-3" /> Book</span>;
      case 'Magazine':
        return <span className="badge-magazine"><Newspaper className="w-3 h-3" /> Magazine</span>;
      case 'Reference':
        return <span className="badge-reference"><BookMarked className="w-3 h-3" /> Reference</span>;
      default:
        return <span className="badge-book">{type}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-surface p-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight">Library Item Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Displaying polymorphic collection of Books, Magazines, and Reference Books
          </p>
        </div>

        <button
          onClick={onOpenAddItem}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-accent-400" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-surface p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, author, issue, or ID..."
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

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Type Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            {['All', 'Book', 'Magazine', 'Reference'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === t
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {t === 'Reference' ? 'Reference' : `${t}s`}
              </button>
            ))}
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available Only</option>
              <option value="issued">Currently Issued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card-surface overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3 opacity-60" />
            <p className="text-base font-semibold text-slate-700">No items match your criteria</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or clear the active category filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 pl-6">ID</th>
                  <th className="py-3.5">Type</th>
                  <th className="py-3.5">Title</th>
                  <th className="py-3.5">Author / Issue</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Loan Rule</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isIssued = item.memberId !== 0;
                  const isRef = item.type === 'Reference';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-4 pl-6 font-mono font-bold text-slate-700">
                        #{item.id}
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 whitespace-nowrap">
                        {getTypeBadge(item.type)}
                      </td>

                      {/* Title */}
                      <td className="py-4 font-semibold text-navy-900">
                        {item.title}
                      </td>

                      {/* Author / Detail */}
                      <td className="py-4 text-slate-600 whitespace-nowrap">
                        {item.detail || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-4 whitespace-nowrap">
                        {isIssued ? (
                          <div className="space-y-0.5">
                            <span className="badge-issued flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Issued to #{item.memberId}
                            </span>
                            {item.member && (
                              <div className="text-[11px] text-slate-500 font-medium pl-1">
                                {item.member.name} {item.daysKept > 7 ? `(${item.daysKept - 7}d late)` : ''}
                              </div>
                            )}
                          </div>
                        ) : isRef ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            In Library (Reading)
                          </span>
                        ) : (
                          <span className="badge-available flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Available
                          </span>
                        )}
                      </td>

                      {/* Rule details */}
                      <td className="py-4 text-xs text-slate-500 whitespace-nowrap">
                        {item.type === 'Book' && '7d loan • ₹2/day fine'}
                        {item.type === 'Magazine' && '7d loan • ₹5/day fine'}
                        {item.type === 'Reference' && 'Cannot be issued'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {/* Issue Button (if available & not reference) */}
                          {!isIssued && !isRef && (
                            <button
                              onClick={() => onOpenIssue(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                              title="Issue to member"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span>Issue</span>
                            </button>
                          )}

                          {/* Return Button (if issued) */}
                          {isIssued && (
                            <button
                              onClick={() => onOpenReturn(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Process return & fine"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Return</span>
                            </button>
                          )}

                          {/* Reference book non-issuable indicator */}
                          {isRef && (
                            <span
                              className="text-[11px] text-slate-400 italic px-2 py-1"
                              title="Reference books cannot be issued per C++ rule"
                            >
                              Non-lendable
                            </span>
                          )}

                          {/* Delete Button (Allowed only if NOT issued) */}
                          <button
                            onClick={() => onDeleteItem(item)}
                            disabled={isIssued}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isIssued
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={isIssued ? 'Cannot remove an issued item (C++ Rule)' : 'Remove item from library'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredItems.length}</strong> of{' '}
            <strong className="text-slate-800">{items.length}</strong> total library items
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Book Fine: ₹2/d</span>
            <span>•</span>
            <span>Magazine Fine: ₹5/d</span>
            <span>•</span>
            <span className="text-purple-700 font-medium">Reference: Library reading only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
