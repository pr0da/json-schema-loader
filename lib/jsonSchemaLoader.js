var path = require('path');
var fs = require('fs');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
    var loaderContext = this;
	var value = typeof source === "string" ? JSON.parse(source) : source;
    var query = loaderUtils.parseQuery(loaderContext.query);
    var prefix = query.prefix || '';
    var postfix = query.postfix || '.json';
    var root = query.root || '';
    var context = loaderContext.context;
        
    loaderContext.cacheable && loaderContext.cacheable();
    
    value = process(value);
        
	loaderContext.value = [value];
	return "module.exports = " + JSON.stringify(value, undefined, "\t") + ";";
    
    function processObject(source) {
        
        if (typeof source.$ref === 'string') {
            var value = source.$ref.replace(prefix, '') + postfix;
            var refPath = path.resolve(path.join(context, root, value));
            var json = JSON.parse(fs.readFileSync(refPath, {
                encoding: 'utf8'
            }));
            loaderContext.addDependency(refPath);
            delete source.$ref;
            Object.assign(source, json);
        }
        
        return Object.keys(source).reduce(function(reducer, key) {
            reducer[key] = process(source[key]);
            return reducer;
        }, {});
    }
    
    function process(source) {
        if (typeof source !== 'object' ) {
            return source;
        }
        
        if (Array.isArray(source)) {
            return source.map(process);
        }
                
        return processObject(source);
    }
}