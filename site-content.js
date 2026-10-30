(function(){
  'use strict';
  const cfg=window.AU_SITE_CONFIG||{};
  const fields=[{"key": "hero_name", "label": "Home \u00b7 Name", "selector": "#home h1", "property": "text"}, {"key": "hero_intro", "label": "Home \u00b7 Intro", "selector": "#home .intro", "property": "text"}, {"key": "hero_description", "label": "Home \u00b7 Description", "selector": "#home .lead", "property": "text"}, {"key": "availability", "label": "Home \u00b7 Availability", "selector": "#home .eyebrow", "property": "text"}, {"key": "about_heading", "label": "About \u00b7 Heading", "selector": "#about .section-heading h2", "property": "text"}, {"key": "about_intro", "label": "About \u00b7 First paragraph", "selector": "#about .about-copy .about-paragraph:first-of-type", "property": "text"}, {"key": "about_location", "label": "About \u00b7 Location", "selector": "#about .about-panel strong:first-of-type", "property": "text"}, {"key": "experience_heading", "label": "Experience \u00b7 Heading", "selector": "#experience .section-heading h2", "property": "text"}, {"key": "skills_heading", "label": "Skills \u00b7 Heading", "selector": "#skills .section-heading h2", "property": "text"}, {"key": "education_heading", "label": "Education \u00b7 Heading", "selector": "#education .section-heading h2", "property": "text"}, {"key": "blog_heading", "label": "Blog \u00b7 Heading", "selector": "#blog .section-heading h2", "property": "text"}, {"key": "blog_title", "label": "Blog \u00b7 Featured title", "selector": "#blog .blog-feature h3", "property": "text"}, {"key": "blog_summary", "label": "Blog \u00b7 Featured summary", "selector": "#blog .blog-feature p", "property": "text"}, {"key": "contact_heading", "label": "Contact \u00b7 Heading", "selector": "#contact h2", "property": "text"}, {"key": "contact_description", "label": "Contact \u00b7 Description", "selector": "#contact .contact-box > p:first-of-type", "property": "text"}, {"key": "contact_details", "label": "Contact \u00b7 Details", "selector": "#contact .contact-email", "property": "text"}, {"key": "hero_photo", "label": "Media \u00b7 Hero photo", "selector": "#home .hero-card img", "property": "src"}, {"key": "about_photo", "label": "Media \u00b7 About photo", "selector": "#about .about-photo", "property": "src"}, {"key": "contact_photo", "label": "Media \u00b7 Contact photo", "selector": "#contact .contact-photo", "property": "src"}, {"key": "cv_link", "label": "Media \u00b7 CV download", "selector": "header.nav .nav-cta", "property": "href"}, {"key": "email_link", "label": "Contact \u00b7 Email button", "selector": "#contact a[href^=\"mailto:\"]", "property": "href"}, {"key": "phone_link", "label": "Contact \u00b7 Phone button", "selector": "#contact a[href^=\"tel:\"]", "property": "href"}];
  const allowed=Object.fromEntries(fields.map(f=>[f.key,f]));
  function apply(values){
    if(!values||typeof values!=="object")return;
    for(const [key,value] of Object.entries(values)){
      const f=allowed[key];if(!f||typeof value!=="string")continue;
      const el=document.querySelector(f.selector);if(!el)continue;
      if(f.property==='text')el.textContent=value;
      else if(f.property==='src' && /^(https:\/\/|\/|\.\/)/i.test(value))el.setAttribute('src',value);
      else if(f.property==='href' && (/^(https:\/\/|\/|\.\/)/i.test(value)|| (key==='email_link'&&/^mailto:[^\s]+$/i.test(value))||(key==='phone_link'&&/^tel:[+\d-]+$/i.test(value))))el.setAttribute('href',value);
    }
  }
  window.AU_EDITOR_FIELDS=fields;
  window.AU_APPLY_CONTENT=apply;
  const params=new URLSearchParams(location.search);
  if(params.has('au_preview')){
    window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data&&e.data.type==='AU_PREVIEW')apply(e.data.values)});
    document.addEventListener('click',e=>{
      const el=e.target.closest('a');if(el)e.preventDefault();
      const f=fields.find(f=>{const node=document.querySelector(f.selector);return node&&(node===e.target||node.contains(e.target))});
      if(f&&window.parent!==window)window.parent.postMessage({type:'AU_SELECT',key:f.key},location.origin);
    },true);
    return;
  }
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey)return;
  fetch(cfg.supabaseUrl.replace(/\/$/,'')+'/rest/v1/site_content?id=eq.main&select=content',{
    headers:{apikey:cfg.supabaseAnonKey,Authorization:'Bearer '+cfg.supabaseAnonKey},cache:'no-store'
  }).then(r=>{if(!r.ok)throw new Error('Content unavailable');return r.json()}).then(rows=>{if(rows[0])apply(rows[0].content)}).catch(()=>{});
})();
