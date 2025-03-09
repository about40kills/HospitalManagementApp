pragma solidity ^0.8.0;

contract HMS{
    struct Record {
        string patientid;
        string ipfsHash;
    }

    mapping(string => Record) public records;

    function storeRecord(string memory patientid, string memory ipfsHash) public {
        records[patientid] = Record(patientid, ipfsHash);
    }

    function getRecord(string memory patientid) public view returns (string memory){
        return records[patientid].ipfsHash;
    }
}