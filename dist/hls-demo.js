typeof window !== "undefined" &&
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HlsDemo"] = factory();
	else
		root["HlsDemo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/main.js":
/*!**********************************!*\
  !*** ./demo/main.js + 1 modules ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./demo/demo-utils.js
function sortObject(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  var temp = {};
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  keys.sort();

  for (var index in keys) {
    temp[keys[index]] = sortObject(obj[keys[index]]);
  }

  return temp;
}
function copyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}
// CONCATENATED MODULE: ./demo/main.js
/* global $, Hls */

/* eslint camelcase: 0 */

var STORAGE_KEYS = {
  Editor_Persistence: 'hlsjs:config-editor-persist',
  Hls_Config: 'hlsjs:config'
};

var testStreams = __webpack_require__(/*! ../tests/test-streams */ "./tests/test-streams.js");

var defaultTestStreamUrl = testStreams['bbb'].url;
var sourceURL = decodeURIComponent(getURLParam('src', defaultTestStreamUrl));
var demoConfig = getURLParam('demoConfig', null);

if (demoConfig) {
  demoConfig = JSON.parse(atob(demoConfig));
} else {
  demoConfig = {};
}

var hlsjsDefaults = {
  debug: true,
  enableWorker: true,
  liveBackBufferLength: 60 * 15
};
var enableStreaming = getDemoConfigPropOrDefault('enableStreaming', true);
var autoRecoverError = getDemoConfigPropOrDefault('autoRecoverError', true);
var levelCapping = getDemoConfigPropOrDefault('levelCapping', -1);
var limitMetrics = getDemoConfigPropOrDefault('limitMetrics', -1);
var dumpfMP4 = getDemoConfigPropOrDefault('dumpfMP4', false);
var bufferingIdx = -1;
var selectedTestStream = null;
var video = $('#video')[0];
var startTime = Date.now();
var lastSeekingIdx;
var lastStartPosition;
var lastDuration;
var lastAudioTrackSwitchingIdx;
var hls;
var url;
var events;
var stats;
var tracks;
var fmp4Data;
var configPersistenceEnabled = false;
$(document).ready(function () {
  Object.keys(testStreams).forEach(function (key) {
    var stream = testStreams[key];
    var option = new Option(stream.description, key);
    $('#streamSelect').append(option);
  });
  $('#streamSelect').change(function () {
    selectedTestStream = testStreams[$('#streamSelect').val()];
    var streamUrl = selectedTestStream.url;
    $('#streamURL').val(streamUrl);
    loadSelectedStream();
  });
  $('#streamURL').change(function () {
    selectedTestStream = null;
    loadSelectedStream();
  });
  $('#videoSize').change(function () {
    $('#video').width($('#videoSize').val());
    $('#bufferedCanvas').width($('#videoSize').val());
  });
  $('#streamURL').val(sourceURL);
  video.volume = 0.05;
  $('#metricsButtonWindow').toggle(window.windowSliding);
  $('#metricsButtonFixed').toggle(!window.windowSliding);
  loadSelectedStream();
});

function setupGlobals() {
  window.events = events = {
    url: url,
    t0: performance.now(),
    load: [],
    buffer: [],
    video: [],
    level: [],
    bitrate: []
  }; // actual values, only on window

  window.recoverDecodingErrorDate = null;
  window.recoverSwapAudioCodecDate = null;
  window.fmp4Data = fmp4Data = {
    'audio': [],
    'video': []
  };
  window.onClickBufferedRange = onClickBufferedRange;
  window.updateLevelInfo = updateLevelInfo;
}

function trimArray(target, limit) {
  if (limit < 0) {
    return;
  }

  while (target.length > limit) {
    target.shift();
  }
}

function trimEventHistory() {
  var x = limitMetrics;

  if (x < 0) {
    return;
  }

  trimArray(events.load, x);
  trimArray(events.buffer, x);
  trimArray(events.video, x);
  trimArray(events.level, x);
  trimArray(events.bitrate, x);
}

function loadSelectedStream() {
  if (!Hls.isSupported()) {
    handleUnsupported();
    return;
  }

  url = $('#streamURL').val();
  setupGlobals();
  hideCanvas();

  if (hls) {
    hls.destroy();

    if (hls.bufferTimer) {
      clearInterval(hls.bufferTimer);
      hls.bufferTimer = undefined;
    }

    hls = null;
  }

  logStatus('Loading ' + url); // Extending both a demo-specific config and the user config which can override all

  var hlsConfig = $.extend({}, hlsjsDefaults);

  if (selectedTestStream && selectedTestStream.config) {
    console.info('[loadSelectedStream] extending hls config with stream-specific config: ', selectedTestStream.config);
    $.extend(hlsConfig, selectedTestStream.config);
  }

  onDemoConfigChanged();
  console.log('Using Hls.js config:', hlsConfig);
  window.hls = hls = new Hls(hlsConfig);
  logStatus('Loading manifest and attaching video element...');
  hls.loadSource(url);
  hls.autoLevelCapping = levelCapping;
  hls.attachMedia(video);
  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    logStatus('Media element attached');
    bufferingIdx = -1;
    events.video.push({
      time: performance.now() - events.t0,
      type: 'Media attached'
    });
    trimEventHistory();
  });
  hls.on(Hls.Events.MEDIA_DETACHED, function () {
    logStatus('Media element detached');
    bufferingIdx = -1;
    tracks = [];
    events.video.push({
      time: performance.now() - events.t0,
      type: 'Media detached'
    });
    trimEventHistory();
  });
  hls.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, function (name, data) {
    showCanvas();
    events.video.push({
      time: performance.now() - events.t0,
      type: data.id + ' init segment'
    });
    trimEventHistory();
  });
  hls.on(Hls.Events.FRAG_PARSING_METADATA, function (name, data) {// console.log("Id3 samples ", data.samples);
  });
  hls.on(Hls.Events.LEVEL_SWITCHING, function (name, data) {
    events.level.push({
      time: performance.now() - events.t0,
      id: data.level,
      bitrate: Math.round(hls.levels[data.level].bitrate / 1000)
    });
    trimEventHistory();
    updateLevelInfo();
  });
  hls.on(Hls.Events.MANIFEST_PARSED, function (name, data) {
    events.load.push({
      type: 'manifest',
      name: '',
      start: 0,
      end: data.levels.length,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      duration: data.stats.tload - data.stats.tfirst
    });
    trimEventHistory();
    window.refreshCanvas();
  });
  hls.on(Hls.Events.MANIFEST_PARSED, function (name, data) {
    logStatus('No of quality levels found: ' + hls.levels.length);
    logStatus('Manifest successfully loaded');
    stats = {
      levelNb: data.levels.length,
      levelParsed: 0
    };
    trimEventHistory();
    updateLevelInfo();
  });
  hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (name, data) {
    logStatus('No of audio tracks found: ' + data.audioTracks.length);
    updateAudioTrackInfo();
  });
  hls.on(Hls.Events.AUDIO_TRACK_SWITCHING, function (name, data) {
    logStatus('Audio track switching...');
    updateAudioTrackInfo();
    events.video.push({
      time: performance.now() - events.t0,
      type: 'audio switching',
      name: '@' + data.id
    });
    trimEventHistory();
    lastAudioTrackSwitchingIdx = events.video.length - 1;
  });
  hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, function (name, data) {
    logStatus('Audio track switched');
    updateAudioTrackInfo();
    var event = {
      time: performance.now() - events.t0,
      type: 'audio switched',
      name: '@' + data.id
    };

    if (lastAudioTrackSwitchingIdx !== undefined) {
      events.video[lastAudioTrackSwitchingIdx].duration = event.time - events.video[lastAudioTrackSwitchingIdx].time;
      lastAudioTrackSwitchingIdx = undefined;
    }

    events.video.push(event);
    trimEventHistory();
  });
  hls.on(Hls.Events.LEVEL_LOADED, function (name, data) {
    events.isLive = data.details.live;
    var event = {
      type: 'level',
      id: data.level,
      start: data.details.startSN,
      end: data.details.endSN,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      parsing: data.stats.tparsed - data.stats.tload,
      duration: data.stats.tload - data.stats.tfirst
    };
    var parsingDuration = data.stats.tparsed - data.stats.tload;

    if (stats.levelParsed) {
      this.sumLevelParsingMs += parsingDuration;
    } else {
      this.sumLevelParsingMs = parsingDuration;
    }

    stats.levelParsed++;
    stats.levelParsingUs = Math.round(1000 * this.sumLevelParsingMs / stats.levelParsed); // console.log('parsing level duration :' + stats.levelParsingUs + 'us,count:' + stats.levelParsed);

    events.load.push(event);
    trimEventHistory();
    window.refreshCanvas();
  });
  hls.on(Hls.Events.AUDIO_TRACK_LOADED, function (name, data) {
    events.isLive = data.details.live;
    var event = {
      type: 'audio track',
      id: data.id,
      start: data.details.startSN,
      end: data.details.endSN,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      parsing: data.stats.tparsed - data.stats.tload,
      duration: data.stats.tload - data.stats.tfirst
    };
    events.load.push(event);
    trimEventHistory();
    window.refreshCanvas();
  });
  hls.on(Hls.Events.FRAG_BUFFERED, function (name, data) {
    var event = {
      type: data.frag.type + ' fragment',
      id: data.frag.level,
      id2: data.frag.sn,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      parsing: data.stats.tparsed - data.stats.tload,
      buffer: data.stats.tbuffered - data.stats.tparsed,
      duration: data.stats.tbuffered - data.stats.tfirst,
      bw: Math.round(8 * data.stats.total / (data.stats.tbuffered - data.stats.trequest)),
      size: data.stats.total
    };
    events.load.push(event);
    events.bitrate.push({
      time: performance.now() - events.t0,
      bitrate: event.bw,
      duration: data.frag.duration,
      level: event.id
    });

    if (hls.bufferTimer === undefined) {
      events.buffer.push({
        time: 0,
        buffer: 0,
        pos: 0
      });
      hls.bufferTimer = window.setInterval(checkBuffer, 100);
    }

    trimEventHistory();
    window.refreshCanvas();
    updateLevelInfo();
    var latency = data.stats.tfirst - data.stats.trequest;
    var parsing = data.stats.tparsed - data.stats.tload;
    var process = data.stats.tbuffered - data.stats.trequest;
    var bitrate = Math.round(8 * data.stats.length / (data.stats.tbuffered - data.stats.tfirst));

    if (stats.fragBuffered) {
      stats.fragMinLatency = Math.min(stats.fragMinLatency, latency);
      stats.fragMaxLatency = Math.max(stats.fragMaxLatency, latency);
      stats.fragMinProcess = Math.min(stats.fragMinProcess, process);
      stats.fragMaxProcess = Math.max(stats.fragMaxProcess, process);
      stats.fragMinKbps = Math.min(stats.fragMinKbps, bitrate);
      stats.fragMaxKbps = Math.max(stats.fragMaxKbps, bitrate);
      stats.autoLevelCappingMin = Math.min(stats.autoLevelCappingMin, hls.autoLevelCapping);
      stats.autoLevelCappingMax = Math.max(stats.autoLevelCappingMax, hls.autoLevelCapping);
      stats.fragBuffered++;
    } else {
      stats.fragMinLatency = stats.fragMaxLatency = latency;
      stats.fragMinProcess = stats.fragMaxProcess = process;
      stats.fragMinKbps = stats.fragMaxKbps = bitrate;
      stats.fragBuffered = 1;
      stats.fragBufferedBytes = 0;
      stats.autoLevelCappingMin = stats.autoLevelCappingMax = hls.autoLevelCapping;
      this.sumLatency = 0;
      this.sumKbps = 0;
      this.sumProcess = 0;
      this.sumParsing = 0;
    }

    stats.fraglastLatency = latency;
    this.sumLatency += latency;
    stats.fragAvgLatency = Math.round(this.sumLatency / stats.fragBuffered);
    stats.fragLastProcess = process;
    this.sumProcess += process;
    this.sumParsing += parsing;
    stats.fragAvgProcess = Math.round(this.sumProcess / stats.fragBuffered);
    stats.fragLastKbps = bitrate;
    this.sumKbps += bitrate;
    stats.fragAvgKbps = Math.round(this.sumKbps / stats.fragBuffered);
    stats.fragBufferedBytes += data.stats.total;
    stats.fragparsingKbps = Math.round(8 * stats.fragBufferedBytes / this.sumParsing);
    stats.fragparsingMs = Math.round(this.sumParsing);
    stats.autoLevelCappingLast = hls.autoLevelCapping;
  });
  hls.on(Hls.Events.LEVEL_SWITCHED, function (name, data) {
    var event = {
      time: performance.now() - events.t0,
      type: 'level switched',
      name: data.level
    };
    events.video.push(event);
    trimEventHistory();
    window.refreshCanvas();
    updateLevelInfo();
  });
  hls.on(Hls.Events.FRAG_CHANGED, function (name, data) {
    var event = {
      time: performance.now() - events.t0,
      type: 'frag changed',
      name: data.frag.sn + ' @ ' + data.frag.level
    };
    events.video.push(event);
    trimEventHistory();
    window.refreshCanvas();
    updateLevelInfo();
    stats.tagList = data.frag.tagList;
    var level = data.frag.level;
    var autoLevel = data.frag.autoLevel;

    if (stats.levelStart === undefined) {
      stats.levelStart = level;
    }

    if (autoLevel) {
      if (stats.fragChangedAuto) {
        stats.autoLevelMin = Math.min(stats.autoLevelMin, level);
        stats.autoLevelMax = Math.max(stats.autoLevelMax, level);
        stats.fragChangedAuto++;

        if (this.levelLastAuto && level !== stats.autoLevelLast) {
          stats.autoLevelSwitch++;
        }
      } else {
        stats.autoLevelMin = stats.autoLevelMax = level;
        stats.autoLevelSwitch = 0;
        stats.fragChangedAuto = 1;
        this.sumAutoLevel = 0;
      }

      this.sumAutoLevel += level;
      stats.autoLevelAvg = Math.round(1000 * this.sumAutoLevel / stats.fragChangedAuto) / 1000;
      stats.autoLevelLast = level;
    } else {
      if (stats.fragChangedManual) {
        stats.manualLevelMin = Math.min(stats.manualLevelMin, level);
        stats.manualLevelMax = Math.max(stats.manualLevelMax, level);
        stats.fragChangedManual++;

        if (!this.levelLastAuto && level !== stats.manualLevelLast) {
          stats.manualLevelSwitch++;
        }
      } else {
        stats.manualLevelMin = stats.manualLevelMax = level;
        stats.manualLevelSwitch = 0;
        stats.fragChangedManual = 1;
      }

      stats.manualLevelLast = level;
    }

    this.levelLastAuto = autoLevel;
  });
  hls.on(Hls.Events.FRAG_LOAD_EMERGENCY_ABORTED, function (name, data) {
    if (stats) {
      if (stats.fragLoadEmergencyAborted === undefined) {
        stats.fragLoadEmergencyAborted = 1;
      } else {
        stats.fragLoadEmergencyAborted++;
      }
    }
  });
  hls.on(Hls.Events.FRAG_DECRYPTED, function (name, data) {
    if (!stats.fragDecrypted) {
      stats.fragDecrypted = 0;
      this.totalDecryptTime = 0;
      stats.fragAvgDecryptTime = 0;
    }

    stats.fragDecrypted++;
    this.totalDecryptTime += data.stats.tdecrypt - data.stats.tstart;
    stats.fragAvgDecryptTime = this.totalDecryptTime / stats.fragDecrypted;
  });
  hls.on(Hls.Events.ERROR, function (name, data) {
    console.warn('Error event:', data);

    switch (data.details) {
      case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
        try {
          $('#errorOut').html('Cannot load <a href="' + data.context.url + '">' + url + '</a><br>HTTP response code:' + data.response.code + ' <br>' + data.response.text);

          if (data.response.code === 0) {
            $('#errorOut').append('This might be a CORS issue, consider installing <a href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi">Allow-Control-Allow-Origin</a> Chrome Extension');
          }
        } catch (err) {
          $('#errorOut').html('Cannot load <a href="' + data.context.url + '">' + url + '</a><br>Response body: ' + data.response.text);
        }

        break;

      case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
        logError('Timeout while loading manifest');
        break;

      case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
        logError('Error while parsing manifest:' + data.reason);
        break;

      case Hls.ErrorDetails.LEVEL_EMPTY_ERROR:
        logError('Loaded level contains no fragments ' + data.level + ' ' + data.url);
        handleLevelError(data);
        break;

      case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
        logError('Error while loading level playlist ' + data.context.level + ' ' + data.url);
        handleLevelError(data);
        break;

      case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
        logError('Timeout while loading level playlist ' + data.context.level + ' ' + data.url);
        handleLevelError(data);
        break;

      case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
        logError('Error while trying to switch to level ' + data.level);
        break;

      case Hls.ErrorDetails.FRAG_LOAD_ERROR:
        logError('Error while loading fragment ' + data.frag.url);
        break;

      case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
        logError('Timeout while loading fragment ' + data.frag.url);
        break;

      case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
        logError('Fragment-loop loading error');
        break;

      case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
        logError('Decrypting error:' + data.reason);
        break;

      case Hls.ErrorDetails.FRAG_PARSING_ERROR:
        logError('Parsing error:' + data.reason);
        break;

      case Hls.ErrorDetails.KEY_LOAD_ERROR:
        logError('Error while loading key ' + data.frag.decryptdata.uri);
        break;

      case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
        logError('Timeout while loading key ' + data.frag.decryptdata.uri);
        break;

      case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
        logError('Buffer append error');
        break;

      case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
        logError('Buffer add codec error for ' + data.mimeType + ':' + data.err.message);
        break;

      case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
        logError('Buffer appending error');
        break;

      case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
        logError('Buffer stalled error');
        break;

      default:
        break;
    }

    if (data.fatal) {
      console.error('Fatal error :' + data.details);

      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR:
          handleMediaError();
          break;

        case Hls.ErrorTypes.NETWORK_ERROR:
          logError('A network error occurred');
          break;

        default:
          logError('An unrecoverable error occurred');
          hls.destroy();
          break;
      }
    }

    if (!stats) {
      stats = {};
    } // track all errors independently


    if (stats[data.details] === undefined) {
      stats[data.details] = 1;
    } else {
      stats[data.details] += 1;
    } // track fatal error


    if (data.fatal) {
      if (stats.fatalError === undefined) {
        stats.fatalError = 1;
      } else {
        stats.fatalError += 1;
      }
    }

    $('#statisticsOut').text(JSON.stringify(sortObject(stats), null, '\t'));
  });
  hls.on(Hls.Events.BUFFER_CREATED, function (name, data) {
    tracks = data.tracks;
  });
  hls.on(Hls.Events.BUFFER_APPENDING, function (name, data) {
    if (dumpfMP4) {
      fmp4Data[data.type].push(data.data);
    }
  });
  hls.on(Hls.Events.FPS_DROP, function (name, data) {
    var evt = {
      time: performance.now() - events.t0,
      type: 'frame drop',
      name: data.currentDropped + '/' + data.currentDecoded
    };
    events.video.push(evt);
    trimEventHistory();

    if (stats) {
      if (stats.fpsDropEvent === undefined) {
        stats.fpsDropEvent = 1;
      } else {
        stats.fpsDropEvent++;
      }

      stats.fpsTotalDroppedFrames = data.totalDroppedFrames;
    }
  });
  video.addEventListener('resize', handleVideoEvent);
  video.addEventListener('seeking', handleVideoEvent);
  video.addEventListener('seeked', handleVideoEvent);
  video.addEventListener('pause', handleVideoEvent);
  video.addEventListener('play', handleVideoEvent);
  video.addEventListener('canplay', handleVideoEvent);
  video.addEventListener('canplaythrough', handleVideoEvent);
  video.addEventListener('ended', handleVideoEvent);
  video.addEventListener('playing', handleVideoEvent);
  video.addEventListener('error', handleVideoEvent);
  video.addEventListener('loadedmetadata', handleVideoEvent);
  video.addEventListener('loadeddata', handleVideoEvent);
  video.addEventListener('durationchange', handleVideoEvent);
}

