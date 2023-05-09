import * as StepperType from "./stepper.types";

export const fetchFacilityStart = () => ({
  type: StepperType.FETCH_FACILITY_START,
});

export const fetchFacilitySuccess = (data) => ({
  type: StepperType.FETCH_FACILITY_SUCCESS,
  payload: data,
});

export const fetchFacilityFailure = (error) => ({
  type: StepperType.FETCH_FACILITY_FAILURE,
  payload: error,
});

export const fetchApplicationsStart = () => ({
  type: StepperType.FETCH_APPLICATIONS_START,
});

export const fetchApplicationsSuccess = (data) => ({
  type: StepperType.FETCH_APPLICATIONS_SUCCESS,
  payload: data,
});

export const fetchApplicationsFailure = (error) => ({
  type: StepperType.FETCH_APPLICATIONS_FAILURE,
  payload: error,
});

export const createAccountFacilitiesStart = (formData, cb) => ({
  type: StepperType.CREATE_ACCOUNT_FACILITIES_START,
  payload: { formData, cb },
});

export const createAccountFacilitiesSuccess = (data) => ({
  type: StepperType.CREATE_ACCOUNT_FACILITIES_SUCCESS,
  payload: data,
});

export const createAccountFacilitiesFailure = (error) => ({
  type: StepperType.CREATE_ACCOUNT_FACILITIES_FAILURE,
  payload: error,
});

export const fetchProductsStart = () => ({
  type: StepperType.FETCH_PRODUCTS_START,
});

export const fetchProductsSuccess = (data) => ({
  type: StepperType.FETCH_PRODUCTS_SUCCESS,
  payload: data,
});

export const fetchProductsFailure = (error) => ({
  type: StepperType.FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const createOrderStart = (formData, cb) => ({
  type: StepperType.CREATE_ORDER_START,
  payload: { formData, cb },
});

export const createOrderSuccess = (data) => ({
  type: StepperType.CREATE_ORDER_SUCCESS,
  payload: data,
});

export const createOrderFailure = (error) => ({
  type: StepperType.CREATE_ORDER_FAILURE,
  payload: error,
});

export const createAccountAccessPointStart = (formData, cb) => ({
  type: StepperType.CREATE_ACCOUNT_ACCESS_POINT_START,
  payload: { formData, cb },
});

export const createAccountAccessPointSuccess = (data) => ({
  type: StepperType.CREATE_ACCOUNT_ACCESS_POINT_SUCCESS,
  payload: data,
});

export const createAccountAccessPointFailure = (error) => ({
  type: StepperType.CREATE_ACCOUNT_ACCESS_POINT_FAILURE,
  payload: error,
});
