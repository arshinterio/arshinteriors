# Active false-ceiling page schedule

This branch is a draft-only queue. GitHub Pages publishes from `main`; do not merge this branch into the published site.

The GitHub Actions workflow publishes at most one page per local day at 9:15 AM Asia/Kolkata. The first scheduled date is 8 October 2026. It creates the guide, updates the planning guide directory and sitemap, then commits to `main`. The workflow runs on GitHub-hosted runners, so the owner's PC can be off.

Exactly five pages are active. Each page focuses on a distinct system and homeowner intent; related phrases are used only where the content answers that intent.

01. Gypsum False Ceiling Contractor in Katraj, Pune: Height, Lights and Layout
02. POP False Ceiling Work in Wagholi, Pune: Profiles, Edges and Lighting
03. Gypsum Ceiling Contractor in Dhayari, Pune: Board Joints and Paint Finish
04. Grid Ceiling Contractor in Sinhagad Road, Pune: Access and Services
05. PVC False Ceiling in Kothrud, Pune: Panel Choice and Price Factors

The other 29 prepared drafts are preserved in `future-drafts.json` and are not part of the active schedule. They will not publish unless moved into `queue.json` later.

The publisher uses the first queued slug not already present in the site and stops after one guide per local calendar date.
