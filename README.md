Most of the existing libraries capture and return the results from `stderr` and `stdout`.
This although useful, makes it really hard to recreate the original console statements if you need to

This package provides a way to do so by overriding the console methods for the duration of the capture.

## Installation
This package is published [on npm](https://www.npmjs.com/package/capture-console-logs) and can be installed using

```
npm i capture-console-logs
```

## Example 

```js
const CaptureConsole = require("capture-console-logs").default

const cc = new CaptureConsole();
console.log("ping pong") // not captured

cc.start()

console.log("simple log")
console.info("informative log", {a:1})
console.error(new Error("Our small petty error"))
console.warn("Better Watch Out!")
console.debug("please work1")

cc.stop()
console.log(cc.getCaptures());
```

The output for the above example is 

```sh
[
  { function: 'log', args: [ 'simple log' ], ts: 1673463210311 },
  {
    function: 'info',
    args: [ 'informative log', '{"a":1}' ],
    ts: 1673463210311
  },
  {
    function: 'error',
    args: [
      '{"stack":"Error: Our small petty error\\n    at Object.<anonymous> (/Users/navdeep/Desktop/nsr/test/me/index.js:10:15)\\n    at Module._compile (node:internal/modules/cjs/loader:1105:14)\\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1159:10)\\n    at Module.load (node:internal/modules/cjs/loader:981:32)\\n    at Function.Module._load (node:internal/modules/cjs/loader:822:12)\\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)\\n    at node:internal/main/run_main_module:17:47","message":"Our small petty error"}'
    ],
    ts: 1673463210312
  },
  {
    function: 'warn',
    args: [ 'Better Watch Out!' ],
    ts: 1673463210312
  },
  { function: 'debug', args: [ 'please work1' ], ts: 1673463210312 }
]
```

**Note:** By default, while capturing original logs are not displayed in the console.
To allow execution while capturing, pass `allowOriginalExecution` as `true` in the `start` command
> cc.start(true)

Whenever needed, you can use the `flush` method to clear all captured logs.

You can also create the original log using these captures as follows
```js
const CaptureConsole, {makeOriginalLog} = require("capture-console-logs")

// [...]

const captures = cc.getCaptures();
captures.forEach(log => {
  CaptureConsole.makeOriginalLog(log)
})
```

This code is barely tested and so PR's, improvements and issues are all welcome