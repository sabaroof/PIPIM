/**
 * Create test stream
 * @param {string} url
 * @param {string} description
 * @param {boolean} [live]
 * @param {boolean} [abr]
 * @param {string[]} [blacklist_ua]
 * @returns {{url: string, description: string, live: boolean, abr: boolean, blacklist_ua: string[]}}
 */
function createTestStream (url, description, live = false, abr = true, blacklist_ua = []) {
  return {
    url,
    description,
    live,
    abr,
    blacklist_ua
  };
}

/**
 * @param {Object} target
 * @param {Object} [config]
 * @returns {{url: string, description: string, live: boolean, abr: boolean, blacklist_ua: string[]}}
 */
function createTestStreamWithConfig (target, config) {
  if (typeof target !== 'object') {
    throw new Error('target should be object');
  }

  const testStream = createTestStream(target.url, target.description, target.live, target.abr, target.blacklist_ua);

  testStream.config = config;

  return testStream;
}

module.exports = {
  bbb: createTestStreamWithConfig({
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Big Buck Bunny - adaptive qualities'
  },
  {
    // try to workaround test failing because of slow seek on Chrome/Win10
    nudgeMaxRetry: 5
  }
  ),
  borat: {
	url: 'http://127.0.1.1/PIPIM/tests/borat_hsl_playlist.m3u8',
  	description: 'Borat mówi dziękuje',
  	live: false,
  	abr: false,
  	blacklist_ua: [],
  },
  LabScreenCap1: {
  	url: 'http://127.0.1.1/PIPIM/tests/hsl_playlist1.m3u8',
  	description: 'Pierwszy screencap z projektu',
  	live: false,
  	abr: false,
  	blacklist_ua: [],
  	},
  LabScreenCap2: {
  	url: 'http://127.0.1.1/PIPIM/tests/hsl_playlist2.m3u8',
  	description: 'Drugi screencap z projektu',
  	live: false,
  	abr: false,
  	blacklist_ua: [],
  },
};
