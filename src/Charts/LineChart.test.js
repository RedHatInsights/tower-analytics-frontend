import { shallow } from 'enzyme';
import LineChart from './LineChart.js';

describe('Charts/LineChart', () => {
  it('LineChart loads', () => {
    expect(LineChart).toBeTruthy();
  });
  it('should render successfully', () => {
    shallow(<LineChart />);
  });
});
