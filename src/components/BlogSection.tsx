import Image from "next/image";
import Link from "next/link";
import {
  formatBlogDate,
  getBlogPosts,
  type BlogPost,
} from "@/data/blog";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

function BlogCard({
  post,
  locale,
}: {
  post: BlogPost;
  locale: Locale;
}) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group w-[240px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:shadow-md sm:w-[260px] md:w-[280px]"
    >
      <div className="relative aspect-[16/10] w-full bg-[#f0f0f0]">
        <Image
          src={post.image}
          alt={post.title[locale]}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="280px"
          unoptimized
        />
      </div>
      <div className="p-3 md:p-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#e5004d]">
          <span>{post.category[locale]}</span>
          <span className="font-normal normal-case text-[#999]">
            {formatBlogDate(post.date, locale)}
          </span>
        </div>
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#222] md:text-[14px]">
          {post.title[locale]}
        </h3>
      </div>
    </Link>
  );
}

export function BlogSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const posts = getBlogPosts().slice(0, 8);
  const title =
    locale === "az" ? "Oxumağa dəyər" : "Стоит почитать";

  return (
    <section className="mx-auto max-w-[1440px] px-3 py-5 md:px-6 lg:px-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="kh-4d text-[18px] font-semibold text-[#222] md:text-[22px]">
          <Link href={`/${locale}/blog`} className="kh-uline">
            {title}
          </Link>
        </h2>
        <Link
          href={`/${locale}/blog`}
          className="kh-uline text-[13px] font-semibold text-[#ff003c]"
        >
          {dict.seeAll}
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </section>
  );
}
