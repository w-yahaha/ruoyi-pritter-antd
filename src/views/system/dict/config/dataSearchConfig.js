export default () => {
  return {
    formItems: [
      {
        label: '字典名称',
        field: 'dictType',
        type: 'select',
        options: ref([]),
        setLabel: 'dictName',
        setValue: 'dictType',
        config: {
          allowClear: false,
        },
      },
      {
        label: '字典标签',
        field: 'dictLabel',
        type: 'input',
        config: {
          allowClear: true,
        },
      },
      {
        label: '状态',
        field: 'status',
        type: 'select',
        options: [],
        config: {
          allowClear: true,
        },
      },
    ],
    colLayout: {
      xxl: 4,
      xl: 6,
      lg: 8,
      md: 12,
      sm: 12,
      xs: 24,
    },
  }
}
