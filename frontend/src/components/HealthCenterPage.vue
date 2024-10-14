<template>
  <div class="health-center-page container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-white">Health Center Dashboard</h1>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Add Patient Data</h2>
        <p class="text-gray-300 mb-4">Use this form to add a new patient record. Ensure all fields are filled accurately.</p>
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

      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Update Patient Record</h2>
        <p class="text-gray-300 mb-4">Update existing patient records here. Only modify the fields that need updating.</p>
        <form @submit.prevent="updatePatientRecord" class="space-y-4">
          <div>
            <label for="updatePatientAddress" class="block text-white mb-2">Patient Address</label>
            <input 
              v-model="updateData.patientAddress" 
              id="updatePatientAddress"
              type="text" 
              placeholder="0x..."
              class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            >
          </div>
          <div>
            <label for="updateMedicalRecord" class="block text-white mb-2">Medical Record</label>
            <textarea 
              v-model="updateData.medicalRecord" 
              id="updateMedicalRecord"
              rows="3"
              class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            ></textarea>
          </div>
          <div>
            <label for="updateCurrentMedications" class="block text-white mb-2">Current Medications</label>
            <textarea 
              v-model="updateData.currentMedications" 
              id="updateCurrentMedications"
              rows="3"
              class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            ></textarea>
          </div>
          <div>
            <label for="updateAllergies" class="block text-white mb-2">Allergies</label>
            <textarea 
              v-model="updateData.allergies" 
              id="updateAllergies"
              rows="3"
              class="w-full p-2 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            ></textarea>
          </div>
          <button 
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Update Patient Record
          </button>
        </form>
      </div>
    </div>

    <div class="mt-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
      <h2 class="text-2xl font-semibold mb-4 text-white">Important Information</h2>
      <ul class="list-disc list-inside text-gray-300 space-y-2">
        <li>Ensure patient consent before adding or updating any records.</li>
        <li>Double-check all information for accuracy before submission.</li>
        <li>For security reasons, sensitive data should be hashed before entry.</li>
        <li>If you encounter any issues, please contact the system administrator.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePrivaHealth } from '../contracts';
import { useEthereumStore } from '../stores/ethereum';

const eth = useEthereumStore();
const privaHealth = usePrivaHealth();

const patientData = ref({
  patientAddress: '',
  name: '',
  dateOfBirth: '',
  gender: '',
  bloodType: '',
  medicalRecord: '',
  currentMedications: '',
  allergies: ''
});

const updateData = ref({
  patientAddress: '',
  medicalRecord: '',
  currentMedications: '',
  allergies: ''
});

const errors = ref<string[]>([]);

function handleError(error: Error, errorMessage: string) {
  errors.value.push(`${errorMessage}: ${error.message ?? JSON.stringify(error)}`);
  console.error(error);
}

const submitPatientData = async () => {
  try {
    if (!privaHealth.value) {
      throw new Error('PrivaHealth contract not initialized');
    }
    
    const dateOfBirth = Math.floor(new Date(patientData.value.dateOfBirth).getTime() / 1000);
    
    const tx = await privaHealth.value.addPatientRecord(
      patientData.value.patientAddress,
      patientData.value.name,
      dateOfBirth,
      patientData.value.gender,
      '', // contactInfoHash
      '', // emergencyContactHash
      patientData.value.medicalRecord,
      patientData.value.currentMedications,
      patientData.value.allergies,
      patientData.value.bloodType
    );

    await tx.wait(); // Wait for transaction confirmation
    console.log('Patient data submitted successfully');
    alert('Patient data submitted successfully');

    // Clear the form after successful submission
    Object.keys(patientData.value).forEach(key => {
      patientData.value[key as keyof typeof patientData.value] = '';
    });

  } catch (e) {
    handleError(e as Error, 'Failed to submit patient data');
  }
};

const updatePatientRecord = async () => {
  try {
    if (!privaHealth.value) {
      throw new Error('PrivaHealth contract not initialized');
    }

    const tx = await privaHealth.value.updatePatientRecord(
      updateData.value.patientAddress,
      updateData.value.medicalRecord,
      updateData.value.currentMedications,
      updateData.value.allergies
    );

    await tx.wait(); // Wait for transaction confirmation
    console.log('Patient record updated successfully');
    alert('Patient record updated successfully');

    // Clear the form after successful update
    Object.keys(updateData.value).forEach(key => {
      updateData.value[key as keyof typeof updateData.value] = '';
    });

  } catch (e) {
    handleError(e as Error, 'Failed to update patient record');
  }
};
</script>

<style scoped>
.health-center-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}
</style>
