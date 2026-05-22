"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";

const sheetEase = [0.16, 1, 0.3, 1] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export default function WhatsAppOptInSheet({
  open,
  onClose,
  onConfirm,
  title = "Also send on WhatsApp?",
  description =
    "Your message was saved. Open WhatsApp with your details pre-filled, or skip — we'll reply by email.",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function handleYes() {
    onConfirm();
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex flex-col justify-end">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-opt-in-title"
            aria-describedby="whatsapp-opt-in-desc"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: sheetEase }}
            className="relative w-full rounded-t-2xl border border-b-0 border-white/10 bg-[#0a0a0a] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-24px_48px_rgba(0,0,0,0.5)]"
          >
            <div
              className="mx-auto mb-5 h-1 w-10 shrink-0 rounded-full bg-white/20"
              aria-hidden
            />

            <div className="mb-6 flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15">
                <MessageCircle
                  className="size-6 text-[#25D366]"
                  aria-hidden
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <h2
                  id="whatsapp-opt-in-title"
                  className="text-lg font-bold text-white"
                >
                  {title}
                </h2>
                <p
                  id="whatsapp-opt-in-desc"
                  className="mt-2 text-sm leading-relaxed text-[var(--ink-gray-400)]"
                >
                  {description}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleYes}
                className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#25D366] text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#20bd5a] active:scale-[0.99]"
              >
                Yes, open WhatsApp
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] w-full rounded-xl border border-white/10 py-3 text-sm font-semibold text-[var(--ink-gray-300)] transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                No thanks
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
