#!/usr/bin/env python3
import argparse
import datetime as dt
import html
import json
import os
import re
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zoneinfo import ZoneInfo

TZ = ZoneInfo("Asia/Kolkata")
BASE = "https://arshinterior.in"
ASSET = "/ceiling-services-pune/ceiling-systems-comparison.svg"
ACTION_CSS = """
:root{--coral:#ff6b6b;--coral-dark:#e85555;--ink:#111;--paper:#faf9f8;--muted:#5f5f5f;--line:#eee4e1;--white:#fff}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.75 'Plus Jakarta Sans',Arial,sans-serif;padding-top:76px}
a{color:var(--coral-dark)}.site-header{position:fixed;z-index:20;top:0;left:0;right:0;background:#fff;box-shadow:0 2px 16px rgba(17,17,17,.07)}
.header-inner{max-width:1100px;margin:auto;min-height:72px;padding:12px 22px;display:flex;align-items:center;justify-content:space-between;gap:18px}
.brand{display:flex;align-items:center;gap:9px;color:var(--ink);font-weight:800;text-decoration:none}.brand-mark{color:var(--coral-dark);font-size:1.3rem}
.site-nav{display:flex;align-items:center;gap:22px}.site-nav a{color:#444;text-decoration:none;font-weight:650}.site-nav a:hover,.site-nav a:focus-visible{color:var(--coral-dark)}.site-nav a.nav-cta{display:inline-flex;align-items:center;justify-content:center;padding:10px 15px;border:2px solid var(--coral);border-radius:10px;background:var(--coral);color:#fff;font-weight:800;box-shadow:0 5px 14px rgba(255,107,107,.24)}.site-nav a.nav-cta:hover{border-color:var(--coral-dark);background:var(--coral-dark);color:#fff}.site-nav a.nav-cta:focus-visible{outline:3px solid #111;outline-offset:3px}
.menu-toggle{display:none;border:1px solid var(--line);border-radius:10px;background:#fff;padding:9px 12px;font:inherit;font-weight:700;color:var(--ink)}
main{max-width:930px;margin:35px auto 70px;padding:0 22px}.breadcrumb{font-size:.88rem;color:var(--muted);margin-bottom:12px}.breadcrumb a{color:var(--coral-dark)}
.eyebrow{color:var(--coral-dark);font-size:.78rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin:12px 0 6px}
h1,h2,h3{line-height:1.25}h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.15rem,5.2vw,3.5rem);letter-spacing:-.025em;margin:8px 0 14px}
h2{font-size:1.55rem;margin:0 0 12px}h3{font-size:1.15rem;margin:18px 0 7px}
.lead{font-size:1.12rem;color:#454545;line-height:1.8;max-width:820px}.published{font-size:.9rem;color:var(--muted);margin:15px 0 23px}
.card{background:var(--white);border:1px solid var(--line);border-radius:20px;box-shadow:0 12px 32px rgba(30,20,20,.045);padding:26px;margin:22px 0}
.hero-image{display:block;width:100%;height:auto;border-radius:13px;border:1px solid var(--line);background:#fff}.image-note{color:var(--muted);font-size:.86rem;margin:10px 0 0}
.cta-box{background:#fff;border:1px solid #f2d1d1;border-radius:20px;padding:24px;box-shadow:0 12px 30px rgba(255,107,107,.09);margin:26px 0}
.cta-box p{color:#555;margin:6px 0 16px}.cta-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.action-button{min-height:52px;display:flex;align-items:center;justify-content:center;padding:13px 18px;border-radius:12px;border:2px solid var(--coral);background:var(--coral);color:#fff!important;text-decoration:none;font-weight:800;text-align:center;box-shadow:0 5px 14px rgba(255,107,107,.2);transition:background .2s ease,transform .2s ease}
.action-button:hover{background:var(--coral-dark);border-color:var(--coral-dark);transform:translateY(-1px)}
.action-button:focus-visible,.menu-toggle:focus-visible,.site-nav a:focus-visible{outline:3px solid #111;outline-offset:3px}
.content-section{margin:28px 0}.content-section p{color:#3f3f3f}.checklist{padding-left:1.25rem}.checklist li{margin:6px 0}
.local-note{border-left:4px solid var(--coral);background:#fff;padding:17px 20px;border-radius:0 12px 12px 0;color:#414141}
.related-links{display:flex;flex-wrap:wrap;gap:10px}.related-links a{display:inline-block;border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 13px;font-weight:700;text-decoration:none}
footer{background:#111;color:#ddd;padding:30px 22px}.footer-inner{max-width:930px;margin:auto}footer p{margin:5px 0}footer a{color:#ff9a9a}
@media(max-width:760px){.header-inner{min-height:66px;padding:9px 16px}.menu-toggle{display:block}.site-nav{display:none;position:absolute;top:66px;left:0;right:0;background:#fff;box-shadow:0 12px 18px rgba(0,0,0,.09);padding:18px 22px 22px;flex-direction:column;align-items:stretch;gap:0}.site-nav.open{display:flex}.site-nav a{padding:11px 0;border-bottom:1px solid #f0eeee}.site-nav a.nav-cta{width:max-content;margin-top:10px;padding:11px 16px;border:2px solid var(--coral);border-radius:10px}.cta-actions{grid-template-columns:1fr}.action-button{width:100%}main{padding:0 16px;margin-top:25px}.card,.cta-box{padding:20px;border-radius:16px}}
"""
PAGE_TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>@@seo@@</title><meta name="description" content="@@description@@"><link rel="canonical" href="@@canonical@@"><meta name="robots" content="index,follow"><meta name="theme-color" content="#ff6b6b">
<meta property="og:type" content="article"><meta property="og:title" content="@@seo@@"><meta property="og:description" content="@@description@@"><meta property="og:url" content="@@canonical@@"><meta property="og:image" content="@@imageurl@@"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>@@css@@
.card img{display:block;width:100%}.faq-item{padding:12px 0;border-top:1px solid #eee}.faq-item h3{font-size:1.05rem}</style>
<script type="application/ld+json">@@schema@@</script></head><body data-content-engine="arsh-seo-v2">
<header class="site-header"><div class="header-inner"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">▰</span>Arsh Interiors</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" id="menu-toggle">Menu</button><nav class="site-nav" id="site-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/services/">Services</a><a href="/False-Ceiling-in-Pune/">False Ceilings</a><a href="/gypsum-pop-work/">Gypsum &amp; POP</a><a href="/guides/">Guides</a><a class="nav-cta" href="/estimator/">Cost Calculator</a></nav></div></header>
<main><p class="breadcrumb"><a href="/">Home</a> / <a href="/guides/">Planning Guides</a> / @@title@@</p><p class="eyebrow">@@service@@ · Pune homeowner planning</p><h1>@@h1@@</h1><p class="lead">@@intro@@</p><p class="published">Published @@date@@ · @@system@@</p>
<section class="cta-box" aria-labelledby="cta-title"><h2 id="cta-title">@@ctatitle@@</h2><p>@@ctaintro@@</p><div class="cta-actions"><a class="action-button" href="/estimator/">Cost Calculator</a><a class="action-button" href="https://wa.me/919022104232" rel="noopener">WhatsApp</a><a class="action-button" href="tel:+919022104232">Call +91 9022104232</a></div></section>
<figure class="card"><img class="hero-image" src="@@image@@" alt="@@alt@@" width="1200" height="470" loading="eager"><figcaption class="image-note">@@caption@@</figcaption></figure>
@@sections@@<section class="card"><h2>Local planning note</h2><p>@@localnote@@</p></section><section class="card" aria-labelledby="faq-heading"><h2 id="faq-heading">Frequently asked questions</h2>@@faqs@@</section><section class="card"><h2>Related Arsh Interiors pages</h2><div class="related-links">@@links@@</div></section></main>
<footer><div class="footer-inner"><strong>Arsh Interiors · Pune</strong><p>Interior planning information based on published service pages. Confirm scope and availability for your address.</p><p><a href="https://wa.me/919022104232" rel="noopener">WhatsApp</a> · <a href="tel:+919022104232">Call +91 9022104232</a></p></div></footer>
<script>const b=document.getElementById('menu-toggle'),n=document.getElementById('site-nav');b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));n.classList.toggle('open',!o);});n.addEventListener('click',e=>{if(e.target.closest('a')){b.setAttribute('aria-expanded','false');n.classList.remove('open');}});</script></body></html>"""
HUB_TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ceiling Services Across Pune Areas | Arsh Interiors</title>
<meta name="description" content="Explore ceiling system planning pages for Pune areas, including gypsum, POP, PVC and grid ceilings from Arsh Interiors. Confirm exact address availability.">
<link rel="canonical" href="https://arshinterior.in/ceiling-services-pune/">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>$css .hub-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.hub-card{background:#fff;padding:20px;border-radius:16px;border:1px solid var(--line);box-shadow:0 8px 24px rgba(20,10,10,.04)}.hub-card h2{font-size:1.15rem}.hub-card p{color:var(--muted)}</style></head>
<body><header class="site-header"><div class="header-inner"><a class="brand" href="/"><span class="brand-mark">▰</span>Arsh Interiors</a><button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav class="site-nav" id="site-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/services/">Services</a><a href="/False-Ceiling-in-Pune/">False Ceilings</a><a href="/gypsum-pop-work/">Gypsum &amp; POP</a><a href="/guides/">Guides</a><a href="/estimator/">Cost Calculator</a></nav></div></header>
<main><p class="breadcrumb"><a href="/">Home</a> / Pune Ceiling Services</p><p class="eyebrow">Ceiling systems · Pune</p><h1>Ceiling planning by Pune area</h1>
<p class="lead">Browse practical pages on gypsum, POP, PVC and grid ceiling decisions. Each page focuses on a different planning question. Service availability depends on the exact address and project scope, so please confirm before scheduling a site visit.</p>
<figure class="card"><img class="hero-image" src="/ceiling-services-pune/ceiling-systems-comparison.svg" alt="Original diagram comparing gypsum, POP, PVC and modular grid ceiling systems for homeowner planning"><figcaption class="image-note">Illustrative comparison, not a photograph of a completed project.</figcaption></figure>
<div class="hub-list">$cards</div>
<section class="cta-box"><h2>Need a ceiling estimate?</h2><p>Share your dimensions and ceiling-system preference, then confirm address availability.</p><div class="cta-actions"><a class="action-button" href="/estimator/">Cost Calculator</a><a class="action-button" href="https://wa.me/919022104232">WhatsApp</a><a class="action-button" href="tel:+919022104232">Call</a></div></section>
<p>Also review <a href="/False-Ceiling-in-Pune/">false ceiling services</a>, <a href="/gypsum-pop-work/">gypsum and POP work</a> and the <a href="/guides/">planning guides</a>.</p></main>
<footer><div class="footer-inner"><strong>Arsh Interiors · Pune</strong><p><a href="https://wa.me/919022104232">WhatsApp</a> · <a href="tel:+919022104232">Call +91 9022104232</a></p></div></footer>
<script>const b=document.getElementById('menu-toggle'),n=document.getElementById('site-nav');b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));n.classList.toggle('open',!o);});n.addEventListener('click',e=>{if(e.target.closest('a')){b.setAttribute('aria-expanded','false');n.classList.remove('open');}});</script>
</body></html>
"""
def public_path(entry):
    return str(entry.get("path") or entry["slug"]).strip("/")

