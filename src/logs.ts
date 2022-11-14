import ConsoleCapture from ".";

export type LogType = "LOG" | "WARN" | "INFO" | "DEBUG" | "ERROR"
export interface Log {
  type: LogType
  args: any
}

export function makeOriginalLog(log: Log) {
  ConsoleCapture.saveOriginalFunctions();
  switch(log.type) {
    case "LOG": {
      console.original.log(...log.args)
      break;
    }
    case "INFO": {
      console.original.info(...log.args)
      break;
    }
    case "DEBUG": {
      console.original.debug(...log.args)
      break;
    }
    case "ERROR": {
      console.original.error(...log.args)
      break;
    }
    case "WARN": {
      console.original.warn(...log.args)
      break;
    }
  }
}