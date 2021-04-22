/**
 * Retrieved from https://github.com/varshneyanmol/top-cache
 * 
 * Modified to better support cache clearing
 */

let mongo = null;
let mUtil = null;
let rUtil = null;
let prom = null;

function cache(mongoose, redisClient, cacheEnabled = false) {

    /* Setup initial functions so they still are defined even without caching enabled */
    mongoose.Query.prototype.cache = function (cache = {}) {
        this._cache = (cache && typeof cache === 'object' && cacheEnabled) ? cache : null;
        return this;
    };

    mongoose.Aggregate.prototype.cache = function (cache = {}) {
        this._cache = (cache && typeof cache === 'object' && cacheEnabled) ? cache : null;
        return this;
    };

    mongoose.clearCache = async function (query = null, clearAll = false) {
        return;
    }

    mongoose.Query.prototype.clearCache = mongoose.clearCache;
    mongoose.Aggregate.prototype.clearCache = mongoose.clearCache;

    if (!redisClient) return;

    const promisifiedRedisFunctions = require('./helpers/promisify')(redisClient);
    const mongooseUtil = require('./helpers/mongooseUtil')(mongoose);
    const redisUtil = require('./helpers/redisUtil')(promisifiedRedisFunctions);

    mongo = redisClient;
    mUtil = mongooseUtil;
    rUtil = redisUtil;
    prom = promisifiedRedisFunctions;

    const queryExec = mongoose.Query.prototype.exec;
    const aggregateExec = mongoose.Aggregate.prototype.exec;

    /* Wrap normal execs with redis store ability */
    mongoose.Query.prototype.exec = async function () {
        if (!this._cache)
            return queryExec.apply(this, arguments);

        const key = mongooseUtil.buildCacheKeyFromQuery.call(this);
        const cacheValue = await promisifiedRedisFunctions.get(key);
        if (cacheValue) {
            const docs = JSON.parse(cacheValue);

            if (!docs || typeof docs !== 'object') return docs;
            if (this.mongooseOptions().lean) return docs;
            const result = Array.isArray(docs)
                ? docs.map(d => mongooseUtil.hydratePopulated.call(this, d))
                : mongooseUtil.hydratePopulated.call(this, docs);
            return result;
        }

        const result = await queryExec.apply(this, arguments);
        await redisUtil.save.call(this, key, JSON.stringify(result));
        return result;
    };

    mongoose.Aggregate.prototype.exec = async function () {
        if (!this._cache)
            return aggregateExec.apply(this, arguments);

        const key = mongooseUtil.buildCacheKeyFromAggregate.call(this);
        const cacheValue = await promisifiedRedisFunctions.get(key);
        if (cacheValue)
            return JSON.parse(cacheValue);

        const result = await aggregateExec.apply(this, arguments);
        await redisUtil.save.call(this, key, JSON.stringify(result));
        return result;
    };

    /**
     * Applies clearCache function to the entire mongoose class, can be called directly without having to go through a query class
     * 
     * @param {Object} query the mongoose query object or an object containing a key "collection" whose value is the name of the entire collection whose cache to delete
     * @param {boolean} clearAll whether or not multiple keys or entire collections will be cleared at once
     * @returns 
     */
    mongoose.clearCache = async function (query = null, clearAll = false) {
        if (!query && !clearAll) query = this;

        let key = null;

        if (!query || query && clearAll) {
            if (query?.collection) {
                const allKeys = await promisifiedRedisFunctions.keys('*');
                key = allKeys.filter(item => {
                    const json = JSON.parse(item);
                    if (typeof query.collection === 'string') {
                        return json?.collection === query?.collection;
                    } else if (Array.isArray(query.collection)) {
                        return query.collection.includes(json?.collection);
                    } else return false;
                });
            }
        } else {
            key = query instanceof mongoose.Query
                ? mongooseUtil.buildCacheKeyFromQuery.call(query)
                : query instanceof mongoose.Aggregate
                    ? mongooseUtil.buildCacheKeyFromAggregate.call(query)
                    : null;
        }

        /* Flush entire cache if .clearCache(undefined, true) or .clearCache({}, true) */
        if ((!query || (typeof query === 'object' && !Object.keys(query).length)) && clearAll) {
            return await promisifiedRedisFunctions.flushall();
        }

        if (!key) return;
        if (!clearAll) return await promisifiedRedisFunctions.del(key);
        if (clearAll && Array.isArray(key)) {
            return await (async () => {
                for (const colKey of key) {
                    await promisifiedRedisFunctions.del(colKey);
                }
            })();
        } else return;
    };

    mongoose.Query.prototype.clearCache = mongoose.clearCache;
    mongoose.Aggregate.prototype.clearCache = mongoose.clearCache;

}

async function clearCache(query = null, clearAll = false)  {
        if (!query && !clearAll) query = this;

        let key = null;

        if (!query || query && clearAll) {
            if (query?.collection) {
                const allKeys = await prom?.keys('*');
                key = allKeys.filter(item => {
                    const json = JSON.parse(item);
                    if (typeof query.collection === 'string') {
                        return json?.collection === query?.collection;
                    } else if (Array.isArray(query.collection)) {
                        return query.collection.includes(json?.collection);
                    } else return false;
                });
            }
        } else {
            key = query instanceof mongoose.Query
                ? mongo?.buildCacheKeyFromQuery.call(query)
                : query instanceof mongoose.Aggregate
                    ? mUtil?.buildCacheKeyFromAggregate.call(query)
                    : null;
        }

        /* Flush entire cache if .clearCache(undefined, true) or .clearCache({}, true) */
        if ((!query || (typeof query === 'object' && !Object.keys(query).length)) && clearAll) {
            return await prom?.flushall();
        }

        if (!key) return;
        if (!clearAll) return await prom?.del(key);
        if (clearAll && Array.isArray(key)) {
            return await(async () => {
                for (const colKey of key) {
                    await prom?.del(colKey);
                }
            })();
        } else return;
}

module.exports = {
    cache,
    clearCache
};