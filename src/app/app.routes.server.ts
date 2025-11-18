import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Prerender basic static routes for GitHub Pages deployment
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'resume',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'blog',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Client  // Use client-side rendering for blog posts - simple and reliable
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
