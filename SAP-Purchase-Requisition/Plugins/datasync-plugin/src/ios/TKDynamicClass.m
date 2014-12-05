//
//  TKDynamicClass.m
//  HelloCordova
//
//  Created by Tsvetan Raikov on 29/7/14.
//
//

#import "TKDynamicClass.h"
#import <objc/message.h>

@implementation TKDynamicClass

- (instancetype)init
{
    self = [super init];
    if (self) {
        _properties = [NSMutableDictionary new];
    }
    return self;
}

+ (Class)registerClass:(NSString*)name withProperties:(NSDictionary*)classProperties
{
    Class theClass = objc_allocateClassPair([TKDynamicClass class], [name cStringUsingEncoding:[NSString defaultCStringEncoding]], 0);
    for (NSString *propertyName in classProperties) {
        NSString *propertyType = [classProperties objectForKey:propertyName];
        [TKDynamicClass addProperty:propertyName ofType:propertyType inClass:theClass];
    }
    objc_registerClassPair(theClass);
    return theClass;
}

+ (void)addProperty:(NSString*)name ofType:(NSString*)propertyType inClass:(Class)aClass;
{
    NSString *privateName = [NSString stringWithFormat:@"_%@", name];
    objc_property_attribute_t type = { "T", [propertyType cStringUsingEncoding:NSUTF8StringEncoding] };
    objc_property_attribute_t ownership = { "C", "" }; // C = copy
    objc_property_attribute_t backingivar  = { "V", [privateName cStringUsingEncoding:NSUTF8StringEncoding] };
    objc_property_attribute_t attrs[] = { type, ownership, backingivar };
    class_addProperty(aClass, [name cStringUsingEncoding:NSUTF8StringEncoding], attrs, 3);
    class_addMethod(aClass, NSSelectorFromString(name), (IMP)nameGetter, "@@:");
}

+ (id)createInstanceOfClass:(NSString*)name withProperties:(NSDictionary*)properties
{
    Class cls = NSClassFromString(name);
    id instance = [[cls alloc] init];
    for (NSString *propertyName in properties) {
        id value = properties[propertyName];
        [instance setValue:value forKey:propertyName];
    }
    return instance;
}

- (id)valueForUndefinedKey:(NSString *)key
{
    return [_properties objectForKey:key];
}

- (void)setValue:(id)value forUndefinedKey:(NSString *)key
{
    if (!_properties) {
        _properties = [NSMutableDictionary new];
    }
    [_properties setObject:value forKey:key];
}

id nameGetter(id self, SEL _cmd)
{
    NSString *name = NSStringFromSelector(_cmd);
    TKDynamicClass *dynamicClass = (TKDynamicClass*)self;
    return [dynamicClass->_properties valueForKey:name];
}

@end
