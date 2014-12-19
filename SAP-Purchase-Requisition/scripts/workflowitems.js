var app = app || {};

app.WorkflowItems = (function () {
    'use strict'

    var workflowitemsModel = (function () {

        var wfiModel = {
            id: 'WorkitemID',
            fields: {
                createdAt: {
                    field: 'WiCreatedAt',
                    type: 'date'
                },
                createdBy: {
                    field: 'CreatedByName'
                },
                value: {
                    field: 'Value'
                },
                currency: {
                    field: 'Currency'
                },
                supplier: {
                    field: 'SupplierName'
                },
                description: {
                    field: 'ItemDescriptions'
                },
                ponumber: {
                    field: 'PoNumber'
                }
            }
        };

        var wfiDataSource = new kendo.data.DataSource({
            type: 'odata',
            scheme: {
                model: wfiModel,
                data: function (response) {
                    console.log(response);
                    return response.d.results;
                }
            },
            transport: {
                read: {
                    url: appSettings.endpoints.prWorkflowItems,
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", localStorage.getItem("authHeaderValue"));
                        xhr.setRequestHeader("x-csrf-token", "fetch");
                    },
                    complete: function (xhr) {
                        localStorage.setItem("token", xhr.getResponseHeader("X-CSRF-Token"));
                    }
                }
            },
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            }
        });

        return {
            workflowitems: wfiDataSource
        }
    }());

    var workflowitemsViewModel = (function () {

        var init = function () {
            
        };

        var show = function () {
            
        };

        var navToWorkItem = function (e) {
            console.log("Tapped item");
            console.log(e.data);
            appSettings.selectedWorkItem = e.data;
            app.mobileApp.navigate("views/workflowitemView.html");
        };

        return {
            init: init,
            show: show,
            workItems: workflowitemsModel.workflowitems,
            nav: navToWorkItem

        }
    }());

    return workflowitemsViewModel;

}());