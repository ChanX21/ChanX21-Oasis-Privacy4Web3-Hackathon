<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import SplashScreen from '@/components/SplashScreen.vue';
</script>

<template>
  <div class="app">
    <SplashScreen />
    <AppHeader />
    <RouterView />
  </div>
</template>

<style>
/* Your global styles here */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
