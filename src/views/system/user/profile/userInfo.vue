<script setup>
import { message } from 'ant-design-vue'

defineOptions({ name: 'UserInfo' })

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
})

const formRef = ref()
const form = reactive({
  nickName: '',
  phonenumber: '',
  email: '',
  sex: '0',
})

const rules = {
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  phonenumber: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
}

watch(
  () => props.user,
  (val) => {
    if (val) {
      form.nickName = val.nickName || ''
      form.phonenumber = val.phonenumber || ''
      form.email = val.email || ''
      form.sex = val.sex ?? '0'
    }
  },
  { immediate: true, deep: true }
)

async function submit() {
  try {
    await formRef.value?.validate()
    // 更新接口待接入
    message.success('保存成功（接口待接入）')
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
    <a-form-item label="用户昵称" name="nickName">
      <a-input v-model:value="form.nickName" :maxlength="30" />
    </a-form-item>
    <a-form-item label="手机号码" name="phonenumber">
      <a-input v-model:value="form.phonenumber" :maxlength="11" />
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="form.email" :maxlength="50" />
    </a-form-item>
    <a-form-item label="性别" name="sex">
      <a-radio-group v-model:value="form.sex">
        <a-radio value="0">男</a-radio>
        <a-radio value="1">女</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 4 }">
      <a-space>
        <a-button type="primary" @click="submit">保存</a-button>
        <a-button @click="close">关闭</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
