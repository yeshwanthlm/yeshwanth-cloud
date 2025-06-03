/**
 * Personal Blog Feed Script
 * Fetches and displays blog posts from a personal blog using RSS feed
 */

document.addEventListener('DOMContentLoaded', function() {
  const personalBlogContainer = document.getElementById('personal-blog-feed');
  if (!personalBlogContainer) return;
  
  const feedUrl = personalBlogContainer.dataset.feedUrl || 'https://blogs.yeshwanthlm.in/feed';
  const maxResults = personalBlogContainer.dataset.maxResults || 5;
  const corsProxy = 'https://api.rss2json.com/v1/api.json?rss_url=';
  
  // Fetch blog posts from RSS feed
  fetchRssFeed(feedUrl, corsProxy, maxResults)
    .then(posts => {
      displayPersonalBlogPosts(posts, personalBlogContainer);
    })
    .catch(error => {
      console.error('Error fetching personal blog posts:', error);
      personalBlogContainer.innerHTML = `
        <div class="error-message">
          <p>Could not load blog posts. Please visit <a href="https://blogs.yeshwanthlm.in/" target="_blank">my personal blog</a> directly.</p>
        </div>
      `;
    });
});

/**
 * Fetch blog posts from RSS feed using a CORS proxy
 */
async function fetchRssFeed(feedUrl, corsProxy, maxResults) {
  const response = await fetch(`${corsProxy}${encodeURIComponent(feedUrl)}`);
  
  if (!response.ok) {
    throw new Error('RSS feed request failed');
  }
  
  const data = await response.json();
  
  if (!data.items) {
    throw new Error('Invalid RSS feed format');
  }
  
  return data.items.slice(0, maxResults);
}

/**
 * Display personal blog posts in the container
 */
function displayPersonalBlogPosts(posts, container) {
  if (!posts || posts.length === 0) {
    container.innerHTML = '<p>No blog posts found.</p>';
    return;
  }
  
  const blogList = document.createElement('div');
  blogList.className = 'blog-list';
  
  posts.forEach(post => {
    const title = post.title;
    const url = post.link;
    const publishedAt = new Date(post.pubDate).toLocaleDateString();
    
    // Extract description and clean it up
    let description = post.description;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    
    // Try to get the first paragraph or a portion of the content
    const paragraphs = tempDiv.querySelectorAll('p');
    if (paragraphs.length > 0) {
      description = paragraphs[0].textContent;
      if (description.length > 150) {
        description = description.substring(0, 150) + '...';
      }
    } else {
      description = tempDiv.textContent.substring(0, 150) + '...';
    }
    
    // Try to get the first image as cover
    let coverImage = null;
    const images = tempDiv.querySelectorAll('img');
    if (images.length > 0) {
      coverImage = images[0].src;
    }
    
    const blogItem = document.createElement('div');
    blogItem.className = 'blog-item';
    
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
        <p class="blog-date">${publishedAt}</p>
        <p class="blog-excerpt">${description}</p>
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
    <a href="https://blogs.yeshwanthlm.in/" target="_blank">
      View all posts on my personal blog
    </a>
  `;
  container.appendChild(viewAllLink);
}
