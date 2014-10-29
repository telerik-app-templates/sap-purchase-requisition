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
                },
                parameterMap: function (options, type) {
                    var paramMap = kendo.data.transports.odata.parameterMap(options);

                    delete paramMap.$inlinecount; // <-- remove inlinecount parameter.
                    //delete paramMap.$format; // <-- remove format parameter.

                    return paramMap;
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

        var navbar;

        var init = function ( e ) {
            navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');
        };

        var afterShow = function () {
            var dataSource = workflowitemsModel.workflowitems;
            appSettings.itemUpdated = false;
            dataSource.read();
                
            dataSource.bind("change", function () {
                navbar.title("(" + this.data().length + ")");
            });
        };

        var navToWorkItem = function (e) {
            appSettings.selectedWorkItem = e.data;
            app.mobileApp.navigate("views/workflowitemView.html");
        };

        return {
            init: init,
            afterShow: afterShow,
            workItems: workflowitemsModel.workflowitems,
            nav: navToWorkItem

        }
    }());

    return workflowitemsViewModel;

}());