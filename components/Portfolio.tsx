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
  const [menu, setMenu] = useState(false);
  const links = [["/#work",u.n1],["/#path",u.n2],["/#skills",u.n3],["/#certs",u.n4],["/#contact",u.n5]];
  return <header><div className="w">
    <Link className="logo" href="/">Awa Mbaye<span className="logo-dot">.</span></Link>
    <nav className={menu ? "nav-open" : ""} aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"}>
      {links.map(([href,label])=><Link key={href} href={href} onClick={()=>setMenu(false)}>{label}</Link>)}
      <div className="lang" role="group" aria-label="Language / Langue">{(["fr","en"] as Lang[]).map(l=><button key={l} aria-pressed={lang===l} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
    </nav>
    <button className="menu-toggle" aria-label={menu ? (lang==="fr"?"Fermer le menu":"Close menu") : (lang==="fr"?"Ouvrir le menu":"Open menu")} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu ? "✕" : "☰"}</button>
  </div></header>;
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
  const u=ui[lang];
  return <section className="hero-shell"><div className="w hero hero-v3">
    <div className="hero-copy"><div className="available"><span className="status-dot"/>{lang==="fr"?"Ouverte aux opportunités":"Open to opportunities"}</div>
      <p className="eyebrow">{lang==="fr"?"INGÉNIEURE · IA & DATA · RECHERCHE APPLIQUÉE":"ENGINEER · AI & DATA · APPLIED RESEARCH"}</p>
      <h1>Awa Mbaye<span className="hero-period">.</span></h1>
      <p className="hero-subtitle">{lang==="fr"?"Ingénieure R&D en IA, Data Science et Mathématiques Appliquées.":"R&D Engineer in AI, Data Science and Applied Mathematics."}</p>
      <p className="lead">{u.lead}</p>
      <div className="cta"><a className="btn p" href="#work">✦ {u.b1} ↗</a><a className="btn" href="/Awa_Mbaye_CV.pdf" download>↓ {u.b2}</a></div>
      <div className="hero-stats"><div><strong>{sorted.length}</strong><span>{lang==="fr"?"Projets":"Projects"}</span></div><div><strong>2</strong><span>{lang==="fr"?"Expériences de recherche":"Research experiences"}</span></div><div><strong>{skills.reduce((n,g)=>n+g.items.length,0)}+</strong><span>{lang==="fr"?"Compétences":"Technical skills"}</span></div><div><strong>{certs.length}</strong><span>{lang==="fr"?"Certificats":"Certificates"}</span></div></div>
    </div>
    <div className="hero-visual"><div className="portrait-halo"><img src="/profile.jpg" alt="Awa Mbaye" /></div><div className="floating-tag tag-one">✦ {lang==="fr"?"IA & Deep Learning":"AI & Deep Learning"}</div><div className="floating-tag tag-two">◈ Data Science</div><div className="floating-tag tag-three">✧ {lang==="fr"?"Imagerie médicale":"Medical imaging"}</div><div className="floating-tag tag-four">∑ {lang==="fr"?"Mathématiques appliquées":"Applied mathematics"}</div><div className="signature">Awa Mbaye</div></div>
  </div></section>;
}

