// ============================================================================
// Student Request Validation & Sanitization Middleware
// ============================================================================

const { getDb } = require('../config/database');

// Utility to sanitize strings against XSS / HTML tags
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/<[^>]*>?/gm, '') // Strip HTML tags
        .trim();
}

// Email format regex (RFC 5322 compliant simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone format regex (supports international, hyphens, brackets, spaces)
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

// Date of birth format regex YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const VALID_GENDERS = ['Male', 'Female', 'Other'];
const VALID_STATUSES = ['Active', 'Inactive'];
const VALID_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

/**
 * Validates and sanitizes the student request body for POST (create) and PUT (update)
 */
function validateStudent(isUpdate = false) {
    return (req, res, next) => {
        const errors = {};
        const db = getDb();
        const body = req.body || {};

        // Sanitize string inputs
        const sanitized = {
            student_id: sanitizeString(body.student_id),
            full_name: sanitizeString(body.full_name),
            email: sanitizeString(body.email).toLowerCase(),
            phone: sanitizeString(body.phone),
            gender: sanitizeString(body.gender),
            date_of_birth: sanitizeString(body.date_of_birth),
            course: sanitizeString(body.course),
            department: sanitizeString(body.department),
            year: sanitizeString(body.year),
            address: sanitizeString(body.address),
            status: sanitizeString(body.status) || 'Active'
        };

        // 1. Student ID validation
        if (!sanitized.student_id) {
            errors.student_id = 'Student ID is required.';
        } else if (sanitized.student_id.length < 3 || sanitized.student_id.length > 30) {
            errors.student_id = 'Student ID must be between 3 and 30 characters.';
        } else {
            // Check for uniqueness
            let checkQuery = 'SELECT id FROM students WHERE student_id = ?';
            const params = [sanitized.student_id];
            if (isUpdate && req.params.id) {
                checkQuery += ' AND id != ?';
                params.push(req.params.id);
            }
            const existing = db.prepare(checkQuery).get(...params);
            if (existing) {
                errors.student_id = `Student ID '${sanitized.student_id}' is already assigned to another student.`;
            }
        }

        // 2. Full Name validation
        if (!sanitized.full_name) {
            errors.full_name = 'Full name is required.';
        } else if (sanitized.full_name.length < 2 || sanitized.full_name.length > 100) {
            errors.full_name = 'Full name must be between 2 and 100 characters.';
        }

        // 3. Email validation
        if (!sanitized.email) {
            errors.email = 'Email address is required.';
        } else if (!EMAIL_REGEX.test(sanitized.email)) {
            errors.email = 'Please provide a valid email address (e.g., student@example.edu).';
        } else {
            // Check for uniqueness
            let checkEmailQuery = 'SELECT id FROM students WHERE email = ?';
            const emailParams = [sanitized.email];
            if (isUpdate && req.params.id) {
                checkEmailQuery += ' AND id != ?';
                emailParams.push(req.params.id);
            }
            const existingEmail = db.prepare(checkEmailQuery).get(...emailParams);
            if (existingEmail) {
                errors.email = `Email address '${sanitized.email}' is already registered.`;
            }
        }

        // 4. Phone validation
        if (!sanitized.phone) {
            errors.phone = 'Phone number is required.';
        } else {
            const digits = sanitized.phone.replace(/\D/g, '');
            const validChars = /^[+]?[\d\s\-\(\)\.]+$/.test(sanitized.phone);
            if (!validChars || digits.length < 7 || digits.length > 15) {
                errors.phone = 'Please provide a valid phone number (7 to 15 digits, e.g., +1 555-123-4567).';
            }
        }

        // 5. Gender validation
        if (!sanitized.gender) {
            errors.gender = 'Gender is required.';
        } else if (!VALID_GENDERS.includes(sanitized.gender)) {
            errors.gender = `Gender must be one of: ${VALID_GENDERS.join(', ')}.`;
        }

        // 6. Date of Birth validation
        if (!sanitized.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required.';
        } else if (!DATE_REGEX.test(sanitized.date_of_birth)) {
            errors.date_of_birth = 'Date of birth must be in YYYY-MM-DD format.';
        } else {
            const dob = new Date(sanitized.date_of_birth);
            const now = new Date();
            if (isNaN(dob.getTime())) {
                errors.date_of_birth = 'Invalid date provided.';
            } else if (dob >= now) {
                errors.date_of_birth = 'Date of birth cannot be in the future.';
            }
        }

        // 7. Course & Department & Year validation
        if (!sanitized.course) {
            errors.course = 'Course is required.';
        }
        if (!sanitized.department) {
            errors.department = 'Department is required.';
        }
        if (!sanitized.year) {
            errors.year = 'Academic year is required.';
        }

        // 8. Address validation
        if (!sanitized.address) {
            errors.address = 'Residential address is required.';
        } else if (sanitized.address.length < 5) {
            errors.address = 'Address must be at least 5 characters.';
        }

        // 9. Status validation
        if (sanitized.status && !VALID_STATUSES.includes(sanitized.status)) {
            errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}.`;
        }

        // If validation errors exist, return 400 Bad Request with details
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed. Please correct the highlighted fields.',
                errors
            });
        }

        // Replace request body with sanitized version
        req.body = sanitized;
        next();
    };
}

module.exports = {
    validateStudent,
    sanitizeString
};
