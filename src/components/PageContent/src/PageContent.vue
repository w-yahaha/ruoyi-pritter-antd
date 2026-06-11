<script setup>
import BaseTable from '@/BaseComponent/BaseTable/index'
import emitter from '@/utils/bus'
import businessStore, { interceptor } from '@/store/business/businessStore'
import { getInfo } from '@/api/business/main/index'
import to from '@/utils/to'
import DictCpn from './dictCpn.vue'
import useStorage from '@/utils/useStorage'
import { VueDraggable } from 'vue-draggable-plus'
import hasPermi from '@/utils/hasPermi'
import modal from '@/plugins/modal'
import tab from '@/plugins/tab'

function debounce(fn, wait) {
  let timer
  const debounced = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

const props = defineProps({
  contentConfig: {
    type: Object,
    required: true,
  },
  pageName: {
    type: String,
    required: true,
  },
  tableListener: {
    type: Object,
    default: () => ({}),
  },
  firstSendOption: {
    type: Object,
    default: () => ({}),
  },
  autoSend: {
    type: Boolean,
    default: true,
  },
  autoDesc: {
    type: Boolean,
    default: true,
  },
  descConfig: {
    type: Object,
    default: () => ({
      orderByColumn: 'createTime',
      isAsc: 'desc',
    }),
  },
  otherRequestOption: {
    type: Object,
    default: () => ({}),
  },
  piniaConfig: {
    type: Object,
    default: () => ({
      listConfig: {
        listKey: 'rows',
        countKey: 'total',
      },
      handleList: (list) => list,
    }),
  },
  idKey: {
    type: String,
    default: '',
  },
  requestBaseUrl: {
    type: String,
    default: '/',
  },
  requestUrl: {
    type: String,
    default: 'list',
  },
  showEdit: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  dictMap: {
    type: Object,
    default: () => ({}),
  },
  headerButtons: {
    type: Array,
    default: () => [
      'refresh',
      'add',
      'edit',
      'delete',
      'columnDisplay',
      'comSearch',
    ],
  },
  tableSelected: {
    type: Array,
    default: () => [],
  },
  permission: {
    type: Object,
    default: () => ({}),
  },
  handleEditShow: {
    type: Function,
    default: () => true,
  },
  handleDeleteShow: {
    type: Function,
    default: () => true,
  },
  delUrl: {
    type: String,
    default: '',
  },
  maxHeightDecrement: {
    type: Number,
    default: 0,
  },
  tableHideItems: {
    type: Array,
    default: () => [],
  },
  cacheKey: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'addClick',
  'editBtnClick',
  'beforeSend',
  'afterSend',
  'onChangeShowColumn',
  'editMoreClick',
])

const slots = useSlots()
const store = businessStore()
const isLoading = ref(false)
const baseTableRef = useTemplateRef('baseTableRef')
const searchDatas = ref({})
const paginationInfo = ref({
  pageNum: 1,
  pageSize: props.contentConfig?.defaultPageSize || 50,
})

if (props.contentConfig?.pagination) {
  paginationInfo.value = {
    pageNum: 1,
    pageSize: props.contentConfig?.defaultPageSize || 50,
  }
}

const finalSearchData = computed(() => {
  if (props.contentConfig.pagination) {
    return { ...searchDatas.value, ...paginationInfo.value }
  }
  return { ...searchDatas.value }
})

const tableBindProps = computed(() => {
  return props.contentConfig || {}
})

watch(
  () => paginationInfo.value,
  (newValue, oldValue) => {
    if (newValue.pageSize !== oldValue.pageSize) {
      paginationInfo.value.pageNum = 1
    }
    debounceSend(finalSearchData.value)
  }
)

const send = async (searchInfo) => {
  isLoading.value = true
  emit('beforeSend', searchInfo)
  const isSuccess = await store.getList(
    {
      pageName: props.pageName,
      requestUrl: props.requestUrl,
      queryInfo: {
        ...props.otherRequestOption,
        ...searchInfo,
      },
      cacheKey: props.cacheKey,
      requestBaseUrl: props.requestBaseUrl,
    },
    props.piniaConfig.listConfig,
    props.piniaConfig.handleList
  )
  if (isSuccess) {
    emit('afterSend', store.pageListData(props.pageName, props.cacheKey))
  }
  isLoading.value = false
}

const debounceSend = debounce(send, 66)

const dataList = computed(() => {
  const list = store.pageListData(props.pageName, props.cacheKey)
  return list ? list : []
})

const listCount = computed(() => {
  return store.listCount(props.pageName, props.cacheKey) ?? 0
})

const showPageSearch = computed(() => {
  return store.pageSearchControl[`${props.pageName}${props.cacheKey}SearchShow`]
})

const deleteRow = async (delData) => {
  isLoading.value = true
  let id
  if (Array.isArray(delData)) {
    const ids = delData.map((item) => {
      if (props.idKey) {
        return item[props.idKey]
      }
      return item[props.pageName + 'Id'] ?? item.id
    })
    id = ids.toString()
  } else if (props.idKey) {
    id = delData[props.idKey]
  } else {
    id = delData[props.pageName + 'Id'] ?? delData.id
  }
  if (id || id === 0) {
    await to(
      store.deletDataAction({
        id,
        pageName: props.pageName,
        requestUrl: props.requestUrl,
        requestBaseUrl: props.requestBaseUrl,
        delUrl: props.delUrl,
      })
    )
    await to(send(finalSearchData.value))
  } else {
    modal.notifyWarning('未获取到有效Id')
  }
  isLoading.value = false
}

const editClick = async (item, type) => {
  isLoading.value = true
  let id
  if (props.idKey) {
    id = item[props.idKey]
  } else {
    id = item[props.pageName + 'Id'] ?? item.id
  }
  if (id || id === 0) {
    const url = `${props.requestBaseUrl}${interceptor(props.pageName)}/${id}`
    const [res] = await to(getInfo(url))
    if (res?.data) {
      emit('editBtnClick', res.data, type, res)
    }
  } else {
    modal.notifyWarning('未获取到有效Id')
  }
  isLoading.value = false
}

const addClick = () => {
  emit('addClick')
}

const exceptSlot = ['todo']
const collectObjectsWithSlotName = (data, collectedObjects = []) => {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      collectObjectsWithSlotName(item, collectedObjects)
    })
  } else if (typeof data === 'object' && data !== null) {
    if (
      'slotName' in data &&
      data.slotName &&
      !exceptSlot.includes(data.slotName)
    ) {
      collectedObjects.push(data)
    }
    Object.values(data).forEach((value) => {
      collectObjectsWithSlotName(value, collectedObjects)
    })
  }
  return collectedObjects
}

