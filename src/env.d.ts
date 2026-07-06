/// <reference types="vite/client" />

// types/weex.d.ts
declare const weex: {
  requireModule: (name: 'animation') => {
    transition: (ref: any, options: any, callback: () => void) => void
  }
}
