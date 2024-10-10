import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PrivaHealth contract...");

  const PrivaHealth = await ethers.getContractFactory("PrivaHealth");
  const privaHealth = await PrivaHealth.deploy();

  await privaHealth.waitForDeployment();
  console.log("PrivaHealth deployed to:", await privaHealth.getAddress());
 
  const [owner, patient, doctor, healthCenter] = await ethers.getSigners();
  console.log({owner, patient, doctor, healthCenter})
  
  console.log("Setting health center authorization...");
  await privaHealth.connect(owner).setHealthCenterAuthorization(healthCenter.address, true);
  
  console.log("Authorizing a health center for the patient...");
  await privaHealth.connect(patient).authorizeHealthCenter(healthCenter.address);

  console.log("Adding a patient record...");
  await privaHealth.connect(healthCenter).addPatientRecord(
    patient.address,
    "John Doe",
    946684800, // January 1, 2000
    "Male",
    "john@example.com",
    "emergency@example.com",
    "IPFS_hash_of_medical_record",
    "Aspirin",
    "Peanuts",
    "A+"
  );

  console.log("Updating patient record...");
  await privaHealth.connect(healthCenter).updatePatientRecord(
    patient.address,
    ethers.keccak256(ethers.toUtf8Bytes("Updated_IPFS_hash_of_medical_record")),
    "Aspirin, Lisinopril",
    "Peanuts, Shellfish"
  );

  console.log("Authorizing a doctor...");
  await privaHealth.connect(patient).authorizeDoctor(doctor.address);



  // console.log("Setting data sharing preference...");
  // await privaHealth.connect(patient).setDataSharing(true);

  // console.log("Retrieving patient records...");
  // const patientRecords = await privaHealth.getPatientRecords();
  // console.log("Patient Records:", patientRecords);

  console.log("Retrieving sensitive patient data...");
  const sensitiveData = await privaHealth.connect(doctor).getSensitivePatientData(patient.address);
  console.log("Sensitive Patient Data:", sensitiveData);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});