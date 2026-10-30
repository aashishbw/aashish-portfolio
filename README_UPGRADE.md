# AU Studio — Five-feature upgrade

## Install
1. Back up your existing GitHub repository.
2. Upload the **contents** of this ZIP to the root of `aashishbw/aashish-portfolio` (not the ZIP itself). Keep existing assets such as profile photos and CV; do not delete unrelated files.
3. Keep your **already configured** `site-config.js` on GitHub. The ZIP contains a blank template; do NOT overwrite your configured file with it. This package intentionally does not include `site-config.js`.
4. In Supabase SQL Editor run `supabase-upgrade.sql` once.
5. In Supabase Storage create a **public** bucket `portfolio-media` if it does not already exist. Existing upload policies from your original setup must be present.
6. Wait for Vercel deployment and hard-refresh `/admin/`.

## Features
- Media & CV: choose destination, upload JPG/PNG/WebP/PDF (max 10MB), then **Publish changes**. The uploaded file URL is saved to the draft.
- Blog manager: create/edit/delete posts, toggle Published, save; posts display at `/articles.html`. Blog publishing is immediate and separate from homepage Publish changes. Add a navigation link to Articles if desired.
- SEO: edit metadata fields and click Publish changes. Note client-side SEO is not sufficient for all crawlers/social previews; static/server-rendered tags are recommended for complete SEO.
- Analytics: anonymous daily pageview totals, no cookies; counts requests, not unique visitors; ad blockers may prevent counting. Dashboard is visible to admins only.

## Security and limitations
- Do not expose a Supabase service-role key in browser files.
- Admin login still relies on your existing Supabase Authentication and `admin_users` RLS.
- Public bucket assets are accessible to anyone with the URL.
- Blog post body is rendered as **plain text** to prevent HTML injection.
- For production, add rate limiting to analytics RPC through a gateway/edge function; public RPC may be called by bots or malicious clients, inflating counts.
- Existing homepage featured blog section remains independent of the new Articles page.
