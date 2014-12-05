//
//  TKDynamicClass.h
//  HelloCordova
//
//  Created by Tsvetan Raikov on 29/7/14.
//
//

#import <Foundation/Foundation.h>

@interface TKDynamicClass : NSObject

@property (nonatomic, strong) NSMutableDictionary *properties;

+ (Class)registerClass:(NSString*)name withProperties:(NSDictionary*)classProperties;

+ (id)createInstanceOfClass:(NSString*)name withProperties:(NSDictionary*)properties;

+ (void)addProperty:(NSString*)name ofType:(NSString*)propertyType inClass:(Class)aClass;

@end
