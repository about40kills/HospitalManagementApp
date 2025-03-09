// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./accessControl.sol";

contract AppointmentBooking {
    struct Appointment {
        address patient;
        address doctor;
        uint256 date; // Timestamp
        string status; // Scheduled, Completed Cancelled
    }

    mapping (uint256 => Appointment) public appointments;
    uint256 public appointmentCount;

    AccessControl accessControl;

    constructor(address _accessControl) {
        accessControl = AccessControl(_accessControl);
    }

    function bookAppointment(address _doctor, uint256 _date) public {
        require(keccak256(abi.encodePacked(accessControl.checkAccess(_doctor))) == keccak256(abi.encodePacked("Doctor")), "Doctor not registered");

        appointmentCount++;
        appointments[appointmentCount] = Appointment(msg.sender, _doctor, _date, "Scheduled");
    }

    function completeAppointment(uint256 _id) public {
        require(msg.sender == appointments[_id].doctor, "Only doctors can complete appointment");
        appointments[_id].status = "Complete";
    }

    function cancelAppointment(uint256 _id) public {
        require(appointments[_id].patient == msg.sender || appointments[_id].doctor == msg.sender, "Not Authorized");
        appointments[_id].status = "Cancelled";
    }

    function getAppointment(uint256 _id) public view returns (address, address, uint256, string memory){
        Appointment memory app = appointments[_id];
        return (app.patient, app.doctor, app.date, app.status);
    }
}