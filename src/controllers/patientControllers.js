const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');

//get all patients
//routes GET /api/patients
//api private access
const getPatients = asyncHandler(async (req, res) => {
    try{
        const patients = await Patient.findAll();
        if(!patients) {
            return res.status(404).json({message: `No patients found`});
        }
         return res.status(200).json(patients);
    }
    catch(error) {
        return res.status(500).json({message: `Server error`});
    }
});

//create a folder for  patient
//routes POST /api/patients
//api private access
const createPatient = asyncHandler(async (req, res) => {
    const { patientId, firstName, lastName, dateOfBirth, gender, contactNumber, email, address, medicalHistory, allergies } = req.body;
    if(!patientId || !firstName || !lastName || !dateOfBirth || !gender || !contactNumber || !email || !address || !medicalHistory || !allergies) {
         return res.status(400).json({message: `All fields are mandatory!`});
    } // else create a folder for the patient
    try{
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
         return res.status(201).json(patient);
    } catch (error) {
         return res.status(500).json({message: `Server error`});
    }
});

//get a spsecifc patient by id
//routes GET /api/patients/:id
//api private access
const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findByPk(req.params.id);
    if(patient) {
        return res.status(200).json(patient); 
    } else {
        return res.status(404).json({message: `Patient not found`});
    }
});


//update a patient
//routes PUT /api/patients/:id
//api private access
//get the patient first
const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByPk(req.params.id);
    if(!patient) {
        return res.status(404).json({message: `Patient not found`});
    }

    //user only gets to update a patient if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
         return res.status(401).json({message: `Not authorized to update a patient`}); 
    }
    //update the patient
    const updatePatient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true, runValidators: true}
    );
     return res.status(200).json(updatePatient);
});

//delete a patient
//routes DELETE /api/patients/:id
//api private access
const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if(!patient) {
        return res.status(404).json({message: `Patient not found`});
    }

    //user only gets to delete a patient if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a patient`});
    }
    await Patient.deleteOne({_id: req.params.id});
    return res.status(200).json({message: `Patient deleted`, patient});
});

module.exports = {getPatients, createPatient, getPatientById, updatePatient, deletePatient};