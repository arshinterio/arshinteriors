# Active false-ceiling page schedule

This branch is a draft-only queue. GitHub Pages publishes from `main`; do not merge this branch into the published site.

The GitHub Actions workflow publishes at most one page per local day at 9:15 AM Asia/Kolkata. It creates the guide, updates the planning guide directory and sitemap, then commits to `main`. The workflow runs on GitHub-hosted runners, so the owner's PC can be off.

The active queue contains 34 page records. The first five pages below have already been published. The 29 prepared drafts have now been appended to `queue.json` and are active for daily publication. Each page focuses on a distinct ceiling system, locality and homeowner intent; related phrases are used only where the content answers that intent.

01. Gypsum False Ceiling Contractor in Katraj, Pune: Height, Lights and Layout
02. POP False Ceiling Work in Wagholi, Pune: Profiles, Edges and Lighting
03. Gypsum Ceiling Contractor in Dhayari, Pune: Board Joints and Paint Finish
04. Grid Ceiling Contractor in Sinhagad Road, Pune: Access and Services
05. PVC False Ceiling in Kothrud, Pune: Panel Choice and Price Factors

`future-drafts.json` is retained as a backup copy of the 29 queued drafts; the publisher reads `queue.json`, not the backup.

The publisher uses the first queued slug not already present in the site and stops after one guide per local calendar date.
