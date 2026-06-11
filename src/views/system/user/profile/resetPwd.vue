<script setup>
import { message } from 'ant-design-vue'

defineOptions({ name: 'ResetPwd' })

const formRef = ref()
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateConfirm = async (_rule, value) => {
  if (value !== form.newPassword) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

const rules = {
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
}

async function submit() {
  try {
    await formRef.value?.validate()
    // 修改密码接口待接入
    message.success('密码修改成功（接口待接入）')
  } catch {
    // 校验失败
  }
}

function close() {
  history.back()
}
</script>

<template>
  <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }">
    <a-form-item label="旧密码" name="oldPassword">
      <a-input-password v-model:value="form.oldPassword" placeholder="请输入旧密码" />
    </a-form-item>
    <a-form-item label="新密码" name="newPassword">
      <a-input-password v-model:value="form.newPassword" placeholder="请输入新密码" />
    </a-form-item>
    <a-form-item label="确认密码" name="confirmPassword">
      <a-input-password v-model:value="form.confirmPassword" placeholder="请确认新密码" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 4 }">
      <a-space>
        <a-button type="primary" @click="submit">保存</a-button>
        <a-button @click="close">关闭</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
