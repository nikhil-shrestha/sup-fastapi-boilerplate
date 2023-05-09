import { takeLatest, call, put, all, select } from "redux-saga/effects";
import { API, Auth } from "aws-amplify";

import * as authActions from "./auth.actions";
import * as AuthType from "./auth.types";
import { notify } from "react-notify-toast";

import axiosConfig, { setAuthToken } from "../../config/axios.config";

export function* loadUserAsync() {
  if (localStorage["access_token"]) {
    setAuthToken(localStorage["access_token"]);
  }

  try {
    const { data: userData } = yield axiosConfig.get(`/users/me`);

    const { toaster } = yield select((state) => state.siteCoordinator);
    notify.show(
      "User loaded successfully",
      "custom",
      toaster.duration,
      toaster.success
    );

    yield put(authActions.loadUserSuccess(userData));
  } catch (error) {
    yield put(authActions.loadUserFail(error));
  }

  // try {
  //   yield Auth.currentSession();
  //   const { username, attributes } = yield Auth.currentAuthenticatedUser();
  //   const uid = attributes.sub;
  //   const userData = {
  //     username,
  //     uid,
  //     name: attributes.name,
  //     email: attributes.email,
  //     mode: attributes["custom:mode"],
  //     role: attributes["custom:role"],
  //   };
  //   yield put(authActions.loadUserSuccess(userData));
  // } catch (err) {
  //   console.error(err);
  //   yield put(authActions.loadUserFail(err));
  // }
}

export function* onSigninAsync({ payload: { formData, router } }) {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };
  try {
    const { data } = yield axiosConfig.post("/auth/login", null, {
      params: {
        ...formData,
      },
    });

    localStorage.setItem("access_token", data?.access_token);

    yield put(
      authActions.signinSuccess({
        data,
      })
    );

    if (data["access_token"]) {
      setAuthToken(data["access_token"]);
    }
    const { data: userData } = yield axiosConfig.get(`/users/me`);

    yield put(authActions.loadUserSuccess(userData));

    const { toaster } = yield select((state) => state.siteCoordinator);
    notify.show(
      "User Signed In Successfully",
      "custom",
      toaster.duration,
      toaster.success
    );
    // if (router) {
    //   console.log('router', router)
    //   if (
    //     router.location?.state &&
    //     router.location?.state.from &&
    //     router.location?.state?.from.pathname
    //   ) {
    //     const pathname = router.location?.state?.from.pathname + router.location?.state?.from.search
    //     router.push(pathname);
    //   } else {
    //     router.push("/home");
    //   }
    // }
  } catch (err) {
    console.error(err);
    const { toaster } = yield select((state) => state.siteCoordinator);
    notify.show(
      "Incorrect username or password",
      "custom",
      toaster.duration,
      toaster.success
    );
    yield put(authActions.signinFail(err?.data));

    // notify.show(err.message, "custom", toaster.duration, toaster.error);
    // if (err.code === "UserNotConfirmedException") {
    //   yield put(authActions.signinFail(err.message));
    // } else if (err.code === "UserNotFoundException") {
    //   yield put(authActions.signinFail(err.message));
    // } else if (err.code === "UserLambdaValidationException") {
    //   yield put(authActions.signinFail({ domain: err.message }));
    // } else {
    //   yield put(authActions.signinFail(err.message));
    // }
  }
}

export function* onSignupAsync({ payload: { formData, callback } }) {
  try {
    const { data } = yield axiosConfig.post(`/auth/register`, {
      ...formData,
    });

    localStorage.setItem("access_token", data?.access_token);

    setAuthToken(data?.access_token);

    const { data: userData } = yield axiosConfig.get(`/users/me`);

    yield put(authActions.loadUserSuccess(userData));

    if (callback) {
      // yield call(callback);
    }

    const { toaster } = yield select((state) => state.siteCoordinator);
    notify.show(
      "User registered successfully",
      "custom",
      toaster.duration,
      toaster.success
    );

    yield put(authActions.signupSuccess());
  } catch (err) {
    console.error(err);
    yield put(authActions.signupFail(err.message));
  }
}

export function* onVerifyAsync({ payload: { code, callback } }) {
  try {
    let email = localStorage.getItem("registerEmail");
    const response = yield Auth.confirmSignUp(email, code);

    if (callback) {
      yield call(callback, response);
    }

    yield put(authActions.verificationSuccess(response));
  } catch (err) {
    console.error(err);
    yield put(authActions.verificationFail(err.message));
  }
}

export function* signOutAsync({ payload: { history } }) {
  try {
    yield Auth.signOut();
    // history.push("/deploy");
    const { toaster } = yield select((state) => state.siteCoordinator);
    notify.show(
      "User Signed Out Successfully",
      "custom",
      toaster.duration,
      toaster.success
    );
    yield put(authActions.signoutSuccess());

    localStorage.removeItem("access_token");
  } catch (err) {
    console.error(err);
    yield put(authActions.signoutFail(err));
  }
}

export function* watchLoadUser() {
  yield takeLatest(AuthType.LOAD_USER_START, loadUserAsync);
}

export function* watchSignin() {
  yield takeLatest(AuthType.SIGN_IN_START, onSigninAsync);
}

export function* watchSignup() {
  yield takeLatest(AuthType.SIGN_UP_START, onSignupAsync);
}

export function* watchVerify() {
  yield takeLatest(AuthType.VERIFICATION_START, onVerifyAsync);
}

export function* watchSignout() {
  yield takeLatest(AuthType.SIGN_OUT_START, signOutAsync);
}

export function* authSagas() {
  yield all([
    call(watchSignin),
    call(watchSignup),
    call(watchSignout),
    call(watchLoadUser),
    call(watchVerify),
  ]);
}
