<script setup>
defineOptions({ name: 'UserAvatar' })

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
})

const avatarUrl = computed(() => props.user.avatar || '')
</script>

<template>
  <div class="user-avatar">
    <a-avatar :size="100" :src="avatarUrl">
      {{ (props.user.userName || 'U').charAt(0).toUpperCase() }}
    </a-avatar>
    <p class="user-avatar-tip">点击上传头像（待接入）</p>
  </div>
</template>

<style scoped lang="scss">
.user-avatar {
  text-align: center;
  padding: 16px 0;

  .user-avatar-tip {
    margin-top: 12px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
