import React from 'react';
import { Eye, ArrowRight, Clock } from 'lucide-react';

export default function RecentStudentsTable({ students = [], onViewStudent, onViewAll }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800 tracking-tight">
              Recently Enrolled Students
            </h3>
            <p className="text-xs text-slate-500">
              Latest additions to the academic registry
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>View All Students</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
              <th className="py-3 px-4 sm:px-6">Student ID</th>
              <th className="py-3 px-4 sm:px-6">Full Name</th>
              <th className="py-3 px-4 sm:px-6">Department</th>
              <th className="py-3 px-4 sm:px-6">Course</th>
              <th className="py-3 px-4 sm:px-6">Year</th>
              <th className="py-3 px-4 sm:px-6">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const isActive = student.status === 'Active';
              return (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-medium text-slate-700">
                    {student.student_id}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                    {student.full_name}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                    {student.department}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-500 truncate max-w-[160px]">
                    {student.course}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                    {student.year}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => onViewStudent(student)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      title="View Student Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                  No recently added students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
