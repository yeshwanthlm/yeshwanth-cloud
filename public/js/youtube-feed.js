/**
 * YouTube Feed Script
 * Dynamically fetches and displays videos from a YouTube channel
 */

document.addEventListener('DOMContentLoaded', function() {
  const youtubeContainer = document.getElementById('youtube-feed');
  if (!youtubeContainer) return;
  
  const channelId = youtubeContainer.dataset.channelId || '@amonkincloud';
  const maxResults = youtubeContainer.dataset.maxResults || 6;
  
  // Get API key from config.js (which should be gitignored)
  let apiKey;
  try {
    apiKey = CONFIG.YOUTUBE_API_KEY;
  } catch (e) {
    console.error('YouTube API key not found. Make sure config.js is properly set up.');
    youtubeContainer.innerHTML = `
      <div class="error-message">
        <p>API configuration error. Please set up config.js with your YouTube API key.</p>
      </div>
    `;
    return;
  }
  
  // Fetch videos from YouTube API
  fetchYouTubeVideos(channelId, apiKey, maxResults)
    .then(videos => {
      displayYouTubeVideos(videos, youtubeContainer);
    })
    .catch(error => {
      console.error('Error fetching YouTube videos:', error);
      youtubeContainer.innerHTML = `
        <div class="error-message">
          <p>Could not load videos. Please visit <a href="https://www.youtube.com/${channelId}/videos" target="_blank">my YouTube channel</a> directly.</p>
        </div>
      `;
    });
});

/**
 * Fetch videos from YouTube API
 */
async function fetchYouTubeVideos(channelId, apiKey, maxResults) {
  // First get the channel ID if using a custom URL
  let actualChannelId = channelId;
  if (channelId.startsWith('@')) {
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${channelId.substring(1)}&key=${apiKey}`
    );
    const channelData = await channelResponse.json();
    if (channelData.items && channelData.items.length > 0) {
      actualChannelId = channelData.items[0].id;
    }
  }
  
  // Then get the videos
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`
  );
  
  if (!response.ok) {
    throw new Error('YouTube API request failed');
  }
  
  const data = await response.json();
  return data.items || [];
}

/**
 * Display YouTube videos in the container
 */
function displayYouTubeVideos(videos, container) {
  if (!videos || videos.length === 0) {
    container.innerHTML = '<p>No videos found.</p>';
    return;
  }
  
  const videoGrid = document.createElement('div');
  videoGrid.className = 'video-grid';
  
  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;
    const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();
    
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="video-thumbnail">
        <img src="${thumbnail}" alt="${title}" loading="lazy">
        <div class="play-button"></div>
      </a>
      <div class="video-info">
        <h3><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${title}</a></h3>
        <p class="video-date">${publishedAt}</p>
      </div>
    `;
    
    videoGrid.appendChild(videoItem);
  });
  
  container.innerHTML = '';
  container.appendChild(videoGrid);
  
  // Add "View All" link
  const viewAllLink = document.createElement('div');
  viewAllLink.className = 'view-all';
  viewAllLink.innerHTML = `
    <a href="https://www.youtube.com/${videos[0].snippet.channelId}/videos" target="_blank">
      View all videos on YouTube
    </a>
  `;
  container.appendChild(viewAllLink);
}
