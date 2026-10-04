import React from 'react';
import { Building2, Calendar, UserCheck } from 'lucide-react';

export default function QuickStats({ departmentStats = [], yearStats = [], genderStats = [], totalStudents = 0 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Department Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 tracking-tight">
                Department Enrollment
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {departmentStats.length} Depts
            </span>
          </div>

          <div className="space-y-3.5">
            {departmentStats.map((item, index) => {
              const percentage = totalStudents > 0 ? Math.round((item.count / totalStudents) * 100) : 0;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">
                      {item.department}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {item.count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {departmentStats.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">No department data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Academic Year Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 tracking-tight">
                Academic Year Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Progression
            </span>
          </div>

          <div className="space-y-3.5">
            {yearStats.map((item, index) => {
              const percentage = totalStudents > 0 ? Math.round((item.count / totalStudents) * 100) : 0;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {item.year}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {item.count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {yearStats.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">No academic year data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Student Demographics & Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 tracking-tight">
                Gender Representation
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Demographics
            </span>
          </div>

          <div className="space-y-4">
            {genderStats.map((item, index) => {
              const percentage = totalStudents > 0 ? Math.round((item.count / totalStudents) * 100) : 0;
              const isFemale = item.gender === 'Female';
              const isMale = item.gender === 'Male';
              const barColor = isFemale ? 'bg-rose-500' : isMale ? 'bg-sky-500' : 'bg-amber-500';

              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {item.gender}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {item.count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${barColor} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {genderStats.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">No gender demographic data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
