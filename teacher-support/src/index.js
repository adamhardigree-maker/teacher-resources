function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

async function requireDb(env) {
  if (!env.DB) return json({ ok:false, error:"D1_NOT_BOUND", message:"The CVA Teacher Support D1 database has not been bound yet." },503);
  return null;
}

async function ensureAttachmentsTable(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id TEXT NOT NULL,
    owner_type TEXT NOT NULL,
    owner_key TEXT,
    file_name TEXT NOT NULL,
    object_key TEXT UNIQUE NOT NULL,
    content_type TEXT,
    size_bytes INTEGER,
    uploaded_by TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_attachments_teacher ON attachments(teacher_id,created_at)`).run();
}

async function getTeacherData(env, request) {
  const noDb = await requireDb(env); if (noDb) return noDb;
  await ensureAttachmentsTable(env);
  const url = new URL(request.url);
  const teacherId = url.searchParams.get("teacher_id") || "teacher-jordan";
  const [priorities,status,comments,cycles,reflections,evidence,support,attachments] = await Promise.all([
    env.DB.prepare(`SELECT * FROM weekly_priorities WHERE active=1 ORDER BY week_number,sort_order`).all(),
    env.DB.prepare(`SELECT * FROM priority_status WHERE teacher_id=? ORDER BY updated_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT c.*,u.display_name AS author_name,u.role AS author_role FROM comments c LEFT JOIN users u ON u.id=c.author_id WHERE c.teacher_id=? ORDER BY c.created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT cc.*,u.display_name AS coach_name FROM coaching_cycles cc LEFT JOIN users u ON u.id=cc.coach_id WHERE cc.teacher_id=? ORDER BY cc.opened_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM coaching_reflections WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM evidence WHERE teacher_id=? ORDER BY occurred_on DESC,created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM support_requests WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM attachments WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all()
  ]);
  return json({teacher_id:teacherId,priorities:priorities.results,priority_status:status.results,comments:comments.results,coaching_cycles:cycles.results,coaching_reflections:reflections.results,evidence:evidence.results,support_requests:support.results,attachments:attachments.results});
}

async function sendSupportEmail(env, teacherId, body) {
  if (!env.EMAIL || !env.SUPPORT_EMAIL_FROM || !env.SUPPORT_EMAIL_TO) {
    return { sent:false, reason:"EMAIL_NOT_CONFIGURED" };
  }

  const teacher = await env.DB.prepare(`SELECT display_name,email,department FROM users WHERE id=?`).bind(teacherId).first();
  const submitted = new Date().toLocaleString("en-US", { timeZone:"America/New_York", dateStyle:"medium", timeStyle:"short" });
  const teacherName = teacher?.display_name || teacherId;
  const department = teacher?.department || "";
  const area = body.area || "General";
  const priority = body.priority || "normal";
  const supportType = body.support_type || body.type || "Support Request";
  const description = body.description || "";

  const subject = `CVA Teacher Support Request — ${teacherName}`;
  const text = [
    "A new CVA Teacher Support request was submitted.",
    "",
    `Teacher: ${teacherName}`,
    department ? `Department: ${department}` : null,
    `Area: ${area}`,
    `Support Type: ${supportType}`,
    `Priority: ${priority}`,
    `Submitted: ${submitted}`,
    "",
    "Request:",
    description,
    "",
    "This request has also been recorded in the CVA Teacher Support dashboard."
  ].filter(Boolean).join("\n");

  await env.EMAIL.send({
    from: env.SUPPORT_EMAIL_FROM,
    to: env.SUPPORT_EMAIL_TO,
    subject,
    text
  });

  return { sent:true };
}

