<script setup>
import { useEventListener } from '@vueuse/core'
import { ReloadOutlined } from '@ant-design/icons-vue'
import {
  getElementPlusIconfontNames,
  getLocalIconfontNames,
} from '@/utils/iconfont'

const props = defineProps({
  size: {
    type: String,
    default: 'middle',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'local',
  },
  placement: {
    type: String,
    default: 'bottomLeft',
  },
  modelValue: {
    type: String,
    default: '',
  },
  showIconName: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectorInputRef = useTemplateRef('selectorInputRef')
const popoverOpen = ref(false)
const inputFocus = ref(false)
const iconSelectorMouseover = ref(false)
const iconType = ref(props.type)
const selectorWidth = ref(260)
const fontIconNames = ref([])
const inputValue = ref('')
const prependIcon = ref(props.modelValue)
const defaultModelValue = ref(props.modelValue || 'list')
const iconKey = ref(0)

const renderFontIconNames = computed(() => {
  if (!inputValue.value) return fontIconNames.value
  const keyword = inputValue.value.trim().toLowerCase()
  return fontIconNames.value.filter((icon) => icon.toLowerCase().includes(keyword))
})

const syncPopover = () => {
  popoverOpen.value = inputFocus.value || iconSelectorMouseover.value
}

const onInputFocus = () => {
  inputFocus.value = true
  syncPopover()
}

const onInputBlur = () => {
  inputFocus.value = false
  setTimeout(() => {
    if (!iconSelectorMouseover.value) {
      popoverOpen.value = false
    }
  }, 150)
}

const onInputRefresh = () => {
  iconKey.value++
  prependIcon.value = defaultModelValue.value
  inputValue.value = ''
  emit('update:modelValue', defaultModelValue.value)
  emit('change', defaultModelValue.value)
}

const loadIcons = (name) => {
  iconType.value = name
  fontIconNames.value = []
  if (name === 'ele') {
    getElementPlusIconfontNames().then((res) => {
      fontIconNames.value = res
    })
  } else if (name === 'local') {
    getLocalIconfontNames().then((res) => {
      fontIconNames.value = res
    })
  }
}

const onChangeTab = (name) => {
  loadIcons(name)
}

const onIcon = (icon) => {
  iconSelectorMouseover.value = false
  popoverOpen.value = false
  iconKey.value++
  prependIcon.value = icon
  inputValue.value = ''
  emit('update:modelValue', icon)
  emit('change', icon)
  nextTick(() => {
    selectorInputRef.value?.blur()
  })
}

const getInputWidth = () => {
  nextTick(() => {
    const width = selectorInputRef.value?.$el?.offsetWidth || 260
    selectorWidth.value = width < 260 ? 260 : width
  })
}

watch(
  () => props.modelValue,
  (value) => {
    iconKey.value++
    if (value !== prependIcon.value) {
      defaultModelValue.value = value
    }
    if (value === '') {
      defaultModelValue.value = 'fa fa-circle-o'
    }
    prependIcon.value = value
  }
)

onMounted(() => {
  getInputWidth()
  useEventListener(window, 'resize', getInputWidth)
  useEventListener(document, 'click', () => {
    if (!inputFocus.value && !iconSelectorMouseover.value) {
      popoverOpen.value = false
    }
  })
  loadIcons(props.type)
})
</script>

<template>
  <a-popover
    v-model:open="popoverOpen"
    trigger="focus"
    :placement="placement"
    :overlay-style="{ width: `${selectorWidth}px` }"
  >
    <template #content>
      <div
        class="icon-selector-panel"
        @mouseenter="iconSelectorMouseover = true"
        @mouseleave="iconSelectorMouseover = false"
      >
        <div class="selector-header">
          <div class="selector-title">{{ title || '请选择图标' }}</div>
          <div class="selector-tab">
            <span :class="{ active: iconType === 'ele' }" @click="onChangeTab('ele')">
              ele
            </span>
            <span :class="{ active: iconType === 'local' }" @click="onChangeTab('local')">
              local
            </span>
          </div>
        </div>
        <div class="selector-body">
          <div v-if="renderFontIconNames.length > 0" class="icon-list">
            <div
              v-for="item in renderFontIconNames"
              :key="item"
              class="icon-selector-item"
              :title="item"
              @click="onIcon(item)"
            >
              <SvgIcon :key="'icon' + iconKey + item" :icon-class="item" />
            </div>
          </div>
          <a-empty v-else description="暂无图标" />
        </div>
      </div>
    </template>

    <a-input
      ref="selectorInputRef"
      v-model:value="inputValue"
      :size="size"
      :disabled="disabled"
      placeholder="搜索图标"
      @focus="onInputFocus"
      @blur="onInputBlur"
    >
      <template #addonBefore>
        <div class="icon-prepend">
          <SvgIcon
            :key="'icon' + iconKey"
            :icon-class="prependIcon || defaultModelValue"
          />
          <div v-if="showIconName" class="name">
            {{ prependIcon || defaultModelValue }}
          </div>
        </div>
      </template>
      <template #addonAfter>
        <ReloadOutlined class="refresh-icon" @click.stop="onInputRefresh" />
      </template>
    </a-input>
  </a-popover>
</template>

<style scoped lang="scss">
.icon-prepend {
  display: flex;
  align-items: center;
  justify-content: center;

  .name {
    padding-left: 5px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.refresh-icon {
  cursor: pointer;
}

.selector-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.selector-title {
  font-weight: 500;
}

.selector-tab {
  margin-left: auto;

  span {
    padding: 0 5px;
    cursor: pointer;
    user-select: none;

    &.active,
    &:hover {
      color: #1677ff;
      text-decoration: underline;
    }
  }
}

.selector-body {
  height: 250px;
  overflow-y: auto;
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
}

.icon-selector-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 3px;
  border: 1px solid var(--ba-border-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    border-color: #1677ff;
  }
}
</style>
