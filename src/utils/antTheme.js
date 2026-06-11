import { theme } from 'ant-design-vue'
import { shallowRef } from 'vue'

export function buildAntTheme(isDark) {
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    cssVar: {
      key: 'ant',
    },
    token: {
      colorPrimary: '#141414',
    },
    hashed: false,
  }
}

export const antThemeConfig = shallowRef(buildAntTheme(false))

export function syncAntTheme(isDark) {
  antThemeConfig.value = buildAntTheme(isDark)
}
