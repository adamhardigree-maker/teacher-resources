-- CVA Teacher Support prototype (Cloudflare D1 / SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('teacher','department_lead','instructional_coach','supervisor')),
  department TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leader_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  leader_id TEXT NOT NULL REFERENCES users(id),
  teacher_id TEXT NOT NULL REFERENCES users(id),
  relationship TEXT NOT NULL CHECK(relationship IN ('department_lead','instructional_coach','supervisor')),
  UNIQUE(leader_id,teacher_id,relationship)
);

CREATE TABLE IF NOT EXISTS weekly_priorities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  priority_key TEXT UNIQUE NOT NULL,
  week_number INTEGER NOT NULL,
  due_date TEXT,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL CHECK(item_type IN ('teacher_task','term_date','holiday','information')),
  resource_label TEXT,
  resource_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS priority_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id TEXT NOT NULL REFERENCES users(id),
  priority_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started','in_progress','complete','not_applicable')),
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(teacher_id,priority_key)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id TEXT NOT NULL REFERENCES users(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  target_type TEXT NOT NULL,
  target_key TEXT,
  comment_type TEXT NOT NULL DEFAULT 'coaching_note',
  body TEXT NOT NULL,
  acknowledged_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coaching_cycles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_key TEXT UNIQUE NOT NULL,
  teacher_id TEXT NOT NULL REFERENCES users(id),
  coach_id TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  focus_reason TEXT,
  action_step TEXT,
  ipr_domains TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','closed')),
  action_status TEXT NOT NULL DEFAULT 'not_started' CHECK(action_status IN ('not_started','tried','need_help')),
  next_checkin TEXT,
  opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS coaching_reflections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_key TEXT NOT NULL,
  teacher_id TEXT NOT NULL REFERENCES users(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  reflection_type TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id TEXT NOT NULL REFERENCES users(id),
  source_type TEXT NOT NULL,
  source_key TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reflection TEXT,
  ipr_domain TEXT,
  occurred_on TEXT NOT NULL DEFAULT (date('now')),
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id TEXT NOT NULL REFERENCES users(id),
  area TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_priority_status_teacher ON priority_status(teacher_id,status);
CREATE INDEX IF NOT EXISTS idx_comments_teacher ON comments(teacher_id,created_at);
CREATE INDEX IF NOT EXISTS idx_coaching_teacher ON coaching_cycles(teacher_id,status);
CREATE INDEX IF NOT EXISTS idx_evidence_teacher ON evidence(teacher_id,occurred_on);
CREATE INDEX IF NOT EXISTS idx_support_teacher ON support_requests(teacher_id,status);

INSERT OR IGNORE INTO users(id,email,display_name,role,department) VALUES
('teacher-jordan','jordan@example.test','Jordan Smith','teacher','ELA'),
('teacher-taylor','taylor@example.test','Taylor Brown','teacher','Social Studies'),
('teacher-morgan','morgan@example.test','Morgan Lee','teacher','Science'),
('teacher-casey','casey@example.test','Casey Davis','teacher','Math'),
('teacher-avery','avery@example.test','Avery Green','teacher','CTAE'),
('lead-alex','alex@example.test','Alex Lead','department_lead','ELA'),
('coach-sam','sam@example.test','Sam Coach','instructional_coach',NULL),
('supervisor-admin','admin@example.test','CVA Supervisor','supervisor',NULL);

INSERT OR IGNORE INTO leader_assignments(leader_id,teacher_id,relationship) VALUES
('lead-alex','teacher-jordan','department_lead'),
('coach-sam','teacher-jordan','instructional_coach'),
('supervisor-admin','teacher-jordan','supervisor'),
('supervisor-admin','teacher-taylor','supervisor'),
('supervisor-admin','teacher-morgan','supervisor'),
('supervisor-admin','teacher-casey','supervisor'),
('supervisor-admin','teacher-avery','supervisor');

INSERT OR IGNORE INTO weekly_priorities(priority_key,week_number,due_date,title,description,item_type,sort_order) VALUES
('gradebook-catch-up',9,'2026-10-01','Gradebook Catch Up','Finish grading work submitted over Fall Break.','teacher_task',1),
('synergy-sync-check',9,'2026-10-01','Synergy Sync Check','Verify CTLS and Synergy gradebooks match.','teacher_task',2),
('mid-term-cut-off-for-assignments',9,'2026-10-02','Mid-Term Cut Off for Assignments','Last day students may submit work from prior units.','term_date',3);

INSERT OR IGNORE INTO coaching_cycles(cycle_key,teacher_id,coach_id,title,focus_reason,action_step,ipr_domains,status,action_status,next_checkin)
VALUES('proactive-student-outreach','teacher-jordan','coach-sam','Proactive Student Outreach','Several students stopped submitting work consistently.','Send individualized messages and use a second communication method if needed.','Proactive Intervention & Student Support|Rapport & Relationships','active','not_started','2026-10-16');
