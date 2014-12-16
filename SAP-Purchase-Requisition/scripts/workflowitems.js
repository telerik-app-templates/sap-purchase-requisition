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
         
        var registerDataClass = function () {
            dataSync.registerClass({
                EntityName: 'PurchaseOrderExpanded',
                PrimaryKeyName: 'WorkitemID',
                PrimaryKeyAutoIncrement: 'false',
                PropertyValues: {
                    WorkitemID: '@"NSString"',
                    CreatedByID: '@"NSString"',
                    PrNumber: '@"NSString"',
                    Value: '@"NSString"'
                }
            }, function success(rs) {
                console.log("register success ");
                console.log(rs);
                dataSync.syncChanges(
                    function suc(ss) {
                        console.log("sync success");
                        console.log(ss);
                        dataSync.saveChanges(function saveSuccess(saveS) { console.log("save worked"); }, function saveFail(saveF) { console.log("save failed") });
                    },
                    function fai(sf) {
                        console.log("sync fail");
                        console.log(sf);
                    });
            }, function fail(rf) {
                console.log("register fail");
                console.log(rf);
            });
        };

        var init = function () {
            registerDataClass();
        };

        var show = function () {
            
        };

        var navToWorkItem = function (e) {
            console.log("Tapped item");
            console.log(e.data);
            console.log(e.data.WorkitemID);
            appSettings.selectedWorkItem = e.data;
            localStorage.setItem("WI", e.data);
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