export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="flex items-center gap-6">
        <h2 className="font-bold text-lg">Overview</h2>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-500">
            search
          </span>
          <input
            placeholder="Search appointments, clients..."
            className="bg-[#111] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-white/30 outline-none transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-lg">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-sm">Admin</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Administrator
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-cover bg-center border border-white/20"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA592zPJOuTd0qdoFV0y9FB1Z1-0BMcM4OdgynlN5YCaIJ0LJGWwXDYA7TgIeyVwv0PhY46KBA6CQHFYPVx4-eiVh5Gq5igv8T9A3_sN6eyOYJtwO9m4Nu3nGxcSjdzVEcc9whq2SwfW97Qi26Ps-XHDXrljTgoqOAENtaw-I1pYZToqbASJO2VkBtmdEUvXHtd8Wq1HR_phbbzJfwpWmo-Ud3_cNZeNo4XoTwg9_nN7l85nhCFA9e_Zz_Z_PD2HrQcxafE4uxZeJYR")',
            }}
          />
        </div>
      </div>
    </header>
  );
}
