var app = app || {};

app.Login = (function () {
    'use strict'

    var //baasKey = "IhUqTo3kHFwhCw8m",
        baasKey = "yqPFi0boAHdvqEWg",
        baasScheme = 'http',
        deviceRegged = false,
        googleKey = "930700660577",
        loginUserName = "",
        emulatorMode = false;

    var el = new Everlive({
        apiKey: baasKey,
        scheme: baasScheme
    });

    var pushViewModel = (function () {

        var _onDeviceIsRegistered = function () {
            deviceRegged = true;
            $("#registerText").text("Unregister");
        };

        var _onDeviceIsNotRegistered = function () {
            deviceRegged = false;
            $("#registerText").text("Register");
        };

        var _onDeviceIsNotInitialized = function () {
            alert("Device not initialized");
        };

        var _onDeviceRegistrationUpdated = function () {
            alert("Device reg updated!");
        };

        var onAndroidPushReceived = function (args) {
            alert('Android notification received: ' + JSON.stringify(args));
        };

        var onIosPushReceived = function (args) {
            alert('iOS notification received: ' + JSON.stringify(args));
        };

        var regSuccess = function (initResult) {
            console.log("success state");
            console.log(initResult);
        };

        var regFail = function (error) {
            console.log("error state");
            console.log(error);
        };

        //Initializes the device for push notifications.        
        var enablePushNotifications = function () {

            //Initialization settings
            var pushSettings = {
                android: {
                    senderID: googleKey
                },
                iOS: {
                    badge: "true",
                    sound: "true",
                    alert: "true"
                },
                notificationCallbackAndroid: onAndroidPushReceived,
                notificationCallbackIOS: onIosPushReceived
            };

            var currentDevice = el.push.currentDevice(emulatorMode);

            console.log(currentDevice);

            currentDevice.enableNotifications(pushSettings)
                .then(
                    function (initResult) {
                        console.log("Success registering, getting registration status...");
                        return currentDevice.getRegistration();
                    },
                    function (err) {
                        console.log("Error registering device.");
                        console.log(err);
                    }
                ).then(
                    function (registration) {
                        registerInEverlive();
                        console.log(registration);
                    },
                    function (err) {
                        if (err.code === 801) {
                            _onDeviceIsNotRegistered();
                        }
                        else {
                            console.log("Error with device reg: " + err.message);
                        }
                    }
                );
        };

        var registerInEverlive = function () {
            var currentDevice = el.push.currentDevice();

            if (!currentDevice.pushToken) currentDevice.pushToken = "some token";
            el.push.currentDevice()
                .register({ SAPUsername: loginUserName })
                .then(
                    _onDeviceIsRegistered,
                    function (err) {
                        alert('REGISTER ERROR: ' + JSON.stringify(err));
                        updateRegistration();
                    }
                );
        };

        var disablePushNotifications = function () {
            el.push.currentDevice()
                .disableNotifications()
                .then(
                    _onDeviceIsNotInitialized,
                    function (err) {
                        alert('UNREGISTER ERROR: ' + JSON.stringify(err));
                    }
                );
        };

        var updateRegistration = function () {
            el.push.currentDevice()
                .updateRegistration({ SAPUsername: loginUserName })
                .then(
                    _onDeviceRegistrationUpdated,
                    function (err) {
                        alert('UPDATE ERROR: ' + JSON.stringify(err));
                    }
                );
        };

        return {
            enablePushNotifications: enablePushNotifications,
            registerInEverlive: registerInEverlive,
            disablePushNotifications: disablePushNotifications,
            updateRegistration: updateRegistration
        }
    }());

    var loginViewModel = (function () {

        var uName = 'Manager',
            pWord = 'manager',
            authenticated = false;

        var init = function () {

        };

        var show = function () {
            $("#loginUsername").val(uName);
            $("#loginPassword").val(pWord);
        };

        var login = function () {
            uName = $("#loginUsername").val();
            pWord = $("#loginPassword").val();

            loginUserName = uName;

            var authHeaderValue = "Basic " + $.base64.btoa(uName + ":" + pWord);
            $.ajax({
                url: appSettings.endpoints.prApproval,
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', authHeaderValue);
                    xhr.setRequestHeader('Accept', "application/json");
                },
                statusCode: {
                    200: function (response) {
                        localStorage.setItem("authHeaderValue", authHeaderValue);
                        localStorage.setItem("authenticated", true);
                        authenticated = true;
                    },
                    401: function (response) {
                        authenticated = false;
                        alert("Authentication failed");
                    }
                },
                complete: function () {
                    if (authenticated) {
                        // login success, username is good, enable push and register  
                        //pushViewModel.enablePushNotifications();

                        dataSync.createOfflineContext({
                            ProviderName: "Everlive",
                            ProviderHostName: 'http://api.everlive.com',
                            LocalDatabaseName: 'poDB',
                            ApiKey: 'Osf4eyOPUXbcDUpS',
                            Username: 'andy',
                            Password: 'password1',
                            ApiVersion: 1
                            },
                            function success(s) {
                                console.log("createSuccess");
                                console.log(s);

                                // if context worked, we can navigate, since we need context
                                // enabled for app functionality
                                app.mobileApp.navigate("views/workflowitemsView.html");
                            },
                            function fail(f) {
                                console.log("createFail");
                                console.log(f);
                            });

                        //app.mobileApp.navigate("views/workflowitemsView.html");
                    }
                }
            });
        };

        return {
            init: init,
            show: show,
            login: login
        }
    }());

    return loginViewModel;

}());