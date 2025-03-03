const asyncHandler = require('express-async-handler');
const { Appointment, Doctor, Patient } = require('../models');

//     Create new appointment
//    POST /api/appointments
//   Private
const createAppointment = asyncHandler(async (req, res) => {
    const { patientId, doctorId, appointmentDate, notes } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !appointmentDate) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
         return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create appointment
    try {
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            appointmentDate,
            status: 'scheduled',
            notes
        });
    
        return res.status(201).json(appointment);
    } catch (error) {  
        return res.status(500).json({ message: 'Server error' });
    }
});

//    Get all appointments
//   GET /api/appointments
//   Private
const getAppointments = asyncHandler(async (req, res) => {
    try{
        const appointments = await Appointment.findAll({
            include: [
                { model: Patient, attributes: ['name', 'contact'] },
                { model: Doctor, attributes: ['name', 'specialization'] }
            ]
        });
        res.status(201).json(appointments);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

//    Get appointment by ID
//   GET /api/appointments/:id
//   Private
const getAppointmentById = asyncHandler(async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                { model: Patient, attributes: ['name', 'contact'] },
                { model: Doctor, attributes: ['name', 'specialization'] }
            ]
        });
    
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
    
        res.status(201).json(appointment);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

//Update appointment status
//    PUT /api/appointments/:id
//   Private
const updateAppointment = asyncHandler(async (req, res) => {
    try {
        const { status, notes } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    // Validate status
    const validStatuses = ['scheduled', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;
    await appointment.save();

    return res.status(201).json(appointment);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

//    Delete appointment
//   DELETE /api/appointments/:id
// Private
const deleteAppointment = asyncHandler(async (req, res) => {
   try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.delete();
    return res.status(201).json({ message: 'Appointment removed' });
   } catch (error) {
    return res.status(500).json({ message: 'Server error' });
   }
});

//   Get appointments by doctor
//GET /api/appointments/doctor/:doctorId
const getDoctorAppointments = asyncHandler(async (req, res) => {
   try {
    const appointments = await Appointment.findAll({
        where: { doctorId: req.params.doctorId },
        include: [
            { model: Patient, attributes: ['name', 'contact'] }
        ]
    });
    return res.status(201).json(appointments); 
   } catch (error) {
    return res.status(500).json({ message: 'Server error' });
   }
});

// get appointments by patient
// GET /api/appointments/patient/:patientId
// access  Private
const getPatientAppointments = asyncHandler(async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { patientId: req.params.patientId },
            include: [
                { model: Doctor, attributes: ['name', 'specialization'] }
            ]
        });
        return res.status(201).json(appointments);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getDoctorAppointments,
    getPatientAppointments
};