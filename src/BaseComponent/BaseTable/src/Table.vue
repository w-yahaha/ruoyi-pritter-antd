<template>
  <div class="baseTable">
    <div
      v-if="hasSlot($slots, ['handleLeft', 'handleRight', 'header'])"
      ref="headerRef"
      class="header"
    >
      <slot name="header">
        <div class="handle">
          <slot name="handleLeft" />
        </div>
        <div class="handleRight">
          <slot name="handleRight" />
        </div>
      </slot>
    </div>

    <a-table
      ref="tableRef"
      class="antTable"
      :data-source="dataList"
      :bordered="border"
      :pagination="false"
      :row-selection="rowSelection"
      :scroll="scrollConfig"
      :row-class-name="rowClassName"
      v-bind="mergedTableConfig"
      v-on="tableListener"
      @change="onTableChange"
    >
      <template v-if="showExpand" #expandedRowRender="{ record }">
        <slot name="expand" :backData="record" />
      </template>

      <a-table-column
        v-if="showIndex"
        key="__index"
        title="序号"
        :width="55"
        :align="align"
      >
        <template #default="{ index }">
          {{
            (paginationInfo.pageNum - 1) * paginationInfo.pageSize + index + 1
          }}
        </template>
      </a-table-column>

      <template v-for="item in tableItem" :key="item.prop">
        <TableColumn :item="item" :align="align" :hide-items="hideItems">
          <template
            v-for="(_value, slotName) in slots"
            #[slotName]="{ backData, currentItem }"
          >
            <slot
              :name="slotName"
              :backData="backData"
              :currentItem="currentItem"
            />
          </template>
          <template v-for="slotName in item.slotNames" #[slotName]="slotData">
            <slot
              :name="`${item.prop}` + capitalizeFirstLetter(slotName)"
              :backData="slotData"
            />
          </template>
        </TableColumn>
      </template>
    </a-table>

    <div
      v-if="pagination"
      ref="footerRef"
      class="footer lmw-pagination-footer"
      :class="{ isSmall }"
    >
      <slot name="footer">
        <a-pagination
          :current="paginationInfo.pageNum"
          :page-size="paginationInfo.pageSize"
          :total="listCount"
          :page-size-options="['20', '50', '100', '200', '300']"
          :show-total="paginationOptions.showTotal"
          :show-size-changer="paginationOptions.showSizeChanger"
          :show-quick-jumper="paginationOptions.showQuickJumper"
          :hide-on-single-page="true"
          @change="handlePageChange"
          @show-size-change="handleSizeChange"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import TableColumn from './TableColumn.vue'
import {
  capitalizeFirstLetter,
  collectExpandableKeys,
  hasSlot,
} from './utils/index.js'

