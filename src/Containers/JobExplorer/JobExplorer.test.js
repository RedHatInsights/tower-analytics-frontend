/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import JobExplorer from './JobExplorer';

describe('Components/JobExplorer', () => {
    it('should render successfully', () => {
        mount(<JobExplorer />);
    });
});
