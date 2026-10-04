# 🎓 Student Management Portal

A full-stack web application designed and engineered as a practical virtual internship capstone project. The portal demonstrates modern web development practices including RESTful API architecture, ACID-compliant relational database management with strict schemas and constraints, component-driven frontend design, live multi-field validation, real-time search & filtering, and a responsive UI.

---

## 🌟 Project Overview

The **Student Management Portal** provides an intuitive, high-performance solution for academic institutions to manage student records, track academic progress, search and filter directories, and monitor institutional demographics.

### Key Highlights:
- **True Full-Stack**: End-to-end functionality from database queries to REST controllers to interactive React UI.
- **Relational Integrity**: Built on relational SQLite with primary keys, unique constraints (Student ID, Email), check constraints, and indexed search columns.
- **Production-Ready UI**: Fully responsive card-and-table dashboard with smooth animations, accessible modals, and toast notifications.
- **Zero-Friction Setup**: No manual database server or Docker configuration required; runs out-of-the-box on Node 22+.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| 📊 **Interactive Dashboard** | Live statistical metrics (Total Students, Active Students, Inactive Students, Recent Additions) alongside department enrollment breakdowns, academic year distributions, and gender representation charts. |
| 👥 **Student Registry (CRUD)** | Comprehensive data table featuring complete Create, Read, Update, and Delete operations synced directly with the relational database. |
| 🔍 **Search & Multi-Filtering** | Instant search across student names, student IDs, and emails, combined with multi-dropdown filters for Department, Academic Year, and Enrollment Status. |
| 📝 **Smart Registration Form** | Live client-side and server-side validation, duplicate Student ID and Email detection, auto-ID generation (`STU-YYYY-XXXX`), and inline field error feedback. |
| 👁️ **Student Profile Modal** | Rich modal dialog showing complete student information including age calculation, contact links, academic enrollment details, and audit timestamps. |
| ⚠️ **Delete Safeguard Dialog** | Modal confirmation prompt displaying the target student's name and ID to prevent accidental data loss. |
| ⚙️ **System & Data Management** | One-click database restoration to sample seed records, and dynamic student export to CSV and JSON formats. |
| 📱 **Mobile & Tablet Responsive** | Fluid sidebar drawer and responsive layouts tailored for mobile phones, tablets, and desktop displays. |

---

## 🛠️ Technologies Used

### Frontend
- **React 18** (Functional components, custom hooks, context API)
- **Vite 6** (Next-generation lightning-fast build tool and HMR dev server)
- **Tailwind CSS 3** (Custom design system, responsive utility classes)
- **Lucide React** (Crisp modern SVG icons)

### Backend
- **Node.js** (JavaScript runtime, v22+)
- **Express.js** (REST API routing, middleware, CORS, logging)
- **Morgan** (HTTP request logging)

### Database
- **SQLite 3** via Node's native `DatabaseSync` (`node:sqlite`)
- Raw Relational DDL (`database/schema.sql`) with indices and constraints
- Sample dataset (`database/seed.sql`) containing 24 realistic student records

---

## 📋 Example Student Records Directory

The portal is pre-populated with **24 diverse student records** across 6 academic departments. You can search or filter by any of these names immediately in the portal:

