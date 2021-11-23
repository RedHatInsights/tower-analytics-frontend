import TotalSavings from './TotalSavings';

describe('Containers/CustomReports/AutomationCalculator/TotalSavings', () => {
  it('Should render 0.00 without any param', () => {
    const wrapper = mount(<TotalSavings />);
    expect(wrapper.text()).toEqual(expect.stringContaining('0.00'));
  });
  it('Should display the correct value from float number', () => {
    const expected = '1,215,001.20';
    const wrapper = mount(<TotalSavings totalSavings={1215001.2} />);
    expect(wrapper.text()).toEqual(expect.stringContaining(expected));
  });
});
