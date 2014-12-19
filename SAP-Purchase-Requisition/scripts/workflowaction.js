var app = app || {};

app.WorkflowAction = (function () {
    'use strict'

    var workflowActionViewModel = (function () {

        var action = null,
            actionText = null,
            currentItem = null;

        //var getAllObjects = function () {
        //    dataSync.allObjects({ EntityName: 'PurchaseOrderExpanded' },
        //        function (aos) {
        //            console.log("all object success");
        //            console.log(aos);
        //        },
        //        function (aof) {
        //            console.log("all object fail");
        //            console.log(aof);
        //        });
        //};

        var init = function (e) {

        };

        var show = function ( e ) {
            action = e.sender.params.action;
            currentItem = appSettings.selectedWorkItem;

            if (action == "001") {
                actionText = "Approve";
            } else {
                actionText = "Reject";
            }

            $("#workflow-action-title").val(actionText);
            $("#action-title").val(actionText);
        };

        var submit = function () {
            var updateUrl = appSettings.endpoints.prWorkflow;
            
            updateUrl = updateUrl.replace("#DecisionKey#", action);
            updateUrl = updateUrl.replace("#WorkitemID#", currentItem.WorkitemID);
            updateUrl = updateUrl.replace("#Comment#", $("#action-comment").val());

            console.log(updateUrl);
            
            app.mobileApp.showLoading();

            $.ajax({
                type:"POST",
                url: updateUrl,
                beforeSend: function(xhr)
                {
                    xhr.setRequestHeader("Authorization",localStorage.getItem("authHeaderValue"));
                    xhr.setRequestHeader("x-csrf-token",localStorage.getItem("token"));
                }
            }).done(function(data)
            {
                console.log(data);
                app.mobileApp.hideLoading();
                app.mobileApp.navigate("#:back");
            });
            
        };

        var cancel = function () {
            app.mobileApp.navigate("#:back");
        };

        return {
            init: init,
            show: show,
            submit: submit,
            cancel: cancel
        }
    }());

    return workflowActionViewModel;

}());