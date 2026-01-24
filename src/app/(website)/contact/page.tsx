"use client";

import { useState } from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { sendToWhatsApp } from "@/lib/whatsapp";

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

    // Basic validation
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
    <div className="relative flex min-h-screen w-full flex-col bg-black text-white overflow-x-hidden">
      <Header />

      <main className="flex flex-col w-full grow">
        {/* HERO */}
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-neutral-900 bg-neutral-900">
          <div
            className="absolute inset-0 bg-center bg-cover grayscale contrast-125"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNhq3MgpA9qyvKF8xCZIo0BeCqAjh4dwKeVNZFjplyn1PfTmVC1Q0eiXDyyOCdFX9W6H7esieZYFFaI5wm2HPiAPkaYtqUSVYRUnP4aqkDGEKuF-XvMir25lFZCeF5em53tr7CPzB1ayU-Fj_uPRSi34xSF__gJ4ISPTHxKQpdV_ryjufQB3mk_W3UwxTDTsEQ96ffuqb2iRb2qHZMcG3LCRHkk9UgamPseRRSF4yCO4s_xQ_T9yFPHHetOHWIBhBqLnS7eU2_dr1y")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

          <div className="relative z-10 text-center px-4 mt-auto mb-10">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
              Contact
            </h1>
            <p className="text-neutral-400 text-sm md:text-base uppercase tracking-[0.3em] mt-2">
              Get inked in Beirut
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="flex flex-col lg:flex-row w-full bg-black">
          {/* STUDIO INFO */}
          <div className="w-full lg:w-1/2 p-10 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-neutral-900">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-12">
              Studio Details
            </h2>

            <div className="space-y-12">
              <InfoRow title="Location" icon="location_on">
                Mar Mikhael, Armenia Street
                <br />
                Beirut, Lebanon
              </InfoRow>

              <InfoRow title="Email" icon="mail">
                <a href="mailto:info@urizink.com" className="hover:underline">
                  info@urizink.com
                </a>
              </InfoRow>

              <InfoRow title="Phone" icon="call">
                <a href="tel:+96103123456" className="hover:underline">
                  +961 03 123 456
                </a>
              </InfoRow>

              <InfoRow title="Hours" icon="schedule">
                Tue – Sat: 11:00 AM – 8:00 PM
                <br />
                Sun – Mon: Closed
              </InfoRow>
            </div>
          </div>

          {/* FORM */}
          <div className="w-full lg:w-1/2 p-10 md:p-16 lg:p-24">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">
              Inquiries
            </h2>
            <p className="text-neutral-500 text-sm mb-10">
              Fill out the form below for appointments or general questions.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="firstName" label="First Name" placeholder="JANE" />
                <Input name="lastName" label="Last Name" placeholder="DOE" />
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

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-white text-black hover:bg-neutral-200 transition font-bold uppercase tracking-widest text-sm py-4 px-10 w-full md:w-auto self-start disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
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
    <div className="flex gap-6 group">
      <span className="material-symbols-outlined text-neutral-500 group-hover:text-white transition">
        {icon}
      </span>
      <div>
        <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-2">
          {title}
        </h3>
        <p className="text-white text-lg font-medium leading-relaxed">
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
      <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="bg-black border border-neutral-800 focus:border-white text-white p-4 text-sm outline-none transition placeholder-neutral-700"
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
      <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </label>
      <select
        name={name}
        className="bg-black border border-neutral-800 focus:border-white text-white p-4 text-sm outline-none transition cursor-pointer"
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
      <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        required
        className="bg-black border border-neutral-800 focus:border-white text-white p-4 text-sm outline-none transition h-32 resize-none placeholder-neutral-700"
      />
    </div>
  );
}
