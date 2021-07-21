import App from './App.js';
import { Router } from 'react-router-dom';
import { mountPage } from './__tests__/helpers';
import packageJson from '../package.json';

describe('App', () => {
  it('should have function', () => {
    expect(App).toBeTruthy();
  });

  it('should return a div with a version attribute', () => {
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
        hash: '#howdy',
      },
    };

    const Component = () => (
      <Router history={history}>
        <App />
      </Router>
    );

    const wrapper = mountPage(Component);

    let componentVersion = wrapper
      .find('#automation-analytics-application')
      .props().version;
    expect(componentVersion).toBe(packageJson.version);
  });
});
