/* eslint-disable ts/ban-ts-comment */
// @ts-ignore
import * as fs from 'node:fs'
// @ts-ignore
import { argv } from 'node:process'

const baseApkPath = './src/unpackage/debug/android_debug.apk'
const targetDevApkPath = './dist/dev/app/unpackage/debug/android_debug.apk'
const targetBuildApkPath = './dist/build/app/unpackage/debug/android_debug.apk'

/**
 * 拷贝置顶文件到置顶位置
 */
export function copyFile(filePath: string, targetPath: string) {
  console.log('文件源', filePath)
  if (!fs.existsSync(filePath)) {
    console.log(`${filePath} 文件不存在`)
    throw new Error(`${filePath} 文件不存在`)
  }
  fs.cp(filePath, targetPath, { recursive: true }, (err: any) => {
    if (err)
      throw err
    console.log(`${filePath} 已成功复制到 ${targetPath}`)
    console.log(`${targetPath} 状态：${fs.existsSync(filePath) ? '存在' : '不存在'}`)
  })
}

/**
 * 拷贝基座到 dev 环境目录
 */
export function copyDevApkToDist() {
  copyFile(baseApkPath, targetDevApkPath)
}

/**
 * 拷贝基座到 build 环境目录
 */
export function copyBuildApkToDist() {
  copyFile(baseApkPath, targetBuildApkPath)
}

if (import.meta.url === `file://${argv[1]}`) {
  const command = argv[2]
  if (command === 'copyDevApkToDist') {
    copyDevApkToDist()
  }
  else if (command === 'copyBuildApkToDist') {
    copyBuildApkToDist()
  }
  else {
    console.log('Usage: node scripts/copyBaseApk.ts <command>')
    console.log('Commands: copyDevApkToDist, copyBuildApkToDist')
  }
}
