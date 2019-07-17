import { mount } from 'enzyme';
import TemplatesList from './TemplatesList/';

describe('Components/TemplatesList', () => {
    it('should render successfully', () => {
        mount(<TemplatesList templates={ [{ name: 'Foo', type: 'Bar' }] } />);
    });
});
