<template>
  <Transition name="fade">
    <div v-if="show" class="popup-overlay">
      <div class="popup-content" :class="{ 'success': type === 'success', 'error': type === 'error' }">
        <div class="icon-container">
          <svg v-if="type === 'success'" class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <svg v-else class="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="crossmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="crossmark__cross" fill="none" d="M16 16 36 36 M36 16 16 36"/>
          </svg>
        </div>
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <button @click="closePopup" class="close-btn">Close</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
}>();

const emit = defineEmits(['close']);

const show = ref(props.show);

watch(() => props.show, (newValue) => {
  show.value = newValue;
});

const closePopup = () => {
  show.value = false;
  emit('close');
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.icon-container {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
}

.success {
  color: #4caf50;
}

.error {
  color: #f44336;
}

.close-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4caf50;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  stroke: #4caf50;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

.crossmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #f44336;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.crossmark__cross {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  stroke: #f44336;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
