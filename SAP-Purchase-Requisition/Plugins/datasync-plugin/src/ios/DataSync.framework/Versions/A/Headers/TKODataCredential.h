//
//  TKODataCredential.h
//  TelerikUI
//
//  Copyright (c) 2014 Telerik. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TKODataCredential : NSObject

@property (readonly, strong) NSString* base64String;

-(instancetype) initForWindowsAuthWithUsername:(NSString*) username
                                      password:(NSString*) password;

-(instancetype) initForAzureACSOfScopeName:(NSString*) scope
                                 issuerKey:(NSString*) key
                          serviceNamespace:(NSString*) name
                                 appliesTo:(NSString*) appliesToValue
                requiresLocalProxySettings:(BOOL) localSettings;



@end
