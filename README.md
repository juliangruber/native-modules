
# native-modules

Report on the native node modules used by your application or module.

Checks for presence of [prebuild](https://npmjs.org/package/prebuild) and [prebuild-ci](https://npmjs.org/package/prebuild-ci).

![screenshot](screenshot.png)

## Usage

```bash
 $ native-modules 
 discovery-swarm -> utp-native
 dat-node -> hyperdrive -> rabin
 dat-node -> level -> leveldown
 dat-node -> hyperdrive-import-files -> chokidar -> fsevents
 dat-node -> hyperdrive -> hypercore -> sodium-signatures -> sodium-prebuilt
 dat-node -> hyperdrive -> hypercore -> hypercore-protocol -> sodium-encryption -> sodium-prebuilt
```

## Installation

```bash
$ npm install -g native-modules
```

## License

MIT