function handleUnsupported() {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
    logStatus('You are using Firefox, it looks like MediaSource is not enabled,<br>please ensure the following keys are set appropriately in <b>about:config</b><br>media.mediasource.enabled=true<br>media.mediasource.mp4.enabled=true<br><b>media.mediasource.whitelist=false</b>');
  } else {
    logStatus('Your Browser does not support MediaSourceExtension / MP4 mediasource');
  }
}

function handleVideoEvent(evt) {
  var data = '';

  switch (evt.type) {
    case 'durationchange':
      if (evt.target.duration - lastDuration <= 0.5) {
        // some browsers report several duration change events with almost the same value ... avoid spamming video events
        return;
      }

      lastDuration = evt.target.duration;
      data = Math.round(evt.target.duration * 1000);
      break;

    case 'resize':
      data = evt.target.videoWidth + '/' + evt.target.videoHeight;
      break;

    case 'loadedmetadata':
    case 'loadeddata':
    case 'canplay':
    case 'canplaythrough':
    case 'ended':
    case 'seeking':
    case 'seeked':
    case 'play':
    case 'playing':
      lastStartPosition = evt.target.currentTime;

    case 'pause':
    case 'waiting':
    case 'stalled':
    case 'error':
      data = Math.round(evt.target.currentTime * 1000);

      if (evt.type === 'error') {
        var errorTxt;
        var mediaError = evt.currentTarget.error;

        switch (mediaError.code) {
          case mediaError.MEDIA_ERR_ABORTED:
            errorTxt = 'You aborted the video playback';
            break;

          case mediaError.MEDIA_ERR_DECODE:
            errorTxt = 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support';
            handleMediaError();
            break;

          case mediaError.MEDIA_ERR_NETWORK:
            errorTxt = 'A network error caused the video download to fail part-way';
            break;

          case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorTxt = 'The video could not be loaded, either because the server or network failed or because the format is not supported';
            break;
        }

        if (mediaError.message) {
          errorTxt += ' - ' + mediaError.message;
        }

        logStatus(errorTxt);
        console.error(errorTxt);
      }

      break;

    default:
      break;
  }

  var event = {
    time: performance.now() - events.t0,
    type: evt.type,
    name: data
  };
  events.video.push(event);

  if (evt.type === 'seeking') {
    lastSeekingIdx = events.video.length - 1;
  }

  if (evt.type === 'seeked') {
    events.video[lastSeekingIdx].duration = event.time - events.video[lastSeekingIdx].time;
  }

  trimEventHistory();
}