const props = defineProps({
  border: {
    type: Boolean,
    default: true,
  },
  dataList: {
    type: Array,
    default: () => [],
  },
  tableItem: {
    type: Array,
    default: () => [],
  },
  tableListener: {
    type: Object,
    default: () => ({}),
  },
  showChoose: {
    type: Boolean,
    default: false,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  listCount: {
    type: Number,
    default: 0,
  },
  paginationInfo: {
    type: Object,
    default: () => ({ pageNum: 1, pageSize: 50 }),
  },
  tableConfig: {
    type: Object,
    default: () => ({}),
  },
  showExpand: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'center',
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  hideItems: {
    type: [Array, Object],
    default: () => [],
  },
  maxHeight: {
    type: Number,
  },
  selectionConfig: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:paginationInfo', 'sortChange'])
const slots = useSlots()
const headerRef = useTemplateRef('headerRef')
const tableRef = useTemplateRef('tableRef')
const footerRef = useTemplateRef('footerRef')
const expandedRowKeys = ref([])
const isSmall = window.isSmallScreen

let expandAll = false

const rowKey = computed(() => props.tableConfig.rowKey || 'id')

const mergedTableConfig = computed(() => {
  const { rowClassName, expandable, scroll, ...rest } = props.tableConfig
  return {
    rowKey: rowKey.value,
    ...rest,
    expandable: {
      ...(expandable || {}),
      expandedRowKeys: expandedRowKeys.value,
      onExpandedRowsChange: (keys) => {
        expandedRowKeys.value = keys
        expandable?.onExpandedRowsChange?.(keys)
      },
    },
  }
})

const rowSelection = computed(() => {
  if (!props.showChoose) return undefined
  return {
    ...props.selectionConfig,
  }
})

const maxHeightComputed = computed(() => {
  let headerHeight = 0
  let footerHeight = 0
  if (footerRef.value?.clientHeight) {
    footerHeight = footerRef.value.clientHeight
  }
  if (headerRef.value) {
    headerHeight = headerRef.value.clientHeight
  }
  if (props.maxHeight) {
    return props.maxHeight - headerHeight - footerHeight
  }
  return window.innerHeight - 260 - headerHeight - footerHeight
})

const scrollConfig = computed(() => {
  const y = maxHeightComputed.value > 300 ? maxHeightComputed.value : 300
  return {
    y,
    ...(props.tableConfig.scroll || {}),
  }
})

const rowClassName = computed(() => {
  const customRowClassName = props.tableConfig.rowClassName
  return (record, index) => {
    const stripeClass = index % 2 === 1 ? 'table-striped-row' : ''
    if (typeof customRowClassName === 'function') {
      return [customRowClassName(record, index), stripeClass]
        .filter(Boolean)
        .join(' ')
    }
    if (typeof customRowClassName === 'string') {
      return [customRowClassName, stripeClass].filter(Boolean).join(' ')
    }
    return stripeClass
  }
})

const paginationLayoutComputed = computed(() => {
  if (!isSmall) {
    return props.paginationLayout
  }
  return 'total, prev, pager, next'
})

const paginationOptions = computed(() => {
  const layout = paginationLayoutComputed.value
  return {
    showTotal: layout.includes('total')
      ? (total) => `共 ${total} 条`
      : undefined,
    showSizeChanger: layout.includes('sizes'),
    showQuickJumper: layout.includes('jumper'),
  }
})

const scrollToTop = () => {
  const tableEl = tableRef.value?.$el || tableRef.value
  const body = tableEl?.querySelector?.('.ant-table-body')
  body?.scrollTo?.(0, 0)
}

const handlePageChange = (pageNum, pageSize) => {
  scrollToTop()
  emit('update:paginationInfo', {
    ...props.paginationInfo,
    pageNum,
    pageSize,
  })
}

const handleSizeChange = (_, pageSize) => {
  scrollToTop()
  emit('update:paginationInfo', {
    ...props.paginationInfo,
    pageSize,
  })
}

const onTableChange = (_pagination, _filters, sorter) => {
  scrollToTop()
  if (sorter && (sorter.order || Array.isArray(sorter))) {
    emit('sortChange', sorter)
  }
}

const unFoldAll = (...arg) => {
  if (arg.length) {
    expandAll = arg[0]
  } else {
    expandAll = !expandAll
  }
  expandedRowKeys.value = expandAll
    ? collectExpandableKeys(props.dataList, rowKey.value)
    : []
}

defineExpose({
  tableRef,
  unFoldAll,
})
</script>

<style scoped lang="scss">
.header {
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
  background-color: var(--ba-bg-color-overlay);
  border: 1px solid var(--ba-border-color);
  border-bottom: none;
  font-size: 14px;
  padding: 0 12px;

  .table-header-operate-text {
    margin-left: 6px;
  }
}

.footer {
  background-color: var(--ba-bg-color-overlay);

  :deep(.ant-pagination) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-end;
    box-sizing: border-box;
    padding: 13px 15px;
  }
}

.isSmall {
  :deep(.ant-pagination) {
    padding: 10px;
  }
}

.baseTable {
  :deep(.table-striped-row > td) {
    background: #fafafa;
  }

  :deep(.ant-table-wrapper) {
    width: 100%;
  }
}
</style>
