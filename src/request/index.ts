import { Axios } from "axios";

const axios =  new Axios({
  timeout: 60 * 1000,
  withCredentials: true
})

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers["Content-Type"] = "application/json"
  config.headers["player"] = encodeURIComponent(localStorage.getItem("player")|| "") 

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export default axios