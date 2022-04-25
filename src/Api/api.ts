import { ApiFeatureFlagReturnType } from '../FeatureFlags/types';
import {
  get,
  post,
  postWithPagination,
  saveROIData,
  deleteById,
  updateById,
  authenticatedFetch,
  deleteByIds,
  postWithFileReturn,
  postWithEmail,
} from './methods';
import {
  ReadEndpointFnc,
  Params,
  ParamsWithPagination,
  ApiJson,
  PDFParams,
  NotificationParams,
  saveROIParams,
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
  probeTemplates = '/api/tower-analytics/v1/probe_templates/',
  ROI = '/api/tower-analytics/v1/roi_templates/',
  costEffortROI = '/api/tower-analytics/v1/roi_cost_effort_data/',
  plans = '/api/tower-analytics/v1/plans/',
  plan = '/api/tower-analytics/v1/plan/',
  sendEmail = 'api/tower-analytics/v1/send_email/',
  readRbacGroups = 'api/tower-analytics/v1/rbac_groups/',
  readRbacPrincipals = 'api/tower-analytics/v1/rbac_principals/',
  report = '/api/tower-analytics/v1/report/',
  reports = '/api/tower-analytics/v1/reports/',

  /* page options endpoints */
  jobExplorerOptions = '/api/tower-analytics/v1/job_explorer_options/',
  ROIOptions = '/api/tower-analytics/v1/roi_templates_options/',
  orgOptions = '/api/tower-analytics/v1/dashboard_organization_statistics_options/',
  clustersOptions = '/api/tower-analytics/v1/dashboard_clusters_options/',
  planOptions = '/api/tower-analytics/v1/plan_options/',
  eventExplorerOptions = '/api/tower-analytics/v1/event_explorer_options/',
  hostExplorerOptions = '/api/tower-analytics/v1/host_explorer_options/',
  probeTemplatesOptions = '/api/tower-analytics/v1/probe_templates_options/',

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

export const saveROI = (params: saveROIParams): Promise<ApiJson> => {
  return saveROIData(Endpoint.costEffortROI, params);
};

export const readROIOptions = (params: Params): Promise<ApiJson> =>
  post(Endpoint.ROIOptions, params);

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

export const readProbeTemplates = (
  params: ParamsWithPagination
): Promise<ApiJson> => post(Endpoint.probeTemplates, params);

export const readProbeTemplatesOptions = (params: Params): Promise<ApiJson> =>
  get(Endpoint.probeTemplatesOptions, params);

export const readReports = (params: ParamsWithPagination): Promise<ApiJson> =>
  postWithPagination(Endpoint.reports, params);

export const readReport = (slug: string): Promise<ApiJson> =>
  get(`${Endpoint.report}${slug}/`);

export const generatePdf = async (
  params: PDFParams,
  meta: NotificationParams
): Promise<void> => {
  let url = Endpoint.pdfGenerate.toString();
  if (typeof params.dataFetchingParams.token !== 'undefined')
    url =
      Endpoint.pdfGenerate +
      '?token=' +
      params.dataFetchingParams.token +
      '&slug=' +
      params.slug;
  return postWithFileReturn(url, params, meta);
};

export const sendEmail = (
  params: Params,
  meta: NotificationParams
): Promise<void> => postWithEmail(Endpoint.sendEmail, params, meta);

export const readRbacGroups = (): Promise<ApiJson> =>
  get(Endpoint.readRbacGroups);

export const readRbacPrincipals = (uuid: string): Promise<ApiJson> =>
  get(`${Endpoint.readRbacPrincipals}${uuid}/`);

/**
 * This mapper is used by the reports to map url strings to functions
 * This function should be used if you want to map dynamically to an endpoint
 * from an URL. In general the exported functions should be preferred.
 *
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
    case Endpoint.ROIOptions:
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
    case Endpoint.probeTemplates:
      return readProbeTemplates;
    case Endpoint.probeTemplatesOptions:
      return readProbeTemplatesOptions;
    default:
      throw new Error(`${endpoint} is not found in the api mapper.`);
  }
};
