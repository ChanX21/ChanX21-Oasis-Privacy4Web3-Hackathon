// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PrivaHealth is Ownable {
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
        string medicalRecord; // Hash or reference to the off-chain encrypted medical record (e.g., IPFS link)
        string currentMedications; // Short list of current medications (optional, hashed)
        string allergies; // Known allergies (optional, hashed)
        string bloodType; // Patient's blood type
        // DoctorReview doctorRecommendation;
        uint256 lastUpdated; // Timestamp of the last update to the patient record
        bool dataSharing; // Whether the patient allows data sharing with R&D facilities
        mapping(address => bool) authorizedDoctors; // Mapping to store authorized doctors
    }

    // Mapping to store patient records by their unique ID
    mapping(uint256 => Patient) public patients;

    // Mapping to store authorized health centers
    mapping(address => bool) public authorizedHealthCenters;

    // Mapping to store patient addresses
    mapping(address => uint256) public patientAddresses;

    // Event to log when a new patient record is added
    event PatientRecordAdded(uint256 patientId, string name);

    // Event to log when a patient record is updated
    event PatientRecordUpdated(uint256 patientId, string name);

    // Modifier to ensure only authorized entities (doctors or health centers) can modify records
    modifier onlyAuthorized(uint256 _patientId) {
        require(
            authorizedHealthCenters[msg.sender] || patients[_patientId].authorizedDoctors[msg.sender],
            "Not authorized to modify this record"
        );
        _;
    }

    // Modifier to ensure only the patient can perform certain actions
    modifier onlyPatient(uint256 _patientId) {
        require(patientAddresses[msg.sender] == _patientId, "Only the patient can perform this action");
        _;
    }

    // Function to add a new patient record
    function addPatientRecord(
        uint256 _patientId,
        string memory _name,
        uint256 _dateOfBirth,
        string memory _gender,
        string memory _contactInfoHash,
        string memory _emergencyContactHash,
        string memory _medicalRecord,
        string memory _currentMedications,
        string memory _allergies,
        string memory _bloodType
    ) public {
        require(patients[_patientId].patientId == 0, "Patient record already exists");
        require(patientAddresses[msg.sender] == 0, "Address already associated with a patient");

        Patient storage newPatient = patients[_patientId];
        newPatient.patientId = _patientId;
        newPatient.name = _name;
        newPatient.dateOfBirth = _dateOfBirth;
        newPatient.gender = _gender;
        newPatient.contactInfoHash = _contactInfoHash;
        newPatient.emergencyContactHash = _emergencyContactHash;
        newPatient.medicalRecord = _medicalRecord;
        newPatient.currentMedications = _currentMedications;
        newPatient.allergies = _allergies;
        newPatient.bloodType = _bloodType;
        newPatient.lastUpdated = block.timestamp;
        newPatient.dataSharing = false;

        patientAddresses[msg.sender] = _patientId;

        emit PatientRecordAdded(_patientId, _name);
    }

    // Function to update a patient's record
    function updatePatientRecord(
        uint256 _patientId,
        string memory _medicalRecord,
        string memory _currentMedications,
        string memory _allergies
    ) public onlyAuthorized(_patientId) {
        require(patients[_patientId].patientId != 0, "Patient record does not exist");

        Patient storage patient = patients[_patientId];
        patient.medicalRecord = _medicalRecord;
        patient.currentMedications = _currentMedications;
        patient.allergies = _allergies;
        patient.lastUpdated = block.timestamp;

        emit PatientRecordUpdated(_patientId, patient.name);
    }

    // Function for a patient to authorize a doctor
    function authorizeDoctor(address _doctorAddress) public {
        uint256 patientId = patientAddresses[msg.sender];
        require(patientId != 0, "Patient not registered");
        patients[patientId].authorizedDoctors[_doctorAddress] = true;
    }

    // Function for a patient to revoke a doctor's authorization
    function revokeDoctor(address _doctorAddress) public {
        uint256 patientId = patientAddresses[msg.sender];
        require(patientId != 0, "Patient not registered");
        patients[patientId].authorizedDoctors[_doctorAddress] = false;
    }

    // Function for a patient to set data sharing preferences
    function setDataSharing(bool _allowSharing) public {
        uint256 patientId = patientAddresses[msg.sender];
        require(patientId != 0, "Patient not registered");
        patients[patientId].dataSharing = _allowSharing;
    }

    // Function to retrieve a patient record by ID (only public, non-sensitive data)
    function getPatientRecord(uint256 _patientId)
        public
        view
        returns (
            string memory name,
            uint256 dateOfBirth,
            string memory gender,
            string memory bloodType,
            uint256 lastUpdated,
            bool dataSharing
        )
    {   
        Patient storage p = patients[_patientId];
        require(p.patientId != 0, "Patient record does not exist");
        require(patients[_patientId].authorizedDoctors[msg.sender], "Only the authorized doctor can call this function");
        return (p.name, p.dateOfBirth, p.gender, p.bloodType, p.lastUpdated, p.dataSharing);
    }

    // Function to retrieve sensitive patient data (only for authorized entities)
    function getSensitivePatientData(uint256 _patientId)
        public
        view
        onlyAuthorized(_patientId)
        returns (
            string memory medicalRecord,
            string memory currentMedications,
            string memory allergies
        )
    {
        Patient storage p = patients[_patientId];
        require(p.patientId != 0, "Patient record does not exist");
        return (p.medicalRecord, p.currentMedications, p.allergies);
    }

    // Function to add or remove authorized health centers (should be restricted to admin in a real-world scenario)
    function setHealthCenterAuthorization(address _healthCenter, bool _isAuthorized) public {
        require(msg.sender == owner(), "Only the owner can call this function");
        authorizedHealthCenters[_healthCenter] = _isAuthorized;
    }
}
