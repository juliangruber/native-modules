#!/usr/bin/env node

import { promises as fs } from 'fs'
import isNative from 'is-native-module'
import chalk from 'chalk'

let isFirst = true
const items = []
const check = truthy => (truthy ? chalk.green('✓') : chalk.red('×'))

const FORMAT_PRETTY = 'pretty'
const FORMAT_JSON = 'json'

function hasArg (arg) {
  return process.argv.includes(arg)
}

function getArgValue (arg) {
  const index = process.argv.indexOf(arg)

  if (index > -1) {
    return process.argv[index + 1]
  }
  return undefined
}

const format = getArgValue('--format') || FORMAT_PRETTY

const scan = dir =>
  Promise.all([
    (async () => {
      let files
      try {
        files = await fs.readdir(dir)
      } catch (_) {
        return
      }
      await Promise.all(
        files.filter(f => !/^\./.test(f)).map(f => scan(`${dir}/${f}`))
      )
    })(),
    (async () => {
      let pkg
      try {
        const json = await fs.readFile(`${dir}/package.json`)
        pkg = JSON.parse(json.toString('utf8'))
      } catch (_) {
        return
      }
      if (isNative(pkg)) {
        if (isFirst && format === FORMAT_PRETTY) {
          console.log('PB CI PBY Module')
          isFirst = false
        }
        const path = dir
          .replace('node_modules/', '')
          .replace(/\/?node_modules\//g, ' -> ')
        const pb = pkg.dependencies && !!pkg.dependencies.prebuild
        const pby = pkg.devDependencies && !!pkg.devDependencies.prebuildify
        const pbc = pkg.devDependencies && !!pkg.devDependencies['prebuild-ci']

        items.push({
          'prebuild-ci': !!pbc,
          prebuild: !!pb,
          prebuildify: !!pby,
          module: path
        })

        if (format === FORMAT_PRETTY) {
          console.log(`${check(pb)}  ${check(pbc)}  ${check(pby)}   ${path}`)
        }
      }
    })()
  ])

if (hasArg('-h') || hasArg('--help')) {
  const help = [
    'Usage: native-modules [options]',
    '  --format <string>               The formatting style for command output',
    `                                  (formats: ${FORMAT_PRETTY}|${FORMAT_JSON} default: ${FORMAT_PRETTY})`,
    '  -h, --help                      Print command line options'
  ]
  console.log(help.join('\n'))
} else {
  scan('node_modules')
    .then(result => {
      if (format === FORMAT_JSON) {
        console.log(JSON.stringify(items))
      }
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
