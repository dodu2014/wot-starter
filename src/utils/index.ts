import { pages, subPackages } from '@/pages.json'

/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPath() {
  const pages = getCurrentPages<{ excludeLoginPath?: boolean }>()
  const currentPage = pages[pages.length - 1]
  return currentPage.route || ''
}

/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 excludeLoginPath, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 */
export function getAllPages(key = 'excludeLoginPath') {
  // 这里处理主包
  const mainPages = pages
    .filter(page => !key || (page as any)[key])
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
      .filter(page => !key || (page as any)[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}
