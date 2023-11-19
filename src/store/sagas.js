import { all, fork } from "redux-saga/effects";
//layout
//Auth
import AuthSaga from "./auth/login/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AuthSaga),
  ]);
}
