// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract PrivaHealth {
    struct DoctorReview {
        uint256 id;
        string review;
        uint256 timestamp;
    }
    // Struct to represent patient details
    struct Patient {
        uint256 patientId; // Unique identifier for the patient
        string name; // Patient name (could be hashed for privacy)
        uint256 dateOfBirth; // Patient DOB in UNIX timestamp format
        string gender; // Patient gender
        string contactInfoHash; // Hash of the patient's contact info (email, phone, etc.)
        string emergencyContactHash; // Hash of emergency contact info
        string medicalRecordHash; // Hash or reference to the off-chain encrypted medical record (e.g., IPFS link)
        string currentMedications; // Short list of current medications (optional, hashed)
        string allergies; // Known allergies (optional, hashed)
        string bloodType; // Patient's blood type
        DoctorReview doctorRecommendation; // Patient's blood type
        uint256 lastUpdated; // Timestamp of the last update to the patient record
        bool dataSharing; // Timestamp of the last update to the patient record
    }

    // Mapping to store patient records by their unique ID
    mapping(uint256 => Patient) public patients;

    // Event to log when a new patient record is added
    event PatientRecordAdded(uint256 patientId, string name);

    // Event to log when a patient record is updated
    event PatientRecordUpdated(uint256 patientId, string name);

    // Function to add a new patient record
    function addPatientRecord(
        uint256 _patientId,
        string memory _name,
        uint256 _dateOfBirth,
        string memory _gender,
        string memory _contactInfoHash,
        string memory _emergencyContactHash,
        string memory _medicalRecordHash,
        string memory _currentMedications,
        string memory _allergies,
        string memory _bloodType
    ) public {
        // Add the patient data to the mapping

        patients[_patientId] = Patient(
            _patientId,
            _name,
            _dateOfBirth,
            _gender,
            _contactInfoHash,
            _emergencyContactHash,
            _medicalRecordHash,
            _currentMedications,
            _allergies,
            _bloodType,
            DoctorReview(0,"",0),
            block.timestamp,
            false
        );

        // Emit event for the addition of a new record
        emit PatientRecordAdded(_patientId, _name);
    }

    // Function to update a patient's record
    function updatePatientRecord(
        uint256 _patientId,
        string memory _name,
        string memory _medicalRecordHash,
        string memory _currentMedications,
        string memory _allergies
    ) public {
        // Ensure the patient exists before updating
        require(bytes(patients[_patientId].name).length > 0, "Patient record does not exist");

        // Update the record fields
        patients[_patientId].name = _name;
        patients[_patientId].medicalRecordHash = _medicalRecordHash;
        patients[_patientId].currentMedications = _currentMedications;
        patients[_patientId].allergies = _allergies;
        patients[_patientId].lastUpdated = block.timestamp;

        // Emit event for the update of the record
        emit PatientRecordUpdated(_patientId, _name);
    }

    // Function to retrieve a patient record by ID (only public, non-sensitive data)
    function getPatientRecord(
        uint256 _patientId
    )
        public
        view
        returns (
            string memory name,
            uint256 dateOfBirth,
            string memory gender,
            string memory bloodType,
            uint256 lastUpdated
        )
    {
        Patient memory p = patients[_patientId];
        return (p.name, p.dateOfBirth, p.gender, p.bloodType, p.lastUpdated);
    }

    // Optionally, add more functions for record deletion, admin access, etc saphhire
}
