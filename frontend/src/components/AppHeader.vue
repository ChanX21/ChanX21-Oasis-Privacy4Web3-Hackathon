<script setup lang="ts">
import AccountPicker from '@/components/AccountPicker.vue';
</script>

<template>
  <header class="sticky top-0 z-50">
    <nav class="bg-white border-gray-200 p-2 xl:py-4 xl:px-0">

      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-md">
        <!-- <img src="../assets/images/Healthlife.png" alt="Priva Health Logo" class="h-150 sm:h-150" /> -->
        <RouterLink to="/">
          <img
            src="@/assets/images/Network-Logo-Blue.svg"
            class="h-6 sm:h-9"
            alt="Oasis Network logo"
          />
        </RouterLink>     
        <AccountPicker />
      </div>
    </nav>
  </header>
</template>

<style lang="postcss" scoped>
header {
  position: relative;
  z-index: 1000;
}

nav {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.header-logo {
  width: auto;
  object-fit: contain;
}
</style>
