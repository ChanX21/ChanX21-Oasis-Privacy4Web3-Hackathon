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
  <Transition name="fade-scale">
    <div v-if="show" class="splash-screen">
      <img src="@/assets/images/Healthlife.png" alt="PrivaHealth Logo" class="logo" style="width: 35%; height: auto;">
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
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.logo {
  width: 200px;
  height: auto;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>