import CustomDateSelector from './CustomDateSelector';
import { act } from 'react-dom/test-utils';

describe('Components/Toolbar/CustomDateSelector', () => {
  it('should render without any data', () => {
    let wrapper = mount(<CustomDateSelector />);
    expect(wrapper).toBeTruthy();
  });

  it('should render with two inputs', () => {
    let wrapper = mount(
      <CustomDateSelector
        startDate={'20/02/2020'}
        endDate={'20/02/2021'}
        onInputChange={() => {}}
      />
    );
    const buttons = wrapper.find({ className: 'pf-c-form-control' });
    expect(buttons.length).toBe(2);
  });

  it('should call callback on input change', () => {
    const callback = jest.fn();

    let wrapper = mount(
      <CustomDateSelector
        startDate={'20/02/2020'}
        endDate={'20/02/2021'}
        onInputChange={callback}
      />
    );
    const i = wrapper.find('input');
    act(() => {
      i.at(0).simulate('change', { target: { value: '21/02/2021' } });
      i.at(1).simulate('change', { target: { value: '22/02/2021' } });
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
