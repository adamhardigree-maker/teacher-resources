(() => {
  const TEACHER_ID = 'teacher-jordan';

  async function api(path, options = {}) {
    const response = await fetch(path, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Request failed');
    return data;
  }

  function post(payload) {
    return api('/api/action', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  function flash(message) {
    const node = document.createElement('div');
    node.textContent = message;
    Object.assign(node.style, {
      position: 'fixed', right: '20px', bottom: '20px', zIndex: '9999',
      background: '#1F2933', color: '#fff', padding: '11px 14px',
      borderRadius: '10px', fontSize: '12px', fontWeight: '700',
      boxShadow: '0 4px 14px rgba(0,0,0,.18)'
    });
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2200);
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function showView(viewId) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === viewId));
  }

  function openUrl(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function wireTeachingWeekInteractions() {
    // Tabs
    document.querySelectorAll('#week .tab-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('#week .tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('#week .week-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
      };
    });

    // Expand priority details
    document.querySelectorAll('#week .priority-toggle').forEach(btn => {
      btn.onclick = () => {
        const target = document.getElementById(btn.dataset.priority);
        if (!target) return;
        target.classList.toggle('open');
        btn.textContent = target.classList.contains('open') ? '⌃' : '⌄';
      };
    });

    // Feedback/comment toggles
    document.querySelectorAll('#week .feedback-toggle').forEach(btn => {
      btn.onclick = () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        target.classList.toggle('open');
        if (/review/i.test(btn.textContent)) btn.textContent = target.classList.contains('open') ? 'Hide' : 'Review';
      };
    });

    // Previous / next week buttons use the already designed tabs as prototype navigation.
    const weekNav = document.querySelectorAll('#week .week-switcher .icon-btn');
    if (weekNav[0]) weekNav[0].onclick = () => document.querySelector('#week .tab-btn[data-tab="completed"]')?.click();
    if (weekNav[1]) weekNav[1].onclick = () => document.querySelector('#week .tab-btn[data-tab="upcoming"]')?.click();

    // Resource/action buttons in the three priority cards.
    const week = document.getElementById('week');
    if (!week) return;
    [...week.querySelectorAll('button')].forEach(btn => {
      const text = btn.textContent.trim();
      if (text === 'View Grading Guidance') btn.onclick = () => openUrl('https://teacherresources.cobbvirtualacademy.org/grading-and-feedback/grading-basics.html');
      if (text === 'Gradebook Help') btn.onclick = () => openUrl('https://teacherresources.cobbvirtualacademy.org/grading-and-feedback/');
      if (text === 'Open Checklist') btn.onclick = () => {
        const p2 = document.getElementById('p2');
        p2?.classList.add('open');
        flash('Checklist opened');
      };
      if (text === 'View Class Schedule') btn.onclick = () => flash('Class Schedule link will open the teacher-specific CVA schedule once that source is connected.');
      if (text === 'Student Reminder Guidance') btn.onclick = () => openUrl('https://teacherresources.cobbvirtualacademy.org/communication-and-responsiveness/');
      if (text === 'Mark Addressed') btn.onclick = async () => {
        try {
          await post({ action:'comment_add', teacher_id:TEACHER_ID, author_id:TEACHER_ID, target_type:'carried_forward', target_key:'fall-break-reengagement', comment_type:'teacher_update', body:'Carried-forward outreach item marked addressed.' });
          btn.textContent = '✓ Addressed';
          btn.disabled = true;
          flash('Carried-forward item marked addressed');
        } catch (e) { alert('Could not save this update: ' + e.message); }
      };
      if (text === 'View Guidance') {
        const routineTitle = btn.closest('.routine')?.querySelector('.routine-title')?.textContent || '';
        let url = 'https://teacherresources.cobbvirtualacademy.org/';
        if (/grade/i.test(routineTitle)) url = 'https://teacherresources.cobbvirtualacademy.org/grading-and-feedback/';
        else if (/communicate|respond/i.test(routineTitle)) url = 'https://teacherresources.cobbvirtualacademy.org/communication-and-responsiveness/';
        else if (/progress|concern/i.test(routineTitle)) url = 'https://teacherresources.cobbvirtualacademy.org/proactive-intervention-and-student-support/';
        btn.onclick = () => openUrl(url);
      }
      if (text === 'Need Support?') btn.onclick = () => showView('support');
      if (text === 'Add Reflection') btn.onclick = () => showView('coaching');
      if (text === 'Reply') btn.onclick = () => {
        const original = btn.closest('.comment')?.querySelector('.comment-text, p')?.textContent || '';
        const reply = prompt('Reply to this feedback:', '');
        if (!reply?.trim()) return;
        post({ action:'comment_add', teacher_id:TEACHER_ID, author_id:TEACHER_ID, target_type:'feedback_reply', target_key:'week-9', comment_type:'teacher_reply', body:reply.trim() })
          .then(() => flash('Reply saved'))
          .catch(e => alert('Could not save reply: ' + e.message));
      };
      if (/Acknowledge/.test(text)) btn.onclick = () => {
        btn.textContent = '✓ Reviewed';
        btn.disabled = true;
        flash('Feedback marked reviewed');
      };
    });
  }

  function teacherPage() {
    wireTeachingWeekInteractions();

    const priorityKeys = ['gradebook-catch-up', 'synergy-sync-check'];
    document.querySelectorAll('.priority-check input').forEach((checkbox, index) => {
      if (!priorityKeys[index]) return;
      checkbox.dataset.priorityKey = priorityKeys[index];
      checkbox.onchange = async () => {
        const desired = checkbox.checked;
        try {
          await post({ action:'priority_status', teacher_id:TEACHER_ID, priority_key:checkbox.dataset.priorityKey, status:desired?'complete':'not_started' });
          flash(desired ? 'Priority marked complete' : 'Priority reopened');
        } catch (error) {
          checkbox.checked = !desired;
          alert('Could not save priority: ' + error.message);
        }
      };
    });

    document.querySelectorAll('.status-choice').forEach(btn => {
      btn.onclick = async () => {
        const map = { 'Not started':'not_started', 'Tried it':'tried', 'Need help':'need_help' };
        const status = map[btn.dataset.coachingStatus] || map[btn.textContent.trim()] || 'not_started';
        try {
          await post({ action:'coaching_status', teacher_id:TEACHER_ID, cycle_key:'proactive-student-outreach', status });
          document.querySelectorAll('.status-choice').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          flash('Coaching status saved');
        } catch (e) { alert('Could not save coaching status: ' + e.message); }
      };
    });

    const closeCycle = document.getElementById('closeCycleBtn');
    if (closeCycle) closeCycle.onclick = async () => {
      if (!confirm('Close this coaching cycle? The cycle will remain in your history and evidence.')) return;
      try {
        await post({ action:'coaching_close', teacher_id:TEACHER_ID, cycle_key:'proactive-student-outreach', author_id:TEACHER_ID });
        flash('Coaching cycle closed');
      } catch (e) { alert('Could not close coaching cycle: ' + e.message); }
    };

    const evidenceSave = document.getElementById('saveEvidenceBtn');
    if (evidenceSave) evidenceSave.addEventListener('click', async () => {
      const title = document.getElementById('newEvidenceTitle')?.value.trim();
      const description = document.getElementById('newEvidenceDesc')?.value.trim();
      const ipr_domain = document.getElementById('newEvidenceDomain')?.value;
      const reflection = document.getElementById('newEvidenceReflection')?.value.trim();
      const occurred_on = document.getElementById('newEvidenceDate')?.value;
      if (!title || !description) return;
      try { await post({ action:'evidence_add', teacher_id:TEACHER_ID, title, description, reflection, ipr_domain, occurred_on }); flash('Evidence saved'); }
      catch (error) { alert('The evidence appeared on screen, but could not be saved to the database: ' + error.message); }
    });

    const reflectionSave = document.getElementById('saveCoachingReflection');
    if (reflectionSave) reflectionSave.addEventListener('click', async () => {
      const body = document.getElementById('coachingReflection')?.value.trim();
      if (!body) return;
      try { await post({ action:'coaching_reflection', teacher_id:TEACHER_ID, cycle_key:'proactive-student-outreach', body }); flash('Coaching reflection saved'); }
      catch (error) { alert('The reflection appeared on screen, but could not be saved to the database: ' + error.message); }
    });

    const supportSection = document.getElementById('support');
    if (supportSection) {
      const selects = supportSection.querySelectorAll('select');
      const textarea = supportSection.querySelector('textarea');
      const button = [...supportSection.querySelectorAll('button')].find(b => /submit request/i.test(b.textContent));
      if (button && selects.length >= 2 && textarea) button.onclick = async () => {
        const description = textarea.value.trim();
        if (!description) return alert('Tell us what kind of support would help.');
        try {
          await post({ action:'support_request', teacher_id:TEACHER_ID, area:selects[0].value, priority:/time-sensitive|urgent|high/i.test(selects[1].value)?'high':'normal', description });
          textarea.value = '';
          flash('Support request submitted');
        } catch (error) { alert('Could not submit the support request: ' + error.message); }
      };
    }

    api('/api/data?teacher_id=' + encodeURIComponent(TEACHER_ID)).then(data => {
      const status = Object.fromEntries((data.priority_status || []).map(x => [x.priority_key, x.status]));
      document.querySelectorAll('.priority-check input[data-priority-key]').forEach(cb => { cb.checked = status[cb.dataset.priorityKey] === 'complete'; });

      const cycle = (data.coaching_cycles || []).find(c => c.cycle_key === 'proactive-student-outreach');
      if (cycle) {
        const labels = { not_started:'Not started', tried:'Tried it', need_help:'Need help' };
        document.querySelectorAll('.status-choice').forEach(b => b.classList.toggle('active', (b.dataset.coachingStatus || b.textContent.trim()) === labels[cycle.action_status]));
      }

      const latest = (data.coaching_reflections || [])[0];
      const saved = document.getElementById('reflectionSaved');
      const savedText = document.getElementById('reflectionSavedText');
      if (latest && saved && savedText) { savedText.textContent = latest.body; saved.classList.add('show'); }

      const evidenceList = document.getElementById('evidenceList');
      if (evidenceList) {
        const labels = { professionalism:'Professionalism', communication:'Communication', rapport:'Rapport', grading:'Grading & Feedback', intervention:'Intervention' };
        (data.evidence || []).filter(e => e.source_type === 'manual').forEach(e => {
          if ([...evidenceList.querySelectorAll('.evidence-entry-title')].some(n => n.textContent === e.title)) return;
          const entry = document.createElement('article');
          entry.className = 'evidence-entry'; entry.dataset.domains = e.ipr_domain || '';
          entry.innerHTML = `<div class="evidence-entry-head"><div><div class="evidence-entry-title">${esc(e.title)}</div><div class="evidence-date">${esc(e.occurred_on || '')}</div></div><button class="pill-btn evidence-toggle">View Details</button></div><div class="evidence-badges"><span class="evidence-badge">Teacher Added</span><span class="evidence-badge domain">${esc(labels[e.ipr_domain] || e.ipr_domain || 'Evidence')}</span></div><div class="evidence-summary">${esc(e.description)}</div><div class="evidence-detail"><div class="evidence-detail-grid"><div class="evidence-subcard"><h4>Evidence</h4><p>${esc(e.description)}</p></div><div class="evidence-subcard"><h4>Reflection</h4><p>${esc(e.reflection || 'No reflection added.')}</p></div></div></div>`;
          evidenceList.prepend(entry);
          const toggle = entry.querySelector('.evidence-toggle');
          toggle?.addEventListener('click', () => { const detail = entry.querySelector('.evidence-detail'); detail.classList.toggle('open'); toggle.textContent = detail.classList.contains('open')?'Hide Details':'View Details'; });
        });
      }
    }).catch(error => { console.error(error); flash('Live data could not be loaded'); });
  }

  function leadershipPage() {
    api('/api/leadership').then(data => {
      const kpis = document.querySelectorAll('#overview .kpi');
      if (kpis.length >= 4) { kpis[0].textContent=data.counts.teachers; kpis[1].textContent=data.counts.open_actions; kpis[2].textContent=data.counts.active_coaching; kpis[3].textContent=data.counts.teacher_replies; }
      const table = document.querySelector('#overview .teacher-table tbody, #overview .data-table tbody');
      if (table) {
        table.innerHTML='';
        for (const teacher of data.teachers || []) {
          const row=document.createElement('tr');
          const attention=Number(teacher.open_support)>0?'Support request':Number(teacher.open_actions)>0?'Open actions':'No signal';
          row.innerHTML=`<td><button class="text-link teacher-open" data-id="${esc(teacher.id)}">${esc(teacher.display_name)}</button><div class="mini">${esc(teacher.department||'')}</div></td><td>${teacher.completed_priorities} / ${teacher.total_priorities}</td><td>${teacher.unread_feedback} unread</td><td>${Number(teacher.active_coaching)?'Active cycle':'—'}</td><td>${teacher.evidence_count}</td><td><span class="signal ${Number(teacher.open_support)>0?'red':''}">${attention}</span></td>`;
          table.appendChild(row);
        }
      }
    }).catch(error => console.error('Leadership data:', error));
  }

  if (/leadership\.html$/i.test(location.pathname)) leadershipPage();
  else teacherPage();
})();
