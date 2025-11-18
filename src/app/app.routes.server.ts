import { RenderMode, ServerRoute } from '@angular/ssr';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export const serverRoutes: ServerRoute[] = [
  // Only the most basic static routes that don't require any HTTP calls
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
    renderMode: RenderMode.Client  // Use CSR for blog routes temporarily
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Client  // Use CSR for blog posts temporarily
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
