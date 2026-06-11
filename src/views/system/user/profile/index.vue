<script setup>
import userAvatar from './userAvatar.vue'
import userInfo from './userInfo.vue'
import resetPwd from './resetPwd.vue'

defineOptions({ name: 'Profile' })

const activeTab = ref('userinfo')
const state = reactive({
  user: {},
  roleGroup: '',
  postGroup: '',
})

function getUser() {
  // 用户信息接口待接入
  state.user = {
    userName: 'admin',
    phonenumber: '15888888888',
    email: 'admin@ruoyi.vip',
    createTime: '2024-01-01 00:00:00',
    dept: { deptName: '研发部门' },
  }
  state.roleGroup = '超级管理员'
  state.postGroup = '董事长'
}

getUser()
</script>

<template>
  <div class="profile-page">
    <a-row :gutter="16">
      <a-col :xs="24" :sm="24" :md="8" :lg="6">
        <a-card title="个人信息">
          <div class="profile-avatar-wrap">
            <userAvatar :user="state.user" />
          </div>
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="用户名称">
              {{ state.user.userName }}
            </a-descriptions-item>
            <a-descriptions-item label="手机号码">
              {{ state.user.phonenumber }}
            </a-descriptions-item>
            <a-descriptions-item label="用户邮箱">
              {{ state.user.email }}
            </a-descriptions-item>
            <a-descriptions-item label="所属部门">
              <template v-if="state.user.dept">
                {{ state.user.dept.deptName }} / {{ state.postGroup }}
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="所属角色">
              {{ state.roleGroup }}
            </a-descriptions-item>
            <a-descriptions-item label="创建日期">
              {{ state.user.createTime }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="16" :lg="18">
        <a-card title="基本资料">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="userinfo" tab="基本资料">
              <userInfo :user="state.user" />
            </a-tab-pane>
            <a-tab-pane key="resetPwd" tab="修改密码">
              <resetPwd />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  .profile-avatar-wrap {
    margin-bottom: 16px;
  }
}
</style>
