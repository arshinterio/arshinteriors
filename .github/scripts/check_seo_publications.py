#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

TZ=ZoneInfo("Asia/Kolkata")
BASE="https://arshinterior.in"
REQUIRED_CTAS={"/estimator/","https://wa.me/919022104232","tel:+919022104232"}

def route(entry):
    return str(entry.get("path") or entry["slug"]).strip("/")

def fail(errors,message):
    errors.append(message)

def internal_file(site,path):
    clean=path.split("?",1)[0].split("#",1)[0].strip("/")
    candidate=site/clean if clean else site
    if candidate.is_dir():candidate=candidate/"index.html"
    elif not candidate.suffix:candidate=candidate/"index.html"
    return candidate

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--site",required=True)
    parser.add_argument("--queue",required=True)
    args=parser.parse_args()
    site=Path(args.site).resolve()
    queue_dir=Path(args.queue).resolve()
    errors=[]
    now=dt.datetime.now(TZ)
    today=now.date()
    try:manifest=json.loads((queue_dir/"queue.json").read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"::error::Cannot read SEO queue manifest: {exc}")
        return 1
    pages=manifest.get("pages",[])
    state_path=site/".github"/"ceiling-schedule-state.json"
    try:state=json.loads(state_path.read_text(encoding="utf-8")) if state_path.exists() else {}
    except Exception as exc:
        fail(errors,f"Publication state file is unreadable: {exc}")
        state={}
    ids=[p.get("content_id") for p in pages]
    slugs=[p.get("slug") for p in pages]
    paths=[route(p) for p in pages]
    if len(ids)!=len(set(ids)):fail(errors,"Duplicate content_id values in queue manifest.")
    if len(slugs)!=len(set(slugs)):fail(errors,"Duplicate slugs in queue manifest.")
    if len(paths)!=len(set(paths)):fail(errors,"Duplicate public paths in queue manifest.")
    seen_dates=set()
    last_date=None
    for item in pages:
        content_id=item.get("content_id",item.get("slug","(unknown)"))
        try:scheduled=dt.date.fromisoformat(item["scheduled_date"])
        except Exception:
            fail(errors,f"{content_id}: missing or invalid scheduled_date.")
            continue
        if last_date and scheduled<last_date:fail(errors,"Queue dates are not in chronological order.")
        last_date=scheduled
        status=item.get("status")
        if status not in {"draft","approved","scheduled","published","failed"}:
            fail(errors,f"{content_id}: unsupported queue status {status!r}.")
        if status in {"scheduled","approved"}:
            key=scheduled.isoformat()
            if key in seen_dates:fail(errors,f"More than one pending page is assigned to {key}.")
            seen_dates.add(key)
        page=site/route(item)/"index.html"
        exists=page.is_file()
        if status=="published" and not exists:
            fail(errors,f"{content_id}: manifest says published but {page.relative_to(site)} is missing.")
            continue
        if status=="scheduled" and exists:
            fail(errors,f"{content_id}: page exists but the queue is still marked scheduled.")
        if status=="failed" and scheduled<=today:
            fail(errors,f"{content_id}: due publication is marked failed.")
        if status in {"scheduled","approved"} and scheduled<today and not exists:
            fail(errors,f"{content_id}: overdue page for {scheduled} is missing.")
        if status in {"scheduled","approved"} and scheduled==today and now.time()>=dt.time(12,0) and not exists:
            fail(errors,f"{content_id}: today's page is still missing after the 12:00 IST grace period.")
        if not exists:continue
        text=page.read_text(encoding="utf-8")
        canonical=f"{BASE}/{route(item)}/"
        canonicals=re.findall(r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']',text,re.I)
        if canonicals!=[canonical]:
            fail(errors,f"{content_id}: canonical is missing, duplicated or incorrect.")
        descriptions=re.findall(r'<meta\b[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']',text,re.I)
        if len(descriptions)!=1 or not descriptions[0].strip():
            fail(errors,f"{content_id}: unique meta description is missing.")
        h1_count=len(re.findall(r"<h1\b",text,re.I))
        if h1_count!=1:fail(errors,f"{content_id}: expected one H1, found {h1_count}.")
        for cta in REQUIRED_CTAS:
            if cta not in text:fail(errors,f"{content_id}: CTA destination is missing: {cta}")
        if "class=\"action-button\"" not in text or not re.search(r"\.action-button\s*\{[^}]*background:",text):
            fail(errors,f"{content_id}: CTA button markup or visible button CSS is missing.")
        if not re.search(r"\.action-button:hover",text) or not re.search(r"\.action-button:focus-visible",text):
            fail(errors,f"{content_id}: CTA hover or keyboard-focus styling is missing.")
        if not re.search(r"@media\s*\(max-width:\s*760px\)",text) or not re.search(r"\.menu-toggle",text):
            fail(errors,f"{content_id}: responsive mobile navigation styling/control is missing.")
        images=re.findall(r"<img\b[^>]*>",text,re.I)
        if not images:fail(errors,f"{content_id}: no local visual is present.")
        for img in images:
            sm=re.search(r'\bsrc=["\']([^"\']+)["\']',img,re.I)
            am=re.search(r'\balt=["\']([^"\']*)["\']',img,re.I)
            if not sm or not am or not am.group(1).strip():
                fail(errors,f"{content_id}: image source or descriptive alt text is missing.")
                continue
            src=sm.group(1)
            if not src.startswith("/") or src.startswith("//"):
                fail(errors,f"{content_id}: visual must use a local site path, found {src}.")
            elif not (site/src.lstrip("/")).is_file():
                fail(errors,f"{content_id}: local visual file is missing: {src}.")
        links=re.findall(r'\bhref=["\']([^"\']+)["\']',text,re.I)
        for href in links:
            parts=urlsplit(href)
            if parts.scheme or href.startswith("//") or not href.startswith("/"):continue
            target=internal_file(site,parts.path)
            try:target.relative_to(site)
            except ValueError:
                fail(errors,f"{content_id}: link escapes the site tree: {href}.")
                continue
            if not target.exists():fail(errors,f"{content_id}: internal link does not resolve: {href}.")
        try:
            sitemap=ET.parse(site/"sitemap.xml").getroot()
            locs=[(e.text or "").strip() for e in sitemap.iter() if e.tag.endswith("loc")]
            if canonical not in locs:fail(errors,f"{content_id}: canonical URL is absent from sitemap.xml.")
        except Exception as exc:fail(errors,f"sitemap.xml is invalid or unreadable: {exc}")
        guide_index=(site/"guides"/"index.html").read_text(encoding="utf-8")
        if f'href="/{route(item)}/"' not in guide_index:
            fail(errors,f"{content_id}: page is missing from guides/index.html.")
    published_today=[p for p in pages if p.get("status")=="published" and p.get("actual_published_date")==today.isoformat()]
    if len(published_today)>1:fail(errors,"More than one manifest entry is marked published today.")
    if published_today:
        item=published_today[0]
        if state.get("last_published_date")!=today.isoformat() or state.get("last_published_slug")!=item.get("slug"):
            fail(errors,"Today's manifest entry and publication state file do not match.")
    event_path=os.environ.get("GITHUB_EVENT_PATH")
    if os.environ.get("GITHUB_EVENT_NAME")=="workflow_run" and event_path and Path(event_path).exists():
        try:
            event=json.loads(Path(event_path).read_text(encoding="utf-8"))
            run=event.get("workflow_run",{})
            if run.get("conclusion") not in {"success","neutral","skipped"}:
                fail(errors,f"Publisher workflow completed with conclusion: {run.get('conclusion')}.")
        except Exception as exc:fail(errors,f"Could not inspect publisher workflow result: {exc}")
    if errors:
        for error in errors:print("::error::"+error)
        print(f"SEO publication verification failed with {len(errors)} issue(s).")
        return 1
    pending=sum(1 for p in pages if p.get("status") in {"scheduled","approved"})
    print(f"SEO queue verified at {now.isoformat(timespec='minutes')}: {len(pages)} records, {pending} pending, no missing or invalid published pages.")
    return 0

if __name__=="__main__":
    sys.exit(main())
