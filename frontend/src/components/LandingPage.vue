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
        <h1 class="text-4xl font-bold text-white mb-3 text-center">Welcome to PrivaHealth</h1>
        <p class="text-lg text-gray-300 mb-6 text-center max-w-xl">
          Revolutionizing healthcare with blockchain for secure, private medical records.
        </p>
        <AppButton @click="toggleDetails" variant="secondary" class="text-md px-6 py-2">
          {{ showDetails ? 'Hide Details' : 'Learn More' }}
        </AppButton>
      </div>

      <div v-if="showDetails" class="details-section">
        <h2 class="text-2xl font-semibold text-white mb-4 text-center">Why PrivaHealth?</h2>
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

      <div class="mt-12 flex justify-center space-x-4">
        <AppButton variant="primary" class="text-md px-6 py-2">
          Patient Portal
        </AppButton>
        <AppButton variant="primary" class="text-md px-6 py-2">
          Doctor Portal
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.landing-page {
  font-family: 'Poppins', sans-serif;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: transparent;
}

.details-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.1);
}

h1, h2, h3 {
  color: white;
}

p {
  line-height: 1.6;
}

.feature-card h3 {
  color: #e0e0e0;
}

.feature-card p {
  color: #bdbdbd;
}
</style>