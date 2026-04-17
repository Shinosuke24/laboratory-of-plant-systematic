import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  GraduationCap,
  Target,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About - Laboratory of Plant Systematic",
  description: "Learn about our plant research laboratory and mission",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-green-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
              <span className="hidden text-lg font-bold text-green-700 sm:inline">
                laboratory of plant systematic
              </span>
              <span className="text-sm font-bold text-green-700 sm:hidden">
                lab of plant systematic
              </span>
            </Link>
            <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-6">
              <Link
                href="/"
                className="inline-flex items-center h-10 px-3 text-base font-medium text-gray-600 transition hover:text-green-700"
              >
                Home
              </Link>
              <Link href="/signin" className="ml-auto sm:ml-0">
                <Button size="sm" className="bg-green-700 hover:bg-green-800">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="border-b border-green-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <Leaf className="h-16 w-16 text-green-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Laboratory of Plant Systematic
            </h1>
            <p className="text-lg text-gray-600">
              Faculty of Biology, Universitas Gadjah Mada
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-12">
          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              About Our Laboratory
            </h2>
            <p className="text-base text-gray-700 leading-relaxed sm:text-lg">
              Located within the Faculty of Biology at Universitas Gadjah Mada,
              the Laboratory of Plant Systematic is a leading research facility
              dedicated to advancing botanical sciences and systematic plant
              taxonomy. Our laboratory serves as a hub for research, education,
              and collaboration in plant science.
            </p>
          </section>

          {/* Mission & Vision */}
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-green-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-green-700" />
                <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                To advance the understanding of plant diversity and systematic
                relationships through rigorous research, education, and
                collaboration in botanical taxonomy and plant science.
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-green-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-green-700" />
                <h3 className="text-lg font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                To be a recognized center of excellence in plant systematic
                research and education, contributing to conservation and
                sustainable use of Indonesia's botanical heritage.
              </p>
            </div>
          </div>

          {/* Key Areas */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Our Focus Areas
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Plant Taxonomy",
                  desc: "Classification and identification of plant species",
                  icon: BookOpen,
                },
                {
                  title: "Research & Analysis",
                  desc: "Systematic studies of plant relationships",
                  icon: FlaskConical,
                },
                {
                  title: "Conservation",
                  desc: "Preservation of botanical diversity",
                  icon: ShieldCheck,
                },
                {
                  title: "Education",
                  desc: "Training the next generation of botanists",
                  icon: GraduationCap,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-lg border border-green-100 bg-green-50 p-4"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 text-green-700" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Location Map */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Location</h2>
            <div className="overflow-hidden rounded-lg border border-green-200 shadow-md">
              <iframe
                title="Faculty of Biology UGM Map"
                src="https://www.google.com/maps?q=Fakultas%20Biologi%20UGM&output=embed"
                className="h-64 w-full sm:h-80 lg:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-6 rounded-lg border border-green-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 flex-shrink-0 text-green-700" />
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Laboratory of Plant Systematic
                    <br />
                    Faculty of Biology
                    <br />
                    Universitas Gadjah Mada
                    <br />
                    Jl. Teknika Sel., Sendowo, Sinduadi
                    <br />
                    Kec. Mlati, Kabupaten Sleman
                    <br />
                    Daerah Istimewa Yogyakarta 55281
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="h-6 w-6 flex-shrink-0 text-green-700" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-sm text-gray-700">+62 (274) 580839</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="h-6 w-6 flex-shrink-0 text-green-700" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-700">biologi-ugm@ugm.ac.id</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-green-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700" />
              <span className="text-sm font-bold text-gray-900 sm:text-base">
                laboratory of plant systematic
              </span>
            </div>
            <div className="text-xs text-gray-600 sm:text-sm">
              {new Date().getFullYear()} laboratory of plant systematic. All
              rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
