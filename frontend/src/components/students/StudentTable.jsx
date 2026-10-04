import React from 'react';
import { Eye, Edit3, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, User } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { TableSkeleton } from '../common/LoadingSkeleton';

export default function StudentTable({
  students = [],
  isLoading = false,
  pagination = {},
  onPageChange,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  onAddNew
}) {
  const { page = 1, totalPages = 1, total = 0, limit = 10 } = pagination;

  const renderSortIndicator = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />;
    }
    return (
      <span className="text-indigo-600 font-bold text-xs ml-1">
        {sortOrder === 'ASC' ? '▲' : '▼'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
        <TableSkeleton rows={8} cols={9} />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <EmptyState
        title="No students found"
        description="There are currently no student records matching your query or filter criteria."
        actionText="Add New Student"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-semibold select-none">
              <th 
                onClick={() => onSort('student_id')}
                className="py-3.5 px-4 sm:px-6 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Student ID</span>
                  {renderSortIndicator('student_id')}
                </div>
              </th>

              <th 
                onClick={() => onSort('full_name')}
                className="py-3.5 px-4 sm:px-6 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Full Name</span>
                  {renderSortIndicator('full_name')}
                </div>
              </th>

              <th className="py-3.5 px-4 sm:px-6">Email & Phone</th>
              <th className="py-3.5 px-4 sm:px-6">Gender</th>
              <th className="py-3.5 px-4 sm:px-6">DOB</th>

              <th 
                onClick={() => onSort('department')}
                className="py-3.5 px-4 sm:px-6 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  {renderSortIndicator('department')}
                </div>
              </th>

              <th className="py-3.5 px-4 sm:px-6">Course</th>

              <th 
                onClick={() => onSort('year')}
                className="py-3.5 px-4 sm:px-6 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Year</span>
                  {renderSortIndicator('year')}
                </div>
              </th>

              <th 
                onClick={() => onSort('status')}
                className="py-3.5 px-4 sm:px-6 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIndicator('status')}
                </div>
              </th>

              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const isActive = student.status === 'Active';

              return (
                <tr 
                  key={student.id} 
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  {/* Student ID */}
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-slate-800 whitespace-nowrap">
                    {student.student_id}
                  </td>

                  {/* Full Name */}
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {student.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {student.full_name}
                      </span>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{student.email}</div>
                    <div className="text-slate-400 text-xs font-mono">{student.phone}</div>
                  </td>

                  {/* Gender */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                    {student.gender}
                  </td>

                  {/* Date of Birth */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap font-mono text-xs">
                    {student.date_of_birth}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 whitespace-nowrap font-medium">
                    {student.department}
                  </td>

                  {/* Course */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 truncate max-w-[170px]" title={student.course}>
                    {student.course}
                  </td>

                  {/* Year */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {student.year}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {student.status}
                    </span>
                  </td>

                  {/* Actions (View, Edit, Delete) */}
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(student)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Full Profile"
                        aria-label="View Student"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit(student)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Student Record"
                        aria-label="Edit Student"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(student)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Student Record"
                        aria-label="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-800">{students.length}</span> of{' '}
          <span className="font-semibold text-slate-800">{total}</span> total students
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="px-2 font-medium text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
