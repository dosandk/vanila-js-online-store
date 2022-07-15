import {
  readCookie,
  writeCookie,
  deleteCookie,
  deleteAllCookies,
  readAllCookies
} from "./cookie.lib.js";

export default class CookieAdapter {
  add (key, value) {
    return writeCookie(key, value);
  }

  get (key) {
    return readCookie(key);
  }

  remove (key) {
    return deleteCookie(key);
  }

  getAll () {
    return readAllCookies();
  }

  removeAll () {
    deleteAllCookies();
  }
}
