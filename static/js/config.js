/**
 * Configuration file with API keys
 * This file should be listed in .gitignore
 * DO NOT commit this file to version control
 */

const CONFIG = {
  // YouTube API key for fetching videos
  YOUTUBE_API_KEY: 'AIzaSyD2kkcgY4UwNRzAcvqRCzwq1eVTiEy6hqg',
  
  // Any other API keys or configuration values
  // OTHER_API_KEY: 'YOUR_OTHER_API_KEY',
};

// Don't modify this export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
