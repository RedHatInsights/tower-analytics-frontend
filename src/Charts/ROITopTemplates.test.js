import { shallow } from 'enzyme';
import ROITopTemplates from './ROITopTemplates.js';
import { MemoryRouter } from 'react-router-dom';

describe('Charts/ROITopTemplates', () => {
  it('ROITopTemplates loads', () => {
    expect(ROITopTemplates).toBeTruthy();
  });
  it('should render successfully', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <ROITopTemplates />
      </MemoryRouter>
    );
  });
});
