var cordova = require('cordova'),
    DataSync = function () {

		  this.isSynced = false;

      this.createOfflineContext = function (options, success, fail) {
        cordova.exec(success, fail, 'DataSync', 'createContext', [ options ] );
      };

      this.createOfflineContextAsync = function (options, success, fail) {
    		cordova.exec(success, fail, 'DataSync', 'createContextAsync', [ options ] );
  		};

    	this.createContext = function (options, success, fail) {
    		cordova.exec(success, fail, 'DataSync', 'createContext', [options] );
  		};

      this.createContextAsync = function (options, success, fail) {
        cordova.exec(success, fail, 'DataSync', 'createContextAsync', [ options ])
      };

      this.syncChanges = function (success, fail) {
    		this.isSynced = true;
    		cordova.exec(success, fail, 'DataSync', 'syncChanges', []);
  		};

      this.syncModel = function(options, success, fail) {
        cordova.exec(success, fail, 'DataSync', 'syncModel',[ options ]);
      };

      this.registerClass = function (options, success, fail) {
        cordova.exec(success, fail, 'DataSync', 'registerClass', [options]);
      };

      this.registerClassAsync = function (options, success, fail) {
        cordova.exec(success, fail, 'DataSync', 'registerClassAsync', [ options ]);
      };

  		this.addObject = function (options, success, fail) {
    		this.isSynced = false;
    		cordova.exec(success, fail, 'DataSync', 'insertObject', [options]);
  		};

  		this.updateObject = function (options, success, fail) {
    		this.isSynced = false;
    		cordova.exec(success, fail, 'DataSync', 'updateObject', [options]);
  		};

  		this.deleteObject = function (options, success, fail) {
    		this.isSynced = false;
    		cordova.exec(success, fail, 'DataSync', 'removeObject', [options]);
  		};

  		this.allObjects = function (options, success, fail) {
    		cordova.exec(success, fail, 'DataSync', 'allObjects', [options]);
  		};

  		this.objectsWithQuery = function (options, success, fail) {
    		cordova.exec(success, fail, 'DataSync', 'queryObjects', [options]);
  		};

  		this.getUniqueID = function () {
    		var d = new Date().getTime();
    		d += (parseInt(Math.random() * 100)).toString();
    		d = 'uid-' + d;
    		return d;
  		}
    },
    dataSync = new DataSync();

module.exports = dataSync;