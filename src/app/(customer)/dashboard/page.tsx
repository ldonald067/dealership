import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */

const stepIllustrations: Record<string, { default: string; active: string }> = {
  "/vehicles": { default: "/illustrations/car1.png", active: "/illustrations/car2.png" },
  "/documents": { default: "/illustrations/folder1.png", active: "/illustrations/folder2.png" },
  "/credit": { default: "/illustrations/bank1.png", active: "/illustrations/bank2.png" },
  "/appointments": { default: "/illustrations/calendar1.png", active: "/illustrations/calendar2.png" },
};

export default async function CustomerDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Fetch real progress data
  const [docCount, approvedDocs, creditApp, appointment] = await Promise.all([
    prisma.document.count({ where: { userId } }),
    prisma.document.count({ where: { userId, status: "APPROVED" } }),
    prisma.creditApplication.findFirst({ where: { userId }, orderBy: { submittedAt: "desc" } }),
    prisma.appointment.findFirst({ where: { userId }, orderBy: { dateTime: "desc" } }),
  ]);

  // Determine which step is "next"
  type StepStatus = "done" | "active" | "locked";
  const steps: { href: string; title: string; description: string; status: StepStatus; color: string }[] = [
    {
      href: "/vehicles",
      title: "Browse Vehicles",
      description: "Find your perfect ride and calculate your lease payment",
      status: "done", // Always accessible
      color: "bg-orange-500",
    },
    {
      href: "/documents",
      title: "Upload Documents",
      description: docCount > 0
        ? `${approvedDocs} of ${docCount} approved`
        : "Upload your license, insurance, and proof of income",
      status: docCount === 0 ? "active" : approvedDocs >= 2 ? "done" : "active",
      color: "bg-violet-500",
    },
    {
      href: "/credit",
      title: "Credit Application",
      description: creditApp
        ? creditApp.status === "APPROVED" ? "You're pre-approved!" : `Status: ${creditApp.status.replace("_", " ").toLowerCase()}`
        : "Get pre-approved — won't affect your credit score",
      status: creditApp?.status === "APPROVED" ? "done" : creditApp ? "active" : approvedDocs >= 2 ? "active" : "locked",
      color: "bg-teal-500",
    },
    {
      href: "/appointments",
      title: "Book Appointment",
      description: appointment
        ? `${appointment.status === "CONFIRMED" ? "Confirmed" : "Pending"} — ${new Date(appointment.dateTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
        : "Pick your time slot for test drive & signing",
      status: appointment ? "done" : creditApp?.status === "APPROVED" ? "active" : "locked",
      color: "bg-blue-500",
    },
  ];

  const nextStep = steps.find((s) => s.status === "active");
  const completedCount = steps.filter((s) => s.status === "done").length;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-3xl font-black text-teal-800">
        Hey, {session.user.name?.split(" ")[0]}!
      </h1>

      {completedCount === 4 ? (
        <div className="mt-4 bg-orange-500 rounded-2xl p-6 text-white">
          <p className="text-2xl font-black">You&apos;re all set! 🎉</p>
          <p className="text-orange-100 mt-1">
            Everything is ready. Just show up, test drive, sign, and drive away.
          </p>
        </div>
      ) : nextStep ? (
        <div className="mt-4">
          <p className="text-gray-500 text-lg">
            {completedCount === 0
              ? "Let's get you ready for a 30-minute dealership visit."
              : `${completedCount} of 4 steps done. Keep going!`}
          </p>
          <Link href={nextStep.href} className="group mt-4 block">
            <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Next step</p>
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={stepIllustrations[nextStep.href]?.active || stepIllustrations[nextStep.href]?.default || ""}
                  alt={nextStep.title}
                  width={56}
                  height={56}
                  className="shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">
                    {nextStep.title}
                  </h3>
                  <p className="text-sm text-gray-500">{nextStep.description}</p>
                </div>
                <span className="text-orange-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
              </div>
            </div>
          </Link>
        </div>
      ) : null}

      {/* Progress bar */}
      <div className="mt-8 flex gap-2">
        {steps.map((step, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${
            step.status === "done" ? "bg-orange-500" : step.status === "active" ? "bg-orange-200" : "bg-gray-200"
          }`} />
        ))}
      </div>

      {/* All steps */}
      <div className="mt-6 space-y-3">
        {steps.map((step) => {
          const illus = stepIllustrations[step.href];
          const card = (
            <div className={`flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border transition-all ${
              step.status === "active"
                ? "border-orange-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                : step.status === "done"
                ? "border-emerald-100"
                : "border-gray-100"
            }`}>
              <img
                src={step.status === "done" ? illus.active : illus.default}
                alt={step.title}
                width={48}
                height={48}
                className={`shrink-0 ${step.status === "locked" ? "opacity-40 grayscale" : ""}`}
              />
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm ${
                  step.status === "active" ? "text-gray-800" : step.status === "done" ? "text-emerald-700" : "text-gray-400"
                }`}>{step.title}</h3>
                <p className="text-xs text-gray-400 truncate">{step.description}</p>
              </div>
              {step.status === "active" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 font-medium shrink-0">Next</span>
              )}
              {step.status === "locked" && (
                <span className="text-gray-300 text-sm">🔒</span>
              )}
              {step.status === "done" && (
                <span className="text-emerald-500 text-sm">✅</span>
              )}
            </div>
          );

          if (step.status === "locked") {
            return (
              <div key={step.href} className="opacity-50 cursor-not-allowed">
                {card}
              </div>
            );
          }

          return (
            <Link key={step.href} href={step.href} className="group block">
              {card}
            </Link>
          );
        })}
      </div>

      {/* Upcoming appointment card */}
      {appointment && new Date(appointment.dateTime) > new Date() && (
        <div className="mt-8 bg-teal-800 rounded-2xl p-6 text-white">
          <p className="text-sm font-medium text-teal-200">Upcoming visit</p>
          <p className="text-xl font-bold mt-1">
            {new Date(appointment.dateTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="text-teal-200 mt-1">
            {new Date(appointment.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
          <p className="text-teal-300 text-sm mt-3">⏱️ Estimated visit: ~30 minutes</p>
        </div>
      )}
    </div>
  );
}
