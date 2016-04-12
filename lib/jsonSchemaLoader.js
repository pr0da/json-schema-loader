// inspiration: https://github.com/json-schema-form/angular-schema-form/issues/69

var _ = require('lodash');
var JsonRefs = require('json-refs');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
    
    var callback = this.async();
    var jsonObj = typeof source === "string" ? JSON.parse(source) : source;
    var query = loaderUtils.parseQuery(this.query);
    
    this.cacheable && this.cacheable();

    JsonRefs.resolveRefs(jsonObj, {
        filter: ['relative', 'remote'],
        relativeBase: this.context
    })
    .then(handleResolveSuccess.bind(this), callback);
    
    function handleResolveSuccess(res) {
        var json;
        var errors = _.chain(res.refs)
            .values()
            .filter({ missing: true })
            .map((ref) => ref.error)
            .value();
        
        if(errors.length) {
            callback(new Error(errors.join('/n')));
        }
        else {
            var resolved = query.mergeAllOf ? mergeAllOf(res.resolved) : res.resolved;
            json = JSON.stringify(resolved, undefined, "\t");
            
            this.value = [`module.exports = ${json};`];
            
            callback(null, this.value[0]);
        }
    }
}

/**
 * Workaround to merge "allOf" array properties.
 */
function mergeAllOf(jsonObj) {
    
    if (_.isArray(jsonObj)) {
        return _.map(jsonObj, mergeAllOf);
    }
    
    if (!_.isPlainObject(jsonObj)) {
        return jsonObj;
    }
            
    if (_.isArray(jsonObj.allOf)) {
        jsonObj = _.assign(_.merge.apply(_, jsonObj.allOf), _.omit(jsonObj, 'allOf'));
    }
    
    return _.chain(jsonObj)
        .keys()
        .reduce(function(reducer, key) {
            reducer[key] = mergeAllOf(jsonObj[key]);
            return reducer;
        }, {})
        .value();
}