"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Dealership {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface VehicleWithDealer {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  dealershipId: string;
  dealership: Dealership;
}

interface TimeSlotAvail {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  remaining: number;
}

interface Appointment {
  id: string;
  dateTime: string;
  purpose: string;
  status: string;
  dealership: { name: string; address: string; city: string; state: string };
  vehicle: { year: number; make: string; model: string; trim: string | null } | null;
}

export default function AppointmentsPage() {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [vehicles, setVehicles] = useState<VehicleWithDealer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDealer, setSelectedDealer] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slots, setSlots] = useState<TimeSlotAvail[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((data: VehicleWithDealer[]) => {
        setVehicles(data);
        const dealerMap = new Map<string, Dealership>();
        data.forEach((v) => {
          if (v.dealership) dealerMap.set(v.dealership.id, v.dealership);
        });
        setDealerships(Array.from(dealerMap.values()));
      });
    fetch("/api/appointments").then((r) => r.json()).then(setAppointments);
  }, []);

  useEffect(() => {
    if (selectedDealer && selectedDate) {
      fetch(`/api/appointments/slots?dealershipId=${selectedDealer}&date=${selectedDate}`)
        .then((r) => r.json())
        .then(setSlots);
    }
  }, [selectedDealer, selectedDate]);

  async function handleSubmit() {
    setSubmitting(true);
    const [hours, minutes] = selectedTime.split(":");
    const dateTime = new Date(selectedDate + "T00:00:00");
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealershipId: selectedDealer,
          vehicleId: selectedVehicle || null,
          dateTime: dateTime.toISOString(),
          notes: notes || null,
        }),
      });

      if (res.ok) {
        toast.success("You're all set! 🎉", {
          description: "Your appointment is booked. We'll have everything ready.",
        });
        const updated = await fetch("/api/appointments").then((r) => r.json());
        setAppointments(updated);
        setStep(4);
      } else {
        toast.error("Booking failed", {
          description: "Something went wrong. Please try again.",
        });
      }
    } catch {
      toast.error("Connection error", {
        description: "Check your internet and try again.",
      });
    }
    setSubmitting(false);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const statusConfig: Record<string, { color: string; icon: string }> = {
    PENDING: { color: "bg-amber-50 text-amber-700", icon: "⏳" },
    CONFIRMED: { color: "bg-emerald-50 text-emerald-700", icon: "✅" },
    CANCELLED: { color: "bg-red-50 text-red-700", icon: "❌" },
    COMPLETED: { color: "bg-blue-50 text-blue-700", icon: "🏁" },
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="flex items-center gap-4">
        <img src="/illustrations/calendar1.png" alt="Book appointment" width={64} height={48} className="shrink-0 hidden sm:block" />
        <div>
          <h1 className="text-2xl font-bold text-teal-800">Book Appointment</h1>
          <p className="text-gray-500 mt-1">
            Schedule your test drive & signing — we&apos;ll have everything ready
          </p>
        </div>
      </div>

      {/* Existing appointments */}
      {appointments.length > 0 && (
        <div className="mt-6 space-y-3">
          {appointments.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.PENDING;
            return (
              <div key={apt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(apt.dateTime).toLocaleDateString("en-US", {
                        weekday: "long", month: "long", day: "numeric",
                      })}
                      {" at "}
                      {new Date(apt.dateTime).toLocaleTimeString("en-US", {
                        hour: "numeric", minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {apt.dealership.name} · {apt.dealership.city}, {apt.dealership.state}
                    </p>
                    {apt.vehicle && (
                      <p className="text-sm text-gray-400 mt-0.5">
                        🏎️ {apt.vehicle.year} {apt.vehicle.make} {apt.vehicle.model}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${config.color}`}>
                    {config.icon} {apt.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking wizard */}
      {step < 4 && (
        <div className="mt-8">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-orange-500" : "bg-gray-200"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base">📍</span>
                Choose Dealership & Vehicle
              </h3>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Dealership</label>
                  <select
                    value={selectedDealer}
                    onChange={(e) => setSelectedDealer(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none bg-white"
                  >
                    <option value="">Select a dealership</option>
                    {dealerships.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} — {d.city}, {d.state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vehicle (optional — you can decide at the dealership)</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none bg-white"
                  >
                    <option value="">No preference</option>
                    {vehicles
                      .filter((v) => !selectedDealer || v.dealershipId === selectedDealer)
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.year} {v.make} {v.model} {v.trim || ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedDealer}
                className="mt-6 w-full py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">🗓️</span>
                Pick a Date & Time
              </h3>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <input
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>
                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Available Times</label>
                    {slots.length === 0 ? (
                      <div className="mt-3 p-4 rounded-xl bg-gray-50 text-center">
                        <p className="text-2xl mb-1">😴</p>
                        <p className="text-sm text-gray-400">No slots available — dealership may be closed this day</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.startTime)}
                            className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              selectedTime === slot.startTime
                                ? "bg-orange-500 text-white shadow-md scale-105"
                                : slot.available
                                ? "bg-gray-50 text-gray-700 hover:bg-orange-50 border border-gray-200"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-base">👀</span>
                Review & Confirm
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">📍 Dealership</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dealerships.find((d) => d.id === selectedDealer)?.name}
                  </span>
                </div>
                {selectedVehicle && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">🏎️ Vehicle</span>
                    <span className="text-sm font-medium text-gray-800">
                      {(() => { const v = vehicles.find((v) => v.id === selectedVehicle); return v ? `${v.year} ${v.make} ${v.model}` : ""; })()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">🗓️ Date</span>
                  <span className="text-sm font-medium text-gray-800">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">🕐 Time</span>
                  <span className="text-sm font-medium text-gray-800">{selectedTime}</span>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-600">Notes for the dealer (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
                  placeholder="Anything they should know..."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                  ← Back
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Book It! 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500 text-4xl mb-4 shadow-sm">
            🎉
          </div>
          <h2 className="text-xl font-bold text-gray-800">Appointment Booked!</h2>
          <p className="text-gray-500 mt-2">
            We&apos;ll have everything ready for you. Just show up, test drive, sign, and drive away.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            ⏱️ Estimated visit time: ~30 minutes
          </p>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm your appointment?"
        description={`${dealerships.find((d) => d.id === selectedDealer)?.name || ""} on ${selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : ""} at ${selectedTime}`}
        confirmLabel="Book it!"
        variant="default"
        onConfirm={handleSubmit}
        loading={submitting}
      />
    </div>
  );
}
