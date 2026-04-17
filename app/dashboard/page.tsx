"use client";

import {
  Leaf,
  Microscope,
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  Library,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SubmissionItem = {
  status?: string;
};

type SubmissionSummary = {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
};

type MenuItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  ASISTEN: "Assistant",
  MAHASISWA: "Student",
  PENGGUNA: "User",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [summary, setSummary] = useState<SubmissionSummary>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Protect page access
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const loadSummary = async () => {
      if (status !== "authenticated" || session?.user?.role !== "MAHASISWA") {
        return;
      }

      setSummaryLoading(true);
      try {
        const endpoints = [
          "/api/identifikasi",
          "/api/penelitian",
          "/api/peminjaman",
          "/api/kerja-lembur",
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) => fetch(endpoint, { cache: "no-store" })),
        );

        const payloads = await Promise.all(
          responses.map(async (res) => {
            if (!res.ok) return [] as SubmissionItem[];
            return (await res.json()) as SubmissionItem[];
          }),
        );

        const allItems = payloads.flat();

        let pending = 0;
        let approved = 0;
        let rejected = 0;

        allItems.forEach((item) => {
          const itemStatus = (item.status || "").toUpperCase();
          if (itemStatus === "PENDING") {
            pending += 1;
            return;
          }
          if (itemStatus === "REJECTED") {
            rejected += 1;
            return;
          }
          if (itemStatus) {
            approved += 1;
          }
        });

        setSummary({
          pending,
          approved,
          rejected,
          total: allItems.length,
        });
      } catch (error) {
        console.error("Failed to load submission summary", error);
      } finally {
        setSummaryLoading(false);
      }
    };

    void loadSummary();
  }, [status, session?.user?.role]);

  const user = session?.user;

  const menuItems: MenuItem[] = [
    {
      title: "Plant Identification",
      description: "Submit and track plant identification requests",
      href: "/portal/identifikasi",
      icon: Microscope,
    },
    {
      title: "Research Projects",
      description: "Manage ongoing research project requests",
      href: "/portal/penelitian",
      icon: BookOpen,
    },
    {
      title: "Equipment Borrowing",
      description: "Request and manage laboratory equipment borrowing",
      href: "/portal/peminjaman",
      icon: Leaf,
    },
    {
      title: "Overtime Records",
      description: "Log and submit overtime work hours",
      href: "/portal/kerja-lembur",
      icon: Clock,
    },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      title: "Manage Users",
      description: "View and update user accounts and roles",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Approvals",
      description: "Review and decide student submissions",
      href: "/admin/approvals",
      icon: CheckCircle,
    },
  ];

  const sistenMenuItems: MenuItem[] = [
    {
      title: "Read and Watch",
      description: "Manage learning materials",
      href: "/asisten/read-watch",
      icon: Library,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-green-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col items-center justify-between gap-2 py-2 sm:h-16 sm:flex-row sm:py-0">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
              <span className="hidden text-lg font-bold text-green-700 sm:inline">
                laboratory of plant systematic
              </span>
              <span className="text-sm font-bold text-green-700 sm:hidden">
                lab of plant systematic
              </span>
            </Link>

            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <span className="hidden text-sm text-gray-600 sm:inline">
                {user?.name || "User"}
              </span>

              <Button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                variant="outline"
                size="sm"
                className="border-green-700 text-green-700 hover:bg-green-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* WELCOME */}
          <div className="rounded-lg bg-gradient-to-r from-green-700 to-green-600 p-6 text-white sm:p-8">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-sm opacity-90 sm:text-base">
              You are signed in as{" "}
              <span className="font-semibold">
                {ROLE_LABELS[user?.role || "PENGGUNA"] || "User"}
              </span>
            </p>
          </div>

          {user?.role === "MAHASISWA" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
                Your Submission Status
              </h2>
              {summaryLoading ? (
                <div className="rounded-lg border border-green-200 bg-white p-6 text-gray-600">
                  Loading submission status...
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white border border-yellow-200 rounded-lg p-5">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-700 mt-1">
                      {summary.pending}
                    </p>
                  </div>
                  <div className="bg-white border border-green-200 rounded-lg p-5">
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-3xl font-bold text-green-700 mt-1">
                      {summary.approved}
                    </p>
                  </div>
                  <div className="bg-white border border-red-200 rounded-lg p-5">
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-3xl font-bold text-red-700 mt-1">
                      {summary.rejected}
                    </p>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-lg p-5">
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-3xl font-bold text-blue-700 mt-1">
                      {summary.total}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GENERAL MENU */}
          {user?.role === "MAHASISWA" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
                My Services
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="bg-white border border-green-200 rounded-lg p-6 hover:border-green-400 hover:shadow-lg transition cursor-pointer h-full">
                      <div className="text-green-700 mb-4">
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ASSISTANT */}
          {user?.role === "ASISTEN" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
                Assistant Services
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sistenMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="bg-white border border-green-200 rounded-lg p-6 hover:border-green-400 hover:shadow-lg transition cursor-pointer">
                      <div className="text-green-700 mb-4">
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ADMIN */}
          {user?.role === "ADMIN" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
                Administration
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {adminMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="bg-white border border-green-200 rounded-lg p-6 hover:border-green-400 hover:shadow-lg transition cursor-pointer">
                      <div className="text-green-700 mb-4">
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-1 gap-4 border-t border-green-200 pt-8 sm:grid-cols-3">
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Account Status</div>
              <div className="text-2xl font-bold text-green-700">Active</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">User Type</div>
              <div className="text-2xl font-bold text-green-700">
                {ROLE_LABELS[user?.role || "PENGGUNA"] || "User"}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Member Since</div>
              <div className="text-2xl font-bold text-green-700">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
