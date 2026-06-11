<script setup>
import BaseForm from '@/BaseComponent/BaseForm'
import businessStore from '@/store/business/businessStore'
import to from '@/utils/to'
import { getElementTotalSize, getDialogMaxHeight } from '@/utils/utils'

const props = defineProps({
  infoInit: {
    type: Object,
    default: () => ({}),
  },
  otherInfo: {
    type: Object,
    default: () => ({}),
  },
  pageName: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: '600px',
  },
  top: {
    type: String,
    default: '7vh',
  },
  dialogConfig: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    default: () => ({}),
  },
  idKey: {
    type: String,
    default: '',
  },
  sendIdKey: {
    type: String,
    default: '',
  },
  isEditMore: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: [String, Number],
    default: '',
  },
  search: {
    type: Function,
    default: null,
  },
  requestBaseUrl: {
    type: String,
    default: '/',
  },
  beforeSaveFun: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['closed', 'editNext', 'beforeSave'])
const slots = useSlots()
const dialogVisible = ref(false)
const formData = ref({})
const title = ref('')
const formRef = useTemplateRef('formRef')
const store = businessStore()
const loading = ref(false)
const tableSelected = ref([])

const dialogClass = computed(() => {
  const totalPageName = props.pageName.replaceAll('/', '\\/')
  return `${totalPageName}Dialog`
})

const isEdit = computed(() => {
  return Object.keys(props.infoInit).length !== 0
})

watch(
  () => props.infoInit,
  () => {
    if (isEdit.value) {
      for (const item of props.dialogConfig?.formItems ?? []) {
        formData.value[item.field] = props.infoInit[item.field]
      }
    } else {
      for (const item of props.dialogConfig?.formItems ?? []) {
        formData.value[item.field] = props.defaultData[item.field]
      }
    }
  }
)

const send = () => {
  return new Promise(async (resolve) => {
    emit('beforeSave')
    if (props.beforeSaveFun) {
      await props.beforeSaveFun()
    }
    if (isEdit.value) {
      nextTick(() => {
        resolve(
          store.editDataAction({
            pageName: props.pageName,
            editInfo: {
              ...props.otherInfo,
              ...formData.value,
            },
            id:
              props.infoInit[props.idKey] ??
              props.infoInit[props.pageName + 'Id'] ??
              props.infoInit.id,
            sendIdKey: props.sendIdKey,
            requestBaseUrl: props.requestBaseUrl,
          })
        )
      })
    } else {
      nextTick(() => {
        resolve(
          store.createDataAction({
            pageName: props.pageName,
            newData: {
              ...props.otherInfo,
              ...formData.value,
            },
            requestBaseUrl: props.requestBaseUrl,
          })
        )
      })
    }
  })
}

const commitClick = async () => {
  try {
    await formRef.value?.getFormValidate()
  } catch {
    return
  }
  loading.value = true
  const [res] = await to(send())
  if (res) {
    props.search && props.search()
    if (props.isEditMore && tableSelected.value.length > 0) {
      const current = tableSelected.value.shift()
      emit('editNext', current)
    } else {
      dialogVisible.value = false
    }
  }
  loading.value = false
}

const footerPaddingRight = ref('0px')

const getFooterPaddingRight = () => {
  const dialogEl = document.querySelector(`.${dialogClass.value}`)
  if (!dialogEl) {
    return
  }
  const formItem = dialogEl.querySelector('.ant-form-item')
  const dialogBody = dialogEl.querySelector('.ant-modal-body')
  const { paddingRight: baseFromPaddingRight } = getElementTotalSize(
    formRef.value?.$el
  )
  const { paddingRight: formItemPaddingRight } = getElementTotalSize(formItem)
  const { paddingRight: dialogBodyPaddingRight } =
    getElementTotalSize(dialogBody)
  footerPaddingRight.value =
    baseFromPaddingRight +
    formItemPaddingRight +
    dialogBodyPaddingRight +
    'px'
}

const dialogClosed = () => {
  emit('closed')
}

const setFormData = (key, value) => {
  formData.value[key] = value
}

const changeSelected = (newValue) => {
  tableSelected.value = newValue
}

const isSmall = window.isSmallScreen
const dialogMaxHeight = ref()

const getMaxHeight = () => {
  if (props.maxHeight) {
    dialogMaxHeight.value = props.maxHeight
  } else {
    dialogMaxHeight.value = getDialogMaxHeight(`.${dialogClass.value}`)
  }
}

const handleOpened = () => {
  nextTick(() => {
    getMaxHeight()
    getFooterPaddingRight()
  })
}

const modalWrapClass = computed(() => {
  return ['pageDialog', dialogClass.value, isSmall ? 'page-dialog-fullscreen' : '']
    .filter(Boolean)
    .join(' ')
})

defineExpose({
  dialogVisible,
  title,
  formData,
  setFormData,
  changeSelected,
  formRef,
})
</script>

<template>
  <div class="page-dialog">
    <a-modal
      v-model:open="dialogVisible"
      class="pageDialog"
      :wrap-class-name="modalWrapClass"
      :title="title"
      :width="getWidth(width)"
      :centered="false"
      :style="isSmall ? undefined : { top }"
      :mask-closable="false"
      :destroy-on-close="true"
      @after-open-change="(open) => open && handleOpened()"
      @after-close="dialogClosed"
    >
      <div
        class="ba-table-form-scrollbar"
        :style="{ maxHeight: dialogMaxHeight ? `${dialogMaxHeight}px` : undefined, overflowY: 'auto' }"
      >
        <BaseForm
          ref="formRef"
          class="baseForm"
          :data="formData"
          v-bind="dialogConfig"
        >
          <template
            v-for="(_value, slotName) in slots"
            #[slotName]="{ backData }"
          >
            <slot :name="slotName" :back-data="backData" />
          </template>
        </BaseForm>
        <slot />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <a-button :loading="loading" @click="dialogVisible = false">
            取消
          </a-button>
          <a-button type="primary" :loading="loading" @click="commitClick">
            <span v-if="tableSelected.length > 0 && isEditMore">
              保存并编辑下一项
            </span>
            <span v-else>保存</span>
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.page-dialog {
  :deep(.ant-modal-header) {
    text-align: left;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--ba-bg-color, #f0f2f5);
  }

  :deep(.ant-modal-footer) {
    text-align: right;
    padding-right: v-bind(footerPaddingRight) !important;
  }

  :deep(.ant-form-item) {
    margin: 0 0 18px;
  }

  .baseForm {
    padding: 0 15px;
  }

  :deep(.pageDialog) {
    .ant-radio-group {
      width: 100%;

      .ant-radio-wrapper {
        margin-right: 16px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media screen and (max-width: 768px) {
  :deep(.pageDialog) {
    .baseForm {
      padding: 0 6px;
    }

    .ant-radio-group {
      .ant-radio-wrapper {
        margin-right: 12px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.page-dialog-fullscreen {
  .ant-modal {
    max-width: 100vw;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    min-height: 100vh;
    border-radius: 0;
  }
}
</style>
