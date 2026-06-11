<template>
  <a-table-column-group
    v-if="item.merges && !isHiddenItem(item, hideItems) && !item.hide"
    :key="`${item.prop}-group`"
    :title="item.label"
    v-bind="getColumnBind(item, align)"
  >
    <template #title>
      <slot :name="`${item.slotName}Header`" :backData="{ column: item }">
        {{ item.label }}
      </slot>
    </template>
    <TableColumn
      v-for="merge in item.merges"
      :key="merge.prop"
      :item="merge"
      :hide-items="hideItems"
      :align="align"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData" />
      </template>
    </TableColumn>
  </a-table-column-group>

  <a-table-column
    v-else-if="!isHiddenItem(item, hideItems) && !item.hide"
    :key="`${item.prop}-column`"
    :data-index="item.prop"
    :title="item.label"
    v-bind="getColumnBind(item, align)"
  >
    <template #title>
      <slot :name="`${item.slotName}Header`" :backData="{ column: item }">
        {{ item.label }}
      </slot>
    </template>
    <template #default="{ record }">
      <slot
        v-if="item.slotName"
        :name="item.slotName"
        :backData="record"
        :currentItem="item"
      >
        {{ record[item.prop] }}
      </slot>
      <template v-else>
        {{ record[item.prop] }}
      </template>
    </template>
  </a-table-column>
</template>

<script setup>
import TableColumn from './TableColumn.vue'
import { getColumnBind, isHiddenItem } from './utils/index.js'

defineOptions({
  name: 'TableColumn',
  components: {
    TableColumn,
  },
})

defineProps({
  item: {
    type: Object,
    required: true,
  },
  align: {
    type: String,
    default: 'center',
  },
  hideItems: {
    type: [Array, Object],
    default: () => [],
  },
})
</script>
