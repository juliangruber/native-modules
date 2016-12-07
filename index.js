#!/usr/bin/env node

'use strict'

const fs = require('fs')
const isNative = require('is-native-module')

const scan = dir => {
  fs.readdir(dir, (err, files) => {
    if (err) return
    fs.readFile(`${dir}/package.json`, (err, json) => {
      if (err) return
      const pkg = JSON.parse(json.toString('utf8'))
      if (isNative(pkg)) {
        console.log(dir
          .replace('node_modules/', '')
          .replace(/\/?node_modules\//g, ' -> '))
      }
    })
    files
      .filter(f => !/^\./.test(f))
      .forEach(f => scan(`${dir}/${f}`))
  })
}

scan('node_modules')

