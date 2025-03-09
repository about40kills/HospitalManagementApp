// spdx-license-identifier: MIT
pragma solidity ^0.8.0;

import "./accessControl.sol";

contract PatientRecords {
    struct Patient {
        string fname;
        string lname;
        string medicalHistory;
        address owner;
    }

    mapping(address => Patient) private patients;
    AccessControl accessControl;

    constructor(address _accessControl) {
        accessControl = AccessControl(_accessControl);
    }
    modifier onlyOwner(address _patient) {
        require(msg.sender == _patient, "Not authorized");
        _;
    }

    modifier onlyDoctor() {
        require(keccak256(abi.encodePacked(accessControl.checkAccess(msg.sender))) == keccak256(abi.encodePacked("Doctor")), "Only doctors can access");
        _;
    }

    function registerPatient(string memory _fname, string memory _lname, string memory medicalHistory) public {
        patients[msg.sender] = Patient(_fname, _lanem, _medicalHistory, msg.sender);
    }

    function updateMedicalHistory(string memory _newHistory) public onlyOwner(msg.sender){
        patients[msg.sender].medicalHistory = _newHistory;
    }

    function getPatientData(address _patient) public view onlyDoctor() returns (string memory, string memory, string memory) {
        Patient memory p = patients[_patient];
        return (p.fname, p.lname, p.medicalHistory);
    }
}