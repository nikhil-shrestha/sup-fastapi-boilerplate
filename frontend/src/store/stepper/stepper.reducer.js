import * as StepperType from "./stepper.types";

const INITIAL_STATE = {
  facilities: [],
  applications: [],
  products: [],
  noOfAccessPoint: null,
  error: null,
  loading: false,
  qrCode: null,
  accountAccessPointLoader: false,
  no_of_access_points: 1,
  no_of_devices: 1,
};

const stepperReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case StepperType.FETCH_FACILITY_START:
    case StepperType.FETCH_APPLICATIONS_START:
    case StepperType.CREATE_ACCOUNT_FACILITIES_START:
    case StepperType.FETCH_PRODUCTS_START:
    case StepperType.CREATE_ORDER_START:
      return {
        ...state,
        loading: true,
      };

    case StepperType.CREATE_ACCOUNT_ACCESS_POINT_START:
      return {
        ...state,
        loading: true,
        accountAccessPointLoader: true,
      };

    case StepperType.FETCH_FACILITY_SUCCESS:
      return {
        ...state,
        facilities: payload,
        loading: false,
      };

    case StepperType.FETCH_APPLICATIONS_SUCCESS:
      return {
        ...state,
        applications: payload,
        loading: false,
      };

    case StepperType.CREATE_ACCOUNT_FACILITIES_SUCCESS:
      return {
        ...state,
        noOfAccessPoint: payload?.no_of_access_points,
        no_of_devices: payload?.no_of_devices,
        no_of_access_points:payload?.no_of_access_points,
        loading: false,
      };

    case StepperType.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: payload,
        loading: false,
      };

    case StepperType.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case StepperType.CREATE_ACCOUNT_ACCESS_POINT_SUCCESS:
      return {
        ...state,
        qrCode: payload?.qr_code,
        serial: payload?.serial_id,
        loading: false,
        accountAccessPointLoader: false,
      };

    case StepperType.FETCH_FACILITY_FAILURE:
    case StepperType.FETCH_APPLICATIONS_FAILURE:
    case StepperType.CREATE_ACCOUNT_FACILITIES_FAILURE:
    case StepperType.FETCH_PRODUCTS_FAILURE:
    case StepperType.CREATE_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case StepperType.CREATE_ACCOUNT_ACCESS_POINT_FAILURE:
      return {
        ...state,
        loading: false,
        accountAccessPointLoader: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default stepperReducer;
