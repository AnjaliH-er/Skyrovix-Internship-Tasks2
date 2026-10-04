import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Users } from 'lucide-react';
import SearchFilterBar from '../components/students/SearchFilterBar';
import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import StudentDetailsModal from '../components/students/StudentDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { getStudents, updateStudent, deleteStudent } from '../api/studentApi';
import { useNotification } from '../context/NotificationContext';

export default function StudentsPage({ onNavigateToAddStudent, onDataModified }) {
  const { notify } = useNotification();

  // Query & Filter States
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Data States
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load students from backend API
  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getStudents({
        search,
        department,
        year,
        status,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        limit
      });

      if (res.success) {
        setStudents(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      notify(err.message || 'Failed to load students.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, department, year, status, sortBy, sortOrder, page, limit, notify]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Handle sorting click
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSearch('');
    setDepartment('');
    setYear('');
    setStatus('');
    setPage(1);
  };

  // Handle student update submit
  const handleUpdateSubmit = async (formData, setFormErrors) => {
    setIsUpdating(true);
    try {
      const res = await updateStudent(selectedStudentForEdit.id, formData);
      notify(res.message || 'Student record successfully updated.', 'success');
      setSelectedStudentForEdit(null);
      await loadStudents();
      if (onDataModified) onDataModified();
    } catch (err) {
      if (err.errors) {
        setFormErrors(err.errors);
      }
      notify(err.message || 'Failed to update student.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedStudentForDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteStudent(selectedStudentForDelete.id);
      notify(res.message || 'Student deleted successfully.', 'success');
      setSelectedStudentForDelete(null);
      await loadStudents();
      if (onDataModified) onDataModified();
    } catch (err) {
      notify(err.message || 'Failed to delete student.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Student Records Registry</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/60 font-semibold text-indigo-700">
              {pagination.total ?? 0} Students
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, view, edit, or delete enrolled students with database synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadStudents}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={onNavigateToAddStudent}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <SearchFilterBar
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        department={department}
        setDepartment={(val) => {
          setDepartment(val);
          setPage(1);
        }}
        year={year}
        setYear={(val) => {
          setYear(val);
          setPage(1);
        }}
        status={status}
        setStatus={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Student Records Data Table */}
      <StudentTable
        students={students}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onView={(student) => setSelectedStudentForView(student)}
        onEdit={(student) => setSelectedStudentForEdit(student)}
        onDelete={(student) => setSelectedStudentForDelete(student)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onAddNew={onNavigateToAddStudent}
      />

      {/* View Student Profile Modal */}
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
