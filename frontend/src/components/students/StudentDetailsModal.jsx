import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  GraduationCap, 
  Clock, 
  Edit3, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import Modal from '../common/Modal';

export default function StudentDetailsModal({ isOpen, onClose, student, onEdit }) {
  if (!student) return null;

  const isActive = student.status === 'Active';

  // Calculate age if DOB is present
  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(student.date_of_birth);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Profile Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Profile Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/30">
              {student.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {student.full_name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-indigo-200 font-mono">
                <span>{student.student_id}</span>
                <span>•</span>
                <span>{student.department}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isActive 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-slate-700 text-slate-300 border border-slate-600'
            }`}>
              {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {student.status}
            </span>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Email */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Email Address
              </span>
              <a 
                href={`mailto:${student.email}`}
                className="font-medium text-slate-800 hover:text-indigo-600 transition-colors break-all"
              >
                {student.email}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Phone Number
              </span>
              <a 
                href={`tel:${student.phone}`}
                className="font-mono font-medium text-slate-800 hover:text-indigo-600 transition-colors"
              >
                {student.phone}
              </a>
            </div>
          </div>

          {/* Department */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Department
              </span>
              <span className="font-semibold text-slate-800">
                {student.department}
              </span>
            </div>
          </div>

          {/* Course & Degree */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Course Program
              </span>
              <span className="font-semibold text-slate-800">
                {student.course}
              </span>
            </div>
          </div>

          {/* Academic Year */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Academic Year
              </span>
              <span className="font-semibold text-slate-800">
                {student.year}
              </span>
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Gender & Birth Date
              </span>
              <span className="font-medium text-slate-800">
                {student.gender} • {student.date_of_birth} {age ? `(${age} yrs)` : ''}
              </span>
            </div>
          </div>

          {/* Residential Address */}
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Residential Address
              </span>
              <span className="font-medium text-slate-700 leading-relaxed">
                {student.address}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Timestamps */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Enrolled: {student.created_at || 'N/A'}</span>
          </div>
          {student.updated_at && (
            <div>
              <span>Last updated: {student.updated_at}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Student</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