const otherSlot = collectObjectsWithSlotName(props.contentConfig?.tableItem)

const sortChange = (sorter) => {
  const sortItem = Array.isArray(sorter) ? sorter[0] : sorter
  const { field, order } = sortItem || {}
  let isAsc
  if (order === 'ascend') {
    isAsc = 'asc'
  } else if (order === 'descend') {
    isAsc = 'desc'
  }
  let orderObj = {
    orderByColumn: undefined,
    isAsc: undefined,
  }
  if (isAsc) {
    orderObj = {
      orderByColumn: field,
      isAsc,
    }
  } else if (props.descConfig && props.autoDesc) {
    orderObj = { ...props.descConfig }
  }
  searchDatas.value = Object.assign({ ...searchDatas.value }, { ...orderObj })
  send(finalSearchData.value)
}

const refresh = () => {
  send(finalSearchData.value)
}

const mittFunc = (searchFormData) => {
  searchDatas.value = Object.assign({}, searchDatas.value, searchFormData)
  if (
    Object.prototype.hasOwnProperty.call(searchDatas.value, 'searchLoading')
  ) {
    delete searchDatas.value.searchLoading
  }
  if (
    Object.prototype.hasOwnProperty.call(
      searchDatas.value,
      'resetPaginationInfo'
    )
  ) {
    delete searchDatas.value.resetPaginationInfo
  }
  if (searchFormData.resetPaginationInfo) {
    paginationInfo.value.pageNum = 1
  }
  send(finalSearchData.value).finally(() => {
    if (searchFormData.searchLoading) {
      searchFormData.searchLoading.value = false
    }
  })
}

const maxTableHeight = ref(500)
let currentSearchHeight = 0

