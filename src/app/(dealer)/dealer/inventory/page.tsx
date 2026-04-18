"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  msrp: number;
  salePrice: number | null;
  status: string;
  bodyType: string | null;
  fuelType: string | null;
  exteriorColor: string | null;
}

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      });
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Inventory</h1>
          <p className="text-gray-500 mt-1">
            {vehicles.length} vehicles in stock
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="mt-6 bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-4xl mb-4">🏎️</p>
          <p className="text-gray-400 font-medium">No vehicles in inventory yet</p>
          <p className="text-gray-300 text-sm mt-1">Vehicles will appear here once they&apos;re added to your dealership</p>
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-gray-500 font-medium">Vehicle</th>
                <th className="text-left p-4 text-gray-500 font-medium">Type</th>
                <th className="text-left p-4 text-gray-500 font-medium">Color</th>
                <th className="text-right p-4 text-gray-500 font-medium">MSRP</th>
                <th className="text-right p-4 text-gray-500 font-medium">Sale Price</th>
                <th className="text-center p-4 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-800">
                      {v.year} {v.make} {v.model}
                    </p>
                    <p className="text-xs text-gray-400">{v.trim}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      {v.bodyType && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-orange-50 text-orange-700">
                          {v.bodyType}
                        </span>
                      )}
                      {v.fuelType && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          {v.fuelType}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{v.exteriorColor}</td>
                  <td className="p-4 text-right text-gray-600">{fmt(v.msrp)}</td>
                  <td className="p-4 text-right font-medium text-gray-800">
                    {v.salePrice ? fmt(v.salePrice) : "—"}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        v.status === "AVAILABLE"
                          ? "bg-emerald-50 text-emerald-700"
                          : v.status === "RESERVED"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
