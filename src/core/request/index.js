const httpRequest = {
  async request (url = '', options = {}) {
    try {
      const response = await fetch(url, options);

      return await response.json();
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

  constructor(message) {
    super(message);
  }
}

// handle uncaught failed fetch through
window.addEventListener('unhandledrejection', event => {
  if (event.reason instanceof FetchError) {
    console.error('Network error has occurred.');
  }
});

export default httpRequest;
