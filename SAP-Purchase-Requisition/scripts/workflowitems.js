var app = app || {};

app.WorkflowItems = (function () {
    'use strict'
    
    var dataModel = (function () {
        var wiModel = {
            id: Everlive.idField,
            fields: {
                workItemId: {
                    field: 'WorkItemId',
                    defaultValue: ''                    
                },
                approvalLevel: {
                    field: 'ApprovalLevel',
                    defaultValue: ''                    
                },
                description: {
                    field: 'Description',
                    defaultValue: ''
                },
                supplierName: {
                    field: 'SupplierName',
                    defaultValue: ''                    
                },
                currency: {
                    field: 'Currency',
                    defaultValue: ''                    
                },
                value: {
                    field: 'Value',
                    defaultValue: ''                    
                },
                createdByName: {
                    field: 'CreatedByName',
                    defaultValue: ''                    
                }                
            }
        };
        
        var wiDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: wiModel
            },
            transport: {
                typeName: 'WorkItem'
            }
        });
        
        return {
            workItems: wiDataSource
        }
    }());

    var workflowitemsViewModel = (function () {

        var navbar;

        var init = function (e) {
            navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');
        };

        var show = function (e) {
            dataModel.workItems.filter({
                field: "approvalLevel", 
                operator: "eq",
                value: appSettings.currentUser.Role
            });
            
			$("#workflow-items-list").kendoMobileListView({
                dataSource: dataModel.workItems,
                style: 'inset',
                template: kendo.template($("#workflowitemsTemplate").html()),
                click: navToWorkItem
            })
        };

        var navToWorkItem = function (e) {
            appSettings.selectedWorkItem = e.dataItem;
            app.mobileApp.navigate("views/workflowitemView.html");
        };

        return {
            init: init,
            show: show,
            workItems: dataModel.workItems,
            nav: navToWorkItem
        }
    }());

    return workflowitemsViewModel;

}());



            /*			afterShow
            var dataSource = workflowitemsModel.workflowitems;
            appSettings.itemUpdated = false;
            dataSource.read();
                
            dataSource.bind("change", function () {
                navbar.title("(" + this.data().length + ")");
            });
            */



    /*
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
    }());*/