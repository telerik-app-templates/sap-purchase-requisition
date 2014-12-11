var app = app || {};

app.Login = (function () {
    'use strict'

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
            console.log(uName);

            console.log("login init3");
            dataSync.createOfflineContext({
                "ProviderName": "Everlive",
                "ProviderHostName": "http://api.everlive.com",
                "LocalDatabaseName": "poDB.db",
                "ApiKey": "fake",
                "Username": "fake",
                "Password": "fake",
                "ApiVersion": 1
            },
                function success(s) {
                    console.log("createSuccess");
                    console.log(s);
                },
                function fail(f) {
                    console.log("createFail");
                    console.log(f);
                });

            //dataSync.createContext({
            //    "ProviderName": "Everlive",
            //    "ProviderHostName": "http://api.everlive.com",
            //    "ApiVersion": "v1",
            //    "ApiKey": "Op8R4hd0NsHjUzmF",
            //    "LocalDatabaseName": "Local_DB.db"
            //}, function success(s) {
            //    console.log("good");
            //    console.log(s);
            //}, function failure(f) {
            //    console.log("fail");
            //    console.log(f);
            //});

            console.log("post dataSync register class");

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
                        app.mobileApp.navigate("views/workflowitemsView.html");
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