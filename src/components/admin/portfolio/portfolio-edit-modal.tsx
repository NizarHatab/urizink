"use client";

import { updatePortfolioItemWithForm } from "@/lib/api/portfolio";
import {
  formatPortfolioTags,
  PORTFOLIO_ACCEPT,
  validatePortfolioFile,
} from "@/lib/portfolio-upload";
import { notify } from "@/lib/ui/toast";
import type { PortfolioCategory } from "@/types/portfolio-category";
import type { PortfolioItem } from "@/types/portfolio";
import { Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  item: PortfolioItem | null;
  onClose: () => void;
  onSuccess: (item: PortfolioItem) => void;
  categories: PortfolioCategory[];
};

export default function PortfolioEditModal({
  open,
  item,
  onClose,
  onSuccess,
  categories,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [featuredOnHome, setFeaturedOnHome] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !item) {
      setFile(null);
      setPreview(null);
      setTitle("");
      setCategoryId("");
      setTags("");
      setFeaturedOnHome(false);
      setSubmitting(false);
      return;
    }
    setTitle(item.title);
    setCategoryId(item.categoryId ?? "");
    setTags(formatPortfolioTags(item.tags ?? undefined));
    setFeaturedOnHome(Boolean(item.featuredOnHome));
    setFile(null);
    setPreview(null);
  }, [open, item]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function onPickFile(f: File | null) {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    if (!f || !f.size) return;

    const check = validatePortfolioFile(f);
    if (!check.ok) {
      notify.error(check.error);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || !title.trim()) {
      notify.error("Title is required.");
      return;
    }
    if (file) {
      const check = validatePortfolioFile(file);
      if (!check.ok) {
        notify.error(check.error);
        return;
      }
    }

    setSubmitting(true);
    const form = new FormData();
    form.set("title", title.trim());
    form.set("categoryId", categoryId);
    form.set("tags", tags.trim());
    form.set("featuredOnHome", featuredOnHome ? "true" : "false");
    if (file) form.set("file", file);

    const res = await updatePortfolioItemWithForm(item.id, form);
    setSubmitting(false);
    if (!res.success || !res.data) {
      notify.error(res.error ?? "Update failed");
      return;
    }
    notify.success("Portfolio piece updated");
    onSuccess(res.data);
    onClose();
  }

  if (!open || !item) return null;

  const imagePreview = preview ?? item.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-lg font-bold text-white">Edit portfolio piece</h3>
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <input
              ref={fileRef}
              type="file"
              accept={PORTFOLIO_ACCEPT}
              className="hidden"
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-white/[0.02] py-6 transition hover:border-white/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt=""
                className="max-h-48 w-auto rounded-md object-contain"
              />
              <span className="mt-3 text-xs text-gray-500">
                Tap to replace image (optional)
              </span>
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tags (optional)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="sleeve, geometric, healed"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/30"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
            <input
              type="checkbox"
              checked={featuredOnHome}
              onChange={(e) => setFeaturedOnHome(e.target.checked)}
              className="h-4 w-4 rounded border-white/20"
            />
            <span className="text-sm text-white">
              Show on home page gallery
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
