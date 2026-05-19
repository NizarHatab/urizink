"use client";

import { setAvailability } from "@/lib/api/schedule";
import type { ArtistAvailabilitySlot } from "@/types/schedule";
import { ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const WEEK_DAYS: { label: string; dayOfWeek: number }[] = [
  { label: "Monday", dayOfWeek: 1 },
  { label: "Tuesday", dayOfWeek: 2 },
  { label: "Wednesday", dayOfWeek: 3 },
  { label: "Thursday", dayOfWeek: 4 },
  { label: "Friday", dayOfWeek: 5 },
  { label: "Saturday", dayOfWeek: 6 },
  { label: "Sunday", dayOfWeek: 0 },
];

const HOUR_OPTIONS = Array.from({ length: 17 }, (_, i) => i + 6);

type DayDraft = {
  enabled: boolean;
  startHour: number;
  endHour: number;
};

function slotToDraft(slots: ArtistAvailabilitySlot[]): Record<number, DayDraft> {
  const draft: Record<number, DayDraft> = {};
  for (const { dayOfWeek } of WEEK_DAYS) {
    draft[dayOfWeek] = {
      enabled: false,
      startHour: 9,
      endHour: 18,
    };
  }
  for (const s of slots) {
    const startH = parseInt(s.startTime.split(":")[0] ?? "9", 10);
    const endH = parseInt(s.endTime.split(":")[0] ?? "18", 10);
    draft[s.dayOfWeek] = {
      enabled: true,
      startHour: startH,
      endHour: endH > startH ? endH : startH + 1,
    };
  }
  return draft;
}

function draftToSlots(draft: Record<number, DayDraft>) {
  return WEEK_DAYS.filter(({ dayOfWeek }) => draft[dayOfWeek]?.enabled)
    .map(({ dayOfWeek }) => {
      const d = draft[dayOfWeek]!;
      return {
        dayOfWeek,
        startTime: `${String(d.startHour).padStart(2, "0")}:00`,
        endTime: `${String(d.endHour).padStart(2, "0")}:00`,
      };
    })
    .filter((s) => {
      const [sh, sm] = s.startTime.split(":").map(Number);
      const [eh, em] = s.endTime.split(":").map(Number);
      return eh * 60 + em > sh * 60 + sm;
    });
}

type Props = {
  availability: ArtistAvailabilitySlot[];
  onSaved: (slots: ArtistAvailabilitySlot[]) => void;
};

export default function WeeklyHoursEditor({ availability, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<number, DayDraft>>(() =>
    slotToDraft(availability)
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(slotToDraft(availability));
  }, [availability]);

  const updateDay = useCallback(
    (dayOfWeek: number, patch: Partial<DayDraft>) => {
      setDraft((prev) => ({
        ...prev,
        [dayOfWeek]: { ...prev[dayOfWeek]!, ...patch },
      }));
    },
    []
  );

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const slots = draftToSlots(draft);
    if (slots.length === 0) {
      setSaveError("Enable at least one working day.");
      setSaving(false);
      return;
    }
    const res = await setAvailability(slots);
    setSaving(false);
    if (res.success && res.data) {
      onSaved(res.data);
      setOpen(false);
    } else {
      setSaveError(res.error ?? "Failed to save hours");
    }
  };

  const summary = WEEK_DAYS.filter(({ dayOfWeek }) => draft[dayOfWeek]?.enabled)
    .map(({ label, dayOfWeek }) => {
      const d = draft[dayOfWeek]!;
      const fmt = (h: number) =>
        h === 12 ? "12pm" : h > 12 ? `${h - 12}pm` : `${h}am`;
      return `${label.slice(0, 3)} ${fmt(d.startHour)}–${fmt(d.endHour)}`;
    })
    .join(" · ");

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/[0.02] transition"
      >
        <div>
          <p className="text-sm font-semibold text-white">Weekly working hours</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {summary || "No days set — clients cannot book online"}
          </p>
        </div>
        {open ? (
          <ChevronUp className="size-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="size-5 text-gray-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-white/10 p-4 space-y-4">
          <p className="text-xs text-gray-500">
            These hours repeat every week. The calendar and public booking page use
            them together with blocked time and existing appointments.
          </p>

          <div className="space-y-2">
            {WEEK_DAYS.map(({ label, dayOfWeek }) => {
              const d = draft[dayOfWeek]!;
              return (
                <div
                  key={dayOfWeek}
                  className="flex flex-wrap items-center gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  <label className="flex items-center gap-2 min-w-[120px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={d.enabled}
                      onChange={(e) =>
                        updateDay(dayOfWeek, { enabled: e.target.checked })
                      }
                      className="rounded border-white/20 bg-black"
                    />
                    <span className="text-sm text-white">{label}</span>
                  </label>
                  {d.enabled && (
                    <>
                      <select
                        value={d.startHour}
                        onChange={(e) =>
                          updateDay(dayOfWeek, {
                            startHour: Number(e.target.value),
                          })
                        }
                        className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white"
                      >
                        {HOUR_OPTIONS.map((h) => (
                          <option key={h} value={h}>
                            {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 text-sm">to</span>
                      <select
                        value={d.endHour}
                        onChange={(e) =>
                          updateDay(dayOfWeek, { endHour: Number(e.target.value) })
                        }
                        className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white"
                      >
                        {HOUR_OPTIONS.filter((h) => h > d.startHour).map((h) => (
                          <option key={h} value={h}>
                            {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {saveError && (
            <p className="text-sm text-red-400">{saveError}</p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save weekly hours
          </button>
        </div>
      )}
    </div>
  );
}
