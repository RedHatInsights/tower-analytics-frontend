import { ApiFeatureFlagReturnType } from '../FeatureFlags/types';
import {
  get,
  post,
  postWithPagination,
  deleteById,
  updateById,
  authenticatedFetch,
  deleteByIds,
} from './methods';
import { Params, ParamsWithPagination, ApiJson } from './types';

/* v0 endpoints */
export const clustersEndpoint = `/api/tower-analytics/v0/clusters/`;
export const notificationsEndpoint = `/api/tower-analytics/v0/notifications/`;
export const preflightEndpoint = `/api/tower-analytics/v0/authorized/`;

/* v1 endpoints */
export const jobExplorerEndpoint = '/api/tower-analytics/v1/job_explorer/';
export const hostExplorerEndpoint = '/api/tower-analytics/v1/host_explorer/';
export const eventExplorerEndpoint = '/api/tower-analytics/v1/event_explorer/';
export const ROIEndpoint = '/api/tower-analytics/v1/roi_templates/';
export const plansEndpoint = '/api/tower-analytics/v1/plans/';
export const planEndpoint = '/api/tower-analytics/v1/plan/';

/* page options endpoints */
export const jobExplorerOptionsEndpoint =
  '/api/tower-analytics/v1/job_explorer_options/';
export const ROITemplatesOptionsEndpoint =
  '/api/tower-analytics/v1/roi_templates_options/';
export const orgOptionsEndpoint =
  '/api/tower-analytics/v1/dashboard_organization_statistics_options/';
export const clustersOptionsEndpoint =
  '/api/tower-analytics/v1/dashboard_clusters_options/';
export const planOptionsEndpoint = '/api/tower-analytics/v1/plan_options/';
const hostExplorerOptionsEndpoint =
  '/api/tower-analytics/v1/host_explorer_options/';

const featuresEndpoint = '/api/featureflags/v0';

export const getFeatures = async (): Promise<ApiFeatureFlagReturnType> => {
  try {
    const url = new URL(featuresEndpoint, window.location.origin);
    const response = await authenticatedFetch(url.toString());
    return response.ok ? response.json() : {};
  } catch (_error) {
    return {};
  }
};

export const preflightRequest = (): Promise<Response> =>
  authenticatedFetch(preflightEndpoint);

export const readJobExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> => postWithPagination(jobExplorerEndpoint, params);

export const readJobExplorerOptions = (params: Params): Promise<ApiJson> =>
  post(jobExplorerOptionsEndpoint, params);

export const readEventExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> => postWithPagination(eventExplorerEndpoint, params);

export const readROI = (params: ParamsWithPagination): Promise<ApiJson> =>
  postWithPagination(ROIEndpoint, params);

export const readROIOptions = (params: Params): Promise<ApiJson> =>
  post(ROITemplatesOptionsEndpoint, params);

export const readHostExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> => postWithPagination(hostExplorerEndpoint, params);

export const readOrgOptions = (params: Params): Promise<ApiJson> =>
  post(orgOptionsEndpoint, params);

export const readHostExplorerOptions = (params: Params): Promise<ApiJson> =>
  post(hostExplorerOptionsEndpoint, params);

export const readPlans = (params: ParamsWithPagination): Promise<ApiJson> =>
  postWithPagination(plansEndpoint, params);

export const createPlan = (params: Params): Promise<ApiJson> =>
  post(planEndpoint, params);

export const readPlan = (id: number): Promise<ApiJson> =>
  get(`${planEndpoint}${id}/`);

export const deletePlan = (id: number): Promise<ApiJson> =>
  deleteById(planEndpoint, id);

export const deletePlans = (id: number[]): Promise<ApiJson> =>
  deleteByIds(plansEndpoint, id);

export const updatePlan = (id: string, params: Params): Promise<ApiJson> =>
  updateById(planEndpoint, id, params);

export const readPlanOptions = (params: Params = {}): Promise<ApiJson> =>
  get(planOptionsEndpoint, params);

export const readClusters = (): Promise<ApiJson> => get(clustersEndpoint);

export const readClustersOptions = (params: Params): Promise<ApiJson> =>
  post(clustersOptionsEndpoint, params);

export const readNotifications = (params: Params): Promise<ApiJson> =>
  get(notificationsEndpoint, params);
