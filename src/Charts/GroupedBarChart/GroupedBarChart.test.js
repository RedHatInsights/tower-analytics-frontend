import { shallow } from 'enzyme';
import { GroupedBarChart, HostsTooltip, OrgsTooltip } from './index';

describe('Charts/GroupedBarChart', () => {
    it('GroupedBarChart loads', () => {
        expect(GroupedBarChart).toBeTruthy();
    });

    it('should render successfully with Orgs Tooltip', () => {
        shallow(<GroupedBarChart
            TooltipClass={ OrgsTooltip }
        />);
    });

    it('should render successfully with Hosts Tooltip', () => {
        shallow(<GroupedBarChart
            TooltipClass={ HostsTooltip }
        />);
    });

});
