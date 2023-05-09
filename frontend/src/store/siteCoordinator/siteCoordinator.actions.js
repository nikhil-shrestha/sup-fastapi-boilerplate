import * as types from './siteCoordinator.types';

export const updateConfig = (configInfo) => ({
  type: types.UPDATE_CONFIG_INFO,
  payload: configInfo
});

export const updateDeploy = (configInfo) => ({
  type: types.UPDATE_DEPLOY,
  payload: configInfo
});