def article_sections(entry):
    pieces=[]
    for section in entry.get("sections", []):
        checks="".join("<li>"+html.escape(item)+"</li>" for item in section.get("checks", []))
        paras="".join("<p>"+html.escape(p)+"</p>" for p in section.get("body", []))
        pieces.append('<section class="content-section"><h2>'+html.escape(section["heading"])+'</h2>'+paras+'<h3>Quick check</h3><ul class="checklist">'+checks+'</ul></section>')
    return "\n".join(pieces)

def article_faqs(entry):
    return "\n".join('<div class="faq-item"><h3>'+html.escape(x["question"])+'</h3><p>'+html.escape(x["answer"])+'</p></div>' for x in entry.get("faqs", []))

def rendered_page(entry, today):
    route=public_path(entry); canonical=f"{BASE}/{route}/"
    image_path=(f"/{route}/{Path(entry['visual_file']).name}" if entry.get("visual_file") else ASSET)
    date_label=today.strftime("%-d %B %Y") if os.name!="nt" else today.strftime("%d %B %Y").lstrip("0")
    schema={"@context":"https://schema.org","@type":"Article","headline":entry["title"],"description":entry["description"],"datePublished":today.isoformat(),"dateModified":today.isoformat(),"mainEntityOfPage":canonical,"image":BASE+image_path,"author":{"@type":"Organization","name":"Arsh Interiors"},"publisher":{"@type":"Organization","name":"Arsh Interiors"}}
    values={"@@seo@@":html.escape(entry.get("seo_title",entry["title"]+" | Arsh Interiors"),quote=True),"@@description@@":html.escape(entry["description"],quote=True),"@@canonical@@":canonical,"@@imageurl@@":BASE+image_path,"@@css@@":ACTION_CSS,"@@schema@@":json.dumps(schema,ensure_ascii=False).replace("</","<\\/"),"@@title@@":html.escape(entry["title"]),"@@service@@":html.escape(entry.get("service_name","Interior planning")),"@@h1@@":html.escape(entry.get("h1",entry["title"])),"@@intro@@":html.escape(entry["intro"]),"@@date@@":html.escape(date_label),"@@system@@":html.escape(entry.get("system",entry.get("category","Planning guide"))),"@@ctatitle@@":html.escape(entry.get("cta_heading","Discuss your interior project")),"@@ctaintro@@":html.escape(entry.get("cta_intro","Share project details to begin a discussion.")),"@@image@@":image_path,"@@alt@@":html.escape(entry.get("visual_alt","Illustrative interior planning visual."),quote=True),"@@caption@@":html.escape(entry.get("visual_caption","Original planning illustration; verify dimensions and product details on site.")),"@@sections@@":article_sections(entry),"@@localnote@@":html.escape(("This is general homeowner guidance for "+entry.get("locality","Pune")+"; it does not describe local building conditions or confirm address coverage. Contact Arsh Interiors to confirm current availability and the exact project scope.") if entry.get("locality","Pune").lower()!="pune" else "This is general planning guidance for a Pune project, not a site survey or a promise of service availability. Contact Arsh Interiors to confirm current scope and availability for your address."),"@@faqs@@":article_faqs(entry),"@@links@@":"".join('<a href="'+html.escape(x["href"],quote=True)+'">'+html.escape(x["text"])+'</a>' for x in entry.get("related_links",[]))}
    page=PAGE_TEMPLATE
    for key,value in values.items(): page=page.replace(key,value)
    return page

