import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import FranchiseClient from "./client";

export const revalidate = 3600; // Revalidar cada hora

export async function generateStaticParams() {
  const { data: franchises } = await supabase
    .from('franchises')
    .select('slug');
  
  return (franchises || []).map((franchise: any) => ({
    slug: franchise.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: franchise } = await supabase
    .from('franchises')
    .select('name, description')
    .eq('slug', params.slug)
    .single();

  if (!franchise) return {};

  return {
    title: `${franchise.name} | OakScale`,
    description: franchise.description,
  };
}

export default async function FranchisePage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('franchises')
    .select(`
      *,
      resources:franchise_resources(*),
      contacts:franchise_contacts(*)
    `)
    .eq('slug', params.slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return <FranchiseClient franchise={data} />;
}