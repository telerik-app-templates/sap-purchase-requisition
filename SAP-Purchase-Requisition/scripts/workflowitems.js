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
        var isInit = false;

        var init = function (e) {
            navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');
        };

        var show = function (e) {
            if (!isInit) {
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
                });
                
                isInit = true;
            } else {
                dataModel.workItems.filter({
                    field: "approvalLevel", 
                    operator: "eq",
                    value: appSettings.currentUser.Role
                });
                dataModel.workItems.read();
            }
        };

        var navToWorkItem = function (e) {
            appSettings.selectedWorkItem = e.dataItem;
            app.mobileApp.navigate("views/workflowitemView.html");
        };
        
        var logout = function (e) {
            app.mobileApp.showLoading();
            app.everlive.Users.logout(function (success) {
                app.showAlert("You have been successfully logged out.", "Logout Success", null);
                app.mobileApp.hideLoading();
                app.mobileApp.navigate("#:back");
            }, function (error) {
                app.mobileApp.hideLoading();
                app.showError("Error with logout process. Please shut down the application to ensure you are logged out.");
            });
        };

        return {
            init: init,
            show: show,
            workItems: dataModel.workItems,
            nav: navToWorkItem,
            logout: logout
        }
    }());

    return workflowitemsViewModel;

}());