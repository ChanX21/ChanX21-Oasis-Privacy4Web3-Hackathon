// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


//  _______   _______   ______  __     __   ______         __    __  ________   ______   __     ________  __    __ 
// /       \ /       \ /      |/  |   /  | /      \       /  |  /  |/        | /      \ /  |   /        |/  |  /  |
// $$$$$$$  |$$$$$$$  |$$$$$$/ $$ |   $$ |/$$$$$$  |      $$ |  $$ |$$$$$$$$/ /$$$$$$  |$$ |   $$$$$$$$/ $$ |  $$ |
// $$ |__$$ |$$ |__$$ |  $$ |  $$ |   $$ |$$ |__$$ |      $$ |__$$ |$$ |__    $$ |__$$ |$$ |      $$ |   $$ |__$$ |
// $$    $$/ $$    $$<   $$ |  $$  \ /$$/ $$    $$ |      $$    $$ |$$    |   $$    $$ |$$ |      $$ |   $$    $$ |
// $$$$$$$/  $$$$$$$  |  $$ |   $$  /$$/  $$$$$$$$ |      $$$$$$$$ |$$$$$/    $$$$$$$$ |$$ |      $$ |   $$$$$$$$ |
// $$ |      $$ |  $$ | _$$ |_   $$ $$/   $$ |  $$ |      $$ |  $$ |$$ |_____ $$ |  $$ |$$ |_____ $$ |   $$ |  $$ |
// $$ |      $$ |  $$ |/ $$   |   $$$/    $$ |  $$ |      $$ |  $$ |$$       |$$ |  $$ |$$       |$$ |   $$ |  $$ |
// $$/       $$/   $$/ $$$$$$/     $/     $$/   $$/       $$/   $$/ $$$$$$$$/ $$/   $$/ $$$$$$$$/ $$/    $$/   $$/ 
                                                                                                                
                                                                                                                
                                                                                                                


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
        mapping(address => bool) authorizedHealthCenters; // Mapping to store authorized health centers for this patient
    }

    struct PatientInfo {
        address patientAddress; // Address of the patient
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
    } 

    // Mapping to store patient records by their address
    mapping(address => Patient) public patients;

    // Mapping to store authorized health centers
    mapping(address => bool) public authorizedHealthCenters;

    // Array to store addresses of patients who have enabled data sharing
    address[] public dataSharingArray;

    // Mapping to keep track of initialized patients
    mapping(address => bool) public initializedPatients;

    // Event to log when a new patient record is added
    event PatientRecordAdded(address patientAddress, string name);

    // Event to log when a patient record is updated
    event PatientRecordUpdated(address patientAddress, string name);

    // Event to log when data sharing is enabled or disabled
    event DataSharingChanged(address patientAddress, bool isEnabled);

    // Event to log when a patient is initialized
    event PatientInitialized(address patientAddress);

    // Modifier to ensure only authorized entities (doctors or health centers) can modify records
    modifier onlyAuthorized(address _patientAddress) {
        require(
            patients[_patientAddress].authorizedDoctors[msg.sender] ||
            patients[_patientAddress].authorizedHealthCenters[msg.sender],
            "Not authorized to modify this record"
        );
        _;
    }

    // Modifier to ensure only the patient can perform certain actions
    modifier onlyPatient() {
        require(patients[msg.sender].lastUpdated != 0, "Only the patient can perform this action");
        _;
    }

    // Function to add a new patient record
    function addPatientRecord(
        address _patientAddress,
        string memory _name,
        uint256 _dateOfBirth,
        string memory _gender,
        string memory _contactInfoHash,
        string memory _emergencyContactHash,
        string memory _medicalRecord,
        string memory _currentMedications,
        string memory _allergies,
        string memory _bloodType
    ) public  onlyAuthorized(_patientAddress) {
        require(patients[msg.sender].lastUpdated == 0, "Patient record already exists");

        Patient storage newPatient = patients[msg.sender];
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

        emit PatientRecordAdded(msg.sender, _name);
    }

    // Function to update a patient's record
    function updatePatientRecord(
        address _patientAddress,
        string memory _medicalRecord,
        string memory _currentMedications,
        string memory _allergies
    ) public onlyAuthorized(_patientAddress) {
        require(patients[_patientAddress].lastUpdated != 0, "Patient record does not exist");

        Patient storage patient = patients[msg.sender];
        patient.medicalRecord = _medicalRecord;
        patient.currentMedications = _currentMedications;
        patient.allergies = _allergies;
        patient.lastUpdated = block.timestamp;

        emit PatientRecordUpdated(msg.sender, patient.name);
    }

    // Function for a patient to authorize a doctor
    function authorizeDoctor(address _doctorAddress) public onlyPatient {
        patients[msg.sender].authorizedDoctors[_doctorAddress] = true;
    }

    // Function for a patient to revoke a doctor's authorization
    function revokeDoctor(address _doctorAddress) public onlyPatient {
        patients[msg.sender].authorizedDoctors[_doctorAddress] = false;
    }

    // Function for a patient to authorize a health center
    function authorizeHealthCenter(address _healthCenterAddress) public onlyPatient {
        require(authorizedHealthCenters[_healthCenterAddress] == true, "Health center not authorized");
        patients[msg.sender].authorizedHealthCenters[_healthCenterAddress] = true;
    }

    // Function for a patient to revoke a health center's authorization
    function revokeHealthCenter(address _healthCenterAddress) public onlyPatient {
        patients[msg.sender].authorizedHealthCenters[_healthCenterAddress] = false;
    }

    // Function for a patient to set data sharing preferences
    function setDataSharing(bool _allowSharing) public onlyPatient {
        patients[msg.sender].dataSharing = _allowSharing;
        
        if (_allowSharing) {
            // Add patient address to dataSharingArray if not already present
            bool isPresent = false;
            for (uint i = 0; i < dataSharingArray.length; i++) {
                if (dataSharingArray[i] == msg.sender) {
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                dataSharingArray.push(msg.sender);
            }
        } else {
            // Remove patient address from dataSharingArray
            for (uint i = 0; i < dataSharingArray.length; i++) {
                if (dataSharingArray[i] == msg.sender) {
                    dataSharingArray[i] = dataSharingArray[dataSharingArray.length - 1];
                    dataSharingArray.pop();
                    break;
                }
            }
        }

        emit DataSharingChanged(msg.sender, _allowSharing);
    }

    // Function to retrieve patient records (only public, non-sensitive data)
    function getPatientRecords()
        public
        view
        returns (
            PatientInfo[] memory
        )
    {   
        PatientInfo[] memory patientInfo = new PatientInfo[](dataSharingArray.length);
        for (uint256 i = 0; i < dataSharingArray.length; i++) {
            Patient storage p = patients[dataSharingArray[i]];
            patientInfo[i] = PatientInfo({
                patientAddress: dataSharingArray[i],
                name: p.name,
                dateOfBirth: p.dateOfBirth,
                gender: p.gender,
                contactInfoHash: p.contactInfoHash,
                emergencyContactHash: p.emergencyContactHash,
                medicalRecord: p.medicalRecord,
                currentMedications: p.currentMedications,
                allergies: p.allergies,
                bloodType: p.bloodType
            });
        }

        return patientInfo;
    }

    // Function to retrieve sensitive patient data (only for authorized entities)
    function getSensitivePatientData(address _patientAddress)
        public
        view
        returns (
            string memory name,
            uint256 dateOfBirth,
            string memory gender,
            string memory bloodType,
            uint256 lastUpdated,
            bool dataSharing,
            string memory medicalRecord,
            string memory currentMedications,
            string memory allergies
        )
    {
        Patient storage p = patients[_patientAddress];
        require(
            p.authorizedDoctors[msg.sender] ||
            p.authorizedHealthCenters[msg.sender],
            "Not authorized to access sensitive data"
        );
        return (p.name, p.dateOfBirth, p.gender, p.bloodType, p.lastUpdated, p.dataSharing, p.medicalRecord, p.currentMedications, p.allergies);
    }

    // Function to add or remove authorized health centers (should be restricted to admin in a real-world scenario)
    function setHealthCenterAuthorization(address _healthCenter, bool _isAuthorized) public {
        require(msg.sender == owner(), "Only the owner can call this function");
        authorizedHealthCenters[_healthCenter] = _isAuthorized;
    }

    // Function for a patient to initialize themselves with default values
    function initializePatient() public {
        require(!initializedPatients[msg.sender], "Patient already initialized");

        Patient storage newPatient = patients[msg.sender];
        newPatient.name = "";
        newPatient.dateOfBirth = 0; // Current timestamp as a placeholder
        newPatient.gender = "";
        newPatient.contactInfoHash = "";
        newPatient.emergencyContactHash = "";
        newPatient.medicalRecord = "";
        newPatient.currentMedications = "";
        newPatient.allergies = "";
        newPatient.bloodType = "";
        newPatient.lastUpdated = 0;
        newPatient.dataSharing = false;

        initializedPatients[msg.sender] = true;

        emit PatientInitialized(msg.sender);
    }
}