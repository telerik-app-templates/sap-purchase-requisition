var app = app || {};

app.Login = (function () {
    'use strict'

    var loginViewModel = (function () {

        var uName = 'demo',
            pWord = 'demo',
            authenticated = false;

        var init = function () {

        };

        var show = function () {
            $("#loginUsername").val(uName);
            $("#loginPassword").val(pWord);
        };

        var login = function () {
            var username = $("#loginUsername").val();
            var password = $("#loginPassword").val();

            // Authenticate using the username and password
            app.everlive.Users.login(username, password)
            .then(function (r) {
                //console.log(r);
            })
            .then(function () {
                app.mobileApp.navigate('views/workflowitemsView.html');
            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };

        return {
            init: init,
            show: show,
            login: login
        }
    }());

    return loginViewModel;

}());
