export const tableItem = [
  {
    prop: 'userName',
    label: '用户名称',
    width: 120,
    ellipsis: true,
  },
  {
    prop: 'nickName',
    label: '用户昵称',
    width: 120,
    ellipsis: true,
  },
  {
    prop: 'dept',
    label: '部门',
    width: 140,
    slotName: 'deptSlot',
    ellipsis: true,
  },
  {
    prop: 'phonenumber',
    label: '手机号码',
    width: 130,
    ellipsis: true,
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    slotName: 'statusSlot',
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    ellipsis: true,
  },
  {
    prop: 'todo',
    label: '操作',
    width: 180,
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
