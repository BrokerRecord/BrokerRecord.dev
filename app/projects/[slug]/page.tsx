import type {Metadata} from "next";
import {projects} from "@/lib/content";
import {ProjectDetail} from "@/components/Portfolio";
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=projects.find(p=>p.slug===slug);return {title:project?.title.en??"Project",description:project?.description.en}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <ProjectDetail slug={slug}/>}
