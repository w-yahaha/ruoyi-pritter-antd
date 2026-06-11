<script setup>
import { useConfig } from '@/store/modules/layout'
import { BEFORE_RESIZE_LAYOUT } from '@/store/constant/cacheKey'
import Local from '@/utils/useStorage'
import GlobalSearch from '../components/GlobalSearch/GlobalSearch.vue'
import NavMenus from './NavMenus.vue'
import NavTabs from './Tabs.vue'

defineOptions({ name: 'DefaultNavBar' })

const config = useConfig()
const showRightPanel = defineModel('showRightPanel', {
  type: Boolean,
  default: false,
})

const onMenuCollapse = () => {
  config.setLayout('menuCollapse', !config.layout.menuCollapse)
  Local.set(BEFORE_RESIZE_LAYOUT, {
    layoutMode: config.layout.layoutMode,
    menuCollapse: config.layout.menuCollapse,
  })
}
</script>

<template>
  <div class="nav-bar">
    <div class="nav-bar-left">
      <button type="button" class="nav-icon-btn" @click="onMenuCollapse">
        <SvgIcon
          :icon-class="
            config.layout.menuCollapse
              ? 'ant-icon-MenuUnfoldOutlined'
              : 'ant-icon-MenuFoldOutlined'
          "
          :size="16"
        />
      </button>
      <NavTabs class="nav-bar-tabs" />
    </div>

    <div class="nav-bar-right">
      <GlobalSearch />
      <NavMenus v-model:show-right-panel="showRightPanel" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 56px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-bar-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.nav-bar-tabs {
  flex: 1;
  min-width: 0;
}

.nav-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.88);
  }
}

.dark .nav-bar {
  background: #1d1e1f;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.dark .nav-icon-btn {
  color: rgba(255, 255, 255, 0.45);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.88);
  }
}
</style>
