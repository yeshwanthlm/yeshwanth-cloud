/**
 * Dev.to Feed Script
 * Dynamically fetches and displays blog posts from Dev.to
 */

document.addEventListener('DOMContentLoaded', function() {
  const devtoContainer = document.getElementById('devto-feed');
  if (!devtoContainer) return;
  
  const username = devtoContainer.dataset.username || 'yeshwanthlm';
  const maxResults = devtoContainer.dataset.maxResults || 5;
  
  // Fetch blog posts from Dev.to API
  fetchDevtoPosts(username, maxResults)
    .then(posts => {
      displayDevtoPosts(posts, devtoContainer);
    })
    .catch(error => {
      console.error('Error fetching Dev.to posts:', error);
      devtoContainer.innerHTML = `
        <div class="error-message">
          <p>Could not load blog posts. Please visit <a href="https://dev.to/${username}" target="_blank">my Dev.to profile</a> directly.</p>
        </div>
      `;
    });
});

/**
 * Fetch blog posts from Dev.to API
 */
async function fetchDevtoPosts(username, maxResults) {
  const response = await fetch(
    `https://dev.to/api/articles?username=${username}&per_page=${maxResults}`
  );
  
  if (!response.ok) {
    throw new Error('Dev.to API request failed');
  }
  
  return await response.json();
}

/**
 * Display Dev.to posts in the container
 */
function displayDevtoPosts(posts, container) {
  if (!posts || posts.length === 0) {
    container.innerHTML = '<p>No blog posts found.</p>';
    return;
  }
  
  const blogList = document.createElement('div');
  blogList.className = 'blog-list';
  
  posts.forEach(post => {
    const title = post.title;
    const url = post.url;
    const publishedAt = new Date(post.published_at).toLocaleDateString();
    const description = post.description;
    const coverImage = post.cover_image;
    const readingTime = post.reading_time_minutes;
    const tags = post.tag_list;
    
    const blogItem = document.createElement('div');
    blogItem.className = 'blog-item';
    
    let tagsHtml = '';
    if (tags && tags.length > 0) {
      tagsHtml = `
        <div class="blog-tags">
          ${tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join(' ')}
        </div>
      `;
    }
    
    let coverHtml = '';
    if (coverImage) {
      coverHtml = `
        <div class="blog-cover">
          <img src="${coverImage}" alt="${title}" loading="lazy">
        </div>
      `;
    }
    
    blogItem.innerHTML = `
      ${coverHtml}
      <div class="blog-content">
        <h3><a href="${url}" target="_blank">${title}</a></h3>
        <p class="blog-date">${publishedAt} · ${readingTime} min read</p>
        <p class="blog-excerpt">${description}</p>
        ${tagsHtml}
        <a href="${url}" target="_blank" class="read-more">Read More</a>
      </div>
    `;
    
    blogList.appendChild(blogItem);
  });
  
  container.innerHTML = '';
  container.appendChild(blogList);
  
  // Add "View All" link
  const viewAllLink = document.createElement('div');
  viewAllLink.className = 'view-all';
  viewAllLink.innerHTML = `
    <a href="https://dev.to/${posts[0].user.username}" target="_blank">
      View all posts on Dev.to
    </a>
  `;
  container.appendChild(viewAllLink);
}
