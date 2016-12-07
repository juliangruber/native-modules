#!/usr/bin/env node

'use strict'

const fs = require('fs')
const isNative = require('is-native-module')
const chalk = require('chalk')

let first = true

const check = truthy =>
  truthy
    ? chalk.green('✓')
    : chalk.red('×')

const scan = dir => {
  fs.readdir(dir, (err, files) => {
    if (err) return
    fs.readFile(`${dir}/package.json`, (err, json) => {
      if (err) return
      const pkg = JSON.parse(json.toString('utf8'))
      if (isNative(pkg)) {
        if (first) {
          console.log('PB CI Module')
          first = false
        }
        const path = dir
          .replace('node_modules/', '')
          .replace(/\/?node_modules\//g, ' -> ')
        const pb = !!pkg.dependencies.prebuild
        const ci = !!pkg.devDependencies['prebuild-ci']
        console.log(`${check(pb)}  ${check(ci)}  ${path}`)
      }
    })
    files
      .filter(f => !/^\./.test(f))
      .forEach(f => scan(`${dir}/${f}`))
  })
}

scan('node_modules')

