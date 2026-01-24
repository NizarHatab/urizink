import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-black text-white overflow-x-hidden"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="flex h-full grow flex-col">
        {/* HEADER */}
        <Header />

        {/* MAIN */}
        <main className="flex flex-col w-full bg-black">
          {/* TITLE */}
          <section className="w-full px-6 md:px-10 pt-20 pb-10 border-b border-neutral-900">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Behind <br /> The Ink
            </h1>
          </section>

          {/* ABOUT */}
          <section className="w-full px-6 md:px-10 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
              {/* IMAGE */}
              <div className="md:col-span-5 lg:col-span-4 relative group">
                <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-900 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDv9lxhpDDg9UlJmH0VjDO1qJmQo9wozhLlXY8KzLn4k-BsTapreOAilwvc0SpHr07sGf6jgxVMiWRkoJ_daBd0Za3BBySuayRumY_5UpxKdKAG3U7-RENp8CocnTFZgZED1g5wI1QY8cqW2hzpufFy5mRH3N7fiHZ9_-1vF5xk6MP92UHYAR-RKbEvhBOU8Tg07bXgcZyjZrRkyd7UE_f6OSmYFAvEMaZ_R59wlkhfiplN9m03z2QsTWyT_oBGODTi1fajeLlzeyY3")',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                </div>

                <div className="mt-4 flex justify-between items-center text-xs uppercase tracking-widest text-neutral-500 font-mono">
                  <span>Artist / Founder</span>
                  <span>Est. 2018</span>
                </div>
              </div>

              {/* TEXT */}
              <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between h-full pt-4">
                <div className="mb-16">
                  <h2 className="text-2xl font-bold uppercase tracking-wide mb-8 border-l-4 border-white pl-6">
                    Ink Artistry
                  </h2>

                  <p className="text-neutral-400 text-lg md:text-xl leading-relaxed font-light mb-8 max-w-2xl">
                    UrizInk represents a raw, monochromatic dialogue between
                    skin and needle. Based in the heart of Lebanon, my work is
                    strictly confined to black and grey — realism, fine-line
                    geometry, and custom dark art.
                  </p>

                  <p className="text-neutral-400 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                    Tattoos are not decoration — they are permanent markers of
                    identity. Every piece is a collaboration designed to age
                    with grace and boldness.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-wide mb-8 border-l-4 border-neutral-800 pl-6 text-neutral-300">
                    Studio Standards
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {standards.map((s) => (
                      <div key={s.title} className="flex flex-col gap-2">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm">
                          {s.title}
                        </h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                          {s.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PARALLAX */}
          <section className="group relative w-full h-[40vh] md:h-[60vh] overflow-hidden flex items-center justify-center">
            {/* Image */}
            <Image
              width={200}
              height={200}
              src="/images/yara-hero.jpeg"
              alt="UrizInk Artist"
              className="absolute inset-0 w-full h-full object-contain lg:object-[30%]
  grayscale contrast-125 brightness-90 scale-105
  transition-all duration-700 ease-out
  group-hover:grayscale-0 group-hover:contrast-110 group-hover:brightness-105 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent transition-opacity duration-700 group-hover:opacity-70" />

            {/* Text */}
            <div className="relative z-10 text-center px-6 transition-all duration-700 group-hover:scale-[1.02]">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Your Skin,
                <br /> My Canvas
              </h2>
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-col items-center justify-center py-24 px-6 text-center border-t border-neutral-900">
            <p className="text-neutral-500 uppercase tracking-widest text-sm font-bold mb-6">
              Ready to start your project?
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center h-14 px-10 border border-white text-white hover:bg-white hover:text-black transition text-base font-bold uppercase tracking-widest"
            >
              Book an Appointment
            </Link>
          </section>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}

/* ---------------- DATA ---------------- */

const standards = [
  {
    title: "Sterile Environment",
    text: "Hospital-grade sterilization and single-use disposables. Safety is the foundation of our art.",
  },
  {
    title: "Custom Consultation",
    text: "No copy-paste designs. Each tattoo begins with a detailed dialogue.",
  },
  {
    title: "Premium Materials",
    text: "Only the highest quality vegan inks and precision needles.",
  },
  {
    title: "Aftercare Support",
    text: "Detailed guidance provided for optimal healing and longevity.",
  },
];
