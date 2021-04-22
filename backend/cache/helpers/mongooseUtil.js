module.exports = function (mongoose) {

    function buildCacheKeyFromQuery(stringify = true) {
        const queryObject = {
            collection: this.mongooseCollection.name,
            operation: this.op,
            filter: this.getFilter(),
            options: this.getOptions(),
            mongooseOptions: this.mongooseOptions(),
            fields: this._fields,
            populatedPaths: this.getPopulatedPaths(),
            isQuery: this instanceof mongoose.Query,
        };

        return stringify
            ? JSON.stringify(queryObject)
            : queryObject;
    }

    function buildCacheKeyFromAggregate(stringify = true) {
        const aggregateObject = {
            collection: this._model.collection.name,
            operation: 'aggregate',
            pipeline: this.pipeline(),
            options: this.options,
            isAggregate: this instanceof mongoose.Aggregate,
        };

        return stringify
            ? JSON.stringify(aggregateObject)
            : aggregateObject;
    }

    function hydratePopulated(json) {
        /*
        TODO: 1. Does not support nested populate query.
        TODO: 2. Not working if _id is excluded in projection query of populated field;
        Suggestion: use '.lean()' wherever possible
         */
        const populated = this.getPopulatedPaths() || [];
        let object = this.model.hydrate(json);

        removeUnwantedDefaultFields(object, this._fields);

        for (let path of populated) {
            let options = this.model.schema.obj[path];
            let { ref } = options;
            if (Array.isArray(options)) {
                ref = options[0].ref;
                if (json[path]) {
                    object[path] = json[path]?.map(obj => mongoose.model(ref).hydrate(obj));
                    object[path].forEach(obj => removeUnwantedDefaultFields(obj, this.mongooseOptions().populate[path].select));
                }
            } else {
                if (json[path]) {
                    object[path] = mongoose.model(ref).hydrate(json[path]);
                    removeUnwantedDefaultFields(object[path], this.mongooseOptions().populate[path].select);
                }
            }
        }

        if (this._fields) {
            const removePopulated = populated.reduce((acc, curr) => {
                if (!Object.keys(this._fields).includes(curr)) acc[curr] = 0;
                else acc[curr] = this._fields[curr];
                return acc;
            }, {});

            removeUnwantedDefaultFields(object, removePopulated);
        }

        return object;
    }

    function removeUnwantedDefaultFields(obj, fields) {
        if (!fields) return;
        if (!Object.keys(fields).length) return;

        if (typeof fields === 'string') {
            fields = fields.trim().split(/ +/);
            fields = fields.reduce((acc, field) => {
                if (field.startsWith('-')) acc[field.substr(1)] = 0;
                else acc[field] = 1;
                return acc;
            }, {})
        }

        if (!("_id" in fields)) fields._id = 1;

        const flag = includeOrExcludeProjection(fields);

        if (flag === 0) {
            for (let key in fields) {
                if (fields[key] === 0) delete obj._doc[key];
            }
        } else {
            for (let key in obj._doc) {
                if (fields[key] !== 1) delete obj._doc[key];
            }
        }
    }

    /*
    returns 1 if the projection is inclusive, else 0;
     */
    function includeOrExcludeProjection(fields) {
        const keys = Object.keys(fields);
        if (keys.length === 1) return fields[keys[0]];

        for (const key of keys) {
            if (key === '_id') continue;
            return fields[key];
        }
    }

    return Object.freeze({
        buildCacheKeyFromQuery,
        buildCacheKeyFromAggregate,
        hydratePopulated
    });
};