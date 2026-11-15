# Mercari Telegram watch (experimental)

This is an optional GitHub Actions worker. It does not modify the existing Render web app.

1. In GitHub repository Settings → Secrets and variables → Actions, add repository secrets `APIFY_TOKEN`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_CHAT_ID`. Never commit these values.
2. Create a Telegram bot with @BotFather and send it /start. Find your chat ID using Telegram Bot API getUpdates or a trusted ID lookup. Keep the bot token private.
3. Edit `watch-config.json`: add searches, set maximum price in JPY, and change `enabled` to `true`. Search query syntax and returned fields MUST be tested with the existing Apify actor before relying on this.
4. Merge this PR into main, then use Actions → Mercari Telegram watch → Run workflow to test. The schedule runs approximately every 30 minutes, but GitHub may delay or skip scheduled jobs.
5. First successful scan records existing listings without notifying. Later scans notify only newly observed matching listings. State is stored in `watch-state.json` committed by the workflow. Disable all watches to stop scanning.

Cautions: Apify usage can cost money; the actor's search schema has not been verified. Mercari may block automated retrieval, and use must comply with relevant terms. This is best-effort monitoring, not guaranteed real-time 24/7 uptime. Workflow must have permission to write repository contents; repository settings can restrict it. The first scan may miss listings that appear and disappear between runs. Do not store tokens in the public config.
