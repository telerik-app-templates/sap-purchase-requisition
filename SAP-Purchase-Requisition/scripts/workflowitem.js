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

            var ds = workflowitemModel.workflowDetails;

            ds.bind("change", function (e) {
                if (e.items && e.items.length > 0) {
                    var obs = e.items[0];

                    // Formatted fields
                    obs.FormattedPrice = function () {
                        return obs.Value + " / " + obs.Quantity;
                    };
                    obs.MaterialGroup = function () {
                        return obs.ProductDetails.MaterialGroupDescription + " (" + obs.ProductDetails.MaterialGroup + ")";
                    }

                    // Bind details form
                    kendo.bind($("#workflow-item-div"), obs);

                    // Bind notes if any
                    if (obs.NumberOfNotes > 0) {
                        $("#notes-div").show();

                        console.log(obs.Notes.results);

                        $("#notes-list").kendoMobileListView({
                            style: "inset",
                            dataSource: obs.Notes.results,
                            template: $("#notes-item-template").text()
                        });

                    } 
                } else {
                    console.log("no details!");
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
            workflowDetails: workflowitemModel.workflowDetails,
            approve: approve,
            reject: reject,
            hide: hide
        }
    }());

    return workflowitemViewModel;

}());