function handleLevelError(data) {
  var levelObj = data.context || data;
  hls.removeLevel(levelObj.level, levelObj.urlId || 0);

  if (!hls.levels.length) {
    logError('All levels have been removed');
    hls.destroy();
    return;
  } // Trigger an immediate downswitch to the first level
  // This is to handle the case where we start at an empty level, where switching to auto causes hlsjs to stall


  hls.currentLevel = 0; // Set the quality back to auto so that we return to optimal quality

  hls.currentLevel = -1;
}

function handleMediaError() {
  if (autoRecoverError) {
    var now = performance.now();

    if (!window.recoverDecodingErrorDate || now - window.recoverDecodingErrorDate > 3000) {
      window.recoverDecodingErrorDate = performance.now();
      $('#statusOut').append(', trying to recover media error.');
      hls.recoverMediaError();
    } else {
      if (!window.recoverSwapAudioCodecDate || now - window.recoverSwapAudioCodecDate > 3000) {
        window.recoverSwapAudioCodecDate = performance.now();
        $('#statusOut').append(', trying to swap audio codec and recover media error.');
        hls.swapAudioCodec();
        hls.recoverMediaError();
      } else {
        $('#statusOut').append(', cannot recover. Last media error recovery failed.');
      }
    }
  }
}

function timeRangesToString(r) {
  var log = '';

  for (var i = 0; i < r.length; i++) {
    log += '[' + r.start(i) + ', ' + r.end(i) + ']';
    log += ' ';
  }

  return log;
}

