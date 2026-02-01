"use client";

import { ReactNode } from "react";
import { bookingFormToPayload } from "@/lib/serializers/bookings";
import createBookingRequest from "@/lib/api/bookings";
import { useState } from "react";
import { notify } from "@/lib/ui/toast";
import { motion } from "framer-motion";

const placements = ["Forearm", "Upper Arm", "Chest", "Back", "Thigh", "Calf"];
const times = [
  { label: "11:00 AM", value: "11:00" },
  { label: "02:00 PM", value: "14:00" },
  { label: "05:00 PM", value: "17:00" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = bookingFormToPayload(new FormData(e.currentTarget));
      const { success: ok, error: err } = await createBookingRequest(payload);
      if (!ok) {
        notify.error(err || "Failed to create booking request");
        setLoading(false);
        return;
      }
      notify.success("Booking request submitted successfully");
      setSuccess(true);
      setLoading(false);
      const form = e.currentTarget;
      form.reset();
    } catch (err) {
      notify.error(
        err instanceof Error ? err.message : "Failed to create booking request"
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-12 md:px-10 w-full">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <h1 className="mb-2 text-4xl font-black uppercase tracking-tighter text-white md:text-5xl">
              Booking Request
            </h1>
            <p className="mb-12 text-sm uppercase tracking-widest text-[var(--ink-gray-400)]">
              Black & Grey Specialists • Beirut, Lebanon
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <Step index={1} label="Design Idea" active />
            <Step index={2} label="Placement" />
            <Step index={3} label="Schedule" />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card title="1. Your Concept" icon="edit_note" index={0}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="First Name" name="firstName" placeholder="Jane" />
                <Input label="Last Name" name="lastName" placeholder="Doe" />
                <Input label="Phone" name="phone" placeholder="0961790000000" />
                <Input label="Email" name="email" placeholder="jane@example.com" />
              </div>
              <Textarea
                label="Tattoo Description"
                name="description"
                placeholder="I'm looking to get a realistic lion portrait..."
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Select
                  label="Approximate Size"
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
                <FileUpload label="Reference Images" />
              </div>
            </Card>

            <Card title="2. Body Placement" icon="accessibility_new" index={1}>
              <div className="grid grid-cols-2 gap-3">
                {placements.map((p) => (
                  <Radio key={p} name="placement" label={p} value={p} />
                ))}
              </div>
            </Card>

            <Card title="3. Preferred Date" icon="calendar_month" index={2}>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="border border-[var(--ink-gray-800)] bg-[var(--ink-gray-900)] p-6">
                  <label className="mb-4 block text-sm font-bold uppercase tracking-widest text-[var(--ink-gray-400)]">
                    Select a Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full bg-[var(--ink-gray-100)] px-4 py-3 text-black outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-widest text-[var(--ink-gray-400)]">
                    Available Slots
                  </label>
                  <div className="space-y-3">
                    {times.map((t) => (
                      <Radio
                        key={t.value}
                        name="time"
                        label={t.label}
                        value={t.value}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="flex justify-end border-t border-[var(--ink-gray-800)] pt-6"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? undefined : { scale: 1.02 }}
                whileTap={loading ? undefined : { scale: 0.98 }}
                className="flex items-center gap-3 bg-white px-8 py-4 font-black uppercase tracking-widest text-black shadow-lg transition-opacity hover:bg-[var(--ink-gray-200)] disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Confirm Booking"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </motion.button>
            </motion.div>
          </form>
        </div>
    </div>
  );
}

/* ---------------- TYPES ---------------- */

interface StepProps {
  index: number;
  label: string;
  active?: boolean;
}

interface CardProps {
  title: string;
  icon: string;
  children: ReactNode;
  index: number;
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

function Step({ index, label, active = false }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease }}
      className={`flex items-center gap-3 border-b-2 pb-2 ${
        active
          ? "border-white"
          : "border-[var(--ink-gray-700)] text-[var(--ink-gray-500)]"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          active
            ? "bg-white text-black"
            : "border border-[var(--ink-gray-600)]"
        }`}
      >
        {index}
      </span>
      <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

function Card({ title, icon, children, index }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      className="rounded-sm border border-[var(--ink-gray-800)] bg-[var(--ink-gray-800)]/50 p-8 shadow-xl"
    >
      <div className="mb-6 flex items-center gap-2 border-b border-[var(--ink-gray-700)] pb-4">
        <span className="material-symbols-outlined text-[var(--ink-gray-400)]">
          {icon}
        </span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
}

function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-400)]">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-[var(--ink-gray-100)] px-4 py-3 text-black outline-none focus:ring-2 focus:ring-white"
      />
    </div>
  );
}

function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-400)]">
        {label}
      </label>
      <textarea
        {...props}
        className="h-32 w-full resize-none bg-[var(--ink-gray-100)] px-4 py-3 text-black outline-none focus:ring-2 focus:ring-white"
      />
    </div>
  );
}

function Select({ label, options, name }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-400)]">
        {label}
      </label>
      <select
        name={name}
        className="w-full bg-[var(--ink-gray-100)] px-4 py-3 text-black outline-none focus:ring-2 focus:ring-white"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function FileUpload({ label }: FileUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-400)]">
        {label}
      </label>
      <label className="flex h-12 w-full cursor-pointer items-center justify-center border-2 border-dashed border-[var(--ink-gray-400)] bg-[var(--ink-gray-200)] text-[var(--ink-gray-800)] transition-colors hover:bg-white">
        <span className="material-symbols-outlined mr-2 text-sm">
          upload_file
        </span>
        <span className="text-xs font-bold uppercase tracking-wide">
          Upload Files
        </span>
        <input type="file" multiple className="hidden" />
      </label>
    </div>
  );
}

function Radio({ label, name, value }: RadioProps) {
  return (
    <motion.label
      whileHover={{ x: 2 }}
      className="group flex cursor-pointer items-center gap-3 border border-[var(--ink-gray-700)] bg-[var(--ink-gray-900)] p-3 transition-colors hover:border-white"
    >
      <input
        type="radio"
        name={name}
        value={value}
        required
        className="border-[var(--ink-gray-600)] bg-[var(--ink-gray-800)] text-black focus:ring-white"
      />
      <span className="text-sm font-medium uppercase tracking-wide text-[var(--ink-gray-400)] group-hover:text-white">
        {label}
      </span>
    </motion.label>
  );
}
