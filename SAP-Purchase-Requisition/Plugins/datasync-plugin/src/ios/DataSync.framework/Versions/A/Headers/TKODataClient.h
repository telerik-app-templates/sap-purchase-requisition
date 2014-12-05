//
//  TKODataClient.h
//  TelerikUI
//
//  Copyright (c) 2014 Telerik. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TKCloudClientProtocol.h"
#import "TKODataCredential.h"

/*!
 CRUD operations used for multiple endpoints description in client initialization
 */
extern NSString *const TK_CRUD_ANY;
extern NSString *const TK_CRUD_CREATE;
extern NSString *const TK_CRUD_READ;
extern NSString *const TK_CRUD_UPDATE;
extern NSString *const TK_CRUD_DELETE;

@interface TKODataClient : NSObject <TKCloudClientProtocol>

@property (nonatomic, strong) NSString* csrfToken;

+ (instancetype) sharedInstance;

/*!
 Initicialization of OData client with single endpoint used for all CRUD operations for all entity models.
 @param  uri  The url for endpoint used for access to backend
 @param  auth The OData credentials for backend service
 @param  version The OData version of backend services
 @param  setMappings The mapping of entity names to backend collection names
 @param  typeMappings The mapping of entity names to backend type names
 @param  sysFieldNamesMappings The mapping of system fields to corresponding fields on the backend tables
 @result an instance type of OData client with single endpoint
 */
+ (instancetype) clientWithRootURI:(NSString*) uri
                        credential:(TKODataCredential*) auth
                    serviceVersion:(NSInteger) version
               entityToSetMappings:(NSDictionary*) setMappings
       entityToServiceTypeMappings:(NSDictionary*) typeMappings
         systemFieldsNamesMappings:(NSDictionary*) sysFieldNamesMappings;

- (NSString*)getServiceTypeNameForEntity:(NSString*)entityClassName;
- (NSString*)getTypeMetadataTag;


/*!
 Initicialization of OData client with multiple endpoints used for CRUD operations for specified entity models.
 @param  endpoints  The dictionary with endpoints for CRUD operations in format:
    model_name -> [(CRUD_operaion -> endpoint_URL) ...]
 @param  auth The OData credentials for backend service
 @param  version The OData version of backend services
 @param  setMappings The mapping of entity names to backend collection names
 @param  typeMappings The mapping of entity names to backend type names
 @param  sysFieldNamesMappings The mapping of system fields to corresponding fields on the backend tables
 @result an instance type of OData client with single endpoint
 */
+ (instancetype) clientWithMultipleEndpoints:(NSDictionary*) endpoints
                        credential:(TKODataCredential*) auth
                    serviceVersion:(NSInteger) version
               entityToSetMappings:(NSDictionary*) setMappings
       entityToServiceTypeMappings:(NSDictionary*) typeMappings
         systemFieldsNamesMappings:(NSDictionary*) sysFieldNamesMappings;


@end
