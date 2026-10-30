# AU Studio — Portfolio admin + visual editor

## Included
- `/admin/` — secure email/password login, dashboard, live visual editor, content manager, media uploader and settings.
- `site-config.js` — PUBLIC Supabase project URL + anon/publishable key configuration (never use a secret key).
- `site-content.js` — applies published content to your public homepage.
- `supabase-setup.sql` — database, row-level security, storage policies.
- `au-logo.png` and `favicon.png` — the selected single AU brand.

## Setup (required before editing works)
1. Create a Supabase project at https://supabase.com and open **Project Settings → API**. Copy the project URL and the public **anon/publishable** key into `site-config.js`. Do not use the service-role or secret key.
2. In **Authentication → Users**, create an admin account with your own email and a strong password. Copy its user UUID. Disable public signup in Supabase Auth settings if you don't need it.
3. Run `supabase-setup.sql` in **SQL Editor**. Then execute this command with YOUR actual user UUID:
   `insert into public.admin_users(user_id) values ('YOUR-USER-UUID');`
4. In **Storage**, create a PUBLIC bucket named `portfolio-media`. The SQL script creates an insert policy restricting uploads to approved admins. For better control set a 10MB file-size limit and image/PDF MIME types on the bucket.
5. Upload the CONTENTS of this ZIP to your existing GitHub repository root, including the `admin` folder. **Do not delete** existing `styles.css`, `script.js`, photos, or `Aashish_Upadhyaya_CV.pdf`. Vercel will redeploy.
6. Open `https://YOUR-DOMAIN/admin/`, sign in, edit and publish. Your public homepage reads the published content automatically.

## Important limitations
- This is a **working first-phase editor**, not a full Elementor drag-and-drop page builder. It edits selected text, image URLs, contact links and CV URL, with desktop/mobile preview. Layout restructuring, arbitrary new sections, blog CRUD, analytics, and message inbox are **not implemented**.
- Original static content remains the fallback until Supabase is configured and content is published. Initial editor values are blank because the site HTML is the fallback; populate fields you want to override.
- Editing a heading replaces its rich HTML gradient styling with plain text. The original heading remains unchanged if that field is blank/unset. Prefer editing only fields you want to replace.
- **Do not** publish an empty value for a field unless you intend to hide its text. The editor only publishes fields you explicitly change.
- The existing site still depends on its original `styles.css`, `script.js`, and image/CV files in your GitHub repo.
- No backend is deployed or database connected by this ZIP alone; follow the setup steps.
- Supabase may send verification emails depending on authentication settings.

## Security
- No hardcoded passwords, privileged keys, or client-side-only access checks.
- Database row-level security checks administrator UUID for writes.
- Public content is read-only for anonymous visitors.
- Admin interface is publicly reachable but publishing is blocked without authenticated administrator authorization.
