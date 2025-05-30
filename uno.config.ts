import { defineConfig } from '@unocss/vite';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import presetWind3 from '@unocss/preset-wind3';
import type { Theme } from '@unocss/preset-uno';
import { presetSoybeanAdmin } from '@sa/uno-preset';
import { themeVars } from './src/theme/vars';

// TODO: 12 通过 Theme Tokens 注入到 UnoCSS 的主题配置中, 借助于 UnoCSS 的能力，可以使用类似 text-primary bg-primary 等 class 名称进而统一了组件库和 UnoCSS 的主题颜色的应用。
export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  theme: {
    ...themeVars,
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      icon: '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem'
    }
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm'
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // TODO: 13 通过 UnoCSS 提供的预设暗黑模式方案, 只要在 html 上添加 class="dark"，则项目中类似于 dark:text-#000 dark:bg-#333 的 class 就会生效，从而达到暗黑模式的效果
  presets: [presetWind3({ dark: 'class' }), presetSoybeanAdmin()]
});
