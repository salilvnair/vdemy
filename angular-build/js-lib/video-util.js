let ffprobe = require('ffprobe-static')
let execa = require('execa')

var getVideoDuration = function (input) {
    const params = ['-v', 'error', '-show_format', '-show_streams']
    if (typeof input === 'string') {
        var output = execa.sync(ffprobe.path, [...params, input]);
        const matched = output.stdout.match(/duration="?(\d*\.\d*)"?/);
        return parseFloat(matched[1]);
    }
    throw new Error('No duration found!')
}

module.exports.getVideoDuration = getVideoDuration;