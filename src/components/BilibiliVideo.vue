<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	bvid: string;           // B站视频 BV 号
	page?: number;          // 分P页码（可选）
	danmaku?: boolean;      // 是否显示弹幕
	autoplay?: boolean;     // 是否自动播放
}

const props = withDefaults(defineProps<Props>(), {
	page: 1,
	danmaku: false,
	autoplay: false
});

// 计算 iframe src
const iframeSrc = computed(() => {
	const params = new URLSearchParams({
		high_quality: '1',
		danmaku: props.danmaku ? '1' : '0',
		autoplay: props.autoplay ? '1' : '0',
	});

	return `//player.bilibili.com/player.html?bvid=${props.bvid}&page=${props.page}&${params.toString()}`;
});
</script>

<template>
	<div class="my-8 w-full">
		<div class="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg bg-gray-900">
			<iframe
				:src="iframeSrc"
				scrolling="no"
				border="0"
				frameborder="no"
				framespacing="0"
				allowfullscreen="true"
				class="absolute top-0 left-0 w-full h-full"
				loading="lazy"
				title="Bilibili Video Player"
			></iframe>
		</div>
	</div>
</template>
