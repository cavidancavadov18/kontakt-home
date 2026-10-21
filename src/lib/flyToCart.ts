function cartTargets() {
  return [...document.querySelectorAll<HTMLElement>("[data-cart-target]")];
}

function visibleCart() {
  return cartTargets().find((el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.width > 8 &&
      rect.height > 8 &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight
    );
  });
}

function popCart(el?: HTMLElement) {
  const target = el ?? visibleCart();
  if (!target) return;
  target.classList.remove("kh-cart-pop");
  void target.offsetWidth;
  target.classList.add("kh-cart-pop");
  window.setTimeout(() => target.classList.remove("kh-cart-pop"), 460);
}

export function flyToCart(from: HTMLElement, imageUrl: string) {
  const target = visibleCart();
  if (!target) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    popCart(target);
    return;
  }

  const start = from.getBoundingClientRect();
  const end = target.getBoundingClientRect();
  const size = Math.max(56, Math.min(start.width, start.height, 148));
  const ghost = document.createElement("img");
  ghost.src = imageUrl;
  ghost.alt = "";
  ghost.style.cssText = [
    "position:fixed",
    "z-index:80",
    "pointer-events:none",
    "object-fit:contain",
    "border-radius:16px",
    "background:#fff",
    "box-shadow:0 14px 32px rgba(0,0,0,.28)",
    `width:${size}px`,
    `height:${size}px`,
    `left:${start.left + start.width / 2 - size / 2}px`,
    `top:${start.top + start.height / 2 - size / 2}px`,
  ].join(";");
  document.body.appendChild(ghost);

  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);
  const lift = Math.min(-80, dy * 0.2);
  const anim = ghost.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.4}px, ${lift}px) scale(0.7)`,
        opacity: 1,
        offset: 0.42,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.12)`,
        opacity: 0.15,
      },
    ],
    {
      duration: 680,
      easing: "cubic-bezier(0.22, 0.8, 0.3, 1)",
      fill: "forwards",
    }
  );

  const done = () => {
    ghost.remove();
    popCart(target);
  };
  anim.onfinish = done;
  anim.oncancel = done;
}
