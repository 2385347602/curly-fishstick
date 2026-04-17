<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// 异步加载组件，减少初始包体积
const HotPosts = defineAsyncComponent(() => import('@components/HotPosts.astro'));
const MemosTimeline = defineAsyncComponent(() => import('@components/MemosTimeline.vue'));

interface Props {
	enableMemos?: boolean;
	memosApiUrl?: string;
	memosUserId?: string;
}

withDefaults(defineProps<Props>(), {
	enableMemos: false,
	memosApiUrl: '',
	memosUserId: ''
});
</script>

<template>
	<aside class="space-y-6">
		<!-- 热门文章 -->
		<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
			<HotPosts />
		</div>

		<!-- 碎碎念时间线（可选） -->
		<div
			v-if="enableMemos && memosApiUrl"
			class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
		>
			<MemosTimeline
				:api-url="memosApiUrl"
				:user-id="memosUserId"
				:limit="5"
			/>
		</div>

		<!-- 其他侧边栏小部件可以在这里添加 -->
	</aside>
</template>
