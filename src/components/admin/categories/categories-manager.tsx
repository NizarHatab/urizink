"use client";

import ConfirmDialog from "@/components/admin/confirm-dialog";
import {
  createPortfolioCategory,
  deletePortfolioCategory,
  fetchPortfolioCategories,
  updatePortfolioCategory,
} from "@/lib/api/portfolio-categories";
import { notify } from "@/lib/ui/toast";
import type { PortfolioCategory } from "@/types/portfolio-category";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function CategoriesManager() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<PortfolioCategory | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchPortfolioCategories();
    if (!res.success) {
      notify.error(res.error ?? "Failed to load categories");
      setCategories([]);
    } else {
      setCategories(res.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const res = await createPortfolioCategory(newName.trim());
    setCreating(false);
    if (!res.success || !res.data) {
      notify.error(res.error ?? "Could not create category");
      return;
    }
    notify.success(`Added “${res.data.name}”`);
    setNewName("");
    setCategories((prev) =>
      [...prev, res.data!].sort((a, b) => a.sortOrder - b.sortOrder),
    );
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    const res = await updatePortfolioCategory(id, { name: editName.trim() });
    if (!res.success || !res.data) {
      notify.error(res.error ?? "Could not save");
      return;
    }
    notify.success("Category updated");
    setEditingId(null);
    setCategories((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, ...res.data! } : c))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    );
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    const res = await deletePortfolioCategory(deleteTarget.id);
    setDeleting(false);
    if (!res.success) {
      notify.error(res.error ?? "Delete failed");
      return;
    }
    notify.success(`Removed “${deleteTarget.name}”`);
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading categories…
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio categories</h1>
          <p className="mt-2 text-sm text-gray-500">
            Styles shown on the public{" "}
            <Link href="/portfolio" className="text-white underline" target="_blank">
              portfolio
            </Link>{" "}
            filters. Pieces keep their link if you delete a category — they become
            uncategorized.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row"
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Black & Grey"
            maxLength={80}
            className="min-h-[44px] flex-1 rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-black hover:bg-gray-200 disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add category
          </button>
        </form>

        <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
          {categories.length === 0 ? (
            <li className="px-6 py-10 text-center text-sm text-gray-500">
              No categories yet. Add one above, or run{" "}
              <code className="text-gray-400">npm run db:migrate-styles</code> after
              migration 0010.
            </li>
          ) : (
            categories.map((cat) => (
              <li
                key={cat.id}
                className="flex flex-col gap-3 bg-white/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {editingId === cat.id ? (
                  <div className="flex flex-1 gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="min-h-[44px] flex-1 rounded-lg border border-white/10 bg-black px-3 text-sm text-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(cat.id)}
                      className="rounded-lg bg-white px-4 text-xs font-bold text-black"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-white/20 px-3 text-xs text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-bold text-white">{cat.name}</p>
                      <p className="text-xs text-gray-500">
                        {cat.pieceCount ?? 0} piece
                        {(cat.pieceCount ?? 0) === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                        }}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 text-gray-400 hover:text-white"
                        aria-label={`Edit ${cat.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cat)}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” will be removed. ${deleteTarget.pieceCount ?? 0} portfolio piece(s) will become uncategorized — images are not deleted.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  );
}
