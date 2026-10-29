const article=document.getElementById('article');
const sections=[...article.querySelectorAll('section[id]')];
const toc=document.getElementById('toc');
sections.forEach(section=>{const a=document.createElement('a');a.href='#'+section.id;a.textContent=section.querySelector('h2').textContent;toc.appendChild(a)});
const links=[...toc.querySelectorAll('a')];
function updateScroll(){const scrollable=document.documentElement.scrollHeight-innerHeight;document.getElementById('reading-progress').style.width=(scrollable>0?scrollY/scrollable*100:0)+'%';document.getElementById('top-btn').classList.toggle('show',scrollY>550);let active=sections[0]?.id;for(const s of sections){if(s.getBoundingClientRect().top<170)active=s.id}links.forEach(a=>a.classList.toggle('active',a.hash==='#'+active))}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);updateScroll();
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('top-btn').onclick=()=>scrollTo({top:0,behavior:'smooth'});
const toggle=document.getElementById('theme-toggle');function setTheme(light){document.body.classList.toggle('light',light);toggle.textContent=light?'☾':'☀';toggle.setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode')};try{setTheme(localStorage.getItem('au-blog-theme')==='light')}catch{}
toggle.onclick=()=>{const light=!document.body.classList.contains('light');setTheme(light);try{localStorage.setItem('au-blog-theme',light?'light':'dark')}catch{}};
document.getElementById('copy-btn').onclick=async e=>{try{await navigator.clipboard.writeText(location.href);e.target.textContent='Copied ✓';setTimeout(()=>e.target.textContent='Copy link',1800)}catch{prompt('Copy this article link:',location.href)}};
document.getElementById('share-btn').onclick=async()=>{if(navigator.share){try{await navigator.share({title:document.title,url:location.href})}catch{}}else document.getElementById('copy-btn').click()};
