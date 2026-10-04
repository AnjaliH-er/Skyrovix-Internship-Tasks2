// ============================================================================
// Global Error & 404 Handling Middleware
// ============================================================================

function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`
    });
}

function errorHandler(err, req, res, next) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

    // Handle SQLite unique constraint error if caught at DB level
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
        let field = 'Field';
        if (err.message.includes('students.student_id')) field = 'Student ID';
        else if (err.message.includes('students.email')) field = 'Email';

        return res.status(409).json({
            success: false,
            message: `${field} must be unique. A record with this value already exists.`
        });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error occurred.',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}

module.exports = {
    notFoundHandler,
    errorHandler
};
