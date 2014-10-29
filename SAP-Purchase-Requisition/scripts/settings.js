var appSettings = {

    endpoints: {
        prApproval: "http://108.61.40.213:8002/sap/opu/odata/sap/GBAPP_PRAPPROVAL",
        prWorkflowItems: "http://108.61.40.213:8002/sap/opu/odata/sap/GBAPP_PRAPPROVAL;mo/WorkflowTaskCollection?$filter=(SAP__Origin%20eq%20%27EC6_800%27%20and%20(TaskType%20eq%20%27TS00007986%27%20or%20TaskType%20eq%20%27TS20000159%27))",
        prItemDetails: "http://108.61.40.213:8002/sap/opu/odata/sap/GBAPP_PRAPPROVAL;mo/WorkflowTaskCollection(SAP__Origin='EC6_800',WorkitemID='#RequisitonId#')/ItemDetails?$format=json&$expand=Accountings,Notes,Attachments,Limits/Accountings,ServiceLines/Accountings",
        prWorkflow: "http://108.61.40.213:8002/sap/opu/odata/sap/GBAPP_PRAPPROVAL;o=EC6_800/ApplyDecision?WorkitemID=%27#WorkitemID#%27&DecisionKey=%27#DecisionKey#%27&Comment=%27#Comment#%27"
    },

    selectedWorkItem: null,
    itemUpdated: true

};