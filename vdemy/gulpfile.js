const { src, dest } = require('gulp');
var replace = require('gulp-replace')

exports.default = function (cb) {
    //// Uncomment below while Electron build
    src(['../vdemy-staging/electron/build/index.html'])
        .pipe(replace('type="module"', 'type="text/javascript"'))
        .pipe(dest('../vdemy-staging/electron/build/'));
    cb();

    //// Uncomment below while Angular build
    // src(['../vdemy-staging/angular/build/resources/app/build/index.html'])
    // .pipe(replace('type="module"', 'type="text/javascript"'))
    // .pipe(dest('../vdemy-staging/angular/build/resources/app/build'));
    // cb();
};
