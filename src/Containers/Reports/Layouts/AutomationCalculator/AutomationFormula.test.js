import AutomationFormula from './AutomationFormula';

describe('Containers/CustomReports/AutomationCalculator/AutomationFormula', () => {
  it('Should render correctly', () => {
    const wrapper = mount(<AutomationFormula />);
    expect(wrapper).toBeTruthy();
  });
});
