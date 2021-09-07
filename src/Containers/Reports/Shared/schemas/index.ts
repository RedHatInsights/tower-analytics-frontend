import { ReportPageParams } from '../types';
import affectedHostsByPlaybook from './affectedHostsByPlaybook';
import changesMade from './changesMade';
import playbookRunRate from './playbookRunRate';

const reports = [affectedHostsByPlaybook, changesMade, playbookRunRate];

const defaultReport: ReportPageParams = {
  slug: 'unknown',
  name: 'Unknown',
  description: 'Unknown',
  categories: [] as string[],
};

export const getReport = (searchSlug: string): ReportPageParams =>
  reports.find(({ slug }) => slug === searchSlug) ?? defaultReport;

export default reports;
