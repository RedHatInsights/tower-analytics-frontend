import { configure, mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;

// For page API
global.insights = {
    chrome: {
        on() {},
        init() {},
        identifyApp() {},
        auth: {
            getUser: () => new Promise((resolve) => resolve('bob'))
        },
        appNavClick: jest.fn()
    }
};
