// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./appointmentBooking.sol";

contract MedicalBilling{
    struct Bill{
        address patient;
        uint256 amount;
        bool paid;

    }

    mapping(uint256 => Bill) public bills;
    uint256 public billCount;
    address public hospitalAdmin;
    AppointmentBooking appointmentContract;

    constructor(address _appointmentContract) {
        hospitalAdmin = msg.sender;
        appointmentContract = AppointmentBooking(_appointmentContract);
    }

    modifier onlyAdmin() {
        require(msg.sender == hospitalAdmin, "Only hospital admin can create bills");
        _;
    }

    function creatBill(uint256  _appointmentId, uint256 _amount) public onlyAdmin{
        (, , , string memory status) = appointmentContract.getAppointment(_appointmentId);
        require (keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Completed")), "Appointment not complete");
        billCount++;
        bills[billCount] = Bill(msg.sender, _amount, false);
    }

    function paybill(uint256 _billId) public payable {
        require(msg.sender == bills[_billId].patient, "Only patient can pay");
        require(msg.value == bills[_billId].amount, "Incorrect payment amount");
        require(!bills[_billId].paid, "Bill already paid");

        bills[_billId].paid = true;

        payable(hospitalAdmin).transfer(msg.value);

    }

    function getBill(uint256 _billId) public view returns (address, uint256, bool){
        Bill memory b = bills[_billId];
        return (b.patient, b.amount, b.paid);
    }
}