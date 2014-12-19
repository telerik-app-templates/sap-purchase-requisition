var app = app || {};

app.WorkflowItem = (function () {
    'use strict'

    var workflowitemModel = (function () {
        var poDetails;

        var addDataObject = function (poExpanded) {
            // debug/testing
            // get all objects, if it exists then don't add
            // there is a problem here, don't know what yet, working on it...

            
        };

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
                    // aDO keeps showing the first object I picked, doesn't get hit for subsequent call?
                    console.log("details");
                    console.log(e);
                    poDetails = e.items[0];

                    dataSync.allObjects({ EntityName: 'PurchaseOrderExpanded' },
                        function (aos) {
                            console.log("all object success");
                            console.log(aos);

                            var found = false;

                            for (var iterator = 0; iterator < aos.length; iterator++) {
                                if (aos[iterator].WorkitemID == poDetails.WorkitemID) {
                                    console.log("Found state !");
                                    console.log("From sync: " + aos[iterator].WorkitemID);
                                    console.log("From object: " + poDetails.WorkitemID);
                                    found = true;
                                }
                            }

                            if (!found) {
                                dataSync.addObject({
                                    EntityName: 'PurchaseOrderExpanded',
                                    PropertyValues: {
                                        WorkitemID: poDetails.WorkitemID,
                                        CreatedByID: poDetails.CreatedByID,
                                        Value: poDetails.Value,
                                        PrNumber: poDetails.PrNumber
                                    }
                                }, function success(s) {
                                    console.log("success adding object");
                                    console.log(s);

                                    dataSync.saveChanges(
                                        function saveSuccess(saveS) { console.log("save worked"); },
                                        function saveFail(saveF) { console.log("save failed"); console.log(saveF); });

                                }, function fail(f) {
                                    console.log("fail adding object");
                                    console.log(f);
                                });
                            } else {
                                console.log("Found, skip add.");
                            }
                        },
                        function (aof) {
                            console.log("all object fail");
                            console.log(aof);
                        }
                    );

                    console.log("post add object test");
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

        var init = function (e) {

        };

        var show = function () {
            currentItem = appSettings.selectedWorkItem;

            if (currentItem = null) {
                currentItem = localStorage.getItem("WI");
            }

            var listView = $("#item-details-listview").data("kendoMobileListView");
            if (listView) {
                console.log("listview exists.");
                //listView.setDataSource(workflowitemModel.workflowDetails);
                workflowitemModel.workflowDetails.read();
            }
            else {
                console.log("listview does not exist.");
                $("#item-details-listview").kendoMobileListView({
                    style: "inset",
                    dataSource: workflowitemModel.workflowDetails,
                    template: $("#workflowitemTemplate").text()
                });
            }
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