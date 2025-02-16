const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');

//get all patients
//routes GET /api/patients
//api private access
const getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.findAll();
    res.status(200).json(patients);
});

//create a folder for  patient
//routes POST /api/patients
//api private access
const createPatient = asyncHandler(async (req, res) => {
    const { patientId, firstName, lastName, dateOfBirth, gender, contactNumber, email, address, medicalHistory, allergies } = req.body;
    if(!patientId || !firstName || !lastName || !dateOfBirth || !gender || !contactNumber || !email || !address || !medicalHistory || !allergies) {
        res.status(400).json({message: `All fields are mandatory!`});
        throw new Error(`All fields are mandatory!`);
    } // else create a folder for the patient
    const patient = await Patient.create({
        patientId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        contactNumber,
        email,
        address,
        medicalHistory,
        allergies
    });
    res.status(201).json(patient);
});

//get a spsecifc patient by id
//routes GET /api/patients/:id
//api private access
const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findByPk(req.params.id);
    if(patient) {
        res.status(200).json(patient);
    } else {
        res.status(404).json({message: `Patient not found`});
        throw new Error(`Patient not found`);
    }
});


//update a patient
//routes PUT /api/patients/:id
//api private access
//get the patient first
const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByPk(req.params.id);
    if(!patient) {
        res.status(404).json({message: `Patient not found`});
        throw new Error(`Patient not found`);
    }

    //user only gets to update a patient if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        res.status(401).json({message: `Not authorized to update a patient`});
        throw new Error(`Not authorized to update a patient`);
    }
    //update the patient
    const updatePatient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true, runValidators: true}
    );
    res.status(200).json(updatePatient);
});

//delete a patient
//routes DELETE /api/patients/:id
//api private access
const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if(!patient) {
        res.status(404).json({message: `Patient not found`});
        throw new Error(`Patient not found`);
    }

    //user only gets to delete a patient if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        res.status(401).json({message: `Not authorized to update a patient`});
        throw new Error(`Not authorized to update a patient`);
    }
    await Patient.deleteOne({_id: req.params.id});
    res.status(200).json(patient)
    res.status(200).json({message: `Patient deleted`});
});

module.exports = {getPatients, createPatient, getPatientById, updatePatient, deletePatient};