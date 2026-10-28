const FONT_CACHE='zk-font-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
/* 内置字体较大：缓存优先，只下载一次 */
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method==='GET'&&u.origin===location.origin&&u.pathname.endsWith('/font.woff')){
    e.respondWith(caches.open(FONT_CACHE).then(async c=>{
      const hit=await c.match(e.request);if(hit)return hit;
      const res=await fetch(e.request);if(res&&res.ok)c.put(e.request,res.clone());return res;
    }));
  }
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if('focus' in c)return c.focus()}
    if(self.clients.openWindow)return self.clients.openWindow('./');
  }));
});