function checkBuffer() {
  var v = $('#video')[0];
  var canvas = $('#bufferedCanvas')[0];
  var ctx = canvas.getContext('2d');
  var r = v.buffered;
  var bufferingDuration;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'gray';

  if (r) {
    if (!canvas.width || canvas.width !== v.clientWidth) {
      canvas.width = v.clientWidth;
    }

    var pos = v.currentTime;
    var bufferLen = 0;

    for (var i = 0; i < r.length; i++) {
      var start = r.start(i) / v.duration * canvas.width;
      var end = r.end(i) / v.duration * canvas.width;
      ctx.fillRect(start, 3, Math.max(2, end - start), 10);

      if (pos >= r.start(i) && pos < r.end(i)) {
        // play position is inside this buffer TimeRange, retrieve end of buffer position and buffer length
        bufferLen = r.end(i) - pos;
      }
    } // check if we are in buffering / or playback ended state


    if (bufferLen <= 0.1 && v.paused === false && pos - lastStartPosition > 0.5) {
      // don't create buffering event if we are at the end of the playlist, don't report ended for live playlist
      if (lastDuration - pos <= 0.5 && events.isLive === false) {} else {
        // we are not at the end of the playlist ... real buffering
        if (bufferingIdx !== -1) {
          bufferingDuration = performance.now() - events.t0 - events.video[bufferingIdx].time;
          events.video[bufferingIdx].duration = bufferingDuration;
          events.video[bufferingIdx].name = bufferingDuration;
        } else {
          events.video.push({
            type: 'buffering',
            time: performance.now() - events.t0
          });
          trimEventHistory(); // we are in buffering state

          bufferingIdx = events.video.length - 1;
        }
      }
    }

    if (bufferLen > 0.1 && bufferingIdx !== -1) {
      bufferingDuration = performance.now() - events.t0 - events.video[bufferingIdx].time;
      events.video[bufferingIdx].duration = bufferingDuration;
      events.video[bufferingIdx].name = bufferingDuration; // we are out of buffering state

      bufferingIdx = -1;
    } // update buffer/position for current Time


    var event = {
      time: performance.now() - events.t0,
      buffer: Math.round(bufferLen * 1000),
      pos: Math.round(pos * 1000)
    };
    var bufEvents = events.buffer;
    var bufEventLen = bufEvents.length;

    if (bufEventLen > 1) {
      var event0 = bufEvents[bufEventLen - 2];
      var event1 = bufEvents[bufEventLen - 1];
      var slopeBuf0 = (event0.buffer - event1.buffer) / (event0.time - event1.time);
      var slopeBuf1 = (event1.buffer - event.buffer) / (event1.time - event.time);
      var slopePos0 = (event0.pos - event1.pos) / (event0.time - event1.time);
      var slopePos1 = (event1.pos - event.pos) / (event1.time - event.time); // compute slopes. if less than 30% difference, remove event1

      if ((slopeBuf0 === slopeBuf1 || Math.abs(slopeBuf0 / slopeBuf1 - 1) <= 0.3) && (slopePos0 === slopePos1 || Math.abs(slopePos0 / slopePos1 - 1) <= 0.3)) {
        bufEvents.pop();
      }
    }

    events.buffer.push(event);
    trimEventHistory();
    window.refreshCanvas();
    var log = 'Duration: ' + v.duration + '\n' + 'Buffered: ' + timeRangesToString(v.buffered) + '\n' + 'Seekable: ' + timeRangesToString(v.seekable) + '\n' + 'Played: ' + timeRangesToString(v.played) + '\n';

    if (hls.media) {
      for (var type in tracks) {
        log += 'Buffer for ' + type + ' contains: ' + timeRangesToString(tracks[type].buffer.buffered) + '\n';
      }

      var videoPlaybackQuality = v.getVideoPlaybackQuality;

      if (videoPlaybackQuality && typeof videoPlaybackQuality === typeof Function) {
        log += 'Dropped frames: ' + v.getVideoPlaybackQuality().droppedVideoFrames + '\n';
        log += 'Corrupted frames:' + v.getVideoPlaybackQuality().corruptedVideoFrames + '\n';
      } else if (v.webkitDroppedFrameCount) {
        log += 'Dropped frames:' + v.webkitDroppedFrameCount + '\n';
      }
    }

    $('#bufferedOut').text(log);
    $('#statisticsOut').text(JSON.stringify(sortObject(stats), null, '\t'));
    ctx.fillStyle = 'blue';
    var x = v.currentTime / v.duration * canvas.width;
    ctx.fillRect(x, 0, 2, 15);
  }
}

