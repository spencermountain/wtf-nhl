var sh = require('shelljs')
var echo = sh.echo
var exec = sh.exec
sh.config.silent = true;
var fs = require('fs');
var pkg = require('../package.json')
var browserify = './node_modules/.bin/browserify';
var derequire = './node_modules/.bin/derequire';
var terser = './node_modules/.bin/terser';

//final build locations
var banner = '/* wtf-nhl v' + pkg.version + '\n   github.com/spencermountain/wtf-nhl\n   MIT\n*/\n';
var uncompressed = './builds/wtf-nhl.js';
var compressed = './builds/wtf-nhl.min.js';

//set new version number
fs.writeFileSync('./_version.js', 'module.exports=\'' + pkg.version + '\'')

//cleanup. remove old builds
exec('rm -rf ./builds && mkdir builds');

//add a header, before our sourcecode
echo(banner).to(uncompressed);
echo(banner).to(compressed);

//browserify + derequire
var cmd = browserify + ' ./src/index.js --standalone wtfNHL';
cmd += ' -t [ babelify --presets [ @babel/preset-env ] ] ' //--no-browser-field';
cmd += ' | ' + derequire;
cmd += ' >> ' + uncompressed;
console.log(cmd)
exec(cmd);

//uglify
cmd = terser + ' ' + uncompressed + ' --mangle --compress ';
cmd += ' >> ' + compressed;
exec(cmd);

//log the size of our builds
let stats = fs.statSync(compressed);
let fileSize = (stats['size'] / 1000.0).toFixed(2);
console.log('\n\n min: ' + fileSize + 'kb');
