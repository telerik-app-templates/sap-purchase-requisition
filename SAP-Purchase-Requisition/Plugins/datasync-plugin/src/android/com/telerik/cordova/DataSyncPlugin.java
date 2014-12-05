package com.telerik.cordova;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.dexmaker.DexMaker;
import com.squareup.okhttp.internal.http.Policy;
import com.telerik.android.common.serialization.JSONHelper;
import com.telerik.widget.datasync.cloud.CloudClient;
import com.telerik.widget.datasync.cloud.SynchronizationException;
import com.telerik.widget.datasync.cloud.implementations.EverliveCloudClient;
import com.telerik.widget.datasync.dynamic.TypeInfo;
import com.telerik.widget.datasync.dynamic.TypeStructureGeneratorContext;
import com.telerik.widget.datasync.syncengine.DataSyncContext;
import com.telerik.widget.datasync.syncengine.DataSyncPolicy;
import com.telerik.widget.datasync.syncengine.DataSyncReachabilityOptions;
import com.telerik.widget.datasync.syncengine.DataSyncResolutionType;
import com.telerik.widget.datasync.syncengine.DataSyncType;

public class DataSyncPlugin extends CordovaPlugin {
	private CallbackContext callbackContext;
	private DataSyncContext dataSyncContext;
	private TypeStructureGeneratorContext dynamicClassGenerator;

	private static final String PROVIDER_PROPERTY_KEY = "ProviderName";
	private static final String HOSTNAME_PROPERTY_KEY = "ProviderHostName";
	private static final String USERNAME_PROPERTY_KEY = "Username";
	private static final String PASSWORD_PROPERTY_KEY = "Password";
	private static final String API_KEY_PROPERTY_KEY = "ApiKey";
	private static final String API_VERSION_PROPERTY_KEY = "ApiVersion";
	private static final String LOCAL_DATABASE_PROPERTY_KEY = "LocalDatabaseName";
	private static final String DATA_SYNC_TYPE_PROPERTY_KEY = "DataSyncType";
	private static final String DATA_CONFLICT_RESOLUTION_TYPE_PROPERTY_KEY = "SyncConflictResolutionType";
	private static final String DATA_SYNC_TIMEOUT_PROPERTY_KEY = "DataSyncTimeout";
	private static final String DATA_SYNC_TIME_INTERVAL_PROPERTY_KEY = "DataSyncTimeInterval";
	private static final String DATA_SYNC_REACHABILITY_PROPERTY_KEY = "DataSyncReachability";
	
	private static final String ENTITY_NAME_ARGUMENT_KEY = "EntityName";
	private static final String PRIMARY_KEY_NAME_ARGUMENT_KEY = "PrimaryKeyName";
	private static final String QUERY_ARGUMENT_KEY = "Query";
	private static final String PROPERTY_VALUES_ARGUMENT_KEY = "PropertyValues";

	private static final String MULTIPLE_POINTS_MAP_ARGUMENT_KEY = "EntityPointsMap";
	private static final String MAPPING_ARGUMENT_KEY = "Mappping";
	private static final String TYPE_MAPPING_ARGUMENT_KEY = "TypeMapping";
	private static final String SYSTEM_FIELDS_MAPPING_ARGUMENT_KEY = "SystemFieldsMapping";

