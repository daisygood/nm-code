const expect = require('chai').expect,
      chalk = require('chalk'),
      {Logger, LEVELS} = require('../logger');

describe('Logger', function() {

  describe('Logger Class Creation', function() {
    it('should set `root` property to `root` when nothing was passed in', function() {
      let rootLogger = new Logger({});
      expect(rootLogger.root).to.equal('root');
    });

    it('should set `root` property what was passed in', function() {
      let rootLogger = new Logger({'root': 'driver'});
      expect(rootLogger.root).to.equal('driver');
    });

    it('should set `transport` property to what was passed in', function() {
      let transportFunction = function() {
        return 'new transport function'
      }
      let rootLogger = new Logger({transport: transportFunction});
      expect(rootLogger.transport).to.equal(transportFunction);
    });

    it('should set `format` property to what was passed in', function() {
      let formatFunction = function() {
        return 'new format function'
      }
      let rootLogger = new Logger({format: formatFunction});
      expect(rootLogger.format).to.equal(formatFunction);
    });

  });

  describe('createLogObject Functionality', function() {
    it('should transform data passed in to an object', function() {

      let message = 'Hello World';
      let rootLogger = new Logger({root: 'root'});
      rootLogger.log({message: message}, LEVELS.ERROR);
      let logObj = rootLogger.createLogObject();

      expect(logObj).to.be.an('object');
      expect(logObj.root).to.equal('root');
      expect(logObj.level).to.equal('error');
      expect(logObj.message).to.equal(message);

    });

    it('should also transform data passed in as a string to an object', function() {

      let message = 'Hello World';
      let rootLogger = new Logger({root: 'root'});
      rootLogger.log(message, LEVELS.INFO);
      let logObj = rootLogger.createLogObject();

      expect(logObj).to.be.an('object');
      expect(logObj.root).to.equal('root');
      expect(logObj.level).to.equal('info');
      expect(logObj.message).to.equal(message);

    });

    it('should also default level to info if level information was not passed in', function() {

      let message = 'Hello World';
      let rootLogger = new Logger({root: 'root'});
      rootLogger.log(message);
      let logObj = rootLogger.createLogObject();

      expect(logObj).to.be.an('object');
      expect(logObj.root).to.equal('root');
      expect(logObj.level).to.equal('info');
      expect(logObj.message).to.equal(message);

    });

  });

  describe('Levels', function() {
    it('should log messages in the color specific to their levels', function() {
      let message = 'Hello World';
      let rootLogger = new Logger({});

      let warning = rootLogger.transport(LEVELS.WARN, message);
      let expectedWarning = chalk.yellow(message);

      let error = rootLogger.transport(LEVELS.ERROR, message);
      let expectedError = chalk.red(message);

      let debug = rootLogger.transport(LEVELS.DEBUG, message);
      let expectedDebug = chalk.blue(message);

      let info = rootLogger.transport(LEVELS.INFO, message);
      let expectedInfo = chalk.green(message);

      expect(expectedWarning).to.equal(warning);
      expect(expectedError).to.equal(error);
      expect(expectedDebug).to.equal(debug);
      expect(expectedInfo).to.equal(info);

    });

    it('should log messages in the green when level was not passed in', function() {
      let message = 'Hello WOrld';
      let rootLogger = new Logger({});

      let noLevel = rootLogger.transport(null, message);
      let expectedNoLevel = chalk.green(message);

      expect(expectedNoLevel).to.equal(noLevel);

    });

  });

  describe('Overridable methods', function() {
    it('should override transport method', function() {
      let oldLogger = new Logger({});
      let oldOutput = oldLogger.log('Hello World');

      let newLogger = new Logger({
        transport(level, message) {
          return 'Overrode transport to log ' + message ;
        }
      });

      let newOutPut = newLogger.log('Hello World');

      expect(newOutPut).to.not.equal(oldOutput);

    });

    it('should overide format method', function() {
      let oldLogger = new Logger({});
      let oldOutput = oldLogger.log('Hello World');

      let newLogger = new Logger({
        format(obj) {
          return 'Overrode format!' + obj;
        }
      });
      let newOutPut = newLogger.log('Hello World');

      expect(newOutPut).to.not.equal(oldOutput);
    });

  })


});