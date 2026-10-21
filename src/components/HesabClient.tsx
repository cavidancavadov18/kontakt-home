"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  addAddress,
  deleteAddress,
  loadAddresses,
  updateAddress,
  type KhAddress,
} from "@/lib/addresses";
import { apiDelete, apiGet, apiPut } from "@/lib/api";
import { loadOrders, type SavedOrder } from "@/lib/orders";
import type { Address, Order } from "@/server/db";
import { loadOneClickOrders, type OneClickOrder } from "@/lib/oneClickOrders";
import { formatPrice } from "@/lib/format";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

type Tab = "profile" | "orders" | "addresses";

export function HesabClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { user, logout, updateProfile } = useApp();
  const router = useRouter();
  const base = `/${locale}`;
  const t = (az: string, ru: string) => (locale === "az" ? az : ru);

  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [oneClick, setOneClick] = useState<OneClickOrder[]>([]);
  const [addresses, setAddresses] = useState<KhAddress[]>([]);
  const [editName, setEditName] = useState("");
  const [addrForm, setAddrForm] = useState<Omit<KhAddress, "id"> | null>(null);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);

  function mapServerOrder(o: Order): SavedOrder {
    return {
      id: o.id,
      createdAt: o.createdAt,
      locale: o.locale,
      items: o.items,
      customer: o.customer,
      payment: {
        method: o.payment.method,
        installmentMonths: o.payment.installmentMonths,
      },
      subtotal: o.subtotal,
      discount: o.discount,
      deliveryFee: o.deliveryFee,
      total: o.total,
      promoCode: o.promoCode,
    };
  }

  function mapServerAddress(a: Address, phone: string): KhAddress {
    return {
      id: a.id,
      label: a.label,
      city: a.city,
      address: a.line,
      phone,
    };
  }

  useEffect(() => {
    if (!user) {
      router.replace(`${base}/daxil-ol`);
      return;
    }
    setEditName(user.name);

    let cancelled = false;
    (async () => {
      const localOrders = loadOrders();
      try {
        const data = await apiGet<{ orders: Order[] }>("/api/orders");
        if (cancelled) return;
        const fromApi = data.orders.map(mapServerOrder);
        const seen = new Set(fromApi.map((o) => o.id));
        const merged = [
          ...fromApi,
          ...localOrders.filter((o) => !seen.has(o.id)),
        ];
        setOrders(merged);
      } catch {
        if (!cancelled) setOrders(localOrders);
      }

      const localAddr = loadAddresses();
      try {
        const data = await apiGet<{ addresses: Address[] }>("/api/addresses");
        if (cancelled) return;
        setAddresses(data.addresses.map((a) => mapServerAddress(a, user.phone)));
      } catch {
        if (!cancelled) setAddresses(localAddr);
      }

      if (!cancelled) setOneClick(loadOneClickOrders());
    })();

    return () => {
      cancelled = true;
    };
  }, [user, router, base]);

  if (!user) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: t("Profil", "Профиль") },
    { id: "orders", label: t("Sifarişlər", "Заказы") },
    { id: "addresses", label: t("Ünvanlar", "Адреса") },
  ];

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({ name: editName.trim() });
  }

  function openNewAddress() {
    if (!user) return;
    setEditingAddrId(null);
    setAddrForm({
      label: t("Ev", "Дом"),
      city: locale === "az" ? "Bakı" : "Баку",
      address: "",
      phone: user.phone,
    });
  }

  async function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!addrForm || !user) return;

    const payload = {
      id: editingAddrId ?? undefined,
      label: addrForm.label.trim(),
      city: addrForm.city.trim(),
      line: addrForm.address.trim(),
    };

    try {
      const data = await apiPut<{ address: Address }>("/api/addresses", payload);
      const mapped = mapServerAddress(data.address, user.phone);
      setAddresses((prev) => {
        const rest = prev.filter((a) => a.id !== mapped.id);
        return [...rest, mapped];
      });
    } catch {
      if (editingAddrId) {
        updateAddress(editingAddrId, addrForm);
      } else {
        addAddress(addrForm);
      }
      setAddresses(loadAddresses());
    }

    setAddrForm(null);
    setEditingAddrId(null);
  }

  function startEditAddress(a: KhAddress) {
    setEditingAddrId(a.id);
    setAddrForm({
      label: a.label,
      city: a.city,
      address: a.address,
      phone: a.phone,
    });
  }

  function paymentLabel(method: SavedOrder["payment"]["method"]) {
    const map: Record<string, [string, string]> = {
      cash: ["Nağd", "Наличные"],
      card: ["Kart", "Карта"],
      installment: ["Hissə-hissə", "Рассрочка"],
    };
    const pair = map[method];
    return pair ? t(pair[0], pair[1]) : method;
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] font-bold text-[#222]">
          {t("Hesabım", "Мой аккаунт")}
        </h1>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push(base);
          }}
          className="rounded-xl border border-[#ddd] px-4 py-2 text-[13px] font-semibold text-[#555] hover:border-[#e5004d] hover:text-[#e5004d]"
        >
          {t("Çıxış", "Выйти")}
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 border-b border-[#eee] pb-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-[13px] font-semibold ${
              tab === item.id
                ? "bg-[#e5004d] text-white"
                : "bg-[#f5f5f5] text-[#444] hover:bg-[#eee]"
            }`}
          >
            {item.label}
          </button>
        ))}
        <Link
          href={`${base}/secilmisler`}
          className="rounded-lg bg-[#f5f5f5] px-4 py-2 text-[13px] font-semibold text-[#444] hover:bg-[#eee]"
        >
          {dict.favorites} →
        </Link>
      </div>

      {tab === "profile" && (
        <div className="rounded-2xl border border-[#eee] bg-white p-5 shadow-sm">
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <span className="text-[12px] font-semibold uppercase text-[#999]">
                {t("Telefon", "Телефон")}
              </span>
              <p className="text-[16px] font-medium text-[#222]">{user.phone}</p>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">
                {t("Ad, soyad", "Имя, фамилия")}
              </span>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-[#e5004d] px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              {t("Yadda saxla", "Сохранить")}
            </button>
          </form>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 && oneClick.length === 0 ? (
            <p className="rounded-2xl border border-[#eee] bg-white p-6 text-center text-[14px] text-[#777]">
              {t("Sifariş yoxdur", "Заказов пока нет")}
            </p>
          ) : null}
          {orders.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-[#eee] bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap justify-between gap-2 text-[13px]">
                <strong>№ {o.id}</strong>
                <span className="text-[#777]">
                  {new Date(o.createdAt).toLocaleDateString(
                    locale === "az" ? "az-Latn" : "ru-RU"
                  )}
                </span>
              </div>
              <ul className="mb-2 space-y-1 text-[13px] text-[#555]">
                {o.items.map((it) => (
                  <li key={`${o.id}-${it.productId}`} className="flex justify-between gap-2">
                    <span className="line-clamp-1">
                      {it.name} × {it.qty}
                    </span>
                    <span>{formatPrice(it.unitPrice * it.qty, locale)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-[#eee] pt-2 text-[14px] font-bold">
                <span>{paymentLabel(o.payment.method)}</span>
                <span>{formatPrice(o.total, locale)}</span>
              </div>
            </article>
          ))}
          {oneClick.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-dashed border-[#ddd] bg-[#fafafa] p-4"
            >
              <p className="mb-1 text-[12px] font-semibold uppercase text-[#e5004d]">
                {t("1 klik", "1 клик")}
              </p>
              <p className="text-[14px] font-medium">{o.productName}</p>
              <p className="text-[13px] text-[#666]">
                × {o.qty} · {o.phone}
              </p>
              <p className="mt-1 text-[12px] text-[#999]">
                {new Date(o.createdAt).toLocaleString(
                  locale === "az" ? "az-Latn" : "ru-RU"
                )}
              </p>
            </article>
          ))}
        </div>
      )}

      {tab === "addresses" && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={openNewAddress}
            className="rounded-xl bg-[#2b2b2b] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            + {t("Yeni ünvan", "Новый адрес")}
          </button>

          {addrForm && (
            <form
              onSubmit={submitAddress}
              className="space-y-3 rounded-2xl border border-[#eee] bg-white p-4"
            >
              {(
                [
                  ["label", t("Ad (Ev/Ofis)", "Название")],
                  ["city", t("Şəhər", "Город")],
                  ["address", dict.address],
                  ["phone", t("Telefon", "Телефон")],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-[12px] font-semibold">
                    {label}
                  </span>
                  <input
                    required
                    value={addrForm[key]}
                    onChange={(e) =>
                      setAddrForm((f) =>
                        f ? { ...f, [key]: e.target.value } : f
                      )
                    }
                    className="w-full rounded-xl border border-[#ddd] px-3 py-2 text-[14px] outline-none focus:border-[#e5004d]"
                  />
                </label>
              ))}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[#e5004d] px-4 py-2 text-[13px] font-semibold text-white"
                >
                  {t("Saxla", "Сохранить")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddrForm(null);
                    setEditingAddrId(null);
                  }}
                  className="rounded-xl border border-[#ddd] px-4 py-2 text-[13px] font-semibold"
                >
                  {dict.back}
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !addrForm ? (
            <p className="text-[14px] text-[#777]">
              {t("Ünvan əlavə edin", "Добавьте адрес доставки")}
            </p>
          ) : null}

          {addresses.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-[#eee] bg-white p-4"
            >
              <div>
                <p className="font-semibold text-[#222]">{a.label}</p>
                <p className="text-[13px] text-[#555]">
                  {a.city}, {a.address}
                </p>
                <p className="text-[13px] text-[#777]">{a.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEditAddress(a)}
                  className="text-[13px] font-semibold text-[#e5004d]"
                >
                  {t("Düzəlt", "Изменить")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void (async () => {
                      try {
                        await apiDelete(`/api/addresses?id=${encodeURIComponent(a.id)}`);
                        setAddresses((prev) => prev.filter((x) => x.id !== a.id));
                      } catch {
                        deleteAddress(a.id);
                        setAddresses(loadAddresses());
                      }
                    })();
                  }}
                  className="text-[13px] font-semibold text-[#999]"
                >
                  {dict.remove}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
