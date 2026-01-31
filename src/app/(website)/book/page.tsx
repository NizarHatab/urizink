"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ReactNode } from "react";
import { bookingFormToPayload } from "@/lib/serializers/bookings";
import createBookingRequest from "@/lib/api/bookings";
import { useState } from "react";
import { notify } from "@/lib/ui/toast";


export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  /* ---------------- DATA ---------------- */

  const placements = ["Forearm", "Upper Arm", "Chest", "Back", "Thigh", "Calf"];
  const times = [
    { label: "11:00 AM", value: "11:00" },
    { label: "02:00 PM", value: "14:00" },
    { label: "05:00 PM", value: "17:00" },
  ]; async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = bookingFormToPayload(
        new FormData(e.currentTarget)
      );
      const { success, error } = await createBookingRequest(payload);
      if (!success) {
        notify.error(error || "Failed to create booking request");
        setLoading(false);
        return;
      }
      notify.success("Booking request submitted successfully");
      setSuccess(true);
      setLoading(false);
      //reset the form 
      const form = e.currentTarget;
      form.reset();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Failed to create booking request");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white  antialiased">
      {/* HEADER */}
      <Header />
      {/* MAIN */}
      <main className="flex flex-col items-center py-12 px-4 md:px-10">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
            Booking Request
          </h1>
          <p className="text-neutral-400 uppercase tracking-widest text-sm mb-12">
            Black & Grey Specialists • Beirut, Lebanon
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Step index={1} label="Design Idea" active />
            <Step index={2} label="Placement" />
            <Step index={3} label="Schedule" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card title="1. Your Concept" icon="edit_note">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <Card title="2. Body Placement" icon="accessibility_new">
              <div className="grid grid-cols-2 gap-3">
                {placements.map((p) => (
                  <Radio key={p} name="placement" label={p} value={p} />
                ))}
              </div>
            </Card>

            <Card title="3. Preferred Date" icon="calendar_month">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-neutral-900 p-6 border border-neutral-800">
                  <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">
                    Select a Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full bg-neutral-100 text-black px-4 py-3 focus:ring-2 focus:ring-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">
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

            <div className="flex justify-end border-t border-neutral-800 pt-6">
              <button
                disabled={loading}
                type="submit"
                className="flex items-center gap-3 bg-white text-black px-8 py-4 font-black uppercase tracking-widest hover:bg-neutral-200 transition shadow-lg"
              >
                {loading ? "Submitting..." : "Confirm Booking"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
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
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
    <div
      className={`flex items-center gap-3 border-b-2 pb-2 ${active ? "border-white" : "border-neutral-700 text-neutral-500"
        }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${active ? "bg-white text-black" : "border border-neutral-600"
          }`}
      >
        {index}
      </span>
      <span className="uppercase font-bold tracking-wider text-sm">
        {label}
      </span>
    </div>
  );
}

function Card({ title, icon, children }: CardProps) {
  return (
    <div className="bg-neutral-800/50 border border-neutral-800 p-8 rounded-sm shadow-xl">
      <div className="flex items-center gap-2 mb-6 border-b border-neutral-700 pb-4">
        <span className="material-symbols-outlined text-neutral-400">
          {icon}
        </span>
        <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-neutral-100 border-0 text-black px-4 py-3 focus:ring-2 focus:ring-white focus:outline-none"
      />
    </div>
  );
}

function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full bg-neutral-100 border-0 text-black px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-white focus:outline-none"
      />
    </div>
  );
}

function Select({ label, options, name }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
        {label}
      </label>
      <select name={name} className="w-full bg-neutral-100 border-0 text-black px-4 py-3 focus:ring-2 focus:ring-white focus:outline-none">
        {options.map((o) => (
          <option key={o}>{o} </option>
        ))}
      </select>
    </div>
  );
}

function FileUpload({ label }: FileUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
        {label}
      </label>
      <label className="flex items-center justify-center w-full h-12 bg-neutral-200 hover:bg-white text-neutral-800 cursor-pointer transition-colors border-2 border-dashed border-neutral-400">
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
    <label className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-700 cursor-pointer hover:border-white transition-colors group">
      <input
        type="radio"
        name={name}
        value={value}
        required
        className="text-black focus:ring-white bg-neutral-800 border-neutral-600"
      />
      <span className="text-sm font-medium uppercase tracking-wide group-hover:text-white text-neutral-400">
        {label}
      </span>
    </label>
  );
}

