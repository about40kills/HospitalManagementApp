const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateToken');

const { getLabReports, createLabReport, getLabReportById, updateLabReport, deleteLabReport, updateLabReportStatus, requestLabTest } = require('../controllers/labReportControllers');
router.use(validateToken);

// Get all labReports
router.route('/').get(getLabReports);

// Create new labReport
router.route('/').post(createLabReport);

// Get a labReport by id
router.route('/:id').get(getLabReportById);

// Update a labReport by id
router.route('/:id').put(updateLabReport);

// Delete a labReport by id
router.route('/:id').delete(deleteLabReport);

// Update a labReport status by id
router.route('/:id/status').put(updateLabReportStatus);

// Request a lab test
router.route('/:id/request').put(requestLabTest);