const mittResize = (searchHeight) => {
  if (typeof searchHeight === 'number') {
    currentSearchHeight = searchHeight
  }
  const header = document.querySelector('.layout-header')
  let viewportHeight = window.innerHeight - currentSearchHeight - 34
  if (header) {
    viewportHeight -= header.clientHeight
  }
  maxTableHeight.value = viewportHeight - props.maxHeightDecrement
}

let isListen = false

const onListener = () => {
  if (!isListen) {
    isListen = true
    emitter.on(`search${props.pageName}Info`, mittFunc)
    emitter.on(`change${props.pageName}Size`, mittResize)
    window.addEventListener('resize', mittResize)
  }
}

const offListener = () => {
  emitter.off(`search${props.pageName}Info`)
  emitter.off(`change${props.pageName}Size`)
  window.removeEventListener('resize', mittResize)
  isListen = false
}

const columnChecked = ref([])
const filterArr = ref([])
const propsTableHideItems = computed(() => {
  let hideItems = props.contentConfig.hideItems || []
  if (isRef(hideItems)) {
    hideItems = hideItems.value
  }
  return [...new Set([...props.tableHideItems, ...hideItems])]
})

let userHideItems = [...propsTableHideItems.value]

const setHideColumnStorage = () => {
  const hidenColumns = useStorage.get('hidenColumns')
  if (hidenColumns) {
    hidenColumns[props.pageName] = userHideItems
    useStorage.set('hidenColumns', hidenColumns)
  } else {
    useStorage.set('hidenColumns', {
      [props.pageName]: userHideItems,
    })
  }
}

const onChangeShowColumn = (checked, prop, handleUser) => {
  const isArray = Array.isArray(prop)
  if (!isArray) {
    if (checked) {
      filterArr.value = filterArr.value.filter((item) => item !== prop)
    } else {
      filterArr.value = [...new Set([...filterArr.value, prop])]
    }
  }
  if (handleUser) {
    if (checked) {
      userHideItems = userHideItems.filter((item) => item !== prop)
    } else if (!isArray) {
      userHideItems = [...new Set([...userHideItems, prop])]
    }
    setHideColumnStorage()
  }
  emit('onChangeShowColumn', filterArr.value)
}

watch(
  () => props.contentConfig,
  () => {
    const hidenColumns = useStorage.get('hidenColumns')
    let tableHides = []
    if (hidenColumns && hidenColumns[props.pageName]) {
      userHideItems = hidenColumns[props.pageName]
      tableHides = userHideItems
      onChangeShowColumn(false, tableHides, false)
    } else {
      tableHides = [
        ...new Set([...userHideItems, ...propsTableHideItems.value]),
      ]
    }
    props.contentConfig.tableItem?.forEach((item) => {
      if (item.prop) {
        if (tableHides.includes(item.prop)) {
          filterArr.value.push(item.prop)
          onChangeShowColumn(false, item.prop, false)
        } else {
          columnChecked.value.push(item.prop)
        }
      }
    })
  },
  {
    immediate: true,
  }
)

const triggerShowSearch = () => {
  store.handlePageSearch(props.pageName, props.cacheKey)
}

const editMoreClick = () => {
  emit('editMoreClick')
}

const hasSlot = (arr) => {
  return arr.some((key) => Object.prototype.hasOwnProperty.call(slots, key))
}

const columnsFilter = () => {
  const tableItem = props.contentConfig.tableItem.filter((item) => {
    if (!item.permission) return true
    return hasPermi(item.permission)
  })
  const orderColumns = useStorage.get('orderColumns')
  if (!orderColumns) {
    props.contentConfig.tableItem = tableItem
    return
  }
  const pageColumns = orderColumns[props.pageName]
  if (!pageColumns) {
    props.contentConfig.tableItem = tableItem
    return
  }
  const itemMap = new Map(tableItem.map((item) => [item.prop, item]))
  const sortedItems = pageColumns.map((key) => itemMap.get(key)).filter(Boolean)
  const remainingItems = tableItem.filter(
    (item) => !pageColumns.includes(item.prop)
  )
  props.contentConfig.tableItem = [...sortedItems, ...remainingItems]
}

const dragUpdate = () => {
  const getListName = `${props.pageName}List`
  const list = store.listInfo[getListName]
  store.$patch((state) => {
    state.listInfo[getListName] = [...list]
  })
  const tableItem = props.contentConfig.tableItem
  const order = tableItem.map((item) => item.prop)
  const orderColumns = useStorage.get('orderColumns')
  if (orderColumns) {
    orderColumns[props.pageName] = order
    useStorage.set('orderColumns', orderColumns)
  } else {
    useStorage.set('orderColumns', {
      [props.pageName]: order,
    })
  }
}

