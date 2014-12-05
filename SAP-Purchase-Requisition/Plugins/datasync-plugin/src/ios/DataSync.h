//
//  DataSync.h
//  HelloCordova
//
//  Created by wfmac on 7/21/14.
//
//

#import <Cordova/CDVPlugin.h>

@interface DataSync : CDVPlugin

// arg1: contextName
- (void)createOfflineContext:(CDVInvokedUrlCommand*)command;

// arg1: contextName
- (void)createOfflineContextAsync:(CDVInvokedUrlCommand*)command;

// arg1: contextName
// arg2: apiKey
// arg3: username
// arg4: password
- (void)createContext:(CDVInvokedUrlCommand*)command;

// arg1: contextName
// arg2: apiKey
// arg3: username
// arg4: password
- (void)createContextAsync:(CDVInvokedUrlCommand*)command;


// clientWithRootURI: "http://asdfasdfasdfa/"
// credential = {username: "aaa", password:"passStrin	"}
// serviceVersion:4
// entityToSetMappings: {"SalesOrder"  : "SalesOrders", "" : "" }
// entityToServiceTypeMappings: {"SalesOrder"  : "ZCD204_EPM_DEMO_SRV.SalesOrder"};
// systemFieldsNamesMappings: {"CreatedAt"  : "CreatedAt",
//     			 "ModifiedAt" : "ChangedAt"};

// contextName
// apiKey
// username
// password
- (void)createODataContext:(NSDictionary *)options
                withResult:(CDVPluginResult**) result;

- (void)createEverliveContext:(NSDictionary *)options
                   withResult:(CDVPluginResult**) result;

// arg1: className
// arg2: primaryKey
// arg3: JSON containing { property, type } pairs
- (void)registerClass:(CDVInvokedUrlCommand*)command;

// arg1: className
// arg2: primaryKey
// arg3: JSON containing { property, type } pairs
- (void)registerClassAsync:(CDVInvokedUrlCommand*)command;

// arg1: className
// arg2: JSON containing { property, value } pairs
- (void)insertObject:(CDVInvokedUrlCommand*)command;

// arg1: className
// arg2: JSON containing { property, value } pairs
- (void)updateObject:(CDVInvokedUrlCommand*)command;

// arg1: className
// arg2: primaryKey
// arg3: primaryKeyValue
- (void)removeObject:(CDVInvokedUrlCommand*)command;

// arg1: className
- (void)allObjects:(CDVInvokedUrlCommand*)command;

// arg1: className
// arg2: Sql query
- (void)queryObjects:(CDVInvokedUrlCommand*)command;

// no arguments
- (void)syncChanges:(CDVInvokedUrlCommand*)command;

// arg1: className
- (void)syncModel:(CDVInvokedUrlCommand*)command;

@end
