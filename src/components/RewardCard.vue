<script setup lang="ts">
import { ref } from 'vue';

interface Props {
	wechatImg: string;      // 微信收款码图片路径
	alipayImg: string;      // 支付宝收款码图片路径
	slogan?: string;        // 赞赏语
}

const props = withDefaults(defineProps<Props>(), {
	slogan: '如果文章对你有帮助，欢迎赞赏'
});

const isExpanded = ref(false);

function toggleExpand() {
	isExpanded.value = !isExpanded.value;
}
</script>

<template>
	<div class="my-12 flex justify-center">
		<div class="w-full max-w-2xl">

			<!-- 主按钮 -->
			<button
				@click="toggleExpand"
				class="group relative mx-auto flex items-center gap-2 px-6 py-3 rounded-full
				       bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
				       hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600
				       text-white font-medium shadow-lg hover:shadow-xl
				       transform transition-all duration-300 hover:scale-105 active:scale-95
				       animate-breathe cursor-pointer border-0 outline-none"
				aria-expanded="isExpanded"
				aria-controls="reward-content"
			>
				<!-- 爱心图标 -->
				<svg
					class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
				</svg>

				<span>{{ isExpanded ? '收起' : '赞赏作者' }}</span>

				<!-- 展开/收起箭头 -->
				<svg
					class="w-4 h-4 transition-transform duration-300"
					:class="{ 'rotate-180': isExpanded }"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
				</svg>
			</button>

			<!-- 展开的卡片内容 -->
			<Transition
				enter-active-class="transition-all duration-400 ease-out"
				leave-active-class="transition-all duration-300 ease-in"
				enter-from-class="opacity-0 -translate-y-4 max-h-0"
				enter-to-class="opacity-100 translate-y-0 max-h-[500px]"
				leave-from-class="opacity-100 translate-y-0 max-h-[500px]"
				leave-to-class="opacity-0 -translate-y-4 max-h-0"
			>
				<div
					v-if="isExpanded"
					id="reward-content"
					class="mt-6 overflow-hidden"
				>
					<div class="backdrop-blur-md bg-white/10 dark:bg-black/20
					            border border-white/20 rounded-2xl p-6 shadow-2xl">

						<!-- 赞赏语 -->
						<p class="text-center text-gray-700 dark:text-gray-300 mb-6 font-medium">
							{{ slogan }}
						</p>

						<!-- 二维码并排展示 -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

							<!-- 微信支付 -->
							<div class="flex flex-col items-center group">
								<div class="relative overflow-hidden rounded-xl bg-white p-4 shadow-md
								            transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
									<img
										:src="wechatImg"
										alt="微信收款码"
										class="w-48 h-48 object-contain"
										loading="lazy"
									/>
									<!-- Hover 光晕效果 -->
									<div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent
									            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>
								<span class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
									<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
										<path d="M8.5,14.5A1.5,1.5 0 0,1 7,13A1.5,1.5 0 0,1 8.5,11.5A1.5,1.5 0 0,1 10,13A1.5,1.5 0 0,1 8.5,14.5M15.5,14.5A1.5,1.5 0 0,1 14,13A1.5,1.5 0 0,1 15.5,11.5A1.5,1.5 0 0,1 17,13A1.5,1.5 0 0,1 15.5,14.5M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20Z"/>
									</svg>
									微信支付
								</span>
							</div>

							<!-- 支付宝 -->
							<div class="flex flex-col items-center group">
								<div class="relative overflow-hidden rounded-xl bg-white p-4 shadow-md
								            transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
									<img
										:src="alipayImg"
										alt="支付宝收款码"
										class="w-48 h-48 object-contain"
										loading="lazy"
									/>
									<!-- Hover 光晕效果 -->
									<div class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent
									            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>
								<span class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
									<svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
										<path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
									</svg>
									支付宝
								</span>
							</div>

						</div>

						<!-- 底部感谢语 -->
						<p class="text-center text-xs text-gray-500 dark:text-gray-500 mt-6 italic">
							💖 感谢您的支持，这将激励我创作更多内容
						</p>

					</div>
				</div>
			</Transition>

		</div>
	</div>
</template>

<style scoped>
/* 呼吸动画 */
@keyframes breathe {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-4px);
	}
}

.animate-breathe {
	animation: breathe 2s ease-in-out infinite;
}

/* 鼠标悬停时暂停呼吸动画 */
.animate-breathe:hover {
	animation-play-state: paused;
}

.rotate-180 {
	transform: rotate(180deg);
}
</style>
