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

CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_key TEXT UNIQUE NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('first_day','holiday','student_holiday','digital_learning','early_release','information')),
  description TEXT,
  source TEXT NOT NULL DEFAULT 'CCSD Calendar'
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
('w0-welcome-announcement',0,'2026-07-31','Create Welcome Announcement','Prepare the welcome announcement before students begin the term.','teacher_task',1),
('w0-instructor-profile',0,'2026-07-31','Update Instructor Profile','Update the instructor profile for the new term.','teacher_task',2),
('w0-teacher-information-page',0,'2026-07-31','Update Teacher Information Page','Update the Teacher Information Page for the new term.','teacher_task',3),
('w0-course-quest',0,'2026-07-31','Complete Course Quest','Complete Course Quest and receive 100%.','teacher_task',4),
('w1-welcome-calls',1,'2026-08-03','Welcome Calls','Begin making welcome calls and record details in gradebook feedback.','teacher_task',1),
('w1-grading-begins',1,'2026-08-03','Grading Begins','Begin grading student work and mark past-due items missing. Do not sync into Synergy yet.','teacher_task',2),
('w1-fall-kickoff',1,'2026-08-03','Fall Term Kick Off','Attend one department meeting session.','teacher_task',3),
('w2-welcome-calls',2,'2026-08-10','Welcome Calls','Continue efforts; mark incomplete welcome calls missing and record failed attempts in gradebook feedback.','teacher_task',1),
('w2-synergy-setup',2,'2026-08-10','Synergy Set Up','Set up Synergy categories such as CVA Assignments. Do not sync yet.','teacher_task',2),
('w2-kickoff-ends',2,'2026-08-14','Fall Term Kick Off Ends','Attend one department meeting session.','teacher_task',3),
('w3-welcome-calls',3,'2026-08-17','Welcome Calls','Continue efforts; mark incomplete welcome calls as 0 and record failed attempts in gradebook feedback.','teacher_task',1),
('w3-sync-begins',3,'2026-08-17','Begin CTLS to Synergy Sync','Begin syncing CTLS assignments with Synergy.','teacher_task',2),
('w3-nonstarter-parent-contact',3,'2026-08-17','Nonstarters: Parent Contact','Begin two-way communication with parents of non-starters and document outreach and responses in Views & Tools.','teacher_task',3),
('w3-nonstarter-unreached-list',3,'2026-08-21','Nonstarters: Unreached Parent List','Email CVA Teacher Support a list of non-starter students for whom a two-way parent/guardian conversation could not be established.','teacher_task',4),
('w4-failing-parent-contact',4,'2026-08-30','Failing Students: Parent Contact','Have a two-way conversation with parents of failing students and record communication in Views & Tools.','teacher_task',1),
('w4-synergy-sync',4,'2026-08-27','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2),
('w5-synergy-sync',5,'2026-09-03','Synergy Sync','Verify that CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',1),
('w6-failing-parent-contact',6,'2026-09-13','Failing Students: Parent Contact','Have a two-way conversation with parents of failing students and record communication in Views & Tools.','teacher_task',1),
('w6-parent-contact-details',6,'2026-09-10','Parent Contact Documentation','Enter details of communication efforts with parents of failing students in Views & Tools, including responses as available.','teacher_task',2),
('w7-missing-assignments',7,'2026-09-14','Missing Assignments','Encourage students with missing assignments to complete them by the Oct. 2 mid-term cutoff for previous units.','teacher_task',1),
('gradebook-catch-up',9,'2026-10-01','Gradebook Catch Up','Finish grading all work submitted over Fall Break.','teacher_task',1),
('synergy-sync-check',9,'2026-10-01','Synergy Sync Check','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2),
('mid-term-cut-off-for-assignments',9,'2026-10-02','Mid-Term Cut Off for Assignments','Last day students may submit work from prior units; see the class schedule.','term_date',3),
('w10-student-connections',10,'2026-10-05','Student Connections','Continue connecting with students and building relationships.','teacher_task',1),
('w10-synergy-sync',10,'2026-10-06','Synergy Sync','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2),
('w11-student-connections',11,'2026-10-12','Student Connections','Continue encouraging and connecting with students.','teacher_task',1),
('w11-synergy-sync',11,'2026-10-14','Synergy Sync','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2),
('w12-parent-contact',12,'2026-10-22','Failing Students: Parent Contact','Enter details of communication efforts with parents of failing students in Views & Tools, including responses as available.','teacher_task',1),
('w12-synergy-sync',12,'2026-10-22','Synergy Sync','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',2),
('w13-synergy-sync',13,'2026-10-26','Synergy Sync','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',1),
('w14-senior-push',14,'2026-11-06','Senior Push','Push seniors across the finish line with extra support or encouragement.','teacher_task',1),
('w15-senior-push',15,'2026-11-13','Senior Push','Continue supporting seniors and document conversations with families in Views & Tools.','teacher_task',1),
('w16-senior-push',16,'2026-11-20','Senior Push','Continue supporting seniors and document conversations with families in Views & Tools.','teacher_task',1),
('w18-coursework-cutoff',18,'2026-12-03','Last Day to Submit Coursework','Coursework submission closes at 11:59 p.m.','term_date',1),
('w18-complete-grading',18,'2026-12-04','Complete Grading','Grade all submitted work.','teacher_task',2),
('w18-synergy-sync',18,'2026-12-04','Synergy Sync','Verify CTLS and Synergy gradebooks match and report concerns to CVA Teacher Support.','teacher_task',3),
('w18-final-exams',18,'2026-12-06','Final Exams','Begin monitoring final exam submissions.','teacher_task',4),
('w18-final-communications',18,'2026-12-07','Final Exam Communications','Reach out to students who have not completed the final exam.','teacher_task',5),
('w18-incomplete-finals-parent-contact',18,'2026-12-08','Incomplete Finals: Parent Contact','Call parent/guardians of students who have not completed final exams by 5:00 p.m.','teacher_task',6),
('w18-follow-up',18,'2026-12-09','Final Exam Follow-Up','Email CVA Teacher Support with names of students who did not complete the final exam.','teacher_task',7),
('w18-finalize-grades',18,'2026-12-10','Finalize Grades (Non-EOC)','Close course extension units at 8:00 p.m.; non-EOC grades are due by 11:59 p.m.','teacher_task',8),
('w18-final-grades-posted',18,'2026-12-11','Final Grades Posted','Notify students and families of final grade posting.','teacher_task',9);

INSERT OR IGNORE INTO calendar_events(event_key,start_date,end_date,title,event_type,description,source) VALUES
('ccsd-first-day-2026','2026-08-03',NULL,'First Day of School','first_day','CCSD first day of school.','CCSD 2026-2027 School Year Calendar'),
('ccsd-labor-day-2026','2026-09-07',NULL,'Labor Day','holiday','School closed.','CCSD 2026-2027 School Year Calendar'),
('ccsd-fall-break-2026','2026-09-21','2026-09-25','Fall Break','holiday','School closed; CVA Learning Centers are closed.','CCSD calendar + CVA Teacher Schedule'),
('ccsd-digital-learning-2026-10-12','2026-10-12',NULL,'Digital Learning Day','digital_learning','District Digital Learning Day.','CCSD 2026-2027 School Year Calendar'),
('ccsd-election-day-2026','2026-11-03',NULL,'Election Day / Student Holiday-Staff Day','student_holiday','Student holiday/staff day.','CCSD 2026-2027 School Year Calendar'),
('ccsd-thanksgiving-2026','2026-11-23','2026-11-27','Thanksgiving Break','holiday','School closed; CVA Learning Centers are closed.','CCSD calendar + CVA Teacher Schedule'),
('ccsd-digital-learning-2026-12-01','2026-12-01',NULL,'Digital Learning Day','digital_learning','District Digital Learning Day.','CCSD 2026-2027 School Year Calendar');

INSERT OR IGNORE INTO coaching_cycles(cycle_key,teacher_id,coach_id,title,focus_reason,action_step,ipr_domains,status,action_status,next_checkin)
VALUES('proactive-student-outreach','teacher-jordan','coach-sam','Proactive Student Outreach','Several students stopped submitting work consistently.','Send individualized messages and use a second communication method if needed.','Proactive Intervention & Student Support|Rapport & Relationships','active','not_started','2026-10-16');
