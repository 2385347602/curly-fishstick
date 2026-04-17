<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	videoId: string;        // YouTube 视频 ID
	start?: number;         // 开始时间（秒）
	autoplay?: boolean;     // 是否自动播放
	muted?: boolean;        // 是否静音
}

const props = withDefaults(defineProps<Props>(), {
	start: 0,
	autoplay: false,
	muted: false
});

// 计算 iframe src
const iframeSrc = computed(() => {
	const params = new URLSearchParams({
		rel: '0',
		modestbranding: '1',
		enablejsapi: '1',
	});

	if (props.start > 0) {
		params.set('start', props.start.toString());
	}

	if (props.autoplay) {
		params.set('autoplay', '1');
		if (props.muted) {
			params.set('mute', '1');
		}
	}

	return `https://www.youtube.com/embed/${props.videoId}?${params.toString()}`;
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
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				class="absolute top-0 left-0 w-full h-full"
				loading="lazy"
				title="YouTube Video Player"
			></iframe>
		</div>
	</div>
</template>
