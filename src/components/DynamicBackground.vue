<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';

// ==================== 配置项 ====================
const INTERVAL_MS = 60 * 60 * 1000; // 60 分钟
const BASE_URL = 'https://source.unsplash.com/random/1920x1080?nature,landscape';

// ==================== 状态管理 ====================
const currentImageUrl = ref<string>('');
const previousImageUrl = ref<string>('');
const isTransitioning = ref<boolean>(false);
let timer: ReturnType<typeof setInterval> | null = null;

// ==================== localStorage 缓存 ====================
const cachedUrl = useLocalStorage<string>('dynamic_bg_url', '');
const cachedTimestamp = useLocalStorage<number>('dynamic_bg_timestamp', 0);

/**
 * 生成带时间戳的 URL，破除浏览器缓存
 */
function generateFreshUrl(): string {
	return `${BASE_URL}&t=${Date.now()}`;
}

/**
 * 检查是否需要更新图片
 */
function shouldRefreshImage(): boolean {
	if (!cachedTimestamp.value) return true;

	const now = Date.now();
	const elapsed = now - cachedTimestamp.value;

	return elapsed >= INTERVAL_MS;
}

/**
 * 切换背景图片
 */
function switchImage(): void {
	previousImageUrl.value = currentImageUrl.value;
	currentImageUrl.value = generateFreshUrl();
	isTransitioning.value = true;

	// 更新缓存
	cachedUrl.value = currentImageUrl.value;
	cachedTimestamp.value = Date.now();

	// 1 秒后结束过渡状态
	setTimeout(() => {
		isTransitioning.value = false;
	}, 1000);
}

/**
 * 初始化背景图
 */
function initializeBackground(): void {
	if (cachedUrl.value && !shouldRefreshImage()) {
		// 使用缓存的图片，避免闪烁
		currentImageUrl.value = cachedUrl.value;
	} else {
		// 加载新图片
		switchImage();
	}
}

// ==================== 生命周期钩子 ====================
onMounted(() => {
	initializeBackground();

	// 设置定时器，每 60 分钟更换一次图片
	timer = setInterval(() => {
		switchImage();
	}, INTERVAL_MS);
});

onUnmounted(() => {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
});
</script>

<template>
	<!--
		背景图层结构:
		- 最底层：当前显示的图片
		- 中间层：正在过渡的上一张图片（仅在切换时显示）
		- 顶层：半透明黑色遮罩，确保文字可读性
	-->

	<!-- 当前背景图片 -->
	<div
		v-if="currentImageUrl"
		class="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
		:style="{ backgroundImage: `url('${currentImageUrl}')` }"
		role="img"
		aria-label="Dynamic background image"
	/>

	<!-- 过渡期间的上一张图片（淡出效果） -->
	<div
		v-if="isTransitioning && previousImageUrl"
		class="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out opacity-0"
		:style="{ backgroundImage: `url('${previousImageUrl}')` }"
		aria-hidden="true"
	/>

	<!-- 半透明黑色遮罩层，提升文字可读性 -->
	<div
		class="fixed inset-0 w-full h-full bg-black/20 pointer-events-none"
		aria-hidden="true"
	/>
</template>
