export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const teacherId = url.searchParams.get('teacher_id') || 'teacher-jordan';

  const [priorities, status, comments, cycles, reflections, evidence, support] = await Promise.all([
    env.DB.prepare(`SELECT * FROM weekly_priorities WHERE active=1 ORDER BY week_number, sort_order`).all(),
    env.DB.prepare(`SELECT * FROM priority_status WHERE teacher_id=? ORDER BY updated_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM comments WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM coaching_cycles WHERE teacher_id=? ORDER BY opened_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM coaching_reflections WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM evidence WHERE teacher_id=? ORDER BY occurred_on DESC, created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM support_requests WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all()
  ]);

  return Response.json({
    teacher_id: teacherId,
    priorities: priorities.results,
    priority_status: status.results,
    comments: comments.results,
    coaching_cycles: cycles.results,
    coaching_reflections: reflections.results,
    evidence: evidence.results,
    support_requests: support.results
  });
}
