<template>
  <div class="patient-page container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-white">Patient Dashboard</h1>
    
    <!-- Initialize Patient Button -->
    <div v-if="!isInitialized" class="mb-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
      <h2 class="text-2xl font-semibold mb-4 text-white">Register as Patient</h2>
      <button 
        @click="initializePatient"
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300"
      >
        Register Patient
      </button>
    </div>
    
    <!-- Data Sharing Toggle -->
    <div class="mb-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
      <h2 class="text-2xl font-semibold mb-4 text-white">Data Sharing Settings</h2>
      <div class="flex items-center">
        <span class="mr-3 text-white">Data Sharing:</span>
        <label class="switch">
          <input type="checkbox" v-model="isDataSharingEnabled" @change="toggleDataSharing">
          <span class="slider round"></span>
        </label>
        <span class="ml-3 text-white">{{ isDataSharingEnabled ? 'Enabled' : 'Disabled' }}</span>
      </div>
    </div>
    
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Authorize Doctor Form -->
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Authorize Doctor</h2>
        <form @submit.prevent="authorizeDoctor">
          <input 
            v-model="doctorAddress" 
            type="text" 
            placeholder="Enter doctor's address"
            class="w-full p-2 mb-4 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
          <button 
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Authorize Doctor
          </button>
        </form>
      </div>

      <!-- Authorize Health Centre Form -->
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Authorize Health Centre</h2>
        <form @submit.prevent="authorizeHealthCentre">
          <input 
            v-model="healthCentreAddress" 
            type="text" 
            placeholder="Enter health centre's address"
            class="w-full p-2 mb-4 border rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
          >
          <button 
            type="submit"
            class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition duration-300"
          >
            Authorize Health Centre
          </button>
        </form>
      </div>
    </div>

    <!-- Personalized Health Plan and Doctor Reviews side by side -->
    <div class="grid md:grid-cols-2 gap-8 mt-8">
      <!-- Personalized Health Plan -->
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Personalized Health Plan</h2>
        <button 
          @click="getHealthPlan"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mb-4"
        >
          Get Health Plan
        </button>
        <div v-if="healthPlan" class="bg-white bg-opacity-20 p-4 rounded">
          <pre class="text-white">{{ healthPlan }}</pre>
        </div>
      </div>

      <!-- Doctor Reviews Section -->
      <div class="bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <h2 class="text-2xl font-semibold mb-4 text-white">Doctor Reviews</h2>
        <button 
          @click="getDoctorReviews"
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300 mb-4"
        >
          Get Doctor Reviews
        </button>
        <div v-if="doctorReviews.length > 0" class="bg-white bg-opacity-20 p-4 rounded max-h-60 overflow-y-auto">
          <div v-for="(review, index) in doctorReviews" :key="index" class="mb-4 p-3 bg-white bg-opacity-10 rounded">
            <p class="text-white"><strong>Review ID:</strong> {{ review.id }}</p>
            <p class="text-white"><strong>Review:</strong> {{ review.review }}</p>
            <p class="text-white"><strong>Timestamp:</strong> {{ new Date(Number(review.timestamp) * 1000).toLocaleString() }}</p>
          </div>
        </div>
        <p v-else-if="reviewsFetched" class="text-white">No reviews found.</p>
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
import { ref, onMounted } from 'vue';
import { usePrivaHealth, useUnwrappedPrivaHealth } from '../contracts';
import { useEthereumStore } from '../stores/ethereum';
import { abbrAddr } from '@/utils/utils';
import PopupMessage from '@/components/PopupMessage.vue';

const eth = useEthereumStore();
const privaHealth = usePrivaHealth();
const unwrappedPrivaHealth = useUnwrappedPrivaHealth();


const doctorAddress = ref('');
const healthCentreAddress = ref('');
const healthPlan = ref('');
const errors = ref<string[]>([]);
const isLoading = ref(true);
const isInitialized = ref(true);
const isDataSharingEnabled = ref(false);

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

const doctorReviews = ref<any[]>([]);
const reviewsFetched = ref(false);

onMounted(async () => {
  await checkInitializationStatus();
  if (isInitialized.value) {
    await checkDataSharingStatus();
  }
});

