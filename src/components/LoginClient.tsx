"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { apiPost, ApiError } from "@/lib/api";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export function LoginClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { user, login, updateProfile } = useApp();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "code" | "name">("phone");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);

  const base = `/${locale}`;
  const t = (az: string, ru: string) => (locale === "az" ? az : ru);

  useEffect(() => {
    if (user) router.replace(`${base}/hesab`);
  }, [user, router, base]);

  if (user) return null;

  function authErrorMessage(err: unknown): string {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        return t(
          "Kod səhvdir və ya vaxtı bitib.",
          "Неверный или просроченный код."
        );
      }
      return err.message;
    }
    return t(
      "Şəbəkə xətası. Yenidən cəhd edin.",
      "Ошибка сети. Попробуйте снова."
    );
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (phone.trim().replace(/\D/g, "").length < 9 || busy) return;
    setError("");
    setBusy(true);
    try {
      const data = await apiPost<{ code: string }>("/api/auth/otp/send", {
        phone: phone.trim(),
      });
      setSentCode(data.code || "");
      setCode(data.code || "");
      setStep("code");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setError("");

    if (mode === "register") {
      setStep("name");
      return;
    }

    setBusy(true);
    try {
      const data = await apiPost<{
        user: { id: string; phone: string; name: string };
      }>("/api/auth/otp/verify", {
        phone: phone.trim(),
        code: code.trim(),
      });
      const next = {
        id: data.user.id,
        phone: data.user.phone,
        name: data.user.name,
      };
      login(next);
      if (!next.name.trim()) {
        setName("");
        setStep("name");
        return;
      }
      router.push(`${base}/hesab`);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function finishProfile(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || busy) return;
    setError("");
    setBusy(true);
    try {
      if (mode === "register") {
        const data = await apiPost<{
          user: { id: string; phone: string; name: string };
        }>("/api/auth/otp/verify", {
          phone: phone.trim(),
          code: code.trim(),
          name: name.trim(),
        });
        login({
          id: data.user.id,
          phone: data.user.phone,
          name: data.user.name,
        });
      } else {
        updateProfile({ name: name.trim() });
      }
      router.push(`${base}/hesab`);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-3 py-8 md:py-12">
      <h1 className="mb-2 text-center text-[24px] font-bold text-[#222]">
        {mode === "login" ? dict.login : t("Qeydiyyat", "Регистрация")}
      </h1>
      <p className="mb-6 text-center text-[13px] text-[#777]">
        {t(
          "Telefon nömrənizə 4 rəqəmli SMS kodu göndərilir.",
          "На номер телефона отправляется 4-значный SMS-код."
        )}
      </p>

      {step === "phone" && (
        <form
          onSubmit={sendCode}
          className="space-y-4 rounded-2xl border border-[#eee] bg-white p-5 shadow-sm md:p-6"
        >
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-[#333]">
              {t("Telefon", "Телефон")}
            </span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+994 XX XXX XX XX"
              className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#e5004d] py-3 text-[14px] font-semibold text-white hover:bg-[#c40042] disabled:opacity-70"
          >
            {busy ? t("Göndərilir…", "Отправка…") : t("Kod göndər", "Отправить код")}
          </button>
        </form>
      )}

      {step === "code" && (
        <form
          onSubmit={verifyCode}
          className="space-y-4 rounded-2xl border border-[#eee] bg-white p-5 shadow-sm md:p-6"
        >
          <p className="text-[13px] text-[#555]">
            {t("Kod göndərildi:", "Код отправлен:")}{" "}
            <strong>{phone}</strong>
          </p>
          {sentCode ? (
            <p className="rounded-xl bg-[#f3faf5] px-3 py-2 text-[14px] font-semibold text-[#1a7a3a]">
              {t("SMS kodu", "SMS-код")}: {sentCode}
            </p>
          ) : null}
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-[#333]">
              {t("SMS kodu", "SMS-код")}
            </span>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="0000"
              className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] tracking-widest outline-none focus:border-[#e5004d]"
            />
          </label>
          {error ? (
            <p className="text-[13px] font-medium text-[#e5004d]">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#e5004d] py-3 text-[14px] font-semibold text-white hover:bg-[#c40042] disabled:opacity-70"
          >
            {busy ? t("Yoxlanılır…", "Проверка…") : t("Təsdiqlə", "Подтвердить")}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setCode("");
              setError("");
            }}
            className="w-full text-[13px] font-semibold text-[#666]"
          >
            {dict.back}
          </button>
        </form>
      )}

      {step === "name" && (
        <form
          onSubmit={finishProfile}
          className="space-y-4 rounded-2xl border border-[#eee] bg-white p-5 shadow-sm md:p-6"
        >
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-[#333]">
              {t("Ad, soyad", "Имя, фамилия")}
            </span>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
            />
          </label>
          {error ? (
            <p className="text-[13px] font-medium text-[#e5004d]">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#e5004d] py-3 text-[14px] font-semibold text-white hover:bg-[#c40042] disabled:opacity-70"
          >
            {busy
              ? t("Yaradılır…", "Создание…")
              : t("Hesabı yarat", "Создать аккаунт")}
          </button>
        </form>
      )}

      {step === "phone" && (
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-center text-[13px] font-semibold text-[#e5004d]"
        >
          {mode === "login"
            ? t("Hesabınız yoxdur? Qeydiyyat", "Нет аккаунта? Регистрация")
            : t("Artıq hesabınız var? Daxil ol", "Уже есть аккаунт? Войти")}
        </button>
      )}

      <p className="mt-6 text-center">
        <Link href={base} className="text-[13px] text-[#777] hover:text-[#222]">
          {dict.home}
        </Link>
      </p>
    </div>
  );
}
