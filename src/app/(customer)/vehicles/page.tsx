"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Car,
  CheckCircle2,
  Fuel,
  Gauge,
  MapPin,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { CoachNote } from "@/components/prep/coach-note";

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  msrp: number;
  salePrice: number | null;
  exteriorColor: string | null;
  bodyType: string | null;
  fuelType: string | null;
  mileage: number;
  dealership: { name: string; city: string; state: string };
}

const bodyTypes = ["All", "Sedan", "SUV"];
const fuelTypes = ["All", "Gas", "Hybrid", "Electric"];

const displayFont = {
  fontFamily: "var(--font-baloo), var(--font-geist-sans), system-ui, sans-serif",
};

function VehicleGlyph({
  bodyType,
  fuelType,
}: {
  bodyType: string | null;
  fuelType: string | null;
}) {
  const Icon = fuelType === "Electric" ? Zap : Car;

  return (
    <div className="flex h-full min-h-36 items-center justify-center bg-[#eef8ff]">
      <div className="relative">
        <span className="absolute -right-5 -top-5 flex h-10 w-10 items-center justify-center rounded-md bg-[#fff3a8] text-[#655300]">
          {fuelType === "Electric" ? (
            <Zap className="h-5 w-5" />
          ) : (
            <Fuel className="h-5 w-5" />
          )}
        </span>
        <span className="flex h-24 w-24 items-center justify-center rounded-lg bg-white text-[#5d6dff] shadow-[0_16px_38px_rgba(93,109,255,0.16)]">
          <Icon className="h-12 w-12" />
        </span>
        {bodyType && (
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#f1e9ff] px-3 py-1 text-xs font-extrabold text-[#5d4b91]">
            {bodyType}
          </span>
        )}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [bodyFilter, setBodyFilter] = useState("All");
  const [fuelFilter, setFuelFilter] = useState("All");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    () => (typeof window !== "undefined" ? localStorage.getItem("prepPass.vehicleId") : null)
  );
  const shouldReduceMotion = useReducedMotion();

  // Keep localStorage in sync whenever the selection changes
  useEffect(() => {
    if (selectedVehicleId) {
      localStorage.setItem("prepPass.vehicleId", selectedVehicleId);
    } else {
      localStorage.removeItem("prepPass.vehicleId");
    }
  }, [selectedVehicleId]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (bodyFilter !== "All") params.set("bodyType", bodyFilter);
    if (fuelFilter !== "All") params.set("fuelType", fuelFilter);

    fetch(`/api/vehicles?${params}`)
      .then((r) => r.json())
      .then((data: Vehicle[]) => {
        setVehicles(data);
        setSelectedVehicleId((current) =>
          current && data.some((vehicle) => vehicle.id === current)
            ? current
            : null,
        );
        setLoading(false);
      });
  }, [bodyFilter, fuelFilter]);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [selectedVehicleId, vehicles],
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="max-w-7xl p-6 md:p-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-extrabold uppercase text-[#5d6dff]">
            Pick the ride
          </p>
          <h1
            className="mt-2 text-5xl font-extrabold leading-none text-[#27214f]"
            style={displayFont}
          >
            Add the first piece to your Prep Pass.
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-[#5f557e]">
            Choose a car to tuck into your packet. Your coach will keep the
            next steps small after that.
          </p>
        </div>

        <motion.aside
          className="rounded-lg bg-white p-5 shadow-[0_22px_60px_rgba(93,109,255,0.12)]"
          animate={
            selectedVehicle && !shouldReduceMotion
              ? {
                  boxShadow: [
                    "0 22px 60px rgba(93,109,255,0.12)",
                    "0 24px 70px rgba(123,85,255,0.2)",
                    "0 22px 60px rgba(93,109,255,0.12)",
                  ],
                }
              : undefined
          }
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase text-[#5d6dff]">
                Prep Pass
              </p>
              <h2
                className="mt-1 text-3xl font-extrabold leading-none text-[#27214f]"
                style={displayFont}
              >
                Ride slot
              </h2>
            </div>
            <span className="rounded-md bg-[#eef8ff] px-3 py-2 text-sm font-extrabold text-[#5d6dff]">
              {selectedVehicle ? "1/4 filled" : "0/4 filled"}
            </span>
          </div>

          <div className="mt-5 rounded-lg bg-[#f8fbff] p-4">
            {selectedVehicle ? (
              <div>
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#d7f8df] text-[#236540]">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-[#27214f]">
                      {selectedVehicle.year} {selectedVehicle.make}{" "}
                      {selectedVehicle.model}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#5f557e]">
                      {fmt(selectedVehicle.salePrice || selectedVehicle.msrp)} at{" "}
                      {selectedVehicle.dealership.name}
                    </p>
                  </div>
                </div>
                <CoachNote tone="mint" title="Coach says">
                  Nice, this ride is in your packet. Next we can make the
                  monthly and visit feel less mysterious.
                </CoachNote>
                <Link
                  href={`/vehicles/${selectedVehicle.id}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#5d6dff] px-4 py-3 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(93,109,255,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  Build around this ride
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#f1e9ff] text-[#5d4b91]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-extrabold text-[#27214f]">
                    Waiting for a ride
                  </p>
                  <p className="mt-1 text-sm font-bold leading-6 text-[#5f557e]">
                    Tap Add to pass on any car and this packet slot will fill
                    with a soft pulse.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      </div>

      <div className="mt-8 rounded-lg bg-white p-4 shadow-[0_14px_34px_rgba(93,109,255,0.08)]">
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase text-[#6f6695]">
              Body type
            </p>
            <div className="flex flex-wrap gap-2">
              {bodyTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setBodyFilter(type)}
                  className={`rounded-md px-4 py-2 text-sm font-extrabold transition-all ${
                    bodyFilter === type
                      ? "bg-[#5d6dff] text-white shadow-[0_10px_24px_rgba(93,109,255,0.2)]"
                      : "bg-[#f8fbff] text-[#5f557e] hover:bg-[#eef8ff]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase text-[#6f6695]">
              Fuel type
            </p>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFuelFilter(type)}
                  className={`rounded-md px-4 py-2 text-sm font-extrabold transition-all ${
                    fuelFilter === type
                      ? "bg-[#5d6dff] text-white shadow-[0_10px_24px_rgba(93,109,255,0.2)]"
                      : "bg-[#f8fbff] text-[#5f557e] hover:bg-[#eef8ff]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-md bg-[#eef8ff] px-3 py-2 text-sm font-extrabold text-[#5d6dff]">
            <Search className="h-4 w-4" />
            {vehicles.length} available
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-[#edf0f7] bg-white p-5"
            >
              <div className="mb-4 h-32 rounded-md bg-[#eef8ff]" />
              <div className="mb-2 h-4 w-2/3 rounded bg-[#edf0f7]" />
              <div className="h-4 w-1/2 rounded bg-[#edf0f7]" />
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-[#cfd9ff] bg-white p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-[#eef8ff] text-[#5d6dff]">
            <Search className="h-7 w-7" />
          </span>
          <p className="mt-4 font-extrabold text-[#27214f]">
            No rides match those filters yet.
          </p>
          <p className="mt-1 text-sm font-bold text-[#6f6695]">
            Loosen one filter and your packet can keep moving.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const selected = selectedVehicleId === v.id;

            return (
              <motion.article
                key={v.id}
                className={`overflow-hidden rounded-lg border bg-white shadow-[0_12px_30px_rgba(93,109,255,0.08)] transition-all ${
                  selected
                    ? "border-[#5d6dff]"
                    : "border-[#edf0f7] hover:border-[#cfd9ff]"
                }`}
                animate={
                  selected && !shouldReduceMotion
                    ? { y: [0, -3, 0], scale: [1, 1.01, 1] }
                    : undefined
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <VehicleGlyph bodyType={v.bodyType} fuelType={v.fuelType} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#27214f]">
                        {v.year} {v.make} {v.model}
                      </h3>
                      <p className="text-sm font-bold text-[#6f6695]">
                        {v.trim || "Ready for a closer look"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-[#5d6dff]">
                        {fmt(v.salePrice || v.msrp)}
                      </p>
                      {v.salePrice && v.salePrice < v.msrp && (
                        <p className="text-xs font-bold text-[#9a95b4] line-through">
                          {fmt(v.msrp)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-extrabold">
                    <span className="flex items-center gap-1 rounded-md bg-[#eef8ff] px-2.5 py-2 text-[#596282]">
                      <Gauge className="h-3.5 w-3.5" />
                      {v.mileage.toLocaleString()} mi
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-[#f1e9ff] px-2.5 py-2 text-[#5d4b91]">
                      <Fuel className="h-3.5 w-3.5" />
                      {v.fuelType || "Fuel"}
                    </span>
                  </div>

                  <p className="mt-4 flex items-center gap-1 text-xs font-bold text-[#6f6695]">
                    <MapPin className="h-3.5 w-3.5" />
                    {v.dealership.name} in {v.dealership.city},{" "}
                    {v.dealership.state}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`rounded-md px-3 py-2.5 text-sm font-extrabold transition-transform hover:-translate-y-0.5 ${
                        selected
                          ? "bg-[#d7f8df] text-[#236540]"
                          : "bg-[#5d6dff] text-white shadow-[0_12px_26px_rgba(93,109,255,0.2)]"
                      }`}
                    >
                      {selected ? "In pass" : "Add to pass"}
                    </button>
                    <Link
                      href={`/vehicles/${v.id}`}
                      className="rounded-md bg-[#f8fbff] px-3 py-2.5 text-center text-sm font-extrabold text-[#5d6dff] transition-transform hover:-translate-y-0.5 hover:bg-[#eef8ff]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
