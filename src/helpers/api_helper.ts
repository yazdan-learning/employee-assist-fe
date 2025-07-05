import axios from "axios";
import { handleError } from "./error-handler";

// default
axios.defaults.baseURL = "";

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
// content type
// let authUser: any = (localStorage.getItem("authUser"));

// intercepting to capture errors
axios.interceptors.response.use(
  function (response: any) {
    return response.data ? response.data : response;
  },
  function (error: any) {
    // Get the error details from the response
    const errorResponse = error.response || {};
    
    // Extract server error messages from the errors array for 400 status codes
    let serverMessage = errorResponse.data?.message || error.message;
    
    // For 400 status codes, check if there are specific error messages in the errors array
    if (errorResponse.status === 400 && errorResponse.data?.errors && Array.isArray(errorResponse.data.errors)) {
      // Join multiple error messages with a separator, or use the first one
      serverMessage = errorResponse.data.errors.join(', ') || serverMessage;
    }
    
    const errorData = {
      status: errorResponse.status,
      message: serverMessage,
      data: errorResponse.data
    };

    // Handle the error using our error handler - only show notifications, no redirects
    handleError(errorData, {
      shouldRedirect: false // Let components handle navigation
    });

    return Promise.reject(errorData);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: any) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url: any, params: any) => {
    let response: any;

    const paramKeys: any = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url: any, data: any) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url: any, data: any) => {
    return axios.patch(url, data);
  };

  put = (url: any, data: any) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url: any, config: any) => {
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