def write_output(result, page_path="", entry=None, queue_changed=False):
    output=os.environ.get("GITHUB_OUTPUT")
    if output:
        with open(output,"a",encoding="utf-8") as f:
            f.write(f"result={result}\nqueue_changed={'true' if queue_changed else 'false'}\n")
            if page_path: f.write(f"page_path={page_path}\n")
            if entry:
                f.write(f"page_category={entry.get('category','ceiling')}\npage_slug={entry['slug']}\nscheduled_date={entry.get('scheduled_date','')}\n")
    print(f"Queue result: {result}",file=sys.stderr)

def build_hub(site, pages, today):
    published=[item for item in pages if item.get("category","ceiling")=="ceiling" and (site/public_path(item)/"index.html").exists()]
    cards=['<article class="hub-card"><p class="eyebrow">'+html.escape(item.get("system","Ceiling planning"))+'</p><h2><a href="/'+html.escape(public_path(item))+'/">'+html.escape(item["title"])+'</a></h2><p>'+html.escape(item["description"])+'</p></article>' for item in published]
    target=site/"ceiling-services-pune"/"index.html";target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(HUB_TEMPLATE.replace("$css",ACTION_CSS).replace("$cards","\n".join(cards)),encoding="utf-8")

def add_guides_index_link(path, entry):
    content=path.read_text(encoding="utf-8");href="/"+public_path(entry)+"/"
    if 'href="'+href+'"' in content:return
    card=('    <article class="card">\n        <h2><a href="'+html.escape(href,quote=True)+'">'+html.escape(entry["title"])+'</a></h2>\n        <p>'+html.escape(entry["description"])+'</p>\n        <a href="'+html.escape(href,quote=True)+'">Read the guide →</a>\n    </article>\n')
    marker='    <article class="card">'
    if marker in content:content=content.replace(marker,card+marker,1)
    elif "</main>" in content:content=content.replace("</main>",card+"</main>",1)
    else:raise RuntimeError("Could not find a safe insertion point in guides/index.html")
    path.write_text(content,encoding="utf-8")

