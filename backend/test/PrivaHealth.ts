import { expect } from "chai";
import { ethers } from "hardhat";
import { BytesLike, EventLog } from "ethers";

import { PrivaHealth } from "../typechain-types";

const TEST_PATIENT = {
  name: "John Doe",
  dateOfBirth: 946684800, // Unix timestamp for 2000-01-01
  gender: "Male",
  contactInfoHash: ethers.keccak256(ethers.toUtf8Bytes("john@example.com")),
  emergencyContactHash: ethers.keccak256(ethers.toUtf8Bytes("emergency@example.com")),
  medicalRecord: "High Blood Pressure, Diabetes",
  currentMedications: "Aspirin",
  allergies: "Peanuts",
  bloodType: "A+"
};

async function initializePatient(privaHealth: PrivaHealth, patientSigner: any) {
  const tx = await privaHealth.connect(patientSigner).initializePatient();
  const receipt = await tx.wait();
  expect(receipt!.logs).to.not.be.undefined;
  const initEvent = receipt!.logs.find(event => (event as EventLog).fragment.name === 'PatientInitialized') as EventLog;
  expect(initEvent).to.not.be.undefined;
  expect(initEvent!.args).to.not.be.undefined;
  return initEvent!.args![0] as string;
}

async function addPatientRecord(privaHealth: PrivaHealth, patientAddress: string, patientData: typeof TEST_PATIENT) {
  const tx = await privaHealth.addPatientRecord(
    patientAddress,
    patientData.name,
    patientData.dateOfBirth,
    patientData.gender,
    patientData.contactInfoHash,
    patientData.emergencyContactHash,
    patientData.medicalRecord,
    patientData.currentMedications,
    patientData.allergies,
    patientData.bloodType
  );
  const receipt = await tx.wait();
  expect(receipt!.logs).to.not.be.undefined;
  const addEvent = receipt!.logs.find(event => (event as EventLog).fragment.name === 'PatientRecordAdded') as EventLog;
  expect(addEvent).to.not.be.undefined;
  expect(addEvent!.args).to.not.be.undefined;
  return addEvent!.args![0] as string;
}

