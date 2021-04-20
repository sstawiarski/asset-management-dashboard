module.exports = function (redisFunctions) {

    async function save(key, value) {
        const defaultTtl = 86400000; // milliseconds in a day

        if (this._cache.ttl) {
            let ttl = this._cache.ttl;
            if (typeof ttl === 'number' && ttl > 0)
                return await redisFunctions.set(key, value, 'PX', ttl);
        }

        if (this._cache.pexpireAt) {
            const pexpireAt = this._cache.pexpireAt;
            if (typeof pexpireAt === 'number' || pexpireAt instanceof Date) {
                const result = await redisFunctions.set(key, value);
                await redisFunctions.pexpireat(key, epochInMillis(pexpireAt));
                return result;
            }
        }

        if (this._cache.persist)
            return await redisFunctions.set(key, value);

        return await redisFunctions.set(key, value, 'PX', defaultTtl);
    }

    function epochInMillis(pexpireAt) {
        return pexpireAt instanceof Date
            ? pexpireAt.getTime()
            : pexpireAt;
    }

    return Object.freeze({
        save
    });
};