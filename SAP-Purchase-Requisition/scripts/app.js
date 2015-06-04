var app = (function (win) {
    'use strict';

    // Global error handling
    var showAlert = function (message, title, callback) {
        console.log(message);
        console.log(navigator);
        navigator.notification.alert(message, callback || function () {}, title, 'OK');
    };

    var showError = function (message) {
        showAlert(message, 'Error occured');
    };

    win.addEventListener('error', function (e) {
        e.preventDefault();
        var message = e.message + "' from " + e.filename + ":" + e.lineno;
        showAlert(message, 'Error occured');
        return true;
    });

    // Handle device back button tap
    var onBackKeyDown = function (e) {
        e.preventDefault();
        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };
        }, 'Exit', 'Ok,Cancel');
    };

    var onDeviceReady = function () {
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);
        
        analytics.Start();
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    var os = kendo.support.mobileOS,
    statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        //layout: 'applayout',
        statusBarStyle: statusBarStyle,
        skin: 'flat'
    });

    return {
        showAlert: showAlert,
        showError: showError,
        mobileApp: mobileApp
    };

}(window));