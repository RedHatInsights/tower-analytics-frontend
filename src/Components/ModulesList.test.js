import { mount } from 'enzyme';
import ModulesList from './ModulesList/';

describe('Components/ModulesList', () => {
    it('should render successfully', () => {
        mount(<ModulesList modules={ [{ module: 'Foo', count: 1 }] } />);
    });
});
