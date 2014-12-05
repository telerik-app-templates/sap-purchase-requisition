//
//  DataSync.m
//  HelloCordova
//
//  Created by wfmac on 7/21/14.
//
//

#import <objc/message.h>
#import "DataSync.h"
#import "TKDynamicClass.h"
#import <DataSync/DataSync.h>

NSString* const PROVIDER_PROPERTY_KEY =  @"ProviderName";
NSString* const HOSTNAME_PROPERTY_KEY = @"ProviderHostName";

NSString* const API_KEY_PROPERTY_KEY = @"ApiKey";
NSString* const USERNAME_PROPERTY_KEY = @"Username";
NSString* const PASSWORD_PROPERTY_KEY = @"Password";
NSString* const API_VERSION_PROPERTY_KEY = @"ApiVersion";

NSString* const LOCAL_DATABASE_PROPERTY_KEY = @"LocalDatabaseName";

NSString* const DATA_SYNC_TYPE_PROPERTY_KEY = @"DataSyncType";
NSString* const DATA_CONFLICT_RESOLUTION_TYPE_PROPERTY_KEY = @"SyncConflictResolutionType";
NSString* const DATA_SYNC_TIMEOUT_PROPERTY_KEY = @"DataSyncTimeout";
NSString* const DATA_SYNC_TIME_INTERVAL_PROPERTY_KEY = @"DataSyncTimeInterval";
NSString* const DATA_SYNC_REACHABILITY_PROPERTY_KEY = @"DataSyncReachability";

NSString* const ENTITY_NAME_ARGUMENT_KEY = @"EntityName";
NSString* const PRIMARY_KEY_NAME_ARGUMENT_KEY = @"PrimaryKeyName";
NSString* const QUERY_ARGUMENT_KEY = @"Query";
NSString* const PROPERTY_VALUES_ARGUMENT_KEY = @"PropertyValues";

NSString* const MULTIPLE_POINTS_MAP_ARGUMENT_KEY = @"EntityPointsMap";
NSString* const MAPPING_ARGUMENT_KEY = @"Mappping";
NSString* const TYPE_MAPPING_ARGUMENT_KEY = @"TypeMapping";
NSString* const SYSTEM_FIELDS_MAPPING_ARGUMENT_KEY = @"SystemFieldsMapping";


@implementation DataSync
{
    TKDataSyncContext *_dataContext;
}

#pragma mark Public methods

- (void)createOfflineContext:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result = nil;
    
    if (_dataContext) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"A data context was already created!"];
    }
    else if (command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSString class]]) {
        NSString *contextName = (NSString*)command.arguments[0];
        
        _dataContext = [[TKDataSyncContext alloc] initWithLocalStoreName:contextName
                                                            serviceClient:nil
                                                              syncPolicy:nil];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    }
    
    [self endPluginRequest:result command:command];
}

- (void)createOfflineContextAsync:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        [self createContext:command];
    }];
}

- (void)createEverliveContext:(NSDictionary *)options
                   withResult:(CDVPluginResult**) result
{
    NSString *localDBName   = [options valueForKey: LOCAL_DATABASE_PROPERTY_KEY];
    NSString *apiKey        = [options valueForKey: API_KEY_PROPERTY_KEY];
    NSString *username      = [options valueForKey: USERNAME_PROPERTY_KEY];
    NSString *password      = [options valueForKey: PASSWORD_PROPERTY_KEY];
    NSNumber *serviceVer    = [NSNumber numberWithInt:[[options valueForKey: API_VERSION_PROPERTY_KEY] intValue]];

    NSError *error = nil;
    NSString *accessToken = [self obtainAccessTokenForApiKey:apiKey username:username password:password error:error];
    TKEverliveClient* everlive = [TKEverliveClient clientWithApiKey:apiKey
                                                        accessToken:accessToken
                                                     serviceVersion:serviceVer];
     if (error) {
        *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.domain];
    }
    else if (accessToken.length < 1) {
        *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Was not able to get an access token!"];
    }
    
    TKDataSyncReachabilityOptions reachability = TKSyncIn3GNetwork | TKSyncInWIFINetwork;
    TKDataSyncPolicy* policy = [[TKDataSyncPolicy alloc] initForSyncOnDemandWithReachabilityOptions:reachability
                                                                             conflictResolutionType:TKPreferLocalInstance
                                                                                        syncTimeout:100.0];
 
    _dataContext = [[TKDataSyncContext alloc] initWithLocalStoreName:localDBName serviceClient:everlive syncPolicy:policy];
    
    if (_dataContext){
        *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
        *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Cannot create an Everlive data context!"];
    }
}