describe("PrivaHealth", function () {
  async function deployPrivaHealth() {
    const [owner, patient, doctor, healthCenter] = await ethers.getSigners();
    const PrivaHealth = await ethers.getContractFactory("PrivaHealth");
    const privaHealth = await PrivaHealth.deploy();
    await privaHealth.waitForDeployment();
    return { privaHealth, owner, patient, doctor, healthCenter };
  }

  describe("Patient Management", function () {
    it("Should initialize a patient", async function () {
      const { privaHealth, patient } = await deployPrivaHealth();
      const patientAddress = await initializePatient(privaHealth, patient);
      expect(patientAddress).to.equal(patient.address);
      
      const isInitialized = await privaHealth.getWhetherPatientInitialized(patient.address);
      expect(isInitialized).to.be.true;
    });

    it("Should not allow initializing a patient twice", async function () {
      const { privaHealth, patient } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);
      await expect(initializePatient(privaHealth, patient)).to.be.revertedWith("Patient already initialized");
    });

    it("Should add a new patient record", async function () {
      const { privaHealth, patient, doctor, healthCenter, owner } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);
      await privaHealth.connect(owner).setHealthCenterAuthorization(healthCenter.address, true);
      await privaHealth.connect(patient).authorizeHealthCenter(healthCenter.address);
      
      const tx = await privaHealth.connect(healthCenter).addPatientRecord(
        patient.address,
        TEST_PATIENT.name,
        TEST_PATIENT.dateOfBirth,
        TEST_PATIENT.gender,
        TEST_PATIENT.contactInfoHash,
        TEST_PATIENT.emergencyContactHash,
        TEST_PATIENT.medicalRecord,
        TEST_PATIENT.currentMedications,
        TEST_PATIENT.allergies,
        TEST_PATIENT.bloodType
      );

      const receipt = await tx.wait();
      const addEvent = receipt!.logs.find(log => (log as EventLog).eventName === 'PatientRecordAdded') as EventLog;

      expect(addEvent).to.not.be.undefined;
      expect(addEvent.args[0]).to.equal(patient.address);
    });

    it("Should update an existing patient record", async function () {
      const { privaHealth, patient, doctor } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);
      await privaHealth.connect(patient).authorizeDoctor(doctor.address);
      await addPatientRecord(privaHealth.connect(doctor), patient.address, TEST_PATIENT);

      const updatedMedicalRecord = ethers.keccak256(ethers.toUtf8Bytes("Updated_IPFS_hash"));
      const updatedMedications = "Aspirin, Lisinopril";
      const updatedAllergies = "Peanuts, Shellfish";

      const tx = await privaHealth.connect(doctor).updatePatientRecord(
        patient.address,
        updatedMedicalRecord,
        updatedMedications,
        updatedAllergies
      );

      const receipt = await tx.wait();
      expect(receipt!.logs).to.not.be.undefined;
      const updateEvent = receipt!.logs.find(event => (event as EventLog).fragment.name === 'PatientRecordUpdated') as EventLog;
      expect(updateEvent).to.not.be.undefined;
      expect(updateEvent!.args).to.not.be.undefined;
      expect(updateEvent!.args![0]).to.equal(patient.address);
    });
  });

  describe("Authorization Management", function () {
    it("Should allow a patient to authorize and revoke a doctor", async function () {
      const { privaHealth, patient, doctor } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);

      await privaHealth.connect(patient).authorizeDoctor(doctor.address);
      const sensitiveData = await privaHealth.connect(doctor).getSensitivePatientData(patient.address);
      expect(sensitiveData).to.not.be.undefined;

      await privaHealth.connect(patient).revokeDoctor(doctor.address);
      await expect(privaHealth.connect(doctor).getSensitivePatientData(patient.address)).to.be.revertedWith("Not authorized to access sensitive data");
    });

    it("Should allow the owner to authorize and revoke a health center", async function () {
      const { privaHealth, owner, patient, healthCenter } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);

      const authorizeTx = await privaHealth.connect(owner).setHealthCenterAuthorization(healthCenter.address, true);
      const authorizeReceipt = await authorizeTx.wait();
      const authorizeEvent = authorizeReceipt!.logs.find(log => (log as EventLog).eventName === 'HealthCenterAuthorizationChanged') as EventLog;
      expect(authorizeEvent).to.not.be.undefined;
      expect(authorizeEvent.args[0]).to.equal(healthCenter.address);
      expect(authorizeEvent.args[1]).to.be.true;

      await privaHealth.connect(patient).authorizeHealthCenter(healthCenter.address);
      const sensitiveData = await privaHealth.connect(healthCenter).getSensitivePatientData(patient.address);
      expect(sensitiveData).to.not.be.undefined;

      const revokeTx = await privaHealth.connect(owner).setHealthCenterAuthorization(healthCenter.address, false);
      const revokeReceipt = await revokeTx.wait();
      const revokeEvent = revokeReceipt!.logs.find(log => (log as EventLog).eventName === 'HealthCenterAuthorizationChanged') as EventLog;
      expect(revokeEvent).to.not.be.undefined;
      expect(revokeEvent.args[0]).to.equal(healthCenter.address);
      expect(revokeEvent.args[1]).to.be.false;
    });
  });

  describe("Data Sharing", function () {
    it("Should allow a patient to set data sharing preferences", async function () {
      const { privaHealth, patient } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);

      await privaHealth.connect(patient).setDataSharing(true);
      let isSharing = await privaHealth.getDataSharingStatus(patient.address);
      expect(isSharing).to.be.true;

      await privaHealth.connect(patient).setDataSharing(false);
      isSharing = await privaHealth.getDataSharingStatus(patient.address);
      expect(isSharing).to.be.false;
    });

    it("Should return patient records for data sharing patients", async function () {
      const { privaHealth, patient, doctor } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);
      await privaHealth.connect(patient).authorizeDoctor(doctor.address);
      await addPatientRecord(privaHealth.connect(doctor), patient.address, TEST_PATIENT);
      await privaHealth.connect(patient).setDataSharing(true);

      const patientRecords = await privaHealth.getPatientRecords();
      expect(patientRecords.length).to.equal(1);
      expect(patientRecords[0].patientAddress).to.equal(patient.address);
      expect(patientRecords[0].name).to.equal(TEST_PATIENT.name);
    });
  });

  describe("Doctor Reviews", function () {
    it("Should allow an authorized doctor to add a review", async function () {
      const { privaHealth, patient, doctor } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);
      await privaHealth.connect(patient).authorizeDoctor(doctor.address);

      const review = "Excellent progress on treatment";
      await privaHealth.connect(doctor).addDoctorReview(patient.address, review);

      const reviews = await privaHealth.connect(patient).getDoctorReviews(patient.address);
      expect(reviews.length).to.equal(1);
      expect(reviews[0].review).to.equal(review);
    });

    it("Should not allow an unauthorized doctor to add a review", async function () {
      const { privaHealth, patient, doctor } = await deployPrivaHealth();
      await initializePatient(privaHealth, patient);

      const review = "Unauthorized review";
      await expect(privaHealth.connect(doctor).addDoctorReview(patient.address, review))
        .to.be.revertedWith("Only authorized doctors can add reviews");
    });
  });
});
