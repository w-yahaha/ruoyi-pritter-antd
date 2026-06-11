<script>
import { createVNode, resolveComponent, defineComponent, computed } from 'vue'
import svg from './useSvg.vue'

const ANT_ICON_PREFIX = 'ant-icon-'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number],
      default: 14,
    },
  },
  setup(props) {
    const iconStyle = computed(() => ({
      fontSize: `${props.size}px`,
      color: props.color || undefined,
    }))

    if (props.iconClass.indexOf(ANT_ICON_PREFIX) === 0) {
      const iconName = props.iconClass.slice(ANT_ICON_PREFIX.length)
      return () =>
        createVNode(resolveComponent(iconName), {
          class: ['ant-icon', props.className].filter(Boolean).join(' '),
          style: iconStyle.value,
        })
    }

    return () =>
      createVNode(svg, {
        iconClass: props.iconClass,
        size: props.size,
        color: props.color,
        className: props.className,
      })
  },
})
</script>
