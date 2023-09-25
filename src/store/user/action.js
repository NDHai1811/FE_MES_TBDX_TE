import {
    GET_USER_LIST,
    ADD_NEW_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAIL,
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    API_PENDDING,
    RESET_USER_FLAG,
    SET_PROFILE_USER
} from "./actionType";

// common success
export const UserApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const UserApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getUserList = () => ({
    type: GET_USER_LIST,
});
export const addNewUser = user => ({
    type: ADD_NEW_USER,
    payload: user,
});

export const addUserSuccess = user => ({
    type: ADD_USER_SUCCESS,
    payload: user,
});

export const addUserFail = error => ({
    type: ADD_USER_FAIL,
    payload: error,
});

export const updateUser = user => ({
    type: UPDATE_USER,
    payload: user,
});

export const updateUserSuccess = user => ({
    type: UPDATE_USER_SUCCESS,
    payload: user,
});

export const updateUserFail = error => ({
    type: UPDATE_USER_FAIL,
    payload: error,
});

export const deleteUser = user => ({
    type: DELETE_USER,
    payload: user,
});

export const deleteUserSuccess = user => ({
    type: DELETE_USER_SUCCESS,
    payload: user,
});

export const deleteUserFail = error => ({
    type: DELETE_USER_FAIL,
    payload: error,
});

export const loadingUser = () => {
    return {
        type: API_PENDDING,
    }
};

export const setUserProfile = user =>({
    type: SET_PROFILE_USER,
    payload: user,
})

export const resetUserFlag = () => {
    return {
      type: RESET_USER_FLAG,
    }
  }