| Student ID | Full Name | Department | Course | Year | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `STU-2024-001` | **Aarav Sharma** | Computer Science | B.Tech Computer Science | 3rd Year | `Active` |
| `STU-2024-002` | **Sophia Martinez** | Information Technology | B.Tech Information Technology | 2nd Year | `Active` |
| `STU-2024-003` | **Rohan Patel** | Mechanical Engineering | B.Tech Mechanical Engineering | 4th Year | `Active` |
| `STU-2024-004` | **Emily Chen** | Electrical Engineering | B.Tech Electrical Engineering | 1st Year | `Active` |
| `STU-2024-005` | **Liam Johnson** | Civil Engineering | B.Tech Civil Engineering | 3rd Year | `Inactive` |
| `STU-2024-006` | **Priya Nair** | Computer Science | B.Tech Computer Science | 2nd Year | `Active` |
| `STU-2024-007` | **Marcus Vance** | Business Administration | Bachelor of Business Admin | 4th Year | `Active` |
| `STU-2024-008` | **Zara Al-Mansoor** | Computer Science | B.Tech Data Science & AI | 1st Year | `Active` |
| `STU-2024-009` | **Noah Wilson** | Electrical Engineering | B.Tech Electrical Engineering | 3rd Year | `Inactive` |
| `STU-2024-010` | **Ananya Gupta** | Information Technology | B.Tech Information Technology | 2nd Year | `Active` |
| `STU-2024-011` | **David Kim** | Civil Engineering | B.Tech Civil Engineering | 1st Year | `Active` |
| `STU-2024-012` | **Chloe Taylor** | Business Administration | Bachelor of Business Admin | 4th Year | `Active` |
| `STU-2024-013` | **Ishaan Deshmukh** | Computer Science | B.Tech Software Engineering | 2nd Year | `Active` |
| `STU-2024-014` | **Maya Lin** | Information Technology | B.Tech Cloud Computing | 3rd Year | `Active` |
| `STU-2024-015` | **Carlos Gutierrez** | Mechanical Engineering | B.Tech Mechatronics | 4th Year | `Active` |
| `STU-2024-016` | **Fatima Zahra** | Information Technology | B.Tech Cyber Security | 1st Year | `Active` |
| `STU-2024-017` | **Alexander Schmidt** | Electrical Engineering | B.Tech Electronics & Comm. | 2nd Year | `Active` |
| `STU-2024-018` | **Olivia Bennett** | Civil Engineering | B.Tech Structural Engineering | 3rd Year | `Active` |
| `STU-2024-019` | **Rajat Sen** | Business Administration | BBA Finance & Analytics | 4th Year | `Inactive` |
| `STU-2024-020` | **Samantha Reed** | Computer Science | B.Tech Data Science & AI | 1st Year | `Active` |
| `STU-2024-021` | **Daniel O'Connor** | Electrical Engineering | B.Tech Power Systems | 3rd Year | `Active` |
| `STU-2024-022` | **Kenji Takahashi** | Mechanical Engineering | B.Tech Automotive Design | 2nd Year | `Active` |
| `STU-2024-023` | **Aaliyah Khan** | Civil Engineering | B.Tech Environmental Eng. | 1st Year | `Active` |
| `STU-2024-024` | **Lucas Silva** | Business Administration | BBA Marketing Management | 4th Year | `Active` |

> 💡 **Quick Testing Tip**: On the **Add Student** page, click the **"Fill Example Data"** button to automatically populate the form with realistic test data in one click!

---

## 📁 Project Folder Structure