async function postAction(env, request) {
  const noDb = await requireDb(env); if (noDb) return noDb;
  const body = await request.json();
  const teacherId = body.teacher_id || "teacher-jordan";

  if (body.action === "priority_status") {
    const completed = body.status === "complete" ? new Date().toISOString() : null;
    await env.DB.prepare(`INSERT INTO priority_status(teacher_id,priority_key,status,completed_at,updated_at) VALUES(?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(teacher_id,priority_key) DO UPDATE SET status=excluded.status,completed_at=excluded.completed_at,updated_at=CURRENT_TIMESTAMP`)
      .bind(teacherId,body.priority_key,body.status,completed).run();
    return json({ok:true});
  }

  if (body.action === "coaching_reflection") {
    await env.DB.prepare(`INSERT INTO coaching_reflections(cycle_key,teacher_id,author_id,reflection_type,body) VALUES(?,?,?,'teacher_reflection',?)`)
      .bind(body.cycle_key,teacherId,teacherId,body.body).run();
    await env.DB.prepare(`INSERT INTO evidence(teacher_id,source_type,source_key,title,description,reflection,ipr_domain,created_by) VALUES(?,'coaching_cycle',?,'Coaching Reflection: Proactive Student Outreach',?,?, 'intervention',?)`)
      .bind(teacherId,body.cycle_key,body.body,body.body,teacherId).run();
    return json({ok:true});
  }

  if (body.action === "coaching_status") {
    const allowed = new Set(["not_started","tried","need_help"]);
    if (!allowed.has(body.status)) return json({ok:false,error:"Invalid coaching status"},400);
    await env.DB.prepare(`UPDATE coaching_cycles SET action_status=? WHERE cycle_key=? AND teacher_id=?`).bind(body.status,body.cycle_key,teacherId).run();
    return json({ok:true});
  }

  if (body.action === "coaching_close") {
    await env.DB.prepare(`UPDATE coaching_cycles SET status='closed',closed_at=CURRENT_TIMESTAMP WHERE cycle_key=? AND teacher_id=?`).bind(body.cycle_key,teacherId).run();
    await env.DB.prepare(`INSERT INTO evidence(teacher_id,source_type,source_key,title,description,ipr_domain,created_by) VALUES(?,'coaching_cycle',?,'Completed Coaching Cycle',?,'intervention',?)`)
      .bind(teacherId,body.cycle_key,body.summary || 'Coaching cycle completed and preserved in the teacher evidence journal.',body.author_id || 'coach-sam').run();
    return json({ok:true});
  }

  if (body.action === "evidence_add") {
    await env.DB.prepare(`INSERT INTO evidence(teacher_id,source_type,title,description,reflection,ipr_domain,occurred_on,created_by) VALUES(?,'manual',?,?,?,?,?,?)`)
      .bind(teacherId,body.title,body.description,body.reflection || null,body.ipr_domain || null,body.occurred_on || new Date().toISOString().slice(0,10),teacherId).run();
    return json({ok:true});
  }

  if (body.action === "support_request") {
    await env.DB.prepare(`INSERT INTO support_requests(teacher_id,area,priority,description) VALUES(?,?,?,?)`).bind(teacherId,body.area,body.priority || "normal",body.description).run();

    let email = { sent:false, reason:"EMAIL_NOT_CONFIGURED" };
    try {
      email = await sendSupportEmail(env, teacherId, body);
    } catch (error) {
      console.error("Support request email failed:", error);
      email = { sent:false, reason:"EMAIL_SEND_FAILED" };
    }

    return json({ok:true,email});
  }

  if (body.action === "support_update") {
    const status = body.status || 'open';
    const resolvedAt = status === 'resolved' ? new Date().toISOString() : null;
    await env.DB.prepare(`UPDATE support_requests SET status=?,assigned_to=COALESCE(?,assigned_to),resolved_at=? WHERE id=?`).bind(status,body.assigned_to || null,resolvedAt,body.request_id).run();
    return json({ok:true});
  }

  if (body.action === "comment_add") {
    await env.DB.prepare(`INSERT INTO comments(teacher_id,author_id,target_type,target_key,comment_type,body) VALUES(?,?,?,?,?,?)`)
      .bind(teacherId,body.author_id || "lead-alex",body.target_type || "week",body.target_key || null,body.comment_type || "coaching_note",body.body).run();
    return json({ok:true});
  }

  if (body.action === "comment_acknowledge") {
    await env.DB.prepare(`UPDATE comments SET acknowledged_at=CURRENT_TIMESTAMP WHERE id=? AND teacher_id=?`).bind(body.comment_id,teacherId).run();
    return json({ok:true});
  }

  return json({ok:false,error:"Unknown action"},400);
}

async function leadership(env) {
  const noDb = await requireDb(env); if (noDb) return noDb;
  const teachers = await env.DB.prepare(`SELECT u.id,u.display_name,u.department,
    (SELECT COUNT(*) FROM weekly_priorities wp WHERE wp.week_number=9 AND wp.item_type='teacher_task') AS total_priorities,
    (SELECT COUNT(*) FROM priority_status ps WHERE ps.teacher_id=u.id AND ps.status='complete') AS completed_priorities,
    (SELECT COUNT(*) FROM comments c WHERE c.teacher_id=u.id AND c.acknowledged_at IS NULL) AS unread_feedback,
    EXISTS(SELECT 1 FROM coaching_cycles cc WHERE cc.teacher_id=u.id AND cc.status='active') AS active_coaching,
    (SELECT COUNT(*) FROM evidence e WHERE e.teacher_id=u.id) AS evidence_count,
    (SELECT COUNT(*) FROM support_requests sr WHERE sr.teacher_id=u.id AND sr.status='open') AS open_support,
    MAX(0,(SELECT COUNT(*) FROM weekly_priorities wp WHERE wp.week_number=9 AND wp.item_type='teacher_task')-(SELECT COUNT(*) FROM priority_status ps WHERE ps.teacher_id=u.id AND ps.status='complete')) AS open_actions
    FROM users u WHERE u.role='teacher' AND u.active=1 ORDER BY u.display_name`).all();
  const list = teachers.results || [];
  const replyCount = await env.DB.prepare(`SELECT COUNT(*) AS n FROM coaching_reflections WHERE reflection_type IN ('teacher_reflection','teacher_reply')`).first("n");
  const support = await env.DB.prepare(`SELECT sr.*,u.display_name FROM support_requests sr JOIN users u ON u.id=sr.teacher_id WHERE sr.status='open' ORDER BY CASE WHEN sr.priority='high' THEN 0 ELSE 1 END,sr.created_at DESC`).all();
  const reflections = await env.DB.prepare(`SELECT cr.*,u.display_name FROM coaching_reflections cr JOIN users u ON u.id=cr.teacher_id ORDER BY cr.created_at DESC LIMIT 20`).all();
  const cycles = await env.DB.prepare(`SELECT cc.*,u.display_name,coach.display_name AS coach_name FROM coaching_cycles cc JOIN users u ON u.id=cc.teacher_id LEFT JOIN users coach ON coach.id=cc.coach_id ORDER BY cc.status='active' DESC,cc.opened_at DESC`).all();
  return json({counts:{teachers:list.length,open_actions:list.reduce((s,t)=>s+Number(t.open_actions||0),0),active_coaching:list.filter(t=>Number(t.active_coaching)===1).length,teacher_replies:Number(replyCount||0),support_requests:(support.results||[]).length},teachers:list,support_requests:support.results||[],teacher_reflections:reflections.results||[],coaching_cycles:cycles.results||[]});
}

