(() => {
  const TEACHER_ID = 'teacher-jordan';
  const COACH_ID = 'coach-sam';
  const LEAD_ID = 'lead-alex';

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
      position:'fixed',right:'20px',bottom:'20px',zIndex:'9999',background:'#1F2933',color:'#fff',
      padding:'11px 14px',borderRadius:'10px',fontSize:'12px',fontWeight:'700',boxShadow:'0 4px 14px rgba(0,0,0,.18)'
    });
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2200);
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function labelForStatus(value) {
    return ({not_started:'Not Started',tried:'Tried It',need_help:'Need Help'}[value] || value || 'Not Started');
  }

  function addAttachmentControls(container, ownerType='evidence', ownerKey='general', teacherId=TEACHER_ID, uploadedBy=TEACHER_ID) {
    if (!container || container.querySelector('.api-attachment-box')) return;
    const box = document.createElement('div');
    box.className = 'api-attachment-box';
    box.style.marginTop = '12px';
    box.innerHTML = `<div class="mini" style="font-weight:800;margin-bottom:7px">ATTACHMENT</div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><input class="api-file" type="file" style="max-width:100%"><button class="secondary-btn api-upload" type="button">Upload File</button></div><div class="mini api-upload-status" style="margin-top:6px">Files are stored privately in CVA Teacher Support.</div>`;
    container.appendChild(box);
    box.querySelector('.api-upload').addEventListener('click', async () => {
      const file = box.querySelector('.api-file').files[0];
      if (!file) return alert('Choose a file first.');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('teacher_id', teacherId);
      fd.append('owner_type', ownerType);
      fd.append('owner_key', ownerKey);
      fd.append('uploaded_by', uploadedBy);
      const status = box.querySelector('.api-upload-status');
      status.textContent = 'Uploading…';
      try {
        const r = await fetch('/api/upload', {method:'POST', body:fd});
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || d.error || 'Upload failed');
        status.textContent = `${file.name} uploaded.`;
        box.querySelector('.api-file').value = '';
        flash('Attachment uploaded');
      } catch (e) {
        status.textContent = 'Upload failed.';
        alert(e.message);
      }
    });
  }

  function renderAttachmentList(container, attachments) {
    if (!container || !attachments?.length) return;
    const block = document.createElement('div');
    block.style.marginTop = '12px';
    block.innerHTML = `<div class="mini" style="font-weight:800;margin-bottom:7px">ATTACHMENTS</div>` + attachments.map(a => `<div style="margin:6px 0"><a class="resource-link" href="/api/file?id=${encodeURIComponent(a.id)}">${esc(a.file_name)} <span>↓</span></a></div>`).join('');
    container.appendChild(block);
  }

  function teacherPage() {
    const priorityKeys = ['gradebook-catch-up','synergy-sync-check'];
    document.querySelectorAll('.priority-check input').forEach((checkbox,index) => {
      if (!priorityKeys[index]) return;
      checkbox.dataset.priorityKey = priorityKeys[index];
      checkbox.addEventListener('change', async () => {
        const desired = checkbox.checked;
        try {
          await post({action:'priority_status',teacher_id:TEACHER_ID,priority_key:checkbox.dataset.priorityKey,status:desired?'complete':'not_started'});
          flash(desired?'Priority marked complete':'Priority reopened');
        } catch (e) {
          checkbox.checked = !desired;
          alert('Could not save priority: ' + e.message);
        }
      });
    });

    document.querySelectorAll('.status-choice').forEach(btn => {
      btn.addEventListener('click', async () => {
        const map = {'Not started':'not_started','Tried it':'tried','Need help':'need_help'};
        const status = map[btn.dataset.coachingStatus || btn.textContent.trim()] || 'not_started';
        try {
          await post({action:'coaching_status',teacher_id:TEACHER_ID,cycle_key:'proactive-student-outreach',status});
          flash('Coaching status saved');
        } catch (e) { alert('Could not save coaching status: ' + e.message); }
      });
    });

    const closeCycle = document.getElementById('closeCycleBtn');
    if (closeCycle) {
      closeCycle.onclick = async () => {
        if (!confirm('Close this coaching cycle? The cycle will remain in the teacher’s history and evidence journal.')) return;
        try {
          await post({action:'coaching_close',teacher_id:TEACHER_ID,cycle_key:'proactive-student-outreach',author_id:COACH_ID});
          flash('Coaching cycle closed');
          closeCycle.disabled = true;
          closeCycle.textContent = 'Cycle Closed';
        } catch (e) { alert('Could not close the cycle: ' + e.message); }
      };
    }

    const evidenceSave = document.getElementById('saveEvidenceBtn');
    if (evidenceSave) evidenceSave.addEventListener('click', async () => {
      const title=document.getElementById('newEvidenceTitle')?.value.trim();
      const description=document.getElementById('newEvidenceDesc')?.value.trim();
      const ipr_domain=document.getElementById('newEvidenceDomain')?.value;
      const reflection=document.getElementById('newEvidenceReflection')?.value.trim();
      const occurred_on=document.getElementById('newEvidenceDate')?.value;
      if (!title || !description) return;
      try {
        await post({action:'evidence_add',teacher_id:TEACHER_ID,title,description,reflection,ipr_domain,occurred_on});
        flash('Evidence saved');
      } catch (e) { alert('The evidence appeared on screen, but could not be saved: ' + e.message); }
    });

    const evidenceForm = document.getElementById('addEvidenceForm');
    if (evidenceForm) addAttachmentControls(evidenceForm,'evidence','teacher-added',TEACHER_ID,TEACHER_ID);

    const reflectionSave = document.getElementById('saveCoachingReflection');
    if (reflectionSave) reflectionSave.addEventListener('click', async () => {
      const body=document.getElementById('coachingReflection')?.value.trim();
      if (!body) return;
      try {
        await post({action:'coaching_reflection',teacher_id:TEACHER_ID,cycle_key:'proactive-student-outreach',body});
        flash('Coaching reflection saved');
      } catch (e) { alert('The reflection appeared on screen, but could not be saved: ' + e.message); }
    });

    const coachingReflectionSection = document.getElementById('coachingReflection')?.closest('.coaching-section');
    if (coachingReflectionSection) addAttachmentControls(coachingReflectionSection,'coaching','proactive-student-outreach',TEACHER_ID,TEACHER_ID);

    const supportSection=document.getElementById('support');
    if (supportSection) {
      const selects=supportSection.querySelectorAll('select');
      const textarea=supportSection.querySelector('textarea');
      const button=[...supportSection.querySelectorAll('button')].find(b=>/submit request/i.test(b.textContent));
      if (button && selects.length>=2 && textarea) button.addEventListener('click', async () => {
        const description=textarea.value.trim();
        if (!description) return alert('Tell us what kind of support would help.');
        try {
          await post({action:'support_request',teacher_id:TEACHER_ID,area:selects[0].value,priority:/time-sensitive/i.test(selects[1].value)?'high':'normal',description});
          textarea.value=''; flash('Support request submitted');
          loadTeacherData();
        } catch (e) { alert('Could not submit the support request: ' + e.message); }
      });
    }

    async function loadTeacherData() {
      try {
        const data=await api('/api/data?teacher_id='+encodeURIComponent(TEACHER_ID));
        const status=Object.fromEntries((data.priority_status||[]).map(x=>[x.priority_key,x.status]));
        document.querySelectorAll('.priority-check input[data-priority-key]').forEach(cb=>cb.checked=status[cb.dataset.priorityKey]==='complete');

        const cycle=(data.coaching_cycles||[]).find(c=>c.cycle_key==='proactive-student-outreach');
        if (cycle) {
          document.querySelectorAll('.status-choice').forEach(btn => {
            const map={'Not started':'not_started','Tried it':'tried','Need help':'need_help'};
            const s=map[btn.dataset.coachingStatus||btn.textContent.trim()]||'not_started';
            btn.classList.toggle('active',s===cycle.action_status);
          });
          if (cycle.status==='closed' && closeCycle) { closeCycle.disabled=true; closeCycle.textContent='Cycle Closed'; }
        }

        const latest=(data.coaching_reflections||[])[0];
        const saved=document.getElementById('reflectionSaved');
        const savedText=document.getElementById('reflectionSavedText');
        if (latest&&saved&&savedText) { savedText.textContent=latest.body; saved.classList.add('show'); }

        const evidenceList=document.getElementById('evidenceList');
        if (evidenceList) {
          const labels={professionalism:'Professionalism',communication:'Communication',rapport:'Rapport',grading:'Grading & Feedback',intervention:'Intervention'};
          (data.evidence||[]).filter(e=>e.source_type==='manual').forEach(e=>{
            if ([...evidenceList.querySelectorAll('.evidence-entry-title')].some(n=>n.textContent===e.title)) return;
            const entry=document.createElement('article');
            entry.className='evidence-entry'; entry.dataset.domains=e.ipr_domain||'';
            entry.innerHTML=`<div class="evidence-entry-head"><div><div class="evidence-entry-title">${esc(e.title)}</div><div class="evidence-date">${esc(e.occurred_on||'')}</div></div><button class="pill-btn evidence-toggle">View Details</button></div><div class="evidence-badges"><span class="evidence-badge">Teacher Added</span><span class="evidence-badge domain">${esc(labels[e.ipr_domain]||e.ipr_domain||'Evidence')}</span></div><div class="evidence-summary">${esc(e.description)}</div><div class="evidence-detail"><div class="evidence-detail-grid"><div class="evidence-subcard"><h4>Evidence</h4><p>${esc(e.description)}</p></div><div class="evidence-subcard"><h4>Reflection</h4><p>${esc(e.reflection||'No reflection added.')}</p></div></div></div>`;
            evidenceList.prepend(entry);
            const toggle=entry.querySelector('.evidence-toggle');
            toggle?.addEventListener('click',()=>{const detail=entry.querySelector('.evidence-detail');detail.classList.toggle('open');toggle.textContent=detail.classList.contains('open')?'Hide Details':'View Details';});
          });
          renderAttachmentList(evidenceList,(data.attachments||[]).filter(a=>a.owner_type==='evidence'));
        }

        const supportHistory=supportSection?.querySelector('.routine');
        if (supportHistory && (data.support_requests||[]).length) {
          supportHistory.innerHTML=(data.support_requests||[]).slice(0,5).map(r=>`<div style="padding:8px 0;border-bottom:1px solid #eceef1"><div class="routine-title">${esc(r.area)}</div><div class="routine-desc">${esc(r.description)}</div><div class="mini" style="margin-top:5px">Status: ${esc(r.status)}</div></div>`).join('');
        }

        const teacherComments=(data.comments||[]).filter(c=>!c.acknowledged_at);
        if (teacherComments.length) {
          const week=document.getElementById('week');
          if (week && !week.querySelector('.api-feedback-card')) {
            const card=document.createElement('div'); card.className='card api-feedback-card'; card.style.marginTop='18px';
            card.innerHTML=`<div class="card-head"><div><div class="eyebrow">New Feedback</div><h2>Lead / Coach Feedback</h2></div><span class="badge red">${teacherComments.length} new</span></div>` + teacherComments.map(c=>`<div class="coach-comment" data-comment-id="${c.id}"><div class="coach-comment-meta"><span class="role">${esc(c.author_name||'CVA Support')}</span><span class="mini">${esc(c.created_at)}</span></div><div class="comment-text">${esc(c.body)}</div><div class="coaching-actions"><button class="secondary-btn api-ack">Mark Reviewed</button></div></div>`).join('');
            week.appendChild(card);
            card.querySelectorAll('.api-ack').forEach(btn=>btn.onclick=async()=>{const item=btn.closest('[data-comment-id]');await post({action:'comment_acknowledge',teacher_id:TEACHER_ID,comment_id:Number(item.dataset.commentId)});item.remove();flash('Feedback marked reviewed');});
          }
        }
      } catch(e) { console.error(e); flash('Live data could not be loaded'); }
    }
    loadTeacherData();
  }

  function leadershipPage() {
    let teachersByName={};
    let activeTeacherId='teacher-jordan';

    async function openTeacher(id,name) {
      activeTeacherId=id;
      const drawer=document.getElementById('teacherDrawer');
      const title=document.getElementById('teacherDrawerName');
      if (title) title.textContent=name;
      drawer?.classList.add('open');
      try {
        const d=await api('/api/data?teacher_id='+encodeURIComponent(id));
        const weekPanel=document.getElementById('teachertab-week');
        const practicePanel=document.getElementById('teachertab-practice');
        const coachingPanel=document.getElementById('teachertab-coaching');
        const evidencePanel=document.getElementById('teachertab-evidence');
        if (weekPanel) {
          const statuses=Object.fromEntries((d.priority_status||[]).map(s=>[s.priority_key,s.status]));
          weekPanel.innerHTML=`<div class="teacher-detail-grid"><div class="teacher-detail-card"><h4>Current CVA Priorities</h4>${(d.priorities||[]).map(p=>`<div class="priority-mini"><strong>${esc(p.title)}</strong><div class="mini">${p.item_type==='teacher_task'?(statuses[p.priority_key]==='complete'?'Complete':'Open'):'Term date'}${p.due_date?' • '+esc(p.due_date):''}</div></div>`).join('')}</div><div class="teacher-detail-card"><h4>Feedback for Teacher</h4><div id="apiCommentList">${(d.comments||[]).slice(0,5).map(c=>`<div class="coach-comment"><div class="coach-comment-meta"><span class="role">${esc(c.author_name||'CVA Support')}</span><span class="mini">${esc(c.created_at)}</span></div><p>${esc(c.body)}</p></div>`).join('')||'<div class="mini">No feedback yet.</div>'}</div><textarea class="reply-box" id="apiWeeklyComment" placeholder="Add weekly feedback..."></textarea><div class="coaching-actions"><button class="primary-btn" id="apiPostWeekly">Post Feedback</button></div></div></div>`;
          weekPanel.querySelector('#apiPostWeekly')?.addEventListener('click',async()=>{const body=weekPanel.querySelector('#apiWeeklyComment').value.trim();if(!body)return;await post({action:'comment_add',teacher_id:id,author_id:LEAD_ID,target_type:'week',target_key:'week-9',comment_type:'weekly_feedback',body});flash('Feedback posted');openTeacher(id,name);});
        }
        if (practicePanel) {
          const domains={professionalism:0,communication:0,rapport:0,grading:0,intervention:0};
          (d.evidence||[]).forEach(e=>{if(domains[e.ipr_domain]!==undefined)domains[e.ipr_domain]++});
          practicePanel.innerHTML=Object.entries(domains).map(([k,v])=>`<div class="ipr-domain-row"><div class="ipr-domain-head"><div><div class="ipr-domain-title">${esc(({professionalism:'Professionalism & Collaboration',communication:'Communication & Responsiveness',rapport:'Rapport & Relationships',grading:'Grading & Feedback',intervention:'Proactive Intervention & Student Support'})[k])}</div><div class="ipr-domain-meta">${v} evidence item${v===1?'':'s'}</div></div></div></div>`).join('');
        }
        if (coachingPanel) {
          coachingPanel.innerHTML=(d.coaching_cycles||[]).map(c=>`<div class="coach-cycle"><div class="coach-cycle-head"><div><div class="coach-cycle-title">${esc(c.title)}</div><div class="coach-cycle-meta">${esc(c.status)} • ${c.next_checkin?'Next check-in '+esc(c.next_checkin):''}</div></div></div><div class="coach-cycle-body open"><div class="coach-section"><h4>Action Step</h4><p>${esc(c.action_step||'')}</p></div><div class="coach-section"><h4>Teacher Reflection</h4><p>${esc((d.coaching_reflections||[]).find(r=>r.cycle_key===c.cycle_key)?.body||'No reflection yet.')}</p></div><div class="coach-section"><h4>Coach Response</h4><textarea class="reply-box api-coach-reply" placeholder="Add coaching feedback..."></textarea><div class="coaching-actions"><button class="primary-btn api-post-coach" data-cycle="${esc(c.cycle_key)}">Post Feedback</button>${c.status==='active'?`<button class="secondary-btn api-close-cycle" data-cycle="${esc(c.cycle_key)}">Close Cycle</button>`:''}</div></div></div></div>`).join('')||'<div class="mini">No coaching cycles.</div>';
          coachingPanel.querySelectorAll('.api-post-coach').forEach(btn=>btn.onclick=async()=>{const body=btn.closest('.coach-section').querySelector('textarea').value.trim();if(!body)return;await post({action:'comment_add',teacher_id:id,author_id:COACH_ID,target_type:'coaching',target_key:btn.dataset.cycle,comment_type:'coach_feedback',body});flash('Coach feedback posted');openTeacher(id,name);});
          coachingPanel.querySelectorAll('.api-close-cycle').forEach(btn=>btn.onclick=async()=>{if(!confirm('Close this coaching cycle?'))return;await post({action:'coaching_close',teacher_id:id,cycle_key:btn.dataset.cycle,author_id:COACH_ID});flash('Cycle closed');openTeacher(id,name);});
          const firstCycle=(d.coaching_cycles||[])[0];
          if (firstCycle) addAttachmentControls(coachingPanel,'coaching',firstCycle.cycle_key,id,COACH_ID);
        }
        if (evidencePanel) {
          evidencePanel.innerHTML=`<div class="teacher-detail-card"><h4>Semester Evidence</h4>${(d.evidence||[]).map(e=>`<div class="priority-mini"><strong>${esc(e.title)}</strong><div class="mini">${esc(e.ipr_domain||'Evidence')} • ${esc(e.occurred_on||'')}</div></div>`).join('')||'<div class="mini">No evidence yet.</div>'}</div>`;
          renderAttachmentList(evidencePanel,d.attachments||[]);
        }
      } catch(e) { alert('Could not load teacher details: '+e.message); }
    }

    document.getElementById('closeTeacherDrawer')?.addEventListener('click',()=>document.getElementById('teacherDrawer')?.classList.remove('open'));

    async function loadLeadership() {
      try {
        const data=await api('/api/leadership');
        teachersByName=Object.fromEntries((data.teachers||[]).map(t=>[t.display_name,t]));
        const kpis=document.querySelectorAll('#overview .kpi');
        if(kpis.length>=4){kpis[0].textContent=data.counts.teachers;kpis[1].textContent=data.counts.open_actions;kpis[2].textContent=data.counts.active_coaching;kpis[3].textContent=data.counts.teacher_replies;}

        const table=document.querySelector('#overview .teacher-table tbody,#overview .data-table tbody');
        if(table){table.innerHTML='';for(const t of data.teachers||[]){const tr=document.createElement('tr');const attention=Number(t.open_support)>0?'Support Requested':Number(t.open_actions)>0?'Follow-Up':'No Signal';tr.innerHTML=`<td><div class="teacher-name">${esc(t.display_name)}</div><div class="mini">${esc(t.department||'')}</div></td><td>${t.completed_priorities} of ${t.total_priorities} addressed</td><td>${t.unread_feedback?`${t.unread_feedback} comment${t.unread_feedback===1?'':'s'}`:'—'}</td><td>${Number(t.active_coaching)?'<span class="signal dark">Active</span>':'—'}</td><td>${t.evidence_count} items</td><td><span class="signal ${Number(t.open_support)>0?'red':''}">${attention}</span></td><td><button class="pill-btn api-open-teacher">Open</button></td>`;tr.querySelector('.api-open-teacher').onclick=()=>openTeacher(t.id,t.display_name);table.appendChild(tr);}}

        const follow=document.getElementById('followup');
        if(follow){const fk=follow.querySelectorAll('.kpi');if(fk.length>=4){fk[0].textContent=data.counts.teacher_replies;fk[1].textContent=data.counts.open_actions;fk[2].textContent=data.counts.support_requests;fk[3].textContent=data.counts.active_coaching;}const grid=follow.querySelector('.queue-grid');if(grid){const cards=[];(data.teacher_reflections||[]).slice(0,4).forEach(r=>cards.push(`<div class="queue-card"><div class="queue-title">${esc(r.display_name)} submitted a coaching reflection</div><div class="queue-meta">${esc(r.created_at)}</div><div class="queue-copy">${esc(r.body)}</div><div class="queue-actions"><button class="pill-btn api-open-by-name" data-name="${esc(r.display_name)}">Open Teacher</button></div></div>`));(data.support_requests||[]).forEach(r=>cards.push(`<div class="queue-card" data-request-id="${r.id}"><div class="queue-title">${esc(r.display_name)} requested support</div><div class="queue-meta">${esc(r.area)} • ${esc(r.priority)}</div><div class="queue-copy">${esc(r.description)}</div><div class="queue-actions"><button class="pill-btn api-assign">Assign to Me</button><button class="pill-btn api-resolve">Resolve</button></div></div>`));grid.innerHTML=cards.join('')||'<div class="queue-card"><div class="queue-title">No open follow-up items</div></div>';grid.querySelectorAll('.api-open-by-name').forEach(b=>b.onclick=()=>{const t=teachersByName[b.dataset.name];if(t)openTeacher(t.id,t.display_name)});grid.querySelectorAll('.api-assign').forEach(b=>b.onclick=async()=>{const card=b.closest('[data-request-id]');await post({action:'support_update',request_id:Number(card.dataset.requestId),status:'open',assigned_to:LEAD_ID});flash('Support request assigned');});grid.querySelectorAll('.api-resolve').forEach(b=>b.onclick=async()=>{const card=b.closest('[data-request-id]');await post({action:'support_update',request_id:Number(card.dataset.requestId),status:'resolved',assigned_to:LEAD_ID});card.remove();flash('Support request resolved');loadLeadership();});}}
        }

        document.querySelectorAll('.open-teacher').forEach(b=>{const t=teachersByName[b.dataset.teacher];if(t)b.onclick=()=>openTeacher(t.id,t.display_name)});
      } catch(e){console.error('Leadership data:',e);flash('Leadership data could not be loaded');}
    }

    loadLeadership();
  }

  if (/leadership\.html$/i.test(location.pathname)) leadershipPage(); else teacherPage();
})();