function showCanvas() {
  window.showMetrics();
  $('#bufferedOut').show();
  $('#bufferedCanvas').show();
}

function hideCanvas() {
  window.hideMetrics();
  $('#bufferedOut').hide();
  $('#bufferedCanvas').hide();
}

function getMetrics() {
  var json = JSON.stringify(events);
  var jsonpacked = window.jsonpack.pack(json); // console.log('packing JSON from ' + json.length + ' to ' + jsonpacked.length + ' bytes');

  return btoa(jsonpacked);
}

function copyMetricsToClipBoard() {
  copyTextToClipboard(getMetrics());
}

function goToMetrics() {
  var url = document.URL;
  url = url.substr(0, url.lastIndexOf('/') + 1) + 'metrics.html';
  window.open(url, '_blank');
}

function goToMetricsPermaLink() {
  var url = document.URL;
  var b64 = getMetrics();
  url = url.substr(0, url.lastIndexOf('/') + 1) + 'metrics.html#data=' + b64;
  window.open(url, '_blank');
}

function minsecs(ts) {
  var m = Math.floor(Math.floor(ts % 3600) / 60);
  var s = Math.floor(ts % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function onClickBufferedRange(event) {
  var canvas = $('#bufferedCanvas')[0];
  var v = $('#video')[0];
  var target = (event.clientX - canvas.offsetLeft) / canvas.width * v.duration;
  v.currentTime = target;
}

function updateLevelInfo() {
  if (!hls.levels) {
    return;
  }

  var button_template = '<button type="button" class="btn btn-sm ';
  var button_enabled = 'btn-primary" ';
  var button_disabled = 'btn-success" ';
  var html1 = button_template;

  if (hls.autoLevelEnabled) {
    html1 += button_enabled;
  } else {
    html1 += button_disabled;
  }

  html1 += 'onclick="hls.currentLevel=-1">auto</button>';
  var html2 = button_template;

  if (hls.autoLevelEnabled) {
    html2 += button_enabled;
  } else {
    html2 += button_disabled;
  }

  html2 += 'onclick="hls.loadLevel=-1">auto</button>';
  var html3 = button_template;

  if (hls.autoLevelCapping === -1) {
    html3 += button_enabled;
  } else {
    html3 += button_disabled;
  }

  html3 += 'onclick="levelCapping=hls.autoLevelCapping=-1;updateLevelInfo();onDemoConfigChanged();">auto</button>';
  var html4 = button_template;

  if (hls.autoLevelEnabled) {
    html4 += button_enabled;
  } else {
    html4 += button_disabled;
  }

  html4 += 'onclick="hls.nextLevel=-1">auto</button>';

  for (var i = 0; i < hls.levels.length; i++) {
    html1 += button_template;

    if (hls.currentLevel === i) {
      html1 += button_enabled;
    } else {
      html1 += button_disabled;
    }

    var levelName = i;
    var label = level2label(i);

    if (label) {
      levelName += ' (' + level2label(i) + 'p)';
    }

    html1 += 'onclick="hls.currentLevel=' + i + '">' + levelName + '</button>';
    html2 += button_template;

    if (hls.loadLevel === i) {
      html2 += button_enabled;
    } else {
      html2 += button_disabled;
    }

    html2 += 'onclick="hls.loadLevel=' + i + '">' + levelName + '</button>';
    html3 += button_template;

    if (hls.autoLevelCapping === i) {
      html3 += button_enabled;
    } else {
      html3 += button_disabled;
    }

    html3 += 'onclick="levelCapping=hls.autoLevelCapping=' + i + ';updateLevelInfo();onDemoConfigChanged();">' + levelName + '</button>';
    html4 += button_template;

    if (hls.nextLevel === i) {
      html4 += button_enabled;
    } else {
      html4 += button_disabled;
    }

    html4 += 'onclick="hls.nextLevel=' + i + '">' + levelName + '</button>';
  }

  var v = $('#video')[0];

  if (v.videoWidth && v.videoHeight) {
    $('#currentResolution').html(v.videoWidth + ' x ' + v.videoHeight);
  }

  if ($('#currentLevelControl').html() !== html1) {
    $('#currentLevelControl').html(html1);
  }

  if ($('#loadLevelControl').html() !== html2) {
    $('#loadLevelControl').html(html2);
  }

  if ($('#levelCappingControl').html() !== html3) {
    $('#levelCappingControl').html(html3);
  }

  if ($('#nextLevelControl').html() !== html4) {
    $('#nextLevelControl').html(html4);
  }
}

function updateAudioTrackInfo() {
  var button_template = '<button type="button" class="btn btn-sm ';
  var button_enabled = 'btn-primary" ';
  var button_disabled = 'btn-success" ';
  var html1 = '';
  var audioTrackId = hls.audioTrack;
  var len = hls.audioTracks.length;

  for (var i = 0; i < len; i++) {
    html1 += button_template;

    if (audioTrackId === i) {
      html1 += button_enabled;
    } else {
      html1 += button_disabled;
    }

    html1 += 'onclick="hls.audioTrack=' + i + '">' + hls.audioTracks[i].name + '</button>';
  }

  $('#audioTrackControl').html(html1);
}

function level2label(index) {
  if (hls && hls.levels.length - 1 >= index) {
    var level = hls.levels[index];

    if (level.name) {
      return level.name;
    } else {
      if (level.height) {
        return level.height + 'p / ' + Math.round(level.bitrate / 1024) + 'kb';
      } else {
        if (level.bitrate) {
          return Math.round(level.bitrate / 1024) + 'kb';
        } else {
          return null;
        }
      }
    }
  }
}

function getDemoConfigPropOrDefault(propName, defaultVal) {
  return typeof demoConfig[propName] !== 'undefined' ? demoConfig[propName] : defaultVal;
}

function getURLParam(sParam, defaultValue) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');

  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === 'undefined' ? undefined : sParameterName[1] === 'false' ? false : sParameterName[1];
    }
  }

  return defaultValue;
}

