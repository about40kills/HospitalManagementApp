const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenMiddleware');

const { getPatients, createPatient, getPatientById, updatePatient, deletePatient } = require('../controllers/patientControllers');
router.use(validateToken);

// Get all patients
router.route('/').get(getPatients);

// Create new patient
router.route('/').post(createPatient);

// Get a patient by id
router.route('/:id').get(getPatientById);

// Update a patient by id
router.route('/:id').put(updatePatient);

// Delete a patient by id
router.route('/:id').delete(deletePatient);

module.exports = router;