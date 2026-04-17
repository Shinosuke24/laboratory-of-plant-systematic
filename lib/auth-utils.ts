import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function getCurrentUserWithRole() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  return {
    ...session.user,
    role: session.user.role || "MAHASISWA",
    id: session.user.id,
  };
}

export async function isAdmin() {
  const user = await getCurrentUserWithRole();
  return user?.role === "ADMIN";
}

export async function isAsisten() {
  const user = await getCurrentUserWithRole();
  return user?.role === "ASISTEN" || user?.role === "ADMIN";
}

export async function isMahasiswa() {
  const user = await getCurrentUserWithRole();
  return (
    user?.role === "MAHASISWA" ||
    user?.role === "ASISTEN" ||
    user?.role === "ADMIN"
  );
}
