import CategoryDropdown from './CategoryDropdown';
import { act } from 'react-dom/test-utils';

const categories = [
  { key: 'cat1', name: 'Cat1' },
  { key: 'cat2', name: 'Cat2' },
  { key: 'cat3', name: 'Cat3' },
  { key: 'cat4', name: 'Cat4' },
];

describe('Components/Toolbar/CategoryDropdown', () => {
  it('should render withouth any data', () => {
    let wrapper = mount(<CategoryDropdown selected={null} />);
    expect(wrapper).toBeTruthy();
  });

  it('should render with default value', () => {
    let curr = 'cat2';
    let wrapper = mount(
      <CategoryDropdown selected={curr} categories={categories} />
    );
    expect(wrapper.find('.pf-c-select__toggle').text()).toBe('Cat2');
  });

  it('should have all the options', () => {
    const curr = 'cat1';
    const fn = jest.fn();
    let wrapper = mount(
      <CategoryDropdown
        selected={curr}
        setSelected={fn}
        categories={categories}
      />
    );
    wrapper.find('.pf-c-select__toggle').simulate('click');
    expect(wrapper.text()).toContain('Cat1Cat2Cat3Cat4');
  });

  it('should change the selection', () => {
    const curr = 'cat1';
    const next = 'cat2';
    const fn = jest.fn();
    let wrapper = mount(
      <CategoryDropdown
        selected={curr}
        setSelected={fn}
        categories={categories}
      />
    );

    wrapper.find('.pf-c-select__toggle').simulate('click');
    const buttons = wrapper.find('button');
    act(() => {
      // Click on the second category
      // The first button is the currently selected at top (cat1)
      // The second button is the cat1 (first in the row)
      buttons.at(2).simulate('click');
    });
    expect(fn).toHaveBeenCalledWith(next);
  });
});
