// Bookings data layer.
// Writes to Supabase when env is configured; otherwise persists to localStorage
// so the prototype stays interactive without a backend.

import { getSupabaseClient, hasSupabase } from "@/lib/supabase/client";

export type LocalBooking = {
  id: string;
  vehicle_id: string;
  vehicle_label: string;
  vehicle_photo: string;
  vehicle_location: string;
  start_date: string;
  end_date: string;
  driver_option: "with-driver" | "self-drive";
  total_cents: number;
  status: "pending" | "confirmed" | "active" | "completed" | "canceled";
  created_at: string;
};

const LS_KEY = "sakay-bookings";

const readLocal = (): LocalBooking[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as LocalBooking[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = (rows: LocalBooking[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(rows));
};

export type CreateBookingInput = {
  vehicleId: string;
  vehicleLabel: string;
  vehiclePhoto: string;
  vehicleLocation: string;
  startDate: string;
  endDate: string;
  driverOption: "with-driver" | "self-drive";
  totalCents: number;
  renterId?: string;
};

export async function createBooking(input: CreateBookingInput): Promise<LocalBooking> {
  const booking: LocalBooking = {
    id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    vehicle_id: input.vehicleId,
    vehicle_label: input.vehicleLabel,
    vehicle_photo: input.vehiclePhoto,
    vehicle_location: input.vehicleLocation,
    start_date: input.startDate,
    end_date: input.endDate,
    driver_option: input.driverOption,
    total_cents: input.totalCents,
    status: "confirmed",
    created_at: new Date().toISOString(),
  };

  const supabase = hasSupabase() && input.renterId ? getSupabaseClient() : null;
  if (supabase && input.renterId) {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        vehicle_id: input.vehicleId,
        renter_id: input.renterId,
        start_date: input.startDate,
        end_date: input.endDate,
        total_cents: input.totalCents,
        driver_option: input.driverOption,
        status: "confirmed",
      })
      .select("id, created_at")
      .single();

    if (!error && data) {
      booking.id = data.id;
      booking.created_at = data.created_at ?? booking.created_at;
    }
    // On error we still fall through to localStorage — the prototype
    // never fails a booking; SETUP.md flags this for hardening.
  }

  // Mirror to Airtable Bookings table (best-effort; no-ops if AIRTABLE_API_KEY
  // isn't set on the server). Gives hosts visibility of incoming bookings.
  try {
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: booking.id,
        carId: input.vehicleId,
        title: input.vehicleLabel,
        subtitle: `${input.vehicleLocation} · ${input.driverOption === "with-driver" ? "with driver" : "self-drive"}`,
        date: `${input.startDate} → ${input.endDate}`,
        amount: Math.round(input.totalCents / 100),
        photo: input.vehiclePhoto,
        renter: input.renterId,
      }),
    });
  } catch {
    // Network failure shouldn't fail the booking — already persisted locally.
  }

  const all = readLocal();
  all.unshift(booking);
  writeLocal(all);
  return booking;
}

export async function listMyBookings(renterId?: string): Promise<LocalBooking[]> {
  const supabase = hasSupabase() && renterId ? getSupabaseClient() : null;
  if (supabase && renterId) {
    const { data, error } = await supabase
      .from("bookings")
      .select("id, vehicle_id, start_date, end_date, total_cents, status, driver_option, created_at")
      .eq("renter_id", renterId)
      .order("start_date", { ascending: false });

    if (!error && data) {
      // We don't have vehicle_label/photo from this query; the activity page
      // can hydrate from /lib/mock for now. For real backend, join via the
      // vehicles_with_host view in a follow-up.
      return data.map((r) => ({
        id: r.id,
        vehicle_id: r.vehicle_id,
        vehicle_label: "",
        vehicle_photo: "",
        vehicle_location: "",
        start_date: r.start_date,
        end_date: r.end_date,
        driver_option: r.driver_option,
        total_cents: r.total_cents,
        status: r.status,
        created_at: r.created_at,
      }));
    }
  }
  return readLocal();
}

export function clearLocalBookings() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_KEY);
}
