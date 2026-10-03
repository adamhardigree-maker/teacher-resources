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

  function teacherPage() {
    const priorityKeys = ['gradebook-catch-up', 'synergy-sync-check'];
    document.querySelectorAll('.priority-check input').forEach((checkbox, index) => {
      if (!priorityKeys[index]) return;
      checkbox.dataset.priorityKey = priorityKeys[index];
      checkbox.addEventListener('change', async () => {
        const desired = checkbox.checked;
        try {
          await post({
            action: 'priority_status', teacher_id: TEACHER_ID,
            priority_key: checkbox.dataset.priorityKey,
            status: desired ? 'complete' : 'not_started'
          });
          flash(desired ? 'Priority marked complete' : 'Priority reopened');
        } catch (error) {
          checkbox.checked = !desired;
          alert('Could not save priority: ' + error.message);
        }
      });
    });

    const evidenceSave = document.getElementById('saveEvidenceBtn');
    if (evidenceSave) evidenceSave.addEventListener('click', async () => {
      const title = document.getElementById('newEvidenceTitle')?.value.trim();
      const description = document.getElementById('newEvidenceDesc')?.value.trim();
      const ipr_domain = document.getElementById('newEvidenceDomain')?.value;
      const reflection = document.getElementById('newEvidenceReflection')?.value.trim();
      const occurred_on = document.getElementById('newEvidenceDate')?.value;
      if (!title || !description) return;
      try {
        await post({ action:'evidence_add', teacher_id:TEACHER_ID, title, description, reflection, ipr_domain, occurred_on });
        flash('Evidence saved');
      } catch (error) {
        alert('The evidence appeared on screen, but could not be saved to the database: ' + error.message);
      }
    });

    const reflectionSave = document.getElementById('saveCoachingReflection');
    if (reflectionSave) reflectionSave.addEventListener('click', async () => {
      const body = document.getElementById('coachingReflection')?.value.trim();
      if (!body) return;
      try {
        await post({ action:'coaching_reflection', teacher_id:TEACHER_ID, cycle_key:'proactive-student-outreach', body });
        flash('Coaching reflection saved');
      } catch (error) {
        alert('The reflection appeared on screen, but could not be saved to the database: ' + error.message);
      }
    });

    const supportSection = document.getElementById('support');
    if (supportSection) {
      const selects = supportSection.querySelectorAll('select');
      const textarea = supportSection.querySelector('textarea');
      const button = [...supportSection.querySelectorAll('button')].find(b => /submit request/i.test(b.textContent));
      if (button && selects.length >= 2 && textarea) {
        button.addEventListener('click', async () => {
          const description = textarea.value.trim();
          if (!description) return alert('Tell us what kind of support would help.');
          try {
            await post({
              action:'support_request', teacher_id:TEACHER_ID,
              area:selects[0].value,
              priority:/time-sensitive/i.test(selects[1].value) ? 'high' : 'normal',
              description
            });
            textarea.value = '';
            flash('Support request submitted');
          } catch (error) {
            alert('Could not submit the support request: ' + error.message);
          }
        });
      }
    }

    api('/api/data?teacher_id=' + encodeURIComponent(TEACHER_ID)).then(data => {
      const status = Object.fromEntries((data.priority_status || []).map(x => [x.priority_key, x.status]));
      document.querySelectorAll('.priority-check input[data-priority-key]').forEach(cb => {
        cb.checked = status[cb.dataset.priorityKey] === 'complete';
      });

      const latest = (data.coaching_reflections || [])[0];
      const saved = document.getElementById('reflectionSaved');
      const savedText = document.getElementById('reflectionSavedText');
      if (latest && saved && savedText) {
        savedText.textContent = latest.body;
        saved.classList.add('show');
      }

      const evidenceList = document.getElementById('evidenceList');
      if (evidenceList) {
        const labels = {
          professionalism:'Professionalism', communication:'Communication', rapport:'Rapport',
          grading:'Grading & Feedback', intervention:'Intervention'
        };
        (data.evidence || []).filter(e => e.source_type === 'manual').forEach(e => {
          if ([...evidenceList.querySelectorAll('.evidence-entry-title')].some(n => n.textContent === e.title)) return;
          const entry = document.createElement('article');
          entry.className = 'evidence-entry';
          entry.dataset.domains = e.ipr_domain || '';
          entry.innerHTML = `<div class="evidence-entry-head"><div><div class="evidence-entry-title">${esc(e.title)}</div><div class="evidence-date">${esc(e.occurred_on || '')}</div></div><button class="pill-btn evidence-toggle">View Details</button></div><div class="evidence-badges"><span class="evidence-badge">Teacher Added</span><span class="evidence-badge domain">${esc(labels[e.ipr_domain] || e.ipr_domain || 'Evidence')}</span></div><div class="evidence-summary">${esc(e.description)}</div><div class="evidence-detail"><div class="evidence-detail-grid"><div class="evidence-subcard"><h4>Evidence</h4><p>${esc(e.description)}</p></div><div class="evidence-subcard"><h4>Reflection</h4><p>${esc(e.reflection || 'No reflection added.')}</p></div></div></div>`;
          evidenceList.prepend(entry);
          const toggle = entry.querySelector('.evidence-toggle');
          toggle?.addEventListener('click', () => {
            const detail = entry.querySelector('.evidence-detail');
            detail.classList.toggle('open');
            toggle.textContent = detail.classList.contains('open') ? 'Hide Details' : 'View Details';
          });
        });
      }
    }).catch(error => {
      console.error(error);
      flash('Live data could not be loaded');
    });
  }

  function leadershipPage() {
    api('/api/leadership').then(data => {
      const kpis = document.querySelectorAll('#overview .kpi');
      if (kpis.length >= 4) {
        kpis[0].textContent = data.counts.teachers;
        kpis[1].textContent = data.counts.open_actions;
        kpis[2].textContent = data.counts.active_coaching;
        kpis[3].textContent = data.counts.teacher_replies;
      }

      const table = document.querySelector('#overview .teacher-table tbody, #overview .data-table tbody');
      if (table) {
        table.innerHTML = '';
        for (const teacher of data.teachers || []) {
          const row = document.createElement('tr');
          const attention = Number(teacher.open_support) > 0 ? 'Support request' : Number(teacher.open_actions) > 0 ? 'Open actions' : 'No signal';
          row.innerHTML = `<td><div class="teacher-name">${esc(teacher.display_name)}</div><div class="mini">${esc(teacher.department || '')}</div></td><td>${teacher.completed_priorities} / ${teacher.total_priorities}</td><td>${teacher.unread_feedback} unread</td><td>${Number(teacher.active_coaching) ? 'Active cycle' : '—'}</td><td>${teacher.evidence_count}</td><td><span class="signal ${Number(teacher.open_support)>0?'red':''}">${attention}</span></td>`;
          table.appendChild(row);
        }
      }
    }).catch(error => console.error('Leadership data:', error));
  }

  if (/leadership\.html$/i.test(location.pathname)) leadershipPage();
  else teacherPage();
})();
