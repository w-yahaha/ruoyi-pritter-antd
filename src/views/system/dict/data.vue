<script setup>
defineOptions({ name: 'DictData' })

const route = useRoute()
const router = useRouter()
const dictId = computed(() => route.params.dictId)

function handleClose() {
  router.push('/system/dict')
}
</script>

<template>
  <div class="dict-data-page">
    <a-page-header
      title="字典数据"
      :sub-title="`字典 ID: ${dictId}`"
      @back="handleClose"
    />
    <a-empty description="字典数据功能待接入" />
  </div>
</template>
