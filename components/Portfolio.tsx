"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { projects, galleries, t } from "@/lib/content";
import { logo, order, skills, certs, inProgress, role, ui, type Lang } from "@/lib/data";

const sorted = order.map((s) => projects.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p);
const gh = (p: object) => ("github" in p ? (p as { github: string }).github : undefined);
const fmt = (d: string, lang: Lang) => new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(new Date(d));

export function useLang() {
  const [lang, setLang] = useState<Lang>("fr");
  useEffect(() => {
    try {
      const s = localStorage.getItem("awa-lang");
      setLang(s === "en" || s === "fr" ? s : navigator.language.startsWith("fr") ? "fr" : "en");
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("awa-lang", lang); } catch {}
  }, [lang]);
  return { lang, setLang };
}

function Header({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const u = ui[lang];
  return (
    <header>
      <div className="w">
        <Link className="logo" href="/">Awa Mbaye</Link>
        <nav aria-label="Main">
          <Link href="/#work">{u.n1}</Link><Link href="/#path">{u.n2}</Link><Link href="/#skills">{u.n3}</Link><Link href="/#certs">{u.n4}</Link><Link href="/#contact">{u.n5}</Link>
          <div className="lang" role="group" aria-label="Language">
            {(["fr", "en"] as Lang[]).map((l) => (<button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>))}
          </div>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return <footer><div className="w">© {new Date().getFullYear()} Awa Mbaye · Nantes, France</div></footer>;
}

type LB = { src: string; cap: string };
function Lightbox({ items, i, set }: { items: LB[]; i: number | null; set: (v: number | null) => void }) {
  useEffect(() => {
    if (i === null) return;
    const n = items.length;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") set(null);
      if (e.key === "ArrowRight") set((i + 1) % n);
      if (e.key === "ArrowLeft") set((i + n - 1) % n);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [i, items.length, set]);
  if (i === null) return null;
  const n = items.length, it = items[i];
  return (
    <div id="md" className="on" role="dialog" aria-modal="true" aria-label={it.cap} onClick={() => set(null)}>
      <img src={it.src} alt={it.cap} onClick={(e) => e.stopPropagation()} />
      <p>{it.cap}</p>
      <div className="mb" onClick={(e) => e.stopPropagation()}>
        <button aria-label="Previous" onClick={() => set((i + n - 1) % n)}>←</button>
        <button aria-label="Close" onClick={() => set(null)}>✕</button>
        <button aria-label="Next" onClick={() => set((i + 1) % n)}>→</button>
      </div>
    </div>
  );
}

/* The one orchestrated moment: the name starts noisy, then denoises. Pointer speed brings the noise back. */
function Hero({ lang }: { lang: Lang }) {
  const u = ui[lang], r = role[lang];
  const dm = useRef<SVGFEDisplacementMapElement>(null), tb = useRef<SVGFETurbulenceElement>(null), h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches, el = h1.current!;
    let cur = rm ? 0 : 70, tg = 0, lx = 0, ly = 0, fr = 0, raf = 0;
    const mv = (e: PointerEvent) => { const v = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY; if (!rm) tg = Math.min(28, Math.max(tg, v * 0.8)); };
    el.addEventListener("pointermove", mv);
    const f = () => {
      fr++; cur += (tg - cur) * (fr < 150 ? 0.035 : 0.09); tg *= 0.93;
      if (cur > 1 && fr % 4 === 0) tb.current?.setAttribute("seed", String((fr / 4) % 60));
      dm.current?.setAttribute("scale", cur.toFixed(1));
      el.style.filter = cur < 0.4 && tg < 0.4 ? "none" : "url(#dn)";
      raf = requestAnimationFrame(f);
    };
    f();
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", mv); };
  }, []);
  return (
    <div className="w hero">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"><filter id="dn" x="-5%" y="-25%" width="110%" height="150%"><feTurbulence ref={tb} type="fractalNoise" baseFrequency=".03 .07" numOctaves={2} seed={3} /><feDisplacementMap ref={dm} in="SourceGraphic" scale={70} /></filter></svg>
      <h1 ref={h1} style={{ filter: "url(#dn)" }}>Awa Mbaye</h1>
      <div className="hb">
        <div>
          <p className="role rise">{r[0]}<em>{r[1]}</em>{r[2]}</p>
          <p className="lead rise">{u.lead}</p>
          <div className="cta rise"><a className="btn p" href="#work">{u.b1}</a><a className="btn" href="/Awa_Mbaye_CV.pdf" download>{u.b2}</a></div>
          <p className="hint rise">{u.hint}</p>
        </div>
        <div className="ph rise"><img src="/profile.jpg" alt="Awa Mbaye" /></div>
      </div>
    </div>
  );
}

function Work({ lang }: { lang: Lang }) {
  const u = ui[lang];
  const [open, setOpen] = useState(-1);
  const pv = useRef<HTMLDivElement>(null), pi = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!matchMedia("(hover:hover)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let mx = 0, my = 0, x = 0, y = 0, raf = 0;
    const off = () => pv.current?.classList.remove("on");
    const m = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      const r = (e.target as HTMLElement | null)?.closest?.(".row[data-s]") as HTMLElement | null;
      if (r && !r.classList.contains("o")) {
        if (pi.current && pi.current.getAttribute("src") !== r.dataset.s) pi.current.src = r.dataset.s!;
        pv.current?.classList.add("on");
      } else off();
    };
    addEventListener("pointermove", m);
    addEventListener("scroll", off, { passive: true });
    const g = () => { x += (mx + 28 - x) * 0.14; y += (my - 110 - y) * 0.14; if (pv.current) pv.current.style.transform = `translate(${x}px,${y}px)`; raf = requestAnimationFrame(g); };
    g();
    return () => { removeEventListener("pointermove", m); removeEventListener("scroll", off); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section id="work"><div className="w">
      <h2>{u.wt}</h2><p className="sub">{u.ws}</p>
      <div>
        {sorted.map((p, i) => {
          const shot = galleries[p.slug]?.[0], url = gh(p);
          return (
            <article key={p.slug} className={`row${open === i ? " o" : ""}`} data-s={shot ? `/projects/${shot.file}` : logo(p.slug)}>
              <button className="hd" aria-expanded={open === i} aria-controls={`m-${p.slug}`} onClick={() => { setOpen(open === i ? -1 : i); pv.current?.classList.remove("on"); }}>
                <span className="tt"><img className="th" src={logo(p.slug)} alt="" /><span className="t">{t(p.title, lang)}</span></span>
                <span className="c"><span>{t(p.category, lang)}</span><i className="pl" /></span>
              </button>
              <div className="more" id={`m-${p.slug}`}><div>
                <div className="mp">
                  <img className="lg" src={logo(p.slug)} alt={`Logo ${t(p.title, lang)}`} loading="lazy" />
                  <div>
                    <p style={{ margin: "0 0 1rem", maxWidth: "62ch" }}>{t(p.description, lang)}</p>
                    <p className="tl">{p.tools.join(", ")}</p>
                    <div className="act">
                      <Link className="btn p" href={`/projects/${p.slug}/`}>{u.open}</Link>
                      {url && <a className="btn" href={url} target="_blank" rel="noopener noreferrer">GitHub</a>}
                    </div>
                  </div>
                </div>
              </div></div>
            </article>
          );
        })}
      </div>
      <div id="pv" ref={pv} aria-hidden="true"><img ref={pi} alt="" /></div>
    </div></section>
  );
}

function Path({ lang }: { lang: Lang }) {
  const u = ui[lang];
  return (
    <section id="path"><div className="w">
      <h2>{u.pt}</h2><p className="sub">{u.ps}</p>
      <div className="two">
        <div><span className="yr">2025 · POSTECH, {lang === "fr" ? "Corée du Sud" : "South Korea"}</span><h3>{u.e1t}</h3><p>{u.e1}</p></div>
        <div><span className="yr">2024 · IMS Bordeaux</span><h3>{u.e2t}</h3><p>{u.e2}</p></div>
      </div>
      <div className="two" style={{ marginTop: "5rem", gridTemplateColumns: "1fr" }}><div style={{ maxWidth: "64ch" }}><h3>{u.at}</h3><p>{u.a}</p></div></div>
    </div></section>
  );
}

function Skills({ lang }: { lang: Lang }) {
  const u = ui[lang];
  return (
    <section id="skills"><div className="w">
      <h2>{u.st}</h2><p className="sub">{u.ss}</p>
      {skills.map((g) => (
        <div key={g.en}>
          <h3 className="gh">{g[lang]}</h3>
          <div className="sg">
            {g.items.map(([name, ic]) => (
              <div className="sk" key={name}>
                <span className="ic">{/^[a-z]+$/.test(ic) ? <img src={`/skills/${ic}.svg`} alt="" /> : <i>{ic}</i>}</span>{name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div></section>
  );
}

function Certs({ lang }: { lang: Lang }) {
  const u = ui[lang];
  const [z, setZ] = useState<number | null>(null);
  const items = certs.map((c) => ({ src: c.img, cap: `${c.org} · ${c.name}` }));
  return (
    <section id="certs"><div className="w">
      <h2>{u.ct}</h2><p className="sub">{u.cs}</p>
      <div className="cg">
        {certs.map((c, i) => (
          <button key={c.name} className="cc" onClick={() => setZ(i)} aria-label={`${c.name} – ${c.org}`}>
            <img src={c.img} alt={`${c.org} certificate: ${c.name}`} loading="lazy" />
            <div><b>{c.name}</b><small>{c.org} · {fmt(c.date, lang)}</small></div>
          </button>
        ))}
        {inProgress.map((c) => (
          <div className="cp" key={c.name}><span className="st live">{u.live}</span><b>{c.name}</b><small>{c.org}</small></div>
        ))}
      </div>
      <Lightbox items={items} i={z} set={setZ} />
    </div></section>
  );
}

function Contact({ lang }: { lang: Lang }) {
  const u = ui[lang];
  return (
    <section id="contact"><div className="w">
      <h2>{u.kt}</h2><p className="sub">{u.ks}</p>
      <a className="mail" href="mailto:evash0uwha@gmail.com">evash0uwha@gmail.com</a>
      <div className="soc">
        <a href="https://github.com/BrokerRecord" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/awa-mbaye-4930a328b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="/Awa_Mbaye_CV.pdf" download>{u.b2}</a>
      </div>
    </div></section>
  );
}

export function Home() {
  const { lang, setLang } = useLang();
  return (<><Header lang={lang} setLang={setLang} /><main id="top"><Hero lang={lang} /><Work lang={lang} /><Path lang={lang} /><Skills lang={lang} /><Certs lang={lang} /><Contact lang={lang} /></main><Footer /></>);
}

export function ProjectListing() {
  const { lang, setLang } = useLang();
  const u = ui[lang];
  return (
    <><Header lang={lang} setLang={setLang} />
      <main className="w dt">
        <Link className="back" href="/">← {u.home}</Link>
        <h2 style={{ margin: "2rem 0 .8rem" }}>{u.pl}</h2><p className="sub">{u.pls}</p>
        <div className="pg">
          {sorted.map((p) => (
            <Link key={p.slug} className="pc" href={`/projects/${p.slug}/`} aria-label={t(p.title, lang)}>
              <img src={logo(p.slug)} alt="" loading="lazy" /><span>{t(p.title, lang)}</span>
            </Link>
          ))}
        </div>
      </main><Footer /></>
  );
}

export function ProjectDetail({ slug }: { slug: string }) {
  const { lang, setLang } = useLang();
  const [z, setZ] = useState<number | null>(null);
  const p = sorted.find((x) => x.slug === slug);
  if (!p) return null;
  const u = ui[lang], url = gh(p);
  const items = (galleries[slug] ?? []).map((g) => ({ src: `/projects/${g.file}`, cap: g[lang] }));
  const nxt = sorted[(sorted.indexOf(p) + 1) % sorted.length];
  return (
    <><Header lang={lang} setLang={setLang} />
      <main className="w dt">
        <Link className="back" href="/projects/">← {u.back}</Link>
        <div className="dh">
          <img className="lg" src={logo(slug)} alt={`Logo ${t(p.title, lang)}`} />
          <div><h1>{t(p.title, lang)}</h1><p>{t(p.category, lang)}</p></div>
        </div>
        <p style={{ maxWidth: "66ch", fontSize: "1.2rem" }}>{t(p.description, lang)}</p>
        {items.length > 0 && (<>
          <h2>{u.shots}</h2>
          <div className="cg gal">{items.map((it, i) => (<button key={it.src} className="cc" onClick={() => setZ(i)} aria-label={it.cap}><img src={it.src} alt={it.cap} loading="lazy" /><div><small>{it.cap}</small></div></button>))}</div>
          <Lightbox items={items} i={z} set={setZ} />
        </>)}
        <h2>{u.approach}</h2><p style={{ maxWidth: "66ch" }}>{t(p.detail, lang)}</p>
        <h2>{u.tools}</h2><div className="tg">{p.tools.map((x) => <span key={x}>{x}</span>)}</div>
        {url && <div className="act" style={{ marginTop: "2.2rem" }}><a className="btn p" href={url} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
        <Link className="nx" href={`/projects/${nxt.slug}/`}><small>{u.next}</small><b>{t(nxt.title, lang)}</b></Link>
      </main><Footer /></>
  );
}
