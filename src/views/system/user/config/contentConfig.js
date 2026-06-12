export const tableItem = [
  {
    prop: 'userName',
    label: '用户名称',
  },
  {
    prop: 'nickName',
    label: '用户昵称',
  },
  {
    prop: 'dept',
    label: '部门',
    slotName: 'deptSlot',
  },
  {
    prop: 'phonenumber',
    label: '手机号码',
  },
  {
    prop: 'status',
    label: '状态',
    slotName: 'statusSlot',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'todo',
    label: '操作',
    minWidth: 260,
    fixed: !window.isSmallScreen ? 'right' : undefined,
    slotName: 'todo',
    ellipsis: false,
  },
]

export default () => {
  return {
    tableItem,
    tableConfig: {
      rowKey: 'userId',
    },
    showIndex: true,
    showChoose: true,
    pagination: true,
    selectionConfig: {
      getCheckboxProps: (record) => ({
        disabled: record.userId === 1,
      }),
    },
  }
}
