import { Paths } from '../../paths';

const paths = {
  get: `${Paths.reports}`,
  details: `${Paths.reports}/:slug`,
  getDetails: (slug: string): string => `${Paths.reports}/${slug}`,
};

export default paths;
