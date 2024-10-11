<script setup lang="ts">
import { onMounted, ref } from 'vue';

const show = ref(true);

onMounted(() => {
  setTimeout(() => {
    show.value = false;
  }, 3000);
});
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="splash-screen">
      <div class="content">
        <img src="@/assets/images/Healthlife.png" alt="PrivaHealth Logo" class="logo" style="width: 300px; height: auto;">      
        <div class="loading-bar">
          <div class="progress"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4169E1, #F0F8FF);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.content {
  text-align: center;
}

.logo {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.loading-bar {
  width: 200px;
  height: 4px;
  background-color: rgba(65, 105, 225, 0.3);
  margin: 0 auto;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  width: 0;
  height: 100%;
  background-color: #4169E1;
  animation: loading 2.5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes loading {
  0% { width: 0; }
  100% { width: 100%; }
}
</style>