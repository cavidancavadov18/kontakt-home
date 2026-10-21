import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogSlugs,
  formatBlogDate,
  getBlogPostBySlug,
} from "@/data/blog";
import type { Locale } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return blogSlugs.map((slug) => ({ slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const backLabel = locale === "az" ? "Bloqa qayıt" : "Назад к блогу";

  return (
    <article className="mx-auto max-w-3xl px-3 py-5 md:px-6 md:py-8">
      <Link
        href={`/${locale}/blog`}
        className="mb-6 inline-flex text-[13px] font-semibold text-[#e5004d] hover:underline"
      >
        ‹ {backLabel}
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[#e5004d]">
        <span>{post.category[locale]}</span>
        <span className="font-normal normal-case text-[#888]">
          {formatBlogDate(post.date, locale)}
        </span>
      </div>

      <h1 className="mb-6 text-[24px] font-bold leading-tight text-[#222] md:text-[32px]">
        {post.title[locale]}
      </h1>

      <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#f0f0f0]">
        <Image
          src={post.image}
          alt={post.title[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
          unoptimized
        />
      </div>

      <p className="mb-8 text-[16px] font-medium leading-relaxed text-[#444] md:text-[17px]">
        {post.excerpt[locale]}
      </p>

      <div className="space-y-5 text-[15px] leading-[1.75] text-[#333] md:text-[16px]">
        {post.content[locale].map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
