export async function onRequestGet(context) {
  const { env } = context;

  const teachers = await env.DB.prepare(`
    SELECT
      u.id,u.display_name,u.department,
      (SELECT COUNT(*) FROM weekly_priorities wp WHERE wp.week_number=9 AND wp.item_type='teacher_task') AS total_priorities,
      (SELECT COUNT(*) FROM priority_status ps WHERE ps.teacher_id=u.id AND ps.status='complete') AS completed_priorities,
      (SELECT COUNT(*) FROM comments c WHERE c.teacher_id=u.id AND c.acknowledged_at IS NULL) AS unread_feedback,
      EXISTS(SELECT 1 FROM coaching_cycles cc WHERE cc.teacher_id=u.id AND cc.status='active') AS active_coaching,
      (SELECT COUNT(*) FROM evidence e WHERE e.teacher_id=u.id) AS evidence_count,
      (SELECT COUNT(*) FROM support_requests sr WHERE sr.teacher_id=u.id AND sr.status='open') AS open_support,
      MAX(0,
        (SELECT COUNT(*) FROM weekly_priorities wp WHERE wp.week_number=9 AND wp.item_type='teacher_task')
        -
        (SELECT COUNT(*) FROM priority_status ps WHERE ps.teacher_id=u.id AND ps.status='complete')
      ) AS open_actions
    FROM users u
    WHERE u.role='teacher' AND u.active=1
    ORDER BY u.display_name
  `).all();

  const list = teachers.results || [];
  const counts = {
    teachers: list.length,
    open_actions: list.reduce((s,t)=>s+Number(t.open_actions||0),0),
    active_coaching: list.filter(t=>Number(t.active_coaching)===1).length,
    teacher_replies: await env.DB.prepare(`SELECT COUNT(*) AS n FROM coaching_reflections WHERE reflection_type IN ('teacher_reflection','teacher_reply')`).first('n')
  };

  return Response.json({counts,teachers:list});
}
