import { takeLatest, call, put, all, select } from "redux-saga/effects";

import * as stepperActions from "./stepper.actions";
import * as StepperType from "./stepper.types";

import axiosConfig from "../../config/axios.config";

import { notify } from "react-notify-toast";

export function* onFetchFacilitiesAsync() {
  try {
    const { data } = yield axiosConfig.get(`/facilities`);

    yield put(stepperActions.fetchFacilitySuccess(data));
  } catch (err) {
    console.error(err);
    yield put(stepperActions.fetchFacilityFailure(err.message));
  }
}

export function* onFetchApplicationsAsync() {
  try {
    const { data } = yield axiosConfig.get(`/applications`);

    yield put(stepperActions.fetchApplicationsSuccess(data));
  } catch (err) {
    console.error(err);
    yield put(stepperActions.fetchApplicationsFailure(err.message));
  }
}

export function* onCreateAccountFacilitiesAsync({ payload: { formData, cb } }) {
  try {
    const { data } = yield axiosConfig.post(`/account-facilities`, formData);

    yield put(stepperActions.createAccountFacilitiesSuccess(data));
    if (cb) {
      yield cb();
    }
  } catch (err) {
    console.error(err);
    yield put(stepperActions.createAccountFacilitiesSuccess(err.message));
  }
}

export function* onFetchProductsAsync() {
  try {
    const { data } = yield axiosConfig.get(`/products/order`);

    yield put(stepperActions.fetchProductsSuccess(data));
  } catch (err) {
    console.error(err);
    // yield put(stepperActions.fetchProductsSuccess(err.message));
  }
}

export function* onCreateOrderAsync({ payload: { formData, cb } }) {
  try {
    const { data } = yield axiosConfig.post(`/orders`, formData);

    yield put(stepperActions.createOrderSuccess(data));
    if (cb) {
      yield cb();
    }
  } catch (err) {
    console.error(err);
    yield put(stepperActions.createOrderFailure(err.message));
  }
}

export function* onCreateAccountAccessPointAsync({
  payload: { formData, cb },
}) {
  try {
    const { data } = yield axiosConfig.post(`/account-ap`, formData);

    yield put(stepperActions.createAccountAccessPointSuccess(data));
    const { toaster } = yield select((state) => state.siteCoordinator);
    notify.show(
      "Order placed successfully",
      "custom",
      toaster.duration,
      toaster.success
    );
    if (cb) {
      yield cb();
    }
  } catch (err) {
    console.error(err);
    yield put(stepperActions.createAccountAccessPointSuccess(err.message));
    const { toaster } = yield select((state) => state.siteCoordinator);
    notify.show(
      "There was an error creating order",
      "custom",
      toaster.duration,
      toaster.success
    );
  }
}

export function* watchFetchFacilitiesAsync() {
  yield takeLatest(StepperType.FETCH_FACILITY_START, onFetchFacilitiesAsync);
}

export function* watchFetchApplicationsAsync() {
  yield takeLatest(
    StepperType.FETCH_APPLICATIONS_START,
    onFetchApplicationsAsync
  );
}

export function* watchCreateAccountFacilitiesAsync() {
  yield takeLatest(
    StepperType.CREATE_ACCOUNT_FACILITIES_START,
    onCreateAccountFacilitiesAsync
  );
}

export function* watchFetchProductsAsync() {
  yield takeLatest(StepperType.FETCH_PRODUCTS_START, onFetchProductsAsync);
}

export function* watchCreateOrderAsync() {
  yield takeLatest(StepperType.CREATE_ORDER_START, onCreateOrderAsync);
}

export function* watchCreateAccountAccessPointAsync() {
  yield takeLatest(
    StepperType.CREATE_ACCOUNT_ACCESS_POINT_START,
    onCreateAccountAccessPointAsync
  );
}

export function* stepperSagas() {
  yield all([
    call(watchFetchFacilitiesAsync),
    call(watchFetchApplicationsAsync),
    call(watchCreateAccountFacilitiesAsync),
    call(watchFetchProductsAsync),
    call(watchCreateOrderAsync),
    call(watchCreateAccountAccessPointAsync),
  ]);
}
