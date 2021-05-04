import { mount } from 'enzyme';
import Legend from './Legend.js';

describe('Utilities/Legend', () => {
  it('Legend loads', () => {
    expect(Legend).toBeTruthy();
  });
  it('should render successfully', () => {
    mount(<Legend data={[]} selected={[]} height="100" />);
  });
});
