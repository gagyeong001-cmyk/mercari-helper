# Mercari email watch (experimental)

This optional GitHub Actions worker runs separately from the existing Render app.

1. Create a Resend account and verify a sending domain. Resend generally requires a verified sender domain for sending to arbitrary recipients; its test sender has restrictions.
2. In GitHub repository Settings → Secrets and variables → Actions, add `APIFY_TOKEN`, `RESEND_API_KEY`, `ALERT_EMAIL_TO` (your inbox), and `ALERT_EMAIL_FROM` (a sender address on the verified domain). Do not commit these secrets.
3. Edit `watch-config.json` to set query, maxPrice (JPY), and enabled:true. The Apify actor's search schema and output still need live verification.
4. Merge the PR, then run Actions → Mercari email watch → Run workflow. The scheduled job is best effort, about every 30 minutes; GitHub may delay or skip runs.
5. The first successful scan establishes a baseline without sending notifications. Subsequent newly observed matching listings are emailed, with IDs persisted in `watch-state.json`.
6. Ensure GitHub Actions workflow has write permission to save state. Check the workflow logs for failures.

**Important:** Resend may require domain ownership, which can make email setup inconvenient. If you do not have a domain, consider a different email provider or an app-based push service instead. Apify may incur charges and Mercari may restrict automated access. Neither continuous operation nor listing freshness is guaranteed.
