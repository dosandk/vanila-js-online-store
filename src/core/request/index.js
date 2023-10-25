import Proxy from "./proxy.js";

const requestProxy = new Proxy({
  maxSize: 10,
});

const collection = [];

const transform = (data) => {
  const {
    id = "",
    images = [],
    rating = 0,
    price = 0,
    title = "",
    description = "",
  } = data;

  const result = {
    id,
    images: [images[0]],
    rating,
    price,
    title,
    description,
  };

  collection.push(result);

  return result;
};

// NOTE Patter. Adapter
const httpRequest = {
  async request(url = "", options = {}) {
    try {
      const urlString = url.toString();

      // NOTE: Pattern. Proxy
      if (requestProxy.has(urlString)) {
        return requestProxy.get(urlString);
      }

      const response = await fetch(urlString, options);
      const result = await response.json();

      const data = result.map((item) => transform(item));

      requestProxy.set(urlString, data);

      return data;
    } catch (error) {
      throw new FetchError(error.message);
    }
  },

  async get(url = "", options = {}) {
    return await this.request(url, options);
  },

  async post(url = "", options = {}) {
    return await this.request(url, {
      type: "POST",
      ...options,
    });
  },

  async put(url = "", options = {}) {
    return await this.request(url, {
      type: "PUT",
      ...options,
    });
  },

  async delete(url = "", options = {}) {
    return await this.request(url, {
      type: "DELETE",
      ...options,
    });
  },
};

class FetchError extends Error {
  name = "FetchError";
}

// handle uncaught failed fetch through
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason instanceof FetchError) {
    console.error("Network error has occurred.");
  }
});

export default httpRequest;