def add_sitemap_url(sitemap_path, url_path, today):
    sitemap=sitemap_path.read_text(encoding="utf-8")
    date=today.isoformat()
    loc=BASE+"/"+url_path.strip("/")+"/"
    pattern=re.compile(r"<url>\s*<loc>"+re.escape(loc)+r"</loc>.*?</url>",re.S)
    entry="    <url>\n        <loc>"+loc+"</loc>\n        <lastmod>"+date+"</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>0.7</priority>\n    </url>"
    if pattern.search(sitemap):
        sitemap=pattern.sub(entry,sitemap,count=1)
    else:
        sitemap=sitemap.replace("</urlset>",entry+"\n</urlset>")
    sitemap_path.write_text(sitemap,encoding="utf-8")

def add_home_link(path):
    content=path.read_text(encoding="utf-8")
    marker='id="ceiling-area-pages-link"'
    if marker not in content:
        section='''\n<section id="ceiling-area-pages-link" style="padding:38px 18px;background:#faf9f8"><div style="max-width:1100px;margin:auto;background:#fff;border:1px solid #f0d5d5;border-radius:18px;padding:22px;box-shadow:0 8px 24px rgba(255,107,107,.08)"><h2 style="font-family:'Playfair Display',serif;color:#111;margin:0 0 8px">Ceiling planning by Pune area</h2><p style="color:#555">Explore practical gypsum, POP, PVC and grid ceiling notes for Pune neighbourhoods, with address availability confirmed before a visit.</p><a href="/ceiling-services-pune/" style="display:inline-flex;background:#ff6b6b;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:800">Browse ceiling pages</a></div></section>\n'''
        if "</main>" in content:
            content=content.replace("</main>",section+"</main>",1)
        else:
            content=content.replace("</body>",section+"</body>",1)
        path.write_text(content,encoding="utf-8")

