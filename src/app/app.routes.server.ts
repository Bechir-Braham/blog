import { RenderMode, ServerRoute } from '@angular/ssr';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export const serverRoutes: ServerRoute[] = [
  // Prerender static routes for GitHub Pages deployment
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
    renderMode: RenderMode.Client  // Use CSR for blog to avoid asset loading issues during prerender
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Client  // Use CSR for blog posts to avoid asset loading issues during prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
