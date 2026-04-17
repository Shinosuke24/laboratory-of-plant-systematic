import Link from "next/link";
import {
  Leaf,
  Users,
  GraduationCap,
  FlaskConical,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Team - Laboratory of Plant Systematic",
  description: "Meet the laboratory team, assistants, and student researchers.",
};

const teamMembers = [
  {
    name: "Prof. Rina Sri Kasiamdari, S.Si., Ph.D.",
    focus: "Biologi Fungi",
    email: "rkasiamdari@ugm.ac.id",
    photo:
      "https://biologi.ugm.ac.id/wp-content/uploads/sites/11/2025/11/Prof.-Rina-Sri-Kasiamdari-S.Si_.-Ph.D-1463x2048.jpg",
    scholarUrl:
      "https://scholar.google.co.id/citations?user=akqIOYYAAAAJ&hl=id&oi=ao",
    researchGateUrl: "https://www.researchgate.net/profile/Rina_Kasiamdari",
    profileUrl: "https://acadstaff.ugm.ac.id/rina",
  },
  {
    name: "Drs. Heri Sujadmiko, M.Si.",
    focus: "Sistematika Tumbuhan Lumut",
    email: "herisujadmiko@ugm.ac.id",
    photo:
      "https://biologi.ugm.ac.id/wp-content/uploads/sites/11/2018/07/4450Heri-Sujadmiko-768x911.jpg",
    scholarUrl:
      "https://scholar.google.co.id/citations?user=xZV7_LkAAAAJ&hl=id&oi=ao",
    researchGateUrl: "https://www.researchgate.net/profile/Heri-Sujadmiko",
    profileUrl: "https://acadstaff.ugm.ac.id/herisujadmiko",
  },
  {
    name: "Prof. Dr. Dra. Ratna Susandarini, M.Sc.",
    focus: "Sistematika Angiospermae dan Etnobotani",
    email: "ratna-susandarini@ugm.ac.id",
    photo:
      "https://biologi.ugm.ac.id/wp-content/uploads/sites/11/2025/11/Prof.-Dr.-Ratna-Susandarini-M.Sc_-1463x2048.jpg",
    scholarUrl:
      "https://scholar.google.co.id/citations?user=Z7sEZK4AAAAJ&hl=id",
    researchGateUrl: "https://www.researchgate.net/profile/Ratna-Susandarini",
    profileUrl: "https://acadstaff.ugm.ac.id/susandarini",
  },
  {
    name: "Ludmilla Fitri Untari, S.Si., M.Si.",
    focus: "Sistematika Lichen",
    email: "ludmilla.untari@ugm.ac.id",
    photo:
      "https://biologi.ugm.ac.id/wp-content/uploads/sites/11/2025/11/Ludmilla-Fitri-Untari-S.Si_.-M.Si_-1463x2048.jpg",
    scholarUrl:
      "https://scholar.google.co.id/citations?user=0eGwHRsAAAAJ&hl=id&oi=ao",
    researchGateUrl: "https://www.researchgate.net/profile/Ludmilla-Untari",
    profileUrl: "https://acadstaff.ugm.ac.id/ludmillauntari",
  },
  {
    name: "Abdul Razaq Chasani, S.Si., M.Si., Ph.D.",
    focus: "Sistematika Tumbuhan Pesisir dan Laut",
    email: "ar.chasani@ugm.ac.id",
    photo:
      "https://biologi.ugm.ac.id/wp-content/uploads/sites/11/2025/11/Abdul-Razaq-Chasani-S.Si_.-M.Si_.-Ph.D-1463x2048.jpg",
    scholarUrl:
      "https://scholar.google.co.id/citations?user=dxRdss4AAAAJ&hl=id&oi=ao",
    researchGateUrl: "https://www.researchgate.net/profile/Abdul-Chasani",
    profileUrl: "https://acadstaff.ugm.ac.id/arazaqchasani",
  },
  {
    name: "Annas Rabbani, S.Si., M.Sc.",
    focus: "Sistematika Tumbuhan Vaskuler",
    email: "annasrabbani@ugm.ac.id",
    photo:
      "https://biologi.ugm.ac.id/wp-content/uploads/sites/11/2019/08/Annas-Rabbani-S.Si_.-M.Sc_.-2-768x1024.jpg",
    scholarUrl: "https://scholar.google.com/citations?hl=en&user=excmegUAAAAJ",
    researchGateUrl: "https://www.researchgate.net/profile/Annas_Rabbani",
    profileUrl: "https://acadstaff.ugm.ac.id/faculty/fakultas-biologi",
  },
];

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-700" />
              <span className="max-w-[72vw] truncate text-base font-bold text-green-700 sm:max-w-none sm:text-xl">
                laboratory of plant systematic
              </span>
            </Link>
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap sm:gap-4">
              <Link
                href="/about"
                className="text-gray-600 hover:text-green-700 transition"
              >
                About
              </Link>
              <Link href="/people" className="text-green-700 font-medium">
                Team
              </Link>
              <Link
                href="/read-watch"
                className="text-gray-600 hover:text-green-700 transition"
              >
                Read and Watch
              </Link>
              <Link href="/signin" className="ml-auto sm:ml-0">
                <Button className="bg-green-700 hover:bg-green-800">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Team of laboratory of plant systematic
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the lecturers and researchers of laboratory of plant
            systematic.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="bg-white border border-green-200 rounded-xl p-6 hover:border-green-400 hover:shadow-lg transition"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="mx-auto h-48 w-36 flex-shrink-0 overflow-hidden rounded-lg border border-green-200 bg-white p-1 sm:mx-0 sm:h-52 sm:w-40">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full rounded-md object-cover object-top"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {member.profileUrl ? (
                      <a
                        href={member.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-gray-900 hover:text-green-700"
                      >
                        {member.name}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      member.name
                    )}
                  </h2>
                  <p className="mt-2 font-medium text-green-700">
                    {member.focus}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Email: {member.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={member.scholarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                    >
                      <img
                        src="https://scholar.google.com/favicon.ico"
                        alt="Google Scholar"
                        className="h-3.5 w-3.5"
                        loading="lazy"
                      />
                      Google Scholar
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={member.researchGateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                    >
                      <img
                        src="https://www.researchgate.net/favicon.ico"
                        alt="ResearchGate"
                        className="h-3.5 w-3.5"
                        loading="lazy"
                      />
                      ResearchGate
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-green-200 rounded-xl p-5">
            <GraduationCap className="w-6 h-6 text-green-700 mb-3" />
            <h3 className="font-semibold text-gray-900">Mentoring</h3>
            <p className="text-sm text-gray-600 mt-2">
              Faculty and assistants support research design, taxonomy
              workflows, and reporting standards.
            </p>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-5">
            <FlaskConical className="w-6 h-6 text-green-700 mb-3" />
            <h3 className="font-semibold text-gray-900">Laboratory Practice</h3>
            <p className="text-sm text-gray-600 mt-2">
              Students gain hands-on practice in specimen handling, curation,
              and microscope-based observation.
            </p>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-5">
            <BookOpen className="w-6 h-6 text-green-700 mb-3" />
            <h3 className="font-semibold text-gray-900">Publication Support</h3>
            <p className="text-sm text-gray-600 mt-2">
              The team supports data validation, manuscript preparation, and
              research reference management.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
