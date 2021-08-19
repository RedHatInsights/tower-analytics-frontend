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
].map((report, id) => ({ id: id + 1, ...report }));

const defaultReport: ReportPageParams = {
  name: 'Unknown',
  description: 'Unknown',
  categories: [] as string[],
};

export const getReport = (searchId: number): ReportPageParams =>
  reports.find(({ id }) => id === searchId) ?? defaultReport;

export default reports;
