import { Link } from "react-router-dom";
import { Cart } from "../../models/Cart";
import { formatPrice } from "../../utils/format";
import { buttonClasses } from "../ui/buttonStyles";
import { GiftIcon, SparkleIcon, TruckIcon } from "../ui/Icons";

const BENEFITS = [
  { icon: TruckIcon, title: `Free delivery over ${formatPrice(Cart.FREE_SHIPPING_FROM)}`, text: "Calculated automatically in your bag" },
  { icon: SparkleIcon, title: "A curated edit", text: "Signature scents and everyday essentials" },
  { icon: GiftIcon, title: `${Cart.PROMO_RATE * 100}% off with ${Cart.PROMO_CODE}`, text: "Apply the code in your cart" },
];

/** Decorative "bottle" built from CSS only — no image request. */
function HeroArt() {
  return (
    <div
      className="relative hidden aspect-[4/5] overflow-hidden rounded-[1.75rem] md:block"
      style={{
        background:
          "radial-gradient(120% 80% at 25% 15%, rgb(201 168 118 / 0.55), transparent 60%), linear-gradient(155deg, #6a3245 10%, #3a1824 90%)",
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-5 rounded-[1.25rem] border border-white/20" />
      <div className="absolute top-[22%] left-1/2 h-[12%] w-[22%] -translate-x-1/2 rounded-t-lg rounded-b-sm bg-linear-to-b from-[#e6cfa3] to-[#a9875a] shadow-lg" />
      <div className="absolute top-[33%] left-1/2 flex h-[48%] w-[56%] -translate-x-1/2 flex-col items-center justify-center rounded-[1.75rem] border border-white/35 bg-white/12 text-center text-white shadow-2xl backdrop-blur-sm">
        <span className="font-display text-5xl font-semibold tracking-tight">10X</span>
        <span className="mt-2 h-px w-10 bg-white/50" />
        <span className="eyebrow mt-2 text-[0.6rem] text-white/85">Eau de Parfum</span>
      </div>
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-lg text-white/80 italic">N° 10 · Paris</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="container-page pt-6 sm:pt-10">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface">
        <div className="grid items-center gap-10 p-6 sm:p-10 md:grid-cols-[1.25fr_1fr] lg:p-14">
          <div>
            <p className="eyebrow text-accent">The 10X edit</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.02] font-semibold text-balance sm:text-6xl lg:text-7xl">
              Fragrance &amp; beauty, thoughtfully curated.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink-soft sm:text-lg">
              Signature scents, polished make-up and gentle skin care from the houses you love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/?category=fragrances" className={buttonClasses("primary", "lg")}>
                Shop fragrances
              </Link>
              <Link to="/?category=beauty" className={buttonClasses("secondary", "lg")}>
                Explore make-up
              </Link>
            </div>
          </div>
          <HeroArt />
        </div>

        <ul className="grid divide-y divide-line border-t border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3 px-6 py-5 sm:px-8">
              <Icon className="mt-0.5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-ink-soft">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
