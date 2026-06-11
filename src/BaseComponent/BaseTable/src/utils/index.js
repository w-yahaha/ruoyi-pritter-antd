export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const COLUMN_META_KEYS = new Set([
  'prop',
  'label',
  'slotName',
  'merges',
  'hide',
  'permission',
  'isDict',
  'mobileSlot',
  'isHidden',
  'slotNames',
])

export const isHiddenItem = (item, hideItems) => {
  if (item.hide || item.isHidden) return true
  if (isRef(hideItems)) {
    return Array.isArray(hideItems.value) && hideItems.value.includes(item.prop)
  }
  if (Array.isArray(hideItems)) {
    return hideItems.includes(item.prop)
  }
  return false
}

export const getColumnBind = (item, align) => {
  const bind = {
    key: item.prop,
    align: item.align || align,
  }

  for (const [key, value] of Object.entries(item)) {
    if (COLUMN_META_KEYS.has(key) || value === undefined || value === false) {
      continue
    }
    bind[key] = value
  }

  return bind
}

const buildColumn = (item, align) => {
  const bind = getColumnBind(item, align)
  return {
    title: item.label,
    dataIndex: item.prop,
    slotName: item.slotName,
    columnItem: item,
    ...bind,
  }
}

export const buildTableColumns = (tableItem, hideItems, align, showIndex) => {
  const columns = []

  if (showIndex) {
    columns.push({
      title: '序号',
      key: '__index',
      width: 55,
      align,
    })
  }

  for (const item of tableItem) {
    if (isHiddenItem(item, hideItems) || item.hide) continue

    if (item.merges?.length) {
      columns.push({
        title: item.label,
        key: `${item.prop}-group`,
        slotName: item.slotName,
        columnItem: item,
        children: item.merges
          .filter((merge) => !isHiddenItem(merge, hideItems) && !merge.hide)
          .map((merge) => buildColumn(merge, align)),
      })
      continue
    }

    columns.push(buildColumn(item, align))
  }

  return columns
}

export const getTableScrollX = (tableItem, showIndex) => {
  const hasFixed = tableItem.some((item) => item.fixed)
  if (!hasFixed) return undefined

  const totalWidth = tableItem.reduce(
    (sum, item) => {
      const width = Number(item.width)
      return sum + (Number.isFinite(width) ? width : 0)
    },
    showIndex ? 55 : 0
  )

  return totalWidth || 'max-content'
}

export const hasSlot = (slots, names) => {
  return names.some((key) => Object.prototype.hasOwnProperty.call(slots, key))
}

export const collectExpandableKeys = (rows, rowKey = 'id') => {
  const keys = []
  const walk = (list) => {
    list.forEach((row) => {
      if (row.children?.length) {
        keys.push(row[rowKey])
        walk(row.children)
      }
    })
  }
  walk(rows)
  return keys
}
