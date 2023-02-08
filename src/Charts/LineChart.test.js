import { shallow } from 'enzyme';
import LineChart from './LineChart.js';
import { MemoryRouter } from 'react-router-dom';

describe('Charts/LineChart', () => {
  it('LineChart loads', () => {
    expect(LineChart).toBeTruthy();
  });
  it('should render successfully', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <LineChart />
      </MemoryRouter>
    );
  });
});
