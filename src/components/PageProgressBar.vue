<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const progress = ref(0);
let interval: ReturnType<typeof setInterval> | null = null;

/**
 * 显示进度条并开始动画
 */
function start() {
	isVisible.value = true;
	progress.value = 0;

	// 模拟进度增长
	let currentProgress = 0;
	interval = setInterval(() => {
		currentProgress += Math.random() * 15;
		if (currentProgress > 90) {
			currentProgress = 90; // 保持在 90%，等待完成
		}
		progress.value = currentProgress;
	}, 200);
}

/**
 * 完成进度条并隐藏
 */
function done() {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}

	progress.value = 100;

	// 短暂延迟后隐藏
	setTimeout(() => {
		isVisible.value = false;
		progress.value = 0;
	}, 300);
}

// 监听 Astro 页面跳转事件
onMounted(() => {
	// 页面开始加载
	document.addEventListener('astro:before-swap', start);

	// 页面加载完成
	document.addEventListener('astro:page-load', done);

	// 首次加载时也显示
	start();
	setTimeout(done, 500);
});

onUnmounted(() => {
	document.removeEventListener('astro:before-swap', start);
	document.removeEventListener('astro:page-load', done);

	if (interval) {
		clearInterval(interval);
	}
});

// 暴露方法供外部调用
defineExpose({ start, done });
</script>

<template>
	<Teleport to="body">
		<div
			v-show="isVisible"
			class="fixed top-0 left-0 right-0 z-[9999] h-1"
			role="progressbar"
			:aria-valuenow="progress"
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<!-- 进度条主体 -->
			<div
				class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out shadow-lg"
				:style="{ width: `${progress}%` }"
			/>

			<!-- 光晕效果 -->
			<div
				class="absolute top-0 h-full w-20 bg-white/50 blur-md"
				:style="{ left: `${progress}%`, transform: 'translateX(-100%)' }"
			/>
		</div>
	</Teleport>
</template>
