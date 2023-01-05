import { Log, overridableFunctionNames } from "./logs"

declare global {
  interface Console { original: any; }
}
console.original = {}

export class ConsoleCapture {
  private static captures: Log[];
  static consoleOverriden = false;

  constructor() {
    ConsoleCapture.captures = [];
  }
  // Core
  private static saveLog(functionName: string, args: [any]) {
    const finalArgs = args.map(arg => {
      if (typeof arg == 'object') {
        if (arg instanceof Error) {
          return JSON.stringify(arg, Object.getOwnPropertyNames(arg));
          // todo: some way to identify this string from other json stringified strings
          // https://stackoverflow.com/a/17936621/11565176
        }
        return JSON.stringify(arg);
      } else {
        return arg;
      }
    });
    ConsoleCapture.captures.push({
      function: functionName,
      args: finalArgs,
      ts: Date.now(),
    });
  }
  private static setNewFunctions(allowOriginalExecution = false) {
    const proxyHandler = {
      apply: (target: Function, thisArgument: any, argumentsList: [any]) => {
        ConsoleCapture.saveLog(target.name, argumentsList);
        target.bind(thisArgument);
        if (allowOriginalExecution) return target(...argumentsList);
        return;
      },
    };

    overridableFunctionNames.forEach(funcName => {
      if (!ConsoleCapture.consoleOverriden) {
        // @ts-ignore
        console.original[funcName] = console[funcName];
      }
      // @ts-ignore
      console[funcName] = new Proxy(console[funcName], proxyHandler);
    });
    ConsoleCapture.consoleOverriden = true;
  }

  private static resetToOriginalFunctions() {
    if (ConsoleCapture.consoleOverriden) {
      overridableFunctionNames.forEach(funcName => {
        // @ts-ignore
        console[funcName] = console.original[funcName];
      });
    }
    ConsoleCapture.consoleOverriden = false;
  }

  // APIS
  start(allowOriginalExecution = false) {
    ConsoleCapture.captures = [];
    ConsoleCapture.setNewFunctions(allowOriginalExecution);
  }

  stop() {
    ConsoleCapture.resetToOriginalFunctions();
  }

  flush() {
    ConsoleCapture.captures = [];
  }

  getCaptures() {
    return ConsoleCapture.captures;
  }

  static makeOriginalLog(log: Log) {
    ConsoleCapture.resetToOriginalFunctions();

    if (overridableFunctionNames.includes(log.function)) {
      const finalArgs = log.args.map(arg => {
        if (typeof arg == 'string') {
          try {
            // return JSON.parse(arg);

            // hacky for now
            const obj = JSON.parse(arg);
            return obj.stack ? obj.stack : obj;
          } catch {
            return arg;
          }
        }
        return arg;
      });
      // @ts-ignore
      console[log.function](...finalArgs);
    } else {
      throw Error('Invalid Log type');
    }
  }
}
