import * as types from './siteCoordinator.types';

const INITIAL_STATE = {
  config: {},
  deploy: {},
  toaster: {
    "error": { "background": "#e48490", "text": "#FFFFFF" },
    "success": { "background": "#77ab59", "text": "#FFFFFF" },
    "duration": 2000
  },
};

const siteCoordinatorReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.UPDATE_CONFIG_INFO:
      return {
        ...state,
        config: payload
      };

    case types.UPDATE_DEPLOY:
      return {
        ...state,
        deploy: payload
      };

    default:
      return state;
  }
};

export default siteCoordinatorReducer;
