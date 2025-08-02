import { combineReducers } from "redux";

// Authentication
import Login from "./auth/login/reducer";
import chatSlice from "./chat/chatSlice";

const rootReducer = combineReducers({
  // public
  Login,
  chatSlice,
});

export default rootReducer;
