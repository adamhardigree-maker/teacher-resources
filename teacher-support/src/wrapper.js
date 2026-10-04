import app from './index.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const response = await app.fetch(request, env, ctx);

    if (request.method !== 'GET' || url.pathname !== '/') return response;
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

    const teachingWeekUrl = new URL('/teaching-week.html', request.url);
    const coreHabitsUrl = new URL('/core-habits.html', request.url);
    const [templateResponse, coreHabitsResponse] = await Promise.all([
      env.ASSETS.fetch(new Request(teachingWeekUrl, { method: 'GET' })),
      env.ASSETS.fetch(new Request(coreHabitsUrl, { method: 'GET' }))
    ]);
    if (!templateResponse.ok || !coreHabitsResponse.ok) return response;

    const [html, teachingWeek, coreHabits] = await Promise.all([
      response.text(),
      templateResponse.text(),
      coreHabitsResponse.text()
    ]);

    const weekReplacement = `<section class="view active" id="week">${teachingWeek}</section>`;
    let revised = html.replace(/<section class="view active" id="week">[\s\S]*?<\/section>/i, weekReplacement);

    revised = revised.replace(
      /(<section class="view" id="practice">[\s\S]*?)(<\/section>)/i,
      (match, before, close) => before.includes('id="coreTeachingHabits"') ? match : before + coreHabits + close
    );

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(revised, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
