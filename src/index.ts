import { makeOriginalLog, Log, LogType } from "./logs"

declare global {
  interface Console { original: any; }
}
console.original = {}

class ConsoleCapture {
  private static captures: Log[]
  static savedOriginalFunctions: boolean
  
  constructor() {
    ConsoleCapture.captures = []
    
  }

  // Alt functions
  private static createAltFunction (
    type: LogType, 
    allowOriginalExecution: boolean
  ) {
  return function(...args : any[]) {
    const log : Log = {type, args}
    ConsoleCapture.captures.push(log)
    if(allowOriginalExecution) {
      makeOriginalLog(log)
    }
  }
}

  private static getNewFunctions(allowOriginalExecution: boolean) {
    return {
      log: ConsoleCapture.createAltFunction("LOG", allowOriginalExecution),
      warn: ConsoleCapture.createAltFunction("WARN", allowOriginalExecution),
      info: ConsoleCapture.createAltFunction("INFO", allowOriginalExecution),
      debug: ConsoleCapture.createAltFunction("DEBUG", allowOriginalExecution),
      error: ConsoleCapture.createAltFunction("ERROR", allowOriginalExecution),
    }
  }

  static saveOriginalFunctions() {
    if(!ConsoleCapture.savedOriginalFunctions) {
      console.original.log = console.log
      console.original.warn = console.warn
      console.original.error = console.error
      console.original.info = console.info
      console.original.debug = console.log
      ConsoleCapture.savedOriginalFunctions = true;
    }
  }

  // Core
  private static setNewFunctions(allowOriginalExecution: boolean = false) {
    ConsoleCapture.saveOriginalFunctions()
    let newFunctions = ConsoleCapture.getNewFunctions(allowOriginalExecution)

    console.log = newFunctions.log
    console.warn = newFunctions.warn
    console.error = newFunctions.error
    console.info = newFunctions.info
    console.debug = newFunctions.log
  }

  private static resetToOriginalFunctions() {
    console.log = console.original.log
    console.warn = console.original.warn
    console.error = console.original.error
    console.info = console.original.info
    console.debug = console.original.log
  }


  // APIS
  start(allowOriginalExecution: boolean = false) {
    ConsoleCapture.captures = []
    ConsoleCapture.setNewFunctions(allowOriginalExecution)
  }
  
  stop () {
    ConsoleCapture.resetToOriginalFunctions()
  }

  getCaptures () {
    return ConsoleCapture.captures;
  }
}

export = ConsoleCapture