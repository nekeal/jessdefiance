import axios from 'axios';

export default () => {
  axios.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem("access-token");

    if(accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  });

};
