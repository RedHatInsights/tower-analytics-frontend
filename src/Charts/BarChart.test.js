import { shallow } from 'enzyme';
import BarChart from './BarChart.js';

describe('Charts/BarChart', () => {
  it('BarChart loads', () => {
    expect(BarChart).toBeTruthy();
  });
  it('should render successfully', () => {
    shallow(<BarChart />);
  });
});
