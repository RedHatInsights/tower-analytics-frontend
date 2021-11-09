import AutomationFormula from './AutomationFormula';

describe('Containers/AutomationCalculator/AutomationFormula', () => {
  it('Should render correctly', () => {
    const wrapper = mount(<AutomationFormula />);
    expect(wrapper).toBeTruthy();
  });
});
