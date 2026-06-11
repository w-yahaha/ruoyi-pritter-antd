<script setup>
import { capitalizeFirstLetter, getOptions } from '../../../utils/index.js'

const props = defineProps({
  item: { type: Object, required: true },
  allDisabled: { type: Boolean },
})
const value = defineModel('value')
const selectRef = useTemplateRef('selectRef')

const selectConfig = computed(() => ({
  allowClear: true,
  placeholder: '请选择' + props.item.label,
  ...props.item.config,
}))

const getRef = () => selectRef.value
defineExpose({ getRef })
</script>

<template>
  <a-select
    ref="selectRef"
    v-model:value="value"
    class="base-form-select"
    :disabled="allDisabled"
    v-bind="selectConfig"
    :id="item.field"
    v-on="item.eventFunction || {}"
  >
    <a-select-option
      v-for="option in getOptions(item)"
      :key="option.key ?? option.value"
      :value="item.setValue ? option[item.setValue] : option.value"
      v-on="item.optionFunction || {}"
    >
      <template v-for="slotName in item.optionSlots" #[slotName]>
        <slot
          :name="item.field + capitalizeFirstLetter(slotName) + 'Option'"
          :slotData="{ ...item, option }"
        />
      </template>
      {{ item.setLabel ? option[item.setLabel] : option.label }}
    </a-select-option>
    <template v-for="slotName in item.slotNames" #[slotName]="slotData">
      <slot :name="slotName" :slotData="slotData" />
    </template>
  </a-select>
</template>

<style scoped lang="scss">
.base-form-select {
  width: 100%;
}
</style>
