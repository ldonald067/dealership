import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-teal-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-black text-white">
              Drive<span className="text-orange-400">Ready</span>
            </h1>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-4xl font-black text-white leading-tight">
            Skip the wait.
            <br />
            Drive away happy.
          </p>
          <p className="text-teal-200 mt-4 text-lg leading-relaxed">
            Complete your paperwork online. Get pre-approved. Book your time. Your dealership visit? Just 30 minutes.
          </p>
          <div className="flex gap-8 mt-8">
            <div>
              <p className="text-3xl font-black text-white">30</p>
              <p className="text-teal-300 text-sm">min visits</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">4</p>
              <p className="text-teal-300 text-sm">easy steps</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">0</p>
              <p className="text-teal-300 text-sm">surprises</p>
            </div>
          </div>
        </div>

        <p className="text-teal-400 text-sm relative z-10">
          🔒 Bank-level encryption · 🙅 No credit score impact
        </p>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-700/50" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-teal-700/30" />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-amber-50 p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <h1 className="text-2xl font-black text-teal-800">
                Drive<span className="text-orange-500">Ready</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">Skip the wait</p>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
