import {
  get,
  post,
  postWithPagination,
  deleteById,
  updateById,
  authenticatedFetch
} from './methods';
import {
  ReadParams,
  ReadParamsWithPagination,
  DeleteParams,
  UpdateParams
} from './types';

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
export const jobExplorerOptionsEndpoint = '/api/tower-analytics/v1/job_explorer_options/';
export const ROITemplatesOptionsEndpoint = '/api/tower-analytics/v1/roi_templates_options/';
export const orgOptionsEndpoint = '/api/tower-analytics/v1/dashboard_organization_statistics_options/';
export const clustersOptionsEndpoint = '/api/tower-analytics/v1/dashboard_clusters_options/';
export const planOptionsEndpoint = '/api/tower-analytics/v1/plan_options/';

const featuresEndpoint = '/api/featureflags/';

export const getFeatures = async () => {
  try {
    const url = new URL(featuresEndpoint, window.location.origin);
    const response = await authenticatedFetch(url.toString());
    return response.ok ? response.json() : {};
  } catch (_error) {
    return {};
  }
};

export const preflightRequest = () => authenticatedFetch(preflightEndpoint);

export const readJobExplorer = ({ params }: ReadParamsWithPagination) => postWithPagination(jobExplorerEndpoint, params);
export const readJobExplorerOptions = ({ params }: ReadParams) => post(jobExplorerOptionsEndpoint, params);

export const readEventExplorer = ({ params }: ReadParamsWithPagination) => postWithPagination(eventExplorerEndpoint, params);

export const readROI = ({ params }: ReadParamsWithPagination) => postWithPagination(ROIEndpoint, params);
export const readROIOptions = ({ params }: ReadParams) => post(ROITemplatesOptionsEndpoint, params);

export const readHostExplorer = ({ params }: ReadParamsWithPagination) => postWithPagination(hostExplorerEndpoint, params);
export const readOrgOptions = ({ params }: ReadParams) => post(orgOptionsEndpoint, params);

export const readPlans = ({ params }: ReadParamsWithPagination) => postWithPagination(plansEndpoint, params);
export const createPlan = ({ params }: ReadParams) => post(planEndpoint, params);
export const readPlan = ({ params }: ReadParams) => post(plansEndpoint, params);
export const deletePlan = ({ id }: DeleteParams) => deleteById(planEndpoint, id);
export const updatePlan = ({ id, params = {} }: UpdateParams) => updateById(planEndpoint, id, params);
export const readPlanOptions = ({ params }: ReadParams = { params: {} }) => get(planOptionsEndpoint, params);

export const readClusters = () => get(clustersEndpoint);
export const readClustersOptions = ({ params }: ReadParams) => post(clustersOptionsEndpoint, params);

export const readNotifications = ({ params }: ReadParams) => get(notificationsEndpoint, params);
