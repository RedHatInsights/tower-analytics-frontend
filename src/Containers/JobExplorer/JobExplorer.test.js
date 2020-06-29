<<<<<<< HEAD
<<<<<<< HEAD

import { shallow } from 'enzyme';
import JobExplorer from './JobExplorer';

describe('Containers/Clusters', () => {
    it('Clusters loads', () => {
        expect(JobExplorer).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<JobExplorer location={ { search: '&foo=bar' } } />);
<<<<<<< HEAD
=======
=======
>>>>>>> Squashed commit of the following:
/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import JobExplorer from './JobExplorer';

describe('Components/JobExplorer', () => {
    it('should render successfully', () => {
        mount(<JobExplorer />);
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Add paginationParams to request URL for job explorer endpoint.
=======
>>>>>>> Squashed commit of the following:
    });
});
