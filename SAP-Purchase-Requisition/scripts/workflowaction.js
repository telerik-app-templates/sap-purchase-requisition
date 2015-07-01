var app = app || {};

app.WorkflowAction = (function () {
    'use strict'

    var workflowActionViewModel = (function () {

        var action = null,
            actionText = null,
            currentItem = null;

        var init = function (e) {

        };

        var show = function (e) {
            analytics.Monitor().TrackFeatureStart("WorkflowAction.Submit");
            
            action = e.sender.params.action;
            currentItem = appSettings.selectedWorkItem;

            if (action == "001") {
                actionText = "Approve";
            } else {
                actionText = "Reject";
            }

            var navbar = app.mobileApp.view()
                .header
				.find(".km-navbar")
   				.data("kendoMobileNavBar");

            navbar.centerElement[0].innerText = actionText;
        };

        var submit = function () {
            var url = 'https://api.everlive.com/v1/yqPFi0boAHdvqEWg/Functions/ApplyDecision';
            var queryString = "?action=" + action + "&wid=" + currentItem.workItemId + "&comment=" + $("#action-comment").val() + "&user=" + appSettings.currentUser.Username;
            
            var cloudCall = url + queryString;
            
            $.ajax({
                type: 'GET',
                url: cloudCall
            }).done(function(data) {
                var retObj = JSON.parse(data);
                var returnType = retObj.type;
                
                if (returnType == "Error") {
                    app.showError(retObj.message);
                } else if (returnType == "Success" || returnType == "Reject") {
                    app.showAlert(retObj.message, returnType, null);
                    app.mobileApp.navigate("views/workflowitemsView.html");
                } else {
                    app.showError("Unknown response. Check with your admin.");
                }
            });
        };

        var hide = function () {
            $("#action-comment").val("");
            analytics.Monitor().TrackFeatureStop("WorkflowAction.Submit");
        };
        
        var cancel = function () {
            app.mobileApp.navigate("#:back");
        };

        return {
            init: init,
            show: show,
            submit: submit,
            cancel: cancel,
            hide: hide
        }
    }());

    return workflowActionViewModel;

}());
