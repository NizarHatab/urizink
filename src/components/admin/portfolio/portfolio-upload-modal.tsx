"use client";

import { uploadPortfolioItem } from "@/lib/api/portfolio";
import {
  PORTFOLIO_ACCEPT,
  PORTFOLIO_STYLE_SUGGESTIONS,
  validatePortfolioFile,
} from "@/lib/portfolio-upload";
import { notify } from "@/lib/ui/toast";
import type { PortfolioItem } from "@/types/portfolio";
import { Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (item: PortfolioItem) => void;
};

export default function PortfolioUploadModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreview(null);
      setTitle("");
      setStyle("");
      setTags("");
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onPickFile(f: File | null) {
    if (preview) URL.revokeObjectURL(preview);
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
    if (!file || !title.trim()) {
      notify.error("Choose an image and enter a title.");
      return;
    }
    const check = validatePortfolioFile(file);
    if (!check.ok) {
      notify.error(check.error);
      return;
    }

    setSubmitting(true);
    const form = new FormData();
    form.set("file", file);
    form.set("title", title.trim());
    if (style.trim()) form.set("style", style.trim());
    if (tags.trim()) form.set("tags", tags.trim());

    const res = await uploadPortfolioItem(form);
    setSubmitting(false);
    if (!res.success || !res.data) {
      notify.error(res.error ?? "Upload failed");
      return;
    }
    notify.success("Work uploaded — visible on your public portfolio");
    onSuccess(res.data);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-lg font-bold text-white">Upload your work</h3>
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
              className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-white/[0.02] py-10 transition hover:border-white/40"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt=""
                  className="max-h-48 w-auto rounded-md object-contain"
                />
              ) : (
                <span className="text-sm text-gray-500">
                  Tap to choose a photo (JPEG, PNG, WebP, GIF — max 4MB)
                </span>
              )}
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Forearm geometric sleeve"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Style (optional)
            </label>
            <input
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              list="portfolio-style-suggestions"
              placeholder="e.g. Black & Grey, Fine Line"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/30"
              maxLength={50}
            />
            <datalist id="portfolio-style-suggestions">
              {PORTFOLIO_STYLE_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
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

          <button
            type="submit"
            disabled={submitting || !file}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              "Upload to portfolio"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
