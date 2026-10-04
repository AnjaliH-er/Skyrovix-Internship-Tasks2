import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';
import { DEPARTMENTS, ACADEMIC_YEARS } from './SearchFilterBar';

const INITIAL_STATE = {
  student_id: '',
  full_name: '',
  email: '',
  phone: '',
  gender: 'Male',
  date_of_birth: '',
  course: '',
  department: 'Computer Science',
  year: '1st Year',
  address: '',
  status: 'Active'
};

const COURSE_PRESETS = {
  'Computer Science': [
    'B.Tech Computer Science',
    'B.Tech Data Science & AI',
    'B.Tech Software Engineering',
    'B.Sc Computer Science'
  ],
  'Information Technology': [
    'B.Tech Information Technology',
    'B.Tech Cloud Computing',
    'B.Tech Cyber Security'
  ],
  'Electrical Engineering': [
    'B.Tech Electrical Engineering',
    'B.Tech Electronics & Comm.',
    'B.Tech Power Systems'
  ],
  'Mechanical Engineering': [
    'B.Tech Mechanical Engineering',
    'B.Tech Mechatronics',
    'B.Tech Automotive Design'
  ],
  'Civil Engineering': [
    'B.Tech Civil Engineering',
    'B.Tech Structural Engineering',
    'B.Tech Environmental Eng.'
  ],
  'Business Administration': [
    'Bachelor of Business Admin',
    'BBA Finance & Analytics',
    'BBA Marketing Management'
  ]
};

export const EXAMPLE_STUDENTS = [
  {
    full_name: 'Elena Rostova',
    gender: 'Female',
    date_of_birth: '2004-04-16',
    department: 'Information Technology',
    course: 'B.Tech Cyber Security',
    year: '1st Year',
    address: '150 Innovation Way, Apt 4C, Boston, MA',
    status: 'Active'
  },
  {
    full_name: 'Devon Washington',
    gender: 'Male',
    date_of_birth: '2003-08-25',
    department: 'Computer Science',
    course: 'B.Tech Data Science & AI',
    year: '2nd Year',
    address: '772 Technology Parkway, Atlanta, GA',
    status: 'Active'
  },
  {
    full_name: 'Mei-Ling Zhou',
    gender: 'Female',
    date_of_birth: '2002-11-14',
    department: 'Electrical Engineering',
    course: 'B.Tech Electronics & Comm.',
    year: '3rd Year',
    address: '32 Silicon Valley Blvd, San Jose, CA',
    status: 'Active'
  },
  {
    full_name: 'Kavita Ramachandran',
    gender: 'Female',
    date_of_birth: '2003-02-09',
    department: 'Computer Science',
    course: 'B.Tech Software Engineering',
    year: '2nd Year',
    address: '910 University Crescent, Seattle, WA',
    status: 'Active'
  },
  {
    full_name: 'Mateo Fernandez',
    gender: 'Male',
    date_of_birth: '2001-07-30',
    department: 'Mechanical Engineering',
    course: 'B.Tech Mechatronics',
    year: '4th Year',
    address: '428 Industrial Park Drive, Chicago, IL',
    status: 'Active'
  },
  {
    full_name: 'Tariq Mansoor',
    gender: 'Male',
    date_of_birth: '2002-05-18',
    department: 'Business Administration',
    course: 'BBA Finance & Analytics',
    year: '3rd Year',
    address: '600 Financial Plaza, Suite 800, New York, NY',
    status: 'Active'
  }
];

