<template>
  <div class="doctor-page container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-white">Doctor Dashboard</h1>
    
    <div class="grid md:grid-cols-2 gap-8">
      <!-- See Patient Data Form -->
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">See Patient Data</h2>
        <p class="text-gray-300 mb-4">View sensitive medical information for patients who have authorized you. Enter the patient's Ethereum address.</p>
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
        <p class="text-gray-300 mb-4">Use our AI-powered system to get diagnostic suggestions based on patient symptoms.</p>
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
        <AILoader v-if="isLoading" />
        <div v-else-if="diagnosticsResult" class="mt-4 bg-white bg-opacity-20 p-4 rounded">
          <div class="text-white whitespace-pre-wrap overflow-auto max-h-60">{{ diagnosticsResult }}</div>
        </div>
      </div>

      <!-- Add Doctor Review Form -->
      <div class="mt-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Add Doctor Review</h2>
        <p class="text-gray-300 mb-4">Provide a review or recommendation for a patient. This will be visible to the patient and other authorized healthcare providers.</p>
        <form @submit.prevent="addDoctorReview">
          <input 
            v-model="reviewPatientAddress" 
            type="text" 
            placeholder="Enter patient's address"
            class="w-full p-2 mb-4 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
          <textarea 
            v-model="doctorReview" 
            placeholder="Enter your review"
            class="w-full p-2 mb-4 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300 h-32"
          ></textarea>
          <button 
            type="submit"
            class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
          >
            Submit Review
          </button>
        </form>
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
import AILoader from '@/components/AILoader.vue';
import axios from 'axios';

const privaHealth = usePrivaHealth();
const patientAddress = ref('');
const patientData = ref('');
const symptoms = ref('');
const diagnosticsResult = ref('');
const reviewPatientAddress = ref('');
const doctorReview = ref('');

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

const isLoading = ref(false);

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

const getDiagnosticsAssistance = async () => {
  try {
    console.log('Getting diagnostics assistance for symptoms:', symptoms.value);
    isLoading.value = true;
    const response = await axios.post('http://localhost:3000/api/chat/diagnosticsAssistant', {
      prompt: `Patient symptoms: ${symptoms.value}\nPlease provide a diagnosis and recommended actions.`
    });
    
    diagnosticsResult.value = response.data.response;
    showSuccessPopup('Diagnostics Assistance', 'Diagnostic results have been generated and displayed.');
  } catch (error) {
    console.error('Error getting diagnostics assistance:', error);
    showErrorPopup('Error', 'Failed to get diagnostics assistance. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const addDoctorReview = async () => {
  try {
    if (!reviewPatientAddress.value || !doctorReview.value) {
      showErrorPopup('Invalid Input', 'Please enter both patient address and review.');
      return;
    }

    const tx = await privaHealth.value?.addDoctorReview(reviewPatientAddress.value, doctorReview.value);
    await tx?.wait();

    showSuccessPopup('Review Added', 'Your review has been successfully added.');
    reviewPatientAddress.value = '';
    doctorReview.value = '';
  } catch (e) {
    console.error('Error adding doctor review:', e);
    showErrorPopup('Error', 'Failed to add doctor review. Please try again.');
  }
};
</script>

<style scoped>
.doctor-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}
</style>
