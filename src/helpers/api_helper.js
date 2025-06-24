import axios from "axios";
import { api } from "../config";
import { message as messAPI } from "antd";
import echo from "./echo";
// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(localStorage.getItem("authUser"))?.token;
axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
const msgKey = Math.random().toString();
const conf = {
  key: msgKey,
  content: "Đang xử lý...",
};
axios.interceptors.request.use(
  function (config) {
    if (config.url !== "/notification/list") {
      // messAPI.loading(conf);
    }
    const socketId = echo.connector.socket.id;
    if (socketId) config.headers['X-Socket-Id'] = socketId;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {

    if (
      response.data.success &&
      response.data.message !== "" &&
      response.data.message !== "success"
    ) {
      messAPI.destroy(msgKey);
      messAPI.success({ ...conf, content: response.data.message });
    } else if (!response.data.success && response.data.message !== "" && !(response.data instanceof Blob)) {
      console.log(response);
      
      messAPI.destroy(msgKey);
      messAPI.error({ ...conf, content: response.data.message });
    }
    return response.data ? response.data : response;
  },
  function (error) {
    switch (error.response?.status) {
      case 401:
        // Handle unauthorized access, e.g., redirect to login page
        // You can dispatch a logout action or perform any other required operations here
        window.location.href ='/login';
        break;

      default:
        break;
    }
    const defaultResponse = {
      data: [],
      success: false,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    };
    if (error?.response?.data?.message) {
      messAPI.error({ content: error.response.data.message });
    } else {
      messAPI.error({ content: defaultResponse.message });
    }

    return Promise.resolve(defaultResponse);
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
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
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
