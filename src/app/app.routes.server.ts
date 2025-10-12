import { RenderMode, ServerRoute } from '@angular/ssr';

// Only prerender public, static routes. Avoid prerendering admin/auth routes
// which require network calls, auth or browser-only APIs (these cause timeouts
// during Vercel builds). Keep wildcard routes off prerendering.
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'services',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'farm',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'privacy',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'terms',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'testimonials',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'blogs',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'blogs/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async (): Promise<Record<string, string>[]> => [
      { id: '0' },
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ]
  }
  ,
  // Auth routes: don't prerender (render on client)
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'register',
    renderMode: RenderMode.Client,
  },
  {
    path: 'forgot-password',
    renderMode: RenderMode.Client,
  },
  {
    path: 'reset-password',
    renderMode: RenderMode.Client,
  },
  {
    path: 'update-password',
    renderMode: RenderMode.Client,
  },
  {
    path: 'google-callback',
    renderMode: RenderMode.Client,
  },
  // Dashboard (authenticated/admin) - client render
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,
  }
  ,
  {
    path: 'dashboard/farmadmin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard/blog',
    renderMode: RenderMode.Client,
  },
  // Fallback wildcard - serve client-side (do not prerender unknown pages)
  {
    path: '**',
    renderMode: RenderMode.Client,
  }
];
