"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { bookingFormToPayload } from "@/lib/serializers/bookings";
import createBookingRequest from "@/lib/api/bookings";
import { bookingCreateSchema } from "@/lib/validators/booking";
import {
  BOOKING_SIZE_OPTIONS,
  durationMinutesFromSize,
  formatDurationLabel,
} from "@/lib/booking-duration";
import { getAvailableDates, getAvailableSlots } from "@/lib/api/schedule";
import {
  BOOKING_REFERENCE_ACCEPT,
  BOOKING_REFERENCE_MAX_FILES,
  validateBookingReferenceFiles,
} from "@/lib/booking-reference-upload";
import { isWhatsAppEnabled, sendBookingToWhatsApp } from "@/lib/whatsapp";
import {
  formatStudioTimeLabel,
  utcToStudioHm,
} from "@/lib/studio-time";
import { notify } from "@/lib/ui/toast";
import { motion } from "framer-motion";
import { PenLine, MapPin, Calendar } from "lucide-react";

const placements = ["Forearm", "Upper Arm", "Chest", "Back", "Thigh", "Calf"];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{ start: string; end: string; label?: string }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotStart, setSelectedSlotStart] = useState("");
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [referencePreviews, setReferencePreviews] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState(BOOKING_SIZE_OPTIONS[0]);
  const sessionMinutes = durationMinutesFromSize(selectedSize);

  const fromDate = new Date();
  const fromStr = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, "0")}-${String(fromDate.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    setSelectedDate("");
    setSelectedSlotStart("");
    setAvailableSlots([]);
    getAvailableDates(fromStr, 4, sessionMinutes).then((res) => {
      if (res.success && res.data) setAvailableDates(res.data);
      else setAvailableDates([]);
    });
  }, [fromStr, sessionMinutes]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedSlotStart("");
      return;
    }
    setSelectedSlotStart("");
    setSlotsLoading(true);
    getAvailableSlots(selectedDate, sessionMinutes)
      .then((res) => {
        if (res.success && res.data) setAvailableSlots(res.data);
        else setAvailableSlots([]);
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, sessionMinutes]);

  const selectableSlots = useMemo(() => {
    const now = Date.now();
    const seen = new Set<number>();
    return availableSlots.filter((slot) => {
      const ms = new Date(slot.start).getTime();
      if (!Number.isFinite(ms) || ms <= now || seen.has(ms)) return false;
      seen.add(ms);
      return true;
    });
  }, [availableSlots]);

  function clearReferenceFiles() {
    referencePreviews.forEach((url) => URL.revokeObjectURL(url));
    setReferencePreviews([]);
    setReferenceFiles([]);
  }

  function onReferenceFilesChange(files: FileList | null) {
    if (!files?.length) return;
    const next = [...referenceFiles, ...Array.from(files)].slice(
      0,
      BOOKING_REFERENCE_MAX_FILES
    );
    const check = validateBookingReferenceFiles(next);
    if (!check.ok) {
      notify.error(check.error);
      return;
    }
    referencePreviews.forEach((url) => URL.revokeObjectURL(url));
    setReferenceFiles(next);
    setReferencePreviews(next.map((f) => URL.createObjectURL(f)));
  }

  function removeReferenceFile(index: number) {
    URL.revokeObjectURL(referencePreviews[index]);
    setReferenceFiles((prev) => prev.filter((_, i) => i !== index));
    setReferencePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    try {
      const payload = bookingFormToPayload(new FormData(form));
      const parsed = bookingCreateSchema.safeParse(payload);
      if (!parsed.success) {
        notify.error(
          parsed.error.issues.map((i) => i.message).join(" ")
        );
        setLoading(false);
        return;
      }
      const fileCheck = validateBookingReferenceFiles(referenceFiles);
      if (!fileCheck.ok) {
        notify.error(fileCheck.error);
        setLoading(false);
        return;
      }
      const res = await createBookingRequest(parsed.data, referenceFiles);
      if (!res.success) {
        notify.error(res.error || "Failed to create booking request");
        setLoading(false);
        return;
      }
      if (isWhatsAppEnabled()) {
        sendBookingToWhatsApp({
          ...parsed.data,
          referenceImageUrls: res.booking?.referenceImageUrls,
        });
        notify.success(
          "Booking saved — we emailed the studio. You can also send the WhatsApp message if you opened it.",
        );
      } else {
        notify.success(
          "Booking request received — we'll contact you soon.",
        );
      }
      form.reset();
      clearReferenceFiles();
      setSelectedDate("");
      setSelectedSlotStart("");
      setAvailableSlots([]);
    } catch (err) {
      notify.error(
        err instanceof Error ? err.message : "Failed to create booking request"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center px-4 py-16 md:px-10 md:py-24">
      <div className="w-full max-w-2xl">
        {/* PAGE HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-16 text-center"
        >
          <p className="font-display mb-3 text-xs uppercase tracking-[0.35em] text-[var(--ink-gray-500)]">
            Request a session
          </p>
          <h1 className="font-display mb-4 text-4xl uppercase tracking-[0.08em] text-white md:text-5xl lg:text-6xl">
            Booking Request
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--ink-gray-400)]">
            Share your concept, placement, and preferred date. We’ll get back to confirm availability.
          </p>
        </motion.header>

        {/* STEP INDICATOR */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="mb-14 flex items-center justify-center gap-2 md:gap-4"
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`font-display flex h-9 w-9 items-center justify-center text-sm ${
                  i === 1
                    ? "bg-white text-black"
                    : "border border-[var(--ink-gray-600)] text-[var(--ink-gray-500)]"
                }`}
              >
                {i}
              </span>
              {i < 3 && (
                <span className="hidden h-px w-8 bg-[var(--ink-gray-800)] md:block" />
              )}
            </div>
          ))}
          <span className="ml-2 font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)] md:ml-4">
            Concept · Placement · Date
          </span>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SECTION 1: YOUR CONCEPT */}
          <Card title="Your concept" index={0} icon={<PenLine className="h-5 w-5" />}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First name" name="firstName" placeholder="Jane" />
              <Input label="Last name" name="lastName" placeholder="Doe" />
              <Input label="Phone" name="phone" placeholder="+961 …" className="sm:col-span-2" />
              <Input label="Email" name="email" placeholder="jane@example.com" className="sm:col-span-2" type="email" />
            </div>
            <Textarea
              label="Tattoo description"
              name="description"
              placeholder="Describe your idea: style, subject, reference if any…"
              rows={4}
              required
              minLength={10}
              hint="At least 10 characters — e.g. style, subject, and placement details."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
                  Approximate size
                </label>
                <select
                  name="size"
                  required
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className={inputClass}
                >
                  {BOOKING_SIZE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o} (~{formatDurationLabel(durationMinutesFromSize(o))})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[var(--ink-gray-500)]">
                  Longer pieces need a longer open block on the calendar. Uriz
                  confirms the exact plan after you submit.
                </p>
              </div>
              <ReferenceImagesUpload
                files={referenceFiles}
                previews={referencePreviews}
                onAdd={onReferenceFilesChange}
                onRemove={removeReferenceFile}
              />
            </div>
          </Card>

          {/* SECTION 2: BODY PLACEMENT */}
          <Card title="Body placement" index={1} icon={<MapPin className="h-5 w-5" />}>
            <p className="mb-4 text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
              Where do you want it?
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {placements.map((p, i) => (
                <Radio
                  key={p}
                  name="placement"
                  label={p}
                  value={p}
                  required={i === 0}
                />
              ))}
            </div>
          </Card>

          {/* SECTION 3: PREFERRED DATE */}
          <Card title="Preferred date" index={2} icon={<Calendar className="h-5 w-5" />}>
            {availableDates.length === 0 ? (
              <>
                <p className="mb-4 text-sm leading-relaxed text-[var(--ink-gray-400)]">
                  Online scheduling is not active yet. Mention your preferred days or times in the tattoo
                  description above, or we’ll contact you to book.
                </p>
                <input type="hidden" name="date" value="" />
                <input type="hidden" name="time" value="" />
              </>
            ) : (
              <>
                <p className="mb-4 text-xs text-[var(--ink-gray-500)]">
                  Showing slots for a{" "}
                  <strong className="text-[var(--ink-gray-300)]">
                    {formatDurationLabel(sessionMinutes)}
                  </strong>{" "}
                  session ({selectedSize}). Times shown are studio local (Beirut).
                </p>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="relative z-10">
                    <label
                      htmlFor="booking-date"
                      className="mb-3 block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-400)]"
                    >
                      Select a date
                    </label>
                    <select
                      id="booking-date"
                      name="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`${inputClass} min-h-[52px] cursor-pointer`}
                    >
                      <option value="">Choose a day…</option>
                      {availableDates.map((d) => (
                        <option key={d} value={d}>
                          {new Date(d + "T12:00:00").toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-[10px] text-[var(--ink-gray-500)]">
                      Only days with open slots are listed.
                    </p>
                  </div>
                  <div>
                    <label className="mb-3 block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-400)]">
                      Preferred time
                    </label>
                    {!selectedDate ? (
                      <p className="text-sm text-[var(--ink-gray-500)]">
                        Select a date first.
                      </p>
                    ) : slotsLoading ? (
                      <p className="text-sm text-[var(--ink-gray-500)]">
                        Loading times…
                      </p>
                    ) : selectableSlots.length === 0 ? (
                      <p className="text-sm text-[var(--ink-gray-500)]">
                        No available times on this day. Try another date.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="hidden"
                          name="time"
                          value={
                            selectedSlotStart
                              ? utcToStudioHm(selectedSlotStart)
                              : ""
                          }
                        />
                        {selectableSlots.map((slot) => {
                          const selected = selectedSlotStart === slot.start;
                          const label =
                            slot.label ?? formatStudioTimeLabel(slot.start);
                          return (
                            <button
                              key={slot.start}
                              type="button"
                              onClick={() => setSelectedSlotStart(slot.start)}
                              className={`flex w-full min-h-[52px] cursor-pointer items-center justify-between gap-3 border px-4 py-3.5 text-left transition-colors ${
                                selected
                                  ? "border-white bg-white/10 text-white"
                                  : "border-[var(--ink-gray-800)] bg-black text-[var(--ink-gray-400)] hover:border-[var(--ink-gray-600)] hover:text-white"
                              }`}
                            >
                              <span className="font-display text-sm uppercase tracking-wide">
                                {label}
                              </span>
                              {selected && (
                                <span className="text-[10px] uppercase tracking-widest text-[var(--ink-gray-400)]">
                                  Selected
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* SUBMIT */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col items-center border-t border-[var(--ink-border)] pt-12"
          >
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? undefined : { scale: 1.02 }}
              whileTap={loading ? undefined : { scale: 0.98 }}
              className="font-display inline-flex h-14 items-center justify-center gap-3 border-2 border-white px-12 text-base uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send request"}
              <span className="text-lg">→</span>
            </motion.button>
            <p className="mt-4 text-center text-xs text-[var(--ink-gray-500)]">
              {isWhatsAppEnabled()
                ? "We’ll email the studio. You may also open WhatsApp with your details pre-filled."
                : "We’ll email the studio and follow up with you soon."}
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- TYPES ---------------- */

interface CardProps {
  title: string;
  children: ReactNode;
  index: number;
  icon: React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: string[];
}

interface ReferenceImagesUploadProps {
  files: File[];
  previews: string[];
  onAdd: (list: FileList | null) => void;
  onRemove: (index: number) => void;
}

interface RadioProps {
  label: string;
  name: string;
  value: string;
  required?: boolean;
}

/* ---------------- COMPONENTS ---------------- */

function Card({ title, children, index, icon }: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      className="overflow-visible border-l-2 border-[var(--ink-gray-800)] pl-6 md:pl-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="text-[var(--ink-gray-500)]">{icon}</span>
        <h2 className="font-display text-lg uppercase tracking-[0.15em] text-white md:text-xl">
          {title}
        </h2>
      </div>
      <div className="space-y-5">{children}</div>
    </motion.section>
  );
}

const inputClass =
  "w-full border border-[var(--ink-gray-800)] bg-black px-4 py-3.5 text-white outline-none transition-colors placeholder:text-[var(--ink-gray-600)] focus:border-white focus:ring-0";

function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
        {label}
      </label>
      <input {...props} className={inputClass} />
    </div>
  );
}

function Textarea({
  label,
  rows = 4,
  hint,
  ...props
}: TextareaProps & { hint?: string }) {
  return (
    <div className="space-y-2">
      <label className="block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
        {label}
      </label>
      <textarea
        {...props}
        rows={rows}
        className={`${inputClass} resize-none`}
      />
      {hint ? (
        <p className="text-[10px] text-[var(--ink-gray-500)]">{hint}</p>
      ) : null}
    </div>
  );
}

function Select({ label, options, name }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
        {label}
      </label>
      <select name={name} required className={inputClass}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ReferenceImagesUpload({
  files,
  previews,
  onAdd,
  onRemove,
}: ReferenceImagesUploadProps) {
  const atMax = files.length >= BOOKING_REFERENCE_MAX_FILES;

  return (
    <div className="space-y-2 sm:col-span-2">
      <label className="block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
        Reference images (optional)
      </label>
      <p className="text-[10px] text-[var(--ink-gray-500)]">
        Up to {BOOKING_REFERENCE_MAX_FILES} images, 4MB each — JPEG, PNG, WebP, or GIF.
      </p>
      {!atMax && (
        <label className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-[var(--ink-gray-700)] bg-transparent px-4 py-3 text-xs uppercase tracking-wider text-[var(--ink-gray-400)] transition-colors hover:border-[var(--ink-gray-500)] hover:text-white">
          <span>+</span>
          <span>Add reference photos</span>
          <input
            type="file"
            multiple
            className="hidden"
            accept={BOOKING_REFERENCE_ACCEPT}
            onChange={(e) => {
              onAdd(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      )}
      {previews.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((src, i) => (
            <li
              key={src}
              className="relative aspect-square overflow-hidden border border-[var(--ink-gray-800)] bg-[var(--ink-gray-900)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={files[i]?.name ?? `Reference ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 min-h-[32px] min-w-[32px] rounded bg-black/80 px-2 text-[10px] font-bold uppercase text-white"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Radio({ label, name, value, required = false }: RadioProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 border border-[var(--ink-gray-800)] bg-black px-4 py-3.5 transition-colors hover:border-[var(--ink-gray-600)]">
      <input
        type="radio"
        name={name}
        value={value}
        required={required}
        className="h-4 w-4 border-[var(--ink-gray-600)] bg-black text-white focus:ring-white focus:ring-offset-0 focus:ring-offset-black"
      />
      <span className="font-display text-sm uppercase tracking-wide text-[var(--ink-gray-400)] group-hover:text-white">
        {label}
      </span>
    </label>
  );
}
