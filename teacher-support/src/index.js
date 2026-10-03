function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

async function requireDb(env) {
  if (!env.DB) {
    return json({
      ok: false,
      error: "D1_NOT_BOUND",
      message: "The CVA Teacher Support D1 database has not been bound yet."
    }, 503);
  }
  return null;
}

async function getTeacherData(env, request) {
  const noDb = await requireDb(env);
  if (noDb) return noDb;

  const url = new URL(request.url);
  const teacherId = url.searchParams.get("teacher_id") || "teacher-jordan";

  const [priorities, status, comments, cycles, reflections, evidence, support] = await Promise.all([
    env.DB.prepare(`SELECT * FROM weekly_priorities WHERE active=1 ORDER BY week_number, sort_order`).all(),
    env.DB.prepare(`SELECT * FROM priority_status WHERE teacher_id=? ORDER BY updated_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM comments WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM coaching_cycles WHERE teacher_id=? ORDER BY opened_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM coaching_reflections WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM evidence WHERE teacher_id=? ORDER BY occurred_on DESC, created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM support_requests WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all()
  ]);

  return json({
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

async function postAction(env, request) {
  const noDb = await requireDb(env);
  if (noDb) return noDb;

  const body = await request.json();
  const teacherId = body.teacher_id || "teacher-jordan";

  if (body.action === "priority_status") {
    const completed = body.status === "complete" ? new Date().toISOString() : null;
    await env.DB.prepare(`
      INSERT INTO priority_status(teacher_id,priority_key,status,completed_at,updated_at)
      VALUES(?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(teacher_id,priority_key)
      DO UPDATE SET status=excluded.status, completed_at=excluded.completed_at, updated_at=CURRENT_TIMESTAMP
    `).bind(teacherId, body.priority_key, body.status, completed).run();
    return json({ ok: true });
  }

  if (body.action === "coaching_reflection") {
    await env.DB.prepare(`
      INSERT INTO coaching_reflections(cycle_key,teacher_id,author_id,reflection_type,body)
      VALUES(?,?,?,'teacher_reflection',?)
    `).bind(body.cycle_key, teacherId, teacherId, body.body).run();

    await env.DB.prepare(`
      INSERT INTO evidence(teacher_id,source_type,source_key,title,description,reflection,ipr_domain,created_by)
      VALUES(?,'coaching_cycle',?,'Coaching Reflection: Proactive Student Outreach',?,?, 'intervention',?)
    `).bind(teacherId, body.cycle_key, body.body, body.body, teacherId).run();

    return json({ ok: true });
  }

  if (body.action === "evidence_add") {
    await env.DB.prepare(`
      INSERT INTO evidence(teacher_id,source_type,title,description,reflection,ipr_domain,occurred_on,created_by)
      VALUES(?,'manual',?,?,?,?,?,?)
    `).bind(
      teacherId,
      body.title,
      body.description,
      body.reflection || null,
      body.ipr_domain || null,
      body.occurred_on || new Date().toISOString().slice(0, 10),
      teacherId
    ).run();
    return json({ ok: true });
  }

  if (body.action === "support_request") {
    await env.DB.prepare(`
      INSERT INTO support_requests(teacher_id,area,priority,description)
      VALUES(?,?,?,?)
    `).bind(teacherId, body.area, body.priority || "normal", body.description).run();
    return json({ ok: true });
  }

  if (body.action === "comment_add") {
    await env.DB.prepare(`
      INSERT INTO comments(teacher_id,author_id,target_type,target_key,comment_type,body)
      VALUES(?,?,?,?,?,?)
    `).bind(
      teacherId,
      body.author_id || "lead-alex",
      body.target_type || "week",
      body.target_key || null,
      body.comment_type || "coaching_note",
      body.body
    ).run();
    return json({ ok: true });
  }

  return json({ ok: false, error: "Unknown action" }, 400);
}

async function leadership(env) {
  const noDb = await requireDb(env);
  if (noDb) return noDb;

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
  const replyCount = await env.DB.prepare(`
    SELECT COUNT(*) AS n
    FROM coaching_reflections
    WHERE reflection_type IN ('teacher_reflection','teacher_reply')
  `).first("n");

  return json({
    counts: {
      teachers: list.length,
      open_actions: list.reduce((s,t)=>s+Number(t.open_actions||0),0),
      active_coaching: list.filter(t=>Number(t.active_coaching)===1).length,
      teacher_replies: Number(replyCount || 0)
    },
    teachers: list
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, app: "cva-teacher-support", db_bound: !!env.DB });
    }
    if (url.pathname === "/api/data" && request.method === "GET") {
      return getTeacherData(env, request);
    }
    if (url.pathname === "/api/action" && request.method === "POST") {
      return postAction(env, request);
    }
    if (url.pathname === "/api/leadership" && request.method === "GET") {
      return leadership(env);
    }

    return env.ASSETS.fetch(request);
  }
};
