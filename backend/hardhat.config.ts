import { promises as fs } from 'fs';
import path from 'path';

import '@nomicfoundation/hardhat-ethers';
import '@oasisprotocol/sapphire-hardhat';
import '@typechain/hardhat';
import canonicalize from 'canonicalize';
import { JsonRpcProvider } from "ethers";
import 'hardhat-watcher';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'solidity-coverage';

import {
    deployContract,
    addPatientRecord,
    updatePatientRecord,
    authorizeDoctor,
    authorizeHealthCenter,
    setDataSharing,
    setHealthCenterAuthorization
} from './helpers';

const TASK_EXPORT_ABIS = 'export-abis';

task(TASK_COMPILE, async (_args, hre, runSuper) => {
  await runSuper();
  await hre.run(TASK_EXPORT_ABIS);
});

task(TASK_EXPORT_ABIS, async (_args, hre) => {
  const srcDir = path.basename(hre.config.paths.sources);
  const outDir = path.join(hre.config.paths.root, 'abis');

  const [artifactNames] = await Promise.all([
    hre.artifacts.getAllFullyQualifiedNames(),
    fs.mkdir(outDir, { recursive: true }),
  ]);

  await Promise.all(
    artifactNames.map(async (fqn) => {
      const { abi, contractName, sourceName } = await hre.artifacts.readArtifact(fqn);
      if (abi.length === 0 || !sourceName.startsWith(srcDir) || contractName.endsWith('Test'))
        return;
      await fs.writeFile(`${path.join(outDir, contractName)}.json`, `${canonicalize(abi)}\n`);
    }),
  );
});

// Deploy PrivaHealth contract
task('deployPrivaHealth')
  .setAction(async (_, hre) => {
    await hre.run('compile');

    const privaHealth = await deployContract(hre, await hre.ethers.getSigners(), 'PrivaHealth');
    console.log(`PrivaHealth deployed to: ${await privaHealth.getAddress()}`);
    return privaHealth;
  });

// Add a new patient record
task('addPatient')
  .addParam('address', 'contract address')
  .addParam('patientAddress', 'patient address')
  .addParam('name', 'patient name')
  .addParam('dateOfBirth', 'date of birth (UNIX timestamp)')
  .addParam('gender', 'patient gender')
  .addParam('contactInfo', 'contact info hash')
  .addParam('emergencyContact', 'emergency contact hash')
  .addParam('medicalRecord', 'medical record hash')
  .addParam('medications', 'current medications')
  .addParam('allergies', 'known allergies')
  .addParam('bloodType', 'blood type')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    await addPatientRecord(hre, privaHealth, taskArgs);
  });

// Update a patient record
task('updatePatient')
  .addParam('address', 'contract address')
  .addParam('patientAddress', 'patient address')
  .addParam('medicalRecord', 'medical record hash')
  .addParam('medications', 'current medications')
  .addParam('allergies', 'known allergies')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    await updatePatientRecord(hre, privaHealth, taskArgs);
  });

// Get patient records (public data)
task('getPatients')
  .addParam('address', 'contract address')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    const patientRecords = await privaHealth.getPatientRecords();
    console.log('Patient Records:');
    patientRecords.forEach((record: any, index: number) => {
      console.log(`Patient ${index + 1}:`);
      console.log(`Address: ${record.patientAddress}`);
      console.log(`Name: ${record.name}`);
      console.log(`Date of Birth: ${new Date(Number(record.dateOfBirth) * 1000).toISOString()}`);
      console.log(`Gender: ${record.gender}`);
      console.log(`Blood Type: ${record.bloodType}`);
      console.log(`Medical Record Hash: ${record.medicalRecord}`);
      console.log(`Current Medications: ${record.currentMedications}`);
      console.log(`Allergies: ${record.allergies}`);
      console.log('---');
    });
  });

// Get sensitive patient data (only for authorized entities)
task('getSensitiveData')
  .addParam('address', 'contract address')
  .addParam('patientAddress', 'patient address')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    const sensitiveData = await privaHealth.getSensitivePatientData(taskArgs.patientAddress);
    console.log('Sensitive Patient Data:');
    console.log(`Name: ${sensitiveData[0]}`);
    console.log(`Date of Birth: ${new Date(Number(sensitiveData[1]) * 1000).toISOString()}`);
    console.log(`Gender: ${sensitiveData[2]}`);
    console.log(`Blood Type: ${sensitiveData[3]}`);
    console.log(`Last Updated: ${new Date(Number(sensitiveData[4]) * 1000).toISOString()}`);
    console.log(`Data Sharing: ${sensitiveData[5]}`);
    console.log(`Medical Record Hash: ${sensitiveData[6]}`);
    console.log(`Current Medications: ${sensitiveData[7]}`);
    console.log(`Allergies: ${sensitiveData[8]}`);
  });

// Authorize a doctor
task('authorizeDoctor')
  .addParam('address', 'contract address')
  .addParam('doctorAddress', 'doctor\'s address')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    await authorizeDoctor(hre, privaHealth, taskArgs.doctorAddress);
  });

// Authorize a health center
task('authorizeHealthCenter')
  .addParam('address', 'contract address')
  .addParam('healthCenterAddress', 'health center\'s address')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    await authorizeHealthCenter(hre, privaHealth, taskArgs.healthCenterAddress);
  });

// Set data sharing preferences
task('setDataSharing')
  .addParam('address', 'contract address')
  .addParam('allowSharing', 'allow data sharing (true/false)')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    await setDataSharing(hre, privaHealth, taskArgs.allowSharing === 'true');
  });

// Set health center authorization (for owner)
task('setHealthCenterAuth')
  .addParam('address', 'contract address')
  .addParam('healthCenter', 'health center address')
  .addParam('isAuthorized', 'authorization status (true/false)')
  .setAction(async (taskArgs, hre) => {
    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', taskArgs.address);
    await setHealthCenterAuthorization(hre, privaHealth, taskArgs.healthCenter, taskArgs.isAuthorized === 'true');
  });

// Hardhat Node and sapphire-dev test mnemonic.
const TEST_HDWALLET = {
  mnemonic: "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
};


const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4] : TEST_HDWALLET;

const config: HardhatUserConfig = {
  networks: {
    hardhat: { // https://hardhat.org/metamask-issue.html
      chainId: 1337,
    },
    'sapphire': {
      url: 'https://sapphire.oasis.io',
      chainId: 0x5afe,
      accounts,
    },
    'sapphire-testnet': {
      url: 'https://testnet.sapphire.oasis.dev',
      chainId: 0x5aff,
      accounts,
    },
    'sapphire-localnet': { // docker run -it -p8545:8545 -p8546:8546 ghcr.io/oasisprotocol/sapphire-localnet -test-mnemonic
      url: 'http://localhost:8545',
      chainId: 0x5afd,
      accounts,
    },
  },
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  watcher: {
    compile: {
      tasks: ['compile'],
      files: ['./contracts/'],
    },
    test: {
      tasks: ['test'],
      files: ['./contracts/', './test'],
    },
    coverage: {
      tasks: ['coverage'],
      files: ['./contracts/', './test'],
    },
  },
  mocha: {
    require: ['ts-node/register/files'],
    timeout: 50_000,
  },
};

export default config;