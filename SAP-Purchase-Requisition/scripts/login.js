var app = app || {};

app.Login = (function () {
    'use strict'

    var loginViewModel = (function () {

        var uName = 'manager',
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

            app.everlive.Users.login(username, password)
            .then(function (r) {
                // do nothing for 'complete', we handle Success and Fail results
            })
            .then(function () {
                app.everlive.Users.currentUser()
                	.then(function (userData) {
                    	appSettings.currentUser = userData.result;
                    	app.mobileApp.navigate('views/workflowitemsView.html');                    	
                	}, function (userError) {
                    	app.showError(JSON.stringify(userError));
                });                
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
