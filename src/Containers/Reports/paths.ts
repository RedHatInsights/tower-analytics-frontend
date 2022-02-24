import { Paths } from '../../paths';

const paths = {
  get: `${Paths.reports}`,
  details: [`${Paths.reports}/:slug`, '/automation_calculator'],
  getDetails: (slug: string): string => `${Paths.reports}/${slug}`,
};

export default paths;