const handleDefaultSort = () => {
  const orderColumns = useStorage.get('orderColumns')
  const pageColumns = orderColumns?.[props.pageName]
  if (pageColumns) {
    delete orderColumns[props.pageName]
    useStorage.set('orderColumns', orderColumns)
    tab.refreshPage()
  }
}

const init = () => {
  columnsFilter()
}

onMounted(() => {
  if (props.autoDesc) {
    let shortData = {}
    const tableConfig = props.contentConfig?.tableConfig
    if (tableConfig?.defaultSort) {
      const sort = tableConfig.defaultSort
      shortData.orderByColumn = sort.field
      if (sort.order === 'ascend') {
        shortData.isAsc = 'asc'
      } else if (sort.order === 'descend') {
        shortData.isAsc = 'desc'
      }
    } else if (props.descConfig) {
      shortData = props.descConfig
    }
    for (const [key, value] of Object.entries(shortData)) {
      searchDatas.value[key] = value
    }
  }
  if (props.autoSend) {
    const obj = Object.assign({}, props.firstSendOption, finalSearchData.value)
    send({ ...obj })
  }
  mittResize()
  onListener()
})

onBeforeUnmount(() => {
  offListener()
})

onActivated(() => {
  onListener()
})

onDeactivated(() => {
  offListener()
})

init()

defineExpose({
  finalSearchData,
  refresh,
  baseTableRef,
  deleteRow,
  editClick,
  dataList,
})
</script>

