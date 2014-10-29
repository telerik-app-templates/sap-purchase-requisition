var app = app || {};

app.WorkflowItem = (function () {
    'use strict'

    var workflowitemModel = (function () {
        var wfiDataSource = new kendo.data.DataSource({
            type: 'odata',
            transport: {
                read: {
                    url: function () {
                        var currentWI = appSettings.selectedWorkItem;
                        var readUrl = appSettings.endpoints.prItemDetails.replace("#RequisitonId#", currentWI.WorkitemID);
                        return readUrl;
                    },
                    dataType: 'json'
                },
                parameterMap: function (options, type) {
                    var paramMap = kendo.data.transports.odata.parameterMap(options);

                    delete paramMap.$inlinecount; // <-- remove inlinecount parameter.
                    //delete paramMap.$format; // <-- remove format parameter.

                    return paramMap;
                }
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    console.log("details!");
                } else {
                    console.log("no details");
                }
            }
        });

        return {
            workflowDetails: wfiDataSource
        }
    }());

    var workflowitemViewModel = (function () {

        var currentItem = null;

        var init = function ( e ) {            

        };

        var show = function () {
            console.log("show");
            currentItem = appSettings.selectedWorkItem;

            var listView = $("#item-details-listview").data("kendoMobileListView");
            if (listView) {
                //listView.setDataSource(workflowitemModel.workflowDetails);
                console.log("listView check");
                listView.dataSource.read();
            }

            $("#item-details-listview").kendoMobileListView({
                style: "inset",
                dataSource: workflowitemModel.workflowDetails,
                template: $("#workflowitemTemplate").text()
            });
            
        };

        var approve = function () {
            var url = "views/workflowActionView.html?action=001";
            app.mobileApp.navigate(url);
        };

        var reject = function () {
            var url = "views/workflowActionView.html?action=002";
            app.mobileApp.navigate(url);
        };

        return {
            init: init,
            show: show,
            workflowDetails: workflowitemModel.workflowDetails,
            approve: approve,
            reject: reject
        }
    }());

    return workflowitemViewModel;

}());