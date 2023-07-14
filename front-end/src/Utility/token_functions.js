const getCookieValue = (name) => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
};

export const setCookie = (name, value, expirationDays) => {
  const date = new Date();
  date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

export const setAxiosHeaders = (axios) => {

  const token = getCookieValue('token'); // Replace 'getCookie' with your cookie retrieval logic

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    resetAxiosHeaders();
  }

}

export const resetAxiosHeaders = (axios) => {
  delete axios.defaults.headers.common['Authorization'];
};