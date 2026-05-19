"use client";

import { submitReview } from "@/lib/api/reviews";
import { notify } from "@/lib/ui/toast";
import type { ReviewListItem } from "@/types/review";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (review: ReviewListItem) => void;
};

export default function WriteReviewModal({ open, onClose, onSuccess }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setRating(5);
      setComment("");
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitReview({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (!res.success || !res.data) {
      notify.error(res.error ?? "Could not submit review");
      return;
    }
    notify.success("Thank you — your review was submitted");
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
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20 bg-black p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Write a review</h2>
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="text-gray-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
                First name
              </label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
                Last name
              </label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-gray-500">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`h-10 w-10 border text-sm font-bold transition ${
                    rating >= n
                      ? "border-white bg-white text-black"
                      : "border-white/20 text-gray-500"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
              Your experience
            </label>
            <textarea
              required
              minLength={10}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your session…"
              className="w-full resize-none border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 border-2 border-white py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
