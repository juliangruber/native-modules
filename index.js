#!/usr/bin/env node

import { promises as fs } from 'fs'
import isNative from 'is-native-module'
import chalk from 'chalk'

let isFirst = true

const check = truthy =>
  truthy
    ? chalk.green('✓')
    : chalk.red('×')

const scan = dir => Promise.all([
  (async () => {
    let files
    try {
      files = await fs.readdir(dir)
    } catch (_) {
      return
    }
    await Promise.all(files
      .filter(f => !/^\./.test(f))
      .map(f => scan(`${dir}/${f}`)))
  })(),
  (async () => {
    let json
    try {
      json = await fs.readFile(`${dir}/package.json`)
    } catch (_) {
      return
    }
    const pkg = JSON.parse(json.toString('utf8'))
    if (isNative(pkg)) {
      if (isFirst) {
        console.log('PB CI Module')
        isFirst = false
      }
      const path = dir
        .replace('node_modules/', '')
        .replace(/\/?node_modules\//g, ' -> ')
      const pb = pkg.dependencies && !!pkg.dependencies.prebuild
      const ci = pkg.devDependencies && !!pkg.devDependencies['prebuild-ci']
      console.log(`${check(pb)}  ${check(ci)}  ${path}`)
    }
  })()
])

scan('node_modules').catch(err => {
  console.error(err)
  process.exit(1)
})

