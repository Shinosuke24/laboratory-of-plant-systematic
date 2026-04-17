import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Leaf,
  BookOpen,
  Microscope,
  Clock,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "laboratory of plant systematic",
  description: "Plant identification and botanical lab service portal",
};

export default function HomePage() {
  const session = null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef7f0] via-white to-[#f3faf3]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-green-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-2 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
              <span className="hidden text-lg font-bold text-green-700 sm:inline md:text-xl">
                laboratory of plant systematic
              </span>
              <span className="text-sm font-bold text-green-700 sm:hidden">
                plant lab
              </span>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/about"
                className="text-sm text-gray-600 transition hover:text-green-700"
              >
                About
              </Link>
              <Link
                href="/people"
                className="text-sm text-gray-600 transition hover:text-green-700"
              >
                Team
              </Link>
              <Link
                href="/read-watch"
                className="text-sm text-gray-600 transition hover:text-green-700"
              >
                Read and Watch
              </Link>
              <Link
                href="#student-portal-menu"
                className="text-sm text-gray-600 transition hover:text-green-700"
              >
                Student Portal
              </Link>
              {session ? (
                <Link href="/dashboard">
                  <Button size="sm" className="bg-green-700 hover:bg-green-800">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signin">
                  <Button size="sm" className="bg-green-700 hover:bg-green-800">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex w-full gap-2 md:hidden">
              <Link href="#student-portal-menu" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Portal
                </Button>
              </Link>
              {session ? (
                <Link href="/dashboard" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-green-700 hover:bg-green-800"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signin" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-green-700 hover:bg-green-800"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14">
        <div className="group relative overflow-hidden rounded-3xl border border-green-900/65 bg-black text-center shadow-[0_28px_90px_-40px_rgba(20,83,45,0.72)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_44px_135px_-46px_rgba(20,83,45,0.88)]">
          <div
            className="absolute inset-0 scale-[1.02] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.08]"
            style={{
              backgroundImage:
                "url('https://biologi.ugm.ac.id/wp-content/uploads/sites/11/2018/10/IMG_0481-680x510.jpg')",
            }}
          />
          <div className="absolute inset-y-0 left-0 w-[72%] sm:w-[46%] bg-gradient-to-r from-green-950/64 via-green-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute inset-y-0 right-0 w-[72%] sm:w-[46%] bg-gradient-to-l from-green-950/58 via-green-900/34 to-transparent transition-opacity duration-500 group-hover:opacity-85" />
          <div className="absolute inset-y-0 left-0 w-[66%] sm:w-[42%] bg-[radial-gradient(circle_at_18%_22%,rgba(22,101,52,0.26),transparent_62%)] transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute inset-y-0 right-0 w-[66%] sm:w-[42%] bg-[radial-gradient(circle_at_82%_74%,rgba(21,128,61,0.22),transparent_60%)] transition-opacity duration-500 group-hover:opacity-85" />
          <div className="absolute inset-y-0 left-0 w-[58%] sm:w-[36%] mix-blend-screen bg-[radial-gradient(circle_at_24%_78%,rgba(20,83,45,0.24),transparent_62%)] transition-opacity duration-500 group-hover:opacity-95" />
          <div className="absolute inset-y-0 right-0 w-[58%] sm:w-[36%] mix-blend-screen bg-[radial-gradient(circle_at_74%_26%,rgba(22,101,52,0.2),transparent_60%)] transition-opacity duration-500 group-hover:opacity-95" />
          <div className="pointer-events-none absolute -left-18 top-6 h-56 w-56 rounded-full bg-green-900/32 blur-3xl transition-all duration-700 group-hover:bg-green-900/40 animate-float-slow" />
          <div className="pointer-events-none absolute -right-24 bottom-2 h-64 w-64 rounded-full bg-green-800/32 blur-3xl transition-all duration-700 group-hover:bg-green-800/40 animate-float-medium" />

          <div className="relative z-10 mx-auto max-w-4xl space-y-6 px-4 py-14 sm:px-8 sm:py-20 lg:py-24">
            <div className="animate-fade-up inline-block rounded-full border border-green-200/30 bg-green-950/35 px-3 py-2 text-sm font-medium text-green-100 backdrop-blur-sm">
              Botanical Laboratory Services
            </div>
            <h1 className="animate-fade-up-delayed text-3xl font-bold leading-tight text-white [text-shadow:0_6px_30px_rgba(20,83,45,0.62)] sm:text-4xl lg:text-6xl">
              laboratory of{" "}
              <span className="text-green-300">plant systematic</span>
            </h1>
            <p className="animate-fade-up-more mx-auto max-w-2xl text-base text-green-100/92 [text-shadow:0_2px_14px_rgba(0,0,0,0.45)] sm:text-lg">
              Manage plant identification, equipment borrowing, research
              tracking, and overtime records in one integrated environment.
            </p>
            {!session && (
              <div className="animate-fade-up-more flex flex-col gap-2 pt-4 sm:flex-row sm:justify-center sm:gap-4">
                <Link
                  href="#student-portal-menu"
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    size="lg"
                    className="w-full bg-green-800 text-green-50 shadow-lg shadow-green-950/45 hover:bg-green-700 sm:w-auto"
                  >
                    Enter Portal
                  </Button>
                </Link>
                <Link href="/about" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-green-100/80 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Student Portal Showcase */}
      <section
        id="student-portal"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-100 via-white to-emerald-100 p-4 shadow-xl shadow-green-100/70 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-white/80 px-4 py-2 text-sm font-semibold text-green-800">
                <ShieldCheck className="w-4 h-4" />
                Platform Overview
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                A cleaner workflow for day-to-day laboratory services
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This landing section highlights how students can submit
                requests, upload supporting files, and follow approval progress
                without switching between multiple systems.
              </p>

              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <div className="rounded-xl bg-white border border-green-200 p-4">
                  <p className="text-sm text-gray-500">Active Services</p>
                  <p className="text-2xl font-bold text-green-700">4</p>
                </div>
                <div className="rounded-xl bg-white border border-green-200 p-4">
                  <p className="text-sm text-gray-500">Status Tracking</p>
                  <p className="text-2xl font-bold text-green-700">Live</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="#student-portal-menu">
                  <Button className="bg-green-700 hover:bg-green-800">
                    Open Student Portal Menu
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-green-700 text-green-700 hover:bg-green-50"
                  >
                    Open Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Microscope className="w-5 h-5" />,
                  title: "Plant Identification",
                  detail:
                    "Structured specimen submission and scientific review",
                },
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: "Research Tracking",
                  detail: "Project visibility from proposal to final stage",
                },
                {
                  icon: <Leaf className="w-5 h-5" />,
                  title: "Equipment Borrowing",
                  detail: "Borrowing requests with clear usage scheduling",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  title: "Overtime Logging",
                  detail: "Work-hour records with approval history",
                },
              ].map((service, index) => (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-green-200 bg-white/85 p-4 sm:p-5 hover:-translate-y-0.5 hover:border-green-400 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-green-100 p-2 text-green-700 group-hover:bg-green-700 group-hover:text-white transition">
                      {service.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {index + 1}. {service.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-green-200 p-5">
              <FlaskConical className="w-5 h-5 text-green-700 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Academic Validation
              </h3>
              <p className="text-sm text-gray-600">
                Every request is recorded in a format aligned with laboratory
                administration standards.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-green-200 p-5">
              <FileText className="w-5 h-5 text-green-700 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Integrated Documents
              </h3>
              <p className="text-sm text-gray-600">
                Letters and supporting files are handled in one consistent
                document flow.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-green-200 p-5">
              <ShieldCheck className="w-5 h-5 text-green-700 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Clear Approval Path
              </h3>
              <p className="text-sm text-gray-600">
                Students can monitor service status without repetitive manual
                follow-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Portal Menu */}
      <section
        id="student-portal-menu"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16"
      >
        <div className="rounded-3xl border border-green-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Student Portal Menu
            </h2>
            <p className="text-sm text-gray-600">
              Select a service to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Microscope className="w-6 h-6" />,
                title: "Plant Identification",
                href: "/portal/identifikasi",
                description:
                  "Submit and track specimen identification requests.",
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Research Tracking",
                href: "/portal/penelitian",
                description: "Manage research requests and progress updates.",
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: "Equipment Borrowing",
                href: "/portal/peminjaman",
                description: "Request and monitor laboratory equipment usage.",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Overtime Logging",
                href: "/portal/kerja-lembur",
                description: "Record overtime hours and approval status.",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="h-full rounded-2xl border border-green-200 bg-gradient-to-br from-white to-green-50 p-5 hover:-translate-y-0.5 hover:border-green-400 hover:shadow-md transition">
                  <div className="text-green-700 mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="mx-4 mb-16 rounded-2xl border border-green-900/50 bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-4 py-12 shadow-[0_26px_70px_-35px_rgba(20,83,45,0.9)] sm:mx-auto sm:max-w-7xl sm:px-6 sm:py-16 lg:px-8">
          <div className="space-y-6 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Ready to Start?
            </h2>
            <p className="mx-auto max-w-2xl text-base opacity-90 sm:text-lg">
              Sign in to continue your laboratory workflow in one place.
            </p>
            <Link href="/signin">
              <Button
                size="lg"
                className="bg-green-100 text-green-950 hover:bg-white"
              >
                Sign In with Google
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-green-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700" />
              <span className="text-sm font-bold text-gray-900 sm:text-base">
                laboratory of plant systematic
              </span>
            </div>
            <div className="text-center text-xs text-gray-600 sm:text-right sm:text-sm">
              {new Date().getFullYear()} laboratory of plant systematic. All
              rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
