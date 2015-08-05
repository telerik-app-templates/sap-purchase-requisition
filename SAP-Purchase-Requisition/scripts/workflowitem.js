var app = app || {};

app.WorkflowItem = (function () {
    'use strict'

    var dataModel = (function () {
        var widModel = {
            id: Everlive.idField,
            fields: {
                workItemId: {
                    field: 'WorkItemId',
                    defaultValue: ''                    
                },
                deliveryPlant: {
                    field: 'DeliveryPlant',
                    defaultValue: ''                    
                },
                deliveryState: {
                    field: 'DeliveryState',
                    defaultValue: ''
                },
                description: {
                    field: 'Description',
                    defaultValue: ''                    
                },
                notes: {
                    field: 'Notes',
                    defaultValue: ''                    
                },
                quantity: {
                    field: 'Quantity',
                    defaultValue: ''                    
                },
                unitPrice: {
                    field: 'UnitPrice',
                    defaultValue: ''                    
                }                
            }
        };
        
        var widDataSource = new kendo.data.DataSource({
           type: 'everlive',
            schema: {
                model: widModel
            },
            transport: {
                typeName: 'WorkItemDetails'
            }
        });
        
        return {
            workItems: widDataSource
        }
    }());

    var workflowitemViewModel = (function () {

        var currentItem = null;

        var init = function (e) {            

        };

        var beforeShow = function () {
            analytics.Monitor().TrackFeatureStart("WorkflowItem.View");
            
            currentItem = appSettings.selectedWorkItem;
            $("#notes-div").hide();

            var ds = dataModel.workItems;
            ds.filter({
                field: "workItemId", 
                operator: "eq",
                value: currentItem.workItemId
            });

            ds.bind("change", function (e) {
                if (e.items && e.items.length > 0) {
                    var obs = e.items[0];

                    // Bind details form
                    kendo.bind($("#workflow-item-div"), obs);

                    var result = JSON.parse(obs.notes.result);
                    
                    // Bind notes if any
                    if (result.notes.length > 0) {
                        $("#notes-div").show();

                        $("#notes-list").kendoMobileListView({
                            style: "inset",
                            dataSource: result.notes,
                            template: $("#notes-item-template").text()
                        });

                    } 
                } 
            });

            ds.read();
        };

        var hide = function () {
            analytics.Monitor().TrackFeatureStop("WorkflowItem.View");
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
            beforeShow: beforeShow,
            approve: approve,
            reject: reject,
            hide: hide
        }
    }());

    return workflowitemViewModel;

}());