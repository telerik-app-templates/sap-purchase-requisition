//
//  TKTableNamesMapper.h
//  TelerikUI
//
//  Copyright (c) 2014 Telerik. All rights reserved.
//

#import <Foundation/Foundation.h>

/*!
 
 */
@interface TKTableNamesMapper : NSObject

+ (instancetype)sharedInstance;
- (NSString*) getBackendTableNameForEntity:(NSString*) name;
- (NSString*) getLocalEntityNameForBackendTable:(NSString*) name;
- (void) setBackendTableName:(NSString*) backendName
              forLocalEntity:(NSString*) localName;

@end
