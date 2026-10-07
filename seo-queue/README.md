# Active false-ceiling page schedule

This branch is a draft-only queue. GitHub Pages publishes from `main`; do not merge this branch into the published site.

The GitHub Actions workflow publishes at most one page per local day, beginning with its next scheduled run on **8 October 2026 at 9:15 AM Asia/Kolkata**. It creates the guide, updates the guide directory and sitemap, then commits to `main`. The workflow runs on GitHub-hosted runners, so the owner's PC can be off.

Exactly five pages are active:

01. Gypsum False Ceiling in Katraj, Pune: Height, Lights and Layout
02. POP False Ceiling in Wagholi, Pune: Plan Profiles and Edges
03. Gypsum False Ceiling in Dhayari, Pune: Board Joints and Paint Finish
04. Grid Ceiling on Sinhagad Road, Pune: Plan Access and Services
05. Gypsum or POP False Ceiling in Kothrud, Pune: How to Compare

The other 29 prepared drafts are preserved in `future-drafts.json` and are not part of the active schedule. They will not publish unless moved into `queue.json` later.

The publisher uses the first queued slug not already present in the site and stops after one guide per local calendar date.
