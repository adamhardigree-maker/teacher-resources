const CVA_API = {
  async get(path) {
    const r = await fetch(path, {headers:{'Accept':'application/json'}});
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async post(path, body) {
    const r = await fetch(path, {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(body)
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }
};

function cvaToast(msg) {
  let t=document.getElementById('backendToast');
  if(!t){
    t=document.createElement('div');
    t.id='backendToast';
    t.style.cssText='position:fixed;right:20px;bottom:20px;background:#1f2933;color:#fff;padding:10px 14px;border-radius:10px;font:600 12px Montserrat,Arial,sans-serif;z-index:9999;display:none';
    document.body.appendChild(t);
  }
  t.textContent=msg; t.style.display='block';
  setTimeout(()=>t.style.display='none',1800);
}