function onDemoConfigChanged() {
  demoConfig = {
    enableStreaming: enableStreaming,
    autoRecoverError: autoRecoverError,
    dumpfMP4: dumpfMP4,
    levelCapping: levelCapping,
    limitMetrics: limitMetrics
  };

  if (configPersistenceEnabled) {
    persistEditorValue();
  }

  var serializedDemoConfig = btoa(JSON.stringify(demoConfig));
  var baseURL = document.URL.split('?')[0];
  var streamURL = $('#streamURL').val();
  var permalinkURL = baseURL + "?src=" + encodeURIComponent(streamURL) + "&demoConfig=" + serializedDemoConfig;
  $('#StreamPermalink').html("<a href=\"" + permalinkURL + "\">" + permalinkURL + "</a>");
}

function onConfigPersistenceChanged(event) {
  configPersistenceEnabled = event.target.checked;
  localStorage.setItem(STORAGE_KEYS.Editor_Persistence, JSON.stringify(configPersistenceEnabled));

  if (configPersistenceEnabled) {
    persistEditorValue();
  } else {
    localStorage.removeItem(STORAGE_KEYS.Hls_Config);
  }
}

function getPersistedHlsConfig() {
  var value = localStorage.getItem(STORAGE_KEYS.Hls_Config);

  if (value === null) {
    return value;
  }

  try {
    value = JSON.parse(value);
  } catch (e) {
    console.warn('[getPersistedHlsConfig] could not hls config json', e);
    value = {};
  }

  return value;
}

