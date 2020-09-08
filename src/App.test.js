
import { mount, shallow } from 'enzyme';
import App from './App.js';
import { Router } from 'react-router-dom';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import packageJson from '../package.json';

describe('App', () => {
    it('App loads', () => {
        expect(App).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<App />);
    });
    it('should return a div with a version attribute', () => {

        // the insights object
        const mockInsights = {
            chrome: {
                on() {},
                init() {},
                identifyApp() {},
                auth: {
                    getUser: () => {
                        return 'bob';
                    }
                }
            }
        };

        const history = {
            listen() {
                return { unlisten() {} };
            },
            replace() {},
            push() {},
            length: 1,
            action: 'PUSH',
            location: {
                pathname: '/somewhere',
                search: '',
                hash: '#howdy'
            }
        };

        const mockStore = configureStore();
        const store = mockStore({});
        global.insights = mockInsights;
        let wrapper = mount(
            <Provider store={ store } >
                <Router history={ history }>
                    <App />
                </Router>
            </Provider>
        );

        let componentVersion = wrapper.find('#automation-analytics-application').props().version;
        expect(componentVersion).toBe(packageJson.version);
    });
});
