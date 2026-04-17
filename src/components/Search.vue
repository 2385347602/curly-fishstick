<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import I18nKey from '@i18n/i18nKey';
import { i18n } from '@i18n/translation';
import { url } from '@utils/url-utils.ts';
import type { SearchResult } from '@/global';

const keywordDesktop = ref('');
const keywordMobile = ref('');
const result = ref<SearchResult[]>([]);
const isSearching = ref(false);
const pagefindLoaded = ref(false);
const initialized = ref(false);
const showPanel = ref(false);

const fakeResult: SearchResult[] = [
  {
    url: url('/'),
    meta: {
      title: 'This Is a Fake Search Result',
    },
    excerpt: 'Because the search cannot work in the <mark>dev</mark> environment.',
  },
  {
    url: url('/'),
    meta: {
      title: 'If You Want to Test the Search',
    },
    excerpt: 'Try running <mark>npm build && npm preview</mark> instead.',
  },
];

const togglePanel = () => {
  showPanel.value = !showPanel.value;
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
  if (!isDesktop) return;
  showPanel.value = show;
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
  if (!keyword) {
    setPanelVisibility(false, isDesktop);
    result.value = [];
    return;
  }

  if (!initialized.value) {
    return;
  }

  isSearching.value = true;

  try {
    let searchResults: SearchResult[] = [];

    if (import.meta.env.PROD && pagefindLoaded.value && (window as any).pagefind) {
      const response = await (window as any).pagefind.search(keyword);
      searchResults = await Promise.all(
        response.results.map((item: any) => item.data()),
      );
    } else if (import.meta.env.DEV) {
      searchResults = fakeResult;
    } else {
      searchResults = [];
      console.error('Pagefind is not available in production environment.');
    }

    result.value = searchResults;
    setPanelVisibility(result.value.length > 0, isDesktop);
  } catch (error) {
    console.error('Search error:', error);
    result.value = [];
    setPanelVisibility(false, isDesktop);
  } finally {
    isSearching.value = false;
  }
};

onMounted(() => {
  const initializeSearch = () => {
    initialized.value = true;
    pagefindLoaded.value =
      typeof window !== 'undefined' &&
      !!(window as any).pagefind &&
      typeof (window as any).pagefind.search === 'function';
    console.log('Pagefind status on init:', pagefindLoaded.value);
    if (keywordDesktop.value) search(keywordDesktop.value, true);
    if (keywordMobile.value) search(keywordMobile.value, false);
  };

  if (import.meta.env.DEV) {
    console.log(
      'Pagefind is not available in development mode. Using mock data.',
    );
    initializeSearch();
  } else {
    document.addEventListener('pagefindready', () => {
      console.log('Pagefind ready event received.');
      initializeSearch();
    });
    document.addEventListener('pagefindloaderror', () => {
      console.warn(
        'Pagefind load error event received. Search functionality will be limited.',
      );
      initializeSearch();
    });

    setTimeout(() => {
      if (!initialized.value) {
        console.log('Fallback: Initializing search after timeout.');
        initializeSearch();
      }
    }, 2000);
  }
});

watch(keywordDesktop, async (newVal) => {
  if (initialized.value && newVal) {
    await search(newVal, true);
  }
});

watch(keywordMobile, async (newVal) => {
  if (initialized.value && newVal) {
    await search(newVal, false);
  }
});
</script>

<template>
  <!-- search bar for desktop view -->
  <div
    id="search-bar"
    class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
    "
  >
    <iconify-icon
      icon="material-symbols:search"
      class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"
    ></iconify-icon>
    <input
      :placeholder="i18n(I18nKey.search)"
      v-model="keywordDesktop"
      @focus="search(keywordDesktop, true)"
      class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
    >
  </div>

  <!-- toggle btn for phone/tablet view -->
  <button
    @click="togglePanel"
    aria-label="Search Panel"
    id="search-switch"
    class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90"
  >
    <iconify-icon icon="material-symbols:search" class="text-[1.25rem]"></iconify-icon>
  </button>

  <!-- search panel -->
  <Transition name="slide">
    <div
      v-show="showPanel"
      id="search-panel"
      class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
        top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2"
    >
      <!-- search bar inside panel for phone/tablet -->
      <div
        id="search-bar-inside"
        class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
          bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
          dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
        "
      >
        <iconify-icon
          icon="material-symbols:search"
          class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"
        ></iconify-icon>
        <input
          placeholder="Search"
          v-model="keywordMobile"
          class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
      </div>

      <!-- search results -->
      <a
        v-for="item in result"
        :key="item.url"
        :href="item.url"
        class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
           rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
      >
        <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
          {{ item.meta.title }}
          <iconify-icon
            icon="fa6-solid:chevron-right"
            class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"
          ></iconify-icon>
        </div>
        <div class="transition text-sm text-50" v-html="item.excerpt"></div>
      </a>
    </div>
  </Transition>
</template>

<style scoped>
input:focus {
  outline: 0;
}

.search-panel {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>