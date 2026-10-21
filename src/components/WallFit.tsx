"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/dictionaries";

export function WallFitBanner({ locale }: { locale: Locale }) {
  const az = locale === "az";
  return (
    <div className="mx-auto max-w-[1440px] px-3 pt-4 md:px-8">
      <Link
        href={`/${locale}/divara-qoy`}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#1a1a1a] px-4 py-4 text-white md:px-6"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff5a7a]">
            {az ? "Yeni" : "Новое"}
          </p>
          <p className="text-[16px] font-bold md:text-[20px]">
            {az
              ? "Divara qoy — 55 və 65 düymü otağında gör"
              : "На стену — сравни 55 и 65 дюймов в своей комнате"}
          </p>
        </div>
        <span className="rounded-full bg-[#e5004d] px-4 py-2 text-[13px] font-semibold">
          {az ? "Yoxla" : "Проверить"}
        </span>
      </Link>
    </div>
  );
}

const TV_INCHES = [43, 50, 55, 65, 75, 85] as const;
const ACS = [
  { id: "9", btu: 9000, w: 79, h: 27 },
  { id: "12", btu: 12000, w: 84, h: 29 },
  { id: "18", btu: 18000, w: 97, h: 31 },
  { id: "24", btu: 24000, w: 110, h: 33 },
] as const;