function handleError(error: Error, errorMessage: string) {
  errors.value.push(`${errorMessage}: ${error.message ?? JSON.stringify(error)}`);
  console.error(error);
}

async function checkInitializationStatus() {
  try {
    const patientAddress = await eth.signer?.getAddress();
    if (patientAddress) {
      const initialized = await unwrappedPrivaHealth.value?.getWhetherPatientInitialized(patientAddress);
      if (initialized !== undefined) {
        isInitialized.value = initialized;
      }
    }
  } catch (e) {
    handleError(e as Error, 'Failed to check initialization status');
  }
}

async function checkDataSharingStatus() {
  try {
    const patientAddress = await eth.signer?.getAddress();
    if (patientAddress) {
      const status = await unwrappedPrivaHealth.value?.getDataSharingStatus(patientAddress);
      isDataSharingEnabled.value = status !== undefined ? status : false;
    }
  } catch (e) {
    handleError(e as Error, 'Failed to check data sharing status');
  }
}

async function toggleDataSharing() {
  try {
    const tx = await privaHealth.value?.setDataSharing(isDataSharingEnabled.value);
    await tx.wait();
    showSuccessPopup(
      'Data Sharing Updated',
      `Data sharing has been ${isDataSharingEnabled.value ? 'enabled' : 'disabled'}`
    );
  } catch (e) {
    handleError(e as Error, 'Failed to update data sharing status');
    showErrorPopup('Update Failed', 'Failed to update data sharing status. Please try again.');
    isDataSharingEnabled.value = !isDataSharingEnabled.value; // Revert the toggle if the transaction failed
  }
}

async function initializePatient() {
  try {
    const tx = await privaHealth.value?.initializePatient();
    if (tx) {
      await tx.wait();
      showSuccessPopup('Initialization Successful', 'Patient initialized successfully');
      isInitialized.value = true;
      await checkDataSharingStatus(); // Check data sharing status after initialization
    }
  } catch (e) {
    handleError(e as Error, 'Failed to initialize patient');
    showErrorPopup('Initialization Failed', 'Failed to initialize patient. Please try again.');
  }
}

async function authorizeDoctor() {
  try {
    if (!doctorAddress.value) return;
    const tx = await privaHealth.value!.authorizeDoctor(doctorAddress.value);
    await tx.wait();
    showSuccessPopup('Doctor Authorized', `Doctor ${abbrAddr(doctorAddress.value)} authorized successfully`);
    doctorAddress.value = '';
  } catch (e) {
    handleError(e as Error, 'Failed to authorize doctor');
    showErrorPopup('Authorization Failed', 'Failed to authorize doctor. Please try again.');
  }
}

async function authorizeHealthCentre() {
  try {
    if (!healthCentreAddress.value) return;
    const tx = await privaHealth.value?.authorizeHealthCenter(healthCentreAddress.value);
    if (tx) {
      await tx.wait();
      showSuccessPopup('Health Centre Authorized', `Health Centre ${abbrAddr(healthCentreAddress.value)} authorized successfully`);
      healthCentreAddress.value = '';
    }
  } catch (e) {
    handleError(e as Error, 'Failed to authorize health centre');
    showErrorPopup('Authorization Failed', 'Failed to authorize health centre. Please try again.');
  }
}

async function getHealthPlan() {
  healthPlan.value = "hellow world";
}

async function getDoctorReviews() {
  try {
    const patientAddress = await eth.signer.value?.getAddress();
    if (patientAddress) {
      const reviews = await privaHealth.value?.getDoctorReviews(patientAddress);
      doctorReviews.value = reviews.map((review: any) => ({
        id: review.id.toString(),
        review: review.review,
        timestamp: review.timestamp.toString()
      }));
      reviewsFetched.value = true;
      if (doctorReviews.value.length > 0) {
        showSuccessPopup('Reviews Retrieved', 'Doctor reviews have been successfully retrieved.');
      } else {
        showSuccessPopup('No Reviews', 'No doctor reviews found for your account.');
      }
    }
  } catch (e) {
    handleError(e as Error, 'Failed to get doctor reviews');
    showErrorPopup('Retrieval Failed', 'Failed to get doctor reviews. Please try again.');
  }
}
</script>

<style scoped>
.patient-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* Toggle switch styles */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>