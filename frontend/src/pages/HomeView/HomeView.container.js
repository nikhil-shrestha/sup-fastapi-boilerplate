import { connect } from "react-redux";
import {
  createAccountAccessPointStart,
  createAccountFacilitiesStart,
  createOrderStart,
  fetchApplicationsStart,
  fetchFacilityStart,
  fetchProductsStart,
} from "../../store/stepper/stepper.actions";

const mapStateToProps = (state) => ({
  stepper: state.stepper,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchFacilityStart: () => dispatch(fetchFacilityStart()),
  onFetchApplicationsStart: () => dispatch(fetchApplicationsStart()),
  onCreateAccountFacilitiesStart: (formData, cb) =>
    dispatch(createAccountFacilitiesStart(formData, cb)),
  onFetchProductsStart: () => dispatch(fetchProductsStart()),
  onCreateOrderStart: (formData, cb) =>
    dispatch(createOrderStart(formData, cb)),
  oncreateAccountAccessPointStart: (formData, cb) =>
    dispatch(createAccountAccessPointStart(formData, cb)),
});

const container = connect(mapStateToProps, mapDispatchToProps);

export default container;
