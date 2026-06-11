<script setup>
defineOptions({ name: 'Index' })

const appTitle = import.meta.env.VITE_APP_TITLE || '若依管理系统'

const techStacks = [
  { name: 'Vue 3', url: 'https://cn.vuejs.org/' },
  { name: 'Vite', url: 'https://cn.vitejs.dev/' },
  { name: 'Ant Design Vue', url: 'https://antdv.com/' },
  { name: 'Pinia', url: 'https://pinia.vuejs.org/zh/' },
  { name: 'Vue Router', url: 'https://router.vuejs.org/zh/' },
]

const dependencies = [
  { name: 'vue', description: '渐进式 JavaScript 框架' },
  { name: 'ant-design-vue', description: 'Ant Design 的 Vue 实现' },
  { name: 'vue-router', description: 'Vue.js 官方路由' },
  { name: 'pinia', description: 'Vue 状态管理库' },
  { name: 'axios', description: 'HTTP 请求库' },
]
</script>

<template>
  <div class="home">
    <a-card title="关于" class="home-card">
      <p>
        欢迎使用 {{ appTitle }}。本项目基于若依前后端分离版本，使用 Ant Design Vue
        重构前端界面。
      </p>
    </a-card>

    <a-card title="技术栈" class="home-card">
      <a-space wrap>
        <a
          v-for="item in techStacks"
          :key="item.name"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <a-tag color="blue">{{ item.name }}</a-tag>
        </a>
      </a-space>
    </a-card>

    <a-card title="npm 依赖" class="home-card">
      <a-descriptions bordered :column="2" size="small">
        <a-descriptions-item
          v-for="item in dependencies"
          :key="item.name"
          :label="item.name"
        >
          <a-tag>{{ item.description }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
.home {
  .home-card {
    margin-bottom: 16px;
  }
}
</style>
