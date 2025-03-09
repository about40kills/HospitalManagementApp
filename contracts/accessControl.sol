// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {
    mapping(address => bool) public isDoctor;
    mapping(address => bool) public isPatient;
    address public admin;

    constructor() {
        admin = msg.sender; // The deployer is the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can assign roles");
        _;
    }

    function addDoctor(address _doctor) public onlyAdmin{
        isDoctor[_doctor] = true;
    }

    function addPatient(address _patient) public onlyAdmin {
        isPatient[_patient] = true;
    }

    function revokeAccess(address _user) public onlyAdmin {
        isDoctor[_user] = false;
        isPatient[_user] = false;
    }

    function checkAccess(address _user) public view returns (string memory){
        if (isDoctor[_user]) return "Doctor";
        if (isPatient[_user]) return "Patient";
        return "No Access";
    }
}