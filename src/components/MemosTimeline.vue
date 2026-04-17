<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDateFormat } from '@vueuse/core';

interface Memo {
	id: string;
	content: string;
	createdTs: number;
	creatorName?: string;
	resources?: Array<{
		id: string;
		url: string;
		type: string;
	}>;
}

interface Props {
	apiUrl: string;        // Memos API 地址
	userId?: string;       // 用户 ID（可选）
	limit?: number;        // 显示数量限制
}

const props = withDefaults(defineProps<Props>(), {
	userId: '',
	limit: 20
});

const memos = ref<Memo[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// 格式化时间
function formatTime(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diff = now.getTime() - date.getTime();

	// 小于 1 分钟
	if (diff < 60000) {
		return '刚刚';
	}

	// 小于 1 小时
	if (diff < 3600000) {
		return `${Math.floor(diff / 60000)} 分钟前`;
	}

	// 小于 24 小时
	if (diff < 86400000) {
		return `${Math.floor(diff / 3600000)} 小时前`;
	}

	// 小于 7 天
	if (diff < 604800000) {
		return `${Math.floor(diff / 86400000)} 天前`;
	}

	// 其他情况显示日期
	return useDateFormat(date, 'YYYY-MM-DD').value;
}

// 获取 Memos 数据
async function fetchMemos() {
	isLoading.value = true;
	error.value = null;

	try {
		let url = `${props.apiUrl}/api/memos?limit=${props.limit}`;
		if (props.userId) {
			url += `&creatorId=${props.userId}`;
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		memos.value = data.data || data;

	} catch (err) {
		console.error('Failed to fetch memos:', err);
		error.value = err instanceof Error ? err.message : '加载失败';
	} finally {
		isLoading.value = false;
	}
}

// 解析内容中的链接和图片
function parseContent(content: string) {
	// 简单的 Markdown 解析
	return content
		.replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full h-auto mt-2" loading="lazy">')
		.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-indigo-600 dark:text-indigo-400 hover:underline">$1</a>')
		.replace(/\n/g, '<br>');
}

onMounted(() => {
	fetchMemos();

	// 监听 Astro 页面加载
	document.addEventListener('astro:page-load', fetchMemos);
});
</script>

<template>
	<div class="my-8">
		<h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
			<svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
			</svg>
			碎碎念
		</h3>

		<!-- 加载中 -->
		<div v-if="isLoading" class="space-y-4">
			<div v-for="i in 3" :key="i" class="animate-pulse">
				<div class="flex gap-3">
					<div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
					<div class="flex-1 space-y-2">
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
						<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
						<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- 错误提示 -->
		<div v-else-if="error" class="text-center py-8 text-red-500">
			<p class="text-sm">{{ error }}</p>
			<button
				@click="fetchMemos"
				class="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
			>
				重试
			</button>
		</div>

		<!-- 空状态 -->
		<div v-else-if="memos.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-600">
			<p class="text-sm">暂无动态</p>
		</div>

		<!-- 时间线列表 -->
		<div v-else class="space-y-4">
			<div
				v-for="memo in memos"
				:key="memo.id"
				class="group relative pl-6 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0"
			>
				<!-- 时间点标记 -->
				<div class="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-900 group-hover:scale-110 transition-transform"></div>

				<!-- 内容卡片 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
					<!-- 头部信息 -->
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
								{{ memo.creatorName?.charAt(0) || 'U' }}
							</div>
							<span class="text-sm font-medium text-gray-900 dark:text-gray-100">
								{{ memo.creatorName || '匿名用户' }}
							</span>
						</div>
						<time
							:datetime="new Date(memo.createdTs * 1000).toISOString()"
							class="text-xs text-gray-500 dark:text-gray-500"
						>
							{{ formatTime(memo.createdTs) }}
						</time>
					</div>

					<!-- 内容 -->
					<div
						class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
						v-html="parseContent(memo.content)"
					></div>

					<!-- 图片网格（如果有） -->
					<div v-if="memo.resources && memo.resources.length > 0" class="mt-3 grid grid-cols-2 gap-2">
						<img
							v-for="resource in memo.resources"
							:key="resource.id"
							:src="resource.url"
							:alt="'Attachment'"
							class="rounded-lg w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
							loading="lazy"
							@click="window.open(resource.url, '_blank')"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
