import Add from '.';
import { act } from 'react-dom/test-utils';
import { renderPage } from '../../../Utilities/tests/helpers.reactTestingLib';

import * as api from '../../../Api';
jest.mock('../../../Api');

describe('SavingsPlanner/Add', () => {
  it('can see the Add component', async () => {
    api.readPlanOptions.mockResolvedValue({
      data: { meta: { rbac: { perms: { all: true } } } },
      isSuccess: true,
    });

    await act(async () => {
      renderPage(Add);
    });
  });

  // it('redirects upon failure', async () => {
  //   api.readPlanOptions.mockResolvedValue({
  //     data: { meta: { rbac: { perms: { all: false } } } },
  //     isSuccess: true,
  //   });

  //   await act(async () => {
  //     renderPage(Add);
  //   });
  // });
});
