import { screen } from '@testing-library/react';
import { renderPage } from '../../../__tests__/helpers.reactTestingLib';
import DownloadButton from './index';

const mockOptions = {
  settingsNamespace: 'settings',
  slug: 'foo',
  name: 'foo bar',
  description: 'some description',
  endpointUrl: 'url',
  queryParams: {},
  selectOptions: {},
  y: 'y',
  label: 'label',
  xTickFormat: 'xTickFormat',
  chartType: 'bar',
  totalPages: '3',
  pageLimit: '6',
  sortOptions: 'hosts',
  sortOrder: 'asc',
  dateGranularity: 'monthly',
  startDate: '1/1/2020',
  endDate: '1/2/2020',
  dateRange: '',
  inputs: {},
};

describe('Components/Toolbar/DownloadButton', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the Download Button', async () => {
    renderPage(DownloadButton, undefined, mockOptions);
    expect(screen.getByRole('button')).toBeTruthy();
    expect(screen.getByLabelText('Export report'));
  });
});
