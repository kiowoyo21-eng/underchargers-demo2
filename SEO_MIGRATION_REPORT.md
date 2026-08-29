# Underchargers SEO & Security Migration Patch — v8.11

## Added
- Crawlable canonical pages: /about/, /services/, /franchise/, /contact/, /book/
- 301 redirects for known legacy business URLs
- robots.txt and sitemap.xml
- Canonical, robots, Open Graph and Twitter metadata on homepage
- Organization, WebSite and three AutoRepair branch JSON-LD entities
- noindex on thank-you and 404 pages
- Security response headers: HSTS, nosniff, SAMEORIGIN, strict referrer policy and restricted browser permissions

## Security migration rule
Do not copy the old WordPress PHP installation, plugins, wp-admin, wp-includes, uploads containing executable files, or suspicious PHP into production. This patch is a clean static-site layer.

## Known compromised/spam indexing
Public search currently exposes injected/spam blog content. Do not preserve those pages as content. The known blog/category/template routes in this patch redirect to the legitimate site. A complete spam-URL removal/410 list should be generated from the WordPress database/search index before final production cutover.

## Before production
1. Test all redirects on preview.
2. Verify domain points to the intended deployment only after backup.
3. Verify robots.txt and sitemap.xml over HTTPS.
4. Add/verify Google Search Console ownership when access is available and submit sitemap.
5. Monitor 404s and rankings after launch; add one-to-one redirects for any legitimate legacy URLs discovered.