```
student-management-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # SQLite connection and migration manager
│   │   ├── controllers/
│   │   │   └── studentController.js # CRUD handlers and stats aggregation
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Global error and 404 handler
│   │   │   └── validator.js         # Input sanitization and validation rules
│   │   ├── routes/
│   │   │   └── studentRoutes.js     # REST API endpoint definitions
│   │   ├── app.js                   # Express application setup
│   │   └── server.js                # Server entry point
│   ├── tests/
│   │   └── api.test.js              # Automated end-to-end API test suite
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example configuration
│   └── package.json                 # Backend dependencies
├── database/
│   ├── schema.sql                   # Relational DDL (table, indexes, constraints)
│   ├── seed.sql                     # 12 realistic sample student records
│   ├── init.js                      # DB initialization and seeding script
│   └── students.db                  # Relational SQLite database file
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── studentApi.js        # REST API client with error handling
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ConfirmDialog.jsx# Delete confirmation modal
│   │   │   │   ├── EmptyState.jsx   # Empty state placeholder
│   │   │   │   ├── LoadingSkeleton.jsx # Pulse skeleton loaders
│   │   │   │   └── Modal.jsx        # Generic accessible modal dialog
│   │   │   ├── dashboard/
│   │   │   │   ├── QuickStats.jsx   # Department and demographic charts
│   │   │   │   ├── RecentStudentsTable.jsx # Recent admissions list
│   │   │   │   └── StatCard.jsx     # Metric summary cards
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   │   └── Sidebar.jsx      # Side navigation drawer
│   │   │   ├── settings/
│   │   │   │   └── SettingsView.jsx # DB reset & export tools
│   │   │   └── students/
│   │   │       ├── SearchFilterBar.jsx     # Search & filter toolbar
│   │   │       ├── StudentDetailsModal.jsx # Student profile view
│   │   │       ├── StudentForm.jsx         # Add/Edit form with validation
│   │   │       └── StudentTable.jsx        # Registry data table with pagination
│   │   ├── context/
│   │   │   └── NotificationContext.jsx # Toast notification context
│   │   ├── pages/
│   │   │   ├── AddStudentPage.jsx   # Student registration page
│   │   │   ├── DashboardPage.jsx    # Overview metrics page
│   │   │   ├── SearchPage.jsx       # Dedicated search hub
│   │   │   ├── SettingsPage.jsx     # System preferences page
│   │   │   └── StudentsPage.jsx     # Full student registry page
│   │   ├── App.jsx                  # Main application container
│   │   ├── index.css                # Tailwind stylesheet
│   │   └── main.jsx                 # React root mount
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind theme configuration
│   └── vite.config.js               # Vite build & API proxy setup
├── scripts/
│   └── dev.js                       # Concurrent backend & frontend launcher
├── package.json                     # Root package configuration
└── README.md                        # Project documentation
```

---

## 🗄️ Database Schema & Relational Design

The application utilizes an ACID-compliant relational schema defined in `database/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK(gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE NOT NULL,
    course VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(year);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
```

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api/students`

### Endpoints

| Method | Endpoint | Description | Query Parameters / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Get all students (paginated & filtered) | `search`, `department`, `year`, `status`, `page`, `limit`, `sort_by`, `sort_order` |
| `GET` | `/api/students/:id` | Get single student by ID or Student ID | `:id` (Numeric ID or `STU-YYYY-XXXX`) |
| `POST` | `/api/students` | Create a new student record | JSON body with student details |
| `PUT` | `/api/students/:id` | Update an existing student | `:id` (Numeric ID), JSON body with fields |
| `DELETE` | `/api/students/:id` | Permanently delete a student | `:id` (Numeric ID) |
| `GET` | `/api/students/stats` | Dashboard aggregated statistics | None |
| `POST` | `/api/students/reset` | Reset database to default seed data | None |
| `GET` | `/api/health` | Service health status check | None |

### Sample JSON Payloads

#### Create Student (`POST /api/students`)
```json
{
  "student_id": "STU-2024-1050",
  "full_name": "Eleanor Brooks",
  "email": "eleanor.brooks@example.edu",
  "phone": "+1 (555) 789-4321",
  "gender": "Female",
  "date_of_birth": "2003-11-20",
  "course": "B.Tech Computer Science",
  "department": "Computer Science",
  "year": "2nd Year",
  "address": "452 Academic Boulevard, Suite 101, Boston, MA",
  "status": "Active"
}
```

#### Successful Response (`201 Created`)
```json
{
  "success": true,
  "message": "Student 'Eleanor Brooks' (STU-2024-1050) has been successfully registered.",
  "data": {
    "id": 13,
    "student_id": "STU-2024-1050",
    "full_name": "Eleanor Brooks",
    "email": "eleanor.brooks@example.edu",
    "phone": "+1 (555) 789-4321",
    "gender": "Female",
    "date_of_birth": "2003-11-20",
    "course": "B.Tech Computer Science",
    "department": "Computer Science",
    "year": "2nd Year",
    "address": "452 Academic Boulevard, Suite 101, Boston, MA",
    "status": "Active",
    "created_at": "2026-10-04 14:30:00",
    "updated_at": "2026-10-04 14:30:00"
  }
}
```

#### Validation Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Validation failed. Please correct the highlighted fields.",
  "errors": {
    "student_id": "Student ID 'STU-2024-001' is already assigned to another student.",
    "email": "Please provide a valid email address (e.g., student@example.edu)."
  }
}
```

