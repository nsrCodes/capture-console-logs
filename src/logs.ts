export const overridableFunctionNames = ['log', 'warn', 'info', 'debug', 'error'];

export interface Log {
  function: string;
  args: any[];
  ts: number;
}
