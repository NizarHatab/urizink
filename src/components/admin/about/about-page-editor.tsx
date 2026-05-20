"use client";

import { fetchAboutContent, saveAboutContent } from "@/lib/api/about-admin";
import {
  DEFAULT_ABOUT_PAGE,
  type AboutPageContent,
} from "@/lib/about-page";
import { notify } from "@/lib/ui/toast";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30";

export default function AboutPageEditor() {
  const [content, setContent] = useState<AboutPageContent>(DEFAULT_ABOUT_PAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAboutContent();
    if (res.success && res.data) {
      setContent(res.data);
    } else {
      notify.error(res.error ?? "Could not load about page");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function patch<K extends keyof AboutPageContent>(
    key: K,
    value: AboutPageContent[K],
  ) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  function patchStandard(
    index: number,
    field: "title" | "text",
    value: string,
  ) {
    setContent((prev) => {
      const standards = [...prev.standards];
      standards[index] = { ...standards[index]!, [field]: value };
      return { ...prev, standards };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await saveAboutContent(content);
    setSaving(false);
    if (!res.success) {
      notify.error(res.error ?? "Save failed");
      return;
    }
    notify.success("About page updated");
    if (res.data) setContent(res.data);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading about page…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">About page</h1>
        <p className="mt-2 text-sm text-gray-500">
          Edit every section on the public{" "}
          <Link href="/about" className="text-white underline" target="_blank">
            /about
          </Link>{" "}
          page. The home hero intro is edited under{" "}
          <Link href="/admin/home" className="text-white underline">
            Home page
          </Link>
          .
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Page header
          </h2>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={content.headerEyebrow}
              onChange={(e) => patch("headerEyebrow", e.target.value)}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={content.headerTitle}
              onChange={(e) => patch("headerTitle", e.target.value)}
            />
          </Field>
          <Field label="Subtitle">
            <textarea
              className={inputClass}
              rows={2}
              value={content.headerSubtitle}
              onChange={(e) => patch("headerSubtitle", e.target.value)}
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Artist & story
          </h2>
          <Field label="Photo caption">
            <input
              className={inputClass}
              value={content.artistImageCaption}
              onChange={(e) => patch("artistImageCaption", e.target.value)}
            />
          </Field>
          <Field label="Story heading">
            <input
              className={inputClass}
              value={content.workHeading}
              onChange={(e) => patch("workHeading", e.target.value)}
            />
          </Field>
          <Field label="First paragraph">
            <textarea
              className={inputClass}
              rows={4}
              value={content.workParagraph1}
              onChange={(e) => patch("workParagraph1", e.target.value)}
            />
          </Field>
          <Field label="Second paragraph">
            <textarea
              className={inputClass}
              rows={4}
              value={content.workParagraph2}
              onChange={(e) => patch("workParagraph2", e.target.value)}
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Studio standards
          </h2>
          <Field label="Section title">
            <input
              className={inputClass}
              value={content.standardsHeading}
              onChange={(e) => patch("standardsHeading", e.target.value)}
            />
          </Field>
          {content.standards.map((s, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-white/10 p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Standard {i + 1}
              </p>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={s.title}
                  onChange={(e) => patchStandard(i, "title", e.target.value)}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={s.text}
                  onChange={(e) => patchStandard(i, "text", e.target.value)}
                />
              </Field>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Bottom call to action
          </h2>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={content.ctaEyebrow}
              onChange={(e) => patch("ctaEyebrow", e.target.value)}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={content.ctaTitle}
              onChange={(e) => patch("ctaTitle", e.target.value)}
            />
          </Field>
          <Field label="Button label">
            <input
              className={inputClass}
              value={content.ctaButtonLabel}
              onChange={(e) => patch("ctaButtonLabel", e.target.value)}
            />
          </Field>
        </section>

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
          Save about page
        </button>
      </form>
    </div>
  );
}
