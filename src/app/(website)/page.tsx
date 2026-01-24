import Hero from "@/components/sections/hero";
import Footer from "../../components/layout/footer";
import Header from "../../components/layout/header";

const gridImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDv9lxhpDDg9UlJmH0VjDO1qJmQo9wozhLlXY8KzLn4k-BsTapreOAilwvc0SpHr07sGf6jgxVMiWRkoJ_daBd0Za3BBySuayRumY_5UpxKdKAG3U7-RENp8CocnTFZgZED1g5wI1QY8cqW2hzpufFy5mRH3N7fiHZ9_-1vF5xk6MP92UHYAR-RKbEvhBOU8Tg07bXgcZyjZrRkyd7UE_f6OSmYFAvEMaZ_R59wlkhfiplN9m03z2QsTWyT_oBGODTi1fajeLlzeyY3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDS2F0Hv0rX1Uon-Z10VBQwkb262gwDx-uqZhhW58P_KpKOnJ0ShsvfbMxyFBQtVtjh28E4q_Z7rFH0kVoG3wNv4oz2duExPoPYN9KwE4Rn_EfYaLHv2HbG8MNd59xJkRSYO76oj_FvtbNh_ac6z10PXagQ2IcBIaOPRiu2-jf7wsSI431OzO3_0Ay2PduR42mXOn9SLslr0Lcxo9wj_kJtuuZtOZ3MKotBWzz7mSaskPdGXODcwOPkI5e2fNMobNYV8Lv6SKxzxwZZ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBkfaYgPCiKR9ictnwFOlNXOumEO7SpbScFbos1YjQhLMwBx_Zn8EiW3G6Z1wSWW3RgArHj2q-WGTVzQ0PPBOrxd3WRNMBCAKuf1TyXRritC-JXu37zjDhWe2A5bOeaPuysH749dl-QCF8FWJZ49NWgkv9EXykCNQLbSwNYJFzWIY9Mu5MDu8LCdy0oNdBFBWzOw1whL_TNiWrIQRczqjCTtf0-O4fEN6kgO-0lHCpH3a6643gsLkRyx3BuwZbuJ6Icaut4_nQgPP1y",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8lZXZFzRxRigwSp5-VD55cF1wVh7AjX8LoJM7yIvFbaHD0CHx3OU_fIobObCEi5GUGg2dtnj94erNVVDIyVhQfmkTRS6SlDXoRC8QwPZVw6TrRV9xgljm0jNcjEFh01NrEV3b1V3Qpy-FlfhIZrfHXSZgWcymrSZrkbUsfZGaBSLxc0_KhwBnK05Mm-NLB4rq7WKhjGichVfYV8u8jHkSQRJwup5TUQH2lJ6eFJ_bvhv5FlkxSNEQRnepZT2WKyNBMMAHlI8oPtGX",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* HERO */}
      <Hero />
      {/* GRID PREVIEW */}
      <section className="bg-black">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {[...gridImages, ...gridImages].map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden border border-neutral-900/30"
            >
              <div
                className="w-full h-full bg-cover bg-center grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105"
                style={{ backgroundImage: `url("${src}")` }}
              />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="flex justify-center py-20 border-t border-neutral-900">
          <a
            href="/portfolio"
            className="text-neutral-400 hover:text-white uppercase tracking-[0.25em] text-xs font-bold border-b border-transparent hover:border-white transition-all pb-2"
          >
            View Full Archive
          </a>
        </div>
      </section>

      {/* STUDIO VALUES */}
      <section className="py-32 px-6 text-center border-t border-neutral-900 bg-black">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          Precision · Art · Identity
        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-neutral-400 text-lg leading-relaxed">
          UrizInk is a private tattoo studio specializing in black & grey
          realism, fine-line geometry, and dark art. Every piece is fully custom
          — designed to age with elegance and intensity.
        </p>

        <div className="mt-16 flex justify-center gap-12 flex-wrap">
          {[
            ["Sterile Studio", "Hospital-grade hygiene standards"],
            ["Custom Designs", "No copy-paste artwork"],
            ["Premium Inks", "Imported vegan pigments"],
            ["Aftercare Support", "Guided healing process"],
          ].map(([title, desc]) => (
            <div key={title} className="max-w-[220px]">
              <h3 className="uppercase tracking-widest font-bold mb-2">
                {title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 border-t border-neutral-900 text-center bg-black">
        <p className="text-neutral-500 uppercase tracking-[0.3em] text-sm mb-6">
          Ready to start?
        </p>

        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10">
          Book Your Session
        </h2>

        <a
          href="/contact"
          className="inline-flex items-center justify-center h-14 px-14 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-base font-bold uppercase tracking-widest"
        >
          Contact Studio
        </a>
      </section>

      <Footer />
    </div>
  );
}
