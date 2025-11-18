const fs = require('fs');
const path = require('path');

// Static routes
const staticRoutes = ['/', '/contact', '/resume', '/blog', '/projects'];

// Read blog index to get dynamic blog post routes
const blogIndexPath = path.join(__dirname, 'public/assets/blog/blog-index.json');
let blogRoutes = [];

try {
  const blogIndexContent = fs.readFileSync(blogIndexPath, 'utf8');
  const blogIndex = JSON.parse(blogIndexContent);
  blogRoutes = blogIndex.posts.map(post => `/blog/${post.slug}`);
} catch (error) {
  console.warn('Could not read blog index:', error.message);
}

// Combine and write routes
const allRoutes = [...staticRoutes, ...blogRoutes];
fs.writeFileSync(path.join(__dirname, 'src/prerender-routes.txt'), allRoutes.join('\n'));
console.log(`✓ Generated ${allRoutes.length} routes for prerendering`);
