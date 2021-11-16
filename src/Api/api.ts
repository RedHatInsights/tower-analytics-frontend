import { ApiFeatureFlagReturnType } from '../FeatureFlags/types';
import {
  get,
  post,
  postWithPagination,
  deleteById,
  updateById,
  authenticatedFetch,
  deleteByIds,
  postWithFileReturn,
} from './methods';
import {
  ReadEndpointFnc,
  Params,
  ParamsWithPagination,
  ApiJson,
  PDFParams,
} from './types';

export enum Endpoint {
  /* v0 endpoints */
  notifications = '/api/tower-analytics/v0/notifications/',
  preflight = '/api/tower-analytics/v0/authorized/',
  clusters = '/api/tower-analytics/v0/clusters/',

  /* v1 endpoints */
  pdfGenerate = '/api/tower-analytics/v1/generate_pdf/',
  jobExplorer = '/api/tower-analytics/v1/job_explorer/',
  hostExplorer = '/api/tower-analytics/v1/host_explorer/',
  eventExplorer = '/api/tower-analytics/v1/event_explorer/',
  ROI = '/api/tower-analytics/v1/roi_templates/',
  plans = '/api/tower-analytics/v1/plans/',
  plan = '/api/tower-analytics/v1/plan/',

  /* page options endpoints */
  jobExplorerOptions = '/api/tower-analytics/v1/job_explorer_options/',
  ROITemplatesOptions = '/api/tower-analytics/v1/roi_templates_options/',
  orgOptions = '/api/tower-analytics/v1/dashboard_organization_statistics_options/',
  clustersOptions = '/api/tower-analytics/v1/dashboard_clusters_options/',
  planOptions = '/api/tower-analytics/v1/plan_options/',
  eventExplorerOptions = '/api/tower-analytics/v1/event_explorer_options/',
  hostExplorerOptions = '/api/tower-analytics/v1/host_explorer_options/',

  features = '/api/featureflags/v0',
}

export const getFeatures = async (): Promise<ApiFeatureFlagReturnType> => {
  try {
    const url = new URL(Endpoint.features, window.location.origin);
    const response = await authenticatedFetch(url.toString());
    return response.ok ? response.json() : { toggles: [] };
  } catch (error) {
    console.error('feature flag fetch failed', error);
    return { toggles: [] };
  }
};

export const preflightRequest = (): Promise<Response> =>
  authenticatedFetch(Endpoint.preflight);

export const readJobExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> => postWithPagination(Endpoint.jobExplorer, params);

export const readJobExplorerOptions = (params: Params): Promise<ApiJson> =>
  post(Endpoint.jobExplorerOptions, params);

export const readEventExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> => postWithPagination(Endpoint.eventExplorer, params);

export const readEventExplorerOptions = (params: Params): Promise<ApiJson> =>
  post(Endpoint.eventExplorerOptions, params);

export const readROI = (params: ParamsWithPagination): Promise<ApiJson> =>
  postWithPagination(Endpoint.ROI, params);

export const readROIOptions = (params: Params): Promise<ApiJson> =>
  post(Endpoint.ROITemplatesOptions, params);

export const readHostExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> => postWithPagination(Endpoint.hostExplorer, params);

export const readOrgOptions = (params: Params): Promise<ApiJson> =>
  post(Endpoint.orgOptions, params);

export const readHostExplorerOptions = (params: Params): Promise<ApiJson> =>
  post(Endpoint.hostExplorerOptions, params);

export const readPlans = (params: ParamsWithPagination): Promise<ApiJson> =>
  postWithPagination(Endpoint.plans, params);

export const createPlan = (params: Params): Promise<ApiJson> =>
  post(Endpoint.plan, params);

export const readPlan = (id: number): Promise<ApiJson> =>
  get(`${Endpoint.plan}${id}/`);

export const deletePlan = (id: number): Promise<ApiJson> =>
  deleteById(Endpoint.plan, id);

export const deletePlans = (id: number[]): Promise<ApiJson> =>
  deleteByIds(Endpoint.plans, id);

export const updatePlan = (id: string, params: Params): Promise<ApiJson> =>
  updateById(Endpoint.plan, id, params);

export const readPlanOptions = (params: Params): Promise<ApiJson> =>
  get(Endpoint.planOptions, params);

export const readClusters = (): Promise<ApiJson> => get(Endpoint.clusters);

export const readClustersOptions = (params: Params): Promise<ApiJson> =>
  post(Endpoint.clustersOptions, params);

export const readNotifications = (params: Params): Promise<ApiJson> =>
  get(Endpoint.notifications, params);

export const generatePdf = (params: PDFParams): Promise<void> =>
  postWithFileReturn(Endpoint.pdfGenerate, params);

/**
 * Used to convert the string representation of the path to the
 * function which handles it. It is not covering endpoints which
 * are not using the default params to read from the endpoint, like
 * updating by ID, searching by id or the pdf generator params.
 */
export const endpointFunctionMap = (endpoint: Endpoint): ReadEndpointFnc => {
  switch (endpoint) {
    case Endpoint.jobExplorer:
      return readJobExplorer;
    case Endpoint.jobExplorerOptions:
      return readJobExplorerOptions;
    case Endpoint.eventExplorer:
      return readEventExplorer;
    case Endpoint.eventExplorerOptions:
      return readEventExplorerOptions;
    case Endpoint.ROI:
      return readROI;
    case Endpoint.ROITemplatesOptions:
      return readROIOptions;
    case Endpoint.hostExplorer:
      return readHostExplorer;
    case Endpoint.hostExplorerOptions:
      return readHostExplorerOptions;
    case Endpoint.orgOptions:
      return readOrgOptions;
    case Endpoint.plans:
      return readPlans;
    case Endpoint.planOptions:
      return readPlanOptions;
    case Endpoint.clustersOptions:
      return readClustersOptions;
    case Endpoint.notifications:
      return readNotifications;
    default:
      throw new Error(`${endpoint} is not found in the api mapper.`);
  }
};
