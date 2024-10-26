import { type Log, overridableFunctionNames } from "./logs.ts";

interface ConsoleWithOriginal extends Console {
  original: { [key: string]: unknown };
}

const consoleWithOriginal = console as ConsoleWithOriginal;
consoleWithOriginal.original = {};

export class ConsoleCapture {
  private static captures: Log[];
  static consoleOverriden = false;

  constructor() {
    ConsoleCapture.captures = [];
  }

  // Core
  private static saveLog(functionName: string, args: unknown[]): void {
    const finalArgs = args.map((arg) => {
      if (typeof arg == "object") {
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

  private static setNewFunctions(allowOriginalExecution = false): void {
    const proxyHandler = {
      apply: (target: (...args: unknown[]) => unknown, thisArgument: unknown, argumentsList: unknown[]): void => {
        ConsoleCapture.saveLog(target.name, argumentsList);
        target.bind(thisArgument);
        if (allowOriginalExecution) target(...argumentsList);
      },
    };

    overridableFunctionNames.forEach((funcName) => {
      if (!ConsoleCapture.consoleOverriden) {
        consoleWithOriginal.original[funcName as keyof ConsoleWithOriginal] = console[funcName as keyof Console];
      }
      console[funcName as keyof Console] = new Proxy(console[funcName as keyof Console] as (...args: unknown[]) => unknown, proxyHandler) as unknown as (...args: unknown[]) => void;
    });
    ConsoleCapture.consoleOverriden = true;
  }

  private static resetToOriginalFunctions(): void {
    if (ConsoleCapture.consoleOverriden) {
      overridableFunctionNames.forEach((funcName) => {
        console[funcName as keyof Console] = consoleWithOriginal.original[funcName as keyof ConsoleWithOriginal] as (...args: unknown[]) => void;
      });
    }
    ConsoleCapture.consoleOverriden = false;
  }

  // APIS
  start(allowOriginalExecution = false): void {
    ConsoleCapture.captures = [];
    ConsoleCapture.setNewFunctions(allowOriginalExecution);
  }

  stop(): void {
    ConsoleCapture.resetToOriginalFunctions();
  }

  flush(): void {
    ConsoleCapture.captures = [];
  }

  getCaptures(): Log[] {
    return ConsoleCapture.captures;
  }

  static makeOriginalLog(log: Log): void {
    ConsoleCapture.resetToOriginalFunctions();

    if (overridableFunctionNames.includes(log.function)) {
      const finalArgs: unknown[] = log.args.map((arg) => {
        if (typeof arg == "string") {
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
      (console[log.function as keyof Console] as (...args: unknown[]) => void)(...finalArgs as [unknown, ...unknown[]]);
    } else {
      throw Error("Invalid Log type");
    }
  }
}