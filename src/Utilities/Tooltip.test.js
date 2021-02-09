import Tooltip from './Tooltip.js';

Tooltip.prototype.draw = jest.fn();

describe('Utilities/Tooltip', () => {
    it('Tooltip loads', () => {
        expect(Tooltip).toBeTruthy();
    });
    it('Tooltip creates', () => {
        expect(new Tooltip({ svg: '#abc' })).toBeTruthy();
        expect(Tooltip.prototype.draw).toHaveBeenCalledTimes(1);
    });
});
