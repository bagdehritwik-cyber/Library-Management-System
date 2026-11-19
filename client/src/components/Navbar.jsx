import React from 'react';
import { Menu, Plus, UserPlus, ArrowLeftRight, Database, RefreshCw } from 'lucide-react';

export default function Navbar({
  activeTab,
  onOpenMobileSidebar,
  onOpenAddItem,
  onOpenRegisterMember,
  onOpenIssue,
  onRefresh,
  loading
}) {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', desc: 'Library statistics, recent circulation and quick actions' };
      case 'items':
        return { title: 'Item Catalog', desc: 'Manage books, magazines, and reference items' };
      case 'members':
        return { title: 'Member Directory', desc: 'Registered readers, active loans and borrowing limits' };
      case 'issue-return':
        return { title: 'Circulation Desk', desc: 'Issue items and process returns with automatic fine calculation' };
      case 'oop-concepts':
        return { title: 'C++ OOP Architecture', desc: 'Detailed breakdown of the 16 Object-Oriented concepts' };
      default:
        return { title: 'Library Management', desc: '' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left section: mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-navy-900 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-navy-900 tracking-tight leading-tight">
            {pageInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 font-medium">
            {pageInfo.desc}
          </p>
        </div>
      </div>

      {/* Right section: sync status & quick actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent-600' : ''}`} />
        </button>

        {/* Persistence Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 text-slate-700 text-xs font-medium border border-slate-200/60">
          <Database className="w-3.5 h-3.5 text-accent-600" />
          <span>Synced with items.txt & members.txt</span>
        </div>

        {/* Quick Issue */}
        <button
          onClick={onOpenIssue}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/90 text-navy-900 transition-all border border-slate-200"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-accent-600" />
          <span>Issue</span>
        </button>

        {/* Register Member */}
        <button
          onClick={onOpenRegisterMember}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/90 text-navy-900 transition-all border border-slate-200"
        >
          <UserPlus className="w-3.5 h-3.5 text-accent-600" />
          <span>Add Member</span>
        </button>

        {/* Add Item Primary Button */}
        <button
          onClick={onOpenAddItem}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-900 hover:bg-navy-800 text-white shadow-sm shadow-navy-900/20 hover:shadow transition-all"
        >
          <Plus className="w-4 h-4 text-accent-400" />
          <span>New Item</span>
        </button>
      </div>
    </header>
  );
}
