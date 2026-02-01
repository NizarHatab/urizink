"use client";

import { ReactNode, useEffect, useState } from "react";
import { bookingFormToPayload } from "@/lib/serializers/bookings";
import createBookingRequest from "@/lib/api/bookings";
import { getAvailableDates, getAvailableSlots } from "@/lib/api/schedule";
import { notify } from "@/lib/ui/toast";
import { motion } from "framer-motion";
import { PenLine, MapPin, Calendar } from "lucide-react";

const placements = ["Forearm", "Upper Arm", "Chest", "Back", "Thigh", "Calf"];

const ease = [0.16, 1, 0.3, 1] as const;

function formatSlotTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{ start: string; end: string; label?: string }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const fromDate = new Date();
  const fromStr = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, "0")}-${String(fromDate.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    getAvailableDates(fromStr, null, 4).then((res) => {
      if (res.success && res.data) setAvailableDates(res.data);
    });
  }, [fromStr]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    setSlotsLoading(true);
    getAvailableSlots(selectedDate, null, 60)
      .then((res) => {
        if (res.success && res.data) setAvailableSlots(res.data);
        else setAvailableSlots([]);
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    try {
      const payload = bookingFormToPayload(new FormData(form));
      const { success: ok, error: err } = await createBookingRequest(payload);
      if (!ok) {
        notify.error(err || "Failed to create booking request");
        setLoading(false);
        return;
      }
      notify.success("Booking request submitted successfully");
      form.reset();
      setSelectedDate("");
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
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Select
                label="Approximate size"
                name="size"
                options={[
                  "Small (up to 5cm)",
                  "Medium (up to 15cm)",
                  "Large (up to 25cm)",
                  "Half Sleeve",
                  "Full Sleeve",
                  "Back Piece",
                ]}
              />
              <FileUpload label="Reference images" />
            </div>
          </Card>

          {/* SECTION 2: BODY PLACEMENT */}
          <Card title="Body placement" index={1} icon={<MapPin className="h-5 w-5" />}>
            <p className="mb-4 text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
              Where do you want it?
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {placements.map((p) => (
                <Radio key={p} name="placement" label={p} value={p} />
              ))}
            </div>
          </Card>

          {/* SECTION 3: PREFERRED DATE */}
          <Card title="Preferred date" index={2} icon={<Calendar className="h-5 w-5" />}>
            <p className="mb-4 text-xs text-[var(--ink-gray-500)]">
              Only days and times when the artist is available are shown.
            </p>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="relative z-10">
                <label
                  htmlFor="booking-date"
                  className="mb-3 block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-400)]"
                >
                  Select a date
                </label>
                <input
                  id="booking-date"
                  type="date"
                  name="date"
                  required
                  min={fromStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full min-h-[52px] cursor-pointer border border-[var(--ink-gray-800)] bg-black px-4 py-3.5 text-white outline-none transition-colors focus:border-white focus:ring-0 [color-scheme:dark]"
                />
                {availableDates.length > 0 && (
                  <p className="mt-2 text-[10px] text-[var(--ink-gray-500)]">
                    Artist works on selected weekdays only.
                  </p>
                )}
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
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-[var(--ink-gray-500)]">
                    No available times on this day. Try another date.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableSlots.map((slot) => {
                      const timeValue = formatSlotTime(slot.start);
                      const label = slot.label ?? new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      return (
                        <Radio
                          key={slot.start}
                          name="time"
                          label={label}
                          value={timeValue}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
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
              We’ll reply by WhatsApp or email to confirm.
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

interface FileUploadProps {
  label: string;
}

interface RadioProps {
  label: string;
  name: string;
  value: string;
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

function Textarea({ label, rows = 4, ...props }: TextareaProps) {
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

function FileUpload({ label }: FileUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)]">
        {label}
      </label>
      <label className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-[var(--ink-gray-700)] bg-transparent px-4 py-3 text-xs uppercase tracking-wider text-[var(--ink-gray-400)] transition-colors hover:border-[var(--ink-gray-500)] hover:text-white">
        <span>+</span>
        <span>Add files</span>
        <input type="file" multiple className="hidden" accept="image/*" />
      </label>
    </div>
  );
}

function Radio({ label, name, value }: RadioProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 border border-[var(--ink-gray-800)] bg-black px-4 py-3.5 transition-colors hover:border-[var(--ink-gray-600)]">
      <input
        type="radio"
        name={name}
        value={value}
        required
        className="h-4 w-4 border-[var(--ink-gray-600)] bg-black text-white focus:ring-white focus:ring-offset-0 focus:ring-offset-black"
      />
      <span className="font-display text-sm uppercase tracking-wide text-[var(--ink-gray-400)] group-hover:text-white">
        {label}
      </span>
    </label>
  );
}
