import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[650px] flex items-center justify-center overflow-hidden border-b border-neutral-900">
      <Image
        src="/images/yara-hero.jpeg"
        alt="UrizInk Blackwork Tattoo"
        fill
        priority
        className="
  object-contain
  sm:object-cover
  lg:object-[center_20%]
  grayscale
  contrast-125
"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="font-(--font-display) text-6xl md:text-8xl tracking-tight">
          BLACKWORK
        </h1>

        <p className="mt-6 text-xs md:text-base uppercase tracking-[0.4em] text-neutral-300">
          Fine Line · Dark Art · Custom Tattoos
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <a
            href="/portfolio"
            className="border border-white px-8 md:px-10 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            View Portfolio
          </a>

          <a
            href="/contact"
            className="border border-neutral-600 px-8 md:px-10 py-4 font-bold uppercase tracking-widest text-neutral-300 hover:border-white hover:text-white transition-all"
          >
            Book Session
          </a>
        </div>
      </div>
    </section>
  );
}
