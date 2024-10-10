<template>
  <div class="doctor-page container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-white">Doctor Dashboard</h1>
    
    <div class="grid md:grid-cols-2 gap-8">
      <!-- See Patient Data Form -->
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">See Patient Data</h2>
        <form @submit.prevent="seePatientData">
          <input 
            v-model="patientAddress" 
            type="text" 
            placeholder="Enter patient's address"
            class="w-full p-2 mb-4 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
          <button 
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            View Patient Data
          </button>
        </form>
        <div v-if="patientData" class="mt-4 bg-white bg-opacity-20 p-4 rounded">
          <pre class="text-white">{{ patientData }}</pre>
        </div>
      </div>

      <!-- Get Diagnostics Assistance Form -->
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Get Diagnostics Assistance</h2>
        <form @submit.prevent="getDiagnosticsAssistance">
          <textarea 
            v-model="symptoms" 
            placeholder="Enter patient's symptoms"
            class="w-full p-2 mb-4 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300 h-32"
          ></textarea>
          <button 
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Get Assistance
          </button>
        </form>
        <div v-if="diagnosticsResult" class="mt-4 bg-white bg-opacity-20 p-4 rounded">
          <pre class="text-white">{{ diagnosticsResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const patientAddress = ref('');
const patientData = ref('');
const symptoms = ref('');
const diagnosticsResult = ref('');

const seePatientData = () => {
  console.log('Viewing patient data for:', patientAddress.value);
  // Simulating API call or blockchain interaction
  patientData.value = `Patient Data for ${patientAddress.value}:
- Name: John Doe
- Age: 35
- Blood Type: A+
- Allergies: Penicillin
- Last Visit: 2023-05-15`;
};

const getDiagnosticsAssistance = () => {
  console.log('Getting diagnostics assistance for symptoms:', symptoms.value);
  // Simulating API call to an AI diagnostics system
  diagnosticsResult.value = `Possible Diagnoses:
1. Common Cold (70% probability)
2. Seasonal Allergies (20% probability)
3. Sinus Infection (10% probability)

Recommended Actions:
- Rest and hydration
- Over-the-counter decongestants
- Follow up if symptoms persist for more than 7 days`;
};
</script>

<style scoped>
.doctor-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}
</style>