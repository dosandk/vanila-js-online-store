const document = globalThis.document;

export const createElement = (template = '') => {
  const wrapper = document.createElement('div');

  wrapper.innerHTML = template;

  return wrapper.firstElementChild || wrapper;
};

export const getSubElements = (element, selector = "[data-element]") => {
  const result = {};
  const elements = element.querySelectorAll(selector);

  for (const subElement of elements) {
    const name = subElement.dataset.element;

    result[name] = subElement;
  }

  return result;
};

export const addEventListener = (element, eventName = '', listener, options = {}) => {
  element.addEventListener(eventName, listener, options);

  return () => {
    element.removeEventListener(eventName, listener, options);
  };
};

export const removeEventListener = (element, eventName = '', listener, options = {}) => {
  element.removeEventListener(eventName, listener, options);
};

export const DOM = {
  window: globalThis.window,
  document: globalThis.window.document,
  body: globalThis.window.document.body,
};
