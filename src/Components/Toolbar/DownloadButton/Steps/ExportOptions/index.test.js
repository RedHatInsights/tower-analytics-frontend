import { screen } from '@testing-library/react';
import { renderPage } from '../../../../../__tests__/helpers.reactTestingLib';
import ExportOptions from './index';

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

describe('Components/Toolbar/DownloadButton/ExportOptions', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the Export options', async () => {
    renderPage(ExportOptions, undefined, {
      formData: mockFormData,
      dispatchReducer: mockDispatchReducer,
    });
    expect(screen.getByLabelText('E-mail')).toBeTruthy();
    expect(screen.getByLabelText('PDF'));
  });
});
