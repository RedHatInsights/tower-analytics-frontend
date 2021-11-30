import { act } from 'react-dom/test-utils';
import CalculationCost from './CalculationCost';

describe('Containers/CustomReports/AutomationCalculator/CalculationCost', () => {
  it('Should render without any params', () => {
    const wrapper = mount(<CalculationCost />);
    expect(wrapper).toBeTruthy();
  });

  it('Should render the correct manual cost', () => {
    const wrapper = mount(<CalculationCost costManual={'16.1'} />);
    const costValue = wrapper.find('input').at(0).props().value;
    expect(costValue).toBe('16.1');
  });

  it('Should render the correct automation cost', () => {
    const wrapper = mount(<CalculationCost costAutomation={'125.15'} />);
    const costValue = wrapper.find('input').at(1).props().value;
    expect(costValue).toBe('125.15');
  });

  it('Should change the manual cost correctly', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <CalculationCost costManual={'25'} setCostManual={fn} />
    );
    const costInput = wrapper.find('input').at(0);
    act(() => {
      costInput.simulate('change', { target: { value: '' } });
    });
    expect(fn).toHaveBeenCalled();
  });

  it('Should change the automation cost correctly', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <CalculationCost costAutomation={'10'} setCostAutomation={fn} />
    );
    const costInput = wrapper.find('input').at(1);
    act(() => {
      costInput.simulate('change', { target: { value: '' } });
    });
    expect(fn).toHaveBeenCalled();
  });

  it('Should set cost on invalid values to zero', () => {
    const fn = jest.fn();
    const fn2 = jest.fn();
    const wrapper = mount(
      <CalculationCost
        costAutomation={'qert'}
        costManual={'45srrf5'}
        setCostAutomation={fn}
        setCostManual={fn2}
      />
    );
    const costInput = wrapper.find('input').at(0);
    const costInput2 = wrapper.find('input').at(1);
    act(() => {
      costInput.simulate('change', { target: { value: '' } });
      costInput2.simulate('change', { target: { value: '' } });
    });
    expect(fn).toHaveBeenCalledWith(0);
    expect(fn2).toHaveBeenCalledWith(0);
  });

  it('Should set cost on negative values to NaN', () => {
    const fn = jest.fn();
    const fn2 = jest.fn();
    const wrapper = mount(
      <CalculationCost
        costAutomation={'-2'}
        costManual={'-25'}
        setCostAutomation={fn}
        setCostManual={fn2}
      />
    );
    const costInput = wrapper.find('input').at(0);
    const costInput2 = wrapper.find('input').at(1);
    act(() => {
      costInput.simulate('change', { target: { value: '' } });
      costInput2.simulate('change', { target: { value: '' } });
    });
    expect(fn).toHaveBeenCalledWith(NaN);
    expect(fn2).toHaveBeenCalledWith(NaN);
  });
});
