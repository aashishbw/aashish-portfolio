(function(){
  'use strict';
  const cfg=window.AU_SITE_CONFIG||{};
  const fields=[{"key":"hero_name","label":"Home · Name","selector":"#home h1","property":"text"},{"key":"hero_intro","label":"Home · Intro","selector":"#home .intro","property":"text"},{"key":"hero_description","label":"Home · Description","selector":"#home .lead","property":"text"},{"key":"availability","label":"Home · Availability","selector":"#home .eyebrow","property":"text"},{"key":"about_heading","label":"About · Heading","selector":"#about .section-heading h2","property":"text"},{"key":"about_intro","label":"About · First paragraph","selector":"#about .about-copy .about-paragraph:first-of-type","property":"text"},{"key":"about_location","label":"About · Location","selector":"#about .about-panel strong:first-of-type","property":"text"},{"key":"experience_heading","label":"Experience · Heading","selector":"#experience .section-heading h2","property":"text"},{"key":"skills_heading","label":"Skills · Heading","selector":"#skills .section-heading h2","property":"text"},{"key":"education_heading","label":"Education · Heading","selector":"#education .section-heading h2","property":"text"},{"key":"blog_heading","label":"Blog · Heading","selector":"#blog .section-heading h2","property":"text"},{"key":"blog_title","label":"Blog · Featured title","selector":"#blog .blog-feature h3","property":"text"},{"key":"blog_summary","label":"Blog · Featured summary","selector":"#blog .blog-feature p","property":"text"},{"key":"contact_heading","label":"Contact · Heading","selector":"#contact h2","property":"text"},{"key":"contact_description","label":"Contact · Description","selector":"#contact .contact-box > p:first-of-type","property":"text"},{"key":"contact_details","label":"Contact · Details","selector":"#contact .contact-email","property":"text"},{"key":"hero_photo","label":"Media · Hero photo","selector":"#home .hero-card img","property":"src","defaultValue":"/hero-profile.jpg"},{"key":"about_photo","label":"Media · About photo","selector":"#about .about-photo","property":"src","defaultValue":"/about-profile.jpg"},{"key":"contact_photo","label":"Media · Contact photo","selector":"#contact .contact-photo","property":"src","defaultValue":"/formal-profile.jpg"},{"key":"cv_link","label":"Media · CV download","selector":"header.nav .nav-cta","property":"href"},{"key":"email_link","label":"Contact · Email button","selector":"#contact a[href^=\"mailto:\"]","property":"href"},{"key":"phone_link","label":"Contact · Phone button","selector":"#contact a[href^=\"tel:\"]","property":"href"},{"key":"header_logo","label":"Media · Header logo","selector":"header.nav .au-brand-image, .login-logo, .identity img","property":"src","defaultValue":"/au-logo.png"},{"key":"footer_logo","label":"Media · Footer logo","selector":"footer .au-footer-image","property":"src","defaultValue":"/au-logo.png"}];
  fields.push(
    {key:'heading_main_color',label:'Design · Heading Main Color',selector:'html',property:'color',defaultValue:'#3453a4'},
    {key:'heading_highlight_color',label:'Design · Heading Highlight Color',selector:'html',property:'color',defaultValue:'#3453a4'}
  );
  const allowed=Object.fromEntries(fields.map(f=>[f.key,f]));
  function apply(values){
    if(!values||typeof values!=='object')return;
    for(const [key,value] of Object.entries(values)){
      const f=allowed[key];if(!f||typeof value!=='string')continue;
      if(f.property==='color'){
        if(!/^#[0-9a-fA-F]{6}$/.test(value))continue;
        document.documentElement.style.setProperty(key==='heading_main_color'?'--au-heading-main':'--au-heading-highlight',value);
        continue;
      }
      if(f.property==='src'){
        const source=value||f.defaultValue;
        if(source&&/^(https:\/\/|\/(?!\/)|\.\/)/i.test(source))for(const node of document.querySelectorAll(f.selector))node.setAttribute('src',source);
        continue;
      }
      const el=document.querySelector(f.selector);if(!el)continue;
      if(f.property==='text'){
        if(key.endsWith('_heading')&&el.tagName==='H2'){
          const words=value.trim().split(/\s+/).filter(Boolean);
          if(words.length>1){
            const last=words.pop(),span=document.createElement('span');span.className='gradient';span.textContent=last;
            el.replaceChildren(document.createTextNode(words.join(' ')+' '),span);
          }else el.textContent=value;
        }else el.textContent=value;
      }else if(f.property==='src'&&/^(https:\/\/|\/|\.\/)/i.test(value))el.setAttribute('src',value);
      else if(f.property==='href'&&(/^(https:\/\/|\/|\.\/)/i.test(value)||(key==='email_link'&&/^mailto:[^\s]+$/i.test(value))||(key==='phone_link'&&/^tel:[+\d-]+$/i.test(value))))el.setAttribute('href',value);
    }
  }
  window.AU_EDITOR_FIELDS=fields;
  window.AU_APPLY_CONTENT=apply;
  const params=new URLSearchParams(location.search);
  if(params.has('au_preview')){
    window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===window.parent&&e.data&&e.data.type==='AU_PREVIEW')apply(e.data.values)});
    // Direct in-place editing in the preview iframe.
    let active=null;
    const editable=fields.filter(f=>f.property==='text'||f.property==='src');
    const css=document.createElement('style');
    css.textContent='[data-au-editable]{cursor:text!important;outline-offset:4px}[data-au-editable]:hover{outline:2px dashed #eb7124!important}[data-au-editable][contenteditable="true"]{outline:3px solid #3453a4!important;background:rgba(255,255,255,.92)!important;min-height:1em}';
    css.textContent+='[data-au-image]{cursor:pointer!important;outline-offset:5px}[data-au-image]:hover,[data-au-image]:focus-visible{outline:3px dashed #3453a4!important}';
    document.head.append(css);
    function mark(){for(const f of editable){for(const node of document.querySelectorAll(f.selector)){if(f.property==='src'){node.dataset.auImage=f.key;node.tabIndex=0;node.setAttribute('role','button');node.setAttribute('aria-label','Replace '+f.label.replace('Media · ',''));}else node.dataset.auEditable=f.key}}}
    mark();
    function finish(){if(!active)return;const {node,key}=active;node.removeAttribute('contenteditable');node.removeAttribute('spellcheck');const value=node.innerText.trim();window.parent.postMessage({type:'AU_INLINE_CHANGE',key,value},location.origin);active=null}
    document.addEventListener('click',e=>{
      const link=e.target.closest('a');if(link)e.preventDefault();
      const image=e.target.closest('[data-au-image]');
      if(image){if(active)finish();e.preventDefault();e.stopPropagation();window.parent.postMessage({type:'AU_SELECT',key:image.dataset.auImage},location.origin);return}
      const node=e.target.closest('[data-au-editable]');
      if(!node){if(active)finish();return}
      if(active&&active.node!==node)finish();
      const key=node.dataset.auEditable;
      if(!active){active={node,key};node.setAttribute('contenteditable','true');node.setAttribute('spellcheck','false');node.focus();window.parent.postMessage({type:'AU_SELECT',key},location.origin)}
      e.stopPropagation();
    },true);
    document.addEventListener('keydown',e=>{if(e.target.dataset?.auImage&&(e.key==='Enter'||e.key===' ')){e.preventDefault();window.parent.postMessage({type:'AU_SELECT',key:e.target.dataset.auImage},location.origin);return}if(!active)return;if(e.key==='Escape'){e.preventDefault();finish()}if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();finish()}});
    document.addEventListener('focusout',e=>{if(active&&e.target===active.node)setTimeout(()=>{if(active&&document.activeElement!==active.node)finish()},50)},true);
    window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='AU_PREVIEW')setTimeout(mark,0)});
    return;
  }
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey)return;
  fetch(cfg.supabaseUrl.replace(/\/$/,'')+'/rest/v1/site_content?id=eq.main&select=content',{
    headers:{apikey:cfg.supabaseAnonKey,Authorization:'Bearer '+cfg.supabaseAnonKey},cache:'no-store'
  }).then(r=>{if(!r.ok)throw new Error('Content unavailable');return r.json()}).then(rows=>{if(rows[0])apply(rows[0].content)}).catch(()=>{});
})();

