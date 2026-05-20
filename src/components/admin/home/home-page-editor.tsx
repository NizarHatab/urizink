"use client";

import { fetchHomeContent, saveHomeContent } from "@/lib/api/home-admin";
import { notify } from "@/lib/ui/toast";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function HomePageEditor() {
  const [bioHeading, setBioHeading] = useState("Meet Uriz");
  const [bioBody, setBioBody] = useState("");
  const [bioPublished, setBioPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchHomeContent();
    if (res.success && res.data) {
      setBioHeading(res.data.bioHeading);
      setBioBody(res.data.bioBody);
      setBioPublished(res.data.bioPublished);
    } else {
      notify.error(res.error ?? "Could not load home settings");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!bioBody.trim()) {
      notify.error("Write an introduction before saving.");
      return;
    }
    setSaving(true);
    const res = await saveHomeContent({
      bioHeading: bioHeading.trim() || "Meet Uriz",
      bioBody: bioBody.trim(),
      bioPublished,
    });
    setSaving(false);
    if (!res.success) {
      notify.error(res.error ?? "Save failed");
      return;
    }
    notify.success(
      bioPublished
        ? "Introduction is live on the home hero"
        : "Introduction saved as draft",
    );
    if (res.data) {
      setBioHeading(res.data.bioHeading);
      setBioBody(res.data.bioBody);
      setBioPublished(res.data.bioPublished);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading home page settings…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Home page</h1>
        <p className="mt-2 text-sm text-gray-500">
          Introduction appears over the main hero photo (left side). Edit the full{" "}
          <Link href="/admin/about" className="text-white underline">
            About page
          </Link>{" "}
          separately. Feature portfolio pieces from{" "}
          <Link href="/admin/portfolio" className="text-white underline">
            Portfolio
          </Link>
          .
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Section heading
          </label>
          <input
            value={bioHeading}
            onChange={(e) => setBioHeading(e.target.value)}
            maxLength={200}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
            placeholder="Meet Uriz"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Introduction
          </label>
          <textarea
            value={bioBody}
            onChange={(e) => setBioBody(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-white/30"
            placeholder="Tell visitors about your style, experience, and what makes your work unique. Use blank lines between paragraphs."
          />
          <p className="mt-2 text-xs text-gray-600">
            Tip: press Enter twice between paragraphs for spacing on the public site.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-black/50 p-4">
          <input
            type="checkbox"
            checked={bioPublished}
            onChange={(e) => setBioPublished(e.target.checked)}
            className="mt-1 h-4 w-4 accent-white"
          />
          <span>
            <span className="flex items-center gap-2 text-sm font-bold text-white">
              {bioPublished ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-500" />
              )}
              Show on home hero
            </span>
            <span className="mt-1 block text-xs text-gray-500">
              When off, text is saved but the hero shows the default layout only.
            </span>
          </span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-200 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save introduction
        </button>
      </form>
    </div>
  );
}