function arrayConcat(inputArray) {
  var totalLength = inputArray.reduce(function (prev, cur) {
    return prev + cur.length;
  }, 0);
  var result = new Uint8Array(totalLength);
  var offset = 0;
  inputArray.forEach(function (element) {
    result.set(element, offset);
    offset += element.length;
  });
  return result;
}

function appendLog(textElId, message) {
  var el = $('#' + textElId);
  var logText = el.text();

  if (logText.length) {
    logText += '\n';
  }

  var timestamp = (Date.now() - startTime) / 1000;
  var newMessage = timestamp + ' | ' + message;
  logText += newMessage; // update

  el.text(logText);
}

function logStatus(message) {
  appendLog('statusOut', message);
}

function logError(message) {
  appendLog('errorOut', message);
}

/***/ }),

/***/ "./tests/test-streams.js":
/*!*******************************!*\
  !*** ./tests/test-streams.js ***!
  \*******************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

/**
 * Create test stream
 * @param {string} url
 * @param {string} description
 * @param {boolean} [live]
 * @param {boolean} [abr]
 * @param {string[]} [blacklist_ua]
 * @returns {{url: string, description: string, live: boolean, abr: boolean, blacklist_ua: string[]}}
 */
function createTestStream(url, description, live, abr, blacklist_ua) {
  if (live === void 0) {
    live = false;
  }

  if (abr === void 0) {
    abr = true;
  }

  if (blacklist_ua === void 0) {
    blacklist_ua = [];
  }

  return {
    url: url,
    description: description,
    live: live,
    abr: abr,
    blacklist_ua: blacklist_ua
  };
}
/**
 * @param {Object} target
 * @param {Object} [config]
 * @returns {{url: string, description: string, live: boolean, abr: boolean, blacklist_ua: string[]}}
 */


