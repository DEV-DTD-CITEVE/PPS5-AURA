describe('api base URL resolution', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalApiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const originalRealtimeBaseUrl = process.env.REACT_APP_REALTIME_BASE_URL;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.REACT_APP_API_BASE_URL;
    delete process.env.REACT_APP_REALTIME_BASE_URL;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;

    if (originalApiBaseUrl === undefined) {
      delete process.env.REACT_APP_API_BASE_URL;
    } else {
      process.env.REACT_APP_API_BASE_URL = originalApiBaseUrl;
    }

    if (originalRealtimeBaseUrl === undefined) {
      delete process.env.REACT_APP_REALTIME_BASE_URL;
    } else {
      process.env.REACT_APP_REALTIME_BASE_URL = originalRealtimeBaseUrl;
    }
  });

  test('falls back to same-origin in production', () => {
    process.env.NODE_ENV = 'production';

    const {
      getApiBaseUrl,
      getRealtimeBaseUrl,
      getBrowserHostApiBaseUrl,
    } = require('./api');

    expect(getApiBaseUrl()).toBe('');
    expect(getRealtimeBaseUrl()).toBe('');
    expect(getBrowserHostApiBaseUrl()).toBe('');
  });

  test('honors explicit overrides and trims trailing slash', () => {
    process.env.NODE_ENV = 'production';
    process.env.REACT_APP_API_BASE_URL = 'https://api.example.com/';
    process.env.REACT_APP_REALTIME_BASE_URL = 'https://events.example.com/';

    const { getApiBaseUrl, getRealtimeBaseUrl } = require('./api');

    expect(getApiBaseUrl()).toBe('https://api.example.com');
    expect(getRealtimeBaseUrl()).toBe('https://events.example.com');
  });
});
