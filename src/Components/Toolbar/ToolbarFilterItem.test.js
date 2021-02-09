import ToolbarFilterItem from './ToolbarFilterItem';

describe('Components/Toolbar/ToolbarFilterItem', () => {
    it('should render withouth any data', () => {
        let wrapper = shallow(
            <ToolbarFilterItem categoryKey={'status'} setFilter={() => {}} />
        );
        expect(wrapper).toBeTruthy();
    });
});
