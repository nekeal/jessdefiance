import axios from "axios";

export function login(username, password) {
  return axios
    .post('/auth/jwt/create/', {
      username, password
    })
    .then(response => {
      localStorage.setItem('access-token', response.data.access);
      localStorage.setItem('refresh-token', response.data.refresh);
    })
    .catch(error => {
      throw error.response.data;
    });
}

export function logout() {
  localStorage.removeItem('access-token');
  localStorage.removeItem('refresh-token');
}
