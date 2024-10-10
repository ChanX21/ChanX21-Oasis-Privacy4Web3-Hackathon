import { expect } from "chai";
import { ethers } from "hardhat";
import { BytesLike, EventLog } from "ethers";

import { PrivaHealth } from "../typechain-types";

const TEST_PATIENT = {
  name: "John Doe",
  dateOfBirth: 946684800,
  gender: "Male",
  contactInfoHash: ethers.keccak256(ethers.toUtf8Bytes("john@example.com")),
  emergencyContactHash: ethers.keccak256(ethers.toUtf8Bytes("emergency@example.com")),
  medicalRecord: ethers.keccak256(ethers.toUtf8Bytes("IPFS_hash_of_medical_record")),
  currentMedications: "Aspirin",
  allergies: "Peanuts",
  bloodType: "A+"
};

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

  describe("Patient Record Management", function () {
    it("Should add a new patient record", async function () {
      const { privaHealth, patient } = await deployPrivaHealth();

      const patientAddress = await addPatientRecord(privaHealth, patient.address, TEST_PATIENT);
      expect(patientAddress).to.equal(patient.address);
    });

    it("Should not allow adding a duplicate patient record", async function () {
      const { privaHealth, patient } = await deployPrivaHealth();

      await addPatientRecord(privaHealth, patient.address, TEST_PATIENT);

      await expect(addPatientRecord(privaHealth, patient.address, TEST_PATIENT))
        .to.be.revertedWith("Patient record already exists");
    });

    it("Should update an existing patient record", async function () {
      const { privaHealth, patient } = await deployPrivaHealth();

      await addPatientRecord(privaHealth, patient.address, TEST_PATIENT);

      const updatedMedicalRecord = ethers.keccak256(ethers.toUtf8Bytes("Updated_IPFS_hash"));
      const updatedMedications = "Aspirin, Lisinopril";
      const updatedAllergies = "Peanuts, Shellfish";

      const tx = await privaHealth.updatePatientRecord(
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
});
