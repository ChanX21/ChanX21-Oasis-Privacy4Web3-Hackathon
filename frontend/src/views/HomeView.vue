<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useMessageBox, useUnwrappedMessageBox } from '../contracts';
import { Network, useEthereumStore } from '../stores/ethereum';
import { abbrAddr } from '@/utils/utils';
import AppButton from '@/components/AppButton.vue';
import MessageLoader from '@/components/MessageLoader.vue';
import JazzIcon from '@/components/JazzIcon.vue';
import { retry } from '@/utils/promise';

const eth = useEthereumStore();
const messageBox = useMessageBox();
const uwMessageBox = useUnwrappedMessageBox();

const errors = ref<string[]>([]);
const message = ref('');
const author = ref('');
const newMessage = ref('');
const isLoading = ref(true);
const isSettingMessage = ref(false);
const isCorrectNetworkSelected = ref<Boolean>(true);

interface Message {
  message: string;
  author: string;
}

function handleError(error: Error, errorMessage: string) {
  errors.value.push(`${errorMessage}: ${error.message ?? JSON.stringify(error)}`);
  console.error(error);
}

async function fetchMessage(): Promise<Message> {
  const message = await messageBox.value!.message();
  const author = await messageBox.value!.author();

  return { message, author };
}

async function fetchAndSetMessageValues(): Promise<Message | null> {
  let retrievedMessage: Message | null = null;

  try {
    retrievedMessage = await fetchMessage();
    message.value = retrievedMessage.message;
    author.value = retrievedMessage.author;

    return retrievedMessage;
  } catch (e) {
    handleError(e as Error, 'Failed to get message');
  } finally {
    isLoading.value = false;
  }

  return retrievedMessage;
}

async function setMessage(e: Event): Promise<void> {
  if (e.target instanceof HTMLFormElement) {
    e.target.checkValidity();
    if (!e.target.reportValidity()) return;
  }

  e.preventDefault();

  try {
    const newMessageValue = newMessage.value;
    errors.value.splice(0, errors.value.length);
    isSettingMessage.value = true;

    await messageBox.value!.setMessage(newMessageValue);

    await retry<Promise<Message | null>>(fetchAndSetMessageValues, (retrievedMessage) => {
      if (retrievedMessage?.message !== newMessageValue) {
        throw new Error('Unable to determine if the new message has been correctly set!');
      }

      return retrievedMessage;
    });

    newMessage.value = '';
  } catch (e: any) {
    handleError(e, 'Failed to set message');
  } finally {
    isSettingMessage.value = false;
  }
}

async function switchNetwork() {
  await eth.switchNetwork(Network.FromConfig);
}

async function connectAndSwitchNetwork() {
  await eth.connect();
  isCorrectNetworkSelected.value = await eth.checkIsCorrectNetwork();
  if (!isCorrectNetworkSelected.value) {
    await switchNetwork();
  }
  isCorrectNetworkSelected.value = await eth.checkIsCorrectNetwork();
}

onMounted(async () => {
  await connectAndSwitchNetwork();
  await fetchAndSetMessageValues();
});
</script>

<template>
  <main class="min-h-screen bg-gray-900 p-6 sm:p-8">
    <section v-if="isCorrectNetworkSelected" class="max-w-2xl mx-auto">
      <header class="mb-10">
        <h1 class="text-3xl text-white font-bold mb-2">Message Board</h1>
        <p class="text-gray-400">Share and view messages on the blockchain</p>
      </header>

      <div class="space-y-8">
        <!-- Current Message Card -->
        <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 class="text-xl text-white font-semibold mb-4 flex items-center">
            <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Active Message
          </h2>
          
          <div v-if="!isLoading" class="message">
            <p class="text-lg text-white mb-4">{{ message }}</p>
            <div class="flex items-center justify-end space-x-2 text-gray-400">
              <JazzIcon :size="24" :address="author" />
              <abbr :title="author" class="font-mono text-sm">{{ abbrAddr(author) }}</abbr>
            </div>
          </div>
          <div v-else class="animate-pulse">
            <MessageLoader />
          </div>
        </div>

        <!-- Set New Message Card -->
        <form @submit="setMessage" class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 class="text-xl text-white font-semibold mb-4">Set New Message</h2>
          
          <div class="form-group">
            <input
              type="text"
              id="newMessageText"
              class="input-field"
              placeholder=" "
              v-model="newMessage"
              required
              :disabled="isSettingMessage"
            />
            <label for="newMessageText">
              Your message
              <span class="text-primary">*</span>
            </label>
          </div>

          <AppButton 
            type="submit" 
            variant="primary" 
            :disabled="isSettingMessage"
            class="w-full justify-center"
          >
            <template v-if="isSettingMessage">
              <span class="animate-pulse">Setting message...</span>
            </template>
            <template v-else>
              Publish Message
            </template>
          </AppButton>

          <!-- Error Display -->
          <div v-if="errors.length > 0" class="mt-4 p-4 bg-red-900/50 rounded-xl border border-red-500/50">
            <h3 class="text-red-400 font-semibold mb-2">Errors Encountered:</h3>
            <ul class="list-disc pl-5 text-red-300 space-y-1">
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </form>
      </div>
    </section>

    <!-- Network Error Section -->
    <section v-else class="max-w-md mx-auto text-center">
      <div class="bg-red-900/50 rounded-2xl p-8 border border-red-500/50">
        <h2 class="text-2xl text-white font-bold mb-4">Network Error</h2>
        <p class="text-gray-300 mb-6">
          Please switch to the correct network to continue using this application.
        </p>
        <AppButton variant="primary" @click="switchNetwork" class="w-full justify-center">
          Switch Network
        </AppButton>
      </div>
    </section>
  </main>
</template>

<style scoped lang="postcss">
/* Modern form styling */
.form-group {
  @apply relative mb-6;
}

.input-field {
  @apply w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl;
  @apply text-white placeholder-gray-400;
  @apply transition-all duration-200;
  @apply focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50;
}

.form-group label {
  @apply absolute text-sm text-gray-400 left-4 top-3;
  @apply transition-all duration-200 transform;
  @apply pointer-events-none;
}

.input-field:focus ~ label,
.input-field:not(:placeholder-shown) ~ label {
  @apply -translate-y-7 -translate-x-2 scale-90 text-primary;
}

/* Message styling */
.message {
  @apply transition-all duration-300;
}

/* Animation for loading states */
.animate-pulse {
  @apply opacity-50;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.2;
  }
}

/* Responsive adjustments */
@screen sm {
  .message {
    @apply p-1;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    @apply transition-none animate-none;
  }
}
</style>