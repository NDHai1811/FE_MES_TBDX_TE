import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    API_ERROR,
    RESET_LOGIN_FLAG
  } from "./actionTypes";
  
  export const loginUser = (user, history, setLoading) => {
    return {
      type: LOGIN_USER,
      payload: { user, history, setLoading },
    };
  };
  
  export const loginSuccess = user => {
    return {
      type: LOGIN_SUCCESS,
      payload: user,
    };
  };
  
  export const logoutUser = history => {
    return {
      type: LOGOUT_USER,
      payload: { history },
    };
  };
  
  export const logoutUserSuccess = () => {
    return {
      type: LOGOUT_USER_SUCCESS,
      payload: {},
    };
  };
  
  export const apiError = error => {
    return {
      type: API_ERROR,
      payload: error,
    };
  };
  
  export const resetLoginFlag = () => {
    return {
      type: RESET_LOGIN_FLAG,
    }
  }
  