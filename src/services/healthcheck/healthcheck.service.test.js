import { healthcheck } from './healthcheck.service.js';

describe('HealthcheckService', () => {
  it('should be defined', () => {
    expect(healthcheck()).toBe("OK");
  });
});
