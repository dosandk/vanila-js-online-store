import Proxy from './proxy.js';

const requestProxy = new Proxy({
  maxSize: 10
});

// NOTE. Patter. Adapter
const httpRequest = {
  async request (url = '', options = {}) {
    try {
      const urlString = url.toString();

      // NOTE: Pattern. Proxy
      if (requestProxy.has(urlString)) {
        return requestProxy.get(urlString);
      }

      const response = await fetch(urlString, options);
      const result = await response.json();

      requestProxy.set(urlString, result);

      return result;
    } catch (error) {
      throw new FetchError(error.message);
    }
  },

  async get(url = '', options = {}) {
    return await this.request(url, options);
  },

  async post(url = '', options = {}) {
    return await this.request(url, {
      type: 'POST',
      ...options
    });
  },

  async put(url = '', options = {}) {
    return await this.request(url, {
      type: 'PUT',
      ...options
    });
  },

  async delete(url = '', options = {}) {
    return await this.request(url, {
      type: 'DELETE',
      ...options
    });
  }
};

class FetchError extends Error {
  name = 'FetchError';
}

// handle uncaught failed fetch through
window.addEventListener('unhandledrejection', event => {
  if (event.reason instanceof FetchError) {
    console.error('Network error has occurred.');
  }
});

export default httpRequest;
