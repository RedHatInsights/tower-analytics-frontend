import { init } from './index.js';

describe('store', () => {
  it('store loads', () => {
    expect(init).toBeTruthy();
  });
});
