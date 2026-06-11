<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import { useConfig } from '@/store/modules/layout'
import { antThemeConfig } from '@/utils/antTheme'
import { syncLayoutCssVars } from '@/utils/layoutTheme'
import { initDark } from '@/utils/useDark'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const layoutStore = useConfig()

initDark()

onMounted(() => {
  syncLayoutCssVars(layoutStore)
})

watch(
  () => [
    layoutStore.layout.menuBackground,
    layoutStore.layout.menuColor,
    layoutStore.layout.menuHoverBackground,
    layoutStore.layout.menuActiveBackground,
    layoutStore.layout.menuActiveColor,
  ],
  () => syncLayoutCssVars(layoutStore),
  { deep: true }
)
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="antThemeConfig">
    <router-view></router-view>
  </a-config-provider>
</template>