function tvSize(inches: number) {
  const diag = inches * 2.54;
  const k = Math.hypot(16, 9);
  return { w: (diag * 16) / k, h: (diag * 9) / k };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type Frame = { left: number; top: number; w: number; h: number };

export function WallFit({ locale }: { locale: Locale }) {
  const az = locale === "az";
  const t = (a: string, r: string) => (az ? a : r);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragging = useRef(false);
  const dragOrigin = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [kind, setKind] = useState<"tv" | "ac">("tv");
  const [tvPicks, setTvPicks] = useState<number[]>([55, 65]);
  const [acPicks, setAcPicks] = useState<string[]>(["12", "18"]);
  const [wallM, setWallM] = useState(4);
  const [pos, setPos] = useState({ x: 0.5, y: 0.42 });
  const [alive, setAlive] = useState(false);
  const [frame, setFrame] = useState<Frame>({ left: 0, top: 0, w: 1, h: 1 });
  const [imgNat, setImgNat] = useState<{ w: number; h: number } | null>(null);
  const dragMoved = useRef(false);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const box = stage.getBoundingClientRect();
      if (!photo || !imgNat) {
        setFrame({ left: 0, top: 0, w: box.width, h: box.height });
        return;
      }
      const scale = Math.min(box.width / imgNat.w, box.height / imgNat.h);
      const w = imgNat.w * scale;
      const h = imgNat.h * scale;
      setFrame({
        left: (box.width - w) / 2,
        top: (box.height - h) / 2,
        w,
        h,
      });
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(stage);
    return () => obs.disconnect();
  }, [photo, imgNat]);

  const units = useMemo(() => {
    if (kind === "tv") {
      return [...tvPicks]
        .sort((a, b) => a - b)
        .map((inches) => {
          const size = tvSize(inches);
          return {
            key: `tv-${inches}`,
            label: `${inches}″`,
            sub: t("Televizor", "Телевизор"),
            wCm: size.w,
            hCm: size.h,
            kind: "tv" as const,
          };
        });
    }
    return ACS.filter((a) => acPicks.includes(a.id)).map((a) => ({
      key: `ac-${a.id}`,
      label: `${a.btu / 1000}k`,
      sub: `${a.btu} BTU`,
      wCm: a.w,
      hCm: a.h,
      kind: "ac" as const,
    }));
  }, [kind, tvPicks, acPicks, az]);

  const gapCm = 14;
  const totalCm =
    units.reduce((sum, unit) => sum + unit.wCm, 0) +
    gapCm * Math.max(0, units.length - 1);
  const wallCm = wallM * 100;
  const fits = totalCm <= wallCm * 0.98;
  const share = Math.round((totalCm / wallCm) * 100);

  function toggleTv(inches: number) {
    setTvPicks((prev) => {
      if (prev.includes(inches)) {
        return prev.length === 1 ? prev : prev.filter((n) => n !== inches);
      }
      if (prev.length < 2) return [...prev, inches];
      return [prev[1], inches];
    });
  }

  function toggleAc(id: string) {
    setAcPicks((prev) => {
      if (prev.includes(id)) {
        return prev.length === 1 ? prev : prev.filter((n) => n !== id);
      }
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id];
    });
  }

  function onFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setPos({ x: 0.5, y: 0.42 });
  }

  function startDrag(clientX: number, clientY: number) {
    if (dragging.current || frame.w < 2) return;
    dragging.current = true;
    dragMoved.current = false;
    const start = { px: clientX, py: clientY, x: pos.x, y: pos.y };
    const move = (ev: PointerEvent | MouseEvent) => {
      if (Math.hypot(ev.clientX - start.px, ev.clientY - start.py) > 6) {
        dragMoved.current = true;
      }
      moveBy(ev.clientX, ev.clientY, start);
    };
    const up = () => {
      const moved = dragMoved.current;
      dragging.current = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("mouseup", up);
      if (!moved) setAlive((value) => !value);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("mousemove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("mouseup", up);
  }

  function moveBy(clientX: number, clientY: number, origin: { px: number; py: number; x: number; y: number }) {
    if (clientX === 0 && clientY === 0) return;
    const dx = (clientX - origin.px) / frame.w;
    const dy = (clientY - origin.py) / frame.h;
    setPos({
      x: clamp(origin.x + dx, 0.08, 0.92),
      y: clamp(origin.y + dy, 0.12, 0.78),
    });
  }

  const cmPerPx = wallCm / Math.max(frame.w, 1);

  return (
    <div className="mx-auto max-w-6xl px-3 py-5 md:px-6">
      <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e5004d]">
        {t("Kontakt-da yoxdur", "Этого нет на Kontakt")}
      </p>
      <h1 className="mb-2 text-[26px] font-bold text-[#222] md:text-[34px]">
        {t("Divara qoy", "На стену")}
      </h1>
      <p className="mb-5 max-w-2xl text-[14px] leading-relaxed text-[#555]">
        {t(
          "Otağın şəklini at. Televizor və kondisioner divarda real santimetrlə durur — 55 və 65 düym yan-yana.",
          "Загрузи фото комнаты. Телевизор и кондиционер встают на стену в реальных сантиметрах — 55 и 65 дюймов рядом."
        )}
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div
            ref={stageRef}
            className="relative h-[420px] overflow-hidden rounded-2xl border border-[#e6e6e6] bg-[#d9d3c8] md:h-[520px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files?.[0]);
            }}
          >
            {photo ? (
              <img
                ref={imgRef}
                src={photo}
                alt={t("Otaq", "Комната")}
                className="absolute inset-0 h-full w-full object-contain"
                onLoad={(e) =>
                  setImgNat({
                    w: e.currentTarget.naturalWidth,
                    h: e.currentTarget.naturalHeight,
                  })
                }
              />
            ) : (
              <SampleRoom dimmed={alive && kind === "tv"} />
            )}

            <div
              className={`pointer-events-none absolute inset-0 z-[2] bg-[#07080d] transition-opacity duration-700 ${
                alive && kind === "tv" ? "opacity-50" : "opacity-0"
              }`}
            />

            <div
              role="button"
              draggable
              aria-label={t("Cihazları sürüşdür", "Перетащить технику")}
              onDragStart={(e) => {
                dragOrigin.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
                e.dataTransfer.effectAllowed = "move";
              }}
              onDrag={(e) => {
                if (dragOrigin.current) moveBy(e.clientX, e.clientY, dragOrigin.current);
              }}
              className="absolute z-10 cursor-grab touch-none active:cursor-grabbing"
              style={{
                left: frame.left + pos.x * frame.w,
                top: frame.top + pos.y * frame.h,
                transform: "translate(-50%, -50%)",
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                startDrag(e.clientX, e.clientY);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                startDrag(e.clientX, e.clientY);
              }}
            >
              <div className="flex items-end" style={{ gap: gapCm / cmPerPx }}>
                {units.map((unit) => (
                  <Appliance
                    key={unit.key}
                    label={unit.label}
                    sub={unit.sub}
                    width={unit.wCm / cmPerPx}
                    height={unit.hCm / cmPerPx}
                    kind={unit.kind}
                    alive={alive}
                    caption={`${Math.round(unit.wCm)}×${Math.round(unit.hCm)} ${t("sm", "см")}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[12px] font-semibold text-white">
              {t("Divar", "Стена")} {wallM.toFixed(1)} m
            </div>
            <div
              className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[12px] font-semibold text-white ${
                fits ? "bg-[#1a9a4a]" : "bg-[#e5004d]"
              }`}
            >
              {fits
                ? t(
                    `Divarın ${share}%-ini tutur`,
                    `Занимает ${share}% стены`
                  )
                : t("Bu ölçü divara sığmır", "Этот размер не влезает")}
            </div>
          </div>
          <p className="mt-2 text-[12px] text-[#888]">
            {t(
              "Cihaza kliklə: ekran yanır, otaq qaralır, kondisionerdən hava gedir. Sürüşdürmək də olur.",
              "Нажми на технику: экран включается, комната темнеет, из кондиционера идёт воздух. Можно и перетащить."
            )}
          </p>
        </div>

        <aside className="space-y-4 rounded-2xl border border-[#eee] bg-white p-4">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["tv", t("Televizor", "Телевизор")],
                ["ac", t("Kondisioner", "Кондиционер")],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setKind(id);
                  setAlive(false);
                }}
                className={`rounded-xl px-3 py-2.5 text-[13px] font-semibold ${
                  kind === id
                    ? "bg-[#e5004d] text-white"
                    : "bg-[#f4f4f4] text-[#333]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#222]">
              {kind === "tv"
                ? t("İki ölçü yan-yana", "Два размера рядом")
                : t("İki model yan-yana", "Две модели рядом")}
            </p>
            <div className="flex flex-wrap gap-2">
              {kind === "tv"
                ? TV_INCHES.map((inches) => (
                    <button
                      key={inches}
                      type="button"
                      onClick={() => toggleTv(inches)}
                      className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                        tvPicks.includes(inches)
                          ? "bg-[#222] text-white"
                          : "bg-[#f4f4f4] text-[#444]"
                      }`}
                    >
                      {inches}″
                    </button>
                  ))
                : ACS.map((ac) => (
                    <button
                      key={ac.id}
                      type="button"
                      onClick={() => toggleAc(ac.id)}
                      className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                        acPicks.includes(ac.id)
                          ? "bg-[#222] text-white"
                          : "bg-[#f4f4f4] text-[#444]"
                      }`}
                    >
                      {ac.btu / 1000}k
                    </button>
                  ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAlive((value) => !value)}
            className={`w-full rounded-xl px-3 py-3 text-[14px] font-semibold ${
              alive ? "bg-[#222] text-white" : "bg-[#111] text-white"
            }`}
          >
            {alive
              ? t("Söndür", "Выключить")
              : kind === "tv"
                ? t("Ekranı yandır", "Включить экран")
                : t("Havanı burax", "Пустить воздух")}
          </button>

          <label className="block">
            <span className="mb-1 flex items-center justify-between text-[13px] font-semibold text-[#222]">
              {t("Divarın eni", "Ширина стены")}
              <span className="text-[#e5004d]">{wallM.toFixed(1)} m</span>
            </span>
            <input
              type="range"
              min={2.2}
              max={8}
              step={0.1}
              value={wallM}
              onChange={(e) => setWallM(Number(e.target.value))}
              className="w-full accent-[#e5004d]"
            />
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#ccc] bg-[#fafafa] px-3 py-4 text-center">
            <span className="text-[13px] font-semibold text-[#222]">
              {t("Otağın şəklini yüklə", "Загрузить фото комнаты")}
            </span>
            <span className="mt-1 text-[12px] text-[#888]">
              JPG, PNG
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>

          {photo ? (
            <button
              type="button"
              onClick={() => {
                setPhoto((prev) => {
                  if (prev) URL.revokeObjectURL(prev);
                  return null;
                });
                setImgNat(null);
              }}
              className="w-full text-[13px] font-semibold text-[#666]"
            >
              {t("Nümunə otağa qayıt", "Вернуть пример комнаты")}
            </button>
          ) : null}

          <Link
            href={
              kind === "tv"
                ? `/${locale}/kataloq/tv-audio`
                : `/${locale}/kataloq/kondisionerler`
            }
            className="flex items-center justify-center rounded-xl bg-[#e5004d] px-3 py-3 text-[14px] font-semibold text-white"
          >
            {kind === "tv"
              ? t("Televizorlara bax", "Смотреть телевизоры")
              : t("Kondisionerlərə bax", "Смотреть кондиционеры")}
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Appliance({
  label,
  sub,
  width,
  height,
  kind,
  alive,
  caption,
}: {
  label: string;
  sub: string;
  width: number;
  height: number;
  kind: "tv" | "ac";
  alive: boolean;
  caption: string;
}) {
  const w = Math.max(36, width);
  const h = Math.max(28, height);
  return (
    <div className="flex flex-col items-center">
      {kind === "tv" ? (
        <div
          className="relative rounded-[10px] bg-[#111] shadow-[0_18px_30px_rgba(0,0,0,0.35)]"
          style={{
            width: w,
            height: h,
            padding: Math.max(4, w * 0.025),
            boxShadow: alive
              ? "0 18px 30px rgba(0,0,0,0.35), 0 24px 48px rgba(110,170,230,0.45)"
              : undefined,
          }}
        >
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[4px] ${
              alive ? "kh-tv-on bg-black" : "bg-black"
            }`}
          >
            <div
              className={`absolute inset-[-8%] ${alive ? "kh-tv-picture opacity-100" : "opacity-0"} transition-opacity duration-700`}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.22),transparent_42%)]" />
            <span className="relative z-10 text-[18px] font-extrabold text-white drop-shadow">
              {label}
            </span>
            <span
              className={`absolute bottom-1 right-1.5 h-1.5 w-1.5 rounded-full ${
                alive ? "bg-[#3dff7a]" : "bg-[#ff3355]"
              }`}
            />
          </div>
        </div>
      ) : (
        <div className="relative" style={{ width: w, height: h }}>
          <div className="absolute inset-0 overflow-hidden rounded-[14px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#e7e7e7)] shadow-[0_16px_28px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-3 top-2 h-[38%] rounded-md bg-[repeating-linear-gradient(180deg,#cfcfcf,#cfcfcf_2px,#b7b7b7_3px)]" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-[#333]">{label}</span>
              <span className="text-[10px] font-semibold text-[#777]">{sub}</span>
            </div>
          </div>
          {alive ? (
            <div className="pointer-events-none absolute inset-x-3 top-[52%] z-10 flex justify-between">
              {[0, 1, 2].map((streak) => (
                <span
                  key={streak}
                  className="kh-air-streak h-8 w-2 rounded-full bg-[#7ecbff] shadow-[0_6px_10px_rgba(80,170,255,0.85)]"
                  style={{ animationDelay: `${streak * 0.28}s` }}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
      <span className="mt-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
        {kind === "tv" ? label : sub} · {caption}
      </span>
    </div>
  );
}

function SampleRoom({ dimmed }: { dimmed: boolean }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#efe8dc_0%,#e4dccd_68%,#c8bba8_68%,#b7a894_100%)]" />
      <div
        className={`absolute right-[10%] top-[12%] h-[38%] w-[22%] rounded-sm border-[10px] border-[#f7f4ef] shadow-inner transition-[background] duration-700 ${
          dimmed
            ? "bg-[linear-gradient(180deg,#1c3148,#0d1824)]"
            : "bg-[linear-gradient(180deg,#9fd0ea,#e8f4fb)]"
        }`}
      />
      <div className="absolute bottom-[8%] left-[8%] h-[16%] w-[46%] rounded-t-[18px] bg-[#8d7464]" />
      <div className="absolute bottom-[18%] left-[12%] h-[7%] w-[16%] rounded-t-xl bg-[#6f5b4e]" />
      <div className="absolute bottom-[18%] left-[32%] h-[7%] w-[16%] rounded-t-xl bg-[#6f5b4e]" />
    </div>
  );
}
