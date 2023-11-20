import { combineReducers } from "redux";

// Authentication
import Login from "./auth/login/reducer";

const rootReducer = combineReducers({
  // public
  Login,
});

export default rootReducer;
