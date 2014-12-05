//
//  TKDataSyncContext.h
//  DataSyncDemo
//
//  Copyright (c) 2014 Telerik. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TKCloudClientProtocol.h"
#import "TKPersistencePublicProtocol.h"
#import "TKDataSyncDelegate.h"

//note: currently we support only sqlite database for local persistence
NS_ENUM(int, TKLocalStoreType)
{
    TKSQLite = 1
};

@class TKDataSyncPolicy;
@class TKODataClient;

/**
 TKDataSyncContext class is the façade for SQLite database manipulation with ORM features.
 It orchestrates the CRUD operations and the synchronization process of tables in this database. 
 The context instance keeps the internal state of data schema and data sets that should be persisted.
 */
@interface TKDataSyncContext : NSObject<TKPersistencePublicProtocol>

//The delegate that conforms to TKDataSyncDelegate protocol
@property (nonatomic, weak) id<TKDataSyncDelegate> delegate;

-(instancetype) initWithLocalStoreName:(NSString*) storeName
                         serviceClient:(id<TKCloudClientProtocol>) cloudClient
                            syncPolicy:(TKDataSyncPolicy*) policy;

#pragma mark Local context methods

/*!
 Creates an index with given name on listed columns
 @param indexName  The name of index
 @param entityClass The entity class that the index is associated to
 @param columns  Array of names of columns that are indexed
 @param orders  Array with sort orders of columns
 @param unique  The uniqueness of index tuples
 */
- (void)registerIndex:(NSString*) indexName
             forClass:(Class) entityClass
            onColumns:(NSArray*) columns
           withOrders:(NSArray*) orders
             asUnique:(BOOL) unique;

/*!
 Registers a given field as primary key for entity class
 @param entityClass  The entity class that the primary key is defined of
 @param fieldName The field name that will be a primary key
 @param autoincrement  If the primary key is auto incremental
 */
- (void)registerClass:(Class)entityClass
  withPrimaryKeyField:(NSString*)fieldName
    asAutoincremental:(BOOL) autoincrement;

/*!
 Excludes the given entity class from synchronization process.
 Use this method to set entity classes that will be used for local persistence only.
 @param entityClass The entity class from data model that shouldn't be included in synchronization
 */
- (void)excludeClassFromSynchronisation:(Class) entityClass;

/*!
 Sets the name of backend table that corresponds to SyncLock table requirements
 @param name The backend table name 
 */
- (void) setBackendSyncLockTableName:(NSString*) name;

/*!
 Sets the name of backend table that corresponds to local entity with given name
 @param backendName The backend table name
 @param localName The name of local entity class(table)
 */
- (void) setBackendTableName:(NSString*) backendName forLocalEntity:(NSString*) localName;

- (void) lockRemoteTableDuringSynchronization:(BOOL) lockTable;

#pragma mark Sync methods
/*!
 Initiates synchronous data synchronization procedure for all changes.
 @param  error The error returned during synchronization
 */
- (BOOL)syncChanges:(NSError**) error;

/*!
 Initiates asynchronous data synchronization procedure for all changes.
 @param queue execution queue for given completion handler
 @param handler callback to be executed after synchronization
 */
-(void)syncChangesAsync:(dispatch_queue_t)queue
      completionHandler:(syncHandler)handler;

/*!
 Initiates synchronous data synchronization procedure for table with given name.
 @param  name  The name of table
 @param  error The error returned during synchronization if any
 */
- (BOOL)syncTable:(NSString*) name
  failedWithError:(NSError**) error;

/*!
 Initiates synchronous data synchronization procedure for table with given name.
 @param queue Execution queue for given completion handler
 @param  name  The name of table
 @param handler callback to be executed after synchronization
 */
- (void)syncTableAsync:(dispatch_queue_t) queue
             tableName:(NSString*) name
     completionHandler:(syncHandler)handler;

/*!
 Sets starting date for data syncronization of given entity.
 @param date The date that will be used as starting point for data synchronization. 
 Only records created after this date will be kept in sync.
 @param entity The entity class that the starting date will be assigned to.
 NOTE: Execution of this method will delete all localy stored records for given entity
 */
- (void)setStartingSyncDate:(NSDate*) date
             forEntityClass:(Class) entity;

/*!
 Removes the starting date for data syncronization assigned to given entity.
 @param entity The entity class that the starting date will be removed for.
 NOTE: Execution of this method will delete all localy stored records for given entity
 */
- (void)removeStartingSyncDateForEntity:(Class) entity;

@end