def main():
    parser=argparse.ArgumentParser();parser.add_argument("--site",required=True);parser.add_argument("--queue",required=True);parser.add_argument("--dry-run",default="false");args=parser.parse_args()
    site=Path(args.site).resolve();queue_dir=Path(args.queue).resolve();today=dt.datetime.now(TZ).date()
    manifest_path=queue_dir/"queue.json";manifest=json.loads(manifest_path.read_text(encoding="utf-8"));pages=manifest["pages"]
    state_path=site/".github"/"ceiling-schedule-state.json"
    try:state=json.loads(state_path.read_text(encoding="utf-8")) if state_path.exists() else {}
    except json.JSONDecodeError:state={}
    changed=False;history={x.get("slug"):x for x in state.get("published_posts",[]) if x.get("slug")}
    for item in pages:
        target=site/public_path(item)/"index.html"
        if target.exists() and item.get("status")!="published":
            item["status"]="published";record=history.get(item["slug"],{})
            item["actual_published_date"]=record.get("actual_published_date") or item.get("scheduled_date")
            item["actual_published_at"]=record.get("actual_published_at") or item.get("actual_published_date","")+"T09:15:00+05:30"
            item["last_processing_result"]="existing_page_reconciled";changed=True
        elif item.get("status")=="published" and not target.exists():raise RuntimeError("Manifest says published but page is missing: "+str(target))
    if state.get("last_published_date")==today.isoformat():
        if changed:manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
        write_output("already_published",queue_changed=changed);return
    sitemap_path=site/"sitemap.xml"
    if sitemap_path.exists():
        raw=sitemap_path.read_text(encoding="utf-8")
        if today.isoformat() in raw and re.search(r"<loc>https://arshinterior\\.in/(?:guides/)?[^<]+</loc>\\s*<lastmod>"+re.escape(today.isoformat()),raw):
            if changed:manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
            write_output("already_published",queue_changed=changed);return
    candidate=None
    for item in sorted(pages,key=lambda x:x.get("scheduled_date","9999-12-31")):
        if item.get("status")!="published" and not (site/public_path(item)/"index.html").exists():candidate=item;break
    if candidate is None:
        if changed:manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
        write_output("queue_empty",queue_changed=changed);return
    scheduled=dt.date.fromisoformat(candidate["scheduled_date"])
    if scheduled>today:
        if changed:manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
        write_output("not_due",entry=candidate,queue_changed=changed);return
    route=public_path(candidate);page_rel=route+"/index.html"
    if str(args.dry_run).lower() in ("true","1","yes"):write_output("dry_run",page_rel,candidate,changed);return
    destination=site/route
    if destination.exists():raise RuntimeError("Refusing to overwrite an existing page: "+str(destination))
    destination.mkdir(parents=True)
    image_source=(queue_dir/candidate["visual_file"]) if candidate.get("visual_file") else queue_dir/"ceiling-systems-comparison.svg"
    if not image_source.exists():raise RuntimeError("Required local illustration is missing: "+str(image_source))
    shutil.copyfile(image_source,destination/image_source.name)
    (destination/"index.html").write_text(rendered_page(candidate,today),encoding="utf-8")
    add_guides_index_link(site/"guides"/"index.html",candidate)
    if candidate.get("category","ceiling")=="ceiling":
        build_hub(site,pages,today);add_home_link(site/"index.html");add_sitemap_url(sitemap_path,"ceiling-services-pune/",today)
    add_sitemap_url(sitemap_path,route,today)
    now=dt.datetime.now(TZ);published_at=now.isoformat(timespec="seconds")
    candidate.update({"status":"published","actual_published_date":today.isoformat(),"actual_published_at":published_at,"last_processing_result":"published"})
    manifest["last_verified_published_date"]=today.isoformat();manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    state_path.parent.mkdir(parents=True,exist_ok=True);history=state.get("published_posts",[]);history=[x for x in history if x.get("slug")!=candidate["slug"]]
    history.append({"content_id":candidate.get("content_id",candidate["slug"]),"slug":candidate["slug"],"title":candidate["title"],"url":BASE+"/"+route+"/","category":candidate.get("category","ceiling"),"locality":candidate.get("locality","Pune"),"scheduled_date":candidate["scheduled_date"],"actual_published_date":today.isoformat(),"actual_published_at":published_at,"last_processing_result":"published"})
    state.update({"last_published_date":today.isoformat(),"last_published_slug":candidate["slug"],"last_published_path":route+"/","last_processing_result":"published","published_posts":history})
    state_path.write_text(json.dumps(state,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    write_output("published",page_rel,candidate,True)

if __name__=="__main__":
    main()
