import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Breadcrumbs from './Breadcrumbs';
import { MemoryRouter } from 'react-router-dom';

describe('Components/Breadcrumbs', () => {
  let wrapper;

  it('should render without any errors', async () => {
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Breadcrumbs />
        </MemoryRouter>
      );
    });
    wrapper.update();

    expect(wrapper).toBeTruthy();
  });

  it('should render a breadcrumb when passed items prop', async () => {
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Breadcrumbs
            items={[
              { title: 'Foo', navigate: '/foo' },
              { title: 'Bar', navigate: '/bar' },
            ]}
          />
        </MemoryRouter>
      );
    });
    wrapper.update();
    expect(wrapper.find('BreadcrumbItem').length).toBe(2);
  });

  it('should correctly set href for breadcrumb items', async () => {
    window.history.pushState({}, 'beta', '/beta/ansible/automation-analytics');
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Breadcrumbs
            items={[
              { title: 'Foo', navigate: '/foo' },
              { title: 'Bar', navigate: '/bar' },
            ]}
          />
        </MemoryRouter>
      );
    });
    wrapper.update();
    expect(wrapper.find('BreadcrumbItem a').at(0).props().href).toBe('/foo');
  });
});
