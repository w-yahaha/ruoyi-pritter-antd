export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const isHiddenItem = (item, hideItems) => {
  if (item.hide || item.isHidden) return true
  if (isRef(hideItems)) {
    return (
      Array.isArray(hideItems.value) && hideItems.value.includes(item.prop)
    )
  }
  if (Array.isArray(hideItems)) {
    return hideItems.includes(item.prop)
  }
  return false
}

export const getColumnBind = (item, align) => {
  const {
    prop,
    label,
    slotName,
    merges,
    hide,
    slotNames,
    sortable,
    showOverflowTooltip,
    permission,
    isDict,
    ...rest
  } = item

  return {
    ...rest,
    align: item.align || align,
    key: prop,
    ...(sortable ? { sorter: sortable === 'custom' ? true : sortable } : {}),
    ...(showOverflowTooltip !== false ? { ellipsis: true } : {}),
  }
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
