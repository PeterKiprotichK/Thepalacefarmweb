import { RenderMode, ServerRoute } from '@angular/ssr';

// Public routes safe to prerender
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'farm', renderMode: RenderMode.Prerender },
  { path: 'shop', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'testimonials', renderMode: RenderMode.Prerender },
  { path: 'blogs', renderMode: RenderMode.Prerender },
  {
    path: 'blogs/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async (): Promise<Record<string, string>[]> => [
      { id: '0' },
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ],
  },
  // Fallback: do not prerender unknown routes (render on client)
  { path: '**', renderMode: RenderMode.Client },
];
