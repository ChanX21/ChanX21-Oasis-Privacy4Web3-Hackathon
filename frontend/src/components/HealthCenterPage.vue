<template>
  <div class="health-center-page container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-white">Health Center Dashboard</h1>
    
    <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
      <h2 class="text-2xl font-semibold mb-4 text-white">Input Patient Data</h2>
      <form @submit.prevent="submitPatientData" class="space-y-4">
        <div>
          <label for="patientAddress" class="block text-white mb-2">Patient Address</label>
          <input 
            v-model="patientData.patientAddress" 
            id="patientAddress"
            type="text" 
            placeholder="0x..."
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
        </div>
        <div>
          <label for="name" class="block text-white mb-2">Name</label>
          <input 
            v-model="patientData.name" 
            id="name"
            type="text" 
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
        </div>
        <div>
          <label for="dateOfBirth" class="block text-white mb-2">Date of Birth</label>
          <input 
            v-model="patientData.dateOfBirth" 
            id="dateOfBirth"
            type="date" 
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
        </div>
        <div>
          <label for="gender" class="block text-white mb-2">Gender</label>
          <input 
            v-model="patientData.gender" 
            id="gender"
            type="text" 
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
        </div>
        <div>
          <label for="bloodType" class="block text-white mb-2">Blood Type</label>
          <input 
            v-model="patientData.bloodType" 
            id="bloodType"
            type="text" 
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
        </div>
        <div>
          <label for="dataSharing" class="block text-white mb-2">Data Sharing</label>
          <select 
            v-model="patientData.dataSharing" 
            id="dataSharing"
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white"
          >
            <option :value="true">Enabled</option>
            <option :value="false">Disabled</option>
          </select>
        </div>
        <div>
          <label for="medicalRecord" class="block text-white mb-2">Medical Record</label>
          <textarea 
            v-model="patientData.medicalRecord" 
            id="medicalRecord"
            rows="3"
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          ></textarea>
        </div>
        <div>
          <label for="currentMedications" class="block text-white mb-2">Current Medications</label>
          <textarea 
            v-model="patientData.currentMedications" 
            id="currentMedications"
            rows="3"
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          ></textarea>
        </div>
        <div>
          <label for="allergies" class="block text-white mb-2">Allergies</label>
          <textarea 
            v-model="patientData.allergies" 
            id="allergies"
            rows="3"
            class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          ></textarea>
        </div>
        <button 
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Submit Patient Data
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const patientData = ref({
  patientAddress: '',
  name: '',
  dateOfBirth: '',
  gender: '',
  bloodType: '',
  dataSharing: true,
  medicalRecord: '',
  currentMedications: '',
  allergies: ''
});

const submitPatientData = () => {
  // Convert dateOfBirth to Unix timestamp
  const dateOfBirth = new Date(patientData.value.dateOfBirth).getTime() / 1000;
  
  // Get current timestamp for lastUpdated
  const lastUpdated = Math.floor(Date.now() / 1000);

  // Prepare data for contract interaction
  const contractData = {
    patient: patientData.value.patientAddress,
    name: patientData.value.name,
    dateOfBirth: dateOfBirth,
    gender: patientData.value.gender,
    bloodType: patientData.value.bloodType,
    lastUpdated: lastUpdated,
    dataSharing: patientData.value.dataSharing,
    medicalRecord: patientData.value.medicalRecord,
    currentMedications: patientData.value.currentMedications,
    allergies: patientData.value.allergies
  };

  console.log('Submitting patient data:', contractData);
  // Here you would typically interact with your smart contract
  // For example: yourContract.methods.updatePatientData(contractData).send({from: healthCenterAddress})
};
</script>

<style scoped>
.health-center-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}
</style>