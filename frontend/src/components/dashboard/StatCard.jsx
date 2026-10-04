import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'indigo', 
  trend,
  onClick
}) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      badge: 'bg-indigo-100/70 text-indigo-700'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100/70 text-emerald-700'
    },
    amber: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-100/70 text-amber-700'
    },
    rose: {
      bg: 'bg-rose-50/70',
      text: 'text-rose-600',
      border: 'border-rose-100',
      badge: 'bg-rose-100/70 text-rose-700'
    },
    sky: {
      bg: 'bg-sky-50/70',
      text: 'text-sky-600',
      border: 'border-sky-100',
      badge: 'bg-sky-100/70 text-sky-700'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-11 h-11 rounded-xl ${scheme.bg} ${scheme.border} border flex items-center justify-center ${scheme.text} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {subtitle && (
            <p className="text-xs text-slate-500">
              {subtitle}
            </p>
          )}
          {trend && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${scheme.badge}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
