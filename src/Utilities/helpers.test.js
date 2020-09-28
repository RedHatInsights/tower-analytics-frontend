import { formatPercentage } from './helpers.js';

describe('Utilities/helpers/formatPercentage', () => {
    it('handles a positive integer', () => {
        expect(formatPercentage(1)).toBe('1%');
    });
    it('handles a positive stringy integer', () => {
        expect(formatPercentage('1')).toBe('1%');
    });
    it('handles a positive float', () => {
        expect(formatPercentage(1.0)).toBe('1%');
    });
    it('handles a positive stringy float', () => {
        expect(formatPercentage('1.0')).toBe('1.0%');
    });
    it('handles an integer zero', () => {
        expect(formatPercentage(0)).toBe('0%');
    });
    it('handles an integer stringy zero', () => {
        expect(formatPercentage('0')).toBe('0%');
    });
    it('handles a float zero', () => {
        expect(formatPercentage(0.0)).toBe('0%');
    });
    it('handles a float stringy zero', () => {
        expect(formatPercentage('0.0')).toBe('0.0%');
    });
    it('handles a float less than 1', () => {
        expect(formatPercentage(0.1)).toBe('0.1%');
    });
    it('handles a stringy float less than 1', () => {
        expect(formatPercentage('0.1')).toBe('0.1%');
    });
});
