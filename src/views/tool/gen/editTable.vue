<script setup>
defineOptions({ name: 'GenEdit' })

const route = useRoute()
const router = useRouter()
const tableId = computed(() => route.params.tableId)

function handleClose() {
  router.push('/tool/gen')
}
</script>

<template>
  <div class="gen-edit-page">
    <a-page-header
      title="修改生成配置"
      :sub-title="`表 ID: ${tableId}`"
      @back="handleClose"
    />
    <a-empty description="代码生成配置功能待接入" />
  </div>
</template>
