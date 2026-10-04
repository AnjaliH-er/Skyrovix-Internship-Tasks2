// ============================================================================
// Backend Database Connection Handler
// Connects to SQLite database using Node's native DatabaseSync
// ============================================================================

const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const { initDatabase } = require('../../../database/init');

let dbInstance = null;

function getDb() {
    if (!dbInstance) {
        const defaultDbPath = path.resolve(__dirname, '../../../database/students.db');
        const configuredPath = process.env.DB_PATH;
        let resolvedPath;

        if (configuredPath) {
            resolvedPath = path.isAbsolute(configuredPath)
                ? configuredPath
                : path.resolve(process.cwd(), configuredPath);
        } else {
            resolvedPath = path.resolve(__dirname, '../../../../student management portal/database/students.db');
            if (!fs.existsSync(resolvedPath)) {
                resolvedPath = path.resolve(__dirname, '../../database/students.db');
            }
        }

        // Standardize: if students.db exists in database/, use that
        const projectDbPath = path.resolve(__dirname, '../../database/students.db');
        if (fs.existsSync(projectDbPath)) {
            resolvedPath = projectDbPath;
        }

        // Ensure database is initialized
        if (!fs.existsSync(resolvedPath)) {
            console.log('[DB Config] Database file not found. Running initialization...');
            initDatabase(true);
        }

        dbInstance = new DatabaseSync(resolvedPath);
        dbInstance.exec('PRAGMA foreign_keys = ON;');
        dbInstance.exec('PRAGMA journal_mode = WAL;');
        console.log(`[DB Config] Connected to SQLite database at ${resolvedPath}`);
    }
    return dbInstance;
}

module.exports = { getDb };
