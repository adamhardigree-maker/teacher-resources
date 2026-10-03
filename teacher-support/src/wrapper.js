import app from './index.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const response = await app.fetch(request, env, ctx);

    if (request.method !== 'GET' || url.pathname !== '/') return response;
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

    const templateUrl = new URL('/teaching-week.html', request.url);
    const templateResponse = await env.ASSETS.fetch(new Request(templateUrl, { method: 'GET' }));
    if (!templateResponse.ok) return response;

    const [html, teachingWeek] = await Promise.all([response.text(), templateResponse.text()]);
    const replacement = `<section class="view active" id="week">${teachingWeek}</section>`;
    const revised = html.replace(/<section class="view active" id="week">[\s\S]*?<\/section>/i, replacement);

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(revised, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
