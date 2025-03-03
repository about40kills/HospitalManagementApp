const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenMiddleware');

const {  getAppointments, createAppointment, getAppointmentById, updateAppointment, deleteAppointment, getDoctorAppointments, getPatientAppointments } = require('../controllers/appointmentControllers');
router.use(validateToken);

//get all appointments
router.route('/').get(getAppointments);

//create an appointment
router.route('/').post(createAppointment);

//get a specific appointment by id
router.route('/:id').get(getAppointmentById);

//update an appointment
router.route('/:id').put(updateAppointment);

//delete an appointment
router.route('/:id').delete(deleteAppointment);

//get all appointments for a specific doctor
router.route('/doctor/:doctorId').get(getDoctorAppointments);

//get all appointments for a specific patient
router.route('/patient/:patientId').get(getPatientAppointments);

module.exports = router;