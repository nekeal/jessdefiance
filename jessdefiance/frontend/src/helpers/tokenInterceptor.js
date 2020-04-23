import axios from 'axios';

export default history => {

  axios.interceptors.response.use( (response) => {
    // Return a successful response back to the calling service
    return response;
  }, (error) => {
    // Return any error which is not due to authentication back to the calling service
    if (error.response.status !== 401 || error.config.url === '/auth/jwt/create/') {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    const refreshToken = localStorage.getItem('refresh-token');

    // Logout user if token refresh didn't work or there is no refresh-token
    if (error.config.url === '/auth/jwt/refresh/' || !refreshToken) {
      history.push("/login");
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    // Try request again with new token
    return axios
      .post('/auth/jwt/refresh/', { refresh: refreshToken })
      .then(response => {
        localStorage.setItem('access-token', response.data.access);
        localStorage.setItem('refresh-token', response.data.refresh);

        return response.data.token;
      })
      .then((token) => {

        // New request with new token
        const config = error.config;
        config.headers['Authorization'] = `Bearer ${token}`;

        return new Promise((resolve, reject) => {
          axios.request(config).then(response => {
            resolve(response);
          }).catch((error) => {
            reject(error);
          })
        });

      })
      .catch((error) => {
        throw error;
      });
  });
}
