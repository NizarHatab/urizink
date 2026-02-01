"use client";

import { useState } from "react";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: data.get("firstName") as string,
      lastName: data.get("lastName") as string,
      email: data.get("email") as string,
      subject: data.get("subject") as string,
      message: data.get("message") as string,
    };
    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.email ||
      !payload.message
    ) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    sendToWhatsApp(payload);
    setLoading(false);
    form.reset();
  };

  return (
    <div className="flex w-full grow flex-col">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className="relative flex min-h-[300px] min-h-[40vh] items-end justify-center overflow-hidden border-b border-[var(--ink-border)] bg-[var(--ink-gray-900)]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNhq3MgpA9qyvKF8xCZIo0BeCqAjh4dwKeVNZFjplyn1PfTmVC1Q0eiXDyyOCdFX9W6H7esieZYFFaI5wm2HPiAPkaYtqUSVYRUnP4aqkDGEKuF-XvMir25lFZCeF5em53tr7CPzB1ayU-Fj_uPRSi34xSF__gJ4ISPTHxKQpdV_ryjufQB3mk_W3UwxTDTsEQ96ffuqb2iRb2qHZMcG3LCRHkk9UgamPseRRSF4yCO4s_xQ_T9yFPHHetOHWIBhBqLnS7eU2_dr1y")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

          <div className="relative z-10 mb-10 mt-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-5xl font-black uppercase tracking-tighter text-white md:text-7xl"
            >
              Contact
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="mt-2 text-sm uppercase tracking-[0.3em] text-[var(--ink-gray-400)] md:text-base"
            >
              Get inked in Beirut
            </motion.p>
          </div>
        </motion.section>

        {/* CONTENT */}
        <section className="flex w-full flex-col bg-black lg:flex-row">
          {/* STUDIO INFO */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: "-60px" }}
            className="w-full border-b border-[var(--ink-border)] p-10 lg:border-b-0 lg:border-r lg:p-16 lg:p-24"
          >
            <h2 className="mb-12 text-3xl font-bold uppercase tracking-tight text-white">
              Studio Details
            </h2>
            <div className="space-y-12">
              <InfoRow title="Location" icon="location_on">
                Mar Mikhael, Armenia Street
                <br />
                Beirut, Lebanon
              </InfoRow>
              <InfoRow title="Email" icon="mail">
                <a
                  href="mailto:info@urizink.com"
                  className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-gray-400)]"
                >
                  info@urizink.com
                </a>
              </InfoRow>
              <InfoRow title="Phone" icon="call">
                <a
                  href="tel:+96103123456"
                  className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-gray-400)]"
                >
                  +961 03 123 456
                </a>
              </InfoRow>
              <InfoRow title="Hours" icon="schedule">
                Tue – Sat: 11:00 AM – 8:00 PM
                <br />
                Sun – Mon: Closed
              </InfoRow>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: "-60px" }}
            className="w-full p-10 lg:p-16 lg:p-24"
          >
            <h2 className="mb-2 text-3xl font-bold uppercase tracking-tight text-white">
              Inquiries
            </h2>
            <p className="mb-10 text-sm text-[var(--ink-gray-500)]">
              Fill out the form below for appointments or general questions.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  name="firstName"
                  label="First Name"
                  placeholder="JANE"
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  placeholder="DOE"
                />
              </div>
              <Input
                name="email"
                label="Email Address"
                placeholder="JANE@EXAMPLE.COM"
                type="email"
              />
              <Select
                name="subject"
                label="Subject"
                options={[
                  "booking inquiry",
                  "consultation request",
                  "guest spot info",
                  "other",
                ]}
              />
              <Textarea
                name="message"
                label="Message"
                placeholder="DESCRIBE YOUR IDEA, PLACEMENT, AND SIZE..."
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? undefined : { scale: 1.02 }}
                whileTap={loading ? undefined : { scale: 0.98 }}
                className="mt-4 w-full self-start bg-white py-4 px-10 text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:bg-[var(--ink-gray-200)] disabled:opacity-50 md:w-auto"
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </section>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function InfoRow({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group flex gap-6">
      <span className="material-symbols-outlined text-[var(--ink-gray-500)] transition-colors group-hover:text-white">
        {icon}
      </span>
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-500)]">
          {title}
        </h3>
        <p className="text-lg font-medium leading-relaxed text-white [&_a]:text-white [&_a]:hover:underline">
          {children}
        </p>
      </div>
    </div>
  );
}

function Input({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-500)]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="border border-[var(--ink-gray-800)] bg-black p-4 text-sm text-white outline-none transition-colors placeholder:text-[var(--ink-gray-700)] focus:border-white focus-visible:ring-2 focus-visible:ring-[var(--ink-gray-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      />
    </div>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-500)]">
        {label}
      </label>
      <select
        name={name}
        className="cursor-pointer border border-[var(--ink-gray-800)] bg-black p-4 text-sm text-white outline-none transition-colors focus:border-white focus-visible:ring-2 focus-visible:ring-[var(--ink-gray-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink-gray-500)]">
        {label}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        required
        className="h-32 resize-none border border-[var(--ink-gray-800)] bg-black p-4 text-sm text-white outline-none transition-colors placeholder:text-[var(--ink-gray-700)] focus:border-white focus-visible:ring-2 focus-visible:ring-[var(--ink-gray-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      />
    </div>
  );
}
