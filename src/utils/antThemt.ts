import { theme } from 'ant-design-vue'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { shallowRef } from 'vue'

export function buildAntTheme(isDark: boolean): ThemeConfig {
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#000000',
      colorPrimaryBg: isDark ? '#232323' : '#f6f8fa',
      controlItemBgActive: isDark ? '#232323' : '#f6f8fa',
      controlItemBgActiveHover: isDark ? '#232323' : '#f6f8fa',
    },
    components: {
      Checkbox: {
        colorPrimary: isDark ? '#c3bdf5' : '#1a1a1a',
        colorPrimaryActive: isDark ? '#c3bdf5' : '#1a1a1a',
        colorPrimaryHover: isDark ? '#c3bdf5' : '#1a1a1a',
      },
      Button: {
        colorBgTextHover: '#fff',
      },
    },
    hashed: false,
  }
}

export const antThemeConfig = shallowRef(buildAntTheme(false))

export function syncAntTheme(isDark: boolean) {
  antThemeConfig.value = buildAntTheme(isDark)
}
