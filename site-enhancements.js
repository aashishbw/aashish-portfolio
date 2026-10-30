(()=>{'use strict';const cfg=window.AU_SITE_CONFIG||{};if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||location.pathname.startsWith('/admin'))return;const base=cfg.supabaseUrl.replace(/\/$/,'');const headers={apikey:cfg.supabaseAnonKey};const path=location.pathname==='/'?'/':location.pathname.replace(/\.html$/,'').slice(0,100);fetch(base+'/rest/v1/rpc/record_portfolio_view',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({page_path:path}),keepalive:true}).catch(()=>{});fetch(base+'/rest/v1/site_content?id=eq.main&select=content',{headers}).then(r=>r.ok?r.json():[]).then(rows=>{const d=rows[0]?.content||{};if(d.seo_title)document.title=d.seo_title;if(d.seo_description){let m=document.querySelector('meta[name="description"]');if(!m){m=document.createElement('meta');m.name='description';document.head.append(m)}m.content=d.seo_description}if(d.seo_canonical&&/^https:\/\//.test(d.seo_canonical)){let c=document.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.append(c)}c.href=d.seo_canonical}for(const [property,val] of [['og:title',d.seo_title],['og:description',d.seo_description],['og:image',d.seo_image]])if(val){let m=document.querySelector('meta[property="'+property+'"]');if(!m){m=document.createElement('meta');m.setAttribute('property',property);document.head.append(m)}m.content=val}}).catch(()=>{})})();
/* AU Studio heading colors: main text and highlighted word are independently editable. */
(()=>{'use strict';if(document.getElementById('au-heading-color-styles'))return;
const style=document.createElement('style');style.id='au-heading-color-styles';style.textContent=`
:root{--au-heading-main:#0F172A;--au-heading-highlight:#2563EB}
.section-heading h2,.contact-section h2{color:var(--au-heading-main)!important}
.section-heading h2 .gradient,.contact-section h2 .gradient{
 color:var(--au-heading-highlight)!important;background:none!important;background-image:none!important;
 -webkit-background-clip:initial!important;background-clip:initial!important;
 -webkit-text-fill-color:var(--au-heading-highlight)!important
}`;document.head.appendChild(style)})();
