"use client";

import {
  deletePortfolioItem as deletePortfolioRequest,
  fetchPortfolio,
} from "@/lib/api/portfolio";
import { notify } from "@/lib/ui/toast";
import type { PortfolioItem } from "@/types/portfolio";
import { useCallback, useEffect, useMemo, useState } from "react";
import PortfolioFilters from "./portfolio-filters";
import PortfolioGrid from "./portfolio-grid";
import PortfolioHeader from "./portfolio-header";
import PortfolioStatsTable from "./portfolio-stats-table";
import PortfolioUploadModal from "./portfolio-upload-modal";

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [styleFilter, setStyleFilter] = useState<string>("All");
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const pRes = await fetchPortfolio();
    if (!pRes.success) {
      setError(pRes.error ?? "Failed to load portfolio");
      setItems([]);
    } else {
      setItems(pRes.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const styleOptions = useMemo(() => {
    const set = new Set<string>();
    for (const i of items) {
      if (i.style?.trim()) set.add(i.style.trim());
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    if (styleFilter === "All") return items;
    return items.filter((i) => (i.style ?? "").trim() === styleFilter);
  }, [items, styleFilter]);

  function onUploaded(item: PortfolioItem) {
    setItems((prev) => [item, ...prev]);
  }

  async function onDelete(id: string) {
    if (
      !confirm(
        "Remove this piece from the portfolio? The image file will be deleted from storage."
      )
    ) {
      return;
    }
    const res = await deletePortfolioRequest(id);
    if (!res.success) {
      notify.error(res.error ?? "Delete failed");
      return;
    }
    notify.success("Removed");
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <PortfolioHeader
        pieceCount={items.length}
        onAddWork={() => setUploadOpen(true)}
      />
      <PortfolioFilters
        styles={styleOptions}
        active={styleFilter}
        onChange={setStyleFilter}
      />
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-sm text-gray-500">
          Loading portfolio…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
          <p className="text-lg font-bold text-white mb-2">No work uploaded yet</p>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Upload photos of your tattoos. They appear on the public portfolio
            page and the home page.
          </p>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-200"
          >
            Upload your first piece
          </button>
        </div>
      ) : (
        <>
          {filtered.length === 0 && styleFilter !== "All" ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No pieces with style &ldquo;{styleFilter}&rdquo;.{" "}
              <button
                type="button"
                className="underline hover:text-white"
                onClick={() => setStyleFilter("All")}
              >
                Show all
              </button>
            </p>
          ) : (
            <PortfolioGrid
              items={filtered}
              onDelete={onDelete}
              onOpenUpload={() => setUploadOpen(true)}
            />
          )}
          <PortfolioStatsTable items={items} />
        </>
      )}
      <PortfolioUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={onUploaded}
      />
    </>
  );
}