	public DataSyncPlugin() {
		// Init the dynamic class generator and pass it to the class generator
		// engine.
		DexMaker dexMaker = new DexMaker();
		this.dynamicClassGenerator = new TypeStructureGeneratorContext(
				this.cordova.getActivity(), dexMaker);
		// We do this to make sure any generated .jar files with dynamic types
		// are preloaded to optimize performance.
		this.dynamicClassGenerator.preLoadTypesCache();
	}

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		// TODO Auto-generated method stub
		this.callbackContext = callbackContext;
		if (action.compareToIgnoreCase("createContext") == 0) {
			this.createContext(args);
		} else if (action.compareToIgnoreCase("syncChanges") == 0) {
			try {
				this.dataSyncContext.syncChanges();
				PluginResult pResult = new PluginResult(Status.OK);
				this.callbackContext.sendPluginResult(pResult);
			} catch (SynchronizationException e) {
				PluginResult pResult = new PluginResult(Status.ERROR,
						e.getMessage());
				this.callbackContext.sendPluginResult(pResult);
			}
		} else if (action.compareToIgnoreCase("registerClass") == 0) {
			try {
				if (this.registerClass(args)) {
					PluginResult pResult = new PluginResult(Status.OK);
					callbackContext.sendPluginResult(pResult);
				} else {
					PluginResult pResult = new PluginResult(Status.ERROR,
							"Class already registered.");
					callbackContext.sendPluginResult(pResult);
				}
			} catch (JSONException e) {
				PluginResult pResult = new PluginResult(Status.JSON_EXCEPTION,
						e.getMessage());
				callbackContext.sendPluginResult(pResult);
			}

		} else if (action.compareToIgnoreCase("allObjects") == 0) {
			try {
				JSONArray objects = this.fetchAllObjects(args);
				PluginResult pResult = new PluginResult(Status.OK, objects);
				callbackContext.sendPluginResult(pResult);
			} catch (JSONException e) {
				PluginResult pResult = new PluginResult(Status.JSON_EXCEPTION,
						e.getMessage());
				callbackContext.sendPluginResult(pResult);
			}
		} else if (action.compareToIgnoreCase("queryObjects") == 0) {
			try {
				JSONArray result = this.queryObjects(args);
				PluginResult pResult = new PluginResult(Status.OK, result);
				callbackContext.sendPluginResult(pResult);
			} catch (JSONException e) {
				PluginResult pResult = new PluginResult(Status.JSON_EXCEPTION,
						e.getMessage());
				callbackContext.sendPluginResult(pResult);
			}

		} else if (action.compareToIgnoreCase("updateObject") == 0) {

			try {
				this.updateObject(args);
				PluginResult pResult = new PluginResult(Status.OK);
				callbackContext.sendPluginResult(pResult);
			} catch (NoSuchMethodException e) {
				PluginResult pResult = new PluginResult(Status.ERROR,
						e.getMessage());
				callbackContext.sendPluginResult(pResult);
			} catch (IllegalAccessException e) {
				PluginResult pResult = new PluginResult(
						Status.ILLEGAL_ACCESS_EXCEPTION, e.getMessage());
				callbackContext.sendPluginResult(pResult);
			} catch (InvocationTargetException e) {
				PluginResult pResult = new PluginResult(Status.ERROR,
						e.getMessage());
				callbackContext.sendPluginResult(pResult);
			} catch (InstantiationException e) {
				PluginResult pResult = new PluginResult(
						Status.INSTANTIATION_EXCEPTION, e.getMessage());
				callbackContext.sendPluginResult(pResult);
			}

		} else if (action.compareToIgnoreCase("removeObject") == 0) {
			try {
				this.removeObject(args);
				callbackContext.success();
			} catch (Exception e) {
				callbackContext.error(e.getMessage());
			}

		} else if (action.compareToIgnoreCase("insertObject") == 0) {

			try {
				this.insertObject(args);
				PluginResult pResult = new PluginResult(Status.OK);
				callbackContext.sendPluginResult(pResult);
			} catch (JSONException e) {
				PluginResult pResult = new PluginResult(Status.JSON_EXCEPTION,
						e.getMessage());
				callbackContext.sendPluginResult(pResult);
			} catch (InstantiationException e) {
				PluginResult pResult = new PluginResult(
						Status.INSTANTIATION_EXCEPTION, e.getMessage());
				callbackContext.sendPluginResult(pResult);
			} catch (Exception e) {
				callbackContext.error(e.getMessage());
			}
		}

