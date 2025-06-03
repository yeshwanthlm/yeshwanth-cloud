/**
 * Example configuration file
 * Copy this file to config.js and add your actual API keys
 * config.js should be listed in .gitignore to prevent committing secrets
 */

const CONFIG = {
  // YouTube API key for fetching videos
  YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY',
  
  // Any other API keys or configuration values
  // OTHER_API_KEY: 'YOUR_OTHER_API_KEY',
};

// Don't modify this export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
