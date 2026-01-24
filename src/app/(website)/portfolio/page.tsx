import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const images = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE3orpsrzzbj4G87ctoYX--3_BfTk1jJC6vK-Ajmmf73hZm9TvByylHQkm2PJtFNQ38sZnSWYzvrsmRbTzn9NaNK-8TvFc7pvkGhXWWLHUwBBfchF_6jm-ByoPEYl7Je8BO--nbA6lkEutDQzCyxeQTvL-rPSHVias5raFoGP3WOPEykidpwq9oaG566WZ7nXmGPd8yklLBAsPtMnJdSIa5FJsieF0DMi_nld-knzshXP8HlMPAsX_LtS6N61f68yW-qexOCuybhGa",
    tag: "Realistic Portrait",
    title: "Anatomy Study",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMrx2ixw0_keT85S5fbsqKVbL0amQo2WmncppYTtrU3yLAhGM-4GS-dbnA9XAfop503CrPUCP1u_rFIiBaATVD3OiFhXiXzmNek5upcb7b_AwS328NlGvlgPkbqLaH7qpYjB9Ns2f2UHE16WjHC-QXwjZtHO5uWTduJM22kZZEHRu1J0CLc_gvXNwUES_WwofHw6q7m4TDekpmBSu1FlLsCjHakTmNORLyYDo5tSvz2PbJ7c_o4bb26AXLDeTSL_OosDv3ev5Kfx0a",
    tag: "Fine Line",
    title: "Minimalist Geometry",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtonC47fZBkJG40CdFY_zO6jSXgsR441kdo_DB3TSKTznBMV7vaMH3TCSqa0a_tkFTnXJ_mEJKuFL5bFhf9_Ob9nqgvx8Gb5N8tYkyeNVBS1KcunMr0iQ4vjvdKnaVQ7McNAJmd_YisCcIcPT_7tlaoSkzrzS1mgEe69IgzoHOYTbvuZ397gsfzveywgU1ixu1wCAOc5r8WrB8OSlQRNlsLQ99nSBwEezKXVfK4P1nqXU-qieKJCdmgs8_O9eQkVK7yb9bBf0YNknU",
    tag: "Micro-Realism",
    title: "Eye Detail",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-bMuoq6hctpzj6ILPpnF1wDdWZGbFAbdzdJKANniK2gEgvOxyGHU2RshzlSU-sq5nE7af0mgCZqqxLpFc86J3FHGlF5-UP8OT5NJKSSSTIg841sMi4BBerl3a6t7mhh95Xpymr2_bnsQckH9NDzxKDpEpvLbXqgunhN6vodNKiO_pcGZ-vCUM2gdBhpAL74w9KzEV09uXJWQLtgBJBiAclf-zpYeIHVQ_zr3AjJUmooBQV-kup9SS0opxCIdMenndfHIiW5buof44",
    tag: "Sleeve Work",
    title: "The Ancient Forest",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Bpg2F8r1hMh7QY22R1o99x3SzgBD4XOx8YETfbcKG3QtqSQQo3ZmB77k9ZwhUMb6TTHmUN_gUGFIxTfAxjFLCGxWGKf_cPfLIlQGg6TQ7IkeRrXMladh84_zvg6pDuH8-mYb1qARyLYyRdUP_ZFiGxuSbXO9rh7IpZugCzhBNPMC5roQUqlQ35ZNBUloz2wt93P8DIkc9VcMQwY-ceUWwkv_KOaPEJ0URxbOfwqvNpRl2tDft6WQlZzqOWt5uMPJnPUc4DmDZFWN",
    tag: "Realism",
    title: "Lion Heart",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ1Ciy4obgKOZiYiTp03yIdLZOV4WQPIgqvrTPxGvPMCm-grQF0mtr-Xra1Ov3QT_vwARHgdfFJseJAd66XSi3YzHVC4-weMjPvROZfN2RQKTy6PJUEW32IkuRO-lVcmKysMzcs2WDTNw6FJPfgLSjlvmO8MdpJCysRMcIIbZrkJOgplJQYFG6N3kI08HBV9wYC7azLitKeIktl_IFZ940x5qgUOXpNpbCBSeeQr2-V_HUhlpEfJmecj1tKo-QPVRCIyavXuhemWDJ",
    tag: "Fine Line",
    title: "Celestial Constellation",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="w-full flex flex-col items-center py-12 px-4 md:px-10">
        <div className="max-w-7xl w-full">
          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">
            Portfolio
          </h1>
          <p className="text-neutral-400 uppercase tracking-[0.3em] text-sm mb-16">
            Black & Grey Specialists • Beirut, Lebanon
          </p>

          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center gap-8 mb-16 border-b border-neutral-800 pb-2">
            {[
              "All",
              "Fine Line",
              "Realism",
              "Micro-Realism",
              "Sleeve Work",
            ].map((label, i) => (
              <button
                key={label}
                className={`flex items-center gap-2 pb-3 transition-all uppercase tracking-[0.2em] text-sm font-bold ${
                  i === 0
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent text-neutral-500 hover:text-white hover:border-neutral-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="masonry-grid max-w-6xl mx-auto gap-6">

            {images.map((img) => (
              <div
                key={img.src}
                className="masonry-item group relative overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-white transition-all duration-500 cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full grayscale group-hover:grayscale-0 transition-all duration-700"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-xs uppercase tracking-widest text-neutral-300">
                    {img.tag}
                  </p>
                  <h3 className="text-lg font-bold uppercase tracking-tight">
                    {img.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center py-20">
            <button className="border border-white px-10 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500">
              Load More Projects
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
