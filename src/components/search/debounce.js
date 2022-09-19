// NOTE: Pattern. Decorator
export const debounce = (fn, delay = 0) => {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn.apply(this, args);

      timerId = null;
    }, delay);
  };
};
