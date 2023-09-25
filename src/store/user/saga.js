import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import {
    GET_USER_LIST,
    ADD_NEW_USER,
    UPDATE_USER,
    DELETE_USER
} from "./actionType";
import {
    UserApiResponseSuccess,
    UserApiResponseError,
    addUserSuccess,
    addUserFail,
    updateUserSuccess,
    updateUserFail,
    deleteUserSuccess,
    deleteUserFail
} from "./action";

//Include Both Helper File with needed methods
import {
    getUserList as getUserListApi,
    addNewUser,
    updateUser,
    deleteUser
}
    from "../../helpers/fakebackend_helper";

function* getUserList({payload:params}) {
    try {
        const response = yield call(getUserListApi,params);
        yield put(UserApiResponseSuccess(GET_USER_LIST, response.data));
    } catch (error) {
        yield put(UserApiResponseError(GET_USER_LIST, error));
    }
}

function* onAddNewUser({ payload: user }) {
    try {
        const response = yield call(addNewUser, user);
        yield put(addUserSuccess(response));
    } catch (error) {
        yield put(addUserFail(error));
    }
}
function* onUpdateUser({ payload: user }) {
    try {
        const response = yield call(updateUser, user);
        yield put(updateUserSuccess(response));
    } catch (error) {
        yield put(updateUserFail(error));
    }
}
function* onDeleteUser({ payload: user }) {
    try {
        const response = yield call(deleteUser, user);
        yield put(deleteUserSuccess({ user, ...response }));
    } catch (error) {
        yield put(deleteUserFail(error));
    }
}
export function* watchGetUserList() {
    yield takeEvery(GET_USER_LIST, getUserList);
}

export function* watchAddNewUser() {
    yield takeEvery(ADD_NEW_USER, onAddNewUser);
}

export function* watchUpdateUser() {
    yield takeEvery(UPDATE_USER, onUpdateUser);
}
export function* watchDeleteUser() {
    yield takeEvery(DELETE_USER, onDeleteUser);
}


function* usersSaga() {
    yield all(
        [
            fork(watchGetUserList),
            fork(watchAddNewUser),
            fork(watchUpdateUser),
            fork(watchDeleteUser),
        ]
    );
}

export default usersSaga;