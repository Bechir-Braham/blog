const fs = require('fs');
const path = require('path');

console.log('🔧 Starting prerender route generation...');
console.log('📁 Working directory:', process.cwd());
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Static routes
const staticRoutes = [
  '/',
  '/contact',
  '/resume', 
  '/blog',
  '/projects'
];

// Read blog index to get dynamic blog post routes
const blogIndexPath = path.join(__dirname, 'public/assets/blog/blog-index.json');
let blogRoutes = [];

console.log('📖 Looking for blog index at:', blogIndexPath);

try {
  const blogIndexContent = fs.readFileSync(blogIndexPath, 'utf8');
  const blogIndex = JSON.parse(blogIndexContent);
  
  blogRoutes = blogIndex.posts.map(post => `/blog/${post.slug}`);
  console.log(`Found ${blogRoutes.length} blog posts to prerender`);
} catch (error) {
  console.warn('Could not read blog index, skipping blog post routes:', error.message);
}

// Combine all routes
const allRoutes = [...staticRoutes, ...blogRoutes];

// Write routes in a simple format that Angular can parse
const routesContent = allRoutes.join('\n');

fs.writeFileSync(path.join(__dirname, 'src/prerender-routes.txt'), routesContent);
console.log(`Generated ${allRoutes.length} routes for prerendering`);
console.log('Routes:', allRoutes);