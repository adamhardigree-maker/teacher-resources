function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}


const FALL_2026_WEEKS = [
  {week_number:0,start_date:'2026-07-27',end_date:'2026-07-31',label:'Week 0'},
  {week_number:1,start_date:'2026-08-03',end_date:'2026-08-07',label:'Week 1'},
  {week_number:2,start_date:'2026-08-10',end_date:'2026-08-14',label:'Week 2'},
  {week_number:3,start_date:'2026-08-17',end_date:'2026-08-21',label:'Week 3'},
  {week_number:4,start_date:'2026-08-24',end_date:'2026-08-30',label:'Week 4'},
  {week_number:5,start_date:'2026-08-31',end_date:'2026-09-04',label:'Week 5'},
  {week_number:6,start_date:'2026-09-08',end_date:'2026-09-13',label:'Week 6'},
  {week_number:7,start_date:'2026-09-14',end_date:'2026-09-18',label:'Week 7'},
  {week_number:8,start_date:'2026-09-21',end_date:'2026-09-25',label:'Week 8 • Fall Break'},
  {week_number:9,start_date:'2026-09-28',end_date:'2026-10-02',label:'Week 9'},
  {week_number:10,start_date:'2026-10-05',end_date:'2026-10-09',label:'Week 10'},
  {week_number:11,start_date:'2026-10-12',end_date:'2026-10-16',label:'Week 11'},
  {week_number:12,start_date:'2026-10-19',end_date:'2026-10-23',label:'Week 12'},
  {week_number:13,start_date:'2026-10-26',end_date:'2026-10-30',label:'Week 13'},
  {week_number:14,start_date:'2026-11-02',end_date:'2026-11-06',label:'Week 14'},
  {week_number:15,start_date:'2026-11-09',end_date:'2026-11-13',label:'Week 15'},
  {week_number:16,start_date:'2026-11-16',end_date:'2026-11-20',label:'Week 16'},
  {week_number:17,start_date:'2026-11-23',end_date:'2026-11-27',label:'Week 17 • Thanksgiving Break'},
  {week_number:18,start_date:'2026-11-30',end_date:'2026-12-11',label:'Week 18 • End of Term'}
];

