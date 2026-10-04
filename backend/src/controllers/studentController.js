// ============================================================================
// Student Controller - CRUD Operations, Search, Filter, & Dashboard Metrics
// ============================================================================

const { getDb } = require('../config/database');
const { initDatabase } = require('../../../database/init');

/**
 * GET /api/students
 * Retrieves students with search, filters, sorting, and pagination
 */
function getAllStudents(req, res, next) {
    try {
        const db = getDb();
        const {
            search = '',
            department = '',
            year = '',
            status = '',
            gender = '',
            sort_by = 'id',
            sort_order = 'DESC',
            page = 1,
            limit = 10
        } = req.query;

        // Build dynamic SQL query
        const conditions = [];
        const params = [];

        // Search in full_name, student_id, or email
        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            conditions.push('(full_name LIKE ? OR student_id LIKE ? OR email LIKE ?)');
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Filter by Department
        if (department && department.trim() !== '') {
            conditions.push('department = ?');
            params.push(department.trim());
        }

        // Filter by Year
        if (year && year.trim() !== '') {
            conditions.push('year = ?');
            params.push(year.trim());
        }

        // Filter by Status
        if (status && status.trim() !== '') {
            conditions.push('status = ?');
            params.push(status.trim());
        }

        // Filter by Gender
        if (gender && gender.trim() !== '') {
            conditions.push('gender = ?');
            params.push(gender.trim());
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Safe sort column mapping
        const allowedSortColumns = {
            id: 'id',
            student_id: 'student_id',
            full_name: 'full_name',
            email: 'email',
            department: 'department',
            year: 'year',
            status: 'status',
            created_at: 'created_at'
        };

        const sortColumn = allowedSortColumns[sort_by] || 'id';
        const sortDirection = String(sort_order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Count total matching records for pagination
        const countQuery = `SELECT COUNT(*) AS total FROM students ${whereClause}`;
        const totalRecord = db.prepare(countQuery).get(...params);
        const total = totalRecord ? totalRecord.total : 0;

        // Pagination handling
        const isAll = limit === 'all' || Number(limit) <= 0;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = isAll ? total : Math.max(1, parseInt(limit, 10) || 10);
        const offset = isAll ? 0 : (pageNum - 1) * limitNum;
        const totalPages = isAll || total === 0 ? 1 : Math.ceil(total / limitNum);

        // Fetch paginated records
        let dataQuery = `
            SELECT id, student_id, full_name, email, phone, gender, 
                   date_of_birth, course, department, year, address, 
                   status, created_at, updated_at
            FROM students
            ${whereClause}
            ORDER BY ${sortColumn} ${sortDirection}
        `;

        if (!isAll) {
            dataQuery += ` LIMIT ? OFFSET ?`;
            params.push(limitNum, offset);
        }

        const students = db.prepare(dataQuery).all(...params);

        return res.status(200).json({
            success: true,
            data: students,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasPrev: pageNum > 1,
                hasNext: pageNum < totalPages
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/students/:id
 * Fetches a single student by numeric ID or Student ID string (e.g. STU-2024-001)
 */
function getStudentById(req, res, next) {
    try {
        const db = getDb();
        const { id } = req.params;

        const isNumeric = /^\d+$/.test(id);
        const query = isNumeric
            ? 'SELECT * FROM students WHERE id = ?'
            : 'SELECT * FROM students WHERE student_id = ?';

        const student = db.prepare(query).get(isNumeric ? parseInt(id, 10) : id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Student with identifier '${id}' was not found.`
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/students
 * Creates a new student record
 */
function createStudent(req, res, next) {
    try {
        const db = getDb();
        const {
            student_id,
            full_name,
            email,
            phone,
            gender,
            date_of_birth,
            course,
            department,
            year,
            address,
            status = 'Active'
        } = req.body;

        const insertStmt = db.prepare(`
            INSERT INTO students (
                student_id, full_name, email, phone, gender,
                date_of_birth, course, department, year, address, status,
                created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
        `);

        const result = insertStmt.run(
            student_id,
            full_name,
            email,
            phone,
            gender,
            date_of_birth,
            course,
            department,
            year,
            address,
            status
        );

        // Fetch the newly created record
        const newStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);

        return res.status(201).json({
            success: true,
            message: `Student '${full_name}' (${student_id}) has been successfully registered.`,
            data: newStudent
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/students/:id
 * Updates an existing student record
 */
function updateStudent(req, res, next) {
    try {
        const db = getDb();
        const { id } = req.params;

        const existing = db.prepare('SELECT id FROM students WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: `Cannot update. Student with ID ${id} was not found.`
            });
        }

        const {
            student_id,
            full_name,
            email,
            phone,
            gender,
            date_of_birth,
            course,
            department,
            year,
            address,
            status
        } = req.body;

        const updateStmt = db.prepare(`
            UPDATE students SET
                student_id = ?,
                full_name = ?,
                email = ?,
                phone = ?,
                gender = ?,
                date_of_birth = ?,
                course = ?,
                department = ?,
                year = ?,
                address = ?,
                status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        updateStmt.run(
            student_id,
            full_name,
            email,
            phone,
            gender,
            date_of_birth,
            course,
            department,
            year,
            address,
            status,
            id
        );

        const updatedStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(id);

        return res.status(200).json({
            success: true,
            message: `Student '${full_name}' (${student_id}) was successfully updated.`,
            data: updatedStudent
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/students/:id
 * Permanently deletes a student record
 */
function deleteStudent(req, res, next) {
    try {
        const db = getDb();
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete. Student with ID ${id} was not found.`
            });
        }

        db.prepare('DELETE FROM students WHERE id = ?').run(id);

        return res.status(200).json({
            success: true,
            message: `Student record '${existing.full_name}' (${existing.student_id}) was permanently deleted.`,
            data: { id: existing.id, student_id: existing.student_id, full_name: existing.full_name }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/students/stats
 * Aggregates statistics for the dashboard
 */
function getDashboardStats(req, res, next) {
    try {
        const db = getDb();

        // 1. Overall counts
        const total = db.prepare('SELECT COUNT(*) AS count FROM students').get().count;
        const active = db.prepare("SELECT COUNT(*) AS count FROM students WHERE status = 'Active'").get().count;
        const inactive = db.prepare("SELECT COUNT(*) AS count FROM students WHERE status = 'Inactive'").get().count;

        // 2. Recently added students (added in last 30 days or top 5 newest)
        const recentStudents = db.prepare(`
            SELECT id, student_id, full_name, email, department, course, year, status, created_at
            FROM students
            ORDER BY id DESC
            LIMIT 5
        `).all();

        // 3. Department breakdown
        const departmentStats = db.prepare(`
            SELECT department, COUNT(*) AS count
            FROM students
            GROUP BY department
            ORDER BY count DESC
        `).all();

        // 4. Academic Year breakdown
        const yearStats = db.prepare(`
            SELECT year, COUNT(*) AS count
            FROM students
            GROUP BY year
            ORDER BY year ASC
        `).all();

        // 5. Gender distribution
        const genderStats = db.prepare(`
            SELECT gender, COUNT(*) AS count
            FROM students
            GROUP BY gender
        `).all();

        return res.status(200).json({
            success: true,
            data: {
                totalStudents: total,
                activeStudents: active,
                inactiveStudents: inactive,
                recentlyAddedCount: recentStudents.length,
                recentStudents,
                departmentStats,
                yearStats,
                genderStats
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/students/reset
 * Resets database back to default seed records (for demo & testing)
 */
function resetDatabase(req, res, next) {
    try {
        initDatabase(true);
        return res.status(200).json({
            success: true,
            message: 'Database has been successfully reset to default sample records.'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getDashboardStats,
    resetDatabase
};
