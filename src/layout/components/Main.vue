<script setup>
import useTagsViewStore from '@/store/modules/tagsView'

defineOptions({ name: 'LayoutMain' })

const tagsViewStore = useTagsViewStore()
const route = useRoute()

watch(
  route,
  (to) => {
    if (to.name && to.meta?.title) {
      tagsViewStore.addView(to)
    }
  },
  { immediate: true }
)
</script>

<template>
  <a-layout-content class="layout-main">
    <router-view v-slot="{ Component, route: currentRoute }">
      <keep-alive :include="tagsViewStore.cachedViews">
        <component
          v-if="!currentRoute.meta?.link"
          :is="Component"
          :key="currentRoute.path"
        />
      </keep-alive>
    </router-view>
  </a-layout-content>
</template>

<style scoped lang="scss">
.layout-main {
  margin: 0;
  padding: 16px;
  background: var(--body-background, #f5f7fa);
  height: calc(100vh - 56px);
  overflow: auto;
}
</style>
