# Product Management Portal
## Backend
### Setup
#### Environment Variables
| Variable        | Description                                                                   | Example Value                                                                      |
|-----------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| `DB_URL`        | The URL of the MongoDB database to use                                        | `mongodb+srv://[user]:[password]@[address]/[database]?retryWrites=true&w=majority` |
| `CORS_URL`      | The URL to enable CORS on (i.e. the frontend URL)                             | `http://localhost:3000`                                                            |
| `PORT`          | The port to serve the API from                                                | `4000`                                                                             |
| `REDIS_CLIENT`  | The URI of the Redis client for caching (required if `ENABLE_CACHE` is `true` | `redis://127.0.0.1:6379`                                                           |
| `ENABLE_CACHE`  | Whether or not to enable caching with Redis                                   | `true`                                                                             |
| `CACHE_MINUTES` | The number of minutes for which to store all cached data in Redis             | `60`                                                                               |

#### Database
The POST and PATCH endpoints for Assets, Shipments, and Assemblies used [MongoDB transactions](https://docs.mongodb.com/manual/core/transactions/) in order to ensure that all updates across the multiple collections (Events, Assets, Counters, etc) occur without error, otherwise the transaction is rolled back and nothing is saved. However, this requires that the database be set up as either a **replica set** or a **sharded cluster**. 
  
All MongoDB Atlas DBaaS instances (such as the one we used for our development and testing) automatically come configured as replica sets. If using a local MongoDB instance, you must configure the instances to be either a replica set or a sharded cluster. Single-node replica sets [are possible](https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/), but it is generally preferred to have multiple.
  
For support for creating collections when they do not already exist in a local database, ensure `featureCompatibilityVersion` is set to `"4.4"` (command: `db.adminCommand( { setFeatureCompatibilityVersion: "4.4" } )`).