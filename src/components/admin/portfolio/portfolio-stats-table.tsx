    const artists = [
  {
    name: "Viktor K.",
    uploads: 42,
    likes: 1204,
    inquiries: 15,
    status: "Featured",
  },
  {
    name: "Elena S.",
    uploads: 38,
    likes: 956,
    inquiries: 22,
    status: "Trending",
  },
];

export default function PortfolioStatsTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Portfolio Engagement by Artist</h3>

      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4 text-left">Artist</th>
              <th className="px-6 py-4">Uploads</th>
              <th className="px-6 py-4">Total Likes</th>
              <th className="px-6 py-4">Inquiries</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {artists.map((a) => (
              <tr key={a.name} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-bold">{a.name}</td>
                <td className="px-6 py-4">{a.uploads}</td>
                <td className="px-6 py-4">{a.likes}</td>
                <td className="px-6 py-4">{a.inquiries}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-white/5 border border-white/20 rounded uppercase text-[10px] text-gray-400">
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
