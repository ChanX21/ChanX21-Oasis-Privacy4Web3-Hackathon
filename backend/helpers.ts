import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PrivaHealth } from "./typechain-types";

export async function deployContract(hre: HardhatRuntimeEnvironment, signers: SignerWithAddress[], contractName: string, ...args: any[]) {
  const Contract = await hre.ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(...args);
  await contract.waitForDeployment();
  return contract;
}

export async function addPatientRecord(hre: HardhatRuntimeEnvironment, privaHealth: PrivaHealth, args: any) {
  const tx = await privaHealth.addPatientRecord(
    args.patientAddress,
    args.name,
    args.dateOfBirth,
    args.gender,
    args.contactInfo,
    args.emergencyContact,
    args.medicalRecord,
    args.medications,
    args.allergies,
    args.bloodType
  );
  const receipt = await tx.wait();
  console.log(`Patient record added. Transaction hash: ${receipt!.hash}`);
}

export async function updatePatientRecord(hre: HardhatRuntimeEnvironment, privaHealth: PrivaHealth, args: any) {
  const tx = await privaHealth.updatePatientRecord(
    args.patientAddress,
    args.medicalRecord,
    args.medications,
    args.allergies
  );
  const receipt = await tx.wait();
  console.log(`Patient record updated. Transaction hash: ${receipt!.hash}`);
}

export async function authorizeDoctor(hre: HardhatRuntimeEnvironment, privaHealth: PrivaHealth, doctorAddress: string) {
  const tx = await privaHealth.authorizeDoctor(doctorAddress);
  const receipt = await tx.wait();
  console.log(`Doctor authorized. Transaction hash: ${receipt!.hash}`);
}

export async function authorizeHealthCenter(hre: HardhatRuntimeEnvironment, privaHealth: PrivaHealth, healthCenterAddress: string) {
  const tx = await privaHealth.authorizeHealthCenter(healthCenterAddress);
  const receipt = await tx.wait();
  console.log(`Health center authorized. Transaction hash: ${receipt!.hash}`);
}

export async function setDataSharing(hre: HardhatRuntimeEnvironment, privaHealth: PrivaHealth, allowSharing: boolean) {
  const tx = await privaHealth.setDataSharing(allowSharing);
  const receipt = await tx.wait();
  console.log(`Data sharing preference set. Transaction hash: ${receipt!.hash}`);
}

export async function setHealthCenterAuthorization(hre: HardhatRuntimeEnvironment, privaHealth: PrivaHealth, healthCenterAddress: string, isAuthorized: boolean) {
  const tx = await privaHealth.setHealthCenterAuthorization(healthCenterAddress, isAuthorized);
  const receipt = await tx.wait();
  console.log(`Health center authorization set. Transaction hash: ${receipt!.hash}`);
}