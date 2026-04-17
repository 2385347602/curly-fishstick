import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// ==================== 网站基础配置 ====================
export const siteConfig: SiteConfig = {
	// 网站标题,显示在浏览器标签页和页面顶部
	title: "皇朝洋的博客",

	// 网站副标题,显示在标题下方
	subtitle: "记录生活与技术",

	// 网站语言代码,可选值: 'en'(英语), 'zh_CN'(简体中文), 'zh_TW'(繁体中文), 'ja'(日语), 'ko'(韩语), 'es'(西班牙语), 'th'(泰语), 'vi'(越南语), 'id'(印尼语)等
	lang: "zh_CN",

	// 主题颜色配置
	themeColor: {
		// 主题色相值,范围 0-360,决定网站的主色调
		// 常见颜色参考: 红色=0, 青色=200, 蓝色=250, 粉色=345, 绿色=120, 橙色=30
		// 优化为现代青蓝色系 (200 = 清新青色)
		hue: 200,

		// 是否固定主题色,不让访客自定义
		// false = 允许访客通过界面切换主题色
		// true = 隐藏主题色选择器,使用固定颜色
		fixed: false,
	},

	// Banner(横幅图片)配置
	banner: {
		// 是否启用 Banner 图片
		enable: false,

		// Banner 图片路径
		// 相对于 /src 目录,如果以 '/' 开头则相对于 /public 目录
		src: "assets/images/demo-banner.png",

		// Banner 图片位置,支持: 'top'(顶部), 'center'(居中), 'bottom'(底部)
		position: "center",

		// Banner 图片来源署名配置
		credit: {
			// 是否显示图片来源署名文字
			enable: false,

			// 署名文字内容,例如摄影师名字
			text: "",

			// (可选) 指向原始作品或艺术家页面的链接
			url: "",
		},
	},

	// 文章目录(Table of Contents)配置
	toc: {
		// 是否在文章右侧显示目录
		enable: true,

		// 目录中显示的最大标题层级,范围 1-3
		// 1 = 只显示 H1 标题
		// 2 = 显示 H1 和 H2 标题
		// 3 = 显示 H1、H2 和 H3 标题
		depth: 2,
	},

	// 网站图标(Favicon)配置
	favicon: [
		// 留空数组则使用默认图标
		// 如果需要自定义,可以取消下面注释并修改:
		// {
		//   src: '/favicon/icon.png',    // 图标路径,相对于 /public 目录
		//   theme: 'light',              // (可选) 'light' 或 'dark',用于区分亮色/暗色模式的图标
		//   sizes: '32x32',              // (可选) 图标尺寸,如果有多个尺寸的图标需要分别配置
		// }
	],
};

// ==================== 导航栏配置 ====================
export const navBarConfig: NavBarConfig = {
	// 导航栏链接列表
	links: [
		// 使用预设链接:首页
		LinkPreset.Home,

		// 使用预设链接:归档页面
		LinkPreset.Archive,

		// 使用预设链接:关于页面
		LinkPreset.About,

		// 自定义链接示例:GitHub
		{
			// 链接显示名称
			name: "GitHub",

			// 链接地址
			// 外部链接需要完整 URL
			// 内部链接不需要包含 base path,系统会自动添加
			url: "https://github.com/saicaca/fuwari",

			// 是否为外部链接
			// true = 显示外链图标,点击后在新标签页打开
			// false = 站内链接,当前页面跳转
			external: true,
		},
	],
};

// ==================== 个人资料配置 ====================
export const profileConfig: ProfileConfig = {
	// 头像图片路径
	// 相对于 /src 目录,如果以 '/' 开头则相对于 /public 目录
	avatar: "assets/images/demo-avatar.png",

	// 个人/博客名称,显示在侧边栏
	name: "皇朝洋",

	// 个人简介/Bio,显示在名称下方
	bio: "热爱技术与生活的全栈开发者",

	// 社交媒体链接列表
	links: [
		{
			// 平台名称
			name: "Twitter",

			// 图标标识,从 https://icones.js.org/ 网站查找图标代码
			// 格式: "图标集名称:图标名"
			// 注意: 需要先安装对应的图标集包
			// 安装命令: pnpm add @iconify-json/<图标集名称>
			icon: "fa6-brands:twitter",

			// 链接地址
			url: "https://twitter.com",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/saicaca/fuwari",
		},
	],
};

// ==================== 许可证配置 ====================
export const licenseConfig: LicenseConfig = {
	// 是否启用许可证声明
	enable: true,

	// 许可证名称,例如: CC BY-NC-SA 4.0, MIT, Apache 2.0 等
	name: "CC BY-NC-SA 4.0",

	// 许可证详情页面链接
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// ==================== 代码块样式配置 ====================
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 代码高亮主题配置
	// 注意: 部分样式(如背景色)在 astro.config.mjs 文件中被覆盖

	// 重要: 请选择深色主题,因为本博客主题目前仅支持深色背景的代码块
	// 可选主题: github-dark, dracula, nord, one-dark-pro 等
	theme: "github-dark",
};
