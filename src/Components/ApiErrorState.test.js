import React from 'react';
import { shallow } from 'enzyme';
import ApiErrorState from './ApiErrorState';

describe('Components/JobStatus', () => {
    let wrapper;
    const msg = 'API Error Description...';

    beforeEach(() => {
        wrapper = null;
    });

    it('should render successful', () => {
        wrapper = shallow(<ApiErrorState message={msg} />);
        expect(wrapper.length).toBe(1);
    });

    it('should contain the correct string', () => {
        wrapper = shallow(<ApiErrorState message={msg} />);
        expect(wrapper.html()).toMatch(new RegExp(msg));
    });
});
