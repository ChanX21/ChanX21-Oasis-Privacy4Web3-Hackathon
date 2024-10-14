<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '@/components/AppButton.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const activeTab = ref('patients');
const router = useRouter();

const navigateTo = (route: string) => {
  router.push(route);
};
</script>

<template>
  <section class="landing-page">
    <div class="container mx-auto px-4 py-16">
      <div class="hero-section flex flex-col md:flex-row items-center justify-between mb-16">
        <div class="md:w-2/3 mb-8 md:mb-0">
          <h1 class="text-5xl font-bold text-white mb-6">Secure and Private Health Data Management with PrivaHealth</h1>
          <p class="text-xl text-gray-300 mb-8">
            PrivaHealth empowers patients with control over their medical records while enabling secure collaboration between patients, doctors, and health centers.
          </p>
          <div class="flex flex-wrap gap-4">
            <AppButton variant="primary" class="text-lg px-6 py-3 w-full sm:w-auto flex items-center justify-center" @click="navigateTo('/patient')">
              <Icon icon="mdi:account-heart" class="mr-2 text-2xl" />
              For Patients
            </AppButton>
            <AppButton variant="secondary" class="text-lg px-6 py-3 w-full sm:w-auto flex items-center justify-center" @click="navigateTo('/doctor')">
              <Icon icon="mdi:doctor" class="mr-2 text-2xl" />
              For Doctors
            </AppButton>
            <AppButton variant="tertiary" class="text-lg px-6 py-3 w-full sm:w-[200px] flex items-center justify-center" @click="navigateTo('/health-center')">
              <Icon icon="mdi:hospital-building" class="mr-2 text-2xl" />
              For Health Centers
            </AppButton>
          </div>
        </div>
        <div class="md:w-1/2">
          <img src="@/assets/images/PrivaBlockchain.png" alt="Healthcare Illustration" class="w-full max-w-[75%] mx-auto floating-animation">
        </div>
      </div>

      <div class="features-section mb-16">
        <h2 class="text-3xl font-semibold text-white mb-8 text-center">Why Choose PrivaHealth?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="feature-card">
            <Icon icon="mdi:shield-lock-outline" class="text-4xl mb-4 text-primary" />
            <h3 class="text-xl font-semibold mb-2">Patient-Controlled Access</h3>
            <p>Patients have full control over who can access their medical records, ensuring privacy and security.</p>
          </div>
          <div class="feature-card">
            <Icon icon="mdi:account-key-outline" class="text-4xl mb-4 text-primary" />
            <h3 class="text-xl font-semibold mb-2">Secure Data Sharing</h3>
            <p>Enable or disable data sharing for research purposes, putting you in control of your health information.</p>
          </div>
          <div class="feature-card">
            <Icon icon="mdi:share-variant-outline" class="text-4xl mb-4 text-primary" />
            <h3 class="text-xl font-semibold mb-2">Collaborative Healthcare</h3>
            <p>Seamlessly connect with authorized doctors and health centers for better coordinated care.</p>
          </div>
        </div>
      </div>

      <div class="how-it-works-section mb-16">
        <h2 class="text-3xl font-semibold text-white mb-8 text-center">How It Works</h2>
        <div class="flex justify-center mb-8">
          <div class="tab-buttons">
            <button @click="activeTab = 'patients'" :class="{ active: activeTab === 'patients' }">For Patients</button>
            <button @click="activeTab = 'doctors'" :class="{ active: activeTab === 'doctors' }">For Doctors</button>
            <button @click="activeTab = 'centers'" :class="{ active: activeTab === 'centers' }">For Health Centers</button>
          </div>
        </div>
        <div v-if="activeTab === 'patients'" class="tab-content">
          <ol class="steps">
            <li>Register your patient account on PrivaHealth</li>
            <li>Control your data sharing preferences</li>
            <li>Authorize doctors and health centers to access your records</li>
            <li>View your health plan and doctor reviews</li>
          </ol>
        </div>
        <div v-else-if="activeTab === 'doctors'" class="tab-content">
          <ol class="steps">
            <li>Get authorized by patients to access their records</li>
            <li>View sensitive patient data securely</li>
            <li>Add reviews and recommendations for patients</li>
            <li>Use AI-assisted diagnostics for better care</li>
          </ol>
        </div>
        <div v-else class="tab-content">
          <ol class="steps">
            <li>Get authorized as a health center on PrivaHealth</li>
            <li>Add and update patient records securely</li>
            <li>Collaborate with patients and doctors</li>
            <li>Maintain patient privacy while providing care</li>
          </ol>
        </div>
      </div>

      <div class="cta-section text-center">
        <h2 class="text-3xl font-semibold text-white mb-6">Ready to Take Control of Your Health Data?</h2>
        <AppButton variant="primary" class="text-lg px-8 py-3">
          Join PrivaHealth Today
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.landing-page {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #1a237e, #283593);
  min-height: 100vh;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

h1, h2, h3 {
  color: white;
}

p {
  color: #e0e0e0;
  line-height: 1.6;
}

.tab-buttons {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tab-buttons button {
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  color: white;
  transition: all 0.3s ease;
  margin: 0.25rem;
}

.tab-buttons button.active {
  background: white;
  color: #1a237e;
}

.tab-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}

.steps {
  list-style-type: none;
  counter-reset: step-counter;
  padding-left: 0;
}

.steps li {
  counter-increment: step-counter;
  margin-bottom: 1rem;
  padding-left: 3rem;
  position: relative;
  color: white;
}

.steps li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  background: white;
  color: #1a237e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.floating-animation {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Add this new style for the icons */
:deep(.iconify) {
  font-size: 1.9em; /* Increase size by 90% */
}

/* Add this new style for the tertiary button */
:deep(.btn-tertiary) {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

:deep(.btn-tertiary:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Update button styles */
:deep(.btn-primary) {
  background-color: #3f51b5;
  color: white;
}

:deep(.btn-primary:hover) {
  background-color: #303f9f;
}

:deep(.btn-secondary) {
  background-color: #ff4081;
  color: white;
}

:deep(.btn-secondary:hover) {
  background-color: #f50057;
}

:deep(.btn-tertiary) {
  background-color: #4caf50;
  color: white;
}

:deep(.btn-tertiary:hover) {
  background-color: #45a049;
}

/* Adjust the button layout for small screens */
@media (max-width: 640px) {
  .hero-section .flex {
    flex-direction: column;
  }

  .hero-section .flex > * {
    margin-bottom: 1rem;
  }
}

/* Add this new style for the buttons */
:deep(.btn-primary),
:deep(.btn-secondary),
:deep(.btn-tertiary) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>