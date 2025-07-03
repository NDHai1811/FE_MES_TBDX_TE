import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

import { postFakeLogin } from "../../../helpers/fakebackend_helper";
import axios from "axios";
// const fireBaseBackend = getFirebaseBackend();
function* loginUser({ payload: { user, history, setLoading } }) {
  setLoading(true);
  const response = yield call(postFakeLogin, {
    username: user.username,
    password: user.password,
  });
  setLoading(false);
  if (response.success === true) {
    localStorage.setItem("authUser", JSON.stringify(response.data));
    yield put(loginSuccess(response));
    const searchParams = new URLSearchParams(history.location.search);
    const redirect = searchParams.get("redirect") || "/";
    history.push(redirect ?? "/screen");
  } else {
    yield put(apiError(response));
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // const response = yield call(fireBaseBackend.logout);
      // yield put(logoutUserSuccess(LOGOUT_USER, response));
    } else {
      yield put(logoutUserSuccess(LOGOUT_USER, true));
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
