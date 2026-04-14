"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [bodyFilter, setBodyFilter] = useState("All");
  const [fuelFilter, setFuelFilter] = useState("All");

  useEffect(() => {
    const params = new URLSearchParams();
    if (bodyFilter !== "All") params.set("bodyType", bodyFilter);
    if (fuelFilter !== "All") params.set("fuelType", fuelFilter);

    fetch(`/api/vehicles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      });
  }, [bodyFilter, fuelFilter]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-4">
        <img src="/illustrations/car1.png" alt="Browse vehicles" width={64} height={48} className="shrink-0 hidden sm:block" />
        <div>
          <h1 className="text-2xl font-bold text-teal-800">Browse Vehicles</h1>
          <p className="text-gray-500 mt-1">
            Find your perfect ride — {vehicles.length} vehicles available
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mt-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Body Type
          </p>
          <div className="flex gap-2">
            {bodyTypes.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setBodyFilter(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  bodyFilter === type
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Fuel Type
          </p>
          <div className="flex gap-2">
            {fuelTypes.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setFuelFilter(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  fuelFilter === type
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100"
            >
              <div className="h-32 bg-gray-100 rounded-xl mb-4" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-4xl mb-4">🧐</p>
          <p className="text-gray-400 font-medium">
            No vehicles match your filters
          </p>
          <p className="text-gray-300 text-sm mt-1">Try adjusting your filters above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {vehicles.map((v) => (
            <Link key={v.id} href={`/vehicles/${v.id}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50 hover:border-orange-200/50 hover:-translate-y-0.5">
                {/* Color swatch as visual placeholder */}
                <div className="h-36 bg-gray-50 flex items-center justify-center">
                  <span className="text-5xl">
                    {v.fuelType === "Electric"
                      ? "⚡"
                      : v.bodyType === "SUV"
                      ? "🛻"
                      : "🏎️"}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {v.year} {v.make} {v.model}
                      </h3>
                      <p className="text-sm text-gray-400">{v.trim}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        {fmt(v.salePrice || v.msrp)}
                      </p>
                      {v.salePrice && v.salePrice < v.msrp && (
                        <p className="text-xs text-gray-400 line-through">
                          {fmt(v.msrp)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {v.bodyType && (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 font-medium">
                        {v.bodyType}
                      </span>
                    )}
                    {v.fuelType && (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                        {v.fuelType}
                      </span>
                    )}
                    {v.exteriorColor && (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 font-medium">
                        {v.exteriorColor}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {v.dealership.name} · {v.dealership.city},{" "}
                    {v.dealership.state}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
