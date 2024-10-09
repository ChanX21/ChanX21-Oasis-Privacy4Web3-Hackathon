import { promises as fs } from 'fs';
import path from 'path';

import '@nomicfoundation/hardhat-ethers';
import '@oasisprotocol/sapphire-hardhat';
import '@typechain/hardhat';
import canonicalize from 'canonicalize';
import {JsonRpcProvider} from "ethers";
import 'hardhat-watcher';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'solidity-coverage';
import { ethers } from 'ethers';

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

// Unencrypted contract deployment.
task('deploy')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    // For deployment unwrap the provider to enable contract verification.
    const uwProvider = new JsonRpcProvider(hre.network.config.url);
    const MessageBox = await hre.ethers.getContractFactory('MessageBox', new hre.ethers.Wallet(accounts[0], uwProvider));
    const messageBox = await MessageBox.deploy();
    await messageBox.waitForDeployment();

    console.log(`MessageBox address: ${await messageBox.getAddress()}`);
    return messageBox;
});

// Read message from the MessageBox.
task('message')
  .addPositionalParam('address', 'contract address')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const messageBox = await hre.ethers.getContractAt('MessageBox', args.address);
    const message = await messageBox.message();
    const author = await messageBox.author();
    console.log(`The message is: ${message}, author: ${author}`);
  });

// Set message.
task('setMessage')
  .addPositionalParam('address', 'contract address')
  .addPositionalParam('message', 'message to set')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    let messageBox = await hre.ethers.getContractAt('MessageBox', args.address);
    const tx = await messageBox.setMessage(args.message);
    const receipt = await tx.wait();
    console.log(`Success! Transaction hash: ${receipt!.hash}`);
  });

// Deploy PrivaHealth contract
task('deploy-privahealth')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const uwProvider = new JsonRpcProvider(hre.network.config.url as string);
    const PrivaHealth = await hre.ethers.getContractFactory('PrivaHealth', new hre.ethers.Wallet((accounts as any)[0], uwProvider));
    const privaHealth = await PrivaHealth.deploy();
    await privaHealth.waitForDeployment();

    console.log(`PrivaHealth address: ${await privaHealth.getAddress()}`);
    return privaHealth;
});

// Add a new patient record
task('add-patient')
  .addParam('address', 'contract address')
  .addParam('name', 'patient name')
  .addParam('dob', 'date of birth (UNIX timestamp)')
  .addParam('gender', 'patient gender')
  .addParam('contactInfo', 'contact info hash')
  .addParam('emergencyContact', 'emergency contact hash')
  .addParam('medicalRecord', 'medical record hash')
  .addParam('medications', 'current medications')
  .addParam('allergies', 'known allergies')
  .addParam('bloodType', 'blood type')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.addPatientRecord(
      args.name,
      args.dob,
      args.gender,
      args.contactInfo,
      args.emergencyContact,
      args.medicalRecord,
      args.medications,
      args.allergies,
      args.bloodType
    );
    const receipt = await tx.wait();
    console.log(`Patient added successfully! Transaction hash: ${receipt!.hash}`);
  });

// Update a patient record
task('update-patient')
  .addParam('address', 'contract address')
  .addParam('medicalRecord', 'medical record hash')
  .addParam('medications', 'current medications')
  .addParam('allergies', 'known allergies')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.updatePatientRecord(
      args.medicalRecord,
      args.medications,
      args.allergies
    );
    const receipt = await tx.wait();
    console.log(`Patient record updated successfully! Transaction hash: ${receipt!.hash}`);
  });

// Get patient records (public data)
task('get-patients')
  .addParam('address', 'contract address')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
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
task('get-sensitive-data')
  .addParam('address', 'contract address')
  .addParam('patientAddress', 'patient address')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const sensitiveData = await privaHealth.getSensitivePatientData(args.patientAddress);
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
task('authorize-doctor')
  .addPositionalParam('address', 'contract address')
  .addPositionalParam('doctorAddress', 'doctor\'s address')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.authorizeDoctor(args.doctorAddress);
    const receipt = await tx.wait();
    console.log(`Doctor authorized successfully! Transaction hash: ${receipt!.hash}`);
  });

// Revoke a doctor's authorization
task('revoke-doctor')
  .addParam('address', 'contract address')
  .addParam('doctorAddress', 'doctor\'s address')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.revokeDoctor(args.doctorAddress);
    const receipt = await tx.wait();
    console.log(`Doctor's authorization revoked successfully! Transaction hash: ${receipt!.hash}`);
  });

// Authorize a health center
task('authorize-health-center')
  .addParam('address', 'contract address')
  .addParam('healthCenterAddress', 'health center\'s address')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.authorizeHealthCenter(args.healthCenterAddress);
    const receipt = await tx.wait();
    console.log(`Health center authorized successfully! Transaction hash: ${receipt!.hash}`);
  });

// Revoke a health center's authorization
task('revoke-health-center')
  .addParam('address', 'contract address')
  .addParam('healthCenterAddress', 'health center\'s address')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.revokeHealthCenter(args.healthCenterAddress);
    const receipt = await tx.wait();
    console.log(`Health center's authorization revoked successfully! Transaction hash: ${receipt!.hash}`);
  });

// Set data sharing preferences
task('set-data-sharing')
  .addParam('address', 'contract address')
  .addParam('allowSharing', 'allow data sharing (true/false)')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.setDataSharing(args.allowSharing === 'true');
    const receipt = await tx.wait();
    console.log(`Data sharing preference set successfully! Transaction hash: ${receipt!.hash}`);
  });

// Set health center authorization (for owner)
task('set-health-center-auth')
  .addParam('address', 'contract address')
  .addParam('healthCenter', 'health center address')
  .addParam('isAuthorized', 'authorization status (true/false)')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    const privaHealth = await hre.ethers.getContractAt('PrivaHealth', args.address);
    const tx = await privaHealth.setHealthCenterAuthorization(args.healthCenter, args.isAuthorized === 'true');
    const receipt = await tx.wait();
    console.log(`Health center authorization set successfully! Transaction hash: ${receipt!.hash}`);
  });

// Hardhat Node and sapphire-dev test mnemonic.
const TEST_HDWALLET = {
  mnemonic: "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
};


const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : TEST_HDWALLET;

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