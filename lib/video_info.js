var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var vm = require('vm');

function VideoInfo(videoId) {
  this.videoId = videoId;
  this.videoInfo = null;
  this.html5PlayerURL = null;
  this.decodeFunctionName = null;
}

VideoInfo.prototype._getVideoInfo = function(callback) {
  var _this = this;
  request.get('http://www.youtube.com/get_video_info?video_id=' + this.videoId, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      _this.videoInfo = qs.parse(body);
      callback.call(_this);
    } else {
      console.log(err.message, res.statusCode);
    }
  });
};

VideoInfo.prototype._downloadHTML5Player = function(callback) {
  var _this = this;
  var playerRe = /assets":.+?"js":\s*"([^"]+)"/;

  request.get('http://www.youtube.com/embed/' + this.videoId, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      _this.html5PlayerURL = playerRe.exec(body)[1];
      callback.call(_this);
    } else {
      console.log(err, res.statusCode);
    }
  });
};

VideoInfo.prototype._getDecodeFunction = function(callback) {
  var _this = this;
  var url = this.html5PlayerURL.replace(/\\/g, "");
  request.get('http:' + url, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var functionNameRe = /\.sig\|\|([a-zA-Z0-9$]+)\(/;
      var helperObjectNameRe = /\;([A-Za-z0-9]+)\./;

      _this.decodeFunctionName = functionNameRe.exec(body)[1];
      var functionRe = new RegExp("function " + _this.decodeFunctionName + "\\([^\\)]+\\){.*?}\;");
      var decodeFunction = functionRe.exec(body)[0];
      var helperObjectName = helperObjectNameRe.exec(decodeFunction)[1];
      var helperObjectRe = new RegExp("var " + helperObjectName + "={.*?}\;");
      var helperObject = helperObjectRe.exec(body)[0];

      vm.runInThisContext(helperObject);
      vm.runInThisContext(decodeFunction);

      callback.call(_this, global[_this.decodeFunctionName]);
    } else {
      console.log(err);
    }
  });
};

module.exports = VideoInfo;
