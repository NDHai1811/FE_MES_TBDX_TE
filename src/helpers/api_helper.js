import axios from "axios";
import { api } from "../config"; 
import {message as messAPI} from "antd";
// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
console.log(typeof localStorage.getItem("authUser"));
const token = JSON.parse(localStorage.getItem("authUser"))?.token;
axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
const msgKey = Math.random().toString();
const conf = {
    key: msgKey,
    content: 'Đang xử lý...',
};
axios.interceptors.request.use(function (config) {
  if(config.url !== '/notification/list'){
    // messAPI.loading(conf);
  }
  
  return config;
}, function (error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(
  function (response) {
    if(response.data.success && (response.data.message !== '' && response.data.message !== 'success')){
      messAPI.destroy(msgKey);
      messAPI.success({...conf, content: response.data.message});
    }else if(!response.data.success && response.data.message !== ''){
      messAPI.destroy(msgKey);
      messAPI.error({...conf, content: response.data.message});
    }
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error?.response?.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        return window.location.href = '/login';
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    messAPI.error({...conf, content: error.message});
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};


class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = async (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = await axios.get(`${url}`);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };