
import { shallow } from 'enzyme';
import App from './App.js';

describe('Charts/App', () => {
    it('App loads', () => {
        expect(App).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<App />);
    });
});
