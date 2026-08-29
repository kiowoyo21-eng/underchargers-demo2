# Underchargers v8.12 — SEO cleanup (staging)

This build follows the WordPress database + public-index audit.

- Legitimate legacy URLs use 301s.
- Known hacked/spam and template URLs are not redirected to the homepage.
- HostGator production 410 rules are included separately.
- This staging build is intentionally NOINDEX.

See `SEO_MIGRATION_REPORT.md` and `LEGACY_URL_INVENTORY.csv`.
