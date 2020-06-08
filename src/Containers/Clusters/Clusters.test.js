
import { shallow } from 'enzyme';
import Clusters from './Clusters.js';

describe('Containers/Clusters', () => {
    it('Clusters loads', () => {
        expect(Clusters).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<Clusters />);
    });
});