---

## ⚡ Step-by-Step Installation & Running Guide

### Prerequisites
- **Node.js**: v22.0.0 or higher (v24 recommended)
- **npm**: v10.0.0 or higher
- Windows, macOS, or Linux

---

### Step 1: Install Dependencies

From the project root directory, install all dependencies for both backend and frontend:

```bash
# Windows PowerShell / CMD / Bash
npm run install:all
```

*(Alternatively, install each individually:)*
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 2: Configure & Initialize the Database

The SQLite database file `database/students.db` is already pre-configured with the schema and 12 sample students. If you ever want to re-initialize or reset the database with fresh data:

```bash
# Run from project root
npm run db:seed
```

This runs `database/init.js --force`, loading `database/schema.sql` and seeding `database/seed.sql`.

---

### Step 3: Run Both Frontend & Backend Concurrently

To start both servers with a single command from the root directory:

```bash
npm run dev
```

- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

### Step 4: Run Services Individually (Optional)

If you prefer separate terminal windows:

#### Terminal 1 — Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

---

### Step 5: Run Automated Tests

To run the automated verification test suite covering health checks, CRUD operations, duplicate detection, input validations, search, and filtering:

```bash
npm test
```

Expected output:
```
=======================================================
🧪 Starting API Verification & Test Suite
=======================================================
  ✓ Health check returns status 200
  ✓ GET /api/students returns status 200
  ✓ Returns at least 10 seed students
  ✓ Stats returns status 200
  ✓ Create student returns status 201
  ✓ Duplicate submission returns status 400
  ✓ Input validation flags invalid email/fields
  ✓ Fetch by ID returns 200
  ✓ Update returns status 200
  ✓ Finds student by name & ID search
  ✓ Filtering by Department & Status matches
  ✓ Delete returns status 200
  ✓ Deleted record returns 404 Not Found
=======================================================
🎉 ALL BACKEND API & DATABASE TESTS PASSED SUCCESSFULLY!
=======================================================
```

---

## 📸 Application Tour & Interface Overview

- **Dashboard**: High-level statistical cards, visual department distribution bars, academic year breakdown, and recent student admissions with quick preview.
- **Students Registry**: Full-width data table featuring sortable headers, status indicator pills, student avatar initials, and inline action buttons (View, Edit, Delete).
- **Add Student**: Form organized into Personal Details and Academic Program sections, equipped with an **Auto ID** generator button and real-time validation error warnings.
- **Search & Filter Hub**: Instant search across multiple fields with dynamic view switching between **Card Grid** and **Compact Table**.
- **Settings & Backup**: Database reset button for quick demonstration resets, plus one-click CSV and JSON export buttons.

---

## 🔒 Security Practices Implemented

1. **Input Sanitization**: All incoming string inputs are trimmed and stripped of potential script tags (`<script>`) before processing.
2. **Strict Server-Side Validation**: Robust type checking, RFC-compliant email regex, flexible phone format verification, and date range checks.
3. **Duplicate Prevention**: Database unique constraints backed by controller-level queries that return descriptive 400/409 errors rather than server crashes.
4. **Environment Isolation**: Database paths, port numbers, and allowed CORS origins are managed through environment variables (`.env`).
5. **No Frontend Secrets**: Frontend communicates exclusively with designated backend API routes without exposing database connection details or server paths.

---

## 🚀 Future Enhancements

- [ ] **Role-Based Access Control (RBAC)**: Support for Administrator, Faculty, and Student roles with JWT authentication.
- [ ] **Photo Uploads**: Profile image upload support with local file storage or cloud storage (AWS S3 / Cloudinary).
- [ ] **Attendance & Grading Module**: Course enrollment tracking with semester GPA calculations.
- [ ] **Fee Management**: Student fee payment history, pending invoice generation, and receipt downloads.
- [ ] **Batch Import**: Bulk student registration through Excel/CSV upload with preview validation.

---

## 📄 License & Credits

Developed as a virtual internship capstone project. Open for educational and institutional evaluation purposes.