async function uploadAttachment(env, request) {
  const noDb = await requireDb(env); if (noDb) return noDb;
  if (!env.R2) return json({ok:false,error:'R2_NOT_BOUND',message:'The R2 bucket is not bound.'},503);
  await ensureAttachmentsTable(env);
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') return json({ok:false,error:'FILE_REQUIRED'},400);
  const teacherId = String(form.get('teacher_id') || 'teacher-jordan');
  const ownerType = String(form.get('owner_type') || 'evidence');
  const ownerKey = String(form.get('owner_key') || '');
  const uploadedBy = String(form.get('uploaded_by') || teacherId);
  if (file.size > 10*1024*1024) return json({ok:false,error:'FILE_TOO_LARGE',message:'Files must be 10 MB or smaller.'},400);
  const safeName = String(file.name || 'attachment').replace(/[^a-zA-Z0-9._-]+/g,'-');
  const objectKey = `${teacherId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  await env.R2.put(objectKey,await file.arrayBuffer(),{httpMetadata:{contentType:file.type || 'application/octet-stream'}});
  await env.DB.prepare(`INSERT INTO attachments(teacher_id,owner_type,owner_key,file_name,object_key,content_type,size_bytes,uploaded_by) VALUES(?,?,?,?,?,?,?,?)`)
    .bind(teacherId,ownerType,ownerKey || null,file.name || safeName,objectKey,file.type || null,file.size || 0,uploadedBy).run();
  return json({ok:true,file_name:file.name,object_key:objectKey});
}

async function getAttachment(env, request) {
  const noDb = await requireDb(env); if (noDb) return noDb;
  if (!env.R2) return json({ok:false,error:'R2_NOT_BOUND'},503);
  await ensureAttachmentsTable(env);
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const row = await env.DB.prepare(`SELECT * FROM attachments WHERE id=?`).bind(id).first();
  if (!row) return json({ok:false,error:'NOT_FOUND'},404);
  const object = await env.R2.get(row.object_key);
  if (!object) return json({ok:false,error:'OBJECT_NOT_FOUND'},404);
  const headers = new Headers();
  headers.set('content-type',row.content_type || 'application/octet-stream');
  headers.set('content-disposition',`attachment; filename="${String(row.file_name).replace(/"/g,'')}"`);
  headers.set('cache-control','private, no-store');
  return new Response(object.body,{headers});
}

async function staticWithApiScript(request, env) {
  const asset = await env.ASSETS.fetch(request);
  const type = asset.headers.get("content-type") || "";
  if (!type.includes("text/html")) return asset;
  const html = await asset.text();
  const injected = html.includes('/app-api.js') ? html : html.replace(/<\/body>/i,'<script src="/app-api.js"></script></body>');
  const headers = new Headers(asset.headers); headers.delete("content-length");
  return new Response(injected,{status:asset.status,statusText:asset.statusText,headers});
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") return json({ok:true,app:"cva-teacher-support",db_bound:!!env.DB,r2_bound:!!env.R2,email_bound:!!env.EMAIL,email_addresses_configured:!!env.SUPPORT_EMAIL_FROM && !!env.SUPPORT_EMAIL_TO});
    if (url.pathname === "/api/data" && request.method === "GET") return getTeacherData(env,request);
    if (url.pathname === "/api/action" && request.method === "POST") return postAction(env,request);
    if (url.pathname === "/api/leadership" && request.method === "GET") return leadership(env);
    if (url.pathname === "/api/upload" && request.method === "POST") return uploadAttachment(env,request);
    if (url.pathname === "/api/file" && request.method === "GET") return getAttachment(env,request);
    return staticWithApiScript(request,env);
  }
};
