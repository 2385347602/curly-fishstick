<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

interface Props {
	repo: string;              // GitHub 仓库，格式：owner/repo
	repoId: string;            // 仓库 ID
	category?: string;         // 讨论分类名称
	categoryId?: string;       // 分类 ID
	mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific';
	term?: string;             // 当 mapping 为 specific 时使用
	strict?: boolean;          // 严格标题匹配
	reactionsEnabled?: boolean; // 启用表情反应
	emitMetadata?: boolean;    // 发送元数据
	inputPosition?: 'top' | 'bottom'; // 输入框位置
	theme?: 'light' | 'dark' | 'preferred_color_scheme' | 'transparent_dark' | 'noborder_light' | 'noborder_dark' | string;
	lang?: string;             // 语言
	loading?: 'lazy' | 'eager'; // 加载策略
}

const props = withDefaults(defineProps<Props>(), {
	category: 'General',
	mapping: 'pathname',
	strict: false,
	reactionsEnabled: true,
	emitMetadata: false,
	inputPosition: 'bottom',
	theme: 'preferred_color_scheme',
	lang: 'zh-CN',
	loading: 'lazy'
});

const commentsRef = ref<HTMLElement | null>(null);
let scriptElement: HTMLScriptElement | null = null;

// 生成 Giscus 配置
function getGiscusConfig() {
	return {
		src: 'https://giscus.app/client.js',
		'data-repo': props.repo,
		'data-repo-id': props.repoId,
		'data-category': props.category,
		'data-category-id': props.categoryId,
		'data-mapping': props.mapping,
		'data-strict': props.strict ? '1' : '0',
		'data-reactions-enabled': props.reactionsEnabled ? '1' : '0',
		'data-emit-metadata': props.emitMetadata ? '1' : '0',
		'data-input-position': props.inputPosition,
		'data-theme': props.theme,
		'data-lang': props.lang,
		'data-loading': props.loading,
		crossorigin: 'anonymous',
		async: true,
	};
}

// 加载 Giscus 脚本
function loadGiscus() {
	if (!commentsRef.value) return;

	// 清除旧的脚本和 iframe
	if (scriptElement) {
		scriptElement.remove();
		scriptElement = null;
	}
	commentsRef.value.innerHTML = '';

	// 创建新的 script 元素
	scriptElement = document.createElement('script');

	const config = getGiscusConfig();
	Object.entries(config).forEach(([key, value]) => {
		if (key === 'src') {
			scriptElement!.src = value as string;
		} else {
			scriptElement!.setAttribute(key, String(value));
		}
	});

	commentsRef.value.appendChild(scriptElement);
}

// 监听主题变化
function updateTheme() {
	const isDark = document.documentElement.classList.contains('dark');
	const newTheme = isDark ? 'transparent_dark' : 'light';

	// 向 Giscus iframe 发送消息更新主题
	const iframe = commentsRef.value?.querySelector('iframe');
	if (iframe) {
		iframe.contentWindow?.postMessage(
			{ giscus: { setConfig: { theme: newTheme } } },
			'https://giscus.app'
		);
	}
}

onMounted(() => {
	loadGiscus();

	// 监听 Astro 页面加载事件
	document.addEventListener('astro:page-load', loadGiscus);

	// 监听主题变化
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'class') {
				updateTheme();
			}
		});
	});

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class'],
	});
});

onUnmounted(() => {
	document.removeEventListener('astro:page-load', loadGiscus);

	if (scriptElement) {
		scriptElement.remove();
		scriptElement = null;
	}
});
</script>

<template>
	<div class="my-12">
		<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
			<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85.004 1.7.115 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.016 10.016 0 0022 12c0-5.52-4.48-10-10-10z"/>
			</svg>
			评论
		</h3>

		<div
			ref="commentsRef"
			class="giscus-container rounded-xl overflow-hidden"
			aria-label="评论区"
		></div>
	</div>
</template>

<style scoped>
.giscus-container {
	background: rgba(255, 255, 255, 0.5);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .giscus-container {
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
