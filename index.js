var fs = require('fs');
var path = require('path');
var util = require('util');

var combined = {};
var rootPath = './data';
var count = 0;
var max = 0;

// Returns all directories in a path
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

var fileCallback = function(filename, content, language) {
	combined[language] = JSON.parse(content);
	count++;
	if (max === count) {
		var minified = JSON.stringify(combined);
		fs.writeFileSync(rootPath + '/allCountries.json', minified , 'utf-8');	
	}
};

var errorHandler = function(error) {
	console.log(error);
}

// Read all files in a folder
function readFiles(dirname, language, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content, language);
      });
    });
  });
}

var dirs = getDirectories(rootPath);
max = dirs.length;
for (var i = 0; i < max; i++) {
	var language = dirs[i];
	readFiles(rootPath + '/' + language + '/', language, fileCallback, errorHandler);
}