export async function onRequestPost(context) {
  const { env, request } = context;
  const body = await request.json();
  const action = body.action;
  const teacherId = body.teacher_id || 'teacher-jordan';

  if (action === 'priority_status') {
    const completed = body.status === 'complete' ? new Date().toISOString() : null;
    await env.DB.prepare(`
      INSERT INTO priority_status(teacher_id,priority_key,status,completed_at,updated_at)
      VALUES(?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(teacher_id,priority_key)
      DO UPDATE SET status=excluded.status, completed_at=excluded.completed_at, updated_at=CURRENT_TIMESTAMP
    `).bind(teacherId, body.priority_key, body.status, completed).run();
    return Response.json({ok:true});
  }

  if (action === 'coaching_reflection') {
    await env.DB.prepare(`
      INSERT INTO coaching_reflections(cycle_key,teacher_id,author_id,reflection_type,body)
      VALUES(?,?,?,'teacher_reflection',?)
    `).bind(body.cycle_key, teacherId, teacherId, body.body).run();

    await env.DB.prepare(`
      INSERT INTO evidence(teacher_id,source_type,source_key,title,description,reflection,ipr_domain,created_by)
      VALUES(?,'coaching_cycle',?,'Coaching Reflection: Proactive Student Outreach',?,?, 'intervention',?)
    `).bind(teacherId, body.cycle_key, body.body, body.body, teacherId).run();

    return Response.json({ok:true});
  }

  if (action === 'evidence_add') {
    await env.DB.prepare(`
      INSERT INTO evidence(teacher_id,source_type,title,description,reflection,ipr_domain,occurred_on,created_by)
      VALUES(?,'manual',?,?,?,?,?,?)
    `).bind(teacherId,body.title,body.description,body.reflection||null,body.ipr_domain||null,body.occurred_on||new Date().toISOString().slice(0,10),teacherId).run();
    return Response.json({ok:true});
  }

  if (action === 'support_request') {
    await env.DB.prepare(`
      INSERT INTO support_requests(teacher_id,area,priority,description)
      VALUES(?,?,?,?)
    `).bind(teacherId,body.area,body.priority||'normal',body.description).run();
    return Response.json({ok:true});
  }

  if (action === 'comment_add') {
    await env.DB.prepare(`
      INSERT INTO comments(teacher_id,author_id,target_type,target_key,comment_type,body)
      VALUES(?,?,?,?,?,?)
    `).bind(teacherId,body.author_id||'lead-alex',body.target_type||'week',body.target_key||null,body.comment_type||'coaching_note',body.body).run();
    return Response.json({ok:true});
  }

  return Response.json({ok:false,error:'Unknown action'}, {status:400});
}
