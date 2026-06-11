<script setup>
defineOptions({ name: 'JobLog' })

const route = useRoute()
const router = useRouter()
const jobId = computed(() => route.params.jobId)

function handleClose() {
  router.push('/monitor/job')
}
</script>

<template>
  <div class="job-log-page">
    <a-page-header
      title="调度日志"
      :sub-title="`任务 ID: ${jobId}`"
      @back="handleClose"
    />
    <a-empty description="调度日志功能待接入" />
  </div>
</template>
