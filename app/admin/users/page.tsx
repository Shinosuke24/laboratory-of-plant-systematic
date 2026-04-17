"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Leaf, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UserItem = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "ASISTEN" | "MAHASISWA";
  createdAt: string;
  updatedAt: string;
};

const ROLE_OPTIONS: Array<UserItem["role"]> = ["ADMIN", "ASISTEN", "MAHASISWA"];

const ROLE_LABELS: Record<UserItem["role"], string> = {
  ADMIN: "Admin",
  ASISTEN: "Assistant",
  MAHASISWA: "Student",
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftRoles, setDraftRoles] = useState<
    Record<string, UserItem["role"]>
  >({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (status === "authenticated") {
      void fetchUsers();
    }
  }, [status, session, router]);

  const adminCount = useMemo(
    () => users.filter((user) => user.role === "ADMIN").length,
    [users],
  );

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res?.error || "Failed to load users");
      }

      const data = (await response.json()) as UserItem[];
      setUsers(data);

      const initialDraft: Record<string, UserItem["role"]> = {};
      data.forEach((user) => {
        initialDraft[user.id] = user.role;
      });
      setDraftRoles(initialDraft);
    } catch (fetchError: any) {
      console.error(fetchError);
      setError(fetchError?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (userId: string) => {
    const role = draftRoles[userId];
    if (!role) return;

    setSavingId(userId);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res?.error || "Failed to update user role");
      }

      await fetchUsers();
    } catch (saveError: any) {
      console.error(saveError);
      setError(saveError?.message || "Failed to update user role");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-700" />
              <span className="text-base font-bold text-green-700 sm:text-xl">
                User Management
              </span>
            </Link>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <Button
                variant="outline"
                onClick={fetchUsers}
                className="w-full border-green-300 sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full bg-green-700 hover:bg-green-800 sm:w-auto">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <section className="bg-white border border-green-200 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            User Role Management
          </h1>
          <p className="text-gray-600 mt-2">
            Admins can change roles for users who sign in with email accounts.
          </p>
          <div className="mt-4 text-sm text-gray-700">
            <span className="font-semibold">Total users:</span> {users.length} |{" "}
            <span className="font-semibold">Total admins:</span> {adminCount}
          </div>
        </section>

        {error && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-600">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-600">
            No user data available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => {
              const selectedRole = draftRoles[user.id] || user.role;
              const isChanged = selectedRole !== user.role;
              const isSaving = savingId === user.id;

              return (
                <Card key={user.id} className="border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {user.name || "Unnamed User"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <p>
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                      <p>
                        <span className="font-medium">Current Role:</span>{" "}
                        {ROLE_LABELS[user.role]}
                      </p>
                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(user.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Updated:</span>{" "}
                        {new Date(user.updatedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <select
                        value={selectedRole}
                        onChange={(event) => {
                          const nextRole = event.target
                            .value as UserItem["role"];
                          setDraftRoles((prev) => ({
                            ...prev,
                            [user.id]: nextRole,
                          }));
                        }}
                        className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
                        disabled={isSaving}
                      >
                        {ROLE_OPTIONS.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {ROLE_LABELS[roleOption]}
                          </option>
                        ))}
                      </select>

                      <Button
                        className="bg-green-700 hover:bg-green-800"
                        onClick={() => handleSaveRole(user.id)}
                        disabled={!isChanged || isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Role"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