const featuredSlugs=["mri-denoising","customer-intelligence","ema-sens","supply-chain-analytics","robotics-vision","heat-equation"];
function Featured({lang}:{lang:Lang}) {
 const [filter,setFilter]=useState("all");
 const filters=[{id:"all",fr:"Tous",en:"All"},{id:"imaging",fr:"Imagerie",en:"Medical imaging"},{id:"data",fr:"Data & BI",en:"Data & BI"},{id:"research",fr:"Recherche & IA",en:"Research & AI"}];
 const chosen=featuredSlugs.map(slug=>sorted.find(p=>p.slug===slug)).filter((p):p is NonNullable<typeof p>=>!!p).filter(p=>filter==="all"||(filter==="imaging"&&p.slug==="mri-denoising")||(filter==="data"&&["customer-intelligence","supply-chain-analytics"].includes(p.slug))||(filter==="research"&&["ema-sens","robotics-vision","heat-equation"].includes(p.slug)));
 return <section id="work" className="featured-section"><div className="w"><p className="eyebrow">✦ {lang==="fr"?"UNE SÉLECTION DE MES TRAVAUX":"SELECTED WORK"}</p><div className="section-head"><div><h2>{lang==="fr"?"Projets phares":"Featured projects"}</h2><p className="sub">{lang==="fr"?"Des solutions concrètes, de la recherche aux tableaux de bord.":"Real-world solutions, from research to interactive dashboards."}</p></div><Link className="subtle-link" href="/projects/">{lang==="fr"?"Tous les projets":"All projects"} ↗</Link></div>
 <div className="filters" role="group" aria-label={lang==="fr"?"Filtrer les projets":"Filter projects"}>{filters.map(f=><button key={f.id} className={filter===f.id?"selected":""} aria-pressed={filter===f.id} onClick={()=>setFilter(f.id)}>{f[lang]}</button>)}</div>
 <div className="featured-grid">{chosen.map(p=>{const shot=galleries[p.slug]?.[0];return <article className="feature-card" key={p.slug}><Link href={`/projects/${p.slug}/`} className="feature-image"><img src={shot?`/projects/${shot.file}`:logo(p.slug)} alt={t(p.title,lang)} loading="lazy" /></Link><div className="feature-content"><span className="eyebrow feature-cat">{t(p.category,lang)}</span><h3>{t(p.title,lang)}</h3><p>{t(p.description,lang)}</p><div className="feature-tools">{p.tools.slice(0,3).map(tool=><span key={tool}>{tool}</span>)}</div><div className="feature-links"><Link href={`/projects/${p.slug}/`}>{lang==="fr"?"Voir le projet":"View case study"} ↗</Link>{gh(p)&&<a href={gh(p)} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}</div></div></article>})}</div>
 </div></section>;
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
    <section id="archive"><div className="w">
      <p className="eyebrow">✧ {lang === "fr" ? "EXPLORER DAVANTAGE" : "EXPLORE MORE"}</p><h2>{lang === "fr" ? "Tous mes projets" : "More projects"}</h2><p className="sub">{u.ws}</p>
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
                    <div className="feature-tools">{p.tools.map(x=><span key={x}>{x}</span>)}</div>
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

type Bilingual = {fr:string;en:string};
const backgroundItems: {year:string;place:string;type:Bilingual;title:Bilingual;description:Bilingual;tags:string[]}[] = [
 {year:"2025",place:"POSTECH · South Korea",type:{fr:"RECHERCHE",en:"RESEARCH"},title:{fr:"Recherche en IA et imagerie médicale",en:"AI and medical imaging research"},description:{fr:"Stage de fin d’études consacré au débruitage d’images IRM. Développement et évaluation d’une approche hybride combinant BM3D et DnCNN, avec des expériences Python, des comparaisons de qualité d’image par PSNR et SSIM et une interface PyQt5.",en:"Final-year research internship focused on MRI image denoising. Developed and evaluated a hybrid BM3D–DnCNN approach, using Python experiments, PSNR and SSIM image-quality comparisons, and a PyQt5 interface."},tags:["Python","PyTorch","BM3D / DnCNN","PSNR / SSIM"]},
 {year:"2024",place:"IMS Bordeaux · France",type:{fr:"RECHERCHE & DÉVELOPPEMENT",en:"RESEARCH & DEVELOPMENT"},title:{fr:"EMA-SENS · Application et recherche cognitive",en:"EMA-SENS · Cognitive research application"},description:{fr:"Conception d’une application mobile React Native/Firebase pour administrer des tâches cognitives et des questionnaires. Participation à la collecte de données expérimentales et à leur analyse statistique sous R pour étudier les variations de performance cognitive.",en:"Built a React Native/Firebase mobile application for cognitive tasks and questionnaires. Contributed to experimental data collection and statistical analysis in R to investigate changes in cognitive performance."},tags:["React Native","Firebase","R","Expérimentation"]},
 {year:"2024",place:"POSTECH · South Korea",type:{fr:"ÉCHANGE ACADÉMIQUE",en:"ACADEMIC EXCHANGE"},title:{fr:"Graduate School of Artificial Intelligence",en:"Graduate School of Artificial Intelligence"},description:{fr:"Semestre d’échange international avec des enseignements en machine learning, deep learning, statistiques mathématiques, algèbre linéaire et équations différentielles. Une expérience qui a renforcé mon intérêt pour les fondements mathématiques de l’IA.",en:"International exchange semester studying machine learning, deep learning, mathematical statistics, linear algebra and differential equations. This experience deepened my interest in the mathematical foundations of AI."},tags:["Machine Learning","Deep Learning","Statistiques"]},
 {year:"2022–2025",place:"ENSC · Bordeaux INP · France",type:{fr:"FORMATION",en:"EDUCATION"},title:{fr:"Diplôme d’ingénieure en Cognitique",en:"Engineering degree in Cognitive Science"},description:{fr:"Formation d’ingénieure pluridisciplinaire articulant intelligence artificielle, analyse de données, programmation, interactions humain-machine et méthodes expérimentales. Projets logiciels et de recherche appliquée.",en:"Multidisciplinary engineering education combining artificial intelligence, data analysis, programming, human–computer interaction and experimental methods, with hands-on software and applied research projects."},tags:["IA","Programmation","Data","IHM / HCI"]},
 {year:"2020–2022",place:"Lycée Saliège · France",type:{fr:"FORMATION",en:"EDUCATION"},title:{fr:"Classes préparatoires scientifiques · PCSI / PSI",en:"Scientific preparatory classes · PCSI / PSI"},description:{fr:"Formation scientifique intensive en mathématiques, physique et sciences de l’ingénieur. Acquisition de bases solides en raisonnement analytique, modélisation et résolution de problèmes.",en:"Intensive scientific training in mathematics, physics and engineering sciences, establishing a strong foundation in analytical reasoning, modeling and problem solving."},tags:["Mathématiques","Physique","Modélisation"]}
];
const profileText: Record<Lang,string[]> = {
 fr:["Diplômée de l’ENSC – Bordeaux INP, je conçois des solutions à l’intersection de l’intelligence artificielle, de l’analyse de données, du développement logiciel et de la recherche appliquée.","Mes projets vont du traitement d’images médicales et du deep learning à l’analyse statistique, à la business intelligence et au développement d’applications interactives. Cette diversité me permet d’aborder un problème aussi bien par ses données que par ses algorithmes et son usage.","J’aime transformer des questions complexes en outils concrets, reproductibles et compréhensibles. Je recherche des opportunités en IA appliquée, Data Science, développement Python ou R&D, où je pourrai contribuer tout en approfondissant les dimensions mathématiques et algorithmiques de mon travail."],
 en:["An engineering graduate from ENSC – Bordeaux INP, I develop solutions at the intersection of artificial intelligence, data analysis, software engineering and applied research.","My work spans medical image processing and deep learning, statistical analysis, business intelligence and interactive application development. This range of experience helps me approach a challenge through its data, algorithms and real-world use.","I enjoy turning complex questions into practical, reproducible and understandable tools. I am seeking opportunities in applied AI, Data Science, Python development or R&D, where I can contribute while developing the mathematical and algorithmic aspects of my work."]
};
function Path({ lang }: { lang: Lang }) {
 const u=ui[lang];
 return <section id="path" className="path-section"><div className="w">
  <p className="eyebrow">✦ {lang==="fr"?"À PROPOS & EXPÉRIENCES":"ABOUT & EXPERIENCE"}</p>
  <h2>{u.pt}</h2><p className="sub">{lang==="fr"?"Recherche, développement et formation scientifique — le fil conducteur de mon parcours.":"Research, development and scientific education — the journey behind my work."}</p>
  <article className="profile-story-card"><div className="profile-story-head"><span className="eyebrow">✧ {lang==="fr"?"QUI JE SUIS":"WHO I AM"}</span><span aria-hidden="true" className="profile-sparkle">✳</span></div><h3>{u.at}<span className="hero-period">.</span></h3><div className="profile-story-copy">{profileText[lang].map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div><div className="profile-tags">{(lang==="fr"?["Intelligence artificielle","Data Science","Développement Python","Recherche appliquée"]:["Artificial Intelligence","Data Science","Python Development","Applied Research"]).map(tag=><span key={tag}>{tag}</span>)}</div></article>
  <div className="path-heading"><div><p className="eyebrow">{lang==="fr"?"LES ÉTAPES CLÉS":"KEY MILESTONES"}</p><h3>{lang==="fr"?"Expériences & formation":"Experience & education"}</h3></div><p>{lang==="fr"?"Un parcours scientifique et international, enrichi par des projets concrets.":"A scientific, international journey shaped by hands-on projects."}</p></div>
  <div className="path-timeline">{backgroundItems.map((item,i)=><article className="path-card" key={i}><div className="path-card-top"><span className="path-year">{item.year}</span><span className="path-type">{item.type[lang]}</span></div><h4>{item.title[lang]}</h4><p className="path-place">⌁ {item.place}</p><p className="path-description">{item.description[lang]}</p><div className="profile-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</div>
 </div></section>;
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
  return (<><Header lang={lang} setLang={setLang} /><main id="top"><Hero lang={lang} /><Featured lang={lang} /><Work lang={lang} /><Path lang={lang} /><Skills lang={lang} /><Certs lang={lang} /><Contact lang={lang} /></main><Footer /></>);
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
        <div className="case-facts"><div><small>{lang==="fr"?"DOMAINE":"DOMAIN"}</small><strong>{t(p.category,lang)}</strong></div><div><small>{lang==="fr"?"MÉTHODES":"METHODS"}</small><strong>{p.tools.slice(0,3).join(" · ")}</strong></div><div><small>{lang==="fr"?"LIVRABLES":"DELIVERABLES"}</small><strong>{items.length ? `${items.length} ${lang==="fr"?"visualisations":"visualizations"}` : (lang==="fr"?"Code et analyses":"Code & analysis")}</strong></div></div>
        <div className="case-intro"><p className="eyebrow">01 / {lang==="fr"?"LE CONTEXTE":"THE CONTEXT"}</p><h2>{lang==="fr"?"Problème & approche":"Problem & approach"}</h2><p>{t(p.detail,lang)}</p></div>
        {items.length > 0 && (<>
          <p className="eyebrow">02 / {lang==="fr"?"RÉSULTATS VISUELS":"VISUAL RESULTS"}</p><h2>{u.shots}</h2>
          <div className="cg gal">{items.map((it, i) => (<button key={it.src} className="cc" onClick={() => setZ(i)} aria-label={it.cap}><img src={it.src} alt={it.cap} loading="lazy" /><div><small>{it.cap}</small></div></button>))}</div>
          <Lightbox items={items} i={z} set={setZ} />
        </>)}

        <p className="eyebrow">03 / {lang==="fr"?"OUTILS":"TOOLKIT"}</p><h2>{u.tools}</h2><div className="tg">{p.tools.map((x) => <span key={x}>{x}</span>)}</div>
        {url && <div className="act" style={{ marginTop: "2.2rem" }}><a className="btn p" href={url} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
        <Link className="nx" href={`/projects/${nxt.slug}/`}><small>{u.next}</small><b>{t(nxt.title, lang)}</b></Link>
      </main><Footer /></>
  );
}
