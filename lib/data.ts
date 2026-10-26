export type Lang = "fr" | "en";
const ext: Record<string, string> = { "robotics-vision": "svg" };
export const logo = (slug: string) => `/logos/${slug}.${ext[slug] ?? "png"}`;
export const order = ["mri-denoising","supply-chain-analytics","customer-intelligence","titanic-survival","covid19-analysis","world-happiness","ema-sens","robotics-vision","fourier-series","heat-equation","cognitive-load"];

type Group = { fr: string; en: string; items: [string, string][] };
// icon = file name in /public/skills (letters only) or a glyph
export const skills: Group[] = [
  { fr: "IA & Données", en: "AI & Data", items: [["Python","python"],["PyTorch","pytorch"],["scikit-learn","scikitlearn"],["pandas","pandas"],["NumPy","numpy"],["OpenCV","opencv"],["R","r"],["MySQL","mysql"],["Power BI","powerbi"]] },
  { fr: "Logiciel", en: "Software", items: [["TypeScript","typescript"],["JavaScript","javascript"],["React","react"],["React Native","react"],["Firebase","firebase"],["Git","git"],["GitHub","github"]] },
  { fr: "Scientifique", en: "Scientific", items: [["Matplotlib","matplotlib"],["Statistiques","Σ"],["Analyse numérique","∂"],["Plans d’expérience","∿"]] },
];
export const certs = [
  { name: "Python", org: "Kaggle", date: "2024-02-19", img: "/certs/python.jpg" },
  { name: "Intro to Machine Learning", org: "Kaggle", date: "2024-02-22", img: "/certs/intro-ml.jpg" },
  { name: "Pandas", org: "Kaggle", date: "2024-03-19", img: "/certs/pandas.jpg" },
  { name: "Intermediate Machine Learning", org: "Kaggle", date: "2024-03-26", img: "/certs/intermediate-ml.jpg" },
];
export const inProgress = [{ name: "Data Fundamentals", org: "IBM" }, { name: "Data Analytics Essentials", org: "Cisco" }];
export const role: Record<Lang, [string, string, string]> = {
  fr: ["Ingénieure R&D en ", "IA", ", data science et développement Python."],
  en: ["R&D engineer in ", "AI", ", data science and Python development."],
};
export const ui: Record<Lang, Record<string, string>> = {
  fr: { n1:"Projets",n2:"Parcours",n3:"Compétences",n4:"Certifications",n5:"Contact",
    lead:"Diplômée de Bordeaux INP – ENSC, je développe des solutions à l’intersection de l’intelligence artificielle, du traitement d’images, de l’analyse de données et de la recherche appliquée.",
    b1:"Découvrir mes projets",b2:"Télécharger mon CV",hint:"Passez la souris sur mon nom : le bruit revient, puis se dissipe, comme dans mes travaux de débruitage d’IRM.",
    wt:"Projets",ws:"De l’imagerie médicale au calcul scientifique, en passant par la data et le développement d’applications. Cliquez sur un projet pour l’ouvrir.",
    pt:"Parcours",ps:"Deux expériences de recherche et une formation à la croisée des disciplines.",
    e1t:"Recherche en IA et imagerie médicale",e1:"Développement et évaluation de méthodes de débruitage d’images IRM : BM3D, DnCNN, mesures PSNR/SSIM et interface PyQt5.",
    e2t:"Application et données comportementales",e2:"Application React Native/Firebase pour des tâches cognitives et analyse statistique de données expérimentales avec R.",
    at:"Un profil à la croisée des disciplines",a:"Classes préparatoires scientifiques, formation d’ingénieure en Cognitique à Bordeaux INP – ENSC et échange à la Graduate School of AI de POSTECH. J’aime relier rigueur mathématique, développement logiciel et problèmes concrets.",
    st:"Compétences",ss:"Les outils que j’utilise dans mes projets.",
    ct:"Certifications",cs:"Quatre cours Kaggle terminés, et deux parcours en cours pour consolider mes bases en analyse de données.",
    kt:"Travaillons ensemble",ks:"R&D, IA appliquée, data science ou développement Python : je serais ravie d’échanger.",
    live:"En cours",open:"Ouvrir le projet",code:"Voir le code",back:"Retour aux projets",all:"Tous les projets",
    approach:"Contexte et contribution",tools:"Technologies et méthodes",shots:"Résultats et captures",next:"Projet suivant",
    pl:"Tous les projets",pls:"Survolez une carte pour voir son titre, cliquez pour ouvrir le projet.",home:"Accueil" },
  en: { n1:"Projects",n2:"Background",n3:"Skills",n4:"Certifications",n5:"Contact",
    lead:"A Bordeaux INP – ENSC engineering graduate, I build solutions at the intersection of artificial intelligence, image processing, data analysis and applied research.",
    b1:"Explore my projects",b2:"Download my resume",hint:"Move your cursor over my name: the noise comes back, then clears, like in my MRI denoising work.",
    wt:"Projects",ws:"From medical imaging to scientific computing, data and app development. Click a project to open it.",
    pt:"Background",ps:"Two research experiences and a degree that sits between disciplines.",
    e1t:"AI & medical imaging research",e1:"Developed and evaluated MRI denoising methods: BM3D, DnCNN, PSNR/SSIM metrics and a PyQt5 interface.",
    e2t:"App & behavioral data research",e2:"React Native/Firebase app for cognitive tasks and statistical analysis of experimental data with R.",
    at:"Working across disciplines",a:"Scientific preparatory classes, an engineering degree in Cognitive Science at Bordeaux INP – ENSC, and an exchange at POSTECH’s Graduate School of AI. I enjoy connecting mathematical rigor, software engineering and real-world problems.",
    st:"Skills",ss:"The tools I use across my projects.",
    ct:"Certifications",cs:"Four completed Kaggle courses, plus two programs in progress to strengthen my data analysis foundations.",
    kt:"Let’s connect",ks:"Hiring in R&D, applied AI, data science or Python development? I’d be happy to talk.",
    live:"In progress",open:"Open project",code:"View code",back:"Back to projects",all:"All projects",
    approach:"Context and contribution",tools:"Technologies and methods",shots:"Results and screenshots",next:"Next project",
    pl:"All projects",pls:"Hover a card to see its title, click to open the project.",home:"Home" },
};
