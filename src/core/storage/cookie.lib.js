const daysToMilliseconds = duration => duration * 24 * 60 * 60 * 1000;

const getDurationTime = duration => {
  const date = new Date();

  date.setTime(date.getTime() + daysToMilliseconds(duration));

  return date.toGMTString();
};

export const writeCookie = (name, value, duration) => {
  const expires = duration ? `; expires=${getDurationTime(duration)}` : '';

  document.cookie = `${name}=${value}${expires}; path=/`;
};

export const readCookie = (name) => {
  const cookiesArr = document.cookie.split(';');

  const cookie = cookiesArr
    .map(item => {
      return item.trim().split('=');
    })
    .find(([cookieName]) => {
      return cookieName === name;
    });

  return cookie ? cookie[1] : null;
};

export const readAllCookies = () => {
  const result = {};
  const cookies = document.cookie.split(";");

  if (!document.cookie.length) {
    return result;
  }

  for (const cookie of cookies) {
    const [name, ...values] = cookie.split("=");

    result[name] = values.join('');
  }

  return result;
};

export const deleteCookie = (name) => {
  writeCookie(name, '', -1);
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name] = cookie.split("=");

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};
