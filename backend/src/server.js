// ============================================================================
// Server Entry Point
// ============================================================================

require('dotenv').config();
const app = require('./app');
const { getDb } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Initialize DB connection prior to starting listener
try {
    getDb();
    const server = app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 Student Management Portal Backend Server Running!`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
        console.log(`🎓 API Endpoint: http://localhost:${PORT}/api/students`);
        console.log(`=======================================================`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received. Closing HTTP server...');
        server.close(() => {
            console.log('HTTP server closed.');
        });
    });
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}