export default function StudentForm({
  initialData = null,
  isEdit = false,
  onSubmit,
  onCancel,
  isLoading = false
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData({
        student_id: initialData.student_id || '',
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: initialData.gender || 'Male',
        date_of_birth: initialData.date_of_birth || '',
        course: initialData.course || '',
        department: initialData.department || 'Computer Science',
        year: initialData.year || '1st Year',
        address: initialData.address || '',
        status: initialData.status || 'Active'
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Client-side validator
  const validate = (dataToValidate = formData) => {
    const errs = {};

    if (!dataToValidate.student_id?.trim()) {
      errs.student_id = 'Student ID is required.';
    } else if (dataToValidate.student_id.trim().length < 3) {
      errs.student_id = 'Student ID must be at least 3 characters.';
    }

    if (!dataToValidate.full_name?.trim()) {
      errs.full_name = 'Full name is required.';
    } else if (dataToValidate.full_name.trim().length < 2) {
      errs.full_name = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dataToValidate.email?.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(dataToValidate.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!dataToValidate.phone?.trim()) {
      errs.phone = 'Phone number is required.';
    } else {
      const digits = dataToValidate.phone.replace(/\D/g, '');
      const validChars = /^[+]?[\d\s\-\(\)\.]+$/.test(dataToValidate.phone);
      if (!validChars || digits.length < 7 || digits.length > 15) {
        errs.phone = 'Please provide a valid phone number (7 to 15 digits).';
      }
    }

    if (!dataToValidate.date_of_birth) {
      errs.date_of_birth = 'Date of birth is required.';
    } else {
      const dob = new Date(dataToValidate.date_of_birth);
      if (isNaN(dob.getTime())) {
        errs.date_of_birth = 'Valid date required.';
      } else if (dob >= new Date()) {
        errs.date_of_birth = 'Date of birth cannot be in the future.';
      }
    }

    if (!dataToValidate.course?.trim()) {
      errs.course = 'Course is required.';
    }

    if (!dataToValidate.department) {
      errs.department = 'Department is required.';
    }

    if (!dataToValidate.year) {
      errs.year = 'Academic year is required.';
    }

    if (!dataToValidate.address?.trim()) {
      errs.address = 'Residential address is required.';
    } else if (dataToValidate.address.trim().length < 5) {
      errs.address = 'Address must be at least 5 characters.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If department changed, suggest default course if current course is empty or from other dept
      if (name === 'department' && COURSE_PRESETS[value]) {
        updated.course = COURSE_PRESETS[value][0] || '';
      }
      return updated;
    });

    // Clear error for this field if valid
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validate();
    if (validationErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleGenerateId = () => {
    const yearPrefix = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generated = `STU-${yearPrefix}-${randomSuffix}`;
    setFormData((prev) => ({ ...prev, student_id: generated }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.student_id;
      return next;
    });
  };

  const handleFillExample = () => {
    const example = EXAMPLE_STUDENTS[exampleIndex % EXAMPLE_STUDENTS.length];
    setExampleIndex((prev) => prev + 1);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newStudentId = `STU-${new Date().getFullYear()}-${randomSuffix}`;
    const nameSlug = example.full_name.toLowerCase().replace(/\s+/g, '.');
    const newEmail = `${nameSlug}.${randomSuffix}@example.edu`;
    const randomPhone = `+1 (555) ${Math.floor(200 + Math.random() * 800)}-${Math.floor(1000 + Math.random() * 9000)}`;

    setFormData({
      student_id: isEdit ? formData.student_id : newStudentId,
      full_name: example.full_name,
      email: newEmail,
      phone: randomPhone,
      gender: example.gender,
      date_of_birth: example.date_of_birth,
      course: example.course,
      department: example.department,
      year: example.year,
      address: example.address,
      status: example.status
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all as touched
      const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(allTouched);
      return;
    }

    try {
      await onSubmit(formData, setErrors);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      }
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrors({});
    setTouched({});
  };

  const availableCourses = COURSE_PRESETS[formData.department] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Section 1: Identification & Personal Info */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
                Personal Information
              </h4>
            </div>
            {!isEdit && (
              <button
                type="button"
                onClick={handleFillExample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors border border-indigo-200/60 shadow-xs"
                title="Populate form with realistic example student details"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Fill Example Data</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Student ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">Student ID *</label>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={handleGenerateId}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto ID</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                name="student_id"
                placeholder="e.g. STU-2024-001"
                value={formData.student_id}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isEdit}
                className={`form-input font-mono ${errors.student_id ? 'border-rose-400 bg-rose-50/20' : ''} ${isEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
              />
              {errors.student_id && (
                <p className="form-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.student_id}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="full_name"
                placeholder="e.g. John Doe"
                value={formData.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.full_name ? 'border-rose-400 bg-rose-50/20' : ''}`}
              />
              {errors.full_name && (
                <p className="form-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="form-label">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.date_of_birth ? 'border-rose-400 bg-rose-50/20' : ''}`}
              />
              {errors.date_of_birth && (
                <p className="form-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.date_of_birth}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="student@example.edu"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.email ? 'border-rose-400 bg-rose-50/20' : ''}`}
              />
              {errors.email && (
                <p className="form-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                name="phone"
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input font-mono ${errors.phone ? 'border-rose-400 bg-rose-50/20' : ''}`}
              />
              {errors.phone && (
                <p className="form-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Academic Program Information */}
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
              Academic Program & Enrollment
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Department */}
            <div>
              <label className="form-label">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="form-label">Course / Degree Program *</label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  name="course"
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.course}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  list="course-suggestions"
                  className={`form-input ${errors.course ? 'border-rose-400 bg-rose-50/20' : ''}`}
                />
                <datalist id="course-suggestions">
                  {availableCourses.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              {errors.course && (
                <p className="form-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.course}
                </p>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="form-label">Academic Year *</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="form-label">Enrollment Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="form-label">Residential Address *</label>
              <input
                type="text"
                name="address"
                placeholder="Street address, City, State, ZIP"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.address ? 'border-rose-400 bg-rose-50/20' : ''}`}
              />
              {errors.address && (
                <p className="form-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Fields</span>
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEdit ? 'Saving Changes...' : 'Registering Student...'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Save Changes' : 'Register Student'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
