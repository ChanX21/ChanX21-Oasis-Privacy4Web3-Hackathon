<template>
  <div class="patient-page container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-white">Patient Dashboard</h1>
    
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
import { ref } from 'vue';

const doctorAddress = ref('');
const healthCentreAddress = ref('');
const healthPlan = ref('');

const authorizeDoctor = () => {
  console.log('Authorizing doctor:', doctorAddress.value);
};

const authorizeHealthCentre = () => {
  console.log('Authorizing health centre:', healthCentreAddress.value);
};

const getHealthPlan = () => {
  healthPlan.value = `Your Personalized Health Plan:
1. Exercise for 30 minutes daily
2. Maintain a balanced diet
3. Get 8 hours of sleep each night
4. Schedule regular check-ups
5. Stay hydrated by drinking 8 glasses of water daily`;
};
</script>

<style scoped>
.patient-page {
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}
</style>