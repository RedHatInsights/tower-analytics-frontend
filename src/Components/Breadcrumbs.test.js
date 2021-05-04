import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Breadcrumbs from './Breadcrumbs';

describe('Components/Breadcrumbs', () => {
  let wrapper;

  it('should render without any errors', async () => {
    await act(async () => {
      wrapper = mount(<Breadcrumbs />);
    });
    wrapper.update();

    expect(wrapper).toBeTruthy();
  });

  it('should render a breadcrumb when passed items prop', async () => {
    await act(async () => {
      wrapper = mount(
        <Breadcrumbs
          items={[
            { title: 'Foo', navigate: '/foo' },
            { title: 'Bar', navigate: '/bar' },
          ]}
        />
      );
    });
    wrapper.update();
    expect(wrapper.find('BreadcrumbItem').length).toBe(2);
  });

  it('should correctly set href for breadcrumb items', async () => {
    window.history.pushState({}, 'beta', '/beta/ansible/automation-analytics');
    await act(async () => {
      wrapper = mount(
        <Breadcrumbs
          items={[
            { title: 'Foo', navigate: '/foo' },
            { title: 'Bar', navigate: '/bar' },
          ]}
        />
      );
    });
    wrapper.update();
    expect(wrapper.find('BreadcrumbItem a').at(0).props().href).toBe(
      '/beta/ansible/automation-analytics/foo'
    );
  });
});
