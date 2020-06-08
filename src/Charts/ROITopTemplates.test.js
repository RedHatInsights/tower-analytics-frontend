
import { shallow } from 'enzyme';
import ROITopTemplates from './ROITopTemplates.js';

describe('Charts/ROITopTemplates', () => {
    it('ROITopTemplates loads', () => {
        expect(ROITopTemplates).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<ROITopTemplates />);
    });
});
