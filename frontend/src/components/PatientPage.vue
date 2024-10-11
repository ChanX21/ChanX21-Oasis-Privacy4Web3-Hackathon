<template>
  <div class="patient-page container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-white">Patient Dashboard</h1>
    
    <!-- Initialize Patient Button -->
    <div class="mb-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
      <h2 class="text-2xl font-semibold mb-4 text-white">Initialize Patient</h2>
      <button 
        @click="initializePatient"
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300"
      >
        Initialize Patient
      </button>
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

    <!-- Personalized Health Plan -->
    <div class="mt-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePrivaHealth } from '../contracts';
import { useEthereumStore } from '../stores/ethereum';
import { abbrAddr } from '@/utils/utils';

const eth = useEthereumStore();
const privaHealth = usePrivaHealth();

const doctorAddress = ref('');
const healthCentreAddress = ref('');
const healthPlan = ref('');
const errors = ref<string[]>([]);
const isLoading = ref(true);
const isInitialized = ref(false);

onMounted(async () => {
  await checkInitializationStatus();
});

function handleError(error: Error, errorMessage: string) {
  errors.value.push(`${errorMessage}: ${error.message ?? JSON.stringify(error)}`);
  console.error(error);
}

async function checkInitializationStatus() {
  try {
    const patientAddress = await eth.signer.value?.getAddress();
    if (patientAddress) {
      isInitialized.value = await privaHealth.value?.initializedPatients(patientAddress);
    }
  } catch (e) {
    handleError(e as Error, 'Failed to check initialization status');
  }
}

async function initializePatient() {
  try {
    if (isInitialized.value) {
      alert('Patient already initialized');
      return;
    }
    const tx = await privaHealth.value?.initializePatient();
    await tx.wait();
    alert('Patient initialized successfully');
    isInitialized.value = true;
  } catch (e) {
    handleError(e as Error, 'Failed to initialize patient');
  }
}

async function authorizeDoctor() {
  try {
    if (!doctorAddress.value) return;
    let result  = await privaHealth.value!.authorizeDoctor(doctorAddress.value);
    console.log(result);
    alert(`Doctor ${abbrAddr(doctorAddress.value)} authorized successfully`);
    doctorAddress.value = '';
  } catch (e) {
    handleError(e as Error, 'Failed to authorize doctor');
  }
}

async function authorizeHealthCentre() {
  try {
    if (!healthCentreAddress.value) return;
    await privaHealth.value?.authorizeHealthCenter(healthCentreAddress.value);
    alert(`Health Centre ${abbrAddr(healthCentreAddress.value)} authorized successfully`);
    healthCentreAddress.value = '';
  } catch (e) {
    handleError(e as Error, 'Failed to authorize health centre');
  }
}

async function getHealthPlan() {
  healthPlan.value = "hellow world";
}
</script>

<style scoped>
.patient-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}
</style>