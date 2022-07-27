import { screen, waitFor } from '@testing-library/react';
import { renderPage } from '../../__tests__/helpers.reactTestingLib';
import { mockUseRequestDefaultParams } from '../../__tests__/helpers';
import Clusters from './Clusters';

import * as useRequest from '../../Utilities/useRequest';
import mockResponses from '../../__tests__/fixtures/';
import * as api from '../../Api/';
jest.mock('../../Api');

describe('Containers/Clusters', () => {
  beforeEach(() => {
    api.readClustersOptions.mockResolvedValue(mockResponses.readClusterOptions);
    api.readJobExplorer.mockResolvedValue(mockResponses.readJobExplorer);
    api.readEventExplorer.mockResolvedValue(mockResponses.readEventExplorer);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the clusters page with data', async () => {
    renderPage(Clusters);

    await waitFor(() => {
      expect(api.readJobExplorer).toHaveBeenCalledTimes(3);
      expect(api.readClustersOptions).toHaveBeenCalledTimes(1);
      expect(api.readEventExplorer).toHaveBeenCalledTimes(1);
    });

    expect(screen.getAllByText(/Clusters/i));
    expect(screen.getByText('Jobs across all clusters'));
    expect(screen.getByText('Top workflows'));
    expect(screen.getByText('Job status'));
  });

  it('should render the page with default api values', async () => {
    const spy = jest.spyOn(useRequest, 'default');
    spy.mockImplementation(mockUseRequestDefaultParams);

    const { container } = renderPage(Clusters);

    await waitFor(() => {
      expect(container.querySelector('[data-cy="barchart"'));
    });

    expect(screen.getAllByText(/No Data/i)).toHaveLength(3);
    spy.mockRestore();
  });
});
