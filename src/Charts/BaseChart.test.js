import { shallow } from 'enzyme';
import BaseChart from './BaseChart.js';

describe('Charts/BaseChart', () => {
    it('BaseChart loads', () => {
        expect(BaseChart).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<BaseChart />);
    });
});
