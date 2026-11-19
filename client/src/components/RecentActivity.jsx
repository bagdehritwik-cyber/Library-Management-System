import React from 'react';
import {
  ArrowLeftRight,
  RotateCcw,
  PlusCircle,
  Trash2,
  UserPlus,
  Clock,
  Activity
} from 'lucide-react';

export default function RecentActivity({ activities = [] }) {
  const getIconAndBadge = (type) => {
    switch (type) {
      case 'ISSUE':
        return {
          icon: ArrowLeftRight,
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          iconColor: 'text-blue-600 bg-blue-50'
        };
      case 'RETURN':
        return {
          icon: RotateCcw,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconColor: 'text-emerald-600 bg-emerald-50'
        };
      case 'ADD_ITEM':
        return {
          icon: PlusCircle,
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          iconColor: 'text-purple-600 bg-purple-50'
        };
      case 'REMOVE_ITEM':
        return {
          icon: Trash2,
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          iconColor: 'text-rose-600 bg-rose-50'
        };
      case 'REGISTER_MEMBER':
        return {
          icon: UserPlus,
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          iconColor: 'text-indigo-600 bg-indigo-50'
        };
      default:
        return {
          icon: Activity,
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          iconColor: 'text-slate-600 bg-slate-100'
        };
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSecs < 60) return 'Just now';
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-500" />
          Recent Activity
        </h2>
        <span className="text-xs text-slate-400 font-medium">Realtime Event Log</span>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No recent activity recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activities.map((act) => {
            const { icon: Icon, badge, iconColor } = getIconAndBadge(act.type);
            return (
              <div key={act.id} className="py-3.5 flex items-start gap-3.5 group">
                <div className={`p-2 rounded-xl shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {act.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded border uppercase tracking-wider ${badge}`}>
                      {act.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {formatTime(act.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
