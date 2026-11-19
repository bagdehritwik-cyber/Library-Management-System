import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  Code2,
  Library,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'items', label: 'Item Catalog', icon: BookOpen },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'issue-return', label: 'Issue & Return', icon: ArrowLeftRight },
    { id: 'oop-concepts', label: 'OOP Concepts', icon: Code2 },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-900 text-slate-200 border-r border-navy-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-navy-800/80 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/25">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Athena
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-400 border border-accent-500/30">
                  C++ OOP
                </span>
              </div>
              <p className="text-xs text-slate-400">Library Management</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30'
                    : 'text-slate-300 hover:bg-navy-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </button>
            );
          })}
        </div>

        {/* System Rules Pill / Card */}
        <div className="p-4 m-3 rounded-xl bg-navy-850/80 border border-navy-700/60 text-xs">
          <div className="flex items-center gap-2 text-accent-400 font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Active C++ Rules</span>
          </div>
          <div className="space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Max borrow:</span>
              <span className="font-semibold text-slate-200">3 items</span>
            </div>
            <div className="flex justify-between">
              <span>Loan period:</span>
              <span className="font-semibold text-slate-200">7 days</span>
            </div>
            <div className="flex justify-between">
              <span>Book fine:</span>
              <span className="font-semibold text-slate-200">₹2 / day</span>
            </div>
            <div className="flex justify-between">
              <span>Magazine fine:</span>
              <span className="font-semibold text-slate-200">₹5 / day</span>
            </div>
          </div>
        </div>

        {/* User / Footer */}
        <div className="p-4 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            <div className="font-semibold text-slate-200">OOP Lab Edition</div>
            <div className="text-[11px] text-slate-500">IIIT Nagpur B.Tech CSE</div>
          </div>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="System Operational" />
        </div>
      </aside>
    </>
  );
}
