
import { shallow } from 'enzyme';
import JobExplorer from './JobExplorer';

describe('Containers/Clusters', () => {
    it('Clusters loads', () => {
        expect(JobExplorer).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<JobExplorer location={ { search: '&foo=bar' } } />);
    });
});
