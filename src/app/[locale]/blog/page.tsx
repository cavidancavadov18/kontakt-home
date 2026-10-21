import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, getBlogPosts } from "@/data/blog";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const posts = getBlogPosts();

  const heading = locale === "az" ? "Bloq" : "Блог";
  const subtitle =
    locale === "az"
      ? "Texnologiya, ev və məsləhətlər — Kontakt Home redaksiyası."
      : "Технологии, дом и советы — редакция Kontakt Home.";

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-5 md:px-6 lg:px-10">
      <h1 className="mb-2 text-[22px] font-bold text-[#222] md:text-[28px]">
        {heading}
      </h1>
      <p className="mb-8 text-[14px] text-[#666]">{subtitle}</p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="overflow-hidden rounded-2xl border border-[#eee] bg-white shadow-sm transition hover:shadow-md"
          >
            <Link href={`/${locale}/blog/${post.slug}`} className="block">
              <div className="relative aspect-[16/10] w-full bg-[#f5f5f5]">
                <Image
                  src={post.image}
                  alt={post.title[locale]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#e5004d]">
                  <span>{post.category[locale]}</span>
                  <span className="font-normal normal-case text-[#999]">
                    {formatBlogDate(post.date, locale)}
                  </span>
                </div>
                <h2 className="mb-2 text-[17px] font-bold leading-snug text-[#222] md:text-[18px]">
                  {post.title[locale]}
                </h2>
                <p className="line-clamp-3 text-[13px] leading-relaxed text-[#555] md:text-[14px]">
                  {post.excerpt[locale]}
                </p>
                <span className="mt-3 inline-block text-[13px] font-semibold text-[#e5004d]">
                  {locale === "az" ? "Davamını oxu" : "Читать далее"} ›
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <p className="mt-10 text-center text-[12px] text-[#999]">
        {dict.seeAll} — {posts.length}{" "}
        {locale === "az" ? "məqalə" : "статей"}
      </p>
    </div>
  );
}
