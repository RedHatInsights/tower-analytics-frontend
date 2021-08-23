import { ReportPageParams } from '../types';
import affectedHostsByPlaybook from './affectedHostsByPlaybook';
import changesMade from './changesMade';
import playbookRunRate from './playbookRunRate';
import hostsByOrganization from './hostsByOrganizations';
import jobsTasksByOrganization from './jobsTasksByOrganization';

const reports = [
  affectedHostsByPlaybook,
  changesMade,
  playbookRunRate,
  hostsByOrganization,
  jobsTasksByOrganization,
];

const defaultReport: ReportPageParams = {
  slug: 'unknown',
  name: 'Unknown',
  description: 'Unknown',
  categories: [] as string[],
};

export const getReport = (searchSlug: string): ReportPageParams =>
  reports.find(({ slug }) => slug === searchSlug) ?? defaultReport;

export default reports;
