<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useScroll, useThrottleFn } from '@vueuse/core';

interface Heading {
	id: string;
	text: string;
	level: number;
}

interface Props {
	headings: Heading[];
}

const props = defineProps<Props>();

const activeId = ref<string>('');
const tocRef = ref<HTMLElement | null>(null);

// 获取所有标题元素
function getHeadingElements(): HTMLElement[] {
	return props.headings
		.map(h => document.getElementById(h.id))
		.filter((el): el is HTMLElement => el !== null);
}

// 计算当前激活的标题
function updateActiveHeading() {
	const headings = getHeadingElements();
	if (headings.length === 0) return;

	const scrollPosition = window.scrollY + 100; // 偏移量

	// 找到当前可见的标题
	for (let i = headings.length - 1; i >= 0; i--) {
		const heading = headings[i];
		if (heading.offsetTop <= scrollPosition) {
			activeId.value = heading.id;

			// 自动滚动 TOC 到可视区域
			scrollToActiveItem();
			return;
		}
	}

	// 如果还没滚动到任何标题，激活第一个
	if (scrollPosition < headings[0].offsetTop) {
		activeId.value = headings[0].id;
	}
}

// 滚动 TOC 使激活项可见
function scrollToActiveItem() {
	if (!tocRef.value) return;

	const activeElement = tocRef.value.querySelector(`[data-heading-id="${activeId.value}"]`);
	if (activeElement) {
		activeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
		});
	}
}

// 节流后的滚动处理函数
const handleScroll = useThrottleFn(updateActiveHeading, 100);

// 点击标题平滑滚动
function handleClick(id: string) {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' });
		activeId.value = id;
	}
}

onMounted(() => {
	// 初始化
	updateActiveHeading();

	// 监听滚动事件
	window.addEventListener('scroll', handleScroll, { passive: true });

	// 监听 Astro 页面加载
	document.addEventListener('astro:page-load', () => {
		setTimeout(updateActiveHeading, 100);
	});
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});

// 监听 headings 变化
watch(() => props.headings, () => {
	setTimeout(updateActiveHeading, 100);
}, { deep: true });
</script>

<template>
	<nav
		ref="tocRef"
		class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
		aria-label="文章目录"
	>
		<h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 px-2">
			目录
		</h3>

		<ul class="space-y-1">
			<li
				v-for="heading in headings"
				:key="heading.id"
				:data-heading-id="heading.id"
				:class="[
					'transition-all duration-200',
					heading.level === 2 ? 'pl-2' : 'pl-6',
					heading.level === 4 ? 'pl-10' : '',
				]"
			>
				<button
					@click="handleClick(heading.id)"
					class="w-full text-left py-1 px-2 rounded-md text-sm transition-colors duration-200"
					:class="[
						activeId === heading.id
							? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
							: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200',
					]"
				>
					{{ heading.text }}
				</button>
			</li>
		</ul>

		<!-- 空状态 -->
		<p
			v-if="headings.length === 0"
			class="text-xs text-gray-400 dark:text-gray-600 px-2 italic"
		>
			暂无目录
		</p>
	</nav>
</template>

<style scoped>
/* 自定义滚动条 */
nav::-webkit-scrollbar {
	width: 4px;
}

nav::-webkit-scrollbar-track {
	background: transparent;
}

nav::-webkit-scrollbar-thumb {
	background: rgb(156 163 175 / 0.3);
	border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
	background: rgb(156 163 175 / 0.5);
}
</style>
