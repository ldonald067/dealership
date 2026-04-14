"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { calculateLease, type LeaseResult } from "@/lib/lease";

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string;
  msrp: number;
  salePrice: number | null;
  residualPct: number | null;
  moneyFactor: number | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  mileage: number;
  bodyType: string | null;
  fuelType: string | null;
  dealership: {
    name: string;
    city: string;
    state: string;
    phone: string;
    address: string;
  };
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Lease calculator state
  const [downPayment, setDownPayment] = useState(2000);
  const [tradeIn, setTradeIn] = useState(0);
  const [term, setTerm] = useState(36);
  const [lease, setLease] = useState<LeaseResult | null>(null);

  useEffect(() => {
    fetch(`/api/vehicles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setVehicle(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!vehicle) return;
    const result = calculateLease({
      msrp: vehicle.msrp,
      salePrice: vehicle.salePrice || vehicle.msrp,
      residualPct: vehicle.residualPct || 0.5,
      moneyFactor: vehicle.moneyFactor || 0.00125,
      termMonths: term,
      downPayment,
      tradeInValue: tradeIn,
      taxRate: 0.08,
    });
    setLease(result);
  }, [vehicle, downPayment, tradeIn, term]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-6 md:p-10 text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-gray-500">Vehicle not found</p>
        <Link href="/vehicles" className="text-orange-600 hover:text-orange-700 mt-2 inline-block">
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <Link
        href="/vehicles"
        className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
      >
        ← Back to vehicles
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="h-48 bg-gray-50 flex items-center justify-center">
              <span className="text-7xl">
                {vehicle.fuelType === "Electric"
                  ? "⚡"
                  : vehicle.bodyType === "SUV"
                  ? "🚙"
                  : "🚗"}
              </span>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-teal-800">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-gray-500">{vehicle.trim}</p>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-bold text-orange-600">
                  {fmt(vehicle.salePrice || vehicle.msrp)}
                </span>
                {vehicle.salePrice && vehicle.salePrice < vehicle.msrp && (
                  <span className="text-lg text-gray-400 line-through">
                    {fmt(vehicle.msrp)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Body Type</p>
                <p className="font-medium text-gray-700">{vehicle.bodyType}</p>
              </div>
              <div>
                <p className="text-gray-400">Fuel Type</p>
                <p className="font-medium text-gray-700">{vehicle.fuelType}</p>
              </div>
              <div>
                <p className="text-gray-400">Exterior</p>
                <p className="font-medium text-gray-700">{vehicle.exteriorColor}</p>
              </div>
              <div>
                <p className="text-gray-400">Interior</p>
                <p className="font-medium text-gray-700">{vehicle.interiorColor}</p>
              </div>
              <div>
                <p className="text-gray-400">Mileage</p>
                <p className="font-medium text-gray-700">{vehicle.mileage.toLocaleString()} mi</p>
              </div>
              <div>
                <p className="text-gray-400">VIN</p>
                <p className="font-medium text-gray-700 font-mono text-xs">{vehicle.vin}</p>
              </div>
            </div>
          </div>

          {/* Dealership */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3">Available at</h2>
            <p className="font-medium text-gray-700">{vehicle.dealership.name}</p>
            <p className="text-sm text-gray-500">
              {vehicle.dealership.address}, {vehicle.dealership.city},{" "}
              {vehicle.dealership.state}
            </p>
            <p className="text-sm text-gray-500 mt-1">{vehicle.dealership.phone}</p>
          </div>
        </div>

        {/* Lease Calculator sidebar */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="font-bold text-gray-800 mb-1">Lease Calculator</h2>
            <p className="text-xs text-gray-400 mb-5">
              Estimate your monthly payment
            </p>

            {lease && (
              <div className="bg-orange-500 rounded-xl p-5 text-white mb-6">
                <p className="text-sm opacity-80">Estimated monthly</p>
                <p className="text-4xl font-bold mt-1">
                  {fmt(lease.monthlyPayment)}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  /mo for {term} months · {lease.effectiveAPR}% APR
                </p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-gray-600 font-medium">
                    Down Payment
                  </label>
                  <span className="text-gray-800 font-semibold">
                    {fmt(downPayment)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15000}
                  step={500}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-gray-600 font-medium">
                    Trade-In Value
                  </label>
                  <span className="text-gray-800 font-semibold">
                    {fmt(tradeIn)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20000}
                  step={500}
                  value={tradeIn}
                  onChange={(e) => setTradeIn(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium block mb-2">
                  Lease Term
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[24, 36, 39, 48].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTerm(t)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        term === t
                          ? "bg-orange-500 text-white shadow-sm"
                          : "bg-gray-50 text-gray-600 hover:bg-orange-50"
                      }`}
                    >
                      {t}mo
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {lease && (
              <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Residual Value</span>
                  <span className="text-gray-700">{fmt(lease.residualValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Net Cap Cost</span>
                  <span className="text-gray-700">{fmt(lease.netCapCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Lease Cost</span>
                  <span className="text-gray-700 font-medium">{fmt(lease.totalCost)}</span>
                </div>
              </div>
            )}

            <Link
              href="/appointments"
              className="block w-full mt-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-center transition-all shadow-lg shadow-orange-200/50"
            >
              Book a test drive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
