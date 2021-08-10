import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import { renderPage } from '../../__tests__/helpers.reactTestingLib';
import Clusters from './Clusters';

import mockResponses from '../../__tests__/fixtures/';
import * as api from '../../Api/';
jest.mock('../../Api');

describe('<Clusters />', () => {
  test('true', () => {
    expect(true).toBe(true);
  });
  afterEach(() => {
    api.readClustersOptions.mockResolvedValue(mockResponses.readClusterOptions);
    api.readJobExplorer.mockResolvedValue(mockResponses.readJobExplorer);
    api.readEventExplorer.mockResolvedValue(mockResponses.readEventExplorer);
  });

  test('has rendered Clusters component with data', async () => {
    await act(async () => {
      renderPage(Clusters);
    });
    expect(screen.getAllByText(/Clusters/i));
    expect(screen.getByText('Jobs across all clusters'));
    expect(screen.getByText('Top workflows'));
    expect(screen.getByText('Job status'));
  });
});
