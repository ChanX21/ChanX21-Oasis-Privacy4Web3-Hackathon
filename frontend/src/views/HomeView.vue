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
  <section class="pt-5" v-if="isCorrectNetworkSelected">
    <h2 class="capitalize text-2xl text-white font-bold mb-4">PrivaHealth Dashboard</h2>

    <div class="flex space-x-4 mb-6">
      <AppButton variant="primary">
        <span>Patient Portal</span>
      </AppButton>
      <AppButton variant="primary">
        <span>Doctor Portal</span>
      </AppButton>
    </div>

    <h3 class="capitalize text-xl text-white font-bold mb-4">Latest Medical Record Update</h3>

    <div class="message p-6 mb-6 rounded-xl border-2 border-gray-300" v-if="!isLoading">
      <div class="flex items-center justify-between">
        <h2 class="text-lg lg:text-lg m-0">{{ message }}</h2>
        <div class="flex items-center flex-shrink-0">
          <JazzIcon class="mr-2" :size="20" :address="author" />
          <abbr :title="author" class="font-mono block no-underline">{{ abbrAddr(author) }}</abbr>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="message p-6 pt-4 mb-6 rounded-xl border-2 border-gray-300">
        <MessageLoader />
      </div>
    </div>

    <h3 class="capitalize text-xl text-white font-bold mb-4">Update Medical Record</h3>
    <p class="text-base text-white mb-6">
      Update your medical record by filling in the field below.
    </p>

    <form @submit="setMessage">
      <div class="form-group">
        <input type="text" id="newMessageText" class="peer" placeholder=" " v-model="newMessage" required
          :disabled="isSettingMessage" />

        <label for="newMessageText"
          class="peer-focus:text-primaryDark peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5">
          New medical record entry:
          <span class="text-red-500">*</span>
        </label>
      </div>

      <AppButton type="submit" variant="primary" :disabled="isSettingMessage">
        <span v-if="isSettingMessage">Updating…</span>
        <span v-else>Update Record</span>
      </AppButton>

      <div v-if="errors.length > 0" class="text-red-500 px-3 mt-5 rounded-xl-sm">
        <span class="font-bold">Errors:</span>
        <ul class="list-disc px-8">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </form>
  </section>
  <section class="pt-5" v-else>
    <h2 class="capitalize text-white text-2xl font-bold mb-4">Invalid network detected</h2>
    <p class="text-white text-base mb-20">
      In order to continue to use the app, please switch to the correct chain, by clicking on the
      below "Switch network" button
    </p>

    <div class="flex justify-center">
      <AppButton variant="secondary" @click="switchNetwork">Switch network</AppButton>
    </div>
  </section>
</template>

<style scoped lang="postcss">
/* Modern form input styling */
input {
  @apply block my-4 p-2 mx-auto text-2xl transition-all duration-200 ease-in-out;
  @apply border-2 border-gray-300 rounded-xl text-gray-800;
  @apply hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50;
  @apply outline-none;
}

/* Refined form group with floating label */
.form-group {
  @apply relative mb-8;
}

.form-group input,
.form-group textarea {
  @apply block rounded-xl py-6 px-5 w-full text-base bg-white;
  @apply text-gray-800 appearance-none transition-all duration-200;
  @apply border-2 border-gray-300;
  @apply focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50;
}

/* Enhanced floating label animation */
.form-group label {
  @apply absolute text-base text-primaryDark pointer-events-none;
  @apply duration-200 transform -translate-y-5 scale-75 top-6 z-10 origin-[0] left-5;
  @apply bg-white px-2 transition-all;
}

/* Peer-based label animations */
.form-group input:focus ~ label,
.form-group input:not(:placeholder-shown) ~ label {
  @apply -translate-y-9 scale-75 text-primary;
}

/* Sophisticated message container */
.message {
  @apply bg-white rounded-xl transition-all duration-200;
  @apply border-primary p-6;
  border-width: 3px;
  border-style: solid;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.message:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* Error styling */
.error-container {
  @apply mt-6 p-4 rounded-xl bg-red-50 border-2 border-red-200;
}

.error-list {
  @apply list-disc pl-5 text-red-600;
}

/* Responsive adjustments */
@screen sm {
  .message {
    @apply p-8;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>