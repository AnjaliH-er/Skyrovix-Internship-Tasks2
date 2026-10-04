// ============================================================================
// Database Initialization & Seed Runner
// Uses Node 22+ built-in node:sqlite (zero external compilation dependencies)
// ============================================================================

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.env.DB_PATH && path.isAbsolute(process.env.DB_PATH)
    ? process.env.DB_PATH
    : path.resolve(__dirname, 'students.db');
const SCHEMA_PATH = path.resolve(__dirname, 'schema.sql');
const SEED_PATH = path.resolve(__dirname, 'seed.sql');

function initDatabase(forceSeed = false) {
    console.log(`[Database] Initializing SQLite database at: ${DB_PATH}`);
    
    // Ensure database directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = new DatabaseSync(DB_PATH);

    // Enable foreign keys and WAL mode for reliability & performance
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('PRAGMA journal_mode = WAL;');

    // Load and execute schema
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schemaSql);
    console.log('[Database] Schema loaded successfully.');

    // Check if table is empty or forced seed
    const countRow = db.prepare('SELECT COUNT(*) AS count FROM students').get();
    const studentCount = countRow ? countRow.count : 0;

    if (studentCount === 0 || forceSeed) {
        if (forceSeed && studentCount > 0) {
            console.log('[Database] Resetting existing student records...');
            db.exec('DELETE FROM students;');
        }
        console.log('[Database] Seeding sample student records...');
        const seedSql = fs.readFileSync(SEED_PATH, 'utf-8');
        db.exec(seedSql);
        const newCount = db.prepare('SELECT COUNT(*) AS count FROM students').get().count;
        console.log(`[Database] Seed complete. Total students: ${newCount}`);
    } else {
        console.log(`[Database] Existing database contains ${studentCount} students. Skipping re-seed.`);
    }

    return db;
}

if (require.main === module) {
    const isForce = process.argv.includes('--force') || process.argv.includes('--seed');
    try {
        initDatabase(isForce);
        console.log('[Database] Database ready for use.');
    } catch (err) {
        console.error('[Database] Initialization error:', err);
        process.exit(1);
    }
}

module.exports = { initDatabase, DB_PATH };
