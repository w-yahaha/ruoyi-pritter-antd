<script setup>
import { defaultTreeFieldNames, getOptions } from '../../../utils/index.js'

const props = defineProps({
  item: { type: Object, required: true },
  allDisabled: { type: Boolean },
})
const treeRef = useTemplateRef('treeRef')

const treeConfig = computed(() => ({
  fieldNames: props.item.config?.fieldNames ?? defaultTreeFieldNames,
  style: { width: '100%' },
  ...props.item.config,
  treeData: props.item.config?.treeData ?? getOptions(props.item),
}))

const getRef = () => treeRef.value
defineExpose({ getRef })
</script>

<template>
  <a-tree
    ref="treeRef"
    v-bind="treeConfig"
    :id="item.field"
    v-on="item.eventFunction || {}"
  >
    <template v-for="slotName in item.slotNames" #[slotName]="slotData">
      <slot :name="slotName" :slotData="slotData" />
    </template>
  </a-tree>
</template>
