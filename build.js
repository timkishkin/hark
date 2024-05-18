var browserify = require('browserify'),
    fs = require('fs'),
    through = require('through2');

const headerComment =
`/**
 * hark.js
 * Tiny browser/commonJS module that listens to an audio stream, and emits events indicating whether the user is speaking or not
 * Modified by Linkando team
 * Repo: https://github.com/timkishkin/hark
 * Original repo: https://github.com/otalk/hark
 * @story User Story 7456: AI copilot: real-time filling out of AC: PoC pt.1
 */\n`;
    
var bundle = browserify();
bundle.add('./hark');
bundle.bundle({standalone: 'hark'})
      .pipe(prependComment(headerComment))
      .pipe(fs.createWriteStream('hark.bundle.js'));

var demo = browserify(['./example/demo.js'])
            .bundle()
            .pipe(fs.createWriteStream('./example/demo.bundle.js'));

// Create a transform stream to prepend a comment
function prependComment(comment) {
    let isFirstChunk = true;
    return through(function(chunk, enc, callback) {
        if (isFirstChunk) {
            isFirstChunk = false;
            this.push(Buffer.from(comment + '\n'));
        }
        this.push(chunk);
        callback();
    });
}

