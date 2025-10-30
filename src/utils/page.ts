import { pages, subPackages } from 'virtual:uni-pages'
import { tabBar } from '../pages.json'

/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPath() {
  const pages = getCurrentPages<{ needLogin?: boolean }>()
  const currentPage = pages[pages.length - 1]
  return currentPage.route || ''
}

/** 得到所有 pages，包括主包和分包的 */
export function getAllPages() {
  // 这里处理主包
  const mainPages = pages
    .map(page => ({
      ...page,
      path: `/${page.path}`,
    }))

  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  return [...mainPages, ...subPages]
}

/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 *
 * @param [key] 过滤的 key
 * @returns 需要登录的 pages
 */
export function getAllExcludePages(key = 'needLogin') {
  const pages = getAllPages()
  return pages.filter((page: any) => !key || !page[key])
}

/** 判断是否是 tabbar 页面 */
export function isPageTabbar(path: _LocationUrl) {
  let _path = path.split('?')[0]
  if (_path.startsWith('/')) {
    _path = _path.slice(1)
  }
  return tabBar.list.some(item => item.pagePath === _path)
}
