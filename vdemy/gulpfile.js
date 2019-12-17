//

const { src, dest } = require('gulp');
var replace = require('gulp-replace')

exports.default = function (cb) {    
    src(['../vdemy-staging/electron/build/index.html'])
        .pipe(replace('type="module"', 'type="text/javascript"'))
        .pipe(dest('../vdemy-staging/electron/build/'));
    cb();
};