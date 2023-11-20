import { SET_PROFILE_USER } from "./actionType";

const INIT_STATE = {
  userInfo: {},
};

const User = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_PROFILE_USER:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return { ...state };
  }
};

export default User;
