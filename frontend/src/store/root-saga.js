import { all, call } from "redux-saga/effects";

import { authSagas } from "./auth/auth.sagas";
import { stepperSagas } from "./stepper/stepper.sagas";

export default function* rootSaga() {
  yield all([call(authSagas), call(stepperSagas)]);
}
