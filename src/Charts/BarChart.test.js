import { shallow } from 'enzyme';
import BarChart from './BarChart.js';
import { MemoryRouter } from 'react-router-dom';

describe('Charts/BarChart', () => {
  it('BarChart loads', () => {
    expect(BarChart).toBeTruthy();
  });
  it('should render successfully', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <BarChart />
      </MemoryRouter>
    );
  });
});
