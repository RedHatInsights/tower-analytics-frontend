import { init, getStore, register } from './index.js';

describe('store', () => {
    it('store loads', () => {
        expect(init).toBeTruthy();
        expect(getStore).toBeTruthy();
        expect(register).toBeTruthy();
    });
    it('store register', () => {
        expect(init()).toBeTruthy();
        expect(getStore()).toBeTruthy();
    });
});
