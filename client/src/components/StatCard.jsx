import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', onClick }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      badge: 'bg-blue-100/70 text-blue-800'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100/70 text-emerald-800'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-100/70 text-amber-800'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      badge: 'bg-purple-100/70 text-purple-800'
    },
    navy: {
      bg: 'bg-navy-50 text-navy-800',
      border: 'border-navy-100',
      badge: 'bg-navy-100 text-navy-900'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      badge: 'bg-rose-100/70 text-rose-800'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`card-surface p-5 sm:p-6 relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`w-12 h-12 rounded-2xl ${scheme.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${scheme.bg.split(' ')[0]}`} />
    </div>
  );
}
