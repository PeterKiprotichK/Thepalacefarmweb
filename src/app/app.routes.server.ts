import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blogs/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async (): Promise<Record<string, string>[]> => [
      { id: '0' },
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ]
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
