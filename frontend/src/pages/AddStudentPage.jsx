import React, { useState } from 'react';
import { UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import StudentForm from '../components/students/StudentForm';
import { createStudent } from '../api/studentApi';
import { useNotification } from '../context/NotificationContext';

export default function AddStudentPage({ onNavigateToStudents, onStudentCreated }) {
  const { notify } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  const handleSubmit = async (formData, setFormErrors) => {
    setIsLoading(true);
    try {
      const res = await createStudent(formData);
      notify(res.message || 'Student enrolled successfully!', 'success');
      setLastCreated(res.data);
      if (onStudentCreated) onStudentCreated(res.data);
    } catch (err) {
      if (err.errors) {
        setFormErrors(err.errors);
      }
      notify(err.message || 'Failed to register student.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onNavigateToStudents}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Students</span>
          </button>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Student Registration</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enroll a new student record into the academic management system.
          </p>
        </div>
      </div>

      {/* Success banner if a student was just registered */}
      {lastCreated && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start sm:items-center justify-between gap-3 text-emerald-900 animate-slide-up">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">{lastCreated.full_name}</span> ({lastCreated.student_id}) has been added to the database.
            </div>
          </div>
          <button
            onClick={onNavigateToStudents}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-sm"
          >
            View in Registry
          </button>
        </div>
      )}

      {/* Student Form */}
      <StudentForm
        isEdit={false}
        onSubmit={handleSubmit}
        onCancel={onNavigateToStudents}
        isLoading={isLoading}
      />
    </div>
  );
}
