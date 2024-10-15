<template>
  <div class="ai-loader-container">
    <div class="ai-loader">
      <div class="brain">
        <div class="synapse"></div>
        <div class="synapse"></div>
        <div class="synapse"></div>
      </div>
    </div>
    <p class="ai-loader-text">AI is analyzing...</p>
  </div>
</template>

<script setup lang="ts">
// No script needed for this component
</script>

<style scoped>
.ai-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.ai-loader {
  width: 100px;
  height: 100px;
  position: relative;
}

.brain {
  width: 100%;
  height: 100%;
  border: 4px solid #4fd1c5;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.synapse {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #4fd1c5;
  border-radius: 50%;
  animation: synapse 1.5s ease-in-out infinite;
}

.synapse:nth-child(1) {
  top: 20%;
  left: 20%;
}

.synapse:nth-child(2) {
  top: 20%;
  right: 20%;
}

.synapse:nth-child(3) {
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
}

.ai-loader-text {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #4fd1c5;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(79, 209, 197, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(79, 209, 197, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(79, 209, 197, 0);
  }
}

@keyframes synapse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
</style>
