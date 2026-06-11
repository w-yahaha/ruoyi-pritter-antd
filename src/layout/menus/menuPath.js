import { getNormalPath } from '@/utils/utils'

export function resolveMenuPath(basePath, routePath) {
  if (!routePath) {
    return basePath
  }
  if (routePath.startsWith('/')) {
    return getNormalPath(routePath)
  }
  if (!basePath) {
    return getNormalPath(`/${routePath}`)
  }
  return getNormalPath(`${basePath}/${routePath}`)
}

export function resolveSubMenuKey(basePath, itemPath, isNest) {
  if (isNest) {
    return basePath
  }
  return resolveMenuPath(basePath, itemPath)
}
