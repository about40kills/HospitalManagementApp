const hre = require("hardhat");

async function main() {
    // Deploy access control
    const adminAddress = "0xc264ef6FC7da5FF4C80124E82925480839D41999"
    const AccessControl = await hre.ethers.getContractFactory("AccessControl");
    const accessControl = await AccessControl.deploy();
    await accessControl;
    console.log(`AccessControl deployed at ${accessControl.getAddress()}`);

    const AppointmentBooking = await hre.ethers.getContractFactory("AppointmentBooking");
    const appointmentBooking = await AppointmentBooking.deploy();
    await appointmentBooking;
    console.log(`AppointmentBooking deployed at ${appointmentBooking.getAddress()}`);

    const MedicalBilling = await hre.ethers.getContractFactory("MedicalBilling");
    const medicalBilling = await MedicalBilling.deploy();
    await medicalBilling;
    console.log(`MedicalBilling deployed at ${medicalBilling.getAddress()}`);

    const PatientRecord = await hre.ethers.getContractFactory("PatientRecords");
    const patientRecord = await PatientRecord.deploy();
    await patientRecord;
    console.log(`PatientRecord deployed at ${patientRecord.getAddress()}`);
}



main().catch((err) => {console.log("Error: ", err); process.exitCode = 1});