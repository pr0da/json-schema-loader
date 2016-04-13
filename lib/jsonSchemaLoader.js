// inspiration: https://github.com/json-schema-form/angular-schema-form/issues/69

var _ = require('lodash');
var loaderUtils = require('loader-utils');
var $RefParser = require('json-schema-ref-parser');

module.exports = function(source) {
    
    var callback = this.async();
    var jsonObj = typeof source === "string" ? JSON.parse(source) : source;
    var query = loaderUtils.parseQuery(this.query);
    var parser = new $RefParser();
    
    this.cacheable && this.cacheable();
    
    parser.dereference(this.resourcePath)
        .then(handleResolveSuccess.bind(this))
        .catch(callback);
    
    function handleResolveSuccess(schema) {
        var json;
        
        if(query.mergeAllOf) {
            schema = mergeAllOf(schema);
        }
        
        json = JSON.stringify(schema, undefined, 2);
        
        this.value = [`module.exports = ${json};`]
        _.map(parser.$refs.paths(), (file) => this.addDependency(file));
        
        callback(null, this.value[0])
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