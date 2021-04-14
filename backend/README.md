# Product Management Portal
## Backend

### Environment Variables
| Variable        | Description                                                                   | Example Value                                                                      |
|-----------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| `DB_URL`        | The URL of the MongoDB database to use                                        | `mongodb+srv://[user]:[password]@[address]/[database]?retryWrites=true&w=majority` |
| `CORS_URL`      | The URL to enable CORS on (i.e. the frontend URL)                             | `http://localhost:3000`                                                            |
| `PORT`          | The port to serve the API from                                                | `4000`                                                                             |
| `REDIS_CLIENT`  | The URI of the Redis client for caching (required if `ENABLE_CACHE` is `true` | `redis://127.0.0.1:6379`                                                           |
| `ENABLE_CACHE`  | Whether or not to enable caching with Redis                                   | `true`                                                                             |
| `CACHE_MINUTES` | The number of minutes for which to store all cached data in Redis             | `60`                                                                               |