import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-black text-white overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
        {/* HEADER */}
        <Header />

        {/* MAIN */}
        <main className="px-5 md:px-40 flex flex-1 justify-center py-10">
          <div className="flex flex-col max-w-[960px] w-full">
            {/* TITLE */}
            <div className="p-4 mb-8 border-b border-neutral-900">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Client Reviews
              </h1>
              <p className="text-neutral-400 text-sm max-w-lg mt-2">
                Authentic experiences from our clients. Clean lines, sterile
                environments, and artistic integrity.
              </p>
            </div>

            {/* SUMMARY */}
            <div className="flex flex-col md:flex-row gap-x-12 gap-y-8 p-4 mb-10">
              <div>
                <p className="text-6xl font-black">4.8</p>
                <Stars count={4} />
                <p className="text-neutral-500 text-sm mt-2">
                  Based on 125 reviews
                </p>
              </div>

              <RatingBars />
            </div>

            {/* CTA */}
            <div className="px-4 pb-6">
              <button className="border border-white px-8 h-10 font-bold tracking-wide hover:bg-white hover:text-black transition">
                Write a Review
              </button>
            </div>

            {/* REVIEWS */}
            <div className="flex flex-col gap-6 p-4">
              {reviews.map((r) => (
                <ReviewCard key={r.name} {...r} />
              ))}
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-lg ${
            i < count ? "text-white" : "text-neutral-700"
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
}

function RatingBars() {
  const bars = [
    { stars: 5, pct: 75 },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 5 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  return (
    <div className="grid min-w-[200px] max-w-[500px] flex-1 grid-cols-[20px_1fr_40px] gap-4 items-center">
      {bars.map((b) => (
        <div key={b.stars} className="contents">
          <p className="text-neutral-400 text-sm">{b.stars}</p>
          <div className="h-1.5 bg-neutral-800 rounded-sm overflow-hidden">
            <div className="bg-white h-full" style={{ width: `${b.pct}%` }} />
          </div>
          <p className="text-neutral-500 text-sm text-right">{b.pct}%</p>
        </div>
      ))}
    </div>
  );
}

interface Review {
  name: string;
  time: string;
  stars: number;
  text: string;
  helpful: number;
  notHelpful: number;
  image: string;
}

function ReviewCard({
  name,
  time,
  stars,
  text,
  helpful,
  notHelpful,
  image,
}: Review) {
  return (
    <div className="border border-white/20 p-6 hover:border-white/40 transition">
      <div className="flex items-center gap-4 mb-3">
        <div
          className="w-12 h-12 rounded-full bg-cover grayscale"
          style={{ backgroundImage: `url("${image}")` }}
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-neutral-500 text-xs">{time}</p>
        </div>
      </div>

      <Stars count={stars} />

      <p className="text-neutral-300 text-sm mt-3 leading-relaxed">{text}</p>

      <div className="flex gap-6 mt-4 pt-4 border-t border-white/5 text-xs">
        <button className="flex items-center gap-1 text-neutral-500 hover:text-white">
          👍 Helpful ({helpful})
        </button>
        <button className="flex items-center gap-1 text-neutral-500 hover:text-white">
          👎 Not Helpful ({notHelpful})
        </button>
      </div>
    </div>
  );
}

/* ---------------- DATA ---------------- */

const reviews: Review[] = [
  {
    name: "Sarah M.",
    time: "2 months ago",
    stars: 5,
    helpful: 15,
    notHelpful: 2,
    text: "UrizInk is an exceptional artist. Their attention to detail and ability to translate my vision into a stunning tattoo exceeded my expectations.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2wQi8IIumu3OOaZgQ4ZcyNdno7knxav8rWsR3WHpIyz4E0xR9TL_LyGHElCH8y8MxFYWAZtTibT58qaXGkq__N78VQfqpkPj7Q7ZWdJDGRbhNb5XYyf80i-tzCaty08kvAKAcP9DqVv9UMRc9dltVcOKAGpU3wJHw2U2OIKP5OrAvn7wxOCm8MWfwwId42EBK2rTGi6sl_XcrNXwaB-JU_ThLWnbA2q1xkYiz8S0Dk4b_Hjx2oUU6bZahIPYQFxzrfCpZMEW9yM3L",
  },
  {
    name: "David L.",
    time: "3 months ago",
    stars: 4,
    helpful: 8,
    notHelpful: 1,
    text: "Great experience. The tattoo is well-done and the artist was very professional. Worth the wait.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjqarNFPvNeRl_kQF1XnRwZXB1StP2m7OHTwsOrrknozr1agZtV5wXq02qlMQuLzW3tFDNfDImYjZ3LiLNvJ0qbgT_4PWz2K0GXwBuYE8IBPP1ebQTIpnoUK3BJL-c9j83AWH1RBpcXlk7U0Uhu_CAUA4PYJA5YQcWyr6KFqMzg9S-uiZKnTQMHLn6lUkZQ1YprlDtiM1k-nFQsNNxFQsRmQGd7ptD21sRocUKf8TZiM4uEBF3hoF7b3bSmh7TEzC_3sl4lzfu9uRY",
  },
  {
    name: "Emily R.",
    time: "4 months ago",
    stars: 5,
    helpful: 22,
    notHelpful: 3,
    text: "Absolutely love my new tattoo! The artist was incredibly talented and made the process enjoyable.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQwZF5blgCn3dTqUB4vyJjyQwIpMQneoupFbTbpGgFv8QgP1GzVKfWl5Xbo7ebGkHF_NbDe3DccoIbc_LyL49it3ZmJ9JKl2C2t7rKVXThuQ4E9vyS2AHSvmZnq8AArdW5z1j95n3r4e9k4ZpO6bwzyMw_W7xiddEm5-_anjR8JPKibtel2c-vWe3W3L8FTaKRozbu9w89S-go6bygaJKsdRgIIFTVpAhLWMzTdh3L8l0qt3XE4fx1MdWsfKP1-edqwlcjOrf3PTw9",
  },
];
