import { defineStore } from 'pinia'
import { STORE_CONFIG } from '@/store/constant/cacheKey.js'
import { syncLayoutCssVars } from '@/utils/layoutTheme.js'

const layoutInitValue = {
  /* 全局 */
  showDrawer: false,
  // 是否收缩布局(小屏设备)
  shrink: false,
  // 后台布局方式，可选值<Default|Classic|Streamline|Double>
  layoutMode: 'Default',
  // 是否暗黑模式
  isDark: false,
  // 是否已经开启移动端展示
  isMobile: false,
  // 布局形式 可选值<auto|mobile|desktop>
  layoutType: 'auto',
  /* 侧边菜单 */
  // 侧边菜单背景色
  menuBackground: ['#ffffff', '#1d1e1f'],
  // 侧边菜单文字颜色
  menuColor: ['#555555', '#b3b3b4'],
  // 侧边菜单悬停颜色
  menuHoverBackground: ['#f5f5f5', '#2d2e2f'],
  // 侧边菜单激活项背景色
  menuActiveBackground: ['#f5f5f5', '#2d2e2f'],
  // 侧边菜单激活项文字色
  menuActiveColor: ['#1e1e1e', '#e5e5e5'],
  // 侧边菜单宽度(展开时)，单位px
  menuWidth: 245,
  // 侧边菜单项默认图标
  menuDefaultIcon: 'fa fa-circle-o',
  // 是否水平折叠收起菜单
  menuCollapse: false,
  // 是否只保持一个子菜单的展开(手风琴)
  menuUniqueOpened: false,
}
export const useConfig = defineStore(
  'config',
  () => {
    const layout = reactive(layoutInitValue)
    function menuWidth() {
      if (layout.shrink) {
        return layout.menuCollapse ? '0px' : layout.menuWidth + 'px'
      }
      // 菜单是否折叠
      return layout.menuCollapse ? '64px' : layout.menuWidth + 'px'
    }

    const setLayout = (name, value) => {
      if (name === 'layoutType') {
        if (value === 'auto') {
          layout.isMobile = window.isSmallScreen
        } else {
          layout.isMobile = value === 'mobile'
        }
      }
      layout[name] = value
      syncLayoutCssVars({ layout, getColorVal })
    }
    function setLayoutMode(data) {
      layout.layoutMode = data
      syncLayoutCssVars({ layout, getColorVal })
    }
    const getColorVal = function (name) {
      const colors = layout[name]
      if (layout.isDark) {
        return colors[1]
      } else {
        return colors[0]
      }
    }
    const init = () => {
      if (layout.layoutType === 'auto') {
        layout.isMobile = window.isSmallScreen
      } else {
        layout.isMobile = layout.layoutType === 'mobile'
      }
      if (window.isSmallScreen) {
        setLayoutMode('Classic')
      }
      syncLayoutCssVars({ layout, getColorVal })
    }
    return {
      layout,
      menuWidth,
      setLayoutMode,
      setLayout,
      getColorVal,
      init,
    }
  },
  {
    persist: {
      key: STORE_CONFIG,
    },
  }
)
