import { shallow } from 'enzyme';
import { GroupedBarChart, HostsTooltip, OrgsTooltip } from './index';
import { MemoryRouter } from 'react-router-dom';

describe('Charts/GroupedBarChart', () => {
  it('GroupedBarChart loads', () => {
    expect(GroupedBarChart).toBeTruthy();
  });

  it('should render successfully with Orgs Tooltip', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <GroupedBarChart TooltipClass={OrgsTooltip} />
      </MemoryRouter>
    );
  });

  it('should render successfully with Hosts Tooltip', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <GroupedBarChart TooltipClass={HostsTooltip} />
      </MemoryRouter>
    );
  });
});
