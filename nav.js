/* CVA Teacher Resources Hub — Shared Navigation */
const GA_ID="G-444E1VXNYV";
const gaScript=document.createElement("script");
gaScript.async=true;gaScript.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;document.head.appendChild(gaScript);
window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}gtag("js",new Date());gtag("config",GA_ID);
(function(){"use strict";const BASE=window.location.origin;const BANNER_HEIGHT="clamp(56px, 6vw, 92px)";document.documentElement.style.setProperty("--cva-banner-height",BANNER_HEIGHT);document.body.style.paddingTop="calc(var(--cva-banner-height) + 72px)";

/* Move the homepage Teacher Expectations overview into the accordion area. */
(function moveTeacherExpectations(){
  const isHome=window.location.pathname==="/"||window.location.pathname.endsWith("/index.html");
  if(!isHome)return;
  const overview=document.querySelector(".overview-card");
  const accordion=document.querySelector(".accordion-section");
  if(!overview||!accordion||document.getElementById("teacher-expectations-accordion"))return;
  const details=document.createElement("details");
  details.className="quick-ref";
  details.id="teacher-expectations-accordion";
  details.style.cssText="display:block!important;visibility:visible!important;";
  const summary=document.createElement("summary");
  summary.innerHTML='<span class="quick-plus">+</span>CVA Teacher Expectations';
  const body=document.createElement("div");
  body.className="quick-ref-body";
  overview.style.margin="0";
  body.appendChild(overview);
  details.appendChild(summary);
  details.appendChild(body);
  accordion.insertBefore(details,accordion.firstElementChild);
})();

const NAV=[
{label:"Grading and Feedback",pages:[
{title:"Academic Integrity and Paused Grading",href:BASE+"/grading-and-feedback/paused-grading.html"},
{title:"Accepting Student Work in CVA Classes",href:BASE+"/grading-and-feedback/accepting-student-work.html"},
{title:"Effective Feedback",href:BASE+"/grading-and-feedback/effective-feedback.html"},
{title:"Grading in CTLS",href:BASE+"/grading-and-feedback/grading-basics.html"},
{title:"Grading Policy at CVA",href:BASE+"/grading-and-feedback/cva-grading-policy.html"},
{title:"Resubmission Opportunities",href:BASE+"/grading-and-feedback/allowing-resubmissions.html"},
{title:"Submission Expectations",href:BASE+"/grading-and-feedback/submission-expectations.html"}]},
{label:"Communication and Responsiveness",pages:[
{title:"Contacting Local Schools",href:BASE+"/communication-and-responsiveness/contacting-local-schools.html"},
{title:"Email Communication",href:BASE+"/communication-and-responsiveness/email-communication.html"},
{title:"Required Email Signature",href:BASE+"/communication-and-responsiveness/cva-email-signature.html"},
{title:"Who Do Students Contact?",href:BASE+"/communication-and-responsiveness/who-do-students-contact.html"}]},
{label:"Rapport and Relationships",pages:[
{title:"Classroom Announcements",href:BASE+"/rapport-and-relationships/classroom-announcements.html"},
{title:"CVA News You Can Use",href:BASE+"/rapport-and-relationships/CVA%20News%20You%20Can%20Use%20Splash%20Page.html"},
{title:"Discussion to Drive Learning",href:BASE+"/rapport-and-relationships/discussions-as-learning.html"},
{title:"Instructor Profile",href:BASE+"/rapport-and-relationships/instructor-profile.html"},
{title:"Teacher Information Page",href:BASE+"/rapport-and-relationships/directions-for-teacher-information-page.html"}]},
{label:"Proactive Intervention and Student Support",pages:[
{title:"Class Schedule",href:BASE+"/proactive-intervention-and-student-support/class-schedule.html"},
{title:"Communicating Deadlines",href:BASE+"/proactive-intervention-and-student-support/communicating-deadlines.html"},
{title:"Grades and Feedback Support",href:BASE+"/proactive-intervention-and-student-support/grades-and-feedback-support.html"},
{title:"Practice Student View",href:BASE+"/proactive-intervention-and-student-support/practice-student.html"},
{title:"Progress Tracker",href:BASE+"/proactive-intervention-and-student-support/progress-tracker.html"},
{title:"Student Accommodations and Accessibility",href:BASE+"/proactive-intervention-and-student-support/accommodations-and-accessibility.html"}]},
{label:"Professionalism and Collaboration",pages:[
{title:"Accessibility by Design",href:BASE+"/professionalism-and-collaboration/accessibility-by-design.html"},
{title:"Instructional Practice Review",href:BASE+"/professionalism-and-collaboration/instructional-practice-review.html"},
{title:"Professional Learning Course",href:BASE+"/professionalism-and-collaboration/professional-learning-course.html"},
{title:"Synergy Gradebook Setup",href:BASE+"/professionalism-and-collaboration/synergy.gradebook.html"},
{title:"Views and Tools",href:BASE+"/professionalism-and-collaboration/views-and-tools.html"},
{title:"Weekly Facilitation Routine",href:BASE+"/professionalism-and-collaboration/weekly-routine.html"}]},
{label:"Technology How-To Guides",pages:[
{title:"Keyboard Shortcuts",href:BASE+"/technology/keyboard-shortcuts.html"},
{title:"Panopto",href:"https://support.panopto.com/s/",external:true}]}];
function normalizeURL(url){return url.split("?")[0].split("#")[0].replace(/\/$/,"");}const currentURL=normalizeURL(window.location.href);

/* Keep homepage cards in the same order as the shared navigation. */
(function syncHomepageCardOrder(){
  const isHome=window.location.pathname==="/"||window.location.pathname.endsWith("/index.html");
  if(!isHome)return;
  document.querySelectorAll("details.quick-ref").forEach(function(details){
    const summary=details.querySelector("summary");
    const grid=details.querySelector(".card-grid");
    if(!summary||!grid)return;
    const clone=summary.cloneNode(true);
    const plus=clone.querySelector(".quick-plus");
    if(plus)plus.remove();
    const label=clone.textContent.trim();
    const group=NAV.find(function(item){return item.label===label;});
    if(!group)return;
    const order=new Map();
    group.pages.forEach(function(page,index){order.set(normalizeURL(page.href),index);});
    const cards=Array.from(grid.children).filter(function(el){return el.classList.contains("info-card");});
    cards.sort(function(a,b){
      const aLink=a.querySelector("a[href]");
      const bLink=b.querySelector("a[href]");
      const aURL=aLink?normalizeURL(new URL(aLink.getAttribute("href"),window.location.href).href):"";
      const bURL=bLink?normalizeURL(new URL(bLink.getAttribute("href"),window.location.href).href):"";
      const aIndex=order.has(aURL)?order.get(aURL):999;
      const bIndex=order.has(bURL)?order.get(bURL):999;
      if(aIndex!==bIndex)return aIndex-bIndex;
      const aTitle=(a.querySelector("h3")||{}).textContent||"";
      const bTitle=(b.querySelector("h3")||{}).textContent||"";
      return aTitle.localeCompare(bTitle);
    });
    cards.forEach(function(card){grid.appendChild(card);});
  });
})();

const style=document.createElement("style");style.textContent=`html{scroll-padding-top:calc(var(--cva-banner-height) + 72px)}body{padding-top:calc(var(--cva-banner-height) + 72px)!important}#cva-banner{position:fixed;top:0;left:0;right:0;height:var(--cva-banner-height);z-index:1001;line-height:0;background:#fff;overflow:hidden}#cva-banner img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}#cva-header{position:fixed;top:var(--cva-banner-height);left:0;right:0;height:56px;background:#BB0000;color:#fff;display:flex;align-items:center;padding:0 16px;gap:12px;z-index:1000;box-sizing:border-box;font-family:Montserrat,Arial,sans-serif}#cva-menu-toggle{background:none;border:none;cursor:pointer;padding:6px;display:flex;flex-direction:column;gap:5px;flex-shrink:0}#cva-menu-toggle span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:transform .2s,opacity .2s}#cva-menu-toggle.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}#cva-menu-toggle.open span:nth-child(2){opacity:0}#cva-menu-toggle.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}#cva-header-home{color:#fff;text-decoration:none;font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#cva-header-home:hover,#cva-header-home:focus{text-decoration:underline}#cva-sidebar{position:fixed;top:calc(var(--cva-banner-height) + 56px);left:-300px;width:288px;bottom:0;background:#fff;border-right:1px solid #C8C7C7;overflow-y:auto;z-index:999;transition:left .25s ease;font-family:Montserrat,Arial,sans-serif;padding-bottom:32px;box-sizing:border-box}#cva-sidebar.open{left:0}#cva-overlay{display:none;position:fixed;top:calc(var(--cva-banner-height) + 56px);left:0;right:0;bottom:0;background:rgba(0,0,0,.25);z-index:998}#cva-overlay.open{display:block}.cva-nav-home{display:block;padding:16px 20px 14px;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#BB0000;text-decoration:none;border-bottom:2px solid #BB0000}.cva-nav-home:hover,.cva-nav-home:focus{background:#FAFAFA}.cva-nav-group{border-bottom:1px solid #C8C7C7}.cva-nav-group-btn{width:100%;background:none;border:none;cursor:pointer;text-align:left;padding:13px 20px 13px 16px;font-family:Montserrat,Arial,sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#222;display:flex;justify-content:space-between;align-items:center;gap:8px}.cva-nav-group-btn:hover,.cva-nav-group-btn:focus{background:#F5F5F5}.cva-nav-group-btn .cva-arrow{font-size:.65rem;transition:transform .2s;flex-shrink:0}.cva-nav-group-btn.open .cva-arrow{transform:rotate(180deg)}.cva-nav-pages{display:none;padding:0 0 6px;background:#F5F5F5}.cva-nav-pages.open{display:block}.cva-nav-pages a{display:block;padding:9px 20px 9px 24px;font-size:.82rem;color:#222;text-decoration:none;border-left:3px solid transparent;line-height:1.4}.cva-nav-pages a:hover,.cva-nav-pages a:focus{background:#E8E8E8;border-left-color:#C8C7C7}.cva-nav-pages a.current{font-weight:700;color:#BB0000;border-left-color:#BB0000;background:#fff}.cva-nav-external{display:flex;align-items:center;justify-content:space-between;padding:13px 20px 13px 16px;font-family:Montserrat,Arial,sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#BB0000;text-decoration:none;border-bottom:1px solid #C8C7C7}.cva-nav-external:hover,.cva-nav-external:focus{background:#FAFAFA}.cva-nav-external .cva-ext-arrow{font-size:.7rem;opacity:.6}.cva-nav-external-group{border-top:2px solid #BB0000;margin-top:8px}`;document.head.appendChild(style);
const header=document.createElement("div");header.id="cva-header";header.innerHTML=`<button id="cva-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="cva-sidebar"><span></span><span></span><span></span></button><a id="cva-header-home" href="${BASE}/">CVA Teacher Resources Hub</a>`;document.body.prepend(header);
const banner=document.createElement("div");banner.id="cva-banner";const bannerImg=document.createElement("img");bannerImg.src="/images/Website Banner Teacher Resources Hub.png";bannerImg.alt="Cobb Virtual Academy Teacher Resources";bannerImg.loading="eager";bannerImg.decoding="async";bannerImg.fetchPriority="high";banner.appendChild(bannerImg);document.body.prepend(banner);
const sidebar=document.createElement("nav");sidebar.id="cva-sidebar";sidebar.setAttribute("aria-label","Resource navigation");let sidebarHTML=`<a class="cva-nav-home" href="${BASE}/">&#8592; Resource Hub Home</a>`;NAV.forEach(function(group,groupIndex){const isActiveGroup=group.pages.some(page=>normalizeURL(page.href)===currentURL);sidebarHTML+=`<div class="cva-nav-group"><button type="button" class="cva-nav-group-btn${isActiveGroup?" open":""}" aria-expanded="${isActiveGroup}" aria-controls="cva-group-${groupIndex}" data-group="${groupIndex}"><span>${group.label}</span><span class="cva-arrow" aria-hidden="true">&#9660;</span></button><div class="cva-nav-pages${isActiveGroup?" open":""}" id="cva-group-${groupIndex}">`;group.pages.forEach(function(page){const isCurrent=normalizeURL(page.href)===currentURL;const externalAttrs=page.external?' target="_blank" rel="noopener noreferrer"':"";const externalIndicator=page.external?' <span aria-hidden="true">↗</span>':"";sidebarHTML+=`<a href="${page.href}" class="${isCurrent?"current":""}" ${isCurrent?'aria-current="page"':""}${externalAttrs}>${page.title}${externalIndicator}</a>`;});sidebarHTML+="</div></div>";});sidebarHTML+=`<div class="cva-nav-external-group"><a class="cva-nav-external" href="https://www.cobbk12.org/cobbvirtualacademy" target="_blank" rel="noopener noreferrer">CVA Homepage <span class="cva-ext-arrow" aria-hidden="true">↗</span></a><a class="cva-nav-external" href="https://www.cobbk12.org/ctls-support" target="_blank" rel="noopener noreferrer">CTLS Support <span class="cva-ext-arrow" aria-hidden="true">↗</span></a><a class="cva-nav-external" href="https://incite.educationincites.com/#/initUser" target="_blank" rel="noopener noreferrer">CTLS Teach <span class="cva-ext-arrow" aria-hidden="true">↗</span></a><a class="cva-nav-external" href="https://synergy.cobbk12.org/" target="_blank" rel="noopener noreferrer">Synergy <span class="cva-ext-arrow" aria-hidden="true">↗</span></a></div>`;sidebar.innerHTML=sidebarHTML;document.body.appendChild(sidebar);
const overlay=document.createElement("div");overlay.id="cva-overlay";overlay.setAttribute("aria-hidden","true");document.body.appendChild(overlay);const toggle=document.getElementById("cva-menu-toggle");function openMenu(){sidebar.classList.add("open");overlay.classList.add("open");toggle.classList.add("open");toggle.setAttribute("aria-expanded","true");toggle.setAttribute("aria-label","Close navigation menu");overlay.setAttribute("aria-hidden","false");}function closeMenu(){sidebar.classList.remove("open");overlay.classList.remove("open");toggle.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation menu");overlay.setAttribute("aria-hidden","true");}toggle.addEventListener("click",()=>sidebar.classList.contains("open")?closeMenu():openMenu());overlay.addEventListener("click",closeMenu);sidebar.querySelectorAll(".cva-nav-pages a").forEach(link=>link.addEventListener("click",closeMenu));sidebar.querySelectorAll(".cva-nav-group-btn").forEach(function(button){button.addEventListener("click",function(){const pages=document.getElementById("cva-group-"+button.dataset.group);const isOpen=button.classList.contains("open");button.classList.toggle("open",!isOpen);pages.classList.toggle("open",!isOpen);button.setAttribute("aria-expanded",String(!isOpen));});});document.addEventListener("keydown",function(event){if(event.key==="Escape"){closeMenu();toggle.focus();}});
})();