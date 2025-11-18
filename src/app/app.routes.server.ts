import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Prerender all routes as static pages for GitHub Pages
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
