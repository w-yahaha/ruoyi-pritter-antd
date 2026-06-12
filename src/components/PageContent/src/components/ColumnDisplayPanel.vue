<script setup>
import { VueDraggable } from 'vue-draggable-plus'

defineProps({
  listKey: {
    type: Number,
    default: 0,
  },
})

const open = defineModel('open', { type: Boolean })
const list = defineModel('list', { type: Array })
const checked = defineModel('checked', { type: Array })

const emit = defineEmits(['change-column', 'drag-update', 'reset-sort'])
</script>

<template>
  <a-dropdown
    v-model:open="open"
    :trigger="['click']"
    placement="bottomRight"
    overlay-class-name="column-display"
  >
    <a-button class="table-search-button-item right-border">
      <SvgIcon size="14" icon-class="ant-icon-AppstoreOutlined" />
    </a-button>

    <template #overlay>
      <div class="column-display-panel">
        <a-checkbox-group v-model:value="checked">
          <VueDraggable
            :key="listKey"
            v-model="list"
            :animation="150"
            ghost-class="ghost"
            @update="emit('drag-update')"
          >
            <div
              v-for="item in list"
              :key="item.prop || item.label"
              class="column-display-item"
            >
              <a-checkbox
                v-if="item.prop"
                :value="item.prop"
                @change="
                  (e) => emit('change-column', e.target.checked, item.prop)
                "
              >
                {{ item.label }}
              </a-checkbox>
            </div>
          </VueDraggable>
        </a-checkbox-group>

        <a-divider style="margin: 0" />

        <div class="drop-btns">
          <a-button size="small" @click="emit('reset-sort')">
            恢复默认排序
          </a-button>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<style lang="scss">
.column-display {
  .column-display-panel {
    min-width: 180px;
    max-height: 380px;
    overflow-y: auto;
    background: var(--ba-bg-color-overlay);
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

  .drop-btns {
    padding: 5px 16px;
  }
}
</style>
