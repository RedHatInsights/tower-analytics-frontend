import App from './App.js';
import { act } from 'react-dom/test-utils';
import { mountPage } from './__tests__/helpers';
import packageJson from '../package.json';

describe('App', () => {
  it('should have function', () => {
    expect(App).toBeTruthy();
  });

  it('should return a div with a version attribute', async () => {
    let wrapper = null;
    await act(async () => {
      wrapper = mountPage(App);
    });

    let componentVersion = wrapper
      .find('#automation-analytics-application')
      .props().version;
    expect(componentVersion).toBe(packageJson.version);
  });
});
