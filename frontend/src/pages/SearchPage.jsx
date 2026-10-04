import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  MapPin, 
  Sparkles, 
  X, 
  Filter, 
  UserCheck, 
  Users,
  Grid3X3,
  List
} from 'lucide-react';
import StudentDetailsModal from '../components/students/StudentDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import StudentForm from '../components/students/StudentForm';
import EmptyState from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { getStudents, updateStudent, deleteStudent } from '../api/studentApi';
import { useNotification } from '../context/NotificationContext';
import { DEPARTMENTS, ACADEMIC_YEARS } from '../components/students/SearchFilterBar';

export default function SearchPage({ initialQuery = '', onNavigateToAddStudent, onDataModified }) {
  const { notify } = useNotification();

  const [search, setSearch] = useState(initialQuery);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getStudents({
        search,
        department: selectedDepartment,
        year: selectedYear,
        status: selectedStatus,
        limit: 100 // High limit for directory exploration
      });
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      notify(err.message || 'Failed to search students.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedDepartment, selectedYear, selectedStatus, notify]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchResults]);

  const handleClearAll = () => {
    setSearch('');
    setSelectedDepartment('');
    setSelectedYear('');
    setSelectedStatus('');
  };

  const hasFilters = Boolean(search || selectedDepartment || selectedYear || selectedStatus);

  const handleUpdateSubmit = async (formData, setFormErrors) => {
    setIsUpdating(true);
    try {
      const res = await updateStudent(selectedStudentForEdit.id, formData);
      notify(res.message || 'Student updated successfully.', 'success');
      setSelectedStudentForEdit(null);
      await fetchResults();
      if (onDataModified) onDataModified();
    } catch (err) {
      if (err.errors) setFormErrors(err.errors);
      notify(err.message || 'Failed to update student.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudentForDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteStudent(selectedStudentForDelete.id);
      notify(res.message || 'Student deleted successfully.', 'success');
      setSelectedStudentForDelete(null);
      await fetchResults();
      if (onDataModified) onDataModified();
    } catch (err) {
      notify(err.message || 'Failed to delete student.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            Directory Explorer
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">Instant Live Search</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Interactive Student Directory
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Visual card directory designed for rapid lookup across all student profiles, contacts, and departments.
        </p>
      </div>

      {/* Hero Spotlight Search Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 space-y-5">
        <div className="relative">
          <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Type any student name, Student ID (e.g. STU-2024-001), or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder-indigo-200/70 border border-white/20 focus:border-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400/30 transition-all text-sm sm:text-base font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white p-1 rounded-lg"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Tag Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-indigo-200">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Quick Filter By Department
            </span>
            {hasFilters && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white underline font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDepartment('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDepartment === ''
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              All Departments
            </button>

            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(selectedDepartment === dept ? '' : dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDepartment === dept
                    ? 'bg-indigo-400 text-slate-950 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Secondary Filter Row: Status & Year */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-xs">
            <span className="text-indigo-200 font-semibold text-[11px] uppercase tracking-wider">
              Status:
            </span>
            <div className="flex items-center gap-1.5">
              {['', 'Active', 'Inactive'].map((st) => (
                <button
                  key={st || 'all'}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedStatus === st
                      ? 'bg-white text-indigo-950 font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-indigo-100'
                  }`}
                >
                  {st || 'All Statuses'}
                </button>
              ))}
            </div>

            <span className="text-indigo-200 font-semibold text-[11px] uppercase tracking-wider ml-2">
              Year:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:bg-slate-800"
            >
              <option value="" className="bg-slate-900 text-white">All Years</option>
              {ACADEMIC_YEARS.map((yr) => (
                <option key={yr} value={yr} className="bg-slate-900 text-white">
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Results Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Showing {students.length} Student Profiles</span>
          {hasFilters && (
            <span className="text-slate-400 font-normal">
              (Filtered from academic database)
            </span>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Detailed List</span>
          </button>
        </div>
      </div>

      {/* Results Content */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <TableSkeleton rows={6} cols={6} />
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          title="No student profiles found"
          description="We couldn't find any student records matching your query. Try searching with different keywords or reset your filter chips."
          actionText="Add New Student"
          onAction={onNavigateToAddStudent}
        />
      ) : viewMode === 'grid' ? (
        /* Visual Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => {
            const isActive = student.status === 'Active';
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Decorative Top Accent Bar */}
                <div className={`h-1.5 w-full absolute top-0 left-0 ${isActive ? 'bg-indigo-600' : 'bg-slate-300'}`} />

                <div>
                  {/* Card Header: Avatar, Name, ID, Status */}
                  <div className="flex items-start justify-between gap-3 pt-1 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/20">
                        {student.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {student.full_name}
                        </h4>
                        <span className="font-mono text-xs text-indigo-600 font-semibold block">
                          {student.student_id}
                        </span>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {student.status}
                    </span>
                  </div>

                  {/* Academic Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                      {student.department}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {student.year}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {student.gender}
                    </span>
                  </div>

                  {/* Contact & Program Info */}
                  <div className="space-y-2 py-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="font-medium text-slate-800 truncate" title={student.course}>
                      🎓 {student.course}
                    </div>

                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${student.email}`} className="truncate hover:text-indigo-600 transition-colors">
                        {student.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <a href={`tel:${student.phone}`} className="hover:text-indigo-600 transition-colors">
                        {student.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 truncate" title={student.address}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{student.address}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => setSelectedStudentForView(student)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedStudentForEdit(student)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Student"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedStudentForDelete(student)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed List View */
        <div className="space-y-3">
          {students.map((student) => {
            const isActive = student.status === 'Active';
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {student.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {student.full_name}
                      </h4>
                      <span className="font-mono text-xs text-indigo-600 font-semibold">
                        {student.student_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span>{student.department}</span>
                      <span>•</span>
                      <span className="truncate">{student.course}</span>
                      <span>•</span>
                      <span>{student.year}</span>
                      <span>•</span>
                      <span className="font-mono">{student.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => setSelectedStudentForView(student)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudentForEdit(student)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit Student"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedStudentForDelete(student)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Student Modal */}
      <StudentDetailsModal
        isOpen={Boolean(selectedStudentForView)}
        onClose={() => setSelectedStudentForView(null)}
        student={selectedStudentForView}
        onEdit={(student) => {
          setSelectedStudentForView(null);
          setSelectedStudentForEdit(student);
        }}
      />

      {/* Edit Student Modal */}
      <Modal
        isOpen={Boolean(selectedStudentForEdit)}
        onClose={() => setSelectedStudentForEdit(null)}
        title="Edit Student Information"
        maxWidth="max-w-3xl"
      >
        {selectedStudentForEdit && (
          <StudentForm
            initialData={selectedStudentForEdit}
            isEdit={true}
            onSubmit={handleUpdateSubmit}
            onCancel={() => setSelectedStudentForEdit(null)}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(selectedStudentForDelete)}
        onClose={() => setSelectedStudentForDelete(null)}
        onConfirm={handleDeleteConfirm}
        studentName={selectedStudentForDelete?.full_name}
        studentId={selectedStudentForDelete?.student_id}
        isLoading={isDeleting}
      />
    </div>
  );
}
