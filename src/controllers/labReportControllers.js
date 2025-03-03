const asyncHandler = require('express-async-handler');
const LabReport = require('../models/labReportModel');

//get all lab reports
//routes GET /api/labreports
//api private access
const getLabReports = asyncHandler(async (req, res) => {

     //user only gets to get a lab report if they are an admin,doctor or staff
     if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a patient`});
    }
    try{

    const reports = await LabReport.findAll( { include: ['patient', 'doctor' ]});
    return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({message: `Error fetching lab reports`});
    }
});

//create a lab report
//routes POST /api/labreports
//api private access
const createLabReport = asyncHandler(async (req, res) => {
    const { patientId, doctorId, reportType, result } = req.body;
    if(!patientId || !doctorId || !reportType || !result) {
         return res.status(400).json({message: `All fields are mandatory!`});
    } // else create a folder for the patient
    try{
        const labReport = await LabReport.create({
            patientId,
            doctorId,
            reportType,
            result,
        });
        return res.status(201).json(labReport);
    } catch (error) {
        return res.status(500).json({message: `Server error`});
    }

});

//get a specific lab report by patient id
//routes GET /api/labreports/:id
//api private access
const getLabReportById = asyncHandler(async (req, res) => {

    //user only gets to get a lab report if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a patient`});
    }

    const report = await LabReport.findByPk(req.params.id, { include: ['patient', 'doctor' ]});
    if(report) {
        return res.status(200).json(report);
    } else {
        return res.status(404).json({message: `Lab Report not found`});
    }
});

//update a lab report
//routes PUT /api/labreports/:id
//api private access
//get the lab report first
const updateLabReport = asyncHandler(async (req, res) => {
    const report = await LabReport.findByPk(req.params.id);
    if(!report) {
        return res.status(404).json({message: `Lab Report not found`});
    }

    //user only gets to update a lab report if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a lab report`});
    }

    //update the lab report
    const updateReport = await LabReport.findByIdAndUpate(
        req.body,
        req.params.id,
        { new: true }
    );
    return res.status(200).json(updateReport);
});

//delete a lab report
//routes DELETE /api/labreports/:id
//api private access
const deleteLabReport = asyncHandler(async (req, res) => {
    const report = await LabReport.findByPk(req.params.id);
    if(!report) {
        return res.status(404).json({message: `Lab Report not found`});
    }

    //user only gets to delete a lab report if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to delete a lab report`});
    }

    await LabReport.deleteOne({_id: req.params.id});
    return res.status(200).json(report)
});

//update a lab report status
//routes PUT /api/labreports/:id/status
//api private access
//get the lab report first
const updateLabReportStatus = asyncHandler(async (req, res) => {
    const report = await LabReport.findByPk(req.params.id);
    if(!report) {
        return res.status(404).json({message: `Lab Report not found`});
    }

    //user only gets to update a lab report if they are an admin,doctor or staff
    if(req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a lab report`});

    }

    //update the lab report status
    const { status } = req.body;
        const [updateReport] = await LabReport.update(
            { status },
            { where: { id: req.params.id } }
        ); 
        return res.status(200).json(updateReport);
});


//request a lab test
//routes GET /api/labreports/:id/request
//api private access
const requestLabTest = asyncHandler(async (req, res) => {
    const report = await LabReport.findByPk(req.params.id);
    if(!report) {
        return res.status(404).json({message: `Lab Report not found`});
    }

    //user only gets to request a lab test if they are a doctor
    if(req.user.role !== 'doctor') {
        return res.status(401).json({message: `Not authorized to request a lab test`});
    }

    //request the lab test
    const { testType, notes } = req.body;
    if (!testType) {
        return res.status(400).json({ message: 'Test type is required' });
    }
     // Add the test request to the report
    report.testRequests = report.testRequests || [];
    report.testRequests.push({
        testType,
        notes,
        requestedBy: req.user.id,
        requestedAt: new Date(),
    });

    await report.save();
    return res.status(200).json({ message: 'Lab test requested successfully', report });
});

module.exports = { getLabReports, createLabReport, getLabReportById, updateLabReport, deleteLabReport, updateLabReportStatus, requestLabTest };