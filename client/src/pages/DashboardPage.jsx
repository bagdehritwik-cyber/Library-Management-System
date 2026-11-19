import React from 'react';
import {
  BookOpen,
  Newspaper,
  BookMarked,
  Users,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';

export default function DashboardPage({
  stats,
  recentActivity = [],
  overdueItems = [],
  onOpenAddItem,
  onOpenRegisterMember,
  onOpenIssue,
  onOpenReturn,
  onNavigateToTab,
  onQuickReturnItem,
  onQuickIssueItem
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="card-surface p-6 sm:p-8 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-800 text-white relative overflow-hidden border-none shadow-navy">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-500/20 text-accent-300 border border-accent-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            C++ Object Oriented Programming System
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Library Circulation & Management
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Fully responsive dashboard built from <code className="text-accent-400 font-mono">library_management.cpp</code>.
            Persistent storage with dual text-file synchronization and strict C++ business rules enforcement.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={onOpenIssue}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-accent-600 hover:bg-accent-500 text-white shadow-md transition-all"
            >
              Issue Item (7 Days)
            </button>
            <button
              onClick={() => onNavigateToTab('oop-concepts')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-700/60 hover:bg-navy-700 text-slate-200 border border-navy-600/60 transition-all"
            >
              Explore 16 OOP Concepts
            </button>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <BookOpen className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Overdue Warning Alert (if any) */}
      {overdueItems.length > 0 && (
        <div className="card-surface p-4 sm:p-5 bg-amber-50/90 border-amber-200/90 text-amber-900 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">
                {overdueItems.length} Item{overdueItems.length === 1 ? '' : 's'} Currently Overdue
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Items kept past the 7-day loan period are accruing late fines (Books: ₹2/day, Magazines: ₹5/day).
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('issue-return')}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm shrink-0"
          >
            Review Overdue Loans
          </button>
        </div>
      )}

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Books"
          value={stats.totalBooks ?? 0}
          subtitle="Fine: ₹2/day"
          icon={BookOpen}
          color="blue"
          onClick={() => onNavigateToTab('items')}
        />

        <StatCard
          title="Magazines"
          value={stats.totalMagazines ?? 0}
          subtitle="Fine: ₹5/day"
          icon={Newspaper}
          color="emerald"
          onClick={() => onNavigateToTab('items')}
        />

        <StatCard
          title="Reference"
          value={stats.totalReferenceBooks ?? 0}
          subtitle="Library read only"
          icon={BookMarked}
          color="purple"
          onClick={() => onNavigateToTab('items')}
        />

        <StatCard
          title="Members"
          value={stats.registeredMembers ?? 0}
          subtitle="Max 3 items each"
          icon={Users}
          color="navy"
          onClick={() => onNavigateToTab('members')}
        />

        <StatCard
          title="Issued Items"
          value={stats.currentlyIssued ?? 0}
          subtitle="7-day max loan"
          icon={ArrowUpRight}
          color="amber"
          onClick={() => onNavigateToTab('issue-return')}
        />

        <StatCard
          title="Available"
          value={stats.availableItems ?? 0}
          subtitle="Ready to loan"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => onNavigateToTab('items')}
        />
      </div>

      {/* Quick Actions Component */}
      <QuickActions
        onOpenIssue={onOpenIssue}
        onOpenReturn={onOpenReturn}
        onOpenAddItem={onOpenAddItem}
        onOpenRegisterMember={onOpenRegisterMember}
        onNavigateToOOP={() => onNavigateToTab('oop-concepts')}
      />

      {/* Split section: Currently Issued Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Loans Snapshot */}
        <div className="lg:col-span-2 card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-500" />
                Active Loans Snapshot
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Items currently in circulation with members
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('issue-return')}
              className="text-xs font-semibold text-accent-600 hover:text-accent-700"
            >
              View Circulation Desk →
            </button>
          </div>

          {stats.currentlyIssued === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-60" />
              <p className="text-sm font-semibold text-slate-700">All items are available</p>
              <p className="text-xs text-slate-400 mt-1">No books or magazines are currently on loan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-2">ID</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Borrower</th>
                    <th className="pb-3">Loan Status</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overdueItems.slice(0, 5).map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pl-2 font-mono font-bold text-slate-700">#{item.id}</td>
                      <td className="py-3">
                        <span className={item.type === 'Book' ? 'badge-book' : 'badge-magazine'}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-navy-900 max-w-[160px] truncate">
                        {item.title}
                      </td>
                      <td className="py-3 text-slate-600">{item.memberName}</td>
                      <td className="py-3">
                        {item.daysLate > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Overdue ({item.daysLate}d late • ₹{item.estimatedFine})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                            Active ({item.daysKept}d elapsed)
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => onQuickReturnItem(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
