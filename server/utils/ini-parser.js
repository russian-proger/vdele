const fs = require('fs');

function ParseINIString(data){
  var regex = {
      section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
      param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
      comment: /^\s*;.*$/
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;
  lines.forEach(function(line){
      if(regex.comment.test(line)){
          return;
      }else if(regex.param.test(line)){
          var match = line.match(regex.param);
          let val = match[2];
          if (val[0] == "\"") val = val.slice(1,-1);
          if(section){
              value[section][match[1]] = val;
          }else{
              value[match[1]] = val;
          }
      }else if(regex.section.test(line)){
          var match = line.match(regex.section);
          value[match[1]] = {};
          section = match[1];
      }else if(line.length == 0 && section){
          section = null;
      };
  });
  return value;
}

function ParseINIFile(path) {
  if (fs.existsSync(path)) {
    return ParseINIString(fs.readFileSync(path).toString());
  } else {
    throw Error(`ini file doesn't exists: ${path}`);
  }
}

module.exports = ({
  ParseINIFile,
  ParseINIString
});