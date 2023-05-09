import { combineReducers } from "redux";

import authReducer from "./auth/auth.reducer";
import siteCoordinatorReducer from "./siteCoordinator/siteCoordinator.reducer";
import stepperReducer from "./stepper/stepper.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  siteCoordinator: siteCoordinatorReducer,
  stepper: stepperReducer,
});

export default rootReducer;
