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
  <PopupMessage
    :show="showPopup"
    :type="popupType"
    :title="popupTitle"
    :message="popupMessage"
    @close="closePopup"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePrivaHealth } from '../contracts';
import PopupMessage from '@/components/PopupMessage.vue';

const privaHealth = usePrivaHealth();
const patientAddress = ref('');
const patientData = ref('');
const symptoms = ref('');
const diagnosticsResult = ref('');

const showPopup = ref(false);
const popupType = ref<'success' | 'error'>('success');
const popupTitle = ref('');
const popupMessage = ref('');

const closePopup = () => {
  showPopup.value = false;
};

const showSuccessPopup = (title: string, message: string) => {
  popupType.value = 'success';
  popupTitle.value = title;
  popupMessage.value = message;
  showPopup.value = true;
};

const showErrorPopup = (title: string, message: string) => {
  popupType.value = 'error';
  popupTitle.value = title;
  popupMessage.value = message;
  showPopup.value = true;
};

const seePatientData = async () => {
  try {
    console.log('Viewing patient data for:', patientAddress.value);
    const result = await privaHealth.value!.getSensitivePatientData((patientAddress.value));
    console.log({result});
    if (result) {
      patientData.value = `Patient Data for ${patientAddress.value}
- Name: ${result[0]}
- Date of Birth: ${new Date(Number(result[1])*1000).toLocaleDateString()}
- Gender: ${result[2]}
- Blood Type: ${result[3]}
- Last Updated:  ${new Date(Number(result[4])*1000).toLocaleDateString()}
- Medical Records:  ${result[6]}
- Current Medications: ${result[7]}
- Allergies:  ${result[8]}
`;
      showSuccessPopup('Patient Data Retrieved', 'Patient data has been successfully retrieved and displayed.');
    } else {
      patientData.value = 'No data found for this patient.';
      showErrorPopup('No Data Found', 'No data found for the provided patient address.');
    }
  } catch (e) {
    console.error('Error fetching patient data:', e);
    showErrorPopup('Error', 'Failed to fetch patient data. Please try again.');
  }
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

  showSuccessPopup('Diagnostics Assistance', 'Diagnostic results have been generated and displayed.');
};
</script>

<style scoped>
.doctor-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}
</style>