- (void)createODataContext:(NSDictionary *)options
                withResult:(CDVPluginResult**) result
{
    NSString *localDBName = [options valueForKey: LOCAL_DATABASE_PROPERTY_KEY];
    NSString *username  = [options valueForKey: USERNAME_PROPERTY_KEY];
    NSString *password  = [options valueForKey: PASSWORD_PROPERTY_KEY];
    
    NSDictionary* entityPointsMap = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];
    NSDictionary* mapping = [options valueForKey:MAPPING_ARGUMENT_KEY];
    NSDictionary* typeMapping = [options valueForKey:TYPE_MAPPING_ARGUMENT_KEY];
    NSDictionary* systemFieldsMapping = [options valueForKey:SYSTEM_FIELDS_MAPPING_ARGUMENT_KEY];
    
    TKODataCredential* credentials = [[TKODataCredential alloc] initForWindowsAuthWithUsername:username
                                                                                      password:password];
    TKODataClient* oDataClient = [TKODataClient clientWithMultipleEndpoints:entityPointsMap
                                                                 credential:credentials
                                                             serviceVersion:3 //currently we support only v3 of OData standard
                                                        entityToSetMappings:mapping
                                                entityToServiceTypeMappings:typeMapping
                                                  systemFieldsNamesMappings:systemFieldsMapping];
    
    TKDataSyncReachabilityOptions reachability = TKSyncIn3GNetwork | TKSyncInWIFINetwork;
    TKDataSyncPolicy* policy = [[TKDataSyncPolicy alloc] initForSyncOnDemandWithReachabilityOptions:reachability
                                                                             conflictResolutionType:TKPreferLocalInstance
                                                                                        syncTimeout:100.0];
    _dataContext = [[TKDataSyncContext alloc] initWithLocalStoreName:localDBName serviceClient:oDataClient syncPolicy:policy];

    if (_dataContext){
        *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
        *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Cannot create an Everlive data context!"];
    }
}

- (void)createContext:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result = nil;
    
    if (_dataContext) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"A data context was already created!"];
    }
    else if (command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]]) {
        NSDictionary *options = command.arguments[0];//[self readJSON:command.arguments[0]];
        if (options){
            
            NSString *contextName = [options valueForKey:PROVIDER_PROPERTY_KEY];
            if(contextName && [contextName compare:@"Everlive"] == NSOrderedSame){
                [self createEverliveContext:options withResult:&result];
              
            } else { //OData
                [self createODataContext:options withResult:&result];
            }
        }
    }

    [self endPluginRequest:result command:command];
}

- (void)createContextAsync:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        [self createContext:command];
    }];
}

- (void)registerClass:(CDVInvokedUrlCommand*)command;
{
    CDVPluginResult *result = nil;
    
    if (_dataContext && command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]])
    {
        NSDictionary *options = command.arguments[0];
        NSString *className = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];
        
        Class cls = NSClassFromString(className);
        if (cls) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                       messageAsString:[NSString stringWithFormat:@"A class with %@ name already exists!", className]];
        }
        else {
            
            NSString *primaryKey = [options valueForKey:PRIMARY_KEY_NAME_ARGUMENT_KEY];
            NSDictionary *properties = [options valueForKey:PROPERTY_VALUES_ARGUMENT_KEY];
            [TKDynamicClass registerClass:className withProperties:properties];
            [_dataContext registerClass:NSClassFromString(className) withPrimaryKeyField:primaryKey asAutoincremental:NO];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        }
    }
    
    [self endPluginRequest:result command:command];
}

- (void)registerClassAsync:(CDVInvokedUrlCommand*)command;
{
    [self.commandDelegate runInBackground:^{
        [self registerClass:command];
    }];
}

- (void)insertObject:(CDVInvokedUrlCommand*)command;
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *result = nil;
        
        if (_dataContext && command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]])
        {
            NSDictionary *options = command.arguments[0];

            NSString *className = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];
            NSDictionary *properties = [options valueForKey:PROPERTY_VALUES_ARGUMENT_KEY];

            NSError *err = nil;
            id instance =  [TKDynamicClass createInstanceOfClass:className withProperties:properties];
            [_dataContext insertObject:instance];
            [_dataContext saveChanges:&err];
            
            if (err) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:err.domain];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }
        
        [self endPluginRequest:result command:command];
    }];
}

- (void)updateObject:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *result = nil;
        
        if (_dataContext && command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]])
        {
            NSDictionary *options = command.arguments[0];
            
            NSString *className = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];
            NSDictionary *properties = [options valueForKey:PROPERTY_VALUES_ARGUMENT_KEY];

            NSError *err = nil;
            id instance =  [TKDynamicClass createInstanceOfClass:className withProperties:properties];
            [_dataContext updateObject:instance];
            [_dataContext saveChanges:&err];
            
            if (err) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:err.domain];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }
        
        [self endPluginRequest:result command:command];
    }];
}

