var webpack = require("webpack");
var test = require('tape');

test('Deep external $ref test', function(t) {
    var expectedSchema = require('./expected.external.json');
    t.plan(1);

    webpack({
        context: __dirname,
        entry: './entry.external.js',
        output: {
            filename: 'external.bundle.js',
            path: __dirname + '/.temp',
            libraryTarget: 'commonjs2'
        }
    }, function(err, stats) {

        if (err) {
            t.fail(err);
            return;
        }

        if (stats.hasErrors()) {
            t.fail(stats.toString({
                chunks: false,
                colors: true,
                errorDetails: true
            }));
            return;
        }

        t.deepEqual(require('./.temp/external.bundle.js'), expectedSchema);

    });

});

test('Internal $ref test', function(t) {
    var expectedSchema = require('./expected.internal.json');
    t.plan(1);

    webpack({
        context: __dirname,
        entry: './entry.internal.js',
        output: {
            filename: 'internal.bundle.js',
            path: __dirname + '/.temp',
            libraryTarget: 'commonjs2'
        }
    }, function(err, stats) {

        if (err) {
            t.fail(err);
            return;
        }

        if (stats.hasErrors()) {
            t.fail(stats.toString({
                chunks: false,
                colors: true,
                errorDetails: true
            }));
            return;
        }

        t.deepEqual(require('./.temp/internal.bundle.js'), expectedSchema);

    });
});

