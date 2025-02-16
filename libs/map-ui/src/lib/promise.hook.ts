export const promiseHook = () => {
  let resolve: (value?: unknown) => void = () => {};
  let reject: (value?: unknown) => void = () => {};

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};
