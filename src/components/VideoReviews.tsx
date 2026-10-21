"use client";

import Image from "next/image";
import { videoCards } from "@/data/homeMedia";
import { useVideoModal } from "@/context/VideoModalContext";
import type { Locale } from "@/i18n/dictionaries";

function resolveSrc(image: string | { az: string; ru: string }, locale: Locale) {
  return typeof image === "string" ? image : image[locale] ?? image.az;
}

export function VideoReviews({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const { openVideo } = useVideoModal();

  return (
    <section className="mx-auto max-w-[1440px] px-3 py-5 md:px-6 lg:px-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="kh-4d text-[18px] font-semibold text-[#222] md:text-[22px]">
          <a
            href="https://www.youtube.com/c/KontaktHome-TV"
            target="_blank"
            rel="noopener noreferrer"
            className="kh-uline"
          >
            {title}
          </a>
        </h2>
        <a
          href="https://www.youtube.com/c/KontaktHome-TV"
          target="_blank"
          rel="noopener noreferrer"
          className="kh-uline text-[13px] font-semibold text-[#ff003c]"
        >
          {locale === "az" ? "YouTube-a keçid" : "Перейти на YouTube"}
        </a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {videoCards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            onClick={() =>
              openVideo({
                youtubeId: card.youtubeId,
                title: card.alt[locale],
              })
            }
            className={`kh-video-card kh-4d group w-[200px] shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition sm:w-[240px] md:w-[263px] ${
              i % 3 === 0
                ? "kh-4d-delay-1"
                : i % 3 === 1
                  ? "kh-4d-delay-2"
                  : "kh-4d-delay-3"
            }`}
          >
            <div className="kh-video-thumb relative aspect-[263/376] w-full bg-[#111]">
              <Image
                src={resolveSrc(card.image, locale)}
                alt={card.alt[locale]}
                fill
                className="object-cover object-center transition duration-500 group-hover:scale-[1.06]"
                sizes="263px"
                unoptimized
              />
              <span className="kh-video-play" aria-hidden>
                <span className="kh-video-play-ring" />
                <span className="kh-video-play-core">▶</span>
              </span>
            </div>
            <div className="line-clamp-2 px-3 py-2.5 text-[12px] font-medium leading-snug text-[#222] md:text-[13px]">
              {card.alt[locale]}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
