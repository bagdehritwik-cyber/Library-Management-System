import React from 'react';
import { ArrowLeftRight, RotateCcw, PlusCircle, UserPlus, Code2, Sparkles } from 'lucide-react';

export default function QuickActions({
  onOpenIssue,
  onOpenReturn,
  onOpenAddItem,
  onOpenRegisterMember,
  onNavigateToOOP
}) {
  const actions = [
    {
      label: 'Issue Item',
      desc: 'Lend books or magazines for up to 7 days',
      icon: ArrowLeftRight,
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      iconBg: 'bg-white/20 text-white',
      onClick: onOpenIssue,
    },
    {
      label: 'Return Item',
      desc: 'Calculate late fines and check-in items',
      icon: RotateCcw,
      color: 'bg-emerald-600 text-white hover:bg-emerald-700',
      iconBg: 'bg-white/20 text-white',
      onClick: onOpenReturn,
    },
    {
      label: 'Add Catalog Item',
      desc: 'Register Book, Magazine or Reference',
      icon: PlusCircle,
      color: 'bg-navy-900 text-white hover:bg-navy-800',
      iconBg: 'bg-white/20 text-white',
      onClick: onOpenAddItem,
    },
    {
      label: 'Register Member',
      desc: 'Auto-generate ID and set 3-item limit',
      icon: UserPlus,
      color: 'bg-slate-800 text-white hover:bg-slate-900',
      iconBg: 'bg-white/20 text-white',
      onClick: onOpenRegisterMember,
    },
  ];

  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-500" />
            Quick Operations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Common circulation and catalog tasks</p>
        </div>

        <button
          onClick={onNavigateToOOP}
          className="text-xs font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-50 hover:bg-accent-100 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>OOP Explanations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={act.onClick}
              className={`flex items-start gap-3.5 p-4 rounded-xl text-left transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow ${act.color}`}
            >
              <div className={`p-2.5 rounded-xl ${act.iconBg} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{act.label}</div>
                <div className="text-xs text-white/80 line-clamp-1 mt-0.5 font-normal">
                  {act.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
