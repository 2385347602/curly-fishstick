<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from '@constants/constants.ts';
import I18nKey from '@i18n/i18nKey';
import { i18n } from '@i18n/translation';
import {
  applyThemeToDocument,
  getStoredTheme,
  setTheme,
} from '@utils/setting-utils.ts';
import type { LIGHT_DARK_MODE } from '@/types/config.ts';

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
const mode = ref<LIGHT_DARK_MODE>(AUTO_MODE);
const showPanel = ref(false);

onMounted(() => {
  mode.value = getStoredTheme();
  const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');

  const changeThemeWhenSchemeChanged = () => {
    applyThemeToDocument(mode.value);
  };

  darkModePreference.addEventListener('change', changeThemeWhenSchemeChanged);
});

function toggleTheme() {
  let i = 0;
  for (; i < seq.length; i++) {
    if (seq[i] === mode.value) break;
  }
  const newMode = seq[(i + 1) % seq.length];
  mode.value = newMode;
  setTheme(newMode);
}

function switchToLight() {
  mode.value = LIGHT_MODE;
  setTheme(LIGHT_MODE);
}

function switchToDark() {
  mode.value = DARK_MODE;
  setTheme(DARK_MODE);
}

function switchToAuto() {
  mode.value = AUTO_MODE;
  setTheme(AUTO_MODE);
}
</script>

<template>
  <div
    class="relative z-50"
    role="menu"
    tabindex="-1"
    @mouseenter="showPanel = true"
    @mouseleave="showPanel = false"
  >
    <button
      aria-label="Light/Dark Mode"
      role="menuitem"
      class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
      id="scheme-switch"
      @click="toggleTheme"
    >
      <div class="absolute" :class="{ 'opacity-0': mode !== LIGHT_MODE }">
        <iconify-icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></iconify-icon>
      </div>
      <div class="absolute" :class="{ 'opacity-0': mode !== DARK_MODE }">
        <iconify-icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></iconify-icon>
      </div>
      <div class="absolute" :class="{ 'opacity-0': mode !== AUTO_MODE }">
        <iconify-icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem]"></iconify-icon>
      </div>
    </button>

    <Transition name="fade">
      <div
        v-if="showPanel"
        id="light-dark-panel"
        class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5"
      >
        <div class="card-base float-panel p-2">
          <button
            class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
            :class="{ 'current-theme-btn': mode === LIGHT_MODE }"
            @click="switchToLight"
          >
            <iconify-icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3"></iconify-icon>
            {{ i18n(I18nKey.lightMode) }}
          </button>
          <button
            class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
            :class="{ 'current-theme-btn': mode === DARK_MODE }"
            @click="switchToDark"
          >
            <iconify-icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3"></iconify-icon>
            {{ i18n(I18nKey.darkMode) }}
          </button>
          <button
            class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
            :class="{ 'current-theme-btn': mode === AUTO_MODE }"
            @click="switchToAuto"
          >
            <iconify-icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem] mr-3"></iconify-icon>
            {{ i18n(I18nKey.systemMode) }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
