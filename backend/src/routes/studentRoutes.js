// ============================================================================
// Student API Routes Definition
// ============================================================================

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateStudent } = require('../middleware/validator');

// Dashboard statistics
router.get('/stats', studentController.getDashboardStats);

// Reset database to seed records (useful for demo/testing)
router.post('/reset', studentController.resetDatabase);

// Core CRUD Routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', validateStudent(false), studentController.createStudent);
router.put('/:id', validateStudent(true), studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
