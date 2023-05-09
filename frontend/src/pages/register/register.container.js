import { connect } from "react-redux";
import { signupStart } from "../../store/auth/auth.actions";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  onSignupStart: (formdata, callback) =>
    dispatch(signupStart(formdata, callback)),
});

const container = connect(mapStateToProps, mapDispatchToProps);

export default container;
