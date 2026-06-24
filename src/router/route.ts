// 扩展 @wot-ui/router 的 RoutePathLocation 接口
import type { RouteBackRaw, RouteLocationBase, Router } from '@wot-ui/router'

// '@wot-ui/router' 模块的类型定义

// 扩展RoutePathLocation接口，使path支持自定义类型
export interface RouteNameLocation extends RouteLocationBase {
  name: string
  params?: Record<string, string | number | undefined>
}

// 扩展RoutePathLocation接口，使path支持自定义类型
export interface RoutePathLocation extends RouteLocationBase {
  path: _LocationUrl
  query?: Record<string, string | number | undefined>
}

/** 原始本地路由 */
export type RouteLocationRaw = _LocationUrl | RouteNameLocation | RoutePathLocation

// 扩展 Router 接口的方法签名
type Modify<T, R> = {
  [K in keyof T]: K extends keyof R ? R[K] : T[K]
}
export type RouterExt = Modify<
  Router,
  {
    push: (to: RouteLocationRaw) => void
    pushTab: (to: RouteLocationRaw) => void
    replace: (to: RouteLocationRaw) => void
    replaceAll: (to: RouteLocationRaw) => void
    back: (to?: RouteBackRaw) => void
    needLogin?: boolean
  }
>
