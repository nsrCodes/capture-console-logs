Most of the existing libraries capture and return the results from `stderr` and `stdout`.
This although useful, makes it really hard to recreate the original console statements if you need to

This package provides a way to do so by overriding the console methods for the duration of the capture.

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