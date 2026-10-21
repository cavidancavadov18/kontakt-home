"use client";

import { useMemo, useState } from "react";
import type { Store } from "@/data/stores";
import type { Locale } from "@/i18n/dictionaries";

function bboxAround(lat: number, lng: number, delta = 0.012) {
  return `${lng - delta},${lat - delta * 0.7},${lng + delta},${lat + delta * 0.7}`;
}

function bboxForStores(list: Store[]) {
  if (!list.length) return bboxAround(40.4093, 49.8671, 0.15);
  let minLat = list[0].lat;
  let maxLat = list[0].lat;
  let minLng = list[0].lng;
  let maxLng = list[0].lng;
  for (const s of list) {
    minLat = Math.min(minLat, s.lat);
    maxLat = Math.max(maxLat, s.lat);
    minLng = Math.min(minLng, s.lng);
    maxLng = Math.max(maxLng, s.lng);
  }
  const padLat = Math.max(0.02, (maxLat - minLat) * 0.15);
  const padLng = Math.max(0.02, (maxLng - minLng) * 0.15);
  return `${minLng - padLng},${minLat - padLat},${maxLng + padLng},${maxLat + padLat}`;
}

function osmEmbedUrl(bbox: string, marker?: { lat: number; lng: number }) {
  const base = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`;
  if (!marker) return base;
  return `${base}&marker=${marker.lat}%2C${marker.lng}`;
}

export function StoresMapSection({
  stores,
  locale,
  dict,
}: {
  stores: Store[];
  locale: Locale;
  dict: {
    address: string;
    storeHours: string;
    phone: string;
  };
}) {
  const bakuStores = useMemo(
    () => stores.filter((s) => s.city.az === "Bakı"),
    [stores]
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId
    ? stores.find((s) => s.id === selectedId)
    : undefined;

  const mapSrc = useMemo(() => {
    if (selected) {
      return osmEmbedUrl(bboxAround(selected.lat, selected.lng), {
        lat: selected.lat,
        lng: selected.lng,
      });
    }
    return osmEmbedUrl(bboxForStores(bakuStores.length ? bakuStores : stores));
  }, [selected, bakuStores, stores]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-3 lg:max-h-[min(70vh,640px)] lg:overflow-y-auto lg:pr-2">
        {stores.map((store) => {
          const active = store.id === selectedId;
          return (
            <article
              key={store.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(store.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId(store.id);
                }
              }}
              className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:border-[#ffd0da] hover:shadow-md ${
                active
                  ? "border-[#e5004d] ring-2 ring-[#ffe5eb]"
                  : "border-[#eee]"
              }`}
            >
              <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#e5004d]">
                {store.city[locale]}
              </div>
              <h2 className="mb-2 text-[17px] font-bold text-[#222]">
                {store.name[locale]}
              </h2>
              <dl className="space-y-2 text-[13px] text-[#555]">
                <div>
                  <dt className="font-semibold text-[#333]">{dict.address}</dt>
                  <dd>{store.address[locale]}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#333]">{dict.storeHours}</dt>
                  <dd>{store.hours[locale]}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#333]">{dict.phone}</dt>
                  <dd>
                    <a
                      href={`tel:${store.phone}`}
                      className="text-[#e5004d]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {store.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>

      <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,480px)]">
        <div className="overflow-hidden rounded-2xl border border-[#eee] shadow-sm">
          <iframe
            key={mapSrc}
            title={
              locale === "az" ? "Kontakt mağazalar xəritəsi" : "Карта магазинов Kontakt"
            }
            src={mapSrc}
            className="h-[320px] w-full border-0 md:h-[400px] lg:h-[min(70vh,640px)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        {selected ? (
          <p className="mt-2 text-center text-[12px] text-[#888]">
            {selected.name[locale]}
          </p>
        ) : (
          <p className="mt-2 text-center text-[12px] text-[#888]">
            {locale === "az"
              ? "Mağazaya klik edin — xəritədə fokuslanacaq"
              : "Нажмите на магазин — карта сфокусируется"}
          </p>
        )}
      </div>
    </div>
  );
}