const FALL_2026_PRIORITIES = [
  ['w0-welcome-announcement',0,'2026-07-31','Create Welcome Announcement','Prepare the welcome announcement before students begin the term.','teacher_task',1],
  ['w0-instructor-profile',0,'2026-07-31','Update Instructor Profile','Update the instructor profile for the new term.','teacher_task',2],
  ['w0-teacher-information-page',0,'2026-07-31','Update Teacher Information Page','Update the Teacher Information Page for the new term.','teacher_task',3],
  ['w0-course-quest',0,'2026-07-31','Complete Course Quest','Complete Course Quest and receive 100%.','teacher_task',4],
  ['w1-welcome-calls',1,'2026-08-03','Welcome Calls','Begin making welcome calls and record details in gradebook feedback.','teacher_task',1],
  ['w1-grading-begins',1,'2026-08-03','Grading Begins','Begin grading student work and mark past-due items missing. Do not sync into Synergy yet.','teacher_task',2],
  ['w1-fall-kickoff',1,'2026-08-03','Fall Term Kick Off','Attend one department meeting session.','teacher_task',3],
  ['w2-welcome-calls',2,'2026-08-10','Welcome Calls','Continue efforts; mark incomplete welcome calls missing and record failed attempts in gradebook feedback.','teacher_task',1],
  ['w2-synergy-setup',2,'2026-08-10','Synergy Set Up','Set up Synergy categories such as CVA Assignments. Do not sync yet.','teacher_task',2],
  ['w2-kickoff-ends',2,'2026-08-14','Fall Term Kick Off Ends','Attend one department meeting session.','teacher_task',3],
  ['w3-welcome-calls',3,'2026-08-17','Welcome Calls','Continue efforts; mark incomplete welcome calls as 0 and record failed attempts in gradebook feedback.','teacher_task',1],
  ['w3-sync-begins',3,'2026-08-17','Begin CTLS to Synergy Sync','Begin syncing CTLS assignments with Synergy.','teacher_task',2],
  ['w3-nonstarter-parent-contact',3,'2026-08-17','Nonstarters: Parent Contact','Begin two-way communication with parents of non-starters and document outreach and responses in Views & Tools.','teacher_task',3],
  ['w3-nonstarter-unreached-list',3,'2026-08-21','Nonstarters: Unreached Parent List','Email CVA Teacher Support a list of non-starter students for whom a two-way parent/guardian conversation could not be established.','teacher_task',4],
  ['w4-failing-parent-contact',4,'2026-08-30','Failing Students: Parent Contact','Have a two-way conversation with parents of failing students and record communication in Views & Tools.','teacher_task',1],
  ['w4-synergy-sync',4,'2026-08-27','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2],
  ['w5-synergy-sync',5,'2026-09-03','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',1],
  ['w6-failing-parent-contact',6,'2026-09-13','Failing Students: Parent Contact','Have a two-way conversation with parents of failing students and record communication in Views & Tools.','teacher_task',1],
  ['w6-parent-contact-details',6,'2026-09-10','Parent Contact Documentation','Enter details of communication efforts with parents of failing students in Views & Tools, including responses as available.','teacher_task',2],
  ['w7-missing-assignments',7,'2026-09-14','Missing Assignments','Encourage students with missing assignments to complete them by the Oct. 2 mid-term cutoff for previous units.','teacher_task',1],
  ['gradebook-catch-up',9,'2026-10-01','Gradebook Catch Up','Finish grading all work submitted over Fall Break.','teacher_task',1],
  ['synergy-sync-check',9,'2026-10-01','Synergy Sync Check','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2],
  ['mid-term-cut-off-for-assignments',9,'2026-10-02','Mid-Term Cut Off for Assignments','Last day students may submit work from prior units; see the class schedule.','term_date',3],
  ['w10-student-connections',10,'2026-10-05','Student Connections','Continue connecting with students and building relationships.','teacher_task',1],
  ['w10-synergy-sync',10,'2026-10-06','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2],
  ['w11-student-connections',11,'2026-10-12','Student Connections','Continue encouraging and connecting with students.','teacher_task',1],
  ['w11-synergy-sync',11,'2026-10-14','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2],
  ['w12-parent-contact',12,'2026-10-22','Failing Students: Parent Contact','Enter details of communication efforts with parents of failing students in Views & Tools, including responses as available.','teacher_task',1],
  ['w12-synergy-sync',12,'2026-10-22','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2],
  ['w13-synergy-sync',13,'2026-10-26','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',1],
  ['w14-senior-push',14,'2026-11-06','Senior Push','Push seniors across the finish line with extra support or encouragement.','teacher_task',1],
  ['w15-senior-push',15,'2026-11-13','Senior Push','Continue supporting seniors and document conversations with families in Views & Tools.','teacher_task',1],
  ['w16-senior-push',16,'2026-11-20','Senior Push','Continue supporting seniors and document conversations with families in Views & Tools.','teacher_task',1],
  ['w18-coursework-cutoff',18,'2026-12-03','Last Day to Submit Coursework','Coursework submission closes at 11:59 p.m.','term_date',1],
  ['w18-complete-grading',18,'2026-12-04','Complete Grading','Grade all submitted work.','teacher_task',2],
  ['w18-synergy-sync',18,'2026-12-04','Synergy Sync','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',3],
  ['w18-final-exams',18,'2026-12-06','Final Exams','Begin monitoring final exam submissions.','teacher_task',4],
  ['w18-final-communications',18,'2026-12-07','Final Exam Communications','Reach out to students who have not completed the final exam.','teacher_task',5],
  ['w18-incomplete-finals-parent-contact',18,'2026-12-08','Incomplete Finals: Parent Contact','Call parent/guardians of students who have not completed final exams by 5:00 p.m.','teacher_task',6],
  ['w18-follow-up',18,'2026-12-09','Final Exam Follow-Up','Email CVA Teacher Support with names of students who did not complete the final exam.','teacher_task',7],
  ['w18-finalize-grades',18,'2026-12-10','Finalize Grades (Non-EOC)','Close course extension units at 8:00 p.m.; non-EOC grades are due by 11:59 p.m.','teacher_task',8],
  ['w18-final-grades-posted',18,'2026-12-11','Final Grades Posted','Notify students and families of final grade posting.','teacher_task',9]
];

const FALL_2026_CALENDAR = [
  ['ccsd-first-day-2026','2026-08-03',null,'First Day of School','first_day','CCSD first day of school.','CCSD 2026-2027 School Year Calendar'],
  ['ccsd-labor-day-2026','2026-09-07',null,'Labor Day','holiday','School closed.','CCSD 2026-2027 School Year Calendar'],
  ['ccsd-fall-break-2026','2026-09-21','2026-09-25','Fall Break','holiday','School closed; CVA Learning Centers are closed.','CCSD calendar + CVA Teacher Schedule'],
  ['ccsd-digital-learning-2026-10-12','2026-10-12',null,'Digital Learning Day','digital_learning','District Digital Learning Day.','CCSD 2026-2027 School Year Calendar'],
  ['ccsd-election-day-2026','2026-11-03',null,'Election Day / Student Holiday-Staff Day','student_holiday','Student holiday/staff day.','CCSD 2026-2027 School Year Calendar'],
  ['ccsd-thanksgiving-2026','2026-11-23','2026-11-27','Thanksgiving Break','holiday','School closed; CVA Learning Centers are closed.','CCSD calendar + CVA Teacher Schedule'],
  ['ccsd-digital-learning-2026-12-01','2026-12-01',null,'Digital Learning Day','digital_learning','District Digital Learning Day.','CCSD 2026-2027 School Year Calendar']
];

async function ensureScheduleData(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_key TEXT UNIQUE NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL DEFAULT 'CCSD Calendar'
  )`).run();

  const p = env.DB.prepare(`INSERT OR IGNORE INTO weekly_priorities(priority_key,week_number,due_date,title,description,item_type,sort_order) VALUES(?,?,?,?,?,?,?)`);
  for (const row of FALL_2026_PRIORITIES) await p.bind(...row).run();

  const c = env.DB.prepare(`INSERT OR IGNORE INTO calendar_events(event_key,start_date,end_date,title,event_type,description,source) VALUES(?,?,?,?,?,?,?)`);
  for (const row of FALL_2026_CALENDAR) await c.bind(...row).run();
}

function currentScheduleWeekNumber(dateString) {
  const d = dateString || new Date().toISOString().slice(0,10);
  const match = FALL_2026_WEEKS.find(w => d >= w.start_date && d <= w.end_date);
  if (match) return match.week_number;
  const next = FALL_2026_WEEKS.find(w => d < w.start_date);
  return next ? next.week_number : FALL_2026_WEEKS[FALL_2026_WEEKS.length-1].week_number;
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
  await ensureScheduleData(env);
  const url = new URL(request.url);
  const teacherId = url.searchParams.get("teacher_id") || "teacher-jordan";
  const [priorities,status,comments,cycles,reflections,evidence,support,attachments,calendarEvents] = await Promise.all([
    env.DB.prepare(`SELECT * FROM weekly_priorities WHERE active=1 ORDER BY week_number,sort_order`).all(),
    env.DB.prepare(`SELECT * FROM priority_status WHERE teacher_id=? ORDER BY updated_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT c.*,u.display_name AS author_name,u.role AS author_role FROM comments c LEFT JOIN users u ON u.id=c.author_id WHERE c.teacher_id=? ORDER BY c.created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT cc.*,u.display_name AS coach_name FROM coaching_cycles cc LEFT JOIN users u ON u.id=cc.coach_id WHERE cc.teacher_id=? ORDER BY cc.opened_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM coaching_reflections WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM evidence WHERE teacher_id=? ORDER BY occurred_on DESC,created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM support_requests WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM attachments WHERE teacher_id=? ORDER BY created_at DESC`).bind(teacherId).all(),
    env.DB.prepare(`SELECT * FROM calendar_events ORDER BY start_date`).all()
  ]);
  return json({teacher_id:teacherId,priorities:priorities.results,priority_status:status.results,comments:comments.results,coaching_cycles:cycles.results,coaching_reflections:reflections.results,evidence:evidence.results,support_requests:support.results,attachments:attachments.results,calendar_events:calendarEvents.results,schedule_weeks:FALL_2026_WEEKS});
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
    return json({ok:true});
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
  await ensureScheduleData(env);
  const currentWeek = currentScheduleWeekNumber();
  const teachers = await env.DB.prepare(`SELECT u.id,u.display_name,u.department,
    (SELECT COUNT(*) FROM weekly_priorities wp WHERE wp.week_number=${currentWeek} AND wp.item_type='teacher_task') AS total_priorities,
    (SELECT COUNT(*) FROM priority_status ps WHERE ps.teacher_id=u.id AND ps.status='complete') AS completed_priorities,
    (SELECT COUNT(*) FROM comments c WHERE c.teacher_id=u.id AND c.acknowledged_at IS NULL) AS unread_feedback,
    EXISTS(SELECT 1 FROM coaching_cycles cc WHERE cc.teacher_id=u.id AND cc.status='active') AS active_coaching,
    (SELECT COUNT(*) FROM evidence e WHERE e.teacher_id=u.id) AS evidence_count,
    (SELECT COUNT(*) FROM support_requests sr WHERE sr.teacher_id=u.id AND sr.status='open') AS open_support,
    MAX(0,(SELECT COUNT(*) FROM weekly_priorities wp WHERE wp.week_number=${currentWeek} AND wp.item_type='teacher_task')-(SELECT COUNT(*) FROM priority_status ps WHERE ps.teacher_id=u.id AND ps.status='complete')) AS open_actions
    FROM users u WHERE u.role='teacher' AND u.active=1 ORDER BY u.display_name`).all();
  const list = teachers.results || [];
  const replyCount = await env.DB.prepare(`SELECT COUNT(*) AS n FROM coaching_reflections WHERE reflection_type IN ('teacher_reflection','teacher_reply')`).first("n");
  const support = await env.DB.prepare(`SELECT sr.*,u.display_name FROM support_requests sr JOIN users u ON u.id=sr.teacher_id WHERE sr.status='open' ORDER BY CASE WHEN sr.priority='high' THEN 0 ELSE 1 END,sr.created_at DESC`).all();
  const reflections = await env.DB.prepare(`SELECT cr.*,u.display_name FROM coaching_reflections cr JOIN users u ON u.id=cr.teacher_id ORDER BY cr.created_at DESC LIMIT 20`).all();
  const cycles = await env.DB.prepare(`SELECT cc.*,u.display_name,coach.display_name AS coach_name FROM coaching_cycles cc JOIN users u ON u.id=cc.teacher_id LEFT JOIN users coach ON coach.id=cc.coach_id ORDER BY cc.status='active' DESC,cc.opened_at DESC`).all();
  return json({counts:{teachers:list.length,open_actions:list.reduce((s,t)=>s+Number(t.open_actions||0),0),active_coaching:list.filter(t=>Number(t.active_coaching)===1).length,teacher_replies:Number(replyCount||0),support_requests:(support.results||[]).length,needs_follow_up:list.filter(t=>Number(t.open_support)>0 || Number(t.open_actions)>0 || Number(t.unread_feedback)>0).length},teachers:list,support_requests:support.results||[],teacher_reflections:reflections.results||[],coaching_cycles:cycles.results||[]});
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
    if (url.pathname === "/api/health") return json({ok:true,app:"cva-teacher-support",db_bound:!!env.DB,r2_bound:!!env.R2});
    if (url.pathname === "/api/data" && request.method === "GET") return getTeacherData(env,request);
    if (url.pathname === "/api/action" && request.method === "POST") return postAction(env,request);
    if (url.pathname === "/api/leadership" && request.method === "GET") return leadership(env);
    if (url.pathname === "/api/upload" && request.method === "POST") return uploadAttachment(env,request);
    if (url.pathname === "/api/file" && request.method === "GET") return getAttachment(env,request);
    return staticWithApiScript(request,env);
  }
};
