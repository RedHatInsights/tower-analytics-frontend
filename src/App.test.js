import App from './App.js';
import { mountPage } from './__tests__/helpers';
import packageJson from '../package.json';

describe('App', () => {
  it('should have function', () => {
    expect(App).toBeTruthy();
  });

  it('should return a div with a version attribute', () => {
    const wrapper = mountPage(App);

    let componentVersion = wrapper
      .find('#automation-analytics-application')
      .props().version;
    expect(componentVersion).toBe(packageJson.version);
  });
});
