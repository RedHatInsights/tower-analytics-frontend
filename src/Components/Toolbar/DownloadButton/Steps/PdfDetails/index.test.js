import { screen } from '@testing-library/react';
import { renderPage } from '../../../../../__tests__/helpers.reactTestingLib';
import PdfDetails from './index';

const mockFormData = {
  downloadType: 'pdf',
  showExtraRows: false,
  additionalRecipients: '',
  eula: false,
  emailExtraRows: false,
  subject: 'The Ansible report, Most used modules, is available for view',
  body: 'Email body',
  selectedRbacGroups: [],
  users: [],
  expiry: '2022-07-01',
};

const mockDispatchReducer = () => {};

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

  it('should render the PDF details step', async () => {
    renderPage(PdfDetails, undefined, {
      options: mockOptions,
      formData: mockFormData,
      dispatchReducer: mockDispatchReducer,
    });
    expect(screen.getByLabelText('Current page')).toBeTruthy();
    expect(screen.getByLabelText('All 3 pages')).toBeTruthy();
  });
});