		return true;
	}

	private void createContext(JSONArray args) throws JSONException {

		JSONObject options = args.getJSONObject(0);
		CloudClient client = null;
		if (options.has(PROVIDER_PROPERTY_KEY)) {
			String providerName = options.getString(PROVIDER_PROPERTY_KEY);
			if (providerName.equals("Everlive")) {
				String apiKey = options.getString(API_KEY_PROPERTY_KEY);
				String apiVersion = options.getString(API_VERSION_PROPERTY_KEY);
				String hostName = options.getString(HOSTNAME_PROPERTY_KEY);
				client = new EverliveCloudClient(hostName, apiVersion, apiKey);
				String localDatabaseName = options
						.getString(LOCAL_DATABASE_PROPERTY_KEY);
				DataSyncPolicy syncPolicy = new DataSyncPolicy();

				if (options.has(DATA_CONFLICT_RESOLUTION_TYPE_PROPERTY_KEY)) {
					String conflictRes = options
							.getString(DATA_CONFLICT_RESOLUTION_TYPE_PROPERTY_KEY);
					syncPolicy.setDataSyncResolutionType(DataSyncResolutionType
							.valueOf(conflictRes));
				}

				if (options.has(DATA_SYNC_REACHABILITY_PROPERTY_KEY)) {
					String reachabilityOptions = options
							.getString(DATA_SYNC_REACHABILITY_PROPERTY_KEY);
					syncPolicy
							.setReachabilityOptions(DataSyncReachabilityOptions
									.valueOf(reachabilityOptions));
				}

				if (options.has(DATA_SYNC_TIME_INTERVAL_PROPERTY_KEY)) {
					long syncTimeInterval = options
							.getLong(DATA_SYNC_TIME_INTERVAL_PROPERTY_KEY);
					syncPolicy.setSyncTimeInterval(syncTimeInterval);
				}

				if (options.has(DATA_SYNC_TIMEOUT_PROPERTY_KEY)) {
					long syncTimeout = options
							.getLong(DATA_SYNC_TIMEOUT_PROPERTY_KEY);
					syncPolicy.setSyncTimeout(syncTimeout);
				}

				if (options.has(DATA_SYNC_TYPE_PROPERTY_KEY)) {
					String dataSyncType = options
							.getString(DATA_SYNC_TYPE_PROPERTY_KEY);
					syncPolicy.setSyncType(DataSyncType.valueOf(dataSyncType));
				}

				this.dataSyncContext = new DataSyncContext(localDatabaseName,
						client, syncPolicy);
			}
		}

	}

	private boolean registerClass(JSONArray args) throws JSONException {
		JSONObject propertiesHolder = args.getJSONObject(0);
		String typeName = propertiesHolder.getString(ENTITY_NAME_ARGUMENT_KEY);
		if (this.dynamicClassGenerator.getClassForTypeName(typeName) != null) {
			return false;
		} else {
			String primaryKeyName = propertiesHolder
					.getString(PRIMARY_KEY_NAME_ARGUMENT_KEY);
			JSONObject jsonObject = propertiesHolder
					.getJSONObject(PROPERTY_VALUES_ARGUMENT_KEY);
			HashMap<String, Class> properties = new HashMap<String, Class>();
			Iterator<?> keysIterator = jsonObject.keys();
			while (keysIterator.hasNext()) {
				String key = (String) keysIterator.next();
				String propertyType = jsonObject.getString(key);
				if (propertyType.equalsIgnoreCase(String.class.getSimpleName())) {
					properties.put(key, String.class);

				} else if (propertyType.equalsIgnoreCase(Integer.class
						.getSimpleName())) {
					properties.put(key, Integer.class);

				} else if (propertyType.equalsIgnoreCase(Boolean.class
						.getSimpleName())) {
					properties.put(key, Boolean.class);
				} else if (propertyType.equalsIgnoreCase("number")) {
					properties.put(key, Float.class);
				}
			}

			TypeInfo ti = new TypeInfo(typeName, properties);
			boolean success;

			success = this.dynamicClassGenerator.registerClassForTypeInfo(ti);
			return success;
		}
	}

	private JSONArray fetchAllObjects(JSONArray args) throws JSONException {
		JSONObject propertiesHolder = args.getJSONObject(0);
		String entityName = propertiesHolder.getString(ENTITY_NAME_ARGUMENT_KEY);
		Class<?> entityType = this.dynamicClassGenerator
				.getClassForTypeName(entityName);

		ArrayList<Object> result = this.dataSyncContext
				.getAllObjectsOfType(entityType);
		JSONArray serialized = JSONHelper.toJSONArray(result);

		return serialized;
	}

	private JSONArray queryObjects(JSONArray args) throws JSONException {
		JSONObject propertiesHolder = args.getJSONObject(0);
		String entityName = propertiesHolder.getString(ENTITY_NAME_ARGUMENT_KEY);
		String query = propertiesHolder.getString(QUERY_ARGUMENT_KEY);
		Class<?> entityType = this.dynamicClassGenerator
				.getClassForTypeName(entityName);

		ArrayList<Object> result = this.dataSyncContext.getObjectsWithQuery(
				query, null, entityType);
		JSONArray serialized = JSONHelper.toJSONArray(result);
		return serialized;
	}

	private void updateObject(JSONArray args) throws JSONException,
			NoSuchMethodException, IllegalAccessException,
			InvocationTargetException, InstantiationException {

		JSONObject propertiesHolder = args.getJSONObject(0);
		String entityName = propertiesHolder.getString(ENTITY_NAME_ARGUMENT_KEY);
		JSONObject entity = propertiesHolder.getJSONObject(PROPERTY_VALUES_ARGUMENT_KEY);

		Class<?> type = this.dynamicClassGenerator
				.getClassForTypeName(entityName);

		Object typedInstance = type.newInstance();

		JSONHelper.init(typedInstance, entity, null, null);
		this.dataSyncContext.updateObject(typedInstance);
	}

	private void removeObject(JSONArray args) throws JSONException,
			NoSuchMethodException, IllegalAccessException,
			InvocationTargetException, InstantiationException {

		JSONObject propertiesHolder = args.getJSONObject(0);
		
		String entityName = propertiesHolder.getString(ENTITY_NAME_ARGUMENT_KEY);
		JSONObject entity = propertiesHolder.getJSONObject(PROPERTY_VALUES_ARGUMENT_KEY);
		
		Class<?> type = this.dynamicClassGenerator
				.getClassForTypeName(entityName);

		Object typedInstance = type.newInstance();

		JSONHelper.init(typedInstance, entity, null, null);
		this.dataSyncContext.deleteObject(typedInstance);
	}

	private boolean insertObject(JSONArray args) throws JSONException,
			InstantiationException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException {

		JSONObject propertiesHolder = args.getJSONObject(0);
		String entityName = propertiesHolder.getString(ENTITY_NAME_ARGUMENT_KEY);
		JSONObject entity = propertiesHolder.getJSONObject(PROPERTY_VALUES_ARGUMENT_KEY);

		Class<?> type = this.dynamicClassGenerator
				.getClassForTypeName(entityName);
		Object typedInstance = type.newInstance();

		JSONHelper.init(typedInstance, entity, null, null);
		this.dataSyncContext.insertObject(typedInstance);
		return true;
	}
}
