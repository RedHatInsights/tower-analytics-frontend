import { shallow } from 'enzyme';
import BaseChart from './BaseChart.js';
import { MemoryRouter } from 'react-router-dom';

describe('Charts/BaseChart', () => {
  it('BaseChart loads', () => {
    expect(BaseChart).toBeTruthy();
  });
  it('should render successfully', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <BaseChart />
      </MemoryRouter>
    );
  });
});