<template>
  <div class="page-content">
    <a-spin :spinning="isLoading">
      <BaseTable
        ref="baseTableRef"
        v-model:pagination-info="paginationInfo"
        :data-list="dataList"
        :list-count="listCount"
        :table-listener="tableListener"
        :maxTableHeight="maxTableHeight"
        v-bind="tableBindProps"
        @sort-change="sortChange"
      >
        <template #header>
          <div class="header-scroll">
            <div class="table-header">
              <div v-if="hasSlot(['handleLeft']) || headerButtons.length !== 0">
                <div class="flex">
                  <a-button
                    v-if="headerButtons.includes('refresh')"
                    @click="refresh"
                  >
                    <SvgIcon icon-class="sync-alt" :size="13" />
                  </a-button>
                  <a-button
                    v-if="
                      headerButtons.includes('add') && hasPermi(permission.add)
                    "
                    type="primary"
                    class="order5"
                    @click="addClick"
                  >
                    <SvgIcon :size="14" icon-class="plus" />
                    <span class="ml6">添加</span>
                  </a-button>
                  <a-button
                    v-if="
                      headerButtons.includes('edit') &&
                      hasPermi(permission.edit)
                    "
                    type="primary"
                    class="order10"
                    :disabled="tableSelected.length === 0"
                    @click="editMoreClick"
                  >
                    <SvgIcon :size="14" icon-class="pencil" />
                    <span class="ml6">编辑</span>
                  </a-button>
                  <a-popconfirm
                    v-if="
                      headerButtons.includes('delete') &&
                      hasPermi(permission.del)
                    "
                    title="确定删除选中记录？"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="deleteRow(tableSelected)"
                    :disabled="tableSelected.length === 0"
                  >
                    <a-button
                      class="order15"
                      danger
                      type="primary"
                      :disabled="tableSelected.length === 0"
                    >
                      <SvgIcon :size="14" icon-class="trash" />
                      <span class="ml6">删除</span>
                    </a-button>
                  </a-popconfirm>
                  <slot name="handleLeft" />
                </div>
              </div>
              <div
                v-if="hasSlot(['handleRight']) || headerButtons.length !== 0"
              >
                <div
                  v-if="
                    headerButtons.includes('columnDisplay') ||
                    headerButtons.includes('comSearch')
                  "
                  class="table-search-button-group"
                >
                  <a-dropdown
                    v-if="headerButtons.includes('columnDisplay')"
                    :trigger="['click']"
                    placement="bottomRight"
                    overlay-class-name="column-display"
                  >
                    <a-button
                      class="table-search-button-item"
                      :class="
                        headerButtons.includes('columnDisplay')
                          ? 'right-border'
                          : ''
                      "
                    >
                      <SvgIcon
                        size="14"
                        icon-class="ant-icon-AppstoreOutlined"
                      />
                    </a-button>
                    <template #overlay>
                      <div class="column-display-panel">
                        <a-checkbox-group v-model:value="columnChecked">
                          <VueDraggable
                            v-model="contentConfig.tableItem"
                            :animation="150"
                            ghost-class="ghost"
                            @update="dragUpdate"
                          >
                            <div
                              v-for="(item, idx) in contentConfig.tableItem"
                              :key="idx"
                              class="column-display-item"
                            >
                              <a-checkbox
                                v-if="item.prop"
                                :value="item.prop"
                                @change="
                                  (e) =>
                                    onChangeShowColumn(
                                      e.target.checked,
                                      item.prop,
                                      true
                                    )
                                "
                              >
                                {{ item.label }}
                              </a-checkbox>
                            </div>
                          </VueDraggable>
                        </a-checkbox-group>
                        <a-divider style="margin: 0" />
                        <div class="drop-btns">
                          <a-button size="small" @click="handleDefaultSort">
                            恢复默认排序
                          </a-button>
                        </div>
                      </div>
                    </template>
                  </a-dropdown>
                  <a-tooltip
                    v-if="headerButtons.includes('comSearch')"
                    :title="showPageSearch ? '关闭搜索' : '展开搜索'"
                    placement="top"
                  >
                    <a-button
                      class="table-search-button-item"
                      @click="triggerShowSearch"
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

        <template #expand="{ backData }">
          <slot name="expand" :back-data="backData" />
        </template>

        <template #todo="{ backData }">
          <div class="todo flex-center">
            <slot name="todoSlot" :back-data="backData" />
            <a-button
              v-if="
                showEdit &&
                handleEditShow(backData) &&
                hasPermi(permission.edit)
              "
              class="edit order5"
              type="primary"
              size="small"
              @click="editClick(backData)"
            >
              <SvgIcon :size="12" icon-class="pencil" />
              <span class="ml6">编辑</span>
            </a-button>
            <a-popconfirm
              v-if="
                hasPermi(permission.del) &&
                showDelete &&
                handleDeleteShow(backData)
              "
              title="确定删除选中记录？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteRow(backData)"
            >
              <a-button class="del order10" type="primary" danger size="small">
                <SvgIcon :size="12" icon-class="trash" />
                <span class="ml6">删除</span>
              </a-button>
            </a-popconfirm>
          </div>
        </template>

        <template
          v-for="item in otherSlot"
          :key="item.prop"
          #[item.slotName]="{ backData, currentItem }"
        >
          <slot
            v-if="item.slotName"
            :name="item.slotName"
            :back-data="backData"
            :current-item="currentItem"
          />
          <DictCpn
            v-if="item.isDict"
            :value="backData[item.prop]"
            :options="dictMap[item.prop]"
          />
        </template>

        <template
          v-for="item in otherSlot"
          :key="`${item.prop}-header`"
          #[`${item.slotName}Header`]="{ backData }"
        >
          <slot :name="item.slotName + 'Header'" :back-data="backData" />
        </template>
      </BaseTable>
    </a-spin>
  </div>
</template>

<style scoped lang="scss">
.todo {
  flex-wrap: wrap;

  :deep(.ant-btn) {
    margin: 4px;
  }
}

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

  .table-search-button-item {
    height: 30px;
    border: none;
    border-radius: 0;
  }

  .ant-btn + .ant-btn {
    margin: 0;
  }

  .right-border {
    border-right: 1px solid var(--ba-border-color, #d9d9d9);
  }

  :deep(.ant-btn:focus-visible) {
    outline: none;
    outline-offset: 0;
  }
}

.drop-btns {
  padding: 5px 16px;
}

.ml6 {
  margin-left: 6px;
}

.flex {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss">
.column-display {
  .column-display-panel {
    min-width: 180px;
    max-height: 380px;
    overflow-y: auto;
    background: var(--ba-bg-color-overlay, #fff);
    border-radius: 6px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  .column-display-item {
    padding: 0;

    .ant-checkbox-wrapper {
      width: 100%;
      padding: 5px 16px;
      height: 32px;
    }
  }
}
</style>
