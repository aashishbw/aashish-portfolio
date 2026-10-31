(() => {
  'use strict';
  const admin = window.AU_ADMIN;
  if (!admin) return;
  const fields = (window.AU_EDITOR_FIELDS || []).filter(field => field.property === 'src');
  const byId = id => document.getElementById(id);
  const cards = new Map();
  const isImageUrl = value => /^(https:\/\/|\/(?!\/)|\.\/)/i.test(value);
  const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
  let uploading = false;

  function refresh() {
    const draft = admin.getDraft();
    for (const field of fields) {
      const card = cards.get(field.key);
      const value = draft[field.key] || field.defaultValue || '';
      card.image.hidden = !isImageUrl(value);
      if (isImageUrl(value)) card.image.src = new URL(value, location.origin).href;
      card.fallback.hidden = true;
      if (document.activeElement !== card.url) card.url.value = draft[field.key] || '';
    }
  }

  function select(key) {
    const card = cards.get(key);
    if (!card) return;
    admin.switchTab('media');
    byId('mediaTarget').value = key;
    for (const [name, item] of cards) item.root.classList.toggle('image-selected', name === key);
    card.root.scrollIntoView({behavior: 'smooth', block: 'center'});
    card.choose.focus({preventScroll: true});
  }

  async function upload(file, key, status) {
    if (uploading) return;
    const imageField = fields.find(field => field.key === key);
    const allowed = imageField ? imageTypes : [...imageTypes, 'application/pdf'];
    if (!imageField && key !== 'cv_link') throw new Error('Choose an image or CV destination.');
    if (!admin.isSignedIn()) throw new Error('Sign in before uploading.');
    if (!allowed.includes(file.type)) throw new Error(imageField ? 'Choose a PNG, JPG or WebP image for this destination.' : 'Choose a PNG, JPG, WebP or PDF file.');
    if (file.size > 10 * 1024 * 1024) throw new Error('Maximum upload size is 10 MB.');
    if (!file.size) throw new Error('This file is empty. Choose another file.');
    uploading = true;
    const buttons = [byId('uploadBtn'), ...Array.from(cards.values(), card => card.choose)];
    buttons.forEach(button => button.disabled = true);
    status.textContent = 'Uploading…';
    try {
      const ext = {'image/png':'png','image/jpeg':'jpg','image/webp':'webp','application/pdf':'pdf'}[file.type];
      const name = `${key}/${crypto.randomUUID()}.${ext}`;
      await admin.api('/storage/v1/object/portfolio-media/' + name, {
        method: 'POST', headers: {'Content-Type': file.type, 'x-upsert': 'false'}, body: file
      });
      const base = window.AU_SITE_CONFIG.supabaseUrl.replace(/\/$/, '');
      admin.updateField(key, base + '/storage/v1/object/public/portfolio-media/' + name);
      status.textContent = 'Uploaded to your draft. Preview it, then click Publish changes to make it live.';
      refresh();
    } catch (error) {
      status.textContent = 'Upload failed: ' + error.message;
    } finally {
      uploading = false;
      buttons.forEach(button => button.disabled = false);
    }
  }

  const grid = document.createElement('div');
  grid.id = 'imageFields';
  grid.className = 'content-grid';
  const heading = document.createElement('h2');
  heading.textContent = 'Website images';
  const help = document.createElement('p');
  help.className = 'hint';
  help.textContent = 'All photos and logos are editable here. The original image stays visible until you publish a replacement.';
  byId('media').insertBefore(heading, byId('mediaFields'));
  byId('media').insertBefore(help, byId('mediaFields'));
  byId('media').insertBefore(grid, byId('mediaFields'));

  for (const field of fields) {
    const root = document.createElement('section');
    root.className = 'field-card image-card';
    const title = document.createElement('h3');
    title.textContent = field.label.replace('Media · ', '');
    const image = document.createElement('img');
    image.className = 'media-thumbnail';
    image.alt = title.textContent + ' preview';
    const fallback = document.createElement('p');
    fallback.className = 'hint';
    fallback.textContent = 'Image could not be loaded. Choose another file or URL.';
    fallback.hidden = true;
    image.onerror = () => { image.hidden = true; fallback.hidden = false; };
    const label = document.createElement('label');
    label.textContent = 'Image URL (optional)';
    label.htmlFor = 'image-url-' + field.key;
    const url = document.createElement('input');
    url.id = label.htmlFor;
    url.type = 'text';
    url.placeholder = 'Paste an HTTPS image URL, or upload below';
    url.dataset.field = field.key;
    url.addEventListener('input', () => {
      const value = url.value.trim();
      const valid = !value || isImageUrl(value);
      url.setCustomValidity(valid ? '' : 'Use an HTTPS image URL or a site-relative path.');
      if (valid) { admin.updateField(field.key, value); status.textContent = 'Draft updated. Preview before publishing.'; }
    });
    url.addEventListener('blur', () => url.reportValidity());
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = imageTypes.join(',');
    file.hidden = true;
    file.setAttribute('aria-label', 'Choose ' + title.textContent);
    const choose = document.createElement('button');
    choose.type = 'button';
    choose.className = 'primary';
    choose.textContent = 'Upload replacement';
    choose.onclick = () => file.click();
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'secondary';
    reset.textContent = 'Use original';
    reset.onclick = () => {
      url.setCustomValidity('');
      admin.updateField(field.key, '');
      status.textContent = 'Original image restored in draft. Publish to apply.';
    };
    const preview = document.createElement('button');
    preview.type = 'button';
    preview.className = 'secondary';
    preview.textContent = 'Preview on website';
    preview.onclick = () => admin.switchTab('editor');
    const actions = document.createElement('div');
    actions.className = 'editor-buttons';
    actions.append(choose, reset, preview);
    const status = document.createElement('p');
    status.className = 'hint';
    status.setAttribute('role', 'status');
    file.onchange = async () => {
      try { if (file.files[0]) await upload(file.files[0], field.key, status); }
      catch (error) { status.textContent = error.message; }
      finally { file.value = ''; }
    };
    root.append(title, image, fallback, label, url, file, actions, status);
    grid.append(root);
    cards.set(field.key, {root, image, fallback, url, choose});
  }

  byId('uploadBtn').onclick = async () => {
    const file = byId('fileUpload').files[0];
    const status = byId('uploadResult');
    if (!file) { status.textContent = 'Choose a file first.'; return; }
    try { await upload(file, byId('mediaTarget').value, status); }
    catch (error) { status.textContent = error.message; }
  };
  window.addEventListener('au:image-select', event => select(event.detail.key));
  window.addEventListener('au:draft-change', refresh);
  window.addEventListener('au:content-loaded', () => { refresh(); window.AU_APPLY_CONTENT(admin.getDraft()); });
  refresh();
})();
