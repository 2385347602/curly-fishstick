<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';

interface Track {
	id: string;
	title: string;
	artist: string;
	cover: string;
	url: string;
	duration?: number;
}

interface Props {
	tracks?: Track[];
	autoPlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	tracks: () => [],
	autoPlay: false
});

// 播放状态
const isPlaying = ref(false);
const currentTrackIndex = ref(0);
const currentTime = ref(0);
const duration = ref(0);
const volume = useLocalStorage('music_volume', 0.7);

// 音频元素
let audio: HTMLAudioElement | null = null;

// 当前播放的歌曲
const currentTrack = computed(() => props.tracks[currentTrackIndex.value]);

// 播放进度百分比
const progressPercent = computed(() => {
	if (!duration.value) return 0;
	return (currentTime.value / duration.value) * 100;
});

// 格式化时间
function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 初始化音频
function initAudio() {
	if (!currentTrack.value) return;

	audio = new Audio(currentTrack.value.url);
	audio.volume = volume.value;

	// 事件监听
	audio.addEventListener('timeupdate', () => {
		currentTime.value = audio!.currentTime;
	});

	audio.addEventListener('loadedmetadata', () => {
		duration.value = audio!.duration;
	});

	audio.addEventListener('ended', () => {
		playNext();
	});

	audio.addEventListener('error', (e) => {
		console.error('Audio playback error:', e);
		isPlaying.value = false;
	});

	if (props.autoPlay) {
		play();
	}
}

// 播放
function play() {
	if (!audio) {
		initAudio();
		return;
	}

	audio.play().then(() => {
		isPlaying.value = true;
	}).catch(err => {
		console.error('Play failed:', err);
	});
}

// 暂停
function pause() {
	if (audio) {
		audio.pause();
		isPlaying.value = false;
	}
}

// 切换播放/暂停
function togglePlay() {
	if (isPlaying.value) {
		pause();
	} else {
		play();
	}
}

// 播放下一首
function playNext() {
	if (props.tracks.length === 0) return;

	currentTrackIndex.value = (currentTrackIndex.value + 1) % props.tracks.length;
	resetAndPlay();
}

// 播放上一首
function playPrev() {
	if (props.tracks.length === 0) return;

	currentTrackIndex.value = (currentTrackIndex.value - 1 + props.tracks.length) % props.tracks.length;
	resetAndPlay();
}

// 重置并播放
function resetAndPlay() {
	currentTime.value = 0;
	duration.value = 0;

	if (audio) {
		audio.pause();
		audio = null;
	}

	initAudio();
	play();
}

// 跳转到指定时间
function seek(event: MouseEvent) {
	if (!audio || !duration.value) return;

	const progressBar = event.currentTarget as HTMLElement;
	const rect = progressBar.getBoundingClientRect();
	const percent = (event.clientX - rect.left) / rect.width;

	audio.currentTime = percent * duration.value;
}

// 调节音量
function changeVolume(event: Event) {
	const target = event.target as HTMLInputElement;
	volume.value = parseFloat(target.value);

	if (audio) {
		audio.volume = volume.value;
	}
}

// 组件挂载时初始化
onMounted(() => {
	if (props.tracks.length > 0) {
		initAudio();
	}
});

// 暴露方法供外部调用
defineExpose({
	play,
	pause,
	togglePlay,
	playNext,
	playPrev
});
</script>

<template>
	<Teleport to="body">
		<!-- 迷你播放器（固定在底部） -->
		<div
			class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg transition-transform duration-300"
			:class="{ 'translate-y-full': !currentTrack }"
			data-transition-persist
		>
			<!-- 进度条 -->
			<div
				class="h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
				@click="seek"
			>
				<div
					class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100 relative"
					:style="{ width: `${progressPercent}%` }"
				>
					<!-- 拖拽手柄 -->
					<div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
				</div>
			</div>

			<!-- 播放器控制栏 -->
			<div class="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">

				<!-- 歌曲信息 -->
				<div v-if="currentTrack" class="flex items-center gap-3 flex-1 min-w-0">
					<!-- 封面图 -->
					<div class="relative w-12 h-12 flex-shrink-0">
						<img
							:src="currentTrack.cover"
							:alt="currentTrack.title"
							class="w-full h-full rounded-lg object-cover"
							:class="{ 'animate-spin-slow': isPlaying }"
						/>
					</div>

					<!-- 歌曲详情 -->
					<div class="min-w-0 flex-1">
						<h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
							{{ currentTrack.title }}
						</h4>
						<p class="text-xs text-gray-500 dark:text-gray-500 truncate">
							{{ currentTrack.artist }}
						</p>
					</div>
				</div>

				<!-- 控制按钮 -->
				<div class="flex items-center gap-2">
					<!-- 上一首 -->
					<button
						@click="playPrev"
						class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
						aria-label="上一首"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
						</svg>
					</button>

					<!-- 播放/暂停 -->
					<button
						@click="togglePlay"
						class="p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shadow-md hover:shadow-lg"
						:aria-label="isPlaying ? '暂停' : '播放'"
					>
						<svg v-if="isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
						</svg>
						<svg v-else class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z"/>
						</svg>
					</button>

					<!-- 下一首 -->
					<button
						@click="playNext"
						class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
						aria-label="下一首"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
						</svg>
					</button>
				</div>

				<!-- 音量控制 -->
				<div class="hidden sm:flex items-center gap-2 flex-1 justify-end">
					<svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
					</svg>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						:value="volume"
						@input="changeVolume"
						class="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
					/>
				</div>

			</div>
		</div>
	</Teleport>
</template>

<style scoped>
/* 缓慢旋转动画（用于封面图） */
@keyframes spin-slow {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.animate-spin-slow {
	animation: spin-slow 8s linear infinite;
}

/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 12px;
	height: 12px;
	background: #6366f1;
	border-radius: 50%;
	cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
	width: 12px;
	height: 12px;
	background: #6366f1;
	border-radius: 50%;
	cursor: pointer;
	border: none;
}
</style>