- (void)removeObject:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *result = nil;
        
        if (_dataContext && command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]]) {
            
            NSDictionary *options = command.arguments[0];
            
            NSString *className = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];
            NSString *primaryKey = [options valueForKey:PRIMARY_KEY_NAME_ARGUMENT_KEY];
            NSObject *primaryKeyValue = [options valueForKey:PROPERTY_VALUES_ARGUMENT_KEY];

            NSError *err = nil;
            id instance =  [TKDynamicClass createInstanceOfClass:className withProperties:@{ primaryKey: primaryKeyValue }];
            [_dataContext deleteObject:instance];
            [_dataContext saveChanges:&err];
            
            if (err) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:err.domain];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }
        
        [self endPluginRequest:result command:command];
    }];
}

- (void)allObjects:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *result = nil;
        
        if (_dataContext && command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]]) {

            NSDictionary *options = command.arguments[0];
            NSString *className = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];

            NSError *err = nil;
            Class cls = NSClassFromString(className);
            NSArray *array = [_dataContext getAllObjectsOfType:cls failedWithError:&err];
            
            if (err) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:err.domain];
            }
            else {
                NSString *json = [self writeJSON:array];
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:json];
            }
        }
        
        [self endPluginRequest:result command:command];
    }];
}

- (void)queryObjects:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *result = nil;
        
        if (_dataContext && command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]])
        {
            NSDictionary *options = command.arguments[0];
            NSString *className = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];
            NSString *query = [options valueForKey:QUERY_ARGUMENT_KEY];

            NSError *err = nil;
            Class cls = NSClassFromString(className);
            NSArray *array = [_dataContext getObjectsWithQuery:query withParameters:nil objectType:cls failedWithError:&err];
            
            if (err) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:err.domain];
            }
            else {
                NSString *json = [self writeJSON:array];
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:json];
            }
        }
        
        [self endPluginRequest:result command:command];
    }];
}

- (void)syncChanges:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *result = nil;
        
        if (_dataContext && command.arguments.count == 0) {
            NSError *err = nil;
            [_dataContext syncChanges:&err];
            
            if (err) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:err.domain];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }
        
        [self endPluginRequest:result command:command];
    }];
}

- (void)syncModel:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *result = nil;
        
        if (_dataContext && command.arguments.count == 1 && [command.arguments[0] isKindOfClass:[NSDictionary class]])
        {
            
            NSDictionary *options = command.arguments[0];
            NSString *tableName = [options valueForKey:ENTITY_NAME_ARGUMENT_KEY];
            
            NSError *err = nil;
            [_dataContext syncTable:tableName failedWithError:&err];
            
            if (err) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:err.domain];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }
        
        [self endPluginRequest:result command:command];
    }];
}

#pragma mark Private methods

- (void)endPluginRequest:(CDVPluginResult*)result command:(CDVInvokedUrlCommand*)command
{
    if (!result) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(NSString*)obtainAccessTokenForApiKey:(NSString*)apiKey username:(NSString*)username password:(NSString*)password error:(NSError*)error
{
    NSDictionary *userInfo= @{ @"username": username, @"password": password, @"grant_type": @"password"};
    NSData *body = [NSJSONSerialization dataWithJSONObject:userInfo options:NSJSONWritingPrettyPrinted error:&error];
    NSString* strUrl = [NSString stringWithFormat:@"http://api.everlive.com/v1/%@/oauth/token", apiKey];
    NSURL* url = [NSURL URLWithString:strUrl];
    
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                       timeoutInterval:30];
    
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:body];
    
    NSURLResponse* response = nil;
    NSData* data = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    
    NSDictionary *res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&error];
    
    NSDictionary* resDict = [res objectForKey:@"Result"];
    NSString *token = [resDict objectForKey:@"access_token"];
    
    return token;
}

- (NSString*)writeJSON:(NSArray*)objects
{
    NSError *err;
    NSMutableArray *dictArray = [NSMutableArray new];
    
    for (NSObject *object in objects) {
        NSMutableDictionary *dictionary = [NSMutableDictionary new];
        unsigned int propertiesCount;
        objc_property_t* properties = class_copyPropertyList([object class], &propertiesCount);
        
        for (int i = 0; i < propertiesCount; i++)
        {
            objc_property_t prop = properties[i];
            NSString* propertyName = [NSString stringWithUTF8String:property_getName(prop)];
            id value = [object valueForKey:propertyName];
            [dictionary setValue:value forKey:propertyName];
        }
        
        free(properties);
        [dictArray addObject:dictionary];
    }
    
    NSData *data = [NSJSONSerialization dataWithJSONObject:dictArray options:NSJSONWritingPrettyPrinted error:&err];
    NSString *str = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    return str;
}

- (NSDictionary*)readJSON:(NSString*)jsonString
{
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data
                                                         options:NSJSONReadingAllowFragments
                                                           error:&err];
    return json;
}

@end
