# Arsh Interiors scheduled SEO publishing queue

This branch stores the unpublished content manifest and publishing code. GitHub Pages publishes from `main`; do not merge this branch into the live site.

The GitHub-hosted workflow publishes at most one eligible page per Asia/Kolkata date at 9:15 AM. It honors each record's explicit `scheduled_date`, writes a page to `main`, updates the guide index and sitemap, records publication metadata, and syncs manifest status. The owner's PC can be off.

## Reserved publication schedule

- Five earlier ceiling pages are marked published for 9–13 October 2026.
- The existing 29 ceiling-focused drafts remain scheduled in order for 15 October–12 November 2026. 14 October is intentionally unused because its 9:15 AM slot had already passed when this queue was prepared.
- Fifteen new mixed-service homeowner guides are appended for 13–27 November 2026.
- The manifest contains 49 records. The publisher will not expose future pages early and stops after one page per local calendar date.

## Appended batch: 13–27 November 2026

1. 2026-11-13 — Gypsum Partition Planning in Hinjawadi, Pune: Layout, Services and Finish (gypsum-partition; Hinjawadi, Pune)
2. 2026-11-14 — Electrical Renovation Planning in Pune: Make a Room-by-Room Point Schedule (electrical; Pune)
3. 2026-11-15 — How to Choose Paint Sheen by Room Use: A Pune Homeowner's Guide (painting; Pune)
4. 2026-11-16 — Wardrobe Storage Layout in Viman Nagar, Pune: Plan the Inside Before the Doors (custom-furniture; Viman Nagar, Pune)
5. 2026-11-17 — Modular Kitchen Layout Planning in Pune: Start with Workflow and Clearances (modular-kitchen; Pune)
6. 2026-11-18 — Living-Room Wall Moulding Layout in Pune: Plan Around Openings and Furniture (wall-moulding; Pune)
7. 2026-11-19 — A Layered Living-Room Lighting Plan for Pune Homes: Ambient, Task and Accent (electrical-lighting; Pune)
8. 2026-11-20 — Coordinating Ceiling, Electrical, Painting and Carpentry Work in Pune (interior-planning; Pune)
9. 2026-11-21 — Custom Furniture Finishes: Compare Laminate, Veneer and Painted Surfaces (custom-furniture; Pune)
10. 2026-11-22 — Modular Kitchen Materials and Hardware Checklist for Pune Homeowners (modular-kitchen; Pune)
11. 2026-11-23 — New Flat Interior Planning in Pune: A Practical Sequence Before Work Starts (complete-interiors; Pune)
12. 2026-11-24 — Planning an Interior Renovation While Living at Home in Pune (renovation-planning; Pune)
13. 2026-11-25 — Commercial Interior Coordination Checklist for Pune Offices, Shops and Clinics (commercial-interiors; Pune)
14. 2026-11-26 — What to Prepare Before Requesting an Interior Project Estimate in Pune (project-estimate; Pune)
15. 2026-11-27 — Bungalow Interior Planning in Pune: Set the Scope Room by Room (complete-interiors; Pune)

The guides use locally stored original planning illustrations, contextual links verified in the current site tree, styled accessible CTAs, canonical URLs and Article structured data. Locality references are homeowner guidance, not claims about address coverage or site conditions. `future-drafts.json` remains an earlier backup snapshot and is not read by the publisher.

A separate GitHub Actions workflow checks schedule status, published files, metadata, canonical, single H1, local visual and alt text, CTA styles and destinations, guide index, sitemap and internal links every 30 minutes. Errors show as failed GitHub Actions runs; notification delivery follows the owner's GitHub settings.
