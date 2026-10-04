// ============================================================================
// Automated End-to-End API Test Suite
// Tests CRUD operations, validations, search, filtering, and stats
// ============================================================================

const http = require('http');
const app = require('../src/app');
const { initDatabase } = require('../../database/init');

let server;
const PORT = 5055; // Dedicated test port
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch {
                    parsed = data;
                }
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: parsed
                });
            });
        });

        req.on('error', reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`  ✓ ${message}`);
}

async function runTests() {
    console.log('\n=======================================================');
    console.log('🧪 Starting API Verification & Test Suite');
    console.log('=======================================================\n');

    // 1. Reset database to clean seed state
    console.log('1. Preparing test database...');
    initDatabase(true);

    // 2. Start server on test port
    await new Promise((resolve) => {
        server = app.listen(PORT, resolve);
    });
    console.log(`Test server running on ${BASE_URL}\n`);

    try {
        // Test 1: Health check
        console.log('Testing: Health Check');
        const healthRes = await request('GET', '/api/health');
        assert(healthRes.status === 200, 'Health check returns status 200');
        assert(healthRes.body.status === 'UP', 'Health check returns status UP');

        // Test 2: Fetch all students
        console.log('\nTesting: GET /api/students');
        const listRes = await request('GET', '/api/students');
        assert(listRes.status === 200, 'GET /api/students returns status 200');
        assert(Array.isArray(listRes.body.data), 'Returns data array');
        assert(listRes.body.data.length >= 10, `Returns at least 10 seed students (got ${listRes.body.data.length})`);
        assert(listRes.body.pagination.total >= 10, 'Pagination total is accurate');

        // Test 3: Dashboard Stats
        console.log('\nTesting: GET /api/students/stats');
        const statsRes = await request('GET', '/api/students/stats');
        assert(statsRes.status === 200, 'Stats returns status 200');
        assert(statsRes.body.data.totalStudents >= 10, 'Total students count is correct');
        assert(statsRes.body.data.activeStudents > 0, 'Active students count is > 0');
        assert(statsRes.body.data.inactiveStudents > 0, 'Inactive students count is > 0');
        assert(statsRes.body.data.departmentStats.length > 0, 'Department breakdown is populated');

        // Test 4: Create new student (POST /api/students)
        console.log('\nTesting: POST /api/students (Create Student)');
        const newStudentPayload = {
            student_id: 'STU-2024-TEST99',
            full_name: 'Jordan Oliver',
            email: 'jordan.oliver.test@example.edu',
            phone: '+1 (555) 999-8877',
            gender: 'Male',
            date_of_birth: '2003-09-15',
            course: 'B.Tech Robotics & AI',
            department: 'Computer Science',
            year: '2nd Year',
            address: '420 Quantum Way, Pasadena, CA',
            status: 'Active'
        };

        const createRes = await request('POST', '/api/students', newStudentPayload);
        if (createRes.status !== 201) {
            console.error('Create student failed with response:', JSON.stringify(createRes.body, null, 2));
        }
        assert(createRes.status === 201, 'Create student returns status 201');
        assert(createRes.body.data.student_id === 'STU-2024-TEST99', 'Created student has correct student_id');
        assert(createRes.body.data.full_name === 'Jordan Oliver', 'Created student has correct name');
        const createdId = createRes.body.data.id;

        // Test 5: Duplicate Prevention
        console.log('\nTesting: Duplicate Validation (Student ID & Email)');
        const dupRes = await request('POST', '/api/students', newStudentPayload);
        assert(dupRes.status === 400, 'Duplicate submission returns status 400');
        assert(dupRes.body.errors && dupRes.body.errors.student_id, 'Returns student_id duplicate error');

        // Test 6: Validation Errors on Malformed Input
        console.log('\nTesting: Input Validation (Invalid Email & Missing Fields)');
        const invalidRes = await request('POST', '/api/students', {
            student_id: '',
            full_name: 'X',
            email: 'invalid-email',
            phone: '123'
        });
        assert(invalidRes.status === 400, 'Invalid payload returns 400');
        assert(invalidRes.body.errors.email, 'Flags invalid email error');
        assert(invalidRes.body.errors.student_id, 'Flags required student_id error');

        // Test 7: GET single student by ID
        console.log('\nTesting: GET /api/students/:id');
        const getSingleRes = await request('GET', `/api/students/${createdId}`);
        assert(getSingleRes.status === 200, 'Fetch by ID returns 200');
        assert(getSingleRes.body.data.email === 'jordan.oliver.test@example.edu', 'Email matches');

        // Test 8: UPDATE student (PUT /api/students/:id)
        console.log('\nTesting: PUT /api/students/:id (Update Student)');
        const updatePayload = {
            ...newStudentPayload,
            full_name: 'Jordan Oliver Updated',
            status: 'Inactive',
            year: '3rd Year'
        };
        const updateRes = await request('PUT', `/api/students/${createdId}`, updatePayload);
        assert(updateRes.status === 200, 'Update returns status 200');
        assert(updateRes.body.data.full_name === 'Jordan Oliver Updated', 'Name was updated');
        assert(updateRes.body.data.status === 'Inactive', 'Status was updated to Inactive');

        // Test 9: Search functionality
        console.log('\nTesting: Search by Name, Student ID, and Email');
        const searchByNameRes = await request('GET', '/api/students?search=Jordan');
        assert(searchByNameRes.body.data.some(s => s.id === createdId), 'Finds student by name search');

        const searchByIdRes = await request('GET', '/api/students?search=TEST99');
        assert(searchByIdRes.body.data.some(s => s.id === createdId), 'Finds student by student_id search');

        // Test 10: Filtering by Department & Status
        console.log('\nTesting: Filtering by Department & Status');
        const filterRes = await request('GET', '/api/students?department=Computer%20Science&status=Inactive');
        assert(filterRes.status === 200, 'Filtering returns 200');
        assert(filterRes.body.data.every(s => s.department === 'Computer Science' && s.status === 'Inactive'), 'All filtered records match criteria');

        // Test 11: DELETE student (DELETE /api/students/:id)
        console.log('\nTesting: DELETE /api/students/:id');
        const deleteRes = await request('DELETE', `/api/students/${createdId}`);
        assert(deleteRes.status === 200, 'Delete returns status 200');

        // Verify record is gone
        const verifyDeletedRes = await request('GET', `/api/students/${createdId}`);
        assert(verifyDeletedRes.status === 404, 'Deleted record now returns 404 Not Found');

        console.log('\n=======================================================');
        console.log('🎉 ALL BACKEND API & DATABASE TESTS PASSED SUCCESSFULLY!');
        console.log('=======================================================\n');
    } catch (err) {
        console.error('\n❌ TEST FAILURE:', err);
        process.exitCode = 1;
    } finally {
        if (server) {
            server.close();
        }
    }
}

runTests();
