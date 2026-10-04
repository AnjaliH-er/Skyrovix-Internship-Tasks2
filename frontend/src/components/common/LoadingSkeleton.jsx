import React from 'react';

export function TableSkeleton({ rows = 6, cols = 8 }) {
  return (
    <div className="w-full overflow-hidden animate-pulse">
      <div className="space-y-3 p-4">
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-b-0">
            {Array.from({ length: cols }).map((_, cIndex) => (
              <div 
                key={cIndex} 
                className={`h-4 bg-slate-200 rounded ${
                  cIndex === 0 ? 'w-24' : cIndex === 1 ? 'w-40' : cIndex === 2 ? 'w-48' : 'w-20'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        <div className="w-16 h-4 bg-slate-200 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="w-20 h-7 bg-slate-200 rounded" />
        <div className="w-28 h-4 bg-slate-100 rounded" />
      </div>
    </div>
  );
}
