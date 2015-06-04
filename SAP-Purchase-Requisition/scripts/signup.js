var app = app || {};

app.Signup = (function () {
    'use strict';
    
    var signupViewModel = (function () {
        var dataSource;
        var $signUpForm, $formFields, $signupBtnWrp, validator;

        var signup = function () {              
            app.everlive.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
            .then(function () {
                app.showAlert("Registration successful", "Success", null);
                app.mobileApp.navigate('#welcome');
            },
            function (err) {
                app.showError(err.message);
            });
        };

        var init = function (e) {
            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
        };

        var show = function (e) {
            dataSource = kendo.observable({
                Username: '',
                Password: '',
                Email: ''
            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
        };

        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };
        
        return {
            init: init,
            show: show,
            hide: hide,
            signup: signup
        };
    }());
    
    return signupViewModel;
}());
