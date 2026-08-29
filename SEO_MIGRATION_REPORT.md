# Underchargers v8.12 SEO Cleanup — production-ready

Database audit found **13 published WordPress pages**, **5 demo/template posts**, and **208 compromised/spam published posts**.

## Key migration decisions
- Preserve legitimate business URLs with one-hop 301 redirects where the slug changes.
- Keep `/about/`, `/services/`, and `/franchise/` as real crawlable canonical pages with clean replacement content.
- Do **not** redirect hacked/spam posts, `/blog/`, or `/category/general/` to the homepage. On Vercel they intentionally fall through to a real 404. At HostGator production cutover, the supplied rules return **410 Gone** for every known compromised/demo URL.
- `/our-staff/` -> `/about/`; `/thanks/` -> `/thank-you`; `/welcome/` -> `/contact/`.
- Clean static deployment only. Never copy old WordPress core/plugins/PHP into production.

## This package
- PRODUCTION READY: index/follow enabled; sitemap points to underchargers.com.
- Includes `LEGACY_URL_INVENTORY.csv` and `HOSTGATOR_PRODUCTION.htaccess`.
- Includes local `hero-video.mp4` so the deployment is self-contained.

## Important
The HostGator rules file is intentionally not named `.htaccess`. Do not activate it until the final production cutover and backup are complete.
