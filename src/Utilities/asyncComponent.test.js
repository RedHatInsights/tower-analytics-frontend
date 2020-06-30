
import asyncComponent from './asyncComponent.js';

describe('Utilities/asyncComponent', () => {
    it('asyncComponent loads', () => {
        expect(asyncComponent).toBeTruthy();
    });
    it('asyncComponent asyncs', () => {
        expect(asyncComponent(() => import('component'))).toBeTruthy();
    });
});
