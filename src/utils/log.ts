// tslint:disable:no-console
export const log = (...args: any[]) => {
  if (process.env.NODE_ENV === 'test' && !process.env.ENABLE_LOG_IN_TEST_ENV) {
    return
  }
  console.log(...args)
}
