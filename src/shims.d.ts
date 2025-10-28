// 扩展uni-mini-router的RoutePathLocation接口
import type { RouteNameLocation } from 'uni-mini-router'

export {}

declare module 'vue' {
  type Hooks = App.AppInstance & Page.PageInstance
  interface ComponentCustomOptions extends Hooks {}
}

// 'uni-mini-router' 模块的类型定义

// 扩展RoutePathLocation接口，使path支持自定义类型
declare module 'uni-mini-router' {
  export interface RoutePathLocation {
    path: _LocationUrl
  }

  /** 原始本地路由 */
  export type RouteLocationRaw = _LocationUrl | RouteNameLocation | RoutePathLocation

  // 扩展 Router 接口的方法签名
  export interface Router {
    push: (to: RouteLocationRaw) => void
    replace: (to: RouteLocationRaw) => void
    replaceAll: (to: RouteLocationRaw) => void
    pushTab: (to: RouteLocationRaw) => void
    needLogin?: boolean
  }
}
