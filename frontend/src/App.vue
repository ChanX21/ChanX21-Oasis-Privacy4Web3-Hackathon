<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import LandingPage from '@/components/LandingPage.vue';
</script>

<template>
  <AppHeader />

  <main class="py-5 px-2 m-auto max-w-screen-md lg:px-0">
    <LandingPage />
    <RouterView />
  </main>
</template>

<style lang="postcss"></style>
