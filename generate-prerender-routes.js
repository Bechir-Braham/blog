const fs = require('fs');
const path = require('path');

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

// Write routes to a file that Angular can use
const routesContent = allRoutes.map(route => `'${route}'`).join(',\n  ');
const routesFile = `export const prerenderRoutes = [\n  ${routesContent}\n];\n`;

fs.writeFileSync(path.join(__dirname, 'src/prerender-routes.ts'), routesFile);
console.log(`Generated ${allRoutes.length} routes for prerendering`);
console.log('Routes:', allRoutes);