<script setup>
defineOptions({ name: 'AuthUser' })

const route = useRoute()
const router = useRouter()
const roleId = computed(() => route.params.roleId)

function handleClose() {
  router.push('/system/role')
}
</script>

<template>
  <div class="auth-user-page">
    <a-page-header
      title="分配用户"
      :sub-title="`角色 ID: ${roleId}`"
      @back="handleClose"
    />
    <a-empty description="分配用户功能待接入" />
  </div>
</template>
