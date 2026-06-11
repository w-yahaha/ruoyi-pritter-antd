<script setup>
defineOptions({ name: 'AuthRole' })

const route = useRoute()
const router = useRouter()
const userId = computed(() => route.params.userId)

function handleClose() {
  router.push('/system/user')
}
</script>

<template>
  <div class="auth-role-page">
    <a-page-header
      title="分配角色"
      :sub-title="`用户 ID: ${userId}`"
      @back="handleClose"
    />
    <a-empty description="分配角色功能待接入" />
  </div>
</template>
