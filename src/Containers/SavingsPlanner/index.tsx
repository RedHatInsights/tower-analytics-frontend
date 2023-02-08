import { Paths } from '../../paths';

export const paths = {
  getDetails: (id: number): string => `${Paths.savingsPlanner}/${id}`,
};
