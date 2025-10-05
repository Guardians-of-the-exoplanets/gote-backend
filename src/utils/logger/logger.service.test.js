import LoggerService from './logger.service.js';

describe('LoggerService', () => {
  const loggerService = LoggerService;

  // beforeEach(() => {
  //     jest.clearAllMocks();
  // });

  it('should be defined', () => {
    expect(LoggerService).toBeDefined();
  });

  it('should call info method', () => {
    const infoSpy = jest.spyOn(loggerService, 'info');
    loggerService.info('This is an info message');
    expect(infoSpy).toHaveBeenCalledWith('This is an info message');
  });

  it('should log warning messages', () => {
    const infoSpy = jest.spyOn(loggerService, 'warn');
    const message = 'This is a warning message';
    loggerService.warn(message);
    expect(infoSpy).toHaveBeenCalledWith(message);
  });

  it('should log error messages', () => {
    const errorSpy = jest.spyOn(loggerService, 'error');
    const message = 'This is an error message';
    loggerService.error(message);
    expect(errorSpy).toHaveBeenCalledWith(message);
  });

  it('should log debug messages', () => {
    const debugSpy = jest.spyOn(loggerService, 'debug');
    const message = 'This is a debug message';
    loggerService.debug(message);
    expect(debugSpy).toHaveBeenCalledWith(message);
  });
});
