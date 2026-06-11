<script setup>
import hasPermi from '@/utils/hasPermi'
import ColumnDisplayPanel from './ColumnDisplayPanel.vue'

const props = defineProps({
  headerButtons: {
    type: Array,
    default: () => [],
  },
  permission: {
    type: Object,
    default: () => ({}),
  },
  tableSelected: {
    type: Array,
    default: () => [],
  },
  showPageSearch: Boolean,
  columnDisplayKey: {
    type: Number,
    default: 0,
  },
  hasLeftSlot: Boolean,
  hasRightSlot: Boolean,
})

const columnDisplayOpen = defineModel('columnDisplayOpen', { type: Boolean })
const columnDisplayList = defineModel('columnDisplayList', { type: Array })
const columnChecked = defineModel('columnChecked', { type: Array })

const emit = defineEmits([
  'refresh',
  'add',
  'edit-more',
  'delete',
  'toggle-search',
  'change-column',
  'drag-update',
  'reset-sort',
])

const hasSelection = computed(() => props.tableSelected.length > 0)

const showLeft = computed(
  () => props.hasLeftSlot || props.headerButtons.length > 0
)

const showRight = computed(
  () => props.hasRightSlot || props.headerButtons.length > 0
)

const showToolbar = computed(
  () =>
    props.headerButtons.includes('columnDisplay') ||
    props.headerButtons.includes('comSearch')
)

const includes = (name) => props.headerButtons.includes(name)
</script>

<template>
  <div class="header-scroll">
    <div class="table-header">
      <div v-if="showLeft">
        <div class="flex">
          <a-button v-if="includes('refresh')" @click="emit('refresh')">
            <SvgIcon icon-class="sync-alt" :size="13" />
          </a-button>

          <a-button
            v-if="includes('add') && hasPermi(permission.add)"
            type="primary"
            class="order5"
            @click="emit('add')"
          >
            <SvgIcon :size="14" icon-class="plus" />
            <span class="ml6">添加</span>
          </a-button>

          <a-button
            v-if="includes('edit') && hasPermi(permission.edit)"
            type="primary"
            class="order10"
            :disabled="!hasSelection"
            @click="emit('edit-more')"
          >
            <SvgIcon :size="14" icon-class="pencil" />
            <span class="ml6">编辑</span>
          </a-button>

          <a-popconfirm
            v-if="includes('delete') && hasPermi(permission.del)"
            title="确定删除选中记录？"
            ok-text="确认"
            class="order15"
            cancel-text="取消"
            :disabled="!hasSelection"
            @confirm="emit('delete', tableSelected)"
          >
            <a-button danger type="primary" :disabled="!hasSelection">
              <SvgIcon :size="14" icon-class="trash" />
              <span class="ml6">删除</span>
            </a-button>
          </a-popconfirm>

          <slot name="handleLeft" />
        </div>
      </div>

      <div v-if="showRight">
        <div v-if="showToolbar" class="table-search-button-group">
          <ColumnDisplayPanel
            v-if="includes('columnDisplay')"
            v-model:open="columnDisplayOpen"
            v-model:list="columnDisplayList"
            v-model:checked="columnChecked"
            :list-key="columnDisplayKey"
            @change-column="
              (checked, prop) => emit('change-column', checked, prop, true)
            "
            @drag-update="emit('drag-update')"
            @reset-sort="emit('reset-sort')"
          />

          <a-tooltip
            v-if="includes('comSearch')"
            :title="showPageSearch ? '关闭搜索' : '展开搜索'"
            placement="top"
          >
            <a-button
              class="table-search-button-item"
              @click="emit('toggle-search')"
            >
              <SvgIcon size="14" icon-class="ant-icon-SearchOutlined" />
            </a-button>
          </a-tooltip>
        </div>

        <slot name="handleRight" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-scroll {
  width: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
  font-size: 14px;
  padding: 13px 0;
}

.table-search-button-group {
  display: flex;
  margin-left: 12px;
  border: 1px solid var(--ba-border-color, #d9d9d9);
  border-radius: 6px;
  overflow: hidden;

  button:focus,
  button:active {
    color: #000;
    background-color: var(--ba-bg-color-overlay, #fff);
  }

  button:hover {
    color: #000;
    background-color: rgba(0, 0, 0, 0.04);
  }

  :deep(.table-search-button-item) {
    height: 30px;
    border: none;
    border-radius: 0;
  }

  .ant-btn + .ant-btn {
    margin: 0;
  }

  :deep(.ant-btn:focus-visible) {
    outline: none;
    outline-offset: 0;
  }
}

.ml6 {
  margin-left: 6px;
}

.flex {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
