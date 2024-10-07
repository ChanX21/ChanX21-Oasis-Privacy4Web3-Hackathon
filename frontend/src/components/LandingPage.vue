<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '@/components/AppButton.vue';

const showDetails = ref(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
</script>

<template>
  <section class="landing-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col items-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-3 text-center">Welcome to PrivaHealth</h1>
        <p class="text-lg text-gray-700 mb-6 text-center max-w-xl">
          Revolutionizing healthcare with blockchain for secure, private medical records.
        </p>
        <AppButton @click="toggleDetails" variant="primary" class="text-md px-6 py-2">
          {{ showDetails ? 'Hide Details' : 'Learn More' }}
        </AppButton>
      </div>

      <div v-if="showDetails" class="details-section">
        <h2 class="text-2xl font-semibold text-primary mb-4 text-center">Why PrivaHealth?</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="feature-card">
            <h3 class="text-lg font-semibold mb-1">Secure Blockchain Storage</h3>
            <p class="text-sm">Ensuring data integrity and immutability.</p>
          </div>
          <div class="feature-card">
            <h3 class="text-lg font-semibold mb-1">Patient-Controlled Access</h3>
            <p class="text-sm">Full control over personal health information.</p>
          </div>
          <div class="feature-card">
            <h3 class="text-lg font-semibold mb-1">Seamless Sharing</h3>
            <p class="text-sm">Effortless sharing between healthcare providers.</p>
          </div>
          <div class="feature-card">
            <h3 class="text-lg font-semibold mb-1">Enhanced Privacy</h3>
            <p class="text-sm">State-of-the-art data protection measures.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.landing-page {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.details-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.feature-card {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
  background: linear-gradient(135deg, #1a237e, #283593);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

p {
  line-height: 1.6;
}
</style>