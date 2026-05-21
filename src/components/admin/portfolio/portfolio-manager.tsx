"use client";

import { fetchPortfolioCategories } from "@/lib/api/portfolio-categories";
import {
  deletePortfolioItem as deletePortfolioRequest,
  fetchPortfolio,
  patchPortfolioItem,
} from "@/lib/api/portfolio";
import type { PortfolioCategory } from "@/types/portfolio-category";
import { notify } from "@/lib/ui/toast";
import type { PortfolioItem } from "@/types/portfolio";
import { useCallback, useEffect, useMemo, useState } from "react";
import PortfolioFilters from "./portfolio-filters";
import PortfolioGrid from "./portfolio-grid";
import PortfolioHeader from "./portfolio-header";
import PortfolioStatsTable from "./portfolio-stats-table";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import PortfolioEditModal from "./portfolio-edit-modal";
import PortfolioUploadModal from "./portfolio-upload-modal";

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PortfolioItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [featuredUpdatingId, setFeaturedUpdatingId] = useState<string | null>(
    null,
  );
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [pRes, cRes] = await Promise.all([
      fetchPortfolio(),
      fetchPortfolioCategories(),
    ]);
    if (!pRes.success) {
      setError(pRes.error ?? "Failed to load portfolio");
      setItems([]);
    } else {
      setItems(pRes.data ?? []);
    }
    if (cRes.success && cRes.data) {
      setCategories(cRes.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categoryOptions = useMemo(() => {
    const names = categories.map((c) => c.name);
    const hasUncategorized = items.some((i) => !i.categoryId);
    const list = ["All", ...names];
    if (hasUncategorized) list.push("Uncategorized");
    return list;
  }, [items, categories]);

  const filtered = useMemo(() => {
    if (categoryFilter === "All") return items;
    if (categoryFilter === "Uncategorized") {
      return items.filter((i) => !i.categoryId);
    }
    const cat = categories.find((c) => c.name === categoryFilter);
    if (!cat) return items;
    return items.filter((i) => i.categoryId === cat.id);
  }, [items, categoryFilter, categories]);

  async function handleToggleFeatured(id: string, next: boolean) {
    setFeaturedUpdatingId(id);
    const res = await patchPortfolioItem(id, { featuredOnHome: next });
    setFeaturedUpdatingId(null);
    if (!res.success || !res.data) {
      notify.error(res.error ?? "Could not update home page");
      return;
    }
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...res.data } : x)),
    );
    notify.success(
      next ? "Added to home page gallery" : "Removed from home page",
    );
  }

  function onUploaded(item: PortfolioItem) {
    setItems((prev) => [item, ...prev]);
  }

  function onUpdated(item: PortfolioItem) {
    setItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, ...item } : x)),
    );
  }

  function requestEdit(id: string) {
    const item = items.find((x) => x.id === id);
    if (item) setEditTarget(item);
  }

  function requestDelete(id: string) {
    const item = items.find((x) => x.id === id);
    if (item) setDeleteTarget(item);
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    const id = deleteTarget.id;
    setDeleting(true);
    const res = await deletePortfolioRequest(id);
    setDeleting(false);
    if (!res.success) {
      notify.error(res.error ?? "Delete failed");
      return;
    }
    notify.success("Removed from portfolio");
    setItems((prev) => prev.filter((x) => x.id !== id));
    setDeleteTarget(null);
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
        styles={categoryOptions}
        active={categoryFilter}
        onChange={setCategoryFilter}
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
          {filtered.length === 0 && categoryFilter !== "All" ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No pieces in &ldquo;{categoryFilter}&rdquo;.{" "}
              <button
                type="button"
                className="underline hover:text-white"
                onClick={() => setCategoryFilter("All")}
              >
                Show all
              </button>
            </p>
          ) : (
            <PortfolioGrid
              items={filtered}
              onEdit={requestEdit}
              onDelete={requestDelete}
              onToggleFeatured={handleToggleFeatured}
              featuredUpdatingId={featuredUpdatingId}
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
        categories={categories}
      />
      <PortfolioEditModal
        open={!!editTarget}
        item={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={onUpdated}
        categories={categories}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this piece?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be removed from your public portfolio and the image will be deleted from storage. This can’t be undone.`
            : ""
        }
        confirmLabel="Remove"
        cancelLabel="Keep it"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  );
}