function createTestStreamWithConfig(target, config) {
  if (typeof target !== 'object') {
    throw new Error('target should be object');
  }

  var testStream = createTestStream(target.url, target.description, target.live, target.abr, target.blacklist_ua);
  testStream.config = config;
  return testStream;
}

module.exports = {
  bbb: createTestStreamWithConfig({
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Big Buck Bunny - adaptive qualities'
  }, {
    // try to workaround test failing because of slow seek on Chrome/Win10
    nudgeMaxRetry: 5
  }),
  borat: {
    url: 'file:///root/hls.js/tests/borat_hsl_playlist.m3u8',
    description: 'Borat mówi dziękuje',
    live: false,
    abr: false,
    blacklist_ua: []
  },
  LabScreenCap1: {
    url: 'file:///root/hls.js/tests/hsl_playlist1.m3u8',
    description: 'Pierwszy screencap z projektu',
    live: false,
    abr: false,
    blacklist_ua: []
  },
  LabScreenCap2: {
    url: 'file:///root/hls.js/tests/hsl_playlist2.m3u8',
    description: 'Drugi screencap z projektu',
    live: false,
    abr: false,
    blacklist_ua: []
  }
};

/***/ })

/******/ })["default"];
});
//# sourceMappingURL=hls-demo.js.map