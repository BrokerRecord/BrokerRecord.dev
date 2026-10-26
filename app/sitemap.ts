export const dynamic = "force-static";
import type {MetadataRoute} from "next";
import {projects} from "@/lib/content";
export default function sitemap():MetadataRoute.Sitemap{return [{url:"https://awambaye.com",lastModified:new Date()},{url:"https://awambaye.com/projects/",lastModified:new Date()},...projects.map(p=>({url:`https://awambaye.com/projects/${p.slug}/`,lastModified:new Date()}))]}
