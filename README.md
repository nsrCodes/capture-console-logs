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
const CaptureConsole= require("capture-console-logs")

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
  { type: 'LOG', args: [ 'simple log' ] },
  { type: 'INFO', args: [ 'informative log', [Object] ] },
  {
    type: 'ERROR',
    args: [
      Error: Our small petty error
          at somelogs (/Users/navdeep/Desktop/Temp-RQ/capture-logs.js:143:17)
          at main (/Users/navdeep/Desktop/Temp-RQ/capture-logs.js:175:3)
          at Object.<anonymous> (/Users/navdeep/Desktop/Temp-RQ/capture-logs.js:182:1)
          at Module._compile (node:internal/modules/cjs/loader:1105:14)
          at Object.Module._extensions..js (node:internal/modules/cjs/loader:1159:10)
          at Module.load (node:internal/modules/cjs/loader:981:32)
          at Function.Module._load (node:internal/modules/cjs/loader:822:12)
          at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
          at node:internal/main/run_main_module:17:47
    ]
  },
  { type: 'WARN', args: [ 'Better Watch Out!' ] },
  { type: 'LOG', args: [ 'please work1' ] }
]
```

You can also create the original log using these captures as follows
```js
const CaptureConsole, {makeOriginalLog} = require("capture-console-logs")

// [...]

const captures = cc.getCaptures();
captures.forEach(log => {
  makeOriginalLog(log)
})
```

This code is barely tested and so PR's, improvements and issues are all welcome