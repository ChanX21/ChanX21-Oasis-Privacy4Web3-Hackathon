<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '@/components/AppButton.vue';
import { Icon } from '@iconify/vue';

const activeTab = ref('patients');
</script>

<template>
  <section class="landing-page">
    <div class="container mx-auto px-4 py-16">
      <div class="hero-section flex flex-col md:flex-row items-center justify-between mb-16">
        <div class="md:w-1/2 mb-8 md:mb-0">
          <h1 class="text-5xl font-bold text-white mb-6">Revolutionizing Healthcare with Blockchain</h1>
          <p class="text-xl text-gray-300 mb-8">
            PrivaHealth empowers patients and healthcare providers with secure, private, and accessible medical records.
          </p>
          <div class="flex space-x-4">
            <AppButton variant="primary" class="text-lg px-8 py-3">
              Get Started
            </AppButton>
            <AppButton variant="secondary" class="text-lg px-8 py-3">
              Learn More
            </AppButton>
          </div>
        </div>
        <div class="md:w-1/2">
          <img src="@/assets/images/blockchain-icon.svg" alt="Healthcare Illustration" class="w-full max-w-[70%] mx-auto floating-animation">
        </div>
      </div>

      <div class="features-section mb-16">
        <h2 class="text-3xl font-semibold text-white mb-8 text-center">Why Choose PrivaHealth?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="feature-card">
            <Icon icon="mdi:shield-lock-outline" class="text-4xl mb-4 text-primary" />
            <h3 class="text-xl font-semibold mb-2">Secure Blockchain Storage</h3>
            <p>Ensure the integrity and immutability of your medical records with cutting-edge blockchain technology.</p>
          </div>
          <div class="feature-card">
            <Icon icon="mdi:account-key-outline" class="text-4xl mb-4 text-primary" />
            <h3 class="text-xl font-semibold mb-2">Patient-Controlled Access</h3>
            <p>Take full control of your personal health information and decide who can access your records.</p>
          </div>
          <div class="feature-card">
            <Icon icon="mdi:share-variant-outline" class="text-4xl mb-4 text-primary" />
            <h3 class="text-xl font-semibold mb-2">Seamless Sharing</h3>
            <p>Effortlessly share your medical records with healthcare providers, ensuring coordinated and efficient care.</p>
          </div>
        </div>
      </div>

      <div class="how-it-works-section mb-16">
        <h2 class="text-3xl font-semibold text-white mb-8 text-center">How It Works</h2>
        <div class="flex justify-center mb-8">
          <div class="tab-buttons">
            <button @click="activeTab = 'patients'" :class="{ active: activeTab === 'patients' }">For Patients</button>
            <button @click="activeTab = 'doctors'" :class="{ active: activeTab === 'doctors' }">For Doctors</button>
          </div>
        </div>
        <div v-if="activeTab === 'patients'" class="tab-content">
          <ol class="steps">
            <li>Sign up for a PrivaHealth account</li>
            <li>Connect your existing medical records</li>
            <li>Control access to your health information</li>
            <li>Securely share records with healthcare providers</li>
          </ol>
        </div>
        <div v-else class="tab-content">
          <ol class="steps">
            <li>Create a PrivaHealth professional account</li>
            <li>Verify your medical credentials</li>
            <li>Request access to patient records</li>
            <li>Collaborate with patients and other providers</li>
          </ol>
        </div>
      </div>

      <div class="cta-section text-center">
        <h2 class="text-3xl font-semibold text-white mb-6">Ready to Transform Your Healthcare Experience?</h2>
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
}

.tab-buttons button {
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  color: white;
  transition: all 0.3s ease;
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
</style>