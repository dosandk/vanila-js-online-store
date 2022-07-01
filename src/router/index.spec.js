import Router from './index.js';

describe('router', () => {
  it('should be implemented via "Singleton"', () => {
    const router1 = new Router();
    const router2 = new Router();

    expect(router1 === router2).toBe(true);
    expect(Router.instance === Router.instance).toBe(true);
  });
});

