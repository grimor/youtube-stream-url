var VideoInfo = require('./lib/video_info');
var qs = require('querystring');
var util = require('util');

// Deqt3vlwZ7U
var video = new VideoInfo('Deqt3vlwZ7U');

video._getVideoInfo(function() {
  var s = qs.parse(video.videoInfo.url_encoded_fmt_stream_map).s[0]
  var v = qs.parse(video.videoInfo.url_encoded_fmt_stream_map).url[0];
  var dash = video.videoInfo.dashmpd;
  video._downloadHTML5Player(function() {
    // console.log(video.html5PlayerURL);
    video._getDecodeFunction(function(decode) {
      var sig = decode(s);
      console.log(s);
      console.log(sig);
      // console.log(v);
      //
      // var dashURL = decodeURIComponent(dash);
      // var dashSigRe = /\/s\/([a-fA-F0-9\.]+)/;
      // var dashSig = dashSigRe.exec(dashURL)[1];
      // console.log(dashSig);
      // var dashDecodedSig = decode(dashSig);
      // console.log(dashDecodedSig);
      // dashURL = dashURL.replace(/\/s\/([a-fA-F0-9\.]+)/, '/signature/'+ dashDecodedSig);
      // console.log(video.videoInfo);
      // console.log(dashURL);
      // console.log(qs.unescape(v) + '&signature=' + sig);
      //
      // console.log(video.videoInfo);
      console.log(qs.parse(video.videoInfo.adaptive_fmts).url[12]);
    });
  });
});

// var video = new VideoInfo('pPGaR7GhF7E');

// video._getVideoInfo(function() {
//   console.log(video.videoInfo.dashmpd);
// });
